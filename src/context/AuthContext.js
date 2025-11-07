// src/context/AuthContext.js
import { createContext, useState, useEffect, useContext } from "react";
import { getJSON, setJSON, remove } from "../utils/storage";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(getJSON("profile"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [loading, setLoading] = useState(false);

  // ✅ Save to localStorage whenever state changes
  useEffect(() => {
    if (user) setJSON("profile", user);
    if (token) localStorage.setItem("token", token);
    if (role) localStorage.setItem("role", role);
  }, [user, token, role]);

  // ✅ Logout clears everything
  const logout = () => {
    remove("profile");
    remove("token");
    remove("role");
    setUser(null);
    setToken(null);
    setRole(null);
  };

  const value = {
    user,
    setUser,
    token,
    setToken,
    role,
    setRole,
    logout,
    loading,
    setLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ Custom hook for accessing Auth context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
