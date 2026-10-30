import { setAt, type PromptDoc } from "./model.ts";
import { FIGURES, type Art } from "./figure.ts";

export type { Art } from "./figure.ts";
export type LookKind = "pose" | "angle" | "light" | "setting";

export type Look = {
  id: keyof typeof FIGURES;
  name: string;
  kind: LookKind;
  adult?: boolean;
  art: Art;
  posture?: string;
  principle?: string;
  axis?: string;
  style?: string;
  fixture?: string;
  lightAngle?: string;
  location?: string;
  atmosphere?: string;
  props?: string[];
};

type Draft = Omit<Look, "art">;

function pose(id: Draft["id"], name: string, posture: string, adult = false): Draft {
  return { id, name, kind: "pose", adult, posture };
}

const RAW: Draft[] = [
  pose("hip-cock", "Hip cock", "Weight on the left leg, right knee soft, one hand on the hip, shoulders dropped, chin level."),
  pose("pockets", "Hands in pockets", "Standing easy, both hands buried in pockets, weight even, shoulders relaxed."),
  pose("crossed", "Arms crossed", "Standing square, arms folded across the chest, weight even, chin level."),
  pose("stride", "Mid stride", "Walking toward the lens, one leg reaching, the other trailing, arms in an easy swing."),
  pose("crossed-sit", "Legs crossed", "Seated, one knee crossed over the other, one arm along the chair back, torso upright."),
  pose("stool", "Forward lean", "Seated on a stool, elbows on the knees, torso hinged forward, eyes up toward the lens."),
  pose("shoulder", "Over the shoulder", "Back mostly to the lens, head turned over one shoulder, arms relaxed at the sides."),
  pose("hair", "Hands in hair", "Both arms lifted, hands in the hair, elbows wide, weight on one hip."),
  pose("kneel", "Kneeling tall", "Upright on both knees, spine long, hands resting on the thighs."),
  pose("recline", "Side recline", "Lying on one side, head propped on a hand, the other arm along the body, legs softly bent."),
  pose("wall", "Wall lean", "One shoulder against a wall, ankles crossed, arms folded low."),
  pose("crouch", "One knee down", "A low crouch, one knee on the ground, the other foot planted, one forearm across the raised knee."),
  pose(
    "arched",
    "Arched stand",
    "Standing with the back deeply arched, hips pressed forward, both arms raised and hands behind the head, chest lifted.",
    true,
  ),
  pose(
    "open-seat",
    "Seated open",
    "Seated on the floor, knees fallen open, hands planted behind the hips, torso leaned back.",
    true,
  ),
  pose("all-fours", "All fours", "On hands and knees, spine long with a slight dip, head turned toward the lens.", true),
  pose("lying-back", "Lying back", "Lying on the back, knees bent and apart, one arm resting above the head.", true),
  pose("folded", "Folded forward", "Standing, folded forward at the hips, back flat, hands resting on the thighs.", true),
  pose("knee-up", "Knee raised", "Reclined on one elbow, the far knee raised, the near leg extended.", true),
  pose("kneel-arch", "Kneeling arch", "Upright on both knees, back arched, hips forward, hands resting on the thighs.", true),
  pose("leg-up", "Leg up", "Standing on one leg, the other knee lifted and turned out, held at the thigh.", true),
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
    axis: "camera behind the subject, eye level, face hidden",
  },
  {
    id: "window-light",
    name: "Window light",
    kind: "light",
    style: "soft directional window light",
    fixture: "large window, camera-left",
    lightAngle: "slightly above eye line, slow falloff, open shadows",
  },
  {
    id: "hard-side",
    name: "Hard side",
    kind: "light",
    style: "hard side light, deep shadow on the off side",
    fixture: "small bare source, camera-left",
    lightAngle: "level with the face, fast falloff, little fill",
  },
  {
    id: "rim",
    name: "Rim light",
    kind: "light",
    style: "edge-lit, subject mostly in shadow",
    fixture: "kicker from behind, camera-right",
    lightAngle: "behind the subject, just out of frame, thin bright rim",
  },
  {
    id: "overhead",
    name: "Soft overhead",
    kind: "light",
    style: "large soft overhead, short shadows under the brow and chin",
    fixture: "overhead soft source",
    lightAngle: "straight down, slightly in front, gentle wrap",
  },
  {
    id: "golden",
    name: "Golden hour",
    kind: "light",
    style: "low warm sun, long shadows",
    fixture: "sun near the horizon, camera-left",
    lightAngle: "low, skimming, warm key with a cool open shadow",
  },
  {
    id: "low-key",
    name: "Low key",
    kind: "light",
    style: "low key, one small pool of light, the rest falls off to black",
    fixture: "single practical, close",
    lightAngle: "just above the face, tight falloff, no fill",
  },
  {
    id: "studio",
    name: "Seamless studio",
    kind: "setting",
    location: "seamless paper studio, warm gray cyclorama",
    atmosphere: "clear air, no weather",
    props: [],
  },
  {
    id: "sidewalk",
    name: "City sidewalk",
    kind: "setting",
    location: "city sidewalk between mid-rise buildings",
    atmosphere: "clear, late daylight",
    props: ["concrete pavement", "building fronts"],
  },
  {
    id: "window-room",
    name: "Window room",
    kind: "setting",
    location: "plain interior, one tall window",
    atmosphere: "clear indoor air, daylight from the window",
    props: ["bare floor", "tall window"],
  },
  {
    id: "warehouse",
    name: "Warehouse",
    kind: "setting",
    location: "empty warehouse, high ceiling, concrete floor",
    atmosphere: "slight haze, cool daylight from high openings",
    props: ["concrete floor", "distant columns"],
  },
  {
    id: "field",
    name: "Open field",
    kind: "setting",
    location: "open field, horizon low, no buildings",
    atmosphere: "clear, a little wind",
    props: ["tall grass"],
  },
  {
    id: "night-street",
    name: "Night street",
    kind: "setting",
    location: "city street at night",
    atmosphere: "clear night, damp air",
    props: ["wet pavement", "distant streetlights"],
  },
];

