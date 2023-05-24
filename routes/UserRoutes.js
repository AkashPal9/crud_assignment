const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../jwt");
const {
  createAdmin,
  createUser,
  userlogin,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../cantroller/User");

// Create an admin profile
router.post("/admins", createAdmin);

router.post("/createusers",authenticateToken,  createUser);

// Authenticate a user and generate a token
router.post("/auth/login", userlogin);

// Get all users (Only Admin)
router.get("/users", authenticateToken, getAllUser);

// Get the current user profile
router.get("/users/profile", authenticateToken, getUser);

// Update the current user profile
router.put("/users/profile", authenticateToken, updateUser);

// Delete the current user profile
router.delete("/users/profile", authenticateToken, deleteUser);

module.exports = router;
