// Line puzzles: draw ONE line from the start circle to the exit, never touching itself.
// Each mode adds a rule:
//   maze       some tracks are missing, find the way through
//   dots       the line must pass over every hexagon
//   colors     the line splits the board into areas; an area can't mix square colors
//   triangles  a cell with N triangles needs exactly N of its 4 sides on the line
// Every puzzle is built FROM a random solution, so it's always solvable.
// Answers are checked against the RULES, so any valid line counts. Pure functions, no React.

import { randInt, shuffled, type Rng } from "./random.ts";

export type PathMode = "maze" | "dots" | "colors" | "triangles";

/** A hexagon sits on a node ([n, n]) or in the middle of an edge ([a, b], a < b). */
export type Dot = [number, number];

export type PathPuzzle = {
  mode: PathMode;
  w: number; // cells across (nodes across = w + 1)
  h: number; // cells down
  start: number; // node id
  exit: number; // node id (on the top edge: the exit stub points up)
  broken: string[]; // edge keys the line can't use (maze)
  dots: Dot[];
  squares: { cell: number; color: 0 | 1 }[];
  triangles: { cell: number; count: number }[];
};

/** Board sizes per mode (cells). Mazes are bigger: they're about dead ends. */
export const SIZES: Record<PathMode, { w: number; h: number }> = {
  maze: { w: 7, h: 7 },
  dots: { w: 4, h: 4 },
  colors: { w: 4, h: 4 },
  triangles: { w: 4, h: 4 },
};

// ---------- Grid geometry ----------
// Nodes are the crossings where the line can turn. Node id = y * (w + 1) + x.

export const nodeId = (p: { w: number }, x: number, y: number) => y * (p.w + 1) + x;
export const nodeXY = (p: { w: number }, n: number): [number, number] => [n % (p.w + 1), Math.floor(n / (p.w + 1))];
export const edgeKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

/** Nodes next to n (up/down/left/right) that the line can reach: inside the board, track not broken. */
export function neighbors(p: Pick<PathPuzzle, "w" | "h" | "broken">, n: number, broken = new Set(p.broken)): number[] {
  const [x, y] = nodeXY(p, n);
  const out: number[] = [];
  for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx > p.w || ny > p.h) continue;
    const m = nodeId(p, nx, ny);
    if (!broken.has(edgeKey(n, m))) out.push(m);
  }
  return out;
}

/** Every track of the full grid, as [a, b] pairs. */
export function allEdges(p: { w: number; h: number }): [number, number][] {
  const out: [number, number][] = [];
  for (let y = 0; y <= p.h; y++)
    for (let x = 0; x <= p.w; x++) {
      if (x < p.w) out.push([nodeId(p, x, y), nodeId(p, x + 1, y)]);
      if (y < p.h) out.push([nodeId(p, x, y), nodeId(p, x, y + 1)]);
    }
  return out;
}

/** The 4 sides of a cell, as edge keys: top, bottom, left, right. */
export function cellSides(p: { w: number }, cell: number): string[] {
  const cx = cell % p.w;
  const cy = Math.floor(cell / p.w);
  const tl = nodeId(p, cx, cy);
  const tr = nodeId(p, cx + 1, cy);
  const bl = nodeId(p, cx, cy + 1);
  const br = nodeId(p, cx + 1, cy + 1);
  return [edgeKey(tl, tr), edgeKey(bl, br), edgeKey(tl, bl), edgeKey(tr, br)];
}

export const pathEdges = (path: number[]) => new Set(path.slice(1).map((n, i) => edgeKey(path[i], n)));

/**
 * Which area each cell is in, once the line cuts the board.
 * Two side-by-side cells are in the same area unless the line runs between them.
 */
export function regions(p: { w: number; h: number }, path: number[]): number[] {
  const cut = pathEdges(path);
  const id = new Array(p.w * p.h).fill(-1);
  let next = 0;
  for (let c0 = 0; c0 < id.length; c0++) {
    if (id[c0] >= 0) continue;
    const stack = [c0];
    id[c0] = next;
    while (stack.length) {
      const c = stack.pop()!;
      const cx = c % p.w;
      const cy = Math.floor(c / p.w);
      const [top, bottom, left, right] = cellSides(p, c);
      const moves: [boolean, number, string][] = [
        [cy > 0, c - p.w, top],
        [cy < p.h - 1, c + p.w, bottom],
        [cx > 0, c - 1, left],
        [cx < p.w - 1, c + 1, right],
      ];
      for (const [inside, other, side] of moves)
        if (inside && id[other] < 0 && !cut.has(side)) {
          id[other] = next;
          stack.push(other);
        }
    }
    next++;
  }
  return id;
}

// ---------- Checking ----------

export type PathCheck = {
  ok: boolean;
  validLine: boolean; // starts at the circle, ends at the exit, no repeats, no jumps or broken tracks
  bad: { dots: number[]; squares: number[]; triangles: number[] }; // indices of the symbols that break a rule
};

