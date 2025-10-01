import React, { useEffect, useState } from "react";
import api from "../api";

function StudentDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/teacher")
      .then((res) => {
        console.log("Teachers response:", res.data);
        setTeachers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teachers:", err.response?.data || err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading teachers...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Available Teachers</h2>
      {teachers.length === 0 ? (
        <p>No teachers found</p>
      ) : (
        <ul className="space-y-3">
          {teachers.map((t) => (
            <li
              key={t.id}
              className="p-4 border rounded shadow-sm bg-white"
            >
              <strong>{t.user.name}</strong> - {t.subject} ({t.hourlyRate}$/hr)
              <br />
              <em>{t.bio}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentDashboard;
