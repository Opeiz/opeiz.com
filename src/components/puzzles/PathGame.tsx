"use client";

import { RotateCcw, Timer } from "lucide-react";
import { useRef, useState } from "react";
import { t, type Dict } from "@/i18n/dictionaries";
import { allEdges, checkPath, edgeKey, generatePathPuzzle, neighbors, nodeXY, type PathCheck, type PathMode, type PathPuzzle } from "@/lib/puzzles/paths";
import { randomSeed, seededRng } from "@/lib/puzzles/random";
import { formatTime, useStopwatch } from "./useStopwatch";

// Same first puzzle on server and browser (fixed seeds); "New puzzle" picks a random seed.
const FIRST_SEED: Record<PathMode, number> = { maze: 11, dots: 2026, colors: 7, triangles: 42 };

// Board geometry in SVG units: one cell = U, M = margin around the grid
const U = 100;
const M = 60;
const TRACK = 22; // line thickness
const STUB = 42; // length of the exit stub

type Status = "idle" | "drawing" | "solved" | "failed";
type Point = { x: number; y: number };

/**
 * One line puzzle. Drag from the big circle to the exit (the short stub at the top right).
 * Keyboard: arrow keys draw, Esc clears. The answer is checked when the line reaches the exit.
 */
export function PathGame({ mode, text }: { mode: PathMode; text: Dict["puzzles"] }) {
  const [puzzle, setPuzzle] = useState<PathPuzzle>(() => generatePathPuzzle(seededRng(FIRST_SEED[mode]), mode).puzzle);
  const [path, setPath] = useState<number[]>([]);
  const [tail, setTail] = useState<Point | null>(null); // the bit of line between the last node and the pointer
  const [status, setStatus] = useState<Status>("idle");
  const [bad, setBad] = useState<PathCheck["bad"] | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const clock = useStopwatch();

  const broken = new Set(puzzle.broken);
  const width = 2 * M + puzzle.w * U;
  const height = 2 * M + puzzle.h * U;
  const pos = (n: number): Point => {
    const [x, y] = nodeXY(puzzle, n);
    return { x: M + x * U, y: M + y * U };
  };
  const exitEnd = { x: pos(puzzle.exit).x, y: M - STUB };

  // ---------- Moving the line ----------

  /** Try one step from the head to node `next`: forward (extend) or back (undo). Returns the new path. */
  function step(current: number[], next: number): number[] {
    if (current.length >= 2 && next === current[current.length - 2]) return current.slice(0, -1); // backtrack
    const head = current[current.length - 1];
    if (current.includes(next) || !neighbors(puzzle, head, broken).includes(next)) return current; // blocked
    return [...current, next];
  }

  function finish(final: number[]) {
    const result = checkPath(puzzle, final);
    setTail(null);
    setBad(result.bad);
    setStatus(result.ok ? "solved" : "failed");
    if (result.ok) clock.stop();
  }

  function begin() {
    setPath([puzzle.start]);
    setBad(null);
    setStatus("drawing");
    clock.start();
  }

  function clear() {
    setPath([]);
    setTail(null);
    setBad(null);
    setStatus("idle");
  }

  function newPuzzle() {
    setPuzzle(generatePathPuzzle(seededRng(randomSeed()), mode).puzzle);
    clear();
    clock.reset();
  }

  // ---------- Pointer (mouse, finger, pen) ----------

  function toSvg(e: React.PointerEvent): Point {
    const matrix = svgRef.current!.getScreenCTM()!.inverse();
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix);
    return { x: p.x, y: p.y };
  }

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (status === "solved") return;
    const p = toSvg(e);
    const s = pos(puzzle.start);
    if (Math.hypot(p.x - s.x, p.y - s.y) > 45) return; // must start on the circle
    e.currentTarget.setPointerCapture(e.pointerId); // keep getting moves even outside the board
    begin();
  }

  function onPointerMove(e: React.PointerEvent) {
    if (status !== "drawing") return;
    const p = toSvg(e);
    let current = path;
    // Walk the head toward the pointer one node at a time (fast moves skip several nodes)
    for (let i = 0; i < 20; i++) {
      const head = pos(current[current.length - 1]);
      const dx = p.x - head.x;
      const dy = p.y - head.y;
      const horizontal = Math.abs(dx) >= Math.abs(dy);
      const dist = horizontal ? Math.abs(dx) : Math.abs(dy);
      if (dist < U / 2) break;
      const [hx, hy] = nodeXY(puzzle, current[current.length - 1]);
      const [nx, ny] = horizontal ? [hx + Math.sign(dx), hy] : [hx, hy + Math.sign(dy)];
      if (nx < 0 || ny < 0 || nx > puzzle.w || ny > puzzle.h) break;
      const moved = step(current, ny * (puzzle.w + 1) + nx);
      if (moved === current) break;
      current = moved;
      if (current[current.length - 1] === puzzle.exit) {
        setPath(current);
        finish(current);
        return;
      }
    }
    if (current !== path) setPath(current);
    setTail(tailToward(current, p));
  }

  /** The short piece of line that follows the pointer along an open track (never past half a cell). */
  function tailToward(current: number[], p: Point): Point | null {
    const headId = current[current.length - 1];
    const head = pos(headId);
    const dx = p.x - head.x;
    const dy = p.y - head.y;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    const [hx, hy] = nodeXY(puzzle, headId);
    const [nx, ny] = horizontal ? [hx + Math.sign(dx), hy] : [hx, hy + Math.sign(dy)];
    if (nx < 0 || ny < 0 || nx > puzzle.w || ny > puzzle.h || (dx === 0 && dy === 0)) return null;
    const next = ny * (puzzle.w + 1) + nx;
    if (current.includes(next) || broken.has(edgeKey(headId, next))) return null;
    const len = Math.min(Math.abs(horizontal ? dx : dy), U / 2);
    return horizontal ? { x: head.x + Math.sign(dx) * len, y: head.y } : { x: head.x, y: head.y + Math.sign(dy) * len };
  }

  function onPointerUp() {
    if (status === "drawing") clear(); // let go before the exit = start over
  }

  // ---------- Keyboard ----------

  function onKeyDown(e: React.KeyboardEvent) {
    const dirs: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    if (e.key === "Escape") return clear();
    if (!(e.key in dirs) || status === "solved") return;
    e.preventDefault(); // don't scroll the page
    let current = status === "drawing" ? path : [puzzle.start];
    if (status !== "drawing") begin();
    const [hx, hy] = nodeXY(puzzle, current[current.length - 1]);
    const [nx, ny] = [hx + dirs[e.key][0], hy + dirs[e.key][1]];
    if (nx >= 0 && ny >= 0 && nx <= puzzle.w && ny <= puzzle.h) current = step(current, ny * (puzzle.w + 1) + nx);
    setPath(current);
    if (current[current.length - 1] === puzzle.exit) finish(current);
  }

  // ---------- Drawing ----------

  const failed = status === "failed";
  const lineColor = failed ? "#dc2626" : "var(--accent)";
  // Solid (mixed with the background, not transparent): crossings would look darker where tracks overlap
  const trackColor = "color-mix(in oklab, var(--foreground) 14%, var(--background))";
  const points = [...path.map(pos), ...(tail ? [tail] : []), ...(status === "solved" ? [exitEnd] : [])];
  const cellCenter = (cell: number): Point => ({ x: M + (cell % puzzle.w) * U + U / 2, y: M + Math.floor(cell / puzzle.w) * U + U / 2 });
  const errorFill = (isBad: boolean | undefined, normal: string) => (failed && isBad ? "#dc2626" : normal);

  const message =
    status === "solved" ? t(text.solved, { time: formatTime(clock.elapsed) }) : failed ? text.wrong : text.hint;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        role="application"
        aria-label={text.boardLabel}
        aria-describedby={`path-status-${mode}`}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        // touch-none: dragging on the board draws the line instead of scrolling the page
        className="w-full max-w-[30rem] touch-none rounded-2xl bg-background outline-none select-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {/* Tracks the line can follow (missing ones are maze walls) */}
        <g stroke={trackColor} strokeWidth={TRACK} strokeLinecap="round">
          {allEdges(puzzle)
            .filter(([a, b]) => !broken.has(edgeKey(a, b)))
            .map(([a, b]) => {
              const pa = pos(a);
              const pb = pos(b);
              return <line key={edgeKey(a, b)} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} />;
            })}
          <line x1={exitEnd.x} y1={pos(puzzle.exit).y} x2={exitEnd.x} y2={exitEnd.y} />
        </g>
        <circle cx={pos(puzzle.start).x} cy={pos(puzzle.start).y} r={28} fill={trackColor} />

        {/* Squares (colors): one dark, one light */}
        {puzzle.squares.map((s, i) => {
          const c = cellCenter(s.cell);
          return (
            <rect
              key={`s${i}`}
              x={c.x - 17}
              y={c.y - 17}
              width={34}
              height={34}
              rx={9}
              fill={errorFill(bad?.squares.includes(i), s.color === 0 ? "var(--foreground)" : "var(--surface)")}
              stroke={s.color === 1 ? "var(--foreground)" : "none"}
              strokeWidth={4}
            />
          );
        })}

        {/* Triangles: 1 to 3 in a row */}
        {puzzle.triangles.map((tri, i) => {
          const c = cellCenter(tri.cell);
          return (
            <g key={`t${i}`} fill={errorFill(bad?.triangles.includes(i), "var(--accent)")}>
              {Array.from({ length: tri.count }, (_, k) => {
                const x = c.x + (k - (tri.count - 1) / 2) * 24;
                return <polygon key={k} points={`${x},${c.y - 10} ${x + 10},${c.y + 8} ${x - 10},${c.y + 8}`} />;
              })}
            </g>
          );
        })}

        {/* The line */}
        {points.length > 0 && (
          <>
            <circle cx={pos(puzzle.start).x} cy={pos(puzzle.start).y} r={28} fill={lineColor} />
            <polyline
              points={points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={lineColor}
              strokeWidth={TRACK}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* Hexagons, on top of the line so you can still see them */}
        {puzzle.dots.map(([a, b], i) => {
          const pa = pos(a);
          const pb = pos(b);
          return (
            <Hexagon
              key={`d${i}`}
              x={(pa.x + pb.x) / 2}
              y={(pa.y + pb.y) / 2}
              fill={errorFill(bad?.dots.includes(i), "var(--foreground)")}
            />
          );
        })}
      </svg>

      <div className="flex w-full max-w-[30rem] flex-col gap-3">
        <div className="flex items-center justify-between font-mono text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Timer className="size-4" aria-hidden="true" />
            <span aria-label={text.time}>{formatTime(clock.elapsed)}</span>
          </span>
          <button
            type="button"
            onClick={newPuzzle}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-surface px-3 font-sans text-sm font-medium whitespace-nowrap text-foreground transition hover:border-foreground/30"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            {text.newPuzzle}
          </button>
        </div>
        <p
          id={`path-status-${mode}`}
          aria-live="polite"
          className={`text-sm leading-relaxed ${status === "solved" ? "font-semibold text-accent" : failed ? "text-red-600 dark:text-red-400" : "text-muted"}`}
        >
          {message}
        </p>
        <p className="text-sm leading-relaxed text-muted">{text.keys}</p>
      </div>
    </div>
  );
}

/** A small flat hexagon centered on (x, y). */
function Hexagon({ x, y, fill }: Point & { fill: string }) {
  const r = 10;
  const pts = Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k;
    return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  }).join(" ");
  return <polygon points={pts} fill={fill} />;
}
