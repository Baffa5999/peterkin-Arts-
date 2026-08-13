"use client";

import { useCallback, useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * False during SSR and the hydration render, true afterwards.
 *
 * Used to hold back the hero video's `src` until the client knows the
 * viewport. Setting it during hydration would pick the phone encode
 * from the server snapshot and then swap to the desktop one a tick
 * later — two downloads for one video.
 */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/**
 * SSR-safe media query.
 *
 * Implemented with useSyncExternalStore rather than useState + useEffect:
 * a media query IS an external store, and subscribing to it this way
 * avoids the cascading extra render that setting state inside an effect
 * would cause on every mount.
 *
 * The server snapshot is always `false`, so the first paint is the
 * conservative one — no cinematic layout is rendered until the client
 * has confirmed the viewport can take it.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * True when the heavy scroll choreography should run.
 *
 * The pinned sequences and the horizontal wall are wonderful on a
 * laptop and miserable on a phone, where they fight the user's thumb.
 * Below 768px — and for anyone who asked for reduced motion — the site
 * falls back to ordinary vertical scrolling with simple fades.
 */
export function useCinematic() {
  const wide = useMediaQuery("(min-width: 768px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  return wide && !reduced;
}
