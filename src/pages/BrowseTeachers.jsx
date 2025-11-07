import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { BookOpen, Star, Clock, MapPin, IndianRupee } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
        <Navbar />
        <div className="p-6 text-center pt-24 text-white/90 text-lg">
          Loading tutors...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
      <Navbar />
      <div className="pt-24 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🎓 Find Your Perfect Tutor
        </h1>

        {error && (
          <p className="bg-red-500/30 text-red-200 p-3 rounded mb-4 text-center">
            {error}
          </p>
        )}

        {teachers.length === 0 ? (
          <p className="text-center text-white/80">
            No teachers available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:scale-[1.02] hover:shadow-2xl transition-all"
              >
                <h2 className="text-xl font-semibold mb-2 text-white">
                  {t.user?.name || "Unnamed Teacher"}
                </h2>

                <div className="space-y-2 text-sm text-white/90">
                  <p className="flex items-center gap-2">
                    <BookOpen size={16} /> <strong>Subject:</strong>{" "}
                    {t.subject || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Star size={16} /> <strong>Skills:</strong>{" "}
                    {t.skills || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} /> <strong>Experience:</strong>{" "}
                    {t.experienceYears || 0} years
                  </p>
                  <p className="flex items-center gap-2">
                    <IndianRupee size={16} /> <strong>Hourly Rate:</strong> ₹
                    {t.hourlyRate || 0}/hr
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} /> <strong>City:</strong>{" "}
                    {t.city || "N/A"}
                  </p>
                </div>

                {/* 🔹 Improved "View Profile" Button */}
                <button
                  onClick={() => navigate(`/teacher/${t.id}`)}
                  className="glow-button mt-5 w-full py-2.5 rounded-lg 
                             bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 
                             text-white font-semibold 
                             shadow-lg shadow-sky-500/30 
                             hover:shadow-cyan-400/50 
                             hover:scale-[1.03] 
                             transition-all duration-300 
                             border border-white/20
                             backdrop-blur-sm"
                >
                  View Profile
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
