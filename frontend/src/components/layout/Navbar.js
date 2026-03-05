// src/components/layout/Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Sparkles } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  // ✅ Use the actual user data from your context
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout(); // This handles clearing localStorage and state!
    navigate("/login");
  };

  // Safe fallbacks just in case context is still mounting
  const userName = user?.name || "Loading...";
  const userRole = user?.role || "User";
  const userInitials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-6 py-3 flex justify-between items-center h-16 sticky top-0 z-30">
      
      {/* Left Side: Brand Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
          <Sparkles size={20} />
        </div>
        <h1 className="text-xl font-black text-gray-800 tracking-tight hidden sm:block">
          AI<span className="text-blue-600 font-medium ml-1">Grader</span>
        </h1>
      </div>

      {/* Right Side: User Profile & Actions */}
      <div className="flex items-center gap-5">
        
        {/* User Info Capsule */}
        <div className="flex items-center gap-3 bg-gray-50 py-1.5 pl-4 pr-1.5 rounded-full border border-gray-100">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-700 leading-tight">{userName}</p>
            <p className="text-xs text-gray-500 font-medium capitalize">{userRole}</p>
          </div>
          
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border-2 border-white shadow-sm">
            {userInitials}
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg p-2"
          title="Logout"
        >
          <LogOut size={18} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;