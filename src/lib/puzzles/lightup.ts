// Light Up (also called Akari): place bulbs so every white cell is lit.
// A bulb lights its row and column until a black cell. Bulbs may not light each other.
// A numbered black cell needs exactly that many bulbs next to it (up/down/left/right).
// Pure functions, no React.

import { randInt, shuffled, type Rng } from "./random.ts";

/** One cell of the board: null = white, -1 = plain black, 0–4 = numbered black. */
export type BoardCell = number | null;
export type Board = { size: number; cells: BoardCell[] };

export const isWhite = (board: Board, i: number) => board.cells[i] === null;

/** Orthogonal neighbors of i on a size×size board. */
export function around(size: number, i: number): number[] {
  const r = Math.floor(i / size);
  const c = i % size;
  const out: number[] = [];
  if (r > 0) out.push(i - size);
  if (r < size - 1) out.push(i + size);
  if (c > 0) out.push(i - 1);
  if (c < size - 1) out.push(i + 1);
  return out;
}

/** The white cells a bulb at i would light: walk in 4 directions until a black cell or the edge. */
export function rays(board: Board, i: number): number[] {
  const { size } = board;
  const out: number[] = [];
  const r0 = Math.floor(i / size);
  const c0 = i % size;
  for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
    let r = r0 + dr;
    let c = c0 + dc;
    while (r >= 0 && r < size && c >= 0 && c < size && isWhite(board, r * size + c)) {
      out.push(r * size + c);
      r += dr;
      c += dc;
    }
  }
  return out;
}

/** lit[i] = true if cell i has a bulb or is lit by one. */
export function litCells(board: Board, bulbs: boolean[]): boolean[] {
  const lit = new Array(board.cells.length).fill(false);
  bulbs.forEach((on, i) => {
    if (!on) return;
    lit[i] = true;
    for (const j of rays(board, i)) lit[j] = true;
  });
  return lit;
}

/**
 * Generate a board with a guaranteed solution.
 * Key trick: an UNLIT white cell is always a safe place for a bulb (no bulb can see it yet).
 */
export function generateLightUp(rng: Rng, size = 7): { board: Board; solution: boolean[] } {
  const n = size * size;
  const cells: BoardCell[] = new Array(n).fill(null);
  // 1. Black cells with 180° rotational symmetry (looks hand-made)
  const blackCount = randInt(rng, Math.round(n * 0.16), Math.round(n * 0.22));
  for (const i of shuffled([...Array(n).keys()], rng).slice(0, Math.ceil(blackCount / 2))) {
    cells[i] = -1;
    cells[n - 1 - i] = -1;
  }
  const board: Board = { size, cells };
  // 2. Light everything: drop a bulb on every cell that's still dark
  const solution = new Array(n).fill(false);
  for (const i of shuffled([...Array(n).keys()], rng)) {
    if (!isWhite(board, i) || litCells(board, solution)[i]) continue;
    solution[i] = true;
  }
  // 3. Number most black cells with how many bulbs touch them (some stay plain, for variety)
  for (let i = 0; i < n; i++) {
    if (cells[i] === -1 && rng() < 0.75) cells[i] = around(size, i).filter((j) => solution[j]).length;
  }
  return { board, solution };
}

/** Bulbs that light another bulb, and numbers with TOO MANY bulbs around them (shown in red). */
export function lightUpConflicts(board: Board, bulbs: boolean[]): Set<number> {
  const bad = new Set<number>();
  bulbs.forEach((on, i) => {
    if (on && rays(board, i).some((j) => bulbs[j])) bad.add(i);
  });
  board.cells.forEach((v, i) => {
    if (v !== null && v >= 0 && around(board.size, i).filter((j) => bulbs[j]).length > v) bad.add(i);
  });
  return bad;
}

/** Solved = every white cell lit, no bulb sees another, every number has EXACTLY its bulbs. */
export function isLightUpSolved(board: Board, bulbs: boolean[]): boolean {
  const lit = litCells(board, bulbs);
  const allLit = board.cells.every((v, i) => v !== null || lit[i]);
  const numbersOk = board.cells.every((v, i) => v === null || v < 0 || around(board.size, i).filter((j) => bulbs[j]).length === v);
  return allLit && numbersOk && lightUpConflicts(board, bulbs).size === 0;
}
