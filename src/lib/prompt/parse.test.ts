import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptyDoc, toJson } from "./model.ts";
import { parsePrompt } from "./parse.ts";

const SAMPLE =
  "a young elven ranger with long silver hair and piercing blue eyes, wearing a weathered crimson cloak over black leather armor, standing on a cliff edge, looking out to sea, stormy ocean background, sea spray in the foreground, cinematic dark fantasy oil painting, dramatic rim lighting, 85mm lens, shallow depth of field, no text, no watermark";

describe("parsePrompt", () => {
  it("clusters a messy image prompt into the workshop schema", () => {
    const result = parsePrompt(SAMPLE);
    const subject = result.doc.subjects[0];
    assert.ok(subject);
    assert.equal(result.mode, "freeform");
    assert.equal(subject.subject_id, "a young elven ranger");
    assert.equal(subject.casting_and_physique.hair_and_grooming, "long silver hair");
    assert.equal(subject.casting_and_physique.demographics_and_features, "piercing blue eyes");
    assert.equal(
      subject.wardrobe_architecture.layering_system.outerwear,
      "weathered crimson cloak, black leather armor",
    );
    assert.equal(subject.wardrobe_architecture.wear_and_patina, "weathered");
    assert.equal(subject.wardrobe_architecture.textiles_and_weight, "leather");
    assert.equal(subject.kinetic_posture, "standing on a cliff edge, looking out to sea");
    assert.equal(result.doc.scene_composition.environmental_staging.location_context, "stormy ocean");
    assert.equal(
      result.doc.scene_composition.framing_doctrine.spatial_planes.foreground_obstruction,
      "sea spray",
    );
    assert.equal(result.doc.aesthetic_dna.medium_format, "cinematic dark fantasy oil painting");
    assert.equal(
      result.doc.aesthetic_dna.lighting_architecture.accent_and_practicals.rim_or_kicker,
      "dramatic rim lighting",
    );
    assert.equal(result.doc.aesthetic_dna.optics.lens_type_and_focal_length, "85mm lens");
    assert.equal(result.doc.aesthetic_dna.optics.aperture_and_dof, "shallow depth of field");
    assert.deepEqual(result.doc.anti_cliche_exclusions, ["no text", "no watermark"]);
  });

  it("sorts tag soup into optics, wardrobe, and exclusions", () => {
    const result = parsePrompt(
      "masterpiece, best quality, 1girl, silver hair, blue eyes, slight smile, black gothic dress, lace gloves, standing, looking at viewer, rose petals foreground, moonlit cathedral background, cinematic lighting, rim light, 85mm, f/1.4, bokeh\nNegative prompt: bad hands, extra fingers, watermark, blurry",
    );
    const subject = result.doc.subjects[0];
    assert.equal(subject?.subject_id, "1girl");
    assert.match(subject?.casting_and_physique.hair_and_grooming ?? "", /silver hair/);
    assert.match(subject?.wardrobe_architecture.layering_system.outerwear ?? "", /dress/);
    assert.match(subject?.wardrobe_architecture.accessories.join(" ") ?? "", /gloves/);
    assert.match(subject?.kinetic_posture ?? "", /standing/);
    assert.match(
      result.doc.scene_composition.framing_doctrine.spatial_planes.foreground_obstruction,
      /rose petals/,
    );
    assert.match(result.doc.scene_composition.environmental_staging.location_context, /cathedral/);
    assert.match(result.doc.aesthetic_dna.lighting_architecture.accent_and_practicals.rim_or_kicker, /rim/);
    assert.match(result.doc.aesthetic_dna.optics.lens_type_and_focal_length, /85mm/);
    assert.match(result.doc.aesthetic_dna.optics.aperture_and_dof, /f\/1\.4/);
    assert.match(result.doc.anti_cliche_exclusions.join(", "), /bad hands/);
  });

  it("round-trips the native schema without reclassifying", () => {
    const doc = emptyDoc();
    doc.aesthetic_dna.medium_format = "woodblock";
    doc.aesthetic_dna.optics.lens_type_and_focal_length = "50mm";
    doc.aesthetic_dna.color_science.dominant_palette = ["#112233", "#AABBCC"];
    doc.scene_composition.framing_doctrine.named_principle = "Worm's-Eye Upward Rake";
    doc.scene_composition.environmental_staging.grounded_props = ["lantern", "rope"];
    doc.subjects[0]!.subject_id = "ranger";
    doc.subjects[0]!.wardrobe_architecture.layering_system.outerwear = "cloak";
    doc.creative_thesis.focal_contradiction = "stillness inside a storm";
    doc.anti_cliche_exclusions = ["beauty lighting", "centered hero smile"];
    const result = parsePrompt(toJson(doc));
    assert.equal(result.mode, "json");
    assert.deepEqual(result.doc, doc);
  });

  it("reads an older labeled prompt into the schema", () => {
    const result = parsePrompt(`Subject: a tired queen
Appearance / Features: silver hair, green eyes
Clothing: black velvet gown
Pose / Action: seated on a throne
Background: candlelit throne room
Foreground: scattered rose petals
Style / Art direction: baroque oil painting
Lighting: warm candlelight
Camera / Composition: 50mm
Extra details / Negative: no modern objects, no text`);
    assert.equal(result.mode, "labeled");
    assert.equal(result.doc.subjects[0]?.subject_id, "a tired queen");
    assert.match(result.doc.subjects[0]?.casting_and_physique.hair_and_grooming ?? "", /silver hair/);
    assert.match(result.doc.subjects[0]?.wardrobe_architecture.layering_system.outerwear ?? "", /gown/);
    assert.equal(result.doc.aesthetic_dna.medium_format, "baroque oil painting");
    assert.match(result.doc.aesthetic_dna.optics.lens_type_and_focal_length, /50mm/);
  });

  it("sorts a prompt string stored beside a negative", () => {
    const result = parsePrompt(
      JSON.stringify({
        prompt: "1girl, silver hair, blue eyes, black dress",
        negative_prompt: "bad hands",
      }),
    );
    assert.equal(result.doc.subjects[0]?.subject_id, "1girl");
    assert.match(result.doc.subjects[0]?.casting_and_physique.hair_and_grooming ?? "", /silver hair/);
    assert.match(result.doc.subjects[0]?.wardrobe_architecture.layering_system.outerwear ?? "", /dress/);
    assert.deepEqual(result.doc.anti_cliche_exclusions, ["bad hands"]);
  });

  it("peels a medium and keeps midjourney flags", () => {
    const result = parsePrompt("portrait of a cat --ar 2:3 --stylize 80 --no text, watermark");
    assert.equal(result.doc.subjects[0]?.subject_id, "a cat");
    assert.match(result.doc.aesthetic_dna.medium_format, /portrait/);
    assert.match(result.doc.aesthetic_dna.medium_format, /stylize 80/);
    assert.equal("aspect_ratio" in result.doc.scene_composition.framing_doctrine, false);
    assert.doesNotMatch(toJson(result.doc), /aspect_ratio/);
    assert.match(result.doc.anti_cliche_exclusions.join(", "), /text/);
  });

  it("strips aspect ratio out of older JSON", () => {
    const raw = JSON.parse(toJson(emptyDoc())) as {
      scene_composition: { framing_doctrine: { aspect_ratio?: string } };
    };
    raw.scene_composition.framing_doctrine.aspect_ratio = "16:9";
    const result = parsePrompt(JSON.stringify(raw));
    assert.equal(result.mode, "json");
    assert.equal("aspect_ratio" in result.doc.scene_composition.framing_doctrine, false);
    assert.doesNotMatch(toJson(result.doc), /aspect_ratio/);
  });

  it("returns an empty document for blank input", () => {
    const result = parsePrompt("   ");
    assert.equal(result.mode, "empty");
    assert.equal(result.doc.subjects[0]?.subject_id, "");
    assert.equal(result.doc.aesthetic_dna.medium_format, "");
  });
});
