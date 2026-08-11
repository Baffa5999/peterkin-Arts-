"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { artist } from "@/content/artist";
import { heroWork, works, workSrc } from "@/content/works";
import AssemblingCanvas, { PERFORMANCE } from "./AssemblingCanvas";
import { useMediaQuery } from "@/lib/hooks";

/**
 * THE COLD OPEN — now a rotating one.
 *
 * Each painting composes itself out of scattered planes, holds while a
 * pass of light crosses it, fades away, and the next one builds in its
 * place. See AssemblingCanvas for the assembly.
 *
 * Three problems this component exists to solve:
 *
 * 1. THE PAINTINGS ARE DIFFERENT SHAPES. Ratios here run from 0.766 to
 *    0.865. If the frame resized per painting, the title below it on a
 *    phone would jump every seven seconds. So the frame is FIXED at the
 *    opening work's ratio and each painting is fitted inside it —
 *    object-contain logic, done in JS because the shards are background
 *    images and cannot use object-fit.
 *
 * 2. IT SHOULD NOT RUN FOREVER IN THE BACKGROUND. The rotation pauses
 *    when the hero scrolls out of view and when the tab is hidden.
 *    Nobody needs their battery spent animating a section they left.
 *
 * 3. REDUCED MOTION MEANS REDUCED MOTION. Not a slower carousel — no
 *    carousel. Those visitors get one still painting.
 */

/** Held on screen after the assembly and light sweep have finished. */
const HOLD = 1.6;
const FADE_OUT = 0.9;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* Leaving: the room recedes rather than sliding away. */
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const plateOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  /* The opening work leads; the rest follow in catalogue order. */
  const reel = useMemo(
    () => [heroWork, ...works.filter((w) => w.slug !== heroWork.slug)],
    [],
  );

  const [index, setIndex] = useState(0);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const rotating = inView && tabVisible && !reduced && reel.length > 1;

  useEffect(() => {
    if (!rotating) return;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % reel.length),
      (PERFORMANCE + HOLD) * 1000,
    );
    return () => clearTimeout(id);
  }, [index, rotating, reel.length]);

  const current = reel[index];
  const next = reel[(index + 1) % reel.length];

  /* The frame never changes shape; the paintings fit inside it. */
  const frameRatio = heroWork.width / heroWork.height;
  const fits = (w: typeof current) =>
    w.width / w.height >= frameRatio
      ? { width: "100%", height: "auto" }
      : { height: "100%", width: "auto" };

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
        {/* The frame: fixed size, so nothing around it ever moves. */}
        <motion.div
          style={{ aspectRatio: `${heroWork.width} / ${heroWork.height}` }}
          className="flex w-[80vw] max-h-full max-w-full items-center justify-center md:h-[76svh] md:w-auto"
          /* A very slow push-in, running underneath the whole reel. */
          initial={{ scale: 1.03 }}
          animate={{ scale: 1 }}
          transition={{ duration: 40, ease: "linear" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug}
              style={{
                aspectRatio: `${current.width} / ${current.height}`,
                ...fits(current),
              }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: FADE_OUT, ease: "easeInOut" }}
            >
              <AssemblingCanvas work={current} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Quietly fetch the next painting so it never pops in.
          Parked off-screen at 1px rather than `display:none`, which
          some browsers treat as permission to skip the fetch. */}
      {rotating && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={workSrc(next.slug)}
          alt=""
          aria-hidden
          className="pointer-events-none absolute h-px w-px opacity-0"
        />
      )}

      {/* Title card ------------------------------------------------ */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-20 shrink-0 px-6 pb-10 md:absolute md:inset-y-0 md:left-0 md:flex md:max-w-[38vw] md:flex-col md:justify-center md:px-14 md:pb-0"
      >
        <motion.p
          className="label"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: PERFORMANCE * 0.5, duration: 1.1 }}
        >
          {artist.discipline} — {artist.based}
        </motion.p>

        <motion.h1
          className="display mt-4 text-[clamp(2.8rem,8.5vw,7rem)]"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: PERFORMANCE * 0.5 + 0.3,
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Peterkin
          <span className="block text-brass italic">Arts</span>
        </motion.h1>

        <motion.p
          className="mt-5 max-w-sm font-display text-lg leading-snug text-ash italic md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: PERFORMANCE * 0.5 + 1.2, duration: 1.8 }}
        >
          {artist.tagline}
        </motion.p>

        {/* The wall label — changes with the painting on show. */}
        <div className="mt-7 h-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={current.slug}
              className="label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {current.title} · {current.year}
            </motion.p>
          </AnimatePresence>
        </div>
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
            delay: PERFORMANCE * 0.5 + 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </section>
  );
}
