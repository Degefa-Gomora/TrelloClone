// src/models/List.js (UPDATED)
const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    tasks: [
      // Added: References to the tasks in this list
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    order: { type: Number, required: true }, // Order of lists in a project (e.g., 0, 1, 2...)
  },
  { timestamps: true }
);

const List = mongoose.model("List", ListSchema);
module.exports = List;
