import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const payload = await req.json();
    const booking = payload.record;

    if (!booking || !booking.email) {
      return new Response("No booking data", { status: 400 });
    }

    const { name, email, service, date, time, price } = booking;

    const dateFormatted = new Intl.DateTimeFormat("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      return new Response("Missing RESEND_API_KEY", { status: 500 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
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
                  <td style="font-weight: 600; text-align: right;">${dateFormatted}</td>
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
      const err = await res.text();
      console.error("Resend error:", err);
      return new Response(JSON.stringify({ error: err }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
