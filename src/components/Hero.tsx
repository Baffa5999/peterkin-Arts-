"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { artist } from "@/content/artist";
import { useHydrated, useMediaQuery } from "@/lib/hooks";

/**
 * THE OPENING
 *
 * Restructured around what a first-time visitor needs, in order: who he
 * is, what he makes, what to do next — and only then the work.
 *
 * The film that used to fill this section now sits BENEATH the copy
 * rather than behind it. Text over moving pictures reads as atmosphere;
 * text above them reads as a proposition, and this section has to do
 * the second job. The film still opens on the strongest portrait, so the
 * "strongest work underneath" is the film's first shot.
 *
 * Player rules, unchanged and still load-bearing:
 *
 * • Two cuts. 16:9 for wide screens, 4:5 for phones, because a single
 *   widescreen cut lost 64% of its width to object-cover in a tall
 *   frame — measured, which is why paintings appeared with their sides
 *   missing.
 * • object-contain, never cover, so nothing is cropped by CSS. The
 *   letterbox is invisible: the film's wall is the page's own black.
 * • muted + playsInline + autoPlay is the only combination browsers
 *   allow to start unprompted. The file is silent — no audio track.
 * • The poster carries the load when autoplay is refused, which iOS Low
 *   Power Mode does outright.
 * • Playback pauses off-screen and on hidden tabs; prefers-reduced-motion
 *   gets the poster and no video element at all.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.15 });

  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  /* The film's shape is chosen at 1024px, not at the 768px layout
     breakpoint. A portrait tablet is 3:4 — far closer to the 4:5 cut
     than to 16:9, which would sit in it as a thin band. */
  const landscapeCut = useMediaQuery("(min-width: 1024px)");
  const hydrated = useHydrated();

  const cut = landscapeCut ? "hero-1080" : "hero-portrait";
  const src = !hydrated || reduced ? null : `/film/${cut}.mp4`;
  const poster = `/film/${cut}-poster.jpg`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    const sync = () => {
      if (inView && !document.hidden) void video.play().catch(() => {});
      else video.pause();
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [inView, src]);

  return (
    <section
      ref={ref}
      /* overflow-hidden because the spotlight glow deliberately bleeds
         18% past its parent; without clipping here it pushed the page
         38px wider than the viewport and produced a horizontal scroll. */
      className="relative overflow-hidden bg-void px-6 pt-28 pb-16 md:px-14 md:pt-36 md:pb-20"
      aria-label="Introduction"
    >
      {/* Who, what, and what to do next -------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-5xl"
      >
        <p className="label">{artist.name}</p>

        <h1 className="display mt-5 max-w-4xl text-[clamp(2.5rem,7.5vw,5.75rem)]">
          {artist.headline}
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-relaxed text-ash md:text-lg">
          {artist.subline}
        </p>

        {/* Two doors: see the work, or start a commission. The gold one
            is the commission — it is the action worth money. */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a
            href="#works"
            className="inline-flex min-h-13 items-center justify-center border border-rule px-7 py-3.5 transition-colors duration-300 hover:border-paper"
          >
            <span className="label text-paper">View the Collection</span>
          </a>

          <a
            href="#commission"
            className="inline-flex min-h-13 items-center justify-center bg-brass px-7 py-3.5 transition-colors duration-300 hover:bg-brass-lit"
          >
            <span className="label text-void">Commission a Portrait</span>
          </a>
        </div>
      </motion.div>

      {/* The work, underneath ------------------------------------ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.3 }}
        className="relative mx-auto mt-14 max-w-5xl md:mt-20"
      >
        <div className="spotlight absolute inset-0" />

        {reduced ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt="A graphite portrait by Peterkin Arts"
            className="relative mx-auto h-auto w-full max-w-3xl object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            src={src ?? undefined}
            poster={poster}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-label="Five paintings by Peterkin Arts"
            className="relative mx-auto h-auto max-h-[76svh] w-full max-w-3xl object-contain"
          />
        )}
      </motion.div>
    </section>
  );
}
