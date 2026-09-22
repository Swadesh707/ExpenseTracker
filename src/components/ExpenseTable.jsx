import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function ExpenseTable({
  expenses,
  fetchExpenses,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  categories,
  show,
  setShow,
}) {
  const { token } = useAuth();
  const defaultCategory = categories.length > 0 ? categories[0] : "";
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync category default when categories load
  React.useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  const handleEdit = (item) => {
    setEditingId(item._id);
    setDescription(item.description || "");
    setAmount(item.amount !== undefined ? item.amount : "");
    setCategory(item.category || defaultCategory);
    setDate(item.date ? item.date.split("T")[0] : new Date().toISOString().split("T")[0]);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setEditingId(null);
    setDescription("");
    setAmount("");
    setCategory(defaultCategory);
    setDate(new Date().toISOString().split("T")[0]);
  };

  const saveExpense = async () => {
    if (!description.trim() || !amount) {
      alert("Please fill in description and amount");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        description: description.trim(),
        amount: Number(amount) || 0,
        category,
        date,
      };

      if (editingId !== null) {
        const res = await fetch(`http://localhost:8000/expense/update/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to update expense");
        }
      } else {
        const res = await fetch("http://localhost:8000/expense/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to create expense");
        }
      }

      await fetchExpenses();
      handleClose();
    } catch (err) {
      alert(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this expense?");
    if (isConfirmed) {
      try {
        const res = await fetch(`http://localhost:8000/expense/delete/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to delete expense");
        }
        await fetchExpenses();
      } catch (err) {
        alert(err.message || "An error occurred while deleting");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-gray-900">Expense History</h3>
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId !== null ? "Edit Expense" : "Add Expense"}
              </h2>
              <button
                onClick={handleClose}
                className="rounded-full p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  placeholder="Enter description"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Amount ($)
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="Enter amount"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-black cursor-pointer bg-white"
                >
                  {categories.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-black"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 text-xs">
              <button
                onClick={handleClose}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-5 py-2 font-medium hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={saveExpense}
                disabled={loading}
                className="rounded-lg bg-black px-5 py-2 font-medium text-white transition hover:bg-gray-800 cursor-pointer disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Expense"
                  : "Save Expense"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3.5 top-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-gray-400 focus:bg-white transition"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 outline-none focus:border-gray-400 transition cursor-pointer"
          >
            <option value="All Categories">All Categories</option>
            {categories.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 outline-none focus:border-gray-400 transition cursor-pointer"
          >
            <option value="date-desc">Sort by Date (Newest)</option>
            <option value="date-asc">Sort by Date (Oldest)</option>
            <option value="amount-desc">Sort by Amount (Highest)</option>
            <option value="amount-asc">Sort by Amount (Lowest)</option>
          </select>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="py-12 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
          <svg
            className="w-8 h-8 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          <span>No expenses found matching your criteria.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 text-gray-600">
                    {item.date ? item.date.split("T")[0] : ""}
                  </td>
                  <td className="py-4 font-semibold text-gray-900">{item.description}</td>
                  <td className="py-4">
                    <span className="bg-purple-50 text-purple-600 font-semibold px-2.5 py-1 rounded-md text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 font-bold text-gray-900">
                    ${Number(item.amount).toFixed(2)}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition cursor-pointer"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-300 transition cursor-pointer"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}