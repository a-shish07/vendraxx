"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApp } from "../../../../App";
import type { Product } from "../../../../data/products";

export default function ProductDetails() {
  const id = useParams<{ id: string }>()?.id;
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!id) return;
    let active = true;
    fetch(`/api/products/${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (active) setProduct(data.product);
      })
      .catch(() => {
        if (active) setProduct(null);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [id]);
  if (!loaded)
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">
        Loading product…
      </div>
    );
  if (!product)
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">
        Product not found or unavailable.
      </div>
    );
  const isSaved = wishlist.some((item) => item.id === product.id);
  const stock = product.stock ?? 0;
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-8">
          <img
            src={product.image}
            alt={product.name}
            className="mx-auto max-h-[520px] w-full object-contain"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {product.category}
          </p>
          <h1 className="mt-3 font-display text-4xl text-brand">
            {product.name}
          </h1>
          <p className="mt-5 text-2xl font-semibold text-brand">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <p className="mt-5 leading-7 text-slate-600">{product.description}</p>
          <p className="mt-4 text-sm text-slate-500">
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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
              className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to cart
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className="rounded-xl border border-brand px-6 py-3 text-sm font-semibold text-brand hover:border-accent hover:text-accent"
            >
              {isSaved ? "Remove from wishlist" : "Save to wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
