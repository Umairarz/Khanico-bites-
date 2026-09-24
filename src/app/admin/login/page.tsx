"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not log in.");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-sm rounded-sharp border-2 border-cream/20 bg-charcoal p-8">
        <h1 className="font-display text-2xl font-extrabold text-cream">Admin Login</h1>
        <p className="mt-1 text-sm text-cream/60">Khanico Bites management console</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-sharp border-2 border-chili bg-chili/10 px-4 py-3 text-sm text-chili">
              {error}
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-cream" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full rounded-sharp border-2 border-cream/20 bg-cream/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-chili focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-cream" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full rounded-sharp border-2 border-cream/20 bg-cream/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-chili focus:outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
