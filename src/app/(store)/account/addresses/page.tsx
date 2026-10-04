"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../../../App";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

const empty: Omit<Address, "id"> = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
};

export default function AddressesPage() {
  const { user, authLoading, toast } = useApp();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=/account/addresses");
      return;
    }

    if (user) load();
  }, [user, authLoading, router]);

  async function load() {
    try {
      const r = await fetch("/api/addresses", { cache: "no-store" });
      const d = await r.json();

      if (!r.ok) throw new Error(d.error);

      setAddresses(d.addresses || []);
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to load addresses.",
        "error",
      );
    }
  }

  if (authLoading || !user)
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ded8cf] border-t-[#a17b3f]" />
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#8a837b]">
            Loading addresses
          </p>
        </div>
      </main>
    );

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);

    try {
      const r = await fetch("/api/addresses", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...(editing ? { id: editing } : {}),
        }),
      });

      const d = await r.json();

      if (!r.ok) throw new Error(d.error);

      setForm(empty);
      setEditing("");

      await load();

      toast(editing ? "Address updated." : "Address saved.");
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to save address.",
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    try {
      const r = await fetch(
        `/api/addresses?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      const d = await r.json();

      if (!r.ok) throw new Error(d.error);

      await load();
      toast("Address deleted.");
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to delete address.",
        "error",
      );
    }
  }

  const fields = (
    [
      ["fullName", "Full name"],
      ["phone", "Phone"],
      ["addressLine1", "Address line 1"],
      ["addressLine2", "Address line 2"],
      ["landmark", "Landmark"],
      ["city", "City"],
      ["state", "State"],
      ["pincode", "Pincode"],
      ["country", "Country"],
    ] as const
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {/* Header */}
        <div className="border-b border-[#e8e2da] pb-7">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#b28b52]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a17b3f]">
              Account
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-4xl font-normal tracking-tight text-[#24211d] sm:text-5xl">
                Address book
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#77716a]">
                Manage your delivery addresses for a faster checkout.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditing("");
                setForm(empty);
              }}
              className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#514b44] transition-colors duration-300 hover:text-[#a17b3f]"
            >
              <span className="text-lg leading-none transition-transform duration-300 group-hover:rotate-90">
                +
              </span>
              Add new address
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Address form */}
          <form
            onSubmit={save}
            className="rounded-[24px] border border-[#e5ded4] bg-white p-6 shadow-[0_10px_35px_rgba(48,39,28,0.045)] transition-shadow duration-500 hover:shadow-[0_16px_45px_rgba(48,39,28,0.07)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a17b3f]">
                  {editing ? "Update details" : "Delivery details"}
                </p>

                <h2 className="mt-1.5 font-display text-2xl text-[#292621]">
                  {editing ? "Edit address" : "Add a delivery address"}
                </h2>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#faf7f0] text-[#a17b3f]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {fields.map(([key, label]) => {
                const required = [
                  "fullName",
                  "phone",
                  "addressLine1",
                  "city",
                  "state",
                  "pincode",
                ].includes(key);

                return (
                  <label
                    key={key}
                    className={`block ${
                      key === "addressLine1" || key === "addressLine2"
                        ? "sm:col-span-2"
                        : ""
                    }`}
                  >
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#514b44]">
                      {label}
                      {required && (
                        <span className="ml-1 text-[#b28b52]">*</span>
                      )}
                    </span>

                    <input
                      required={required}
                      value={form[key]}
                      maxLength={200}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [key]: e.target.value,
                        })
                      }
                      className="h-[49px] w-full rounded-xl border border-[#ded8cf] bg-[#fcfbf9] px-4 text-sm text-[#292621] outline-none transition-all duration-300 placeholder:text-[#aaa39b] hover:border-[#c9c0b4] focus:border-[#b28b52] focus:bg-white focus:ring-4 focus:ring-[#b28b52]/10"
                    />
                  </label>
                );
              })}
            </div>

            {/* Default */}
            <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-[#e9e3db] bg-[#faf9f7] px-4 py-3.5 transition-colors duration-300 hover:border-[#d8c9b2]">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isDefault: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-[#cfc7bd] accent-[#a17b3f]"
              />

              <div>
                <p className="text-xs font-semibold text-[#514b44]">
                  Set as default address
                </p>
                <p className="mt-0.5 text-[10px] text-[#99928a]">
                  Use this address automatically during checkout.
                </p>
              </div>
            </label>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                disabled={busy}
                className="group relative flex h-11 flex-1 items-center justify-center overflow-hidden rounded-xl bg-[#25221e] px-5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a17b3f] hover:shadow-[0_10px_25px_rgba(161,123,63,0.18)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
              >
                <span className="relative z-10">
                  {busy
                    ? "Saving…"
                    : editing
                      ? "Update address"
                      : "Save address"}
                </span>

                {!busy && (
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                )}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing("");
                    setForm(empty);
                  }}
                  className="h-11 rounded-xl border border-[#ded8cf] bg-white px-5 text-xs font-semibold uppercase tracking-[0.1em] text-[#625b53] transition-all duration-300 hover:border-[#bfb6aa] hover:bg-[#faf9f7]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Saved addresses */}
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a17b3f]">
                  Saved addresses
                </p>

                <h2 className="mt-1 font-display text-2xl text-[#292621]">
                  Your addresses
                </h2>
              </div>

              <div className="h-px flex-1 bg-[#e8e2da]" />
            </div>

            {addresses.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-[#dcd5cc] bg-[#fcfbf9] px-6 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#faf7f0] text-[#b28b52]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </div>

                <h3 className="mt-5 font-display text-xl text-[#292621]">
                  No saved addresses
                </h3>

                <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-[#8a837b]">
                  Add a delivery address to make your next checkout quicker.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((a) => (
                  <article
                    key={a.id}
                    className={`group rounded-[20px] border bg-white p-5 shadow-[0_7px_25px_rgba(48,39,28,0.035)] transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(48,39,28,0.07)] ${
                      a.isDefault
                        ? "border-[#d8c39e]"
                        : "border-[#e5ded4]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            a.isDefault
                              ? "bg-[#faf4e7] text-[#a17b3f]"
                              : "bg-[#f7f5f1] text-[#8a837b]"
                          }`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-[#292621]">
                              {a.fullName}
                            </p>

                            {a.isDefault && (
                              <span className="rounded-full bg-[#faf4e7] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#a17b3f]">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-xs font-medium text-[#77716a]">
                            {a.phone}
                          </p>

                          <p className="mt-2 text-xs leading-5 text-[#77716a]">
                            {a.addressLine1}
                            {a.addressLine2 && (
                              <>
                                {" "}
                                {a.addressLine2}
                              </>
                            )}
                            <br />
                            {a.landmark && `${a.landmark}, `}
                            {a.city}, {a.state} {a.pincode}, {a.country}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <button
                          onClick={() => {
                            setEditing(a.id);
                            setForm({
                              fullName: a.fullName,
                              phone: a.phone,
                              addressLine1: a.addressLine1,
                              addressLine2: a.addressLine2,
                              landmark: a.landmark,
                              city: a.city,
                              state: a.state,
                              pincode: a.pincode,
                              country: a.country,
                              isDefault: a.isDefault,
                            });
                          }}
                          className="text-xs font-semibold text-[#a17b3f] transition-colors duration-200 hover:text-[#25221e]"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => void remove(a.id)}
                          className="text-xs text-[#a34d45] transition-colors duration-200 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Default accent */}
                    {a.isDefault && (
                      <div className="mt-4 flex items-center gap-2 border-t border-[#eee9e2] pt-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#b28b52]" />
                        <p className="text-[9px] uppercase tracking-[0.14em] text-[#9b948c]">
                          Used as your default delivery address
                        </p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}