import type Lenis from "lenis";

/**
 * A single shared handle on the smooth-scroll instance, so overlays
 * (the lightbox) can freeze the page behind them without prop-drilling
 * the instance through the whole tree.
 */
export const scroller: { current: Lenis | null } = { current: null };

export function freezeScroll() {
  scroller.current?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unfreezeScroll() {
  scroller.current?.start();
  document.documentElement.style.overflow = "";
}
