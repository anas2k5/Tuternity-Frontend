import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, role, setUser, setRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔥 Scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

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
    } else {
      // Public navbar for landing page
      return [
        { name: "Home", path: "/" },
        { name: "Login", path: "/login" },
        { name: "Sign Up", path: "/register" },
      ];
    }
  };

  const isLanding =
    !role &&
    (location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/register");

  const activeClass = isLanding
    ? "text-indigo-600 font-semibold border-b-2 border-indigo-500"
    : "text-white font-semibold bg-white/20 px-3 py-1.5 rounded-lg shadow-md transition";

  const normalClass = isLanding
    ? "text-gray-600 hover:text-indigo-600 px-3 py-1.5 transition"
    : "text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition";

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        isLanding
          ? isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-md"
            : "bg-transparent"
          : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* ✅ Logo */}
        <Link
          to="/"
          className={`text-2xl font-extrabold tracking-wide ${
            isLanding ? "text-indigo-600" : "text-white"
          } hover:scale-105 transition`}
        >
          TuterNity
        </Link>

        {/* ✅ Desktop Navigation */}
        <div className="hidden md:flex items-center gap-5">
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

          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className={`${
                isLanding
                  ? "bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                  : "bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
              }`}
            >
              Logout
            </motion.button>
          )}
        </div>

        {/* ✅ Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ✅ Mobile Menu Drawer */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`md:hidden flex flex-col items-center gap-3 py-4 border-t ${
            isLanding
              ? "bg-white/90 text-gray-700 border-gray-200"
              : "bg-indigo-700 text-white border-indigo-500"
          }`}
        >
          {getLinks().map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-lg ${
                location.pathname === link.path ? activeClass : normalClass
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className={`${
                isLanding
                  ? "bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                  : "bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
              }`}
            >
              Logout
            </button>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
