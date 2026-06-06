import { createContext, useState, useEffect, useContext } from "react";
import apiClient from "../services/apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ childern }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ authenticated: true });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        setUser({ authenticated: true });
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid login credentials",
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      await apiClient.post("/auth/register", { username, email, password });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registrationfailed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && childern}
    </AuthContext.Provider>
  );
};
