const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  getAllUsers,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Get logged-in user profile
router.get("/profile", protect, getUserProfile);

// Get all users
router.get("/", protect, getAllUsers);

module.exports = router;