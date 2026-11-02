import Image from "next/image";
import Link from "next/link";
import { ExperienceCarousel } from "@/components/ExperienceCarousel";
import { GameOfLife } from "@/components/GameOfLife";
import { cv, formatRange } from "@/data/cv";

// The home page ("/"): one page that scrolls through 5 sections.
// Server Component: becomes plain HTML at build time. Only the carousel and the game
// run JavaScript in the browser ("use client" inside them).

// Menu links (the name on the left already goes to #about)
const NAV = [
  { href: "#experience", label: "Experience" },
  { href: "#off-the-clock", label: "Off the clock" },
  { href: "#game", label: "Game" },
  { href: "#contact", label: "Contact" },
];

const linkedIn = cv.links.find((l) => l.label === "LinkedIn");
const gitHub = cv.links.find((l) => l.label === "GitHub");

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-4 md:px-8">
        {/* 1. ABOUT ------------------------------------------------------ */}
        <section id="about" aria-labelledby="about-title" className="scroll-mt-28 pt-12 pb-16 md:pt-20 md:pb-24">
          <Avatar />
          <p className="mt-6 text-lg opacity-70">Hi, I&apos;m {cv.firstName} 👋</p>
          <h1 id="about-title" className="mt-1 text-4xl font-bold tracking-tight md:text-6xl">
            {cv.name}
          </h1>
          <p className="mt-3 text-lg text-accent md:text-xl">{cv.role}</p>

          <div className="mt-6 space-y-4 text-lg leading-relaxed opacity-90">
            {cv.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-6 flex flex-wrap gap-2 text-sm">
            <Chip>📍 {cv.location}</Chip>
            <Chip>🗣️ ES · EN · FR</Chip>
            <Chip>🏆 1st prize, Thales RISC-V</Chip>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className={primaryButton}>
              Get in touch
            </a>
            <Link href="/cv" className={secondaryButton}>
              Classic CV
            </Link>
            {linkedIn && (
              <a href={linkedIn.href} target="_blank" rel="noreferrer" className={secondaryButton}>
                LinkedIn
              </a>
            )}
            {gitHub && (
              <a href={gitHub.href} target="_blank" rel="noreferrer" className={secondaryButton}>
                GitHub
              </a>
            )}
          </div>
        </section>

        {/* 2. EXPERIENCE ------------------------------------------------- */}
        <Section id="experience" number="01" title="Experience">
          <ExperienceCarousel entries={cv.experience} />

          <h3 className="mt-14 mb-4 text-sm font-bold tracking-widest uppercase opacity-60">
            Education & awards
          </h3>
          <ul className="grid gap-3 md:grid-cols-2">
            {[...cv.education, ...cv.projects, ...cv.activities].map((entry) => (
              <li key={entry.slug} className="rounded-xl border border-foreground/10 p-4">
                <p className="font-semibold leading-snug">{entry.title}</p>
                <p className="mt-1 text-sm opacity-70">
                  {entry.org} · {formatRange(entry.start, entry.end)}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        {/* 3. OFF THE CLOCK ---------------------------------------------- */}
        <Section id="off-the-clock" number="02" title="Off the clock" intro="The less formal part. When I'm not writing code:">
          <ul className="grid gap-3 md:grid-cols-3">
            {cv.hobbies.map((hobby) => (
              <li key={hobby.text} className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-5">
                <p className="text-3xl" aria-hidden="true">
                  {hobby.icon}
                </p>
                <p className="mt-3 font-semibold">{hobby.title}</p>
                <p className="mt-1 text-sm leading-relaxed opacity-75">{hobby.text}</p>
              </li>
            ))}
          </ul>

          <h3 className="mt-12 mb-4 text-sm font-bold tracking-widest uppercase opacity-60">Fun facts</h3>
          <ul className="space-y-3">
            {cv.funFacts.map((fact) => (
              <li key={fact.text} className="flex items-start gap-3 leading-relaxed">
                <span className="text-xl" aria-hidden="true">
                  {fact.icon}
                </span>
                <span>{fact.text}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 4. GAME ------------------------------------------------------- */}
        <Section
          id="game"
          number="03"
          title="Bored? Try the Game of Life"
          intro="Conway's Game of Life: every cell lives or dies based on its 8 neighbours. Draw some cells, press Play, and watch the patterns move."
        >
          <GameOfLife />
          <details className="mt-6 rounded-xl border border-foreground/10 p-4 text-sm leading-relaxed">
            <summary className="cursor-pointer font-semibold">The 4 rules</summary>
            <ul className="mt-3 list-disc space-y-1 pl-5 opacity-80">
              <li>A live cell with fewer than 2 neighbours dies (loneliness).</li>
              <li>A live cell with 2 or 3 neighbours survives.</li>
              <li>A live cell with more than 3 neighbours dies (crowding).</li>
              <li>A dead cell with exactly 3 neighbours comes alive.</li>
            </ul>
          </details>
        </Section>

        {/* 5. CONTACT ---------------------------------------------------- */}
        <Section id="contact" number="04" title="Let's talk" intro="A project, a question, or just a hello: my inbox is open.">
          <a
            href={`mailto:${cv.email}`}
            className="block break-all text-2xl font-semibold text-accent underline-offset-8 hover:underline md:text-4xl"
          >
            {cv.email}
          </a>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${cv.email}`} className={primaryButton}>
              Send an email
            </a>
            {linkedIn && (
              <a href={linkedIn.href} target="_blank" rel="noreferrer" className={secondaryButton}>
                LinkedIn
              </a>
            )}
            {gitHub && (
              <a href={gitHub.href} target="_blank" rel="noreferrer" className={secondaryButton}>
                GitHub
              </a>
            )}
          </div>
        </Section>
      </main>

      <footer className="mx-auto w-full max-w-3xl border-t border-foreground/10 px-4 py-8 text-sm opacity-60 md:px-8">
        © <CurrentYear /> {cv.name} · Built with Next.js, Tailwind CSS and Vercel
      </footer>
    </>
  );
}

// ---------- Small building blocks ----------

const primaryButton =
  "inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-semibold text-white hover:opacity-90";
const secondaryButton =
  "inline-flex min-h-11 items-center rounded-lg border border-foreground/15 px-5 font-medium hover:bg-foreground/5";

/** Sticky top menu. On phones the links scroll sideways instead of wrapping. */
function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-foreground/10 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 md:px-8">
        <a href="#about" className="flex min-h-14 shrink-0 items-center font-bold">
          {cv.firstName}
          <span className="text-accent">.</span>
        </a>
        <nav aria-label="Sections" className="min-w-0 flex-1">
          <ul className="flex gap-1 overflow-x-auto text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map((item) => (
              <li key={item.href} className="shrink-0">
                <a href={item.href} className="flex min-h-11 items-center rounded-md px-2.5 opacity-75 hover:bg-foreground/5 hover:opacity-100">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/cv" className="inline-flex min-h-9 shrink-0 items-center rounded-lg bg-foreground px-3 text-sm font-semibold text-background hover:opacity-90">
          CV
        </Link>
      </div>
    </header>
  );
}

/** A numbered page section with a title. scroll-mt-28 = leave room for the sticky header. */
function Section({
  id,
  number,
  title,
  intro,
  children,
}: {
  id: string;
  number: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 border-t border-foreground/10 py-16 md:py-24">
      <p className="font-mono text-sm text-accent">{number}</p>
      <h2 id={`${id}-title`} className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 max-w-2xl text-lg leading-relaxed opacity-75">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

/**
 * The year for the footer. Next.js 16 (cacheComponents) won't let a prerendered page
 * call new Date() directly, because the "current" date would silently be the build date.
 * "use cache" makes that explicit: compute it, cache it, refresh it now and then.
 */
async function CurrentYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

function Chip({ children }: { children: React.ReactNode }) {
  return <li className="rounded-full border border-foreground/15 px-3 py-1">{children}</li>;
}

/** My photo if set in cv.ts, otherwise my initials in a circle. */
function Avatar() {
  if (cv.photo) {
    return (
      <Image src={cv.photo} alt={cv.name} width={112} height={112} loading="eager" className="h-24 w-24 rounded-full object-cover md:h-28 md:w-28" />
    );
  }
  const initials = cv.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return (
    <div aria-hidden="true" className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/15 text-3xl font-bold text-accent md:h-28 md:w-28">
      {initials}
    </div>
  );
}
