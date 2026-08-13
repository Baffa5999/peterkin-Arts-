"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { artist } from "@/content/artist";
import { useHydrated, useMediaQuery } from "@/lib/hooks";

/**
 * THE COLD OPEN — a short film.
 *
 * One looping clip cut from five paintings: a push-in on the graphite
 * suit portrait, a drift across the ankara patchwork, a macro pass over
 * mark-making, a tilt up the saxophone figure, and a pull-back off the
 * dancer. Four are real camera moves over the actual scans; the last is
 * generated, and only because it is an abstract.
 *
 * The rules this player follows, and why:
 *
 * • The POSTER is the load-bearing part. It is a real frame of the film
 *   and shows instantly. It is also exactly what iOS Low Power Mode
 *   users see, because that mode refuses autoplay outright — so it has
 *   to read as a deliberate still, never as a loading state.
 *
 * • muted + playsInline + autoPlay is the only combination browsers
 *   allow to start on its own. The clip is silent at the file level —
 *   there is no audio track at all, which also keeps it smaller.
 *
 * • The SOURCE IS CHOSEN ON THE CLIENT: 1080p (3.2MB) on wide screens,
 *   720p (1.4MB) on phones. It is set in an effect rather than at
 *   render so the server and client agree on the first paint.
 *
 * • It PAUSES off-screen and on hidden tabs. A looping video running
 *   forever behind a section the visitor has left is a battery cost,
 *   and much of this audience is on a phone.
 *
 * • prefers-reduced-motion gets the poster and no video element at all.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.2 });

  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wide = useMediaQuery("(min-width: 768px)");

  const hydrated = useHydrated();

  /* Held back until the client has measured the viewport — see
     useHydrated. 1080p is 3.2MB, 720p is 1.4MB. */
  const src =
    !hydrated || reduced
      ? null
      : wide
        ? "/film/hero-1080.mp4"
        : "/film/hero-720.mp4";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const filmScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const filmOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  /* Play only while it is actually being watched. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const sync = () => {
      const shouldPlay = inView && !document.hidden;
      if (shouldPlay) void video.play().catch(() => {});
      else video.pause();
    };

    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [inView, src]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-void md:block"
      aria-label="Introduction"
    >
      {/* The film ------------------------------------------------- */}
      <motion.div
        style={{ scale: filmScale, opacity: filmOpacity }}
        /* On phones the film takes all the height left above the title
           rather than sitting as a 16:9 band with dead space beneath —
           object-cover crops the widescreen frame to a tall window. */
        className="relative w-full min-h-0 flex-1 md:absolute md:inset-0 md:h-full md:flex-none"
      >
        {reduced ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/film/poster.jpg"
            alt="Peterkin Arts — a portrait in graphite"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={src ?? undefined}
            poster="/film/poster.jpg"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-label="Five paintings by Peterkin Arts"
            /* Absolute rather than h-full: as a flex child the
               percentage height collapsed and the film letterboxed
               into a band with dead space under it on phones. */
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Grade: hold the edges down so the type stays readable and
            the film sits in the same dark room as the rest of the site. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 55% 45%, transparent 0%, rgba(7,6,5,0.30) 60%, rgba(7,6,5,0.80) 100%)",
          }}
        />
        {/* The type sits over whichever painting happens to be on screen,
            including the bright ankara patchwork, so the scrim has to be
            strong enough to carry the label at its lowest contrast. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-void via-void/80 to-transparent" />
      </motion.div>

      {/* Title card ------------------------------------------------ */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-20 shrink-0 px-6 pt-8 pb-12 md:absolute md:inset-x-0 md:bottom-0 md:px-14 md:pt-0 md:pb-20"
      >
        <motion.p
          className="label"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {artist.discipline} — {artist.based}
        </motion.p>

        <motion.h1
          className="display mt-3 text-[clamp(2.8rem,9vw,7.5rem)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Peterkin <span className="text-brass italic">Arts</span>
        </motion.h1>

        <motion.p
          className="mt-4 max-w-md font-display text-lg leading-snug text-ash italic md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 1.6 }}
        >
          {artist.tagline}
        </motion.p>
      </motion.div>
    </section>
  );
}
