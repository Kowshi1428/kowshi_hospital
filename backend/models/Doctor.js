const mongoose = require("mongoose");
const wrapModel = require("../config/wrapModel");

const DoctorSchema = new mongoose.Schema({
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
  specialty: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  patients: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 5.0
  },
  status: {
    type: String,
    required: true,
    enum: ["On Duty", "Off Duty", "On Leave"]
  },
  shift: {
    type: String,
    default: "—"
  },
  phone: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = wrapModel(mongoose.model("Doctor", DoctorSchema), "doctors");
