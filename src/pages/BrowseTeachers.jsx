import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function BrowseTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSlots, setOpenSlots] = useState(null); // only one open at a time
  const [slots, setSlots] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get("/teachers");
        setTeachers(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch teachers:", err);
        setError("Failed to load teachers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const toggleSlots = async (teacherId) => {
    if (openSlots === teacherId) {
      setOpenSlots(null);
      return;
    }

    setOpenSlots(teacherId);

    if (!slots[teacherId]) {
      try {
        const res = await api.get(`/availability/teacher/${teacherId}`);
        setSlots((prev) => ({ ...prev, [teacherId]: res.data }));
      } catch (err) {
        console.error("❌ Failed to load availability:", err);
      }
    }
  };

  const handleBook = async (teacherId, slotId) => {
    try {
      await api.post("/bookings", {
        teacherId,
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

  if (loading)
    return (
      <div>
        <Navbar />
        <div className="p-6 text-gray-700">Loading teachers...</div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Browse Teachers</h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        {teachers.length === 0 ? (
          <p className="text-gray-600">No teachers found.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="border rounded-lg shadow bg-white p-5 hover:shadow-lg transition-all"
              >
                {/* Teacher Info */}
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {t.user?.name || "Unnamed Teacher"}
                    </h2>
                    <p className="text-gray-600">
                      Subject: {t.subject || "Not specified"}
                    </p>
                    <p className="text-gray-600">
                      Skills: {t.skills || "Not specified"}
                    </p>
                    <p className="text-gray-600">
                      Experience: {t.experienceYears || 0} years
                    </p>
                    <p className="text-gray-600">
                      Hourly Rate: ₹{t.hourlyRate || 0}/hr
                    </p>
                    <p className="text-gray-600">City: {t.city || "N/A"}</p>
                  </div>

                  <button
                    onClick={() => toggleSlots(t.id)}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                  >
                    {openSlots === t.id ? "Hide Slots" : "Show Slots"}
                  </button>
                </div>

                {/* Slots Section (Collapsible below card) */}
                {openSlots === t.id && (
                  <div className="mt-4 border-t pt-3 bg-gray-50 rounded p-3 animate-fade-in">
                    {slots[t.id] && slots[t.id].length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {slots[t.id].map((s) => (
                          <div
                            key={s.id}
                            className={`flex justify-between items-center border rounded p-2 ${
                              s.booked ? "bg-gray-200" : "bg-green-50"
                            }`}
                          >
                            <div>
                              <p className="text-gray-700 font-medium">
                                {s.date} | {s.startTime} - {s.endTime}
                              </p>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  s.booked
                                    ? "bg-gray-400 text-white"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {s.booked ? "Booked" : "Available"}
                              </span>
                            </div>

                            <button
                              onClick={() => handleBook(t.id, s.id)}
                              disabled={s.booked}
                              className={`px-3 py-1 rounded text-white text-sm font-medium ${
                                s.booked
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                            >
                              {s.booked ? "Booked" : "Book Now"}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">
                        No available slots.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
