import { Link, useNavigate } from "react-router-dom";
import { getJSON } from "../utils/storage";

export default function Navbar() {
  const navigate = useNavigate();
  const profile = getJSON("profile");
  const role = profile?.role || profile?.user?.role || "STUDENT"; // fallback
  const isTeacher = role.toUpperCase() === "TEACHER";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left Section - Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight hover:text-gray-200 transition"
        >
          Tuternity
        </Link>

        {/* Middle Section - Navigation Links */}
        <div className="flex items-center space-x-6 font-medium">
          {isTeacher ? (
            <>
              <Link
                to="/teacher"
                className="hover:text-gray-200 transition duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/teacher/bookings"
                className="hover:text-gray-200 transition duration-200"
              >
                My Bookings
              </Link>
              <Link
                to="/teacher/profile"
                className="hover:text-gray-200 transition duration-200"
              >
                Profile
              </Link>
              <Link
                to="/teacher/availability"
                className="hover:text-gray-200 transition duration-200"
              >
                Availability
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/student"
                className="hover:text-gray-200 transition duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/student/bookings"
                className="hover:text-gray-200 transition duration-200"
              >
                My Bookings
              </Link>
              <Link
                to="/student/find-tutors"
                className="hover:text-gray-200 transition duration-200"
              >
                Find Tutors
              </Link>
              <Link
                to="/student/profile"
                className="hover:text-gray-200 transition duration-200"
              >
                Profile
              </Link>
            </>
          )}
        </div>

        {/* Right Section - Role Badge + Logout */}
        <div className="flex items-center space-x-3">
          <span className="bg-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {isTeacher ? "TEACHER" : "STUDENT"}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
