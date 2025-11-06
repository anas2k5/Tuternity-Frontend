import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function ManageTeacherProfile() {
  const [profile, setProfile] = useState({
    subject: "",
    skills: "",
    experienceYears: "",
    hourlyRate: "",
    city: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch teacher's own profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/teachers/me");
        setProfile(res.data || {});
      } catch (err) {
        console.error("❌ Failed to fetch teacher profile:", err);
        toast.error("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save changes to backend
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put("/teachers/me", profile);
      setProfile(res.data);
      toast.success("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div>
        <Navbar />
        <div className="p-6 text-gray-700">Loading profile...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          👨‍🏫 Manage Your Teaching Profile
        </h1>

        <form
          onSubmit={handleSave}
          className="bg-white shadow-md rounded-xl p-6 space-y-4"
        >
          {/* Subject */}
          <div>
            <label className="block text-gray-700 font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={profile.subject || ""}
              onChange={handleChange}
              placeholder="E.g. Mathematics"
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-gray-700 font-medium">Skills</label>
            <input
              type="text"
              name="skills"
              value={profile.skills || ""}
              onChange={handleChange}
              placeholder="E.g. React, Java, Python"
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-gray-700 font-medium">
              Experience (Years)
            </label>
            <input
              type="number"
              name="experienceYears"
              value={profile.experienceYears || ""}
              onChange={handleChange}
              placeholder="E.g. 5"
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-gray-700 font-medium">
              Hourly Rate (₹)
            </label>
            <input
              type="number"
              name="hourlyRate"
              value={profile.hourlyRate || ""}
              onChange={handleChange}
              placeholder="E.g. 800"
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700 font-medium">City</label>
            <input
              type="text"
              name="city"
              value={profile.city || ""}
              onChange={handleChange}
              placeholder="E.g. Hyderabad"
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 font-medium">Bio</label>
            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your teaching style, background, and specialties..."
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full py-2 text-white rounded ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
