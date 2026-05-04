import { motion } from "framer-motion";

const OmOs = () => (
  <section id="om-os" className="py-20 md:py-28 bg-secondary/50">
    <div className="container max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Om os</h2>
        <div className="divider-gold mx-auto mb-10" />

        <div className="space-y-6 text-muted-foreground leading-relaxed text-base md:text-lg text-left">
          <p>
            Aria Salon er en moderne frisørsalon i hjertet af København, beliggende på
            Vesterbrogade 86. Vi tilbyder dame- og herreklip, skægtrim, farvebehandlinger og
            styling — med fokus på personlig service og høj kvalitet.
          </p>
          <p>
            Vores frisør Mohammed klipper med kniv og tilpasser altid frisuren efter din
            individuelle hovedform og hårtype. Det er ikke bare en standardklipning — det er et
            håndværk, der mærkes. Kunderne kommer tilbage, og mange følger ham på tværs af
            adresser, fordi resultatet altid taler for sig selv.
          </p>
          <p>
            Vi lægger vægt på en afslappet atmosfære, god stemning og tid til den enkelte. Du
            er altid velkommen til at kigge forbi for drop-in, når der er ledigt.
          </p>
          <p>
            Find os på Vesterbrogade 86, 1620 København V.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default OmOs;
