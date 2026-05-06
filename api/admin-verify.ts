import { verifyToken } from "./_auth";

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
