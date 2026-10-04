"use client";

import { useApp } from "../App";

export default function ToastViewport() {
  const { toasts, dismissToast } = useApp();
  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-end px-4 sm:right-4 sm:left-auto sm:w-[380px] sm:px-0"
      aria-live="polite"
    >
      <div className="flex w-full flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border bg-white px-4 py-3 shadow-xl ${toast.type === "success" ? "border-emerald-100" : toast.type === "error" ? "border-red-100" : "border-slate-200"}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${toast.type === "success" ? "bg-emerald-100 text-emerald-700" : toast.type === "error" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}
              >
                {toast.type === "success"
                  ? "✓"
                  : toast.type === "error"
                    ? "!"
                    : "i"}
              </span>
              <p className="flex-1 text-sm font-medium text-slate-700">
                {toast.message}
              </p>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
