const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Todo", todoSchema);
