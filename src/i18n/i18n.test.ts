// Translation tests. Run with: npm test
// TypeScript already checks every language has every key; these catch what types can't:
// empty texts, a missing palette name, and the browser-language detection.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCv } from "../data/cv.ts";
import { PALETTES } from "../lib/palettes.ts";
import { LANGS, pickLang } from "./config.ts";
import { getDictionary } from "./dictionaries.ts";

/** Every string inside an object, with its path, e.g. ["vision.filters.blur.label", "Gaussian blur"]. */
function allStrings(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => allStrings(v, `${path}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => allStrings(v, path ? `${path}.${k}` : k));
  return [];
}

for (const lang of LANGS) {
  test(`${lang}: no empty UI text`, () => {
    for (const [path, text] of allStrings(getDictionary(lang))) assert.ok(text.trim(), `empty: ${path}`);
  });

  test(`${lang}: no empty CV text`, () => {
    for (const [path, text] of allStrings(getCv(lang))) assert.ok(text.trim(), `empty: ${path}`);
  });

  test(`${lang}: every color palette has a name`, () => {
    for (const p of PALETTES) assert.ok(getDictionary(lang).palettes[p.id], `missing palette name: ${p.id}`);
  });
}

test("every language has the same number of jobs and bullet points", () => {
  const [en, ...others] = LANGS.map(getCv);
  for (const other of others)
    en.experience.forEach((job, i) =>
      assert.equal(other.experience[i].highlights.length, job.highlights.length, `${other.lang}: ${job.slug} bullets`),
    );
});

test("pickLang: reads the browser's Accept-Language header", () => {
  assert.equal(pickLang("fr-FR,fr;q=0.9,en;q=0.8"), "fr");
  assert.equal(pickLang("es-CL,es;q=0.9"), "es");
  assert.equal(pickLang("de-DE,de;q=0.9,es;q=0.5"), "es", "skips unsupported German, takes the next one");
  assert.equal(pickLang("en;q=0.3,fr;q=0.8"), "fr", "respects q priority, not order");
  assert.equal(pickLang("ja-JP"), "en", "unsupported → English");
  assert.equal(pickLang(null), "en", "no header → English");
});
