import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getClassById } from "../../services/classService";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Clock, 
  BookOpen, 
  User, 
  Loader2 
} from "lucide-react";

const StudentClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getClassById(id);
        setClassData(data);
      } catch (err) {
        console.error("Failed to load class details:", err);
        setError("Failed to load classroom data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            
            {/* Back Navigation */}
            <button 
              onClick={() => navigate('/student')}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-6 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>

            {/* ERROR STATE */}
            {error && (
              <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-lg mb-2">Oops!</p>
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-100 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* LOADING STATE */}
            {isLoading && !error && (
              <div className="animate-pulse">
                {/* Hero Skeleton */}
                <div className="h-40 bg-gray-200 rounded-3xl mb-10 w-full"></div>
                {/* Title Skeleton */}
                <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                {/* Cards Skeleton */}
                <div className="space-y-4">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="h-24 bg-gray-200 rounded-xl w-full"></div>
                  ))}
                </div>
              </div>
            )}

            {/* MAIN CONTENT */}
            {!isLoading && !error && classData && (
              <>
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-3xl p-8 md:p-10 mb-10 text-white shadow-lg relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-blue-100 font-medium mb-3 tracking-wide uppercase text-sm">
                      <BookOpen size={16} />
                      <span>{classData.section || "Classroom"}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-sm">
                      {classData.name}
                    </h1>
                    <div className="flex items-center gap-2 text-blue-50 font-medium opacity-90">
                      <User size={18} />
                      <p>Instructor: <span className="font-bold">{classData.teacher?.name || "Unknown"}</span></p>
                    </div>
                  </div>
                </div>

                {/* Assignments Section */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Class Assignments</h3>
                  <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                    {classData.assignments?.length || 0} Total
                  </span>
                </div>
                
                {/* Empty State vs List */}
                {(!classData.assignments || classData.assignments.length === 0) ? (
                  <div className="bg-white rounded-2xl border border-gray-200 border-dashed p-12 text-center flex flex-col items-center justify-center">
                    <div className="bg-gray-50 p-4 rounded-full text-gray-400 mb-4">
                      <FileText size={40} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-700 mb-2">No Assignments Yet</h4>
                    <p className="text-gray-500 max-w-sm">
                      Your teacher hasn't posted any work for this class. Check back later!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {classData.assignments.map((asm) => {
                      // Basic logic to check if deadline has passed (optional styling)
                      const isPastDue = new Date(asm.deadline) < new Date();

                      return (
                        <div 
                          key={asm._id} 
                          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 mt-1">
                              <FileText size={24} />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors">
                                {asm.title}
                              </h4>
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                                <span className={`flex items-center gap-1.5 font-medium ${isPastDue ? 'text-red-500' : 'text-gray-500'}`}>
                                  <Clock size={14} />
                                  Due: {formatDate(asm.deadline)}
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                                  <BookOpen size={14} />
                                  {asm.maxMarks} Marks
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <Link 
                            to={`/student/assignment/${asm._id}`}
                            className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center whitespace-nowrap active:scale-95"
                          >
                            View Details
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentClassDetails;