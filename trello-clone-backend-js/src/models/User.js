// src/models/User.js (UPDATED)
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    projects: [
      // Added: Array of Project IDs
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project", // References the 'Project' model
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
