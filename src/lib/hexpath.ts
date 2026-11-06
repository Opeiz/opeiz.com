// The background's endless line: a random walk along the edges of a honeycomb.
// Pure math, no React (the drawing lives in components/HexBackground.tsx).
//
// Honeycomb with pointy-top hexagons of side r (width w = √3·r). Every corner has 3 edges:
//   type "a" (Y shape):          one edge going DOWN, two going UP (left and right)
//   type "b" (upside-down Y):    one edge going UP,   two going DOWN
// Each step moves to a corner of the other type.
// The grid repeats every w across and 3r down, so the SVG background pattern uses a w × 3r tile.

import type { Rng } from "./puzzles/random.ts";

export type Corner = { x: number; y: number; kind: "a" | "b" };
export type Bounds = { width: number; height: number };

export const hexWidth = (r: number) => Math.sqrt(3) * r;

/** The 3 corners connected to c. */
export function nextCorners(c: Corner, r: number): Corner[] {
  const half = hexWidth(r) / 2;
  if (c.kind === "a")
    return [
      { x: c.x, y: c.y + r, kind: "b" },
      { x: c.x - half, y: c.y - r / 2, kind: "b" },
      { x: c.x + half, y: c.y - r / 2, kind: "b" },
    ];
  return [
    { x: c.x, y: c.y - r, kind: "a" },
    { x: c.x - half, y: c.y + r / 2, kind: "a" },
    { x: c.x + half, y: c.y + r / 2, kind: "a" },
  ];
}

/** A short text id for a corner (rounded, so tiny float errors don't matter). */
export const cornerKey = (c: Corner) => `${Math.round(c.x)}:${Math.round(c.y)}`;

/** The "a" corner of the grid closest to a point (used to start the walk near the middle of the screen). */
export function nearestCorner(x: number, y: number, r: number): Corner {
  const w = hexWidth(r);
  // "a" corners sit at (i·w, j·3r) and (i·w + w/2, j·3r + 1.5r)
  const options = [0, 1].map((shift) => {
    const j = Math.round((y - shift * 1.5 * r) / (3 * r));
    const i = Math.round((x - shift * (w / 2)) / w);
    return { x: i * w + shift * (w / 2), y: j * 3 * r + shift * 1.5 * r, kind: "a" as const };
  });
  return options.sort((p, q) => Math.hypot(p.x - x, p.y - y) - Math.hypot(q.x - x, q.y - y))[0];
}

/**
 * One step of the walk. Rules, in order of preference:
 *   1. never go straight back,
 *   2. stay on screen; if that's impossible (a screen corner), step outside and take
 *      the turn closest to the center, so it comes straight back (off screen, nobody sees it),
 *   3. avoid corners visited recently, so the line explores instead of circling.
 */
export function step(rng: Rng, current: Corner, previous: Corner | null, recent: Set<string>, bounds: Bounds, r: number): Corner {
  const onScreen = (c: Corner) => c.x > -r && c.y > -r && c.x < bounds.width + r && c.y < bounds.height + r;
  const forward = nextCorners(current, r).filter((c) => !previous || cornerKey(c) !== cornerKey(previous));
  const visible = forward.filter(onScreen);
  if (visible.length === 0) {
    // Outside: head home, toward the middle of the screen
    const dist = (c: Corner) => Math.hypot(c.x - bounds.width / 2, c.y - bounds.height / 2);
    return [...forward].sort((p, q) => dist(p) - dist(q))[0];
  }
  const fresh = visible.filter((c) => !recent.has(cornerKey(c)));
  const pool = fresh.length ? fresh : visible;
  return pool[Math.floor(rng() * pool.length)];
}
