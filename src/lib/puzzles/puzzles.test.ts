// Tests for the puzzle generators and rule checks. Run with: npm test
// Seeds make every run identical, so a failure can always be reproduced.
import { test } from "node:test";
import assert from "node:assert/strict";
import { generateLightUp, isLightUpSolved, lightUpConflicts, litCells, type Board } from "./lightup.ts";
import { seededRng } from "./random.ts";

const SEEDS = [1, 2, 3, 42, 2026];

test("random: same seed → same numbers", () => {
  const a = seededRng(7);
  const b = seededRng(7);
  assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
});

for (const seed of SEEDS) {
  test(`light up (seed ${seed}): the generated 10×10 solution follows all the rules`, () => {
    const { board, solution } = generateLightUp(seededRng(seed), 10);
    assert.equal(board.cells.length, 100);
    assert.ok(isLightUpSolved(board, solution));
    assert.ok(solution.some(Boolean), "has bulbs");
  });
}

test("light up: two bulbs that see each other conflict; a wall blocks the light", () => {
  // 3×3: row 0 is white | white | white; a black cell at the center
  const board: Board = { size: 3, cells: [null, null, null, null, -1, null, null, null, null] };
  const bulbs = new Array(9).fill(false);
  bulbs[0] = bulbs[2] = true; // same row, nothing between → conflict
  assert.deepEqual([...lightUpConflicts(board, bulbs)].sort(), [0, 2]);
  const lit = litCells(board, [false, true, false, false, false, false, false, false, false]);
  assert.equal(lit[7], false, "the black center blocks the light going down");
});
