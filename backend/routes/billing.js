const express = require("express");
const router = express.Router();
const Billing = require("../models/Billing");
const Activity = require("../models/Activity");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to generate INV ID
const generateInvoiceID = async () => {
  const count = await Billing.countDocuments();
  const nextNum = 9000 + count + 1;
  return `INV-${nextNum}`;
};

// GET all billing invoices
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = req.user.role === "patient" ? { patient: req.user.name } : {};
    const invoices = await Billing.find(filter).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Server error retrieving invoices" });
  }
});

// POST generate new billing invoice
router.post("/", authMiddleware, async (req, res) => {
  const { patient, department, amount, method } = req.body;

  if (!patient || !department || amount === undefined || !method) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const id = await generateInvoiceID();
    const newInvoice = new Billing({
      id,
      patient,
      department,
      amount: Number(amount),
      status: "Pending", // Default is pending payment
      date: new Date().toISOString().split("T")[0],
      method
    });

    const savedInvoice = await newInvoice.save();

    // Log Activity
    const activity = new Activity({
      type: "billing",
      title: "Invoice Generated",
      detail: `Generated invoice ${id} for patient ${patient} ($${amount})`
    });
    await activity.save();

    res.status(201).json(savedInvoice);
  } catch (err) {
    res.status(500).json({ message: "Server error creating invoice" });
  }
});

// PUT update billing invoice payment status
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedInvoice = await Billing.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Log Activity if paid
    if (req.body.status === "Paid") {
      const activity = new Activity({
        type: "billing",
        title: "Invoice Settled",
        detail: `Invoice ${updatedInvoice.id} ($${updatedInvoice.amount}) paid via ${updatedInvoice.method}`
      });
      await activity.save();
    }

    res.json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ message: "Server error updating invoice" });
  }
});

// DELETE billing invoice
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const invoice = await Billing.findOneAndDelete({ id: req.params.id });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting invoice" });
  }
});

module.exports = router;
