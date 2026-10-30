export type Extra =
  | { t: "sun"; x: number; y: number }
  | { t: "window"; x: number; y: number }
  | { t: "floor" }
  | { t: "cam"; x: number; y: number; rot: number }
  | { t: "block"; x: number; y: number; w: number; h: number }
  | { t: "horizon" };

export type Art = {
  head: [number, number, number];
  limbs: [number, number, number, number, number?][];
  extras?: Extra[];
};

type Spec = {
  x?: number;
  y?: number;
  torso?: number;
  scale?: number;
  lArm: number;
  lFore: number;
  rArm: number;
  rFore: number;
  lLeg: number;
  lShin: number;
  rLeg: number;
  rShin: number;
  extras?: Extra[];
};

function polar(x: number, y: number, deg: number, len: number): [number, number] {
  const r = (deg * Math.PI) / 180;
  return [x + Math.cos(r) * len, y + Math.sin(r) * len];
}

export function mannequin(spec: Spec): Art {
  const scale = spec.scale ?? 1;
  const px = spec.x ?? 60;
  const py = spec.y ?? 98;
  const torso = spec.torso ?? -90;
  const chest = polar(px, py, torso, 32 * scale);
  const neck = polar(chest[0], chest[1], torso, 8 * scale);
  const head = polar(neck[0], neck[1], torso, 12 * scale);
  const left = polar(chest[0], chest[1], torso + 90, 15 * scale);
  const right = polar(chest[0], chest[1], torso - 90, 15 * scale);
  const lHip = polar(px, py, torso + 90, 8 * scale);
  const rHip = polar(px, py, torso - 90, 8 * scale);
  const lElbow = polar(left[0], left[1], spec.lArm, 20 * scale);
  const lHand = polar(lElbow[0], lElbow[1], spec.lFore, 18 * scale);
  const rElbow = polar(right[0], right[1], spec.rArm, 20 * scale);
  const rHand = polar(rElbow[0], rElbow[1], spec.rFore, 18 * scale);
  const lKnee = polar(lHip[0], lHip[1], spec.lLeg, 24 * scale);
  const lFoot = polar(lKnee[0], lKnee[1], spec.lShin, 22 * scale);
  const rKnee = polar(rHip[0], rHip[1], spec.rLeg, 24 * scale);
  const rFoot = polar(rKnee[0], rKnee[1], spec.rShin, 22 * scale);
  const bone = (a: [number, number], b: [number, number], w: number): Art["limbs"][number] => [
    Math.round(a[0]),
    Math.round(a[1]),
    Math.round(b[0]),
    Math.round(b[1]),
    w,
  ];
  return {
    head: [Math.round(head[0]), Math.round(head[1]), Math.round(11 * scale)],
    extras: spec.extras,
    limbs: [
      bone(neck, chest, 6),
      bone(left, right, 8),
      bone(left, lElbow, 7),
      bone(lElbow, lHand, 6),
      bone(right, rElbow, 7),
      bone(rElbow, rHand, 6),
      bone(chest, [px, py], 11),
      bone(lHip, rHip, 8),
      bone(lHip, lKnee, 8),
      bone(lKnee, lFoot, 7),
      bone(rHip, rKnee, 8),
      bone(rKnee, rFoot, 7),
    ],
  };
}

const floor: Extra = { t: "floor" };
const horizon: Extra = { t: "horizon" };

const hang = { lArm: 100, lFore: 95, rArm: 80, rFore: 85, lLeg: 100, lShin: 95, rLeg: 80, rShin: 85 };

