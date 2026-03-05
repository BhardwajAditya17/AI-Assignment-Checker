import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubmissionById, updateSubmissionGrade } from "../../services/submissionService";

// Components
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

// Icons
import { 
  ArrowLeft, 
  ExternalLink, 
  Bot, 
  Award, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  FileText
} from "lucide-react";

// Access base URL from env
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002";

const GradeSubmission = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  
  const [manualGrade, setManualGrade] = useState("");
  const [manualFeedback, setManualFeedback] = useState("");

  useEffect(() => {
    const fetchSub = async () => {
      try {
        setLoading(true);
        const data = await getSubmissionById(submissionId);
        setSub(data);
        setManualGrade(data.obtainedMarks ?? "");
        setManualFeedback(data.feedback || "");
      } catch (err) { 
        console.error("Failed to load submission:", err);
        setMessage({ type: "error", text: "Failed to load submission data." });
      } finally { 
        setLoading(false); 
      }
    };
    fetchSub();
  }, [submissionId]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage(null);
      await updateSubmissionGrade(submissionId, { 
        obtainedMarks: Number(manualGrade), 
        feedback: manualFeedback 
      });
      
      setMessage({ type: "success", text: "Grade saved successfully!" });
      
      // Briefly show success before navigating back
      setTimeout(() => navigate(-1), 1000);
    } catch (err) { 
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to save grade." });
      setIsSaving(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar role="teacher" />
          <div className="flex-1 flex items-center justify-center p-10 flex-col text-gray-400">
            <Loader2 size={48} className="animate-spin mb-4 text-blue-500" />
            <p className="font-bold text-lg text-gray-600">Loading Student Submission...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar role="teacher" />
          <div className="flex-1 flex items-center justify-center p-10">
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex flex-col items-center max-w-md text-center">
              <AlertCircle size={48} className="mb-4 text-red-400" />
              <p className="font-bold text-xl mb-2">Submission Not Found</p>
              <button onClick={() => navigate(-1)} className="mt-4 text-red-600 font-bold hover:underline">Go Back</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Construct File URL
  const fileUrl = sub.fileUrl ? `${API_BASE_URL}/${sub.fileUrl}` : null;
  const isPdf = sub.fileUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role="teacher" />
        
        {/* Main Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 gap-4">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-200 shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none p-1 rounded-lg"
                title="Go Back"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none">
                  {sub.student?.name || "Student Submission"}
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-1 flex items-center gap-2">
                  <FileText size={14} /> {sub.question?.title || "Assignment Review"}
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="hidden md:flex items-center gap-2">
              {sub.obtainedMarks !== undefined && sub.obtainedMarks !== null ? (
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-200">
                  <CheckCircle2 size={16} /> Graded
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-amber-200">
                  Pending Review
                </span>
              )}
            </div>
          </div>

          {/* Split Screen Content Area */}
          <div className="flex flex-1 flex-col lg:flex-row gap-6 min-h-0">
            
            {/* LEFT: File Viewer */}
            <div className="flex-[3] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col min-h-0 overflow-hidden relative group">
              
              {/* Toolbar overlay */}
              <div className="absolute top-0 w-full bg-gradient-to-b from-black/50 to-transparent p-4 flex justify-end z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                {fileUrl && (
                  <a 
                    href={fileUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 bg-white/90 backdrop-blur text-gray-800 text-sm font-bold px-4 py-2 rounded-xl shadow-lg hover:bg-white transition-colors"
                  >
                    Open Original <ExternalLink size={16} />
                  </a>
                )}
              </div>

              <div className="flex-1 bg-gray-100 w-full h-full relative">
                {fileUrl ? (
                  isPdf ? (
                    // Reverted back to the object tag for PDFs
                    <object
                      data={fileUrl}
                      type="application/pdf"
                      className="absolute inset-0 w-full h-full object-contain"
                    >
                      <div className="flex flex-col items-center justify-center h-full w-full text-gray-500 bg-white">
                         <p className="mb-2 font-medium">Preview not available.</p>
                         <a href={fileUrl} className="text-blue-600 hover:text-blue-800 font-bold underline">Download File</a>
                      </div>
                    </object>
                  ) : (
                    <div className="absolute inset-0 overflow-auto flex items-center justify-center p-6">
                      <img 
                        src={fileUrl} 
                        alt="Student Work" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-sm bg-white"
                      />
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-gray-400 font-medium">
                    No file attached to this submission.
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: AI Insights & Grading Area */}
            <div className="flex-[2] flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
              
              {/* Premium AI Brain Box */}
              <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 rounded-2xl shadow-md border border-indigo-700 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 opacity-10">
                  <Bot size={160} />
                </div>
                
                <h4 className="flex items-center gap-2 text-indigo-300 uppercase text-xs font-bold tracking-widest mb-4">
                  <Bot size={16} /> AI Assistant Analysis
                </h4>
                
                <div className="flex items-end gap-3 mb-4">
                  <div className="text-5xl font-black leading-none">{sub.aiAnalysis?.score || 0}</div>
                  <div className="text-xl text-indigo-300 font-bold mb-1">/ {sub.question?.maxMarks || 100}</div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                  <p className="text-indigo-50 text-sm leading-relaxed">
                    {sub.aiAnalysis?.feedback || "No AI feedback available for this submission. Proceed with manual grading."}
                  </p>
                </div>
              </div>

              {/* Teacher Override / Manual Grading Box */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col shrink-0 mb-4">
                <h4 className="font-black text-gray-800 mb-6 flex items-center gap-2 text-lg">
                  <Award size={20} className="text-blue-500" />
                  Final Grade & Feedback
                </h4>

                {/* Status Message */}
                {message && (
                  <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-sm font-bold ${
                    message.type === "success" 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="mt-0.5">{message.text}</p>
                  </div>
                )}

                <div className="mb-5">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Final Marks
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={manualGrade}
                      onChange={(e) => setManualGrade(e.target.value)}
                      disabled={isSaving}
                      className="w-full pl-4 pr-16 py-3 border border-gray-200 bg-gray-50 rounded-xl text-xl font-black text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="0"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">
                      / {sub.question?.maxMarks || 100}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-400" /> 
                    Feedback to Student
                  </label>
                  <textarea 
                    rows="5"
                    value={manualFeedback}
                    onChange={(e) => setManualFeedback(e.target.value)}
                    disabled={isSaving}
                    className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all resize-none"
                    placeholder="Provide constructive feedback here..."
                  />
                </div>

                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-sm hover:shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Saving Grade...
                    </>
                  ) : (
                    "Confirm Final Grade"
                  )}
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GradeSubmission;