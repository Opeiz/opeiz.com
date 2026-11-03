"use client";

import { SwatchBook } from "lucide-react";
import { useState } from "react";
import { t, type Dict } from "@/i18n/dictionaries";
import { PALETTES } from "@/lib/palettes";

type Text = Dict["header"] & { names: Record<string, string> };

/**
 * Menu button: switch to a different random color palette.
 * The palette lives on <html data-palette="..."> (set first by the script in layout.tsx),
 * so changing that one attribute recolors the whole site instantly.
 */
export function PaletteButton({ text }: { text: Text }) {
  const [announce, setAnnounce] = useState(""); // what screen readers hear after a click

  function shuffle() {
    const html = document.documentElement;
    const others = PALETTES.filter((p) => p.id !== html.dataset.palette); // never pick the same one
    const next = others[Math.floor(Math.random() * others.length)];
    html.dataset.palette = next.id;
    try {
      sessionStorage.setItem("palette", next.id); // keep it for this tab
    } catch {
      // storage can be blocked (private mode): the colors still change, they just aren't remembered
    }
    setAnnounce(t(text.colorsChanged, { name: text.names[next.id] ?? next.name }));
  }

  return (
    <>
      <button
        type="button"
        onClick={shuffle}
        aria-label={text.shuffle}
        title={text.shuffleTitle}
        // after:-inset-1 = an invisible 44px tap area around the 36px button
        className="relative inline-flex size-9 shrink-0 after:absolute after:-inset-1 after:content-[''] items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:border-foreground/30 hover:text-accent"
      >
        <SwatchBook className="size-4" strokeWidth={1.8} aria-hidden="true" />
      </button>
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </>
  );
}
