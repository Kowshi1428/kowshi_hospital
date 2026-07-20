const mongoose = require("mongoose");
const wrapModel = require("../config/wrapModel");

const ActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["admission", "inventory", "lab", "billing", "discharge", "appointment"]
  },
  title: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = wrapModel(mongoose.model("Activity", ActivitySchema), "activities");
