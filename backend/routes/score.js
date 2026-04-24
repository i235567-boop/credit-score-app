const express = require("express");
const CreditScore = require("../models/CreditScore");
const authMiddleware = require("../middleware/auth");
const validateScoreInput = require("../middleware/validate");

const router = express.Router();

// Core FinTech Logic: Calculate credit score based on 5 factors
// Weights are based on standard credit scoring models
function calculateScore(data) {
  const { paymentHistory, creditUtilization, accountAge, totalAccounts, recentInquiries } = data;

  // Payment history: 35% weight (most important)
  const paymentScore = (paymentHistory / 100) * 350;

  // Credit utilization: 30% weight (lower is better)
  const utilizationScore = ((100 - creditUtilization) / 100) * 300;

  // Account age: 15% weight (older is better)
  const ageScore = (accountAge / 10) * 150;

  // Total accounts: 10% weight (more is slightly better, max 20)
  const accountsScore = (totalAccounts / 20) * 100;

  // Recent inquiries: 10% weight (fewer is better)
  const inquiryScore = ((10 - recentInquiries) / 10) * 100;

  // Base score is 300, max is 850 (standard credit score range)
  const rawScore = paymentScore + utilizationScore + ageScore + accountsScore + inquiryScore;
  const finalScore = Math.round(300 + (rawScore / 1000) * 550);

  return finalScore;
}

// Determine rating label from score
function getRating(score) {
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 650) return "Fair";
  if (score >= 600) return "Poor";
  return "Very Poor";
}

// POST /api/score/submit — submit or update credit data
router.post("/submit", authMiddleware, validateScoreInput, async (req, res) => {
  const { paymentHistory, creditUtilization, accountAge, totalAccounts, recentInquiries } = req.body;

  const score = calculateScore({ paymentHistory, creditUtilization, accountAge, totalAccounts, recentInquiries });
  const rating = getRating(score);

  try {
    // Update if exists, create if not
    let record = await CreditScore.findOne({ userId: req.userId });

    if (record) {
      record.paymentHistory = paymentHistory;
      record.creditUtilization = creditUtilization;
      record.accountAge = accountAge;
      record.totalAccounts = totalAccounts;
      record.recentInquiries = recentInquiries;
      record.score = score;
      record.rating = rating;
      await record.save();
    } else {
      record = await CreditScore.create({
        userId: req.userId,
        paymentHistory,
        creditUtilization,
        accountAge,
        totalAccounts,
        recentInquiries,
        score,
        rating,
      });
    }

    res.json({ score, rating, record });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/score/my — get logged-in user's score
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const record = await CreditScore.findOne({ userId: req.userId }).populate("userId", "name email");
    if (!record) {
      return res.json({ exists: false });
    }
    res.json({ exists: true, record });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/score/rankings — Query 1: get all users ranked by score (descending)
router.get("/rankings", authMiddleware, async (req, res) => {
  try {
    const rankings = await CreditScore.find({})
      .populate("userId", "name email")
      .sort({ score: -1 });

    res.json(rankings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/score/filter?rating=Good — Query 2: filter by rating
router.get("/filter", authMiddleware, async (req, res) => {
  const { rating } = req.query;

  const validRatings = ["Excellent", "Good", "Fair", "Poor", "Very Poor"];

  if (!rating || !validRatings.includes(rating)) {
    return res.status(400).json({ message: "Provide a valid rating: Excellent, Good, Fair, Poor, Very Poor" });
  }

  try {
    const results = await CreditScore.find({ rating })
      .populate("userId", "name email")
      .sort({ score: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
