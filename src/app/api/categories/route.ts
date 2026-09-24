import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";
import { categorySchema, slugify } from "@/lib/validation";

// Route reads the database directly and must run per-request, never
// be statically evaluated at build time.
export const dynamic = "force-dynamic";

// GET /api/categories — public
export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ categories });
}

// POST /api/categories — admin only
export async function POST(req: NextRequest) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const { name, sortOrder, isActive } = parsed.data;

    let slug = slugify(name);
    const clash = await prisma.category.findUnique({ where: { slug } });
    if (clash) return NextResponse.json({ error: "A category with this name already exists" }, { status: 409 });

    const category = await prisma.category.create({
      data: { name, slug, sortOrder: sortOrder ?? 0, isActive: isActive ?? true },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error("Create category error:", err);
    return NextResponse.json({ error: "Could not create category" }, { status: 500 });
  }
}
