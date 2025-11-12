import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, role, setUser, setRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Logout function — clears both access + refresh tokens
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("profile");
    localStorage.removeItem("role");

    setUser(null);
    setRole(null);

    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // ✅ Role-based links
  const getLinks = () => {
    const normalizedRole = role?.replace(/^ROLE_/, "").toUpperCase();

    if (normalizedRole === "TEACHER") {
      return [
        { name: "Dashboard", path: "/teacher" },
        { name: "My Bookings", path: "/teacher/bookings" },
        { name: "Profile", path: "/teacher/profile" },
        { name: "Availability", path: "/teacher/availability" },
      ];
    } else if (normalizedRole === "STUDENT") {
      return [
        { name: "Dashboard", path: "/student" },
        { name: "My Bookings", path: "/student/bookings" },
        { name: "Find Tutors", path: "/student/find-tutors" },
        { name: "Profile", path: "/student/profile" },
      ];
    } else if (normalizedRole === "ADMIN") {
      return [{ name: "Dashboard", path: "/admin" }];
    }
    return [];
  };

  const activeClass =
    "text-white font-semibold bg-white/20 px-3 py-1.5 rounded-lg shadow-md transition";
  const normalClass =
    "text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition";

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* ✅ Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white tracking-wide hover:scale-105 transition"
        >
          Tutenity
        </Link>

        {/* ✅ Navigation Links */}
        <div className="hidden md:flex items-center gap-3">
          {getLinks().map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={
                location.pathname === link.path ? activeClass : normalClass
              }
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ✅ Role Badge + Logout */}
        <div className="flex items-center gap-3">
          {role && (
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
              {role.replace(/^ROLE_/, "")}
            </span>
          )}

          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </motion.button>
          ) : (
            <Link
              to="/login"
              className="bg-white/20 text-white px-4 py-1.5 rounded-lg hover:bg-white/30 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
