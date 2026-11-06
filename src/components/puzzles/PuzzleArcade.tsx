"use client";

import { useState } from "react";
import type { Dict } from "@/i18n/dictionaries";
import type { PathMode } from "@/lib/puzzles/paths";
import { PathGame } from "./PathGame";

const MODES: PathMode[] = ["maze", "dots", "colors", "triangles"];

/**
 * The line puzzles behind tabs, one tab per rule. All panels stay mounted (just hidden),
 * so switching tabs never loses your progress or your time.
 */
export function PuzzleArcade({ text }: { text: Dict["puzzles"] }) {
  const [tab, setTab] = useState<PathMode>("maze");

  return (
    <div>
      <div role="tablist" aria-label={text.choose} className="flex flex-wrap gap-2">
        {MODES.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setTab(id)}
            className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition ${
              tab === id ? "border-accent bg-accent font-semibold text-on-accent" : "border-border bg-surface hover:border-foreground/30"
            }`}
          >
            {text.modes[id].name}
          </button>
        ))}
      </div>

      {MODES.map((id) => (
        <section
          key={id}
          role="tabpanel"
          id={`panel-${id}`}
          aria-labelledby={`tab-${id}`}
          hidden={tab !== id}
          className="mt-5 rounded-3xl border border-border bg-surface/60 p-3 shadow-sm md:p-8"
        >
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted md:text-base">{text.modes[id].rules}</p>
          <PathGame mode={id} text={text} />
        </section>
      ))}
    </div>
  );
}
