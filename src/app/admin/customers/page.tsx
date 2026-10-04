"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "../../../App";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
  isActive: boolean;
  orders: number;
  totalSpent: number;
  lastOrder?: string | null;
};

function Icon({
  name,
  className = "",
}: {
  name:
    | "search"
    | "users"
    | "orders"
    | "arrow"
    | "calendar"
    | "mail"
    | "phone"
    | "chevron";
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "search") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </svg>
    );
  }

  if (name === "users") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.6-3.2 2.4-5 5.5-5s4.9 1.8 5.5 5" />
        <path d="M15.5 5.5a3 3 0 0 1 0 5.8" />
        <path d="M17 14c2.2.5 3.5 2.1 4 5" />
      </svg>
    );
  }

  if (name === "orders") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="M4 7h16v13H4z" />
        <path d="M8 7V5h8v2M8 11h8M8 15h5" />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </svg>
    );
  }

  if (name === "mail") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="M6.5 3.5 9 3l2 5-2 1.5c1 2.1 2.4 3.5 4.5 4.5L15 12l5 2 .5 2.5c.2 1-.5 2-1.5 2.3-1.4.4-3.5.2-6.5-1.3-3.5-1.8-6-4.3-7.8-7.8C3.2 6.7 3 4.6 3.4 3.2c.3-1 1.3-1.7 2.3-1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} {...common}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function CustomerAvatar({ customer }: { customer: Customer }) {
  if (customer.avatar) {
    return (
      <img
        src={customer.avatar}
        alt=""
        className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
      />
    );
  }

  const initials = customer.name
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();

  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1e8da] text-xs font-bold text-[#a17b3f] ring-2 ring-white shadow-sm">
      {initials}
    </span>
  );
}

