import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

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
        alert("Failed to load teacher details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBook = async (slotId) => {
    try {
      await api.post(`/bookings`, {
        teacherId: id,
        availabilityId: slotId,
      });
      alert("✅ Booking confirmed!");
      navigate("/student/bookings");
    } catch (err) {
      console.error("❌ Booking failed:", err);
      alert(
        err.response?.data?.message ||
          "Booking failed. Please try again later."
      );
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!teacher) return <div className="p-6">Teacher not found.</div>;

  return (
    <div>
      <Navbar />
      <div className="p-6">
        {/* 🧑 Teacher Info */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {teacher.user?.name}
        </h1>
        <div className="bg-white p-4 rounded shadow-md mb-6">
          <p className="text-gray-700">Subject: {teacher.subject || "N/A"}</p>
          <p className="text-gray-700">Skills: {teacher.skills || "N/A"}</p>
          <p className="text-gray-700">
            Hourly Rate: ₹{teacher.hourlyRate || 0}/hr
          </p>
          <p className="text-gray-700">
            Experience: {teacher.experienceYears || 0} years
          </p>
          <p className="text-gray-700">City: {teacher.city || "N/A"}</p>
          {teacher.bio && (
            <p className="text-gray-700 mt-2">
              <strong>Bio:</strong> {teacher.bio}
            </p>
          )}
        </div>

        {/* 📅 Available Slots */}
        <h2 className="text-xl font-semibold mb-3">Available Slots</h2>
        {slots.length === 0 ? (
          <p className="text-gray-600">No available slots.</p>
        ) : (
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
            {slots.map((s) => (
              <div
                key={s.id}
                className={`border p-3 rounded flex justify-between items-center ${
                  s.booked ? "bg-gray-200" : "bg-green-50"
                }`}
              >
                <span className="text-gray-700">
                  {s.date} | {s.startTime} - {s.endTime}
                </span>
                <button
                  onClick={() => handleBook(s.id)}
                  disabled={s.booked}
                  className={`px-3 py-1 rounded ${
                    s.booked
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700 transition"
                  }`}
                >
                  {s.booked ? "Booked" : "Book Now"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
