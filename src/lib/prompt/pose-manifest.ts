import { setAt, type PoseReference, type PromptDoc } from "./model.ts";

export type PoseSourceId = "all" | "posemyart" | "opensegra" | "posemaniacs";

export type PoseFramingId = "all" | "full-body" | "medium" | "close-up";

export type PoseAngleId = "front" | "side" | "diagonal" | "above" | "below";

export type PoseMultiSubjectFilter = "all" | "paired" | "duo";

export type PoseManifestItem = {
  id: string;
  source: Exclude<PoseSourceId, "all">;
  sourceLabel: string;
  imageUrl: string;
  variants?: {
    primary: string;
    secondary?: string;
  };
  subjectCount: number;
  title: string;
  naturalPrompt: string;
  framing: Exclude<PoseFramingId, "all">;
  angle: PoseAngleId;
  tags: string[];
};

export const POSE_SOURCE_OPTIONS: Array<{
  id: PoseSourceId;
  label: string;
}> = [
  { id: "all", label: "All Libraries" },
  { id: "posemyart", label: "PoseMy.Art" },
  { id: "opensegra", label: "OpenSegra" },
  { id: "posemaniacs", label: "Posemaniacs" },
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

export function resolvePoseDisplayImage(
  item: PoseManifestItem,
  useSecondaryVariant = false,
): string {
  if (useSecondaryVariant && item.variants?.secondary) {
    return item.variants.secondary;
  }
  return item.variants?.primary || item.imageUrl;
}

export function filterPoseManifest(
  items: PoseManifestItem[],
  options: {
    source?: PoseSourceId;
    framing?: PoseFramingId;
    multiMode?: PoseMultiSubjectFilter;
    query?: string;
  },
): PoseManifestItem[] {
  const {
    source = "all",
    framing = "all",
    multiMode = "all",
    query = "",
  } = options;
  const q = query.trim().toLowerCase();

  return items.filter((item) => {
    if (source !== "all" && item.source !== source) return false;
    if (framing !== "all" && item.framing !== framing) return false;
    if (multiMode === "paired" && !item.variants?.secondary) return false;
    if (multiMode === "duo" && item.subjectCount < 2) return false;
    if (!q) return true;

    return (
      item.title.toLowerCase().includes(q) ||
      item.naturalPrompt.toLowerCase().includes(q) ||
      item.sourceLabel.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q) ||
      item.framing.toLowerCase().includes(q) ||
      item.angle.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function applyPoseManifestItem(
  doc: PromptDoc,
  item: PoseManifestItem,
  subjectIndex: number,
  options: { useSecondaryVariant?: boolean } = {},
): PromptDoc {
  const useSecondary = Boolean(options.useSecondaryVariant && item.variants?.secondary);
  const chosenImage = resolvePoseDisplayImage(item, useSecondary);
  const poseRef: PoseReference = {
    reference_id: item.id,
    source: item.source,
    source_label: item.sourceLabel,
    image_url: chosenImage,
    ...(item.variants ? { variants: item.variants } : {}),
    subject_count: item.subjectCount,
    title: item.title,
    pose_description: item.naturalPrompt,
    framing: item.framing,
    angle: item.angle,
    tags: item.tags,
  };
  const postureText =
    item.naturalPrompt.trim() ||
    `${item.title} (${item.framing}, ${item.angle} angle)`;
  const next = setAt(doc, `subjects.${subjectIndex}.kinetic_posture`, postureText);
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
    source?: PoseSourceId;
    framing?: PoseFramingId;
    multiMode?: PoseMultiSubjectFilter;
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
