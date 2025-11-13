// ----------------------------------------------------------
// BEAUTIFUL, FIXED, LIGHT/DARK-THEMED EDIT PROFILE PAGE
// ----------------------------------------------------------

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
  ArrowLeft,
  Save,
} from "lucide-react";

export default function EditStudentProfile() {
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

  const updateUserField = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      user: { ...prev.user, [key]: value },
    }));
  };

  const updateField = (name, value) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await api.put("/students/me", profile);
      toast.success("Profile updated!");
      navigate("/student/profile");
    } catch {
      toast.error("Failed to save changes.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Navbar />
        <p className="text-white">Loading…</p>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Navbar />
        <p className="text-white">Profile not found.</p>
      </div>
    );

  return (
    <div
      className="
        min-h-screen 
        bg-gradient-to-br 
        from-[#f4f6ff] via-[#f8f0ff] to-[#eef3ff]
        dark:bg-landing-dark 
        transition-colors duration-500 
        text-gray-900 dark:text-gray-100
      "
    >
      <Navbar />

      <div className="max-w-6xl mx-auto pt-24 px-6 pb-20">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-center mb-2 flex items-center justify-center gap-2"
        >
          <span className="text-indigo-500 dark:text-indigo-400">✏️</span>
          Edit Profile
        </motion.h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
          Update your personal details and preferences
        </p>

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            grid grid-cols-1 md:grid-cols-3 gap-10
            bg-white/70 dark:bg-white/5 
            backdrop-blur-xl
            border border-white/60 dark:border-white/10
            rounded-3xl p-10 shadow-xl
          "
        >
          {/* ---------------- LEFT PROFILE PANEL ---------------- */}
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex justify-center items-center text-white text-4xl font-bold shadow-xl mb-4">
              {profile.user?.name?.charAt(0)?.toUpperCase()}
            </div>

            <h2 className="text-xl font-bold">{profile.user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {profile.user?.email}
            </p>

            <div className="mt-6 w-full space-y-3">
              <div className="p-3 rounded-xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10">
                <strong>City:</strong> {profile.city}
              </div>
              <div className="p-3 rounded-xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10">
                <strong>Education:</strong> {profile.educationLevel}
              </div>
              <div className="p-3 rounded-xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10">
                <strong>Interests:</strong> {profile.interests}
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT FORM PANEL ---------------- */}
          <div className="md:col-span-2 space-y-6">
            {[
              {
                label: "Name",
                icon: User,
                value: profile.user?.name,
                onChange: (v) => updateUserField("name", v),
              },
              {
                label: "Phone",
                icon: Phone,
                value: profile.phone,
                onChange: (v) => updateField("phone", v),
              },
              {
                label: "City",
                icon: MapPin,
                value: profile.city,
                onChange: (v) => updateField("city", v),
              },
              {
                label: "Education Level",
                icon: GraduationCap,
                value: profile.educationLevel,
                onChange: (v) => updateField("educationLevel", v),
              },
              {
                label: "Interests",
                icon: Heart,
                value: profile.interests,
                textarea: true,
                onChange: (v) => updateField("interests", v),
              },
            ].map((field, i) => (
              <div key={i}>
                <label className="flex items-center gap-2 mb-1 font-medium text-gray-700 dark:text-gray-300">
                  <field.icon size={18} /> {field.label}
                </label>

                {field.textarea ? (
                  <textarea
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    rows={3}
                    className="
                      w-full p-3 rounded-xl
                      bg-white/90 dark:bg-white/10
                      border border-gray-300 dark:border-white/10
                      text-gray-900 dark:text-gray-100
                      focus:ring-2 ring-indigo-500/50 
                      focus:outline-none
                    "
                  />
                ) : (
                  <input
                    type="text"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="
                      w-full p-3 rounded-xl
                      bg-white/90 dark:bg-white/10
                      border border-gray-300 dark:border-white/10
                      text-gray-900 dark:text-gray-100
                      focus:ring-2 ring-indigo-500/50 
                      focus:outline-none
                    "
                  />
                )}
              </div>
            ))}

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => navigate("/student/profile")}
                className="
                  px-5 py-2.5 rounded-lg 
                  bg-gray-500/20 dark:bg-white/10 
                  hover:bg-gray-500/30 dark:hover:bg-white/20 
                  transition flex items-center gap-2
                "
              >
                <ArrowLeft size={18} /> Cancel
              </button>

              <button
                onClick={handleSave}
                className="
                  px-6 py-2.5 rounded-lg 
                  bg-indigo-600 hover:bg-indigo-700 
                  text-white transition flex items-center gap-2
                "
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
