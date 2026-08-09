import React from "react";

export function AnalyticsView({ expenses, totalExpenses }) {
  const avgExpense = expenses.length ? totalExpenses / expenses.length : 0;
  const highestExpense = expenses.length ? Math.max(...expenses.map((e) => e.amount)) : 0;

  const catTotals = {};
  expenses.forEach((e) => (catTotals[e.category] = (catTotals[e.category] || 0) + e.amount));

  let mostExpensiveCat = "N/A";
  let maxCatAmount = 0;
  Object.entries(catTotals).forEach(([cat, amt]) => {
    if (amt > maxCatAmount) {
      maxCatAmount = amt;
      mostExpensiveCat = cat;
    }
  });

  const colors = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#64748b"];

  const now = new Date();
  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthLabel = d.toLocaleString("en-US", { month: "short" });
    const total = expenses
      .filter((e) => {
        const expDate = new Date(e.date);
        return expDate.getMonth() === d.getMonth() && expDate.getFullYear() === d.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);
    return { monthLabel, total };
  });
  const maxMonthlyTotal = Math.max(...monthlyData.map((d) => d.total), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs font-semibold text-gray-500">Average Expense</p>
          <h3 className="text-xl font-bold mt-2 text-gray-900">${avgExpense.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs font-semibold text-gray-500">Highest Transaction</p>
          <h3 className="text-xl font-bold mt-2 text-gray-900">${highestExpense.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs font-semibold text-gray-500">Top Spending Category</p>
          <h3 className="text-xl font-bold mt-2 text-gray-900">{mostExpensiveCat}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <h4 className="text-xs font-bold text-gray-900 mb-1">Expenses Distribution</h4>
          <p className="text-[11px] text-gray-400 mb-6">Visual breakdown by category</p>
          <div className="flex items-center justify-center py-2">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {(() => {
                  let cumulativePercent = 0;
                  return Object.entries(catTotals).map(([cat, total], idx) => {
                    const pct = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
                    const strokeDasharray = `${pct} ${100 - pct}`;
                    const strokeDashoffset = -cumulativePercent;
                    cumulativePercent += pct;
                    return (
                      <circle
                        key={cat}
                        cx="18"
                        cy="18"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke={colors[idx % colors.length]}
                        strokeWidth="4.5"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                      />
                    );
                  });
                })()}
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <h4 className="text-xs font-bold text-gray-900 mb-1">Monthly Trend</h4>
          <p className="text-[11px] text-gray-400 mb-6">Spending over the past 6 months</p>
          <div className="h-36 flex items-end justify-between gap-2 pt-4 border-b border-gray-100">
            {monthlyData.map((d, i) => {
              const heightPct = (d.total / maxMonthlyTotal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div
                    className="w-full bg-purple-500 rounded-t-sm transition-all"
                    style={{ height: `${Math.max(heightPct, 6)}%` }}
                  ></div>
                  <span className="text-[10px] text-gray-400 mt-2">{d.monthLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <h4 className="text-xs font-bold text-gray-900 mb-4">Detailed Category Breakdown</h4>
        <div className="space-y-3">
          {Object.entries(catTotals).map(([cat, total], idx) => {
            const pct = totalExpenses > 0 ? ((total / totalExpenses) * 100).toFixed(1) : 0;
            return (
              <div key={cat} className="flex justify-between items-center text-xs py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></span>
                  <span className="font-medium text-gray-800">{cat}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
                  <span className="text-[10px] text-gray-400 block text-right">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}