import { coerceDoc, coerceSubject, docFromFlat } from "./assemble.ts";
import {
  CLUSTER_IDS,
  coerceFields,
  type Bookmark,
  type ClusterId,
  type Draft,
  type PromptDoc,
  type SavedCharacter,
  type SavedPrompt,
  type Snippet,
  type SnippetCategory,
} from "./model.ts";

const DRAFT_KEY = "prompt-forge:draft:v2";
const LIBRARY_KEY = "prompt-forge:library:v2";
const SNIPPET_KEY = "prompt-forge:snippets:v2";
const CHARACTER_KEY = "prompt-forge:characters:v1";
const BOOKMARK_KEY = "prompt-forge:bookmarks:v1";

const LEGACY_CLUSTER: Record<string, ClusterId> = {
  subject: "casting",
  appearance: "casting",
  clothing: "wardrobe",
  pose: "posture",
  background: "environment",
  foreground: "planes",
  style: "medium",
  lighting: "key",
  camera: "optics",
  extra: "exclusions",
};

function read(key: string): unknown {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function isCluster(value: unknown): value is ClusterId {
  return typeof value === "string" && (CLUSTER_IDS as readonly string[]).includes(value);
}

function docFromUnknown(value: unknown): PromptDoc {
  if (value && typeof value === "object" && "subject" in value && !("aesthetic_dna" in value)) {
    return docFromFlat(coerceFields(value));
  }
  return coerceDoc(value);
}

export function draftFromUnknown(value: unknown): Draft | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<Draft> & { fields?: unknown };
  if (typeof record.source !== "string" || typeof record.title !== "string") return null;
  const doc = record.doc ? docFromUnknown(record.doc) : docFromUnknown(record.fields);
  return {
    title: record.title,
    source: record.source,
    doc,
    cluster: isCluster(record.cluster) ? record.cluster : "casting",
    subjectIndex: typeof record.subjectIndex === "number" ? record.subjectIndex : 0,
    currentId: typeof record.currentId === "string" ? record.currentId : null,
  };
}

export function loadDraft(): Draft | null {
  const current = read(DRAFT_KEY);
  const legacy = read("prompt-forge:draft:v1");
  return draftFromUnknown(current ?? legacy);
}

export function saveDraft(draft: Draft) {
  write(DRAFT_KEY, draft);
}

export function libraryFromUnknown(value: unknown): SavedPrompt[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<SavedPrompt> & { fields?: unknown };
    if (typeof record.id !== "string" || typeof record.title !== "string") return [];
    return [
      {
        id: record.id,
        title: record.title,
        source: typeof record.source === "string" ? record.source : "",
        doc: record.doc ? docFromUnknown(record.doc) : docFromUnknown(record.fields),
        createdAt: typeof record.createdAt === "number" ? record.createdAt : Date.now(),
        updatedAt: typeof record.updatedAt === "number" ? record.updatedAt : Date.now(),
      },
    ];
  });
}

export function loadLibrary(): SavedPrompt[] {
  const current = read(LIBRARY_KEY);
  const legacy = read("prompt-forge:library:v1");
  return libraryFromUnknown(Array.isArray(current) ? current : legacy);
}

export function saveLibrary(items: SavedPrompt[]) {
  write(LIBRARY_KEY, items);
}

function snippetCategory(value: unknown): SnippetCategory | null {
  if (value === "note") return "note";
  if (isCluster(value)) return value;
  if (typeof value === "string" && LEGACY_CLUSTER[value]) return LEGACY_CLUSTER[value];
  return null;
}

export function snippetsFromUnknown(value: unknown): Snippet[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<Snippet>;
    const category = snippetCategory(record.category);
    if (typeof record.id !== "string" || typeof record.title !== "string") return [];
    if (typeof record.body !== "string" || !category) return [];
    return [{
      id: record.id,
      title: record.title,
      body: record.body,
      category,
      custom: true,
      ...(typeof record.target === "string" ? { target: record.target } : {}),
    }];
  });
}

export function loadSnippets(): Snippet[] {
  const current = read(SNIPPET_KEY);
  const legacy = read("prompt-forge:snippets:v1");
  return snippetsFromUnknown(Array.isArray(current) ? current : legacy);
}

export function saveSnippets(items: Snippet[]) {
  write(
    SNIPPET_KEY,
    items.filter((item) => item.custom),
  );
}

export function charactersFromUnknown(value: unknown): SavedCharacter[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<SavedCharacter>;
    if (typeof record.id !== "string" || typeof record.name !== "string") return [];
    return [
      {
        id: record.id,
        name: record.name,
        subject: coerceSubject(record.subject),
        createdAt: typeof record.createdAt === "number" ? record.createdAt : Date.now(),
      },
    ];
  });
}

export function loadCharacters(): SavedCharacter[] {
  return charactersFromUnknown(read(CHARACTER_KEY));
}

export function saveCharacters(items: SavedCharacter[]) {
  write(CHARACTER_KEY, items);
}

function coerceFieldMap(value: unknown): Record<string, string | string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const fields: Record<string, string | string[]> = {};
  for (const [key, item] of Object.entries(value)) {
    if (typeof item === "string") fields[key] = item;
    else if (Array.isArray(item) && item.every((entry) => typeof entry === "string")) fields[key] = [...item];
  }
  return fields;
}

export function bookmarksFromUnknown(value: unknown): Bookmark[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<Bookmark>;
    if (typeof record.id !== "string" || typeof record.name !== "string") return [];
    if (record.kind !== "subject" && record.kind !== "section") return [];
    if (!isCluster(record.cluster)) return [];
    const tags = Array.isArray(record.tags)
      ? record.tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
      : [];
    const subject = record.kind === "subject" ? coerceSubject(record.subject) : null;
    return [
      {
        id: record.id,
        name: record.name,
        tags,
        cluster: record.cluster,
        kind: record.kind,
        subject,
        fields: record.kind === "section" ? coerceFieldMap(record.fields) : {},
        hasImage: record.hasImage === true,
        createdAt: typeof record.createdAt === "number" ? record.createdAt : Date.now(),
      },
    ];
  });
}

export function loadBookmarks(): Bookmark[] {
  return bookmarksFromUnknown(read(BOOKMARK_KEY));
}

export function saveBookmarks(items: Bookmark[]) {
  write(BOOKMARK_KEY, items);
}
