//submissionController.js
const Submission = require("../models/Submission");
const Question = require("../models/Question");
const axios = require("axios");
const path = require("path");
const supabase = require("../config/supabase");

// ==========================================
// 1. STUDENT: Submit Assignment + AI Grading
// ==========================================
exports.submitAnswer = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File upload is required" });

    const { assignmentId } = req.body;
    const studentId = req.user._id || req.user.id;

    const question = await Question.findById(assignmentId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    // --- 1. UPLOAD DIRECTLY TO SUPABASE FIRST ---
    const cleanFileName = req.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const supabaseFileName = `${Date.now()}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(supabaseFileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) throw new Error("Supabase upload failed");

    // Get the Cloud URL
    const { data: urlData } = supabase.storage
      .from('submissions')
      .getPublicUrl(supabaseFileName);
      
    const finalFileUrl = urlData.publicUrl;

    // --- 2. SEND THE URL TO PYTHON AI ---
    let aiData = {};
    const aiPayload = {
      student_file_url: finalFileUrl, // ✅ Passing the Supabase URL!
      question_description: question.description || question.title || "No description",
      max_marks: question.maxMarks || 100
    };
    
    // If you've also moved teacher reference files to Supabase, pass that URL too:
    if (question.referenceFile) aiPayload.reference_file_url = question.referenceFile;

    try {
      console.log("🤖 Sending cloud URL to AI Grader...");
      const aiResponse = await axios.post('process.env.AI_SERVICE_URL/analyze', aiPayload);
      aiData = aiResponse.data;
    } catch (aiError) {
      console.error("⚠️ AI Service Failed:", aiError.message);
    }

    // --- 3. SAVE TO MONGODB ---
    const submissionData = {
      student: studentId, 
      question: assignmentId,
      fileUrl: finalFileUrl, 
      obtainedMarks: aiData.score !== undefined ? aiData.score : null,
      aiAnalysis: Object.keys(aiData).length > 0 ? aiData : null,
      feedback: aiData.feedback || "Pending Teacher Review",
      status: Object.keys(aiData).length > 0 ? "AI-Graded" : "Pending"
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