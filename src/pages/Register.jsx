// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import toast from "react-hot-toast";
import AuthContainer from "../components/AuthContainer";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", { name, email, password, role });
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
          Join{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            TuterNity
          </span>
        </h1>

        <p className="text-lg max-w-md leading-relaxed text-gray-600 dark:text-gray-300">
          A community of learners and mentors shaping the future.
        </p>
      </motion.div>

      {/* RIGHT SIDE */}
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
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
              Learn • Grow • Connect
            </p>
          </div>

          <h2 className="text-3xl font-bold text-center mb-6">Create Account ✨</h2>

          {error && (
            <p className="bg-red-500/10 border border-red-400 text-red-600 dark:text-red-300 p-2 rounded text-center mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* NAME */}
            <div className="mb-4">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full mt-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 outline-none"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 outline-none"
              />
            </div>

            {/* PASSWORD + SHOW/HIDE */}
            <div className="mb-4 relative">
              <label className="text-sm font-medium">Password</label>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                placeholder="Create a strong password"
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

            {/* ROLE */}
            <div className="mb-6">
              <label className="text-sm font-medium">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 outline-none"
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </select>
            </div>

            {/* SUBMIT */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className={`w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </motion.button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-sm mt-5 text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 dark:text-indigo-400 underline font-semibold"
            >
              Login
            </button>
          </p>
        </AuthContainer>
      </motion.div>
    </div>
  );
}
