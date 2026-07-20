const express = require("express");
const router = express.Router();
const Laboratory = require("../models/Laboratory");
const Activity = require("../models/Activity");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to generate LAB ID
const generateLabID = async () => {
  const count = await Laboratory.countDocuments();
  const nextNum = 3300 + count + 1;
  return `LAB-${nextNum}`;
};

// GET all laboratory tests
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = req.user.role === "patient" ? { patient: req.user.name } : {};
    const tests = await Laboratory.find(filter).sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: "Server error retrieving lab records" });
  }
});

// POST request laboratory test
router.post("/", authMiddleware, async (req, res) => {
  const { patient, test, department, doctor } = req.body;

  if (!patient || !test || !department || !doctor) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const id = await generateLabID();
    const newTest = new Laboratory({
      id,
      patient,
      test,
      department,
      doctor,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      result: "Pending Analysis"
    });

    const savedTest = await newTest.save();

    // Log Activity
    const activity = new Activity({
      type: "lab",
      title: "Lab Test Requested",
      detail: `${doctor} requested test: ${test} for ${patient}`
    });
    await activity.save();

    res.status(201).json(savedTest);
  } catch (err) {
    res.status(500).json({ message: "Server error requesting lab test" });
  }
});

// PUT update lab test status or results
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const originalTest = await Laboratory.findOne({ id: req.params.id });
    if (!originalTest) {
      return res.status(404).json({ message: "Lab record not found" });
    }

    const updatedTest = await Laboratory.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    // Log Activity if completed
    if (updatedTest.status === "Completed" && originalTest.status !== "Completed") {
      const activity = new Activity({
        type: "lab",
        title: "Lab Test Completed",
        detail: `Radiology laboratory completed ${updatedTest.test} for ${updatedTest.patient}`
      });
      await activity.save();
    }

    res.json(updatedTest);
  } catch (err) {
    res.status(500).json({ message: "Server error updating lab record" });
  }
});

// DELETE lab test record
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const testRecord = await Laboratory.findOneAndDelete({ id: req.params.id });
    if (!testRecord) {
      return res.status(404).json({ message: "Lab record not found" });
    }
    res.json({ message: "Lab record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting lab record" });
  }
});

module.exports = router;
