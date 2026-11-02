# Personal Site Plan

A **professional one-page site**: a clean CV and portfolio that scrolls through a few sections, with one small playful corner (a game). It's also my project for **learning full stack**.

It reflects who I am: **visual, puzzles, strategy, solutions, coding**, but recruiters see a professional page first.

> Inspiration: ricfergas.com and mightbesimon.com (friendly greeting hero, single centered column, simple menu, warm but professional tone, a small game to "burn 5 minutes", language switcher).

---

## 1. Page structure

One page (`/`), sections stacked top to bottom, plus the classic CV at `/cv`.

```
┌───────────────────────────────────────────────┐
│ Joaquin.  Experience · Off the clock · Game · Contact   [CV] │ ← sticky menu
├───────────────────────────────────────────────┤
│ ABOUT       "Hi, I'm Joaquin 👋", name, role, summary, chips, buttons │
├───────────────────────────────────────────────┤
│ 01 EXPERIENCE   ◀ [ job card ] ▶   ● ○ ○ ○ ○  │
│                 + Education & awards grid     │
├───────────────────────────────────────────────┤
│ 02 OFF THE CLOCK  hobbies (cards) + fun facts │
├───────────────────────────────────────────────┤
│ 03 BORED?   Conway's Game of Life (canvas)    │
├───────────────────────────────────────────────┤
│ 04 CONTACT  email, LinkedIn, GitHub           │
├───────────────────────────────────────────────┤
│ footer                                        │
└───────────────────────────────────────────────┘
```

| Section | Component | Notes |
|---|---|---|
| Menu | `SiteHeader` in `src/app/page.tsx` | Sticky. Links jump to `#ids`. On phone the links scroll sideways. |
| About | `page.tsx` | Photo or initials, summary from `cv.summary` |
| Experience | `src/components/ExperienceCarousel.tsx` | CSS scroll-snap (swipe for free), ◀ ▶, dots, arrow keys, re-snaps on resize |
| Off the clock | `page.tsx` | `cv.hobbies` and `cv.funFacts` |
| Game | `src/components/GameOfLife.tsx` + `src/lib/life.ts` | Canvas, play/step/random/clear, draw with mouse/finger. Logic is pure and tested. |
| Contact | `page.tsx` | `mailto:` for now; real form in Phase 3 |
| Classic CV | `src/app/cv/page.tsx` | Printable, PDF download when `cv.pdfUrl` is set |

**All content lives in `src/data/cv.ts`**: write it once, every page uses it.

### Rules (do not skip)
- The **classic CV** (`/cv`) is always one click away (menu "CV" button).
- **Keyboard**: everything works without a mouse (carousel arrow keys, game buttons).
- **Reduce motion**: no smooth scrolling and no auto-playing animation when the visitor asks for less motion. The game never starts on its own.
- **Mobile first**: design at 390px, then add `md:` and `lg:`. No sideways page scroll.
- Tap targets **at least 44×44px**.

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router) + TypeScript** | React is what most jobs ask for. Frontend and backend in one project. |
| Styling | **Tailwind CSS v4** | Fast to work with, common in job listings |
| Animation | CSS (and **Framer Motion** later, if needed) | Keep it subtle and professional |
| Visuals | **Canvas** (Game of Life) | Learn to draw by hand |
| Tests | **Node's built-in test runner** (`npm test`) | No extra library; runs TypeScript directly |
| Database/Auth | **Supabase** (Postgres, Auth, Storage) | Real SQL, free tier |
| Email | **Resend** (free tier) | Contact form notifications |
| Hosting | **Vercel** | Auto-deploy on every push |

**Next.js 16 notes:** `cacheComponents` is on, so a prerendered page can't call `new Date()` directly (see `CurrentYear` with `"use cache"` in `page.tsx`). `<Image priority>` is deprecated: use `loading="eager"` for the main image.

---

## 3. Full-stack features (where the learning happens)

1. **Contact form**. Saves to the database and emails me. Learn: API routes / Server Actions, validation (Zod), spam protection.
2. **Admin panel** (`/admin`, only I can log in with Supabase Auth). Edit experience, hobbies and fun facts without touching code. Learn: CRUD, auth, protected routes.
3. **Game of Life patterns gallery**. Visitors save a pattern they drew and share a link. Learn: writes, Row Level Security.
4. **Guestbook**. Sign in with GitHub and leave a message. Learn: OAuth.
5. **Simple analytics**. Which sections people reach, clicks on "CV" and "Contact". Learn: events, aggregation queries.

### Database tables (draft)
```
profiles       (id, name, role, summary, avatar_url)
experiences    (id, company, title, location, start_date, end_date, highlights[], tags[], sort_order)
education      (id, school, title, start_date, end_date, highlights[])
hobbies        (id, icon, title, text, sort_order)
fun_facts      (id, icon, text, sort_order)
messages       (id, name, email, body, created_at)
life_patterns  (id, name, cells, created_at)
guestbook      (id, user_id, message, created_at)
events         (id, name, section, created_at)
```

---

## 4. Roadmap (each phase ends with something online)

### Phase 0: Basics
- [x] Git and GitHub basics, create the repo
- [ ] HTML/CSS/JS refresher, TypeScript intro
- [x] `npx create-next-app@latest` with TypeScript, Tailwind and App Router
- [x] Deploy "Hello World" to Vercel (https://opeiz-com.vercel.app)

### Phase 1: Classic CV
- [x] `/cv` page with hardcoded content, responsive, printable
- [ ] PDF download (English PDF without phone number → `public/cv/`, set `cv.pdfUrl`)

### Phase 2: One-page site
- [x] Sticky menu with section links and CV button
- [x] About / hero with summary and buttons
- [x] Experience carousel (swipe, arrows, dots, keyboard) + education & awards
- [x] Off the clock: hobbies and fun facts
- [x] Game of Life section, with tests for the rules
- [x] Contact section (email, LinkedIn, GitHub)
- [ ] Rewrite the draft texts in my own voice (`cv.summary`, `cv.hobbies`, `cv.funFacts`)
- [ ] Add my photo (`public/me.jpg`, set `cv.photo`)
- [ ] ✅ **Push and share the link with recruiters**

### Phase 3: Backend
- [ ] Supabase project and tables
- [ ] Contact form with Resend email
- [ ] Move CV content into the database
- [ ] Admin panel with login

### Phase 4: Extras
- [ ] Projects section with 2–3 write-ups (Problem → Constraints → Decisions → Result), maybe MDX
- [ ] Game of Life: famous patterns menu, speed slider, save/share patterns
- [ ] Guestbook with GitHub OAuth

### Phase 5: Polish
- [ ] SEO, metadata, social preview image
- [ ] Accessibility pass, Lighthouse above 90 (mobile)
- [ ] Custom domain (opeiz.com)
- [ ] Language switcher: English / Español / Français

### Phase 6: Keep it alive
- [ ] "Devlog": write about building the site (shows how I think)

---

## 5. Principles
- **Professional first, playful second.** The game is a bonus, never in the way.
- **Ship ugly first, then make it beautiful.**
- **Mobile first.** Design at 390px.
- **Data separate from display** (`src/data/cv.ts`).
- **Pure logic + tests** for anything algorithmic (`src/lib/*.ts` + `*.test.ts`).
- **The repo is a portfolio project too.** Public, with a good README.

---

## Archived: the board game idea
The first version was a board game ("Roll for the CV"): pick a token, roll a loaded die, move around an isometric diamond board. It was dropped because it felt less professional. The code is saved in the Git tag **`board-game-prototype`** (`git checkout board-game-prototype` to look at it, `git checkout main` to come back).
