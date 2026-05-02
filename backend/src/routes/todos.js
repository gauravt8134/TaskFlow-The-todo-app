const router = require("express").Router();
const Todo = require("../models/Todo");

// Get all todos
router.get("/", async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = { user: req.userId };
    if (status === "completed") filter.completed = true;
    if (status === "pending") filter.completed = false;
    if (priority) filter.priority = priority;

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create todo
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const todo = await Todo.create({ user: req.userId, title, description, priority, dueDate });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update todo
router.put("/:id", async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
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
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle complete
router.patch("/:id/toggle", async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
