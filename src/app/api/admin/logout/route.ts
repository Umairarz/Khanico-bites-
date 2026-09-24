import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  clearAuthCookie("admin");
  return NextResponse.json({ ok: true });
}
