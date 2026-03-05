const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "CS 101"
  section: { type: String }, // e.g., "Section A"
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
  // A unique code for students to join (e.g., "XKY-123")
  joinCode: { type: String, unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Classroom", classroomSchema);