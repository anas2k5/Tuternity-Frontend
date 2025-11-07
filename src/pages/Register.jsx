import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import AuthContainer from "../components/AuthContainer";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      console.log("✅ Registration successful:", res.data);
      alert("✅ Account created successfully! Please login to continue.");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-10 rounded-3xl text-white"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold drop-shadow-lg">TuterNity</h1>
          <p className="text-sm text-white/70 mt-1">Learn • Grow • Connect</p>
        </div>

        <h2 className="text-3xl font-bold text-center mb-6">Create Account ✨</h2>

        {error && (
          <p className="bg-red-500/30 border border-red-400 text-red-100 text-center p-2 rounded mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm font-medium tracking-wide">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full mt-1 bg-white/20 text-white placeholder-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/30 transition"
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 bg-white/20 text-white placeholder-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/30 transition"
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium tracking-wide">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-1 bg-white/20 text-white placeholder-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/30 transition"
              required
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium tracking-wide">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 bg-white/20 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/30 transition"
            >
              <option value="STUDENT" className="bg-indigo-700">Student</option>
              <option value="TEACHER" className="bg-indigo-700">Teacher</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(255,255,255,0.6)" }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            type="submit"
            className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition shadow-lg shadow-indigo-500/30"
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-white/80 mt-5">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-white font-semibold underline hover:text-gray-200"
          >
            Login
          </button>
        </p>
      </motion.div>
    </AuthContainer>
  );
}
