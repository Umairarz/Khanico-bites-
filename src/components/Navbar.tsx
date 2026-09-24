"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/account/orders", label: "My Orders" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-charcoal bg-cream">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-charcoal">
          Khanico <span className="text-chili">Bites</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-semibold transition-colors hover:text-chili ${
                pathname === l.href ? "text-chili" : "text-charcoal"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="btn-outline !px-4 !py-2 text-sm">
            Cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
          <button
            aria-label="Toggle menu"
            className="md:hidden p-2"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="block w-6 h-0.5 bg-charcoal mb-1.5" />
            <span className="block w-6 h-0.5 bg-charcoal mb-1.5" />
            <span className="block w-6 h-0.5 bg-charcoal" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-charcoal/10 bg-cream">
          <div className="container-page flex flex-col py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-semibold text-charcoal"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
