import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestionById } from "../../services/questionService";
import { getMySubmissionForAssignment } from "../../services/submissionService"; // Ensure this exists
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar"; // Added Sidebar import

// Use env variable or fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002";

const StudentAssignmentView = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch text-based question details
        const questionData = await getQuestionById(assignmentId);
        setAssignment(questionData);

        // Try to fetch the student's submission for this question
        try {
          const subData = await getMySubmissionForAssignment(assignmentId);
          if (subData) {
            setSubmission(subData);
          }
        } catch (subErr) {
          // If 404/error, it means they haven't submitted yet.
          console.log("No submission found for this assignment yet.");
        }

      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId]);

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Assignment Details...</div>;
  if (!assignment) return <div className="p-10 text-center text-red-500">Assignment not found.</div>;

  // We only preview the SUBMISSION file
  const fileUrl = submission?.fileUrl ? `${API_BASE_URL}/${submission.fileUrl}` : null;
  const isPdf = fileUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Added flex wrapper to hold Sidebar and Main content side-by-side */}
      <div className="flex flex-1">
        
        {/* Added Sidebar */}
        <Sidebar />
        
        {/* Wrapped existing layout inside a flexible main container */}
        <main className="flex-1">
          <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-6 gap-6 h-[calc(100vh-80px)]">
            
            {/* LEFT: Submission File Preview Area */}
            <div className="flex-[3] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
              <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Your Uploaded Solution</h3>
                {fileUrl && (
                  <a href={fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline font-medium">
                    Open Original ↗
                  </a>
                )}
              </div>
              
              <div className="flex-1 bg-gray-200 relative">
                {fileUrl ? (
                  isPdf ? (
                    <object data={fileUrl} type="application/pdf" className="absolute inset-0 w-full h-full">
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p>Preview not supported.</p>
                        <a href={fileUrl} className="text-blue-500 underline font-bold">Download File</a>
                      </div>
                    </object>
                  ) : (
                    <img src={fileUrl} alt="Your Submission" className="absolute inset-0 w-full h-full object-contain" />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="font-medium text-lg text-gray-500">No solution uploaded yet.</p>
                    <p className="text-sm mt-1">Read the question on the right and upload your answer.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Question Details & Actions */}
            <div className="flex-[2] flex flex-col gap-6 overflow-y-auto pb-4">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                
                {/* Assignment Header */}
                <div className="mb-6">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${submission ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {submission ? "✓ Submitted" : "Pending"}
                  </span>
                  <h1 className="text-3xl font-black text-gray-800 mt-3 mb-2">{assignment.title}</h1>
                  <p className="text-gray-500 text-sm">
                    Posted on: {new Date(assignment.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Core Details */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600 font-medium">Max Marks</span>
                    <span className="font-bold text-gray-900">{assignment.maxMarks}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600 font-medium">Deadline</span>
                    <span className="font-bold text-red-600">
                      {new Date(assignment.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Question Text / Instructions */}
                  <div className="pt-2">
                    <span className="text-gray-600 font-bold block mb-2">Question / Instructions:</span>
                    <p className="text-gray-800 bg-gray-50 p-4 rounded-lg text-sm leading-relaxed border whitespace-pre-wrap">
                      {assignment.description || "No specific instructions provided."}
                    </p>
                  </div>

                  {/* Submission Specific Details (Only shows if submitted) */}
                  {submission && (
                    <div className="mt-6 pt-4 border-t-2 border-dashed">
                      <h4 className="font-bold text-gray-700 mb-3">Grading Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between bg-green-50 p-3 rounded">
                          <span className="text-green-800 font-medium">Submitted On</span>
                          <span className="font-bold text-green-900">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between bg-blue-50 p-3 rounded">
                          <span className="text-blue-800 font-medium">Your Grade</span>
                          <span className="font-black text-blue-900">
                            {submission.obtainedMarks !== null && submission.obtainedMarks !== undefined 
                              ? `${submission.obtainedMarks} / ${assignment.maxMarks}` 
                              : "Not Graded Yet"}
                          </span>
                        </div>
                        {/* Teacher Feedback */}
                        {submission.feedback && (
                          <div className="mt-2">
                            <span className="text-gray-600 font-medium block mb-1 text-sm">Teacher's Feedback:</span>
                            <p className="text-indigo-900 bg-indigo-50 p-3 rounded-lg text-sm italic border border-indigo-100">
                              "{submission.feedback}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                {!submission ? (
                  <button 
                    onClick={() => navigate(`/student/upload/${assignment._id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition transform active:scale-95"
                  >
                    Upload Solution 📤
                  </button>
                ) : (
                  <div className="w-full bg-gray-100 text-gray-500 text-center text-lg font-bold py-4 rounded-xl border border-gray-200 cursor-not-allowed">
                    Assignment Submitted
                  </div>
                )}
                
                <button 
                  onClick={() => navigate(-1)}
                  className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium"
                >
                  ← Back to Class
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentAssignmentView;