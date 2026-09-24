import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";
import { productSchema } from "@/lib/validation";

// GET /api/products/:id — accepts either a product id or slug
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ product: { ...product, price: Number(product.price) } });
}

// PUT /api/products/:id — admin only
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = productSchema.partial().safeParse({
      ...body,
      price: body.price !== undefined ? Number(body.price) : undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json({ product: { ...product, price: Number(product.price) } });
  } catch (err) {
    console.error("Update product error:", err);
    return NextResponse.json({ error: "Could not update product" }, { status: 500 });
  }
}

// DELETE /api/products/:id — admin only
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete product error:", err);
    return NextResponse.json(
      { error: "Could not delete product. It may be referenced by existing orders — try marking it unavailable instead." },
      { status: 400 }
    );
  }
}
