export const SECTION_KEYS = [
  "subject",
  "appearance",
  "clothing",
  "pose",
  "background",
  "foreground",
  "style",
  "lighting",
  "camera",
  "extra",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export type PromptFields = Record<SectionKey, string>;

export function emptyFields(): PromptFields {
  return {
    subject: "",
    appearance: "",
    clothing: "",
    pose: "",
    background: "",
    foreground: "",
    style: "",
    lighting: "",
    camera: "",
    extra: "",
  };
}

export function filledKeys(fields: PromptFields): SectionKey[] {
  return SECTION_KEYS.filter((key) => fields[key].trim().length > 0);
}

export function coerceFields(value: unknown): PromptFields {
  const fields = emptyFields();
  if (!value || typeof value !== "object") return fields;
  const record = value as Record<string, unknown>;
  for (const key of SECTION_KEYS) {
    const item = record[key];
    if (typeof item === "string") fields[key] = item;
  }
  return fields;
}

export type Subject = {
  subject_id: string;
  casting_and_physique: {
    demographics_and_features: string;
    skin_and_surface_microdetails: string;
    hair_and_grooming: string;
  };
  kinetic_posture: string;
  wardrobe_architecture: {
    layering_system: { base_layer: string; mid_layer: string; outerwear: string };
    textiles_and_weight: string;
    hardware_and_details: string;
    wear_and_patina: string;
    accessories: string[];
    footwear: string;
  };
  environmental_interaction: string;
};

export type PromptDoc = {
  aesthetic_dna: {
    medium_format: string;
    optics: {
      lens_type_and_focal_length: string;
      aperture_and_dof: string;
      physical_optical_imperfections: string;
    };
    lighting_architecture: {
      lighting_style: string;
      key_source: {
        fixture_or_origin: string;
        angle_and_elevation: string;
        falloff_and_contrast_ratio: string;
      };
      fill_and_negative_space: {
        fill_mechanism: string;
        shadow_depth: string;
      };
      accent_and_practicals: {
        rim_or_kicker: string;
        practical_sources: string;
        color_temperature_balance: string;
      };
    };
    color_science: {
      dominant_palette: string[];
      tonal_behavior: string;
    };
  };
  scene_composition: {
    framing_doctrine: {
      named_principle: string;
      camera_elevation_and_axis: string;
      spatial_planes: {
        foreground_obstruction: string;
        midground_interaction: string;
        background_depth: string;
      };
    };
    environmental_staging: {
      location_context: string;
      atmosphere_and_air_density: string;
      grounded_props: string[];
    };
  };
  subjects: Subject[];
  creative_thesis: {
    narrative_subtext: string;
    focal_contradiction: string;
  };
  anti_cliche_exclusions: string[];
};

export const CLUSTER_IDS = [
  "medium",
  "optics",
  "key",
  "fill",
  "accent",
  "color",
  "framing",
  "planes",
  "environment",
  "casting",
  "posture",
  "wardrobe",
  "interaction",
  "thesis",
  "exclusions",
] as const;

export type ClusterId = (typeof CLUSTER_IDS)[number];

export type FieldKind = "text" | "list" | "palette";

export type FieldDef = {
  path: string;
  label: string;
  hint: string;
  kind: FieldKind;
  rows: number;
};

export type Cluster = {
  id: ClusterId;
  group: "Aesthetic DNA" | "Scene" | "Subject" | "Thesis";
  label: string;
  fields: FieldDef[];
};

const text = (path: string, label: string, hint: string, rows = 2): FieldDef => ({
  path,
  label,
  hint,
  kind: "text",
  rows,
});

export const CLUSTERS: Cluster[] = [
  {
    id: "medium",
    group: "Aesthetic DNA",
    label: "Medium",
    fields: [
      text(
        "aesthetic_dna.medium_format",
        "Medium format",
        "35mm film, woodblock, screenprint, gouache",
        2,
      ),
    ],
  },
  {
    id: "optics",
    group: "Aesthetic DNA",
    label: "Optics",
    fields: [
      text("aesthetic_dna.optics.lens_type_and_focal_length", "Lens & focal length", "50mm spherical, 85mm"),
      text("aesthetic_dna.optics.aperture_and_dof", "Aperture & depth of field", "f/2, shallow focus"),
      text(
        "aesthetic_dna.optics.physical_optical_imperfections",
        "Optical imperfections",
        "grain, halation, ink bleed, paper texture",
      ),
    ],
  },
  {
    id: "key",
    group: "Aesthetic DNA",
    label: "Key light",
    fields: [
      text("aesthetic_dna.lighting_architecture.lighting_style", "Lighting style", "overall contrast scheme"),
      text(
        "aesthetic_dna.lighting_architecture.key_source.fixture_or_origin",
        "Fixture or origin",
        "window, sun, bare bulb",
      ),
      text(
        "aesthetic_dna.lighting_architecture.key_source.angle_and_elevation",
        "Angle & elevation",
        "45° camera-left, high",
      ),
      text(
        "aesthetic_dna.lighting_architecture.key_source.falloff_and_contrast_ratio",
        "Falloff & contrast",
        "fast falloff, 8:1",
      ),
    ],
  },
  {
    id: "fill",
    group: "Aesthetic DNA",
    label: "Fill & shadow",
    fields: [
      text(
        "aesthetic_dna.lighting_architecture.fill_and_negative_space.fill_mechanism",
        "Fill mechanism",
        "bounce, negative fill, none",
      ),
      text(
        "aesthetic_dna.lighting_architecture.fill_and_negative_space.shadow_depth",
        "Shadow depth",
        "crushed, open, inked",
      ),
    ],
  },
  {
    id: "accent",
    group: "Aesthetic DNA",
    label: "Accents",
    fields: [
      text(
        "aesthetic_dna.lighting_architecture.accent_and_practicals.rim_or_kicker",
        "Rim or kicker",
        "edge light from behind",
      ),
      text(
        "aesthetic_dna.lighting_architecture.accent_and_practicals.practical_sources",
        "Practical sources",
        "candles, neon, fire",
      ),
      text(
        "aesthetic_dna.lighting_architecture.accent_and_practicals.color_temperature_balance",
        "Color temperature",
        "warm key, cool fill",
      ),
    ],
  },
  {
    id: "color",
    group: "Aesthetic DNA",
    label: "Color",
    fields: [
      {
        path: "aesthetic_dna.color_science.dominant_palette",
        label: "Dominant palette",
        hint: "#hex swatches",
        kind: "palette",
        rows: 2,
      },
      text(
        "aesthetic_dna.color_science.tonal_behavior",
        "Tonal behavior",
        "hue distribution, saturation, paper or print tint",
        3,
      ),
    ],
  },
  {
    id: "framing",
    group: "Scene",
    label: "Framing",
    fields: [
      text(
        "scene_composition.framing_doctrine.named_principle",
        "Named principle",
        "Worm's-Eye Upward Rake",
      ),
      text(
        "scene_composition.framing_doctrine.camera_elevation_and_axis",
        "Elevation & axis",
        "low, tilted up, centered",
      ),
    ],
  },
  {
    id: "planes",
    group: "Scene",
    label: "Planes",
    fields: [
      text(
        "scene_composition.framing_doctrine.spatial_planes.foreground_obstruction",
        "Foreground obstruction",
        "what cuts the frame",
      ),
      text(
        "scene_composition.framing_doctrine.spatial_planes.midground_interaction",
        "Midground interaction",
        "where the action sits",
      ),
      text(
        "scene_composition.framing_doctrine.spatial_planes.background_depth",
        "Background depth",
        "how far the scene recedes",
      ),
    ],
  },
  {
    id: "environment",
    group: "Scene",
    label: "Environment",
    fields: [
      text("scene_composition.environmental_staging.location_context", "Location", "where this is", 2),
      text(
        "scene_composition.environmental_staging.atmosphere_and_air_density",
        "Atmosphere",
        "haze, rain, smoke, clear",
      ),
      {
        path: "scene_composition.environmental_staging.grounded_props",
        label: "Grounded props",
        hint: "One prop per line",
        kind: "list",
        rows: 3,
      },
    ],
  },
  {
    id: "casting",
    group: "Subject",
    label: "Casting",
    fields: [
      text("subjects.{i}.subject_id", "Subject id", "short name for this figure"),
      text(
        "subjects.{i}.casting_and_physique.demographics_and_features",
        "Demographics & features",
        "age, face, eyes, build",
        3,
      ),
      text(
        "subjects.{i}.casting_and_physique.skin_and_surface_microdetails",
        "Skin & surface",
        "pores, scars, freckles, texture",
      ),
      text("subjects.{i}.casting_and_physique.hair_and_grooming", "Hair & grooming", "cut, color, finish"),
    ],
  },
  {
    id: "posture",
    group: "Subject",
    label: "Posture",
    fields: [text("subjects.{i}.kinetic_posture", "Kinetic posture", "what the body is doing", 3)],
  },
  {
    id: "wardrobe",
    group: "Subject",
    label: "Wardrobe",
    fields: [
      text("subjects.{i}.wardrobe_architecture.layering_system.base_layer", "Base layer", "shirt, underlayer"),
      text("subjects.{i}.wardrobe_architecture.layering_system.mid_layer", "Mid layer", "vest, tunic"),
      text("subjects.{i}.wardrobe_architecture.layering_system.outerwear", "Outerwear", "cloak, coat, armor"),
      text("subjects.{i}.wardrobe_architecture.textiles_and_weight", "Textiles & weight", "wool, silk, leather"),
      text("subjects.{i}.wardrobe_architecture.hardware_and_details", "Hardware", "buckles, stitching, metal"),
      text("subjects.{i}.wardrobe_architecture.wear_and_patina", "Wear & patina", "dust, scuffs, fade"),
      text("subjects.{i}.wardrobe_architecture.footwear", "Footwear", "boots, shoes"),
      {
        path: "subjects.{i}.wardrobe_architecture.accessories",
        label: "Accessories",
        hint: "One accessory per line",
        kind: "list",
        rows: 3,
      },
    ],
  },
  {
    id: "interaction",
    group: "Subject",
    label: "Interaction",
    fields: [
      text(
        "subjects.{i}.environmental_interaction",
        "Environmental interaction",
        "how they meet the place",
        3,
      ),
    ],
  },
  {
    id: "thesis",
    group: "Thesis",
    label: "Thesis",
    fields: [
      text("creative_thesis.narrative_subtext", "Narrative subtext", "what the picture is really about", 3),
      text("creative_thesis.focal_contradiction", "Focal contradiction", "the tension the frame holds", 3),
    ],
  },
  {
    id: "exclusions",
    group: "Thesis",
    label: "Exclusions",
    fields: [
      {
        path: "anti_cliche_exclusions",
        label: "Anti-cliché exclusions",
        hint: "One exclusion per line",
        kind: "list",
        rows: 6,
      },
    ],
  },
];

export const CLUSTER_GROUPS = ["Aesthetic DNA", "Scene", "Subject", "Thesis"] as const;

export function emptySubject(): Subject {
  return {
    subject_id: "",
    casting_and_physique: {
      demographics_and_features: "",
      skin_and_surface_microdetails: "",
      hair_and_grooming: "",
    },
    kinetic_posture: "",
    wardrobe_architecture: {
      layering_system: { base_layer: "", mid_layer: "", outerwear: "" },
      textiles_and_weight: "",
      hardware_and_details: "",
      wear_and_patina: "",
      accessories: [],
      footwear: "",
    },
    environmental_interaction: "",
  };
}

export function emptyDoc(): PromptDoc {
  return {
    aesthetic_dna: {
      medium_format: "",
      optics: {
        lens_type_and_focal_length: "",
        aperture_and_dof: "",
        physical_optical_imperfections: "",
      },
      lighting_architecture: {
        lighting_style: "",
        key_source: {
          fixture_or_origin: "",
          angle_and_elevation: "",
          falloff_and_contrast_ratio: "",
        },
        fill_and_negative_space: { fill_mechanism: "", shadow_depth: "" },
        accent_and_practicals: {
          rim_or_kicker: "",
          practical_sources: "",
          color_temperature_balance: "",
        },
      },
      color_science: { dominant_palette: [], tonal_behavior: "" },
    },
    scene_composition: {
      framing_doctrine: {
        named_principle: "",
        camera_elevation_and_axis: "",
        spatial_planes: {
          foreground_obstruction: "",
          midground_interaction: "",
          background_depth: "",
        },
      },
      environmental_staging: {
        location_context: "",
        atmosphere_and_air_density: "",
        grounded_props: [],
      },
    },
    subjects: [emptySubject()],
    creative_thesis: { narrative_subtext: "", focal_contradiction: "" },
    anti_cliche_exclusions: [],
  };
}

export function clusterById(id: ClusterId): Cluster {
  return CLUSTERS.find((cluster) => cluster.id === id) ?? CLUSTERS[0]!;
}

export function resolvePath(path: string, subjectIndex: number): string {
  return path.replaceAll("{i}", String(subjectIndex));
}

export function getAt(doc: PromptDoc, path: string): string | string[] {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, doc);
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string");
  return typeof value === "string" ? value : "";
}

