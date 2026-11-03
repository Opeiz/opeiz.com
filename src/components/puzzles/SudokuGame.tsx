"use client";

import { Delete, RotateCcw, Timer } from "lucide-react";
import { useState } from "react";
import { t, type Dict } from "@/i18n/dictionaries";
import { cageIndex, generateKiller, isKillerSolved, killerConflicts, type Cage } from "@/lib/puzzles/killer";
import { randomSeed, seededRng } from "@/lib/puzzles/random";
import { boxOf, colOf, conflicts, generateSudoku, isSudokuSolved, rowOf, type Grid } from "@/lib/puzzles/sudoku";
import { formatTime, useStopwatch } from "./useStopwatch";

type Mode = "classic" | "killer";
type Game = { puzzle: Grid; cages: Cage[] | null };

// The first puzzle uses a fixed seed, so server and browser build the SAME one (no mismatch).
const FIRST_SEED: Record<Mode, number> = { classic: 2026, killer: 1987 };

function newGame(mode: Mode, seed: number): Game {
  const rng = seededRng(seed);
  if (mode === "killer") {
    const { puzzle, cages } = generateKiller(rng);
    return { puzzle, cages };
  }
  return { puzzle: generateSudoku(rng).puzzle, cages: null };
}

/**
 * Sudoku and Killer Sudoku (same grid, Killer adds cages).
 * Click a cell (or move with the arrow keys), then type 1–9 or use the number pad.
 */
export function SudokuGame({ mode, text }: { mode: Mode; text: Dict["puzzles"] }) {
  const [game, setGame] = useState(() => newGame(mode, FIRST_SEED[mode]));
  const [values, setValues] = useState<Grid>(() => [...game.puzzle]);
  const [selected, setSelected] = useState<number | null>(null);
  const clock = useStopwatch();

  const cages = game.cages;
  const cageOf = cages ? cageIndex(cages) : null;
  const bad = cages ? killerConflicts(values, cages) : conflicts(values);
  const solved = cages ? isKillerSolved(values, cages) : isSudokuSolved(values);
  const selectedDigit = selected !== null ? values[selected] : 0;

  function setCell(i: number, digit: number) {
    if (solved || game.puzzle[i] !== 0) return; // givens can't change
    const next = [...values];
    next[i] = digit;
    setValues(next);
    clock.start();
    if (cages ? isKillerSolved(next, cages) : isSudokuSolved(next)) clock.stop();
  }

  function restart() {
    const fresh = newGame(mode, randomSeed());
    setGame(fresh);
    setValues([...fresh.puzzle]);
    setSelected(null);
    clock.reset();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const i = selected ?? 0;
    const move: Record<string, number> = { ArrowUp: -9, ArrowDown: 9, ArrowLeft: -1, ArrowRight: 1 };
    if (e.key in move) {
      e.preventDefault(); // don't scroll the page
      const next = i + move[e.key];
      if (next >= 0 && next < 81 && (Math.abs(move[e.key]) === 9 || rowOf(next) === rowOf(i))) setSelected(next);
    } else if (/^[1-9]$/.test(e.key)) setCell(i, Number(e.key));
    else if (["Backspace", "Delete", "0"].includes(e.key)) setCell(i, 0);
  }

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-8">
      {/* The grid */}
      <div
        onKeyDown={onKeyDown}
        aria-label={text.gridLabel}
        className="grid aspect-square w-full max-w-[28rem] shrink-0 grid-cols-9 grid-rows-9 overflow-hidden rounded-xl border-2 border-foreground/80 bg-surface select-none"
      >
        {values.map((v, i) => {
          const r = rowOf(i);
          const c = colOf(i);
          const given = game.puzzle[i] !== 0;
          const isSelected = i === selected;
          const related = selected !== null && (rowOf(selected) === r || colOf(selected) === c || boxOf(selected) === boxOf(i));
          const sameDigit = selectedDigit !== 0 && v === selectedDigit;
          // Thick lines between the 3×3 boxes, thin lines elsewhere
          const borders = [
            c < 8 ? (c % 3 === 2 ? "border-r-2 border-r-foreground/70" : "border-r border-r-border") : "",
            r < 8 ? (r % 3 === 2 ? "border-b-2 border-b-foreground/70" : "border-b border-b-border") : "",
          ].join(" ");
          const tone = bad.has(i)
            ? "bg-red-500/15 text-red-600 dark:text-red-400"
            : isSelected
              ? "bg-accent-soft"
              : sameDigit
                ? "bg-accent-soft/60"
                : related
                  ? "bg-foreground/[0.05]"
                  : "";
          const cage = cageOf && cages ? cages[cageOf[i]] : null;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={t(text.cell, { r: r + 1, c: c + 1, value: v || text.empty })}
              aria-pressed={isSelected}
              className={`relative flex items-center justify-center font-mono text-lg outline-none md:text-2xl ${borders} ${tone} ${
                given ? "font-semibold text-foreground" : "text-accent"
              }`}
            >
              {cage && cageOf && <CageEdges i={i} cageOf={cageOf} sum={cage.cells[0] === i ? cage.sum : null} />}
              {v || ""}
            </button>
          );
        })}
      </div>

      {/* Side panel: timer, number pad, new puzzle, status */}
      <div className="flex w-full max-w-[28rem] flex-col gap-4 md:w-60">
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

        <div className="grid grid-cols-5 gap-2 md:grid-cols-3" role="group" aria-label={text.pad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
            <button
              key={d}
              type="button"
              disabled={selected === null}
              onClick={() => selected !== null && setCell(selected, d)}
              className="min-h-11 rounded-xl border border-border bg-surface font-mono text-lg transition hover:border-accent hover:text-accent disabled:opacity-40"
            >
              {d}
            </button>
          ))}
          <button
            type="button"
            disabled={selected === null}
            onClick={() => selected !== null && setCell(selected, 0)}
            aria-label={text.erase}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface transition hover:border-accent hover:text-accent disabled:opacity-40"
          >
            <Delete className="size-5" aria-hidden="true" />
          </button>
        </div>

        <p aria-live="polite" className={`text-sm leading-relaxed ${solved ? "font-semibold text-accent" : "text-muted"}`}>
          {solved ? t(text.solved, { time: formatTime(clock.elapsed) }) : text.hint}
        </p>
      </div>
    </div>
  );
}

