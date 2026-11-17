import { setAt, type PoseReference, type PromptDoc } from "./model.ts";

export type PoseCategoryId =
  | "all"
  | "Standing"
  | "Portrait"
  | "Seated"
  | "Action"
  | "Editorial";

export type PoseFramingId = "all" | "full-body" | "medium" | "close-up";

export type PoseManifestItem = {
  id: string;
  imageUrl: string;
  category: Exclude<PoseCategoryId, "all">;
  subCategory: string;
  framing: Exclude<PoseFramingId, "all">;
  tags: string[];
  naturalPrompt: string;
};

export const POSE_CATEGORY_OPTIONS: Array<{
  id: PoseCategoryId;
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "Standing", label: "Standing" },
  { id: "Portrait", label: "Portrait" },
  { id: "Seated", label: "Seated" },
  { id: "Action", label: "Action" },
  { id: "Editorial", label: "Editorial" },
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
    category?: PoseCategoryId;
    framing?: PoseFramingId;
    query?: string;
  },
): PoseManifestItem[] {
  const { category = "all", framing = "all", query = "" } = options;
  const q = query.trim().toLowerCase();

  return items.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (framing !== "all" && item.framing !== framing) return false;
    if (!q) return true;

    return (
      item.subCategory.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.framing.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
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
    category: item.category,
    sub_category: item.subCategory,
    framing: item.framing,
    tags: item.tags,
    ...(item.naturalPrompt ? { pose_description: item.naturalPrompt } : {}),
  };
  const postureFallback =
    item.naturalPrompt.trim() || `${item.category.toLowerCase()} — ${item.subCategory} (${item.framing})`;
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
  category: PoseCategoryId = "all",
  excludeId?: string,
): PoseManifestItem | undefined {
  const pool =
    category === "all" ? items : items.filter((item) => item.category === category);
  if (pool.length === 0) return undefined;
  if (pool.length === 1) return pool[0];
  for (let i = 0; i < 6; i++) {
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    if (candidate && candidate.id !== excludeId) return candidate;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
