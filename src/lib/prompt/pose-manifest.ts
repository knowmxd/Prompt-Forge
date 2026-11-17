import { setAt, type PoseReference, type PromptDoc } from "./model.ts";

export type PoseDatasetId = "all" | "booru3d" | "densepose";

export type PoseCameraAngle =
  | "eye-level"
  | "low-angle"
  | "high-angle"
  | "full-body"
  | "close-up";

export type PoseManifestItem = {
  id: string;
  dataset: "booru3d" | "densepose";
  datasetLabel: "3D Shaded Mannequins" | "DensePose Body Maps";
  imageUrl: string;
  title: string;
  naturalPrompt: string;
  tags: string[];
  cameraAngle: PoseCameraAngle;
};

export const DATASET_FILTER_OPTIONS: Array<{
  id: PoseDatasetId;
  label: string;
  shortLabel: string;
}> = [
  { id: "all", label: "All Datasets (10,000)", shortLabel: "All (10k)" },
  { id: "booru3d", label: "3D Shaded Mannequins (5,000)", shortLabel: "3D Mannequins" },
  { id: "densepose", label: "DensePose Body Maps (5,000)", shortLabel: "DensePose" },
];

export const POSE_TAG_PILLS: Array<{ id: string; label: string }> = [
  { id: "all", label: "All" },
  { id: "standing", label: "Standing" },
  { id: "sitting", label: "Sitting" },
  { id: "action", label: "Action" },
  { id: "portrait", label: "Portrait" },
  { id: "hands", label: "Hands" },
  { id: "kneeling", label: "Kneeling" },
  { id: "crouching", label: "Crouching" },
  { id: "reclining", label: "Reclining" },
  { id: "looking back", label: "Looking Back" },
  { id: "full-body", label: "Full-Body" },
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
    dataset?: PoseDatasetId;
    tag?: string;
    query?: string;
  },
): PoseManifestItem[] {
  const { dataset = "all", tag = "all", query = "" } = options;
  const q = query.trim().toLowerCase();
  const normalizedTag = tag.trim().toLowerCase();

  return items.filter((item) => {
    if (dataset !== "all" && item.dataset !== dataset) return false;

    if (normalizedTag && normalizedTag !== "all") {
      const hasTag = item.tags.some((t) => t.toLowerCase() === normalizedTag);
      const matchesAngle = item.cameraAngle.toLowerCase() === normalizedTag;
      const matchesText =
        normalizedTag === "portrait"
          ? hasTag || item.cameraAngle === "close-up" || item.naturalPrompt.toLowerCase().includes("portrait")
          : hasTag || matchesAngle;
      if (!matchesText) return false;
    }

    if (!q) return true;

    return (
      item.title.toLowerCase().includes(q) ||
      item.naturalPrompt.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.cameraAngle.toLowerCase().includes(q) ||
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
    pose_description: item.naturalPrompt,
    camera_angle: item.cameraAngle,
    tags: item.tags,
    dataset: item.dataset,
  };
  const next = setAt(doc, `subjects.${subjectIndex}.kinetic_posture`, item.naturalPrompt);
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
  if (subject.pose_reference?.reference_id === item.id) return true;
  return (
    subject.kinetic_posture.trim().length > 0 &&
    subject.kinetic_posture.trim().toLowerCase() === item.naturalPrompt.trim().toLowerCase()
  );
}

export function pickRandomPoseManifestItem(
  items: PoseManifestItem[],
  dataset: PoseDatasetId = "all",
  excludeId?: string,
): PoseManifestItem | undefined {
  const pool = dataset === "all" ? items : items.filter((item) => item.dataset === dataset);
  if (pool.length === 0) return undefined;
  if (pool.length === 1) return pool[0];
  let candidate = pool[Math.floor(Math.random() * pool.length)];
  if (excludeId && candidate?.id === excludeId) {
    candidate = pool[(pool.indexOf(candidate) + 1) % pool.length];
  }
  return candidate;
}
