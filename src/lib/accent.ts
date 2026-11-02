import type { CSSProperties } from "react";

/**
 * Inline style that overrides the --accent color for an element and everything inside it.
 * TypeScript doesn't know custom "--" properties, so we tell it the type with "as".
 */
export function accentStyle(color: string): CSSProperties {
  return { "--accent": color } as CSSProperties;
}
