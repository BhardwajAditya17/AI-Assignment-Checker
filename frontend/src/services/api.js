import axios from "axios";

const api = axios.create({
  baseURL: "process.env.REACT_APP_API_URL" || "http://localhost:5002/api/v1",
  // REMOVE the headers object from here!
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Ensure key matches your login logic ('token' or 'user' object)
  
  // If your login saves the whole user object:
  // const user = JSON.parse(localStorage.getItem("user"));
  // const token = user?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;