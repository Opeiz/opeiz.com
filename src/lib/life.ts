// Conway's Game of Life: pure functions, no React, easy to test.
//
// The grid is a flat array: cell (row, col) lives at index row * cols + col.
// 1 = alive, 0 = dead. Uint8Array = a fast array of small numbers (0–255).
// Edges wrap around (a "torus"): leaving on the right brings you back on the left.

export type Grid = Uint8Array;

export function emptyGrid(cols: number, rows: number): Grid {
  return new Uint8Array(cols * rows);
}

/** Count the alive cells among the 8 neighbours of (row, col). */
export function countNeighbours(grid: Grid, cols: number, rows: number, row: number, col: number): number {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue; // skip the cell itself
      // "+ rows" before "%" keeps the result positive when row + dr = -1
      const r = (row + dr + rows) % rows;
      const c = (col + dc + cols) % cols;
      count += grid[r * cols + c];
    }
  }
  return count;
}

/** One step of the simulation. Returns a NEW grid (the old one is not changed). */
export function nextGeneration(grid: Grid, cols: number, rows: number): Grid {
  const next = emptyGrid(cols, rows);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const alive = grid[row * cols + col] === 1;
      const n = countNeighbours(grid, cols, rows, row, col);
      // The 4 rules, folded into one line:
      // alive with 2–3 neighbours survives; dead with exactly 3 is born; everything else is dead.
      next[row * cols + col] = n === 3 || (alive && n === 2) ? 1 : 0;
    }
  }
  return next;
}

/** Random grid where about `density` (0–1) of the cells are alive. */
export function randomGrid(cols: number, rows: number, density = 0.25): Grid {
  const grid = emptyGrid(cols, rows);
  for (let i = 0; i < grid.length; i++) grid[i] = Math.random() < density ? 1 : 0;
  return grid;
}

/** Stamp a small pattern (list of [row, col] offsets) onto the grid at (top, left). */
export function stamp(grid: Grid, cols: number, rows: number, pattern: [number, number][], top: number, left: number) {
  for (const [r, c] of pattern) grid[((top + r) % rows) * cols + ((left + c) % cols)] = 1;
}

export function countAlive(grid: Grid): number {
  let total = 0;
  for (const cell of grid) total += cell;
  return total;
}

/** Famous patterns. */
export const PATTERNS = {
  // Moves diagonally forever, 1 cell every 4 generations
  glider: [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]] as [number, number][],
  // Flips between horizontal and vertical
  blinker: [[0, 0], [0, 1], [0, 2]] as [number, number][],
};
