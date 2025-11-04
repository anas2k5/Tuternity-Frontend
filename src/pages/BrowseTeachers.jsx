import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function BrowseTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get("/teacher");
        console.log("DEBUG: teachers", res.data);
        setTeachers(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch teachers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  if (loading) return <div className="p-6">Loading teachers...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Browse Teachers</h1>

        {teachers.length === 0 ? (
          <p>No teachers found.</p>
        ) : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="border rounded-lg shadow-md bg-white p-4 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t.user?.name}
                  </h2>
                  <p className="text-gray-600 mt-1">Subject: {t.subject}</p>
                  <p className="text-gray-600">Skills: {t.skills}</p>
                  <p className="text-gray-600">
                    Experience: {t.experienceYears} years
                  </p>
                  <p className="text-gray-600">
                    Hourly Rate: ₹{t.hourlyRate || 0}/hr
                  </p>
                  <p className="text-gray-600 mt-1">City: {t.city}</p>
                </div>

                <button
                  onClick={() => {
                    console.log("Navigate with teacher id:", t.id, "user id:", t.user?.id);
                    navigate(`/teacher/${t.id}`);
                  }}
                  className="mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
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
