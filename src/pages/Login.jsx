import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:8081/api/auth/login", {
      email,
      password,
    });

    // ✅ Backend returns plain JWT token (might contain whitespace)
    const token = res.data.trim(); // 👈 Trim any spaces/newlines
    console.log("Token from backend:", token);

    const decoded = jwtDecode(token);
    console.log("Decoded JWT:", decoded);

    const role = decoded.role ? decoded.role.toUpperCase() : null;
    console.log("Extracted Role:", role);

    if (!role) {
      alert("❌ Role missing in token payload");
      return;
    }

    login({ token, role });

    if (role === "STUDENT") navigate("/student");
    else if (role === "TEACHER") navigate("/teacher");
    else if (role === "ADMIN") navigate("/admin");
    else navigate("/");

  } catch (err) {
    console.error("Login error:", err.response ? err.response.data : err);
    alert("Invalid credentials or server error");
  }
};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded p-6 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full p-2 mb-3 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border w-full p-2 mb-3 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
