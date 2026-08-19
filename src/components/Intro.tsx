"use client";

import { motion } from "framer-motion";
import { intro } from "@/content/artist";

/**
 * ART THAT FEELS PERSONAL
 *
 * Sits directly under the opening and does one job: say what the work is
 * for, in plain terms, before the visitor has to interpret anything.
 * It ends by handing them on to the biography rather than leaving them
 * to hunt for it.
 *
 * The artist's words, verbatim.
 */
export default function Intro() {
  return (
    <section
      id="intro"
      className="bg-room px-6 py-24 md:px-14 md:py-32"
      aria-label={intro.label}
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,1fr)_2fr] md:gap-20">
        <motion.p
          className="label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {intro.label}
        </motion.p>

        <div>
          <motion.p
            className="font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.35] text-paper"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {intro.paragraphs[0]}
          </motion.p>

          <motion.p
            className="mt-6 max-w-2xl text-base leading-relaxed text-ash md:text-lg"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {intro.paragraphs[1]}
          </motion.p>

          <motion.a
            href="#about"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="group mt-9 inline-flex min-h-11 items-center gap-3 border-b border-rule pb-2 transition-colors duration-300 hover:border-brass"
          >
            <span className="label transition-colors duration-300 group-hover:text-brass">
              {intro.cta}
            </span>
            <span
              aria-hidden
              className="text-ash transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brass"
            >
              →
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
