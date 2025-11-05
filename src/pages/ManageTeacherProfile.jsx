import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ManageTeacherProfile() {
  const { user } = useContext(AuthContext || {}); // safe fallback
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    subject: "",
    skills: "",
    experienceYears: 0,
    hourlyRate: 0,
    bio: "",
    city: "",
    available: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        // GET the teacher's profile (your backend exposes /api/teachers/me)
        const res = await api.get("/teachers/me");
        const data = res.data || {};

        setProfileData({
          name: data.user?.name || user?.name || "",
          subject: data.subject || "",
          skills: data.skills || "",
          experienceYears: data.experienceYears ?? 0,
          hourlyRate: data.hourlyRate ?? 0,
          bio: data.bio || "",
          city: data.city || "",
          available: data.available ?? false,
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        // If unauthorized, redirect to login
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setError("Unauthorized. Please log in.");
          navigate("/login");
          return;
        }
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "experienceYears"
          ? parseInt(value || 0, 10)
          : name === "hourlyRate"
          ? parseFloat(value || 0)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      // PUT to update teacher profile (backend expects TeacherProfileRequest shape)
      await api.put("/teachers/me", {
        name: profileData.name,
        subject: profileData.subject,
        skills: profileData.skills,
        experienceYears: profileData.experienceYears,
        hourlyRate: profileData.hourlyRate,
        bio: profileData.bio,
        city: profileData.city,
        available: profileData.available,
      });

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setError("Unauthorized. Please log in.");
        navigate("/login");
      } else {
        setError(err?.response?.data?.message || "Failed to save profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-6 text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manage Profile</h1>

        {message && (
          <p className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</p>
        )}
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-xl">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">User Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-6">
            Teaching Profile
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                value={profileData.subject}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              <input
                type="text"
                name="skills"
                value={profileData.skills}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g., Python, SQL"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
              <input
                type="number"
                name="experienceYears"
                value={profileData.experienceYears}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hourly Rate (₹)</label>
              <input
                type="number"
                name="hourlyRate"
                value={profileData.hourlyRate}
                onChange={handleChange}
                min="0"
                step="10"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={profileData.city}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <input
              id="available"
              type="checkbox"
              name="available"
              checked={profileData.available}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="available" className="text-sm text-gray-700">Available for bookings</label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
