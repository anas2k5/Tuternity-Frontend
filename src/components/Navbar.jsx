import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">SmartTutor</Link>
        {user?.role === "TEACHER" && <Link to="/teacher">Dashboard</Link>}
        {user?.role === "STUDENT" && <Link to="/student">Dashboard</Link>}
        {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm px-2 py-1 rounded bg-blue-700/30">{user.role}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <Link to="/" className="text-sm">Login</Link>
        )}
      </div>
    </nav>
  );
}
