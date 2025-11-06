import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";
import { getJSON } from "../utils/storage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedSessions: 0,
    upcomingBookings: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("sessions");

  useEffect(() => {
    const profile = getJSON("profile");
    const teacherId = profile?.id || profile?.user?.id; // ✅ safer check

    if (!teacherId) {
      console.error("⚠️ No teacher ID found in profile");
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // ✅ Fetch teacher stats
        const statsRes = await api.get(`/teacher-dashboard/${teacherId}/stats`);
        const data = statsRes.data || {};

        setStats({
          totalEarnings:
            typeof data.totalEarnings === "object"
              ? data.totalEarnings.value || 0
              : data.totalEarnings || 0,
          completedSessions: data.completedSessions || 0,
          upcomingBookings: data.upcomingBookings || 0,
        });

        // ✅ Prepare monthly chart data
        const chart = Object.entries(data.sessionsByMonth || {}).map(
          ([month, sessions]) => ({ month, sessions })
        );
        setChartData(chart);

        // ✅ Fetch recent payments
        const teacherRes = await api.get(`/stripe/payments/teacher/${teacherId}`);
        setPayments(teacherRes.data || []);
      } catch (err) {
        console.error("❌ Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleManageProfile = () => navigate("/teacher/profile");
  const handleManageAvailability = () => navigate("/teacher/availability");
  const handleViewBookings = () => navigate("/teacher/bookings");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="page-container shadow-card animate-fade-in">
        <h1 className="section-title">👨‍🏫 Teacher Dashboard</h1>

        {loading ? (
          <p className="text-gray-600 text-center italic">Loading your dashboard...</p>
        ) : (
          <>
            {/* ====== STATS SECTION ====== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-green-800">
                  💰 Total Earnings
                </h3>
                <p className="text-2xl font-bold text-green-700 mt-2">
                  ₹{Number(stats.totalEarnings).toFixed(2)}
                </p>
              </div>

              <div className="bg-blue-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-blue-800">
                  ✅ Completed Sessions
                </h3>
                <p className="text-2xl font-bold text-blue-700 mt-2">
                  {stats.completedSessions}
                </p>
              </div>

              <div className="bg-yellow-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-yellow-800">
                  📅 Upcoming Bookings
                </h3>
                <p className="text-2xl font-bold text-yellow-700 mt-2">
                  {stats.upcomingBookings}
                </p>
              </div>
            </div>

            {/* ====== DASHBOARD ACTIONS ====== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div
                onClick={handleManageProfile}
                className="bg-white shadow-lg p-6 rounded-xl cursor-pointer hover:bg-gray-50 transition duration-200"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  👤 Manage Profile
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Update your bio, subject, skills, and hourly rate.
                </p>
              </div>

              <div
                onClick={handleManageAvailability}
                className="bg-white shadow-lg p-6 rounded-xl cursor-pointer hover:bg-gray-50 transition duration-200"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  📅 Manage Availability
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Add or remove available time slots.
                </p>
              </div>

              <div
                onClick={handleViewBookings}
                className="bg-white shadow-lg p-6 rounded-xl cursor-pointer hover:bg-gray-50 transition duration-200"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  📖 My Bookings
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  View and manage all student bookings.
                </p>
              </div>
            </div>

            {/* ====== ANALYTICS CHART ====== */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">📊 Analytics Overview</h2>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="border px-3 py-1 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="sessions">📘 Sessions by Month</option>
              </select>
            </div>

            {chartData.length === 0 ? (
              <p className="text-gray-600 mb-10 text-center">
                No data available to display chart.
              </p>
            ) : (
              <div className="bg-white shadow rounded-xl p-4 mb-10">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="sessions"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ====== RECENT PAYMENTS ====== */}
            <h2 className="text-xl font-semibold mb-4">💵 Recent Payments</h2>
            {payments.length === 0 ? (
              <p className="text-gray-600 text-center">No payments found.</p>
            ) : (
              <div className="overflow-x-auto bg-white shadow rounded-xl">
                <table className="min-w-full table-auto border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                        Booking ID
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                        Student
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments
                      .slice(-5)
                      .reverse()
                      .map((p) => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{p.booking?.id || "-"}</td>
                          <td className="px-4 py-2">
                            ₹{p.amount ? p.amount.toFixed(2) : "0.00"}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                p.status === "SUCCESS"
                                  ? "bg-green-200 text-green-800"
                                  : p.status === "PENDING"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {p.booking?.student?.user?.name || "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
