"use client";

import { motion } from "framer-motion";
import { artist } from "@/content/artist";

/**
 * MEET THE ARTIST
 *
 * The artist's own words. This used to be two sections either side of
 * the site — a statement and a pinned studio panel — carrying copy I
 * had written to the right length so the layout could be judged. Both
 * are gone; this is his.
 */
export default function About() {
  return (
    <section
      id="about"
      className="bg-room px-6 py-28 md:px-14 md:py-40"
      aria-label="About"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,1fr)_2fr] md:gap-20">
        <motion.p
          className="label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Meet the Artist
        </motion.p>

        <div>
          {artist.about.map((para, i) => (
            <motion.p
              key={i}
              className="mb-8 font-display text-[clamp(1.4rem,2.6vw,2.2rem)] leading-[1.4] text-paper last:mb-0"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 1.2,
                delay: i * 0.15,
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
