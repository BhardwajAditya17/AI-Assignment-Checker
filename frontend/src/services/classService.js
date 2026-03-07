import axios from "axios";

const API_URL = "http://localhost:5002/api/classes";

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
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `http://localhost:5002/api/classes/join`, 
    { code: joinCode },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};