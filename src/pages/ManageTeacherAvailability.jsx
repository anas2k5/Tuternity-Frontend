import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ConfirmDialog from "../components/ConfirmDialog";
import api from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Calendar, Clock, PlusCircle, Trash2 } from "lucide-react";

const ManageTeacherAvailability = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const API_URL = "/availability";

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await api.get(`${API_URL}/me`);
      setSlots(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load availability");
    }
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();

    if (!date || !startTime || !endTime) {
      toast.error("Please fill all fields!");
      return;
    }

    if (endTime <= startTime) {
      toast.error("End time must be after start time.");
      return;
    }

    try {
      await api.post(`${API_URL}`, { date, startTime, endTime });
      toast.success("Slot added!");
      setDate("");
      setStartTime("");
      setEndTime("");
      fetchSlots();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add slot");
    }
  };

  const confirmDelete = async () => {
    const slot = slots.find((s) => s.id === deleteId);

    if (slot?.booked) {
      toast.error("This slot is already booked and cannot be deleted.");
      setDeleteId(null);
      return;
    }

    try {
      await api.delete(`${API_URL}/${deleteId}`);
      toast.success("Slot removed successfully");
      setDeleteId(null);
      fetchSlots();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove slot");
      setDeleteId(null);
    }
  };

  return (
    <div
      className="
        min-h-screen 
        bg-gradient-to-br 
        from-[#e3d8ff] via-[#f3d9ff] to-[#d9eaff]
        dark:from-[#050b19] dark:via-[#0a1224] dark:to-[#0b0f19]
        transition-all duration-500
      "
    >
      <Navbar />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      <div className="pt-28 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            bg-white dark:bg-[#0e1525]/80 
            backdrop-blur-xl 
            border border-[#e5e7eb] dark:border-white/10 
            rounded-3xl shadow-2xl 
            p-10
            transition-all
          "
        >
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 text-gray-900 dark:text-white">
            <Calendar size={28} /> Manage Availability
          </h2>

          {/* FORM */}
          <form
            onSubmit={handleAddAvailability}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
          >
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="
                  w-full mt-1 p-3 rounded-xl
                  bg-white dark:bg-[#1a2336]
                  border border-gray-300 dark:border-white/10 
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                  outline-none transition
                "
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="
                  w-full mt-1 p-3 rounded-xl
                  bg-white dark:bg-[#1a2336]
                  border border-gray-300 dark:border-white/10 
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                  outline-none transition
                "
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="
                  w-full mt-1 p-3 rounded-xl
                  bg-white dark:bg-[#1a2336]
                  border border-gray-300 dark:border-white/10 
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                  outline-none transition
                "
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="
                  w-full py-3.5 rounded-xl font-semibold 
                  text-white 
                  bg-gradient-to-r from-[#4dd0e1] via-[#5a8dee] to-[#d16ba5]
                  shadow-lg hover:shadow-xl hover:scale-[1.03]
                  transition-all flex items-center justify-center gap-2
                "
              >
                <PlusCircle size={18} /> Add Slot
              </button>
            </div>
          </form>

          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Clock size={22} /> Your Available Slots
          </h3>

          {slots.length === 0 && (
            <p className="text-gray-500 dark:text-gray-300 italic">
              No slots added yet.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {slots.map((slot, i) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="
                  p-6 rounded-2xl
                  bg-white dark:bg-[#1a2336] 
                  border border-gray-200 dark:border-white/10 
                  shadow-md hover:shadow-xl hover:scale-[1.02]
                  transition-all
                "
              >
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  📅 {slot.date}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  🕒 {slot.startTime} - {slot.endTime}
                </p>

                <button
                  onClick={() => {
                    if (slot.booked) {
                      toast.error("This slot already has a booking and cannot be removed.");
                      return;
                    }
                    setDeleteId(slot.id);
                  }}
                  disabled={slot.booked}
                  className={`
                    w-full py-2 rounded-lg
                    text-white font-semibold text-sm flex items-center justify-center gap-2 transition
                    ${
                      slot.booked
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }
                  `}
                >
                  <Trash2 size={14} /> {slot.booked ? "Booked" : "Remove"}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageTeacherAvailability;
