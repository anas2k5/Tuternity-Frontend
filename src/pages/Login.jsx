// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import toast from "react-hot-toast";
import AuthContainer from "../components/AuthContainer";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { setUser, setRole, setAccessToken, setRefreshToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { accessToken, refreshToken, role, name, id } = res.data;

      setAccessToken?.(accessToken);
      setRefreshToken?.(refreshToken);
      setUser?.({ email, name, role, id });
      setRole?.(role);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("profile", JSON.stringify({ email, name, role, id }));

      toast.success("Welcome back! 🎉");

      if (role.includes("STUDENT")) navigate("/student");
      else if (role.includes("TEACHER")) navigate("/teacher");
      else if (role.includes("ADMIN")) navigate("/admin");
      else navigate("/");

    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quotes = [
    "“The beautiful thing about learning is that no one can take it away from you.” — B.B. King",
    "“Education is the most powerful weapon which you can use to change the world.” — Nelson Mandela",
    "“Tell me and I forget. Teach me and I remember. Involve me and I learn.” — Benjamin Franklin",
  ];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-white dark:bg-[#0A0C1D] text-gray-900 dark:text-gray-100">

      {/* LEFT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex flex-col justify-center w-1/2 px-12 space-y-8"
      >
        <h1 className="text-5xl font-extrabold leading-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            TuterNity
          </span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
          Learn, grow, and connect with mentors who inspire you.
        </p>

        <div className="mt-6 p-6 rounded-2xl shadow-lg border bg-white/60 dark:bg-[#101425]/60 border-gray-200 dark:border-gray-700 backdrop-blur-xl max-w-md">
          <h2 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-300">
            Quote of the Moment 💡
          </h2>
          <p className="italic text-sm text-gray-700 dark:text-gray-300">
            {quotes[Math.floor(Math.random() * quotes.length)]}
          </p>
        </div>
      </motion.div>

      {/* RIGHT SIDE (FORM) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-center items-center w-full md:w-1/2 p-6"
      >
        <AuthContainer>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              TuterNity
            </h1>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">Learn • Grow • Connect</p>
          </div>

          <h2 className="text-3xl font-bold text-center mb-6">
            Welcome Back 👋
          </h2>

          {error && (
            <p className="bg-red-500/10 border border-red-400 text-red-600 dark:text-red-300 p-2 rounded text-center mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="mb-4">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 outline-none"
              />
            </div>

            {/* PASSWORD + SHOW/HIDE */}
            <div className="mb-6 relative">
              <label className="text-sm font-medium">Password</label>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 p-3 pr-12 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-10 text-gray-600 dark:text-gray-300"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className={`w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-5 text-gray-600 dark:text-gray-300">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-indigo-600 dark:text-indigo-400 font-semibold underline"
            >
              Sign Up
            </button>
          </p>
        </AuthContainer>
      </motion.div>
    </div>
  );
}
