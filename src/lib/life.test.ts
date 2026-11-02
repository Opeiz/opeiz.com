// Tests for the Game of Life rules. Run with: npm test
// Uses Node's built-in test runner (no extra library needed).
import { test } from "node:test";
import assert from "node:assert/strict";
import { countAlive, countNeighbours, emptyGrid, nextGeneration, PATTERNS, stamp } from "./life.ts";

const COLS = 8;
const ROWS = 8;

/** Helper: the set of alive cells as "row,col" strings, easy to compare. */
function aliveCells(grid: Uint8Array): Set<string> {
  const cells = new Set<string>();
  grid.forEach((v, i) => v && cells.add(`${Math.floor(i / COLS)},${i % COLS}`));
  return cells;
}

test("an empty grid stays empty", () => {
  const next = nextGeneration(emptyGrid(COLS, ROWS), COLS, ROWS);
  assert.equal(countAlive(next), 0);
});

test("a lonely cell dies", () => {
  const grid = emptyGrid(COLS, ROWS);
  grid[3 * COLS + 3] = 1;
  assert.equal(countAlive(nextGeneration(grid, COLS, ROWS)), 0);
});

test("a blinker flips from horizontal to vertical and back", () => {
  const grid = emptyGrid(COLS, ROWS);
  stamp(grid, COLS, ROWS, PATTERNS.blinker, 3, 2); // cells (3,2) (3,3) (3,4)
  const gen1 = nextGeneration(grid, COLS, ROWS);
  assert.deepEqual(aliveCells(gen1), new Set(["2,3", "3,3", "4,3"]));
  const gen2 = nextGeneration(gen1, COLS, ROWS);
  assert.deepEqual(aliveCells(gen2), aliveCells(grid));
});

test("a glider moves 1 down and 1 right every 4 generations", () => {
  let grid = emptyGrid(COLS, ROWS);
  stamp(grid, COLS, ROWS, PATTERNS.glider, 0, 0);
  const start = aliveCells(grid);
  for (let i = 0; i < 4; i++) grid = nextGeneration(grid, COLS, ROWS);
  const moved = new Set([...start].map((cell) => {
    const [r, c] = cell.split(",").map(Number);
    return `${r + 1},${c + 1}`;
  }));
  assert.deepEqual(aliveCells(grid), moved);
});

test("edges wrap around: the top-left corner sees the bottom-right corner", () => {
  const grid = emptyGrid(COLS, ROWS);
  grid[(ROWS - 1) * COLS + (COLS - 1)] = 1; // bottom-right
  assert.equal(countNeighbours(grid, COLS, ROWS, 0, 0), 1);
});
