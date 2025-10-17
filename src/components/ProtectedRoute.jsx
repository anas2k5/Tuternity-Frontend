import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { role: userRole } = useContext(AuthContext);

  const normalize = (r) =>
    r ? r.replace(/^ROLE_/, "").trim().toUpperCase() : "";

  if (!userRole) return <Navigate to="/" />;
  if (normalize(userRole) !== normalize(role))
    return <Navigate to="/not-authorized" />;

  return children;
};

export default ProtectedRoute;
