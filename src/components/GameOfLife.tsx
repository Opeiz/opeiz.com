"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { countAlive, emptyGrid, nextGeneration, PATTERNS, randomGrid, stamp, type Grid } from "@/lib/life";

const COLS = 36;
const ROWS = 22;
const CELL = 16; // size of one cell in canvas pixels (CSS then scales the canvas to fit)
const TICK_MS = 120; // time between generations while playing

/** Starting pattern: three gliders and a blinker, so there's something to watch. */
function startGrid(): Grid {
  const grid = emptyGrid(COLS, ROWS);
  stamp(grid, COLS, ROWS, PATTERNS.glider, 2, 3);
  stamp(grid, COLS, ROWS, PATTERNS.glider, 9, 14);
  stamp(grid, COLS, ROWS, PATTERNS.glider, 4, 26);
  stamp(grid, COLS, ROWS, PATTERNS.blinker, 16, 8);
  return grid;
}

export function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // useState(() => ...) runs the function only once, on the first render.
  const [initial] = useState(startGrid);
  const grid = useRef<Grid>(initial); // REF: the canvas reads it directly, no re-render needed
  const paintValue = useRef<0 | 1 | null>(null); // while dragging: paint alive (1) or dead (0)

  // STATE: only what is shown as text or changes the buttons
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [alive, setAlive] = useState(() => countAlive(initial));

  /** Paint the whole grid on the canvas. */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    // Read the site's colors from CSS, so the game follows light/dark mode and the accent
    const css = getComputedStyle(canvas);
    const on = css.getPropertyValue("--accent").trim() || "#4f46e5";
    const off = css.getPropertyValue("--foreground").trim() || "#171717";

    ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const isAlive = grid.current[row * COLS + col] === 1;
        ctx.fillStyle = isAlive ? on : off;
        ctx.globalAlpha = isAlive ? 1 : 0.06; // dead cells: very faint squares
        ctx.beginPath();
        ctx.roundRect(col * CELL + 1, row * CELL + 1, CELL - 2, CELL - 2, 3);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }, []);

  /** Replace the grid, then update the text and the canvas. */
  const update = useCallback(
    (next: Grid, nextGen: (g: number) => number) => {
      grid.current = next;
      setGeneration(nextGen);
      setAlive(countAlive(next));
      draw();
    },
    [draw],
  );

  const step = useCallback(() => update(nextGeneration(grid.current, COLS, ROWS), (g) => g + 1), [update]);

  // Setup once: sharp pixels on retina screens, first draw, redraw when light/dark mode changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = COLS * CELL * dpr;
    canvas.height = ROWS * CELL * dpr;
    ctx.scale(dpr, dpr);
    draw();
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", draw);
    return () => scheme.removeEventListener("change", draw);
  }, [draw]);

  // The game loop: only exists while running. The cleanup stops it on Pause.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, TICK_MS);
    return () => clearInterval(id);
  }, [running, step]);

  /** Which cell is under the pointer? Converts screen pixels → grid row/col. */
  function cellIndexAt(e: React.PointerEvent<HTMLCanvasElement>): number {
    const rect = e.currentTarget.getBoundingClientRect();
    const col = Math.min(COLS - 1, Math.floor(((e.clientX - rect.left) / rect.width) * COLS));
    const row = Math.min(ROWS - 1, Math.floor(((e.clientY - rect.top) / rect.height) * ROWS));
    return row * COLS + col;
  }

  function paintAt(index: number) {
    if (paintValue.current === null || grid.current[index] === paintValue.current) return;
    grid.current[index] = paintValue.current;
    setAlive(countAlive(grid.current));
    draw();
  }

  const button =
    "inline-flex min-h-11 items-center justify-center rounded-lg border border-foreground/15 px-4 text-sm font-medium hover:bg-foreground/5 disabled:opacity-40";

  return (
    <div>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Game of Life grid, generation ${generation}, ${alive} cells alive. Use the buttons below to play.`}
        className="block aspect-[36/22] w-full cursor-crosshair touch-none rounded-xl border border-foreground/10"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          const index = cellIndexAt(e);
          paintValue.current = grid.current[index] ? 0 : 1; // first cell decides: draw or erase
          paintAt(index);
        }}
        onPointerMove={(e) => paintAt(cellIndexAt(e))}
        onPointerUp={() => (paintValue.current = null)}
        onPointerCancel={() => (paintValue.current = null)}
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={running}
          onClick={() => setRunning((r) => !r)}
          className={`${button} min-w-24 border-accent bg-accent font-semibold text-white hover:bg-accent hover:opacity-90`}
        >
          {running ? "Pause" : "Play"}
        </button>
        <button type="button" onClick={step} disabled={running} className={button}>
          Step
        </button>
        <button type="button" onClick={() => update(randomGrid(COLS, ROWS), () => 0)} className={button}>
          Random
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            update(emptyGrid(COLS, ROWS), () => 0);
          }}
          className={button}
        >
          Clear
        </button>
        <p className="ml-auto text-sm tabular-nums opacity-70" aria-live="off">
          Gen {generation} · {alive} alive
        </p>
      </div>
    </div>
  );
}
