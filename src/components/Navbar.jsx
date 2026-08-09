import React from "react";

export function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-36 flex justify-between items-center">
      <h1 className="text-xl font-bold tracking-tight text-gray-900">ExpenseTracker</h1>
      <div className="text-xs text-gray-600 flex items-center gap-3">
        <span>Welcome, User</span>
        <button className="flex items-center gap-1.5 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium cursor-pointer">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}