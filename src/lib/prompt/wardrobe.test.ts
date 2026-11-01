import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptyDoc } from "./model.ts";
import {
  WARDROBE_ITEMS,
  WARDROBE_OUTFITS,
  WARDROBE_SLOTS,
  applyWardrobeItem,
  applyWardrobeOutfit,
  isWardrobeOutfitApplied,
  filterWardrobeItems,
  filterWardrobeOutfits,
} from "./wardrobe-database.ts";

describe("wardrobe database", () => {
  it("loads 294 items, 49 outfits, and 14 slots", () => {
    assert.equal(WARDROBE_ITEMS.length, 294);
    assert.equal(WARDROBE_OUTFITS.length, 49);
    assert.equal(WARDROBE_SLOTS.length, 14);

    // Verify all item images start with /shots/items/
    for (const item of WARDROBE_ITEMS) {
      assert.ok(item.image.startsWith("/shots/items/"), `Expected /shots/items/ in ${item.image}`);
      assert.ok(item.prompt.length > 0);
    }

    // Verify all outfit images start with /shots/outfits/
    for (const outfit of WARDROBE_OUTFITS) {
      assert.ok(outfit.image.startsWith("/shots/outfits/"), `Expected /shots/outfits/ in ${outfit.image}`);
      assert.ok(outfit.prompt.length > 0);
    }
  });

  it("applies individual wardrobe item to the subject's wardrobe architecture", () => {
    const doc = emptyDoc();
    const sherpa = WARDROBE_ITEMS.find((i) => i.id === "outerwear_jacket_sherpa_shaggy_cream_01")!;
    assert.ok(sherpa);

    const docWithJacket = applyWardrobeItem(doc, sherpa, 0);
    const arch = docWithJacket.subjects[0]!.wardrobe_architecture;
    assert.equal(arch.layering_system.outerwear, sherpa.prompt);
    assert.ok(arch.textiles_and_weight.includes("curly sherpa fleece"));
    assert.ok(arch.hardware_and_details.includes("shawl collar"));

    // Apply footwear
    const boots = WARDROBE_ITEMS.find((i) => i.id === "shoes_boots_slouch_suede_brown_01")!;
    assert.ok(boots);
    const docWithBoots = applyWardrobeItem(docWithJacket, boots, 0);
    assert.equal(docWithBoots.subjects[0]!.wardrobe_architecture.footwear, boots.prompt);

    // Apply accessory
    const bag = WARDROBE_ITEMS.find((i) => i.id === "bag_satchel_flap_crossbody_charcoal_01")!;
    assert.ok(bag);
    const docWithBag = applyWardrobeItem(docWithBoots, bag, 0);
    assert.ok(docWithBag.subjects[0]!.wardrobe_architecture.accessories.includes(bag.prompt));
  });

  it("applies complete outfit preset to all wardrobe architecture fields at once", () => {
    const doc = emptyDoc();
    const outfitA1 = WARDROBE_OUTFITS.find((o) => o.id === "outfit_A1")!;
    assert.ok(outfitA1);

    const applied = applyWardrobeOutfit(doc, outfitA1, 0);
    const arch = applied.subjects[0]!.wardrobe_architecture;

    // Check outerwear
    assert.ok(arch.layering_system.outerwear.includes("shaggy curly sherpa fleece"));
    // Check base layer
    assert.ok(arch.layering_system.base_layer.includes("Breton stripes"));
    // Check footwear
    assert.ok(arch.footwear.includes("slouch boots"));
    // Check accessories
    assert.ok(arch.accessories.length >= 3);
    // Check textiles and details
    assert.ok(arch.textiles_and_weight.length > 0);
    assert.ok(arch.hardware_and_details.length > 0);
    // Check negatives
    assert.ok(applied.anti_cliche_exclusions.length >= 3);

    // Verify isWardrobeOutfitApplied
    assert.equal(isWardrobeOutfitApplied(applied, outfitA1, 0), true);

    const outfitA2 = WARDROBE_OUTFITS.find((o) => o.id === "outfit_A2")!;
    assert.equal(isWardrobeOutfitApplied(applied, outfitA2, 0), false);
  });

  it("filters items and outfits accurately by search query, slot, and style tags", () => {
    // Filter items by slot
    const tops = filterWardrobeItems(WARDROBE_ITEMS, "", "top");
    assert.equal(tops.length, 49);

    // Filter items by query
    const leather = filterWardrobeItems(WARDROBE_ITEMS, "leather");
    assert.ok(leather.length >= 10);

    // Filter outfits by style tag
    const coquetteOutfits = filterWardrobeOutfits(WARDROBE_OUTFITS, "", "coquette");
    assert.ok(coquetteOutfits.length >= 5);

    // Filter outfits by query
    const sherpaOutfits = filterWardrobeOutfits(WARDROBE_OUTFITS, "sherpa");
    assert.ok(sherpaOutfits.length >= 1);
  });
});
