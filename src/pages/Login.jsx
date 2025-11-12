import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
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
      const res = await api.post("/auth/login", { email, password });
      const { accessToken, refreshToken, role, name, id } = res.data;

      if (!accessToken || !refreshToken || !id)
        throw new Error("Invalid response from server.");

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("profile", JSON.stringify({ email, name, role, id }));

      setUser({ email, name, role, id });
      setRole(role);

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

  const quotes = [
    "“Education is the most powerful weapon which you can use to change the world.” — Nelson Mandela",
    "“The beautiful thing about learning is that no one can take it away from you.” — B.B. King",
    "“Tell me and I forget. Teach me and I remember. Involve me and I learn.” — Benjamin Franklin",
    "“Learning never exhausts the mind.” — Leonardo da Vinci",
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-[#0B0F19] via-[#1E1B4B] to-[#312E81] text-white overflow-hidden">
      {/* Left Panel – Quotes */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        className="hidden md:flex flex-col justify-center w-1/2 px-12 space-y-8"
      >
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to <span className="text-indigo-400">TuterNity</span>
        </h1>
        <p className="text-lg text-white/80 max-w-md">
          Learn, grow, and connect with expert tutors who inspire you to reach
          your true potential.
        </p>

        <div className="mt-8 bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg max-w-md">
          <h2 className="text-xl font-semibold mb-3 text-indigo-300">
            Quote of the Moment 💡
          </h2>
          <p className="text-white/90 italic text-sm leading-relaxed transition-all duration-700">
            {quotes[Math.floor(Math.random() * quotes.length)]}
          </p>
        </div>
      </motion.div>

      {/* Right Panel – Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        className="flex justify-center items-center w-full md:w-1/2 p-6"
      >
        <AuthContainer>
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-10 rounded-3xl w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold drop-shadow-lg">
                TuterNity
              </h1>
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
                className="w-full mt-1 bg-white/20 text-white placeholder-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/30 transition"
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
                className="w-full mt-1 bg-white/20 text-white placeholder-white/70 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/30 transition"
                required
              />
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
              {loading ? "Logging in..." : "Login"}
            </motion.button>

            <p className="text-center text-sm text-white/80 mt-5">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-indigo-300 font-semibold underline hover:text-indigo-200"
              >
                Sign Up
              </button>
            </p>
          </motion.form>
        </AuthContainer>
      </motion.div>
    </div>
  );
}
