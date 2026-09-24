"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-charcoal">Your cart is empty</h1>
        <p className="mt-2 text-stone">Add something delicious from the menu.</p>
        <Link href="/menu" className="btn-primary mt-6 inline-flex">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-extrabold text-charcoal">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-sharp border-2 border-charcoal/10 bg-white p-4"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-sharp">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-bold text-charcoal">{item.name}</h3>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-stone hover:text-chili"
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-sharp border-2 border-charcoal/20">
                    <button
                      className="px-3 py-1 font-bold"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                      className="px-3 py-1 font-bold"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-display font-bold text-chili">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-sharp border-2 border-charcoal bg-white p-6">
          <h2 className="font-display text-lg font-bold text-charcoal">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-stone">
            <span>Subtotal</span>
            <span>Rs {subtotal.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-stone">
            <span>Delivery fee</span>
            <span>Rs 150</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-charcoal/10 pt-4 font-display font-bold text-charcoal">
            <span>Total</span>
            <span>Rs {(subtotal + 150).toLocaleString()}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
