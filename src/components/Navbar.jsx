import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [adminOpen, setAdminOpen] = useState(false);

  const handleLogout = () => {
    logout(); // AuthContext handles the backend call + local clear
    navigate("/login");
  };

  const displayName = user?.name || user?.email || "User";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-8 md:px-16 flex justify-between items-center relative">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          Expense Tracker
        </Link>

        {/* Admin navigation badge */}
        {isAdminPage && (
          <span className="bg-purple-50 text-purple-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
            Admin Panel
          </span>
        )}
      </div>

      <div className="text-xs text-gray-600 flex items-center gap-3">
        {/* Admin Dropdown – only visible to admins */}
        {isAdmin && (
          <div className="relative">
            <button
              onClick={() => setAdminOpen((o) => !o)}
              className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-lg transition text-xs font-medium cursor-pointer ${
                isAdminPage
                  ? "border-purple-200 text-purple-700 bg-purple-50"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Admin
              <svg className={`w-3 h-3 transition-transform ${adminOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {adminOpen && (
              <div
                className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1"
                onMouseLeave={() => setAdminOpen(false)}
              >
                <Link
                  to="/admin/categories"
                  onClick={() => setAdminOpen(false)}
                  className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                    Categories
                  </span>
                </Link>
                <Link
                  to="/admin/users"
                  onClick={() => setAdminOpen(false)}
                  className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    Users
                  </span>
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">Welcome,</span>
          <span className="font-medium text-gray-900">{displayName}</span>
          {isAdmin && (
            <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
              ADMIN
            </span>
          )}
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