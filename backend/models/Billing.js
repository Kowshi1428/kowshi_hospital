const mongoose = require("mongoose");
const wrapModel = require("../config/wrapModel");

const BillingSchema = new mongoose.Schema({
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
  department: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["Paid", "Pending", "Overdue"],
    default: "Pending"
  },
  date: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = wrapModel(mongoose.model("Billing", BillingSchema), "billing");