export const LOOKS: Look[] = RAW.map((look) => ({ ...look, art: FIGURES[look.id] }));

export const LOOK_FILTERS = [
  { id: "pose", label: "Poses" },
  { id: "angle", label: "Angles" },
  { id: "light", label: "Light" },
  { id: "setting", label: "Setting" },
  { id: "adult", label: "Adult" },
] as const;

export type LookFilter = (typeof LOOK_FILTERS)[number]["id"];

export function looksFor(filter: LookFilter): Look[] {
  if (filter === "adult") return LOOKS.filter((look) => look.adult);
  if (filter === "pose") return LOOKS.filter((look) => look.kind === "pose" && !look.adult);
  return LOOKS.filter((look) => look.kind === filter);
}

export function applyLook(doc: PromptDoc, look: Look, subjectIndex: number): PromptDoc {
  if (look.kind === "pose") {
    return setAt(doc, `subjects.${subjectIndex}.kinetic_posture`, look.posture ?? "");
  }
  if (look.kind === "angle") {
    const next = setAt(doc, "scene_composition.framing_doctrine.named_principle", look.principle ?? "");
    return setAt(next, "scene_composition.framing_doctrine.camera_elevation_and_axis", look.axis ?? "");
  }
  if (look.kind === "light") {
    let next = setAt(doc, "aesthetic_dna.lighting_architecture.lighting_style", look.style ?? "");
    next = setAt(next, "aesthetic_dna.lighting_architecture.key_source.fixture_or_origin", look.fixture ?? "");
    return setAt(next, "aesthetic_dna.lighting_architecture.key_source.angle_and_elevation", look.lightAngle ?? "");
  }
  let next = setAt(doc, "scene_composition.environmental_staging.location_context", look.location ?? "");
  next = setAt(next, "scene_composition.environmental_staging.atmosphere_and_air_density", look.atmosphere ?? "");
  return setAt(next, "scene_composition.environmental_staging.grounded_props", look.props ?? []);
}

export function lookIsApplied(doc: PromptDoc, look: Look, subjectIndex: number): boolean {
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
      doc.aesthetic_dna.lighting_architecture.key_source.fixture_or_origin === look.fixture
    );
  }
  return doc.scene_composition.environmental_staging.location_context === look.location;
}
