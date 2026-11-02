import Link from "next/link";

// The home page ("/"). In the App Router, src/app/page.tsx = the "/" URL.
// Mobile-first: base classes are for phones (~390px); md:/lg: add bigger-screen styles.
export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-5xl" aria-hidden="true">
        🎲
      </p>
      <h1 className="text-3xl font-bold md:text-5xl">Roll for the CV</h1>
      <p className="max-w-sm text-base opacity-70 md:text-lg">
        Hello World! The board is under construction.
      </p>

      {/* Recruiter rule: the classic CV is always one tap away */}
      <Link
        href="/cv"
        className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-foreground px-5 font-semibold text-background hover:opacity-90"
      >
        Skip the game → Classic CV
      </Link>
    </main>
  );
}
