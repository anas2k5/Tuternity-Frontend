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
  AlertCircle,
  XCircle,
  Search,
  Edit3,
} from "lucide-react";

export default function StudentDashboard() {
  const [latestBooking, setLatestBooking] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await api.get("/students/me");
      setProfile(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch student profile:", error);
      toast.error("Failed to load student profile.");
    }
  };

  const fetchLatestBooking = async () => {
    try {
      const localProfile = getJSON("profile");
      const studentId = localProfile?.id;
      if (!studentId) {
        setLoading(false);
        return;
      }

      const res = await api.get(`/bookings/student/${studentId}`);
      const bookings = res.data || [];
      if (bookings.length > 0) {
        const sorted = bookings.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setLatestBooking(sorted[0]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch latest booking:", error);
      toast.error("Failed to fetch latest booking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchLatestBooking();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
      <Navbar />

      <div className="pt-24 px-6 max-w-5xl mx-auto">
        {/* ✅ Student Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            🎓 Welcome, {profile?.user?.name || "Student"}!
          </h1>
          <div className="text-white/90 space-y-1">
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

        {/* ✅ Latest Booking Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {loading ? (
            <p className="text-center text-white/80">
              Loading your latest booking...
            </p>
          ) : latestBooking ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Calendar size={22} /> Latest Booking Summary
              </h2>
              <div className="text-white/90 space-y-1">
                <p>
                  <strong>Teacher:</strong> {latestBooking.teacherName}
                </p>
                <p>
                  <strong>Subject:</strong> {latestBooking.subject}
                </p>
                <p>
                  <strong>Date:</strong> {latestBooking.date || "-"}
                </p>
                <p>
                  <strong>Time Slot:</strong> {latestBooking.timeSlot || "-"}
                </p>
              </div>

              <div className="mt-4">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                    latestBooking.status === "PAID"
                      ? "bg-green-500/80 text-white"
                      : latestBooking.status === "PENDING"
                      ? "bg-yellow-500/80 text-white"
                      : latestBooking.status?.includes("CANCELLED")
                      ? "bg-gray-500/80 text-white"
                      : "bg-blue-500/80 text-white"
                  }`}
                >
                  {latestBooking.status === "PAID" && <CheckCircle size={16} />}
                  {latestBooking.status === "PENDING" && <Clock size={16} />}
                  {latestBooking.status?.includes("CANCELLED") && (
                    <XCircle size={16} />
                  )}
                  {latestBooking.status}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/student/bookings")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Calendar size={18} /> View All Bookings
                </button>
                <button
                  onClick={() => navigate("/student/find-tutors")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Search size={18} /> Find More Tutors
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 text-center">
              <p className="text-white/80">You have no recent bookings yet.</p>
              <button
                onClick={() => navigate("/student/find-tutors")}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 mx-auto"
              >
                <Search size={18} /> Find a Teacher
              </button>
            </div>
          )}
        </motion.div>

        {/* ✅ Profile Shortcut */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <button
            onClick={() => navigate("/student/profile")}
            className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition flex items-center gap-2 mx-auto"
          >
            <Edit3 size={18} /> View / Edit My Profile
          </button>
        </motion.div>
      </div>
    </div>
  );
}
