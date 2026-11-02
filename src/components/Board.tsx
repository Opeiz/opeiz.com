"use client"; // runs in the browser: it needs the screen width

import Image from "next/image";
import type { Square } from "@/data/board";
import type { Token } from "@/data/tokens";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cellFor, pathPoints, rowCount } from "@/lib/board-layout";

/**
 * The vertical zigzag board.
 * Layer 1: an SVG line through the center of every square.
 * Layer 2: the squares, placed on a CSS grid (no gap, so cell centers match the SVG).
 */
type BoardProps = {
  squares: Square[];
  token?: Token; // optional: the board can also be shown without a player
  position?: number; // which square the token is on
};

export function Board({ squares, token, position = 0 }: BoardProps) {
  const isWide = useMediaQuery("(min-width: 768px)");
  const cols = isWide ? 4 : 3; // mobile-first: 3 columns, 4 from tablet up
  const rows = rowCount(squares.length, cols);

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      {/* Layer 1: the path. viewBox in "cell units" → scales to any width */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${cols} ${rows}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          points={pathPoints(squares.length, cols)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={6}
          strokeDasharray="2 10"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke" // keep the line 6px thick at any size
        />
      </svg>

      {/* Layer 2: the squares. HTML order = path order (good for screen readers) */}
      <ol
        aria-label="Game board"
        className="relative grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {squares.map((square) => {
          const { row, col } = cellFor(square.id, cols);
          return (
            <li
              key={square.id}
              className="relative aspect-square p-1.5 md:p-2"
              style={{ gridRow: row + 1, gridColumn: col + 1 }}
            >
              <SquareTile square={square} />
              {token && square.id === position && (
                <Image
                  src={token.sprites.front}
                  alt={`${token.name} is here`}
                  width={96}
                  height={96}
                  className="pointer-events-none absolute -top-3 right-0 h-3/5 w-3/5 object-contain drop-shadow-lg"
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ---------- One square ----------

const tileStyles: Record<Square["kind"], string> = {
  start: "border-2 border-foreground bg-background font-bold",
  finish: "border-2 border-accent bg-accent text-background font-bold",
  section: "border-2 border-accent bg-background text-accent font-semibold",
  fact: "border border-foreground/20 bg-background",
  path: "border border-foreground/10 bg-background",
  ladder: "border border-foreground/20 bg-background",
  puzzle: "border border-foreground/20 bg-background",
  chance: "border border-foreground/20 bg-background",
};

function SquareTile({ square }: { square: Square }) {
  // What a screen reader announces for this square
  const description =
    square.kind === "fact" ? `Fun fact: ${square.text}` : (square.label ?? `Square ${square.id}`);

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl text-center shadow-sm ${tileStyles[square.kind]}`}
      title={square.kind === "fact" ? square.text : undefined} // hover tooltip on PC
    >
      {/* Invisible on screen, read aloud by screen readers */}
      <span className="sr-only">{description}</span>
      {/* Square number, like on a real board */}
      <span className="absolute top-1 left-1.5 text-[10px] font-normal opacity-50" aria-hidden="true">
        {square.id}
      </span>

      {square.icon && (
        <span className="text-2xl md:text-3xl" aria-hidden="true">
          {square.icon}
        </span>
      )}

      {square.kind === "fact" ? (
        <span className="text-[11px] uppercase tracking-wide opacity-60" aria-hidden="true">
          Fun fact
        </span>
      ) : (
        square.label && (
          <span className="px-1 text-xs leading-tight md:text-sm" aria-hidden="true">
            {square.label}
          </span>
        )
      )}
    </div>
  );
}
