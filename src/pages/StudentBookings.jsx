// src/pages/StudentBookings.jsx

import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { getJSON } from "../utils/storage";

export default function StudentBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBookings = () => {
        setLoading(true);
        setError("");
        const profile = getJSON("profile");
        const studentId = profile?.id;

        if (!studentId) {
            setBookings([]);
            setLoading(false);
            return;
        }

        api.get(`/bookings/student/${studentId}`)
            .then((res) => {
                setBookings(res.data || []);
            })
            .catch((err) => {
                console.error("Failed to load bookings:", err);
                setError("Failed to load bookings. Try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // ✅ NEW: Handler for cancellation
    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            // API call to the new DELETE endpoint
            await api.delete(`/bookings/${bookingId}`); 
            alert("Booking has been successfully cancelled.");
            
            // Refetch data to update the UI
            fetchBookings(); 
        } catch (err) {
            // Display specific error if available, otherwise show generic message
            alert("Cancellation failed: " + (err.response?.data?.message || "Server error."));
        }
    };

    return (
        <div>
            <Navbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

                {/* ... (Loading and Error messages) ... */}

                {loading ? (
                    <p>Loading bookings...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : bookings.length === 0 ? (
                    <p>You have no bookings yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {bookings.map((b) => (
                            <div
                                key={b.id}
                                className="p-4 border rounded shadow flex justify-between items-center"
                            >
                                <div>
                                    <h2 className="font-semibold">{b.teacher?.user?.name || "Teacher"}</h2>
                                    <p>Subject: {b.teacher?.subject || "-"}</p>
                                    <p>Skills: {b.teacher?.skills || "-"}</p>
                                    <p>
                                        Slot: {b.date} | {b.timeSlot}
                                    </p>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <span
                                        className={`px-3 py-1 rounded ${
                                            b.status === "CONFIRMED" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                        }`}
                                    >
                                        {b.status}
                                    </span>
                                    
                                    {b.status === "CONFIRMED" && ( // Only show button if confirmed
                                        <button
                                            onClick={() => handleCancel(b.id)}
                                            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}