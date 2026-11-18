import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { emptyDoc } from "./model.ts";
import {
  CAST_MODELS,
  CAST_CATEGORIES,
  filterCastModels,
  applyCastModel,
  isCastModelApplied,
} from "./cast-database.ts";

describe("cast database", () => {
  it("loads all 27 unique starting models", () => {
    assert.equal(CAST_MODELS.length, 27);
  });

  it("ensures every model has valid casting and image asset on disk", () => {
    for (const model of CAST_MODELS) {
      assert.ok(model.id, "Model must have an ID");
      assert.ok(model.name, "Model must have a Name");
      assert.ok(model.badge, "Model must have a Badge");
      assert.ok(model.casting.demographics_and_features.length > 10, `${model.id} missing demographics`);
      assert.ok(model.casting.skin_and_surface_microdetails.length > 5, `${model.id} missing skin details`);
      assert.ok(model.casting.hair_and_grooming.length > 5, `${model.id} missing hair details`);
      
      // Image must exist in public directory
      const localImagePath = resolve(process.cwd(), "public", model.image.replace(/^\//, ""));
      assert.ok(existsSync(localImagePath), `Image file missing: ${localImagePath}`);
    }
  });

  it("applies model casting, wardrobe, and posture to active subject in PromptDoc", () => {
    const doc = emptyDoc();
    const runner = CAST_MODELS.find((m) => m.id === "cast-flame-runner")!;
    assert.ok(runner);

    const updated = applyCastModel(doc, runner, 0);
    const subject = updated.subjects[0];
    assert.ok(subject);

    assert.equal(subject.subject_id, "Flame-Carved Runner");
    assert.equal(subject.casting_and_physique.demographics_and_features, runner.casting.demographics_and_features);
    assert.equal(subject.casting_and_physique.skin_and_surface_microdetails, runner.casting.skin_and_surface_microdetails);
    assert.equal(subject.casting_and_physique.hair_and_grooming, runner.casting.hair_and_grooming);
    assert.equal(subject.wardrobe_architecture.layering_system.base_layer, runner.wardrobe.layering_system.base_layer);
    assert.equal(subject.wardrobe_architecture.layering_system.mid_layer, runner.wardrobe.layering_system.mid_layer);
    assert.equal(subject.kinetic_posture, runner.kinetic_posture);

    assert.equal(isCastModelApplied(updated, runner, 0), true);
  });

  it("filters models by category and search queries", () => {
    const cyberModels = filterCastModels(CAST_MODELS, "cyber_street", "");
    assert.ok(cyberModels.length > 0);
    assert.ok(cyberModels.every((m) => m.category === "cyber_street"));

    const searchFlame = filterCastModels(CAST_MODELS, "all", "flame");
    assert.equal(searchFlame.length, 1);
    assert.equal(searchFlame[0]?.id, "cast-flame-runner");

    const searchPontiff = filterCastModels(CAST_MODELS, "dark_fantasy", "pontiff");
    assert.equal(searchPontiff.length, 1);
    assert.equal(searchPontiff[0]?.id, "cast-veiled-pontiff");
  });

  it("overwrites stale wardrobe fields and clears pose_reference when switching models", () => {
    const doc = emptyDoc();
    doc.subjects[0]!.wardrobe_architecture.layering_system.outerwear = "heavy winter parka";
    doc.subjects[0]!.wardrobe_architecture.wear_and_patina = "salt stains";
    doc.subjects[0]!.pose_reference = {
      reference_id: "pose_123",
      source: "posemyart",
      source_label: "PoseMy.Art",
      image_url: "/poses/posemyart/posemyart_0001.webp",
      subject_count: 1,
      title: "Standing",
      pose_description: "Standing upright",
      framing: "full-body",
      angle: "front",
      tags: [],
    };

    const runner = CAST_MODELS.find((m) => m.id === "cast-flame-runner")!;
    const switched = applyCastModel(doc, runner, 0);
    assert.equal(switched.subjects[0]?.pose_reference, undefined);
    assert.equal(
      switched.subjects[0]?.wardrobe_architecture.layering_system.outerwear,
      runner.wardrobe.layering_system.outerwear ?? "",
    );
    assert.equal(
      switched.subjects[0]?.wardrobe_architecture.wear_and_patina,
      runner.wardrobe.wear_and_patina ?? "",
    );
  });
});
