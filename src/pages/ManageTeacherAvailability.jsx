import React from 'react';
import Navbar from '../components/Navbar';

export default function ManageTeacherAvailability() {
    // You will add the logic to display, add, and delete availability slots here
    return (
        <div>
            <Navbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Manage Availability</h1>
                <p>Calendar/List view to add/remove/edit available slots will go here.</p>
            </div>
        </div>
    );
}