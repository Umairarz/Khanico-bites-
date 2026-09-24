import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminFromCookies, getCustomerFromCookies } from "@/lib/auth";
import { checkoutSchema, generateOrderNumber } from "@/lib/validation";

const DELIVERY_FEE = 150;

// POST /api/orders — place a new order (checkout). Works for guests and logged-in customers.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const { customerName, customerPhone, deliveryLine1, deliveryCity, orderNotes, items } =
      parsed.data;

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some items in your cart are no longer available" },
        { status: 400 }
      );
    }
    const unavailable = products.find((p) => !p.isAvailable);
    if (unavailable) {
      return NextResponse.json(
        { error: `"${unavailable.name}" is currently sold out. Please remove it from your cart.` },
        { status: 400 }
      );
    }

    const lineItems = items.map((i) => {
      const product = products.find((p) => p.id === i.productId)!;
      const unitPrice = Number(product.price);
      return {
        productId: product.id,
        productName: product.name,
        quantity: i.quantity,
        unitPrice,
        lineTotal: unitPrice * i.quantity,
      };
    });

    const subtotal = lineItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const total = subtotal + DELIVERY_FEE;

    const session = getCustomerFromCookies();

    let orderNumber = generateOrderNumber();
    // Guard against the rare timestamp+random collision.
    for (let attempt = 0; attempt < 3; attempt++) {
      const clash = await prisma.order.findUnique({ where: { orderNumber } });
      if (!clash) break;
      orderNumber = generateOrderNumber();
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        deliveryLine1,
        deliveryCity,
        orderNotes: orderNotes || null,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total,
        paymentMethod: "COD",
        userId: session?.sub,
        items: { create: lineItems },
      },
      include: { items: true },
    });

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Could not place your order. Please try again." }, { status: 500 });
  }
}

// GET /api/orders — admin: all orders (optionally filtered by status); customer: their own orders
export async function GET(req: NextRequest) {
  const admin = getAdminFromCookies();
  const customer = getCustomerFromCookies();

  if (!admin && !customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: {
      ...(admin ? {} : { userId: customer!.sub }),
      ...(status ? { status: status as any } : {}),
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      ...o,
      subtotal: Number(o.subtotal),
      deliveryFee: Number(o.deliveryFee),
      total: Number(o.total),
      items: o.items.map((i) => ({
        ...i,
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
      })),
    })),
  });
}
