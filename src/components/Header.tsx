"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../App";
import Logo from "./Logo";
import type { Page } from "../App";

const navLinks: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "Products", page: "products" },
  { label: "About", page: "about" },
  { label: "Contact", page: "contact" },
];

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

export default function Header() {
  const {
    currentPage,
    navigate,
    cartCount,
    user,
    wishlist,
    refreshUser,
    toast,
  } = useApp();

  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!accountOpen) return;

    const onPointer = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavigate = (page: Page) => {
    navigate(page);
    setMenuOpen(false);
    setAccountOpen(false);
  };

  async function logout() {
    setAccountOpen(false);
    setMenuOpen(false);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to sign out.");
      }

      await refreshUser();

      toast("You have been signed out.", "success");

      router.push("/");
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Unable to sign out.",
        "error",
      );
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavigate("home")}
            aria-label="Go to homepage"
            className="shrink-0 transition-opacity duration-200 hover:opacity-85"
          >
            <Logo variant="light" size="sm" />
          </button>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map(({ label, page }) => {
              const active = currentPage === page;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => handleNavigate(page)}
                  className={`group relative rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors duration-200 ${
                    active
                      ? "text-white"
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  {label}

                  <span
                    className={`absolute bottom-1 left-1/2 h-px -translate-x-1/2 bg-accent transition-all duration-200 ${
                      active
                        ? "w-5 opacity-100"
                        : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Wishlist */}
            <button
              type="button"
              onClick={() => router.push("/wishlist")}
              aria-label={`Wishlist${
                wishlist.length
                  ? `, ${wishlist.length} items`
                  : ""
              }`}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <svg
                className="h-[18px] w-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.7}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 00-.1-7.8z"
                />
              </svg>

              {wishlist.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white ring-2 ring-brand">
                  {wishlist.length > 99
                    ? "99+"
                    : wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => handleNavigate("cart")}
              aria-label={`Cart${
                cartCount > 0
                  ? `, ${cartCount} items`
                  : ""
              }`}
              className="group relative flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 text-white/65 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:px-3"
            >
              <svg
                className="h-[18px] w-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.7}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"
                />

                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
              </svg>

              <span className="hidden text-xs font-semibold sm:block">
                Cart
              </span>

              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold leading-none text-white ring-2 ring-brand">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            <div
              className="relative"
              ref={accountRef}
            >
              <button
                type="button"
                onClick={() =>
                  user
                    ? setAccountOpen(
                        (value) => !value,
                      )
                    : router.push("/login")
                }
                aria-expanded={
                  user ? accountOpen : undefined
                }
                aria-haspopup={
                  user ? "menu" : undefined
                }
                aria-label={
                  user
                    ? "Open account menu"
                    : "Sign in"
                }
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 text-white/65 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                    {user
                      ? initials(user.name)
                      : "U"}
                  </span>
                )}

                <span className="hidden max-w-28 truncate text-xs font-semibold sm:block">
                  {user ? user.name : "Sign in"}
                </span>

                {user && (
                  <svg
                    className={`h-3.5 w-3.5 transition-transform ${
                      accountOpen
                        ? "rotate-180"
                        : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {/* Desktop Account Dropdown */}
              {user && accountOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-[70] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl">
                  {/* User info */}
                  <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-accent">
                        {initials(user.name)}
                      </span>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="p-2">
                    {user.role === "ADMIN" ? (
                      /* ADMIN MENU */
                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          router.push("/admin");
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand"
                      >
                        <span className="text-lg">
                          ⌘
                        </span>

                        <span>
                          Admin Dashboard
                        </span>
                      </button>
                    ) : (
                      /* CUSTOMER MENU */
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setAccountOpen(false);
                            router.push(
                              "/account",
                            );
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand"
                        >
                          <span className="text-lg">
                            ♙
                          </span>

                          <span>
                            My Profile
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAccountOpen(false);
                            router.push(
                              "/account/orders",
                            );
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand"
                        >
                          <span className="text-lg">
                            ▣
                          </span>

                          <span>
                            My Orders
                          </span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 p-2">
                    <button
                      type="button"
                      onClick={() => void logout()}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <span className="text-lg">
                        ↪
                      </span>

                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() =>
                setMenuOpen((open) => !open)
              }
              aria-label={
                menuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white md:hidden"
            >
              {menuOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M18 6L6 18"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen
              ? "max-h-[560px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-white/10 py-3">
            <div className="mb-2 flex items-center gap-2 px-2">
              <span className="h-px w-5 bg-accent" />

              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                Navigation
              </span>
            </div>

            {/* Main Navigation */}
            <nav
              aria-label="Mobile navigation"
              className="space-y-1"
            >
              {navLinks.map(({ label, page }) => (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    handleNavigate(page)
                  }
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold ${
                    currentPage === page
                      ? "bg-white/[0.09] text-white"
                      : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span>{label}</span>

                  <span className="text-accent">
                    →
                  </span>
                </button>
              ))}
            </nav>

            {/* Mobile Account Actions */}
            {user && (
              <div className="mt-3 border-t border-white/10 px-2 pt-3">
                {user.role === "ADMIN" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/admin");
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-white/[0.05] px-3 py-3 text-left text-xs font-semibold text-white/75 transition-colors hover:bg-white/[0.09] hover:text-white"
                  >
                    <span>
                      Admin Dashboard
                    </span>

                    <span className="text-accent">
                      →
                    </span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        router.push(
                          "/account",
                        );
                      }}
                      className="rounded-xl bg-white/[0.05] px-3 py-3 text-left text-xs font-semibold text-white/70 transition-colors hover:bg-white/[0.09] hover:text-white"
                    >
                      My Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        router.push(
                          "/account/orders",
                        );
                      }}
                      className="rounded-xl bg-white/[0.05] px-3 py-3 text-left text-xs font-semibold text-white/70 transition-colors hover:bg-white/[0.09] hover:text-white"
                    >
                      My Orders
                    </button>
                  </div>
                )}

                {/* Mobile Logout */}
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="mt-2 flex w-full items-center justify-center rounded-xl border border-red-400/20 bg-red-500/5 px-3 py-3 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/10"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Sign In */}
            {!user && (
              <div className="mt-3 border-t border-white/10 px-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/login");
                  }}
                  className="flex w-full items-center justify-between rounded-xl bg-white/[0.05] px-3 py-3 text-left text-xs font-semibold text-white/70 transition-colors hover:bg-white/[0.09] hover:text-white"
                >
                  <span>Sign in</span>

                  <span className="text-accent">
                    →
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}