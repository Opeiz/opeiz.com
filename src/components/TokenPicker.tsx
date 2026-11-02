"use client";

import Image from "next/image";
import { useState } from "react";
import { tokens, type Token } from "@/data/tokens";
import { TokenSpinner } from "@/components/TokenSpinner";
import { accentStyle } from "@/lib/accent";

/** "Choose your token" screen: big spinning preview + 4 options + Play button. */
export function TokenPicker({ onPick }: { onPick: (token: Token) => void }) {
  const [selected, setSelected] = useState<Token>(tokens[0]);

  return (
    <section
      aria-labelledby="picker-title"
      className="mx-auto flex max-w-[640px] flex-col items-center gap-5 py-4 text-center md:gap-7"
      style={accentStyle(selected.accent)}
    >
      <h2 id="picker-title" className="text-2xl font-bold md:text-3xl">
        Choose your token
      </h2>

      <TokenSpinner token={selected} className="h-56 w-56 md:h-72 md:w-72" />

      {/* aria-live: screen readers announce the new name when it changes */}
      <div aria-live="polite" className="min-h-16">
        <p className="text-xl font-semibold text-accent md:text-2xl">{selected.name}</p>
        <p className="mt-1 opacity-70">{selected.tagline}</p>
      </div>

      <ul className="grid w-full grid-cols-4 gap-2 md:gap-4">
        {tokens.map((token) => {
          const isSelected = token.id === selected.id;
          return (
            <li key={token.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(token)}
                style={accentStyle(token.accent)}
                className={`flex w-full flex-col items-center gap-1 rounded-xl border-2 p-2 transition-colors ${
                  isSelected ? "border-accent bg-accent/10" : "border-foreground/10 hover:border-foreground/30"
                }`}
              >
                <Image src={token.sprites.front} alt="" width={64} height={64} className="h-14 w-14 md:h-16 md:w-16" />
                <span className="text-xs font-medium md:text-sm">{token.short}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => onPick(selected)}
        className="min-h-12 rounded-xl bg-accent px-8 text-lg font-semibold text-white shadow-md hover:opacity-90"
      >
        Play as {selected.name}
      </button>
    </section>
  );
}
