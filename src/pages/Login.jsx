import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 🔹 Send login request
      const res = await api.post("/auth/login", { email, password });

      console.log("Login response:", res.data);

      // ✅ Your backend returns ONLY the token string, so save it directly
      localStorage.setItem("token", res.data);

      // 🔹 Get user details from token or fetch from API if needed
      // For now, just redirect based on login role assumption
      // Better: decode token -> extract role (STUDENT/TEACHER)
      // Quick hack: assume student for test
      // Example using jwt-decode (install it): npm install jwt-decode
      // import jwt_decode from "jwt-decode";
      // const decoded = jwt_decode(res.data);
      // localStorage.setItem("role", decoded.role);

      // ⬆ Uncomment the above if you want exact role from token

      // 🚀 Redirect
      navigate("/student"); // Default for now (change based on decoded role)
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("Invalid login credentials or forbidden access!");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </form>
    </div>
  );
}
