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
    id: "posemyart_0001",
    source: "posemyart",
    sourceLabel: "PoseMy.Art",
    imageUrl: "/poses/posemyart/posemyart_0001.webp",
    subjectCount: 1,
    title: "Confident knee sitting pose",
    naturalPrompt: "Female is sitting on her knees, holding her hip with her left hand",
    framing: "full-body",
    angle: "front",
    tags: ["knee sitting", "sitting", "hand"],
  },
  {
    id: "opensegra_0001",
    source: "opensegra",
    sourceLabel: "OpenSegra",
    imageUrl: "/poses/opensegra/opensegra_0001.webp",
    subjectCount: 2,
    title: "Back-to-back duo (Diagonal)",
    naturalPrompt: "Two figures leaning back-to-back in a balanced editorial duo stance.",
    framing: "medium",
    angle: "diagonal",
    tags: ["duo", "diagonal", "standing"],
  },
  {
    id: "posemaniacs_0001",
    source: "posemaniacs",
    sourceLabel: "Posemaniacs",
    imageUrl: "/poses/posemaniacs/posemaniacs_0001_primary.webp",
    variants: {
      primary: "/poses/posemaniacs/posemaniacs_0001_primary.webp",
      secondary: "/poses/posemaniacs/posemaniacs_0001_secondary.webp",
    },
    subjectCount: 1,
    title: "Fashion Walking Standing",
    naturalPrompt: "Single figure in an editorial fashion stance, mid-stride walking motion.",
    framing: "full-body",
    angle: "diagonal",
    tags: ["standing", "walking", "fashion"],
  },
];

describe("pose manifest filtering and PromptDoc wiring", () => {
  it("filters by source, framing, multiMode (paired / duo), and search query", () => {
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { source: "posemyart" }).length, 1);
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { multiMode: "duo" })[0]?.id, "opensegra_0001");
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { multiMode: "paired" })[0]?.id, "posemaniacs_0001");
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { framing: "medium" })[0]?.id, "opensegra_0001");
    assert.equal(filterPoseManifest(SAMPLE_ITEMS, { query: "fashion" })[0]?.id, "posemaniacs_0001");
  });

  it("populates pose_reference JSON fields and switches to secondary variant when requested", () => {
    const doc = emptyDoc();
    const updatedPrimary = applyPoseManifestItem(doc, SAMPLE_ITEMS[2]!, 0);

    assert.equal(
      updatedPrimary.subjects[0]?.kinetic_posture,
      "Single figure in an editorial fashion stance, mid-stride walking motion.",
    );
    assert.deepEqual(updatedPrimary.subjects[0]?.pose_reference, {
      reference_id: "posemaniacs_0001",
      source: "posemaniacs",
      source_label: "Posemaniacs",
      image_url: "/poses/posemaniacs/posemaniacs_0001_primary.webp",
      variants: {
        primary: "/poses/posemaniacs/posemaniacs_0001_primary.webp",
        secondary: "/poses/posemaniacs/posemaniacs_0001_secondary.webp",
      },
      subject_count: 1,
      title: "Fashion Walking Standing",
      pose_description: "Single figure in an editorial fashion stance, mid-stride walking motion.",
      framing: "full-body",
      angle: "diagonal",
      tags: ["standing", "walking", "fashion"],
    });
    assert.equal(isPoseManifestApplied(updatedPrimary, SAMPLE_ITEMS[2]!, 0), true);
    assert.ok(toPromptLine(updatedPrimary).includes("mid-stride walking"));
    assert.ok(toJson(updatedPrimary).includes('"reference_id": "posemaniacs_0001"'));

    const updatedSecondary = applyPoseManifestItem(doc, SAMPLE_ITEMS[2]!, 0, {
      useSecondaryVariant: true,
    });
    assert.equal(
      updatedSecondary.subjects[0]?.pose_reference?.image_url,
      "/poses/posemaniacs/posemaniacs_0001_secondary.webp",
    );

    const cleared = clearSubjectPose(updatedPrimary, 0);
    assert.equal(cleared.subjects[0]?.kinetic_posture, "");
    assert.equal(cleared.subjects[0]?.pose_reference, undefined);
    assert.equal(isPoseManifestApplied(cleared, SAMPLE_ITEMS[2]!, 0), false);
  });

  it("respects filters when picking a random pose", () => {
    for (let i = 0; i < 10; i++) {
      const picked = pickRandomPoseManifestItem(SAMPLE_ITEMS, { multiMode: "duo" });
      assert.equal(picked?.id, "opensegra_0001");
    }
  });

  it("verifies generated 3-source manifest entries and local WebP assets on disk when present", () => {
    const manifestPath = resolve(process.cwd(), "public/data/poses.json");
    if (!existsSync(manifestPath)) {
      return;
    }
    const items = JSON.parse(readFileSync(manifestPath, "utf-8")) as PoseManifestItem[];
    assert.ok(items.length >= 4000, `Expected >= 4000 poses, found ${items.length}`);

    const sourceCounts: Record<string, number> = {};
    const seenIds = new Set<string>();
    for (const item of items) {
      assert.ok(item.id.length > 0 && !seenIds.has(item.id), `Duplicate or empty id: ${item.id}`);
      seenIds.add(item.id);
      sourceCounts[item.source] = (sourceCounts[item.source] ?? 0) + 1;
      assert.ok(["posemyart", "opensegra", "posemaniacs"].includes(item.source));
      assert.ok(item.title.length > 0);
      assert.ok(item.naturalPrompt.length > 0);
      assert.ok(item.subjectCount >= 1);
      assert.ok(["full-body", "medium", "close-up"].includes(item.framing));
      assert.ok(["front", "side", "diagonal", "above", "below"].includes(item.angle));
      assert.ok(Array.isArray(item.tags));
      assert.equal(/&(?:#\d+|amp|lt|gt|quot|apos);/i.test(item.naturalPrompt + item.title), false, `HTML entity in ${item.id}`);
      if (item.subjectCount === 1) {
        assert.equal(
          /\b(male|female|woman|man|girl|boy|him|her|she|he|his|hers)\b/i.test(item.naturalPrompt),
          false,
          `Solo gender leak in ${item.id}: ${item.naturalPrompt}`,
        );
      }
      if (item.tags.includes("hand-standing")) {
        assert.equal(item.framing, "full-body", `Handstand must be full-body: ${item.id}`);
      }

      const diskPath = resolve(process.cwd(), "public", item.imageUrl.replace(/^\/+/, ""));
      assert.ok(existsSync(diskPath), `Missing WebP asset on disk: ${diskPath}`);
      if (item.variants?.secondary) {
        const altPath = resolve(process.cwd(), "public", item.variants.secondary.replace(/^\/+/, ""));
        assert.ok(existsSync(altPath), `Missing secondary WebP asset on disk: ${altPath}`);
      }
    }

    assert.equal(sourceCounts.posemyart, 2000);
    assert.equal(sourceCounts.opensegra, 1439);
    assert.ok((sourceCounts.posemaniacs ?? 0) >= 600);
  });
});
