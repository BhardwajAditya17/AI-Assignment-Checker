const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    
    // ✅ NEW FIELD: Total marks for the assignment
    maxMarks: { type: Number, required: true, default: 100 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // The Teacher's "Answer Key" file
    referenceFileUrl: { type: String, default: "" }, 
    
    deadline: { type: Date },

    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);