export default function AdminCustomers() {
  const { toast } = useApp();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  async function load(nextPage = page) {
    setLoading(true);

    try {
      const qs = new URLSearchParams({
        page: String(nextPage),
        limit: "25",
      });

      if (search.trim()) qs.set("search", search.trim());

      const r = await fetch(`/api/admin/customers?${qs}`, {
        cache: "no-store",
      });

      const d = await r.json();

      if (!r.ok) throw new Error(d.error);

      setCustomers(d.customers || []);
      setPages(d.pagination?.pages || 1);
      setPage(nextPage);
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to load customers.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = window.setTimeout(() => void load(1), 300);

    return () => window.clearTimeout(t);
  }, [search]);

  const activeCustomers = customers.filter((customer) => customer.isActive).length;

  const totalOrders = customers.reduce(
    (sum, customer) => sum + customer.orders,
    0,
  );

  const totalSpent = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0,
  );

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5146e5]">
            Accounts
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#25221e] sm:text-4xl">
            Customers
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#77716a]">
            View registered customers, their activity, and complete order
            history.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[#e5e1da] bg-white px-4 py-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f4ff] text-[#5146e5]">
            <Icon name="users" className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9a938b]">
              Customers shown
            </p>
            <p className="text-lg font-bold text-[#292621]">
              {customers.length}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="group rounded-2xl border border-[#e5e1da] bg-white p-4 shadow-[0_6px_24px_rgba(35,32,27,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9a938b]">
                Active customers
              </p>
              <p className="mt-2 text-2xl font-bold text-[#292621]">
                {activeCustomers}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Icon name="users" className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-[#e5e1da] bg-white p-4 shadow-[0_6px_24px_rgba(35,32,27,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9a938b]">
                Orders on page
              </p>
              <p className="mt-2 text-2xl font-bold text-[#292621]">
                {totalOrders}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon name="orders" className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-[#e5e1da] bg-white p-4 shadow-[0_6px_24px_rgba(35,32,27,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9a938b]">
                Customer spend
              </p>
              <p className="mt-2 text-2xl font-bold text-[#292621]">
                ₹{totalSpent.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f1eb] text-[#a17b3f]">
              ₹
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9a938b]"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="h-13 w-full rounded-2xl border border-[#e2ded7] bg-white pl-12 pr-4 text-sm text-[#292621] shadow-sm outline-none transition-all duration-300 placeholder:text-[#aaa49d] focus:border-[#5146e5] focus:ring-4 focus:ring-[#5146e5]/10"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-[#8a837b] transition-colors hover:bg-slate-100 hover:text-[#292621]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Customers */}
      <div className="mt-5 overflow-hidden rounded-3xl border border-[#e3dfd8] bg-white shadow-[0_10px_35px_rgba(35,32,27,0.045)]">
        {/* Desktop header */}
        <div className="hidden grid-cols-[1.5fr_1.35fr_.7fr_.75fr_.9fr_1fr] gap-4 border-b border-[#ebe7e0] bg-[#faf9f7] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.13em] text-[#9a938b] md:grid">
          <span>Customer</span>
          <span>Contact</span>
          <span>Orders</span>
          <span>Status</span>
          <span>Spent</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-[#eeeae4] p-5 last:border-0"
              >
                <span className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-100" />

                <div className="flex-1 space-y-2">
                  <span className="block h-4 w-36 animate-pulse rounded bg-slate-100" />
                  <span className="block h-3 w-52 animate-pulse rounded bg-slate-100" />
                </div>

                <span className="hidden h-4 w-20 animate-pulse rounded bg-slate-100 md:block" />

                <span className="hidden h-8 w-20 animate-pulse rounded-full bg-slate-100 md:block" />
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Icon name="users" className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-[#292621]">
              No customers found
            </h3>

            <p className="mt-1 text-sm text-[#8a837b]">
              Try searching with a different name, phone number or email.
            </p>
          </div>
        ) : (
          customers.map((c) => (
            <div
              key={c.id}
              className="group border-b border-[#eeeae4] p-5 transition-colors duration-300 last:border-0 hover:bg-[#fdfcfb] md:grid md:grid-cols-[1.5fr_1.35fr_.7fr_.75fr_.9fr_1fr] md:items-center md:gap-4"
            >
              {/* Customer */}
              <div className="flex items-center gap-3">
                <CustomerAvatar customer={c} />

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#292621]">
                    {c.name}
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-[11px] text-[#9a938b]">
                    <Icon name="calendar" className="h-3 w-3" />
                    Joined{" "}
                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="mt-4 md:mt-0">
                <p className="flex items-center gap-2 truncate text-sm text-[#514b44]">
                  <Icon
                    name="mail"
                    className="h-3.5 w-3.5 shrink-0 text-[#aaa49d]"
                  />
                  <span className="truncate">{c.email}</span>
                </p>

                <p className="mt-1.5 flex items-center gap-2 text-xs text-[#9a938b]">
                  <Icon
                    name="phone"
                    className="h-3.5 w-3.5 shrink-0 text-[#aaa49d]"
                  />
                  {c.phone || "No phone"}
                </p>
              </div>

              {/* Mobile meta */}
              <div className="mt-4 grid grid-cols-3 gap-3 md:mt-0 md:contents">
                {/* Orders */}
                <div className="rounded-xl bg-[#faf9f7] p-3 md:bg-transparent md:p-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#aaa49d] md:hidden">
                    Orders
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#5146e5] md:mt-0">
                    {c.orders}
                  </p>
                </div>

                {/* Status */}
                <div className="rounded-xl bg-[#faf9f7] p-3 md:bg-transparent md:p-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#aaa49d] md:hidden">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold md:mt-0 ${
                      c.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        c.isActive ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Spent */}
                <div className="rounded-xl bg-[#faf9f7] p-3 md:bg-transparent md:p-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#aaa49d] md:hidden">
                    Spent
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#292621] md:mt-0">
                    ₹{c.totalSpent.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 md:mt-0">
                <Link
                  href={`/admin/customers/${c.id}`}
                  className="group/button inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#ded9d1] bg-white px-3 py-2.5 text-xs font-bold text-[#514b44] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5146e5] hover:bg-[#f8f8ff] hover:text-[#5146e5] md:w-fit"
                >
                  <span>View Details</span>

                  <Icon
                    name="arrow"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover/button:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#9a938b]">
          Page <span className="font-semibold text-[#514b44]">{page}</span> of{" "}
          <span className="font-semibold text-[#514b44]">{pages}</span>
        </p>

        <div className="flex gap-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => void load(page - 1)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#ded9d1] bg-white px-4 py-2.5 text-xs font-semibold text-[#514b44] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5146e5] hover:text-[#5146e5] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <span>←</span>
            Previous
          </button>

          <button
            disabled={page >= pages || loading}
            onClick={() => void load(page + 1)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#5146e5] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            Next
            <Icon name="chevron" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}