// The 4 tokens: 4 versions of me. Each has 4 side images (the "sprite" trick).
//
// To use real art: put 4 images per token in public/tokens/<id>/
// (512×512, transparent PNG or WebP, same lighting and same center point),
// then change the file extension in `sprites()` below (e.g. ".svg" → ".webp").

export type Side = "front" | "right" | "back" | "left";

/** Order matters: turning +90° goes to the next side in this list. */
export const SIDES: Side[] = ["front", "right", "back", "left"];

export type Token = {
  id: string;
  name: string; // "The Pilot"
  short: string; // "Pilot", for small buttons
  tagline: string;
  accent: string; // color the whole board takes when this token is chosen
  sprites: Record<Side, string>; // Record<Side, string> = { front: string, right: string, ... }
};

/** Builds the 4 image paths of a token: /tokens/pilot/front.svg, ... */
function sprites(id: string, ext = ".svg"): Record<Side, string> {
  return {
    front: `/tokens/${id}/front${ext}`,
    right: `/tokens/${id}/right${ext}`,
    back: `/tokens/${id}/back${ext}`,
    left: `/tokens/${id}/left${ext}`,
  };
}

export const tokens: Token[] = [
  {
    id: "engineer",
    name: "The Engineer",
    short: "Engineer",
    tagline: "C++, robots and clean architecture.",
    accent: "#6366f1",
    sprites: sprites("engineer"),
  },
  {
    id: "pilot",
    name: "The Pilot",
    short: "Pilot",
    tagline: "Builds drones, then races them.",
    accent: "#0ea5e9",
    sprites: sprites("pilot"),
  },
  {
    id: "skipper",
    name: "The Skipper",
    short: "Skipper",
    tagline: "Reads the wind, plans the route, leads the crew.",
    accent: "#10b981",
    sprites: sprites("skipper"),
  },
  {
    id: "designer",
    name: "The Designer",
    short: "Designer",
    tagline: "Turns ideas into visuals.",
    accent: "#f43f5e",
    sprites: sprites("designer"),
  },
];
