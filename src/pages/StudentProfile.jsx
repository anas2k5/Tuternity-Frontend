// ---------------------- FULL UPDATED STUDENT PROFILE (WITH IMAGE UPLOAD + REMOVE) ----------------------

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
  Copy,
  Edit3,
  Camera,
  Trash2,
} from "lucide-react";

import { getJSON } from "../utils/storage";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    sessions: 0,
    hoursStudied: 0,
    tutors: 0,
  });

  const [preview, setPreview] = useState(""); // For uploaded image preview

  const navigate = useNavigate();

  // ------------------ Fetch Student Profile ------------------
  const fetchProfile = async () => {
    try {
      const res = await api.get("/students/me");
      setProfile(res.data);
      setPreview(res.data.profilePic || "");
    } catch {
      toast.error("Failed to load profile.");
    }
  };

  // ------------------ Fetch Stats ------------------
  const fetchStats = async () => {
    try {
      const localProfile = getJSON("profile");
      const studentId = localProfile?.id;
      if (!studentId) return;

      const res = await api.get(`/bookings/student/${studentId}`);
      const bookings = res.data || [];

      const completed = bookings.filter((b) => b.status === "COMPLETED");

      const hoursStudied = completed.length * 1.0;
      const uniqueTutors = new Set(bookings.map((b) => b.teacherName));

      setStats({
        sessions: bookings.length,
        hoursStudied,
        tutors: uniqueTutors.size,
      });
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  if (!profile)
    return (
      <div className="min-h-screen bg-landing-light dark:bg-landing-dark">
        <Navbar />
        <p className="text-center pt-32 text-white">Loading profile…</p>
      </div>
    );

  // ------------------ Copy Email ------------------
  const copyEmail = async () => {
    try {
      const email = profile?.user?.email;
      if (!email) return toast.error("Email not found.");

      await navigator.clipboard.writeText(email);
      toast.success("Email copied!");
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy email.");
    }
  };

  // ------------------ Upload Profile Image ------------------
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setPreview(reader.result);

        const updated = { ...profile, profilePic: reader.result };
        setProfile(updated);

        await api.put("/students/me", updated);
        toast.success("Profile picture updated!");
      } catch {
        toast.error("Failed to update picture.");
      }
    };

    reader.readAsDataURL(file);
  };

  // ------------------ Remove Profile Image ------------------
  const removePhoto = async () => {
    try {
      const updated = { ...profile, profilePic: "" };
      setProfile(updated);
      setPreview("");

      await api.put("/students/me", updated);
      toast.success("Profile picture removed!");
    } catch {
      toast.error("Failed to remove picture.");
    }
  };

  return (
    <div className="relative z-[5] min-h-screen bg-landing-light dark:bg-landing-dark transition-colors duration-500 text-gray-900 dark:text-gray-100 pointer-events-auto">
      <Navbar />

      <div className="pt-24 px-6 max-w-6xl mx-auto pb-16">

        {/* -------------------------------------------------
            TOP PROFILE CARD
        --------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-xl mb-10"
        >
          <div className="flex items-center justify-between">

            {/* Avatar + Name */}
            <div className="flex items-center gap-6">

              {/* ---------------- PROFILE IMAGE ---------------- */}
              <div className="relative w-20 h-20">
                <img
                  src={
                    preview ||
                    profile.profilePic ||
                    `https://api.dicebear.com/7.x/personas/svg?seed=${profile.user?.name}`
                  }
                  className="w-20 h-20 rounded-full object-cover shadow-lg border border-white/20"
                  alt="Student Avatar"
                />

                {/* Upload Button */}
                <label className="absolute bottom-0 right-0 bg-indigo-600 p-1 rounded-full cursor-pointer shadow hover:scale-105 transition">
                  <Camera size={16} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {/* Remove Photo Button */}
                {preview && (
                  <button
                    onClick={removePhoto}
                    className="absolute -bottom-2 left-1 bg-red-600 p-1 rounded-full shadow hover:bg-red-700 transition"
                  >
                    <Trash2 size={14} className="text-white" />
                  </button>
                )}
              </div>

              {/* ---------------- Name + Info ---------------- */}
              <div>
                <h1 className="text-2xl font-extrabold">{profile.user?.name}</h1>

                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Keep learning — stay curious.
                </p>

                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1">
                    <GraduationCap size={16} /> {profile.educationLevel}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={16} /> {profile.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={16} /> {profile.interests}
                  </span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate("/student")}
              className="px-4 py-2 bg-white/20 dark:bg-white/10 rounded-lg hover:bg-white/30 transition flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Back
            </button>
          </div>
        </motion.div>

        {/* -------------------------------------------------
            STATS ROW
        --------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
        >
          <div className="p-6 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-300/20 shadow backdrop-blur-xl">
            <p className="text-lg font-semibold">Sessions</p>
            <h2 className="text-3xl font-bold mt-2">{stats.sessions}</h2>
          </div>

          <div className="p-6 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-300/20 shadow backdrop-blur-xl">
            <p className="text-lg font-semibold">Hours Studied</p>
            <h2 className="text-3xl font-bold mt-2">{stats.hoursStudied} hrs</h2>
          </div>

          <div className="p-6 rounded-xl bg-purple-600/10 dark:bg-purple-500/20 border border-purple-300/20 shadow backdrop-blur-xl">
            <p className="text-lg font-semibold">Tutors Connected</p>
            <h2 className="text-3xl font-bold mt-2">{stats.tutors}</h2>
          </div>
        </motion.div>

        {/* -------------------------------------------------
            PROFILE DETAILS
        --------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          {/* Personal */}
          <div className="p-6 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow">
            <h2 className="text-xl font-semibold mb-4">Personal</h2>

            <p>
              <strong>Name:</strong> {profile.user?.name}
            </p>

            <p className="mt-2 flex items-center gap-2">
              <Phone size={16} /> {profile.phone}
            </p>

            <p className="mt-1 flex items-center gap-2">
              <MapPin size={16} /> {profile.city}
            </p>
          </div>

          {/* Education */}
          <div className="p-6 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow">
            <h2 className="text-xl font-semibold mb-4">Education & Account</h2>

            <p className="flex items-center gap-2">
              <GraduationCap size={16} /> {profile.educationLevel}
            </p>

            <p className="mt-2 flex items-center gap-2">
              <User size={16} /> {profile.user?.email}
            </p>
          </div>

          {/* Interests */}
          <div className="p-6 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow">
            <h2 className="text-xl font-semibold mb-4">Interests</h2>

            <p>{profile.interests}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate("/student/profile/edit")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <Edit3 size={16} /> Edit Profile
              </button>

              <button
                onClick={copyEmail}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              >
                <Copy size={16} /> Copy Email
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-700 dark:text-gray-300">
          Pro tip: Edit your details anytime — updates reflect instantly.
        </p>
      </div>
    </div>
  );
}
