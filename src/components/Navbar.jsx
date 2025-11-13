import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Menu, X, Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { user, role, setUser, setRole } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const getLinks = () => {
    const r = role?.replace(/^ROLE_/, "").toUpperCase();

    if (r === "TEACHER") {
      return [
        { name: "Dashboard", path: "/teacher" },
        { name: "My Bookings", path: "/teacher/bookings" },
        { name: "Profile", path: "/teacher/profile" },
        { name: "Availability", path: "/teacher/availability" },
      ];
    }
    if (r === "STUDENT") {
      return [
        { name: "Dashboard", path: "/student" },
        { name: "My Bookings", path: "/student/bookings" },
        { name: "Find Tutors", path: "/student/find-tutors" },
        { name: "Profile", path: "/student/profile" },
      ];
    }
    if (r === "ADMIN") {
      return [{ name: "Dashboard", path: "/admin" }];
    }
    return [
      { name: "Home", path: "/" },
      { name: "Features", path: "/#features" },
      { name: "Login", path: "/login" },
      { name: "Sign Up", path: "/register" },
    ];
  };

  const active = (p) => location.pathname === p;

  // close avatar dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setAvatarOpen(false);
  }, [location.pathname]);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="fixed top-4 left-0 right-0 z-50 px-5"
    >
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between rounded-2xl px-6 py-3 transition-all backdrop-blur-xl shadow-lg border
          ${
            theme === "light"
              ? "bg-white/70 border-white/40"
              : "bg-[#0f1225]/60 border-white/10 shadow-[0_0_25px_rgba(120,80,255,0.25)]"
          }
        `}
      >
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          TuterNity
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6">
          {getLinks().map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                active(l.path)
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : theme === "light"
                  ? "text-gray-700 hover:text-purple-600"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {l.name}
            </Link>
          ))}

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition ${
              theme === "dark"
                ? "bg-white/10 text-yellow-300 hover:bg-white/20"
                : "bg-gray-200 text-purple-600 hover:bg-gray-300"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Avatar dropdown (replaces visible logout button) */}
          {user && (
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setAvatarOpen((s) => !s)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold shadow hover:opacity-95 transition"
                aria-label="Open profile menu"
              >
                {userInitial}
              </button>

              {avatarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`absolute right-0 mt-3 w-44 rounded-xl shadow-xl backdrop-blur-xl border
                    ${theme === "light" ? "bg-white/80 border-white/30" : "bg-[#0b1220]/80 border-white/10"}
                    z-50 overflow-hidden`}
                >
                  <Link
                    to="/student/profile"
                    onClick={() => setAvatarOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-white/5"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/student/bookings"
                    onClick={() => setAvatarOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-white/5"
                  >
                    My Bookings
                  </Link>

                  <div className="border-t border-white/10" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/5"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* keep a logout button visible when there is no profile (guest) */}
          {!user && (
            <Link
              to="/login"
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-medium shadow hover:bg-red-600"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="md:hidden text-gray-800 dark:text-white"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`md:hidden mt-2 rounded-2xl p-4 backdrop-blur-xl shadow-xl border
            ${
              theme === "light"
                ? "bg-white/70 border-white/40 text-gray-800"
                : "bg-[#0f1225]/60 border-white/10 text-white"
            }
        `}
        >
          <div className="flex flex-col gap-3">
            {getLinks().map((l) => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setMenuOpen(false)}
                className={`py-2 px-3 rounded-lg ${
                  active(l.path)
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {l.name}
              </Link>
            ))}

            <button
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className="mt-2 p-2 rounded-full self-start bg-white/20 dark:bg-white/10 text-purple-600 dark:text-yellow-300"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg text-center"
              >
                Login
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
