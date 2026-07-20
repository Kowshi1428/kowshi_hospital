const mongoose = require("mongoose");
const wrapModel = require("../config/wrapModel");

const PatientSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["Admitted", "Outpatient", "Discharged"]
  },
  room: {
    type: String,
    default: "—"
  },
  admitted: {
    type: Date,
    default: Date.now
  },
  condition: {
    type: String,
    required: true,
    enum: ["Critical", "Stable", "Recovering", "Recovered"]
  },
  phone: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = wrapModel(mongoose.model("Patient", PatientSchema), "patients");
