import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/common/ProtectedRoute";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";


import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentClassDetails from "./pages/Student/StudentClassDetails";
import UploadAssignment from "./pages/Student/UploadAssignment";
import StudentAssignmentView from "./pages/Student/StudentAssignmentView";

import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import CreateQuestion from "./pages/Teacher/CreateQuestion";
import GradeSubmission from "./pages/Teacher/GradeSubmission";
import TeacherAssignmentView from "./pages/Teacher/TeacherAssignmentView";
import SubmissionsList from "./pages/Teacher/SubmissionsList";
import ClassDetails from "./pages/Teacher/TeacherClassDetails";


import ResultsPage from "./pages/Results/ResultsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />



        <Route
          path="/student/class/:id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentClassDetails />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/upload/:assignmentId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <UploadAssignment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/assignment/:assignmentId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentAssignmentView />
            </ProtectedRoute>
          }
        />

        

        {/* Teacher Routes */}

        <Route path="/class/:id" element={<ClassDetails />} />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/class/:classId/create-assignment" element={<CreateQuestion />} />

        <Route
          path="/submissions/:assignmentId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <SubmissionsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grade/:submissionId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <GradeSubmission />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/assignment/:assignmentId"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherAssignmentView />
            </ProtectedRoute>
          }
        />

        



        {/* Results */}
        <Route
          path="/results"
          element={
            <ProtectedRoute allowedRoles={["student", "teacher"]}>
              <ResultsPage />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;