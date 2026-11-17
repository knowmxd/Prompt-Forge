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
    id: "pose_0001",
    imageUrl: "/poses/pose_0001.webp",
    framing: "full-body",
    subjectType: "solo",
    styleCategory: "Streetwear",
    angle: "three-quarter",
    tags: ["solo", "full-body", "streetwear", "three-quarter"],
    rawCaption: "PoseDreamer (laion) full-body solo three-quarter pose",
    naturalPrompt: "",
  },
  {
    id: "pose_4001",
    imageUrl: "/poses/pose_4001.webp",
    framing: "medium",
    subjectType: "duo",
    styleCategory: "Editorial Lookbook",
    angle: "eye-level",
    tags: ["duo", "medium", "editorial", "eye-level"],
    rawCaption: "2girls, editorial fashion duo standing side by side",
    naturalPrompt: "",
  },
];

describe("pose manifest filtering and PromptDoc wiring", () => {
  it("filters by styleCategory, framing, subjectType, and search query", () => {
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { styleCategory: "Streetwear" }).length, 1);
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { subjectType: "duo" })[0]?.id, "pose_4001");
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { framing: "medium" })[0]?.id, "pose_4001");
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { query: "three-quarter" })[0]?.id, "pose_0001");
  });

  it("populates pose_reference JSON fields and fallback kinetic_posture cleanly when naturalPrompt is blank", () => {
    const doc = emptyDoc();
    const updated = applyPoseManifestItem(doc, SAMPLE_ITEMS[0]!, 0);

    assert.equal(
      updated.subjects[0]?.kinetic_posture,
      "solo full-body streetwear (three-quarter)",
    );
    assert.deepEqual(updated.subjects[0]?.pose_reference, {
      reference_id: "pose_0001",
      image_url: "/poses/pose_0001.webp",
      style_category: "Streetwear",
      framing: "full-body",
      subject_type: "solo",
      angle: "three-quarter",
      tags: ["solo", "full-body", "streetwear", "three-quarter"],
      raw_caption: "PoseDreamer (laion) full-body solo three-quarter pose",
    });
    assert.equal(isPoseManifestApplied(updated, SAMPLE_ITEMS[0]!, 0), true);
    assert.ok(toPromptLine(updated).includes("streetwear"));
    assert.ok(toJson(updated).includes('"reference_id": "pose_0001"'));

    const cleared = clearSubjectPose(updated, 0);
    assert.equal(cleared.subjects[0]?.kinetic_posture, "");
    assert.equal(cleared.subjects[0]?.pose_reference, undefined);
    assert.equal(isPoseManifestApplied(cleared, SAMPLE_ITEMS[0]!, 0), false);
  });

  it("respects filters when picking a random pose", () => {
    for (let i = 0; i < 10; i++) {
      const picked = pickRandomPoseManifestItem(SAMPLE_ITEMS, { subjectType: "duo" });
      assert.equal(picked?.subjectType, "duo");
    }
  });

  it("verifies 5,000 generated PoseDreamer + Duo manifest entries and local WebP assets on disk when present", () => {
    const manifestPath = resolve(process.cwd(), "public/data/poses.json");
    if (!existsSync(manifestPath)) {
      return;
    }
    const items = JSON.parse(readFileSync(manifestPath, "utf-8")) as PoseManifestItem[];
    assert.equal(items.length, 5000);

    const subjectCounts: Record<string, number> = {};
    const framingCounts: Record<string, number> = {};
    for (const item of items) {
      subjectCounts[item.subjectType] = (subjectCounts[item.subjectType] ?? 0) + 1;
      framingCounts[item.framing] = (framingCounts[item.framing] ?? 0) + 1;
      assert.ok(item.id.length > 0);
      assert.equal(item.naturalPrompt, "");
      assert.ok(Array.isArray(item.tags) && item.tags.length > 0);
      assert.ok(["full-body", "medium", "close-up"].includes(item.framing));
      assert.ok(["solo", "duo"].includes(item.subjectType));
      assert.ok(
        ["Streetwear", "Editorial Lookbook", "Cinematic Poster", "Expressive Signature"].includes(
          item.styleCategory,
        ),
      );
      assert.ok(["eye-level", "three-quarter", "profile", "low-angle"].includes(item.angle));
      const diskPath = resolve(process.cwd(), "public", item.imageUrl.replace(/^\/+/, ""));
      assert.ok(existsSync(diskPath), `Missing WebP asset on disk: ${diskPath}`);
    }

    assert.equal(subjectCounts.solo, 4000);
    assert.equal(subjectCounts.duo, 1000);
    assert.equal(framingCounts["full-body"], 2500);
    assert.equal(framingCounts.medium, 1500);
    assert.equal(framingCounts["close-up"], 1000);
  });
});
