import {
  Cpu,
  Disc3,
  Drone,
  Globe,
  GraduationCap,
  Languages,
  Palette,
  Rat,
  PaintbrushVertical,
  Sailboat,
  Swords,
  TreeDeciduous,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/data/cv";

// Name (from the data) → drawing (from Lucide). Record<IconName, ...> means TypeScript
// complains if a name in IconName has no drawing here.
const ICONS: Record<IconName, LucideIcon> = {
  drone: Drone,
  sailboat: Sailboat,
  palette: Palette,
  swords: Swords,
  brush: PaintbrushVertical,
  disc: Disc3,
  globe: Globe,
  languages: Languages,
  graduation: GraduationCap,
  trophy: Trophy,
  users: Users,
  cpu: Cpu,
  tree: TreeDeciduous,
  rat: Rat,
};

/** A line icon by name. Decorative: hidden from screen readers (the text next to it says it all). */
export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const Drawing = ICONS[name];
  return <Drawing aria-hidden="true" strokeWidth={1.6} className={className} />;
}
