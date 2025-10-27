import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [name, setName] = useState(""); // ⬅️ NEW STATE: Name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Input validation: ensure name is present
    if (!name.trim()) {
        setError("Name is required.");
        setLoading(false);
        return;
    }

    try {
      // ➡️ CRITICAL FIX: Include 'name' in the request body
      await api.post("/auth/register", { name, email, password, role });
      
      alert("Account created. Please login.");
      
      // Navigate to login page
      navigate("/", { replace: true }); 
      
    } catch (err) {
      console.error("Registration failed:", err);
      // Display the error message returned from the backend (if available)
      setError(err.response?.data?.error || "Registration failed. Try again."); 
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {error && (
          <p className="text-red-600 bg-red-100 p-2 rounded mb-3 text-center">
            {error}
          </p>
        )}

        {/* ⬅️ NEW INPUT FIELD: Full Name */}
        <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Full Name" 
            className="w-full mb-3 p-2 border rounded" 
            required 
        />

        <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            className="w-full mb-3 p-2 border rounded" 
            required 
        />
        <input 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            placeholder="Password" 
            className="w-full mb-3 p-2 border rounded" 
            required
        />
        <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            className="w-full mb-4 p-2 border rounded"
        >
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
        </select>
        <button 
            className="w-full bg-blue-600 text-white py-2 rounded" 
            disabled={loading}
        >
            {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}