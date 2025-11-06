import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

const ManageTeacherAvailability = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slots, setSlots] = useState([]);

  const API_URL = "/availability"; // uses api.js baseURL: http://localhost:8081/api

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
      alert("✅ Availability added successfully!");
      setDate("");
      setStartTime("");
      setEndTime("");
      fetchSlots();
    } catch (error) {
      console.error("Error adding availability:", error);
      alert("❌ Failed to add availability!");
    }
  };

  const handleDeleteAvailability = async (id) => {
    if (!window.confirm("Are you sure you want to remove this slot?")) return;

    try {
      await api.delete(`${API_URL}/${id}`);
      alert("🗑️ Slot removed successfully!");
      fetchSlots();
    } catch (error) {
      console.error("Error deleting slot:", error);
      alert("❌ Failed to remove slot!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-2xl p-8 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
          📅 Manage Availability
        </h2>

        {/* ====== FORM ====== */}
        <form
          onSubmit={handleAddAvailability}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <div>
            <label className="block mb-1 font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center justify-center space-x-2"
            >
              <span className="text-lg">➕</span>
              <span>Add Availability</span>
            </button>
          </div>
        </form>

        {/* ====== SLOTS LIST ====== */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
            📘 Your Available Slots
          </h3>

          {slots.length === 0 ? (
            <p className="text-gray-500 italic">No availability slots added yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {slots.map((slot) => (
                <li
                  key={slot.id}
                  className="py-3 flex justify-between items-center hover:bg-gray-50 transition-all px-2 rounded-lg"
                >
                  <div className="flex items-center space-x-3 text-gray-700">
                    <span className="text-lg">📅</span>
                    <span>{slot.date}</span>
                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                      <span>🕒</span>
                      <span>
                        {slot.startTime} to {slot.endTime}
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteAvailability(slot.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md transition-all ml-3"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTeacherAvailability;
