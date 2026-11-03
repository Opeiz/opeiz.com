// Tests for the puzzle generators and rule checks. Run with: npm test
// Seeds make every run identical, so a failure can always be reproduced.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cageIndex, generateKiller, isKillerSolved, killerConflicts } from "./killer.ts";
import { generateLightUp, isLightUpSolved, lightUpConflicts, litCells, type Board } from "./lightup.ts";
import { seededRng } from "./random.ts";
import { conflicts, generateSudoku, isSudokuSolved, solve } from "./sudoku.ts";

const SEEDS = [1, 2, 3, 42, 2026];

test("random: same seed → same numbers", () => {
  const a = seededRng(7);
  const b = seededRng(7);
  assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
});

for (const seed of SEEDS) {
  test(`sudoku (seed ${seed}): exactly one solution, and it matches the givens`, () => {
    const { puzzle, solution } = generateSudoku(seededRng(seed));
    assert.ok(isSudokuSolved(solution), "solution follows the rules");
    assert.equal(solve(puzzle, 2).count, 1, "unique solution");
    puzzle.forEach((v, i) => v && assert.equal(v, solution[i], `given ${i}`));
    assert.ok(puzzle.filter((v) => v === 0).length >= 40, "enough empty cells to be a real puzzle");
  });

  test(`killer (seed ${seed}): cages cover every cell once, sums and digits are right`, () => {
    const { solution, cages } = generateKiller(seededRng(seed));
    assert.ok(cageIndex(cages).every((id) => id >= 0), "every cell is in a cage");
    assert.equal(cages.reduce((n, c) => n + c.cells.length, 0), 81, "no cell in two cages");
    for (const cage of cages) {
      const digits = cage.cells.map((c) => solution[c]);
      assert.equal(new Set(digits).size, digits.length, "no repeated digit in a cage");
      assert.equal(digits.reduce((s, d) => s + d, 0), cage.sum);
    }
    assert.ok(isKillerSolved(solution, cages));
  });

  test(`light up (seed ${seed}): the generated solution follows all the rules`, () => {
    const { board, solution } = generateLightUp(seededRng(seed));
    assert.ok(isLightUpSolved(board, solution));
    assert.ok(solution.some(Boolean), "has bulbs");
  });
}

test("sudoku: a repeated digit in a row is a conflict", () => {
  const grid = new Array(81).fill(0);
  grid[0] = 5;
  grid[8] = 5; // same row
  assert.deepEqual([...conflicts(grid)].sort((a, b) => a - b), [0, 8]);
});

test("killer: a cage going over its sum is a conflict", () => {
  const cages = [{ cells: [0, 1], sum: 5 }];
  const grid = new Array(81).fill(0);
  grid[0] = 4;
  grid[1] = 3; // 7 > 5
  assert.deepEqual([...killerConflicts(grid, cages)].sort(), [0, 1]);
});

test("light up: two bulbs that see each other conflict; a wall blocks the light", () => {
  // 3×3: row 0 is white | white | white; a black cell at the center
  const board: Board = { size: 3, cells: [null, null, null, null, -1, null, null, null, null] };
  const bulbs = new Array(9).fill(false);
  bulbs[0] = bulbs[2] = true; // same row, nothing between → conflict
  assert.deepEqual([...lightUpConflicts(board, bulbs)].sort(), [0, 2]);
  const lit = litCells(board, [false, true, false, false, false, false, false, false, false]);
  assert.equal(lit[7], false, "the black center blocks the light going down");
});
