const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to generate DOC ID
const generateDocID = async () => {
  const count = await Doctor.countDocuments();
  const nextNum = 100 + count + 1;
  return `DOC-${nextNum}`;
};

// GET all doctors
router.get("/", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error retrieving doctors" });
  }
});

// POST add doctor
router.post("/", authMiddleware, async (req, res) => {
  const { name, specialty, experience, status, shift, phone } = req.body;

  if (!name || !specialty || !experience || !status || !phone) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const id = await generateDocID();
    const newDoctor = new Doctor({
      id,
      name,
      specialty,
      experience: Number(experience),
      status,
      shift: shift || "—",
      phone,
      patients: 0,
      rating: 5.0
    });

    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (err) {
    res.status(500).json({ message: "Server error adding doctor" });
  }
});

// PUT update doctor
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(updatedDoctor);
  } catch (err) {
    res.status(500).json({ message: "Server error updating doctor" });
  }
});

// DELETE doctor
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndDelete({ id: req.params.id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting doctor" });
  }
});

module.exports = router;
