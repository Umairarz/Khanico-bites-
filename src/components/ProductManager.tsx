"use client";

import { useState } from "react";
import Image from "next/image";
import type { Category, Product } from "@/types";

type FormState = {
  id?: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  categoryId: string;
  isAvailable: boolean;
  isFeatured: boolean;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  categoryId: "",
  isAvailable: true,
  isFeatured: false,
};

export default function ProductManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit(p: Product) {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      price: String(p.price),
      imageUrl: p.imageUrl,
      categoryId: p.categoryId,
      isAvailable: p.isAvailable,
      isFeatured: p.isFeatured,
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditing(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      imageUrl: form.imageUrl,
      categoryId: form.categoryId,
      isAvailable: form.isAvailable,
      isFeatured: form.isFeatured,
    };
    try {
      const res = await fetch(form.id ? `/api/products/${form.id}` : "/api/products", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save product");
        setSaving(false);
        return;
      }
      if (form.id) {
        setProducts((prev) => prev.map((p) => (p.id === form.id ? data.product : p)));
      } else {
        setProducts((prev) => [data.product, ...prev]);
      }
      resetForm();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || "Could not delete product");
    }
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-3">
      <form onSubmit={handleSubmit} className="lg:col-span-1 h-fit rounded-sharp border-2 border-charcoal/10 bg-white p-5">
        <h2 className="font-display font-bold text-charcoal">{editing ? "Edit Product" : "Add Product"}</h2>
        {error && (
          <div className="mt-3 rounded-sharp border-2 border-chili bg-chili/10 px-3 py-2 text-xs text-chili-dark">
            {error}
          </div>
        )}
        <div className="mt-4 space-y-3">
          <input
            required
            placeholder="Name"
            className="input-field !py-2 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            required
            placeholder="Description"
            rows={3}
            className="input-field !py-2 text-sm"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            required
            type="number"
            min="0"
            step="0.01"
            placeholder="Price (Rs)"
            className="input-field !py-2 text-sm"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            required
            placeholder="Image URL"
            className="input-field !py-2 text-sm"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          <select
            required
            className="input-field !py-2 text-sm"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="flex gap-4 text-sm text-charcoal">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
              />
              Available
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              Featured
            </label>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary flex-1 !py-2.5 text-sm">
            {saving ? "Saving..." : editing ? "Save Changes" : "Add Product"}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className="btn-outline !py-2.5 text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="lg:col-span-2 space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-sharp border-2 border-charcoal/10 bg-white p-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sharp">
              <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-charcoal">{p.name}</p>
              <p className="text-xs text-stone">
                {p.category?.name} · Rs {p.price.toLocaleString()} · {p.isAvailable ? "Available" : "Sold out"}
                {p.isFeatured ? " · Featured" : ""}
              </p>
            </div>
            <button onClick={() => startEdit(p)} className="text-sm font-semibold text-basil">
              Edit
            </button>
            <button onClick={() => handleDelete(p.id)} className="text-sm font-semibold text-chili">
              Delete
            </button>
          </div>
        ))}
        {products.length === 0 && <p className="py-10 text-center text-stone">No products yet.</p>}
      </div>
    </div>
  );
}
