"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../../App";

export default function AccountPage() {
  const { user, authLoading, refreshUser, toast } = useApp();
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    avatar: "",
    avatarPublicId: "",
    createdAt: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login?next=/account");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user)
      fetch("/api/auth/me", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.user)
            setProfile({
              name: d.user.name || "",
              phone: d.user.phone || "",
              avatar: d.user.avatar || "",
              avatarPublicId: d.user.avatarPublicId || "",
              createdAt: d.user.createdAt || "",
            });
        })
        .catch(() => toast("Unable to load your profile.", "error"));
  }, [user, toast]);

  if (authLoading || !user)
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ded8cf] border-t-[#a17b3f]" />
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#8a837b]">
            Loading account
          </p>
        </div>
      </div>
    );

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setBusy(true);

    try {
      const r = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const d = await r.json();

      if (!r.ok) throw new Error(d.error);

      setProfile((p) => ({ ...p, ...d.user }));
      await refreshUser();
      toast("Profile updated successfully.");
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to update profile.",
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setBusy(true);

    try {
      const r = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(password),
      });

      const d = await r.json();

      if (!r.ok) throw new Error(d.error);

      setPassword({ currentPassword: "", newPassword: "" });
      await refreshUser();
      toast("Password changed. Other sessions have been signed out.");
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to change password.",
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  async function uploadAvatar(file?: File) {
    if (!file) return;

    setBusy(true);

    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("purpose", "avatar");

      const upload = await fetch("/api/uploads", {
        method: "POST",
        body: fd,
      });

      const uploaded = await upload.json();

      if (!upload.ok) throw new Error(uploaded.error);

      const update = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          avatar: uploaded.secureUrl,
          avatarPublicId: uploaded.publicId,
        }),
      });

      const result = await update.json();

      if (!update.ok) throw new Error(result.error);

      if (profile.avatarPublicId)
        void fetch("/api/uploads", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: profile.avatarPublicId }),
        });

      setProfile((p) => ({
        ...p,
        avatar: uploaded.secureUrl,
        avatarPublicId: uploaded.publicId,
      }));

      await refreshUser();
      toast("Profile image updated.");
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to upload image.",
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  async function removeAvatar() {
    const old = profile.avatarPublicId;

    setBusy(true);

    try {
      const r = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          removeAvatar: true,
        }),
      });

      const d = await r.json();

      if (!r.ok) throw new Error(d.error);

      setProfile((p) => ({ ...p, avatar: "", avatarPublicId: "" }));

      if (old) {
        await fetch("/api/uploads", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: old }),
        });
      }

      await refreshUser();
      toast("Profile image removed.");
    } catch (e) {
      toast(
        e instanceof Error ? e.message : "Unable to remove profile image.",
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#d8b36a]/10 blur-3xl" />
        <div className="absolute -right-48 top-[35%] h-[32rem] w-[32rem] rounded-full bg-[#b28b52]/[0.07] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Account hero */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#25221e] px-6 py-8 text-white shadow-[0_24px_70px_rgba(37,34,30,0.14)] sm:px-9 sm:py-10">
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c8a15a]" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d2ad6b]">
                  My account
                </p>
              </div>

              <h1 className="mt-3 font-display text-3xl font-normal tracking-tight sm:text-4xl">
                Hello, {user.name}
              </h1>

              <p className="mt-2 text-sm text-white/55">{user.email}</p>

              {profile.createdAt && (
                <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/35">
                  Member since{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-IN")}
                </p>
              )}
            </div>

            {/* Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 p-1 shadow-xl backdrop-blur-sm sm:h-28 sm:w-28">
              <img
                src={profile.avatar || "/placeholder-product.svg"}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Main cards */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Profile */}
          <form
            onSubmit={saveProfile}
            className="group rounded-[24px] border border-[#e5ded4] bg-white p-6 shadow-[0_12px_40px_rgba(48,39,28,0.05)] transition-shadow duration-500 hover:shadow-[0_18px_50px_rgba(48,39,28,0.08)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a17b3f]">
                  Personal details
                </p>

                <h2 className="mt-1.5 font-display text-2xl text-[#292621]">
                  Profile
                </h2>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf7f0] text-[#a17b3f]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Avatar controls */}
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-[#eee9e2] bg-[#faf9f7] p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#ded8cf] bg-white">
                <img
                  src={profile.avatar || "/placeholder-product.svg"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#292621]">
                  Profile photo
                </p>

                <p className="mt-1 text-xs text-[#8a837b]">
                  JPG, PNG, WEBP or AVIF
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center rounded-lg border border-[#d8d1c8] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#514b44] transition-all duration-300 hover:border-[#b28b52] hover:text-[#a17b3f]">
                    Upload photo

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="sr-only"
                      onChange={(e) =>
                        void uploadAvatar(e.target.files?.[0])
                      }
                    />
                  </label>

                  {profile.avatar && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void removeAvatar()}
                      className="text-xs font-medium text-[#a34d45] transition-colors hover:text-red-700 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <label className="mt-5 block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#514b44]">
                Name
              </span>

              <input
                required
                minLength={2}
                maxLength={100}
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="h-[50px] w-full rounded-xl border border-[#ded8cf] bg-[#fcfbf9] px-4 text-sm text-[#292621] outline-none transition-all duration-300 hover:border-[#c9c0b4] focus:border-[#b28b52] focus:bg-white focus:ring-4 focus:ring-[#b28b52]/10"
              />
            </label>

            {/* Phone */}
            <label className="mt-4 block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#514b44]">
                Phone
              </span>

              <input
                required
                inputMode="numeric"
                maxLength={10}
                value={profile.phone}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
                className="h-[50px] w-full rounded-xl border border-[#ded8cf] bg-[#fcfbf9] px-4 text-sm text-[#292621] outline-none transition-all duration-300 hover:border-[#c9c0b4] focus:border-[#b28b52] focus:bg-white focus:ring-4 focus:ring-[#b28b52]/10"
              />
            </label>

            <div className="mt-4 rounded-xl bg-[#faf7f0] px-4 py-3">
              <p className="text-xs text-[#77716a]">
                <span className="font-semibold text-[#514b44]">Email:</span>{" "}
                {user.email}
              </p>
              <p className="mt-1 text-[10px] text-[#9b948c]">
                Email changes are not enabled.
              </p>
            </div>

            <button
              disabled={busy}
              className="group/button relative mt-5 flex h-[48px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#25221e] text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a17b3f] hover:shadow-[0_10px_25px_rgba(161,123,63,0.18)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
            >
              <span className="relative z-10">
                {busy ? "Saving…" : "Save profile"}
              </span>

              {!busy && (
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />
              )}
            </button>
          </form>

          {/* Password */}
          <form
            onSubmit={changePassword}
            className="group rounded-[24px] border border-[#e5ded4] bg-white p-6 shadow-[0_12px_40px_rgba(48,39,28,0.05)] transition-shadow duration-500 hover:shadow-[0_18px_50px_rgba(48,39,28,0.08)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a17b3f]">
                  Account security
                </p>

                <h2 className="mt-1.5 font-display text-2xl text-[#292621]">
                  Change password
                </h2>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf7f0] text-[#a17b3f]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2"
                  />
                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <label className="mt-7 block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#514b44]">
                Current password
              </span>

              <input
                required
                type="password"
                autoComplete="current-password"
                value={password.currentPassword}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    currentPassword: e.target.value,
                  })
                }
                className="h-[50px] w-full rounded-xl border border-[#ded8cf] bg-[#fcfbf9] px-4 text-sm text-[#292621] outline-none transition-all duration-300 hover:border-[#c9c0b4] focus:border-[#b28b52] focus:bg-white focus:ring-4 focus:ring-[#b28b52]/10"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#514b44]">
                New password
              </span>

              <input
                required
                minLength={10}
                maxLength={128}
                type="password"
                autoComplete="new-password"
                value={password.newPassword}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    newPassword: e.target.value,
                  })
                }
                className="h-[50px] w-full rounded-xl border border-[#ded8cf] bg-[#fcfbf9] px-4 text-sm text-[#292621] outline-none transition-all duration-300 hover:border-[#c9c0b4] focus:border-[#b28b52] focus:bg-white focus:ring-4 focus:ring-[#b28b52]/10"
              />
            </label>

            <button
              disabled={busy}
              className="group/button relative mt-5 flex h-[48px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#25221e] text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a17b3f] hover:shadow-[0_10px_25px_rgba(161,123,63,0.18)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
            >
              <span className="relative z-10">Update password</span>

              {!busy && (
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />
              )}
            </button>

            <div className="mt-4 flex gap-2 rounded-xl bg-[#faf7f0] p-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="mt-0.5 h-4 w-4 shrink-0 text-[#a17b3f]"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  d="M12 11v5M12 8h.01"
                  strokeLinecap="round"
                />
              </svg>

              <p className="text-[10px] leading-5 text-[#8a837b]">
                Changing your password signs out existing sessions for
                security.
              </p>
            </div>
          </form>
        </div>

        {/* Account navigation */}
        <section className="mt-6">
          <div className="mb-4 flex items-center gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a17b3f]">
              Your Vendrax
            </p>
            <div className="h-px flex-1 bg-[#e5ded4]" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Addresses */}
            <Link
              href="/account/addresses"
              className="group relative overflow-hidden rounded-[20px] border border-[#e5ded4] bg-white p-5 shadow-[0_8px_30px_rgba(48,39,28,0.04)] transition-all duration-400 hover:-translate-y-1 hover:border-[#d4c3a7] hover:shadow-[0_16px_40px_rgba(48,39,28,0.08)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#faf7f0] text-[#a17b3f] transition-transform duration-300 group-hover:scale-105">
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

                <span className="text-lg text-[#c2b9ae] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#a17b3f]">
                  →
                </span>
              </div>

              <h2 className="mt-5 text-sm font-semibold text-[#292621]">
                Address book
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[#8a837b]">
                Add and manage delivery addresses.
              </p>
            </Link>

            {/* Orders */}
            <Link
              href="/account/orders"
              className="group relative overflow-hidden rounded-[20px] border border-[#e5ded4] bg-white p-5 shadow-[0_8px_30px_rgba(48,39,28,0.04)] transition-all duration-400 hover:-translate-y-1 hover:border-[#d4c3a7] hover:shadow-[0_16px_40px_rgba(48,39,28,0.08)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#faf7f0] text-[#a17b3f] transition-transform duration-300 group-hover:scale-105">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M6 3h12v18l-6-3-6 3V3Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 7h6M9 11h6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <span className="text-lg text-[#c2b9ae] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#a17b3f]">
                  →
                </span>
              </div>

              <h2 className="mt-5 text-sm font-semibold text-[#292621]">
                Order history
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[#8a837b]">
                View orders and track delivery status.
              </p>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="group relative overflow-hidden rounded-[20px] border border-[#e5ded4] bg-white p-5 shadow-[0_8px_30px_rgba(48,39,28,0.04)] transition-all duration-400 hover:-translate-y-1 hover:border-[#d4c3a7] hover:shadow-[0_16px_40px_rgba(48,39,28,0.08)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#faf7f0] text-[#a17b3f] transition-transform duration-300 group-hover:scale-105">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <span className="text-lg text-[#c2b9ae] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#a17b3f]">
                  →
                </span>
              </div>

              <h2 className="mt-5 text-sm font-semibold text-[#292621]">
                Wishlist
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[#8a837b]">
                Review your saved products.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}