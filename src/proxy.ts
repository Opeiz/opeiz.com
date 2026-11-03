import { NextResponse, type NextRequest } from "next/server";
import { hasLang, pickLang } from "@/i18n/config";

// Proxy runs BEFORE a page is served (Next.js 16 renamed "middleware" to "proxy").
//
//   /  or  /cv          → redirect to /fr, /fr/cv... (the language the visitor chose before,
//                          or their browser's language, or English)
//   /fr, /es/cv, ...    → serve the page, and remember that language in a cookie
//
// Only these paths run it (see config.matcher), so images, CSS and logos are never slowed down.

const COOKIE = "lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1]; // "/fr/cv" → "fr"

  if (hasLang(first)) {
    // Already has a language: remember it for next time ("/" will go here directly)
    const response = NextResponse.next();
    if (request.cookies.get(COOKIE)?.value !== first) {
      response.cookies.set(COOKIE, first, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
    }
    return response;
  }

  // No language in the URL: choose one and redirect
  const saved = request.cookies.get(COOKIE)?.value;
  const lang = saved && hasLang(saved) ? saved : pickLang(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Must be constants (Next.js reads them at build time)
  matcher: ["/", "/cv", "/(en|es|fr)", "/(en|es|fr)/cv"],
};
