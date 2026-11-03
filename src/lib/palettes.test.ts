// Every random palette must stay readable. Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { contrast, PALETTES, type Tokens } from "./palettes.ts";

test("contrast math: black on white is 21, same color is 1", () => {
  assert.equal(Math.round(contrast("#000000", "#ffffff")), 21);
  assert.equal(contrast("#777777", "#777777"), 1);
});

// [text, background] pairs that really appear on the site
const PAIRS: [keyof Tokens, keyof Tokens][] = [
  ["foreground", "background"],
  ["foreground", "surface"],
  ["muted", "background"],
  ["muted", "surface"],
  ["accent", "background"], // labels like "01 / EXPERIENCE", links
  ["accent", "surface"], // company names on cards
  ["accent", "accentSoft"], // "Current" badge
  ["onAccent", "accent"], // text on orange buttons
];

for (const palette of PALETTES) {
  for (const mode of ["light", "dark"] as const) {
    test(`${palette.name} (${mode}) is readable: every text pair ≥ 4.5:1`, () => {
      const t = palette[mode];
      for (const [text, bg] of PAIRS) {
        const ratio = contrast(t[text], t[bg]);
        assert.ok(ratio >= 4.5, `${text} on ${bg}: ${ratio.toFixed(2)}:1 (${t[text]} on ${t[bg]})`);
      }
    });
  }
}

test("palette ids are unique", () => {
  const ids = PALETTES.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});
