"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-full flex-shrink-0 border-b-2 border-charcoal bg-charcoal text-cream md:min-h-screen md:w-56 md:border-b-0 md:border-r-2">
      <div className="p-5">
        <p className="font-display text-lg font-bold">
          Khanico <span className="text-turmeric">Admin</span>
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:px-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap rounded-sharp px-4 py-2.5 text-sm font-semibold transition-colors ${
              pathname === l.href ? "bg-chili text-cream" : "text-cream/70 hover:bg-cream/10"
            }`}
          >
            {l.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="mt-0 whitespace-nowrap rounded-sharp px-4 py-2.5 text-left text-sm font-semibold text-cream/50 hover:bg-cream/10 md:mt-4"
        >
          Log Out
        </button>
      </nav>
    </aside>
  );
}
