"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "../../../App";

type History = {
  status: string;
  note?: string;
  at: string;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    name: string;
    quantity: number;
  }[];
  userId?: {
    name: string;
    email: string;
    phone?: string;
  };
  customer?: {
    name: string;
    phone: string;
    email?: string;
  };
  statusHistory?: History[];
};

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name:
    | "search"
    | "filter"
    | "refresh"
    | "bag"
    | "clock"
    | "check"
    | "truck"
    | "cancel"
    | "arrow"
    | "calendar"
    | "chevron"
    | "eye";
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "search":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      );

    case "filter":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M20 11a8 8 0 0 0-14.7-4L4 9" />
          <path d="M4 5v4h4" />
          <path d="M4 13a8 8 0 0 0 14.7 4L20 15" />
          <path d="M20 19v-4h-4" />
        </svg>
      );

    case "bag":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M6 8h12l1 12H5L6 8Z" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "check":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="m8.5 12 2.3 2.3 4.7-5" />
        </svg>
      );

    case "truck":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 6h10v11H4z" />
          <path d="M14 10h3l3 3v4h-6z" />
          <circle cx="8" cy="18" r="1.5" />
          <circle cx="17" cy="18" r="1.5" />
        </svg>
      );

    case "cancel":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="m9 9 6 6M15 9l-6 6" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M5 12h13" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 9h16" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="m7 10 5 5 5-5" />
        </svg>
      );

    case "eye":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );

    default:
      return null;
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function getStatusMeta(status: string) {
  switch (status) {
    case "PENDING":
      return {
        label: "Pending",
        icon: "clock" as const,
        className: "bg-amber-50 text-amber-700 border-amber-100",
        dot: "bg-amber-500",
      };

    case "CONFIRMED":
      return {
        label: "Confirmed",
        icon: "check" as const,
        className: "bg-indigo-50 text-indigo-700 border-indigo-100",
        dot: "bg-indigo-500",
      };

    case "PROCESSING":
      return {
        label: "Processing",
        icon: "bag" as const,
        className: "bg-violet-50 text-violet-700 border-violet-100",
        dot: "bg-violet-500",
      };

    case "SHIPPED":
      return {
        label: "Shipped",
        icon: "truck" as const,
        className: "bg-sky-50 text-sky-700 border-sky-100",
        dot: "bg-sky-500",
      };

    case "OUT_FOR_DELIVERY":
      return {
        label: "Out for delivery",
        icon: "truck" as const,
        className: "bg-cyan-50 text-cyan-700 border-cyan-100",
        dot: "bg-cyan-500",
      };

    case "DELIVERED":
      return {
        label: "Delivered",
        icon: "check" as const,
        className: "bg-emerald-50 text-emerald-700 border-emerald-100",
        dot: "bg-emerald-500",
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        icon: "cancel" as const,
        className: "bg-red-50 text-red-700 border-red-100",
        dot: "bg-red-500",
      };

    default:
      return {
        label: formatStatus(status),
        icon: "clock" as const,
        className: "bg-slate-50 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
      };
  }
}

function getNextStatuses(status: string) {
  switch (status) {
    case "PENDING":
      return ["CONFIRMED", "CANCELLED"];

    case "CONFIRMED":
      return ["PROCESSING", "CANCELLED"];

    case "PROCESSING":
      return ["SHIPPED"];

    case "SHIPPED":
      return ["OUT_FOR_DELIVERY"];

    case "OUT_FOR_DELIVERY":
      return ["DELIVERED"];

    default:
      return [];
  }
}

