'use client'

import { useEffect, useRef, useState } from 'react'
import Logo from '../components/Logo'
import { useApp } from '../App'
import { useRouter } from 'next/navigation'


const features = [
  {
    icon: '✦',
    title: 'Premium Quality',
    desc: 'Carefully selected products that meet our quality standards.',
  },
  {
    icon: '→',
    title: 'Fast Delivery',
    desc: 'Trusted delivery partners bringing orders safely to your doorstep.',
  },
  {
    icon: '₹',
    title: 'Cash on Delivery',
    desc: 'Shop with confidence and pay when your order arrives.',
  },
  {
    icon: '♡',
    title: 'Customer First',
    desc: 'Helpful support for your questions, orders and returns.',
  },
]

const stats = [
  { value: '5,000+', label: 'Happy Customers' },
  { value: '200+', label: 'Products' },
  { value: '99%', label: 'Satisfaction' },
  { value: '2–5', label: 'Days Delivery' },
]

const timeline = [
  {
    year: '2021',
    title: 'The Beginning',
    desc: 'Vendrax was founded with a simple mission — make premium products accessible to every Indian household.',
  },
  {
    year: '2022',
    title: 'Growing Trust',
    desc: 'Crossed our first 1,000 customers and expanded our curated product collection.',
  },
  {
    year: '2023',
    title: 'Nationwide Reach',
    desc: 'Expanded Cash on Delivery and delivery coverage across India.',
  },
  {
    year: '2024',
    title: '5,000+ Strong',
    desc: 'Built a growing community of customers with a focus on quality and service.',
  },
]

const team = [
  {
    img: 'photo-1507003211169-0a1dd7228f2d',
    name: 'Arjun Patel',
    role: 'Founder & CEO',
    quote: 'Quality should never be a luxury.',
  },
  {
    img: 'photo-1494790108377-be9c29b29330',
    name: 'Priya Sharma',
    role: 'Head of Operations',
    quote: 'Every order is a promise we keep.',
  },
  {
    img: 'photo-1500648767791-00dcc994a43e',
    name: 'Ravi Mehta',
    role: 'Product Manager',
    quote: 'We curate, not just sell.',
  },
]

