import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSubmissionsByAssignment } from "../../services/submissionService";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

// Icons
import { 
  ArrowLeft, 
  AlertCircle, 
  Users, 
  Award, 
  FileText, 
  CheckCircle2, 
  Clock,
  SearchX
} from "lucide-react";

const SubmissionsList = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({ assignment: null, submissions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assignmentId) {
      setError("Invalid URL: Assignment ID is missing.");
      setLoading(false);
      return;
    }

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const result = await getSubmissionsByAssignment(assignmentId);
        setData(result);
      } catch (err) {
        console.error("Error loading submissions:", err);
        setError(err.response?.data?.message || err.message || "Failed to load submission data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [assignmentId]);

  // Helper to format date cleanly
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    // ✅ Locked layout wrapper: full-width Navbar, side-by-side Sidebar and Main
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar role="teacher" />

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            
            {/* Back Navigation */}
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-6 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 w-max"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Assignment
            </button>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex flex-col items-center justify-center text-center min-h-[300px]">
                <AlertCircle size={48} className="mb-4 text-red-400" />
                <h2 className="font-black text-2xl mb-2">Oops! Something went wrong.</h2>
                <p className="font-medium bg-white px-4 py-2 rounded-lg border border-red-100 mt-2">{error}</p>
                <p className="mt-4 text-sm text-red-400 font-mono">ID: {assignmentId || "undefined"}</p>
              </div>
            )}

            {/* Loading State Skeleton */}
            {loading && !error && (
              <div className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-2xl mb-6 w-full"></div>
                <div className="h-[400px] bg-white border border-gray-200 rounded-2xl w-full"></div>
              </div>
            )}

            {/* Main Content */}
            {!loading && !error && (
              <>
                {/* Header Dashboard */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm tracking-wide uppercase mb-2">
                      <FileText size={16} />
                      Assignment Submissions
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                      {data.assignment?.title || "Loading Title..."}
                    </h2>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-gray-50 px-5 py-3 rounded-xl border border-gray-100">
                      <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Max Marks</span>
                      <span className="font-black text-xl text-gray-800 flex items-center gap-2">
                        <Award size={18} className="text-blue-500" />
                        {data.assignment?.maxMarks || "-"}
                      </span>
                    </div>
                    <div className="bg-blue-50 px-5 py-3 rounded-xl border border-blue-100">
                      <span className="text-blue-600/80 text-xs font-bold uppercase block mb-1">Submitted</span>
                      <span className="font-black text-xl text-blue-800 flex items-center gap-2">
                        <Users size={18} className="text-blue-500" />
                        {data.submissions?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submissions Table Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                      <thead className="bg-gray-50/80 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Student</th>
                          <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Submitted Date</th>
                          <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Score</th>
                          <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.submissions && data.submissions.length > 0 ? (
                          data.submissions.map((sub) => {
                            // Check if graded
                            const isGraded = sub.obtainedMarks !== undefined && sub.obtainedMarks !== null;

                            return (
                              <tr key={sub._id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    {/* Avatar Initial */}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
                                      {sub.student?.name ? sub.student.name.charAt(0).toUpperCase() : "?"}
                                    </div>
                                    <div>
                                      <p className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                                        {sub.student?.name || "Unknown Student"}
                                      </p>
                                      <p className="text-xs font-medium text-gray-400">
                                        {sub.student?.email || "No email provided"}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                  {formatDate(sub.createdAt)}
                                </td>
                                
                                <td className="px-6 py-4">
                                  {isGraded ? (
                                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                                      <CheckCircle2 size={14} /> Graded
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                                      <Clock size={14} /> Pending Review
                                    </span>
                                  )}
                                </td>
                                
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-lg font-black text-sm ${isGraded ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-gray-400'}`}>
                                    {isGraded ? `${sub.obtainedMarks} / ${data.assignment?.maxMarks}` : "-"}
                                  </span>
                                </td>
                                
                                <td className="px-6 py-4 text-right">
                                  <Link 
                                    to={`/grade/${sub._id}`} 
                                    className={`inline-flex items-center justify-center px-5 py-2 rounded-xl text-sm font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 active:scale-95
                                      ${isGraded 
                                        ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                      }`}
                                  >
                                    {isGraded ? 'View Grade' : 'Review & Grade'}
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center justify-center text-gray-400">
                                <div className="bg-gray-50 p-4 rounded-full mb-3">
                                  <SearchX size={32} />
                                </div>
                                <p className="font-bold text-lg text-gray-600 mb-1">No Submissions Yet</p>
                                <p className="text-sm">Students haven't uploaded any work for this assignment.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubmissionsList;