import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotAuthorized from './pages/NotAuthorized';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Login />} />
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
              path="/student"
              element={
                <ProtectedRoute role="STUDENT">
                  <StudentDashboard />
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
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
