import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { email, password, role });
      alert("Account created. Please login.");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full mb-3 p-2 border rounded" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full mb-3 p-2 border rounded" />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full mb-4 p-2 border rounded">
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
        </select>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
