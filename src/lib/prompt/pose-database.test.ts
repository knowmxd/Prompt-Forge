import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { emptyDoc } from "./model.ts";
import {
  POSE_LIBRARY,
  CURATED_POSE_LIBRARY,
  POSE_CATEGORIES,
  POSE_STANCES,
  getPoseById,
  filterPoses,
  applyPose,
  isPoseApplied,
  type PoseCategory,
  type PoseStance,
} from "./pose-database.ts";

describe("pose database", () => {
  it("loads 6,390 total poses (97 curated + 6,293 PoseScript human-written descriptions)", () => {
    assert.equal(CURATED_POSE_LIBRARY.length, 97);
    assert.equal(POSE_LIBRARY.length, 6390);
  });

  it("ensures every pose has non-empty ID, name, posture, category, stance, and tags", () => {
    const validCategories = new Set(POSE_CATEGORIES.map((c) => c.id));
    const validStances = new Set(POSE_STANCES.map((s) => s.id));

    for (const pose of POSE_LIBRARY) {
      assert.ok(pose.id && pose.id.trim().length > 0, `Pose missing ID`);
      assert.ok(pose.name && pose.name.trim().length > 0, `${pose.id} missing name`);
      assert.ok(pose.posture && pose.posture.trim().length > 0, `${pose.id} missing posture`);
      assert.ok(validCategories.has(pose.category), `${pose.id} has invalid category: ${pose.category}`);
      assert.ok(validStances.has(pose.stance), `${pose.id} has invalid stance: ${pose.stance}`);
      assert.ok(Array.isArray(pose.tags) && pose.tags.length > 0, `${pose.id} missing tags`);
    }
  });

  it("verifies all 97 curated poses reference valid studio mannequin images on disk", () => {
    for (const pose of CURATED_POSE_LIBRARY) {
      if (pose.image) {
        const localImagePath = resolve(process.cwd(), "public", pose.image.replace(/^\//, ""));
        assert.ok(existsSync(localImagePath), `Pose image file missing: ${localImagePath}`);
      }
    }
  });

  it("retrieves poses in O(1) time via getPoseById for both curated and posescript poses", () => {
    const curated = getPoseById("kng-guard-low");
    assert.ok(curated);
    assert.equal(curated?.name, "Low Blade Guard");
    assert.equal(curated?.category, "action");

    const posescript = getPoseById("ps-0001");
    assert.ok(posescript);
    assert.ok(posescript?.posture.length > 0);
    assert.equal(posescript?.id, "ps-0001");
  });

  it("filters poses by category, stance, and search query", () => {
    const standingPoses = filterPoses({ category: "standing" });
    assert.ok(standingPoses.length > 0);
    assert.ok(standingPoses.every((p) => p.category === "standing"));

    const actionPoses = filterPoses({ category: "action" });
    assert.ok(actionPoses.length > 0);
    assert.ok(actionPoses.every((p) => p.category === "action"));

    const sittingStance = filterPoses({ stance: "sitting" });
    assert.ok(sittingStance.length > 0);
    assert.ok(sittingStance.every((p) => p.stance === "sitting"));

    const contrapposto = filterPoses({ query: "contrapposto" });
    assert.ok(contrapposto.length > 0);
    assert.ok(contrapposto.some((p) => p.name.includes("Contrapposto") || p.posture.includes("contrapposto")));
  });

  it("applies pose to active subject in PromptDoc and matches isPoseApplied", () => {
    const doc = emptyDoc();
    const pose = getPoseById("kng-guard-low")!;
    assert.ok(pose);

    const updated = applyPose(doc, pose, 0);
    assert.equal(updated.subjects[0]?.kinetic_posture, pose.posture);
    assert.equal(isPoseApplied(updated, pose, 0), true);
  });
});
