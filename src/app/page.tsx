import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true, isAvailable: true },
      include: { category: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <section className="border-b-2 border-charcoal bg-charcoal text-cream">
        <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-turmeric">
              Peshawar's fastest kitchen
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl">
              Hot food, on your
              <br />
              doorstep in minutes.
            </h1>
            <p className="mt-5 max-w-md text-cream/70">
              Smash burgers, hand-tossed pizza and crispy fried chicken made to
              order. Browse the menu, add to cart, and pay cash on delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/menu" className="btn-primary">
                Order Now
              </Link>
              <Link href="/contact" className="btn-outline !border-cream !text-cream hover:!bg-cream hover:!text-charcoal">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sharp">
            <Image
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200"
              alt="Khanico Bites signature burger"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="font-display text-2xl font-bold text-charcoal">Shop by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/menu?category=${c.slug}`}
              className="flex items-center justify-center rounded-sharp border-2 border-charcoal/10 bg-white px-3 py-5 text-center text-sm font-semibold text-charcoal transition-colors hover:border-chili hover:text-chili"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container-page py-6 pb-20">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-bold text-charcoal">Popular right now</h2>
            <Link href="/menu" className="text-sm font-semibold text-chili hover:underline">
              View full menu →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={{ ...p, price: Number(p.price) }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
