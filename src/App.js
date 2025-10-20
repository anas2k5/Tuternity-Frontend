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
// ✅ NEW IMPORTS for Teacher Management
import ManageTeacherProfile from "./pages/ManageTeacherProfile"; 
import ManageTeacherAvailability from "./pages/ManageTeacherAvailability"; 


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🛑 TEACHER DASHBOARD ROUTES 🛑 */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute role="TEACHER">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />

            {/* ✅ NEW: Teacher Manage Profile Route */}
            <Route
              path="/teacher/profile"
              element={
                <ProtectedRoute role="TEACHER">
                  <ManageTeacherProfile />
                </ProtectedRoute>
              }
            />

            {/* ✅ NEW: Teacher Manage Availability Route */}
            <Route
              path="/teacher/availability"
              element={
                <ProtectedRoute role="TEACHER">
                  <ManageTeacherAvailability />
                </ProtectedRoute>
              }
            />
            {/* 🛑 END TEACHER ROUTES 🛑 */}


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

            {/* ✅ Teacher Details (Student View) */}
            <Route
              path="/teacher/:id"
              element={<ProtectedRoute role="STUDENT"><TeacherDetails /></ProtectedRoute>}
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
            
            {/* Unauthorized Route */}
            <Route path="/not-authorized" element={<NotAuthorized />} />
            
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;