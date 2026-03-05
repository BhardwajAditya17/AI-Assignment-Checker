import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getClassById } from "../../services/classService"; 

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

// Icons
import { 
  Plus, 
  Key, 
  BookOpen, 
  Calendar, 
  Award, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  Inbox,
  ArrowLeft,
  Users
} from "lucide-react";

const TeacherClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        const data = await getClassById(id);
        setClassData(data);
      } catch (err) {
        console.error("Failed to load class", err);
        setError("Could not load class details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClassData();
    } else {
      setError("No Class ID provided.");
      setLoading(false);
    }
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar role="teacher" />
          <div className="flex-1 flex items-center justify-center p-10 flex-col text-gray-400">
            <Loader2 size={48} className="animate-spin mb-4 text-blue-500" />
            <p className="font-bold text-lg text-gray-600">Loading Class Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !classData) {
    return (
      <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar role="teacher" />
          <div className="flex-1 flex items-center justify-center p-10">
            <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 flex flex-col items-center max-w-md text-center shadow-sm">
              <AlertCircle size={48} className="mb-4 text-red-400" />
              <h2 className="font-black text-2xl mb-2">Class Not Found</h2>
              <p className="font-medium mb-6">{error || "The class you are looking for does not exist."}</p>
              <button 
                onClick={() => navigate('/teacher')}
                className="px-6 py-2 bg-white border border-red-200 text-red-700 rounded-xl font-bold hover:bg-red-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
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
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">

            {/* Back Navigation */}
            <button 
              onClick={() => navigate('/teacher')}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium w-max transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 -ml-1"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>

            {/* Premium Header Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
              {/* Decorative background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl border border-blue-200">
                    <BookOpen size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                    {classData.name}
                  </h2>
                  <span className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-indigo-200 hidden sm:inline-block">
                    Section {classData.section || "N/A"}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-500 mt-2">
                  <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700">
                    <Key size={16} className="text-gray-400" />
                    <span>Join Code: <span className="font-black text-blue-600 ml-1 tracking-wide">{classData.joinCode}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Users size={16} />
                    <span>{classData.students?.length || 0} Students Enrolled</span>
                  </div>
                </div>
              </div>

              <Link 
                to={`/class/${id}/create-assignment`}
                className="relative z-10 shrink-0 bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 w-full md:w-auto"
              >
                <Plus size={20} /> Create Assignment
              </Link>
            </div>

            {/* Assignments Section */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                  <BookOpen size={20} className="text-blue-500" /> Class Assignments
                </h3>
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                  {classData.assignments?.length || 0} Total
                </span>
              </div>

              {classData.assignments && classData.assignments.length > 0 ? (
                <div className="grid gap-4">
                  {classData.assignments.map((assignment) => (
                    <div 
                      key={assignment._id} 
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md hover:border-blue-200 transition-all group"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors mb-1">
                          {assignment.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-red-400" />
                            Due: {new Date(assignment.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Award size={14} className="text-amber-500" />
                            {assignment.maxMarks} Marks
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Assuming /assignment/:id is the view we just built previously */}
                        <Link 
                          to={`/submissions/${assignment._id}`} 
                          className="flex items-center justify-center bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-bold px-5 py-2.5 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors text-sm w-full sm:w-auto outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          Manage <ChevronRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Inbox size={48} className="text-gray-400" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">No assignments yet</h4>
                  <p className="text-gray-500 mb-6 max-w-sm">
                    You haven't posted any work for this class. Create your first assignment to get started.
                  </p>
                  <Link 
                    to={`/class/${id}/create-assignment`}
                    className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} /> Add First Assignment
                  </Link>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherClassDetails;