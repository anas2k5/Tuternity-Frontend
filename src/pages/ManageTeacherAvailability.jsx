import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Calendar, Clock, PlusCircle, Trash2 } from "lucide-react";

const ManageTeacherAvailability = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slots, setSlots] = useState([]);

  const API_URL = "/availability";

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await api.get(`${API_URL}/me`);
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast.error("Failed to load availability.");
    }
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      await api.post(`${API_URL}`, { date, startTime, endTime });
      toast.success("✅ Availability added successfully!");
      setDate("");
      setStartTime("");
      setEndTime("");
      fetchSlots();
    } catch (error) {
      console.error("Error adding availability:", error);
      toast.error("❌ Failed to add availability!");
    }
  };

  const handleDeleteAvailability = async (id) => {
    if (!window.confirm("Are you sure you want to remove this slot?")) return;

    try {
      await api.delete(`${API_URL}/${id}`);
      toast.success("🗑️ Slot removed successfully!");
      fetchSlots();
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast.error("❌ Failed to remove slot!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
      <Navbar />

      <div className="pt-24 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-2">
            <Calendar size={26} /> Manage Availability
          </h2>

          {/* ====== FORM ====== */}
          <form
            onSubmit={handleAddAvailability}
            className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10"
          >
            <div>
              <label className="block text-sm font-semibold mb-1 text-white/90">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-white/90">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-white/90">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(56,189,248,0.6)] transition-all rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <PlusCircle size={18} /> Add Slot
              </button>
            </div>
          </form>

          {/* ====== SLOTS LIST ====== */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Clock size={22} /> Your Available Slots
            </h3>

            {slots.length === 0 ? (
              <p className="text-white/80 italic">
                No availability slots added yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {slots.map((slot, i) => (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-xl p-4 flex justify-between items-center hover:bg-white/20 hover:scale-[1.02] transition-all shadow-md"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        📅 {slot.date}
                      </p>
                      <p className="text-sm text-white/80 mt-1">
                        🕒 {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAvailability(slot.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white transition-all"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageTeacherAvailability;
