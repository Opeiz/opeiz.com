# Roll for the CV: Personal Site Plan

A personal CV and portfolio site built as a **board game**. The visitor picks a token, rolls a die, and moves along a board. Each section square opens part of my CV.

It reflects who I am: **visual, puzzles, strategy, solutions, coding**. It's also my project for **learning full stack**.

> Reference sites for inspiration: mightbesimon.com, ricfergas.com (built with React + Vercel + Supabase).

---

## 1. Concept

### Visitor flow
1. **Choose your token**: 4–6 options (♟ pawn, 🧩 puzzle piece, ⚙️ gear, 🎲 die, 💡 bulb, 🐙 octopus).
   - The token sets the accent color and a short line of text ("The Strategist", "The Builder"...).
2. **The board**: a vertical zigzag path. The token starts on **START**.
3. **Roll the die**: a 3D animation. The roll is **loaded**: it always gives the number of squares to the next section.
4. **The token moves square by square**, with a small hop and a sound that can be muted.
5. **It lands on a section square** and a card opens (About, Experience, Project, Skills...).
6. When the card closes, the visitor rolls again. The last square is **FINISH: "You win, let's talk"**, which shows the contact form.

### Board layout (example)
```
[START] → [ ] → [ABOUT]
                   ↓
[EXP] ← [fact] ← [ ]
  ↓
[ ] → [PROJ 1] → [ ]
                   ↓
[SKILLS] ← [fact] ← [ ]
  ↓
[ ] → [PROJ 2] → [LAB 🧩]
                   ↓
            [FINISH: CONTACT]
```

### Square types
| Type | What it does |
|---|---|
| `start` | Starting point |
| `section` | Opens a CV card (About, Experience, Project, Skills, Lab) |
| `fact` | **Fun fact** shown as the token passes ("☕ 3 coffees/day", "Favorite algorithm: A*"). This is where my geek side shows. |
| `ladder` 🪜 | "Promotion!" The token jumps ahead (good for Experience) |
| `puzzle` 🔒 | Solve a small puzzle to pass, or skip. Time goes to the leaderboard. |
| `chance` 🃏 | Random fun fact or a code snippet I'm proud of |
| `finish` | Contact form, "You win" |

### Other sections
- **Skills as a tech tree** (strategy-game style): HTML/CSS leads to JS, then React, then Next.js. Each node links to the projects where I used it.
- **Projects told as puzzles**: Problem, then Constraints, then Moves (decisions), then Solution, then Result.
- **The Lab**: algorithm visualizers (pathfinding, sorting, Game of Life), small puzzles, generative art.

### Recruiter rules (do not skip)
- **"Skip the game → Classic CV"** button visible on every screen. It goes to a plain, fast, printable `/cv` page with a PDF download.
- **Free travel**: a mini-map lets people jump to any square, so nobody is forced to roll.
- **Remember progress** in localStorage.
- **Keyboard**: `Space` rolls the die, `Enter` opens the card, `Esc` closes it.
- **Reduce motion**: skip animations and move the token instantly.

---

## 2. Responsive design: mobile-first, vertical everywhere

The same vertical board on every screen. On PC it just gets more space around it.

```
PHONE (≈390px)        TABLET (≈768px)        PC (≥1024px)
┌──────────┐          ┌───────────────┐      ┌──────┬──────────┬──────────┐
│ ☰  token │          │ ☰  token  CV→ │      │ Mini │  BOARD   │ Section  │
│  BOARD   │          │    BOARD      │      │ map  │ (vertical│ card     │
│ (zigzag) │          │ (wider zigzag)│      │ Token│   path)  │ (side    │
│ [ 🎲 ]   │          │   [ 🎲 ]      │      │ info │  [ 🎲 ]  │  panel)  │
└──────────┘          └───────────────┘      └──────┴──────────┴──────────┘
card = bottom sheet   card = bottom sheet    card = side panel
```

### Rules
- **3 squares per row on phone, 4–5 on PC.** Square positions are stored as row/column, and the code works out the zigzag from the screen width.
- Path line drawn with **SVG + `viewBox`** so it scales to any width.
- **Camera follows the token**: `scrollIntoView({ behavior: "smooth", block: "center" })`.

### Phone
- Die **fixed at the bottom** in the thumb zone, with `padding-bottom: env(safe-area-inset-bottom)`.
- Cards open as a **bottom sheet** (swipe down to close, about 85% of the height).
- Tap targets **at least 44×44px**. Fact squares open on tap (phones have no hover).
- Use `100dvh` instead of `100vh`.
- `navigator.vibrate(30)` on the roll (works on Android).

### PC
- Board column `max-width: ~640px`, centered.
- Left column: mini-map, token, progress ("4/8 sections").
- Right column: section card as a side panel, so the board stays visible.
- Hover tooltips on fact squares.

### Tailwind pattern
```tsx
<div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,640px)_1fr] gap-6">
  <aside className="hidden lg:block">{/* mini-map + token */}</aside>
  <main>{/* vertical Board */}</main>
  <aside className="hidden lg:block">{/* side card on PC */}</aside>
</div>

<DiceButton className="fixed bottom-4 inset-x-0 mx-auto lg:sticky lg:bottom-8" />
<BottomSheet className="lg:hidden" />
```
```ts
const isDesktop = useMediaQuery("(min-width: 1024px)");
// isDesktop ? <SidePanel/> : <BottomSheet/>, same <SectionCard/> inside
```

