import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { emptyDoc } from "./model.ts";
import {
  STYLE_LIBRARY,
  applyStyleGuide,
  filterStyleGuides,
  isStyleGuideApplied,
} from "./style-database.ts";

test("every style guide has a unique id, palette swatches, and existing image file", () => {
  assert.equal(STYLE_LIBRARY.length, 10);
  const seen = new Set<string>();
  for (const style of STYLE_LIBRARY) {
    assert.ok(!seen.has(style.id), `duplicate style id ${style.id}`);
    seen.add(style.id);
    assert.ok(style.dominant_palette.length >= 3, `${style.id} needs palette swatches`);
    assert.ok(style.anti_cliche_exclusions.length >= 2, `${style.id} needs exclusions`);
    const diskPath = path.join(process.cwd(), "public", style.image.replace(/^\//, ""));
    assert.ok(fs.existsSync(diskPath), `missing image file for ${style.id}: ${diskPath}`);
  }
});

test("filterStyleGuides filters by category and search query", () => {
  const street = filterStyleGuides("", "street");
  assert.equal(street.length, 3);
  const night = filterStyleGuides("night", "all");
  assert.ok(night.some((item) => item.id === "st-false-color-night"));
  assert.equal(filterStyleGuides("nonexistent-xyz", "all").length, 0);
});

test("applyStyleGuide updates aesthetic_dna, merges exclusions, and matches isStyleGuideApplied", () => {
  const base = emptyDoc();
  base.anti_cliche_exclusions = ["watermark"];
  const target = STYLE_LIBRARY.find((s) => s.id === "st-street-icons")!;
  assert.equal(isStyleGuideApplied(base, target), false);

  const updated = applyStyleGuide(base, target);
  assert.equal(updated.aesthetic_dna.medium_format, target.medium_format);
  assert.equal(updated.aesthetic_dna.optics.physical_optical_imperfections, target.imperfections);
  assert.deepEqual(updated.aesthetic_dna.color_science.dominant_palette, target.dominant_palette);
  assert.equal(updated.aesthetic_dna.color_science.tonal_behavior, target.tonal_behavior);
  assert.ok(updated.anti_cliche_exclusions.includes("watermark"));
  assert.ok(updated.anti_cliche_exclusions.includes("glossy 3D render"));
  assert.equal(isStyleGuideApplied(updated, target), true);
});
