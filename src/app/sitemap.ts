import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } });

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/menu`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
    ...products.map((p) => ({
      url: `${siteUrl}/menu/${p.slug}`,
      lastModified: p.updatedAt,
    })),
  ];
}
