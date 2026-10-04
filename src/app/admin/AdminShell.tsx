"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "../../App";
import { useState } from "react";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/products", "Products"],
  ["/admin/orders", "Orders"],
  ["/admin/customers", "Customers"],
  ["/admin/categories", "Categories"],
  ["/admin/analytics", "Analytics"],
] as const;

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "A"
  );
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refreshUser, toast } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Unable to sign out.");
      await refreshUser();
      router.push("/");
      toast("Admin session signed out.", "success");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Unable to sign out.",
        "error",
      );
    } finally {
      setLoggingOut(false);
    }
  }

  const nav = (
    <nav className="space-y-1">
      {links.map(([href, label]) => {
        const active =
          href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${active ? "bg-accent text-white shadow-sm" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs">
              {label.slice(0, 1)}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-[#171717] text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="font-display text-xl">Vendrax</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
            Admin panel
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-5">{nav}</div>
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="mb-3 block rounded-xl px-3 py-2 text-sm text-white/55 hover:bg-white/10 hover:text-white"
          >
            ← Back to Store
          </Link>
          <button
            type="button"
            disabled={loggingOut}
            onClick={() => void logout()}
            className="w-full rounded-xl border border-white/10 px-3 py-2 text-left text-sm text-white/60 hover:bg-white/10 hover:text-white"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          aria-label="Close admin menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#171717] text-white transition-transform lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div>
            <p className="font-display text-xl">Vendrax</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
              Admin panel
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="text-white/60"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-5">{nav}</div>
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => void logout()}
            className="w-full rounded-xl px-3 py-2 text-left text-sm text-white/60 hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm lg:hidden"
            >
              ☰
            </button>
            <div className="hidden lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                Vendrax Admin
              </p>
              <p className="text-xs text-slate-400">Manage your store</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[11px] text-slate-400">Administrator</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {initials(user?.name)}
              </span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
