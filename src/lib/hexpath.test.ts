// Tests for the background's endless hexagon line. Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { cornerKey, hexWidth, nearestCorner, nextCorners, step, type Corner } from "./hexpath.ts";
import { seededRng } from "./puzzles/random.ts";

const R = 40;
const W = hexWidth(R);

/** Is c a real corner of the background pattern (tile w × 3r, see hexpath.ts)? */
function onGrid(c: Corner): boolean {
  const near = (v: number) => Math.abs(v - Math.round(v)) < 1e-6;
  const dy = c.kind === "a" ? 0 : R; // "b" corners sit r below an "a" corner
  return [0, 1].some((shift) => near((c.x - shift * (W / 2)) / W) && near((c.y - dy - shift * 1.5 * R) / (3 * R)));
}

test("each corner has 3 neighbors, all at distance r, of the other kind", () => {
  for (const start of [{ x: 0, y: 0, kind: "a" }, { x: 0, y: R, kind: "b" }] satisfies Corner[])
    for (const n of nextCorners(start, R)) {
      assert.ok(Math.abs(Math.hypot(n.x - start.x, n.y - start.y) - R) < 1e-9);
      assert.notEqual(n.kind, start.kind);
    }
});

test("nearestCorner snaps to a real grid corner", () => {
  for (const [x, y] of [[0, 0], [500, 300], [1234, 777], [33, 901]]) assert.ok(onGrid(nearestCorner(x, y, R)), `${x},${y}`);
});

test("a 2000-step walk: on the grid, near the screen, never straight back", () => {
  const bounds = { width: 1280, height: 800 };
  const rng = seededRng(5);
  let current = nearestCorner(640, 400, R);
  let previous: Corner | null = null;
  const recent: string[] = [];
  for (let i = 0; i < 2000; i++) {
    const next = step(rng, current, previous, new Set(recent), bounds, R);
    assert.ok(onGrid(next), `step ${i} left the grid`);
    assert.ok(next.x > -4 * R && next.y > -4 * R && next.x < bounds.width + 4 * R && next.y < bounds.height + 4 * R, `step ${i} wandered off`);
    if (previous) assert.notEqual(cornerKey(next), cornerKey(previous), `step ${i} went straight back`);
    recent.push(cornerKey(next));
    if (recent.length > 40) recent.shift();
    previous = current;
    current = next;
  }
});
