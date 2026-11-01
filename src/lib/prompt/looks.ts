import { setAt, type PromptDoc } from "./model.ts";
import { FIGURES, type Art } from "./figure.ts";
import { POSE_LIBRARY, type PoseItem } from "./pose-database.ts";
import { CAMERA_LIBRARY, type CameraItem } from "./camera-database.ts";
import { LIGHTING_LIBRARY, type LightingItem } from "./lighting-database.ts";
import {
  WARDROBE_OUTFITS,
  WARDROBE_OUTFITS_BY_ID,
  applyWardrobeOutfit,
  isWardrobeOutfitApplied,
  type WardrobeOutfit,
} from "./wardrobe-database.ts";

export type { Art } from "./figure.ts";
export type LookKind = "pose" | "angle" | "light" | "setting" | "wardrobe";

export type Look = {
  id: string;
  name: string;
  subtitle?: string;
  kind: LookKind;
  category?: string;
  stance?: string;
  badge?: string;
  adult?: boolean;
  art?: Art;
  image?: string;
  posture?: string;
  principle?: string;
  axis?: string;
  lens?: string;
  dof?: string;
  style?: string;
  fixture?: string;
  lightAngle?: string;
  shadow?: string;
  practical?: string;
  outfitId?: string;
  location?: string;
  atmosphere?: string;
  props?: string[];
  tags?: string[];
};

type Draft = Omit<Look, "art">;

function pose(
  id: string,
  name: string,
  posture: string,
  adult = false,
  image?: string,
  props?: string[],
  category = "modeling",
  stance = "standing",
): Draft {
  return { id, name, kind: "pose", adult, posture, image, props, category, stance };
}

const RAW_LEGACY: Draft[] = [
  pose("hip-cock", "Hip cock", "Weight on the left leg, right knee soft, one hand on the hip, shoulders dropped, chin level.", false, "/poses/pose_anime_p001.jpg", undefined, "modeling", "standing"),
  pose("pockets", "Hands in pockets", "Standing easy, both hands buried in pockets, weight even, shoulders relaxed.", false, "/poses/pose_model_05.jpg", undefined, "modeling", "standing"),
  pose("crossed", "Arms crossed", "Standing square, arms folded across the chest, weight even, chin level.", false, "/poses/pose_model_08.jpg", undefined, "modeling", "standing"),
  pose("stride", "Mid stride", "Walking toward the lens, one leg reaching, the other trailing, arms in an easy swing.", false, "/poses/pose_model_09.jpg", undefined, "modeling", "dynamic"),
  pose("crossed-sit", "Legs crossed", "Seated, one knee crossed over the other, one arm along the chair back, torso upright.", false, "/poses/pose_3d_03.jpg", ["white posing cube"], "sitting", "sitting"),
  pose("stool", "Forward lean", "Seated on a stool, elbows on the knees, torso hinged forward, eyes up toward the lens.", false, "/poses/pose_3d_05.jpg", ["studio stool"], "sitting", "sitting"),
  pose("shoulder", "Over the shoulder", "Back mostly to the lens, head turned over one shoulder, arms relaxed at the sides.", false, "/poses/pose_model_07.jpg", undefined, "modeling", "standing"),
  pose("hair", "Hands in hair", "Both arms lifted, hands in the hair, elbows wide, weight on one hip.", false, "/poses/pose_model_02.jpg", undefined, "modeling", "standing"),
  pose("kneel", "Kneeling tall", "Upright on both knees, spine long, hands resting on the thighs.", false, "/poses/pose_knight_03.jpg", undefined, "sitting", "kneeling"),
  pose("recline", "Side recline", "Lying on one side, head propped on a hand, the other arm along the body, legs softly bent.", false, "/poses/pose_3d_09.jpg", undefined, "reclining", "reclining"),
  pose("wall", "Wall lean", "One shoulder against a wall, ankles crossed, arms folded low.", false, "/poses/pose_model_05.jpg", undefined, "casual", "standing"),
  pose("crouch", "One knee down", "A low crouch, one knee on the ground, the other foot planted, one forearm across the raised knee.", false, "/poses/pose_action_02.jpg", undefined, "action", "crouching"),
  pose(
    "arched",
    "Arched stand",
    "Standing with the back deeply arched, hips pressed forward, both arms raised and hands behind the head, chest lifted.",
    true,
    "/poses/pose_3d_02.jpg",
    undefined,
    "modeling",
    "standing",
  ),
  pose(
    "open-seat",
    "Seated open",
    "Seated on the floor, knees fallen open, hands planted behind the hips, torso leaned back.",
    true,
    "/poses/pose_3d_09.jpg",
    undefined,
    "sitting",
    "sitting",
  ),
  pose("all-fours", "All fours", "On hands and knees, spine long with a slight dip, head turned toward the lens.", true, "/poses/pose_3d_04.jpg", undefined, "reclining", "kneeling"),
  pose("lying-back", "Lying back", "Lying on the back, knees bent and apart, one arm resting above the head.", true, "/poses/pose_3d_07.jpg", undefined, "reclining", "reclining"),
  pose("folded", "Folded forward", "Standing, folded forward at the hips, back flat, hands resting on the thighs.", true, "/poses/pose_3d_01.jpg", ["tall posing block"], "sitting", "standing"),
  pose("knee-up", "Knee raised", "Reclined on one elbow, the far knee raised, the near leg extended.", true, "/poses/pose_3d_09.jpg", undefined, "reclining", "reclining"),
  pose("kneel-arch", "Kneeling arch", "Upright on both knees, back arched, hips forward, hands resting on the thighs.", true, "/poses/pose_3d_04.jpg", undefined, "reclining", "kneeling"),
  pose("leg-up", "Leg up", "Standing on one leg, the other knee lifted and turned out, held at the thigh.", true, "/poses/pose_action_01.jpg", undefined, "action", "dynamic"),
];

