# Joaquin Opazo Yentzen · Personal site

My CV and portfolio: a one-page site with my experience, a bit about me off the clock, a small Game of Life to play with, and a way to get in touch.

Prefer paper? A classic, printable CV lives at [`/cv`](https://opeiz-com.vercel.app/cv).

## Stack
Next.js 16 (App Router) + TypeScript · Tailwind CSS v4 · Vercel

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Game of Life rules
npm run build      # same build Vercel runs
```

## Where things are
| Path | What |
|---|---|
| `src/data/cv.ts` | All the content (edit this to update the site) |
| `src/app/page.tsx` | The one-page site |
| `src/app/cv/page.tsx` | The printable classic CV |
| `src/components/` | Experience carousel, Game of Life |
| `src/lib/life.ts` | Game of Life rules (pure functions + tests) |

## Roadmap
See [PLAN.md](PLAN.md).
