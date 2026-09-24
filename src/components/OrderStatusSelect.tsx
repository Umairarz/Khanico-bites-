"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function OrderStatusSelect({ orderId, current }: { orderId: string; current: string }) {
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setStatus(next);
    setSaving(true);
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={saving}
      className="rounded-sharp border-2 border-charcoal/20 bg-white px-2 py-1.5 text-xs font-semibold"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
