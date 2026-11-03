# Joaquin Opazo Yentzen · Personal site

My CV and portfolio, in English, Español and Français: a one-page site with my experience, a bit about me off the clock, three logic puzzles (Sudoku, Killer Sudoku, Light Up), and a way to get in touch.

Prefer paper? A classic, printable CV lives at [`/cv`](https://opeiz-com.vercel.app/cv).

## Stack
Next.js 16 (App Router) + TypeScript · Tailwind CSS v4 · Vercel

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
npm test           # puzzles, palettes, translations
npm run build      # same build Vercel runs
```

## Where things are
| Path | What |
|---|---|
| `src/data/cv.ts` | All the content, in 3 languages (edit this to update the site) |
| `src/i18n/` | Languages: config, UI texts (dictionaries), tests |
| `src/proxy.ts` | Sends `/` to `/en`, `/es` or `/fr` |
| `src/app/[lang]/page.tsx` | The one-page site |
| `src/app/[lang]/cv/page.tsx` | The printable classic CV |
| `src/components/` | Experience carousel, puzzles, language switcher |
| `src/lib/puzzles/` | Puzzle generators and rule checks (pure functions + tests) |

## Roadmap
See [PLAN.md](PLAN.md).
