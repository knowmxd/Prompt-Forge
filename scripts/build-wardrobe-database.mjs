import fs from "node:fs";
import path from "node:path";

const libPath = path.resolve("Lib_Wardrobe/wardrobe_library.json");
const lib = JSON.parse(fs.readFileSync(libPath, "utf8"));

const items = lib.items.map((item) => ({
  ...item,
  image: item.image.startsWith("/") ? item.image : "/" + item.image,
}));

const outfits = lib.outfits.map((outfit) => ({
  ...outfit,
  image: outfit.image.startsWith("/") ? outfit.image : "/" + outfit.image,
}));

const code = `// Auto-generated from Lib_Wardrobe/wardrobe_library.json (version ${lib.version})
import { setAt, type PromptDoc } from "./model.ts";

export type WardrobeSlot =
  | "outerwear"
  | "layer_top"
  | "top"
  | "dress_onepiece"
  | "bottom"
  | "belt_waist"
  | "legwear"
  | "shoes"
  | "headwear"
  | "eyewear"
  | "neckwear"
  | "jewelry"
  | "bag"
  | "accessory";

export type WardrobeItem = {
  id: string;
  name: string;
  slot: WardrobeSlot;
  subcategory: string;
  style_tags: string[];
  colors: string[];
  materials: string[];
  patterns?: string[];
  fit_silhouette?: string;
  details?: string[];
  styling_notes?: string;
  prompt: string;
  prompt_brand_free?: string;
  negative?: string[];
  source_images?: string[];
  render_style_seen?: "illustration" | "photo" | "both";
  outfit_ids?: string[];
  image: string;
  is_custom?: boolean;
  created_at?: number;
};

export type WardrobeOutfit = {
  id: string;
  name: string;
  style_tags: string[];
  slots: Record<WardrobeSlot, string[]>;
  item_ids: string[];
  prompt: string;
  prompt_brand_free?: string;
  negative?: string[];
  source_images?: string[];
  image: string;
  user_created?: boolean;
  is_custom?: boolean;
  created_at?: number;
};

export type WardrobeSlotInfo = {
  slot: WardrobeSlot;
  description: string;
  subcategories: string[];
  item_count: number;
};

export const WARDROBE_LIBRARY_METADATA = {
  version: ${JSON.stringify(lib.version)},
  created: ${JSON.stringify(lib.created)},
  updated: ${JSON.stringify(lib.updated || lib.created)},
  description: ${JSON.stringify(lib.description)},
};

export const WARDROBE_SLOTS: WardrobeSlotInfo[] = ${JSON.stringify(lib.slots, null, 2)};

export const STYLE_TAG_VOCABULARY: Record<string, string> = ${JSON.stringify(lib.style_tag_vocabulary, null, 2)};

export const WARDROBE_ITEMS: WardrobeItem[] = ${JSON.stringify(items, null, 2)};

export const WARDROBE_OUTFITS: WardrobeOutfit[] = ${JSON.stringify(outfits, null, 2)};

export const WARDROBE_ITEMS_BY_ID = new Map<string, WardrobeItem>(
  WARDROBE_ITEMS.map((item) => [item.id, item]),
);

export const WARDROBE_OUTFITS_BY_ID = new Map<string, WardrobeOutfit>(
  WARDROBE_OUTFITS.map((outfit) => [outfit.id, outfit]),
);

export function applyWardrobeItem(doc: PromptDoc, item: WardrobeItem, slotIndex: number): PromptDoc {
  let next = doc;
  const basePath = \`subjects.\${slotIndex}.wardrobe_architecture\`;
  const arch = doc.subjects[slotIndex]?.wardrobe_architecture;
  if (!arch) return doc;

  // 1. Slot to Layering System mapping
  if (item.slot === "outerwear") {
    next = setAt(next, \`\${basePath}.layering_system.outerwear\`, item.prompt);
  } else if (item.slot === "layer_top") {
    next = setAt(next, \`\${basePath}.layering_system.mid_layer\`, item.prompt);
  } else if (item.slot === "top") {
    const existingBase = arch.layering_system.base_layer.trim();
    // If existing base has a bottom or top, set or append cleanly
    if (existingBase.includes("jeans") || existingBase.includes("skirt") || existingBase.includes("pants") || existingBase.includes("shorts")) {
      next = setAt(next, \`\${basePath}.layering_system.base_layer\`, \`\${item.prompt}; \${existingBase}\`);
    } else {
      next = setAt(next, \`\${basePath}.layering_system.base_layer\`, item.prompt);
    }
  } else if (item.slot === "bottom") {
    const existingBase = arch.layering_system.base_layer.trim();
    if (existingBase && !existingBase.includes(item.prompt)) {
      next = setAt(next, \`\${basePath}.layering_system.base_layer\`, \`\${existingBase}; \${item.prompt}\`);
    } else {
      next = setAt(next, \`\${basePath}.layering_system.base_layer\`, item.prompt);
    }
  } else if (item.slot === "dress_onepiece") {
    // Replaces top and bottom
    next = setAt(next, \`\${basePath}.layering_system.base_layer\`, item.prompt);
  } else if (item.slot === "shoes") {
    next = setAt(next, \`\${basePath}.footwear\`, item.prompt);
  } else {
    // Accessory slots: headwear, eyewear, neckwear, jewelry, belt_waist, legwear, bag, accessory
    const currentAccessories = arch.accessories ?? [];
    if (!currentAccessories.includes(item.prompt)) {
      next = setAt(next, \`\${basePath}.accessories\`, [...currentAccessories, item.prompt]);
    }
  }

  // 2. Textiles & weight enrichment
  if (item.materials && item.materials.length > 0) {
    const currentMats = arch.textiles_and_weight.trim();
    const newMats = item.materials.join(", ");
    if (!currentMats) {
      next = setAt(next, \`\${basePath}.textiles_and_weight\`, newMats);
    } else if (!currentMats.includes(item.materials[0])) {
      next = setAt(next, \`\${basePath}.textiles_and_weight\`, \`\${currentMats}, \${newMats}\`);
    }
  }

  // 3. Hardware & details enrichment
  if (item.details && item.details.length > 0) {
    const currentDetails = arch.hardware_and_details.trim();
    const newDetails = item.details.join("; ");
    if (!currentDetails) {
      next = setAt(next, \`\${basePath}.hardware_and_details\`, newDetails);
    } else if (!currentDetails.includes(item.details[0])) {
      next = setAt(next, \`\${basePath}.hardware_and_details\`, \`\${currentDetails}; \${newDetails}\`);
    }
  }

  // 4. Negatives enrichment
  if (item.negative && item.negative.length > 0) {
    const currentNegs = doc.anti_cliche_exclusions ?? [];
    const mergedNegs = Array.from(new Set([...currentNegs, ...item.negative]));
    next = setAt(next, "anti_cliche_exclusions", mergedNegs);
  }

  return next;
}

export function applyWardrobeOutfit(doc: PromptDoc, outfit: WardrobeOutfit, slotIndex: number): PromptDoc {
  let next = doc;
  const basePath = \`subjects.\${slotIndex}.wardrobe_architecture\`;
  const items = outfit.item_ids
    .map((id) => WARDROBE_ITEMS_BY_ID.get(id))
    .filter((i): i is WardrobeItem => Boolean(i));

  const resolvePrompt = (idOrPrompt: string) => {
    const item = WARDROBE_ITEMS_BY_ID.get(idOrPrompt);
    return item?.prompt || idOrPrompt;
  };

  // 1. Outerwear
  const outerwearItems = (outfit.slots.outerwear || [])
    .map(resolvePrompt)
    .filter(Boolean);
  next = setAt(next, \`\${basePath}.layering_system.outerwear\`, outerwearItems.join("; "));

  // 2. Mid layer (layer_top)
  const midItems = (outfit.slots.layer_top || [])
    .map(resolvePrompt)
    .filter(Boolean);
  next = setAt(next, \`\${basePath}.layering_system.mid_layer\`, midItems.join("; "));

  // 3. Base layer (dress_onepiece, or top + bottom, or direct prompt if custom)
  const dressItems = (outfit.slots.dress_onepiece || [])
    .map(resolvePrompt)
    .filter(Boolean);
  if (dressItems.length > 0) {
    next = setAt(next, \`\${basePath}.layering_system.base_layer\`, dressItems.join("; "));
  } else {
    const topItems = (outfit.slots.top || [])
      .map(resolvePrompt)
      .filter(Boolean);
    const bottomItems = (outfit.slots.bottom || [])
      .map(resolvePrompt)
      .filter(Boolean);
    const baseJoined = [...topItems, ...bottomItems].join("; ");
    if (baseJoined) {
      next = setAt(next, \`\${basePath}.layering_system.base_layer\`, baseJoined);
    } else if (outfit.is_custom && outfit.prompt && !outerwearItems.length && !midItems.length) {
      next = setAt(next, \`\${basePath}.layering_system.base_layer\`, outfit.prompt);
    }
  }

  // 4. Footwear
  const shoesItems = (outfit.slots.shoes || [])
    .map(resolvePrompt)
    .filter(Boolean);
  next = setAt(next, \`\${basePath}.footwear\`, shoesItems.join("; "));

  // 5. Accessories (headwear, eyewear, neckwear, jewelry, belt_waist, legwear, bag, accessory)
  const accessorySlots: WardrobeSlot[] = [
    "headwear",
    "eyewear",
    "neckwear",
    "jewelry",
    "belt_waist",
    "legwear",
    "bag",
    "accessory",
  ];
  const accList: string[] = [];
  for (const slotName of accessorySlots) {
    const slotItemIds = outfit.slots[slotName] || [];
    for (const id of slotItemIds) {
      const p = resolvePrompt(id);
      if (p && !accList.includes(p)) {
        accList.push(p);
      }
    }
  }
  next = setAt(next, \`\${basePath}.accessories\`, accList);

  // 6. Textiles & weight
  const materials = Array.from(new Set(items.flatMap((i) => i.materials || [])));
  if (materials.length > 0) {
    next = setAt(next, \`\${basePath}.textiles_and_weight\`, materials.join(", "));
  }

  // 7. Hardware & details
  const details = Array.from(new Set(items.flatMap((i) => i.details || [])));
  if (details.length > 0) {
    next = setAt(next, \`\${basePath}.hardware_and_details\`, details.join("; "));
  }

  // 8. Negatives
  if (outfit.negative && outfit.negative.length > 0) {
    const currentNegs = doc.anti_cliche_exclusions ?? [];
    const mergedNegs = Array.from(new Set([...currentNegs, ...outfit.negative]));
    next = setAt(next, "anti_cliche_exclusions", mergedNegs);
  }

  return next;
}

export function isWardrobeOutfitApplied(
  doc: PromptDoc,
  outfit: WardrobeOutfit,
  slotIndex: number,
): boolean {
  const arch = doc.subjects[slotIndex]?.wardrobe_architecture;
  if (!arch) return false;

  // Check if outerwear matches if outfit has outerwear
  const outfitOuter = (outfit.slots.outerwear || [])
    .map((id) => WARDROBE_ITEMS_BY_ID.get(id)?.prompt)
    .filter(Boolean)
    .join("; ");
  if (outfitOuter && arch.layering_system.outerwear !== outfitOuter) {
    return false;
  }

  // Check footwear if outfit has footwear
  const outfitShoes = (outfit.slots.shoes || [])
    .map((id) => WARDROBE_ITEMS_BY_ID.get(id)?.prompt)
    .filter(Boolean)
    .join("; ");
  if (outfitShoes && arch.footwear !== outfitShoes) {
    return false;
  }

  // Check base layer
  const dressItems = (outfit.slots.dress_onepiece || [])
    .map((id) => WARDROBE_ITEMS_BY_ID.get(id)?.prompt)
    .filter(Boolean);
  if (dressItems.length > 0) {
    return arch.layering_system.base_layer === dressItems.join("; ");
  }

  const topItems = (outfit.slots.top || [])
    .map((id) => WARDROBE_ITEMS_BY_ID.get(id)?.prompt)
    .filter(Boolean);
  if (topItems.length > 0 && topItems[0] && !arch.layering_system.base_layer.includes(topItems[0])) {
    return false;
  }

  return true;
}

export function filterWardrobeItems(
  items: WardrobeItem[],
  query: string,
  slot: WardrobeSlot | "all" = "all",
  styleTag?: string,
): WardrobeItem[] {
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    if (slot !== "all" && item.slot !== slot) return false;
    if (styleTag && !item.style_tags.includes(styleTag)) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.prompt.toLowerCase().includes(q) ||
      item.subcategory.toLowerCase().includes(q) ||
      (item.materials && item.materials.some((m) => m.toLowerCase().includes(q))) ||
      (item.colors && item.colors.some((c) => c.toLowerCase().includes(q))) ||
      (item.details && item.details.some((d) => d.toLowerCase().includes(q))) ||
      (item.style_tags && item.style_tags.some((t) => t.toLowerCase().includes(q)))
    );
  });
}

export function filterWardrobeOutfits(
  outfits: WardrobeOutfit[],
  query: string,
  styleTag?: string,
): WardrobeOutfit[] {
  const q = query.trim().toLowerCase();
  return outfits.filter((outfit) => {
    if (styleTag && !outfit.style_tags.includes(styleTag)) return false;
    if (!q) return true;
    return (
      outfit.name.toLowerCase().includes(q) ||
      outfit.prompt.toLowerCase().includes(q) ||
      (outfit.style_tags && outfit.style_tags.some((t) => t.toLowerCase().includes(q)))
    );
  });
}

/**
 * Merge custom items with built-in items, placing custom items at the top
 */
export function combineWardrobeItems(
  builtIn: WardrobeItem[],
  custom: WardrobeItem[],
): WardrobeItem[] {
  if (!custom || custom.length === 0) return builtIn;
  const customIds = new Set(custom.map((c) => c.id));
  const filteredBuiltIn = builtIn.filter((b) => !customIds.has(b.id));
  return [...custom, ...filteredBuiltIn];
}

/**
 * Merge custom outfits with built-in outfits, placing custom outfits at the top
 */
export function combineWardrobeOutfits(
  builtIn: WardrobeOutfit[],
  custom: WardrobeOutfit[],
): WardrobeOutfit[] {
  if (!custom || custom.length === 0) return builtIn;
  const customIds = new Set(custom.map((c) => c.id));
  const filteredBuiltIn = builtIn.filter((b) => !customIds.has(b.id));
  return [...custom, ...filteredBuiltIn];
}
`;

fs.writeFileSync("src/lib/prompt/wardrobe-database.ts", code);
console.log(`Generated wardrobe-database.ts with ${items.length} items and ${outfits.length} outfits.`);
