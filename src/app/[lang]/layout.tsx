import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLang, LANGS } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { paletteCss, paletteScript } from "@/lib/palettes";
import "../globals.css";

// Fonts are downloaded at BUILD time and served from this site (fast, no request to Google).
// Each one becomes a CSS variable, used in globals.css (@theme → font-sans / font-mono / font-display).
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] }); // body text
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] }); // labels, dates
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400", // this font only has one weight
  style: ["normal", "italic"],
  subsets: ["latin"],
}); // big titles

/** Build every language ahead of time: /en, /es, /fr (and their /cv pages) are static HTML. */
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLang(lang)) return {};
  const dict = getDictionary(lang);
  return {
    metadataBase: new URL("https://opeiz-com.vercel.app"),
    title: dict.meta.title,
    description: dict.meta.description,
    // Tells Google the same page exists in other languages
    alternates: { languages: Object.fromEntries(LANGS.map((l) => [l, `/${l}`])) },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLang(lang)) notFound(); // /de or /xyz → 404 instead of a broken page

  return (
    <html
      lang={lang} // screen readers pick the right pronunciation
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      // The palette script sets data-palette before React starts, so the HTML differs
      // from the server's on purpose. This tells React not to warn about it.
      suppressHydrationWarning
      // We use smooth scrolling for #links (globals.css). This tells Next.js to turn it off
      // while changing pages (e.g. /en → /cv), so new pages open at the top instantly.
      data-scroll-behavior="smooth"
    >
      <head>
        {/* All palettes as CSS, generated from src/lib/palettes.ts */}
        <style dangerouslySetInnerHTML={{ __html: paletteCss() }} />
        {/* Picks a random palette BEFORE the first paint, so colors never flash */}
        <script dangerouslySetInnerHTML={{ __html: paletteScript() }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
