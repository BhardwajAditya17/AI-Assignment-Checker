// src/components/layout/Sidebar.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import { 
  LayoutDashboard, 
  FilePlus, 
  ClipboardCheck, 
  Home, 
  Award, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  BookOpen
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(true);

  // Fallback to "student" if user context isn't fully loaded yet
  const role = user?.role || "student"; 

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Reusable NavItem Component
  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
    
    return (
      <Link
        to={to}
        title={!isOpen ? label : ""}
        className={`
          flex items-center gap-3 p-3 mb-2 rounded-xl transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-blue-500
          ${isActive 
            ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50" 
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent"}
          ${!isOpen ? "justify-center" : "px-4"}
        `}
      >
        <Icon 
          size={20} 
          className={`flex-shrink-0 transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} 
        />
        
        <span 
          className={`font-medium whitespace-nowrap transition-all duration-300 ease-in-out
            ${isOpen ? "opacity-100 translate-x-0 w-auto" : "opacity-0 -translate-x-4 w-0 hidden"}
          `}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <aside 
      className={`
        bg-white min-h-screen border-r border-gray-200 flex flex-col shadow-sm
        transition-all duration-300 ease-in-out relative z-40
        ${isOpen ? "w-64" : "w-20"} 
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
        className="absolute -right-3.5 top-8 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50 hover:shadow outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-gray-500 transition-all z-50"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Header / Role Indicator */}
      <div className="h-20 flex items-center justify-center border-b border-gray-100/80 mb-6 px-4">
        <div className={`flex items-center gap-3 ${!isOpen && "justify-center"}`}>
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
            {role === "teacher" ? <BookOpen size={24} /> : <GraduationCap size={24} />}
          </div>
          {isOpen && (
            <div className="flex flex-col animate-fade-in">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Portal</span>
              <span className="text-sm font-bold text-gray-800 capitalize">{role}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {role === "teacher" ? (
          <>
            <NavItem to="/teacher" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/teacher/create" icon={FilePlus} label="Create Assignment" />
            <NavItem to="/teacher/submissions" icon={ClipboardCheck} label="Review Submissions" />
          </>
        ) : (
          <>
            <NavItem to="/student" icon={Home} label="Dashboard" />
            <NavItem to="/student/grades" icon={Award} label="My Grades" />
          </>
        )}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          title={!isOpen ? "Logout" : ""}
          className={`
            w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-red-500
            ${!isOpen ? "justify-center" : "px-4"}
          `}
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className={`font-medium whitespace-nowrap transition-all duration-300
            ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}
          `}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;