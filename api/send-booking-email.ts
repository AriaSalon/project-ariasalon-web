export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { name, email, service, date, time, price } = await req.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Aria Salon <noreply@ariasalon.dk>",
        to: email,
        subject: "Booking bekræftelse – Aria Salon",
        html: `
          <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 48px 24px; color: #1a1a1a; background: #ffffff;">
            <h1 style="font-size: 26px; font-weight: 600; margin: 0 0 8px 0;">
              Tak for din booking, ${name}!
            </h1>
            <p style="color: #666; margin: 0 0 36px 0; font-size: 15px;">
              Vi glæder os til at se dig hos Aria Salon.
            </p>
            <div style="background: #f8f8f8; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="color: #888; padding: 6px 0;">Ydelse</td>
                  <td style="font-weight: 600; text-align: right;">${service}</td>
                </tr>
                <tr>
                  <td style="color: #888; padding: 6px 0;">Dato</td>
                  <td style="font-weight: 600; text-align: right;">${date}</td>
                </tr>
                <tr>
                  <td style="color: #888; padding: 6px 0;">Tidspunkt</td>
                  <td style="font-weight: 600; text-align: right;">${time}</td>
                </tr>
                <tr style="border-top: 1px solid #e5e5e5;">
                  <td style="color: #888; padding: 12px 0 6px 0;">Pris</td>
                  <td style="font-weight: 700; text-align: right; padding-top: 12px;">${price}</td>
                </tr>
              </table>
            </div>
            <p style="font-size: 14px; color: #555; margin: 0 0 6px 0;">📍 Vesterbrogade 86, 1620 København V</p>
            <p style="font-size: 14px; color: #555; margin: 0 0 36px 0;">📞 +45 53 77 00 37</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 0 0 24px 0;" />
            <p style="font-size: 12px; color: #aaa; margin: 0;">Aria Salon · Vesterbrogade 86 · 1620 København V</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
