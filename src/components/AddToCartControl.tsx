"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import type { Product } from "@/types";

export default function AddToCartControl({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-4">
      <div className="flex items-center rounded-sharp border-2 border-charcoal/20">
        <button
          type="button"
          aria-label="Decrease quantity"
          className="px-4 py-2 text-lg font-bold"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span className="min-w-[2.5rem] text-center font-semibold">{qty}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          className="px-4 py-2 text-lg font-bold"
          onClick={() => setQty((q) => Math.min(20, q + 1))}
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={!product.isAvailable}
        onClick={handleAdd}
        className="btn-primary"
      >
        {product.isAvailable ? "Add to Cart" : "Sold Out"}
      </button>

      {added && (
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="text-sm font-semibold text-basil underline"
        >
          Added! View cart →
        </button>
      )}
    </div>
  );
}
