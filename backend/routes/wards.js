const express = require("express");
const router = express.Router();
const Ward = require("../models/Ward");
const authMiddleware = require("../middleware/authMiddleware");

// GET all wards
router.get("/", authMiddleware, async (req, res) => {
  try {
    const wards = await Ward.find().sort({ ward: 1 });
    res.json(wards);
  } catch (err) {
    res.status(500).json({ message: "Server error retrieving wards" });
  }
});

// PUT update ward occupied beds
router.put("/:wardName", authMiddleware, async (req, res) => {
  const { occupied } = req.body;
  
  if (occupied === undefined) {
    return res.status(400).json({ message: "Occupied bed count is required" });
  }

  try {
    const updatedWard = await Ward.findOneAndUpdate(
      { ward: req.params.wardName },
      { $set: { occupied: Number(occupied) } },
      { new: true }
    );
    if (!updatedWard) {
      return res.status(404).json({ message: "Ward not found" });
    }
    res.json(updatedWard);
  } catch (err) {
    res.status(500).json({ message: "Server error updating ward beds" });
  }
});

module.exports = router;
