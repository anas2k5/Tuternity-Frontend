import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ use your custom axios instance
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import AuthContainer from "../components/AuthContainer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setRole } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Using your api instance ensures interceptor adds Authorization token automatically later
      const res = await api.post("/auth/login", { email, password });

      const { token, role, name, id } = res.data;
      if (!token || !id) throw new Error("Invalid response from server.");

      // ✅ Save credentials in localStorage for persistence
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("profile", JSON.stringify({ email, name, role, id }));

      // ✅ Update global context
      setUser({ email, name, role, id });
      setRole(role);

      // ✅ Navigation logic (no axios global needed)
      if (role === "STUDENT" || role === "ROLE_STUDENT") navigate("/student");
      else if (role === "TEACHER" || role === "ROLE_TEACHER") navigate("/teacher");
      else if (role === "ADMIN" || role === "ROLE_ADMIN") navigate("/admin");
      else navigate("/not-authorized");
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-10 rounded-3xl text-white"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold drop-shadow-lg">TuterNity</h1>
          <p className="text-sm text-white/70 mt-1">Learn • Grow • Connect</p>
        </div>

        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <p className="bg-red-500/30 border border-red-400 text-red-100 text-center p-2 rounded mb-3">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="text-sm font-medium tracking-wide">Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 bg-white/20 text-white placeholder-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/30 transition"
            required
          />
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium tracking-wide">Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 bg-white/20 text-white placeholder-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/30 transition"
            required
          />
        </div>

        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 15px rgba(255,255,255,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          type="submit"
          className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition shadow-lg shadow-indigo-500/30"
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        <p className="text-center text-sm text-white/80 mt-5">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-white font-semibold underline hover:text-gray-200"
          >
            Sign Up
          </button>
        </p>
      </motion.form>
    </AuthContainer>
  );
}
