// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { getJSON, setJSON, remove as removeFromStorage } from "../utils/storage";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(getJSON("profile") || null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setJSON("profile", user);
    else removeFromStorage("profile");

    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");

    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    else localStorage.removeItem("refreshToken");

    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
  }, [user, accessToken, refreshToken, role]);

  const logout = () => {
    removeFromStorage("profile");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
  };

  const value = {
    user,
    setUser,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    role,
    setRole,
    logout,
    loading,
    setLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
