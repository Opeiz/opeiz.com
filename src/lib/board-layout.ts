// Pure layout math for the board: no React, no browser, just numbers.
// "Pure" = same input always gives the same output → easy to test later.
//
// The board is a LOOP around the edge of an n×n grid (like many classic board games),
// then shown as an isometric diamond with CSS: rotateX(60deg) rotateZ(45deg).

export type Cell = { row: number; col: number };

/** Grid size for a loop of `count` squares. A loop has 4 × (n − 1) squares, so 20 → 6×6. */
export function boardSize(count: number): number {
  if (count % 4 !== 0) throw new Error(`A loop board needs a multiple of 4 squares, got ${count}`);
  return count / 4 + 1;
}

/**
 * Where square number `index` sits on the loop. Starts at the bottom-right corner
 * (the front corner of the diamond) and goes around:
 *
 *   n = 4:   6  7  8  9
 *            5        10
 *            4        11
 *            3  2  1  0  ← START
 */
export function perimeterCell(index: number, n: number): Cell {
  const side = n - 1; // squares per edge (each corner belongs to the edge it starts)
  const edge = Math.floor(index / side); // 0 bottom, 1 left, 2 top, 3 right
  const step = index % side;
  switch (edge) {
    case 0:
      return { row: n - 1, col: n - 1 - step }; // bottom row, right → left
    case 1:
      return { row: n - 1 - step, col: 0 }; // left column, bottom → top
    case 2:
      return { row: 0, col: step }; // top row, left → right
    default:
      return { row: step, col: n - 1 }; // right column, top → bottom
  }
}

/**
 * Screen position (in % of the board's 2:1 wrapper) of a cell's center
 * after the isometric transform. Used to place things that must STAND UP
 * (like the token) on top of the tilted board.
 *
 * Derivation: x, y = cell center relative to the board center (−0.5 … 0.5).
 *   rotateZ(45°) → x' = (x − y)/√2,  y' = (x + y)/√2
 *   rotateX(60°) → squashes height by cos 60° = ½
 *   The wrapper is √2 × the board wide and half as tall, so everything simplifies to:
 */
export function isoPosition({ row, col }: Cell, n: number): { left: number; top: number } {
  const x = (col + 0.5) / n - 0.5;
  const y = (row + 0.5) / n - 0.5;
  return { left: 50 + 50 * (x - y), top: 50 + 50 * (x + y) };
}
