import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { emptyDoc } from "./model.ts";
import {
  BACKGROUND_CATEGORIES,
  BACKGROUND_LIBRARY,
  applyBackgroundItem,
  filterBackgrounds,
  isBackgroundApplied,
} from "./background-database.ts";

test("every background has a unique id, complete staging copy, and existing webp image", () => {
  assert.equal(BACKGROUND_LIBRARY.length, 139);
  const seenIds = new Set<string>();
  const seenImages = new Set<string>();

  for (const item of BACKGROUND_LIBRARY) {
    assert.ok(!seenIds.has(item.id), `duplicate background id ${item.id}`);
    seenIds.add(item.id);
    assert.ok(!seenImages.has(item.image), `duplicate background image ${item.image}`);
    seenImages.add(item.image);

    assert.ok(item.name.trim().length > 0, `${item.id} needs a name`);
    assert.ok(item.location.trim().length >= 20, `${item.id} needs rich location_context`);
    assert.ok(item.atmosphere.trim().length >= 15, `${item.id} needs atmosphere_and_air_density`);
    assert.ok(item.props.length >= 2, `${item.id} needs at least 2 grounded props`);

    const diskPath = path.join(process.cwd(), "public", item.image.replace(/^\//, ""));
    assert.ok(fs.existsSync(diskPath), `missing image file for ${item.id}: ${diskPath}`);
  }
});

test("BACKGROUND_CATEGORIES counts sum to 139", () => {
  const nonAll = BACKGROUND_CATEGORIES.filter((c) => c.id !== "all");
  const total = nonAll.reduce(
    (sum, c) => sum + BACKGROUND_LIBRARY.filter((b) => b.category === c.id).length,
    0,
  );
  assert.equal(total, 139);
});

test("filterBackgrounds filters by category and search query", () => {
  const urban = filterBackgrounds("", "urban");
  assert.equal(urban.length, 36);

  const ruins = filterBackgrounds("", "ruins");
  assert.equal(ruins.length, 28);

  const laundromat = filterBackgrounds("laundromat", "all");
  assert.ok(laundromat.some((item) => item.id === "bg_01_laundromat_night_glow"));

  assert.equal(filterBackgrounds("nonexistent-xyz-999", "all").length, 0);
});

test("applyBackgroundItem updates environmental_staging and matches isBackgroundApplied", () => {
  const base = emptyDoc();
  const target = BACKGROUND_LIBRARY[0];
  const other = BACKGROUND_LIBRARY[1];

  assert.equal(isBackgroundApplied(base, target), false);

  const updated = applyBackgroundItem(base, target);
  assert.equal(updated.scene_composition.environmental_staging.location_context, target.location);
  assert.equal(updated.scene_composition.environmental_staging.atmosphere_and_air_density, target.atmosphere);
  assert.deepEqual(updated.scene_composition.environmental_staging.grounded_props, target.props);
  assert.equal(isBackgroundApplied(updated, target), true);
  assert.equal(isBackgroundApplied(updated, other), false);

  // Mutating returned props array shouldn't mutate the database item
  updated.scene_composition.environmental_staging.grounded_props.push("extra prop");
  assert.ok(!target.props.includes("extra prop"));
});
