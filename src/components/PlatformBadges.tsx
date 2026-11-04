import { ArrowUpRight, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { siHackerrank, type SimpleIcon } from "simple-icons";
import type { Platform } from "@/data/cv";
import { t, type Dict } from "@/i18n/dictionaries";

// Brand logos from simple-icons (the same set shields.io badges use): an SVG path + the brand color.
const LOGOS: Record<NonNullable<Platform["logo"]>, SimpleIcon> = { hackerrank: siHackerrank };

/**
 * "Where I train": one card per coding site. Drawn in the site's own style (not shields.io
 * images), except CodeAbbey's banner, which is a LIVE image that updates by itself.
 */
export function PlatformBadges({ platforms, text }: { platforms: Platform[]; text: Dict["experience"] }) {
  if (platforms.length === 0) return null;
  return (
    <div className="mt-10">
      <h3 className="font-mono text-xs tracking-widest text-muted uppercase">{text.platforms}</h3>
      <p className="mt-2 mb-4 text-sm leading-relaxed text-muted">{text.platformsIntro}</p>
      <ul className="grid gap-3 md:grid-cols-3">
        {platforms.map((p) => (
          <li key={p.name} className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/40">
            <div className="flex items-center gap-3">
              <Logo platform={p} />
              <div className="min-w-0">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 font-semibold underline-offset-4 hover:text-accent hover:underline"
                >
                  {p.name}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
                <p className="text-sm leading-snug text-muted">{p.text}</p>
              </div>
            </div>

            {p.banner && (
              <a href={p.url} target="_blank" rel="noreferrer" className="self-start overflow-hidden rounded-lg border border-border bg-white">
                <Image
                  src={p.banner.src}
                  width={p.banner.width}
                  height={p.banner.height}
                  alt={t(text.liveBanner, { name: p.name })}
                  // unoptimized: load it straight from CodeAbbey, so it's always the latest stats
                  unoptimized
                />
              </a>
            )}

            {p.certificates.length > 0 && (
              <ul aria-label={text.certificates} className="flex flex-wrap gap-2">
                {p.certificates.map((c) => (
                  <li key={c.url}>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm transition hover:border-accent hover:text-accent"
                    >
                      <BadgeCheck className="size-4 text-accent" strokeWidth={1.8} aria-hidden="true" />
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Brand logo on a white tile (like the company logos), or initials when there's no logo. */
function Logo({ platform }: { platform: Platform }) {
  const icon = platform.logo ? LOGOS[platform.logo] : null;
  return (
    <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
      {icon ? (
        <svg viewBox="0 0 24 24" className="size-6" fill={`#${icon.hex}`}>
          <path d={icon.path} />
        </svg>
      ) : (
        <span className="font-mono text-sm font-semibold text-neutral-700">
          {platform.name.replace(/[^A-Z]/g, "").slice(0, 2)}
        </span>
      )}
    </span>
  );
}
