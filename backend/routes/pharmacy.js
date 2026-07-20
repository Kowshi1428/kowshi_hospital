const express = require("express");
const router = express.Router();
const Pharmacy = require("../models/Pharmacy");
const Activity = require("../models/Activity");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to generate RX ID
const generateRxID = async () => {
  const count = await Pharmacy.countDocuments();
  const nextNum = 2200 + count + 1;
  return `RX-${nextNum}`;
};

// GET all pharmacy stock
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await Pharmacy.find().sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error retrieving inventory" });
  }
});

// POST add drug to inventory
router.post("/", authMiddleware, async (req, res) => {
  const { name, category, stock, reorderLevel, unit, expiry } = req.body;

  if (!name || !category || stock === undefined || reorderLevel === undefined || !unit || !expiry) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const id = await generateRxID();
    
    let status = "In Stock";
    if (Number(stock) === 0 || Number(stock) <= Number(reorderLevel) * 0.2) {
      status = "Critical";
    } else if (Number(stock) <= Number(reorderLevel)) {
      status = "Low Stock";
    }

    const newItem = new Pharmacy({
      id,
      name,
      category,
      stock: Number(stock),
      reorderLevel: Number(reorderLevel),
      unit,
      expiry,
      status
    });

    const savedItem = await newItem.save();

    // Log Activity
    const activity = new Activity({
      type: "inventory",
      title: "Pharmacy Item Added",
      detail: `Added ${name} (${stock} ${unit}) to pharmacy stock inventory`
    });
    await activity.save();

    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: "Server error adding inventory item" });
  }
});

// PUT update inventory stock level
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const originalItem = await Pharmacy.findOne({ id: req.params.id });
    if (!originalItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    const { stock, reorderLevel } = req.body;
    let updateFields = { ...req.body };

    if (stock !== undefined || reorderLevel !== undefined) {
      const activeStock = stock !== undefined ? Number(stock) : originalItem.stock;
      const activeReorder = reorderLevel !== undefined ? Number(reorderLevel) : originalItem.reorderLevel;

      let status = "In Stock";
      if (activeStock === 0 || activeStock <= activeReorder * 0.2) {
        status = "Critical";
      } else if (activeStock <= activeReorder) {
        status = "Low Stock";
      }
      updateFields.status = status;
    }

    const updatedItem = await Pharmacy.findOneAndUpdate(
      { id: req.params.id },
      { $set: updateFields },
      { new: true }
    );

    // Log Activity if stock becomes critical/low
    if (updatedItem.status !== originalItem.status && (updatedItem.status === "Critical" || updatedItem.status === "Low Stock")) {
      const activity = new Activity({
        type: "inventory",
        title: "Low Stock Alert",
        detail: `Pharmacy stock for ${updatedItem.name} flagged as ${updatedItem.status.toLowerCase()}`
      });
      await activity.save();
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: "Server error updating inventory item" });
  }
});

// DELETE pharmacy item
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Pharmacy.findOneAndDelete({ id: req.params.id });
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.json({ message: "Inventory item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting inventory item" });
  }
});

module.exports = router;
