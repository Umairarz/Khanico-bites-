"use client";

import { useState } from "react";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
};

export default function CategoryManager({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sortOrder: categories.length }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create category");
        setSaving(false);
        return;
      }
      setCategories((prev) => [...prev, { ...data.category, productCount: 0 }]);
      setName("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(cat: CategoryRow) {
    const res = await fetch(`/api/categories/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !cat.isActive }),
    });
    if (res.ok) {
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: !c.isActive } : c))
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || "Could not delete category");
    }
  }

  return (
    <div className="mt-6 max-w-2xl">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          required
          placeholder="New category name"
          className="input-field !py-2.5 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" disabled={saving} className="btn-primary !py-2.5 text-sm whitespace-nowrap">
          Add
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-chili">{error}</p>}

      <div className="mt-6 space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-sharp border-2 border-charcoal/10 bg-white px-4 py-3">
            <div>
              <p className="font-semibold text-charcoal">{c.name}</p>
              <p className="text-xs text-stone">{c.productCount} products</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleActive(c)}
                className={`rounded-sharp px-3 py-1 text-xs font-semibold ${
                  c.isActive ? "bg-basil/15 text-basil" : "bg-stone/15 text-stone"
                }`}
              >
                {c.isActive ? "Active" : "Hidden"}
              </button>
              <button onClick={() => handleDelete(c.id)} className="text-sm font-semibold text-chili">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
