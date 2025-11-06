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
        const res = await api.get("/teachers");
        setTeachers(res.data || []);
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
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">🎓 Find Tutors</h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        {teachers.length === 0 ? (
          <p className="text-gray-600">No teachers available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
              >
                {/* Teacher Info */}
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {t.user?.name || "Unnamed Teacher"}
                </h2>
                <p className="text-gray-700 text-sm">
                  <strong>Subject:</strong> {t.subject || "Not specified"}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Skills:</strong> {t.skills || "Not specified"}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Experience:</strong> {t.experienceYears || 0} years
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Hourly Rate:</strong> ₹{t.hourlyRate || 0}/hr
                </p>
                <p className="text-gray-700 text-sm mb-4">
                  <strong>City:</strong> {t.city || "N/A"}
                </p>

                {/* View Profile Button */}
                <button
                  onClick={() => navigate(`/teacher/${t.id}`)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
