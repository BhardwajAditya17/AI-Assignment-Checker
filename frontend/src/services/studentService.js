// src/services/studentService.js
import api from "./api"; // Your Axios instance with the interceptor

export const getStudentDashboard = async () => {
  // This endpoint should return { stats: {...}, assignments: [...] }
  const response = await api.get("/student/dashboard"); 
  return response.data;
};