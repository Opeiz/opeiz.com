"use client";

import { useEffect, useRef, useState } from "react";
import { formatRange, type Entry } from "@/data/cv";

/**
 * Experience cards in a sideways-scrolling row.
 * - Phone: swipe (native CSS scroll-snap, no library)
 * - Everyone: ◀ ▶ buttons and dots
 * - Keyboard: ← → arrow keys when the carousel has focus
 */
export function ExperienceCarousel({ entries }: { entries: Entry[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const last = entries.length - 1;

  /** Scroll so that card `i` is at the start of the row. */
  function goTo(i: number) {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: card.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
  }

  // When the window resizes (or a phone rotates), cards change width but the scroll
  // position doesn't, leaving the row stuck between two cards. Jump back to the current one.
  useEffect(() => {
    const onResize = () => {
      const card = track.current?.children[index] as HTMLElement | undefined;
      if (card) track.current?.scrollTo({ left: card.offsetLeft, behavior: "instant" });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index]);

  /** While scrolling (buttons OR swipe), work out which card is in front. */
  function onScroll() {
    const el = track.current;
    const first = el?.children[0] as HTMLElement | undefined;
    if (!el || !first) return;
    const step = first.offsetWidth + 16; // card width + gap (gap-4 = 16px)
    setIndex(Math.min(last, Math.round(el.scrollLeft / step)));
  }

  const arrow =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 text-lg hover:bg-foreground/5 disabled:opacity-30";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Work experience"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(Math.min(last, index + 1));
        if (e.key === "ArrowLeft") goTo(Math.max(0, index - 1));
      }}
    >
      <div
        ref={track}
        onScroll={onScroll}
        tabIndex={0}
        aria-label="Experience cards. Use the arrow keys to move between them."
        // "relative" makes card.offsetLeft measured from the track itself
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-2xl pb-2 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-scrollbar]:hidden"
      >
        {entries.map((entry, i) => (
          <article
            key={entry.slug}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${entries.length}: ${entry.org}`}
            className="w-[88%] shrink-0 snap-start rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-5 md:w-full md:p-8"
          >
            <div className="flex flex-wrap items-center gap-2 text-sm opacity-70">
              <span>{formatRange(entry.start, entry.end)}</span>
              {entry.end === null && (
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent opacity-100">
                  Current
                </span>
              )}
            </div>
            <h3 className="mt-2 text-xl font-semibold leading-snug md:text-2xl">{entry.title}</h3>
            <p className="mt-1 text-accent">
              {entry.org} <span className="opacity-60">· {entry.location}</span>
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
              {entry.highlights.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {entry.tags && (
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <li key={tag} className="rounded-md border border-foreground/15 px-2 py-0.5 text-xs">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous job" className={arrow}>
          ←
        </button>

        <div className="flex items-center gap-1">
          {entries.map((entry, i) => (
            <button
              key={entry.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${entry.org}`}
              aria-current={i === index}
              // 44px tap area, small visible dot inside
              className="flex h-11 w-7 items-center justify-center"
            >
              <span className={`h-2 rounded-full transition-all ${i === index ? "w-5 bg-accent" : "w-2 bg-foreground/25"}`} />
            </button>
          ))}
        </div>

        <button type="button" onClick={() => goTo(index + 1)} disabled={index === last} aria-label="Next job" className={arrow}>
          →
        </button>
      </div>

      {/* Screen readers hear "2 of 5" when the card changes */}
      <p className="sr-only" aria-live="polite">
        {`Job ${index + 1} of ${entries.length}: ${entries[index].title} at ${entries[index].org}`}
      </p>
    </div>
  );
}
