import { Routes, Route } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import StudentDashboard from "../pages/Student/StudentDashboard";
import TeacherDashboard from "../pages/Teacher/TeacherDashboard";

function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default AppLayout;