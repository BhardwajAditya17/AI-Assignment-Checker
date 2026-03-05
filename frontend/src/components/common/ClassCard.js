import React from "react";
import { Link } from "react-router-dom";

const ClassCard = ({ classData, role }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
           <h3 className="text-xl font-bold text-gray-800">{classData.name}</h3>
           <p className="text-sm text-gray-500">{classData.section}</p>
        </div>
        {role === "teacher" && (
           <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-mono">
             Code: {classData.joinCode}
           </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">
           {classData.students?.length || 0} Students
        </span>
        
        <Link 
          to={`/class/${classData._id}`} 
          className="text-blue-600 font-semibold text-sm hover:underline"
        >
          View Class →
        </Link>
      </div>
    </div>
  );
};

export default ClassCard;