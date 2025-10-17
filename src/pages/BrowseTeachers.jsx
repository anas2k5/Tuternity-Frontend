// src/pages/BrowseTeachers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function BrowseTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get("/teacher")
      .then((res) => {
        if (!mounted) return;
        setTeachers(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load teachers:", err);
        if (!mounted) return;
        setError("Failed to load teachers. Try again later.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Available Teachers</h1>

        {loading ? (
          <p>Loading teachers...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : teachers.length === 0 ? (
          <p>No teachers available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="p-4 border rounded shadow hover:shadow-lg transition"
              >
                <h2 className="font-semibold text-lg">{t.user?.name || "Unknown"}</h2>
                <p className="text-sm">Subject: {t.subject || "N/A"}</p>
                <p className="text-sm">Skills: {t.skills || "N/A"}</p>
                <p className="text-sm">Hourly Rate: ₹{t.hourlyRate ?? "N/A"}/hr</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/teacher/${t.id}`)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    View Details
                  </button>

                  {/* Book Now navigates to details page so user can pick a slot */}
                  <button
                    onClick={() => navigate(`/teacher/${t.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
