import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  User,
  BookOpen,
  Star,
  Briefcase,
  IndianRupee,
  MapPin,
  FileText,
  Save,
} from "lucide-react";

export default function ManageTeacherProfile() {
  const [profile, setProfile] = useState({
    user: { name: "" },
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

  // ✅ Handle field change (supports nested user.name)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setProfile((prev) => ({
        ...prev,
        user: { ...prev.user, name: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Save profile to backend
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
        <div className="p-6 text-white bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 min-h-screen">
          Loading profile...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
      <Navbar />

      <div className="pt-24 px-6 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-extrabold text-center mb-8 flex items-center justify-center gap-2">
            👨‍🏫 Manage Your Profile
          </h1>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-white/90 font-semibold">
                <User size={18} /> Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.user?.name || ""}
                onChange={handleChange}
                placeholder="E.g. John Doe"
                className="w-full mt-1 bg-white/10 text-white rounded-lg p-2 border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="flex items-center gap-2 text-white/90 font-semibold">
                <BookOpen size={18} /> Subject
              </label>
              <input
                type="text"
                name="subject"
                value={profile.subject || ""}
                onChange={handleChange}
                placeholder="E.g. Mathematics"
                className="w-full mt-1 bg-white/10 text-white rounded-lg p-2 border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="flex items-center gap-2 text-white/90 font-semibold">
                <Star size={18} /> Skills
              </label>
              <input
                type="text"
                name="skills"
                value={profile.skills || ""}
                onChange={handleChange}
                placeholder="E.g. React, Java, Python"
                className="w-full mt-1 bg-white/10 text-white rounded-lg p-2 border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="flex items-center gap-2 text-white/90 font-semibold">
                <Briefcase size={18} /> Experience (Years)
              </label>
              <input
                type="number"
                name="experienceYears"
                value={profile.experienceYears || ""}
                onChange={handleChange}
                placeholder="E.g. 5"
                className="w-full mt-1 bg-white/10 text-white rounded-lg p-2 border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="flex items-center gap-2 text-white/90 font-semibold">
                <IndianRupee size={18} /> Hourly Rate (₹)
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={profile.hourlyRate || ""}
                onChange={handleChange}
                placeholder="E.g. 800"
                className="w-full mt-1 bg-white/10 text-white rounded-lg p-2 border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* City */}
            <div>
              <label className="flex items-center gap-2 text-white/90 font-semibold">
                <MapPin size={18} /> City
              </label>
              <input
                type="text"
                name="city"
                value={profile.city || ""}
                onChange={handleChange}
                placeholder="E.g. Hyderabad"
                className="w-full mt-1 bg-white/10 text-white rounded-lg p-2 border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-white/90 font-semibold">
                <FileText size={18} /> Bio
              </label>
              <textarea
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your teaching style, background, and specialties..."
                className="w-full mt-1 bg-white/10 text-white rounded-lg p-2 border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-5 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-semibold text-white transition-all ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                }`}
              >
                <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
