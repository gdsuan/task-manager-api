const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors({ origin: "http://localhost:3000" }));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/tasks', require('./src/routes/task.route'));

module.exports = app;