export const FIGURES = {
  "hip-cock": mannequin({ ...hang, lArm: 20, lFore: 110, lLeg: 110, lShin: 70, rLeg: 75, rShin: 80, extras: [floor] }),
  pockets: mannequin({ ...hang, lArm: 70, lFore: 120, rArm: 110, rFore: 60, extras: [floor] }),
  crossed: mannequin({ ...hang, lArm: 40, lFore: 10, rArm: 140, rFore: 170, extras: [floor] }),
  stride: mannequin({ ...hang, lArm: 50, lFore: 70, rArm: 130, rFore: 110, lLeg: 55, lShin: 70, rLeg: 125, rShin: 110, extras: [floor] }),
  "crossed-sit": mannequin({
    x: 58,
    y: 92,
    lArm: 150,
    lFore: 170,
    rArm: 40,
    rFore: 80,
    lLeg: 20,
    lShin: 10,
    rLeg: 40,
    rShin: 15,
    extras: [{ t: "block", x: 30, y: 108, w: 62, h: 8 }],
  }),
  stool: mannequin({
    x: 64,
    y: 100,
    torso: -70,
    lArm: 60,
    lFore: 90,
    rArm: 120,
    rFore: 90,
    lLeg: 80,
    lShin: 85,
    rLeg: 100,
    rShin: 95,
    extras: [{ t: "block", x: 48, y: 112, w: 28, h: 24 }],
  }),
  shoulder: mannequin({ ...hang, torso: -70, extras: [floor] }),
  hair: mannequin({ ...hang, lArm: -50, lFore: -90, rArm: -130, rFore: -90, extras: [floor] }),
  kneel: mannequin({
    ...hang,
    y: 108,
    lArm: 70,
    lFore: 110,
    rArm: 110,
    rFore: 70,
    lLeg: 80,
    lShin: 10,
    rLeg: 100,
    rShin: 170,
    extras: [floor],
  }),
  recline: mannequin({
    x: 78,
    y: 88,
    torso: 180,
    lArm: 80,
    lFore: 40,
    rArm: 110,
    rFore: 140,
    lLeg: 150,
    lShin: 190,
    rLeg: 200,
    rShin: 160,
    extras: [horizon],
  }),
  wall: mannequin({ ...hang, x: 70, torso: -75, lArm: 40, lFore: 10, rArm: 100, rFore: 130, extras: [{ t: "block", x: 98, y: 18, w: 8, h: 130 }, floor] }),
  crouch: mannequin({
    x: 62,
    y: 108,
    torso: -80,
    lArm: 50,
    lFore: 100,
    rArm: 130,
    rFore: 90,
    lLeg: 70,
    lShin: 90,
    rLeg: 30,
    rShin: 110,
    extras: [floor],
  }),
  arched: mannequin({ ...hang, torso: -60, lArm: -40, lFore: -80, rArm: -140, rFore: -100, extras: [floor] }),
  "open-seat": mannequin({
    x: 60,
    y: 96,
    torso: -70,
    lArm: 150,
    lFore: 170,
    rArm: 30,
    rFore: 10,
    lLeg: 45,
    lShin: 15,
    rLeg: 135,
    rShin: 165,
    extras: [horizon],
  }),
  "all-fours": mannequin({
    x: 78,
    y: 86,
    torso: 180,
    lArm: 80,
    lFore: 90,
    rArm: 100,
    rFore: 90,
    lLeg: 80,
    lShin: 90,
    rLeg: 100,
    rShin: 90,
    extras: [horizon],
  }),
  "lying-back": mannequin({
    x: 86,
    y: 90,
    torso: 180,
    lArm: -40,
    lFore: -10,
    rArm: 140,
    rFore: 160,
    lLeg: 50,
    lShin: 110,
    rLeg: 130,
    rShin: 70,
    extras: [horizon],
  }),
  folded: mannequin({
    x: 78,
    y: 90,
    torso: -20,
    lArm: 80,
    lFore: 100,
    rArm: 100,
    rFore: 80,
    lLeg: 100,
    lShin: 90,
    rLeg: 80,
    rShin: 85,
    extras: [floor],
  }),
  "knee-up": mannequin({
    x: 70,
    y: 96,
    torso: 170,
    lArm: 90,
    lFore: 110,
    rArm: 140,
    rFore: 170,
    lLeg: 40,
    lShin: 100,
    rLeg: 10,
    rShin: 0,
    extras: [horizon],
  }),
  "kneel-arch": mannequin({
    y: 108,
    torso: -60,
    lArm: 60,
    lFore: 110,
    rArm: 120,
    rFore: 70,
    lLeg: 75,
    lShin: 5,
    rLeg: 105,
    rShin: 175,
    extras: [floor],
  }),
  "leg-up": mannequin({ ...hang, lArm: 40, lFore: 80, rArm: 100, rFore: 80, lLeg: 20, lShin: 80, extras: [floor] }),
  "eye-level": mannequin({ ...hang, extras: [{ t: "cam", x: 14, y: 70, rot: 0 }, floor] }),
  "low-angle": mannequin({ ...hang, y: 104, scale: 1.15, extras: [{ t: "cam", x: 12, y: 120, rot: -40 }, floor] }),
  "high-angle": mannequin({ ...hang, y: 112, scale: 0.72, extras: [{ t: "cam", x: 16, y: 16, rot: 40 }] }),
  "three-quarter": mannequin({ ...hang, torso: -75, extras: [{ t: "cam", x: 14, y: 64, rot: -18 }, floor] }),
  profile: mannequin({
    x: 66,
    lArm: 90,
    lFore: 90,
    rArm: 90,
    rFore: 90,
    lLeg: 85,
    lShin: 88,
    rLeg: 95,
    rShin: 92,
    extras: [{ t: "cam", x: 12, y: 64, rot: 0 }, floor],
  }),
  behind: mannequin({ ...hang, extras: [{ t: "cam", x: 14, y: 78, rot: 0 }, floor] }),
  "window-light": mannequin({ ...hang, extras: [{ t: "window", x: 12, y: 28 }, floor] }),
  "hard-side": mannequin({ ...hang, extras: [{ t: "sun", x: 18, y: 40 }, floor] }),
  rim: mannequin({ ...hang, extras: [{ t: "sun", x: 100, y: 24 }, floor] }),
  overhead: mannequin({ ...hang, extras: [{ t: "sun", x: 60, y: 14 }, floor] }),
  golden: mannequin({ ...hang, extras: [{ t: "sun", x: 18, y: 112 }, horizon] }),
  "low-key": mannequin({ ...hang, extras: [{ t: "sun", x: 60, y: 14 }] }),
  studio: mannequin({
    ...hang,
    y: 104,
    scale: 0.82,
    extras: [{ t: "block", x: 14, y: 22, w: 92, h: 112 }, floor],
  }),
  sidewalk: mannequin({
    ...hang,
    y: 108,
    scale: 0.7,
    extras: [
      { t: "block", x: 8, y: 28, w: 24, h: 86 },
      { t: "block", x: 88, y: 36, w: 24, h: 78 },
      horizon,
    ],
  }),
  "window-room": mannequin({
    ...hang,
    x: 72,
    y: 104,
    scale: 0.78,
    extras: [{ t: "window", x: 14, y: 26 }, floor],
  }),
  warehouse: mannequin({
    ...hang,
    y: 112,
    scale: 0.62,
    extras: [
      { t: "block", x: 18, y: 24, w: 6, h: 100 },
      { t: "block", x: 96, y: 24, w: 6, h: 100 },
      { t: "block", x: 12, y: 20, w: 96, h: 6 },
      floor,
    ],
  }),
  field: mannequin({ ...hang, y: 112, scale: 0.7, extras: [horizon, { t: "sun", x: 98, y: 36 }] }),
  "night-street": mannequin({
    ...hang,
    y: 110,
    scale: 0.68,
    extras: [
      { t: "sun", x: 24, y: 24 },
      { t: "sun", x: 98, y: 32 },
      { t: "block", x: 8, y: 40, w: 18, h: 70 },
      { t: "block", x: 94, y: 46, w: 18, h: 64 },
      floor,
    ],
  }),
} satisfies Record<string, Art>;
