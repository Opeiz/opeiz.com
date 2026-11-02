"use client";

import { useSyncExternalStore } from "react";

/**
 * true when the screen matches a CSS media query, e.g. "(min-width: 768px)".
 * Updates live when the window is resized.
 *
 * The server can't see the screen, so it answers `false` (= phone, mobile-first).
 * After the page loads, the browser gives the real answer.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    // subscribe: tell React when the answer changes
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches, // browser answer
    () => false, // server answer
  );
}
