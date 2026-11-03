"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { Dict } from "@/i18n/dictionaries";
import { LightUpGame } from "./LightUpGame";
import { SudokuGame } from "./SudokuGame";

type Tab = "sudoku" | "killer" | "lightup";
const TABS: Tab[] = ["sudoku", "killer", "lightup"];

/**
 * The 3 puzzles behind tabs. All 3 stay mounted (just hidden), so switching tabs
 * never loses your progress or your time.
 */
export function PuzzleArcade({ text }: { text: Dict["puzzles"] }) {
  const [tab, setTab] = useState<Tab>("sudoku");

  return (
    <div>
      <div role="tablist" aria-label={text.choose} className="flex flex-wrap gap-2">
        {TABS.map((id) => (
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
            {text.games[id].name}
          </button>
        ))}
      </div>

      {TABS.map((id) => (
        <section
          key={id}
          role="tabpanel"
          id={`panel-${id}`}
          aria-labelledby={`tab-${id}`}
          hidden={tab !== id}
          className="mt-5 rounded-3xl border border-border bg-surface/60 p-4 shadow-sm md:p-8"
        >
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted md:text-base">{text.games[id].rules}</p>
          {id === "lightup" ? <LightUpGame text={text} /> : <SudokuGame mode={id === "killer" ? "killer" : "classic"} text={text} />}
        </section>
      ))}

      <p className="mt-4 text-sm text-muted">
        {text.more}{" "}
        <a
          href="https://www.puzzles-mobile.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 text-foreground underline decoration-accent underline-offset-4 hover:text-accent"
        >
          puzzles-mobile.com
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
