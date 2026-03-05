// models/Submission.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    answerText: {
      type: String, 
      default: "" 
    },
    fileUrl: {
      type: String,
      default: ""
    },
    obtainedMarks: { // ✅ Changed 'marks' to 'obtainedMarks' to match the frontend and controller.
      type: Number,
      default: null, // ✅ Changed to null. 0 implies they got a zero, null implies pending.
    },
    feedback: {
      type: String,
      default: "Pending evaluation",
    },
    evaluatedAt: {
      type: Date,
    },
    aiAnalysis: {
      type: Object, 
      default: null // ✅ Null is better here too to indicate absence of data
    },
    status: {
      type: String,
      enum: ['Pending', 'AI-Graded', 'Reviewed'],
      default: 'Pending' 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);