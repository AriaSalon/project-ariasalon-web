import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

const reviews = [
  {
    name: "Jonas Larsen",
    text: "Jeg flyttede til Roskilde for 6 år siden og manglede en frisør. Prøvede mange forskellige, indtil jeg endte hos Mohammed i Aria Salon. Nu er han rykket til Vesterbrogade 86, og jeg er fulgt med som kunde. Er aldrig gået fra hans salon uden at være 100% tilfreds. Han klipper også med kniv og efter min hovedform, hvilket gør ham unik. Klar anbefaling til alle der gerne vil have en pæn frisure ung som gammel.",
    rating: 5,
  },
  {
    name: "Frederik Damlund",
    text: "Jeg kunne ikke forestille mig en anden frisør end Aria Salon. Er blevet klippet her i 2 år, og da salonen rykkede fulgte jeg med. Det gode humør hos Mo, og resultatet han leverer, er altid køreturen værd.",
    rating: 5,
  },
  {
    name: "Nicklas Andersen",
    text: "Fantastisk frisør med sans for detaljen. Yderst professionel klipning der passer til hovedformen og ikke blot en standard maskineklip. Der tages tid til den enkelte og servicen er i top. Få frisører kan klippe skæg som denne. Jeg anbefaler ⭐️",
    rating: 5,
  },
  {
    name: "Kevin FL",
    text: "Bedste frisør i København, en oplevelse man ikke kan få andre steder, skal prøves for at forstå.",
    rating: 5,
  },
  {
    name: "Matias Borchsenius",
    text: "Dygtig frisør, rigtigt god klipning til en skarp pris. Klar anbefaling herfra.",
    rating: 5,
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5 justify-center">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
    ))}
  </div>
);

const Reviews = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [current, setCurrent] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", () => {
      setCurrent(emblaApi.selectedScrollSnap());
    });

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-20 md:py-28 bg-secondary/50">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">
              Hvad vores kunder siger
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Stars count={5} />
              <span className="text-foreground font-semibold">5.0</span>
            </div>
            <p className="text-muted-foreground text-sm">Baseret på 28 Google-anmeldelser</p>
          </div>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviews.map((r, i) => (
                <div key={i} className="flex-none w-full px-4">
                  <div className="rounded-lg border border-border bg-card p-8 text-center">
                    <Stars count={r.rating} />
                    <p className="text-foreground mt-4 mb-4 text-base leading-relaxed">
                      "{r.text}"
                    </p>
                    <p className="text-muted-foreground text-sm font-medium">— {r.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kontroller */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={scrollPrev}
              aria-label="Forrige anmeldelse"
              className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Anmeldelse ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-border"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              aria-label="Næste anmeldelse"
              className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
