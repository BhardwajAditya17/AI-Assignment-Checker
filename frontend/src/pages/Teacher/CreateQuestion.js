import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { createQuestion } from "../../services/questionService"; 

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

// Icons
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Award, 
  UploadCloud, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  FileCheck
} from "lucide-react";

const CreateQuestion = () => {
  const navigate = useNavigate();
  const { classId } = useParams(); 

  // State Variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxMarks, setMaxMarks] = useState(100);
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null); 
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!classId) {
      setError("Class ID is missing. Please return to the class page and try again.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("maxMarks", maxMarks);
    formData.append("deadline", deadline);
    formData.append("classroomId", classId); 

    if (file) {
      formData.append("referenceFile", file);
    }

    try {
      await createQuestion(formData);
      setSuccess(true);
      
      // Briefly show success before navigating back
      setTimeout(() => {
        navigate(`/class/${classId}`); 
      }, 1500);
      
    } catch (err) {
      console.error("Creation failed", err);
      setError(err.response?.data?.message || "Failed to create assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Missing Class ID Edge Case
  if (!classId) {
    return (
      <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar role="teacher" />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 flex flex-col items-center max-w-md text-center shadow-sm">
              <AlertCircle size={48} className="mb-4 text-red-400" />
              <h2 className="font-black text-2xl mb-2">Missing Context</h2>
              <p className="font-medium mb-6">We don't know which class to add this assignment to.</p>
              <button 
                onClick={() => navigate('/teacher')}
                className="px-6 py-2 bg-white border border-red-200 text-red-700 rounded-xl font-bold hover:bg-red-50 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    // ✅ Locked layout wrapper
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role="teacher" />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
            
            {/* Header / Back Button */}
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => navigate(`/class/${classId}`)}
                className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none p-2 hover:bg-blue-50 rounded-xl"
                title="Go Back"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">Create New Assignment</h2>
                <p className="text-gray-500 font-medium mt-1">Draft a new task and upload reference materials</p>
              </div>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start gap-3 mb-6 font-medium">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-start gap-3 mb-6 font-medium">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                <p>Assignment Created Successfully! Redirecting...</p>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-6">
              
              {/* Title Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Assignment Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FileText size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-800"
                    placeholder="e.g. Week 1: Data Structures Quiz"
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Instructions / Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-800 resize-none"
                  placeholder="Provide detailed instructions for the students here..."
                  required
                  disabled={loading || success}
                />
              </div>

              {/* 2-Column Grid for Marks & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Max Marks <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Award size={18} />
                    </div>
                    <input 
                      type="number" 
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                      min="1"
                      required
                      disabled={loading || success}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Calendar size={18} />
                    </div>
                    <input 
                      type="date" 
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                      required
                      disabled={loading || success}
                    />
                  </div>
                </div>
              </div>

              {/* Advanced File Upload Dropzone */}
              <div className="mt-4 pt-6 border-t border-gray-100">
                <label className="block text-sm font-bold text-indigo-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                  📄 Upload Reference Answer Key <span className="text-gray-400 normal-case font-normal">(Optional)</span>
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Upload a PDF containing the correct answers. This helps AI grading accuracy.
                </p>
                
                <div className="relative">
                  <input 
                    type="file" 
                    id="file-upload"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    disabled={loading || success}
                  />
                  <label 
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      file ? "border-indigo-400 bg-indigo-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-indigo-300"
                    }`}
                  >
                    {file ? (
                      <div className="flex flex-col items-center text-indigo-600">
                        <FileCheck size={32} className="mb-2" />
                        <span className="font-bold text-sm">{file.name}</span>
                        <span className="text-xs text-indigo-400 mt-1">Click to replace</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-500">
                        <UploadCloud size={32} className="mb-2 text-gray-400" />
                        <span className="font-bold text-sm">Click to upload PDF</span>
                        <span className="text-xs text-gray-400 mt-1">Maximum file size: 10MB</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading || success}
                className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-sm hover:shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Publishing...
                  </>
                ) : (
                  "Create Assignment"
                )}
              </button>

            </form>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateQuestion;