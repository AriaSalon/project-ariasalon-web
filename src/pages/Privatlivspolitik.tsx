import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const Privatlivspolitik = () => {
  useEffect(() => {
    document.title = "Privatlivspolitik – Aria Salon";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Læs Aria Salons privatlivspolitik og hvordan vi behandler dine personoplysninger i forbindelse med online booking.");
    return () => {
      document.title = "Aria Salon – Frisør i hjertet af København";
      if (meta) meta.setAttribute("content", "Aria Salon på Vesterbrogade 86, København V – herreklip, skinfade, skægtrimning og styling. Book tid online eller drop ind. Åbent man–lør 09–19.");
    };
  }, []);

  return (
  <div className="min-h-screen bg-background text-foreground">
    <div className="container max-w-2xl py-16 md:py-24">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-10">
        <ChevronLeft className="w-4 h-4" /> Tilbage til forsiden
      </Link>

      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">Privatlivspolitik</h1>
      <p className="text-muted-foreground text-sm mb-10">Sidst opdateret: maj 2026</p>

      <div className="space-y-8 text-sm leading-relaxed">

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">1. Dataansvarlig</h2>
          <p className="text-muted-foreground">
            Aria Salon<br />
            Vesterbrogade 86, 1620 København V<br />
            Telefon: +45 53 77 00 37
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">2. Hvilke oplysninger indsamler vi?</h2>
          <p className="text-muted-foreground">
            Når du benytter vores bookingformular, indsamler vi følgende personoplysninger:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
            <li>Navn</li>
            <li>Telefonnummer</li>
            <li>Ønsket ydelse, dato og tidspunkt</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">3. Formål med behandlingen</h2>
          <p className="text-muted-foreground">
            Vi behandler dine oplysninger udelukkende for at håndtere og bekræfte din bookingforespørgsel
            samt kontakte dig i forbindelse hermed.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">4. Retsgrundlag</h2>
          <p className="text-muted-foreground">
            Behandlingen af dine bookingoplysninger sker med hjemmel i GDPR artikel 6, stk. 1, litra b —
            behandlingen er nødvendig for at opfylde aftalen om den bookede ydelse. Vi behandler kun de
            oplysninger, der er nødvendige for at bekræfte og gennemføre din booking.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">5. Opbevaring og sletning</h2>
          <p className="text-muted-foreground">
            Dine oplysninger opbevares kun så længe det er nødvendigt for at håndtere din booking.
            Oplysningerne slettes automatisk 2 måneder efter den bookede dato, medmindre der er
            lovmæssig pligt til at opbevare dem længere.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">6. Videregivelse af oplysninger</h2>
          <p className="text-muted-foreground">
            Vi videregiver ikke dine personoplysninger til tredjeparter med henblik på markedsføring.
            Dine bookingoplysninger opbevares hos vores tekniske leverandør{" "}
            <span className="text-foreground">Supabase</span> (supabase.com), der fungerer som databehandler
            og alene behandler data på vores vegne og efter vores instruks.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">7. Cookies og analyseværktøjer</h2>
          <p className="text-muted-foreground mb-2">
            Hjemmesiden anvender cookies. Vi skelner mellem to typer:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-3">
            <li>
              <span className="text-foreground">Nødvendige cookies</span> — bruges til at huske dit
              cookievalg (localStorage). Disse kan ikke fravælges.
            </li>
            <li>
              <span className="text-foreground">Analytiske cookies (Google Analytics 4)</span> — bruges
              til at forstå, hvordan besøgende bruger siden. Aktiveres kun, hvis du accepterer via
              cookie-banneret. Retsgrundlag: samtykke (GDPR artikel 6, stk. 1, litra a).
            </li>
          </ul>
          <p className="text-muted-foreground">
            Du kan til enhver tid ændre dit cookievalg ved at rydde dine browserdata eller kontakte os.
            Google Analytics behandler anonymiserede brugerdata på vegne af os — læs Googles
            privatlivspolitik på{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              policies.google.com/privacy
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">8. Dine rettigheder</h2>
          <p className="text-muted-foreground mb-2">Du har ret til at:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Få indsigt i de oplysninger vi behandler om dig</li>
            <li>Få urigtige oplysninger rettet</li>
            <li>Få dine oplysninger slettet</li>
            <li>Tilbagekalde dit samtykke til analytiske cookies til enhver tid</li>
            <li>Indgive klage til Datatilsynet (<a href="https://www.datatilsynet.dk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">datatilsynet.dk</a>)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">9. Kontakt</h2>
          <p className="text-muted-foreground">
            Hvis du har spørgsmål til behandlingen af dine personoplysninger, er du velkommen til at
            kontakte os på telefon{" "}
            <a href="tel:+4553770037" className="text-primary hover:underline">+45 53 77 00 37</a>.
          </p>
        </section>

      </div>
    </div>
  </div>
  );
};

export default Privatlivspolitik;
