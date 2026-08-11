"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { works, workSrc } from "@/content/works";
import { freezeScroll, unfreezeScroll } from "@/lib/lenis";

type Ctx = { open: (slug: string) => void; close: () => void };
const LightboxCtx = createContext<Ctx>({ open: () => {}, close: () => {} });

export const useLightbox = () => useContext(LightboxCtx);

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const open = useCallback((slug: string) => {
    const i = works.findIndex((w) => w.slug === slug);
    if (i >= 0) setIndex(i);
  }, []);

  const close = useCallback(() => setIndex(null), []);

  const step = useCallback((dir: 1 | -1) => {
    setZoomed(false);
    setIndex((i) => (i === null ? i : (i + dir + works.length) % works.length));
  }, []);

  /* Freeze the page behind the overlay, and restore on close. */
  useEffect(() => {
    if (index === null) return;
    freezeScroll();
    return () => unfreezeScroll();
  }, [index]);

  /* Keyboard: the gallery attendant. */
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      /* Escape steps back one level: zoomed → fitted → closed. */
      if (e.key === "Escape") {
        if (zoomed) setZoomed(false);
        else close();
      }
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === " ") {
        e.preventDefault();
        setZoomed((z) => !z);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, zoomed, close, step]);

  const work = index === null ? null : works[index];
  const ctx = useMemo(() => ({ open, close }), [open, close]);

  return (
    <LightboxCtx.Provider value={ctx}>
      {children}

      <AnimatePresence>
        {work && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-90 flex flex-col bg-void/97 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={`${work.title}, ${work.year}`}
          >
            {/* Top bar ------------------------------------------------ */}
            <div className="flex items-start justify-between gap-6 px-6 py-5 md:px-10">
              <div className="min-w-0">
                <h2 className="display truncate text-2xl md:text-3xl">
                  {work.title}
                </h2>
                <p className="label mt-1.5">
                  {work.year} · {work.medium}
                </p>
              </div>
              <button
                onClick={close}
                className="label shrink-0 cursor-pointer border border-rule px-4 py-2 transition-colors hover:border-paper hover:text-paper"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            {/* The canvas --------------------------------------------- */}
            <div
              className={`relative flex-1 overflow-auto ${
                zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => setZoomed((z) => !z)}
            >
              <motion.div
                key={work.slug}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={
                  zoomed
                    ? "min-h-full w-max min-w-full"
                    : "flex h-full items-center justify-center px-6 pb-4 md:px-16"
                }
              >
                <Image
                  src={workSrc(work.slug)}
                  alt={`${work.title}, ${work.year}. ${work.medium}.`}
                  width={work.width}
                  height={work.height}
                  quality={92}
                  priority
                  className={
                    zoomed
                      ? "h-auto w-auto max-w-none"
                      : "hung max-h-full w-auto object-contain"
                  }
                  style={
                    zoomed
                      ? { height: "160vh", maxWidth: "none" }
                      : { maxHeight: "100%" }
                  }
                  sizes="100vw"
                />
              </motion.div>
            </div>

            {/* Bottom bar --------------------------------------------- */}
            <div className="flex items-center justify-between gap-6 border-t border-rule/60 px-6 py-4 md:px-10">
              <button
                onClick={() => step(-1)}
                className="label cursor-pointer transition-colors hover:text-paper"
                aria-label="Previous work"
              >
                ← Prev
              </button>

              <p className="label hidden text-center md:block">
                {zoomed ? "Click to fit" : "Click to inspect the surface"}
              </p>

              <p className="label tabular-nums">
                {String((index ?? 0) + 1).padStart(2, "0")} /{" "}
                {String(works.length).padStart(2, "0")}
              </p>

              <button
                onClick={() => step(1)}
                className="label cursor-pointer transition-colors hover:text-paper"
                aria-label="Next work"
              >
                Next →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxCtx.Provider>
  );
}
