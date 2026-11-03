// Sudoku: generate, solve, check. Pure functions, no React.
//
// A grid is 81 numbers, row by row. 0 = empty, 1–9 = a digit.
// Cell i is at row floor(i / 9), column i % 9.

import { shuffled, type Rng } from "./random.ts";

export type Grid = number[];

export const rowOf = (i: number) => Math.floor(i / 9);
export const colOf = (i: number) => i % 9;
export const boxOf = (i: number) => Math.floor(rowOf(i) / 3) * 3 + Math.floor(colOf(i) / 3);

/** PEERS[i] = the 20 cells that share a row, column or box with cell i. Computed once. */
export const PEERS: number[][] = Array.from({ length: 81 }, (_, i) =>
  Array.from({ length: 81 }, (_, j) => j).filter(
    (j) => j !== i && (rowOf(j) === rowOf(i) || colOf(j) === colOf(i) || boxOf(j) === boxOf(i)),
  ),
);

const ALL = 0b1111111110; // bits 1..9 set: "every digit is still possible"

/**
 * Candidates as a bitmask: bit d is 1 if digit d can go in cell i.
 * Example: 0b0000010100 → only 2 and 4 are possible.
 */
export function candidates(grid: Grid, i: number): number {
  let used = 0;
  for (const p of PEERS[i]) used |= 1 << grid[p];
  return ALL & ~used;
}

/** The digits in a bitmask, e.g. 0b10100 → [2, 4]. */
export function digitsOf(mask: number): number[] {
  const out: number[] = [];
  for (let d = 1; d <= 9; d++) if (mask & (1 << d)) out.push(d);
  return out;
}

/**
 * Count solutions by backtracking, stopping at `limit` (we only need to know "1 or more than 1").
 * Fills cells with the FEWEST candidates first: it cuts most wrong paths early.
 * If `rng` is given, digits are tried in random order (used to build random full grids).
 * Returns the count and the first solution found.
 */
export function solve(start: Grid, limit = 2, rng?: Rng): { count: number; solution: Grid | null } {
  const grid = [...start];
  let count = 0;
  let solution: Grid | null = null;

  const search = (): boolean => {
    // 1. Find the empty cell with the fewest options
    let best = -1;
    let bestMask = 0;
    let bestCount = 10;
    for (let i = 0; i < 81; i++) {
      if (grid[i] !== 0) continue;
      const mask = candidates(grid, i);
      const n = digitsOf(mask).length;
      if (n === 0) return false; // dead end: this cell can't be filled
      if (n < bestCount) [best, bestMask, bestCount] = [i, mask, n];
    }
    // 2. No empty cell left → a full, valid grid
    if (best === -1) {
      count++;
      solution ??= [...grid];
      return count >= limit; // true = stop searching
    }
    // 3. Try each option; undo if it doesn't work out (that's the "backtracking")
    const options = rng ? shuffled(digitsOf(bestMask), rng) : digitsOf(bestMask);
    for (const d of options) {
      grid[best] = d;
      if (search()) return true;
    }
    grid[best] = 0;
    return false;
  };

  search();
  return { count, solution };
}

/** A random full, valid grid. */
export function randomSolvedGrid(rng: Rng): Grid {
  return solve(new Array(81).fill(0), 1, rng).solution!;
}

/**
 * A puzzle with exactly ONE solution: start from a full grid, then remove digits in random
 * order, but only keep a removal if the puzzle still has a unique solution.
 */
export function generateSudoku(rng: Rng, emptyTarget = 50): { puzzle: Grid; solution: Grid } {
  const solution = randomSolvedGrid(rng);
  const puzzle = [...solution];
  let empty = 0;
  for (const i of shuffled([...Array(81).keys()], rng)) {
    if (empty >= emptyTarget) break;
    const keep = puzzle[i];
    puzzle[i] = 0;
    if (solve(puzzle, 2).count === 1) empty++;
    else puzzle[i] = keep; // removing it made the puzzle ambiguous: put it back
  }
  return { puzzle, solution };
}

/** Cells whose digit also appears in a peer cell (shown in red). */
export function conflicts(grid: Grid): Set<number> {
  const bad = new Set<number>();
  for (let i = 0; i < 81; i++) {
    if (grid[i] === 0) continue;
    for (const p of PEERS[i]) if (grid[p] === grid[i]) bad.add(i);
  }
  return bad;
}

/** Solved = every cell filled and no conflicts (checks the RULES, not a stored answer). */
export function isSudokuSolved(grid: Grid): boolean {
  return grid.every((v) => v !== 0) && conflicts(grid).size === 0;
}
