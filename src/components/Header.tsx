'use client'


import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../App'
import Logo from './Logo'
import type { Page } from '../App'

const navLinks: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Products', page: 'products' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
]

export default function Header() {
  const { currentPage, navigate, cartCount, user, wishlist } = useApp()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  /*
   * Close mobile menu when the viewport moves to desktop.
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  /*
   * Prevent body scrolling while mobile menu is open.
   */
  useEffect(() => {
    if (!menuOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [menuOpen])

  const handleNavigate = (page: Page) => {
    navigate(page)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            DESKTOP / MAIN HEADER
        ====================================================== */}
        <div className="flex h-16 items-center justify-between">

          {/* ---------------------------------------------------
              LOGO
          ---------------------------------------------------- */}
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            aria-label="Go to homepage"
            className="shrink-0 transition-opacity duration-200 hover:opacity-85"
          >
            <Logo variant="light" size="sm" />
          </button>

          {/* ---------------------------------------------------
              DESKTOP NAVIGATION
          ---------------------------------------------------- */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map(({ label, page }) => {
              const active = currentPage === page

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => handleNavigate(page)}
                  className={`
                    group
                    relative
                    rounded-lg
                    px-4
                    py-2.5
                    text-xs
                    font-semibold
                    transition-colors
                    duration-200
                    ${
                      active
                        ? 'text-white'
                        : 'text-white/55 hover:text-white'
                    }
                  `}
                >
                  {label}

                  {/* Active / hover underline */}
                  <span
                    className={`
                      absolute
                      bottom-1
                      left-1/2
                      h-px
                      -translate-x-1/2
                      bg-accent
                      transition-all
                      duration-200
                      ${
                        active
                          ? 'w-5 opacity-100'
                          : 'w-0 opacity-0 group-hover:w-5 group-hover:opacity-100'
                      }
                    `}
                  />
                </button>
              )
            })}
          </nav>

          {/* ---------------------------------------------------
              RIGHT ACTIONS
          ---------------------------------------------------- */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            <button type="button" onClick={() => router.push('/wishlist')} aria-label={`Wishlist${wishlist.length ? `, ${wishlist.length} items` : ''}`} className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 00-.1-7.8z"/></svg>
              {wishlist.length > 0 && <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white ring-2 ring-brand">{wishlist.length > 99 ? '99+' : wishlist.length}</span>}
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => handleNavigate('cart')}
              aria-label={`Cart${
                cartCount > 0 ? `, ${cartCount} items` : ''
              }`}
              className="
                group
                relative
                flex
                h-10
                items-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-white/[0.04]
                px-2.5
                text-white/65
                transition-all
                duration-200
                hover:border-white/20
                hover:bg-white/[0.08]
                hover:text-white
                sm:px-3
              "
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
                <span
                  className="
                    absolute
                    -right-1.5
                    -top-1.5
                    flex
                    min-h-[18px]
                    min-w-[18px]
                    items-center
                    justify-center
                    rounded-full
                    bg-accent
                    px-1
                    text-[9px]
                    font-bold
                    leading-none
                    text-white
                    ring-2
                    ring-brand
                  "
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              type="button"
              onClick={() => router.push(user ? '/account' : '/login')}
              aria-label={user ? 'My account' : 'Sign in'}
              className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 text-white/65 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
                <circle cx="12" cy="8" r="3.5"/><path strokeLinecap="round" d="M5 20c.9-3.3 3.2-5 7-5s6.1 1.7 7 5"/>
              </svg>
              <span className="hidden text-xs font-semibold sm:block">{user ? 'Account' : 'Sign in'}</span>
            </button>

            {/* -------------------------------------------------
                MOBILE MENU BUTTON
            -------------------------------------------------- */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={
                menuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={menuOpen}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.04]
                text-white/65
                transition-all
                duration-200
                hover:border-white/20
                hover:bg-white/[0.08]
                hover:text-white
                md:hidden
              "
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

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}
        <div
          className={`
            overflow-hidden
            transition-all
            duration-300
            md:hidden
            ${
              menuOpen
                ? 'max-h-[420px] opacity-100'
                : 'max-h-0 opacity-0'
            }
          `}
        >
          <div className="border-t border-white/10 py-3">

            {/* Small menu label */}
            <div className="mb-2 flex items-center gap-2 px-2">
              <span className="h-px w-5 bg-accent" />

              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                Navigation
              </span>
            </div>

            {/* Links */}
            <nav aria-label="Mobile navigation" className="space-y-1">
              {navLinks.map(({ label, page }) => {
                const active = currentPage === page

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handleNavigate(page)}
                    className={`
                      group
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      px-3.5
                      py-3
                      text-left
                      text-sm
                      font-semibold
                      transition-all
                      duration-200
                      ${
                        active
                          ? 'bg-white/[0.09] text-white'
                          : 'text-white/55 hover:bg-white/[0.05] hover:text-white'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`
                          h-1.5
                          w-1.5
                          rounded-full
                          transition-all
                          ${
                            active
                              ? 'bg-accent'
                              : 'bg-white/20 group-hover:bg-white/50'
                          }
                        `}
                      />

                      {label}
                    </span>

                    <svg
                      className={`
                        h-3.5
                        w-3.5
                        transition-all
                        duration-200
                        ${
                          active
                            ? 'text-accent'
                            : 'text-white/20 group-hover:translate-x-0.5 group-hover:text-white/50'
                        }
                      `}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>
                  </button>
                )
              })}
            </nav>

            {/* Mobile menu footer */}
            <div className="mt-3 flex items-center justify-between border-t border-white/10 px-2 pt-3">
              <span className="text-[9px] text-white/30">
                Premium shopping, simply delivered.
              </span>

              <button
                type="button"
                onClick={() => handleNavigate('cart')}
                className="text-[10px] font-semibold text-accent transition-colors hover:text-white"
              >
                View Cart →
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
