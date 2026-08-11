"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { artist } from "@/content/artist";
import { featuredWorks, works, workSrc } from "@/content/works";

/**
 * THE COLD OPEN
 *
 * The lights come up on a single drawing hung in a dark room. It
 * brightens from almost nothing over three seconds and then drifts
 * for half a minute — a push-in slow enough that you only notice it
 * if you stop and watch. The name arrives late, like a title card.
 *
 * The canvas is CONTAINED rather than full-bleed, deliberately. These
 * are portrait-format works photographed at modest resolution; a
 * cover-crop would both amputate the composition and upscale the
 * grain. Hanging it whole on a dark wall is truer to the object and
 * sharper on screen. No nav chrome is drawn here — chrome breaks it.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* Leaving: the room recedes rather than sliding away. */
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const plateOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  const plate = featuredWorks[0] ?? works[0];

  return (
    <section
      ref={ref}
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-void"
      aria-label="Introduction"
    >
      {/* The pool of light on the wall */}
      <div className="spotlight absolute inset-0" />

      {/* The hung work ------------------------------------------- */}
      <motion.div
        style={{ scale: plateScale, opacity: plateOpacity }}
        /* On wide screens the canvas centres in the space LEFT OVER
           beside the title column, so the name never crowds the work. */
        className="relative z-10 flex h-full items-start justify-center px-6 pt-16 md:items-center md:py-16 md:pl-[40vw]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.04, filter: "brightness(0.15)" }}
          animate={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
          transition={{
            opacity: { duration: 2.4, ease: "easeOut" },
            filter: { duration: 3.6, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 34, ease: "linear" },
          }}
          className="relative"
        >
          <Image
            src={workSrc(plate.slug)}
            alt={`${plate.title}, ${plate.year}. ${plate.medium}.`}
            width={plate.width}
            height={plate.height}
            priority
            quality={92}
            sizes="(max-width: 768px) 70vh, 68vh"
            className="hung h-[46svh] w-auto md:h-[76svh]"
            style={{ backgroundColor: plate.tint }}
          />
        </motion.div>
      </motion.div>

      {/* Title card ------------------------------------------------
          Sits over the lower third on phones, and along the left edge
          on wide screens where there is room beside the canvas. */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col px-6 pb-20 md:inset-y-0 md:right-auto md:left-0 md:max-w-[38vw] md:justify-center md:px-14 md:pb-0"
      >
        <motion.p
          className="label"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {artist.discipline} — {artist.based}
        </motion.p>

        <motion.h1
          className="display mt-4 text-[clamp(2.8rem,8.5vw,7rem)]"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Peterkin
          <span className="block text-brass italic">Arts</span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-sm font-display text-lg leading-snug text-ash italic md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 1.8 }}
        >
          {artist.tagline}
        </motion.p>
      </motion.div>

      {/* Scroll cue ------------------------------------------------ */}
      <motion.div
        className="absolute inset-x-0 bottom-6 z-20 flex justify-center"
        style={{ opacity: textOpacity }}
      >
        <motion.div
          className="h-10 w-px bg-gradient-to-b from-transparent via-ash to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{
            opacity: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </motion.div>
    </section>
  );
}
