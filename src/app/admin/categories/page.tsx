"use client";

import { useEffect, useState } from "react";
import { useApp } from "../../../App";

type Category = {
  name: string;
  count: number;
  subcategories: string[];
};

function Icon({
  name,
  className = "",
}: {
  name: "grid" | "package" | "chevron" | "layers";
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "grid") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    );
  }

  if (name === "package") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="m21 8-9-5-9 5 9 5 9-5Z" />
        <path d="M3 8v9l9 5 9-5V8" />
        <path d="M12 13v9" />
      </svg>
    );
  }

  if (name === "layers") {
    return (
      <svg viewBox="0 0 24 24" className={className} {...common}>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} {...common}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export default function AdminCategories() {
  const { toast } = useApp();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories", { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();

        if (!r.ok) throw new Error(d.error);

        setCategories(d.categories || []);
      })
      .catch((e) =>
        toast(
          e instanceof Error ? e.message : "Unable to load categories.",
          "error",
        ),
      )
      .finally(() => setLoading(false));
  }, [toast]);

  const totalProducts = categories.reduce(
    (sum, category) => sum + category.count,
    0,
  );

  const totalSubcategories = categories.reduce(
    (sum, category) => sum + category.subcategories.length,
    0,
  );

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5146e5]">
            Catalogue structure
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#25221e] sm:text-4xl">
            Categories
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#77716a]">
            Categories and subcategories are derived from active product
            records.
          </p>
        </div>

        {!loading && categories.length > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-[#e5e1da] bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f4ff] text-[#5146e5]">
              <Icon name="grid" className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9a938b]">
                Categories
              </p>

              <p className="text-lg font-bold text-[#292621]">
                {categories.length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Overview */}
      {!loading && categories.length > 0 && (
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e5e1da] bg-white p-5 shadow-[0_7px_25px_rgba(35,32,27,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9a938b]">
                  Main categories
                </p>

                <p className="mt-2 text-2xl font-bold text-[#292621]">
                  {categories.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f4ff] text-[#5146e5]">
                <Icon name="grid" className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5e1da] bg-white p-5 shadow-[0_7px_25px_rgba(35,32,27,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9a938b]">
                  Subcategories
                </p>

                <p className="mt-2 text-2xl font-bold text-[#292621]">
                  {totalSubcategories}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f1eb] text-[#a17b3f]">
                <Icon name="layers" className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5e1da] bg-white p-5 shadow-[0_7px_25px_rgba(35,32,27,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9a938b]">
                  Active products
                </p>

                <p className="mt-2 text-2xl font-bold text-[#292621]">
                  {totalProducts.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon name="package" className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-[#e5e1da] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-8 w-12 animate-pulse rounded-full bg-slate-100" />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <span
                    key={j}
                    className="h-7 w-20 animate-pulse rounded-full bg-slate-100"
                  />
                ))}
              </div>
            </div>
          ))
        ) : categories.length ? (
          categories.map((c, index) => (
            <div
              key={c.name}
              className="group relative overflow-hidden rounded-3xl border border-[#e4e0d9] bg-white p-5 shadow-[0_8px_30px_rgba(35,32,27,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_38px_rgba(35,32,27,0.08)]"
            >
              {/* Top accent */}
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#5146e5] transition-transform duration-500 group-hover:scale-x-100" />

              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f1f4ff] text-[#5146e5] transition-all duration-300 group-hover:bg-[#5146e5] group-hover:text-white">
                    <Icon name="grid" className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa49d]">
                      Category {String(index + 1).padStart(2, "0")}
                    </p>

                    <h2 className="mt-0.5 truncate text-base font-bold text-[#292621]">
                      {c.name}
                    </h2>
                  </div>
                </div>

                <div className="shrink-0 rounded-full bg-[#f5f1eb] px-3 py-1.5 text-xs font-bold text-[#a17b3f]">
                  {c.count}
                </div>
              </div>

              <div className="mt-5 border-t border-[#eeeae4] pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9a938b]">
                    Subcategories
                  </p>

                  {c.subcategories.length > 0 && (
                    <span className="text-[10px] font-semibold text-[#aaa49d]">
                      {c.subcategories.length}
                    </span>
                  )}
                </div>

                {c.subcategories.length ? (
                  <div className="flex flex-wrap gap-2">
                    {c.subcategories.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e5df] bg-[#faf9f7] px-3 py-1.5 text-[11px] font-medium text-[#655f58] transition-all duration-300 hover:border-[#d8d0c5] hover:bg-[#f5f1eb] hover:text-[#514b44]"
                      >
                        <span className="h-1 w-1 rounded-full bg-[#b28b52]" />
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-[#faf9f7] px-3 py-3">
                    <p className="text-xs text-[#9a938b]">
                      No subcategories
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-[#e4e0d9] bg-white px-6 py-16 text-center shadow-sm sm:col-span-2 lg:col-span-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Icon name="grid" className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-sm font-bold text-[#292621]">
              No active product categories
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8a837b]">
              Categories will appear here once active products have been
              assigned to them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}