// Convert POSE_LIBRARY into Look items
const POSE_DATABASE_LOOKS: Draft[] = POSE_LIBRARY.map((item: PoseItem) => ({
  id: item.id,
  name: item.name,
  subtitle: item.subtitle,
  kind: "pose",
  category: item.category,
  stance: item.stance,
  adult: item.adult,
  image: item.image,
  posture: item.posture,
  props: item.props,
  tags: item.tags,
}));

// Convert CAMERA_LIBRARY into Look items
const CAMERA_DATABASE_LOOKS: Draft[] = CAMERA_LIBRARY.map((item: CameraItem) => ({
  id: item.id,
  name: item.name,
  subtitle: item.subtitle,
  kind: "angle",
  category: item.category,
  badge: item.badge,
  image: item.image,
  principle: item.principle,
  axis: item.axis,
  lens: item.lens,
  dof: item.dof,
  tags: item.tags,
}));

const NON_POSE_LOOKS: Draft[] = [
  {
    id: "eye-level",
    name: "Eye level",
    kind: "angle",
    principle: "Square eye-level portrait",
    axis: "eye level, centered, camera square to the subject",
  },
  {
    id: "low-angle",
    name: "Low angle",
    kind: "angle",
    principle: "Worm's-eye upward rake",
    axis: "camera near the floor, tilted up, subject looming",
  },
  {
    id: "high-angle",
    name: "High angle",
    kind: "angle",
    principle: "High-angle downward look",
    axis: "camera above eye line, tilted down, subject smaller in the frame",
  },
  {
    id: "three-quarter",
    name: "Three-quarter",
    kind: "angle",
    principle: "Three-quarter turn",
    axis: "camera 45° off axis, eye level, subject turned toward lens",
  },
  {
    id: "profile",
    name: "Profile",
    kind: "angle",
    principle: "Clean profile",
    axis: "camera at 90°, eye level, subject facing frame-left",
  },
  {
    id: "behind",
    name: "From behind",
    kind: "angle",
    principle: "Over-the-back view",
    axis: "camera directly behind the subject, back to lens",
  },
  {
    id: "warehouse",
    name: "Warehouse",
    kind: "setting",
    location: "empty industrial warehouse with tall concrete ceilings",
    atmosphere: "slight atmospheric haze, cool daylight through dirty skylights",
    props: ["polished concrete floor", "distant steel beams"],
  },
  {
    id: "field",
    name: "Open field",
    kind: "setting",
    location: "windswept open grass field stretching to low horizon",
    atmosphere: "clear golden hour air, gentle breeze rustling vegetation",
    props: ["tall wild grasses", "distant rolling hills"],
  },
  {
    id: "night-street",
    name: "Rainy street",
    kind: "setting",
    location: "urban city street at night immediately after rain",
    atmosphere: "damp air, reflections shimmering in puddles",
    props: ["wet asphalt", "glowing street lamps", "steaming manhole"],
  },
];

