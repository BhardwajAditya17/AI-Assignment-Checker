//submissionRoutes.js
const express = require("express");
const router = express.Router();
const { protect, teacherOnly } = require("../middleware/authMiddleware");
// ✅ FIX: Import Upload Middleware
const upload = require("../middleware/uploadMiddleware");

const { 
  submitAnswer, 
  getSubmissionsByAssignment, 
  getSubmissionForQuestion, 
  getSubmissionById,        
  gradeSubmission           
} = require("../controllers/submissionController");

// ==============================
// STUDENT ROUTES
// ==============================

// Submit Assignment
// ✅ FIX: Added 'upload.single' so req.file works. 
// Frontend must use FormData with key "submissionFile"
router.post("/submit", protect, upload.single("file"), submitAnswer);
// Check if I already submitted this question
router.get("/my-submission/:assignmentId", protect, getSubmissionForQuestion);


// ==============================
// TEACHER ROUTES
// ==============================

// View all submissions for a specific Assignment
router.get("/assignment/:assignmentId", protect, getSubmissionsByAssignment);

// Get details of ONE specific student submission (for grading view)
router.get("/:id", protect, getSubmissionById);

// Update Grade (Manual Override)
router.put("/:id/grade", protect, teacherOnly, gradeSubmission);

module.exports = router;