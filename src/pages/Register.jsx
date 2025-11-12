import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import AuthContainer from "../components/AuthContainer";
import toast from "react-hot-toast";

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

      toast.success("Account created successfully! Please log in to continue.", {
        style: {
          background: "#1E1B4B",
          color: "#fff",
          border: "1px solid #6366F1",
        },
        iconTheme: {
          primary: "#8B5CF6",
          secondary: "#1E1B4B",
        },
      });

      setTimeout(() => navigate("/login", { replace: true }), 1000);
    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);

      toast.error(msg, {
        style: {
          background: "#451a75",
          color: "#fff",
          border: "1px solid #E11D48",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-[#0B0F19] via-[#1E1B4B] to-[#312E81] text-white overflow-hidden">
      {/* Left panel with quote */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        className="hidden md:flex flex-col justify-center w-1/2 px-12 space-y-8"
      >
        <h1 className="text-5xl font-extrabold mb-4">
          Join <span className="text-indigo-400">TuterNity</span>
        </h1>
        <p className="text-lg text-white/80 max-w-md">
          A community of learners and mentors shaping the future together.
        </p>

        <div className="mt-8 bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg max-w-md">
          <h2 className="text-xl font-semibold mb-3 text-indigo-300">
            Did you know? 💬
          </h2>
          <p className="text-white/90 italic text-sm leading-relaxed">
            “The expert in anything was once a beginner.”
          </p>
        </div>
      </motion.div>

      {/* Right Panel – Registration Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        className="flex justify-center items-center w-full md:w-1/2 p-6"
      >
        <AuthContainer>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-10 rounded-3xl text-white w-full max-w-md"
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
                  className="w-full mt-1 bg-white/20 text-white placeholder-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/30 transition"
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
                  className="w-full mt-1 bg-white/20 text-white placeholder-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/30 transition"
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
                  className="w-full mt-1 bg-white/20 text-white placeholder-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/30 transition"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium tracking-wide">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full mt-1 bg-white/20 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/30 transition"
                >
                  <option value="STUDENT" className="bg-indigo-700">Student</option>
                  <option value="TEACHER" className="bg-indigo-700">Teacher</option>
                </select>
              </div>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 15px rgba(99,102,241,0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 font-bold rounded-xl hover:from-indigo-400 hover:to-purple-500 transition shadow-lg shadow-indigo-500/30"
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>
            </form>

            <p className="text-center text-sm text-white/80 mt-5">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-indigo-300 font-semibold underline hover:text-indigo-200"
              >
                Login
              </button>
            </p>
          </motion.div>
        </AuthContainer>
      </motion.div>
    </div>
  );
}
