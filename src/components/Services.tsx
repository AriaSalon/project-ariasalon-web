import { motion } from "framer-motion";
import { services } from "@/data/services";

const Services = () => (
  <section id="priser" className="py-20 md:py-28 bg-secondary/50">
    <div className="container max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-4">
          Priser
        </h2>
        <div className="divider-gold mx-auto mb-12" />

        <ul className="space-y-0">
          {services.map((s, i) => (
            <li
              key={s.name}
              className="flex items-baseline justify-between py-4 border-b border-border last:border-0"
            >
              <span className="text-foreground font-medium">{s.name}</span>
              <span className="text-primary font-semibold ml-4 whitespace-nowrap">{s.price}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  </section>
);

export default Services;
