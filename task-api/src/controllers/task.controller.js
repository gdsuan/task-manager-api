const Task = require("../models/task.model");

// CREATE new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;


    const task = new Task({ title, description, status: status || "pending"  // 👈 fallback
      
  });
    await task.save();
    res.status(201).json({ message: "Task created successfully", data: task });
  } catch (error) {
    console.error(error); // 👈 log error in terminal
    res.status(500).json({ error: error.message });
  }
};

// READ all tasks with search & filter
exports.getTasks = async (req, res) => {
  try {
    const { keyword, status } = req.query;
    let filter = {};

    // Search by keyword in title or description
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ one task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE task by ID
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,   // this includes { status: "completed" } or title/description
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE task by ID
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateTaskStatus = async (id, newStatus) => {
  try {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, { status: newStatus });
    fetchTasks(); // refresh tasks after update
  } catch (error) {
    console.error("Failed to update task:", error);
  }
};
