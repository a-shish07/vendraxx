"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "../../../../../App";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  statusHistory: { status: string; note?: string; at: string }[];
  items: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
};

export default function OrderDetails() {
  const id = useParams<{ id: string }>()?.id;
  const router = useRouter();
  const { toast } = useApp();

  const [order, setOrder] = useState<Order | null | undefined>();
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const response = await fetch(
      `/api/orders/${encodeURIComponent(id || "")}`,
      { cache: "no-store" },
    );

    if (!response.ok) throw new Error("Order not found.");

    const data = await response.json();
    setOrder(data.order);
  }

  useEffect(() => {
    if (id)
      void load().catch((e) => {
        setOrder(null);
        toast(e instanceof Error ? e.message : "Order not found.", "error");
      });
  }, [id]);

  async function cancel() {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(id || "")}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        },
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Unable to cancel order.");

      await load();
      toast("Order cancelled. Inventory has been restored.");
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to cancel order.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  if (order === undefined)
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ded8cf] border-t-[#a17b3f]" />
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#8a837b]">
            Loading order
          </p>
        </div>
      </main>
    );

  if (!order)
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-[24px] border border-[#e5ded4] bg-white p-10 text-center shadow-[0_15px_50px_rgba(48,39,28,0.05)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#faf7f0] text-[#a17b3f]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="9" />
              <path
                d="M12 8v5M12 16h.01"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="mt-5 font-display text-2xl text-[#292621]">
            Order not found
          </h1>

          <button
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-[#25221e] px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-[#a17b3f]"
          >
            Go back
          </button>
        </div>
      </main>
    );

  const canCancel = ["PENDING", "CONFIRMED"].includes(order.status);

  const statusIsCancelled = order.status === "CANCELLED";
  const statusIsDelivered = order.status === "DELIVERED";

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#77716a] transition-colors duration-300 hover:text-[#a17b3f]"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Back to orders
        </button>

        {/* Header */}
        <div className="mt-7 border-b border-[#e8e2da] pb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#b28b52]" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a17b3f]">
                  Order details
                </p>
              </div>

              <h1 className="mt-3 font-display text-3xl font-normal tracking-tight text-[#24211d] sm:text-4xl">
                {order.orderNumber}
              </h1>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                statusIsCancelled
                  ? "bg-red-50 text-red-700"
                  : statusIsDelivered
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-[#faf4e7] text-[#a17b3f]"
              }`}
            >
              {order.status.replaceAll("_", " ")}
            </span>
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_310px]">
          {/* Left column */}
          <div className="space-y-5">
            {/* Products */}
            <section className="overflow-hidden rounded-[22px] border border-[#e5ded4] bg-white shadow-[0_8px_30px_rgba(48,39,28,0.035)]">
              <div className="border-b border-[#eee9e2] px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a17b3f]">
                      Your purchase
                    </p>
                    <h2 className="mt-1 font-display text-xl text-[#292621]">
                      Order items
                    </h2>
                  </div>

                  <span className="text-xs text-[#8a837b]">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-[#eee9e2]">
                {order.items.map((i) => (
                  <div
                    key={i.productId}
                    className="group flex gap-4 p-4 transition-colors duration-300 hover:bg-[#fcfbf9] sm:p-5"
                  >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f7f5f1] sm:h-24 sm:w-24">
                      <img
                        src={i.image || "/placeholder-product.svg"}
                        alt=""
                        className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <p className="text-sm font-semibold leading-5 text-[#292621] transition-colors duration-300 group-hover:text-[#a17b3f]">
                        {i.name}
                      </p>

                      <p className="mt-2 text-xs text-[#8a837b]">
                        Quantity: {i.quantity}
                      </p>

                      <p className="mt-1 text-xs text-[#8a837b]">
                        ₹{i.price.toLocaleString("en-IN")} each
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center">
                      <p className="text-sm font-semibold text-[#25221e]">
                        ₹{(i.price * i.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery */}
            <section className="rounded-[22px] border border-[#e5ded4] bg-white p-5 shadow-[0_8px_30px_rgba(48,39,28,0.035)] sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#faf7f0] text-[#a17b3f]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a17b3f]">
                    Delivery
                  </p>

                  <h2 className="mt-1 font-display text-xl text-[#292621]">
                    Delivery address
                  </h2>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-[#faf9f7] p-4">
                <p className="text-sm font-semibold text-[#292621]">
                  {order.customer?.name}
                </p>

                <p className="mt-2 text-sm leading-6 text-[#77716a]">
                  {order.customer?.address}
                  <br />
                  {order.customer?.city}, {order.customer?.state}{" "}
                  {order.customer?.pincode}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#eee9e2] px-4 py-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-[#a17b3f]"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                  />
                  <path d="M3 10h18" />
                </svg>

                <p className="text-xs text-[#77716a]">
                  Payment:{" "}
                  <span className="font-semibold text-[#514b44]">
                    Cash on Delivery
                  </span>
                </p>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-5">
            {/* Status */}
            <section className="rounded-[22px] border border-[#e5ded4] bg-white p-5 shadow-[0_8px_30px_rgba(48,39,28,0.035)] sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a17b3f]">
                    Tracking
                  </p>

                  <h2 className="mt-1 font-display text-xl text-[#292621]">
                    Order status
                  </h2>
                </div>

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    statusIsCancelled
                      ? "bg-red-50 text-red-600"
                      : statusIsDelivered
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-[#faf4e7] text-[#a17b3f]"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      d="M5 12l4 4L19 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-[#faf9f7] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#8a837b]">
                  Current status
                </p>

                <p
                  className={`mt-1 text-sm font-bold ${
                    statusIsCancelled
                      ? "text-red-700"
                      : statusIsDelivered
                        ? "text-emerald-700"
                        : "text-[#a17b3f]"
                  }`}
                >
                  {order.status.replaceAll("_", " ")}
                </p>
              </div>

              {/* Timeline */}
              <div className="mt-6 space-y-0">
                {order.statusHistory?.map((s, i) => (
                  <div
                    key={`${s.status}-${s.at}-${i}`}
                    className="relative flex gap-3 pb-5 last:pb-0"
                  >
                    {i !== order.statusHistory.length - 1 && (
                      <span className="absolute left-[7px] top-4 h-[calc(100%-8px)] w-px bg-[#ddd6cd]" />
                    )}

                    <span className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-[#b28b52] bg-white" />

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#292621]">
                        {s.status.replaceAll("_", " ")}
                      </p>

                      {s.note && (
                        <p className="mt-1 text-[11px] leading-5 text-[#77716a]">
                          {s.note}
                        </p>
                      )}

                      <p className="mt-1 text-[10px] text-[#aaa39b]">
                        {new Date(s.at).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Summary */}
            <section className="rounded-[22px] border border-[#e5ded4] bg-white p-5 shadow-[0_8px_30px_rgba(48,39,28,0.035)] sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a17b3f]">
                Payment summary
              </p>

              <h2 className="mt-1 font-display text-xl text-[#292621]">
                Order total
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-[#77716a]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#514b44]">
                    ₹{order.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-[#77716a]">
                  <span>Shipping</span>
                  <span className="font-medium text-[#514b44]">
                    {order.shipping
                      ? "₹" + order.shipping.toLocaleString("en-IN")
                      : "Free"}
                  </span>
                </div>

                <div className="my-3 h-px bg-[#e8e2da]" />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#292621]">Total</span>

                  <span className="text-lg font-semibold text-[#25221e]">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </section>

            {/* Cancellation */}
            {canCancel && (
              <section className="rounded-[22px] border border-red-100 bg-white p-5 shadow-[0_8px_30px_rgba(48,39,28,0.035)] sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  Need to cancel?
                </p>

                <h2 className="mt-1 font-display text-xl text-[#292621]">
                  Cancel order
                </h2>

                <label className="mt-5 block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#514b44]">
                    Cancellation reason
                  </span>

                  <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    maxLength={500}
                    placeholder="Tell us why you'd like to cancel..."
                    className="min-h-[100px] w-full resize-none rounded-xl border border-[#ded8cf] bg-[#fcfbf9] p-3 text-sm text-[#292621] outline-none transition-all duration-300 placeholder:text-[#aaa39b] hover:border-[#c9c0b4] focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </label>

                <button
                  disabled={saving || reason.trim().length < 5}
                  onClick={() => void cancel()}
                  className="mt-3 flex h-11 w-full items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-xs font-semibold uppercase tracking-[0.1em] text-red-700 transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? "Cancelling…" : "Cancel order"}
                </button>
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}