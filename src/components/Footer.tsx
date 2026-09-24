import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-charcoal bg-charcoal text-cream">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">
            Khanico <span className="text-turmeric">Bites</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-cream/70">
            Fast food, cooked fresh and delivered fast. Burgers, pizza, fried
            chicken and more — order online, pay cash on delivery.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-turmeric">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li><Link href="/menu">Full Menu</Link></li>
            <li><Link href="/cart">Your Cart</Link></li>
            <li><Link href="/account/orders">Order History</Link></li>
            <li><Link href="/contact">Contact &amp; About</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-turmeric">Get in touch</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li>Peshawar Custom Chowk, Peshawar</li>
            <li>Open daily, 12pm – midnight</li>
            <li><Link href="/admin/login" className="text-cream/50 hover:text-cream">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Khanico Bites. All rights reserved.
      </div>
    </footer>
  );
}
