import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applySection, captureFields, fieldsHaveContent, normalizeTag } from "./bookmarks.ts";
import { clusterById, emptyDoc } from "./model.ts";

describe("bookmarks", () => {
  it("replaces one section and leaves the rest of the prompt", () => {
    const doc = emptyDoc();
    doc.aesthetic_dna.medium_format = "oil";
    doc.aesthetic_dna.optics.lens_type_and_focal_length = "50mm";
    const next = applySection(
      doc,
      "optics",
      {
        "aesthetic_dna.optics.lens_type_and_focal_length": "85mm",
        "aesthetic_dna.optics.aperture_and_dof": "f/2",
        "aesthetic_dna.optics.physical_optical_imperfections": "",
      },
      0,
    );
    assert.equal(next.aesthetic_dna.optics.lens_type_and_focal_length, "85mm");
    assert.equal(next.aesthetic_dna.optics.aperture_and_dof, "f/2");
    assert.equal(next.aesthetic_dna.optics.physical_optical_imperfections, "");
    assert.equal(next.aesthetic_dna.medium_format, "oil");
    assert.equal(doc.aesthetic_dna.optics.lens_type_and_focal_length, "50mm");
  });

  it("captures the open section, including empty fields", () => {
    const doc = emptyDoc();
    doc.aesthetic_dna.optics.lens_type_and_focal_length = "85mm spherical";
    const fields = captureFields(doc, clusterById("optics"), 0);
    assert.equal(fields["aesthetic_dna.optics.lens_type_and_focal_length"], "85mm spherical");
    assert.equal(fieldsHaveContent(fields), true);
    assert.equal(fieldsHaveContent(captureFields(emptyDoc(), clusterById("optics"), 0)), false);
  });

  it("trims tags and keeps a typed phrase together", () => {
    assert.equal(normalizeTag("  night   interior  "), "night interior");
    assert.equal(normalizeTag("   "), "");
  });
});
