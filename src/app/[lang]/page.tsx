import { ArrowUpRight, FileText, Languages, Mail, MapPin, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceCarousel } from "@/components/ExperienceCarousel";
import { Icon } from "@/components/Icon";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { OrgLogo } from "@/components/OrgLogo";
import { PaletteButton } from "@/components/PaletteButton";
import { VisionLab } from "@/components/VisionLab";
import { formatRange, getCv, type CV, type Entry, type IconName } from "@/data/cv";
import { hasLang, type Lang } from "@/i18n/config";
import { getDictionary, t, type Dict } from "@/i18n/dictionaries";

// The home page (/en, /es, /fr): one page that scrolls through 5 sections.
// Server Component: becomes plain HTML at build time (once per language). Only the carousel,
// the vision lab and the color button run JavaScript in the browser ("use client" inside them).

// Shared container: centered column, same width everywhere
const container = "mx-auto w-full max-w-3xl px-5 md:px-8";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound();
  const cv = getCv(lang); // content in this language
  const dict = getDictionary(lang); // UI texts in this language

  const currentJob = cv.experience.find((job) => job.end === null);

  return (
    <>
      <SiteHeader cv={cv} dict={dict} lang={lang} />

      <main>
        {/* 1. ABOUT (hero) ------------------------------------------------ */}
        <section id="about" aria-labelledby="about-title" className="relative scroll-mt-20 overflow-hidden">
          {/* Decorative dotted grid, full width, behind the content */}
          <div aria-hidden="true" className="bg-dots pointer-events-none absolute inset-0 -z-10" />

          <div className={`${container} pt-14 pb-20 md:pt-24 md:pb-28`}>
            <div className="flex flex-col-reverse gap-8 md:flex-row md:items-start md:justify-between">
              <div>
                {currentJob && (
                  <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted">
                    <span className="relative flex size-2">
                      {/* motion-safe: the ping animation only runs if the visitor allows motion */}
                      <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
                      <span className="relative inline-flex size-2 rounded-full bg-accent" />
                    </span>
                    {t(dict.hero.currentlyAt, { org: currentJob.org })}
                  </p>
                )}
                <p className="mt-6 font-display text-3xl text-accent italic md:text-4xl">{dict.hero.hi}</p>
                <h1 id="about-title" className="font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
                  {cv.name}
                </h1>
              </div>
              <Avatar cv={cv} />
            </div>

            <p className="mt-5 font-mono text-xs tracking-widest text-muted uppercase md:text-sm">{cv.role}</p>

            <div className="mt-8 max-w-2xl space-y-4 leading-relaxed text-muted md:text-lg">
              {cv.summary.map((paragraph, i) => (
                <p key={paragraph} className={i === 0 ? "text-lg text-foreground md:text-xl" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="mt-8 flex flex-wrap gap-2 text-sm">
              <Chip icon={<MapPin className="size-4" strokeWidth={1.6} />}>{cv.location}</Chip>
              <Chip icon={<Languages className="size-4" strokeWidth={1.6} />}>ES · EN · FR</Chip>
              <Chip icon={<Trophy className="size-4" strokeWidth={1.6} />}>{dict.hero.prize}</Chip>
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#contact" className={primaryButton}>
                <Mail className="size-4" strokeWidth={2} aria-hidden="true" />
                {dict.hero.getInTouch}
              </a>
              <Link href={`/${lang}/cv`} className={secondaryButton}>
                <FileText className="size-4" strokeWidth={1.8} aria-hidden="true" />
                {dict.hero.classicCv}
              </Link>
              <SocialLinks cv={cv} />
            </div>
          </div>
        </section>

        {/* 2. EXPERIENCE -------------------------------------------------- */}
        <Section id="experience" number="01" label={dict.experience.label} title={dict.experience.title}>
          <ExperienceCarousel
            entries={cv.experience.map((e) => ({ ...e, dates: formatRange(e.start, e.end, lang) }))}
            text={dict.experience}
          />

          <div className="mt-16">
            <EntryGroup title={dict.experience.education} entries={cv.education} lang={lang} columns={2} />
          </div>
          {/* Awards and Leadership have one card each: side by side on PC, stacked on phone */}
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-3">
            <EntryGroup title={dict.experience.awards} entries={cv.projects} lang={lang} />
            <EntryGroup title={dict.experience.leadership} entries={cv.activities} lang={lang} />
          </div>
        </Section>

        {/* 3. OFF THE CLOCK ----------------------------------------------- */}
        <Section
          id="off-the-clock"
          number="02"
          label={dict.offTheClock.label}
          title={dict.offTheClock.title}
          intro={dict.offTheClock.intro}
        >
          <ul className="grid gap-3 md:grid-cols-3">
            {cv.hobbies.map((hobby) => (
              <li
                key={hobby.text}
                className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/40"
              >
                <IconBadge name={hobby.icon} large />
                <p className="mt-4 font-semibold">{hobby.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{hobby.text}</p>
              </li>
            ))}
          </ul>

          <h3 className="mt-14 mb-5 font-mono text-xs tracking-widest text-muted uppercase">{dict.offTheClock.funFacts}</h3>
          <ul className="grid gap-x-8 gap-y-4 md:grid-cols-2">
            {cv.funFacts.map((fact) => (
              <li key={fact.text} className="flex items-start gap-3 leading-relaxed">
                <Icon name={fact.icon} className="mt-0.5 size-5 shrink-0 text-accent" />
                <span>{fact.text}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 4. VISION ------------------------------------------------------ */}
        <Section id="vision" number="03" label={dict.vision.label} title={dict.vision.title} intro={dict.vision.intro}>
          <VisionLab text={dict.vision} />
        </Section>

        {/* 5. CONTACT ----------------------------------------------------- */}
        <Section id="contact" number="04" label={dict.contact.label} title={dict.contact.title} intro={dict.contact.intro}>
          <a
            href={`mailto:${cv.email}`}
            className="group inline-flex items-center gap-2 font-display text-3xl break-all decoration-accent decoration-2 underline-offset-8 hover:underline md:text-5xl"
          >
            {cv.email}
            <ArrowUpRight
              aria-hidden="true"
              className="size-7 shrink-0 text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:size-9"
            />
          </a>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={`mailto:${cv.email}`} className={primaryButton}>
              <Mail className="size-4" strokeWidth={2} aria-hidden="true" />
              {dict.contact.send}
            </a>
            <SocialLinks cv={cv} />
          </div>
        </Section>
      </main>

      <footer className="border-t border-border">
        <div className={`${container} flex flex-col gap-2 py-8 font-mono text-xs text-muted md:flex-row md:justify-between`}>
          <p>
            © <CurrentYear /> {cv.name}
          </p>
          <p>{dict.footer.built}</p>
        </div>
      </footer>
    </>
  );
}

// ---------- Small building blocks ----------

const primaryButton =
  "inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent shadow-sm transition hover:opacity-90";
const secondaryButton =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium transition hover:border-foreground/30";

/** LinkedIn + GitHub as text links with a ↗ arrow (they open a new tab). */
function SocialLinks({ cv }: { cv: CV }) {
  const links = ["LinkedIn", "GitHub"].map((label) => cv.links.find((l) => l.label === label));
  return (
    <>
      {links.map(
        (link) =>
          link && (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={`group ${secondaryButton}`}>
              {link.label}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          ),
      )}
    </>
  );
}

/** Sticky top menu. On phones the links scroll sideways instead of wrapping. */
function SiteHeader({ cv, dict, lang }: { cv: CV; dict: Dict; lang: Lang }) {
  const nav = [
    { href: "#experience", label: dict.nav.experience },
    { href: "#off-the-clock", label: dict.nav.offTheClock },
    { href: "#vision", label: dict.nav.vision },
    { href: "#contact", label: dict.nav.contact },
  ];
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-5 md:gap-3 md:px-8">
        <a href="#about" className="flex min-h-14 shrink-0 items-center font-display text-2xl">
          {cv.firstName}
          <span className="text-accent">.</span>
        </a>
        <nav aria-label={dict.nav.sections} className="min-w-0 flex-1">
          {/* mask: the links fade out at the right edge on phones, hinting they scroll */}
          <ul className="flex gap-1 overflow-x-auto text-sm [scrollbar-width:none] [mask-image:linear-gradient(to_right,black_85%,transparent)] md:[mask-image:none] [&::-webkit-scrollbar]:hidden">
            {nav.map((item) => (
              <li key={item.href} className="shrink-0">
                <a href={item.href} className="flex min-h-11 items-center rounded-full px-3 text-muted transition-colors hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitcher lang={lang} label={dict.header.language} />
        <PaletteButton text={{ ...dict.header, names: dict.palettes }} />
        <Link
          href={`/${lang}/cv`}
          className="relative inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-sm font-medium transition after:absolute after:-inset-1 after:content-[''] hover:border-foreground/30"
        >
          <FileText className="size-4" strokeWidth={1.8} aria-hidden="true" />
          CV
        </Link>
      </div>
    </header>
  );
}

/** A numbered page section. scroll-mt-20 = leave room for the sticky header. */
function Section({
  id,
  number,
  label,
  title,
  intro,
  children,
}: {
  id: string;
  number: string;
  label: string; // short label above the title, e.g. "Vision"
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 border-t border-border">
      <div className={`${container} py-20 md:py-28`}>
        <p className="font-mono text-xs tracking-widest text-accent uppercase">
          {number} <span className="text-muted">/</span> {label}
        </p>
        <h2 id={`${id}-title`} className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-5xl">
          {title}
        </h2>
        {intro && <p className="mt-4 max-w-2xl leading-relaxed text-muted md:text-lg">{intro}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

/** A small titled list of entries (degrees, awards...) with their logos. */
function EntryGroup({ title, entries, lang, columns = 1 }: { title: string; entries: Entry[]; lang: Lang; columns?: 1 | 2 }) {
  if (entries.length === 0) return null; // no empty headings
  return (
    <div>
      <h3 className="mb-4 font-mono text-xs tracking-widest text-muted uppercase">{title}</h3>
      <ul className={`grid gap-3 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
        {entries.map((entry) => (
          <li key={entry.slug} className="flex h-full gap-4 rounded-2xl border border-border bg-surface p-4">
            <OrgLogo src={entry.logo} org={entry.org} />
            <div>
              <p className="leading-snug font-semibold">{entry.title}</p>
              <p className="mt-1 text-sm text-muted">{entry.org}</p>
              <p className="mt-1 font-mono text-xs text-muted">{formatRange(entry.start, entry.end, lang)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Icon inside a soft accent-colored rounded square. */
function IconBadge({ name, large = false }: { name: IconName; large?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent ${large ? "size-11" : "size-10"}`}
    >
      <Icon name={name} className={large ? "size-6" : "size-5"} />
    </span>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-muted">
      <span aria-hidden="true" className="text-accent">
        {icon}
      </span>
      {children}
    </li>
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

/** My photo if set in cv.ts, otherwise my initials in a circle. */
function Avatar({ cv }: { cv: CV }) {
  const ring = "size-24 shrink-0 rounded-full ring-1 ring-border ring-offset-4 ring-offset-background md:size-32";
  if (cv.photo) {
    return <Image src={cv.photo} alt={cv.name} width={128} height={128} loading="eager" className={`${ring} object-cover`} />;
  }
  const initials = cv.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return (
    <div aria-hidden="true" className={`${ring} flex items-center justify-center bg-accent-soft font-display text-4xl text-accent md:text-5xl`}>
      {initials}
    </div>
  );
}
