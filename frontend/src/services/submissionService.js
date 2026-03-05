// src/services/submissionService.js
import axios from "axios";

// Fallback added in case REACT_APP_API_URL is missing
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002";
const API_URL = `${BASE_URL}/api/submissions`;

// Centralized auth header generation
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // Unified to match your AuthContext
  if (!token) return {}; 
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ==========================================
// STUDENT FUNCTIONS
// ==========================================

export const submitAssignment = async (formData) => {
  // Uses the centralized header; Axios handles the multipart boundary automatically
  const response = await axios.post(`${API_URL}/submit`, formData, getAuthHeader());
  return response.data;
};

// Alias
export const uploadSubmission = submitAssignment;

export const getMySubmissionForAssignment = async (assignmentId) => {
  const response = await axios.get(`${API_URL}/my-submission/${assignmentId}`, getAuthHeader());
  return response.data;
};

export const getSubmissionDetails = async (submissionId) => {
  const response = await axios.get(`${API_URL}/${submissionId}`, getAuthHeader());
  return response.data;
};

// ==========================================
// TEACHER FUNCTIONS
// ==========================================

export const getSubmissionsByAssignment = async (assignmentId) => {
  const response = await axios.get(`${API_URL}/assignment/${assignmentId}`, getAuthHeader());
  return response.data;
};

// Alias
export const getAllSubmissions = getSubmissionsByAssignment;

export const getSubmissionById = async (submissionId) => {
  const response = await axios.get(`${API_URL}/${submissionId}`, getAuthHeader());
  return response.data;
};

export const updateSubmissionGrade = async (submissionId, gradeData) => {
  const response = await axios.put(`${API_URL}/${submissionId}/grade`, gradeData, getAuthHeader());
  return response.data;
};

// Alias
export const updateSubmission = updateSubmissionGrade;