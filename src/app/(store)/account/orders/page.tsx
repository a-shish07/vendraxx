"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../../../App";

export default function OrdersPage() {
  const { user, authLoading, toast } = useApp();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=/account/orders");
      return;
    }

    if (user) {
      fetch("/api/orders", { cache: "no-store" })
        .then(async (r) => {
          const d = await r.json();
          if (!r.ok) throw new Error(d.error);
          setOrders(d.orders || []);
        })
        .catch((e) =>
          toast(
            e instanceof Error ? e.message : "Unable to load orders.",
            "error",
          ),
        )
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router, toast]);

  if (authLoading || !user)
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ded8cf] border-t-[#a17b3f]" />
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#8a837b]">
            Loading orders
          </p>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-[#e8e2da] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#b28b52]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a17b3f]">
                Account
              </p>
            </div>

            <h1 className="mt-3 font-display text-4xl font-normal tracking-tight text-[#24211d] sm:text-5xl">
              Order history
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#77716a]">
              View and track all your orders.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#514b44] transition-colors duration-300 hover:text-[#a17b3f]"
          >
            Continue shopping
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Order count */}
        {!loading && orders.length > 0 && (
          <div className="mt-7 flex items-center gap-4">
            <p className="text-xs text-[#8a837b]">
              <span className="font-semibold text-[#514b44]">
                {orders.length}
              </span>{" "}
              {orders.length === 1 ? "order" : "orders"}
            </p>

            <div className="h-px flex-1 bg-[#eee9e2]" />
          </div>
        )}

        {/* Orders */}
        <div className="mt-6 space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="relative h-32 overflow-hidden rounded-[20px] border border-[#eee9e2] bg-[#faf9f7]"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />

                <div className="p-5">
                  <div className="h-4 w-32 animate-pulse rounded bg-[#e8e2da]" />
                  <div className="mt-3 h-3 w-44 animate-pulse rounded bg-[#eee9e2]" />
                  <div className="mt-3 h-3 w-28 animate-pulse rounded bg-[#eee9e2]" />
                </div>
              </div>
            ))
          ) : orders.length === 0 ? (
            /* Empty state */
            <div className="mx-auto max-w-xl rounded-[26px] border border-[#e5ded4] bg-white px-6 py-16 text-center shadow-[0_15px_50px_rgba(48,39,28,0.05)] sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d9c49e] bg-[#faf7f0]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-7 w-7 text-[#b28b52]"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <path
                    d="M6 3h12v18l-6-3-6 3V3Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 7h6M9 11h6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a17b3f]">
                Your orders
              </p>

              <h2 className="mt-2 font-display text-2xl text-[#292621]">
                No orders yet
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#77716a]">
                Your completed purchases will appear here. Start exploring
                Vendrax and find something you love.
              </p>

              <Link
                href="/products"
                className="group relative mt-7 inline-flex h-11 items-center justify-center overflow-hidden rounded-xl bg-[#25221e] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a17b3f] hover:shadow-[0_12px_25px_rgba(161,123,63,0.2)]"
              >
                <span className="relative z-10">Start shopping</span>

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
            </div>
          ) : (
            orders.map((o) => {
              const itemCount =
                o.items?.reduce(
                  (sum: any, item: any) => sum + item.quantity,
                  0,
                ) || 0;

              const isCancelled = o.status === "CANCELLED";
              const isDelivered = o.status === "DELIVERED";

              return (
                <Link
                  key={o.id}
                  href={`/account/orders/${o.id}`}
                  className="group block overflow-hidden rounded-[20px] border border-[#e5ded4] bg-white shadow-[0_8px_30px_rgba(48,39,28,0.035)] transition-all duration-400 hover:-translate-y-1 hover:border-[#d4c3a7] hover:shadow-[0_18px_45px_rgba(48,39,28,0.08)]"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      {/* Left */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#faf7f0] text-[#a17b3f] transition-transform duration-300 group-hover:scale-105">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-5 w-5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                d="M6 3h12v18l-6-3-6 3V3Z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9 7h6M9 11h6"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#292621] transition-colors duration-300 group-hover:text-[#a17b3f]">
                              {o.orderNumber}
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#99928a]">
                              {new Date(o.createdAt).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8a837b]">
                          <span>
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-[#cfc8bf]" />

                          <span>Cash on Delivery</span>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <div className="sm:text-right">
                          <p className="text-base font-semibold text-[#25221e]">
                            ₹{o.total.toLocaleString("en-IN")}
                          </p>

                          <span
                            className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] ${
                              isCancelled
                                ? "bg-red-50 text-red-700"
                                : isDelivered
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-[#faf4e7] text-[#a17b3f]"
                            }`}
                          >
                            {o.status.replaceAll("_", " ")}
                          </span>
                        </div>

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e4ded6] text-[#aaa39b] transition-all duration-300 group-hover:border-[#c9b08a] group-hover:text-[#a17b3f]">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              d="M9 18l6-6-6-6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom hover accent */}
                  <div className="h-px w-0 bg-[#b28b52] transition-all duration-500 group-hover:w-full" />
                </Link>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}