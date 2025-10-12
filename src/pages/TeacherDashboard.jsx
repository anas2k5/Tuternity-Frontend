import React from "react";
import Navbar from "../components/Navbar";

export default function TeacherDashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-6 border rounded shadow">👤 Manage Profile</div>
          <div className="p-6 border rounded shadow">📅 Manage Availability</div>
        </div>
      </div>
    </div>
  );
}
