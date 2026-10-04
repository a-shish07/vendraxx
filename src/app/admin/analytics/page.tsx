"use client";

import { useEffect, useState } from "react";
import { useApp } from "../../../App";

type Stats = {
  orders: number;
  revenue: number;
  products: number;
  customers: number;
  pendingOrders: number;
  cancelledOrders: number;
  lowStock: number;
  outOfStock: number;
  averageOrderValue: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  daily: { date: string; orders: number; revenue: number }[];
};

function Icon({
  name,
  className = "",
}: {
  name:
    | "orders"
    | "revenue"
    | "average"
    | "customers"
    | "pending"
    | "cancelled"
    | "stock"
    | "empty";
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "orders") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="M4 7h16v13H4z" />
        <path d="M8 7V5h8v2M8 11h8M8 15h5" />
      </svg>
    );
  }

  if (name === "revenue") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="M12 3v18" />
        <path d="M17 7c0-2-2-3-5-3S7 5 7 7s2 3 5 3 5 1 5 3-2 3-5 3-5-1-5-3" />
      </svg>
    );
  }

  if (name === "average") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="M5 19 19 5" />
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="17" cy="17" r="2.5" />
      </svg>
    );
  }

  if (name === "customers") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.6-3.2 2.4-5 5.5-5s4.9 1.8 5.5 5" />
        <path d="M15.5 5.5a3 3 0 0 1 0 5.8" />
        <path d="M17 14c2.2.5 3.5 2.1 4 5" />
      </svg>
    );
  }

  if (name === "pending") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (name === "cancelled") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m9 9 6 6M15 9l-6 6" />
      </svg>
    );
  }

  if (name === "stock") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="m21 8-9-5-9 5 9 5 9-5Z" />
        <path d="M3 8v9l9 5 9-5V8" />
        <path d="M12 13v9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} {...common}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

