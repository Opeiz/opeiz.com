"use client";

import Image from "next/image";
import { useState } from "react";
import { Board } from "@/components/Board";
import { TokenPicker } from "@/components/TokenPicker";
import type { Square } from "@/data/board";
import type { Token } from "@/data/tokens";
import { accentStyle } from "@/lib/accent";

/**
 * The game. Start of the state machine from PLAN.md:
 *   choosing (no token) → idle (token on the board)
 * In 2b this grows into useReducer with rolling / moving / reading phases.
 */
export function Game({ squares }: { squares: Square[] }) {
  const [token, setToken] = useState<Token | null>(null);
  const position = 0; // 2b: the die will change this

  if (!token) return <TokenPicker onPick={setToken} />;

  return (
    <div style={accentStyle(token.accent)}>
      {/* Who is playing */}
      <div className="mx-auto mb-3 flex max-w-[960px] items-center justify-between gap-3 px-1.5">
        <p className="flex items-center gap-2 text-sm">
          <Image src={token.sprites.front} alt="" width={32} height={32} className="h-8 w-8" />
          <span>
            Playing as <strong className="text-accent">{token.name}</strong>
          </span>
        </p>
        <button
          type="button"
          onClick={() => setToken(null)}
          className="min-h-11 rounded-lg px-3 text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
        >
          Change token
        </button>
      </div>

      <Board squares={squares} token={token} position={position} />
    </div>
  );
}
