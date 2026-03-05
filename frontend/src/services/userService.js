import api from "./api";

// Login
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  // Store token
  localStorage.setItem("token", response.data.token);

  return response.data;
};

// Register
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// Get current user profile
export const getUserProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
};