# Project context for Claude

This is my personal CV/portfolio site, designed as a **board game** ("Roll for the CV"). The full plan is in `PLAN.md`. Read it before suggesting changes.

## About me
- I'm **learning full stack** with this project. Explain concepts as we go (what, why, and how), and prefer teaching over just dumping code.
- I think visually and love puzzles, strategy and solutions. Diagrams and step-by-step reasoning help me.
- Spanish is my first language. Keep explanations in simple, clear English (or Spanish if I ask).

## Stack
Next.js (App Router) + TypeScript, Tailwind CSS, Framer Motion, Supabase, Vercel.

## Rules
- **Mobile-first**: design at 390px first, then add `md:` and `lg:` styles.
- The board is an **isometric diamond loop on every screen size** (see PLAN.md §1–2). Keep `isoPosition()` exact: no padding/gap on the board plane.
- Always keep the "Skip the game → Classic CV" path working.
- Respect `prefers-reduced-motion` and keyboard navigation.
- Work phase by phase from the roadmap in `PLAN.md`, and tick the checkboxes as tasks get done.
- Small commits with clear messages.
