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
    category: "Standing",
    subCategory: "looking over shoulder",
    framing: "full-body",
    tags: ["solo", "standing", "looking back", "full-body"],
    naturalPrompt: "",
  },
  {
    id: "pose_2501",
    imageUrl: "/poses/pose_2501.webp",
    category: "Seated",
    subCategory: "sitting on bench",
    framing: "medium",
    tags: ["solo", "seated", "bench", "medium"],
    naturalPrompt: "",
  },
];

describe("pose manifest filtering and PromptDoc wiring", () => {
  it("filters by category, framing, and search query", () => {
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { category: "Standing" }).length, 1);
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { category: "Seated" }).length, 1);
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { framing: "medium" })[0]?.id, "pose_2501");
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { query: "shoulder" })[0]?.id, "pose_0001");
  });

  it("populates pose_reference JSON fields and fallback kinetic_posture cleanly when naturalPrompt is blank", () => {
    const doc = emptyDoc();
    const updated = applyPoseManifestItem(doc, SAMPLE_ITEMS[0]!, 0);

    assert.equal(
      updated.subjects[0]?.kinetic_posture,
      "standing — looking over shoulder (full-body)",
    );
    assert.deepEqual(updated.subjects[0]?.pose_reference, {
      reference_id: "pose_0001",
      image_url: "/poses/pose_0001.webp",
      category: "Standing",
      sub_category: "looking over shoulder",
      framing: "full-body",
      tags: ["solo", "standing", "looking back", "full-body"],
    });
    assert.equal(isPoseManifestApplied(updated, SAMPLE_ITEMS[0]!, 0), true);
    assert.ok(toPromptLine(updated).includes("looking over shoulder"));
    assert.ok(toJson(updated).includes('"reference_id": "pose_0001"'));

    const cleared = clearSubjectPose(updated, 0);
    assert.equal(cleared.subjects[0]?.kinetic_posture, "");
    assert.equal(cleared.subjects[0]?.pose_reference, undefined);
    assert.equal(isPoseManifestApplied(cleared, SAMPLE_ITEMS[0]!, 0), false);
  });

  it("respects category filter when picking a random pose", () => {
    for (let i = 0; i < 10; i++) {
      const picked = pickRandomPoseManifestItem(SAMPLE_ITEMS, "Seated");
      assert.equal(picked?.category, "Seated");
    }
  });

  it("verifies 5,000 generated solo-pose manifest entries and local WebP assets on disk when present", () => {
    const manifestPath = resolve(process.cwd(), "public/data/poses.json");
    if (!existsSync(manifestPath)) {
      return;
    }
    const items = JSON.parse(readFileSync(manifestPath, "utf-8")) as PoseManifestItem[];
    assert.equal(items.length, 5000);

    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
      assert.ok(item.id.length > 0);
      assert.ok(item.subCategory.length > 0);
      assert.equal(item.naturalPrompt, "");
      assert.ok(Array.isArray(item.tags) && item.tags.length > 0);
      assert.ok(["full-body", "medium", "close-up"].includes(item.framing));
      const diskPath = resolve(process.cwd(), "public", item.imageUrl.replace(/^\/+/, ""));
      assert.ok(existsSync(diskPath), `Missing WebP asset on disk: ${diskPath}`);
    }

    assert.equal(counts.Standing, 1250);
    assert.equal(counts.Portrait, 1250);
    assert.equal(counts.Seated, 900);
    assert.equal(counts.Action, 900);
    assert.equal(counts.Editorial, 700);
  });
});

