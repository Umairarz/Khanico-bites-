import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromCookies, getCustomerFromCookies } from "@/lib/auth";

// Route reads the database directly and must run per-request, never
// be statically evaluated at build time.
export const dynamic = "force-dynamic";

// GET /api/orders/:id — accepts id or orderNumber; owner, or admin, only
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromCookies();
  const customer = getCustomerFromCookies();
  if (!admin && !customer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = await prisma.order.findFirst({
    where: { OR: [{ id: params.id }, { orderNumber: params.id }] },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (!admin && order.userId !== customer!.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    order: {
      ...order,
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      total: Number(order.total),
      items: order.items.map((i) => ({
        ...i,
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
      })),
    },
  });
}
