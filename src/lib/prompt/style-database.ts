import { setAt, type PromptDoc } from "./model.ts";

export type StyleCategory = "all" | "street" | "graphic" | "painterly" | "illustration" | "photography";

export type StyleGuideItem = {
  id: string;
  name: string;
  subtitle: string;
  category: Exclude<StyleCategory, "all">;
  badge: string;
  image: string;
  notionUrl?: string;
  medium_format: string;
  imperfections: string;
  lighting_style?: string;
  shadow_depth?: string;
  dominant_palette: string[];
  tonal_behavior: string;
  anti_cliche_exclusions: string[];
  tags: string[];
};

export const STYLE_CATEGORIES: Array<{ id: StyleCategory; label: string }> = [
  { id: "all", label: "All Styles (10)" },
  { id: "street", label: "Street & Sketch (3)" },
  { id: "painterly", label: "Painterly & Oil (3)" },
  { id: "graphic", label: "Graphic & Editorial (2)" },
  { id: "illustration", label: "Retro & Pop (1)" },
  { id: "photography", label: "Night Photography (1)" },
];

export const STYLE_LIBRARY: StyleGuideItem[] = [
  {
    id: "st-street-icons",
    name: "Street Icons",
    subtitle: "Baggy Silhouettes · Cream Paper & Keyed Night",
    category: "street",
    badge: "STREET",
    image: "/styles/street-icons.png",
    notionUrl: "https://www.notion.so/417f1d7eb58081aa8da9f918166c85fb",
    medium_format:
      "editorial streetwear character illustration, crisp ink linework with paper and film grain, Japan-meets-hip-hop visual sensibility",
    imperfections:
      "subtle paper tooth, tactile film grain, hand-inked line weight variation, slight halation in keyed night highlights",
    lighting_style:
      "high-contrast keyed night or clean cream-paper editorial flat light with one crisp rim accent",
    shadow_depth: "deep graphic cel shadows anchored to oversized garments and accessories",
    dominant_palette: ["#1A1E1B", "#8C1D24", "#D8D2C2", "#4B7A5A", "#C49A45"],
    tonal_behavior:
      "muted earthy or nocturnal base balanced against one loud accessory or garment accent; rich blacks with warm paper midtones",
    anti_cliche_exclusions: [
      "glossy 3D render",
      "generic anime shading",
      "tight fitted clothing",
      "over-rendered plastic skin",
    ],
    tags: ["streetwear", "hip-hop", "japan", "baggy", "grain", "editorial", "character"],
  },
  {
    id: "st-cosmo-pop",
    name: "Cosmo Pop",
    subtitle: "Toyetic Retro-Sci-Fi · Cream Stage & Visor Helmets",
    category: "illustration",
    badge: "RETRO SCI-FI",
    image: "/styles/cosmo-pop.png",
    notionUrl: "https://www.notion.so/417f1d7eb58081f4a967d6b51fb535e5",
    medium_format:
      "toyetic retro-sci-fi character painting, soft painterly gouache-and-airbrush finish on a clean cream stage",
    imperfections:
      "soft painterly brush texture, gentle specular bloom on visor glass and bulbous brass/enamel gadgets",
    lighting_style: "bright clean studio bounce with soft translucent glow through tinted visors and fluid bulbs",
    shadow_depth: "soft warm-gray cast shadows with clean silhouette separation on cream backdrop",
    dominant_palette: ["#F2EFE9", "#28B86A", "#E680A8", "#2B2B30", "#C5B26B"],
    tonal_behavior:
      "clean cream stage (~60%) with glossy retro-plastic emerald, bubble-pink, and brass accents; friendly non-militaristic contrast",
    anti_cliche_exclusions: [
      "gritty cyberpunk",
      "grimdark war armor",
      "harsh neon clutter",
      "hyper-realistic pores",
    ],
    tags: ["retro", "sci-fi", "toyetic", "visor", "cream", "pop", "gadget"],
  },
  {
    id: "st-soft-melancholy",
    name: "Soft Melancholy",
    subtitle: "Naive Storybook Oil · Flat Pale Faces & Quiet Hush",
    category: "painterly",
    badge: "STORYBOOK",
    image: "/styles/soft-melancholy.png",
    notionUrl: "https://www.notion.so/417f1d7eb58081b89709de96845dbfd1",
    medium_format:
      "naive storybook oil and gouache painting on visible woven canvas, tactile impasto brushwork, quiet surreal poetic framing",
    imperfections:
      "visible canvas weave, dry-brush streaks, soft chalky edges, gentle muted pigment bleed",
    lighting_style: "overcast diffused coastal or interior hush, zero harsh speculars",
    shadow_depth: "soft desaturated slate and moss shadows with low-contrast atmospheric quiet",
    dominant_palette: ["#9FB3C8", "#4D5759", "#222426", "#D8CFC4", "#6E7F68"],
    tonal_behavior:
      "desaturated slate blues, sea-foam grays, and deep charcoal blacks with pale flat-lit skin tones and subtle moss greens",
    anti_cliche_exclusions: [
      "vibrant saturation",
      "crisp vector lines",
      "dramatic action lighting",
      "glossy digital polish",
    ],
    tags: ["storybook", "melancholy", "oil", "canvas", "quiet", "naive", "surreal"],
  },
  {
    id: "st-graphic-storyteller-v2",
    name: "Graphic Storyteller v2",
    subtitle: "Composition-First Notan · 60/30/10 Color & Hard Key",
    category: "graphic",
    badge: "COMPOSITION",
    image: "/styles/graphic-storyteller-v2.png",
    notionUrl: "https://www.notion.so/415f1d7eb580818c9d29c14d095c06b5",
    medium_format:
      "clean graphic illustration, bold confident ink line, flat cel shading built on strict 2-value notan and leading-line geometry",
    imperfections:
      "minimalist graphic restraint, detail clustered strictly at focal_1 while leaving 55% calm negative space",
    lighting_style: "single hard directional key light casting long graphic shadows away from the light source",
    shadow_depth: "crisp two-value notan separation reserving darkest blacks and brightest highlights for focal_1",
    dominant_palette: ["#1E2229", "#EAE4D7", "#D94B38", "#6C7A89", "#C2B59B"],
    tonal_behavior:
      "strict 60% calm field, 30% supporting neutral, <=10% saturated accent placed exclusively on the primary focal point",
    anti_cliche_exclusions: [
      "centered eye-level framing",
      "even flat lighting",
      "uniform detail everywhere",
      "competing color accents",
    ],
    tags: ["composition", "notan", "leading lines", "graphic", "cel", "restraint"],
  },
  {
    id: "st-graphic-storyteller",
    name: "Graphic Storyteller",
    subtitle: "Scale Play & Graphic Borders · Bold Editorial Modes",
    category: "graphic",
    badge: "EDITORIAL",
    image: "/styles/graphic-storyteller.png",
    notionUrl: "https://www.notion.so/40ff1d7eb5808163a461c6373b1b3e65",
    medium_format:
      "graphic character storytelling illustration, bold painted borders, diagonal stripe motifs, flat color fields with crisp ink line",
    imperfections:
      "editorial poster print texture, intentional scale-play distortion, subtle painted border framing",
    lighting_style: "single hard directional light creating crisp rim highlights and long cast shadows in minimal void",
    shadow_depth: "high-contrast graphic shadow shapes with clean silhouette readability",
    dominant_palette: ["#191A1F", "#F4EFE6", "#D9383A", "#3B6E8C", "#E0A83E"],
    tonal_behavior:
      "flat poster-grade color fields with punchy graphic contrast and expressive minimal storytelling",
    anti_cliche_exclusions: [
      "logos",
      "readable text",
      "3D render",
      "busy photorealistic clutter",
    ],
    tags: ["graphic", "poster", "editorial", "scale", "rim light", "storytelling"],
  },
  {
    id: "st-painterly-jrpg",
    name: "Painterly JRPG Adventurers",
    subtitle: "Tactics-Inspired Concept Art · Wind-Swept Cloth & Ink",
    category: "painterly",
    badge: "JRPG",
    image: "/styles/painterly-jrpg-adventurers.png",
    notionUrl: "https://www.notion.so/40ef1d7eb58081938a68cccc5cd735f9",
    medium_format:
      "painterly anime JRPG character concept art, soft cel shading, loose hatched brushstrokes, thin warm-brown lineart on plain white",
    imperfections:
      "visible loose painterly brushwork, warm sepia ink sketchiness, soft watercolor-like pigment edges",
    lighting_style: "clean studio concept-art key light with dark cel shadow blocks and sharp white rim highlights",
    shadow_depth: "structured cel shadow blocks grounded by a soft cast shadow beneath the boots",
    dominant_palette: ["#D9A45A", "#E9E7E4", "#5B74A6", "#6F7046", "#62D3D6"],
    tonal_behavior:
      "earthy ochre, olive, umber, and cream base (~80%) energized by one crisp teal or amber focal accent",
    anti_cliche_exclusions: [
      "background scenery",
      "text",
      "3D render",
      "glossy plastic shading",
    ],
    tags: ["jrpg", "tactics", "painterly", "adventurer", "concept art", "brushwork"],
  },
  {
    id: "st-false-color-night",
    name: "False-Color Night",
    subtitle: "Neon-Mapped Nocturnal Film · 75% Crushed Black",
    category: "photography",
    badge: "NIGHT FILM",
    image: "/styles/false-color-night.jpg",
    notionUrl: "https://www.notion.so/408f1d7eb58081cc9b66c11a63f70ab8",
    medium_format:
      "night street photograph, false-color neon-mapped film print, speckled cheap-print grain and posterized nocturnal tones",
    imperfections:
      "heavy speckled film grain, crushed blacks eating 75% of the frame, halation around street orbs, posterized false-color transitions",
    lighting_style:
      "lonely nocturnal street practicals — sodium yellow figure illumination against hot-pink puddles and cyan halos",
    shadow_depth: "deep crushed near-black shadows consuming ~75% of the frame; silhouettes without facial detail",
    dominant_palette: ["#14191D", "#D6AB13", "#C63574", "#2678BD", "#D42A16"],
    tonal_behavior:
      "crushed near-black void punctuated by false-color yellow figures, hot-pink practical reflections, and cold cobalt halos",
    anti_cliche_exclusions: [
      "daylight",
      "visible faces",
      "clean digital look",
      "text",
    ],
    tags: ["night", "false-color", "street", "grain", "silhouette", "neon", "lonely"],
  },
  {
    id: "st-haku",
    name: "Haku Style Study",
    subtitle: "Thick Brush Ink & Light Wash · Extreme Foreshortening",
    category: "street",
    badge: "INK WASH",
    image: "/styles/haku-style-study.jpg",
    notionUrl: "https://www.notion.so/408f1d7eb58081e78020dcf8403d5d1f",
    medium_format:
      "loose digital ink sketch, thick wobbly black brush outlines (never ruled), flat muted fills, light watercolor wash shading on cream paper",
    imperfections:
      "raw unruled brush-pen wobble, unfinished sketchbook edges, subtle cream paper grain, zero cross-hatching",
    lighting_style: "minimal single-pass watercolor wash shading on clean cream paper void",
    shadow_depth: "light translucent wash shadows without heavy rendering",
    dominant_palette: ["#F9F9F0", "#242A21", "#7AA6BB", "#747258", "#AD5B4B"],
    tonal_behavior:
      "dusty blue, olive, and tan muted fills on warm cream paper with one brick-red sneaker or prop accent",
    anti_cliche_exclusions: [
      "realistic anatomy",
      "detailed background",
      "glossy render",
      "hatching",
    ],
    tags: ["ink", "sketch", "foreshortening", "street", "watercolor", "brush", "cream"],
  },
  {
    id: "st-noi-nah",
    name: "noi nah Style Study",
    subtitle: "Soft Blended Oil · Toy-Like Plush Forms & No Outlines",
    category: "painterly",
    badge: "SOFT OIL",
    image: "/styles/noi-nah-style-study.jpg",
    notionUrl: "https://www.notion.so/408f1d7eb580811995dad3d57c00521a",
    medium_format:
      "soft blended oil painting on canvas, visible fine brushwork, plush and vinyl-toy rounded forms with zero outlines",
    imperfections:
      "velvety blended oil transitions, subtle fine-brush canvas texture, soft edge melting between forms",
    lighting_style: "soft diffuse studio light with gentle glossy highlights on dark eyes and smooth vinyl surfaces",
    shadow_depth: "creamy warm umber shadow transitions without hard edges",
    dominant_palette: ["#8D3918", "#7E4A31", "#E7C7B3", "#EBAC90", "#F0D018"],
    tonal_behavior:
      "warm browns and cream (~66%) anchored by one bright canary-yellow or powder-blue focal accent (<=25%)",
    anti_cliche_exclusions: [
      "outlines",
      "smiles",
      "busy backgrounds",
      "more than one bright color",
      "text",
      "signature",
    ],
    tags: ["oil", "plush", "toy", "no-outlines", "soft", "portrait", "quiet"],
  },
  {
    id: "st-gama",
    name: "GAMA Style Study",
    subtitle: "Chunky Street Sketch · Grayscale + 1 Red Spot Color",
    category: "street",
    badge: "MARKER",
    image: "/styles/gama-style-study.jpg",
    notionUrl: "https://www.notion.so/408f1d7eb58081d09b34fde8a0998df2",
    medium_format:
      "loose painterly digital sketch, visible marker and brush strokes, flat lasso-filled shapes on plain white void",
    imperfections:
      "rough unfinished brush edges, wobbly expressive contour lines, 2000s hip-hop sketchbook rawness",
    lighting_style: "flat graphic value blocking with minimal directional marker shading",
    shadow_depth: "simple flat cool-gray value blocks without soft gradients",
    dominant_palette: ["#6B6B70", "#D7262B", "#B9774C", "#ECECEF", "#222226"],
    tonal_behavior:
      "cool grayscale hoodie/denim foundation with warm skin tone and exactly one saturated red spot-color item (cap, hoodie, or shoes)",
    anti_cliche_exclusions: [
      "realistic anatomy",
      "full color",
      "detailed background",
      "text",
    ],
    tags: ["grayscale", "spot-color", "marker", "hip-hop", "chunky", "sketch"],
  },
];

