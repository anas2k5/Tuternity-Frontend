import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function TeacherDetails() {
  const { id } = useParams(); // From route /teacher/:id
  const [teacher, setTeacher] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔹 Fetching teacher details...");
        const teacherRes = await api.get(`/teachers/${id}`);

        setTeacher(teacherRes.data);

        console.log("🔹 Fetching availability slots...");
        const slotsRes = await api.get(`/availability/teacher/${id}`);
        setSlots(slotsRes.data || []);
      } catch (err) {
        console.error("❌ Failed to load teacher details:", err);
        if (err.response?.status === 403) {
          alert("You are not authorized. Please log in again.");
          navigate("/login");
        } else {
          alert("Failed to fetch teacher details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleBook = async (slotId) => {
    try {
      console.log(`📅 Booking slot ID: ${slotId}`);
      const res = await api.post(`/bookings`, {
        teacherId: id,
        availabilityId: slotId,
      });
      console.log("✅ Booking success:", res.data);
      alert("✅ Booking confirmed!");
      navigate("/student/bookings");
    } catch (err) {
      console.error("❌ Booking failed:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to book slot. Please try again later.";
      alert(msg);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!teacher) return <div className="p-6">Teacher not found.</div>;

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {teacher.user?.name}
        </h1>
        <p className="mt-2 text-gray-600">Subject: {teacher.subject}</p>
        <p className="text-gray-600">Skills: {teacher.skills}</p>
        <p className="text-gray-600">
          Hourly Rate: ₹{teacher.hourlyRate || 0}/hr
        </p>
        <p className="text-gray-600">City: {teacher.city}</p>

        <h2 className="text-xl mt-6 mb-2 font-semibold text-gray-800">
          Available Slots
        </h2>

        {slots.length === 0 ? (
          <p className="text-gray-600">No slots available for this teacher.</p>
        ) : (
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
            {slots.map((s) => (
              <div
                key={s.id}
                className={`border p-3 rounded shadow flex justify-between items-center ${
                  s.booked ? "bg-gray-200" : "bg-white"
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
                      : "bg-blue-500 text-white hover:bg-blue-600 transition"
                  }`}
                >
                  {s.booked ? "Booked" : "Book"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
