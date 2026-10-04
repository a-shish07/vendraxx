"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApp } from "../../../../App";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
  isActive: boolean;
  orderCount: number;
  totalSpent: number;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
};

type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

function Icon({
  name,
  className = "",
}: {
  name:
    | "user"
    | "mail"
    | "phone"
    | "orders"
    | "wallet"
    | "calendar"
    | "location"
    | "arrow"
    | "check"
    | "power"
    | "package";
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "user") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5" />
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

  if (name === "orders") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="M4 7h16v13H4z" />
        <path d="M8 7V5h8v2M8 11h8M8 15h5" />
      </svg>
    );
  }

  if (name === "wallet") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <rect x="3" y="5" width="18" height="15" rx="2" />
        <path d="M3 9h18" />
        <path d="M16 14h2" />
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

  if (name === "location") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (name === "power") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="M12 3v8" />
        <path d="M7.5 5.5a8 8 0 1 0 9 0" />
      </svg>
    );
  }

  if (name === "package") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="m21 8-9-5-9 5 9 5 9-5Z" />
        <path d="M3 8v9l9 5 9-5V8" />
        <path d="M12 13v9" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} {...common}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-violet-50 text-violet-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  OUT_FOR_DELIVERY: "bg-cyan-50 text-cyan-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useApp();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const r = await fetch(`/api/admin/customers/${id}`, {
        cache: "no-store",
      });

      const d = await r.json();

      if (!r.ok) throw new Error(d.error);

      setCustomer(d.customer);
      setOrders(d.orders || []);
      setAddresses(d.addresses || []);
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to load customer.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) void load();
  }, [id]);

  async function toggle() {
    if (!customer) return;

    setBusy(true);

    try {
      const r = await fetch(`/api/admin/customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !customer.isActive }),
      });

      const d = await r.json();

      if (!r.ok) throw new Error(d.error);

      setCustomer({
        ...customer,
        isActive: !customer.isActive,
      });

      toast(
        `Customer ${!customer.isActive ? "activated" : "deactivated"}.`,
      );
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to update customer.",
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] animate-pulse space-y-5">
        <div className="h-5 w-32 rounded bg-slate-200" />

        <div className="h-48 rounded-3xl bg-white" />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-28 rounded-2xl bg-white" />
          <div className="h-28 rounded-2xl bg-white" />
          <div className="h-28 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-[#e5e1da] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <Icon name="user" className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-[#292621]">
            Customer not found
          </h2>

          <p className="mt-2 text-sm text-[#8a837b]">
            This customer account could not be found.
          </p>

          <Link
            href="/admin/customers"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5146e5] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4338ca]"
          >
            Back to customers
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const initials = customer.name
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen pb-10">
      {/* Back */}
      <Link
        href="/admin/customers"
        className="group inline-flex items-center gap-2 text-sm font-semibold text-[#77716a] transition-colors duration-300 hover:text-[#5146e5]"
      >
        <span className="transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>
        Customers
      </Link>

      {/* Customer hero */}
      <section className="relative mt-5 overflow-hidden rounded-3xl bg-[#25221e] p-6 text-white shadow-[0_14px_45px_rgba(35,32,27,0.12)] sm:p-8">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-32 right-16 h-72 w-72 rounded-full border border-white/[0.04]" />

        <div className="relative flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt=""
                className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-4 ring-white/10 sm:h-24 sm:w-24"
              />
            ) : (
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#b28b52] text-xl font-bold text-white shadow-lg sm:h-24 sm:w-24 sm:text-2xl">
                {initials}
              </span>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8b36a]">
                  Customer account
                </p>

                <span className="h-1 w-1 rounded-full bg-white/30" />

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    customer.isActive
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "bg-red-400/10 text-red-300"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      customer.isActive
                        ? "bg-emerald-400"
                        : "bg-red-400"
                    }`}
                  />
                  {customer.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <h1 className="mt-2 truncate text-2xl font-bold tracking-tight sm:text-3xl">
                {customer.name}
              </h1>

              <div className="mt-2 flex flex-col gap-1 text-sm text-white/55 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                <span className="flex items-center gap-1.5">
                  <Icon name="mail" className="h-3.5 w-3.5" />
                  {customer.email}
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />

                <span className="flex items-center gap-1.5">
                  <Icon name="phone" className="h-3.5 w-3.5" />
                  {customer.phone || "No phone"}
                </span>
              </div>
            </div>
          </div>

          <button
            disabled={busy}
            onClick={() => void toggle()}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${
              customer.isActive
                ? "bg-white text-[#292621] hover:bg-[#f5f3ef]"
                : "bg-[#b28b52] text-white hover:bg-[#9e793f]"
            }`}
          >
            <Icon name="power" className="h-4 w-4" />

            {customer.isActive ? "Deactivate account" : "Activate account"}
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="group rounded-2xl border border-[#e5e1da] bg-white p-5 shadow-[0_7px_25px_rgba(35,32,27,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a938b]">
                Total orders
              </p>

              <p className="mt-2 text-2xl font-bold text-[#292621]">
                {customer.orderCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f4ff] text-[#5146e5]">
              <Icon name="orders" className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-[#e5e1da] bg-white p-5 shadow-[0_7px_25px_rgba(35,32,27,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a938b]">
                Total spent
              </p>

              <p className="mt-2 text-2xl font-bold text-[#292621]">
                ₹{customer.totalSpent.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f1eb] text-[#a17b3f]">
              <Icon name="wallet" className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-[#e5e1da] bg-white p-5 shadow-[0_7px_25px_rgba(35,32,27,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a938b]">
                Member since
              </p>

              <p className="mt-2 text-lg font-bold text-[#292621]">
                {new Date(customer.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
              <Icon name="calendar" className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,.7fr)]">
        {/* Order history */}
        <section className="overflow-hidden rounded-3xl border border-[#e4e0d9] bg-white shadow-[0_8px_30px_rgba(35,32,27,0.04)]">
          <div className="flex items-center justify-between border-b border-[#eeeae4] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f4ff] text-[#5146e5]">
                <Icon name="orders" className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#292621]">
                  Order history
                </h2>

                <p className="mt-0.5 text-xs text-[#8a837b]">
                  {orders.length}{" "}
                  {orders.length === 1 ? "order" : "orders"} placed
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#eeeae4]">
            {orders.length ? (
              orders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="group flex items-center justify-between gap-4 px-5 py-5 transition-all duration-300 hover:bg-[#fdfcfb] sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#faf9f7] text-[#a17b3f] transition-colors duration-300 group-hover:bg-[#f5f1eb]">
                      <Icon name="package" className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#292621] group-hover:text-[#5146e5]">
                        {o.orderNumber}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#9a938b]">
                        <Icon name="calendar" className="h-3 w-3" />
                        {new Date(o.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#292621]">
                        ₹{o.total.toLocaleString("en-IN")}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.06em] ${
                          statusStyles[o.status] ||
                          "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {o.status.replaceAll("_", " ")}
                      </span>
                    </div>

                    <Icon
                      name="arrow"
                      className="hidden h-4 w-4 text-[#aaa49d] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#5146e5] sm:block"
                    />
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <Icon name="orders" className="h-5 w-5" />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#514b44]">
                  No orders
                </p>

                <p className="mt-1 text-xs text-[#9a938b]">
                  This customer has not placed any orders yet.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Addresses */}
        <section className="overflow-hidden rounded-3xl border border-[#e4e0d9] bg-white shadow-[0_8px_30px_rgba(35,32,27,0.04)]">
          <div className="flex items-center gap-3 border-b border-[#eeeae4] px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f1eb] text-[#a17b3f]">
              <Icon name="location" className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#292621]">
                Saved addresses
              </h2>

              <p className="mt-0.5 text-xs text-[#8a837b]">
                {addresses.length} saved{" "}
                {addresses.length === 1 ? "address" : "addresses"}
              </p>
            </div>
          </div>

          <div className="space-y-3 p-5 sm:p-6">
            {addresses.length ? (
              addresses.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl border border-[#ebe7e0] bg-[#faf9f7] p-4 transition-all duration-300 hover:border-[#ddd7ce] hover:bg-[#f8f6f2]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#292621]">
                        {a.fullName}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[#77716a]">
                        <Icon name="phone" className="h-3 w-3" />
                        {a.phone}
                      </p>
                    </div>

                    {a.isDefault && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f5f1eb] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#a17b3f]">
                        <Icon name="check" className="h-3 w-3" />
                        Default
                      </span>
                    )}
                  </div>

                  <div className="mt-4 border-t border-[#e9e4dc] pt-3">
                    <p className="text-xs leading-5 text-[#77716a]">
                      {a.addressLine1}
                      {a.addressLine2 && (
                        <>
                          <br />
                          {a.addressLine2}
                        </>
                      )}
                      <br />
                      {a.landmark && `${a.landmark}, `}
                      {a.city}, {a.state} {a.pincode}
                      <br />
                      {a.country}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <Icon name="location" className="h-5 w-5" />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#514b44]">
                  No saved addresses
                </p>

                <p className="mt-1 text-xs text-[#9a938b]">
                  This customer has not saved an address.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}