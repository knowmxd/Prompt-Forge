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
  it("loads 1,041 total poses (97 curated + 944 Shisei CC0 gray clay mannequin poses)", () => {
    assert.equal(CURATED_POSE_LIBRARY.length, 97);
    assert.equal(POSE_LIBRARY.length, 1041);
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

  it("verifies every pose in POSE_LIBRARY references a valid studio mannequin image on disk", () => {
    for (const pose of POSE_LIBRARY) {
      assert.ok(pose.image && pose.image.trim().length > 0, `${pose.id} missing image`);
      const localImagePath = resolve(process.cwd(), "public", pose.image.replace(/^\//, ""));
      assert.ok(existsSync(localImagePath), `Pose image file missing: ${localImagePath}`);
    }
  });

  it("retrieves poses in O(1) time via getPoseById for both curated and Shisei poses", () => {
    const curated = getPoseById("kng-guard-low");
    assert.ok(curated);
    assert.equal(curated?.name, "Low Blade Guard");
    assert.equal(curated?.category, "action");

    const shisei = getPoseById("shisei-P001-front");
    assert.ok(shisei);
    assert.ok(shisei?.posture.length > 0);
    assert.equal(shisei?.id, "shisei-P001-front");
    assert.equal(shisei?.image, "/poses/shisei/std_P001_front.webp");
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