export default function AdminOrders() {
  const { toast } = useApp();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [busyId, setBusyId] = useState("");

  async function load(nextPage = page) {
    setLoading(true);

    try {
      const qs = new URLSearchParams({
        page: String(nextPage),
        limit: "25",
      });

      if (search.trim()) {
        qs.set("search", search.trim());
      }

      if (status) {
        qs.set("status", status);
      }

      const response = await fetch(
        `/api/admin/orders?${qs}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setOrders(data.orders || []);
      setPages(data.pagination?.pages || 1);
      setPage(nextPage);
    } catch (e) {
      toast(
        e instanceof Error
          ? e.message
          : "Unable to load orders.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(1);
  }, [status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  async function update(id: string, next: string) {
    let note = "";

    if (next === "CANCELLED") {
      note =
        window
          .prompt(
            "Why is this order being cancelled?",
          )
          ?.trim() || "";

      if (note.length < 5) {
        return toast(
          "A cancellation reason is required.",
          "error",
        );
      }
    }

    setBusyId(id);

    try {
      const response = await fetch(
        `/api/admin/orders/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: next,
            note,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast("Order status updated.");

      await load(page);
    } catch (e) {
      toast(
        e instanceof Error
          ? e.message
          : "Unable to update order.",
        "error",
      );
    } finally {
      setBusyId("");
    }
  }

  const totalItems = orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (itemSum, item) =>
          itemSum + item.quantity,
        0,
      ),
    0,
  );

  const pendingCount = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "DELIVERED",
  ).length;

  const cancelledCount = orders.filter(
    (order) => order.status === "CANCELLED",
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* -------------------------------------------------------------- */}
        {/* HEADER                                                         */}
        {/* -------------------------------------------------------------- */}

        <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 rounded-full bg-[#a17b3f]" />

              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a17b3f]">
                Fulfilment
              </p>
            </div>

            <h1 className="mt-2 font-display text-4xl tracking-tight text-[#25221e] sm:text-[46px]">
              Orders
            </h1>

            <p className="mt-2 max-w-xl text-sm text-[#77716a]">
              Review customers, items, totals and delivery status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void load(page)}
            disabled={loading}
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-[#dfe3e8] bg-white px-4 py-3 text-xs font-bold text-[#5e6775] shadow-[0_3px_12px_rgba(30,35,45,0.025)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5146e5] hover:text-[#5146e5] disabled:opacity-50"
          >
            <Icon
              name="refresh"
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh orders
          </button>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* SUMMARY CARDS                                                   */}
        {/* -------------------------------------------------------------- */}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border border-[#dfe3e8] bg-white p-5 shadow-[0_3px_12px_rgba(30,35,45,0.025)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(30,35,45,0.07)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8b95a5]">
                  Orders shown
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-[#252a35]">
                  {loading ? "—" : orders.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f0ff] text-[#5146e5]">
                <Icon
                  name="bag"
                  className="h-5 w-5"
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#5146e5] transition-transform duration-500 group-hover:scale-x-100" />
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-[#dfe3e8] bg-white p-5 shadow-[0_3px_12px_rgba(30,35,45,0.025)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(30,35,45,0.07)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8b95a5]">
                  Pending
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-[#252a35]">
                  {loading ? "—" : pendingCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Icon
                  name="clock"
                  className="h-5 w-5"
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-amber-500 transition-transform duration-500 group-hover:scale-x-100" />
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-[#dfe3e8] bg-white p-5 shadow-[0_3px_12px_rgba(30,35,45,0.025)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(30,35,45,0.07)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8b95a5]">
                  Items
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-[#252a35]">
                  {loading ? "—" : totalItems}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f2e8] text-[#a17b3f]">
                <Icon
                  name="bag"
                  className="h-5 w-5"
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#a17b3f] transition-transform duration-500 group-hover:scale-x-100" />
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-[#dfe3e8] bg-white p-5 shadow-[0_3px_12px_rgba(30,35,45,0.025)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(30,35,45,0.07)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8b95a5]">
                  Delivered
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-[#252a35]">
                  {loading ? "—" : deliveredCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon
                  name="check"
                  className="h-5 w-5"
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-emerald-500 transition-transform duration-500 group-hover:scale-x-100" />
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* FILTER BAR                                                      */}
        {/* -------------------------------------------------------------- */}

        <section className="mt-7 rounded-2xl border border-[#dfe3e8] bg-white p-4 shadow-[0_3px_12px_rgba(30,35,45,0.025)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f0ff] text-[#5146e5]">
                <Icon
                  name="filter"
                  className="h-4 w-4"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#252a35]">
                  Order management
                </p>

                <p className="text-xs text-[#8992a2]">
                  Search orders or filter by status
                </p>
              </div>
            </div>

            <span className="hidden rounded-full bg-[#faf7f0] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#a17b3f] sm:inline-flex">
              COD orders
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(300px,1fr)_210px]">
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e97a7]"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search order, customer, phone or email..."
                className="h-12 w-full rounded-xl border border-[#dfe3e8] bg-white pl-11 pr-4 text-sm text-[#252a35] outline-none transition-all duration-300 placeholder:text-[#9ba3b1] focus:border-[#5146e5] focus:ring-4 focus:ring-[#5146e5]/10"
              />
            </div>

            <div className="relative">
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="h-12 w-full appearance-none rounded-xl border border-[#dfe3e8] bg-white px-4 pr-10 text-sm text-[#4d5665] outline-none transition-all duration-300 focus:border-[#5146e5] focus:ring-4 focus:ring-[#5146e5]/10"
              >
                <option value="">
                  All statuses
                </option>

                {statuses.map((s) => (
                  <option
                    key={s}
                    value={s}
                  >
                    {formatStatus(s)}
                  </option>
                ))}
              </select>

              <Icon
                name="chevron"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#929baa]"
              />
            </div>
          </div>

          {(search || status) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9aa2af]">
                Active filters:
              </span>

              {search && (
                <span className="rounded-full bg-[#f1f0ff] px-3 py-1 text-[10px] font-semibold text-[#5146e5]">
                  Search: {search}
                </span>
              )}

              {status && (
                <span className="rounded-full bg-[#faf7f0] px-3 py-1 text-[10px] font-semibold text-[#a17b3f]">
                  {formatStatus(status)}
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("");
                }}
                className="text-[10px] font-semibold text-[#7b8492] underline underline-offset-2 hover:text-[#5146e5]"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* -------------------------------------------------------------- */}
        {/* ORDER TABLE                                                      */}
        {/* -------------------------------------------------------------- */}

        <section className="mt-4 overflow-hidden rounded-2xl border border-[#dfe3e8] bg-white shadow-[0_3px_12px_rgba(30,35,45,0.025)]">

          {/* Header */}
          <div className="hidden grid-cols-[1.2fr_1.35fr_.85fr_.55fr_.85fr_1.25fr] gap-4 border-b border-[#e8ebef] bg-[#fafbfc] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b95a6] md:grid">
            <span>Order</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
          </div>

          {/* Loading */}
          {loading ? (
            <div>
              {Array.from({
                length: 7,
              }).map((_, i) => (
                <div
                  key={i}
                  className="grid gap-4 border-b border-[#edf0f3] p-5 last:border-0 md:grid-cols-[1.2fr_1.35fr_.85fr_.55fr_.85fr_1.25fr]"
                >
                  <div className="space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-[#eef0f4]" />
                    <div className="h-3 w-14 animate-pulse rounded bg-[#f3f4f6]" />
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 w-36 animate-pulse rounded bg-[#eef0f4]" />
                    <div className="h-3 w-24 animate-pulse rounded bg-[#f3f4f6]" />
                  </div>

                  <div className="h-4 w-20 animate-pulse rounded bg-[#eef0f4]" />

                  <div className="h-4 w-8 animate-pulse rounded bg-[#eef0f4]" />

                  <div className="h-4 w-20 animate-pulse rounded bg-[#eef0f4]" />

                  <div className="h-8 w-28 animate-pulse rounded-full bg-[#eef0f4]" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            /* Empty */
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f1f0ff] text-[#5146e5]">
                <Icon
                  name="bag"
                  className="h-7 w-7"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#252a35]">
                No orders found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#8992a2]">
                No orders match your current search or status filter.
              </p>

              {(search || status) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatus("");
                  }}
                  className="mt-5 rounded-xl bg-[#5146e5] px-5 py-3 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4338ca]"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            /* Orders */
            orders.map((order) => {
              const meta = getStatusMeta(
                order.status,
              );

              const nextStatuses =
                getNextStatuses(
                  order.status,
                );

              const itemCount =
                order.items.reduce(
                  (sum, item) =>
                    sum + item.quantity,
                  0,
                );

              const customerName =
                order.customer?.name ||
                order.userId?.name ||
                "Customer";

              const customerContact =
                order.customer?.phone ||
                order.userId?.phone ||
                order.userId?.email ||
                "";

              return (
                <div
                  key={order.id}
                  className="group border-b border-[#edf0f3] p-4 transition-colors duration-200 last:border-0 hover:bg-[#fafbfc] md:grid md:grid-cols-[1.2fr_1.35fr_.85fr_.55fr_.85fr_1.25fr] md:items-center md:gap-4 md:px-5"
                >
                  {/* Order */}
                  <div className="flex items-center justify-between gap-4 md:block">
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#252a35] transition-colors hover:text-[#5146e5]"
                      >
                        {order.orderNumber}

                        <Icon
                          name="arrow"
                          className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </Link>

                      <p className="mt-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#a17b3f]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#a17b3f]" />
                        COD
                      </p>
                    </div>

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#e0e3e8] bg-white px-3 py-2 text-[10px] font-bold text-[#697281] transition hover:border-[#5146e5] hover:text-[#5146e5] md:hidden"
                    >
                      <Icon
                        name="eye"
                        className="h-3.5 w-3.5"
                      />

                      View
                    </Link>
                  </div>

                  {/* Customer */}
                  <div className="mt-4 md:mt-0">
                    <p className="text-sm font-semibold text-[#3c4451]">
                      {customerName}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#929baa]">
                      {customerContact}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="mt-3 flex items-center gap-2 md:mt-0 md:block">
                    <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#a0a7b2] md:hidden">
                      Date
                    </span>

                    <div className="flex items-center gap-1.5 text-sm text-[#606a78]">
                      <Icon
                        name="calendar"
                        className="hidden h-3.5 w-3.5 text-[#9aa2af] md:block"
                      />

                      {new Date(
                        order.createdAt,
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-3 flex items-center gap-2 md:mt-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#a0a7b2] md:hidden">
                      Items
                    </span>

                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#f3f4f6] px-2 text-xs font-bold text-[#5c6573]">
                      {itemCount}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="mt-3 flex items-center gap-2 md:mt-0 md:block">
                    <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#a0a7b2] md:hidden">
                      Total
                    </span>

                    <p className="text-sm font-bold text-[#252a35]">
                      ₹
                      {order.total.toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="mt-4 flex items-center justify-between gap-3 md:mt-0 md:justify-start">
                    <div className="relative min-w-0">
                      <select
                        disabled={
                          busyId ===
                            order.id ||
                          order.status ===
                            "CANCELLED" ||
                          order.status ===
                            "DELIVERED"
                        }
                        value=""
                        onChange={(e) => {
                          if (
                            e.target.value
                          ) {
                            void update(
                              order.id,
                              e.target.value,
                            );
                          }
                        }}
                        className={`h-9 max-w-[190px] appearance-none rounded-full border px-3 pr-8 text-[10px] font-bold uppercase tracking-[0.03em] outline-none transition-all duration-300 focus:ring-4 focus:ring-black/5 disabled:cursor-not-allowed disabled:opacity-60 ${meta.className}`}
                      >
                        <option value="">
                          {formatStatus(
                            order.status,
                          )}
                        </option>

                        {nextStatuses.map(
                          (next) => (
                            <option
                              key={next}
                              value={next}
                            >
                              Move to{" "}
                              {formatStatus(
                                next,
                              )}
                            </option>
                          ),
                        )}
                      </select>

                      <Icon
                        name="chevron"
                        className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60"
                      />

                      {busyId ===
                        order.id && (
                        <span className="absolute -right-6 top-1/2 -translate-y-1/2">
                          <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#d8dce3] border-t-[#5146e5]" />
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hidden items-center gap-1.5 text-[10px] font-bold text-[#5146e5] transition-all duration-300 hover:gap-2.5 md:inline-flex"
                    >
                      View
                      <Icon
                        name="arrow"
                        className="h-3 w-3"
                      />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* -------------------------------------------------------------- */}
        {/* PAGINATION                                                       */}
        {/* -------------------------------------------------------------- */}

        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#dfe3e8] bg-white px-5 py-4 shadow-[0_3px_12px_rgba(30,35,45,0.025)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-[#8c95a4]">
              Page{" "}
              <span className="font-semibold text-[#4c5563]">
                {page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#4c5563]">
                {pages}
              </span>
            </p>

            {cancelledCount > 0 && (
              <p className="mt-1 text-[10px] text-[#a0a7b2]">
                {cancelledCount} cancelled order
                {cancelledCount !== 1
                  ? "s"
                  : ""}{" "}
                on this page
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={
                page <= 1 || loading
              }
              onClick={() =>
                void load(page - 1)
              }
              className="rounded-xl border border-[#dfe3e8] bg-white px-4 py-2.5 text-xs font-semibold text-[#687181] transition-all duration-300 hover:border-[#5146e5] hover:text-[#5146e5] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                page >= pages || loading
              }
              onClick={() =>
                void load(page + 1)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#252a35] px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#5146e5] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next

              <Icon
                name="arrow"
                className="h-3.5 w-3.5"
              />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}