import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div
            className="p-4 border rounded shadow hover:bg-blue-100 cursor-pointer"
            onClick={() => navigate("/student/teachers")}
          >
            📚 Browse Teachers
          </div>
          <div
            className="p-4 border rounded shadow hover:bg-blue-100 cursor-pointer"
            onClick={() => navigate("/student/bookings")}
          >
            📅 Your Bookings
          </div>
        </div>
      </div>
    </div>
  );
}
