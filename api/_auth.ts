import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 timer

export function createToken(secret: string): string {
  const exp = (Date.now() + TOKEN_TTL_MS).toString();
  const sig = createHmac("sha256", secret).update(exp).digest("hex");
  return `${exp}.${sig}`;
}

export function verifyToken(token: string, secret: string): boolean {
  if (!token || !secret) return false;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (Date.now() > parseInt(exp, 10)) return false;
  const expected = createHmac("sha256", secret).update(exp).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}
