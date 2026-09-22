import React from "react";

export function MetricCards({ summary }) {
  const totalExpenses = Number(summary?.totalExpenses) || 0;
  const thisMonthExpenses = Number(summary?.thisMonthExpenses) || 0;
  const totalTransactions = Number(summary?.totalTransactions) || 0;
  const categoriesCount = Number(summary?.categoriesCount) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100/80 shadow-xs flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-gray-900 mb-6">Total Expenses</p>
          <h2 className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</h2>
        </div>
        <span className="text-gray-400 text-sm font-normal">$</span>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100/80 shadow-xs flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-gray-900 mb-6">This Month</p>
          <h2 className="text-2xl font-bold text-gray-900">${thisMonthExpenses.toFixed(2)}</h2>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100/80 shadow-xs flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-gray-900 mb-6">Total Transactions</p>
          <h2 className="text-2xl font-bold text-gray-900">{totalTransactions}</h2>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 005.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.94" />
        </svg>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100/80 shadow-xs flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-gray-900 mb-6">Categories</p>
          <h2 className="text-2xl font-bold text-gray-900">{categoriesCount}</h2>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  );
}