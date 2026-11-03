// Killer Sudoku: normal Sudoku rules + "cages" (groups of cells whose digits add up to a sum,
// with no repeated digit inside a cage). Pure functions, no React.

import { randInt, shuffled, type Rng } from "./random.ts";
import { colOf, conflicts, randomSolvedGrid, rowOf, type Grid } from "./sudoku.ts";

export type Cage = { cells: number[]; sum: number };

/** The up/down/left/right neighbors of cell i. */
export function neighbors(i: number): number[] {
  const out: number[] = [];
  if (rowOf(i) > 0) out.push(i - 9);
  if (rowOf(i) < 8) out.push(i + 9);
  if (colOf(i) > 0) out.push(i - 1);
  if (colOf(i) < 8) out.push(i + 1);
  return out;
}

/**
 * Cut a solved grid into cages, like drops of paint growing into free neighbors.
 * Every cell ends up in exactly one cage; no cage repeats a digit.
 */
export function makeCages(solution: Grid, rng: Rng): Cage[] {
  const cageOf = new Array(81).fill(-1);
  const cages: Cage[] = [];
  for (const start of shuffled([...Array(81).keys()], rng)) {
    if (cageOf[start] !== -1) continue;
    const id = cages.length;
    const cells = [start];
    cageOf[start] = id;
    const target = randInt(rng, 2, 4);
    while (cells.length < target) {
      const digits = new Set(cells.map((c) => solution[c]));
      const free = cells.flatMap(neighbors).filter((n) => cageOf[n] === -1 && !digits.has(solution[n]));
      if (free.length === 0) break; // boxed in: this cage stays smaller
      const next = free[Math.floor(rng() * free.length)];
      cageOf[next] = id;
      cells.push(next);
    }
    cages.push({ cells: cells.sort((a, b) => a - b), sum: cells.reduce((s, c) => s + solution[c], 0) });
  }
  return cages;
}

/** A Killer puzzle: cages + a few given digits to get started. */
export function generateKiller(rng: Rng, givens = 6): { puzzle: Grid; solution: Grid; cages: Cage[] } {
  const solution = randomSolvedGrid(rng);
  const cages = makeCages(solution, rng);
  const puzzle = new Array(81).fill(0);
  for (const i of shuffled([...Array(81).keys()], rng).slice(0, givens)) puzzle[i] = solution[i];
  return { puzzle, solution, cages };
}

/** cageIndex[i] = which cage cell i belongs to. */
export function cageIndex(cages: Cage[]): number[] {
  const index = new Array(81).fill(-1);
  cages.forEach((cage, id) => cage.cells.forEach((c) => (index[c] = id)));
  return index;
}

/**
 * Cells breaking a rule: Sudoku conflicts, a digit repeated inside a cage,
 * a cage whose digits already go OVER its sum, or a full cage with the wrong sum.
 */
export function killerConflicts(grid: Grid, cages: Cage[]): Set<number> {
  const bad = conflicts(grid);
  for (const cage of cages) {
    const values = cage.cells.map((c) => grid[c]).filter((v) => v !== 0);
    const total = values.reduce((s, v) => s + v, 0);
    const full = values.length === cage.cells.length;
    const repeated = new Set(values).size !== values.length;
    if (repeated || total > cage.sum || (full && total !== cage.sum)) cage.cells.forEach((c) => grid[c] && bad.add(c));
  }
  return bad;
}

/** Solved = full grid that follows ALL rules (any valid answer counts, not just "ours"). */
export function isKillerSolved(grid: Grid, cages: Cage[]): boolean {
  return grid.every((v) => v !== 0) && killerConflicts(grid, cages).size === 0;
}
