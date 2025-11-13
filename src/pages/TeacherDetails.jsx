import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
      setTimeout(() => navigate("/student/bookings"), 800);
    } catch (err) {
      console.error("❌ Booking failed:", err);
      let msg = "Booking failed. Please try again.";

      if (err.response) {
        if (
          err.response.status === 400 &&
          (err.response.data?.message?.includes("booked") ||
            err.response.data?.error?.includes("booked"))
        ) {
          msg = "⚠️ This slot is already booked.";
        } else if (err.response.status === 403) {
          msg = "❌ You are not authorized.";
        }
      }
      toast.error(msg);
    }
  };

  const initials = (name = "") =>
    name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  if (loading)
    return (
      <div>
        <Navbar />
        <div className="p-6 bg-landing-light dark:bg-landing-dark min-h-screen text-center pt-24">
          Loading teacher details...
        </div>
      </div>
    );

  if (!teacher)
    return (
      <div>
        <Navbar />
        <div className="p-6 bg-landing-light dark:bg-landing-dark min-h-screen text-center pt-24">
          Teacher not found.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-landing-light dark:bg-landing-dark transition-colors duration-500 text-gray-900 dark:text-gray-100">
      <Navbar />

      <div className="pt-24 px-6 max-w-6xl mx-auto pb-16">

        {/* TEACHER PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-10 shadow-lg backdrop-blur-xl"
        >
          <div className="flex items-center gap-6">

            {/* Avatar */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-500 text-white text-2xl font-bold shadow">
              {initials(teacher.user?.name || "T")}
            </div>

            {/* Right side */}
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold">{teacher.user?.name}</h1>

              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                {teacher.headline || teacher.subject || "Dedicated mentor."}
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <strong>Subject:</strong> {teacher.subject || "N/A"}
                </p>

                <p className="flex items-center gap-2">
                  <Star size={16} />
                  <strong>Skills:</strong> {teacher.skills || "N/A"}
                </p>

                <p className="flex items-center gap-2">
                  <Clock size={16} />
                  <strong>Experience:</strong> {teacher.experienceYears || 0} yrs
                </p>

                <p className="flex items-center gap-2">
                  <IndianRupee size={16} />
                  <strong>Rate:</strong> ₹{teacher.hourlyRate || 0}/hr
                </p>

                <p className="flex items-center gap-2">
                  <MapPin size={16} />
                  <strong>City:</strong> {teacher.city || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {teacher.bio && (
            <p className="mt-4 text-gray-700 dark:text-gray-300 italic border-t border-white/10 pt-3">
              “{teacher.bio}”
            </p>
          )}
        </motion.div>

        {/* SLOTS SECTION */}
        <h2 className="text-2xl font-semibold mb-5 flex items-center gap-2">
          <Calendar size={22} /> Available Slots
        </h2>

        {slots.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No slots available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((s, i) => {
              const booked = !!s.booked;

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className={`rounded-2xl p-5 border shadow-md backdrop-blur-lg ${
                    booked
                      ? "bg-white/5 border-white/10 opacity-70 cursor-not-allowed"
                      : "bg-white/10 border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all"
                  }`}
                >
                  <p className="font-semibold flex items-center gap-2 mb-2">
                    <Calendar size={16} /> {s.date}
                  </p>

                  <p className="flex items-center gap-2 text-sm">
                    <Clock size={16} /> {s.startTime} - {s.endTime}
                  </p>

                  <button
                    onClick={() => handleBook(s.id)}
                    disabled={booked}
                    className={`mt-4 w-full py-2.5 rounded-lg text-white font-medium transition-all ${
                      booked
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 hover:shadow-[0_6px_18px_rgba(79,70,229,0.18)]"
                    }`}
                  >
                    {booked ? "Booked" : "📅 Book Slot"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* FIXED NAVIGATION BUTTON */}
        <div className="mt-10 text-center">
          <Link
            to="/student/find-tutors"
            className="inline-flex items-center gap-2 px-5 py-2.5 
              bg-white/20 hover:bg-white/30 
              text-gray-900 dark:text-white
              rounded-lg transition-all backdrop-blur-md"
          >
            <ArrowLeft size={18} /> Back to Find Tutors
          </Link>
        </div>
      </div>
    </div>
  );
}
