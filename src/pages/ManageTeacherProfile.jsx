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
  Camera,
  Pencil,
  X,
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
    profilePic: "",
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/teachers/me");
        setProfile(res.data || {});
        setPreview(res.data.profilePic || "");
      } catch (err) {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setProfile((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.put("/teachers/me", profile);
      setProfile(res.data);
      setPreview(res.data.profilePic);
      toast.success("Profile updated!");
      setEditMode(false);
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div>
        <Navbar />
        <div className="p-10 text-white">Loading...</div>
      </div>
    );

  return (
    <div
      className="
        min-h-screen 
        bg-gradient-to-br 
        from-[#eadcff] via-[#f6e5ff] to-[#dfe7ff]
        dark:from-[#0b0f19] dark:via-[#0f1626] dark:to-[#0b1220]
        transition-all duration-500
      "
    >
      <Navbar />

      <div className="pt-28 px-6 pb-20">

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            w-full max-w-3xl mx-auto
            bg-white dark:bg-[#111829]/80 
            backdrop-blur-xl 
            border border-gray-200 dark:border-white/10 
            shadow-2xl rounded-3xl p-10 
            transition-all
          "
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Instructor Profile
            </h1>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition"
              >
                <Pencil size={16} /> Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setEditMode(false)}
                className="
                  flex items-center gap-2 px-5 py-2 rounded-xl 
                  bg-gray-300 dark:bg-white/20
                  text-gray-900 dark:text-white 
                  font-semibold hover:bg-gray-200 dark:hover:bg-white/30 
                  transition
                "
              >
                <X size={16} /> Cancel
              </button>
            )}
          </div>

          {/* PROFILE PHOTO */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-36 h-36 mb-4 group">
              <img
                src={
                  preview ||
                  profile.profilePic ||
                  `https://api.dicebear.com/7.x/personas/svg?seed=${profile.user?.name}`
                }
                className="
                  rounded-full w-full h-full object-cover 
                  border-4 border-white/80 dark:border-white/20 
                  shadow-xl
                "
                alt="profile"
              />

              {editMode && (
                <label className="
                  absolute bottom-1 right-1 
                  bg-gradient-to-r from-blue-500 to-purple-600 
                  p-2 rounded-full shadow-lg cursor-pointer 
                  hover:scale-105 transition
                ">
                  <Camera size={16} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>

            {editMode && profile.profilePic && (
              <button
                onClick={() => {
                  setPreview("");
                  setProfile((prev) => ({ ...prev, profilePic: "" }));
                }}
                className="
                  text-sm text-red-500 dark:text-red-400 
                  underline hover:text-red-600 transition
                "
              >
                Remove Photo
              </button>
            )}

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
              {profile.user?.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-300">
              Update your professional details
            </p>
          </div>

          {/* SECTIONS */}
          <div className="space-y-10">

            <ProfileSection title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  icon={<User size={18} />}
                  label="Name"
                  value={profile.user?.name}
                  editable={editMode}
                  name="name"
                  onChange={handleChange}
                />

                <ProfileField
                  icon={<MapPin size={18} />}
                  label="City"
                  value={profile.city}
                  editable={editMode}
                  name="city"
                  onChange={handleChange}
                />
              </div>
            </ProfileSection>

            <ProfileSection title="Professional Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  icon={<BookOpen size={18} />}
                  label="Subject"
                  value={profile.subject}
                  editable={editMode}
                  name="subject"
                  onChange={handleChange}
                />

                <ProfileField
                  icon={<Star size={18} />}
                  label="Skills"
                  value={profile.skills}
                  editable={editMode}
                  name="skills"
                  onChange={handleChange}
                />

                <ProfileField
                  icon={<Briefcase size={18} />}
                  label="Experience (Years)"
                  value={profile.experienceYears}
                  editable={editMode}
                  name="experienceYears"
                  onChange={handleChange}
                />

                <ProfileField
                  icon={<IndianRupee size={18} />}
                  label="Hourly Rate (₹)"
                  value={profile.hourlyRate}
                  editable={editMode}
                  name="hourlyRate"
                  onChange={handleChange}
                />
              </div>
            </ProfileSection>

            <ProfileSection title="About You">
              {!editMode ? (
                <p className="bg-white/5 dark:bg-white/10 text-gray-900 dark:text-gray-200 p-4 rounded-xl">
                  {profile.bio || "No bio added yet."}
                </p>
              ) : (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  className="input-card h-32 resize-none"
                />
              )}
            </ProfileSection>
          </div>

          {editMode && (
            <div className="flex justify-end pt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="
                  flex items-center gap-2 px-6 py-3 
                  rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 
                  text-white font-semibold shadow-lg hover:scale-105 transition
                "
              >
                <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ProfileSection({ title, children }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ProfileField({ icon, label, value, editable, name, onChange }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-1">
        {icon} {label}
      </label>

      {!editable ? (
        <p className="bg-white/5 dark:bg-white/10 text-gray-900 dark:text-gray-200 p-3 rounded-xl">
          {value || "—"}
        </p>
      ) : (
        <input
          autoComplete="off"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="input-card"
          placeholder={label}
        />
      )}
    </div>
  );
}
