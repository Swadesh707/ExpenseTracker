import React, { createContext, useContext, useState, useCallback } from "react";
import API_BASE_URL from "../config/api.js";

const AuthContext = createContext(null);

async function handleResponse(res, routeName) {
  const contentType = res.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        `Backend route ${routeName} was not found (404). Please ensure the backend auth endpoint is implemented.`
      );
    }
    throw new Error(
      data?.message || data?.error || `Request failed with status code ${res.status}`
    );
  }

  if (!data) {
    throw new Error("Server returned an invalid non-JSON response.");
  }

  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("expense_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("expense_token") || null;
  });

  const login = useCallback(async (email, password) => {
    let res;
    try {
      res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      throw new Error(
        `Could not connect to backend at ${API_BASE_URL}. Please ensure your backend server is running.`
      );
    }

    const data = await handleResponse(res, "/auth/login");

    // Store full user including role
    const userData = data.user || { email };
    const authToken = data.token || "session";

    localStorage.setItem("expense_user", JSON.stringify(userData));
    localStorage.setItem("expense_token", authToken);
    setUser(userData);
    setToken(authToken);
  }, []);

  const register = useCallback(async (name, email, password) => {
    let res;
    try {
      res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
    } catch {
      throw new Error(
        `Could not connect to backend at ${API_BASE_URL}. Please ensure your backend server is running.`
      );
    }

    const data = await handleResponse(res, "/auth/register");

    const userData = data.user || { name, email };
    const authToken = data.token || "session";

    localStorage.setItem("expense_user", JSON.stringify(userData));
    localStorage.setItem("expense_token", authToken);
    setUser(userData);
    setToken(authToken);
  }, []);

  const logout = useCallback(() => {
    // Best-effort backend logout
    if (token) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem("expense_user");
    localStorage.removeItem("expense_token");
    setUser(null);
    setToken(null);
  }, [token]);

  const isAuthenticated = !!user && !!token;
  const isAdmin = isAuthenticated && user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isAdmin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
