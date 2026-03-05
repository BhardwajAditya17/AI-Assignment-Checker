import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadSubmission } from "../../services/submissionService";

// Components
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
// import Card from "../../components/common/Card"; // Replaced with inline Tailwind for premium UI
// import Button from "../../components/common/Button"; // Replaced with inline Tailwind for premium UI

// Icons
import { 
  ArrowLeft, 
  UploadCloud, 
  File as FileIcon, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

const UploadAssignment = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // --- File Handling Logic ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Drag & Drop Logic ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setMessage(null);
    }
  };

  // --- Upload Logic ---
  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select a file first." });
      return;
    }

    if (!assignmentId) {
      setMessage({ type: "error", text: "Error: No assignment ID found." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("assignmentId", assignmentId);
      formData.append("answerText", "Submission for " + assignmentId);

      await uploadSubmission(formData);

      setMessage({ type: "success", text: "Assignment uploaded successfully!" });

      // Redirect back to dashboard after a short delay
      setTimeout(() => navigate("/student"), 1500);

    } catch (error) {
      console.error("Upload failed", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Upload failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to format file size beautifully
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    // ✅ Locked layout so only the main content area scrolls
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-2xl mx-auto">
            
            {/* ✅ Fixed Back Navigation */}
            <button 
              onClick={() => navigate(`/student/assignment/${assignmentId}`)}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-6 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Assignment
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="border-b border-gray-100 p-6 md:p-8 bg-gray-50/50">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                  Submit Assignment
                </h2>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  Reference ID: <span className="font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">{assignmentId}</span>
                </p>
              </div>

              <div className="p-6 md:p-8">
                {/* Status Message */}
                {message && (
                  <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {message.type === "success" ? <CheckCircle2 size={20} className="text-green-500 mt-0.5" /> : <AlertCircle size={20} className="text-red-500 mt-0.5" />}
                    <p className="mt-0.5">{message.text}</p>
                  </div>
                )}

                {/* Drag & Drop Upload Area */}
                {!file ? (
                  <div 
                    className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 ease-in-out flex flex-col items-center justify-center min-h-[280px]
                      ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      title=""
                    />
                    <div className={`bg-white p-4 rounded-full shadow-sm mb-4 transition-colors ${dragActive ? 'text-blue-600' : 'text-gray-400'}`}>
                      <UploadCloud size={40} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Click to upload or drag and drop</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                      PDF, DOCX, TXT, or ZIP files allowed. Max file size 10MB.
                    </p>
                  </div>
                ) : (
                  // File Selected View
                  <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-xl flex-shrink-0">
                        <FileIcon size={28} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-800 truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={removeFile}
                      disabled={loading}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                      title="Remove file"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}

                {/* Submit Action */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className={`
                      px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-200 shadow-sm
                      ${loading || !file 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" 
                        : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow active:scale-95"
                      }
                    `}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Submit Assignment"
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadAssignment;