// A small flag on a pole, waving. Pure CSS (no JavaScript):
// the flag is cut into thin vertical strips; each strip moves up and down a little later
// than the one before (animation-delay), and further from the pole it moves more (--amp).
// Together the strips look like a wave. Still for visitors who prefer reduced motion.

const W = 42; // flag size in px (3:2)
const H = 28;
const STRIPS = 21; // 42 / 21 = 2px each: whole pixels (no seams), thin enough for a smooth wave

export type Country = "cl" | "fr";

/** Chile: white over red, a blue square with a white star at the top left. */
function Chile() {
  // A 5-pointed star at (5, 5): points alternate between the outer and inner radius
  const star = Array.from({ length: 10 }, (_, k) => {
    const r = k % 2 === 0 ? 3 : 1.2;
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    return `${(5 + r * Math.cos(a)).toFixed(2)},${(5 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <>
      <rect width="30" height="10" fill="#ffffff" />
      <rect y="10" width="30" height="10" fill="#d52b1e" />
      <rect width="10" height="10" fill="#0039a6" />
      <polygon points={star} fill="#ffffff" />
    </>
  );
}

/** France: blue, white, red. */
function France() {
  return (
    <>
      <rect width="10" height="20" fill="#002654" />
      <rect x="10" width="10" height="20" fill="#ffffff" />
      <rect x="20" width="10" height="20" fill="#ce1126" />
    </>
  );
}

const DRAWINGS: Record<Country, () => React.JSX.Element> = { cl: Chile, fr: France };

export function WavingFlag({ country, label }: { country: Country; label: string }) {
  const Drawing = DRAWINGS[country];
  const strip = W / STRIPS;
  return (
    <span role="img" aria-label={label} title={label} className="inline-flex items-start">
      {/* the pole */}
      <span aria-hidden="true" className="h-11 w-[3px] shrink-0 rounded-full bg-muted/70" />
      <span aria-hidden="true" className="flex pt-0.5 drop-shadow-sm">
        {Array.from({ length: STRIPS }, (_, i) => {
          const style: React.CSSProperties & { "--amp": string } = {
            width: strip,
            height: H,
            animationDelay: `${-i * 0.08}s`, // negative = already running, each strip a bit ahead
            "--amp": `${0.3 + i * 0.15}px`, // near the pole it barely moves, the tip moves most
          };
          return (
            <span key={i} className="animate-flag-wave overflow-hidden motion-reduce:animate-none" style={style}>
              <svg width={W} height={H} viewBox="0 0 30 20" preserveAspectRatio="none" style={{ marginLeft: -i * strip }}>
                <Drawing />
              </svg>
            </span>
          );
        })}
      </span>
    </span>
  );
}
