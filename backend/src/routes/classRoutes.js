const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { 
  createClass, 
  joinClass, 
  getMyClasses, 
  getClassById 
} = require("../controllers/classController");

// Create a class
router.post("/create", protect, createClass);

// Join a class
router.post("/join", protect, joinClass);

// Get all my classes
router.get("/my-classes", protect, getMyClasses);

// Get Single Class
router.get("/:id", protect, getClassById);

module.exports = router;