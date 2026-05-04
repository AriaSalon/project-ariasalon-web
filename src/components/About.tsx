import { motion } from "framer-motion";
import { Scissors } from "lucide-react";

const About = () => (
  <section className="py-20 md:py-28">
    <div className="container max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start"
      >
        <div className="flex flex-col items-center md:items-start gap-4 md:pt-1">
          <Scissors className="h-8 w-8 text-primary rotate-90 shrink-0" />
          <div className="divider-gold" style={{ height: "60px", width: "1px", background: "linear-gradient(180deg, hsl(30 10% 60%), transparent)" }} />
        </div>
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6">
            Kvalitet i hver detalje
          </h2>
          <div className="divider-gold mb-6" />
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Hos Aria Salon er du altid i centrum. Vi tror på personlig service, håndværk og
            opmærksomhed på detaljerne. Uanset om det er en klassisk herreklip, en skarp
            skinfade eller en præcis skægtrimning, sørger vi for, at du går herfra med et smil.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default About;
