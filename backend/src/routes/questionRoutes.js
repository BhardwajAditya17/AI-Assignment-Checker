//questionroutes.js
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// 1. Import Auth Middleware
const { protect, teacherOnly } = require("../middleware/authMiddleware");

// 2. Import Upload Middleware
// ⚠️ IMPORTANT: Do NOT use curly braces { } here because you exported it as 'module.exports = upload'
const upload = require("../middleware/uploadMiddleware"); 

// 3. Import Controller
const { createQuestion } = require("../controllers/questionController");

// ==============================
// ROUTES
// ==============================

// POST /api/v1/questions/ (Create Assignment)
router.post(
  "/", 
  protect,          // Check if logged in
  teacherOnly,      // Check if teacher
  upload.single("referenceFile"), // Handle file upload
  createQuestion    // Run the controller logic
);

// GET /api/v1/questions/:id (Get Assignment Details)
router.get("/:id", protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Assignment not found in database" });
    }
    res.json(question);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: "Server error fetching assignment" });
  }
});

module.exports = router;