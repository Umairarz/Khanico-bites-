"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    deliveryLine1: "",
    deliveryCity: "",
    orderNotes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Avoid a flash of "empty cart" before localStorage hydrates.
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setForm((f) => ({ ...f, customerName: d.user.name, customerPhone: d.user.phone }));
        }
      })
      .catch(() => {});
  }, []);

  if (ready && items.length === 0) {
    router.replace("/cart");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not place your order.");
        setLoading(false);
        return;
      }
      clearCart();
      router.push(`/account/orders?placed=${data.order.orderNumber}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const total = subtotal + 150;

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-extrabold text-charcoal">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          {error && (
            <div className="rounded-sharp border-2 border-chili bg-chili/10 px-4 py-3 text-sm text-chili-dark">
              {error}
            </div>
          )}
          <div>
            <label className="label-text" htmlFor="customerName">Full name</label>
            <input
              id="customerName"
              required
              className="input-field"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text" htmlFor="customerPhone">Phone number</label>
            <input
              id="customerPhone"
              required
              className="input-field"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text" htmlFor="deliveryLine1">Delivery address</label>
            <input
              id="deliveryLine1"
              required
              placeholder="House / street / area"
              className="input-field"
              value={form.deliveryLine1}
              onChange={(e) => setForm({ ...form, deliveryLine1: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text" htmlFor="deliveryCity">City</label>
            <input
              id="deliveryCity"
              required
              className="input-field"
              value={form.deliveryCity}
              onChange={(e) => setForm({ ...form, deliveryCity: e.target.value })}
            />
          </div>
          <div>
            <label className="label-text" htmlFor="orderNotes">Order notes (optional)</label>
            <textarea
              id="orderNotes"
              rows={3}
              placeholder="e.g. less spicy, ring the bell twice"
              className="input-field"
              value={form.orderNotes}
              onChange={(e) => setForm({ ...form, orderNotes: e.target.value })}
            />
          </div>

          <div className="rounded-sharp border-2 border-basil/30 bg-basil/5 px-4 py-3 text-sm text-basil">
            Payment method: <strong>Cash on Delivery</strong>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
            {loading ? "Placing order..." : `Place Order — Rs ${total.toLocaleString()}`}
          </button>
        </form>

        <div className="h-fit rounded-sharp border-2 border-charcoal bg-white p-6">
          <h2 className="font-display text-lg font-bold text-charcoal">Order Summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between text-stone">
                <span>{i.name} × {i.quantity}</span>
                <span>Rs {(i.price * i.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between text-sm text-stone">
            <span>Delivery fee</span>
            <span>Rs 150</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-charcoal/10 pt-4 font-display font-bold text-charcoal">
            <span>Total</span>
            <span>Rs {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
