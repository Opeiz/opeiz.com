import type { Metadata } from "next";
import Link from "next/link";
import { cv, formatRange, type Entry } from "@/data/cv";

// The /cv page: the "Classic CV". Plain, fast, printable.
// This is a Server Component (the default): it becomes plain HTML at build time,
// so it loads instantly and needs no JavaScript in the browser.

export const metadata: Metadata = {
  title: `${cv.name} · CV`,
  description: cv.role,
};

// The original PDF lives in /public, so it is served at this URL.
const PDF_URL = "/cv/joaquin-opazo-cv-fr.pdf";

export default function CvPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-10 print:max-w-none print:p-0">
      {/* Top bar: navigation only, hidden on paper */}
      <nav className="mb-8 flex items-center justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium opacity-80 hover:bg-foreground/5 hover:opacity-100"
        >
          ← Back to the game
        </Link>
        <a
          href={PDF_URL}
          download
          className="inline-flex min-h-11 items-center rounded-lg bg-foreground px-4 text-sm font-semibold text-background hover:opacity-90"
        >
          Download PDF (FR)
        </a>
      </nav>

      {/* Header */}
      <header className="mb-8 border-b border-foreground/15 pb-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{cv.name}</h1>
        <p className="mt-2 text-lg text-accent md:text-xl">{cv.role}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <li>{cv.location}</li>
          <li>
            <a href={`mailto:${cv.email}`} className="underline underline-offset-4 hover:text-accent">
              {cv.email}
            </a>
          </li>
          {cv.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-accent">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      {/* Body: 1 column on phone, main + sidebar on PC */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <main className="space-y-10">
          <EntrySection title="Experience" entries={cv.experience} />
          <EntrySection title="Projects & Awards" entries={cv.projects} />
          <EntrySection title="Education" entries={cv.education} />
          <EntrySection title="Activities" entries={cv.activities} />
        </main>

        <aside className="space-y-8 lg:border-l lg:border-foreground/15 lg:pl-8">
          <SideSection title="Skills">
            {cv.skills.map((group) => (
              <div key={group.name} className="mb-4 last:mb-0">
                <h3 className="mb-2 text-sm font-semibold">{group.name}</h3>
                <TagList tags={group.items} />
              </div>
            ))}
          </SideSection>

          <SideSection title="Languages">
            <ul className="space-y-1 text-sm">
              {cv.languages.map((lang) => (
                <li key={lang.name}>
                  <span className="font-medium">{lang.name}</span> · {lang.level}
                </li>
              ))}
            </ul>
          </SideSection>

          <SideSection title="Soft skills">
            <SimpleList items={cv.softSkills} />
          </SideSection>

          <SideSection title="Hobbies">
            <SimpleList items={cv.hobbies} />
          </SideSection>
        </aside>
      </div>
    </div>
  );
}

// ---------- Small reusable components ----------

/** A titled list of CV entries (jobs, degrees, projects...). */
function EntrySection({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <section>
      <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-accent">{title}</h2>
      <div className="space-y-7">
        {entries.map((entry) => (
          <article key={entry.slug} className="break-inside-avoid">
            <h3 className="text-lg font-semibold leading-snug">{entry.title}</h3>
            {/* Phone: org and dates stack. md and up: same line, dates on the right */}
            <p className="mt-1 flex flex-col text-sm opacity-75 md:flex-row md:justify-between md:gap-4">
              <span>
                {entry.org} · {entry.location}
              </span>
              <span className="whitespace-nowrap">{formatRange(entry.start, entry.end)}</span>
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
              {entry.highlights.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {entry.tags && (
              <div className="mt-3">
                <TagList tags={entry.tags} />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">{title}</h2>
      {children}
    </section>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag} className="rounded-md border border-foreground/15 px-2 py-0.5 text-xs">
          {tag}
        </li>
      ))}
    </ul>
  );
}

function SimpleList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 text-sm">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
