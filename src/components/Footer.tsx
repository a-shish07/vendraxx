"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Cart", path: "/cart" },
];

const legalLinks = [
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Refund Policy", path: "/refund-policy" },
];

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-brand text-white">
      {/* =========================================================
          MAIN FOOTER
      ========================================================== */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* -------------------------------------------------------
            TOP CTA / BRAND INTRO
        -------------------------------------------------------- */}
        <div className="border-b border-white/10 py-10 sm:py-12">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            {/* Brand */}
            <div className="max-w-xl">
              <div className="mb-5">
                <Logo variant="light" size="md" />
              </div>

              <div className="flex items-center gap-2">
                <span className="h-px w-7 bg-accent" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Shop with confidence
                </span>
              </div>

              <h2 className="mt-3 max-w-lg font-display text-2xl leading-tight text-white sm:text-3xl">
                Quality products.
                <br />
                <span className="text-white/60">Simply delivered.</span>
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
                Discover carefully selected electronics and fashion essentials,
                backed by dependable service and convenient Cash on Delivery
                across India.
              </p>
            </div>

            {/* Support Card */}
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 11.5a8.38 8.38 0 01-9 8.5 8.7 8.7 0 01-4.15-1.05L3 20l1.08-4.57A8.5 8.5 0 113 11.5"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">
                    Need help with your order?
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-white/45">
                    Our support team is here to help with products, orders and
                    delivery.
                  </p>

                  <button
                    type="button"
                    onClick={() => router.push("/contact")}
                    className="group mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent transition-colors hover:text-white"
                  >
                    Contact support
                    <svg
                      className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
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

        {/* -------------------------------------------------------
            FOOTER CONTENT
        -------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:gap-12 lg:py-12">
          {/* =====================================================
              BRAND / SOCIAL
          ====================================================== */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              Vendrax
            </p>

            <p className="mt-3 max-w-xs text-xs leading-6 text-white/50">
              A modern shopping experience built around quality, simplicity and
              dependable delivery.
            </p>

            {/* Social */}
            <div className="mt-5 flex items-center gap-2.5">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  border border-white/10
                  bg-white/[0.04]
                  text-white/55
                  transition-all duration-200
                  hover:border-white/20
                  hover:bg-accent
                  hover:text-white
                "
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  border border-white/10
                  bg-white/[0.04]
                  text-white/55
                  transition-all duration-200
                  hover:border-white/20
                  hover:bg-accent
                  hover:text-white
                "
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />

                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />

                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="/contact"
                aria-label="Contact support"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  border border-white/10
                  bg-white/[0.04]
                  text-white/55
                  transition-all duration-200
                  hover:border-white/20
                  hover:bg-green-500
                  hover:text-white
                "
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              {/* X */}
              <a
                href="#"
                aria-label="Twitter / X"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  border border-white/10
                  bg-white/[0.04]
                  text-white/55
                  transition-all duration-200
                  hover:border-white/20
                  hover:bg-accent
                  hover:text-white
                "
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* =====================================================
              QUICK LINKS
          ====================================================== */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              Explore
            </h3>

            <ul className="mt-5 space-y-2.5">
              {quickLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    href={path}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      text-left
                      text-xs
                      text-white/55
                      transition-colors
                      duration-150
                      hover:text-white
                    "
                  >
                    <span
                      className="
                        h-px
                        w-0
                        bg-accent
                        transition-all
                        duration-200
                        group-hover:w-3
                      "
                    />

                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =====================================================
              CUSTOMER + LEGAL
          ====================================================== */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              Customer Care
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-xs text-white/55 transition-colors hover:text-white"
                >
                  Shop Products
                </Link>
              </li>

              <li>
                <Link
                  href="/cart"
                  className="text-xs text-white/55 transition-colors hover:text-white"
                >
                  Your Cart
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-xs text-white/55 transition-colors hover:text-white"
                >
                  Contact Support
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-xs text-white/55 transition-colors hover:text-white"
                >
                  About Vendrax
                </Link>
              </li>
            </ul>

            {/* Legal */}
            <div className="mt-7 border-t border-white/10 pt-5">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                Legal
              </h3>

              <ul className="mt-4 space-y-3">
                {legalLinks.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      href={path}
                      className="text-xs text-white/55 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* =====================================================
              CONTACT
          ====================================================== */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              Get in Touch
            </h3>

            <div className="mt-5 space-y-2.5">
              {/* Email */}
              <a
                href="mailto:vendraxpvt@gmail.com"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.035]
                  px-3
                  py-2.5
                  transition-all
                  hover:border-white/15
                  hover:bg-white/[0.06]
                "
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7l8 6 8-6"
                    />
                  </svg>
                </span>

                <span className="min-w-0">
                  <span className="block text-[9px] uppercase tracking-wider text-white/30">
                    Email
                  </span>

                  <span className="mt-0.5 block truncate text-[11px] text-white/65 group-hover:text-white">
                    vendraxpvt@gmail.com
                  </span>
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href="/contact"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.035]
                  px-3
                  py-2.5
                  transition-all
                  hover:border-white/15
                  hover:bg-white/[0.06]
                "
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>

                <span>
                  <span className="block text-[9px] uppercase tracking-wider text-white/30">
                    Contact support
                  </span>

                  <span className="mt-0.5 block text-[11px] text-white/65 group-hover:text-white">
                    Chat with us
                  </span>
                </span>
              </a>

              {/* Location */}
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z"
                    />

                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>

                <span>
                  <span className="block text-[9px] uppercase tracking-wider text-white/30">
                    Serving
                  </span>

                  <span className="mt-0.5 block text-[11px] text-white/65">
                    India
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM BAR
        ========================================================== */}
        <div className="border-t border-white/10 py-5">
          <div className="flex flex-col gap-3 text-[10px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Vendrax Pvt. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                href="/terms"
                className="transition-colors hover:text-white"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/refund-policy"
                className="transition-colors hover:text-white"
              >
                Refund Policy
              </Link>

              <Link
                href="/contact"
                className="transition-colors hover:text-white"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
