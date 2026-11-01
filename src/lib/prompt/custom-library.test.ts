import test from "node:test";
import assert from "node:assert/strict";
import {
  saveCustomItem,
  loadCustomItems,
  deleteCustomItem,
  saveCustomOutfit,
  loadCustomOutfits,
  deleteCustomOutfit,
  exportCustomLibraryJson,
  importCustomLibraryJson,
} from "./custom-library-store.ts";
import {
  combineWardrobeItems,
  combineWardrobeOutfits,
  applyWardrobeItem,
  applyWardrobeOutfit,
  type WardrobeItem,
  type WardrobeOutfit,
} from "./wardrobe-database.ts";
import { emptyDoc } from "./model.ts";

test("custom library store: CRUD operations for items", async () => {
  const testItem: WardrobeItem = {
    id: "test_custom_vest_01",
    name: "Cyberpunk Tactical Holster Vest",
    slot: "outerwear",
    subcategory: "vest",
    style_tags: ["cyberpunk", "techwear", "streetwear"],
    colors: ["black", "neon cyan"],
    materials: ["ballistic nylon", "tactical webbing"],
    prompt: "matte black ballistic nylon tactical chest rig holster vest with quick-release buckles and neon cyan accents",
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  };

  await saveCustomItem(testItem);

  const loaded = await loadCustomItems();
  const found = loaded.find((i) => i.id === testItem.id);
  assert.ok(found, "Custom item should be saved and retrievable");
  assert.equal(found.name, testItem.name);
  assert.equal(found.slot, "outerwear");
  assert.equal(found.is_custom, true);

  // Combine with empty built-in
  const combined = combineWardrobeItems([], loaded);
  assert.ok(combined.some((i) => i.id === testItem.id));

  // Delete
  await deleteCustomItem(testItem.id);
  const afterDelete = await loadCustomItems();
  assert.ok(!afterDelete.some((i) => i.id === testItem.id), "Custom item should be deleted");
});

test("custom library store: CRUD operations for outfits", async () => {
  const testOutfit: WardrobeOutfit = {
    id: "test_custom_outfit_01",
    name: "Neo-Tokyo Streetwear Look",
    style_tags: ["cyberpunk", "streetwear"],
    slots: {
      outerwear: ["matte black tactical windbreaker"],
      layer_top: [],
      top: ["charcoal technical moisture-wicking graphic tee"],
      dress_onepiece: [],
      bottom: ["tapered multi-pocket jogger cargo pants"],
      belt_waist: ["industrial seatbelt clip belt"],
      legwear: [],
      shoes: ["high-top futuristic technical sneakers"],
      headwear: [],
      eyewear: ["tinted orange shield sunglasses"],
      neckwear: [],
      jewelry: [],
      bag: ["crossbody waterproof sling pack"],
      accessory: [],
    },
    item_ids: [],
    prompt: "complete cyberpunk streetwear outfit with tactical windbreaker, technical tee, and cargo pants",
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  };

  await saveCustomOutfit(testOutfit);

  const loaded = await loadCustomOutfits();
  const found = loaded.find((o) => o.id === testOutfit.id);
  assert.ok(found, "Custom outfit should be saved and retrievable");
  assert.equal(found.name, testOutfit.name);
  assert.equal(found.is_custom, true);

  // Apply to prompt doc
  const doc = emptyDoc();
  const nextDoc = applyWardrobeOutfit(doc, found, 0);
  assert.equal(
    nextDoc.subjects[0]?.wardrobe_architecture.layering_system.outerwear,
    "matte black tactical windbreaker",
  );
  assert.equal(
    nextDoc.subjects[0]?.wardrobe_architecture.footwear,
    "high-top futuristic technical sneakers",
  );
  assert.ok(
    nextDoc.subjects[0]?.wardrobe_architecture.accessories.includes("crossbody waterproof sling pack"),
  );

  // Delete
  await deleteCustomOutfit(testOutfit.id);
  const afterDelete = await loadCustomOutfits();
  assert.ok(!afterDelete.some((o) => o.id === testOutfit.id), "Custom outfit should be deleted");
});

test("custom library store: export and import JSON", async () => {
  const item: WardrobeItem = {
    id: "import_export_item_01",
    name: "Distressed Suede Shearling Coat",
    slot: "outerwear",
    subcategory: "coat",
    style_tags: ["vintage", "winter"],
    colors: ["tan", "cream"],
    materials: ["suede", "shearling"],
    prompt: "vintage tan distressed suede coat with thick cream shearling lining and oversized notch lapels",
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  };
  await saveCustomItem(item);

  const jsonStr = await exportCustomLibraryJson();
  assert.ok(jsonStr.includes("Distressed Suede Shearling Coat"));

  // Clear item
  await deleteCustomItem(item.id);

  // Re-import
  const result = await importCustomLibraryJson(jsonStr);
  assert.ok(result.itemsCount >= 1, "Should import at least 1 item");

  const reloaded = await loadCustomItems();
  assert.ok(reloaded.some((i) => i.id === item.id));

  // Cleanup
  await deleteCustomItem(item.id);
});
