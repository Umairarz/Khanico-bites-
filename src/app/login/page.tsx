"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
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
      router.push(searchParams.get("next") || "/account/orders");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-extrabold text-charcoal">Welcome back</h1>
      <p className="mt-1 text-sm text-stone">Log in to track your orders.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-sharp border-2 border-chili bg-chili/10 px-4 py-3 text-sm text-chili-dark">
            {error}
          </div>
        )}
        <div>
          <label className="label-text" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label-text" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-stone">
        New here?{" "}
        <Link href="/register" className="font-semibold text-chili">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