export function setAt(doc: PromptDoc, path: string, value: string | string[]): PromptDoc {
  const clone = structuredClone(doc);
  const parts = path.split(".");
  let cursor: Record<string, unknown> = clone as unknown as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i] ?? "";
    const next = cursor[key];
    if (next == null || typeof next !== "object") return doc;
    cursor = next as Record<string, unknown>;
  }
  const leaf = parts[parts.length - 1] ?? "";
  cursor[leaf] = value;
  return clone;
}

export function clusterHasContent(doc: PromptDoc, cluster: Cluster, subjectIndex: number): boolean {
  return cluster.fields.some((field) => {
    const value = getAt(doc, resolvePath(field.path, subjectIndex));
    return Array.isArray(value) ? value.some((item) => item.trim()) : value.trim().length > 0;
  });
}

export function countFilled(doc: PromptDoc): number {
  let count = 0;
  const walk = (value: unknown) => {
    if (typeof value === "string") {
      if (value.trim()) count += 1;
      return;
    }
    if (Array.isArray(value)) {
      const objects = value.some((item) => item && typeof item === "object");
      if (!objects) {
        if (value.some((item) => typeof item === "string" && item.trim())) count += 1;
        return;
      }
      for (const item of value) walk(item);
      return;
    }
    if (value && typeof value === "object") {
      for (const child of Object.values(value)) walk(child);
    }
  };
  walk(doc);
  return count;
}

