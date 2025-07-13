// src/models/Task.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    assignedTo: [
      // Users assigned to this task (array of User IDs)
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      // References to comments on this task (will be created later)
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    order: { type: Number, required: true }, // To maintain the order of tasks within a list
    dueDate: { type: Date, default: null },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
