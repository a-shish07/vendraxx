"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../../App";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser, toast } = useApp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      await refreshUser();
      toast("Account created successfully.");

      const next =
        new URLSearchParams(window.location.search).get("next") || "/account";

      router.push(
        next.startsWith("/") && !next.startsWith("//") ? next : "/account",
      );
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to create account.",
        "error",
      );
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-white px-4 py-6 sm:px-6 lg:py-10">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#d8b36a]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-[#b28b52]/10 blur-3xl" />

        <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d8b36a]/30 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[480px]">
        {/* Header */}
        <div className="mb-7 text-center">

          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a17b3f]">
            Join Vendrax
          </p>

          <h1 className="mt-2.5 font-display text-3xl font-normal tracking-tight text-[#24211d] sm:text-[38px]">
            Create account
          </h1>

          <p className="mx-auto mt-2.5 max-w-sm text-sm leading-6 text-[#77716a]">
            Create your account and discover a more beautiful way to shop.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={submit}
          className="rounded-[26px] border border-[#e7e1d8] bg-white/95 p-6 shadow-[0_24px_70px_rgba(48,39,28,0.09)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(48,39,28,0.12)] sm:p-8"
        >
          <div className="space-y-4">
            {/* Name */}
            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#514b44]">
                Full name
              </span>

              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                minLength={2}
                maxLength={100}
                required
                placeholder="Your name"
                className="h-[51px] w-full rounded-xl border border-[#ded8cf] bg-[#fcfbf9] px-4 text-sm text-[#292621] outline-none transition-all duration-300 placeholder:text-[#aaa39b] hover:border-[#c9c0b4] focus:border-[#b28b52] focus:bg-white focus:ring-4 focus:ring-[#b28b52]/10"
              />
            </label>

            {/* Email */}
            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#514b44]">
                Email address
              </span>

              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                maxLength={254}
                required
                placeholder="you@example.com"
                className="h-[51px] w-full rounded-xl border border-[#ded8cf] bg-[#fcfbf9] px-4 text-sm text-[#292621] outline-none transition-all duration-300 placeholder:text-[#aaa39b] hover:border-[#c9c0b4] focus:border-[#b28b52] focus:bg-white focus:ring-4 focus:ring-[#b28b52]/10"
              />
            </label>

            {/* Phone */}
            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#514b44]">
                Indian mobile number
              </span>

              <div className="flex h-[51px] overflow-hidden rounded-xl border border-[#ded8cf] bg-[#fcfbf9] transition-all duration-300 hover:border-[#c9c0b4] focus-within:border-[#b28b52] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#b28b52]/10">
                <div className="flex items-center border-r border-[#e4ded5] px-3 text-sm font-medium text-[#625b53]">
                  +91
                </div>

                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  type="tel"
                  inputMode="numeric"
                  minLength={10}
                  maxLength={10}
                  required
                  placeholder="10-digit mobile number"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#292621] outline-none placeholder:text-[#aaa39b]"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#514b44]">
                Password
              </span>

              <input
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                type="password"
                minLength={10}
                maxLength={128}
                autoComplete="new-password"
                required
                placeholder="Create a password"
                className="h-[51px] w-full rounded-xl border border-[#ded8cf] bg-[#fcfbf9] px-4 text-sm text-[#292621] outline-none transition-all duration-300 placeholder:text-[#aaa39b] hover:border-[#c9c0b4] focus:border-[#b28b52] focus:bg-white focus:ring-4 focus:ring-[#b28b52]/10"
              />
            </label>

            {/* Confirm password */}
            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#514b44]">
                Confirm password
              </span>

              <input
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                type="password"
                minLength={10}
                maxLength={128}
                autoComplete="new-password"
                required
                placeholder="Re-enter your password"
                className="h-[51px] w-full rounded-xl border border-[#ded8cf] bg-[#fcfbf9] px-4 text-sm text-[#292621] outline-none transition-all duration-300 placeholder:text-[#aaa39b] hover:border-[#c9c0b4] focus:border-[#b28b52] focus:bg-white focus:ring-4 focus:ring-[#b28b52]/10"
              />
            </label>

            {/* Create account */}
            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 flex h-[53px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#25221e] text-sm font-semibold tracking-wide text-white shadow-[0_10px_25px_rgba(37,34,30,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a17b3f] hover:shadow-[0_14px_30px_rgba(161,123,63,0.22)] active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading ? "Creating…" : "Create account"}
              </span>

              {!loading && (
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#ebe6df]" />
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#aaa39b]">
              Vendrax
            </span>
            <div className="h-px flex-1 bg-[#ebe6df]" />
          </div>

          {/* Login */}
          <p className="text-center text-sm text-[#77716a]">
            Already registered?{" "}
            <Link
              className="font-semibold text-[#a17b3f] underline decoration-[#a17b3f]/30 underline-offset-4 transition-colors duration-200 hover:text-[#25221e] hover:decoration-[#25221e]/30"
              href="/login"
            >
              Sign in
            </Link>
          </p>
        </form>

        {/* Bottom detail */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#aaa39b]">
          <span className="h-px w-8 bg-[#d9d2c8]" />
          <span>Welcome to Vendrax</span>
          <span className="h-px w-8 bg-[#d9d2c8]" />
        </div>
      </div>
    </main>
  );
}