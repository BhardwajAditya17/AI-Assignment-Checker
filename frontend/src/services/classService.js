import axios from "axios";

// 1. Use the environment variable, fallback to localhost for local testing
// Assuming your REACT_APP_API_URL is set to "https://your-backend.onrender.com/api" (or /api/v1)
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002/api";
const API_URL = `${BASE_URL}/classes`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) return {}; 
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const createClass = async (classData) => {
  const response = await axios.post(`${API_URL}/create`, classData, getAuthHeader());
  return response.data;
};

export const getMyClasses = async () => {
  const response = await axios.get(`${API_URL}/my-classes`, getAuthHeader());
  return response.data;
};

export const getClassById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};

export const joinClass = async (joinCode) => {
  // 2. Replaced the hardcoded localhost string here too!
  const response = await axios.post(
    `${API_URL}/join`, 
    { code: joinCode },
    getAuthHeader() 
  );
  return response.data;
};