import { setAt, type PoseReference, type PromptDoc } from "./model.ts";

export type PoseStyleCategoryId =
  | "all"
  | "Streetwear"
  | "Editorial Lookbook"
  | "Cinematic Poster"
  | "Expressive Signature";

export type PoseFramingId = "all" | "full-body" | "medium" | "close-up";

export type PoseSubjectTypeId = "all" | "solo" | "duo";

export type PoseAngleId = "eye-level" | "three-quarter" | "profile" | "low-angle";

export type PoseManifestItem = {
  id: string;
  imageUrl: string;
  framing: Exclude<PoseFramingId, "all">;
  subjectType: Exclude<PoseSubjectTypeId, "all">;
  styleCategory: Exclude<PoseStyleCategoryId, "all">;
  angle: PoseAngleId;
  tags: string[];
  rawCaption: string;
  naturalPrompt: string;
};

export const POSE_STYLE_OPTIONS: Array<{
  id: PoseStyleCategoryId;
  label: string;
}> = [
  { id: "all", label: "All Styles" },
  { id: "Streetwear", label: "Streetwear" },
  { id: "Editorial Lookbook", label: "Editorial Lookbook" },
  { id: "Cinematic Poster", label: "Cinematic Poster" },
  { id: "Expressive Signature", label: "Expressive Signature" },
];

export const POSE_FRAMING_OPTIONS: Array<{
  id: PoseFramingId;
  label: string;
}> = [
  { id: "all", label: "All Framing" },
  { id: "full-body", label: "Full-Body" },
  { id: "medium", label: "Medium" },
  { id: "close-up", label: "Close-Up" },
];

export const POSE_SUBJECT_OPTIONS: Array<{
  id: PoseSubjectTypeId;
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "solo", label: "Solo" },
  { id: "duo", label: "Duo" },
];

let cachedManifest: PoseManifestItem[] | null = null;
let pendingManifestPromise: Promise<PoseManifestItem[]> | null = null;

export async function loadPoseManifest(): Promise<PoseManifestItem[]> {
  if (cachedManifest) return cachedManifest;
  if (pendingManifestPromise) return pendingManifestPromise;

  pendingManifestPromise = fetch("/data/poses.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load pose manifest (${res.status})`);
      }
      return res.json() as Promise<PoseManifestItem[]>;
    })
    .then((items) => {
      cachedManifest = Array.isArray(items) ? items : [];
      return cachedManifest;
    })
    .catch((err) => {
      pendingManifestPromise = null;
      throw err;
    });

  return pendingManifestPromise;
}

export function getCachedPoseManifest(): PoseManifestItem[] | null {
  return cachedManifest;
}

export function filterPoseManifest(
  items: PoseManifestItem[],
  options: {
    styleCategory?: PoseStyleCategoryId;
    framing?: PoseFramingId;
    subjectType?: PoseSubjectTypeId;
    query?: string;
  },
): PoseManifestItem[] {
  const {
    styleCategory = "all",
    framing = "all",
    subjectType = "all",
    query = "",
  } = options;
  const q = query.trim().toLowerCase();

  return items.filter((item) => {
    if (styleCategory !== "all" && item.styleCategory !== styleCategory) return false;
    if (framing !== "all" && item.framing !== framing) return false;
    if (subjectType !== "all" && item.subjectType !== subjectType) return false;
    if (!q) return true;

    return (
      item.styleCategory.toLowerCase().includes(q) ||
      item.framing.toLowerCase().includes(q) ||
      item.subjectType.toLowerCase().includes(q) ||
      item.angle.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.rawCaption.toLowerCase().includes(q) ||
      item.naturalPrompt.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function applyPoseManifestItem(
  doc: PromptDoc,
  item: PoseManifestItem,
  subjectIndex: number,
): PromptDoc {
  const poseRef: PoseReference = {
    reference_id: item.id,
    image_url: item.imageUrl,
    style_category: item.styleCategory,
    framing: item.framing,
    subject_type: item.subjectType,
    angle: item.angle,
    tags: item.tags,
    ...(item.rawCaption ? { raw_caption: item.rawCaption } : {}),
    ...(item.naturalPrompt ? { pose_description: item.naturalPrompt } : {}),
  };
  const postureFallback =
    item.naturalPrompt.trim() ||
    `${item.subjectType} ${item.framing} ${item.styleCategory.toLowerCase()} (${item.angle})`;
  const next = setAt(doc, `subjects.${subjectIndex}.kinetic_posture`, postureFallback);
  const subjects = next.subjects.map((subj, idx) =>
    idx === subjectIndex ? { ...subj, pose_reference: poseRef } : subj,
  );
  return { ...next, subjects };
}

export function clearSubjectPose(doc: PromptDoc, subjectIndex: number): PromptDoc {
  let next = setAt(doc, `subjects.${subjectIndex}.kinetic_posture`, "");
  if (next.subjects[subjectIndex]?.pose_reference !== undefined) {
    const subjects = next.subjects.map((subj, idx) => {
      if (idx !== subjectIndex) return subj;
      const { pose_reference: _removed, ...rest } = subj;
      return rest;
    });
    next = { ...next, subjects };
  }
  return next;
}

export function isPoseManifestApplied(
  doc: PromptDoc,
  item: PoseManifestItem,
  subjectIndex: number,
): boolean {
  const subject = doc.subjects[subjectIndex];
  if (!subject) return false;
  return subject.pose_reference?.reference_id === item.id;
}

export function pickRandomPoseManifestItem(
  items: PoseManifestItem[],
  filters: {
    styleCategory?: PoseStyleCategoryId;
    framing?: PoseFramingId;
    subjectType?: PoseSubjectTypeId;
  } = {},
  excludeId?: string,
): PoseManifestItem | undefined {
  const pool = filterPoseManifest(items, filters);
  if (pool.length === 0) return undefined;
  if (pool.length === 1) return pool[0];
  for (let i = 0; i < 6; i++) {
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    if (candidate && candidate.id !== excludeId) return candidate;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
