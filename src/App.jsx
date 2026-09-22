import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { MetricCards } from "./components/MetricCards";
import { ExpenseTable } from "./components/ExpenseTable";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";


export function calculateExpenseSummary(expenses = []) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();


  const totalExpenses = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);


  const thisMonthExpenses = expenses
    .filter((item) => {
      if (!item.date) return false;
      const d = new Date(item.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    })
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);


  const totalTransactions = expenses.length;


  const uniqueCategories = new Set(
    expenses.map((item) => item.category).filter(Boolean)
  );
  const categoriesCount = uniqueCategories.size;

  return {
    totalExpenses,
    thisMonthExpenses,
    totalTransactions,
    categoriesCount,
  };
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function Dashboard() {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortBy, setSortBy] = useState("date-desc");
  const [show, setShow] = useState(false);

  const [categories, setCategories] = useState([]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/category/getAll");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data.map((c) => (typeof c === "string" ? c : c.title)));
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/expense/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Supports both plain array [...] and { data: [...] }
      if (Array.isArray(data)) {
        setExpenses(data);
      } else if (data && Array.isArray(data.data)) {
        setExpenses(data.data);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [fetchExpenses, fetchCategories]);


  const summary = useMemo(() => calculateExpenseSummary(expenses), [expenses]);


  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        const desc = (item.description || "").toLowerCase();
        const matchesSearch =
          !searchQuery.trim() || desc.includes(searchQuery.trim().toLowerCase());
        const matchesCategory =
          categoryFilter === "All Categories" || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") return new Date(b.date || 0) - new Date(a.date || 0);
        if (sortBy === "date-asc") return new Date(a.date || 0) - new Date(b.date || 0);
        if (sortBy === "amount-desc")
          return (Number(b.amount) || 0) - (Number(a.amount) || 0);
        if (sortBy === "amount-asc")
          return (Number(a.amount) || 0) - (Number(b.amount) || 0);
        return 0;
      });
  }, [expenses, searchQuery, categoryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans flex flex-col pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-8 flex-1">
        <MetricCards summary={summary} />

        <div className="flex justify-between items-center mb-6">
          <div className="bg-gray-200/80 p-1 rounded-xl flex gap-1">
            <button className="px-5 py-2 text-xs font-semibold rounded-lg bg-white text-gray-900 shadow-xs cursor-pointer">
              Expenses
            </button>
            <button
              className="px-5 py-2 text-xs font-semibold rounded-lg text-gray-600 hover:text-gray-900 cursor-pointer"
              onClick={() => {}}
            >
              Analytics
            </button>
          </div>

          <button
            onClick={() => setShow(true)}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            + Add Expense
          </button>
        </div>

        <ExpenseTable
          expenses={filteredExpenses}
          fetchExpenses={fetchExpenses}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          show={show}
          setShow={setShow}
        />
      </main>
    </div>
  );
}