const WARDROBE_DATABASE_LOOKS: Draft[] = WARDROBE_OUTFITS.map((outfit) => ({
  id: outfit.id,
  name: outfit.name,
  subtitle: `${outfit.item_ids.length} pieces · ${outfit.style_tags.slice(0, 2).map((t) => `#${t.replace(/_/g, " ")}`).join(" ")}`,
  kind: "wardrobe" as const,
  category: "wardrobe",
  badge: "OUTFIT",
  image: outfit.image,
  tags: outfit.style_tags,
  outfitId: outfit.id,
}));

const LIGHTING_DATABASE_LOOKS: Draft[] = LIGHTING_LIBRARY.map((item) => ({
  id: item.id,
  name: item.name,
  subtitle: item.subtitle,
  kind: "light" as const,
  category: item.category,
  badge: item.badge,
  image: item.image,
  style: item.style,
  fixture: item.fixture,
  lightAngle: item.angle,
  shadow: item.shadow,
  practical: item.practical,
  tags: item.tags,
}));

// Merge avoiding duplicates by ID
const seenIds = new Set<string>();
const ALL_DRAFTS: Draft[] = [];
for (const draft of [
  ...WARDROBE_DATABASE_LOOKS,
  ...LIGHTING_DATABASE_LOOKS,
  ...CAMERA_DATABASE_LOOKS,
  ...RAW_LEGACY,
  ...POSE_DATABASE_LOOKS,
  ...NON_POSE_LOOKS,
]) {
  if (!seenIds.has(draft.id)) {
    seenIds.add(draft.id);
    ALL_DRAFTS.push(draft);
  }
}

export const LOOKS: Look[] = ALL_DRAFTS.map((look) => ({
  ...look,
  art: (FIGURES as Record<string, Art>)[look.id] ?? {
    head: [60, 40, 10],
    limbs: [],
  },
}));

export const LOOK_FILTERS = [
  { id: "all", label: "All" },
  { id: "wardrobe", label: "Wardrobe" },
  { id: "angle", label: "Camera & Angles" },
  { id: "knights", label: "Knights" },
  { id: "modeling", label: "Photoshoot" },
  { id: "paintings", label: "Fine Art" },
  { id: "cinematic", label: "Cinematic" },
  { id: "couples", label: "Couples & Duos" },
  { id: "action", label: "Action" },
  { id: "fantasy", label: "Fantasy" },
  { id: "sitting", label: "Sitting" },
  { id: "reclining", label: "Floor" },
  { id: "casual", label: "Casual" },
  { id: "pose", label: "All Poses" },
  { id: "light", label: "Light" },
  { id: "setting", label: "Setting" },
  { id: "adult", label: "Adult" },
] as const;

export type LookFilter = (typeof LOOK_FILTERS)[number]["id"];

export function looksFor(filter: LookFilter | string): Look[] {
  if (filter === "adult") return LOOKS.filter((look) => look.adult);
  if (filter === "pose") return LOOKS.filter((look) => look.kind === "pose" && !look.adult);
  if (filter === "knights") return LOOKS.filter((look) => look.category === "knights");
  if (filter === "modeling") return LOOKS.filter((look) => look.category === "modeling" && !look.adult);
  if (filter === "paintings") return LOOKS.filter((look) => look.category === "paintings");
  if (filter === "cinematic") return LOOKS.filter((look) => look.category === "cinematic");
  if (filter === "couples") return LOOKS.filter((look) => look.category === "couples");
  if (filter === "action") return LOOKS.filter((look) => look.category === "action");
  if (filter === "fantasy") return LOOKS.filter((look) => look.category === "fantasy");
  if (filter === "sitting") return LOOKS.filter((look) => look.category === "sitting" && !look.adult);
  if (filter === "reclining") return LOOKS.filter((look) => look.category === "reclining" && !look.adult);
  if (filter === "casual") return LOOKS.filter((look) => look.category === "casual");
  if (filter === "wardrobe") return LOOKS.filter((look) => look.kind === "wardrobe");
  if (filter === "light") return LOOKS.filter((look) => look.kind === "light");
  if (filter === "angle") return LOOKS.filter((look) => look.kind === "angle");
  if (filter === "all") return LOOKS.filter((look) => !look.adult);
  return LOOKS.filter((look) => look.kind === filter || look.category === filter);
}

