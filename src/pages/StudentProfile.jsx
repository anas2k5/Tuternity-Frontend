import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch student profile
  const fetchProfile = async () => {
    try {
      const res = await api.get("/students/me");
      setProfile(res.data);
    } catch {
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // ✅ Handle save with toast + redirect
  const handleSave = async () => {
    try {
      await api.put("/students/me", profile);
      toast.success("Profile updated successfully!");
      setTimeout(() => navigate("/student"), 1500);
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  if (loading)
    return (
      <div>
        <Navbar />
        <div className="p-6 text-gray-700">Loading profile...</div>
      </div>
    );

  if (!profile)
    return (
      <div>
        <Navbar />
        <div className="p-6 text-gray-700">Profile not found.</div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          👨‍🎓 My Student Profile
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              name="name"
              value={profile.user?.name || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  user: { ...profile.user, name: e.target.value },
                })
              }
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Phone</label>
            <input
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">City</label>
            <input
              name="city"
              value={profile.city || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Education Level
            </label>
            <input
              name="educationLevel"
              value={profile.educationLevel || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Interests</label>
            <textarea
              name="interests"
              value={profile.interests || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>

          <button
            onClick={() => navigate("/student")}
            className="ml-3 px-4 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
