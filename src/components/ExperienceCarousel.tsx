"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { OrgLogo } from "@/components/OrgLogo";
import type { Entry } from "@/data/cv";
import { t, type Dict } from "@/i18n/dictionaries";

/**
 * Experience cards in a sideways-scrolling row.
 * - Phone: swipe (native CSS scroll-snap, no library)
 * - Everyone: ◀ ▶ buttons and dots
 * - Keyboard: ← → arrow keys when the carousel has focus
 * Texts come in as props (already in the visitor's language): this runs in the browser.
 */
export function ExperienceCarousel({ entries, text }: { entries: (Entry & { dates: string })[]; text: Dict["experience"] }) {
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
    "inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface transition hover:border-foreground/30 disabled:opacity-30 disabled:hover:border-border";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={text.region}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(Math.min(last, index + 1));
        if (e.key === "ArrowLeft") goTo(Math.max(0, index - 1));
      }}
    >
      <div
        ref={track}
        onScroll={onScroll}
        tabIndex={0}
        aria-label={text.track}
        // "relative" makes card.offsetLeft measured from the track itself
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-3xl pb-2 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-scrollbar]:hidden"
      >
        {entries.map((entry, i) => (
          <article
            key={entry.slug}
            role="group"
            aria-roledescription="slide"
            aria-label={t(text.slide, { i: i + 1, n: entries.length, org: entry.org })}
            className="w-[88%] shrink-0 snap-start rounded-3xl border border-border bg-surface p-6 shadow-sm md:w-full md:p-10"
          >
            {/* Top row: logo on the left, dates (+ "Current") on the right */}
            <div className="flex items-start justify-between gap-3">
              <OrgLogo src={entry.logo} org={entry.org} size="lg" />
              <div className="flex flex-wrap items-center justify-end gap-2 pt-1 text-right font-mono text-xs text-muted">
                {entry.end === null && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-accent">{text.current}</span>
                )}
                <span>{entry.dates}</span>
              </div>
            </div>
            <h3 className="mt-5 font-display text-2xl leading-tight md:text-4xl">{entry.title}</h3>
            <p className="mt-2 font-medium text-accent">
              {entry.org} <span className="font-normal text-muted">· {entry.location}</span>
            </p>
            <ul className="mt-6 list-disc space-y-2 pl-5 leading-relaxed marker:text-accent">
              {entry.highlights.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {entry.tags && (
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-xs text-muted">
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
        <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label={text.previous} className={arrow}>
          <ArrowLeft className="size-5" strokeWidth={1.8} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1">
          {entries.map((entry, i) => (
            <button
              key={entry.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={t(text.goTo, { org: entry.org })}
              aria-current={i === index}
              // 44px tap area, small visible dot inside
              className="flex h-11 w-7 items-center justify-center"
            >
              <span className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-accent" : "w-2 bg-muted/35"}`} />
            </button>
          ))}
        </div>

        <button type="button" onClick={() => goTo(index + 1)} disabled={index === last} aria-label={text.next} className={arrow}>
          <ArrowRight className="size-5" strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>

      {/* Screen readers hear "2 of 5" when the card changes */}
      <p className="sr-only" aria-live="polite">
        {t(text.announce, { i: index + 1, n: entries.length, title: entries[index].title, org: entries[index].org })}
      </p>
    </div>
  );
}
