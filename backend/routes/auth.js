const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");
const authMiddleware = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET || "KowshiHospitalsSuperSecretJWTKey123!";

// Admin/Staff Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: "admin"
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: "admin"
        }
      });
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Admin/Staff Registration (New User)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password
    });

    const payload = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: "admin"
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: "admin"
        }
      });
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Patient Portal Login (using Patient MRN ID and Phone number)
router.post("/patient-login", async (req, res) => {
  const { patientId, phone } = req.body;

  if (!patientId || !phone) {
    return res.status(400).json({ message: "Please enter Patient ID and Phone Number" });
  }

  try {
    const patient = await Patient.findOne({ id: patientId });
    if (!patient) {
      return res.status(400).json({ message: "Patient ID record not found" });
    }

    // Verify phone number (simple normalized check)
    const normalizedInput = phone.replace(/[^0-9]/g, "");
    const normalizedDb = patient.phone.replace(/[^0-9]/g, "");

    if (normalizedInput.length < 5 || normalizedDb.length < 5 || !normalizedDb.endsWith(normalizedInput)) {
      return res.status(400).json({ message: "Phone number does not match this Patient ID record" });
    }

    const payload = {
      id: patient._id,
      name: patient.name,
      patientId: patient.id,
      role: "patient"
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: patient._id,
          name: patient.name,
          patientId: patient.id,
          role: "patient"
        }
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during patient portal login" });
  }
});

// Get logged-in user or patient info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "patient") {
      const patient = await Patient.findById(req.user.id);
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      return res.json({
        id: patient.id,
        name: patient.name,
        role: "patient"
      });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: "admin"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching user" });
  }
});

module.exports = router;
