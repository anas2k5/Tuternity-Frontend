import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedProfile = localStorage.getItem("profile");

    let parsedProfile = null;
    try {
      parsedProfile = storedProfile ? JSON.parse(storedProfile) : null;
    } catch {
      parsedProfile = null;
    }

    if (token && storedRole) {
      setUser(parsedProfile);
      setRole(storedRole);
    }

    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    window.location.href = "/";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <p className="text-lg font-semibold animate-pulse">
          Loading, please wait...
        </p>
      </div>
    );

  return (
    <AuthContext.Provider value={{ user, role, setUser, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
