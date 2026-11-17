import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { emptyDoc, toJson, toPromptLine } from "./model.ts";
import {
  applyPoseManifestItem,
  clearSubjectPose,
  filterPoseManifest,
  isPoseManifestApplied,
  pickRandomPoseManifestItem,
  type PoseManifestItem,
} from "./pose-manifest.ts";

const SAMPLE_ITEMS: PoseManifestItem[] = [
  {
    id: "booru3d_0001",
    dataset: "booru3d",
    datasetLabel: "3D Shaded Mannequins",
    imageUrl: "/poses/booru3d/booru3d_0001.webp",
    title: "Standing Looking Back Raised",
    naturalPrompt: "Single subject standing tall, looking back over shoulder with right hand raised.",
    tags: ["standing", "looking back", "hands"],
    cameraAngle: "full-body",
  },
  {
    id: "densepose_0001",
    dataset: "densepose",
    datasetLabel: "DensePose Body Maps",
    imageUrl: "/poses/densepose/densepose_0001.webp",
    title: "Sitting Bench Stretching Arms",
    naturalPrompt: "Two individuals sitting on a wooden bench with arms stretched upward.",
    tags: ["sitting", "duo", "hands"],
    cameraAngle: "eye-level",
  },
];

describe("pose manifest filtering and PromptDoc wiring", () => {
  it("filters by dataset, tag pill, and search query", () => {
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { dataset: "booru3d" }).length, 1);
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { dataset: "densepose" }).length, 1);
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { tag: "sitting" })[0]?.id, "densepose_0001");
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { query: "shoulder" })[0]?.id, "booru3d_0001");
  });

  it("populates pose_reference JSON fields and natural-language prompt output cleanly", () => {
    const doc = emptyDoc();
    const updated = applyPoseManifestItem(doc, SAMPLE_ITEMS[0]!, 0);

    assert.equal(updated.subjects[0]?.kinetic_posture, SAMPLE_ITEMS[0]!.naturalPrompt);
    assert.deepEqual(updated.subjects[0]?.pose_reference, {
      reference_id: "booru3d_0001",
      pose_description: SAMPLE_ITEMS[0]!.naturalPrompt,
      camera_angle: "full-body",
      tags: ["standing", "looking back", "hands"],
      dataset: "booru3d",
    });
    assert.equal(isPoseManifestApplied(updated, SAMPLE_ITEMS[0]!, 0), true);
    assert.ok(toPromptLine(updated).includes("looking back over shoulder"));
    assert.ok(toJson(updated).includes('"reference_id": "booru3d_0001"'));

    const cleared = clearSubjectPose(updated, 0);
    assert.equal(cleared.subjects[0]?.kinetic_posture, "");
    assert.equal(cleared.subjects[0]?.pose_reference, undefined);
    assert.equal(isPoseManifestApplied(cleared, SAMPLE_ITEMS[0]!, 0), false);
  });

  it("respects dataset filter when picking a random pose", () => {
    for (let i = 0; i < 10; i++) {
      const picked = pickRandomPoseManifestItem(SAMPLE_ITEMS, "densepose");
      assert.equal(picked?.dataset, "densepose");
    }
  });

  it("verifies 10,000 generated manifest entries and local WebP assets on disk when present", () => {
    const manifestPath = resolve(process.cwd(), "public/data/poses.json");
    if (!existsSync(manifestPath)) {
      return;
    }
    const items = JSON.parse(readFileSync(manifestPath, "utf-8")) as PoseManifestItem[];
    assert.equal(items.length, 10000);
    const booruCount = items.filter((p) => p.dataset === "booru3d").length;
    const denseCount = items.filter((p) => p.dataset === "densepose").length;
    assert.equal(booruCount, 5000);
    assert.equal(denseCount, 5000);

    for (const item of items) {
      assert.ok(item.id.length > 0);
      assert.ok(item.title.length > 0);
      assert.ok(item.naturalPrompt.length > 0);
      assert.ok(Array.isArray(item.tags) && item.tags.length > 0);
      assert.ok(["eye-level", "low-angle", "high-angle", "full-body", "close-up"].includes(item.cameraAngle));
      const diskPath = resolve(process.cwd(), "public", item.imageUrl.replace(/^\/+/, ""));
      assert.ok(existsSync(diskPath), `Missing WebP asset on disk: ${diskPath}`);
    }
  });
});

