"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useApp } from "../../../App";

type ImageItem = {
  url: string;
  publicId: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  subcategory?: string;
  shortDescription?: string;
  description: string;
  image: string;
  images?: string[];
  imagePublicIds?: string[];
  stock: number;
  lowStockThreshold: number;
  sku?: string;
  tags?: string[];
  featured: boolean;
  active: boolean;
};

type Editor = {
  name: string;
  price: string;
  compareAtPrice: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  description: string;
  stock: string;
  lowStockThreshold: string;
  sku: string;
  tags: string;
  featured: boolean;
  active: boolean;
};

type Summary = {
  total?: number;
  active?: number;
  units?: number;
  lowStock?: number;
  outOfStock?: number;
};

const blank: Editor = {
  name: "",
  price: "",
  compareAtPrice: "",
  category: "",
  subcategory: "",
  shortDescription: "",
  description: "",
  stock: "0",
  lowStockThreshold: "5",
  sku: "",
  tags: "",
  featured: false,
  active: true,
};

/* -------------------------------------------------------------------------- */
/* ICONS                                                                      */
/* -------------------------------------------------------------------------- */

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name:
    | "search"
    | "plus"
    | "box"
    | "active"
    | "stock"
    | "warning"
    | "out"
    | "edit"
    | "trash"
    | "arrow"
    | "back"
    | "filter"
    | "refresh"
    | "image"
    | "upload"
    | "check"
    | "star"
    | "close";
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "search":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "box":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="m4.5 7.5 7.5 4 7.5-4M12 11.5V21" />
        </svg>
      );

    case "active":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="m8.5 12 2.3 2.3 4.7-5" />
        </svg>
      );

    case "stock":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="M12 11v10M4.5 7.5 12 11l7.5-3.5" />
        </svg>
      );

    case "warning":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 4 21 19H3L12 4Z" />
          <path d="M12 9v4M12 16.5v.5" />
        </svg>
      );

    case "out":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="m9 9 6 6M15 9l-6 6" />
        </svg>
      );

    case "edit":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="m14 6 4 4M5 19l3.5-.8L18.5 8.2a2.1 2.1 0 0 0-3-3L5.5 15.2 5 19Z" />
        </svg>
      );

    case "trash":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M5 7h14M10 11v5M14 11v5M8 7l.5-2h7l.5 2M7 7l.7 13h8.6L17 7" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      );

    case "back":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M19 12H5" />
          <path d="m11 6-6 6 6 6" />
        </svg>
      );

    case "filter":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M20 11a8 8 0 0 0-14.7-4L4 9" />
          <path d="M4 5v4h4" />
          <path d="M4 13a8 8 0 0 0 14.7 4L20 15" />
          <path d="M20 19v-4h-4" />
        </svg>
      );

    case "image":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <circle cx="9" cy="9" r="1.5" />
          <path d="m5 17 4.5-4.5 3 3 2-2 4.5 4.5" />
        </svg>
      );

    case "upload":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 20h14" />
        </svg>
      );

    case "check":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "star":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="m12 4 2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7L12 4Z" />
        </svg>
      );

    case "close":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="m7 7 10 10M17 7 7 17" />
        </svg>
      );

    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/* FIELD                                                                      */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  required,
  hint,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#4e5664]">
          {label}

          {required && (
            <span className="ml-1 text-[#5146e5]">*</span>
          )}
        </span>

        {hint && (
          <span className="text-[10px] text-[#9ba3b0]">
            {hint}
          </span>
        )}
      </div>

      {children}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* STYLES                                                                     */
/* -------------------------------------------------------------------------- */

const inputClass =
  "h-12 w-full rounded-xl border border-[#dfe3e8] bg-white px-4 text-sm text-[#252a35] outline-none transition-all duration-300 placeholder:text-[#a1a8b4] focus:border-[#5146e5] focus:ring-4 focus:ring-[#5146e5]/10";

const selectClass =
  "h-12 w-full appearance-none rounded-xl border border-[#dfe3e8] bg-white px-4 text-sm text-[#4f5867] outline-none transition-all duration-300 focus:border-[#5146e5] focus:ring-4 focus:ring-[#5146e5]/10";

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

