import {
  emptyDoc,
  emptySubject,
  type PromptDoc,
  type PromptFields,
  type Subject,
} from "./model.ts";

const HEX = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;

function bits(text: string): string[] {
  return text
    .split(/\s+and\s+|,\s*|\s+over\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

function join(parts: string[]): string {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

function pullHex(text: string): { hexes: string[]; rest: string } {
  const hexes: string[] = [];
  const rest = text
    .replace(HEX, (match) => {
      hexes.push(match.toUpperCase());
      return "";
    })
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ", ")
    .replace(/^,\s*|,\s*$/g, "")
    .trim();
  return { hexes, rest };
}

function routeAppearance(text: string, subject: Subject) {
  const hair: string[] = [];
  const skin: string[] = [];
  const demo: string[] = [];
  for (const bit of bits(text)) {
    if (/\b(hair|braid|ponytail|bangs|beard|stubble|groom)/i.test(bit)) hair.push(bit);
    else if (/\b(skin|pore|scar|freckle|wrinkle|complexion)/i.test(bit)) skin.push(bit);
    else demo.push(bit);
  }
  subject.casting_and_physique.hair_and_grooming = join(hair);
  subject.casting_and_physique.skin_and_surface_microdetails = join(skin);
  subject.casting_and_physique.demographics_and_features = join(demo);
}

function routeClothing(text: string, subject: Subject) {
  const wardrobe = subject.wardrobe_architecture;
  const base: string[] = [];
  const mid: string[] = [];
  const outer: string[] = [];
  const feet: string[] = [];
  const accessories: string[] = [];
  const wear: string[] = [];
  const textiles: string[] = [];
  const hardware: string[] = [];
  for (const bit of bits(text)) {
    if (/\b(boots?|shoes?|heels?|footwear)\b/i.test(bit)) feet.push(bit);
    else if (/\b(gloves?|jewelry|necklace|crown|scarf|earrings?|rings?|bracelet)\b/i.test(bit)) {
      accessories.push(bit);
    } else if (/\b(shirt|blouse|undershirt)\b/i.test(bit)) base.push(bit);
    else if (/\b(vest|tunic|sweater)\b/i.test(bit)) mid.push(bit);
    else outer.push(bit);
    const worn = bit.match(/\b(weathered|worn|scuffed|patina|frayed|stained)\b/i);
    if (worn?.[1]) wear.push(worn[1].toLowerCase());
    const cloth = bit.match(/\b(silk|velvet|leather|linen|lace|wool|denim|cotton)\b/i);
    if (cloth?.[1]) textiles.push(cloth[1].toLowerCase());
    const metal = bit.match(/\b(buckles?|brass|steel|hardware|zippers?|embroidery)\b/i);
    if (metal?.[1]) hardware.push(metal[1].toLowerCase());
  }
  wardrobe.layering_system.base_layer = join(base);
  wardrobe.layering_system.mid_layer = join(mid);
  wardrobe.layering_system.outerwear = join(outer);
  wardrobe.footwear = join(feet);
  wardrobe.accessories = accessories;
  wardrobe.wear_and_patina = join(wear);
  wardrobe.textiles_and_weight = join(textiles);
  wardrobe.hardware_and_details = join(hardware);
}

function routeCamera(text: string, doc: PromptDoc) {
  const lens: string[] = [];
  const aperture: string[] = [];
  const flaws: string[] = [];
  const principle: string[] = [];
  const elevation: string[] = [];
  for (const bit of bits(text)) {
    if (/\b(\d{2,3}\s?mm|lens|anamorphic|telephoto|macro)\b/i.test(bit)) lens.push(bit);
    else if (/\b(f\/\d|aperture|depth of field|dof|bokeh|focus)\b/i.test(bit)) aperture.push(bit);
    else if (/\b(grain|halation|aberration|vignette|ink bleed|paper texture)\b/i.test(bit)) flaws.push(bit);
    if (/\b(worm'?s?\s*eye|bird'?s?\s*eye|low angle|high angle|dutch|from above|from below|upward)\b/i.test(bit)) {
      principle.push(bit);
      elevation.push(bit);
    }
  }
  const optics = doc.aesthetic_dna.optics;
  optics.lens_type_and_focal_length = join(lens);
  optics.aperture_and_dof = join(aperture);
  optics.physical_optical_imperfections = join([
    optics.physical_optical_imperfections,
    ...flaws,
  ]);
  const framing = doc.scene_composition.framing_doctrine;
  framing.named_principle = join(principle);
  framing.camera_elevation_and_axis = join(elevation);
}

function routeLighting(text: string, doc: PromptDoc) {
  const light = doc.aesthetic_dna.lighting_architecture;
  const style: string[] = [];
  const key: string[] = [];
  const fill: string[] = [];
  const shadow: string[] = [];
  const rim: string[] = [];
  const practical: string[] = [];
  const temp: string[] = [];
  for (const bit of bits(text)) {
    if (/\brim\b|\bkicker\b/i.test(bit)) rim.push(bit);
    else if (/\b(neon|candles?|fire|lantern|practicals?)\b/i.test(bit)) practical.push(bit);
    else if (/\bfill\b/i.test(bit)) fill.push(bit);
    else if (/\b(shadow|low[- ]key|chiaroscuro)\b/i.test(bit)) shadow.push(bit);
    else if (/\b(warm|cool|kelvin|tungsten|daylight)\b/i.test(bit)) temp.push(bit);
    else if (/\b(golden hour|key light|sun|window|moonlight|moon)\b/i.test(bit)) key.push(bit);
    else style.push(bit);
  }
  light.lighting_style = join(style);
  light.key_source.fixture_or_origin = join(key);
  light.fill_and_negative_space.fill_mechanism = join(fill);
  light.fill_and_negative_space.shadow_depth = join(shadow);
  light.accent_and_practicals.rim_or_kicker = join(rim);
  light.accent_and_practicals.practical_sources = join(practical);
  light.accent_and_practicals.color_temperature_balance = join(temp);
}

export function docFromFlat(fields: PromptFields): PromptDoc {
  const doc = emptyDoc();
  const subject = doc.subjects[0] ?? emptySubject();
  doc.subjects = [subject];

  const buckets = { ...fields };
  const hexes: string[] = [];
  for (const key of Object.keys(buckets) as Array<keyof PromptFields>) {
    const pulled = pullHex(buckets[key]);
    buckets[key] = pulled.rest;
    hexes.push(...pulled.hexes);
  }

  subject.subject_id = buckets.subject;
  routeAppearance(buckets.appearance, subject);
  routeClothing(buckets.clothing, subject);
  subject.kinetic_posture = buckets.pose;
  doc.scene_composition.framing_doctrine.spatial_planes.foreground_obstruction = buckets.foreground;
  doc.scene_composition.environmental_staging.location_context = buckets.background;
  if (/\b(storm|rain|fog|mist|haze|dust|smoke|snow)\b/i.test(buckets.background)) {
    doc.scene_composition.environmental_staging.atmosphere_and_air_density = buckets.background;
  }
  doc.aesthetic_dna.medium_format = buckets.style;
  routeLighting(buckets.lighting, doc);
  routeCamera(buckets.camera, doc);
  doc.anti_cliche_exclusions = bits(buckets.extra);
  doc.aesthetic_dna.color_science.dominant_palette = [...new Set(hexes)];
  return doc;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function mergeSubject(value: unknown): Subject {
  const base = emptySubject();
  if (!value || typeof value !== "object" || Array.isArray(value)) return base;
  const item = value as Record<string, unknown>;
  base.subject_id = asString(item.subject_id);
  const casting = item.casting_and_physique;
  if (casting && typeof casting === "object" && !Array.isArray(casting)) {
    const face = casting as Record<string, unknown>;
    base.casting_and_physique.demographics_and_features = asString(face.demographics_and_features);
    base.casting_and_physique.skin_and_surface_microdetails = asString(face.skin_and_surface_microdetails);
    base.casting_and_physique.hair_and_grooming = asString(face.hair_and_grooming);
  }
  base.kinetic_posture = asString(item.kinetic_posture);
  base.environmental_interaction = asString(item.environmental_interaction);
  const wardrobe = item.wardrobe_architecture;
  if (wardrobe && typeof wardrobe === "object" && !Array.isArray(wardrobe)) {
    const clothes = wardrobe as Record<string, unknown>;
    const layers = clothes.layering_system;
    if (layers && typeof layers === "object" && !Array.isArray(layers)) {
      const layer = layers as Record<string, unknown>;
      base.wardrobe_architecture.layering_system.base_layer = asString(layer.base_layer);
      base.wardrobe_architecture.layering_system.mid_layer = asString(layer.mid_layer);
      base.wardrobe_architecture.layering_system.outerwear = asString(layer.outerwear);
    }
    base.wardrobe_architecture.textiles_and_weight = asString(clothes.textiles_and_weight);
    base.wardrobe_architecture.hardware_and_details = asString(clothes.hardware_and_details);
    base.wardrobe_architecture.wear_and_patina = asString(clothes.wear_and_patina);
    base.wardrobe_architecture.footwear = asString(clothes.footwear);
    base.wardrobe_architecture.accessories = asList(clothes.accessories);
  }
  return base;
}

export function coerceSubject(value: unknown): Subject {
  return mergeSubject(value);
}

export function isNativeDoc(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return (
    "aesthetic_dna" in record ||
    "scene_composition" in record ||
    "creative_thesis" in record ||
    "anti_cliche_exclusions" in record ||
    Array.isArray(record.subjects)
  );
}

export function coerceDoc(value: unknown): PromptDoc {
  const doc = emptyDoc();
  if (!value || typeof value !== "object" || Array.isArray(value)) return doc;
  const record = value as Record<string, unknown>;
  const dna = record.aesthetic_dna;
  if (dna && typeof dna === "object" && !Array.isArray(dna)) {
    const aesthetic = dna as Record<string, unknown>;
    doc.aesthetic_dna.medium_format = asString(aesthetic.medium_format);
    const optics = aesthetic.optics;
    if (optics && typeof optics === "object" && !Array.isArray(optics)) {
      const lens = optics as Record<string, unknown>;
      doc.aesthetic_dna.optics.lens_type_and_focal_length = asString(lens.lens_type_and_focal_length);
      doc.aesthetic_dna.optics.aperture_and_dof = asString(lens.aperture_and_dof);
      doc.aesthetic_dna.optics.physical_optical_imperfections = asString(
        lens.physical_optical_imperfections,
      );
    }
    const lighting = aesthetic.lighting_architecture;
    if (lighting && typeof lighting === "object" && !Array.isArray(lighting)) {
      const light = lighting as Record<string, unknown>;
      doc.aesthetic_dna.lighting_architecture.lighting_style = asString(light.lighting_style);
      const key = light.key_source;
      if (key && typeof key === "object" && !Array.isArray(key)) {
        const source = key as Record<string, unknown>;
        doc.aesthetic_dna.lighting_architecture.key_source.fixture_or_origin = asString(
          source.fixture_or_origin,
        );
        doc.aesthetic_dna.lighting_architecture.key_source.angle_and_elevation = asString(
          source.angle_and_elevation,
        );
        doc.aesthetic_dna.lighting_architecture.key_source.falloff_and_contrast_ratio = asString(
          source.falloff_and_contrast_ratio,
        );
      }
      const fill = light.fill_and_negative_space;
      if (fill && typeof fill === "object" && !Array.isArray(fill)) {
        const shadow = fill as Record<string, unknown>;
        doc.aesthetic_dna.lighting_architecture.fill_and_negative_space.fill_mechanism = asString(
          shadow.fill_mechanism,
        );
        doc.aesthetic_dna.lighting_architecture.fill_and_negative_space.shadow_depth = asString(
          shadow.shadow_depth,
        );
      }
      const accent = light.accent_and_practicals;
      if (accent && typeof accent === "object" && !Array.isArray(accent)) {
        const practical = accent as Record<string, unknown>;
        doc.aesthetic_dna.lighting_architecture.accent_and_practicals.rim_or_kicker = asString(
          practical.rim_or_kicker,
        );
        doc.aesthetic_dna.lighting_architecture.accent_and_practicals.practical_sources = asString(
          practical.practical_sources,
        );
        doc.aesthetic_dna.lighting_architecture.accent_and_practicals.color_temperature_balance =
          asString(practical.color_temperature_balance);
      }
    }
    const color = aesthetic.color_science;
    if (color && typeof color === "object" && !Array.isArray(color)) {
      const science = color as Record<string, unknown>;
      doc.aesthetic_dna.color_science.dominant_palette = asList(science.dominant_palette);
      doc.aesthetic_dna.color_science.tonal_behavior = asString(science.tonal_behavior);
    }
  }
  const scene = record.scene_composition;
  if (scene && typeof scene === "object" && !Array.isArray(scene)) {
    const composition = scene as Record<string, unknown>;
    const framing = composition.framing_doctrine;
    if (framing && typeof framing === "object" && !Array.isArray(framing)) {
      const frame = framing as Record<string, unknown>;
      doc.scene_composition.framing_doctrine.named_principle = asString(frame.named_principle);
      doc.scene_composition.framing_doctrine.camera_elevation_and_axis = asString(
        frame.camera_elevation_and_axis,
      );
      const planes = frame.spatial_planes;
      if (planes && typeof planes === "object" && !Array.isArray(planes)) {
        const space = planes as Record<string, unknown>;
        doc.scene_composition.framing_doctrine.spatial_planes.foreground_obstruction = asString(
          space.foreground_obstruction,
        );
        doc.scene_composition.framing_doctrine.spatial_planes.midground_interaction = asString(
          space.midground_interaction,
        );
        doc.scene_composition.framing_doctrine.spatial_planes.background_depth = asString(
          space.background_depth,
        );
      }
    }
    const staging = composition.environmental_staging;
    if (staging && typeof staging === "object" && !Array.isArray(staging)) {
      const place = staging as Record<string, unknown>;
      doc.scene_composition.environmental_staging.location_context = asString(place.location_context);
      doc.scene_composition.environmental_staging.atmosphere_and_air_density = asString(
        place.atmosphere_and_air_density,
      );
      doc.scene_composition.environmental_staging.grounded_props = asList(place.grounded_props);
    }
  }
  if (Array.isArray(record.subjects) && record.subjects.length > 0) {
    doc.subjects = record.subjects.map((item) => mergeSubject(item));
  }
  const thesis = record.creative_thesis;
  if (thesis && typeof thesis === "object" && !Array.isArray(thesis)) {
    const idea = thesis as Record<string, unknown>;
    doc.creative_thesis.narrative_subtext = asString(idea.narrative_subtext);
    doc.creative_thesis.focal_contradiction = asString(idea.focal_contradiction);
  }
  doc.anti_cliche_exclusions = asList(record.anti_cliche_exclusions);
  return doc;
}
