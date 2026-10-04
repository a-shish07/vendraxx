"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../../App";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser, toast } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to sign in.");
      }

      await refreshUser();

      const isAdmin = data.user?.role === "ADMIN";

      toast(
        isAdmin
          ? "Welcome back, admin."
          : "Welcome back.",
      );

      /*
       * ADMIN
       * Always go directly to the admin dashboard.
       */
      if (isAdmin) {
        router.push("/admin");
        return;
      }

      /*
       * CUSTOMER
       * Respect a valid ?next= URL if provided.
       * Otherwise go to the normal account page.
       */
      const next = new URLSearchParams(
        window.location.search,
      ).get("next");

      router.push(
        next &&
          next.startsWith("/") &&
          !next.startsWith("//")
          ? next
          : "/account",
      );
    } catch (e) {
      toast(
        e instanceof Error
          ? e.message
          : "Unable to sign in.",
        "error",
      );

      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-white px-4 py-8 sm:px-6 lg:py-10">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#d8b36a]/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#b28b52]/10 blur-3xl" />

        <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d8b36a]/30 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[460px]">
        {/* Top branding */}
        <div className="mb-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a17b3f]">
            Welcome back
          </p>

          <h1 className="mt-3 font-display text-4xl font-normal tracking-tight text-[#24211d] sm:text-[42px]">
            Sign in
          </h1>

          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#77716a]">
            Sign in to continue your Vendrax experience.
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={submit}
          className="group rounded-[26px] border border-[#e7e1d8] bg-white/95 p-6 shadow-[0_24px_70px_rgba(48,39,28,0.09)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(48,39,28,0.12)] sm:p-8"
        >
          <div className="space-y-5">
            {/* Email */}
            <label className="block">
              <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#514b44]">
                Email address
              </span>

              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  placeholder="you@example.com"
                  className="h-[54px] w-full rounded-xl border border-[#ded8cf] bg-[#fcfbf9] px-4 text-sm text-[#292621] outline-none transition-all duration-300 placeholder:text-[#aaa39b] hover:border-[#c9c0b4] focus:border-[#b28b52] focus:bg-white focus:ring-4 focus:ring-[#b28b52]/10"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#514b44]">
                Password
              </span>

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                className="h-[54px] w-full rounded-xl border border-[#ded8cf] bg-[#fcfbf9] px-4 text-sm text-[#292621] outline-none transition-all duration-300 placeholder:text-[#aaa39b] hover:border-[#c9c0b4] focus:border-[#b28b52] focus:bg-white focus:ring-4 focus:ring-[#b28b52]/10"
              />
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group/button relative mt-2 flex h-[54px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#25221e] text-sm font-semibold tracking-wide text-white shadow-[0_10px_25px_rgba(37,34,30,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a17b3f] hover:shadow-[0_14px_30px_rgba(161,123,63,0.22)] active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading ? "Signing in…" : "Sign in"}
              </span>

              {!loading && (
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#ebe6df]" />

            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#aaa39b]">
              Vendrax
            </span>

            <div className="h-px flex-1 bg-[#ebe6df]" />
          </div>

          {/* Register */}
          <p className="text-center text-sm text-[#77716a]">
            Don&apos;t have an account?{" "}
            <Link
              className="font-semibold text-[#a17b3f] underline decoration-[#a17b3f]/30 underline-offset-4 transition-colors duration-200 hover:text-[#25221e] hover:decoration-[#25221e]/30"
              href="/register"
            >
              Create one
            </Link>
          </p>
        </form>

        {/* Bottom detail */}
        <div className="mt-7 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#aaa39b]">
          <span className="h-px w-8 bg-[#d9d2c8]" />

          <span>Shop beautifully</span>

          <span className="h-px w-8 bg-[#d9d2c8]" />
        </div>
      </div>
    </main>
  );
}