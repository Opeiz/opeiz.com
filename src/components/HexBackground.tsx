"use client";

import { useEffect, useRef } from "react";
import { cornerKey, hexWidth, nearestCorner, step, type Corner } from "@/lib/hexpath";

const R = 44; // hexagon side, in px
const W = hexWidth(R);
const EDGE_MS = 520; // time to draw one edge
const TRAIL = 48; // edges kept on screen; older ones disappear
const CHUNKS = 8; // the trail is split in 8 pieces, each a bit fainter: a fading tail

/**
 * Decorative background: a faint hexagon grid and one line that walks along it forever.
 * Fixed behind the page, ignores the mouse, hidden from screen readers and from print.
 * With "reduce motion" on, the line is drawn once and stays still.
 *
 * Why refs and not React state: the line changes 60 times a second. Updating the SVG
 * directly skips re-rendering React components 60 times a second.
 */
export function HexBackground() {
  const chunks = useRef<(SVGPolylineElement | null)[]>([]);
  const head = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const bounds = { width: window.innerWidth, height: window.innerHeight };
    const rng = Math.random;
    let corners: Corner[] = [nearestCorner(bounds.width * 0.3, bounds.height * 0.6, R)];
    let next = step(rng, corners[0], null, new Set(), bounds, R);

    function advance() {
      const current = corners[corners.length - 1];
      const recent = new Set(corners.map(cornerKey));
      corners.push(next);
      if (corners.length > TRAIL + 1) corners = corners.slice(-TRAIL - 1);
      next = step(rng, next, current, recent, bounds, R);
    }

    function draw(t: number) {
      // t (0..1) = how far along the newest edge the line has got
      const last = corners[corners.length - 1];
      const tip = { x: last.x + (next.x - last.x) * t, y: last.y + (next.y - last.y) * t };
      const points = [...corners, tip];
      const segments = points.length - 1;
      chunks.current.forEach((el, i) => {
        // Chunk 0 is the oldest, chunk 7 the newest. Spread the segments evenly over the 8 chunks
        // (each chunk shares its last point with the next one, so there are no gaps).
        const from = Math.floor((i * segments) / CHUNKS);
        const to = Math.floor(((i + 1) * segments) / CHUNKS);
        const part = points.slice(from, to + 1);
        el?.setAttribute("points", part.length > 1 ? part.map((p) => `${p.x},${p.y}`).join(" ") : "");
      });
      head.current?.setAttribute("cx", String(tip.x));
      head.current?.setAttribute("cy", String(tip.y));
    }

    const onResize = () => {
      bounds.width = window.innerWidth;
      bounds.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (let i = 0; i < TRAIL; i++) advance();
      draw(0);
      return () => window.removeEventListener("resize", onResize);
    }

    let frame = 0;
    let last = performance.now();
    let t = 0;
    const tick = (now: number) => {
      t += Math.min(now - last, 100) / EDGE_MS; // cap: after a hidden tab, don't jump ahead
      last = now;
      while (t >= 1) {
        advance();
        t -= 1;
      }
      draw(t);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <svg aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 size-full print:hidden">
      <defs>
        {/* One tile of the honeycomb (w × 3r); the browser repeats it over the whole screen */}
        <pattern id="hex-grid" width={W} height={3 * R} patternUnits="userSpaceOnUse">
          <path
            d={`M0,0 V${R} L${W / 2},${1.5 * R} L${W},${R} M${W / 2},${1.5 * R} V${2.5 * R} L0,${3 * R} M${W / 2},${2.5 * R} L${W},${3 * R} M${W},0 V${R}`}
            fill="none"
            stroke="var(--foreground)"
            strokeOpacity={0.05}
            strokeWidth={1.5}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex-grid)" />
      <g fill="none" stroke="var(--accent)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        {Array.from({ length: CHUNKS }, (_, i) => (
          <polyline
            key={i}
            ref={(el) => {
              chunks.current[i] = el;
            }}
            // oldest chunk almost invisible, newest the strongest (still faint)
            strokeOpacity={0.02 + (0.2 * (i + 1)) / CHUNKS}
          />
        ))}
      </g>
      <circle ref={head} r={6} fill="var(--accent)" fillOpacity={0.3} cx={-50} cy={-50} />
    </svg>
  );
}
