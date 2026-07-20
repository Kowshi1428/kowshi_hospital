const mongoose = require("mongoose");
const wrapModel = require("../config/wrapModel");

const AppointmentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  patient: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["Confirmed", "Pending", "Cancelled"],
    default: "Pending"
  }
}, { timestamps: true });

module.exports = wrapModel(mongoose.model("Appointment", AppointmentSchema), "appointments");
