# Roll for the CV: Personal Site Plan

A personal CV and portfolio site built as a **board game**. The visitor picks a token, rolls a die, and moves along a board. Each section square opens part of my CV.

It reflects who I am: **visual, puzzles, strategy, solutions, coding**. It's also my project for **learning full stack**.

> Reference sites for inspiration: mightbesimon.com, ricfergas.com (built with React + Vercel + Supabase).

---

## 1. Concept

### Visitor flow
1. **Choose your token**: 4 silver game-piece tokens, each one a **different version of me** (original designs).
   - Each token has **4 side images** (front, right, back, left). Showing the right image for the current angle makes it look like a 3D model (the "sprite" trick from classic games).
   - On the selection screen the tokens spin slowly or can be dragged to rotate. On the board, the token faces the direction it moves.
   - Assets: 4 tokens × 4 sides = 16 transparent PNG/WebP images, same size (e.g. 512×512), same lighting and same center point.
   - The token sets the accent color and a short line of text ("The Strategist", "The Builder"...).
2. **The board**: a **loop around a square board, shown as an isometric diamond** (classic board-game layout, with my own squares and look). The token starts on **START**, the front corner.
3. **Roll the die**: a 3D animation. The roll is **loaded**: it always gives the number of squares to the next section.
4. **The token moves square by square**, with a small hop and a sound that can be muted.
5. **It lands on a section square** and a card opens (About, Experience, Project, Skills...).
6. When the card closes, the visitor rolls again. The last square is **FINISH: "You win, let's talk"**, which shows the contact form.

### Board layout
A loop of `4 × (n − 1)` squares around an n×n grid (20 squares → 6×6). The middle is empty: the die lives there.
```
 flat grid                          on screen: rotateX(60°) rotateZ(45°)
 ┌────┬────┬────┬────┬────┬────┐                  ◇ PROJECTS (back)
 │PROJ│    │fact│SKIL│    │ACTV│               ◇     ◇
 ├────┼────┴────┴────┴────┼────┤            ◇    🎲     ◇
 │fact│                   │fact│      EXP ◇   (center)    ◇ ACTIVITIES
 │EDUC│      center       │    │            ◇           ◇
 │    │      (die)        │    │               ◇     ◇
 │fact│                   │FIN │                  ◇ START (front)
 ├────┼────┬────┬────┬────┼────┤
 │EXP │    │fact│ABOU│    │STRT│ ← START, then the path goes left and around
 └────┴────┴────┴────┴────┴────┘   FINISH is the last square before START
```
- Corners (ids 0, 5, 10, 15): START, Experience, Projects, Activities.
- Icons and the token **stand upright** on the tilted board ("billboarding").

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

## 2. Responsive design: mobile-first, isometric diamond everywhere

The same diamond board on every screen. The diamond is 2:1 (wide and short), so phones need a camera that zooms in.

```
PHONE (≈390px)            TABLET (≈768px)           PC (≥1024px)
┌──────────────┐          ┌────────────────┐        ┌──────────────────────┬─────────┐
│ 🎲 Title  CV→│          │ 🎲 Title    CV→│        │ 🎲 Title         CV→ │         │
│   ◇  ◇  ◇    │          │     ◇    ◇     │        │       ◇     ◇        │ Section │
│ (zoomed in,  │          │  ◇  DIAMOND  ◇ │        │   ◇   DIAMOND    ◇   │ card    │
│ camera on    │          │     ◇    ◇     │        │       ◇     ◇        │ (side   │
│ the token)   │          │                │        │  mini-map · progress │  panel) │
│ [card sheet] │          │ [card sheet]   │        │                      │         │
└──────────────┘          └────────────────┘        └──────────────────────┴─────────┘
card = bottom sheet       card = bottom sheet       card = side panel
```

### Rules
- Squares store only their **order** on the loop. Row/column come from `perimeterCell()`, and screen position from `isoPosition()` (`src/lib/board-layout.ts`).
- The board plane has **no padding or gap**: every cell must be exactly 1/n of the board, or `isoPosition()` drifts. Spacing lives inside each cell.
- **Camera follows the token** (2b): on phones, zoom the board in (about 2×) and pan so the token stays centered.

### Phone
- Die **fixed at the bottom** in the thumb zone, with `padding-bottom: env(safe-area-inset-bottom)`.
- Cards open as a **bottom sheet** (swipe down to close, about 85% of the height).
- Tap targets **at least 44×44px**. Fully zoomed out, a tile is only about 60×30px, so tapping squares needs the zoomed camera (or the mini-map). Fact squares open on tap (phones have no hover).
- Use `100dvh` instead of `100vh`.
- `navigator.vibrate(30)` on the roll (works on Android).

### PC
- Board `max-width: ~960px` (diamond is 960×480), centered.
- Left column: mini-map, token, progress ("4/8 sections").
- Right column: section card as a side panel, so the board stays visible.
- Hover tooltips on fact squares.

### Tailwind pattern
```tsx
<div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6">
  <main>{/* diamond Board, die in its center; mini-map + progress below on PC */}</main>
  <aside className="hidden lg:block">{/* side card on PC */}</aside>
</div>

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
type SquareKind = "start" | "path" | "section" | "fact" | "ladder" | "puzzle" | "chance" | "finish";

type Square = {
  id: number;           // order on the path
  kind: SquareKind;
  label?: string;       // short text on the square
  icon?: string;        // emoji on the square
  sectionSlug?: string; // "about", "experience"...
  text?: string;        // fun fact
  jumpTo?: number;      // ladders
};

// Position is calculated, not stored (see src/lib/board-layout.ts):
// row = floor(id / cols); col = row is even ? id % cols : cols - 1 - id % cols
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
- [x] Git and GitHub basics, create the repo
- [ ] HTML/CSS/JS refresher, TypeScript intro
- [x] `npx create-next-app@latest` with TypeScript, Tailwind and App Router
- [x] Deploy "Hello World" to Vercel (https://opeiz-com.vercel.app)

### Phase 1: Classic CV first (1–2 weeks)
- [x] `/cv` page with hardcoded content, responsive, printable
- [ ] PDF download
- [ ] ✅ **Something real to send to recruiters**

### Phase 2: The Board Game (3–4 weeks)
- [x] **2a.** Static vertical board from `squares` data, at **390px first** (replaced by the diamond below)
- [x] **2a.** Isometric diamond loop board (CSS 3D, upright icons and token)
- [x] **2a.** Token selection screen (4 tokens, 4-side sprite rotation)
- [ ] **2a.** Replace the 16 placeholder token images in `public/tokens/` with real art
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
