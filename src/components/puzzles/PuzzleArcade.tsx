import { ArrowUpRight } from "lucide-react";
import type { Dict } from "@/i18n/dictionaries";
import { LightUpGame } from "./LightUpGame";

/** The puzzle corner: Light Up, its rules, and a link to more puzzles. */
export function PuzzleArcade({ text }: { text: Dict["puzzles"] }) {
  return (
    <div>
      <div className="rounded-3xl border border-border bg-surface/60 p-3 shadow-sm md:p-8">
        <h3 className="font-display text-2xl md:text-3xl">{text.name}</h3>
        <p className="mt-2 mb-5 max-w-2xl text-sm leading-relaxed text-muted md:text-base">{text.rules}</p>
        <LightUpGame text={text} />
      </div>

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
