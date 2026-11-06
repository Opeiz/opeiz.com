// Tests for the line puzzles. Run with: npm test
// Seeds make every run identical, so a failure can always be reproduced.
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkPath, edgeKey, generatePathPuzzle, nodeId, regions, type PathMode, type PathPuzzle } from "./paths.ts";
import { seededRng } from "./random.ts";

const SEEDS = [1, 2, 3, 42, 2026];
const MODES: PathMode[] = ["maze", "dots", "colors", "triangles"];

test("random: same seed → same numbers", () => {
  const a = seededRng(7);
  const b = seededRng(7);
  assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
});

for (const mode of MODES)
  for (const seed of SEEDS)
    test(`${mode} (seed ${seed}): the generated solution follows every rule`, () => {
      const { puzzle, solution } = generatePathPuzzle(seededRng(seed), mode);
      const result = checkPath(puzzle, solution);
      assert.ok(result.validLine, "solution is a valid line");
      assert.ok(result.ok, `solution breaks a rule: ${JSON.stringify(result.bad)}`);
      if (mode === "maze") assert.ok(puzzle.broken.length > 20, "a real maze has many walls");
      if (mode === "dots") assert.ok(puzzle.dots.length >= 5);
      if (mode === "colors") assert.deepEqual(new Set(puzzle.squares.map((s) => s.color)), new Set([0, 1]), "both colors used");
      if (mode === "triangles") assert.ok(puzzle.triangles.length >= 5);
    });

/** A tiny 2×2 board for hand-made examples:
 *  nodes:  0 1 2
 *          3 4 5
 *          6 7 8   start = 6 (bottom-left), exit = 2 (top-right) */
function tiny(extra: Partial<PathPuzzle> = {}): PathPuzzle {
  return { mode: "dots", w: 2, h: 2, start: 6, exit: 2, broken: [], dots: [], squares: [], triangles: [], ...extra };
}

test("line rules: must start at the circle, end at the exit, never repeat or jump", () => {
  const p = tiny();
  assert.ok(checkPath(p, [6, 3, 0, 1, 2]).ok);
  assert.equal(checkPath(p, [6, 3, 0, 1]).validLine, false, "doesn't reach the exit");
  assert.equal(checkPath(p, [6, 4, 2]).validLine, false, "jumps diagonally");
  assert.equal(checkPath(p, [6, 7, 4, 7, 8, 5, 2]).validLine, false, "visits 7 twice");
  assert.equal(checkPath(tiny({ broken: [edgeKey(3, 0)] }), [6, 3, 0, 1, 2]).validLine, false, "uses a broken track");
});

test("dots: a hexagon on a node or on an edge must be on the line", () => {
  const p = tiny({ dots: [[4, 4], [1, 2]] }); // center node, and the top-right edge
  assert.ok(checkPath(p, [6, 7, 4, 1, 2]).ok);
  assert.deepEqual(checkPath(p, [6, 3, 0, 1, 2]).bad.dots, [0], "misses the center");
});

test("regions: the line splits the board into areas", () => {
  const p = tiny();
  // Line up the middle column: left cells (0, 2) vs right cells (1, 3)
  const area = regions(p, [6, 7, 4, 1, 2]);
  assert.equal(area[0], area[2]);
  assert.equal(area[1], area[3]);
  assert.notEqual(area[0], area[1]);
});

test("colors: two colors in one area is a mistake", () => {
  const squares: PathPuzzle["squares"] = [{ cell: 0, color: 0 }, { cell: 1, color: 1 }];
  assert.ok(checkPath(tiny({ squares }), [6, 7, 4, 1, 2]).ok, "the middle line separates them");
  assert.deepEqual(checkPath(tiny({ squares }), [6, 3, 0, 1, 2]).bad.squares, [0, 1], "the border line doesn't");
});

test("triangles: count the line's sides around the cell", () => {
  // Cell 0 (top-left) has sides 0-1, 3-4, 0-3, 1-4. The line 6→3→0→1→2 uses 0-3 and 0-1: 2 sides.
  assert.ok(checkPath(tiny({ triangles: [{ cell: 0, count: 2 }] }), [6, 3, 0, 1, 2]).ok);
  assert.deepEqual(checkPath(tiny({ triangles: [{ cell: 0, count: 3 }] }), [6, 3, 0, 1, 2]).bad.triangles, [0]);
  assert.equal(nodeId({ w: 2 }, 2, 0), 2);
});
