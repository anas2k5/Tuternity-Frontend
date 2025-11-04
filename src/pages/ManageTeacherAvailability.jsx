import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageTeacherAvailability = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [teacherId, setTeacherId] = useState(null);

  // ✅ Replace with your backend API base URL
  const API_URL = "http://localhost:8081/api/availability";

  // Fetch teacher info (optional if you store teacherId in token)
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.id) {
      setTeacherId(userData.id);
      fetchSlots(userData.id);
    }
  }, []);

  // ✅ Fetch existing availability slots
  const fetchSlots = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  // ✅ Handle Add Availability
  const handleAddAvailability = async (e) => {
    e.preventDefault();

    if (!date || !startTime || !endTime) {
      alert("Please fill all fields!");
      return;
    }

    try {
      await axios.post(`${API_URL}/${teacherId}`, {
        date,
        startTime,
        endTime,
      });

      alert("Availability added successfully!");
      setDate("");
      setStartTime("");
      setEndTime("");
      fetchSlots(teacherId);
    } catch (error) {
      console.error("Error adding availability:", error);
      alert("Failed to add availability!");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Manage Availability</h2>

      <form onSubmit={handleAddAvailability} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
        >
          Add Availability
        </button>
      </form>

      {/* ✅ Display added slots */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Your Slots</h3>
        {slots.length === 0 ? (
          <p className="text-gray-500">No availability slots added yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {slots.map((slot) => (
              <li key={slot.id} className="py-2">
                📅 {slot.date} — 🕒 {slot.startTime} to {slot.endTime}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageTeacherAvailability;
