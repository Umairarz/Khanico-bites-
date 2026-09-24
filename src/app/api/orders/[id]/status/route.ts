import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";
import { orderStatusSchema } from "@/lib/validation";

// PATCH /api/orders/:id/status — admin only
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = orderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid status" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ order: { ...order, total: Number(order.total) } });
  } catch (err) {
    console.error("Update order status error:", err);
    return NextResponse.json({ error: "Could not update order status" }, { status: 500 });
  }
}
