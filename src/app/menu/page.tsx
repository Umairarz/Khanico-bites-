import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse burgers, pizza, fried chicken, wraps, sides and drinks at Khanico Bites.",
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const { category, search } = searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isAvailable: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-extrabold text-charcoal">Our Menu</h1>
      <p className="mt-2 text-stone">Fresh, fast, and made to order.</p>

      <form className="mt-6 max-w-sm" action="/menu" method="get">
        {category && <input type="hidden" name="category" value={category} />}
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search the menu..."
          className="input-field"
        />
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/menu"
          className={`rounded-sharp border-2 px-4 py-2 text-sm font-semibold ${
            !category ? "border-chili bg-chili text-cream" : "border-charcoal/15 text-charcoal"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/menu?category=${c.slug}`}
            className={`rounded-sharp border-2 px-4 py-2 text-sm font-semibold ${
              category === c.slug
                ? "border-chili bg-chili text-cream"
                : "border-charcoal/15 text-charcoal"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-stone">
          No items match right now. Try a different category or search term.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={{ ...p, price: Number(p.price) }} />
          ))}
        </div>
      )}
    </div>
  );
}
