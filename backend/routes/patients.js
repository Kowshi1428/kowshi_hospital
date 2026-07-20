const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const Activity = require("../models/Activity");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to generate MRN
const generateMRN = async () => {
  const count = await Patient.countDocuments();
  const nextNum = 84000 + count + 1;
  return `MRN-${nextNum}`;
};

// GET all patients
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ id: req.user.patientId });
      return res.json(patient ? [patient] : []);
    }
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Server error retrieving patients" });
  }
});

// GET single patient
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "patient" && req.params.id !== req.user.patientId) {
      return res.status(403).json({ message: "Access denied to other patient records" });
    }
    const patient = await Patient.findOne({ id: req.params.id });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: "Server error retrieving patient" });
  }
});

// POST register patient
router.post("/", authMiddleware, async (req, res) => {
  const { name, age, gender, department, doctor, status, room, condition, phone } = req.body;

  if (!name || !age || !gender || !department || !doctor || !status || !condition || !phone) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const id = await generateMRN();
    const newPatient = new Patient({
      id,
      name,
      age: Number(age),
      gender,
      department,
      doctor,
      status,
      room: room || "—",
      condition,
      phone
    });

    const savedPatient = await newPatient.save();

    // Log Activity
    const activity = new Activity({
      type: status === "Admitted" ? "admission" : "appointment",
      title: status === "Admitted" ? "Patient Admitted" : "Patient Registered",
      detail: `${doctor} registered patient ${name} to ${department}${status === "Admitted" ? ` (Room: ${room || "—"})` : ""}`
    });
    await activity.save();

    res.status(201).json(savedPatient);
  } catch (err) {
    res.status(500).json({ message: "Server error registering patient" });
  }
});

// PUT update patient
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const originalPatient = await Patient.findOne({ id: req.params.id });
    if (!originalPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const updatedPatient = await Patient.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // If status changed to discharged, log activity
    if (originalPatient.status !== updatedPatient.status) {
      const activity = new Activity({
        type: updatedPatient.status === "Discharged" ? "discharge" : "admission",
        title: updatedPatient.status === "Discharged" ? "Patient Discharged" : "Patient Status Updated",
        detail: `${updatedPatient.doctor} changed status of ${updatedPatient.name} to ${updatedPatient.status}`
      });
      await activity.save();
    }

    res.json(updatedPatient);
  } catch (err) {
    res.status(500).json({ message: "Server error updating patient" });
  }
});

// DELETE patient
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({ id: req.params.id });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting patient" });
  }
});

module.exports = router;
