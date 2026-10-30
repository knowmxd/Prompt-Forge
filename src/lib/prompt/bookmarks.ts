import { clusterById, getAt, resolvePath, setAt, type Cluster, type ClusterId, type PromptDoc } from "./model.ts";

export function normalizeTag(raw: string) {
  return raw.trim().replace(/\s+/g, " ").slice(0, 32);
}

export function captureFields(doc: PromptDoc, cluster: Cluster, slot: number): Record<string, string | string[]> {
  const fields: Record<string, string | string[]> = {};
  for (const field of cluster.fields) {
    const value = getAt(doc, resolvePath(field.path, slot));
    fields[field.path] = Array.isArray(value) ? [...value] : value;
  }
  return fields;
}

export function fieldsHaveContent(fields: Record<string, string | string[]>) {
  return Object.values(fields).some((value) =>
    Array.isArray(value) ? value.some((item) => item.trim()) : value.trim().length > 0,
  );
}

export function applySection(
  doc: PromptDoc,
  cluster: ClusterId,
  fields: Record<string, string | string[]>,
  slot: number,
): PromptDoc {
  let next = doc;
  for (const field of clusterById(cluster).fields) {
    const value = fields[field.path];
    if (value === undefined) continue;
    next = setAt(next, resolvePath(field.path, slot), Array.isArray(value) ? [...value] : value);
  }
  return next;
}

export function sectionBlurb(fields: Record<string, string | string[]>) {
  const bits: string[] = [];
  for (const value of Object.values(fields)) {
    if (Array.isArray(value)) bits.push(...value.map((item) => item.trim()).filter(Boolean));
    else if (value.trim()) bits.push(value.trim());
  }
  return bits.slice(0, 2).join(" · ");
}
