import { ChevronDown } from "lucide-react";
import { LANG_NAMES, LANGS, type Lang } from "@/i18n/config";

// Flags as small SVG drawings (Windows can't show flag emojis, it shows "FR" letters instead).
// All drawn in a 3:2 box. English = UK, Spanish = Spain, French = France.
function Flag({ lang, className = "" }: { lang: Lang; className?: string }) {
  const common = { className: `block h-[14px] w-[21px] shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/15 ${className}`, "aria-hidden": true };
  if (lang === "fr")
    return (
      <svg viewBox="0 0 3 2" {...common}>
        <rect width="1" height="2" fill="#000091" />
        <rect x="1" width="1" height="2" fill="#ffffff" />
        <rect x="2" width="1" height="2" fill="#e1000f" />
      </svg>
    );
  if (lang === "es")
    return (
      <svg viewBox="0 0 3 2" {...common}>
        <rect width="3" height="2" fill="#aa151b" />
        <rect y="0.5" width="3" height="1" fill="#f1bf00" />
      </svg>
    );
  // UK (simplified Union Jack; "slice" crops its 2:1 shape into the 3:2 box)
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" {...common}>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#c8102e" strokeWidth="2" />
      <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  );
}

/**
 * Language switcher. Keeps the same page: on /fr/cv it links to /es/cv and /en/cv.
 * - md and up: the 3 flags in a row, current one highlighted
 * - phone: one flag button that opens a small menu (<details>: opens/closes with no JavaScript)
 */
export function LanguageSwitcher({ lang, path = "", label }: { lang: Lang; path?: "" | "/cv"; label: string }) {
  // Plain <a>, not <Link>: changing language is a full page load on purpose. The whole layout
  // changes (<html lang>, the palette script in <head>), and React can't re-run a <script> in the browser.
  const href = (l: Lang) => `/${l}${path}`;

  return (
    <nav aria-label={label} className="shrink-0">
      {/* PC: all flags */}
      <ul className="hidden items-center gap-1 md:flex">
        {LANGS.map((l) => (
          <li key={l}>
            <a
              href={href(l)}
              hrefLang={l}
              lang={l}
              aria-label={LANG_NAMES[l]}
              aria-current={l === lang ? "true" : undefined}
              title={LANG_NAMES[l]}
              className={`relative flex size-9 items-center justify-center rounded-full transition after:absolute after:-inset-1 after:content-[''] ${
                l === lang ? "bg-surface ring-1 ring-border" : "opacity-55 grayscale-[40%] hover:opacity-100 hover:grayscale-0"
              }`}
            >
              <Flag lang={l} />
            </a>
          </li>
        ))}
      </ul>

      {/* Phone: compact menu */}
      <details className="group relative md:hidden">
        <summary
          aria-label={`${label}: ${LANG_NAMES[lang]}`}
          className="relative flex h-9 cursor-pointer list-none items-center gap-1 rounded-full border border-border bg-surface px-2.5 after:absolute after:-inset-1 after:content-[''] [&::-webkit-details-marker]:hidden"
        >
          <Flag lang={lang} />
          <ChevronDown className="size-3.5 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <ul className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-2xl border border-border bg-surface p-1 shadow-lg">
          {LANGS.map((l) => (
            <li key={l}>
              <a
                href={href(l)}
                hrefLang={l}
                lang={l}
                aria-current={l === lang ? "true" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm ${l === lang ? "bg-accent-soft font-semibold text-accent" : "hover:bg-background"}`}
              >
                <Flag lang={l} />
                {LANG_NAMES[l]}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}
