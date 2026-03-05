import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyClasses, joinClass } from "../../services/classService";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { BookOpen, Plus, Loader2, AlertCircle, CheckCircle2, Users } from "lucide-react";

const StudentDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  
  // New UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const data = await getMyClasses();
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setIsJoining(true);
    setMessage({ type: "", text: "" });

    try {
      await joinClass(joinCode.toUpperCase());
      setMessage({ type: "success", text: "Successfully joined the class!" });
      setJoinCode("");
      fetchClasses(); // Refresh list automatically
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "Invalid class code. Please try again." 
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar />
      
      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            
            {/* Header & Join Form */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-black text-gray-800 tracking-tight">My Classrooms</h1>
                <p className="text-gray-500 mt-1">View and manage all your enrolled classes.</p>
              </div>
              
              <div className="flex flex-col items-end">
                <form onSubmit={handleJoin} className="flex gap-2 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="Enter Class Code" 
                    className="p-3 border border-gray-300 rounded-xl uppercase font-mono tracking-widest text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full md:w-64 shadow-sm"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    maxLength={10}
                    required
                  />
                  <button 
                    disabled={isJoining || !joinCode}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isJoining ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                    <span className="hidden sm:inline">Join</span>
                  </button>
                </form>

                {/* Inline Messages (Replaces Alert) */}
                {message.text && (
                  <div className={`mt-3 text-sm flex items-center gap-1.5 font-medium ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                    {message.text}
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
              // Loading State Skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : classes.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-3xl border border-gray-200 border-dashed p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-blue-50 p-4 rounded-full text-blue-500 mb-4">
                  <BookOpen size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Classes Yet</h3>
                <p className="text-gray-500 max-w-sm mb-6">
                  You haven't joined any classrooms. Ask your teacher for a class code and enter it above to get started.
                </p>
              </div>
            ) : (
              // Classes Grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <Link to={`/student/class/${cls._id}`} key={cls._id} className="group outline-none">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-blue-500 overflow-hidden flex flex-col h-full">
                      
                      {/* Card Header (Gradient) */}
                      <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-800 p-5 flex flex-col justify-end relative overflow-hidden">
                        {/* Decorative subtle pattern/circles */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                        
                        <div className="relative z-10 flex justify-between items-end">
                          <div>
                            <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-sm line-clamp-1">{cls.name}</h2>
                            <p className="text-blue-100 text-sm font-medium mt-1 opacity-90">{cls.section || "General"}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Body (Teacher Info) */}
                      <div className="p-5 flex items-center justify-between mt-auto bg-white">
                        <div className="flex items-center gap-3">
                          {/* Teacher Avatar Placeholder */}
                          <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-bold">
                            {cls.teacher?.name?.charAt(0).toUpperCase() || <Users size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{cls.teacher?.name || "Unknown Teacher"}</p>
                            <p className="text-xs text-gray-500 font-medium">Instructor</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;