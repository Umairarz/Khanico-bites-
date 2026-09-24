import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCustomerFromCookies } from "@/lib/auth";

// Route reads the database directly and must run per-request, never
// be statically evaluated at build time.
export const dynamic = "force-dynamic";

export async function GET() {
  const session = getCustomerFromCookies();
  if (!session) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, name: true, email: true, phone: true },
  });

  return NextResponse.json({ user });
}