export function toJson(doc: PromptDoc): string {
  return JSON.stringify(doc, null, 2);
}

export function titleFromDoc(doc: PromptDoc): string {
  const subject = doc.subjects[0];
  const raw = subject?.subject_id.trim() || subject?.casting_and_physique.demographics_and_features.trim() || "";
  if (!raw) return "Untitled";
  const line = raw.split(",")[0]?.trim() ?? raw;
  return line.length > 48 ? `${line.slice(0, 48).trim()}…` : line;
}

export function toPromptLine(doc: PromptDoc): string {
  const parts: string[] = [];
  const push = (value: string) => {
    const next = value.trim();
    if (next) parts.push(next);
  };
  push(doc.aesthetic_dna.medium_format);
  for (const subject of doc.subjects) {
    push(subject.subject_id);
    push(subject.casting_and_physique.demographics_and_features);
    push(subject.casting_and_physique.hair_and_grooming);
    push(subject.casting_and_physique.skin_and_surface_microdetails);
    push(subject.wardrobe_architecture.layering_system.outerwear);
    push(subject.kinetic_posture);
    push(subject.environmental_interaction);
  }
  push(doc.scene_composition.environmental_staging.location_context);
  push(doc.scene_composition.framing_doctrine.spatial_planes.foreground_obstruction);
  push(doc.aesthetic_dna.lighting_architecture.lighting_style);
  push(doc.aesthetic_dna.lighting_architecture.accent_and_practicals.rim_or_kicker);
  push(doc.aesthetic_dna.optics.lens_type_and_focal_length);
  push(doc.aesthetic_dna.optics.aperture_and_dof);
  push(doc.scene_composition.framing_doctrine.named_principle);
  const main = parts.join(", ");
  const exclusions = doc.anti_cliche_exclusions.map((item) => item.trim()).filter(Boolean);
  if (exclusions.length === 0) return main;
  const line = exclusions.join(", ");
  return main ? `${main}\nNegative prompt: ${line}` : `Negative prompt: ${line}`;
}

export type SnippetCategory = ClusterId | "note";

export type Snippet = {
  id: string;
  title: string;
  body: string;
  category: SnippetCategory;
  custom: boolean;
  target?: string;
};

export type SavedPrompt = {
  id: string;
  title: string;
  source: string;
  doc: PromptDoc;
  createdAt: number;
  updatedAt: number;
};

export type SavedCharacter = {
  id: string;
  name: string;
  subject: Subject;
  createdAt: number;
};

export type Bookmark = {
  id: string;
  name: string;
  tags: string[];
  cluster: ClusterId;
  kind: "subject" | "section";
  subject: Subject | null;
  fields: Record<string, string | string[]>;
  hasImage: boolean;
  createdAt: number;
};

export type Draft = {
  title: string;
  source: string;
  doc: PromptDoc;
  cluster: ClusterId;
  subjectIndex: number;
  currentId: string | null;
};
