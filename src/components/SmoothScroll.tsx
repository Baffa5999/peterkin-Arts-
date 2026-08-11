"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scroller } from "@/lib/lenis";

/**
 * The dolly track.
 *
 * Lenis interpolates the native scroll position so the page glides
 * instead of stepping. Everything downstream — pinned sections,
 * parallax, the horizontal gallery wall — rides on this.
 *
 * Two deliberate exclusions:
 *   • anyone who has asked for reduced motion gets native scrolling
 *   • touch devices keep their native momentum, which is better than
 *     anything we can fake and avoids the "sticky scroll" feeling
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
    });

    scroller.current = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors should glide too, not jump.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.6 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      scroller.current = null;
    };
  }, []);

  return <>{children}</>;
}
