"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useApp } from "../../../App";

export default function AdminSettingsPage() {
  const { user, refreshUser, toast } = useApp();
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast("New password and confirmation do not match.", "error");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/credentials", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update credentials.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      await refreshUser();
      toast("Admin credentials updated.");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Unable to update credentials.", "error");
    } finally { setSaving(false); }
  }

  const field = "mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#5146e5]";
  return <div className="max-w-2xl">
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5146e5]">Account security</p>
    <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#25221e] sm:text-4xl">Admin settings</h1>
    <p className="mt-2 text-sm leading-6 text-[#77716a]">Change the email used to sign in and, if needed, your password.</p>
    <form onSubmit={(event) => void submit(event)} className="mt-7 space-y-5 rounded-3xl border border-[#e5e1da] bg-white p-5 shadow-sm sm:p-7">
      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#77716a]">Admin email
        <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={field} />
      </label>
      <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#77716a]">Current password
        <input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className={field} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#77716a]">New password <span className="normal-case font-normal">(optional)</span>
          <input type="password" autoComplete="new-password" minLength={10} maxLength={128} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={field} />
        </label>
        <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[#77716a]">Confirm new password
          <input type="password" autoComplete="new-password" disabled={!newPassword} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={field} />
        </label>
      </div>
      <p className="text-xs leading-5 text-slate-500">Confirm your current password for every change. A new password must be 10–128 characters. Updating credentials signs out other sessions.</p>
      <button disabled={saving} className="rounded-xl bg-[#5146e5] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving…" : "Save credentials"}</button>
    </form>
  </div>;
}
