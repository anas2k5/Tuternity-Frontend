import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  GraduationCap,
  Heart,
  Save,
  ArrowLeftCircle,
} from "lucide-react";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

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
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700">
        <Navbar />
        <p className="text-lg">Loading your profile...</p>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700">
        <Navbar />
        <p className="text-lg">Profile not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
      <Navbar />

      <div className="pt-24 px-6 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-[0_0_35px_rgba(56,189,248,0.3)] relative overflow-hidden"
        >
          {/* Glow Aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/30 via-blue-500/20 to-purple-500/30 blur-3xl rounded-3xl"></div>

          {/* Header */}
          <div className="relative text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-md flex items-center justify-center gap-2">
              🎓 My Profile
            </h1>
            <p className="text-white/70 mt-1">
              Update your personal details and preferences
            </p>
          </div>

          {/* Form */}
          <div className="relative space-y-6 z-10">
            {[
              { label: "Name", icon: User, name: "name", value: profile.user?.name, isUserField: true },
              { label: "Phone", icon: Phone, name: "phone", value: profile.phone },
              { label: "City", icon: MapPin, name: "city", value: profile.city },
              { label: "Education Level", icon: GraduationCap, name: "educationLevel", value: profile.educationLevel },
              { label: "Interests", icon: Heart, name: "interests", value: profile.interests, textarea: true },
            ].map((field, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <label className="flex items-center gap-2 text-white/90 font-semibold mb-1">
                  <field.icon size={18} /> {field.label}
                </label>

                {field.textarea ? (
                  <textarea
                    name={field.name}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.isUserField
                        ? setProfile({
                            ...profile,
                            user: { ...profile.user, name: e.target.value },
                          })
                        : handleChange(e)
                    }
                    rows="3"
                    className="w-full p-3 rounded-xl bg-white/15 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.isUserField
                        ? setProfile({
                            ...profile,
                            user: { ...profile.user, name: e.target.value },
                          })
                        : handleChange(e)
                    }
                    className="w-full p-3 rounded-xl bg-white/15 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                )}
              </motion.div>
            ))}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                onClick={() => navigate("/student")}
                className="px-5 py-2.5 rounded-lg bg-white/20 text-white/90 font-medium hover:bg-white/30 hover:scale-[1.03] transition-all flex items-center gap-2"
              >
                <ArrowLeftCircle size={18} /> Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] hover:scale-[1.05] transition-all flex items-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