export default function About() {
  // const { navigate } = useApp()
  const router = useRouter()

  return (
    <div className="bg-slate-50 text-slate-900">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-brand">

        {/* Background decoration */}
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-white/[0.03] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

          <div className="grid items-center gap-8 lg:grid-cols-[1fr_290px]">

            {/* Hero Content */}
            <div className="max-w-2xl">

              <div className="mb-5 flex items-center gap-3">
                <Logo variant="light" size="md" />

                <span className="h-4 w-px bg-white/20" />

                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
                  Since 2021
                </span>
              </div>

              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                About Vendrax
              </p>

              <h1 className="font-display text-[38px] font-medium leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[52px]">
                Shopping should feel
                <span className="block text-white/45">
                  simple &amp; better.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-white/55">
                We bring together thoughtfully selected products, fair pricing,
                reliable delivery and a shopping experience designed around you.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  onClick={() => router.push('/products')}
                  className="rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-brand transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-lg"
                >
                  Explore Products
                </button>

                <button
                  onClick={() => router.push('/contact')}
                  className="rounded-lg border border-white/15 px-5 py-2.5 text-xs font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/5"
                >
                  Contact Us
                </button>

              </div>
            </div>

            {/* Philosophy Card */}
            <div className="hidden lg:block">

              <div className="group rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.07]">

                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/35">
                    Our Philosophy
                  </span>

                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs text-accent transition-transform duration-500 group-hover:rotate-90">
                    ✦
                  </span>
                </div>

                <p className="mt-7 font-display text-xl leading-7 text-white">
                  Good products,
                  <span className="text-white/40">
                    {' '}honest prices,
                  </span>
                  {' '}better experiences.
                </p>

                <div className="mt-7 h-px bg-white/10" />

                <p className="mt-4 text-[11px] leading-5 text-white/35">
                  Built in India with a focus on quality, trust and simplicity.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          ANIMATED STATS
      ========================================================= */}
      <AnimatedStats stats={stats} />


      {/* =========================================================
          OUR STORY
      ========================================================= */}
      <section className="py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <Reveal>

            <div className="grid items-center gap-8 lg:grid-cols-[0.75fr_1.25fr]">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Our Story
                </p>

                <h2 className="mt-2 max-w-sm font-display text-3xl font-medium leading-tight tracking-tight text-slate-900 sm:text-4xl">
                  Built around
                  <span className="block text-slate-400">
                    trust.
                  </span>
                </h2>

                <div className="mt-4 h-px w-12 bg-brand" />
              </div>

              <div className="max-w-2xl">

                <p className="text-[15px] leading-7 text-slate-700">
                  Vendrax started with a straightforward idea: shopping online
                  should not be complicated. Customers deserve good products,
                  transparent pricing and dependable service.
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  From our product selection to the moment an order reaches your
                  doorstep, every part of the experience is designed to be
                  simple, reliable and customer-focused.
                </p>

                <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2.5">

                  {[
                    'Curated Products',
                    'Fair Pricing',
                    'Reliable Service',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-[11px] font-medium text-slate-600"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {item}
                    </div>
                  ))}

                </div>

              </div>

            </div>

          </Reveal>

        </div>
      </section>


      {/* =========================================================
          BRAND STATEMENT
      ========================================================= */}
      <section className="border-y border-slate-200 bg-slate-100/70">

        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-10 lg:px-8">

          <Reveal>

            <div className="flex items-start gap-4">

              <span className="font-display text-3xl font-light leading-none text-accent">
                “
              </span>

              <div>

                <p className="max-w-4xl font-display text-xl leading-7 tracking-tight text-slate-800 sm:text-2xl">
                  We don't believe in selling more.
                  We believe in helping people
                  <span className="text-slate-400">
                    {' '}find better.
                  </span>
                </p>

                <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  The Vendrax Philosophy
                </p>

              </div>

            </div>

          </Reveal>

        </div>

      </section>


      {/* =========================================================
          WHY VENDRAX
      ========================================================= */}
      <section className="py-12 sm:py-14">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <Reveal>

            <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Why Vendrax
                </p>

                <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-slate-900">
                  The details matter.
                </h2>
              </div>

              <p className="max-w-sm text-xs leading-5 text-slate-400 sm:text-right">
                A shopping experience built around the things customers value most.
              </p>

            </div>

          </Reveal>


          {/* Animated Feature Boxes */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature, index) => (
              <AnimatedFeatureCard
                key={feature.title}
                feature={feature}
                index={index}
              />
            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          VERTICAL JOURNEY
      ========================================================= */}
      <section className="bg-brand py-12 sm:py-14">

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <Reveal>

            <div className="mb-8">

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                Our Journey
              </p>

              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-white">
                Growing with you.
              </h2>

              <p className="mt-2 max-w-lg text-xs leading-5 text-white/40">
                From a simple idea to a growing community, every milestone has
                shaped what Vendrax is today.
              </p>

            </div>

          </Reveal>

          <JourneyTimeline />

        </div>

      </section>


      {/* =========================================================
          TEAM
      ========================================================= */}
      <section className="py-12 sm:py-14">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <Reveal>

            <div className="mb-7 flex items-end justify-between">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  The People
                </p>

                <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-slate-900">
                  Meet the team.
                </h2>
              </div>

              <p className="hidden max-w-xs text-right text-xs leading-5 text-slate-400 sm:block">
                The people behind the products, service and experience.
              </p>

            </div>

          </Reveal>


          <div className="grid gap-4 sm:grid-cols-3">

            {team.map((member, index) => (
              <AnimatedTeamCard
                key={member.name}
                member={member}
                index={index}
              />
            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="pb-10 sm:pb-14">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <Reveal>

            <div className="group relative overflow-hidden rounded-2xl bg-brand px-6 py-8 sm:px-10 sm:py-9">

              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-accent">
                    Start exploring
                  </p>

                  <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
                    Find something you'll love.
                  </h2>

                  <p className="mt-2 max-w-lg text-xs leading-5 text-white/40">
                    Discover our collection of carefully selected products.
                  </p>

                </div>

                <button
                  onClick={() => router.push('/products')}
                  className="group/button flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-brand transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-xl"
                >
                  Shop Now

                  <span className="transition-transform duration-300 group-hover/button:translate-x-1">
                    →
                  </span>
                </button>

              </div>

            </div>

          </Reveal>

        </div>

      </section>

    </div>
  )
}


/* =============================================================
   ANIMATED STATS
============================================================= */

function AnimatedStats({
  stats,
}: {
  stats: { value: string; label: string }[]
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.25,
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="border-b border-slate-200 bg-white"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">

        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`group relative px-4 py-5 text-center sm:px-6 sm:py-6 ${
              index !== 0
                ? 'border-l border-slate-100'
                : ''
            }`}
          >

            {/* Animated top line */}
            <div
              className={`absolute left-1/2 top-0 h-[2px] -translate-x-1/2 bg-accent transition-all duration-700 ease-out ${
                visible ? 'w-8' : 'w-0'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            />

            <div
              className={`font-display text-2xl font-medium tracking-tight text-slate-900 transition-all duration-700 sm:text-3xl ${
                visible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-3 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {stat.value}
            </div>

            <div
              className={`mt-1 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-400 transition-all duration-700 sm:text-[10px] ${
                visible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-2 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 150 + 150}ms`,
              }}
            >
              {stat.label}
            </div>

          </div>
        ))}

      </div>
    </section>
  )
}


