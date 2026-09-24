import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  // Fail loudly at startup rather than silently signing tokens with "undefined".
  console.error("JWT_SECRET is not set. Add it to your .env file.");
}

export type CustomerTokenPayload = { sub: string; type: "customer"; email: string };
export type AdminTokenPayload = { sub: string; type: "admin"; email: string };
export type TokenPayload = CustomerTokenPayload | AdminTokenPayload;

const CUSTOMER_COOKIE = "kb_customer_token";
const ADMIN_COOKIE = "kb_admin_token";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(
  payload: TokenPayload,
  expiresIn: SignOptions["expiresIn"] = "7d"
) {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken<T extends TokenPayload = TokenPayload>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
}

// --- Cookie helpers (server components / route handlers) ---

export function setAuthCookie(kind: "customer" | "admin", token: string) {
  const name = kind === "customer" ? CUSTOMER_COOKIE : ADMIN_COOKIE;
  cookies().set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAuthCookie(kind: "customer" | "admin") {
  const name = kind === "customer" ? CUSTOMER_COOKIE : ADMIN_COOKIE;
  cookies().set(name, "", { path: "/", maxAge: 0 });
}

export function getCustomerFromCookies(): CustomerTokenPayload | null {
  const token = cookies().get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken<CustomerTokenPayload>(token);
  return payload?.type === "customer" ? payload : null;
}

export function getAdminFromCookies(): AdminTokenPayload | null {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken<AdminTokenPayload>(token);
  return payload?.type === "admin" ? payload : null;
}

export { CUSTOMER_COOKIE, ADMIN_COOKIE };
