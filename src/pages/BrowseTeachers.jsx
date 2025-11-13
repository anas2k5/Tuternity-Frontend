import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { BookOpen, Star, Clock, MapPin, IndianRupee } from "lucide-react";

/**
 * BrowseTeachers / Find Tutors
 * Updated with modern frosted cards matching Dashboard + TeacherDetails theme
 */

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

  // Avatar initials
  const initials = (name = "") =>
    name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  if (loading)
    return (
      <div className="min-h-screen bg-landing-light dark:bg-landing-dark text-gray-900 dark:text-gray-100 transition-colors duration-500">
        <Navbar />
        <div className="p-6 text-center pt-24 text-lg">Loading tutors...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-landing-light dark:bg-landing-dark text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Navbar />
      <div className="pt-24 px-6 max-w-6xl mx-auto pb-16">

        <h1 className="text-3xl font-extrabold mb-8 text-center">
          🎓 Find Your Perfect Tutor
        </h1>

        {error && (
          <p className="bg-red-500/20 text-red-200 p-3 rounded mb-6 text-center">
            {error}
          </p>
        )}

        {teachers.length === 0 ? (
          <p className="text-center text-gray-700 dark:text-gray-300">
            No tutors available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {teachers.map((t, i) => {
              const name = t.user?.name || "Tutor";
              const skills = t.skills ? `${t.skills}` : "N/A";

              return (
                <motion.div
                  key={t.id || i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="
                    bg-white/80 dark:bg-white/5 
                    border border-gray-200 dark:border-white/10 
                    rounded-2xl p-6 shadow-lg 
                    backdrop-blur-xl 
                    hover:shadow-2xl hover:scale-[1.02] 
                    transition-all duration-300
                  "
                >
                  {/* Avatar + Header */}
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        w-14 h-14 rounded-full 
                        bg-gradient-to-tr from-indigo-500 to-purple-500 
                        text-white flex items-center justify-center 
                        text-xl font-bold shadow
                      "
                    >
                      {initials(name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold truncate">
                        {name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {t.headline || t.subject || "Tutor"}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">

                    <p className="flex items-center gap-2">
                      <BookOpen size={16} /> 
                      <strong>Subject:</strong>
                      <span className="font-medium">{t.subject || "N/A"}</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Star size={16} /> 
                      <strong>Skills:</strong>
                      <span className="font-medium">{skills}</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Clock size={16} /> 
                      <strong>Experience:</strong>
                      <span className="font-medium">{t.experienceYears || 0} years</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <IndianRupee size={16} /> 
                      <strong>Rate:</strong>
                      <span className="font-medium">₹{t.hourlyRate || 0}/hr</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={16} /> 
                      <strong>City:</strong>
                      <span className="font-medium">{t.city || "N/A"}</span>
                    </p>

                  </div>

                  {/* View Profile Button */}
                  <button
                    onClick={() => navigate(`/teacher/${t.id}`)}
                    className="
                      mt-5 w-full py-2.5 rounded-lg
                      bg-gradient-to-r from-blue-500 to-indigo-500
                      text-white font-semibold
                      shadow-lg shadow-indigo-500/20
                      hover:scale-[1.03] hover:shadow-indigo-400/40
                      transition-all duration-300
                      backdrop-blur-sm
                    "
                  >
                    View Profile
                  </button>

                </motion.div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
}
