const mongoose = require("mongoose");
const wrapModel = require("../config/wrapModel");

const WardSchema = new mongoose.Schema({
  ward: {
    type: String,
    required: true,
    unique: true
  },
  total: {
    type: Number,
    required: true
  },
  occupied: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

module.exports = wrapModel(mongoose.model("Ward", WardSchema), "wards");
