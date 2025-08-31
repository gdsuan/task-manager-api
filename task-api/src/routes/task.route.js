const express = require('express');
const router = express.Router();
const taskController = require("../controllers/task.controller");

// CRUD + Search + Filter Routes
router.post("/", taskController.createTask);         // Create
router.get("/", taskController.getTasks);            // Read all (with search & filter)
router.get("/:id", taskController.getTaskById);      // Read one
router.put("/:id", taskController.updateTask);       // Update
router.delete("/:id", taskController.deleteTask);    // Delete

module.exports = router;

