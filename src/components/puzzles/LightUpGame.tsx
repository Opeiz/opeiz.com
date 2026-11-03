"use client";

import { Lightbulb, RotateCcw, Timer, X } from "lucide-react";
import { useState } from "react";
import { t, type Dict } from "@/i18n/dictionaries";
import { around, generateLightUp, isLightUpSolved, lightUpConflicts, litCells, type Board } from "@/lib/puzzles/lightup";
import { randomSeed, seededRng } from "@/lib/puzzles/random";
import { formatTime, useStopwatch } from "./useStopwatch";

const SIZE = 10; // 10×10: big enough to be a real challenge, still fits a phone
const FIRST_SEED = 7; // same first puzzle on server and browser

type Mark = 0 | 1 | 2; // 0 empty · 1 bulb · 2 X ("no bulb here", a note for yourself)

/**
 * Light Up. Click = bulb, right-click = X. On a phone (no right-click), a tap cycles bulb → X → empty.
 * Keyboard: arrows to move, Space = bulb, X = mark.
 */
export function LightUpGame({ text }: { text: Dict["puzzles"] }) {
  const [board, setBoard] = useState<Board>(() => generateLightUp(seededRng(FIRST_SEED), SIZE).board);
  const [marks, setMarks] = useState<Mark[]>(() => new Array(SIZE * SIZE).fill(0));
  const [selected, setSelected] = useState<number | null>(null);
  const clock = useStopwatch();

  const bulbs = marks.map((m) => m === 1);
  const lit = litCells(board, bulbs);
  const bad = lightUpConflicts(board, bulbs);
  const solved = isLightUpSolved(board, bulbs);

  function setMark(i: number, mark: Mark) {
    if (solved || board.cells[i] !== null) return;
    const next = [...marks];
    next[i] = mark;
    setMarks(next);
    clock.start();
    if (isLightUpSolved(board, next.map((m) => m === 1))) clock.stop();
  }

  const cycle = (i: number) => setMark(i, ((marks[i] + 1) % 3) as Mark);
  const toggleX = (i: number) => setMark(i, marks[i] === 2 ? 0 : 2);

  function restart() {
    setBoard(generateLightUp(seededRng(randomSeed()), SIZE).board);
    setMarks(new Array(SIZE * SIZE).fill(0));
    setSelected(null);
    clock.reset();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const i = selected ?? 0;
    const move: Record<string, number> = { ArrowUp: -SIZE, ArrowDown: SIZE, ArrowLeft: -1, ArrowRight: 1 };
    if (e.key in move) {
      e.preventDefault();
      const next = i + move[e.key];
      const sameRow = Math.floor(next / SIZE) === Math.floor(i / SIZE);
      if (next >= 0 && next < SIZE * SIZE && (Math.abs(move[e.key]) === SIZE || sameRow)) setSelected(next);
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setMark(i, marks[i] === 1 ? 0 : 1);
    } else if (e.key.toLowerCase() === "x" || e.key === ".") toggleX(i);
    else if (["Backspace", "Delete"].includes(e.key)) setMark(i, 0);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onKeyDown={onKeyDown}
        aria-label={text.gridLabel}
        className="grid aspect-square w-full max-w-[36rem] shrink-0 gap-[2px] overflow-hidden rounded-xl border-2 border-foreground/80 bg-border p-[2px] select-none md:gap-[3px] md:p-[3px]"
        // rows AND columns: without rows, each row takes its content's height and the grid looks uneven
        style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${SIZE}, minmax(0, 1fr))` }}
      >
        {board.cells.map((cell, i) => {
          const r = Math.floor(i / SIZE) + 1;
          const c = (i % SIZE) + 1;
          // Black cell (maybe numbered)
          if (cell !== null) {
            const count = cell >= 0 ? around(SIZE, i).filter((j) => bulbs[j]).length : 0;
            const done = cell >= 0 && count === cell;
            return (
              <div
                key={i}
                aria-label={t(text.wall, { r, c, n: cell >= 0 ? cell : "–" })}
                className={`flex items-center justify-center rounded-[4px] bg-foreground font-mono text-lg font-semibold md:text-xl ${
                  bad.has(i) ? "text-red-400" : done ? "text-background/45" : "text-background"
                }`}
              >
                {cell >= 0 ? cell : ""}
              </div>
            );
          }
          // White cell
          const mark = marks[i];
          const state = mark === 1 ? text.bulb : mark === 2 ? text.dot : lit[i] ? text.lit : text.dark;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSelected(i);
                cycle(i);
              }}
              // Right-click: place / remove an X. preventDefault stops the browser's own menu.
              onContextMenu={(e) => {
                e.preventDefault();
                setSelected(i);
                toggleX(i);
              }}
              aria-label={t(text.cell, { r, c, value: state })}
              className={`flex items-center justify-center rounded-[4px] outline-none transition-colors ${lit[i] ? "bg-accent-soft" : "bg-surface"} ${
                i === selected ? "ring-2 ring-accent ring-inset" : ""
              }`}
            >
              {mark === 1 && (
                <Lightbulb
                  aria-hidden="true"
                  className={`size-[60%] ${bad.has(i) ? "text-red-600 dark:text-red-400" : "text-accent"}`}
                  strokeWidth={2}
                  fill="currentColor"
                  fillOpacity={0.25}
                />
              )}
              {mark === 2 && <X aria-hidden="true" className="size-[45%] text-muted" strokeWidth={2.25} />}
            </button>
          );
        })}
      </div>

      <div className="flex w-full max-w-[36rem] flex-col gap-3">
        <div className="flex items-center justify-between font-mono text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Timer className="size-4" aria-hidden="true" />
            <span aria-label={text.time}>{formatTime(clock.elapsed)}</span>
          </span>
          <button
            type="button"
            onClick={restart}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-surface px-3 font-sans whitespace-nowrap text-sm font-medium text-foreground transition hover:border-foreground/30"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            {text.newPuzzle}
          </button>
        </div>
        <p className="text-sm leading-relaxed text-muted">{text.lightUpControls}</p>
        <p aria-live="polite" className={`text-sm leading-relaxed ${solved ? "font-semibold text-accent" : "text-muted"}`}>
          {solved ? t(text.solved, { time: formatTime(clock.elapsed) }) : text.hint}
        </p>
      </div>
    </div>
  );
}
