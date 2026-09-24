import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/menu/${product.slug}`}
      className="group block overflow-hidden rounded-sharp border-2 border-charcoal/10 bg-white transition-shadow hover:border-charcoal/30 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone/10">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!product.isAvailable && (
          <span className="absolute left-2 top-2 rounded-sharp bg-charcoal px-2 py-1 text-xs font-semibold text-cream">
            Sold out
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-bold text-charcoal">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-stone">{product.description}</p>
        <p className="mt-3 font-display text-lg font-bold text-chili">
          Rs {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
