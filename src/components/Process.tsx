"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { artist } from "@/content/artist";
import { works, workSrc } from "@/content/works";

/**
 * THE STUDIO
 *
 * A quieter beat before the end: a single work held at half-frame,
 * parallaxing behind the artist's account of how the work gets made.
 */
export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const plate = works[works.length - 1];

  return (
    <section
      ref={ref}
      id="process"
      className="relative overflow-hidden bg-room"
      aria-label="Process"
    >
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[52vh] overflow-hidden md:min-h-[86vh]">
          <motion.div style={{ y }} className="absolute inset-[-8%]">
            <Image
              src={workSrc(plate.slug)}
              alt={`Detail from ${plate.title}`}
              fill
              quality={80}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover brightness-[0.7]"
              /* Bias up the frame so a portrait crops to the face
                 rather than the collar. */
              style={{ backgroundColor: plate.tint, objectPosition: "50% 22%" }}
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-room/70" />
        </div>

        <div className="flex flex-col justify-center px-6 py-24 md:px-16 md:py-32">
          <motion.p
            className="label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            In the studio
          </motion.p>

          {artist.process.map((para, i) => (
            <motion.p
              key={i}
              className="mt-8 max-w-prose font-display text-[clamp(1.35rem,2.2vw,1.9rem)] leading-[1.45] text-ash"
              initial={{ opacity: 0, y: 22 }}
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
