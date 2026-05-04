import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";

const FacebookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const hours = [
  { day: "Mandag – Lørdag", time: "09:00 – 19:00" },
  { day: "Søndag", time: "Lukket" },
];

const Location = () => (
  <section id="kontakt" className="py-20 md:py-28">
    <div className="container max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-4">
          Find os
        </h2>
        <div className="divider-gold mx-auto mb-12" />

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Adresse</p>
                <p className="text-muted-foreground text-sm">Vesterbrogade 86, 1620 København V</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Telefon</p>
                <a href="tel:+4553770037" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  +45 53 77 00 37
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FacebookIcon />
              <div>
                <p className="font-medium text-foreground">Følg os</p>
                <a
                  href="https://www.facebook.com/p/Aria-salon-100063702064710/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  Aria Salon på Facebook
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground mb-1">Åbningstider</p>
                {hours.map((h, i) => (
                  <div key={i} className="flex justify-between text-sm text-muted-foreground gap-6">
                    <span>{h.day}</span>
                    <span>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-border h-64 md:h-auto">
            <iframe
              title="Aria Salon lokation"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2249.3!2d12.5516!3d55.6706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465253040e0507d5%3A0x0!2sVesterbrogade+86%2C+1620+K%C3%B8benhavn!5e0!3m2!1sda!2sdk!4v1"
              className="w-full h-full"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Location;
