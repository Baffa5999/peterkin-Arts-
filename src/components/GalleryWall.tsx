"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { works, workSrc } from "@/content/works";
import { useCinematic } from "@/lib/hooks";
import { useLightbox } from "./Lightbox";

/**
 * THE TRACKING SHOT
 *
 * Vertical scroll drives a lateral camera move down a wall of hung
 * work. The section pins for its own height; the strip translates
 * across. Paintings are set at varying heights so the wall reads as
 * hung by a person rather than laid out by a grid.
 *
 * Mobile gets a native horizontal swipe strip instead — same content,
 * no hijacked scroll.
 */
export default function GalleryWall() {
  const ref = useRef<HTMLDivElement>(null);
  const cinematic = useCinematic();
  const { open } = useLightbox();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* Travel just far enough to clear the strip, plus breathing room. */
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-78%"]);

  if (!cinematic) {
    return (
      <section className="bg-wall py-20" aria-label="The wall">
        <p className="label px-6 pb-8">The wall — swipe</p>
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4">
          {works.map((work) => (
            <button
              key={work.slug}
              onClick={() => open(work.slug)}
              className="w-[78vw] shrink-0 snap-center cursor-pointer text-left"
            >
              <Image
                src={workSrc(work.slug)}
                alt={`${work.title}, ${work.year}`}
                width={work.width}
                height={work.height}
                sizes="78vw"
                className="hung h-auto w-full"
                style={{ backgroundColor: work.tint }}
              />
              <p className="label mt-3">
                {work.title} · {work.year}
              </p>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[320vh] bg-wall" aria-label="The wall">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        {/* Sits clear of the fixed nav bar, which is showing by now. */}
        <p className="label absolute top-24 left-14">The wall</p>

        <motion.div style={{ x }} className="flex items-center gap-[5vw] pl-14">
          {works.map((work, i) => {
            /* Hang heights vary — a wall, not a spreadsheet. */
            const height = [62, 74, 54, 68, 58, 72, 50, 66][i % 8];
            return (
              <button
                key={work.slug}
                onClick={() => open(work.slug)}
                className="group relative shrink-0 cursor-zoom-in"
                style={{ height: `${height}vh` }}
                aria-label={`View ${work.title} full screen`}
              >
                <Image
                  src={workSrc(work.slug)}
                  alt={`${work.title}, ${work.year}. ${work.medium}.`}
                  width={work.width}
                  height={work.height}
                  quality={82}
                  sizes="50vw"
                  className="hung h-full w-auto object-contain transition-[filter] duration-700 group-hover:brightness-110"
                  style={{ backgroundColor: work.tint }}
                />
                <span className="label absolute -bottom-9 left-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {work.title} · {work.year}
                </span>
              </button>
            );
          })}

          {/* End card — the wall runs out, the room continues */}
          <div className="flex h-[40vh] w-[35vw] shrink-0 items-center">
            <p className="font-display text-3xl leading-snug text-dust italic">
              …and the rest of the catalogue below.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
