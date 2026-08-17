"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { works, workSrc, workMeta } from "@/content/works";
import { useLightbox } from "./Lightbox";

/**
 * WORKS
 *
 * Every piece, one grid, no filters. Replaces what used to be three
 * separate sections (a pinned featured sequence, a horizontal wall and
 * a filterable catalogue) that between them showed the same handful of
 * paintings three times over.
 *
 * Click any work to open it full screen.
 */
export default function Works() {
  const { open } = useLightbox();

  return (
    <section
      id="works"
      className="bg-void px-6 py-28 md:px-14 md:py-40"
      aria-label="Works"
    >
      <p className="label">Works</p>

      <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
        {works.map((work, i) => (
          <motion.button
            key={work.slug}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{
              duration: 0.8,
              delay: (i % 3) * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={() => open(work.slug)}
            className="group mb-6 block w-full cursor-zoom-in break-inside-avoid text-left"
          >
            <div className="relative overflow-hidden">
              <Image
                src={workSrc(work.slug)}
                alt={`${work.title}, ${work.year}. ${work.medium}.`}
                width={work.width}
                height={work.height}
                quality={82}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                /* No brightness filter: these are framed photographs with
                   white mounts, and dimming a white mount reads as dirty
                   paper rather than as atmosphere. */
                className="h-auto w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                style={{ backgroundColor: work.tint }}
              />
            </div>

            <div className="mt-3.5 flex items-baseline justify-between gap-4">
              <h3 className="font-display text-xl text-paper">{work.title}</h3>
              <p className="label shrink-0">{work.year}</p>
            </div>
            <p className="label mt-1 normal-case tracking-normal">
              {workMeta(work)}
            </p>

            {work.caption && (
              <p className="mt-3 font-display text-lg leading-snug text-paper">
                {work.caption}
              </p>
            )}

            {work.artistWord && (
              /* Word of the Artist. Set as a quotation with a rule down
                 the left so it reads as the artist speaking rather than
                 as more gallery copy. */
              <figure className="mt-3 border-l border-rule pl-4">
                <blockquote className="font-display text-base leading-relaxed text-ash italic">
                  &ldquo;{work.artistWord}&rdquo;
                </blockquote>
                <figcaption className="label mt-2">
                  Word of the Artist
                </figcaption>
              </figure>
            )}
          </motion.button>
        ))}
      </div>
    </section>
  );
}
