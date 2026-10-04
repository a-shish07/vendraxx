"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApp } from "../../../../App";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  cancellationReason?: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    notes?: string;
  };
  items: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    sku?: string;
  }[];
  statusHistory: {
    status: string;
    note?: string;
    at: string;
    changedBy?: string;
  }[];
};

const statusStyles: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  PENDING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  CONFIRMED: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  PROCESSING: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  SHIPPED: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  OUT_FOR_DELIVERY: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    dot: "bg-cyan-500",
  },
  DELIVERED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || {
    bg: "bg-slate-50",
    text: "text-slate-700",
    dot: "bg-slate-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] ${style.bg} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {formatStatus(status)}
    </span>
  );
}

function Icon({
  name,
  className = "",
}: {
  name:
    | "package"
    | "user"
    | "location"
    | "payment"
    | "arrow"
    | "calendar"
    | "phone"
    | "mail"
    | "note"
    | "check";
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "package") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        {...common}
      >
        <path d="m21 8-9-5-9 5 9 5 9-5Z" />
        <path d="M3 8v9l9 5 9-5V8" />
        <path d="M12 13v9" />
        <path d="m7.5 5.5 9 5" />
      </svg>
    );
  }

  if (name === "user") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        {...common}
      >
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5" />
      </svg>
    );
  }

  if (name === "location") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        {...common}
      >
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (name === "payment") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        {...common}
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        {...common}
      >
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        {...common}
      >
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        {...common}
      >
        <path d="M6.5 3.5 9 3l2 5-2 1.5c1 2.1 2.4 3.5 4.5 4.5L15 12l5 2 .5 2.5c.2 1-.5 2-1.5 2.3-1.4.4-3.5.2-6.5-1.3-3.5-1.8-6-4.3-7.8-7.8C3.2 6.7 3 4.6 3.4 3.2c.3-1 1.3-1.7 2.3-1.5" />
      </svg>
    );
  }

  if (name === "mail") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        {...common}
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (name === "note") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        {...common}
      >
        <path d="M5 4h14v16H5z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      {...common}
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export default function AdminOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useApp();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(id || "")}`,
        { cache: "no-store" },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setOrder(data.order);
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to load order.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) void load();
  }, [id]);

  async function changeStatus(status: string) {
    let note = "";

    if (status === "CANCELLED") {
      note = window.prompt("Cancellation reason")?.trim() || "";

      if (note.length < 5)
        return toast("A cancellation reason is required.", "error");
    }

    setBusy(true);

    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setOrder(data.order);
      toast("Order updated.");
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to update order.",
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] animate-pulse space-y-5">
        <div className="h-5 w-28 rounded-lg bg-slate-200" />

        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="space-y-3">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-10 w-64 rounded-xl bg-slate-200" />
            <div className="h-4 w-48 rounded bg-slate-200" />
          </div>

          <div className="h-11 w-40 rounded-xl bg-slate-200" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="h-[430px] rounded-3xl bg-white" />
          <div className="space-y-5">
            <div className="h-60 rounded-3xl bg-white" />
            <div className="h-72 rounded-3xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-[#e5e1da] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Icon name="package" className="h-6 w-6 text-slate-500" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-[#292621]">
            Order not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The order you're looking for could not be found.
          </p>

          <Link
            href="/admin/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5146e5] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4338ca]"
          >
            <span>Back to orders</span>
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const next: Record<string, string> = {
    PENDING: "CONFIRMED",
    CONFIRMED: "PROCESSING",
    PROCESSING: "SHIPPED",
    SHIPPED: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "DELIVERED",
  };

  const currentStatusStyle =
    statusStyles[order.status] || statusStyles.PENDING;

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <div className="mb-7">
        <Link
          href="/admin/orders"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-[#77716a] transition-colors duration-300 hover:text-[#5146e5]"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Orders
        </Link>

        <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5146e5]">
                Order details
              </span>

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <Icon name="calendar" className="h-3.5 w-3.5" />
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-[#25221e] sm:text-4xl">
                {order.orderNumber}
              </h1>

              <StatusBadge status={order.status} />
            </div>

            <p className="mt-2 text-sm text-[#8a837b]">
              Manage this order, customer information and fulfillment status.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {next[order.status] && (
              <button
                disabled={busy}
                onClick={() => void changeStatus(next[order.status])}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#5146e5] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4338ca] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  Move to {formatStatus(next[order.status]).toLowerCase()}
                </span>
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            )}

            {["PENDING", "CONFIRMED"].includes(order.status) && (
              <button
                disabled={busy}
                onClick={() => void changeStatus("CANCELLED")}
                className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left */}
        <div className="space-y-5">
          {/* Items */}
          <section className="overflow-hidden rounded-3xl border border-[#e4e0d9] bg-white shadow-[0_8px_30px_rgba(35,32,27,0.04)]">
            <div className="flex items-center justify-between border-b border-[#eeeae4] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f1eb] text-[#a17b3f]">
                  <Icon name="package" className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-[#292621]">
                    Order items
                  </h2>
                  <p className="mt-0.5 text-xs text-[#8a837b]">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "product" : "products"}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                units
              </span>
            </div>

            <div>
              {order.items.map((item, index) => (
                <div
                  key={`${item.productId}-${item.name}`}
                  className={`group flex gap-4 p-5 transition-colors duration-300 hover:bg-[#fcfbf9] sm:p-6 ${
                    index !== order.items.length - 1
                      ? "border-b border-[#eeeae4]"
                      : ""
                  }`}
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#ebe7e0] bg-[#f8f7f4] sm:h-24 sm:w-24">
                    <img
                      src={item.image || "/placeholder-product.svg"}
                      alt=""
                      className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0 flex-1 self-center">
                    <p className="line-clamp-2 text-sm font-bold text-[#292621] sm:text-[15px]">
                      {item.name}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8a837b]">
                      <span>{item.sku || "No SKU"}</span>

                      <span className="h-1 w-1 rounded-full bg-slate-300" />

                      <span>
                        {item.quantity} × ₹
                        {item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="self-center text-right">
                    <p className="text-sm font-bold text-[#292621] sm:text-base">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-[11px] text-[#9a938b]">
                      Item total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery */}
          <section className="rounded-3xl border border-[#e4e0d9] bg-white p-5 shadow-[0_8px_30px_rgba(35,32,27,0.04)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f4ff] text-[#5146e5]">
                <Icon name="location" className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#292621]">
                  Delivery information
                </h2>
                <p className="mt-0.5 text-xs text-[#8a837b]">
                  Customer and shipping details
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a09a92]">
                  Customer
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <Icon name="user" className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#292621]">
                        {order.customer.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#8a837b]">
                        Customer
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <Icon name="phone" className="h-4 w-4" />
                    </div>

                    <p className="pt-1 text-sm text-[#514b44]">
                      {order.customer.phone}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <Icon name="mail" className="h-4 w-4" />
                    </div>

                    <p className="min-w-0 break-all pt-1 text-sm text-[#514b44]">
                      {order.customer.email}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a09a92]">
                  Shipping address
                </p>

                <div className="rounded-2xl border border-[#eeeae4] bg-[#faf9f7] p-4">
                  <p className="text-sm font-semibold leading-6 text-[#514b44]">
                    {order.customer.address}
                    <br />
                    {order.customer.city}, {order.customer.state}{" "}
                    {order.customer.pincode}
                  </p>
                </div>
              </div>
            </div>

            {order.customer.notes && (
              <div className="mt-6 rounded-2xl border border-[#eeeae4] bg-[#faf9f7] p-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#a17b3f] shadow-sm">
                    <Icon name="note" className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#514b44]">
                      Customer notes
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#77716a]">
                      {order.customer.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right */}
        <aside className="space-y-5">
          {/* Summary */}
          <section className="rounded-3xl border border-[#e4e0d9] bg-white p-5 shadow-[0_8px_30px_rgba(35,32,27,0.04)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f1eb] text-[#a17b3f]">
                <Icon name="payment" className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#292621]">
                  Order summary
                </h2>
                <p className="mt-0.5 text-xs text-[#8a837b]">
                  Payment & pricing
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between text-[#77716a]">
                <span>Subtotal</span>
                <span className="font-medium text-[#514b44]">
                  ₹{order.subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#77716a]">
                <span>Shipping</span>
                <span className="font-medium text-[#514b44]">
                  {order.shipping
                    ? "₹" + order.shipping.toLocaleString("en-IN")
                    : "Free"}
                </span>
              </div>

              <div className="my-4 border-t border-dashed border-[#ddd8d0]" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#77716a]">
                    Total amount
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-[#292621]">
                    ₹{order.total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#faf9f7] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9a938b]">
                  Method
                </p>
                <p className="mt-1 text-xs font-semibold text-[#514b44]">
                  {order.paymentMethod}
                </p>
              </div>

              <div className="rounded-xl bg-[#faf9f7] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9a938b]">
                  Payment
                </p>
                <p className="mt-1 text-xs font-semibold text-[#514b44]">
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-3xl border border-[#e4e0d9] bg-white p-5 shadow-[0_8px_30px_rgba(35,32,27,0.04)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#292621]">
                  Status timeline
                </h2>
                <p className="mt-0.5 text-xs text-[#8a837b]">
                  Order activity history
                </p>
              </div>

              <span
                className={`h-2.5 w-2.5 rounded-full ${currentStatusStyle.dot}`}
              />
            </div>

            <div className="mt-6">
              {order.statusHistory.map((entry, index) => {
                const isLast = index === order.statusHistory.length - 1;
                const style =
                  statusStyles[entry.status] || statusStyles.PENDING;

                return (
                  <div
                    key={`${entry.status}-${entry.at}-${index}`}
                    className="relative flex gap-4"
                  >
                    {!isLast && (
                      <span className="absolute left-[7px] top-5 h-[calc(100%+8px)] w-px bg-[#e4e0d9]" />
                    )}

                    <div className="relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${style.dot} ${
                          isLast ? "ring-4 ring-slate-50" : ""
                        }`}
                      />
                    </div>

                    <div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold capitalize text-[#292621]">
                          {formatStatus(entry.status).toLowerCase()}
                        </p>

                        {isLast && (
                          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                            Current
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-[11px] text-[#9a938b]">
                        {new Date(entry.at).toLocaleString("en-IN")}
                      </p>

                      {entry.note && (
                        <p className="mt-2 rounded-xl bg-[#faf9f7] px-3 py-2 text-xs leading-5 text-[#77716a]">
                          {entry.note}
                        </p>
                      )}

                      {entry.changedBy && (
                        <p className="mt-1.5 text-[10px] text-[#aaa49d]">
                          Updated by {entry.changedBy}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}