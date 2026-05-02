require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");
const { verifyToken } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", verifyToken, todoRoutes);

app.get("/health", (req, res) => res.json({ status: "healthy" }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://mongo:27017/taskflow")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
