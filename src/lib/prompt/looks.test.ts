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

  it("applies camera angles and optics with lens and dof parameters", () => {
    const doc = emptyDoc();
    const wormsEye = LOOKS.find((item) => item.id === "ang-worms-eye")!;
    assert.ok(wormsEye);
    const framed = applyLook(doc, wormsEye, 0);
    assert.equal(framed.scene_composition.framing_doctrine.named_principle, wormsEye.principle);
    assert.equal(framed.scene_composition.framing_doctrine.camera_elevation_and_axis, wormsEye.axis);
    assert.equal(framed.aesthetic_dna.optics.lens_type_and_focal_length, wormsEye.lens);
    assert.equal(framed.aesthetic_dna.optics.aperture_and_dof, wormsEye.dof);

    const angles = looksFor("angle");
    assert.ok(angles.length >= 20, `Expected at least 20 camera angles, got ${angles.length}`);
  });

  it("applies lighting setups with style, fixtures, and shadow parameters", () => {
    const doc = emptyDoc();
    const rembrandt = LOOKS.find((item) => item.id === "lt-rembrandt")!;
    assert.ok(rembrandt);
    const lit = applyLook(doc, rembrandt, 0);
    assert.equal(lit.aesthetic_dna.lighting_architecture.lighting_style, rembrandt.style);
    assert.equal(lit.aesthetic_dna.lighting_architecture.key_source.fixture_or_origin, rembrandt.fixture);
    assert.equal(lit.aesthetic_dna.lighting_architecture.key_source.angle_and_elevation, rembrandt.lightAngle);
    assert.equal(lit.aesthetic_dna.lighting_architecture.fill_and_negative_space.shadow_depth, rembrandt.shadow);

    const lights = looksFor("light");
    assert.ok(lights.length >= 20, `Expected at least 20 lighting setups, got ${lights.length}`);
  });
});
