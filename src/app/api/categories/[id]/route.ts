import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";
import { categorySchema } from "@/lib/validation";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = categorySchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const category = await prisma.category.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json({ category });
  } catch (err) {
    console.error("Update category error:", err);
    return NextResponse.json({ error: "Could not update category" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete category error:", err);
    return NextResponse.json(
      { error: "Could not delete category. Remove or reassign its products first." },
      { status: 400 }
    );
  }
}
