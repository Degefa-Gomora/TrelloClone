

// src/routes/authRoutes.js
const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/authController"); // Import controller functions
const { protect } = require("../middleware/authMiddleware"); // Import the 'protect' middleware

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private (requires token)
router.get("/me", protect, getMe); // Use the 'protect' middleware to secure this route

module.exports = router;