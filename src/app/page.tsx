import Link from "next/link";
import { Board } from "@/components/Board";
import { squares } from "@/data/board";

// The home page ("/"): the game.
// Server Component; only <Board> runs in the browser ("use client" inside it).
export default function Home() {
  return (
    <div className="min-h-dvh px-4 pb-10 md:px-8">
      {/* Top bar. Recruiter rule: the classic CV is always one tap away */}
      <header className="mx-auto flex max-w-[640px] items-center justify-between gap-3 py-4">
        <h1 className="text-lg font-bold md:text-2xl">
          <span aria-hidden="true">🎲 </span>Roll for the CV
        </h1>
        <Link
          href="/cv"
          className="inline-flex min-h-11 items-center rounded-lg bg-foreground px-3 text-sm font-semibold text-background hover:opacity-90 md:px-4"
        >
          Skip the game → CV
        </Link>
      </header>

      <main>
        <Board squares={squares} />
      </main>
    </div>
  );
}
