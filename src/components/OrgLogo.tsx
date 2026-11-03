import Image from "next/image";

/**
 * A company / school logo on a white tile.
 * - White in light AND dark mode: most logos are made for white paper (some even have a white background).
 * - No logo file? Show the organization's initials instead, so there's never a hole.
 * - alt="": the organization's name is always written next to it, so a screen reader would only repeat it.
 */
export function OrgLogo({ src, org, size = "md" }: { src?: string; org: string; size?: "md" | "lg" }) {
  // 2:1 tiles: logos range from square (Dassault) to very wide (Thales, 5:1), so 2:1 fits both best
  const box = size === "lg" ? "h-14 w-28 md:h-16 md:w-32" : "h-12 w-24";
  const tile = `relative ${box} shrink-0 overflow-hidden rounded-xl border border-border bg-white`;

  if (!src) {
    const initials = org
      .split(/[\s,]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("");
    return (
      <span aria-hidden="true" className={`${tile} flex items-center justify-center font-display text-xl text-neutral-800`}>
        {initials}
      </span>
    );
  }

  return (
    <span className={tile}>
      <Image src={src} alt="" fill sizes="128px" className="object-contain px-2.5 py-1.5" />
    </span>
  );
}
