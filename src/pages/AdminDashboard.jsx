import React from "react";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-6 border rounded shadow">👥 Manage Users</div>
          <div className="p-6 border rounded shadow">📑 View Bookings</div>
          <div className="p-6 border rounded shadow">💳 Payments</div>
        </div>
      </div>
    </div>
  );
}
