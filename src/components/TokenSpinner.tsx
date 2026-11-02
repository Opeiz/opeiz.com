"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SIDES, type Side, type Token } from "@/data/tokens";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { normalizeAngle, sideForAngle, stepAngle } from "@/lib/sprite";

const SPIN_SPEED = 0.09; // degrees per millisecond (= 90°/s → a new side every second)
const DRAG_SPEED = 0.6; // degrees per pixel dragged

/**
 * A token that looks 3D by swapping between 4 side images.
 * - Spins slowly on its own (not with "reduce motion")
 * - Drag left/right to turn it
 * - Arrow keys turn it one side at a time
 */
export function TokenSpinner({ token, className = "" }: { token: Token; className?: string }) {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // STATE: what the screen shows. Changing it redraws the component.
  const [side, setSide] = useState<Side>("front");
  // REFS: values that change all the time but don't need a redraw by themselves.
  const angle = useRef(0);
  const dragX = useRef<number | null>(null); // null = not dragging

  const setAngle = useCallback((value: number) => {
    angle.current = normalizeAngle(value);
    setSide(sideForAngle(angle.current)); // same side as before → React skips the redraw
  }, []);

  // Auto-spin with requestAnimationFrame: the browser calls `tick` before each frame.
  useEffect(() => {
    if (reduceMotion) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (dragX.current === null) setAngle(angle.current + (now - last) * SPIN_SPEED);
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame); // cleanup: stop when the component disappears
  }, [reduceMotion, setAngle]);

  return (
    <div
      role="img"
      tabIndex={0}
      aria-label={`${token.name}, ${side} view. Drag or use the arrow keys to turn it.`}
      className={`relative cursor-grab touch-pan-y select-none rounded-full outline-none focus-visible:ring-4 focus-visible:ring-accent active:cursor-grabbing ${className}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId); // keep getting moves even outside the element
        dragX.current = e.clientX;
      }}
      onPointerMove={(e) => {
        if (dragX.current === null) return;
        const dx = e.clientX - dragX.current;
        dragX.current = e.clientX;
        setAngle(angle.current - dx * DRAG_SPEED); // drag right → it turns to show its left side
      }}
      onPointerUp={() => (dragX.current = null)}
      onPointerCancel={() => (dragX.current = null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setAngle(stepAngle(angle.current, 1));
        if (e.key === "ArrowLeft") setAngle(stepAngle(angle.current, -1));
      }}
    >
      {/* All 4 images are loaded at once and stacked; only the current side is visible.
          Swapping visibility (instead of changing src) means no flicker while loading. */}
      {SIDES.map((s) => (
        <Image
          key={s}
          src={token.sprites[s]}
          alt=""
          fill
          sizes="(min-width: 768px) 288px, 224px"
          draggable={false}
          preload={s === "front"} // Next.js 16: "preload" replaces the old "priority"
          className={`pointer-events-none object-contain drop-shadow-xl ${s === side ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}
