import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import AddToCartControl from "@/components/AddToCartControl";
import ProductCard from "@/components/ProductCard";

async function getProduct(slug: string) {
  return prisma.product.findUnique({ where: { slug }, include: { category: true } });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Item not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.imageUrl] },
  };
}

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isAvailable: true, id: { not: product.id } },
    take: 3,
  });

  return (
    <div className="container-page py-10">
      <nav className="text-sm text-stone">
        <Link href="/menu">Menu</Link> <span className="mx-1">/</span>{" "}
        <Link href={`/menu?category=${product.category.slug}`}>{product.category.name}</Link>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sharp border-2 border-charcoal/10">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" priority />
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-charcoal">{product.name}</h1>
          <p className="mt-3 text-stone">{product.description}</p>
          <p className="mt-5 font-display text-2xl font-bold text-chili">
            Rs {Number(product.price).toLocaleString()}
          </p>

          <AddToCartControl
            product={{ ...product, price: Number(product.price) }}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold text-charcoal">You might also like</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={{ ...p, price: Number(p.price) }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
