"use client";

import { useEffect, useState } from "react";

/**
 * A stopwatch for the puzzles: starts on the first move, stops when solved.
 * Times are only read inside event handlers and the interval (never during render),
 * so the server and the browser always render the same "0:00" first.
 */
export function useStopwatch() {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [stoppedAt, setStoppedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  // Tick once a second, only while running
  useEffect(() => {
    if (startedAt === null || stoppedAt !== null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startedAt, stoppedAt]);

  const elapsed = startedAt === null ? 0 : Math.max(0, (stoppedAt ?? now) - startedAt);

  return {
    elapsed,
    running: startedAt !== null && stoppedAt === null,
    /** Call on every move: only the first call starts the clock. */
    start() {
      if (startedAt !== null) return;
      const t = Date.now();
      setStartedAt(t);
      setNow(t);
    },
    stop() {
      setStoppedAt(Date.now());
    },
    reset() {
      setStartedAt(null);
      setStoppedAt(null);
      setNow(0);
    },
  };
}

/** 125000 ms → "2:05" */
export function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
