"use client";

import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { artist } from "@/content/artist";

const items = [
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/**
 * Chrome arrives late and quietly. Nothing is drawn over the cold open;
 * the bar fades in only once the viewer has left the first frame, and
 * hides again if they scroll back up into it.
 */
export default function Nav() {
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setShown(y > (typeof window !== "undefined" ? window.innerHeight * 0.85 : 800));
  });

  return (
    <motion.header
      initial={false}
      animate={{ y: shown ? 0 : -80, opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-80 border-b border-rule/50 bg-void/75 backdrop-blur-md"
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#top"
          className="flex items-center gap-3 transition-opacity hover:opacity-70"
          aria-label={`${artist.name} — back to top`}
        >
          {/* The monogram alone — the full lockup already contains the
              wordmark, which would read twice beside the text label.
              Forced to white: the logo's black half disappears on a
              near-black bar, leaving a broken ring. */}
          <Image
            src="/peterkin-monogram.png"
            alt=""
            width={380}
            height={240}
            className="h-6 w-auto brightness-0 invert"
            priority
          />
          {/* The wordmark is dropped on phones — four section links plus
              the name will not fit across 390px without wrapping. */}
          <span className="label hidden text-paper sm:inline">
            {artist.name}
          </span>
        </a>

        <nav className="ml-5 flex gap-4 sm:gap-6 md:gap-9" aria-label="Sections">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="label transition-colors hover:text-paper"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