export function checkPath(p: PathPuzzle, path: number[]): PathCheck {
  const bad: PathCheck["bad"] = { dots: [], squares: [], triangles: [] };
  const broken = new Set(p.broken);
  const validLine =
    path.length >= 2 &&
    path[0] === p.start &&
    path[path.length - 1] === p.exit &&
    new Set(path).size === path.length &&
    path.slice(1).every((n, i) => neighbors(p, path[i], broken).includes(n));
  if (!validLine) return { ok: false, validLine, bad };

  const nodes = new Set(path);
  const edges = pathEdges(path);
  p.dots.forEach(([a, b], i) => {
    const covered = a === b ? nodes.has(a) : edges.has(edgeKey(a, b));
    if (!covered) bad.dots.push(i);
  });

  const area = regions(p, path);
  const colorsIn = new Map<number, Set<number>>();
  for (const s of p.squares) colorsIn.set(area[s.cell], (colorsIn.get(area[s.cell]) ?? new Set()).add(s.color));
  p.squares.forEach((s, i) => {
    if (colorsIn.get(area[s.cell])!.size > 1) bad.squares.push(i);
  });

  p.triangles.forEach((t, i) => {
    if (cellSides(p, t.cell).filter((side) => edges.has(side)).length !== t.count) bad.triangles.push(i);
  });

  const ok = bad.dots.length + bad.squares.length + bad.triangles.length === 0;
  return { ok, validLine, bad };
}

// ---------- Generating ----------

/** A random line from start to exit with at least minLen nodes (depth-first search with random turns). */
function randomPath(rng: Rng, p: PathPuzzle, minLen: number): number[] | null {
  const path = [p.start];
  const seen = new Set(path);
  let steps = 0;
  function go(): boolean {
    if (++steps > 50_000) return false; // give up, the caller retries
    const head = path[path.length - 1];
    if (head === p.exit) return path.length >= minLen; // too short? back up and keep looking
    for (const n of shuffled(neighbors(p, head), rng)) {
      if (seen.has(n)) continue;
      path.push(n);
      seen.add(n);
      if (go()) return true;
      path.pop();
      seen.delete(n);
    }
    return false;
  }
  return go() ? [...path] : null;
}

/** Maze: a random spanning tree (every node reachable, exactly one way between any two). */
function makeMaze(rng: Rng, p: PathPuzzle): number[] {
  const total = (p.w + 1) * (p.h + 1);
  const parent = new Array(total).fill(-1);
  const seen = new Set([p.start]);
  const stack = [p.start];
  const tree = new Set<string>();
  while (stack.length) {
    const n = stack[stack.length - 1];
    const fresh = neighbors(p, n).filter((m) => !seen.has(m));
    if (fresh.length === 0) {
      stack.pop();
      continue;
    }
    const m = fresh[randInt(rng, 0, fresh.length - 1)];
    seen.add(m);
    parent[m] = n;
    tree.add(edgeKey(n, m));
    stack.push(m);
  }
  p.broken = allEdges(p)
    .map(([a, b]) => edgeKey(a, b))
    .filter((k) => !tree.has(k));
  // The solution: walk back from the exit to the start along the tree
  const solution = [p.exit];
  while (solution[solution.length - 1] !== p.start) solution.push(parent[solution[solution.length - 1]]);
  return solution.reverse();
}

export function generatePathPuzzle(rng: Rng, mode: PathMode): { puzzle: PathPuzzle; solution: number[] } {
  const { w, h } = SIZES[mode];
  const p: PathPuzzle = {
    mode,
    w,
    h,
    start: nodeId({ w }, 0, h), // bottom-left
    exit: nodeId({ w }, w, 0), // top-right
    broken: [],
    dots: [],
    squares: [],
    triangles: [],
  };
  if (mode === "maze") return { puzzle: p, solution: makeMaze(rng, p) };

  const nodes = (w + 1) * (h + 1);
  for (let attempt = 0; ; attempt++) {
    const solution = randomPath(rng, p, Math.round(nodes * (attempt < 20 ? 0.6 : 0.4)));
    if (!solution) continue;

    if (mode === "dots") {
      const spots: Dot[] = [
        ...solution.slice(1, -1).map((n): Dot => [n, n]),
        ...solution.slice(1).map((n, i): Dot => (solution[i] < n ? [solution[i], n] : [n, solution[i]])),
      ];
      p.dots = shuffled(spots, rng).slice(0, randInt(rng, 5, 7));
      return { puzzle: p, solution };
    }

    if (mode === "colors") {
      const area = regions(p, solution);
      const count = Math.max(...area) + 1;
      if (count < 3) continue; // too few areas = too easy
      // Give each area a color, making sure both colors are used
      const order = shuffled([...Array(count).keys()], rng);
      const color = new Array<0 | 1>(count);
      order.forEach((a, i) => (color[a] = i === 0 ? 0 : i === 1 ? 1 : rng() < 0.5 ? 0 : 1));
      for (let a = 0; a < count; a++) {
        const cells = shuffled(area.flatMap((r, c) => (r === a ? [c] : [])), rng);
        for (const cell of cells.slice(0, randInt(rng, 1, Math.min(3, cells.length)))) p.squares.push({ cell, color: color[a] });
      }
      return { puzzle: p, solution };
    }

    // triangles: count the line's sides around each cell, show some of them
    const edges = pathEdges(solution);
    const counts = [...Array(w * h).keys()].map((cell) => ({ cell, count: cellSides(p, cell).filter((s) => edges.has(s)).length }));
    p.triangles = shuffled(
      counts.filter((c) => c.count >= 1 && c.count <= 3),
      rng,
    ).slice(0, randInt(rng, 5, 7));
    return { puzzle: p, solution };
  }
}
