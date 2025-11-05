import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function BrowseTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // ✅ Correct endpoint — matches backend public route
        const res = await api.get("/teachers");

        console.log("✅ Teachers fetched:", res.data);
        setTeachers(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch teachers:", err);
        setError("Failed to load teachers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  if (loading)
    return (
      <div>
        <Navbar />
        <div className="p-6 text-gray-700">Loading teachers...</div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Browse Teachers</h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        {teachers.length === 0 ? (
          <p className="text-gray-600">No teachers found.</p>
        ) : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="border rounded-lg shadow-md bg-white p-4 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t.user?.name || "Unnamed Teacher"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Subject: {t.subject || "Not specified"}
                  </p>
                  <p className="text-gray-600">
                    Skills: {t.skills || "Not specified"}
                  </p>
                  <p className="text-gray-600">
                    Experience: {t.experienceYears || 0} years
                  </p>
                  <p className="text-gray-600">
                    Hourly Rate: ₹{t.hourlyRate || 0}/hr
                  </p>
                  <p className="text-gray-600 mt-1">City: {t.city || "N/A"}</p>
                </div>

                <button
                  onClick={() => {
                    console.log("Navigating to teacher:", t.id);
                    navigate(`/teacher/${t.id}`);
                  }}
                  className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
