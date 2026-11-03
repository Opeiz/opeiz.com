// Color palettes: one is picked at random on each visit.
// Same layout, fonts and "paper + ink + one bold accent" idea, different color pairing.
//
// This file is the single source of truth:
//   - layout.tsx turns it into CSS (paletteCss) and a tiny script that picks one (paletteScript)
//   - palettes.test.ts checks every palette is readable (WCAG contrast ≥ 4.5:1)

export type Tokens = {
  background: string;
  surface: string; // cards
  foreground: string; // main text
  muted: string; // secondary text
  border: string;
  accent: string;
  onAccent: string; // text on accent buttons
  accentSoft: string; // badge backgrounds
  gridDot: string; // dotted hero background
};

export type Palette = { id: string; name: string; light: Tokens; dark: Tokens };

export const PALETTES: Palette[] = [
  {
    id: "signal",
    name: "Ink & Orange",
    light: { background: "#f6f4ef", surface: "#fffdf9", foreground: "#17171a", muted: "#5f5e5a", border: "#e2ded4", accent: "#b93d0b", onAccent: "#ffffff", accentSoft: "#fbe6da", gridDot: "rgb(23 23 26 / 0.09)" },
    dark: { background: "#0e1116", surface: "#151a21", foreground: "#ece9e2", muted: "#9b9a94", border: "#262c35", accent: "#ff7a45", onAccent: "#0e1116", accentSoft: "#33201a", gridDot: "rgb(236 233 226 / 0.07)" },
  },
  {
    id: "wine",
    name: "Wine & Mint",
    light: { background: "#f8f2f1", surface: "#fffafa", foreground: "#221416", muted: "#6b5a5c", border: "#ead9d8", accent: "#1a6e47", onAccent: "#ffffff", accentSoft: "#dcefe4", gridDot: "rgb(34 20 22 / 0.09)" },
    dark: { background: "#1a0d10", surface: "#231217", foreground: "#f3e8e8", muted: "#b19a9d", border: "#3a2228", accent: "#6fdc9f", onAccent: "#1a0d10", accentSoft: "#183326", gridDot: "rgb(243 232 232 / 0.07)" },
  },
  {
    id: "navy",
    name: "Navy & Gold",
    light: { background: "#f3f4f8", surface: "#fbfcff", foreground: "#121a2e", muted: "#556078", border: "#dde1ea", accent: "#7d5200", onAccent: "#ffffff", accentSoft: "#f6ead0", gridDot: "rgb(18 26 46 / 0.09)" },
    dark: { background: "#0a1226", surface: "#111b33", foreground: "#e8ecf5", muted: "#98a3ba", border: "#223052", accent: "#f5c451", onAccent: "#0a1226", accentSoft: "#2e2a17", gridDot: "rgb(232 236 245 / 0.07)" },
  },
  {
    id: "forest",
    name: "Forest & Coral",
    light: { background: "#f1f5f0", surface: "#fafdf9", foreground: "#142019", muted: "#56645b", border: "#dbe4dc", accent: "#b0342a", onAccent: "#ffffff", accentSoft: "#f8dfda", gridDot: "rgb(20 32 25 / 0.09)" },
    dark: { background: "#0c1611", surface: "#13201a", foreground: "#e7efe9", muted: "#96a89c", border: "#22362b", accent: "#ff8a70", onAccent: "#0c1611", accentSoft: "#3a1f1a", gridDot: "rgb(231 239 233 / 0.07)" },
  },
  {
    id: "lagoon",
    name: "Lagoon",
    light: { background: "#f1f6f7", surface: "#fafdfe", foreground: "#0f1d22", muted: "#52666d", border: "#d8e4e7", accent: "#0b6680", onAccent: "#ffffff", accentSoft: "#d6eef3", gridDot: "rgb(15 29 34 / 0.09)" },
    dark: { background: "#08151a", surface: "#0f1f26", foreground: "#e5f1f3", muted: "#93aab0", border: "#1d353e", accent: "#5eead4", onAccent: "#08151a", accentSoft: "#12322f", gridDot: "rgb(229 241 243 / 0.07)" },
  },
];

const CSS_NAMES: Record<keyof Tokens, string> = {
  background: "--background",
  surface: "--surface",
  foreground: "--foreground",
  muted: "--muted",
  border: "--border",
  accent: "--accent",
  onAccent: "--on-accent",
  accentSoft: "--accent-soft",
  gridDot: "--grid-dot",
};

function declarations(tokens: Tokens): string {
  return (Object.keys(CSS_NAMES) as (keyof Tokens)[]).map((key) => `${CSS_NAMES[key]}:${tokens[key]};`).join("");
}

/** CSS for all palettes: :root[data-palette="navy"] { --accent: … } plus the dark-mode version. */
export function paletteCss(): string {
  const light = PALETTES.map((p) => `:root[data-palette="${p.id}"]{${declarations(p.light)}}`).join("");
  const dark = PALETTES.map((p) => `:root[data-palette="${p.id}"]{${declarations(p.dark)}}`).join("");
  return `${light}@media (prefers-color-scheme: dark){${dark}}`;
}

/**
 * Tiny script that runs in <head> BEFORE the page is painted (so colors never "flash").
 * Picks a random palette, but keeps the same one for the rest of this tab (sessionStorage).
 */
export function paletteScript(): string {
  const ids = JSON.stringify(PALETTES.map((p) => p.id));
  return `(function(){var ids=${ids},id;try{id=sessionStorage.getItem("palette")}catch(e){}
if(ids.indexOf(id)<0){id=ids[Math.floor(Math.random()*ids.length)];try{sessionStorage.setItem("palette",id)}catch(e){}}
document.documentElement.dataset.palette=id})()`;
}

// ---------- Contrast math (WCAG 2) ----------

/** "#rrggbb" → relative luminance (0 = black, 1 = white), as the WCAG formula defines it. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; // undo the screen's "gamma"
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two colors: 1 (same) … 21 (black on white). Text needs ≥ 4.5. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