export function customOutfitToLook(outfit: WardrobeOutfit): Look {
  return {
    id: outfit.id,
    name: outfit.name,
    subtitle: `${outfit.item_ids?.length ? `${outfit.item_ids.length} pieces` : "custom outfit"} · ${outfit.style_tags.slice(0, 2).map((t: string) => `#${t.replace(/_/g, " ")}`).join(" ")}`,
    kind: "wardrobe" as const,
    category: "wardrobe",
    badge: "CUSTOM",
    image: outfit.image,
    tags: outfit.style_tags,
    outfitId: outfit.id,
    customOutfit: outfit,
    art: { head: [60, 40, 10], limbs: [] },
  } as Look & { customOutfit: WardrobeOutfit };
}

export function applyLook(doc: PromptDoc, look: Look, subjectIndex: number): PromptDoc {
  if (look.kind === "wardrobe" && look.outfitId) {
    const outfit =
      WARDROBE_OUTFITS_BY_ID.get(look.outfitId) ||
      (look as Look & { customOutfit?: WardrobeOutfit }).customOutfit;
    if (outfit) {
      return applyWardrobeOutfit(doc, outfit, subjectIndex);
    }
  }
  if (look.kind === "pose") {
    let next = setAt(doc, `subjects.${subjectIndex}.kinetic_posture`, look.posture ?? "");
    // Optional context-aware props suggestion
    if (look.props && look.props.length > 0) {
      const currentProps = doc.scene_composition.environmental_staging.grounded_props ?? [];
      const merged = Array.from(new Set([...currentProps, ...look.props]));
      next = setAt(next, "scene_composition.environmental_staging.grounded_props", merged);
    }
    return next;
  }
  if (look.kind === "angle") {
    let next = setAt(doc, "scene_composition.framing_doctrine.named_principle", look.principle ?? "");
    next = setAt(next, "scene_composition.framing_doctrine.camera_elevation_and_axis", look.axis ?? "");
    if (look.lens) {
      next = setAt(next, "aesthetic_dna.optics.lens_type_and_focal_length", look.lens);
    }
    if (look.dof) {
      next = setAt(next, "aesthetic_dna.optics.aperture_and_dof", look.dof);
    }
    return next;
  }
  if (look.kind === "light") {
    let next = setAt(doc, "aesthetic_dna.lighting_architecture.lighting_style", look.style ?? "");
    if (look.fixture) {
      next = setAt(next, "aesthetic_dna.lighting_architecture.key_source.fixture_or_origin", look.fixture);
    }
    if (look.lightAngle) {
      next = setAt(next, "aesthetic_dna.lighting_architecture.key_source.angle_and_elevation", look.lightAngle);
    }
    if (look.shadow) {
      next = setAt(next, "aesthetic_dna.lighting_architecture.fill_and_negative_space.shadow_depth", look.shadow);
    }
    if (look.practical) {
      next = setAt(next, "aesthetic_dna.lighting_architecture.accent_and_practicals.practical_sources", look.practical);
    }
    return next;
  }
  let next = setAt(doc, "scene_composition.environmental_staging.location_context", look.location ?? "");
  next = setAt(next, "scene_composition.environmental_staging.atmosphere_and_air_density", look.atmosphere ?? "");
  return setAt(next, "scene_composition.environmental_staging.grounded_props", look.props ?? []);
}

export function lookIsApplied(doc: PromptDoc, look: Look, subjectIndex: number): boolean {
  if (look.kind === "wardrobe" && look.outfitId) {
    const outfit =
      WARDROBE_OUTFITS_BY_ID.get(look.outfitId) ||
      (look as Look & { customOutfit?: WardrobeOutfit }).customOutfit;
    if (outfit) {
      return isWardrobeOutfitApplied(doc, outfit, subjectIndex);
    }
  }
  if (look.kind === "pose") return doc.subjects[subjectIndex]?.kinetic_posture === look.posture;
  if (look.kind === "angle") {
    return (
      doc.scene_composition.framing_doctrine.named_principle === look.principle &&
      doc.scene_composition.framing_doctrine.camera_elevation_and_axis === look.axis
    );
  }
  if (look.kind === "light") {
    return (
      doc.aesthetic_dna.lighting_architecture.lighting_style === look.style &&
      (!look.fixture || doc.aesthetic_dna.lighting_architecture.key_source.fixture_or_origin === look.fixture)
    );
  }
  return doc.scene_composition.environmental_staging.location_context === look.location;
}
