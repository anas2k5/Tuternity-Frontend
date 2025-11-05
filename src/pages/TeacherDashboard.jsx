import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const handleManageProfile = () => {
    navigate('/teacher/profile');
  };

  const handleManageAvailability = () => {
    navigate('/teacher/availability');
  };

  const handleViewBookings = () => {
    navigate('/teacher/bookings');
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manage Profile */}
          <div
            onClick={handleManageProfile}
            className="bg-white shadow-lg p-6 rounded-xl cursor-pointer hover:bg-gray-50 transition duration-200"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              <span className="mr-2" role="img" aria-label="Profile Icon">👤</span>
              Manage Profile
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Update your bio, subject, skills, and hourly rate.
            </p>
          </div>

          {/* Manage Availability */}
          <div
            onClick={handleManageAvailability}
            className="bg-white shadow-lg p-6 rounded-xl cursor-pointer hover:bg-gray-50 transition duration-200"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              <span className="mr-2" role="img" aria-label="Calendar Icon">📅</span>
              Manage Availability
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              View, add, or remove your available time slots for students.
            </p>
          </div>

          {/* My Bookings */}
          <div
            onClick={handleViewBookings}
            className="bg-white shadow-lg p-6 rounded-xl cursor-pointer hover:bg-gray-50 transition duration-200"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              <span className="mr-2" role="img" aria-label="Bookings Icon">📖</span>
              My Bookings
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              View all bookings from your students and manage their status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
