import React, { useState, useEffect } from "react";
import api from "../api"; // ✅ use authenticated axios instance

const ManageTeacherAvailability = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slots, setSlots] = useState([]);

  const API_URL = "/availability"; // since api.js already prefixes /api

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await api.get(`${API_URL}/me`);
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) {
      alert("Please fill all fields!");
      return;
    }

    try {
      await api.post(`${API_URL}`, { date, startTime, endTime });
      alert("Availability added successfully!");
      setDate("");
      setStartTime("");
      setEndTime("");
      fetchSlots();
    } catch (error) {
      console.error("Error adding availability:", error);
      alert("Failed to add availability!");
    }
  };

  const handleDeleteAvailability = async (id) => {
    if (!window.confirm("Are you sure you want to remove this slot?")) return;

    try {
      await api.delete(`${API_URL}/${id}`);
      alert("Slot removed successfully!");
      fetchSlots();
    } catch (error) {
      console.error("Error deleting slot:", error);
      alert("Failed to remove slot!");
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

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Your Slots</h3>
        {slots.length === 0 ? (
          <p className="text-gray-500">No availability slots added yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {slots.map((slot) => (
              <li
                key={slot.id}
                className="py-2 flex justify-between items-center"
              >
                <span>
                  📅 {slot.date} — 🕒 {slot.startTime} to {slot.endTime}
                </span>
                <button
                  onClick={() => handleDeleteAvailability(slot.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageTeacherAvailability;
