const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Activity = require("../models/Activity");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to generate APT ID
const generateAptID = async () => {
  const count = await Appointment.countDocuments();
  const nextNum = 5500 + count + 1;
  return `APT-${nextNum}`;
};

// GET all appointments
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = req.user.role === "patient" ? { patient: req.user.name } : {};
    const appointments = await Appointment.find(filter).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error retrieving appointments" });
  }
});

// POST book appointment
router.post("/", authMiddleware, async (req, res) => {
  const { patient, doctor, department, date, time, type } = req.body;

  if (!patient || !doctor || !department || !date || !time || !type) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const id = await generateAptID();
    const newAppointment = new Appointment({
      id,
      patient,
      doctor,
      department,
      date,
      time,
      type,
      status: req.user.role === "patient" ? "Pending" : "Confirmed"
    });

    const savedAppointment = await newAppointment.save();

    // Log Activity
    const activity = new Activity({
      type: "appointment",
      title: "Appointment Booked",
      detail: `Scheduled ${type} for ${patient} with ${doctor} on ${date} at ${time}`
    });
    await activity.save();

    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(500).json({ message: "Server error booking appointment" });
  }
});

// PUT update appointment
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Log Activity if status updated
    if (req.body.status) {
      const activity = new Activity({
        type: "appointment",
        title: `Appointment ${req.body.status}`,
        detail: `Appointment ${updatedAppointment.id} for ${updatedAppointment.patient} is now ${req.body.status}`
      });
      await activity.save();
    }

    res.json(updatedAppointment);
  } catch (err) {
    res.status(500).json({ message: "Server error updating appointment" });
  }
});

// DELETE appointment
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({ id: req.params.id });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting appointment" });
  }
});

module.exports = router;
