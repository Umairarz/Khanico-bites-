import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });
    }

    const token = signToken({ sub: admin.id, type: "admin", email: admin.email });
    setAuthCookie("admin", token);

    return NextResponse.json({ admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
