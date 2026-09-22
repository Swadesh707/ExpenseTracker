import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Even if the backend call fails, clear client-side session
    }
    logout();
    navigate("/login");
  };

  const displayName = user?.name || user?.email || "User";

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-36 flex justify-between items-center">
      <h1 className="text-xl font-bold tracking-tight text-gray-900">Expense Tracker</h1>
      <div className="text-xs text-gray-600 flex items-center gap-3">
        <span>Welcome, {displayName}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}