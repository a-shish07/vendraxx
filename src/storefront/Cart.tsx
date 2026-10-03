'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../App'

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useApp()
    const router = useRouter()

  const [removingId, setRemovingId] = useState<string | null>(null)

  /* ---------- REMOVE ANIMATION ---------- */
  const handleRemove = (id: string) => {
    setRemovingId(id)

    setTimeout(() => {
      removeFromCart(id)
      setRemovingId(null)
    }, 220)
  }

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50/60 px-4 py-14 sm:py-16 flex items-center justify-center relative overflow-hidden">

        {/* subtle background decoration */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />

        <div className="relative w-full max-w-md text-center">

          {/* Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

            <svg
              className="h-7 w-7 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            Your Cart
          </p>

          <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-brand sm:text-3xl">
            Your cart is empty
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Looks like you haven't added anything yet. Explore our collection
            and find something you'll love.
          </p>

          <button
            onClick={() => router.push('/products')}
            className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-lg"
          >
            Browse Products

            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-2">

            {[
              { icon: '✓', label: 'Free Shipping' },
              { icon: '₹', label: 'Cash on Delivery' },
              { icon: '↻', label: 'Easy Returns' },
            ].map((badge) => (
              <div
                key={badge.label}
                className="rounded-xl border border-slate-200 bg-white px-2 py-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <span className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-[10px] font-semibold text-brand">
                  {badge.icon}
                </span>

                <span className="block text-[9px] font-medium leading-tight text-slate-500">
                  {badge.label}
                </span>
              </div>
            ))}

          </div>

        </div>
      </div>
    )
  }


  /* =========================================================
     CALCULATIONS
  ========================================================= */

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const shipping = cartTotal >= 999 ? 0 : 79
  const total = cartTotal + shipping

  const freeShippingThreshold = 999
  const remainingForFree = freeShippingThreshold - cartTotal

  const progress = Math.min(
    (cartTotal / freeShippingThreshold) * 100,
    100
  )


  /* =========================================================
     MAIN CART
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50/60">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden bg-brand">

        {/* subtle decoration */}
        <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-9 lg:px-8">

          <nav className="mb-4 flex items-center gap-2 text-[10px] font-medium text-white/35">

            <button
              onClick={() => router.push('/')}
              className="transition-colors hover:text-white"
            >
              Home
            </button>

            <span>/</span>

            <span className="text-white/65">
              Cart
            </span>

          </nav>


          <div className="flex items-end justify-between gap-4">

            <div>

              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                Shopping Bag
              </p>

              <h1 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
                Your Cart
              </h1>

              <p className="mt-1.5 text-xs text-white/45">
                {itemCount} item{itemCount !== 1 ? 's' : ''} · ready when you are
              </p>

            </div>


            <button
              onClick={() => router.push('/products')}
              className="group hidden items-center gap-2 text-xs font-medium text-white/50 transition-colors hover:text-white sm:flex"
            >

              <svg
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>

              Continue Shopping

            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">


        {/* ===================================================
            FREE SHIPPING
        =================================================== */}

        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between gap-3">

            <div className="flex min-w-0 items-center gap-2.5">

              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  shipping === 0
                    ? 'bg-emerald-50'
                    : 'bg-slate-50'
                }`}
              >

                {shipping === 0 ? (
                  <svg
                    className="h-4 w-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 text-brand-light"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a2 2 0 104 0m-6 0a2 2 0 11-4 0m14 0a2 2 0 11-4 0"
                    />
                  </svg>
                )}

              </div>

              <p className="truncate text-xs font-medium text-brand">

                {shipping === 0 ? (
                  <>
                    You've unlocked{' '}
                    <span className="text-emerald-600">
                      free shipping
                    </span>
                  </>
                ) : (
                  <>
                    Add{' '}
                    <span className="font-bold text-accent">
                      ₹{remainingForFree.toLocaleString('en-IN')}
                    </span>{' '}
                    more for free shipping
                  </>
                )}

              </p>

            </div>


            <span className="shrink-0 text-[10px] font-medium text-slate-400">
              ₹{cartTotal.toLocaleString('en-IN')} / ₹999
            </span>

          </div>


          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">

            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                shipping === 0
                  ? 'bg-emerald-500'
                  : 'bg-accent'
              }`}
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>


        {/* ===================================================
            GRID
        =================================================== */}

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">


          {/* =================================================
              ITEMS
          ================================================= */}

          <div className="lg:col-span-2">

            <div className="mb-2.5 flex items-center justify-between">

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Cart Items
              </p>

              <p className="text-[10px] text-slate-400">
                {itemCount} total
              </p>

            </div>


            <div className="space-y-2.5">

              {cart.map((item, index) => {

                const isRemoving = removingId === item.id

                return (
                  <div
                    key={item.id}
                    className={`group rounded-xl border border-slate-200 bg-white p-3.5 transition-all duration-300 sm:p-4 ${
                      isRemoving
                        ? 'translate-x-3 opacity-0'
                        : 'translate-x-0 opacity-100'
                    } hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md`}
                    style={{
                      animation: `cartItemIn 400ms ease-out ${
                        index * 60
                      }ms both`,
                    }}
                  >

                    <div className="flex gap-3.5 sm:gap-4">


                      {/* Image */}

                      <button
                        onClick={() =>
                          router.push(`/products/${item.id}`)
                        }
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-50 sm:h-22 sm:w-22"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                      </button>


                      {/* Information */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
                              {item.category}
                            </p>

                            <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-brand sm:text-[15px]">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-[10px] text-slate-400">
                              ₹{item.price.toLocaleString('en-IN')} each
                            </p>

                          </div>


                          {/* Remove */}

                          <button
                            onClick={() =>
                              handleRemove(item.id)
                            }
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-300 transition-all hover:bg-red-50 hover:text-red-500"
                            aria-label={`Remove ${item.name}`}
                          >

                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>

                          </button>

                        </div>


                        {/* Quantity + Price */}

                        <div className="mt-3 flex items-center justify-between gap-3">

                          <div className="inline-flex h-8 items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="flex h-full w-8 items-center justify-center text-slate-500 transition-colors hover:bg-white hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label="Decrease quantity"
                            >
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  d="M5 12h14"
                                />
                              </svg>
                            </button>

                            <span className="flex h-full min-w-9 items-center justify-center border-x border-slate-200 px-2 text-xs font-bold text-brand">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                              className="flex h-full w-8 items-center justify-center text-slate-500 transition-colors hover:bg-white hover:text-brand"
                              aria-label="Increase quantity"
                            >
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  d="M12 5v14M5 12h14"
                                />
                              </svg>
                            </button>

                          </div>


                          <div className="text-right">

                            <p className="text-sm font-bold leading-none text-brand sm:text-base">
                              ₹{(
                                item.price * item.quantity
                              ).toLocaleString('en-IN')}
                            </p>

                            {item.quantity > 1 && (
                              <p className="mt-1 text-[9px] text-slate-400">
                                {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>
                )
              })}

            </div>


            {/* Mobile continue shopping */}

            <button
              onClick={() => router.push('/products')}
              className="mt-3 flex w-full items-center justify-center gap-2 py-3 text-xs font-semibold text-brand transition-colors hover:text-accent sm:hidden"
            >

              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>

              Continue Shopping

            </button>


            {/* Compact trust strip */}

            <div className="mt-3 grid grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white py-3">

              <TrustItem
                icon="✓"
                title="Quality"
                subtitle="Checked"
              />

              <TrustItem
                icon="→"
                title="Delivery"
                subtitle="Pan India"
              />

              <TrustItem
                icon="₹"
                title="COD"
                subtitle="Available"
              />

            </div>

          </div>


          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="lg:col-span-1">

            <div className="lg:sticky lg:top-24">

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                {/* subtle top accent */}

                <div className="h-0.5 bg-accent" />

                <div className="p-5">

                  <div className="mb-5 flex items-center justify-between">

                    <h2 className="font-display text-xl font-medium text-brand">
                      Order Summary
                    </h2>

                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-medium text-slate-400">
                      {itemCount} items
                    </span>

                  </div>


                  <div className="space-y-3">

                    <SummaryRow
                      label={`Subtotal (${itemCount} items)`}
                      value={`₹${cartTotal.toLocaleString('en-IN')}`}
                    />

                    <div className="flex justify-between text-xs">

                      <span className="text-slate-500">
                        Shipping
                      </span>

                      {shipping === 0 ? (
                        <span className="flex items-center gap-1 font-semibold text-emerald-600">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Free
                        </span>
                      ) : (
                        <span className="font-semibold text-brand">
                          ₹{shipping.toLocaleString('en-IN')}
                        </span>
                      )}

                    </div>

                    <div className="flex justify-between text-xs">

                      <span className="text-slate-500">
                        Tax
                      </span>

                      <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600">
                        Included
                      </span>

                    </div>

                  </div>


                  {/* Divider */}

                  <div className="my-4 h-px bg-slate-100" />


                  {/* Total */}

                  <div className="flex items-end justify-between">

                    <div>

                      <p className="text-xs font-semibold text-brand">
                        Total
                      </p>

                      {shipping > 0 && (
                        <p className="mt-1 text-[9px] text-slate-400">
                          Including ₹{shipping} shipping
                        </p>
                      )}

                    </div>

                    <span className="font-display text-2xl font-medium leading-none text-brand">
                      ₹{total.toLocaleString('en-IN')}
                    </span>

                  </div>


                  {/* Checkout */}

                  <button
                    onClick={() => router.push('/checkout')}
                    className="group mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-md"
                  >

                    Proceed to Checkout

                    <svg
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>

                  </button>


                  {/* Continue */}

                  <button
                    onClick={() => router.push('/products')}
                    className="mt-2 w-full rounded-lg border border-slate-200 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand"
                  >
                    Continue Shopping
                  </button>


                  {/* Trust information */}

                  <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">

                    <TrustRow
                      icon={
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      }
                      text="Secure SSL encrypted checkout"
                    />

                    <TrustRow
                      icon={
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      }
                      text="Cash on Delivery available"
                    />

                    <TrustRow
                      icon={
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      }
                      text="7-day easy returns"
                    />

                  </div>

                </div>

              </div>


            </div>

          </div>

        </div>

      </section>


      {/* Animation */}

      <style>{`
        @keyframes cartItemIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  )
}


/* =============================================================
   SUMMARY ROW
============================================================= */

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex justify-between text-xs">

      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-brand">
        {value}
      </span>

    </div>
  )
}


/* =============================================================
   TRUST ITEM
============================================================= */

function TrustItem({
  icon,
  title,
  subtitle,
}: {
  icon: string
  title: string
  subtitle: string
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center">

      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-[9px] font-semibold text-brand">
        {icon}
      </span>

      <span className="mt-1 text-[9px] font-semibold text-brand">
        {title}
      </span>

      <span className="text-[8px] text-slate-400">
        {subtitle}
      </span>

    </div>
  )
}


/* =============================================================
   TRUST ROW
============================================================= */

function TrustRow({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) {
  return (
    <div className="flex items-center gap-2.5 text-[10px] text-slate-500">

      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-50">

        <svg
          className="h-3.5 w-3.5 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          {icon}
        </svg>

      </div>

      <span>
        {text}
      </span>

    </div>
  )
}
