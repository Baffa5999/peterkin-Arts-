"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { works, series, years, workSrc, workMeta } from "@/content/works";
import { useLightbox } from "./Lightbox";

type Filter = { kind: "all" } | { kind: "series"; value: string } | { kind: "year"; value: number };

/**
 * THE CATALOGUE
 *
 * The complete body of work, filterable by series and year. After the
 * choreography of the sections above, this is deliberately calm — a
 * clean masonry-ish grid that lets someone actually browse.
 */
export default function Catalogue() {
  const [filter, setFilter] = useState<Filter>({ kind: "all" });
  const { open } = useLightbox();

  const visible = useMemo(() => {
    if (filter.kind === "all") return works;
    if (filter.kind === "series")
      return works.filter((w) => w.series === filter.value);
    return works.filter((w) => w.year === filter.value);
  }, [filter]);

  const isActive = (f: Filter) =>
    f.kind === filter.kind &&
    (f.kind === "all" ||
      (filter.kind !== "all" && String(filter.value) === String(f.value)));

  const chip = (label: string, f: Filter) => (
    <button
      key={label}
      onClick={() => setFilter(f)}
      className={`label cursor-pointer border px-4 py-2 transition-colors ${
        isActive(f)
          ? "border-paper text-paper"
          : "border-rule hover:border-ash hover:text-ash"
      }`}
      aria-pressed={isActive(f)}
    >
      {label}
    </button>
  );

  return (
    <section
      id="catalogue"
      className="bg-void px-6 py-28 md:px-14 md:py-40"
      aria-label="Full catalogue"
    >
      <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="label">Catalogue</p>
          <h2 className="display mt-4 text-[clamp(2.2rem,5vw,4rem)]">
            All works
          </h2>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {chip("All", { kind: "all" })}
          {series.map((s) => chip(s, { kind: "series", value: s }))}
          {years.map((y) => chip(String(y), { kind: "year", value: y }))}
        </div>
      </div>

      <motion.div layout className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {visible.map((work) => (
            <motion.button
              key={work.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => open(work.slug)}
              className="group mb-6 block w-full cursor-zoom-in break-inside-avoid text-left"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={workSrc(work.slug)}
                  alt={`${work.title}, ${work.year}. ${work.medium}.`}
                  width={work.width}
                  height={work.height}
                  quality={80}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-auto w-full brightness-[0.82] transition-all duration-[900ms] ease-out group-hover:scale-[1.03] group-hover:brightness-105"
                  style={{ backgroundColor: work.tint }}
                />
              </div>

              <div className="mt-3.5 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl text-paper">
                  {work.title}
                </h3>
                <p className="label shrink-0">{work.year}</p>
              </div>
              <p className="label mt-1 normal-case tracking-normal">
                {workMeta(work)}
              </p>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="py-20 text-center font-display text-2xl text-dust italic">
          Nothing catalogued under that yet.
        </p>
      )}
    </section>
  );
}
