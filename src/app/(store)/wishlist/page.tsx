"use client";

import Link from "next/link";
import { useApp } from "../../../App";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useApp();

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Subtle background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#d8b36a]/10 blur-3xl" />
        <div className="absolute -right-40 top-[45%] h-96 w-96 rounded-full bg-[#b28b52]/[0.07] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-[#e5ded4] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#b28b52]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a17b3f]">
                Saved items
              </p>
            </div>

            <h1 className="mt-3 font-display text-4xl font-normal tracking-tight text-[#24211d] sm:text-5xl">
              Your wishlist
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#77716a]">
              The pieces you love, saved for whenever you&apos;re ready.
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

        {/* Empty state */}
        {wishlist.length === 0 ? (
          <div className="mx-auto mt-12 max-w-xl">
            <div className="relative overflow-hidden rounded-[28px] border border-[#e5ded4] bg-white px-6 py-16 text-center shadow-[0_20px_60px_rgba(48,39,28,0.06)] sm:px-10">
              {/* Decorative circle */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d9c49e] bg-[#faf7f0]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-7 w-7 text-[#b28b52]"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a17b3f]">
                Nothing saved yet
              </p>

              <h2 className="mt-2 font-display text-2xl text-[#292621]">
                Your wishlist is waiting
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#77716a]">
                Save your favourite pieces here and come back to them whenever
                you&apos;re ready.
              </p>

              <Link
                href="/products"
                className="group relative mt-7 inline-flex h-11 items-center justify-center overflow-hidden rounded-xl bg-[#25221e] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a17b3f] hover:shadow-[0_12px_25px_rgba(161,123,63,0.2)]"
              >
                <span className="relative z-10">Explore products</span>

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Item count */}
            <div className="mt-7 flex items-center justify-between">
              <p className="text-xs text-[#8a837b]">
                <span className="font-semibold text-[#514b44]">
                  {wishlist.length}
                </span>{" "}
                {wishlist.length === 1 ? "item" : "items"} saved
              </p>

              <div className="h-px flex-1 bg-[#e8e2da] ml-5" />
            </div>

            {/* Products */}
            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4 lg:gap-x-6">
              {wishlist.map((product) => {
                const stock = product.stock ?? 0;

                return (
                  <article
                    key={product.id}
                    className="group relative overflow-hidden rounded-[20px] border border-[#e5ded4] bg-white shadow-[0_8px_30px_rgba(48,39,28,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(48,39,28,0.10)]"
                  >
                    {/* Product image */}
                    <Link
                      href={`/products/${product.slug || product.id}`}
                      className="block"
                    >
                      <div className="relative overflow-hidden bg-[#f7f5f1]">
                        <div className="flex h-48 items-center justify-center p-5 sm:h-60 sm:p-7">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                          />
                        </div>

                        {/* Image overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {/* Wishlist indicator */}
                        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#a17b3f] shadow-sm backdrop-blur-sm">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </div>

                        {/* Stock badge */}
                        {stock < 1 && (
                          <div className="absolute bottom-3 left-3 rounded-full bg-[#25221e]/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                            Unavailable
                          </div>
                        )}
                      </div>

                      {/* Product information */}
                      <div className="p-4 pb-2 sm:p-5 sm:pb-3">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#a17b3f]">
                          {product.category}
                        </p>

                        <h2 className="mt-2 line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-[#292621] transition-colors duration-300 group-hover:text-[#a17b3f] sm:text-[15px]">
                          {product.name}
                        </h2>

                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-[#25221e]">
                            ₹{product.price.toLocaleString("en-IN")}
                          </p>

                          {stock > 0 && (
                            <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#8d877f]">
                              In stock
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Actions */}
                    <div className="flex gap-2 p-4 pt-3 sm:p-5 sm:pt-3">
                      <button
                        disabled={stock < 1}
                        onClick={() =>
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            category: product.category,
                          })
                        }
                        className="group/cart relative h-10 flex-1 overflow-hidden rounded-xl bg-[#25221e] px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:bg-[#a17b3f] hover:shadow-[0_8px_20px_rgba(161,123,63,0.18)] disabled:cursor-not-allowed disabled:bg-[#dedad4] disabled:text-[#8f8981] disabled:shadow-none"
                      >
                        <span className="relative z-10">
                          {stock > 0 ? "Add to cart" : "Unavailable"}
                        </span>

                        {stock > 0 && (
                          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover/cart:translate-x-full" />
                        )}
                      </button>

                      <button
                        onClick={() => toggleWishlist(product)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="group/remove flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ded8cf] bg-white text-[#77716a] transition-all duration-300 hover:border-[#c9b08a] hover:bg-[#faf7f0] hover:text-[#a17b3f]"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-4 w-4 transition-transform duration-300 group-hover/remove:scale-110"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}