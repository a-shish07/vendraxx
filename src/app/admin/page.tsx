"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "../../App";

type Stats = {
  products: number;
  customers: number;
  orders: number;
  revenue: number;
  pendingOrders: number;
  cancelledOrders: number;
  lowStock: number;
  outOfStock: number;
  averageOrderValue: number;
};

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name:
    | "orders"
    | "pending"
    | "products"
    | "customers"
    | "revenue"
    | "average"
    | "stock"
    | "out"
    | "arrow"
    | "store"
    | "box"
    | "analytics";
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
    case "orders":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M7 3h10v18H7z" />
          <path d="M9.5 7h5M9.5 11h5M9.5 15h3" />
        </svg>
      );

    case "pending":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "products":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="M4.5 7.5 12 12l7.5-4.5M12 12v9" />
        </svg>
      );

    case "customers":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 20c.8-3.2 3-5 6.5-5s5.7 1.8 6.5 5" />
        </svg>
      );

    case "revenue":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 3v18M16 7.5c0-1.8-1.7-3-4-3s-4 1.2-4 3 1.5 2.7 4 3.2 4 1.3 4 3.3-1.7 3.2-4 3.2-4-1.3-4-3.2" />
        </svg>
      );

    case "average":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M5 17 10 12l3 3 6-7" />
          <path d="M15 8h4v4" />
        </svg>
      );

    case "stock":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M5 6.5 12 3l7 3.5v8L12 21l-7-6.5v-8Z" />
          <path d="M5.5 7 12 10.5 18.5 7M12 10.5V21" />
        </svg>
      );

    case "out":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="m9 9 6 6M15 9l-6 6" />
        </svg>
      );

    case "store":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 10v9h16v-9M3 10l2-6h14l2 6" />
          <path d="M3 10c0 1.5 1.3 2.5 3 2.5S9 11.5 9 10c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5M9 19v-4h6v4" />
        </svg>
      );

    case "box":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="m4.5 7.5 7.5 4 7.5-4M12 11.5V21" />
        </svg>
      );

    case "analytics":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M5 19V10M12 19V5M19 19v-7" />
          <path d="M3 19h18" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      );

    default:
      return null;
  }
}

