require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { setConnected } = require("./config/dbManager");

// Route imports
const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const wardRoutes = require("./routes/wards");
const pharmacyRoutes = require("./routes/pharmacy");
const billingRoutes = require("./routes/billing");
const laboratoryRoutes = require("./routes/laboratory");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

// Middleware
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/wards", wardRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/laboratory", laboratoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Home Route (status page)
app.get("/", (req, res) => {
  res.json({
    status: "Running",
    service: "Kowshi Hospital Care Operations Platform API",
    version: "1.0.0"
  });
});

// MongoDB Connection with Fallback
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    setConnected(true);
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    setConnected(false);
    console.log("MongoDB connection failed. Dynamic JSON database fallback active.");
    console.log(err.message);
  });

// Server Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});