export function filterStyleGuides(query: string, category: StyleCategory): StyleGuideItem[] {
  const q = query.trim().toLowerCase();
  return STYLE_LIBRARY.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q) ||
      item.medium_format.toLowerCase().includes(q) ||
      item.tonal_behavior.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function applyStyleGuide(
  doc: PromptDoc,
  style: StyleGuideItem,
  locked?: { palette?: boolean; optics?: boolean; lighting?: boolean; exclusions?: boolean },
): PromptDoc {
  let next = setAt(doc, "aesthetic_dna.medium_format", style.medium_format);
  if (!locked?.optics) {
    next = setAt(next, "aesthetic_dna.optics.physical_optical_imperfections", style.imperfections);
  }
  if (!locked?.palette) {
    next = setAt(next, "aesthetic_dna.color_science.dominant_palette", [...style.dominant_palette]);
    next = setAt(next, "aesthetic_dna.color_science.tonal_behavior", style.tonal_behavior);
  }

  if (!locked?.lighting && style.lighting_style) {
    next = setAt(next, "aesthetic_dna.lighting_architecture.lighting_style", style.lighting_style);
  }
  if (!locked?.lighting && style.shadow_depth) {
    next = setAt(next, "aesthetic_dna.lighting_architecture.fill_and_negative_space.shadow_depth", style.shadow_depth);
  }

  if (!locked?.exclusions) {
    const mergedExclusions = Array.from(
      new Set([...(doc.anti_cliche_exclusions ?? []), ...style.anti_cliche_exclusions]),
    );
    next = setAt(next, "anti_cliche_exclusions", mergedExclusions);
  }
  return next;
}

export function isStyleGuideApplied(doc: PromptDoc, style: StyleGuideItem): boolean {
  return doc.aesthetic_dna.medium_format === style.medium_format;
}