export default function AdminProducts() {
  const { toast } = useApp();

  /* ------------------------------ Catalogue ------------------------------ */

  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<Summary>();

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState("");
  const [active, setActive] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [categories, setCategories] = useState<string[]>([]);

  /* ------------------------------- Editor -------------------------------- */

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState("");

  const [form, setForm] = useState<Editor>(blank);
  const [images, setImages] = useState<ImageItem[]>([]);

  const [busy, setBusy] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* LOAD PRODUCTS                                                            */
  /* ------------------------------------------------------------------------ */

  async function load(nextPage = page) {
    setLoading(true);

    try {
      const qs = new URLSearchParams({
        page: String(nextPage),
        limit: "50",
      });

      if (search.trim()) {
        qs.set("search", search.trim());
      }

      if (category !== "all") {
        qs.set("category", category);
      }

      if (stock) {
        qs.set("stock", stock);
      }

      if (active) {
        qs.set("active", active);
      }

      const r = await fetch(`/api/admin/products?${qs}`, {
        cache: "no-store",
      });

      const d = await r.json();

      if (!r.ok) {
        throw new Error(d.error);
      }

      setProducts(d.products || []);
      setSummary(d.summary);
      setPages(d.pagination?.pages || 1);
      setPage(nextPage);
    } catch (e) {
      toast(
        e instanceof Error
          ? e.message
          : "Unable to load products.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* LOAD CATEGORIES                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(
          d.categories?.map(
            (c: { name: string }) => c.name,
          ) || [],
        );
      })
      .catch(() => undefined);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* FILTER WATCH                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search, category, stock, active]);

  /* ------------------------------------------------------------------------ */
  /* OPEN ADD                                                                  */
  /* ------------------------------------------------------------------------ */

  function openAdd() {
    setEditing("");
    setForm(blank);
    setImages([]);
    setEditorOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* ------------------------------------------------------------------------ */
  /* OPEN EDIT                                                                 */
  /* ------------------------------------------------------------------------ */

  function beginEdit(product: Product) {
    setEditing(product.id);

    const urls = [
      product.image,
      ...(product.images || []),
    ].filter(Boolean);

    const uniqueUrls = [...new Set(urls)];

    setImages(
      uniqueUrls.map((url, index) => ({
        url,
        publicId:
          product.imagePublicIds?.[index] || "",
      })),
    );

    setForm({
      name: product.name,
      price: String(product.price),

      compareAtPrice: product.compareAtPrice
        ? String(product.compareAtPrice)
        : "",

      category: product.category,

      subcategory:
        product.subcategory || "",

      shortDescription:
        product.shortDescription || "",

      description:
        product.description || "",

      stock: String(product.stock),

      lowStockThreshold: String(
        product.lowStockThreshold ?? 5,
      ),

      sku: product.sku || "",

      tags: (product.tags || []).join(", "),

      featured: Boolean(product.featured),

      active: product.active !== false,
    });

    setEditorOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* ------------------------------------------------------------------------ */
  /* CLOSE EDITOR                                                             */
  /* ------------------------------------------------------------------------ */

  function closeEditor() {
    setEditorOpen(false);
    setEditing("");
    setForm(blank);
    setImages([]);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* ------------------------------------------------------------------------ */
  /* IMAGE UPLOAD                                                             */
  /* ------------------------------------------------------------------------ */

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    if (images.length >= 8) {
      toast("Maximum 8 images allowed.", "error");
      return;
    }

    setBusy(true);

    try {
      const uploaded: ImageItem[] = [];

      for (const file of Array.from(files)) {
        const fd = new FormData();

        fd.set("file", file);
        fd.set("purpose", "product");

        const r = await fetch("/api/uploads", {
          method: "POST",
          body: fd,
        });

        const d = await r.json();

        if (!r.ok) {
          throw new Error(
            d.error || "Image upload failed.",
          );
        }

        uploaded.push({
          url: d.secureUrl,
          publicId: d.publicId,
        });
      }

      setImages((current) =>
        [...current, ...uploaded].slice(0, 8),
      );

      toast("Product images uploaded.");
    } catch (e) {
      toast(
        e instanceof Error
          ? e.message
          : "Unable to upload images.",
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* SAVE PRODUCT                                                             */
  /* ------------------------------------------------------------------------ */

  async function save(event: FormEvent) {
    event.preventDefault();

    setBusy(true);

    const oldImagePublicIds = editing
      ? products.find(
          (p) => p.id === editing,
        )?.imagePublicIds || []
      : [];

    try {
      const payload = {
        ...form,

        price: Number(form.price),

        compareAtPrice: form.compareAtPrice
          ? Number(form.compareAtPrice)
          : undefined,

        stock: Number(form.stock),

        lowStockThreshold: Number(
          form.lowStockThreshold,
        ),

        tags: form.tags
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),

        image: images[0]?.url || "",

        images: images.map((x) => x.url),

        imagePublicIds: images
          .map((x) => x.publicId)
          .filter(Boolean),
      };

      const r = await fetch(
        editing
          ? `/api/admin/products/${editing}`
          : "/api/admin/products",
        {
          method: editing ? "PATCH" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      const d = await r.json();

      if (!r.ok) {
        throw new Error(
          d.error || "Unable to save product.",
        );
      }

      /* Remove old Cloudinary images that are no longer retained */
      const retained = new Set(
        payload.imagePublicIds,
      );

      for (const publicId of oldImagePublicIds) {
        if (!retained.has(publicId)) {
          void fetch("/api/uploads", {
            method: "DELETE",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              publicId,
            }),
          });
        }
      }

      toast(
        editing
          ? "Product updated."
          : "Product created.",
      );

      closeEditor();

      await load(page);
    } catch (e) {
      toast(
        e instanceof Error
          ? e.message
          : "Unable to save product.",
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* DEACTIVATE                                                               */
  /* ------------------------------------------------------------------------ */

  async function deactivate(id: string) {
    if (
      !window.confirm(
        "Deactivate this product?",
      )
    ) {
      return;
    }

    try {
      const r = await fetch(
        `/api/admin/products/${id}`,
        {
          method: "DELETE",
        },
      );

      const d = await r.json();

      if (!r.ok) {
        throw new Error(d.error);
      }

      toast("Product deactivated.");

      await load(page);
    } catch (e) {
      toast(
        e instanceof Error
          ? e.message
          : "Unable to deactivate product.",
        "error",
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* STATS                                                                     */
  /* ------------------------------------------------------------------------ */

  const statCards = [
    {
      label: "Total products",
      value: summary?.total,
      icon: "box" as const,
      iconClass:
        "bg-[#f2f0ff] text-[#5146e5]",
    },

    {
      label: "Active",
      value: summary?.active,
      icon: "active" as const,
      iconClass:
        "bg-emerald-50 text-emerald-600",
    },

    {
      label: "Stock units",
      value:
        summary?.units?.toLocaleString(
          "en-IN",
        ),
      icon: "stock" as const,
      iconClass:
        "bg-[#f8f2e8] text-[#a17b3f]",
    },

    {
      label: "Low stock",
      value: summary?.lowStock,
      icon: "warning" as const,
      iconClass:
        "bg-amber-50 text-amber-600",
    },

    {
      label: "Out of stock",
      value: summary?.outOfStock,
      icon: "out" as const,
      iconClass:
        "bg-red-50 text-red-500",
    },
  ];

  /* ------------------------------------------------------------------------ */
  /* EDITOR VIEW                                                              */
  /* ------------------------------------------------------------------------ */

  if (editorOpen) {
    return (
      <main className="min-h-screen bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          {/* Editor header */}
          <div className="mb-7">
            <button
              type="button"
              onClick={closeEditor}
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#8b94a3] transition-colors hover:text-[#5146e5]"
            >
              <Icon
                name="back"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              />

              Back to products
            </button>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-[2px] w-8 rounded-full bg-[#a17b3f]" />

              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a17b3f]">
                Catalogue
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl tracking-tight text-[#25221e] sm:text-[48px]">
                  {editing
                    ? "Edit product"
                    : "Add new product"}
                </h1>

                <p className="mt-2 text-sm text-[#77716a]">
                  {editing
                    ? "Update product information, pricing, inventory and images."
                    : "Create a new product and add it to your Vendrax catalogue."}
                </p>
              </div>

              {editing && (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#f3f1ff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5146e5]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5146e5]" />
                  Editing product
                </span>
              )}
            </div>
          </div>

          <form onSubmit={save}>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

              {/* LEFT */}
              <div className="space-y-6">

                {/* Product information */}
                <section className="rounded-[24px] border border-[#dfe3e8] bg-white p-5 shadow-[0_5px_20px_rgba(30,35,45,0.03)] sm:p-7">
                  <div className="flex items-center gap-3 border-b border-[#edf0f3] pb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f1ff] text-[#5146e5]">
                      <Icon
                        name="box"
                        className="h-5 w-5"
                      />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-[#252a35]">
                        Product information
                      </h2>

                      <p className="mt-0.5 text-xs text-[#8d96a5]">
                        Basic information customers will see
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">

                    <Field
                      label="Product name"
                      required
                      className="md:col-span-2"
                    >
                      <input
                        required
                        minLength={2}
                        maxLength={160}
                        placeholder="e.g. Premium Bridal Henna Stencil"
                        value={form.name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            name: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </Field>

                    <Field
                      label="Category"
                      required
                    >
                      <select
                        required
                        value={form.category}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            category:
                              e.target.value,
                          })
                        }
                        className={selectClass}
                      >
                        <option value="">
                          Select category
                        </option>

                        {categories.map((c) => (
                          <option
                            key={c}
                            value={c}
                          >
                            {c}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Subcategory">
                      <input
                        placeholder="e.g. Bridal"
                        value={form.subcategory}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            subcategory:
                              e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </Field>

                    <Field label="SKU">
                      <input
                        placeholder="e.g. VDX-HEN-001"
                        value={form.sku}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            sku: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Tags">
                      <input
                        placeholder="bridal, henna, stencil"
                        value={form.tags}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            tags: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </Field>

                    <Field
                      label="Short description"
                      hint="Maximum 500 characters"
                      className="md:col-span-2"
                    >
                      <input
                        maxLength={500}
                        placeholder="A short description of the product..."
                        value={
                          form.shortDescription
                        }
                        onChange={(e) =>
                          setForm({
                            ...form,
                            shortDescription:
                              e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </Field>

                    <Field
                      label="Full description"
                      hint="Maximum 10,000 characters"
                      className="md:col-span-2"
                    >
                      <textarea
                        maxLength={10000}
                        placeholder="Describe the product in detail..."
                        value={form.description}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            description:
                              e.target.value,
                          })
                        }
                        className={`${inputClass} min-h-[190px] resize-y py-3`}
                      />
                    </Field>
                  </div>
                </section>

                {/* Pricing */}
                <section className="rounded-[24px] border border-[#dfe3e8] bg-white p-5 shadow-[0_5px_20px_rgba(30,35,45,0.03)] sm:p-7">
                  <div className="flex items-center gap-3 border-b border-[#edf0f3] pb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8f2e8] text-[#a17b3f]">
                      <span className="text-lg font-bold">
                        ₹
                      </span>
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-[#252a35]">
                        Pricing & inventory
                      </h2>

                      <p className="mt-0.5 text-xs text-[#8d96a5]">
                        Set pricing and available stock
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">

                    <Field
                      label="Price"
                      required
                    >
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8e97a6]">
                          ₹
                        </span>

                        <input
                          required
                          min="0"
                          step="0.01"
                          type="number"
                          placeholder="0.00"
                          value={form.price}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              price:
                                e.target.value,
                            })
                          }
                          className={`${inputClass} pl-9`}
                        />
                      </div>
                    </Field>

                    <Field label="Compare-at price">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8e97a6]">
                          ₹
                        </span>

                        <input
                          min="0"
                          step="0.01"
                          type="number"
                          placeholder="Optional"
                          value={
                            form.compareAtPrice
                          }
                          onChange={(e) =>
                            setForm({
                              ...form,
                              compareAtPrice:
                                e.target.value,
                            })
                          }
                          className={`${inputClass} pl-9`}
                        />
                      </div>
                    </Field>

                    <Field
                      label="Stock quantity"
                      required
                    >
                      <input
                        required
                        min="0"
                        step="1"
                        type="number"
                        placeholder="0"
                        value={form.stock}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            stock:
                              e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </Field>

                    <Field
                      label="Low stock threshold"
                      required
                      hint="Alert quantity"
                    >
                      <input
                        required
                        min="0"
                        step="1"
                        type="number"
                        placeholder="5"
                        value={
                          form.lowStockThreshold
                        }
                        onChange={(e) =>
                          setForm({
                            ...form,
                            lowStockThreshold:
                              e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </section>

                {/* Images */}
                <section className="rounded-[24px] border border-[#dfe3e8] bg-white p-5 shadow-[0_5px_20px_rgba(30,35,45,0.03)] sm:p-7">
                  <div className="flex items-center justify-between gap-4 border-b border-[#edf0f3] pb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f1ff] text-[#5146e5]">
                        <Icon
                          name="image"
                          className="h-5 w-5"
                        />
                      </div>

                      <div>
                        <h2 className="text-base font-bold text-[#252a35]">
                          Product images
                        </h2>

                        <p className="mt-0.5 text-xs text-[#8d96a5]">
                          Upload up to 8 images
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-[#f3f1ff] px-3 py-1 text-[10px] font-bold text-[#5146e5]">
                      {images.length}/8
                    </span>
                  </div>

                  <label
                    className={`mt-6 flex min-h-[165px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d9dde4] bg-[#fafbfc] px-5 text-center transition-all duration-300 hover:border-[#5146e5] hover:bg-[#f8f7ff] ${
                      busy || images.length >= 8
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0efff] text-[#5146e5]">
                      <Icon
                        name="upload"
                        className="h-5 w-5"
                      />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[#505967]">
                      Click to upload product images
                    </p>

                    <p className="mt-1 text-xs text-[#9ba3b0]">
                      JPG, PNG, WEBP or AVIF · Maximum 8 images
                    </p>

                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={
                        busy ||
                        images.length >= 8
                      }
                      onChange={(e) => {
                        void uploadFiles(
                          e.target.files,
                        );

                        e.currentTarget.value =
                          "";
                      }}
                      className="hidden"
                    />
                  </label>

                  {images.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {images.map(
                        (image, index) => (
                          <div
                            key={`${image.url}-${index}`}
                            className={`group rounded-2xl border bg-[#fafbfc] p-2 ${
                              index === 0
                                ? "border-[#a17b3f] ring-1 ring-[#a17b3f]/20"
                                : "border-[#e3e6eb]"
                            }`}
                          >
                            <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                              <img
                                src={image.url}
                                alt=""
                                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                              />

                              {index === 0 && (
                                <span className="absolute left-2 top-2 rounded-full bg-[#25221e] px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[#d8b36a]">
                                  Primary
                                </span>
                              )}
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <button
                                type="button"
                                disabled={!index}
                                onClick={() => {
                                  const next = [
                                    ...images,
                                  ];

                                  [
                                    next[
                                      index - 1
                                    ],
                                    next[index],
                                  ] = [
                                    next[index],
                                    next[
                                      index - 1
                                    ],
                                  ];

                                  setImages(
                                    next,
                                  );
                                }}
                                className="rounded-lg px-2 py-1 text-xs font-bold text-[#5146e5] transition hover:bg-[#f0efff] disabled:opacity-20"
                              >
                                ←
                              </button>

                              <span className="text-[9px] font-bold text-[#9ca4b0]">
                                {index + 1}
                              </span>

                              <button
                                type="button"
                                disabled={
                                  index ===
                                  images.length -
                                    1
                                }
                                onClick={() => {
                                  const next = [
                                    ...images,
                                  ];

                                  [
                                    next[index],
                                    next[
                                      index + 1
                                    ],
                                  ] = [
                                    next[
                                      index + 1
                                    ],
                                    next[index],
                                  ];

                                  setImages(
                                    next,
                                  );
                                }}
                                className="rounded-lg px-2 py-1 text-xs font-bold text-[#5146e5] transition hover:bg-[#f0efff] disabled:opacity-20"
                              >
                                →
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setImages(
                                    (
                                      current,
                                    ) =>
                                      current.filter(
                                        (
                                          _,
                                          i,
                                        ) =>
                                          i !==
                                          index,
                                      ),
                                  )
                                }
                                className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
                              >
                                <Icon
                                  name="trash"
                                  className="h-3.5 w-3.5"
                                />
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </section>
              </div>

              {/* RIGHT */}
              <aside className="space-y-6">

                {/* Status */}
                <section className="rounded-[24px] border border-[#dfe3e8] bg-white p-6 shadow-[0_5px_20px_rgba(30,35,45,0.03)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#252a35] text-[#d8b36a]">
                      <Icon
                        name="check"
                        className="h-5 w-5"
                      />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-[#252a35]">
                        Product status
                      </h2>

                      <p className="mt-0.5 text-xs text-[#8d96a5]">
                        Control product visibility
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">

                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e3e6eb] bg-[#fafbfc] p-4 transition hover:border-[#c9cdd5]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f8f2e8] text-[#a17b3f]">
                          <Icon
                            name="star"
                            className="h-4 w-4"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[#424b59]">
                            Featured
                          </p>

                          <p className="text-[11px] text-[#929baa]">
                            Highlight this product
                          </p>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            featured:
                              e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-[#5146e5]"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e3e6eb] bg-[#fafbfc] p-4 transition hover:border-[#c9cdd5]">
                      <div>
                        <p className="text-sm font-semibold text-[#424b59]">
                          Active
                        </p>

                        <p className="text-[11px] text-[#929baa]">
                          Visible in the store
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            active:
                              e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-[#5146e5]"
                      />
                    </label>
                  </div>
                </section>

                {/* Preview */}
                <section className="overflow-hidden rounded-[24px] bg-[#25221e] p-6 text-white shadow-[0_15px_35px_rgba(37,34,30,0.12)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d8b36a]">
                    Product preview
                  </p>

                  <div className="mt-5 overflow-hidden rounded-2xl bg-white">
                    <div className="aspect-square">
                      {images[0]?.url ? (
                        <img
                          src={images[0].url}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#fafbfc] text-[#c8cdd4]">
                          <Icon
                            name="image"
                            className="h-12 w-12"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-5 truncate text-base font-semibold">
                    {form.name ||
                      "Product name"}
                  </p>

                  <p className="mt-1 text-sm text-white/45">
                    {form.category ||
                      "Category"}
                  </p>

                  <p className="mt-3 text-lg font-semibold text-[#d8b36a]">
                    {form.price
                      ? `₹${Number(
                          form.price,
                        ).toLocaleString(
                          "en-IN",
                        )}`
                      : "₹0"}
                  </p>
                </section>

                {/* Actions */}
                <section className="rounded-[24px] border border-[#dfe3e8] bg-white p-6 shadow-[0_5px_20px_rgba(30,35,45,0.03)]">
                  <button
                    type="submit"
                    disabled={busy}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#5146e5] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(81,70,229,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4338ca] hover:shadow-[0_12px_28px_rgba(81,70,229,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        {editing
                          ? "Saving changes..."
                          : "Creating product..."}
                      </>
                    ) : (
                      <>
                        <Icon
                          name={
                            editing
                              ? "check"
                              : "plus"
                          }
                          className="h-4 w-4"
                        />

                        {editing
                          ? "Save changes"
                          : "Create product"}

                        <Icon
                          name="arrow"
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={closeEditor}
                    className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#dfe3e8] px-5 py-3.5 text-sm font-semibold text-[#66707e] transition-all duration-300 hover:border-[#c9cdd5] hover:bg-[#fafbfc] hover:text-[#424b59]"
                  >
                    Cancel
                  </button>
                </section>
              </aside>
            </div>
          </form>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* CATALOGUE VIEW                                                           */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 rounded-full bg-[#a17b3f]" />

              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a17b3f]">
                Catalogue
              </p>
            </div>

            <h1 className="mt-2 font-display text-4xl tracking-tight text-[#25221e] sm:text-[46px]">
              Products
            </h1>

            <p className="mt-2 max-w-xl text-sm text-[#77716a]">
              Manage products, pricing, images, categories and inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="group inline-flex w-fit items-center gap-2 rounded-xl bg-[#5146e5] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(81,70,229,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4338ca] hover:shadow-[0_12px_28px_rgba(81,70,229,0.25)]"
          >
            <Icon
              name="plus"
              className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
            />

            Add new product

            <Icon
              name="arrow"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </section>

        {/* Stats */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl border border-[#dfe3e8] bg-white p-5 shadow-[0_3px_12px_rgba(30,35,45,0.025)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9cdd5] hover:shadow-[0_12px_28px_rgba(30,35,45,0.07)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8791a4]">
                    {card.label}
                  </p>

                  {loading ? (
                    <div className="mt-4 h-8 w-20 animate-pulse rounded-lg bg-[#eef0f4]" />
                  ) : (
                    <p className="mt-3 text-3xl font-bold tracking-tight text-[#252a35]">
                      {card.value ?? 0}
                    </p>
                  )}
                </div>

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${card.iconClass}`}
                >
                  <Icon
                    name={card.icon}
                    className="h-5 w-5"
                  />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#a17b3f] transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          ))}
        </section>

        {/* Filters */}
        <section className="mt-7 rounded-2xl border border-[#dfe3e8] bg-white p-4 shadow-[0_3px_12px_rgba(30,35,45,0.025)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f0ff] text-[#5146e5]">
                <Icon
                  name="filter"
                  className="h-4 w-4"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#252a35]">
                  Product catalogue
                </p>

                <p className="text-xs text-[#8992a2]">
                  Search and filter your products
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void load(page)}
              disabled={loading}
              className="hidden items-center gap-2 rounded-lg border border-[#e0e3e8] px-3 py-2 text-xs font-semibold text-[#667085] transition hover:border-[#5146e5] hover:text-[#5146e5] disabled:opacity-40 sm:flex"
            >
              <Icon
                name="refresh"
                className={`h-3.5 w-3.5 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(300px,1fr)_200px_180px_180px]">
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e97a7]"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search product, SKU, category..."
                className="h-12 w-full rounded-xl border border-[#dfe3e8] bg-white pl-11 pr-4 text-sm text-[#252a35] outline-none transition-all duration-300 placeholder:text-[#9ba3b1] focus:border-[#5146e5] focus:ring-4 focus:ring-[#5146e5]/10"
              />
            </div>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="h-12 rounded-xl border border-[#dfe3e8] bg-white px-4 text-sm text-[#4d5665] outline-none transition-all duration-300 focus:border-[#5146e5] focus:ring-4 focus:ring-[#5146e5]/10"
            >
              <option value="all">
                All categories
              </option>

              {categories.map((c) => (
                <option
                  key={c}
                  value={c}
                >
                  {c}
                </option>
              ))}
            </select>

            <select
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
              className="h-12 rounded-xl border border-[#dfe3e8] bg-white px-4 text-sm text-[#4d5665] outline-none transition-all duration-300 focus:border-[#5146e5] focus:ring-4 focus:ring-[#5146e5]/10"
            >
              <option value="">
                All stock
              </option>

              <option value="low">
                Low stock
              </option>

              <option value="out">
                Out of stock
              </option>

              <option value="healthy">
                Healthy stock
              </option>
            </select>

            <select
              value={active}
              onChange={(e) =>
                setActive(e.target.value)
              }
              className="h-12 rounded-xl border border-[#dfe3e8] bg-white px-4 text-sm text-[#4d5665] outline-none transition-all duration-300 focus:border-[#5146e5] focus:ring-4 focus:ring-[#5146e5]/10"
            >
              <option value="">
                All status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </section>

        {/* Product table */}
        <section className="mt-4 overflow-hidden rounded-2xl border border-[#dfe3e8] bg-white shadow-[0_3px_12px_rgba(30,35,45,0.025)]">

          {/* Table header */}
          <div className="hidden grid-cols-[2fr_1fr_.8fr_.7fr_.8fr_1fr] gap-4 border-b border-[#e8ebef] bg-[#fafbfc] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b95a6] md:grid">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {loading ? (
            <div>
              {Array.from({
                length: 7,
              }).map((_, index) => (
                <div
                  key={index}
                  className="flex gap-4 border-b border-[#edf0f3] p-5 last:border-0"
                >
                  <div className="h-12 w-12 animate-pulse rounded-xl bg-[#eef0f4]" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-[#eef0f4]" />

                    <div className="h-3 w-28 animate-pulse rounded bg-[#f3f4f6]" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f1f0ff] text-[#5146e5]">
                <Icon
                  name="box"
                  className="h-7 w-7"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#252a35]">
                No products found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#8992a2]">
                No products match your current search or filters.
              </p>

              <button
                type="button"
                onClick={openAdd}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5146e5] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4338ca]"
              >
                <Icon
                  name="plus"
                  className="h-4 w-4"
                />

                Add new product
              </button>
            </div>
          ) : (
            products.map((p) => {
              const low =
                p.stock > 0 &&
                p.stock <=
                  p.lowStockThreshold;

              return (
                <div
                  key={p.id}
                  className="group grid gap-4 border-b border-[#edf0f3] p-4 transition-colors duration-200 last:border-0 hover:bg-[#fafbfc] md:grid-cols-[2fr_1fr_.8fr_.7fr_.8fr_1fr] md:items-center md:px-5"
                >
                  {/* Product */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#e7e9ed] bg-[#fafbfc]">
                      <img
                        src={
                          p.image ||
                          "/placeholder-product.svg"
                        }
                        alt=""
                        className="h-full w-full object-contain p-1 transition-transform duration-500 group-hover:scale-110"
                      />

                      {p.featured && (
                        <span className="absolute left-1 top-1 rounded-full bg-[#25221e] px-1.5 py-0.5 text-[7px] font-bold text-[#d8b36a]">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#252a35]">
                        {p.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#929baa]">
                        {p.sku ||
                          "No SKU"}

                        {p.subcategory
                          ? ` · ${p.subcategory}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <span className="mr-1 text-[10px] font-semibold text-[#9aa2b0] md:hidden">
                      Category:
                    </span>

                    <span className="text-sm text-[#5f6877]">
                      {p.category}
                    </span>
                  </div>

                  {/* Price */}
                  <div>
                    <span className="mr-1 text-[10px] font-semibold text-[#9aa2b0] md:hidden">
                      Price:
                    </span>

                    <span className="font-semibold text-[#252a35]">
                      ₹
                      {p.price.toLocaleString(
                        "en-IN",
                      )}
                    </span>

                    {p.compareAtPrice &&
                      p.compareAtPrice >
                        p.price && (
                        <span className="ml-2 text-xs text-[#a2a8b2] line-through">
                          ₹
                          {p.compareAtPrice.toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      )}
                  </div>

                  {/* Stock */}
                  <div>
                    <span className="mr-1 text-[10px] font-semibold text-[#9aa2b0] md:hidden">
                      Stock:
                    </span>

                    <span
                      className={`text-sm font-semibold ${
                        p.stock === 0
                          ? "text-red-600"
                          : low
                            ? "text-amber-600"
                            : "text-[#424a58]"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        p.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-[#f1f2f4] text-[#7d8592]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          p.active
                            ? "bg-emerald-500"
                            : "bg-[#9ba1aa]"
                        }`}
                      />

                      {p.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        beginEdit(p)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#e0e3e8] bg-white px-3 py-2 text-xs font-semibold text-[#525b69] transition-all duration-300 hover:border-[#5146e5] hover:bg-[#f4f3ff] hover:text-[#5146e5]"
                    >
                      <Icon
                        name="edit"
                        className="h-3.5 w-3.5"
                      />

                      Edit
                    </button>

                    {p.active && (
                      <button
                        type="button"
                        onClick={() =>
                          void deactivate(
                            p.id,
                          )
                        }
                        title="Deactivate product"
                        className="inline-flex items-center justify-center rounded-lg border border-red-100 bg-red-50 p-2 text-red-600 transition-all duration-300 hover:bg-red-100"
                      >
                        <Icon
                          name="trash"
                          className="h-3.5 w-3.5"
                        />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Pagination */}
        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#dfe3e8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#8c95a4]">
            Page{" "}
            <span className="font-semibold text-[#4c5563]">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#4c5563]">
              {pages}
            </span>

            <span className="mx-2 text-[#d6d9df]">
              ·
            </span>

            50 per page
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={
                page <= 1 || loading
              }
              onClick={() =>
                void load(page - 1)
              }
              className="rounded-xl border border-[#dfe3e8] bg-white px-4 py-2.5 text-xs font-semibold text-[#687181] transition hover:border-[#5146e5] hover:text-[#5146e5] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                page >= pages || loading
              }
              onClick={() =>
                void load(page + 1)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#252a35] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5146e5] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next

              <Icon
                name="arrow"
                className="h-3.5 w-3.5"
              />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}