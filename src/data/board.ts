// The board as data. The order in this array IS the path order around the loop.
// Row/column are NOT stored: they are calculated from the id
// (see src/lib/board-layout.ts), so adding squares never means re-placing them by hand.

export type SquareKind =
  | "start"
  | "path" // plain square, nothing happens
  | "section" // opens a CV card
  | "fact" // fun fact
  | "ladder"
  | "puzzle"
  | "chance"
  | "finish";

export type Square = {
  id: number; // position on the path (0 = START)
  kind: SquareKind;
  label?: string; // short text shown on the square
  icon?: string; // emoji shown on the square
  sectionSlug?: string; // which CV card opens: "about", "experience"...
  text?: string; // fun fact text
  jumpTo?: number; // ladders (later)
};

// Helper: write squares without typing the id by hand; the id comes from the order.
type SquareInput = Omit<Square, "id">;
const path: SquareInput = { kind: "path" };

// A loop board: the count must be a multiple of 4 (20 squares → 6×6 grid).
// Corners are ids 0, 5, 10, 15. Keep sections ≤ 6 squares apart (loaded die).
const squareList: SquareInput[] = [
  { kind: "start", label: "Start", icon: "🚩" }, // corner (front)
  path,
  { kind: "section", sectionSlug: "about", label: "About me", icon: "👋" },
  { kind: "fact", icon: "🌎", text: "From Valparaíso, Chile to Chambéry, in the French Alps." },
  path,
  { kind: "section", sectionSlug: "experience", label: "Experience", icon: "💼" }, // corner (left)
  { kind: "fact", icon: "🚁", text: "I build and race FPV drones." },
  path,
  { kind: "section", sectionSlug: "education", label: "Education", icon: "🎓" },
  { kind: "fact", icon: "🗣️", text: "I speak 3 languages: Spanish, English and French." },
  { kind: "section", sectionSlug: "projects", label: "Projects", icon: "🏆" }, // corner (back)
  path,
  { kind: "fact", icon: "⛵", text: "Sailing skipper with the French Sailing Federation." },
  { kind: "section", sectionSlug: "skills", label: "Skills", icon: "🧠" },
  path,
  { kind: "section", sectionSlug: "activities", label: "Activities", icon: "🤝" }, // corner (right)
  { kind: "fact", icon: "🎨", text: "Graphic design is my creative hobby." },
  path,
  path,
  { kind: "finish", label: "Let's talk", icon: "🏁" }, // last square before START
];

export const squares: Square[] = squareList.map((square, index) => ({ ...square, id: index }));
