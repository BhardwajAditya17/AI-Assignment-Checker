import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyClasses, createClass } from "../../services/classService"; 

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

// Icons
import { 
  Plus, 
  Users, 
  BookOpen, 
  Key, 
  ArrowRight, 
  X, 
  Loader2,
  AlertCircle
} from "lucide-react";

const TeacherDashboard = () => {
  const { user } = useAuth();
  
  // State
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Form State for New Class
  const [newClass, setNewClass] = useState({ name: "", section: "" });

  // Fetch Classes on Load
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await getMyClasses();
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes", error);
      setError("Failed to load your classes. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await createClass(newClass);
      setShowModal(false);
      setNewClass({ name: "", section: "" }); // Reset form
      fetchClasses(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Error creating class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal handler to clear errors
  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setNewClass({ name: "", section: "" });
  };

  return (
    // ✅ Locked layout wrapper matching the rest of the application
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Left Sidebar */}
        <Sidebar role="teacher" />

        {/* Scrolling Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">My Classes</h2>
                <p className="text-gray-500 mt-1 font-medium">
                  Manage your classrooms, students, and assignments
                </p>
              </div>
              
              <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-sm hover:shadow active:scale-95 flex items-center gap-2 font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <Plus size={20} />
                Create New Class
              </button>
            </div>

            {/* Dashboard Level Error */}
            {error && !showModal && (
               <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 mb-6">
                 <AlertCircle size={20} />
                 <p className="font-medium">{error}</p>
               </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl h-56 border border-gray-200"></div>
                ))}
              </div>
            ) : (
              <>
                {classes.length === 0 ? (
                  // Empty State
                  <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="bg-blue-50 p-5 rounded-full mb-4">
                      <BookOpen size={48} className="text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No classes yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">You haven't created any classes. Create your first class to start inviting students and posting assignments.</p>
                    <button 
                      onClick={() => setShowModal(true)} 
                      className="text-blue-600 font-bold hover:text-blue-800 bg-blue-50 px-6 py-3 rounded-xl transition-colors"
                    >
                      + Create your first class
                    </button>
                  </div>
                ) : (
                  // Grid of Class Cards
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                      <div key={cls._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-200 overflow-hidden flex flex-col group">
                        
                        {/* Card Header Gradient */}
                        <div className="h-4 bg-gradient-to-r from-blue-500 to-indigo-600 w-full group-hover:h-5 transition-all"></div>
                        
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <h3 className="text-xl font-bold text-gray-800 line-clamp-2" title={cls.name}>
                              {cls.name}
                            </h3>
                          </div>
                          <p className="text-gray-500 text-sm font-medium mb-6">
                            {cls.section || "No Section"}
                          </p>
                          
                          <div className="mt-auto flex items-center justify-between text-gray-500 text-sm font-medium bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-1.5" title="Enrolled Students">
                              <Users size={16} className="text-blue-500" />
                              <span>{cls.students?.length || 0} Students</span>
                            </div>
                            <div className="flex items-center gap-1.5" title="Class Join Code">
                              <Key size={16} className="text-amber-500" />
                              <span className="font-mono text-gray-700 bg-white px-1.5 py-0.5 rounded border border-gray-200 shadow-sm">{cls.joinCode}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                          <Link 
                            to={`/class/${cls._id}`} 
                            className="flex items-center justify-between text-blue-600 font-bold text-sm hover:text-blue-800 group/link"
                          >
                            Enter Classroom
                            <ArrowRight size={16} className="transform group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* 3. Create Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-2xl font-black text-gray-800">Create New Class</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleCreateClass} className="overflow-y-auto p-6 flex flex-col gap-5">
              
              {/* Modal Level Error */}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 text-sm font-medium flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-2 font-bold text-sm">Class Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
                  placeholder="e.g. Computer Science 101"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  required 
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-bold text-sm">Section <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input 
                  type="text" 
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
                  placeholder="e.g. Batch A"
                  value={newClass.section}
                  onChange={(e) => setNewClass({...newClass, section: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !newClass.name.trim()}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Class"
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;