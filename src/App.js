// src/App.js
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import React, { useEffect, useState } from "react";

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

import { ThemeContext } from "./context/ThemeContext";
import { useContext } from "react";

// -------------------------------------------
// Scroll Restoration on Route Change
// -------------------------------------------
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

// -------------------------------------------
// App Content — Theme Aware Wrapper
// -------------------------------------------
function AppContent() {
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [location]);

  if (loading) return <Loader />;

  return (
    <div
      className={`
        min-h-screen w-full 
        bg-white dark:bg-[#0f172a] 
        text-gray-900 dark:text-gray-100
        transition-colors duration-500
      `}
    >
      {/* GLOBAL TOASTER */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "linear-gradient(135deg,#1E1B4B 0%,#312E81 100%)",
            color: "#E0E7FF",
            borderRadius: 12,
            border: "1px solid rgba(99,102,241,0.35)",
            boxShadow: "0 6px 25px rgba(79,70,229,0.35)",
            fontSize: 15,
          },
        }}
      />

      {/* PAGE TRANSITIONS */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* PUBLIC ROUTES */}
          <Route
            path="/"
            element={
              <PageTransition>
                <LandingPage />
              </PageTransition>
            }
          />

          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />

          <Route
            path="/register"
            element={
              <PageTransition>
                <Register />
              </PageTransition>
            }
          />

          {/* TEACHER ROUTES */}
          <Route
            path="/teacher"
            element={
              <PageTransition>
                <ProtectedRoute role="TEACHER">
                  <TeacherDashboard />
                </ProtectedRoute>
              </PageTransition>
            }
          />

          <Route
            path="/teacher/profile"
            element={
              <PageTransition>
                <ProtectedRoute role="TEACHER">
                  <ManageTeacherProfile />
                </ProtectedRoute>
              </PageTransition>
            }
          />

          <Route
            path="/teacher/availability"
            element={
              <PageTransition>
                <ProtectedRoute role="TEACHER">
                  <ManageTeacherAvailability />
                </ProtectedRoute>
              </PageTransition>
            }
          />

          <Route
            path="/teacher/bookings"
            element={
              <PageTransition>
                <ProtectedRoute role="TEACHER">
                  <TeacherBookings />
                </ProtectedRoute>
              </PageTransition>
            }
          />

          {/* STUDENT ROUTES */}
          <Route
            path="/student"
            element={
              <PageTransition>
                <ProtectedRoute role="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              </PageTransition>
            }
          />

          <Route
            path="/student/find-tutors"
            element={
              <PageTransition>
                <ProtectedRoute role="STUDENT">
                  <BrowseTeachers />
                </ProtectedRoute>
              </PageTransition>
            }
          />

          <Route
            path="/student/bookings"
            element={
              <PageTransition>
                <ProtectedRoute role="STUDENT">
                  <StudentBookings />
                </ProtectedRoute>
              </PageTransition>
            }
          />

          <Route
            path="/student/payments"
            element={
              <PageTransition>
                <ProtectedRoute role="STUDENT">
                  <StudentPayments />
                </ProtectedRoute>
              </PageTransition>
            }
          />

          <Route
            path="/student/profile"
            element={
              <PageTransition>
                <ProtectedRoute role="STUDENT">
                  <StudentProfile />
                </ProtectedRoute>
              </PageTransition>
            }
          />

          <Route
            path="/teacher/:id"
            element={
              <PageTransition>
                <ProtectedRoute role="STUDENT">
                  <TeacherDetails />
                </ProtectedRoute>
              </PageTransition>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <PageTransition>
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              </PageTransition>
            }
          />

          {/* MISC */}
          <Route
            path="/not-authorized"
            element={
              <PageTransition>
                <NotAuthorized />
              </PageTransition>
            }
          />

          <Route
            path="/paymentSuccess"
            element={
              <PageTransition>
                <PaymentSuccess />
              </PageTransition>
            }
          />

          <Route
            path="/paymentCancel"
            element={
              <PageTransition>
                <PaymentCancel />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------
// Root with Providers
// -------------------------------------------
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedBackground />
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
