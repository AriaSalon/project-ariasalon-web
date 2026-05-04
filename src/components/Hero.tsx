import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import heroBillede from "../assets/IMG_6825.jpeg";

const Hero = () => (
  <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-zinc-900">
    <img
      src={heroBillede}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover"
    />
    {/* Mørkt overlay */}
    <div className="absolute inset-0 bg-black/60" />
    {/* Lodret accent-linje */}
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden md:block" />

    <div className="container relative z-10 py-20">
      <motion.div
        className="max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
          Aria Salon
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6 text-white">
          Din frisør i<br />
          <span className="text-gradient-gold">hjertet af København</span>
        </h1>
        <p className="text-white/75 text-lg md:text-xl mb-10 font-light">
          Personlig service og høj kvalitet — hver eneste gang.
        </p>

        <div className="flex flex-col sm:flex-row items-start gap-4">
          <a
            href="#booking"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Book tid
          </a>
          <a
            href="tel:+4553770037"
            className="inline-flex items-center gap-2 rounded-md border border-white/60 px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Phone className="h-4 w-4" />
            Ring nu
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
