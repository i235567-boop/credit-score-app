const mongoose = require("mongoose");

// Collection 2: CreditScore — references User collection
const creditScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentHistory: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  creditUtilization: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  accountAge: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  totalAccounts: {
    type: Number,
    min: 0,
    max: 20,
    required: true,
  },
  recentInquiries: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  // Calculated score stored for ranking queries
  score: {
    type: Number,
    default: 0,
  },
  // Rating label based on score
  rating: {
    type: String,
    default: "Poor",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CreditScore", creditScoreSchema);
