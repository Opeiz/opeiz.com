"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { Square } from "@/data/board";
import type { Token } from "@/data/tokens";
import { boardSize, isoPosition, perimeterCell } from "@/lib/board-layout";

// The isometric look: turn the flat board 45°, then tilt it back 60°.
// translate(-50%, -50%) centers it in the wrapper (CSS applies the list right → left).
const ISO_TRANSFORM = "translate(-50%, -50%) rotateX(60deg) rotateZ(45deg)";

// The exact opposite (in 2D) of what the board does to its content:
// the board turns +45° and squashes height ×½, so content turns −45° and stretches ×2.
// Result: icons and labels look upright and readable on the tilted board.
const BILLBOARD: CSSProperties = { transform: "rotate(-45deg) scaleY(2)" };

type BoardProps = {
  squares: Square[];
  token?: Token; // optional: the board can also be shown without a player
  position?: number; // which square the token is on
};

/**
 * The board: a loop of squares around an n×n grid, shown as an isometric diamond.
 * Layer 1: the tilted board plane (tiles + center).
 * Layer 2: the token, NOT tilted, placed with isoPosition() so it stands up.
 */
export function Board({ squares, token, position = 0 }: BoardProps) {
  const n = boardSize(squares.length);
  const tokenSpot = isoPosition(perimeterCell(position, n), n);

  return (
    // 2:1 box = the size the diamond takes on screen (width √2·side, height half of that)
    <div className="relative mx-auto aspect-[2/1] w-full max-w-[960px]">
      {/* Layer 1: the board plane. Width 70.71% = 1/√2 of the wrapper */}
      <div
        // No padding or gap here: every cell must be exactly 1/n of the board, or isoPosition() drifts.
        // The spacing between tiles lives INSIDE each cell (p-[5%] on the <li>).
        className="absolute top-1/2 left-1/2 grid aspect-square w-[70.71%] rounded-[3%] bg-foreground/[0.06] shadow-[14px_14px_0_0_rgb(0_0_0/0.18)]"
        style={{
          transform: ISO_TRANSFORM,
          gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${n}, minmax(0, 1fr))`,
        }}
      >
        {/* role="list": "display: contents" can hide list meaning from screen readers in some browsers */}
        <ol role="list" aria-label="Game board" className="contents">
          {squares.map((square) => {
            const { row, col } = perimeterCell(square.id, n);
            return (
              <li key={square.id} className="min-h-0 min-w-0 p-[5%]" style={{ gridRow: row + 1, gridColumn: col + 1 }}>
                <SquareTile square={square} />
              </li>
            );
          })}
        </ol>

        {/* The empty middle of the loop. The die will live here in 2b */}
        <div
          aria-hidden="true"
          className="m-[1.5%] flex items-center justify-center rounded-[6%] border-2 border-dashed border-foreground/15"
          style={{ gridRow: `2 / ${n}`, gridColumn: `2 / ${n}` }}
        >
          <div style={BILLBOARD} className="text-center">
            <p className="text-3xl md:text-6xl">🎲</p>
            <p className="mt-1 text-[9px] font-bold tracking-widest uppercase opacity-40 md:text-sm">
              Roll for the CV
            </p>
          </div>
        </div>
      </div>

      {/* Layer 2: the token, upright, standing on its square */}
      {token && (
        <Image
          src={token.sprites.front}
          alt={`${token.name} is here`}
          width={128}
          height={128}
          className="pointer-events-none absolute h-auto drop-shadow-lg"
          style={{
            left: `${tokenSpot.left}%`,
            top: `${tokenSpot.top}%`,
            width: `${(100 / n) * 0.75}%`, // a bit narrower than one diamond tile
            transform: "translate(-50%, -88%)", // put the token's base on the tile center
          }}
        />
      )}
    </div>
  );
}

// ---------- One square ----------

const tileStyles: Record<Square["kind"], string> = {
  start: "border-2 border-foreground bg-background font-bold",
  finish: "border-2 border-accent bg-accent text-white font-bold",
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
      className={`flex h-full w-full items-center justify-center rounded-[12%] shadow-[3px_3px_0_0_rgb(0_0_0/0.12)] ${tileStyles[square.kind]}`}
      title={square.kind === "fact" ? square.text : undefined} // hover tooltip on PC
    >
      <span className="sr-only">{description}</span>

      {/* Upright content (billboard). Labels only from md: up, phones are too small */}
      <div style={BILLBOARD} className="flex flex-col items-center text-center leading-none" aria-hidden="true">
        {square.icon && <span className="text-base md:text-3xl">{square.icon}</span>}
        {square.label && square.kind !== "path" && (
          <span className="mt-0.5 hidden text-[10px] whitespace-nowrap md:block">{square.label}</span>
        )}
      </div>
    </div>
  );
}
