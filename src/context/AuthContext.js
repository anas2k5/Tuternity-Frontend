import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ New loading state

  // ✅ Load user from localStorage on first render
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const profile = localStorage.getItem("profile");

    if (token && role) {
      setUser({
        token,
        role,
        profile: profile ? JSON.parse(profile) : null,
      });
    }

    setLoading(false); // ✅ Done loading from storage
  }, []);

  // ✅ Login method
  const login = useCallback(({ token, role, profile = null }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (profile) localStorage.setItem("profile", JSON.stringify(profile));

    setUser({ token, role, profile });
  }, []);

  // ✅ Logout method
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("profile");
    setUser(null);
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
