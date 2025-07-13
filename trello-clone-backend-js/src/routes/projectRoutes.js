// src/routes/projectRoutes.js
const express = require("express");
const router = express.Router(); // This line is crucial for initializing the router
const { protect } = require("../middleware/authMiddleware"); // Renamed authMiddleware to protect for consistency
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  createList,
  updateList,
  deleteList,
  createTask,
  updateTask,
  deleteTask,
  searchUsers,
  addProjectMember,
  removeProjectMember,
} = require("../controllers/projectController"); // <<< This correctly imports from the controller!

// Project Routes
router
  .route("/")
  .post(protect, createProject) // Create a new project
  .get(protect, getProjects); // Get all projects for the user

router
  .route("/:id")
  .get(protect, getProjectById) // Get project by ID
  .put(protect, updateProject) // Update a project
  .delete(protect, deleteProject); // Delete a project

// User Search Route (for inviting collaborators)
router.get("/users/search", protect, searchUsers);

// Member Routes (nested under projects)
router.route("/:projectId/members").post(protect, addProjectMember); // Add a member to a project

router
  .route("/:projectId/members/:userId")
  .delete(protect, removeProjectMember); // Remove a member from a project

// List Routes (nested under projects)
router.route("/:projectId/lists").post(protect, createList); // Create a new list for a project

router
  .route("/:projectId/lists/:listId")
  .put(protect, updateList) // Update a list
  .delete(protect, deleteList); // Delete a list

// Task Routes (nested under lists)
router.route("/:projectId/lists/:listId/tasks").post(protect, createTask); // Create a new task for a list

router
  .route("/:projectId/lists/:listId/tasks/:taskId")
  .put(protect, updateTask) // Update a task
  .delete(protect, deleteTask); // Delete a task

module.exports = router; // This exports the fully configured router