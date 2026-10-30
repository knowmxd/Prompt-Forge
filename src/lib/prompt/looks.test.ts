import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyLook, looksFor, LOOKS } from "./looks.ts";
import { emptyDoc } from "./model.ts";

describe("looks", () => {
  it("keeps adult poses off the modeling shelf", () => {
    assert.equal(
      looksFor("pose").some((look) => look.adult),
      false,
    );
    assert.ok(looksFor("adult").length >= 6);
    assert.ok(looksFor("pose").length >= 8);
  });

  it("writes a pose onto the open subject and leaves the face alone", () => {
    const doc = emptyDoc();
    doc.subjects[0]!.casting_and_physique.demographics_and_features = "sharp jaw";
    const look = LOOKS.find((item) => item.id === "hip-cock")!;
    const next = applyLook(doc, look, 0);
    assert.equal(next.subjects[0]!.kinetic_posture, look.posture);
    assert.equal(next.subjects[0]!.casting_and_physique.demographics_and_features, "sharp jaw");
    assert.equal(doc.subjects[0]!.kinetic_posture, "");
  });

  it("writes an angle onto framing and a setting onto the location", () => {
    const doc = emptyDoc();
    const angle = LOOKS.find((item) => item.id === "low-angle")!;
    const place = LOOKS.find((item) => item.id === "warehouse")!;
    const framed = applyLook(doc, angle, 0);
    assert.equal(framed.scene_composition.framing_doctrine.named_principle, angle.principle);
    assert.equal(framed.scene_composition.framing_doctrine.camera_elevation_and_axis, angle.axis);
    const staged = applyLook(framed, place, 0);
    assert.equal(staged.scene_composition.environmental_staging.location_context, place.location);
    assert.deepEqual(staged.scene_composition.environmental_staging.grounded_props, place.props);
    assert.equal(staged.scene_composition.framing_doctrine.named_principle, angle.principle);
  });
});
