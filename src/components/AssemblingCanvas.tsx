"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { workSrc, type Work } from "@/content/works";
import { useMediaQuery } from "@/lib/hooks";

/**
 * THE PAINTING ASSEMBLES ITSELF
 *
 * The opening shot is not a fade — the work composes on screen. It
 * arrives as scattered, tilted shards that fly in and lock together,
 * then a clean copy of the painting cross-fades over the grid and a
 * single pass of light rakes across the surface.
 *
 * The shard grid is deliberate rather than decorative: this hero is a
 * cubist canvas built out of planes and arcs, so assembling it out of
 * planes is the painting's own logic played forward.
 *
 * Two things worth knowing if you edit this:
 *
 * 1. The scatter is SEEDED, not random. `Math.random()` here would
 *    produce different values on the server and the client and blow up
 *    hydration. `jitter()` is a cheap deterministic hash instead.
 *
 * 2. Only `transform` and `opacity` are animated, so the whole
 *    sequence runs on the compositor. The crisp layer that fades in at
 *    the end reuses the exact same file the shards are painted with,
 *    so it costs one download, not two.
 */

const COLS = 7;
const ROWS = 8;
const TILES = COLS * ROWS;

const BEGIN = 0.5; // let the room settle before anything moves
const STAGGER = 0.028;
const TILE_DURATION = 1.0;
const ASSEMBLED = BEGIN + TILES * STAGGER + TILE_DURATION * 0.65;

/** Deterministic pseudo-random in [0,1) — stable across server/client. */
function jitter(index: number, salt: number) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function AssemblingCanvas({ work }: { work: Work }) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const src = workSrc(work.slug);

  /* Shards land in a scattered order rather than reading left-to-right,
     which would look like a wipe instead of an assembly. */
  const order = useMemo(() => {
    return Array.from({ length: TILES }, (_, i) => i)
      .map((i) => ({ i, key: jitter(i, 3) }))
      .sort((a, b) => a.key - b.key)
      .reduce<number[]>((acc, { i }, position) => {
        acc[i] = position;
        return acc;
      }, []);
  }, []);

  /* Anyone who asked for less motion gets the painting, plainly. */
  if (reduced) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${work.title}, ${work.year}. ${work.medium}.`}
        width={work.width}
        height={work.height}
        className="hung h-full w-full object-contain"
      />
    );
  }

  return (
    /* Sizing is the parent's job — this fills whatever box it is given,
       so the hero can be width-driven on phones and height-driven on
       wide screens without this component knowing about either. */
    <div
      className="relative h-full w-full"
      role="img"
      aria-label={`${work.title}, ${work.year}. ${work.medium}.`}
    >
      {/* The shards ------------------------------------------------ */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: TILES }, (_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);

          /* Thrown in from a random direction, tilted, slightly small. */
          const dx = (jitter(i, 1) - 0.5) * 260;
          const dy = (jitter(i, 2) - 0.5) * 200;
          const rot = (jitter(i, 4) - 0.5) * 26;

          return (
            <motion.div
              key={i}
              className="absolute will-change-transform"
              style={{
                /* +1px stops hairline seams between neighbours while
                   the shards are still in flight. */
                width: `calc(${100 / COLS}% + 1px)`,
                height: `calc(${100 / ROWS}% + 1px)`,
                left: `${(col * 100) / COLS}%`,
                top: `${(row * 100) / ROWS}%`,
                backgroundImage: `url(${src})`,
                backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                backgroundPosition: `${(col / (COLS - 1)) * 100}% ${
                  (row / (ROWS - 1)) * 100
                }%`,
              }}
              initial={{ opacity: 0, x: dx, y: dy, rotate: rot, scale: 0.82 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              transition={{
                duration: TILE_DURATION,
                delay: BEGIN + order[i] * STAGGER,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}
      </div>

      {/* The clean plate, cross-fading over the assembled grid ------ */}
      <motion.img
        src={src}
        alt=""
        width={work.width}
        height={work.height}
        aria-hidden
        className="absolute inset-0 h-full w-full object-fill"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: ASSEMBLED, ease: "easeOut" }}
      />

      {/* One pass of light across the finished surface -------------- */}
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2.2, delay: ASSEMBLED + 0.5, times: [0, 0.4, 1] }}
      >
        <motion.div
          className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-12"
          style={{
            background:
              "linear-gradient(100deg, transparent, rgba(255,247,232,0.28), transparent)",
          }}
          initial={{ x: "-40%" }}
          animate={{ x: "420%" }}
          transition={{
            duration: 2.2,
            delay: ASSEMBLED + 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </motion.div>

      {/* The shadow that makes it sit on a wall, not on the screen */}
      <div className="hung pointer-events-none absolute inset-0" />
    </div>
  );
}

export { ASSEMBLED };
