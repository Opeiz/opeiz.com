// Languages of the site. Add one here and TypeScript will point at every text that needs it.

export const LANGS = ["en", "es", "fr"] as const; // "as const" = exactly these 3 strings, not any string
export type Lang = (typeof LANGS)[number]; // "en" | "es" | "fr"

export const DEFAULT_LANG: Lang = "en";

/** Type guard: turns a plain string (like a URL segment) into a Lang, or false. */
export function hasLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

/** A text in every language. Record<Lang, string> = { en: string; es: string; fr: string } */
export type L = Record<Lang, string>;

/** Language names written in their own language (for the switcher). */
export const LANG_NAMES: L = { en: "English", es: "Español", fr: "Français" };

/** Full locale for dates and the <html lang> attribute. */
export const LOCALES: L = { en: "en-GB", es: "es-CL", fr: "fr-FR" };

/**
 * Pick the best language from the browser's Accept-Language header,
 * e.g. "fr-FR,fr;q=0.9,en;q=0.8" → "fr". Pure function, so it's easy to test.
 */
export function pickLang(acceptLanguage: string | null): Lang {
  if (!acceptLanguage) return DEFAULT_LANG;
  const wanted = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { base: tag.split("-")[0].toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q); // highest preference first
  return wanted.map((w) => w.base).find(hasLang) ?? DEFAULT_LANG;
}