/**
 * Killer cages: a dashed line on each side where the neighbor belongs to a different cage,
 * and the cage's sum in its first (top-left) cell.
 */
function CageEdges({ i, cageOf, sum }: { i: number; cageOf: number[]; sum: number | null }) {
  const id = cageOf[i];
  const r = rowOf(i);
  const c = colOf(i);
  // For each side: does the neighbor belong to ANOTHER cage (or is it the grid edge)?
  const outside = {
    top: r === 0 || cageOf[i - 9] !== id,
    bottom: r === 8 || cageOf[i + 9] !== id,
    left: c === 0 || cageOf[i - 1] !== id,
    right: c === 8 || cageOf[i + 1] !== id,
  };
  // Outside sides: a dashed line, 3px inside the cell. Inside sides: no line, and stretch
  // to the cell edge (-1px covers the grid line), so the pieces join into ONE cage shape.
  const line = "1.5px dashed var(--muted)";
  const inset = (out: boolean) => (out ? "3px" : "-1px");
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: inset(outside.top),
          bottom: inset(outside.bottom),
          left: inset(outside.left),
          right: inset(outside.right),
          borderTop: outside.top ? line : "none",
          borderBottom: outside.bottom ? line : "none",
          borderLeft: outside.left ? line : "none",
          borderRight: outside.right ? line : "none",
        }}
      />
      {sum !== null && (
        <span aria-hidden="true" className="pointer-events-none absolute top-[3px] left-[4px] font-mono text-[9px] leading-none text-muted md:text-[10px]">
          {sum}
        </span>
      )}
    </>
  );
}
