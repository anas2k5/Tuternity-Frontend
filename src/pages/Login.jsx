import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setRole } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 Login button clicked");
    setError("");
    setLoading(true);

    try {
      console.log("🔹 handleSubmit triggered");
      console.log("🔹 Sending login request...");

      const res = await axios.post("http://localhost:8081/api/auth/login", {
        email,
        password,
      });

      const data = res.data;
      console.log("✅ Response received:", data);

      // CRITICAL: Assuming your backend response now includes the user's ID
      // If the ID is returned inside a nested 'user' object:
      // const { token, role, name, user } = data;
      // const userId = user ? user.id : null; 
      
      // OPTION 1: Assuming your backend returns id, name, role at the top level (based on your console log)
      const { token, role, name, id } = data; // <--- Extract the 'id' here

      // OPTION 2: If your backend returns the user object nested:
      // const userId = data.user.id; 
      
      const userId = id; // Use the extracted ID

      if (!userId) {
          throw new Error("Login failed: User ID not received from server.");
      }

      // 🟩 Save token, role, and profile
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem(
        "profile",
        JSON.stringify({ email, name, role, id: userId }) // <--- FIX: Save the 'id'
      );

      // 🟩 Update global auth context
      setUser({ email, name, role, id: userId });
      setRole(role);

      // 🟩 Redirect by role
      if (role === "STUDENT" || role === "ROLE_STUDENT") {
        navigate("/student");
      } else if (role === "TEACHER" || role === "ROLE_TEACHER") {
        navigate("/teacher");
      } else if (role === "ADMIN" || role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/not-authorized");
      }
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-3 text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}