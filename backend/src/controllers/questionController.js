const Question = require("../models/Question");

exports.createQuestion = async (req, res) => {
  try {
    const { title, description, maxMarks, deadline, classroomId } = req.body;

    if (!classroomId) {
      return res.status(400).json({ error: "Classroom ID is required." });
    }

    const newQuestion = await Question.create({
      title,
      description,
      maxMarks,
      deadline,
      classroom: classroomId,
      
      // ✅ FIX: Change 'teacher' to 'createdBy' to match your Schema error
      createdBy: req.user._id, 
      
      referenceFile: req.file ? req.file.path : null
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Create Question Error:", error);
    res.status(500).json({ error: error.message });
  }
};