import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import API_BASE_URL from "../../config/api.js";

export function AdminCategoriesPage() {
  const { token } = useAuth();
  const { warning: notifyWarning, error: notifyError, success: notifySuccess, confirm: notifyConfirm } = useNotification();
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
      notifyWarning("Category title is required");
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
      notifySuccess(editingId ? "Category updated successfully!" : "Category created successfully!");
      closeForm();
    } catch (err) {
      notifyError(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCategory = async (id, title) => {
    const confirmed = await notifyConfirm(`Delete category "${title}"? This cannot be undone.`, {
      title: "Delete Category",
      confirmText: "Delete",
    });
    if (!confirmed) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      await fetchCategories();
      notifySuccess(`Category "${title}" deleted successfully!`);
    } catch (err) {
      notifyError(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-6 md:px-12 py-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Category Management</h1>
          <p className="text-xs text-gray-500 mt-1.5">Add, edit, or remove expense categories</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          + Add Category
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Loading categories…</div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">No categories found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 bg-gray-50/70">
                <th className="px-8 py-4 font-medium">Title</th>
                <th className="px-8 py-4 font-medium">Status</th>
                <th className="px-8 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-8 py-5 font-semibold text-gray-900 text-xs">{cat.title}</td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                        cat.status
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cat.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() => openEdit(cat)}
                        disabled={actionLoading}
                        className="text-xs font-medium text-gray-700 hover:text-black hover:underline transition cursor-pointer disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(cat._id, cat.title)}
                        disabled={actionLoading}
                        className="text-xs font-medium text-red-600 hover:text-red-800 hover:underline transition cursor-pointer disabled:opacity-50"
                      >
                        Delete
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-[90%] max-w-md rounded-2xl bg-white p-7 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <button
                onClick={closeForm}
                className="rounded-full p-2 hover:bg-gray-100 cursor-pointer text-gray-400 hover:text-gray-700 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-xs">
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700">Category Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Food & Dining"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-xs outline-none transition focus:border-black"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-gray-700">Active Status</label>
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

            <div className="mt-8 flex justify-end gap-3 text-xs">
              <button
                onClick={closeForm}
                disabled={actionLoading}
                className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveCategory}
                disabled={actionLoading}
                className="rounded-xl bg-black px-6 py-2.5 font-medium text-white transition hover:bg-gray-800 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? "Saving…" : editingId ? "Update Category" : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
