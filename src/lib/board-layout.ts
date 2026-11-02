// Pure layout math for the board: no React, no browser, just numbers.
// "Pure" = same input always gives the same output → easy to test later.

export type Cell = { row: number; col: number };

/**
 * Where square number `index` sits on a serpentine (snake) board.
 *
 *   cols = 3:   0 → 1 → 2
 *                       ↓
 *               5 ← 4 ← 3
 *               ↓
 *               6 → 7 → 8
 */
export function cellFor(index: number, cols: number): Cell {
  const row = Math.floor(index / cols);
  const posInRow = index % cols;
  const goingRight = row % 2 === 0; // even rows → left to right, odd rows ← right to left
  const col = goingRight ? posInRow : cols - 1 - posInRow;
  return { row, col };
}

/** How many rows a board with `count` squares needs. */
export function rowCount(count: number, cols: number): number {
  return Math.ceil(count / cols);
}

/**
 * Points for the SVG path line, in "cell units":
 * the center of the cell at (row 0, col 0) is (0.5, 0.5).
 * Returns the string format SVG <polyline points="..."> expects: "x,y x,y ...".
 */
export function pathPoints(count: number, cols: number): string {
  return Array.from({ length: count }, (_, i) => {
    const { row, col } = cellFor(i, cols);
    return `${col + 0.5},${row + 0.5}`;
  }).join(" ");
}
