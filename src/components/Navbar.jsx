import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout(); // AuthContext handles the backend call + local clear
    navigate("/login");
  };

  const displayName = user?.name || user?.email || "User";

  return (
    <header className="bg-white border-b border-gray-200 py-3.5 px-8 md:px-16 flex justify-between items-center relative">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          Expense Tracker
        </Link>
      </div>

      <div className="text-xs text-gray-600 flex items-center gap-3">
        {/* Admin Toggle Switch – switch between Categories & Users */}
        {isAdmin && (
          <div className="bg-gray-100 p-1 rounded-xl flex items-center text-xs">
            <Link
              to="/admin/categories"
              className={`px-3.5 py-1.5 rounded-lg transition font-medium ${
                location.pathname === "/admin/categories"
                  ? "bg-white text-gray-900 shadow-xs font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Categories
            </Link>
            <Link
              to="/admin/users"
              className={`px-3.5 py-1.5 rounded-lg transition font-medium ${
                location.pathname === "/admin/users"
                  ? "bg-white text-gray-900 shadow-xs font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Users
            </Link>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">Welcome,</span>
          <span className="font-medium text-gray-900">{displayName}</span>
        </div>

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