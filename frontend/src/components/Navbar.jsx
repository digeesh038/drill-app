import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
    const navigate = useNavigate();
    return (
        <nav className="flex justify-between items-center bg-blue-600 text-white px-6 py-3 shadow-md">
            <div className="flex gap-4">
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                <Link to="/history" className="hover:underline">History</Link>
            </div>
            <div className="flex items-center gap-4">
                <span>{user?.name}</span>
                <button
                    onClick={() => onLogout(navigate)}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