### Testing
- Chrome DevTools device toolbar at **360px, 390px and 1440px**.
- Real phone on the local network: `next dev -H 0.0.0.0`, then open `http://<pc-ip>:3000`.
- Vercel preview URL on every push.
- Lighthouse (mobile) score above 90.

---

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | React is what most jobs ask for. Frontend and backend in one project. |
| Styling | **Tailwind CSS** | Fast to work with, common in job listings |
| Animation | **Framer Motion** (token, cards), **CSS 3D** (die) | Smooth, declarative |
| Visuals | **SVG** (board), **Canvas** (Lab) | Learn to build visuals by hand |
| State | `useReducer` or **Zustand** | Game state machine |
| Database/Auth | **Supabase** (Postgres, Auth, Storage) | Real SQL, free tier |
| Content | **MDX** for project write-ups | Write projects like a blog |
| Email | **Resend** (free tier) | Contact form notifications |
| Hosting | **Vercel** | Auto-deploy on every push |

---

## 4. Game logic (theory)

### Board as data
```ts
type SquareKind = "start" | "section" | "fact" | "ladder" | "puzzle" | "chance" | "finish";

type Square = {
  id: number;           // order on the path
  kind: SquareKind;
  sectionSlug?: string; // "about", "project-1"...
  text?: string;        // fun fact
  jumpTo?: number;      // ladders
  row: number;
  col: number;
};
```

### The loaded die
```ts
const next = squares.find(s => s.id > current && s.kind === "section");
const roll = next.id - current; // always lands right
// If roll > 6: split into two rolls, or put a ladder in between
```

### State machine
```ts
type Phase = "choosing" | "idle" | "rolling" | "moving" | "reading" | "finished";

type GameState = {
  token: string | null;
  position: number;
  visited: number[];
  phase: Phase;
};
```
`choosing → idle → rolling → moving → reading → idle → … → finished`

---

## 5. Full-stack features (where the learning happens)

1. **Admin panel** (`/admin`, only I can log in with Supabase Auth). Edit experience, skills, tech tree and **board squares and fun facts** without touching code. Learn: CRUD, auth, protected routes.
2. **Contact form** (FINISH square). Saves to the database and emails me. Learn: API routes, validation (Zod), spam protection.
3. **Puzzle leaderboard**. Lock squares record solve times. Learn: writes, Row Level Security, rankings.
4. **Guestbook "Leave your move"**. Sign in with GitHub and leave a message. Learn: OAuth.
5. **Simple analytics**. Which squares people open, and how many reach FINISH. Learn: events, aggregation queries.

### Database tables (draft)
```
profiles       (id, name, role, bio, avatar_url)
experiences    (id, company, title, start_date, end_date, description, sort_order)
skills         (id, name, category, level, parent_skill_id)   -- builds the tech tree
projects       (id, slug, title, problem, solution, tech[], links, featured)
board_squares  (id, position, kind, section_slug, text, jump_to)
messages       (id, name, email, body, created_at)
puzzle_scores  (id, user_id, puzzle, time_ms, created_at)
guestbook      (id, user_id, message, created_at)
events         (id, square_id, token, created_at)
```

---

## 6. Roadmap (each phase ends with something online)

### Phase 0: Basics (1 week)
- [ ] Git and GitHub basics, create the repo
- [ ] HTML/CSS/JS refresher, TypeScript intro
- [x] `npx create-next-app@latest` with TypeScript, Tailwind and App Router
- [ ] Deploy "Hello World" to Vercel

### Phase 1: Classic CV first (1–2 weeks)
- [ ] `/cv` page with hardcoded content, responsive, printable
- [ ] PDF download
- [ ] ✅ **Something real to send to recruiters**

### Phase 2: The Board Game (3–4 weeks)
- [ ] **2a.** Static vertical board from `squares` data, at **390px first**
- [ ] **2a.** Token selection screen
- [ ] **2b.** Die 3D animation and loaded roll
- [ ] **2b.** Token moves square by square, camera follows
- [ ] **2c.** Section cards (bottom sheet on phone) and fun fact squares
- [ ] **2c.** FINISH square leads to contact
- [ ] **2d.** PC layout: mini-map, side panel card
- [ ] **2d.** Keyboard, reduce-motion, skip button, localStorage progress
- [ ] Write 2–3 projects in MDX (Problem → Solution format)

### Phase 3: Backend (2–3 weeks)
- [ ] Supabase project and tables
- [ ] Move CV content and board squares into the database
- [ ] Admin panel with login
- [ ] Contact form with Resend email

### Phase 4: Tech tree and Lab (2–3 weeks)
- [ ] Skill tree drawn from the database
- [ ] One algorithm visualizer
- [ ] Puzzle lock squares and leaderboard
- [ ] Guestbook with GitHub OAuth

### Phase 5: Polish
- [ ] SEO, metadata, social preview image
- [ ] Accessibility pass, Lighthouse above 90 (mobile)
- [ ] Custom domain
- [ ] Optional: English/Spanish versions

### Phase 6: Keep it alive
- [ ] "Devlog": write about building the site (shows how I think)

---

## 7. Principles
- **Ship ugly first, then make it beautiful.** Phase 1 matters more than the animations.
- **Mobile first.** Design at 390px, then add the PC columns.
- **The repo is a portfolio project too.** Public, with a good README and an architecture diagram.
- **Write tests** for the game logic (loaded die, state machine).
- Sketch the board in **Figma** before coding it.
