// Seeded random numbers: the same seed always gives the same sequence.
// Why: tests are repeatable, and the first puzzle is identical on the server and in the browser
// (no "hydration mismatch"). "New puzzle" just picks a new random seed.

export type Rng = () => number; // returns a number in [0, 1), like Math.random

/** mulberry32: a tiny, fast, good-enough generator (not for cryptography). */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A new random seed (uses the real Math.random). */
export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

/** Random integer in [min, max]. */
export function randInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Shuffled copy (Fisher–Yates: swap each item with a random earlier one). */
export function shuffled<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
