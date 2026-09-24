import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";
import { productSchema, slugify } from "@/lib/validation";

// Route reads the database directly and must run per-request, never
// be statically evaluated at build time.
export const dynamic = "force-dynamic";

// GET /api/products?category=slug&search=term  — public menu listing
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const includeUnavailable = searchParams.get("all") === "true"; // admin listing

  const admin = includeUnavailable ? getAdminFromCookies() : null;

  const products = await prisma.product.findMany({
    where: {
      ...(includeUnavailable && admin ? {} : { isAvailable: true }),
      ...(category ? { category: { slug: category } } : {}),
      ...(search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    products: products.map((p) => ({ ...p, price: Number(p.price) })),
  });
}

// POST /api/products — admin only, create a product
export async function POST(req: NextRequest) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse({
      ...body,
      price: Number(body.price),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const data = parsed.data;

    let slug = slugify(data.name);
    const clash = await prisma.product.findUnique({ where: { slug } });
    if (clash) slug = `${slug}-${Date.now().toString().slice(-5)}`;

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        isAvailable: data.isAvailable ?? true,
        isFeatured: data.isFeatured ?? false,
      },
    });

    return NextResponse.json({ product: { ...product, price: Number(product.price) } }, { status: 201 });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: "Could not create product" }, { status: 500 });
  }
}
