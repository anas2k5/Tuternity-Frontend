import React from "react";
import Navbar from "../components/Navbar";

export default function StudentDashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-6 border rounded shadow">📚 Browse Teachers</div>
          <div className="p-6 border rounded shadow">📅 Your Bookings</div>
        </div>
      </div>
    </div>
  );
}
