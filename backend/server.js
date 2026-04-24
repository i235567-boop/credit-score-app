const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/score");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Credit Score API running" });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is not set in environment variables!");
}

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
  mongoose
    .connect(MONGO_URI)
    .then(() => { console.log("MongoDB connected successfully"); })
    .catch((err) => { console.error("MongoDB connection error:", err.message); });
});
