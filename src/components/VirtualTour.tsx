import { motion } from "framer-motion";

const VirtualTour = () => (
  <section className="py-20 md:py-28 bg-zinc-900">
    <div className="container max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-2 text-white">
          Tag en rundtur
        </h2>
        <div className="divider-gold mb-8" />
        <p className="text-white/70 mb-8 text-base md:text-lg">
          Udforsk salonen – inden du ankommer.
        </p>
        <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src="https://googlestreetview.s3.eu-central-1.amazonaws.com/Aria+Salon/VR+Media+International+AB/index.htm"
            title="Virtuel rundvisning i Aria Salon"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </motion.div>
    </div>
  </section>
);

export default VirtualTour;
