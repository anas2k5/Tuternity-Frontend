import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AnimatedBackground from "./components/AnimatedBackground";
import PageTransition from "./components/PageTransition";
import Loader from "./components/Loader";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotAuthorized from "./pages/NotAuthorized";
import BrowseTeachers from "./pages/BrowseTeachers";
import StudentBookings from "./pages/StudentBookings";
import TeacherDetails from "./pages/TeacherDetails";
import ManageTeacherProfile from "./pages/ManageTeacherProfile";
import ManageTeacherAvailability from "./pages/ManageTeacherAvailability";
import TeacherBookings from "./pages/TeacherBookings";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import StudentPayments from "./pages/StudentPayments";
import StudentProfile from "./pages/StudentProfile";
import LandingPage from "./pages/LandingPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  if (loading) return <Loader />;

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-700 ${
        isDark
          ? "bg-[#0f172a] text-gray-100 dark"
          : "bg-[#f5f8ff] text-[#1E1E2F]"
      }`}
    >
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark
              ? "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)"
              : "#fff",
            color: isDark ? "#fff" : "#1E1E2F",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 6px 25px rgba(0,0,0,0.35)",
            fontSize: "15px",
            fontWeight: 500,
          },
        }}
      />

      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/teacher"
              element={
                <ProtectedRoute role="TEACHER">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/profile"
              element={
                <ProtectedRoute role="TEACHER">
                  <ManageTeacherProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/availability"
              element={
                <ProtectedRoute role="TEACHER">
                  <ManageTeacherAvailability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/bookings"
              element={
                <ProtectedRoute role="TEACHER">
                  <TeacherBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute role="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/find-tutors"
              element={
                <ProtectedRoute role="STUDENT">
                  <BrowseTeachers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/bookings"
              element={
                <ProtectedRoute role="STUDENT">
                  <StudentBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/payments"
              element={
                <ProtectedRoute role="STUDENT">
                  <StudentPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute role="STUDENT">
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/:id"
              element={
                <ProtectedRoute role="STUDENT">
                  <TeacherDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route path="/paymentSuccess" element={<PaymentSuccess />} />
            <Route path="/paymentCancel" element={<PaymentCancel />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimatedBackground />
        <ScrollToTop />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
