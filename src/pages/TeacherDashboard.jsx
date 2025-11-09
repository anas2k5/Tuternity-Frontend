import React, { useEffect, useState, useRef } from "react";
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
import {
  Wallet,
  CheckCircle2,
  CalendarDays,
  User,
  BookOpen,
  LineChart,
} from "lucide-react";
import { motion } from "framer-motion";

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
  const [hoveredCard, setHoveredCard] = useState(null);
  const paymentsRef = useRef(null);

  useEffect(() => {
    const profile = getJSON("profile");
    const teacherId = profile?.id || profile?.user?.id;

    if (!teacherId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
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

        const chart = Object.entries(data.sessionsByMonth || {}).map(
          ([month, sessions]) => ({ month, sessions })
        );
        setChartData(chart);

        const payRes = await api.get(`/stripe/payments/teacher/${teacherId}`);
        setPayments(payRes.data || []);
      } catch (err) {
        console.error("❌ Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleManageProfile = () => navigate("/teacher/profile");
  const handleManageAvailability = () => navigate("/teacher/availability");
  const handleViewBookings = () => navigate("/teacher/bookings");
  const scrollToPayments = () =>
    paymentsRef.current?.scrollIntoView({ behavior: "smooth" });

  const statCards = [
    {
      label: "Total Earnings",
      value: `₹${Number(stats.totalEarnings).toFixed(2)}`,
      icon: Wallet,
      color: "text-green-400",
      tooltip: "View your recent payments",
      onClick: scrollToPayments,
    },
    {
      label: "Completed Sessions",
      value: stats.completedSessions,
      icon: CheckCircle2,
      color: "text-blue-400",
      tooltip: "See all completed bookings",
      onClick: handleViewBookings,
    },
    {
      label: "Upcoming Bookings",
      value: stats.upcomingBookings,
      icon: CalendarDays,
      color: "text-yellow-400",
      tooltip: "See all upcoming bookings",
      onClick: handleViewBookings,
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const totalEarningsFromPayments = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // ✅ Safely get teacher name
  const profile = getJSON("profile");
  const teacherName =
    profile?.name || profile?.user?.name || "Teacher";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5b21b6] via-blue-700 to-purple-700 text-white">
      <Navbar />

      <div className="pt-24 px-6 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2"
        >
          👋 Welcome back,{" "}
          <span className="text-cyan-300">{teacherName}</span>!
        </motion.h1>

        <p className="text-center text-white/80 mb-10">
          Here’s a quick overview of your performance and activity.
        </p>

        {loading ? (
          <p className="text-center text-white/80">Loading your dashboard...</p>
        ) : (
          <>
            {/* ====== STATS SECTION ====== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {statCards.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={item.onClick}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:bg-white/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <item.icon size={24} className={`${item.color}`} />
                    <h3 className="text-lg font-semibold">{item.label}</h3>
                  </div>
                  <p className={`text-3xl font-bold text-center ${item.color}`}>
                    {item.value}
                  </p>

                  {hoveredCard === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -bottom-10 transform -translate-x-1/2 bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-lg shadow-md border border-white/20"
                    >
                      {item.tooltip}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* ====== ACTIONS SECTION ====== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                {
                  title: "Manage Profile",
                  desc: "Update your bio, subject, skills, and hourly rate.",
                  icon: User,
                  onClick: handleManageProfile,
                },
                {
                  title: "Manage Availability",
                  desc: "Add or remove available time slots.",
                  icon: CalendarDays,
                  onClick: handleManageAvailability,
                },
                {
                  title: "My Bookings",
                  desc: "View and manage all student bookings.",
                  icon: BookOpen,
                  onClick: handleViewBookings,
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  onClick={card.onClick}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 150 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-md cursor-pointer hover:bg-white/20 transition-all text-center"
                >
                  <card.icon size={28} className="mx-auto mb-3 text-cyan-300" />
                  <h2 className="text-lg font-semibold mb-1">{card.title}</h2>
                  <p className="text-sm text-white/80">{card.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* ====== ANALYTICS CHART ====== */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg mb-10">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <LineChart size={22} /> Analytics Overview
              </h2>

              {chartData.length === 0 ? (
                <p className="text-center text-white/70 italic">
                  No analytics data yet.
                </p>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="month" stroke="#ffffff90" />
                      <YAxis stroke="#ffffff90" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255,255,255,0.1)",
                          border: "none",
                          color: "#fff",
                        }}
                      />
                      <Bar
                        dataKey="sessions"
                        fill="#38bdf8"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* ====== RECENT PAYMENTS ====== */}
            <div
              ref={paymentsRef}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                💵 Recent Payments
              </h2>

              {/* ✅ Total Earnings Summary with animation */}
              {payments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-green-300 mb-4 bg-green-400/10 border border-green-400/20 px-4 py-2 rounded-lg w-fit shadow-md"
                >
                  💰 Total Earnings from Successful Payments:{" "}
                  <span className="font-semibold">
                    ₹{totalEarningsFromPayments.toFixed(2)}
                  </span>
                </motion.div>
              )}

              {payments.length === 0 ? (
                <p className="text-center text-white/70">
                  No recent payments found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-white/10">
                      <tr>
                        {[
                          "BOOKING ID",
                          "AMOUNT",
                          "STATUS",
                          "STUDENT",
                          "DATE",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-white/80 font-semibold uppercase text-sm"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {payments.slice(-5).reverse().map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-white/10 hover:bg-white/10 transition"
                        >
                          <td className="px-4 py-3">{p.booking?.id || "-"}</td>
                          <td className="px-4 py-3">
                            ₹{p.amount ? p.amount.toFixed(2) : "0.00"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                p.status === "SUCCESS"
                                  ? "bg-green-400/20 text-green-300"
                                  : p.status === "PENDING"
                                  ? "bg-yellow-400/20 text-yellow-300"
                                  : "bg-red-400/20 text-red-300"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {p.booking?.student?.user?.name || "-"}
                          </td>
                          <td className="px-4 py-3">
                            {formatDate(p.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
