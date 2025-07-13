// server.js (updated)
const express = require("express");
const connectDB = require("./src/config/db");
const dotenv = require("dotenv");
const cors = require("cors");



const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
// REMOVED: const listRoutes = require("./src/routes/listRoutes"); // No longer needed
// REMOVED: const taskRoutes = require("./src/routes/taskRoutes"); // No longer needed

// NEW: Require all your Mongoose models to ensure their schemas are registered
require("./src/models/User");
require("./src/models/Project");
require("./src/models/List");
require("./src/models/Task");

dotenv.config({ path: "./.env" });
connectDB(); // Connect to MongoDB

const app = express(); // Initialize Express app

// Middleware
app.use(express.json({ extended: false })); // Body parser for JSON
app.use(cors()); // Enable CORS

// Routes
app.use("/api/auth", authRoutes); // Auth routes (register, login, getMe)
app.use("/api/projects", projectRoutes); // Project, List, and Task routes are consolidated here
// REMOVED: app.use("/api/projects", listRoutes); // No longer needed
// REMOVED: app.use("/api/projects", taskRoutes); // No longer needed

const PORT = process.env.PORT || 4000; // Get port from .env or default to 4000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

