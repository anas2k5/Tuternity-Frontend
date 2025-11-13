// ---------------- FULL UPDATED STUDENT DASHBOARD ------------------

import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { getJSON } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Edit3,
} from "lucide-react";

export default function StudentDashboard() {
  const [latestBooking, setLatestBooking] = useState(null);
  const [profile, setProfile] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    tutors: 0,   // <-- CHANGED HERE 🚀
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // -----------------------------------------------------
  // 🎯 Format time
  // -----------------------------------------------------
  const formatTimeRange = (b) => {
    if (!b) return "-";
    const s = b.startTime ?? b.timeSlot ?? null;
    const e = b.endTime ?? null;
    if (s && e) return `${String(s)} - ${String(e)}`;
    if (b.timeSlot) return b.timeSlot;
    return "-";
  };

  // -----------------------------------------------------
  // 📌 Fetch Student Profile
  // -----------------------------------------------------
  const fetchProfile = async () => {
    try {
      const res = await api.get("/students/me");
      setProfile(res.data);
    } catch (error) {
      toast.error("Failed to load student profile.");
    }
  };

  // -----------------------------------------------------
  // 📌 Fetch Bookings + Stats
  // -----------------------------------------------------
  const fetchBookingsAndStats = async () => {
    try {
      const localProfile = getJSON("profile");
      const studentId = localProfile?.id;

      if (!studentId) return setLoading(false);

      const res = await api.get(`/bookings/student/${studentId}`);
      const bookings = res.data || [];
      setAllBookings(bookings);

      // Latest booking
      if (bookings.length > 0) {
        const sorted = bookings.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setLatestBooking(sorted[0]);
      }

      // -------- NEW: Tutors Connected Calculation -------
      const uniqueTutors = new Set(bookings.map((b) => b.teacherName));

      // -------- Existing stats ------------
      const now = new Date();
      const upcoming = bookings.filter((b) => {
        const d = new Date(b.date);
        return d >= now && b.status !== "CANCELLED";
      }).length;

      const completed = bookings.filter((b) => b.status === "COMPLETED").length;

      setStats({
        upcoming,
        completed,
        tutors: uniqueTutors.size, // <-- UPDATED 🚀
      });
    } catch (error) {
      toast.error("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchBookingsAndStats();
  }, []);

  // -----------------------------------------------------
  // MAIN UI
  // -----------------------------------------------------
  return (
    <div
      className="
        min-h-screen 
        bg-landing-light dark:bg-landing-dark 
        transition-colors duration-500 
        text-gray-900 dark:text-gray-100
      "
    >
      <Navbar />

      <div className="pt-24 px-6 max-w-6xl mx-auto space-y-10">

        {/* -------------------- WELCOME CARD -------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            rounded-2xl p-6 shadow-lg 
            bg-white/80 dark:bg-white/5
            border border-gray-200 dark:border-white/10 
            backdrop-blur-xl
          "
        >
          <h1 className="text-3xl font-bold mb-2">
            🎓 Welcome, {profile?.user?.name || "Student"}!
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Here’s a quick summary of your learning journey.
          </p>

          <div className="space-y-2">
            {profile?.educationLevel && (
              <p className="flex items-center gap-2">
                <BookOpen size={18} /> {profile.educationLevel}
              </p>
            )}
            {profile?.city && (
              <p className="flex items-center gap-2">
                <MapPin size={18} /> {profile.city}
              </p>
            )}
            {profile?.interests && (
              <p className="flex items-center gap-2">
                <User size={18} /> Interests: {profile.interests}
              </p>
            )}
          </div>
        </motion.div>

        {/* ---------------------- STATS CARDS ---------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {/* UPCOMING */}
          <div className="p-5 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-300/30 dark:border-indigo-300/10 shadow-md backdrop-blur-xl">
            <p className="text-lg font-semibold">Upcoming Sessions</p>
            <h2 className="text-3xl font-bold mt-2">{stats.upcoming}</h2>
          </div>

          {/* COMPLETED */}
          <div className="p-5 rounded-xl bg-green-500/10 dark:bg-green-500/20 border border-green-300/30 dark:border-green-300/10 shadow-md backdrop-blur-xl">
            <p className="text-lg font-semibold">Completed Sessions</p>
            <h2 className="text-3xl font-bold mt-2">{stats.completed}</h2>
          </div>

          {/* TUTORS CONNECTED — NEW CARD */}
          <div className="p-5 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-300/30 dark:border-purple-300/10 shadow-md backdrop-blur-xl">
            <p className="text-lg font-semibold">Tutors Connected</p>
            <h2 className="text-3xl font-bold mt-2">{stats.tutors}</h2>
          </div>
        </motion.div>

        {/* ---------------------- LATEST BOOKING ---------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="
            rounded-2xl p-6 shadow-lg 
            bg-white/80 dark:bg-white/5
            border border-gray-200 dark:border-white/10 
            backdrop-blur-xl
          "
        >
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <Calendar size={22} /> Latest Booking
          </h2>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">
              Loading your latest booking…
            </p>
          ) : latestBooking ? (
            <>
              <p><strong>Teacher:</strong> {latestBooking.teacherName}</p>
              <p><strong>Subject:</strong> {latestBooking.subject}</p>
              <p><strong>Date:</strong> {latestBooking.date}</p>
              <p><strong>Time:</strong> {formatTimeRange(latestBooking)}</p>

              <div className="mt-3">
                <span
                  className={`
                    inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                    ${
                      latestBooking.status === "PAID"
                        ? "bg-green-500/80 text-white"
                        : latestBooking.status === "CONFIRMED"
                        ? "bg-blue-500/80 text-white"
                        : latestBooking.status === "COMPLETED"
                        ? "bg-purple-500/80 text-white"
                        : "bg-gray-500/80 text-white"
                    }
                  `}
                >
                  {latestBooking.status === "PAID" && <CheckCircle size={16} />}
                  {latestBooking.status === "CONFIRMED" && <Clock size={16} />}
                  {latestBooking.status === "COMPLETED" && <CheckCircle size={16} />}
                  {latestBooking.status === "CANCELLED" && <XCircle size={16} />}
                  {latestBooking.status}
                </span>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => navigate("/student/bookings")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <Calendar size={18} /> View All Bookings
                </button>

                <button
                  onClick={() => navigate("/student/find-tutors")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Search size={18} /> Find Tutors
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                No recent bookings found.
              </p>
              <button
                onClick={() => navigate("/student/find-tutors")}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 mx-auto"
              >
                <Search size={18} /> Find a Tutor
              </button>
            </div>
          )}
        </motion.div>

        {/* ------------------- PROFILE BUTTON ------------------- */}
       <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.75 }}
  className="text-center pb-10 relative z-20"
>
  <button
    onClick={() => navigate("/student/profile")}
    className="
      px-6 py-2 rounded-lg 
      bg-purple-600 text-white 
      hover:bg-purple-700 transition 
      flex items-center gap-2 mx-auto
      relative z-30
    "
  >
    <Edit3 size={18} /> View / Edit My Profile
  </button>
</motion.div>

      </div>
    </div>
  );
}
