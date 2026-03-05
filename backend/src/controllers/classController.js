const Classroom = require("../models/Classroom");
const Question = require("../models/Question"); // 👈 THIS IS THE MISSING LINE!
const crypto = require("crypto");

// 1. Create Class
exports.createClass = async (req, res) => {
  try {
    const { name, section } = req.body;
    const joinCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    const newClass = await Classroom.create({
      name,
      section,
      teacher: req.user._id, 
      joinCode
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create class" });
  }
};

// 2. Join Class
exports.joinClass = async (req, res) => {
  try {
    const { code } = req.body;
    const classroom = await Classroom.findOne({ joinCode: code });

    if (!classroom) return res.status(404).json({ error: "Invalid Class Code" });

    if (classroom.students.includes(req.user._id)) {
      return res.status(400).json({ error: "You are already in this class" });
    }

    classroom.students.push(req.user._id);
    await classroom.save();

    res.status(200).json({ message: "Joined successfully", classroom });
  } catch (error) {
    res.status(500).json({ error: "Failed to join class" });
  }
};

// 3. Get My Classes
exports.getMyClasses = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "teacher") {
      query = { teacher: req.user._id };
    } else {
      query = { students: req.user._id };
    }

    const classes = await Classroom.find(query).populate("teacher", "name");
    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fetch failed" });
  }
};

// 4. Get Single Class (With Assignments)
exports.getClassById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id).populate("teacher", "name email");
    
    if (!classroom) {
      return res.status(404).json({ error: "Class not found" });
    }

    // ✅ This will work now because we imported 'Question' at the top
    const assignments = await Question.find({ classroom: req.params.id })
                                      .sort({ createdAt: -1 });

    res.json({ 
      ...classroom.toObject(), 
      assignments: assignments 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch class details" });
  }
};