/* =============================================================
   ANIMATED FEATURE CARD
============================================================= */

function AnimatedFeatureCard({
  feature,
  index,
}: {
  feature: {
    icon: string
    title: string
    desc: string
  }
  index: number
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.15,
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`group rounded-xl border border-slate-200 bg-white p-5 transition-all duration-700 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-6 opacity-0'
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >

      <div className="flex items-start justify-between">

        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-medium text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:rotate-3">
          {feature.icon}
        </span>

        <span className="text-xs text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
          ↗
        </span>

      </div>

      <h3 className="mt-5 text-sm font-semibold text-slate-900">
        {feature.title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {feature.desc}
      </p>

      <div className="mt-4 h-px w-0 bg-accent transition-all duration-500 group-hover:w-8" />

    </div>
  )
}


/* =============================================================
   VERTICAL JOURNEY TIMELINE
============================================================= */

function JourneyTimeline() {
  const [activeIndex, setActiveIndex] = useState(0)

  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            const index = Number(
              (entry.target as HTMLElement).dataset.index
            )

            if (!Number.isNaN(index)) {
              setActiveIndex(index)
            }
          }

        })
      },
      {
        threshold: 0.55,
        rootMargin: '-10% 0px -30% 0px',
      }
    )

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item)
    })

    return () => observer.disconnect()
  }, [])

  const progress =
    timeline.length > 1
      ? (activeIndex / (timeline.length - 1)) * 100
      : 0

  return (
    <div className="grid gap-7 lg:grid-cols-[130px_1fr]">

      {/* =====================================================
          DESKTOP YEAR NAVIGATION
      ===================================================== */}

      <div className="relative hidden lg:block">

        {/* Background line */}
        <div className="absolute left-[16px] top-3 bottom-3 w-px bg-white/10" />

        {/* Animated progress */}
        <div
          className="absolute left-[16px] top-3 w-px bg-accent transition-all duration-700 ease-out"
          style={{
            height: `${progress}%`,
          }}
        />

        <div className="relative space-y-7">

          {timeline.map((item, index) => {

            const isActive = index === activeIndex
            const isPast = index < activeIndex

            return (
              <button
                key={item.year}
                onClick={() => {
                  itemRefs.current[index]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  })
                }}
                className="group relative flex items-center gap-3 text-left"
              >

                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                    isActive
                      ? 'border-accent bg-accent shadow-[0_0_0_5px_rgba(255,255,255,0.04)]'
                      : isPast
                        ? 'border-accent/40 bg-accent/10'
                        : 'border-white/10 bg-brand'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-brand'
                        : isPast
                          ? 'bg-accent'
                          : 'bg-white/20'
                    }`}
                  />
                </span>

                <span
                  className={`text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'translate-x-1 text-white'
                      : 'text-white/25 group-hover:text-white/60'
                  }`}
                >
                  {item.year}
                </span>

              </button>
            )
          })}

        </div>

      </div>


      {/* =====================================================
          MOBILE YEAR NAVIGATION
      ===================================================== */}

      <div className="overflow-x-auto pb-1 lg:hidden">

        <div className="flex min-w-max gap-2">

          {timeline.map((item, index) => {

            const isActive = index === activeIndex

            return (
              <button
                key={item.year}
                onClick={() => {
                  itemRefs.current[index]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  })
                }}
                className={`rounded-full px-4 py-2 text-[10px] font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-accent text-brand'
                    : 'border border-white/10 text-white/30 hover:text-white/60'
                }`}
              >
                {item.year}
              </button>
            )
          })}

        </div>

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative">

        {/* Main vertical line */}
        <div className="absolute bottom-4 left-3 top-4 hidden w-px bg-white/10 sm:block" />

        <div className="space-y-4">

          {timeline.map((item, index) => {

            const isActive = index === activeIndex

            return (
              <div
                key={item.year}
                ref={(element) => {
                  itemRefs.current[index] = element
                }}
                data-index={index}
                className="relative sm:pl-9"
              >

                {/* Content dot */}
                <div
                  className={`absolute left-3 top-6 z-10 hidden h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border transition-all duration-500 sm:flex ${
                    isActive
                      ? 'border-accent bg-accent shadow-[0_0_0_5px_rgba(255,255,255,0.03)]'
                      : 'border-white/10 bg-brand'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive
                        ? 'bg-brand'
                        : 'bg-white/20'
                    }`}
                  />
                </div>


                {/* Card */}
                <button
                  onClick={() => setActiveIndex(index)}
                  className={`w-full rounded-xl border p-5 text-left transition-all duration-500 ${
                    isActive
                      ? 'border-white/10 bg-white/[0.07] shadow-lg'
                      : 'border-white/[0.05] bg-white/[0.025] hover:bg-white/[0.045]'
                  }`}
                >

                  <div className="flex items-start justify-between gap-5">

                    <div>

                      <p
                        className={`text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                          isActive
                            ? 'text-accent'
                            : 'text-white/20'
                        }`}
                      >
                        {item.year}
                      </p>

                      <h3
                        className={`mt-2 text-sm font-semibold transition-colors duration-300 ${
                          isActive
                            ? 'text-white'
                            : 'text-white/40'
                        }`}
                      >
                        {item.title}
                      </h3>

                    </div>

                    <span
                      className={`text-xs transition-all duration-500 ${
                        isActive
                          ? 'rotate-0 text-accent'
                          : '-rotate-45 text-white/10'
                      }`}
                    >
                      ↗
                    </span>

                  </div>


                  {/* Animated description */}
                  <div
                    className={`grid transition-all duration-500 ${
                      isActive
                        ? 'mt-3 grid-rows-[1fr] opacity-100'
                        : 'mt-0 grid-rows-[0fr] opacity-0'
                    }`}
                  >

                    <div className="overflow-hidden">

                      <p className="max-w-2xl text-xs leading-5 text-white/45">
                        {item.desc}
                      </p>

                    </div>

                  </div>

                </button>

              </div>
            )
          })}

        </div>

      </div>

    </div>
  )
}