export default function AdminAnalytics() {
  const { toast } = useApp();

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  async function load() {
    setLoading(true);

    try {
      const qs = new URLSearchParams();

      if (from) qs.set("from", from);
      if (to) qs.set("to", to);

      const response = await fetch(`/api/admin/stats?${qs}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setStats(data.stats);
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Unable to load analytics.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const cards = [
    {
      label: "Orders",
      value: stats?.orders,
      icon: "orders" as const,
      iconBg: "bg-[#f1f4ff]",
      iconText: "text-[#5146e5]",
    },
    {
      label: "Delivered revenue",
      value: stats
        ? `₹${stats.revenue.toLocaleString("en-IN")}`
        : undefined,
      icon: "revenue" as const,
      iconBg: "bg-[#f5f1eb]",
      iconText: "text-[#a17b3f]",
    },
    {
      label: "Average order",
      value: stats
        ? `₹${stats.averageOrderValue.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`
        : undefined,
      icon: "average" as const,
      iconBg: "bg-[#f5f1eb]",
      iconText: "text-[#a17b3f]",
    },
    {
      label: "Customers",
      value: stats?.customers,
      icon: "customers" as const,
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
    },
    {
      label: "Pending",
      value: stats?.pendingOrders,
      icon: "pending" as const,
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
    },
    {
      label: "Cancelled",
      value: stats?.cancelledOrders,
      icon: "cancelled" as const,
      iconBg: "bg-red-50",
      iconText: "text-red-600",
    },
    {
      label: "Low stock",
      value: stats?.lowStock,
      icon: "stock" as const,
      iconBg: "bg-orange-50",
      iconText: "text-orange-600",
    },
    {
      label: "Out of stock",
      value: stats?.outOfStock,
      icon: "stock" as const,
      iconBg: "bg-slate-100",
      iconText: "text-slate-600",
    },
  ];

  const maxOrders = Math.max(
    ...(stats?.daily || []).map((item) => item.orders),
    1,
  );

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5146e5]">
            Store performance
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#25221e] sm:text-4xl">
            Analytics
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#77716a]">
            Live metrics from products, customers and orders.
          </p>
        </div>

        {/* Date filter */}
        <div className="rounded-2xl border border-[#e4e0d9] bg-white p-2 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-xl border border-[#eeeae4] bg-[#faf9f7] px-3 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a938b]">
                From
              </span>

              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-transparent text-xs font-medium text-[#514b44] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#eeeae4] bg-[#faf9f7] px-3 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a938b]">
                To
              </span>

              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-transparent text-xs font-medium text-[#514b44] outline-none"
              />
            </div>

            <button
              onClick={() => void load()}
              disabled={loading}
              className="rounded-xl bg-[#5146e5] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4338ca] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Loading..." : "Apply"}
            </button>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="group rounded-2xl border border-[#e5e1da] bg-white p-5 shadow-[0_7px_25px_rgba(35,32,27,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9a938b]">
                  {card.label}
                </p>

                <p className="mt-2 truncate text-2xl font-bold tracking-tight text-[#292621]">
                  {loading ? (
                    <span className="inline-block h-7 w-20 animate-pulse rounded-lg bg-slate-100" />
                  ) : (
                    card.value ?? 0
                  )}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${card.iconBg} ${card.iconText}`}
              >
                <Icon name={card.icon} className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts / products */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        {/* Daily trend */}
        <section className="rounded-3xl border border-[#e4e0d9] bg-white p-5 shadow-[0_8px_30px_rgba(35,32,27,0.04)] sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#292621]">
                Daily order trend
              </h2>

              <p className="mt-1 text-xs text-[#8a837b]">
                Order volume across the selected period
              </p>
            </div>

            <span className="rounded-full bg-[#f1f4ff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5146e5]">
              Last 14 days
            </span>
          </div>

          <div className="mt-7">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[75px_1fr_40px] items-center gap-3"
                  >
                    <span className="h-3 w-14 animate-pulse rounded bg-slate-100" />
                    <span className="h-2 animate-pulse rounded-full bg-slate-100" />
                    <span className="ml-auto h-3 w-5 animate-pulse rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : stats?.daily?.length ? (
              <div className="space-y-4">
                {stats.daily.slice(-14).map((item) => (
                  <div
                    key={item.date}
                    className="group grid grid-cols-[70px_1fr_42px] items-center gap-3 text-xs sm:grid-cols-[80px_1fr_50px]"
                  >
                    <span className="text-[11px] font-medium text-[#8a837b]">
                      {new Date(
                        `${item.date}T00:00:00`,
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>

                    <div className="relative h-2.5 overflow-hidden rounded-full bg-[#f1efeb]">
                      <div
                        className="h-full rounded-full bg-[#5146e5] transition-all duration-700 ease-out group-hover:bg-[#4338ca]"
                        style={{
                          width: `${Math.max(
                            4,
                            (item.orders / maxOrders) * 100,
                          )}%`,
                        }}
                      />
                    </div>

                    <span className="text-right text-xs font-bold text-[#514b44]">
                      {item.orders}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <Icon name="empty" className="h-5 w-5" />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#514b44]">
                  No order data
                </p>

                <p className="mt-1 text-xs text-[#9a938b]">
                  There are no orders for this period.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Best selling */}
        <section className="rounded-3xl border border-[#e4e0d9] bg-white p-5 shadow-[0_8px_30px_rgba(35,32,27,0.04)] sm:p-6">
          <div>
            <h2 className="text-sm font-bold text-[#292621]">
              Best-selling products
            </h2>

            <p className="mt-1 text-xs text-[#8a837b]">
              Products generating the most sales
            </p>
          </div>

          <div className="mt-5 divide-y divide-[#eeeae4]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 animate-pulse rounded-xl bg-slate-100" />

                    <div className="space-y-2">
                      <span className="block h-3 w-32 animate-pulse rounded bg-slate-100" />
                      <span className="block h-2.5 w-20 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>

                  <span className="h-4 w-20 animate-pulse rounded bg-slate-100" />
                </div>
              ))
            ) : stats?.topProducts?.length ? (
              stats.topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="group flex items-center justify-between gap-3 py-4 transition-all duration-300 first:pt-1 last:pb-1"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#faf9f7] text-xs font-bold text-[#a17b3f] transition-all duration-300 group-hover:bg-[#f5f1eb]">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#292621]">
                        {product.name}
                      </p>

                      <p className="mt-1 text-[11px] text-[#9a938b]">
                        {product.quantity}{" "}
                        {product.quantity === 1 ? "unit" : "units"}
                      </p>
                    </div>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-[#292621]">
                    ₹{product.revenue.toLocaleString("en-IN")}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <Icon name="empty" className="h-5 w-5" />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#514b44]">
                  No sales data
                </p>

                <p className="mt-1 text-xs text-[#9a938b]">
                  Best-selling products will appear here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}