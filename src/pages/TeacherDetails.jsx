// TeacherDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function TeacherDetails() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Correctly fetches teacher and availability data
    api.get(`/teacher/${id}`).then((res) => setTeacher(res.data));
    api.get(`/availability/teacher/${id}`).then((res) => setSlots(res.data));
  }, [id]);

  const handleBook = async (slotId) => {
    try {
      // Corrected API call to use POST method with a JSON body
      await api.post(`/bookings`, {
        teacherId: id,
        availabilityId: slotId,
      });

      alert("Booking confirmed!");
      navigate("/student/bookings");
    } catch (err) {
      // Improved error handling to show the real backend error
      alert(err.response?.data?.message || "Failed to book slot");
    }
  };

  if (!teacher) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">{teacher.user.name}</h1>
        <p className="mt-2">Subject: {teacher.subject}</p>
        <p>Skills: {teacher.skills}</p>
        <p>Hourly Rate: ₹{teacher.hourlyRate}/hr</p>

        <h2 className="text-xl mt-6 mb-2 font-semibold">Available Slots</h2>
        {slots.length === 0 ? (
          <p>No slots available.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {slots.map((s) => (
              <div
                key={s.id}
                className={`border p-3 rounded shadow flex justify-between items-center ${
                  s.booked ? "bg-gray-100" : ""
                }`}
              >
                <span>
                  {s.date} | {s.startTime} - {s.endTime}
                </span>
                <button
                  onClick={() => handleBook(s.id)}
                  disabled={s.booked}
                  className={`px-3 py-1 rounded ${
                    s.booked
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white"
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