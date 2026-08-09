import React, { useState, useEffect } from "react";

export function ExpenseFormModal({ isOpen, onClose, onSave, editingExpense, categories }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0] || "Food & Dining");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount);
      setDescription(editingExpense.description);
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
    } else {
      setAmount("");
      setDescription("");
      setCategory(categories[0] || "Food & Dining");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [editingExpense, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0 || !description.trim()) return;

    onSave({ amount: parsed, description, category, date });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          {editingExpense ? "Edit Expense" : "Add New Expense"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none"
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-black text-white p-2 rounded-lg font-medium cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 p-2 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}