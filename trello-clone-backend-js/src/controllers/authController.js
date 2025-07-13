


// src/controllers/authController.js
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import your User model

// Regex for a strong password:
// - At least 8 characters long
// - Contains at least one uppercase letter (A-Z)
// - Contains at least one lowercase letter (a-z)
// - Contains at least one digit (0-9)
// - Contains at least one special character (!@#$%^&*)
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

// Helper function to validate password strength
const validatePasswordStrength = (password) => {
  if (!strongPasswordRegex.test(password)) {
    // You can customize this error message to be more specific if needed
    // e.g., by returning an array of specific failures like in the frontend
    return "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.";
  }
  return null; // No error, password is strong
}; // <-- This closing curly brace was missing in your provided snippet

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation for presence of fields
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  // --- SERVER-SIDE PASSWORD STRENGTH VALIDATION ---
  const passwordStrengthError = validatePasswordStrength(password);
  if (passwordStrengthError) {
    res.status(400); // Bad Request
    throw new Error(passwordStrengthError);
  }

  // Check if user already exists (by email or username)
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    res.status(400);
    throw new Error("User with that email or username already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id), // Generate JWT
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password presence
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  // Check for user by email
  const user = await User.findOne({ email });

  // Check password
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id), // Generate JWT
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// @desc    Get user profile (example of a protected route)
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware (assuming you have one for protected routes)
  const user = await User.findById(req.user._id).select("-password"); // Exclude password from response
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Generate JWT Token
const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    // It's good practice to ensure JWT_SECRET is available
    console.error("CRITICAL ERROR: JWT_SECRET is not defined in environment variables.");
    throw new Error("Server configuration error: JWT secret missing.");
  }
  return jwt.sign({ _id: id }, jwtSecret, {
    expiresIn: "1d", // Token expires in 1 day
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};