import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/api.js";

export function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formStatus, setFormStatus] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch {
      setError("Failed to fetch categories. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreate = () => {
    setEditingId(null);
    setFormTitle("");
    setFormStatus(true);
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat._id);
    setFormTitle(cat.title || "");
    setFormStatus(cat.status !== undefined ? cat.status : true);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormTitle("");
    setFormStatus(true);
  };

  const saveCategory = async () => {
    if (!formTitle.trim()) {
      alert("Category title is required");
      return;
    }
    setActionLoading(true);
    try {
      const url = editingId
        ? `${API_BASE_URL}/api/categories/${editingId}`
        : `${API_BASE_URL}/api/categories`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: formTitle.trim(), status: formStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save category");

      await fetchCategories();
      closeForm();
    } catch (err) {
      alert(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCategory = async (id, title) => {
    if (!confirm(`Delete category "${title}"? This cannot be undone.`)) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      await fetchCategories();
    } catch (err) {
      alert(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-xs text-gray-500 mt-1">Add, edit, or remove expense categories</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
        >
          + Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading categories…</div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400">No categories found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900">{cat.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        cat.status
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cat.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        disabled={actionLoading}
                        className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteCategory(cat._id, cat.title)}
                        disabled={actionLoading}
                        className="p-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-300 transition cursor-pointer disabled:opacity-50"
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
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <button
                onClick={closeForm}
                className="rounded-full p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Food & Dining"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-black"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Active</label>
                <button
                  type="button"
                  onClick={() => setFormStatus((s) => !s)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                    formStatus ? "bg-black" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                      formStatus ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 text-xs">
              <button
                onClick={closeForm}
                disabled={actionLoading}
                className="rounded-lg border border-gray-300 px-5 py-2 font-medium hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveCategory}
                disabled={actionLoading}
                className="rounded-lg bg-black px-5 py-2 font-medium text-white transition hover:bg-gray-800 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? "Saving…" : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
