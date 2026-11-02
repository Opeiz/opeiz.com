import {
  Cpu,
  Drone,
  Globe,
  GraduationCap,
  Languages,
  Palette,
  Sailboat,
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
  globe: Globe,
  languages: Languages,
  graduation: GraduationCap,
  trophy: Trophy,
  users: Users,
  cpu: Cpu,
};

/** A line icon by name. Decorative: hidden from screen readers (the text next to it says it all). */
export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const Drawing = ICONS[name];
  return <Drawing aria-hidden="true" strokeWidth={1.6} className={className} />;
}
