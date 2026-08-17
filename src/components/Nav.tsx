"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { artist, whatsappUrl } from "@/content/artist";
import { freezeScroll, unfreezeScroll } from "@/lib/lenis";

const items = [
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/**
 * CHROME — a monogram, and three lines.
 *
 * The bar itself is always there so a visitor can navigate from the
 * first second, but it stays transparent over the opening film and only
 * takes a background once they have scrolled past it. Nothing is drawn
 * across the cold open that does not need to be.
 *
 * The menu button replaces the row of inline links that used to sit
 * here. Three sections is few enough to list, but the links were
 * fighting the film for attention at the top of the page and wrapping
 * to two lines on a 390px handset. A single button is quieter, and the
 * overlay it opens has room for the artist's contact details as well —
 * so the menu answers "how do I reach him" without a scroll.
 */
export default function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 80));

  const close = useCallback(() => setOpen(false), []);

  /* Freeze the page behind the overlay, and let Escape dismiss it. */
  useEffect(() => {
    if (!open) return;
    freezeScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unfreezeScroll();
    };
  }, [open, close]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-80 transition-colors duration-500 ${
          scrolled && !open
            ? "border-b border-rule/50 bg-void/75 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 md:px-10">
          <a
            href="#top"
            onClick={close}
            className="flex items-center gap-3 transition-opacity hover:opacity-70"
            aria-label={`${artist.name} — back to top`}
          >
            {/* The monogram alone: the full lockup contains the wordmark,
                which would read twice beside the text label. Forced to
                white because the logo's black half disappears on a
                near-black bar, leaving a broken ring. */}
            <Image
              src="/peterkin-monogram.png"
              alt=""
              width={380}
              height={240}
              className="h-6 w-auto brightness-0 invert"
              priority
            />
            <span className="label hidden text-paper sm:inline">
              {artist.name}
            </span>
          </a>

          {/* Three lines. The middle one shortens on hover so the button
              has some life without becoming a toy. */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="group -mr-1 flex cursor-pointer flex-col items-end gap-[5px] p-2"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="block h-px w-6 bg-paper"
            />
            <motion.span
              animate={open ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="block h-px w-4 bg-paper transition-[width] duration-300 group-hover:w-6"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="block h-px w-6 bg-paper"
            />
          </button>
        </div>
      </header>

      {/* The overlay ------------------------------------------------ */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-70 flex flex-col justify-between bg-void/97 px-6 pt-28 pb-10 backdrop-blur-xl md:px-14 md:pb-14"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <nav className="flex flex-col gap-2 md:gap-4">
              {items.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08 + i * 0.07,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="display w-fit text-[clamp(2.8rem,11vw,6rem)] text-paper transition-colors duration-300 hover:text-brass"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            {/* His details, so the menu answers the practical question
                as well as the navigational one. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="flex flex-col gap-6 border-t border-rule pt-7 md:flex-row md:items-end md:justify-between"
            >
              <div className="flex flex-col gap-2">
                <p className="label">Enquiries</p>
                <a
                  href={`mailto:${artist.contact.email}`}
                  className="font-display text-lg break-words text-paper transition-colors hover:text-brass md:text-xl"
                >
                  {artist.contact.email}
                </a>
                {artist.contact.phone && (
                  <a
                    href={`tel:${artist.contact.phone.replace(/[^\d+]/g, "")}`}
                    className="font-display text-lg text-ash transition-colors hover:text-paper md:text-xl"
                  >
                    {artist.contact.phone}
                  </a>
                )}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label mt-1 w-fit border-b border-rule pb-1 transition-colors hover:border-brass hover:text-brass"
                >
                  Message on WhatsApp
                </a>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <p className="label">{artist.based}</p>
                {artist.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label transition-colors hover:text-paper"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
