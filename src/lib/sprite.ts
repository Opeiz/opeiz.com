// Pure math for the 4-side sprite trick. No React, easy to test.
import { SIDES, type Side } from "@/data/tokens";

/** Any angle → 0..359. (-90 → 270, 450 → 90). The "+ 360" handles negatives. */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Which side of the token faces the viewer at this angle.
 * Each side "owns" the 90° around it:
 *   front 315°–45° · right 45°–135° · back 135°–225° · left 225°–315°
 */
export function sideForAngle(angle: number): Side {
  const index = Math.round(normalizeAngle(angle) / 90) % 4; // 0, 1, 2 or 3
  return SIDES[index];
}

/** Snap to the nearest side, then turn one side (+1) or back (-1). For arrow keys. */
export function stepAngle(angle: number, direction: 1 | -1): number {
  return normalizeAngle(Math.round(angle / 90) * 90 + direction * 90);
}
