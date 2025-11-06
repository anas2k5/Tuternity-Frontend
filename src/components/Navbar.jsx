import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      {/* Left side - Logo and navigation links */}
      <div className="flex items-center gap-5">
        <Link to="/" className="font-bold text-lg hover:underline">
          Tuternity
        </Link>

        {/* 🧑‍🏫 Teacher Links */}
        {user?.role === "TEACHER" && (
          <>
            <Link to="/teacher" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/teacher/bookings" className="hover:underline">
              My Bookings
            </Link>
            <Link to="/teacher/profile" className="hover:underline">
              Profile
            </Link>
            <Link to="/teacher/availability" className="hover:underline">
              Availability
            </Link>
          </>
        )}

        {/* 🎓 Student Links */}
        {user?.role === "STUDENT" && (
          <>
            <Link to="/student" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/student/teachers" className="hover:underline">
              Browse Teachers
            </Link>
            <Link to="/student/bookings" className="hover:underline">
              My Bookings
            </Link>
            <Link to="/student/payments" className="hover:underline">
              Payment History
            </Link>
          </>
        )}

        {/* 🛡️ Admin Links */}
        {user?.role === "ADMIN" && (
          <Link to="/admin" className="hover:underline">
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Right side - Role badge and Logout */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm px-3 py-1 rounded bg-blue-700/30 font-semibold uppercase">
              {user.role}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-sm hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
