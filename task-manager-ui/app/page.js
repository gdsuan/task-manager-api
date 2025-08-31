"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      params: { keyword: search, status: status !== "all" ? status : undefined },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, [search, status]);

  // Add task
  const addTask = async () => {
    if (!form.title) return;
    await axios.post("http://localhost:5000/api/tasks", form);
    setForm({ title: "", description: "" });
    fetchTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  // Update task
  const updateTask = async () => {
    await axios.put(`http://localhost:5000/api/tasks/${editingTask._id}`, editingTask);
    setEditingTask(null);
    fetchTasks();
  };

  // Update task status
  const updateTaskStatus = async (id, newStatus) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, { status: newStatus });
    fetchTasks();
  };

  // Status badge color
  const getStatusColor = (status) => {
    if (status === "pending") return "bg-red-200 text-red-800";
    if (status === "in-progress") return "bg-yellow-200 text-yellow-900";
    if (status === "completed") return "bg-green-200 text-green-900";
    return "";
  };

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen`}>
      <div className="min-h-screen bg-cover bg-center dark:bg-gray-900 relative p-6">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded shadow bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">📌 Task Manager</h1>

        {/* Add Task Form */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            className="flex-1 px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="flex-1 px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded shadow hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
          >
            Add Task
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            className="flex-1 px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 rounded shadow dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.li
                key={task._id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
                transition={{ duration: 0.2 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 transition"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{task.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
                  <span
                    className={`inline-block px-3 py-1 mt-2 text-sm rounded-full font-semibold shadow-sm ${getStatusColor(task.status)}`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  {/* Update status */}
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    className="px-2 py-1 rounded shadow dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  {/* Delete */}
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
                  >
                    ❌
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => setEditingTask(task)}
                    className="px-2 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
                  >
                    ✏️
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingTask && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 sm:w-96"
              >
                <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Edit Task</h2>
                <input
                  className="w-full px-4 py-2 mb-3 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
                <input
                  className="w-full px-4 py-2 mb-3 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditingTask(null)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded shadow hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateTask}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded shadow hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
