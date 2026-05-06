import { createHmac } from "node:crypto";

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

function createToken(secret: string): string {
  const exp = (Date.now() + TOKEN_TTL_MS).toString();
  const sig = createHmac("sha256", secret).update(exp).digest("hex");
  return `${exp}.${sig}`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const password: string = body?.password ?? "";
    const adminPassword = process.env.ADMIN_PASSWORD ?? "";
    const sessionSecret = process.env.SESSION_SECRET ?? "";

    if (!adminPassword || !sessionSecret) {
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!password || password !== adminPassword) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ token: createToken(sessionSecret) }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Bad request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
