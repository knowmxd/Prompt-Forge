import type { Snippet } from "./model.ts";

export const SEED_SNIPPETS: Snippet[] = [
  {
    id: "seed-medium-film",
    title: "35mm still",
    category: "medium",
    custom: false,
    body: "35mm film still, physical grain, slight halation",
  },
  {
    id: "seed-medium-gouache",
    title: "Gouache plate",
    category: "medium",
    custom: false,
    body: "gouache on toned paper, dry brush edges, pigment texture",
  },
  {
    id: "seed-optics-85",
    title: "85mm shallow",
    category: "optics",
    custom: false,
    body: "85mm spherical, f/2, shallow focus, gentle falloff",
  },
  {
    id: "seed-key-window",
    title: "North window",
    category: "key",
    custom: false,
    body: "large north window, soft directional key, 4:1 contrast",
    target: "aesthetic_dna.lighting_architecture.key_source.fixture_or_origin",
  },
  {
    id: "seed-accent-rim",
    title: "Fire rim",
    category: "accent",
    custom: false,
    body: "warm rim from a practical fire, cool shadow side",
  },
  {
    id: "seed-frame-worm",
    title: "Worm's-eye rake",
    category: "framing",
    custom: false,
    body: "Worm's-Eye Upward Rake, low axis, subject towering",
  },
  {
    id: "seed-wardrobe-travel",
    title: "Weathered layers",
    category: "wardrobe",
    custom: false,
    body: "weathered wool cloak over a linen shirt, scuffed boots, road dust",
    target: "subjects.{i}.wardrobe_architecture.layering_system.outerwear",
  },
  {
    id: "seed-exclude",
    title: "Anti-cliché pack",
    category: "exclusions",
    custom: false,
    body: "beauty lighting\ncentered hero smile\nplastic skin\nextra fingers\nwatermark",
  },
];
