"use client";

import { motion } from "framer-motion";
import { artist } from "@/content/artist";

/**
 * THE VOICE-OVER
 *
 * After the cold open, the room goes quiet and the artist speaks.
 * Lines rise individually, slightly staggered, the way subtitles do.
 */
export default function Statement() {
  return (
    <section
      id="statement"
      className="relative bg-void px-6 py-32 md:px-14 md:py-48"
      aria-label="Statement"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[minmax(0,1fr)_2fr] md:gap-20">
        <motion.p
          className="label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1 }}
        >
          Statement
        </motion.p>

        <div>
          {artist.statement.map((para, i) => (
            <motion.p
              key={i}
              className="mb-8 font-display text-[clamp(1.5rem,2.9vw,2.4rem)] leading-[1.35] text-paper last:mb-0"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{
                duration: 1.3,
                delay: i * 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
