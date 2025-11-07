import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  BookOpen,
  Star,
  Clock,
  MapPin,
  IndianRupee,
  Calendar,
  User,
  ArrowLeft,
} from "lucide-react";

export default function TeacherDetails() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherRes = await api.get(`/teachers/${id}`);
        setTeacher(teacherRes.data);

        const slotsRes = await api.get(`/availability/teacher/${id}`);
        setSlots(slotsRes.data || []);
      } catch (err) {
        console.error("❌ Failed to load teacher details:", err);
        if (err.response?.status === 403) {
          toast.error("You are not authorized. Please log in again.");
          navigate("/login");
        } else {
          toast.error("Failed to fetch teacher details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleBook = async (slotId) => {
    try {
      await api.post(`/bookings`, {
        teacherId: id,
        availabilityId: slotId,
      });
      toast.success("✅ Booking created successfully!");
      setTimeout(() => navigate("/student/bookings"), 1200);
    } catch (err) {
      console.error("❌ Booking failed:", err);
      let msg = "Booking failed. Please try again later.";
      if (err.response) {
        if (
          err.response.status === 400 &&
          (err.response.data?.message?.includes("booked") ||
            err.response.data?.error?.includes("booked"))
        ) {
          msg = "⚠️ This slot has already been booked.";
        } else if (err.response.status === 403) {
          msg = "❌ You are not authorized.";
        }
      }
      toast.error(msg);
    }
  };

  if (loading)
    return (
      <div>
        <Navbar />
        <div className="p-6 text-white bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 min-h-screen">
          Loading teacher details...
        </div>
      </div>
    );

  if (!teacher)
    return (
      <div>
        <Navbar />
        <div className="p-6 text-white bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 min-h-screen">
          Teacher not found.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
      <Navbar />
      <div className="pt-24 px-6 max-w-5xl mx-auto">
        {/* ===== Teacher Profile ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 mb-10"
        >
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-4">
            <User size={28} /> {teacher.user?.name}
          </h1>

          <div className="space-y-2 text-white/90">
            <p className="flex items-center gap-2">
              <BookOpen size={18} /> <strong>Subject:</strong>{" "}
              {teacher.subject || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <Star size={18} /> <strong>Skills:</strong>{" "}
              {teacher.skills || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <Clock size={18} /> <strong>Experience:</strong>{" "}
              {teacher.experienceYears || 0} years
            </p>
            <p className="flex items-center gap-2">
              <IndianRupee size={18} /> <strong>Hourly Rate:</strong> ₹
              {teacher.hourlyRate || 0}/hr
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={18} /> <strong>City:</strong> {teacher.city || "N/A"}
            </p>
          </div>

          {teacher.bio && (
            <p className="text-white/80 mt-4 italic border-t border-white/10 pt-3">
              “{teacher.bio}”
            </p>
          )}
        </motion.div>

        {/* ===== Slots Section ===== */}
        <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2">
          <Calendar size={22} /> Available Slots
        </h2>

        {slots.length === 0 ? (
          <p className="text-white/80">No available slots right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`p-5 rounded-2xl border shadow-md backdrop-blur-lg ${
                  s.booked
                    ? "bg-white/5 border-white/10 cursor-not-allowed opacity-60"
                    : "bg-white/10 border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all"
                }`}
              >
                <div>
                  <p className="font-semibold flex items-center gap-2 mb-1">
                    <Calendar size={16} /> {s.date || "No date"}
                  </p>
                  <p className="flex items-center gap-2 text-white/90">
                    <Clock size={16} /> {s.startTime} - {s.endTime}
                  </p>
                </div>

                {/* 🔹 Updated Glowing Book Slot Button */}
                <button
                  onClick={() => handleBook(s.id)}
                  disabled={s.booked}
                  className={`mt-4 w-full py-2.5 rounded-lg text-white font-medium transition-all ${
                    s.booked
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 hover:shadow-[0_0_15px_rgba(56,189,248,0.6)] hover:scale-[1.03] shadow-cyan-400/30"
                  }`}
                >
                  {s.booked ? "Booked" : "📅 Book Slot"}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/student/find-tutors")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={18} /> Back to Find Tutors
          </button>
        </div>
      </div>
    </div>
  );
}
