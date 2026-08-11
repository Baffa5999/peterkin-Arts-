"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { artist } from "@/content/artist";
import { heroWork } from "@/content/works";
import AssemblingCanvas, { ASSEMBLED } from "./AssemblingCanvas";

/**
 * THE COLD OPEN
 *
 * The painting composes itself out of scattered planes, light rakes
 * across it once, and only then does the name arrive — the way a title
 * card lands after the first shot has played. See AssemblingCanvas for
 * the assembly itself.
 *
 * Layout is genuinely two designs, not one design squeezed:
 *
 *   • Phones stack — canvas in the space that's left, title beneath it
 *     in normal flow. An earlier version floated the title over the
 *     bottom of the frame and, on a tall handset, the label landed on
 *     top of the painting.
 *   • Wide screens run the title down the left and centre the canvas
 *     in the space remaining, so the name never crowds the work.
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

  /* The title follows the picture; it never upstages it. */
  const t = ASSEMBLED;

  return (
    <section
      ref={ref}
      className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-void md:block"
      aria-label="Introduction"
    >
      <div className="spotlight absolute inset-0" />

      {/* The canvas ------------------------------------------------ */}
      <motion.div
        style={{ scale: plateScale, opacity: plateOpacity }}
        className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-6 pt-16 pb-4 md:absolute md:inset-0 md:h-full md:px-6 md:pt-0 md:pb-0 md:pl-[40vw]"
      >
        <motion.div
          /* Width-driven on phones (a height-driven canvas overflowed a
             narrow viewport and got clipped at both edges), height-driven
             on wide screens where vertical space is the scarce axis. */
          style={{ aspectRatio: `${heroWork.width} / ${heroWork.height}` }}
          className="w-[80vw] max-h-full max-w-full md:h-[76svh] md:w-auto"
          /* A very slow push-in that continues long after the assembly
             has finished — the shot is never quite still. */
          initial={{ scale: 1.03 }}
          animate={{ scale: 1 }}
          transition={{ duration: 40, ease: "linear" }}
        >
          <AssemblingCanvas work={heroWork} />
        </motion.div>
      </motion.div>

      {/* Title card ------------------------------------------------ */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-20 shrink-0 px-6 pb-10 md:absolute md:inset-y-0 md:left-0 md:flex md:max-w-[38vw] md:flex-col md:justify-center md:px-14 md:pb-0"
      >
        <motion.p
          className="label"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: t, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {artist.discipline} — {artist.based}
        </motion.p>

        <motion.h1
          className="display mt-4 text-[clamp(2.8rem,8.5vw,7rem)]"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: t + 0.3, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Peterkin
          <span className="block text-brass italic">Arts</span>
        </motion.h1>

        <motion.p
          className="mt-5 max-w-sm font-display text-lg leading-snug text-ash italic md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: t + 1.2, duration: 1.8 }}
        >
          {artist.tagline}
        </motion.p>
      </motion.div>

      {/* Scroll cue ------------------------------------------------ */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center"
        style={{ opacity: textOpacity }}
      >
        <motion.div
          className="h-10 w-px bg-gradient-to-b from-transparent via-ash to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.25, 1, 0.25] }}
          transition={{
            duration: 3.4,
            delay: t + 1.6,
            repeat: Infinity,
            repeatDelay: 0,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </section>
  );
}
