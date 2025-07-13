// src/routes/taskRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Project = require("../models/Project");
const List = require("../models/List");
const Task = require("../models/Task");
const User = require("../models/User"); // To populate assignedTo users

const router = express.Router();

// Middleware to check project and list ownership/membership
const checkProjectAndListAccess = async (req, res, next) => {
  try {
    const { projectId, listId } = req.params;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (memberId) => memberId.toString() === req.user.id
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Access denied: Not a member of this project" });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (list.project.toString() !== projectId) {
      return res
        .status(400)
        .json({ message: "List does not belong to this project" });
    }

    // Attach project and list to request for convenience in subsequent handlers
    req.project = project;
    req.list = list;
    next();
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Project or List ID" });
    }
    res.status(500).send("Server error");
  }
};

// @route   POST /api/projects/:projectId/lists/:listId/tasks
// @desc    Create a new task within a specific list
// @access  Private
router.post(
  "/:projectId/lists/:listId/tasks",
  authMiddleware,
  checkProjectAndListAccess,
  async (req, res) => {
    const { title, description, dueDate, assignedTo } = req.body;
    const { listId } = req.params;

    try {
      const list = req.list; // From checkProjectAndListAccess middleware

      // Determine the order for the new task (last in the list)
      // Find highest existing order for tasks in this list, default to -1 if none, then add 1
      const lastTask = await Task.findOne({ list: listId }).sort({ order: -1 });
      const newOrder = lastTask ? lastTask.order + 1 : 0;

      const newTask = new Task({
        title,
        description,
        project: list.project, // Inherit project ID from the list
        list: listId,
        assignedTo: assignedTo || [], // Ensure it's an array, even if empty
        dueDate: dueDate || null,
        order: newOrder,
      });

      await newTask.save();

      // Add task ID to the list's tasks array
      list.tasks.push(newTask._id);
      await list.save();

      res.status(201).json(newTask);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET /api/projects/:projectId/lists/:listId/tasks
// @desc    Get all tasks for a specific list
// @access  Private
router.get(
  "/:projectId/lists/:listId/tasks",
  authMiddleware,
  checkProjectAndListAccess,
  async (req, res) => {
    const { listId } = req.params;

    try {
      const tasks = await Task.find({ list: listId })
        .populate("assignedTo", "username email") // Populate assigned user details
        .sort("order"); // Sort by order for display

      res.json(tasks);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT /api/projects/:projectId/lists/:listId/tasks/:taskId
// @desc    Update a task (including moving task to a new list or reordering)
// @access  Private
router.put(
  "/:projectId/lists/:listId/tasks/:taskId",
  authMiddleware,
  checkProjectAndListAccess,
  async (req, res) => {
    const { taskId } = req.params;
    // Destructure fields to update. 'list' is for moving tasks between lists.
    const {
      title,
      description,
      dueDate,
      assignedTo,
      completed,
      list: newListId,
      order: newOrder,
    } = req.body;

    try {
      let task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Security check: Ensure the task belongs to the original project/list
      if (
        task.project.toString() !== req.params.projectId ||
        task.list.toString() !== req.params.listId
      ) {
        return res
          .status(400)
          .json({
            message: "Task does not belong to the specified project or list",
          });
      }

      // Handle moving task to a new list
      if (newListId && newListId.toString() !== task.list.toString()) {
        // Find old list and remove task ID
        const oldList = await List.findById(task.list);
        if (oldList) {
          oldList.tasks = oldList.tasks.filter((t) => t.toString() !== taskId);
          await oldList.save();
        }

        // Find new list and add task ID
        const newList = await List.findById(newListId);
        if (newList) {
          newList.tasks.push(taskId);
          await newList.save();
          task.list = newListId; // Update task's list reference
          task.project = newList.project; // Update task's project reference if the new list is in a different project (though in Trello, lists belong to one project)
        } else {
          return res.status(404).json({ message: "New list not found" });
        }
      }

      // Update other fields if provided
      task.title = title !== undefined ? title : task.title;
      task.description =
        description !== undefined ? description : task.description; // Allow setting description to empty
      task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
      task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
      task.completed = completed !== undefined ? completed : task.completed;
      task.order = newOrder !== undefined ? newOrder : task.order; // Update order

      await task.save();
      res.json(task);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(400).json({ message: "Invalid Task ID or List ID" });
      }
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE /api/projects/:projectId/lists/:listId/tasks/:taskId
// @desc    Delete a task
// @access  Private
router.delete(
  "/:projectId/lists/:listId/tasks/:taskId",
  authMiddleware,
  checkProjectAndListAccess,
  async (req, res) => {
    const { taskId } = req.params;

    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Security check: Ensure task belongs to the original project/list
      if (
        task.project.toString() !== req.params.projectId ||
        task.list.toString() !== req.params.listId
      ) {
        return res
          .status(400)
          .json({
            message: "Task does not belong to the specified project or list",
          });
      }

      await task.deleteOne(); // Use deleteOne() to remove the task document

      // Remove task ID from the list's tasks array
      const list = await List.findById(task.list);
      if (list) {
        list.tasks = list.tasks.filter((t) => t.toString() !== taskId);
        await list.save();
      }

      res.json({ message: "Task removed successfully" });
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(400).json({ message: "Invalid Task ID" });
      }
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
