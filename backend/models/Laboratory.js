const mongoose = require("mongoose");
const wrapModel = require("../config/wrapModel");

const LaboratorySchema = new mongoose.Schema({
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
  test: {
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
    enum: ["Completed", "Pending", "Processing"],
    default: "Pending"
  },
  date: {
    type: String,
    required: true
  },
  result: {
    type: String,
    default: "Pending Analysis"
  }
}, { timestamps: true });

module.exports = wrapModel(mongoose.model("Laboratory", LaboratorySchema), "laboratory");
