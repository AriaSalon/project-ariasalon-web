import { createHmac } from "node:crypto";

function verifyToken(token: string, secret: string): boolean {
  if (!token || !secret) return false;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (Date.now() > parseInt(exp, 10)) return false;
  const expected = createHmac("sha256", secret).update(exp).digest("hex");
  return sig === expected;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  const secret = process.env.SESSION_SECRET ?? "";
  const valid = verifyToken(token, secret);

  return new Response(JSON.stringify({ valid }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
