// src/services/questionService.js
import api from "./api"; // Rely entirely on your custom axios instance

// Create a new question
export const createQuestion = async (formData) => {
  const token = localStorage.getItem("token"); 

  const response = await api.post(
    "/questions", // Matches the backend route without needing the hardcoded base URL
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "multipart/form-data", // Required for referenceFile uploads
      },
    }
  );
  return response.data;
};

// Get all questions (Admin/Debug mostly)
export const getAllQuestions = async () => {
  const response = await api.get("/questions");
  return response.data;
};

// Get single question by ID (Used by Student to see details)
export const getQuestionById = async (id) => {
  const response = await api.get(`/questions/${id}`);
  return response.data;
};

// Delete question
export const deleteQuestion = async (id) => {
  const response = await api.delete(`/questions/${id}`);
  return response.data;
};