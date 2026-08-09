import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { MetricCards } from "./components/MetricCards";
import { ExpenseTable } from "./components/ExpenseTable";
import { AnalyticsView } from "./components/AnalyticsView";
import { ExpenseFormModal } from "./components/ExpenseFormModal";

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expense_tracker_db_v1");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, amount: 10.0, description: "10", category: "Food & Dining", date: "2026-08-09" },
        ];
  });

  const [activeTab, setActiveTab] = useState("expenses");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Date");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const categories = ["Food & Dining", "Transportation", "Utilities", "Entertainment", "Shopping", "Health", "Other"];

  useEffect(() => {
    localStorage.setItem("expense_tracker_db_v1", JSON.stringify(expenses));
  }, [expenses]);

  const cleanExpenses = expenses.map((e) => ({ ...e, amount: Number(e.amount) || 0 }));
  const totalExpenses = cleanExpenses.reduce((sum, item) => sum + item.amount, 0);

  const filteredExpenses = cleanExpenses
    .filter((e) => {
      const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = categoryFilter === "All Categories" || e.category === categoryFilter;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === "Date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "Amount") return b.amount - a.amount;
      return 0;
    });

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSave = (data) => {
    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === editingExpense.id ? { ...data, id: editingExpense.id } : e))
      );
    } else {
      setExpenses((prev) => [{ ...data, id: Date.now() }, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this expense?")) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans flex flex-col pb-12">
      <Navbar />

      {/* Changed max-w-5xl to max-w-7xl (or max-w-full px-12) for wider layout */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-8 flex-1">
        <MetricCards expenses={cleanExpenses} totalExpenses={totalExpenses} />

        <div className="flex justify-between items-center mb-6">
          <div className="bg-gray-200/80 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab("expenses")}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                activeTab === "expenses" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                activeTab === "analytics" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Analytics
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            + Add Expense
          </button>
        </div>

        {activeTab === "expenses" ? (
          <ExpenseTable
            expenses={cleanExpenses}
            filteredExpenses={filteredExpenses}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        ) : (
          <AnalyticsView expenses={cleanExpenses} totalExpenses={totalExpenses} />
        )}
      </main>

      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingExpense={editingExpense}
        categories={categories}
      />
    </div>
  );
}