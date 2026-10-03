'use client'


import { useState } from 'react'
import { useApp } from '../App'
import Logo from '../components/Logo'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'

export default function Home() {
  const { navigate } = useApp()
  const { products: featuredProducts } = useProducts({ featured: true, limit: 8 })

  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()

    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-brand">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid min-h-[560px] items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-16">

            {/* ---------------------------------------------------
                HERO CONTENT
            ---------------------------------------------------- */}
            <div className="relative z-10 max-w-xl">

              {/* Eyebrow */}
              <div className="mb-5 flex items-center gap-2.5">
                <span className="h-px w-7 bg-accent" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  The Vendrax Collection
                </span>
              </div>

              {/* Logo */}
              <div className="mb-5">
                <Logo variant="light" size="sm" />
              </div>

              {/* Heading */}
              <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.8rem]">
                Everything you need.
                <br />
                <span className="text-accent">
                  Nothing unnecessary.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-lg text-sm leading-6 text-white/55 sm:text-base">
                Discover thoughtfully selected electronics and fashion
                essentials designed to make everyday shopping simpler,
                smarter and more enjoyable.
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate('products')}
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-accent
                    px-5
                    text-xs
                    font-bold
                    text-white
                    shadow-lg
                    shadow-black/10
                    transition-all
                    duration-200
                    hover:bg-accent-hover
                    hover:-translate-y-0.5
                  "
                >
                  Explore Products

                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 6l6 6-6 6"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/15
                    px-5
                    text-xs
                    font-semibold
                    text-white/70
                    transition-all
                    duration-200
                    hover:border-white/30
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  Discover Vendrax
                </button>
              </div>

              {/* Trust points */}
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.06] text-accent">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"
                      />
                      <circle cx="7" cy="19" r="1.5" />
                      <circle cx="18" cy="19" r="1.5" />
                    </svg>
                  </span>

                  <span className="text-[10px] text-white/50">
                    Reliable Delivery
                  </span>
                </div>

                <span className="hidden h-4 w-px bg-white/10 sm:block" />

                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.06] text-accent">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v18M17 7H9.5a3 3 0 100 6H15a3 3 0 110 6H7"
                      />
                    </svg>
                  </span>

                  <span className="text-[10px] text-white/50">
                    Cash on Delivery
                  </span>
                </div>

                <span className="hidden h-4 w-px bg-white/10 sm:block" />

                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.06] text-accent">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4"
                      />
                    </svg>
                  </span>

                  <span className="text-[10px] text-white/50">
                    Secure Shopping
                  </span>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------
                HERO VISUAL
            ---------------------------------------------------- */}
            <div className="relative hidden lg:block">

              {/* Main image */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-2 shadow-2xl">
                <div className="relative aspect-[0.95] overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&h=900&fit=crop&auto=format"
                    alt="Vendrax shopping"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-brand/75 via-transparent to-transparent" />

                  {/* Image caption */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="rounded-2xl border border-white/10 bg-brand/70 p-4 backdrop-blur-md">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-accent">
                            Curated for you
                          </p>

                          <p className="mt-1 text-sm font-semibold text-white">
                            Everyday essentials, elevated.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate('products')}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform hover:scale-105"
                          aria-label="Shop products"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 12h14M13 6l6 6-6 6"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stat */}
              <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/10 bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-accent">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3l1.9 5.8H20l-4.95 3.6 1.9 5.8L12 14.6l-4.95 3.6 1.9-5.8L4 8.8h6.1L12 3z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400">
                      Vendrax standard
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-brand">
                      Quality first
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CATEGORY SECTION
      ========================================================= */}
      <section className="bg-surface py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-px w-5 bg-accent" />

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-accent">
                  Explore
                </span>
              </div>

              <h2 className="font-display text-2xl text-brand sm:text-3xl">
                Shop by Category
              </h2>

              <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
                Find something made for your everyday.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('products')}
              className="hidden text-xs font-semibold text-accent transition-colors hover:text-accent-hover sm:block"
            >
              View all →
            </button>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Electronics */}
            <button
              type="button"
              onClick={() => navigate('products')}
              className="
                group
                relative
                h-56
                overflow-hidden
                rounded-2xl
                text-left
                sm:h-64
              "
            >
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop&auto=format"
                alt="Electronics"
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/35 to-brand/5" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">
                  Gadgets & Tech
                </p>

                <div className="mt-1 flex items-end justify-between gap-4">
                  <h3 className="font-display text-2xl text-white sm:text-3xl">
                    Electronics
                  </h3>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all group-hover:border-accent group-hover:bg-accent">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </button>

            {/* Clothing */}
           <button
  type="button"
  onClick={() => {
    sessionStorage.setItem('vendrax-product-category', 'Clothing')
    navigate('products')
  }}
              className="
                group
                relative
                h-56
                overflow-hidden
                rounded-2xl
                text-left
                sm:h-64
              "
            >
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=500&fit=crop&auto=format"
                alt="Clothing"
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/35 to-brand/5" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">
                  Fashion & Style
                </p>

                <div className="mt-1 flex items-end justify-between gap-4">
                  <h3 className="font-display text-2xl text-white sm:text-3xl">
                    Clothing
                  </h3>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all group-hover:border-accent group-hover:bg-accent">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </button>
        
          </div>

          <button
            type="button"
            onClick={() => navigate('products')}
            className="mt-5 text-xs font-semibold text-accent sm:hidden"
          >
            View all categories →
          </button>
        </div>
      </section>

      {/* =========================================================
          FEATURED PRODUCTS
      ========================================================= */}
      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-px w-5 bg-accent" />

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-accent">
                  Curated picks
                </span>
              </div>

              <h2 className="font-display text-2xl text-brand sm:text-3xl">
                Best Sellers
              </h2>

              <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
                A few customer favourites worth discovering.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('products')}
              className="hidden text-xs font-semibold text-accent transition-colors hover:text-accent-hover sm:block"
            >
              View all products →
            </button>
          </div>

          {/* 2 columns on mobile */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-7 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          <div className="mt-7 text-center sm:hidden">
            <button
              type="button"
              onClick={() => navigate('products')}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-border
                px-4
                py-2.5
                text-xs
                font-semibold
                text-brand
                transition-colors
                hover:bg-surface
              "
            >
              View All Products
              <span className="text-accent">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY VENDRAX
      ========================================================= */}
      <section className="bg-brand py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.5fr] lg:items-center">

            {/* Intro */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-px w-5 bg-accent" />

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-accent">
                  The Vendrax Difference
                </span>
              </div>

              <h2 className="font-display text-2xl leading-tight text-white sm:text-3xl">
                Shopping should feel
                <span className="text-white/45">
                  {' '}simple.
                </span>
              </h2>

              <p className="mt-3 max-w-sm text-xs leading-6 text-white/45 sm:text-sm">
                From product selection to delivery, we focus on
                making every part of your shopping experience
                straightforward and dependable.
              </p>

              <button
                type="button"
                onClick={() => navigate('about')}
                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-accent transition-colors hover:text-white"
              >
                Learn more about us
                <span>→</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                {
                  title: 'Premium Quality',
                  desc: 'Carefully selected products.',
                  icon: (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3l1.9 5.8H20l-4.95 3.6 1.9 5.8L12 14.6l-4.95 3.6 1.9-5.8L4 8.8h6.1L12 3z"
                      />
                    </svg>
                  ),
                },
                {
                  title: 'Fast Delivery',
                  desc: 'Reliable delivery across India.',
                  icon: (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"
                      />
                      <circle cx="7" cy="19" r="1.5" />
                      <circle cx="18" cy="19" r="1.5" />
                    </svg>
                  ),
                },
                {
                  title: 'COD Available',
                  desc: 'Pay when your order arrives.',
                  icon: (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v18M17 7H9.5a3 3 0 100 6H15a3 3 0 110 6H7"
                      />
                    </svg>
                  ),
                },
                {
                  title: 'Easy Returns',
                  desc: 'Simple return experience.',
                  icon: (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 12a8 8 0 018-8 8.2 8.2 0 017.4 5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 4v5h-5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 12a8 8 0 01-8 8 8.2 8.2 0 01-7.4-5"
                      />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.035]
                    p-4
                    transition-all
                    duration-200
                    hover:border-white/15
                    hover:bg-white/[0.06]
                  "
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    {item.icon}
                  </div>

                  <h3 className="mt-4 text-xs font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[9px] leading-4 text-white/35">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          NEWSLETTER
      ========================================================= */}
      <section className="bg-surface py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7">

            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">

              {/* Text */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-px w-5 bg-accent" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-accent">
                    Stay connected
                  </span>
                </div>

                <h2 className="font-display text-2xl text-brand">
                  Don't miss what's new.
                </h2>

                <p className="mt-1.5 max-w-md text-xs leading-5 text-slate-500">
                  Get new arrivals, selected offers and Vendrax updates
                  delivered straight to your inbox.
                </p>
              </div>

              {/* Form */}
              {subscribed ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 md:min-w-[290px]">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12.5l4 4L19 7"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-emerald-700">
                        You're subscribed.
                      </p>

                      <p className="mt-0.5 text-[9px] text-emerald-600">
                        Welcome to Vendrax.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex w-full flex-col gap-2 sm:flex-row md:min-w-[380px]"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="
                      h-11
                      min-w-0
                      flex-1
                      rounded-xl
                      border
                      border-border
                      bg-surface
                      px-3.5
                      text-xs
                      text-brand
                      outline-none
                      transition-all
                      placeholder:text-slate-400
                      focus:border-accent
                      focus:ring-2
                      focus:ring-accent/10
                    "
                  />

                  <button
                    type="submit"
                    className="
                      h-11
                      shrink-0
                      rounded-xl
                      bg-brand
                      px-5
                      text-xs
                      font-bold
                      text-white
                      transition-all
                      duration-200
                      hover:bg-brand/90
                    "
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}