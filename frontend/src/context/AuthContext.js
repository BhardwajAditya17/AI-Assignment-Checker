import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile, loginUser, logoutUser } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (error) {
        console.error("Session expired");
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    const data = await loginUser(credentials);

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    const profile = await getUserProfile();
    setUser(profile);
    
    return data;
  };

  // Logout function
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth easily
export const useAuth = () => {
  return useContext(AuthContext);
};