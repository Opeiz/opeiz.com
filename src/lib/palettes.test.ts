// Every random palette must stay readable. Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { contrast, nextPalette, paletteScript, PALETTES, type Tokens } from "./palettes.ts";

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

test("nextPalette: never repeats the last palette", () => {
  const ids = PALETTES.map((p) => p.id);
  for (const last of ids)
    for (const r of [0, 0.3, 0.6, 0.999]) assert.notEqual(nextPalette(ids, last, () => r), last);
  assert.ok(ids.includes(nextPalette(ids, null)), "first visit: any palette");
});

test("palette script: 20 refreshes in a row, the colors change every time", () => {
  // A fake browser: just the two things the script touches
  const storage = new Map<string, string>();
  const fake = {
    sessionStorage: { getItem: (k: string) => storage.get(k) ?? null, setItem: (k: string, v: string) => void storage.set(k, v) },
    document: { documentElement: { dataset: {} as Record<string, string> } },
  };
  const run = new Function("sessionStorage", "document", paletteScript());
  let previous = "";
  for (let i = 0; i < 20; i++) {
    run(fake.sessionStorage, fake.document); // = one refresh
    const now = fake.document.documentElement.dataset.palette;
    assert.ok(PALETTES.some((p) => p.id === now), `valid palette: ${now}`);
    assert.notEqual(now, previous, `refresh ${i + 1} changed the colors`);
    previous = now;
  }
});
