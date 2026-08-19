"use client";

import { motion } from "framer-motion";

export default function Introduction() {
  return (
    <section
      id="introduction"
      className="bg-room px-6 py-24 md:px-14 md:py-36"
      aria-labelledby="introduction-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,1fr)_2fr] md:gap-20">
        <motion.p
          className="label"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Introduction
        </motion.p>

        <div>
          <motion.h2
            id="introduction-heading"
            className="display max-w-3xl text-[clamp(2.6rem,6vw,5.5rem)] text-paper"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Art that feels personal
          </motion.h2>

          <motion.p
            className="mt-8 max-w-2xl font-display text-[clamp(1.35rem,2.5vw,2.1rem)] leading-[1.45] text-ash"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            At Peterkin Arts, portraiture is more than reproducing a face.
            Every work is created to capture the character, emotion and
            presence of the person behind the image. From highly detailed
            graphite and charcoal drawings to expressive acrylic and oil
            paintings, each portrait is carefully built layer by layer.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

