import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FacebookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const videos = [
  "/Videos/v24044gl0000d7rjf37og65kt1m6mln0.mp4",
  "/Videos/v24044gl0000d7pn39nog65hs6orjr0g.mp4",
  "/Videos/v24044gl0000d7nlj0fog65nnqphtac0.mp4",
  "/Videos/v24044gl0000d7lpunfog65hbftgdba0.mp4",
  "/Videos/v24044gl0000d7id6mfog65o6agp7ddg.mp4",
];

const Gallery = () => {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  function goTo(index: number) {
    setCurrent(index);
    setTimeout(() => videoRef.current?.play(), 50);
  }

  function prev() { goTo((current - 1 + videos.length) % videos.length); }
  function next() { goTo((current + 1) % videos.length); }

  return (
    <section className="py-20 md:py-28 bg-secondary/50">
      <div className="container max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Vores arbejde</h2>
          <div className="divider-gold mx-auto mb-8" />

          <div className="relative">
            <div className="rounded-xl overflow-hidden aspect-[9/16] max-h-[600px] mx-auto">
              <video
                ref={videoRef}
                key={current}
                src={videos[current]}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                onEnded={next}
              />
            </div>

            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              aria-label="Forrige video"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              aria-label="Næste video"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex justify-center gap-2 mt-4">
              {videos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-border"}`}
                  aria-label={`Video ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <p className="text-muted-foreground mt-8 mb-6 leading-relaxed">Se mere på vores Facebook-side</p>
          <a
            href="https://www.facebook.com/p/Aria-salon-100063702064710/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-md bg-[#1877F2] px-7 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FacebookIcon />
            Aria Salon på Facebook
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
