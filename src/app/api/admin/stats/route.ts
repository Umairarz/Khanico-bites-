import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";

// Route reads the database directly and must run per-request, never
// be statically evaluated at build time.
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [totalOrders, pendingOrders, deliveredOrders, allOrders, productCount] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.findMany({ select: { total: true, status: true } }),
      prisma.product.count(),
    ]);

  const totalSales = allOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      status: true,
      total: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    totalOrders,
    pendingOrders,
    deliveredOrders,
    totalSales,
    productCount,
    recentOrders: recentOrders.map((o) => ({ ...o, total: Number(o.total) })),
  });
}
