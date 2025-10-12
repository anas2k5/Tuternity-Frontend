import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);

  // ✅ Wait until user is loaded from localStorage
  if (loading) return null; // or a spinner UI

  // ✅ If not logged in, redirect to home/login
  if (!user) return <Navigate to="/" replace />;

  // ✅ Role-based protection
  if (role) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(user.role)) {
      return <Navigate to="/not-authorized" replace />;
    }
  }

  // ✅ Access granted
  return children;
}
