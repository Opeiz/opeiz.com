import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { paletteCss, paletteScript } from "@/lib/palettes";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Joaquin Opazo Yentzen · Software Engineer",
  description: "Software engineer in C++, Python, robotics and embedded systems, based in Chambéry, France.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      // The palette script sets data-palette before React starts, so the HTML differs
      // from the server's on purpose. This tells React not to warn about it.
      suppressHydrationWarning
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
