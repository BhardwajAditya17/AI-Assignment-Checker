import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getQuestionById, deleteQuestion } from "../../services/questionService";

// Components
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

// Icons
import { 
  ArrowLeft, 
  ExternalLink, 
  Award, 
  Calendar, 
  FileText, 
  Trash2, 
  Edit3, 
  Users, 
  AlertCircle, 
  Loader2,
  X,
  CheckCircle2
} from "lucide-react";

// Access base URL from env with fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002";

const TeacherAssignmentView = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  
  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const data = await getQuestionById(assignmentId);
        setAssignment(data);
      } catch (err) {
        console.error("Error loading assignment", err);
        setError("Failed to load assignment details. It may have been deleted.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteQuestion(assignmentId);
      setShowDeleteModal(false);
      setMessage({ type: "success", text: "Assignment deleted successfully!" });
      
      // Briefly show success before navigating back
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error("Delete failed:", err);
      setMessage({ type: "error", text: "Failed to delete assignment." });
      setIsDeleting(false);
      setShowDeleteModal(false);
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
            <p className="font-bold text-lg text-gray-600">Loading Assignment Details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error / Not Found State
  if (error || !assignment) {
    return (
      <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar role="teacher" />
          <div className="flex-1 flex items-center justify-center p-10">
            <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 flex flex-col items-center max-w-md text-center shadow-sm">
              <AlertCircle size={48} className="mb-4 text-red-400" />
              <h2 className="font-black text-2xl mb-2">Assignment Not Found</h2>
              <p className="font-medium mb-6">{error || "This assignment does not exist or you don't have access to it."}</p>
              <button 
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-white border border-red-200 text-red-700 rounded-xl font-bold hover:bg-red-50 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // File Preview Logic
  const fileUrl = assignment.fileUrl ? `${API_BASE_URL}/${assignment.fileUrl}` : null;
  const isPdf = assignment.fileUrl?.toLowerCase().endsWith(".pdf");

  return (
    // ✅ Locked Layout
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden relative">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role="teacher" />
        
        <main className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 gap-4">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-200 shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none p-1 rounded-lg"
                title="Back to Class"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none">
                  Assignment Overview
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-1 flex items-center gap-2">
                  Control Panel
                </p>
              </div>
            </div>
          </div>

          {/* Status Message (Toast Replacement) */}
          {message && (
            <div className={`px-6 py-3 rounded-xl flex items-center gap-3 text-sm font-bold shrink-0 ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <p>{message.text}</p>
            </div>
          )}

          {/* Split Screen Content Area */}
          <div className="flex flex-1 flex-col lg:flex-row gap-6 min-h-0">
            
            {/* LEFT: Question Paper Preview */}
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
              
              <div className="flex-1 bg-gray-100 relative w-full h-full flex items-center justify-center">
                {fileUrl ? (
                  isPdf ? (
                    // Object Tag for PDF as requested
                    <object 
                      data={fileUrl} 
                      type="application/pdf" 
                      className="absolute inset-0 w-full h-full object-contain"
                    >
                      <div className="flex flex-col items-center justify-center h-full w-full bg-white text-gray-500">
                        <FileText size={48} className="mb-4 text-gray-300" />
                        <p className="font-medium mb-2">PDF Preview not supported in this browser.</p>
                        <a href={fileUrl} className="text-blue-600 font-bold hover:underline">Download Question Paper</a>
                      </div>
                    </object>
                  ) : (
                    <div className="absolute inset-0 overflow-auto flex items-center justify-center p-6">
                      <img 
                        src={fileUrl} 
                        alt="Question Paper" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-sm bg-white" 
                      />
                    </div>
                  )
                ) : (
                  <div className="text-center text-gray-400">
                    <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-bold">No reference file attached.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Management Console */}
            <div className="flex-[2] flex flex-col overflow-y-auto pr-2 custom-scrollbar">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col min-h-full">
                
                <div className="mb-8">
                   <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-3">
                     <FileText size={16} /> Assignment Details
                   </div>
                   <h1 className="text-3xl font-black text-gray-800 mb-2 leading-tight">{assignment.title}</h1>
                   <p className="text-gray-400 text-sm font-medium">
                     Created on {new Date(assignment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                   </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex flex-col justify-center">
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs font-bold uppercase mb-1">
                        <Award size={14} /> Max Marks
                      </span>
                      <span className="text-3xl font-black text-gray-800">{assignment.maxMarks}</span>
                   </div>
                   <div className="bg-red-50 p-5 rounded-xl border border-red-100 flex flex-col justify-center">
                      <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold uppercase mb-1">
                        <Calendar size={14} /> Deadline
                      </span>
                      <span className="text-xl font-black text-red-700">
                        {new Date(assignment.deadline).toLocaleDateString()}
                      </span>
                   </div>
                </div>

                {/* Description Area */}
                <div className="mb-8 flex flex-col flex-1">
                   <span className="text-gray-800 font-bold text-sm uppercase tracking-wide mb-3 block">
                     Instructions
                   </span>
                   <div className="text-gray-600 bg-gray-50 p-5 rounded-xl text-sm font-medium leading-relaxed border border-gray-100 flex-1 overflow-y-auto whitespace-pre-wrap">
                     {assignment.description || "No specific instructions provided for this assignment."}
                   </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-3 mt-auto shrink-0 border-t border-gray-100 pt-6">
                   <Link 
                     to={`/submissions/${assignmentId}`}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-xl shadow-sm hover:shadow font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                   >
                     <Users size={20} /> View Student Submissions
                   </Link>

                   <div className="flex gap-3 mt-2">
                     <button 
                       onClick={() => setMessage({ type: "error", text: "Editing assignments will be available in the next update!" })}
                       className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2"
                     >
                       <Edit3 size={18} /> Edit
                     </button>
                     <button 
                       onClick={() => setShowDeleteModal(true)}
                       className="flex-1 bg-white hover:bg-red-50 text-red-600 font-bold py-3 rounded-xl border border-gray-200 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
                     >
                       <Trash2 size={18} /> Delete
                     </button>
                   </div>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ✅ Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all animate-in zoom-in-95 duration-200 overflow-hidden">
            
            <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
              <div className="bg-red-100 text-red-600 p-3 rounded-full mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Delete Assignment?</h3>
              <p className="text-red-600 font-medium text-sm">
                This action cannot be undone. All associated student submissions and AI grades will be permanently deleted.
              </p>
            </div>
            
            <div className="p-6 flex gap-3 bg-gray-50">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-gray-700 font-bold bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <><Loader2 size={18} className="animate-spin" /> Deleting...</>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherAssignmentView;