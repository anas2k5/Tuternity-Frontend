import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AnimatedBackground from "./components/AnimatedBackground";
import PageTransition from "./components/PageTransition";
import { Toaster } from "react-hot-toast";

// Pages
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

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* 🌌 Persistent Animated Background */}
        <AnimatedBackground />

        <div className="min-h-screen bg-transparent text-white relative z-10">
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2500,
              style: {
                background: "#333",
                color: "#fff",
                borderRadius: "10px",
                fontSize: "14px",
              },
              success: { style: { background: "#16a34a" } },
              error: { style: { background: "#dc2626" } },
              loading: { style: { background: "#2563eb" } },
            }}
          />

          {/* ✅ All routes wrapped in smooth transition */}
          <PageTransition>
            <Routes>
              {/* ---------- Public Routes ---------- */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ---------- Teacher Routes ---------- */}
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

              {/* ---------- Student Routes ---------- */}
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

              {/* ---------- Shared ---------- */}
              <Route
                path="/teacher/:id"
                element={
                  <ProtectedRoute role="STUDENT">
                    <TeacherDetails />
                  </ProtectedRoute>
                }
              />

              {/* ---------- Admin Routes ---------- */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ---------- Misc ---------- */}
              <Route path="/not-authorized" element={<NotAuthorized />} />
              <Route path="/paymentSuccess" element={<PaymentSuccess />} />
              <Route path="/paymentCancel" element={<PaymentCancel />} />
            </Routes>
          </PageTransition>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
