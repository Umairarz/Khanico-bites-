import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCustomerFromCookies } from "@/lib/auth";

export async function GET() {
  const session = getCustomerFromCookies();
  if (!session) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, name: true, email: true, phone: true },
  });

  return NextResponse.json({ user });
}
