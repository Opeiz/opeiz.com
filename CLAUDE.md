# Project context for Claude

This is my personal CV/portfolio site: a **professional one-page site** (About → Experience carousel → Off the clock → Puzzles (Light Up) → UTS Labs → Contact) plus a printable classic CV at `/cv`, in English, Spanish and French (`/en`, `/es`, `/fr`). The full plan is in `PLAN.md`. Read it before suggesting changes.

## About me
- I'm **learning full stack** with this project. Explain concepts as we go (what, why, and how), and prefer teaching over just dumping code.
- I think visually and love puzzles, strategy and solutions. Diagrams and step-by-step reasoning help me.
- Spanish is my first language. Keep explanations in simple, clear English (or Spanish if I ask).

## Stack
Next.js 16 (App Router) + TypeScript, Tailwind CSS v4, Supabase (later), Vercel.

## Rules
- **Professional first**: the playful parts (puzzles, fun facts) never get in the way of the CV content.
- **Mobile-first**: design at 390px first, then add `md:` and `lg:` styles. No sideways page scroll.
- All CV content lives in `src/data/cv.ts`. Pages only display it.
- The site is in **English, Spanish and French**. Every new text needs all 3: CV content as `{ en, es, fr }` in `src/data/cv.ts`, UI texts in `src/i18n/dictionaries.ts`. Use type annotations, never `as`, so TypeScript catches a missing language.
- Always keep the `/cv` link visible (menu "CV" button).
- Respect `prefers-reduced-motion` and keyboard navigation.
- Pure logic goes in `src/lib/` with tests (`npm test`). Files imported by tests use explicit `.ts` import extensions (Node's test runner needs them).
- Work phase by phase from the roadmap in `PLAN.md`, and tick the checkboxes as tasks get done.
- Small commits with clear messages.