export default function AdminDashboard() {
  const { toast } = useApp();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setStats(d.stats);
      })
      .catch((e) =>
        toast(
          e instanceof Error ? e.message : "Unable to load dashboard.",
          "error",
        ),
      )
      .finally(() => setLoading(false));
  }, [toast]);

  const cards = [
    {
      label: "Total orders",
      value: stats?.orders,
      icon: "orders" as const,
      tone: "dark",
    },
    {
      label: "Pending orders",
      value: stats?.pendingOrders,
      icon: "pending" as const,
      tone: "gold",
    },
    {
      label: "Products",
      value: stats?.products,
      icon: "products" as const,
      tone: "light",
    },
    {
      label: "Customers",
      value: stats?.customers,
      icon: "customers" as const,
      tone: "light",
    },
    {
      label: "Delivered revenue",
      value: stats
        ? `₹${stats.revenue.toLocaleString("en-IN")}`
        : undefined,
      icon: "revenue" as const,
      tone: "gold",
    },
    {
      label: "Average order",
      value: stats
        ? `₹${stats.averageOrderValue.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`
        : undefined,
      icon: "average" as const,
      tone: "light",
    },
    {
      label: "Low stock",
      value: stats?.lowStock,
      icon: "stock" as const,
      tone: "light",
    },
    {
      label: "Out of stock",
      value: stats?.outOfStock,
      icon: "out" as const,
      tone: "light",
    },
  ];

  const quickLinks = [
    {
      title: "Products",
      desc: "Manage catalogue, pricing, stock and images.",
      href: "/admin/products",
      icon: "box" as const,
    },
    {
      title: "Orders",
      desc: "Review orders and update fulfilment status.",
      href: "/admin/orders",
      icon: "orders" as const,
    },
    {
      title: "Customers",
      desc: "View customer accounts, addresses and order history.",
      href: "/admin/customers",
      icon: "customers" as const,
    },
    {
      title: "Categories",
      desc: "Review categories and subcategories from the catalogue.",
      href: "/admin/categories",
      icon: "products" as const,
    },
    {
      title: "Analytics",
      desc: "Review revenue, order trends and best sellers.",
      href: "/admin/analytics",
      icon: "analytics" as const,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8f6f2]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[28px] bg-[#25221e] px-6 py-7 shadow-[0_20px_60px_rgba(37,34,30,0.12)] sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#b28b52]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-[#d8b36a]/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#d8b36a]" />
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#d8b36a]">
                  Vendrax Store
                </p>
              </div>

              <h1 className="mt-3 font-display text-4xl tracking-tight text-white sm:text-5xl">
                Dashboard
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
                A clear view of your store performance, orders, customers and
                inventory.
              </p>
            </div>

            <Link
              href="/"
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 backdrop-blur transition-all duration-300 hover:border-[#d8b36a]/50 hover:bg-white/10 hover:text-white"
            >
              <Icon
                name="store"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
              />
              View store
              <Icon
                name="arrow"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <section className="mt-7">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a17b3f]">
                Store overview
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#292621]">
                Performance at a glance
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const isDark = card.tone === "dark";
              const isGold = card.tone === "gold";

              return (
                <div
                  key={card.label}
                  className={`group relative overflow-hidden rounded-[20px] border p-5 transition-all duration-300 hover:-translate-y-1 ${
                    isDark
                      ? "border-[#25221e] bg-[#25221e] shadow-[0_12px_30px_rgba(37,34,30,0.12)]"
                      : "border-[#e7e1d8] bg-white shadow-[0_8px_25px_rgba(45,39,32,0.04)] hover:border-[#cdb78f] hover:shadow-[0_14px_35px_rgba(45,39,32,0.08)]"
                  }`}
                >
                  <div
                    className={`absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${
                      isDark || isGold
                        ? "bg-[#d8b36a]"
                        : "bg-[#a17b3f]"
                    }`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <p
                      className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                        isDark ? "text-white/45" : "text-[#91897f]"
                      }`}
                    >
                      {card.label}
                    </p>

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${
                        isDark
                          ? "bg-white/10 text-[#d8b36a]"
                          : isGold
                            ? "bg-[#f4ead9] text-[#a17b3f]"
                            : "bg-[#f6f3ee] text-[#777066]"
                      }`}
                    >
                      <Icon name={card.icon} className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5">
                    {loading ? (
                      <span
                        className={`inline-block h-9 w-24 animate-pulse rounded-lg ${
                          isDark ? "bg-white/10" : "bg-[#f0ece6]"
                        }`}
                      />
                    ) : (
                      <p
                        className={`text-3xl font-semibold tracking-tight ${
                          isDark ? "text-white" : "text-[#292621]"
                        }`}
                      >
                        {card.value ?? "—"}
                      </p>
                    )}
                  </div>

                  <p
                    className={`mt-2 text-xs ${
                      isDark ? "text-white/35" : "text-[#aaa39a]"
                    }`}
                  >
                    Updated from your store data
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick access */}
        <section className="mt-9">
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a17b3f]">
              Management
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#292621]">
              Quick access
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quickLinks.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className="group relative overflow-hidden rounded-[22px] border border-[#e7e1d8] bg-white p-6 shadow-[0_8px_25px_rgba(45,39,32,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#cdb78f] hover:shadow-[0_16px_38px_rgba(45,39,32,0.08)]"
              >
                <div className="absolute right-0 top-0 h-28 w-28 translate-x-8 -translate-y-8 rounded-full bg-[#f7f0e5] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#a17b3f] transition-all duration-300 group-hover:bg-[#25221e] group-hover:text-[#d8b36a]">
                      <Icon name={item.icon} className="h-5 w-5" />
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eee9e2] text-[#9a938a] transition-all duration-300 group-hover:border-[#d8c29e] group-hover:text-[#a17b3f]">
                      <Icon
                        name="arrow"
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </div>
                  </div>

                  <h3 className="mt-6 text-base font-semibold text-[#292621]">
                    {item.title}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-[#77716a]">
                    {item.desc}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#a17b3f]">
                    Manage
                    <span className="h-px w-5 bg-[#cdb78f] transition-all duration-300 group-hover:w-8" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}