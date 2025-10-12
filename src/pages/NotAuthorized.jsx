import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function NotAuthorized() {
  return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">Not authorized</h2>
        <p className="mb-4">You do not have permission to view this page.</p>
        <Link to="/" className="text-blue-600">Go home</Link>
      </div>
    </>
  );
}
