import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { AuthContext } from '../context/AuthContext'; // To get the user's name/email if needed

export default function ManageTeacherProfile() {
    const { user } = useContext(AuthContext); // Get current user info (email is critical for display)
    const [profileData, setProfileData] = useState({
        name: user?.name || '', // Use name from context for initial display
        bio: '',
        subject: '',
        skills: '',
        hourlyRate: 0,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // --- 1. Fetch Current Profile Data ---
    useEffect(() => {
        setLoading(true);
        // The endpoint is secure; the JWT token is attached via the axios interceptor
        api.get('/teacher/profile') 
            .then(res => {
                const data = res.data;
                setProfileData({
                    // User data comes from the nested user object
                    name: data.user.name, 
                    bio: data.bio || '',
                    subject: data.subject || '',
                    skills: data.skills || '',
                    hourlyRate: data.hourlyRate || 0,
                });
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch profile:", err);
                setError("Failed to load profile data.");
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: name === 'hourlyRate' ? parseFloat(value) || 0 : value
        }));
    };

    // --- 2. Handle Profile Update ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            // Send the updated data to the backend PUT endpoint
            await api.put('/teacher/profile', profileData); 
            setMessage("Profile updated successfully!");
        } catch (err) {
            console.error("Update failed:", err);
            setError(err.response?.data?.message || "Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div><Navbar /><div className="p-6">Loading profile...</div></div>;

    return (
        <div>
            <Navbar />
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Manage Profile</h1>
                
                {message && <p className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</p>}
                {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-xl">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">User Details</h2>
                    
                    {/* Name Field (from User Entity) */}
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

                    <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-6">Teaching Profile</h2>
                    
                    {/* Bio Field */}
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
                    
                    {/* Subject Field */}
                    <div className="mb-4">
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
                    
                    {/* Skills Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Skills (e.g., Python, SQL, Django)</label>
                        <input
                            type="text"
                            name="skills"
                            value={profileData.skills}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    {/* Hourly Rate Field */}
                    <div className="mb-6">
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

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition"
                    >
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}