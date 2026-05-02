const router = require("express").Router();
const auth = require("../middleware/auth");
const Todo = require("../models/Todo");

// Get all todos
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create todo
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });
    const todo = await Todo.create({ user: req.user.id, title, description, priority });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update todo
router.put("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete todo
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
