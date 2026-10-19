import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

const NotificationContext = createContext(null);

let toastId = 0;

// ─── Icons ───────────────────────────────────────────────────────────────────
function SuccessIcon() {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 shrink-0 animate-icon-pop">
      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </div>
  );
}

function ErrorIcon() {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 shrink-0 animate-icon-pop">
      <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
}

function WarningIcon() {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 shrink-0 animate-icon-pop">
      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    </div>
  );
}

function InfoIcon() {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 shrink-0 animate-icon-pop">
      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    </div>
  );
}

const iconMap = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

const borderMap = {
  success: "border-l-emerald-500 hover:border-emerald-300",
  error: "border-l-red-500 hover:border-red-300",
  warning: "border-l-amber-500 hover:border-amber-300",
  info: "border-l-blue-500 hover:border-blue-300",
};


// ─── Single Toast ────────────────────────────────────────────────────────────
function Toast({ toast, onDismiss }) {
  const [state, setState] = useState("entering"); // entering | visible | exiting
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration || 4000;
  const remainingTimeRef = useRef(duration);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    const enterTimer = setTimeout(() => setState("visible"), 15);
    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      remainingTimeRef.current -= Date.now() - startTimeRef.current;
      return;
    }

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      setState("exiting");
      setTimeout(() => onDismiss(toast.id), 350);
    }, Math.max(remainingTimeRef.current, 500));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, toast.id, onDismiss]);

  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState("exiting");
    setTimeout(() => onDismiss(toast.id), 350);
  };

  const Icon = iconMap[toast.type] || InfoIcon;

  const animationStyle =
    state === "entering"
      ? "translate-x-full opacity-0 scale-95"
      : state === "exiting"
      ? "translate-x-full opacity-0 scale-90"
      : "translate-x-0 opacity-100 scale-100";

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative flex items-center gap-3.5 bg-white/95 backdrop-blur-md border border-gray-200/90 border-l-[5px] ${borderMap[toast.type] || borderMap.info} rounded-2xl shadow-xl hover:shadow-2xl px-4 py-3 min-w-[320px] max-w-[420px] transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden cursor-default ${animationStyle}`}
      role="alert"
    >
      <Icon />
      <div className="flex-1 min-w-0 pr-1">
        {toast.title && (
          <p className="text-xs font-bold text-gray-900 tracking-tight mb-0.5">{toast.title}</p>
        )}
        <p className="text-xs text-gray-700 leading-snug font-medium">{toast.message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:scale-90 transition cursor-pointer"
        aria-label="Dismiss notification"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
function ConfirmDialog({ config, onResolve }) {
  const [state, setState] = useState("entering"); // entering | visible | exiting

  useEffect(() => {
    const timer = setTimeout(() => setState("visible"), 15);
    return () => clearTimeout(timer);
  }, []);

  const handleResolve = (result) => {
    setState("exiting");
    setTimeout(() => onResolve(result), 250);
  };

  const backdropClass =
    state === "entering"
      ? "opacity-0"
      : state === "exiting"
      ? "opacity-0"
      : "opacity-100";

  const dialogClass =
    state === "entering"
      ? "opacity-0 scale-90 translate-y-6"
      : state === "exiting"
      ? "opacity-0 scale-95 translate-y-3"
      : "opacity-100 scale-100 translate-y-0";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-250 ${backdropClass}`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-250"
        onClick={() => handleResolve(false)}
      />
      <div
        className={`relative w-[90%] max-w-sm bg-white rounded-3xl shadow-2xl p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${dialogClass} animate-modal-spring`}
      >
        {/* Animated Warning Icon with subtle pulse ring */}
        <div className="relative flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 animate-pulse-ring">
          <svg className="w-7 h-7 text-red-600 animate-icon-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h3 className="text-center text-lg font-bold text-gray-900 mb-1.5">
          {config.title || "Are you sure?"}
        </h3>
        <p className="text-center text-xs text-gray-500 mb-6 leading-relaxed">
          {config.message || "This action cannot be undone."}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleResolve(false)}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleResolve(true)}
            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition cursor-pointer"
          >
            {config.confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const confirmResolveRef = useRef(null);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((message, type = "info", options = {}) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, ...options }]);
    return id;
  }, []);

  const success = useCallback((message, opts) => notify(message, "success", opts), [notify]);
  const error = useCallback((message, opts) => notify(message, "error", opts), [notify]);
  const warning = useCallback((message, opts) => notify(message, "warning", opts), [notify]);
  const info = useCallback((message, opts) => notify(message, "info", opts), [notify]);

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirmConfig({ message, ...options });
    });
  }, []);

  const handleConfirmResolve = useCallback((result) => {
    if (confirmResolveRef.current) {
      confirmResolveRef.current(result);
      confirmResolveRef.current = null;
    }
    setConfirmConfig(null);
  }, []);

  const value = { notify, success, error, warning, info, confirm, dismiss };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Toast container */}
      <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirmConfig && (
        <ConfirmDialog config={confirmConfig} onResolve={handleConfirmResolve} />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return ctx;
}
