const mongoose = require("mongoose");
const wrapModel = require("../config/wrapModel");

const PharmacySchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  reorderLevel: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    required: true
  },
  expiry: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["In Stock", "Low Stock", "Critical"],
    default: "In Stock"
  }
}, { timestamps: true });

module.exports = wrapModel(mongoose.model("Pharmacy", PharmacySchema), "pharmacy");