/* =============================================================
   ANIMATED TEAM CARD
============================================================= */

function AnimatedTeamCard({
  member,
  index,
}: {
  member: {
    img: string
    name: string
    role: string
    quote: string
  }
  index: number
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.15,
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-700 hover:-translate-y-1 hover:shadow-lg ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-6 opacity-0'
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >

      <div className="aspect-[4/3] overflow-hidden bg-slate-100">

        <img
          src={`https://images.unsplash.com/${member.img}?auto=format&fit=crop&w=700&q=80`}
          alt={member.name}
          className="h-full w-full object-cover grayscale-[15%] transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
        />

      </div>

      <div className="p-4">

        <div className="flex items-start justify-between gap-3">

          <div>

            <h3 className="text-sm font-semibold text-slate-900">
              {member.name}
            </h3>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-slate-400">
              {member.role}
            </p>

          </div>

          <span className="text-sm text-accent transition-transform duration-300 group-hover:rotate-90">
            ✦
          </span>

        </div>

        <p className="mt-3 border-t border-slate-100 pt-3 text-xs italic leading-5 text-slate-500">
          “{member.quote}”
        </p>

      </div>

    </div>
  )
}


/* =============================================================
   GENERAL SCROLL REVEAL
============================================================= */

function Reveal({
  children,
}: {
  children: React.ReactNode
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.12,
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-5 opacity-0'
      }`}
    >
      {children}
    </div>
  )
}