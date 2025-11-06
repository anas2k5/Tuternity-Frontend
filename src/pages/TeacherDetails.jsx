import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function TeacherDetails() {
  const { id } = useParams(); // Get teacher ID from route
  const [teacher, setTeacher] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Fetch teacher details + slots
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

  // 🔹 Handle booking
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

  // 🔹 UI Render
  if (loading)
    return (
      <div>
        <Navbar />
        <div className="p-6 text-gray-700">Loading teacher details...</div>
      </div>
    );

  if (!teacher)
    return (
      <div>
        <Navbar />
        <div className="p-6 text-gray-700">Teacher not found.</div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        {/* ===== Teacher Profile ===== */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            👨‍🏫 {teacher.user?.name}
          </h1>
          <p className="text-gray-700 mb-1">
            <strong>Subject:</strong> {teacher.subject || "N/A"}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Skills:</strong> {teacher.skills || "N/A"}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Experience:</strong> {teacher.experienceYears || 0} years
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Hourly Rate:</strong> ₹{teacher.hourlyRate || 0}/hr
          </p>
          <p className="text-gray-700 mb-1">
            <strong>City:</strong> {teacher.city || "N/A"}
          </p>
          {teacher.bio && (
            <p className="text-gray-600 mt-3 italic">{teacher.bio}</p>
          )}
        </div>

        {/* ===== Slots Section ===== */}
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          📅 Available Slots
        </h2>

        {slots.length === 0 ? (
          <p className="text-gray-600">No available slots right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((s) => (
              <div
                key={s.id}
                className={`border p-4 rounded-xl shadow-sm flex flex-col justify-between transition-all duration-200 ${
                  s.booked
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white hover:shadow-md"
                }`}
              >
                <div>
                  <p className="font-medium text-gray-800">
                    📆 {s.date || "No date"}
                  </p>
                  <p className="text-gray-600 mt-1">
                    ⏰ {s.startTime} - {s.endTime}
                  </p>
                </div>

                <button
                  onClick={() => handleBook(s.id)}
                  disabled={s.booked}
                  className={`mt-3 px-4 py-2 rounded text-white font-medium transition ${
                    s.booked
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {s.booked ? "Booked" : "Book Slot"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/student/find-tutors")}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            ← Back to Find Tutors
          </button>
        </div>
      </div>
    </div>
  );
}
