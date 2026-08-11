"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { featuredWorks, workSrc, workMeta, type Work } from "@/content/works";
import { useCinematic } from "@/lib/hooks";
import { useLightbox } from "./Lightbox";

/**
 * THE INTERVIEW CUTS
 *
 * Each featured work gets a viewport of its own. The painting pins and
 * holds while its title, year and the artist's line on it travel past —
 * the visual grammar of a documentary talking over the artwork.
 *
 * On phones this collapses to an ordinary stacked card. Pinning a
 * 100vh section under a thumb is how cinematic sites earn their
 * reputation for being unusable.
 */
function Plate({ work, index }: { work: Work; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const cinematic = useCinematic();
  const { open } = useLightbox();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* The canvas breathes: a slow push-in across the whole pass. */
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 0.96]);
  /* Light rakes across it — dim on approach, lit at centre, dim leaving. */
  const brightness = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.45, 1, 0.45],
  );
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  /* The caption drifts against the painting — parallax gives depth. */
  const captionY = useTransform(scrollYProgress, [0, 1], ["70%", "-70%"]);
  const captionOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.65, 0.85],
    [0, 1, 1, 0],
  );

  const flip = index % 2 === 1;

  if (!cinematic) {
    /* Reduced / mobile: a plain, respectful card. */
    return (
      <div className="px-6 py-14">
        <button
          onClick={() => open(work.slug)}
          className="block w-full cursor-pointer text-left"
        >
          <Image
            src={workSrc(work.slug)}
            alt={`${work.title}, ${work.year}. ${work.medium}.`}
            width={work.width}
            height={work.height}
            sizes="100vw"
            className="hung h-auto w-full"
            style={{ backgroundColor: work.tint }}
          />
          <h3 className="display mt-6 text-3xl">{work.title}</h3>
          <p className="label mt-2">{workMeta(work, true)}</p>
          {work.note && (
            <p className="mt-4 max-w-prose font-display text-lg leading-relaxed text-ash italic">
              {work.note}
            </p>
          )}
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Spotlight pool on the wall behind the canvas */}
        <div className="spotlight absolute inset-0" />

        <div
          className={`relative z-10 mx-auto flex w-full max-w-[1500px] items-center gap-10 px-10 lg:gap-20 lg:px-16 ${
            flip ? "flex-row-reverse" : ""
          }`}
        >
          {/* The canvas */}
          <motion.button
            onClick={() => open(work.slug)}
            style={{ scale, filter }}
            className="group relative block shrink-0 cursor-zoom-in"
            aria-label={`View ${work.title} full screen`}
          >
            <Image
              src={workSrc(work.slug)}
              alt={`${work.title}, ${work.year}. ${work.medium}.`}
              width={work.width}
              height={work.height}
              quality={88}
              sizes="(max-width: 1024px) 60vh, 70vh"
              className="hung h-[62vh] w-auto lg:h-[74vh]"
              style={{ backgroundColor: work.tint }}
            />
          </motion.button>

          {/* The caption, travelling */}
          <motion.div
            style={{ y: captionY, opacity: captionOpacity }}
            className="max-w-md"
          >
            <p className="label">
              {String(index + 1).padStart(2, "0")}
              {work.series ? ` — ${work.series}` : ""}
            </p>

            <h3 className="display mt-5 text-[clamp(2.4rem,4.4vw,4.5rem)]">
              {work.title}
            </h3>

            <p className="label mt-5">
              {workMeta(work, true)}
              {work.status && work.status !== "available"
                ? ` · ${work.status}`
                : ""}
            </p>

            {work.note && (
              <p className="mt-8 border-l border-rule pl-6 font-display text-xl leading-relaxed text-ash italic">
                {work.note}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedSequence() {
  return (
    <section id="works" className="relative bg-room" aria-label="Selected works">
      <div className="px-6 pt-28 pb-6 md:px-14">
        <p className="label">Selected works</p>
      </div>
      {featuredWorks.map((work, i) => (
        <Plate key={work.slug} work={work} index={i} />
      ))}
    </section>
  );
}
