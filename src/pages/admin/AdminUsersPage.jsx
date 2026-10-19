import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import API_BASE_URL from "../../config/api.js";

export function AdminUsersPage() {
  const { token, user: currentUser } = useAuth();
  const { error: notifyError, success: notifySuccess, confirm: notifyConfirm } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // stores id of user being actioned
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || "Failed to fetch users. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const deleteUser = async (userId, name) => {
    const confirmed = await notifyConfirm(`Delete user "${name}"? This cannot be undone.`, {
      title: "Delete User",
      confirmText: "Delete",
    });
    if (!confirmed) return;
    setActionLoading(userId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");
      await fetchUsers();
      notifySuccess(`User "${name}" deleted successfully.`);
    } catch (err) {
      notifyError(err.message || "An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-6 md:px-12 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h1>
        <p className="text-xs text-gray-500 mt-1.5">View all registered users and manage their roles</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">No users found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 bg-gray-50/70">
                <th className="px-8 py-4 font-medium">Name</th>
                <th className="px-8 py-4 font-medium">Email</th>
                <th className="px-8 py-4 font-medium">Role</th>
                <th className="px-8 py-4 font-medium">Joined</th>
                <th className="px-8 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => {
                const isCurrentUser = u._id === currentUser?.id || u.id === currentUser?.id;
                const isActioning = actionLoading === u._id;
                return (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-8 py-5 font-semibold text-gray-900 text-xs">
                      {u.name}
                    </td>
                    <td className="px-8 py-5 text-gray-600 text-xs">{u.email}</td>
                    <td className="px-8 py-5 text-gray-600 text-xs capitalize">
                      {u.role || "user"}
                    </td>
                    <td className="px-8 py-5 text-gray-500 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {!isCurrentUser && (
                        <button
                          onClick={() => deleteUser(u._id, u.name)}
                          disabled={isActioning}
                          className="text-xs font-medium text-red-600 hover:text-red-800 hover:underline transition cursor-pointer disabled:opacity-50"
                        >
                          {isActioning ? "…" : "Delete"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
