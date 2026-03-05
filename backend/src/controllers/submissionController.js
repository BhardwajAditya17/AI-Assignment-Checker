//submissionController.js
const Submission = require("../models/Submission");
const Question = require("../models/Question");
const axios = require("axios");
const path = require("path");

// ==========================================
// 1. STUDENT: Submit Assignment + AI Grading
// ==========================================
exports.submitAnswer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File upload is required" });
    }

    const { assignmentId } = req.body;
    const studentFile = req.file; 

    // ✅ FIX 1: Safely get the student ID. Handles both 'id' and '_id' from JWT payloads.
    const studentId = req.user._id || req.user.id;
    if (!studentId) {
      return res.status(401).json({ message: "Unauthorized: Missing User ID" });
    }

    if (!assignmentId) {
        return res.status(400).json({ message: "Assignment ID is required" });
    }

    // 1. Fetch the Question
    const question = await Question.findById(assignmentId);
    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }

    // 2. Prepare the payload for Python AI
    const aiPayload = {
        student_file_path: path.resolve(studentFile.path),
        question_description: question.description || question.title || "No description provided",
        max_marks: question.maxMarks || 100
    };

    if (question.referenceFile) {
        aiPayload.reference_file_path = path.resolve(question.referenceFile);
    }

    // 3. Call Python AI Service
    let aiData = {};
    try {
        console.log("🤖 Sending data to AI Grader...");
        const aiResponse = await axios.post('http://127.0.0.1:8000/analyze', aiPayload);
        aiData = aiResponse.data;
        console.log("✅ AI Grading Complete! Score:", aiData.score);
    } catch (aiError) {
        console.error("⚠️ AI Service Failed (Saving submission anyway):", aiError.message);
    }

    // 4. Save to MongoDB
    // ✅ FIX 2: Explicitly save obtainedMarks and aiAnalysis so the grade persists
    const submissionData = {
        student: studentId, 
        question: assignmentId,
        fileUrl: studentFile.path, 
        obtainedMarks: aiData.score !== undefined ? aiData.score : null,
        aiAnalysis: Object.keys(aiData).length > 0 ? aiData : null,
        feedback: aiData.feedback || "Pending Teacher Review"
    };

    const submission = await Submission.create(submissionData);
    res.status(201).json(submission);

  } catch (error) {
     console.error("Submission Error:", error);
     res.status(500).json({ message: "Failed to submit assignment" });
  }
};

// ==========================================
// 2. TEACHER: View Submissions for a Class Assignment
// ==========================================
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Question.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const submissions = await Submission.find({ question: assignmentId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json({ assignment, submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to load submissions" });
  }
};

// ==========================================
// 3. STUDENT: View My Past Submissions
// ==========================================
exports.getMySubmissions = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;
    const submissions = await Submission.find({ student: studentId })
      .populate("question", "title deadline maxMarks");
      
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 4. Get Single Submission (For Grading Page)
// ==========================================
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("student", "name email")
      .populate("question", "title description maxMarks");

    if (!submission) return res.status(404).json({ error: "Submission not found" });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submission" });
  }
};

// ==========================================
// 5. Teacher: Grade Submission (Manual)
// ==========================================
exports.gradeSubmission = async (req, res) => {
  try {
    const { obtainedMarks, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { obtainedMarks, feedback },
      { new: true }
    );
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: "Failed to update grade" });
  }
};

// ==========================================
// 6. Check if Student Submitted
// ==========================================
exports.getSubmissionForQuestion = async (req, res) => {
  try {
    // ✅ FIX 3: Safely get student ID here too to ensure it fetches correctly on refresh
    const studentId = req.user._id || req.user.id;
    
    const submission = await Submission.findOne({
      question: req.params.assignmentId,
      student: studentId, 
    });
    
    res.status(200).json(submission || null); 
  } catch (error) {
    res.status(500).json({ message: "Error checking submission status" });
  }
};