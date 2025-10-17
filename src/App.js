import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Teacher Dashboard */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute role="TEACHER">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />

            {/* Student Dashboard */}
            <Route
              path="/student"
              element={
                <ProtectedRoute role="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* ✅ Student Browse Teachers */}
            <Route
              path="/student/teachers"
              element={
                <ProtectedRoute role="STUDENT">
                  <BrowseTeachers />
                </ProtectedRoute>
              }
            />

            {/* ✅ Student Bookings */}
            <Route
              path="/student/bookings"
              element={
                <ProtectedRoute role="STUDENT">
                  <StudentBookings />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
  path="/teacher/:id"
  element={<ProtectedRoute role="STUDENT"><TeacherDetails /></ProtectedRoute>}
/>

            {/* Unauthorized Route */}
            <Route path="/not-authorized" element={<NotAuthorized />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
