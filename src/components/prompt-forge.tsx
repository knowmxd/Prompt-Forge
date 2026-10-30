import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { deleteBookmarkImage, loadBookmarkImage, loadCloud, saveBookmarkImage, saveCloudBlob } from "@/lib/prompt/cloud";
import {
  Bookmark as BookmarkIcon,
  BookmarkPlus,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FilePlus,
  Flame,
  ImagePlus,
  Library,
  Maximize2,
  Minimize2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { applySection, captureFields, fieldsHaveContent, normalizeTag, sectionBlurb } from "@/lib/prompt/bookmarks";
import { applyLook, lookIsApplied, looksFor, LOOK_FILTERS, type Look, type LookFilter } from "@/lib/prompt/looks";
import { PoseArt } from "@/components/pose-art";
import { deleteImage, fileToThumbnail, loadImage, saveImage } from "@/lib/prompt/images";
import { parsePrompt } from "@/lib/prompt/parse";
import { SEED_SNIPPETS } from "@/lib/prompt/snippets";
import {
  loadBookmarks,
  loadCharacters,
  loadDraft,
  loadLibrary,
  loadSnippets,
  saveBookmarks,
  saveCharacters,
  saveDraft,
  saveLibrary,
  saveSnippets,
} from "@/lib/prompt/storage";
import {
  CLUSTER_GROUPS,
  CLUSTERS,
  clusterById,
  clusterHasContent,
  countFilled,
  emptyDoc,
  emptySubject,
  getAt,
  resolvePath,
  setAt,
  titleFromDoc,
  toJson,
  toPromptLine,
  type Bookmark,
  type ClusterId,
  type Draft,
  type FieldDef,
  type PromptDoc,
  type SavedCharacter,
  type SavedPrompt,
  type Snippet,
  type SnippetCategory,
  type Subject,
} from "@/lib/prompt/model";

const SAMPLE_TITLE = "Cliffside ranger";
const SAMPLE_SOURCE =
  "a young elven ranger with long silver hair and piercing blue eyes, wearing a weathered crimson cloak over black leather armor, standing on a cliff edge, looking out to sea, stormy ocean background, sea spray in the foreground, cinematic dark fantasy oil painting, dramatic rim lighting, 85mm lens, shallow depth of field, no text, no watermark";

const SAMPLE_DOC = parsePrompt(SAMPLE_SOURCE).doc;

const FILTERS: Array<{ id: "all" | SnippetCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "medium", label: "Medium" },
  { id: "optics", label: "Optics" },
  { id: "key", label: "Light" },
  { id: "accent", label: "Accents" },
  { id: "framing", label: "Frame" },
  { id: "wardrobe", label: "Wardrobe" },
  { id: "exclusions", label: "Exclude" },
  { id: "note", label: "Notes" },
];

type Pane = "source" | "forge" | "assets";
type Copied = "json" | "line" | null;
type JsonMode = "peek" | "full" | "hidden";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function narrow() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

function formatWhen(ts: number) {
  const minutes = Math.round((Date.now() - ts) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 14) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}

function appendText(current: string, piece: string) {
  const next = piece.trim();
  if (!next) return current;
  if (!current.trim()) return next;
  if (current.toLowerCase().includes(next.toLowerCase())) return current;
  return `${current.replace(/,\s*$/, "")}, ${next}`;
}

function placeSnippet(
  doc: PromptDoc,
  snippet: Snippet,
  slot: number,
  focusPath: string,
  activeId: ClusterId,
): { doc: PromptDoc; focus: string; cluster: ClusterId } {
  const targetCluster = snippet.category === "note" ? clusterById(activeId) : clusterById(snippet.category);
  const field = snippet.target
    ? targetCluster.fields.find((item) => item.path === snippet.target)
    : snippet.category === "note"
      ? (targetCluster.fields.find((item) => resolvePath(item.path, slot) === focusPath) ??
        targetCluster.fields.find((item) => item.kind !== "palette"))
      : targetCluster.fields.find((item) => item.kind !== "palette");
  const chosen = field ?? targetCluster.fields[0];
  if (!chosen) return { doc, focus: focusPath, cluster: activeId };
  const resolved = resolvePath(chosen.path, slot);
  const current = getAt(doc, resolved);
  let nextDoc = doc;
  if (chosen.kind === "list" || chosen.kind === "palette" || Array.isArray(current)) {
    const incoming = snippet.body
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    const base = Array.isArray(current) ? current.filter((item) => item.trim()) : [];
    const next = [...base];
    for (const line of incoming) {
      if (!next.some((item) => item.toLowerCase() === line.toLowerCase())) next.push(line);
    }
    nextDoc = setAt(doc, resolved, next);
  } else {
    const text = typeof current === "string" ? current : "";
    if (!text.toLowerCase().includes(snippet.body.trim().toLowerCase())) {
      nextDoc = setAt(doc, resolved, appendText(text, snippet.body));
    }
  }
  return {
    doc: nextDoc,
    focus: resolved,
    cluster: snippet.category === "note" ? activeId : snippet.category,
  };
}

function safeHex(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#C46A3A";
}

function subjectFilled(subject: Subject) {
  const probe = emptyDoc();
  probe.subjects = [subject];
  return countFilled(probe) > 0;
}

function characterName(subject: Subject, fallback: string) {
  const named = subject.subject_id.trim();
  if (named) return named.length > 48 ? `${named.slice(0, 48).trim()}…` : named;
  const feature = subject.casting_and_physique.demographics_and_features.trim().split(",")[0]?.trim() ?? "";
  if (feature) return feature.length > 48 ? `${feature.slice(0, 48).trim()}…` : feature;
  return fallback;
}

function characterBlurb(subject: Subject) {
  return [
    subject.casting_and_physique.hair_and_grooming,
    subject.casting_and_physique.demographics_and_features,
    subject.wardrobe_architecture.layering_system.outerwear,
    subject.kinetic_posture,
  ]
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" · ");
}

function blobToBase64(blob: Blob) {
  return blob.arrayBuffer().then((buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  });
}

function base64ToBlob(data: string) {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: "image/jpeg" });
}

export function PromptForge() {
  const [title, setTitle] = useState(SAMPLE_TITLE);
  const [source, setSource] = useState(SAMPLE_SOURCE);
  const [doc, setDoc] = useState<PromptDoc>(SAMPLE_DOC);
  const [cluster, setCluster] = useState<ClusterId>("casting");
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [focusPath, setFocusPath] = useState("subjects.0.subject_id");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pane, setPane] = useState<Pane>("forge");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [library, setLibrary] = useState<SavedPrompt[]>([]);
  const [customSnippets, setCustomSnippets] = useState<Snippet[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [status, setStatus] = useState("Sample loaded. Jump to a cluster, or paste over the source.");
  const [copied, setCopied] = useState<Copied>(null);
  const [jsonMode, setJsonMode] = useState<JsonMode>("peek");
  const [confirmNew, setConfirmNew] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [untouched, setUntouched] = useState(true);
  const [ready, setReady] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftCategory, setDraftCategory] = useState<SnippetCategory>("medium");
  const [characters, setCharacters] = useState<SavedCharacter[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [assetFilter, setAssetFilter] = useState("all");
  const [assetShelf, setAssetShelf] = useState<"saved" | "looks">("saved");
  const [lookFilter, setLookFilter] = useState<LookFilter>("pose");
  const [picked, setPicked] = useState<string[]>([]);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [bookmarkName, setBookmarkName] = useState("");
  const [bookmarkTags, setBookmarkTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [accountReady, setAccountReady] = useState(false);
  const imagesSynced = useRef(false);
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id ?? null;

  const slot = Math.min(subjectIndex, Math.max(doc.subjects.length - 1, 0));
  const active = clusterById(cluster);

  useEffect(() => {
    if (isPending) return;
    let cancelled = false;
    setAccountReady(false);
    imagesSynced.current = false;
    async function hydrate() {
      const applyLocal = () => {
        const draft = loadDraft();
        if (draft) {
          setTitle(draft.title);
          setSource(draft.source);
          setDoc(draft.doc);
          setCluster(draft.cluster);
          setSubjectIndex(draft.subjectIndex);
          setCurrentId(draft.currentId);
          setUntouched(false);
          setStatus(userId ? "Copied this phone's copy into your account." : "Draft restored.");
        }
        setLibrary(loadLibrary());
        setCustomSnippets(loadSnippets());
        setCharacters(loadCharacters());
        setBookmarks(loadBookmarks());
      };
      if (!userId) {
        applyLocal();
        if (!cancelled) setReady(true);
        return;
      }
      try {
        const snap = await loadCloud();
        if (cancelled) return;
        const empty = !snap.draft && snap.library.length === 0 && snap.snippets.length === 0 && snap.characters.length === 0 && snap.bookmarks.length === 0;
        if (empty) {
          applyLocal();
        } else {
          if (snap.draft) {
            setTitle(snap.draft.title);
            setSource(snap.draft.source);
            setDoc(snap.draft.doc);
            setCluster(snap.draft.cluster);
            setSubjectIndex(snap.draft.subjectIndex);
            setCurrentId(snap.draft.currentId);
            setUntouched(false);
          }
          setLibrary(snap.library);
          setCustomSnippets(snap.snippets);
          setCharacters(snap.characters);
          setBookmarks(snap.bookmarks);
          setStatus("Loaded from your account.");
        }
        setAccountReady(true);
      } catch {
        applyLocal();
        setStatus("Couldn't reach your account. Using this phone's copy.");
      }
      if (!cancelled) setReady(true);
    }
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [isPending, userId]);

  useEffect(() => {
    if (!ready) return;
    const draft: Draft = { title, source, doc, cluster, subjectIndex: slot, currentId };
    saveDraft(draft);
    if (!accountReady) return;
    const handle = window.setTimeout(() => {
      void saveCloudBlob({ data: { kind: "draft", payload: draft } }).catch(() => undefined);
    }, 600);
    return () => window.clearTimeout(handle);
  }, [ready, accountReady, title, source, doc, cluster, slot, currentId]);

  useEffect(() => {
    if (!accountReady) return;
    const handle = window.setTimeout(() => {
      void saveCloudBlob({ data: { kind: "library", payload: library } }).catch(() => undefined);
      void saveCloudBlob({ data: { kind: "snippets", payload: customSnippets } }).catch(() => undefined);
      void saveCloudBlob({ data: { kind: "characters", payload: characters } }).catch(() => undefined);
      void saveCloudBlob({ data: { kind: "bookmarks", payload: bookmarks } }).catch(() => undefined);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [accountReady, library, customSnippets, characters, bookmarks]);

  useEffect(() => {
    if (!accountReady || imagesSynced.current) return;
    imagesSynced.current = true;
    for (const bookmark of bookmarks) {
      if (!bookmark.hasImage) continue;
      void loadImage(bookmark.id)
        .then(async (blob) => {
          if (!blob) return;
          await saveBookmarkImage({ data: { id: bookmark.id, data: await blobToBase64(blob) } });
        })
        .catch(() => undefined);
    }
  }, [accountReady, bookmarks]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        runParse();
      }
      if (event.key === "Escape") {
        setBookmarkOpen(false);
        setLibraryOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const json = useMemo(() => toJson(doc), [doc]);
  const filled = countFilled(doc);
  const snippets = useMemo(() => {
    const all = [...customSnippets, ...SEED_SNIPPETS];
    if (filter === "all") return all;
    return all.filter((item) => item.category === filter);
  }, [customSnippets, filter]);

  const knownTags = useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of bookmarks) {
      for (const tag of item.tags) {
        const key = tag.toLowerCase();
        if (!seen.has(key)) seen.set(key, tag);
      }
    }
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [bookmarks]);

  const shownBookmarks = useMemo(() => {
    if (assetFilter === "all") return bookmarks;
    if (assetFilter === "pieces") return [];
    return bookmarks.filter((item) => item.tags.some((tag) => tag.toLowerCase() === assetFilter));
  }, [assetFilter, bookmarks]);

  function openCluster(id: ClusterId, index = slot) {
    const next = clusterById(id);
    setCluster(id);
    const path = resolvePath(next.fields[0]?.path ?? "", index);
    if (path) setFocusPath(path);
  }

  function runParse() {
    if (!source.trim()) {
      setStatus("Paste something first.");
      setPane("source");
      return;
    }
    const result = parsePrompt(source);
    setDoc(result.doc);
    setSubjectIndex(0);
    setStatus(result.summary);
    setUntouched(false);
    setConfirmNew(false);
    if (title === "Untitled" || title === SAMPLE_TITLE) setTitle(titleFromDoc(result.doc));
    openCluster(result.doc.subjects[0]?.subject_id ? "casting" : "medium", 0);
    if (narrow()) setPane("forge");
  }

  function loadSample() {
    const result = parsePrompt(SAMPLE_SOURCE);
    setSource(SAMPLE_SOURCE);
    setDoc(result.doc);
    setTitle(SAMPLE_TITLE);
    setCurrentId(null);
    setSubjectIndex(0);
    setUntouched(true);
    setStatus(result.summary);
    setConfirmNew(false);
    openCluster("casting");
    if (narrow()) setPane("forge");
  }

  function clearWork() {
    setTitle("Untitled");
    setSource("");
    setDoc(emptyDoc());
    setCurrentId(null);
    setSubjectIndex(0);
    setUntouched(false);
    setConfirmNew(false);
    setStatus("Fresh page. Paste a prompt on the left.");
    openCluster("medium");
    if (narrow()) setPane("source");
  }

  function onNew() {
    const dirty = source.trim().length > 0 || filled > 0;
    if (dirty && !confirmNew) {
      setConfirmNew(true);
      return;
    }
    clearWork();
  }

  function onSave() {
    const now = Date.now();
    const nextTitle = title.trim() || titleFromDoc(doc);
    setTitle(nextTitle);
    if (currentId && library.some((item) => item.id === currentId)) {
      const next = library.map((item) =>
        item.id === currentId ? { ...item, title: nextTitle, source, doc, updatedAt: now } : item,
      );
      setLibrary(next);
      saveLibrary(next);
      setStatus("Updated in the library.");
      return;
    }
    const id = crypto.randomUUID();
    const item: SavedPrompt = {
      id,
      title: nextTitle,
      source,
      doc,
      createdAt: now,
      updatedAt: now,
    };
    const next = [item, ...library];
    setCurrentId(id);
    setLibrary(next);
    saveLibrary(next);
    setStatus("Saved to the library.");
  }

  function onLoad(item: SavedPrompt) {
    setTitle(item.title);
    setSource(item.source);
    setDoc(item.doc);
    setCurrentId(item.id);
    setSubjectIndex(0);
    setUntouched(false);
    setLibraryOpen(false);
    setConfirmNew(false);
    setStatus(`Loaded “${item.title}”.`);
    openCluster("casting");
    if (narrow()) setPane("forge");
  }

  function onDelete(id: string) {
    if (pendingDelete !== id) {
      setPendingDelete(id);
      return;
    }
    const next = library.filter((item) => item.id !== id);
    setLibrary(next);
    saveLibrary(next);
    if (currentId === id) setCurrentId(null);
    setPendingDelete(null);
  }

  function saveField(field: FieldDef) {
    const resolved = resolvePath(field.path, slot);
    const value = getAt(doc, resolved);
    const body = Array.isArray(value) ? value.filter(Boolean).join("\n") : value.trim();
    if (!body) {
      setStatus(`${field.label} is empty.`);
      return;
    }
    const snippet: Snippet = {
      id: crypto.randomUUID(),
      title: body.split("\n")[0]?.trim().slice(0, 42) || field.label,
      body,
      category: cluster,
      custom: true,
    };
    const next = [snippet, ...customSnippets];
    setCustomSnippets(next);
    saveSnippets(next);
    setStatus(`Saved ${field.label} to assets.`);
  }

  function addSnippet() {
    const body = draftBody.trim();
    const name = draftTitle.trim();
    if (!body || !name) return;
    const snippet: Snippet = {
      id: crypto.randomUUID(),
      title: name,
      body,
      category: draftCategory,
      custom: true,
    };
    const next = [snippet, ...customSnippets];
    setCustomSnippets(next);
    saveSnippets(next);
    setDraftTitle("");
    setDraftBody("");
    setAdding(false);
    setStatus(`Asset “${name}” saved.`);
  }

  function removeSnippet(id: string) {
    const next = customSnippets.filter((item) => item.id !== id);
    setCustomSnippets(next);
    saveSnippets(next);
    setPicked((current) => current.filter((key) => key !== `s:${id}`));
  }

  function addSubject() {
    const index = doc.subjects.length;
    setDoc((current) => ({ ...current, subjects: [...current.subjects, emptySubject()] }));
    setSubjectIndex(index);
    setCluster("casting");
    setFocusPath(`subjects.${index}.subject_id`);
  }

  function removeSubject() {
    if (doc.subjects.length <= 1) return;
    setDoc((current) => ({
      ...current,
      subjects: current.subjects.filter((_, index) => index !== slot),
    }));
    setSubjectIndex(Math.max(0, slot - 1));
  }

  function forgetPhoto() {
    setPhotoPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setPhotoBlob(null);
    setPhotoError("");
  }

  function closeBookmark() {
    setBookmarkOpen(false);
    setSavingBookmark(false);
    forgetPhoto();
  }

  function openBookmark() {
    const person = active.group === "Subject";
    if (person) {
      const current = doc.subjects[slot] ?? emptySubject();
      if (!subjectFilled(current)) {
        setStatus("This subject is empty.");
        return;
      }
      setBookmarkName(characterName(current, "Subject"));
    } else {
      const fields = captureFields(doc, active, slot);
      if (!fieldsHaveContent(fields)) {
        setStatus(`${active.label} is empty.`);
        return;
      }
      setBookmarkName(sectionBlurb(fields).split(" · ")[0]?.slice(0, 42) || active.label);
    }
    setBookmarkTags([]);
    setTagDraft("");
    forgetPhoto();
    setBookmarkOpen(true);
  }

  function addTag(raw: string) {
    const next = normalizeTag(raw);
    if (!next) return;
    const known = knownTags.find((tag) => tag.toLowerCase() === next.toLowerCase());
    const label = known ?? next;
    setBookmarkTags((current) =>
      current.some((tag) => tag.toLowerCase() === label.toLowerCase()) ? current : [...current, label],
    );
    setTagDraft("");
  }

  function removeTag(label: string) {
    setBookmarkTags((current) => current.filter((tag) => tag.toLowerCase() !== label.toLowerCase()));
  }

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    try {
      const blob = await fileToThumbnail(file);
      setPhotoPreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return URL.createObjectURL(blob);
      });
      setPhotoBlob(blob);
      setPhotoError("");
    } catch {
      setPhotoError("That photo couldn't be used. Try another image.");
    }
  }

  async function commitBookmark() {
    const name = bookmarkName.trim();
    if (!name || savingBookmark) return;
    const person = active.group === "Subject";
    const kind = person ? "subject" : "section";
    const fields = person ? {} : captureFields(doc, active, slot);
    const subject = person ? structuredClone(doc.subjects[slot] ?? emptySubject()) : null;
    const existing = bookmarks.find((item) =>
      person
        ? item.kind === "subject" && item.name.toLowerCase() === name.toLowerCase()
        : item.kind === "section" && item.cluster === cluster && item.name.toLowerCase() === name.toLowerCase(),
    );
    const id = existing?.id ?? crypto.randomUUID();
    setSavingBookmark(true);
    let hasImage = existing?.hasImage ?? false;
    let photoNote = "";
    if (photoBlob) {
      try {
        await saveImage(id, photoBlob);
        hasImage = true;
        if (userId) {
          await saveBookmarkImage({ data: { id, data: await blobToBase64(photoBlob) } });
        }
      } catch {
        photoNote = " The photo couldn't be stored.";
        hasImage = existing?.hasImage ?? false;
      }
    }
    const item: Bookmark = {
      id,
      name,
      tags: bookmarkTags,
      cluster,
      kind,
      subject,
      fields,
      hasImage,
      createdAt: existing?.createdAt ?? Date.now(),
    };
    const next = existing ? bookmarks.map((entry) => (entry.id === id ? item : entry)) : [item, ...bookmarks];
    try {
      saveBookmarks(next);
    } catch {
      setSavingBookmark(false);
      setStatus("Couldn't save that bookmark. Browser storage is full.");
      return;
    }
    setBookmarks(next);
    setAssetFilter("all");
    setSavingBookmark(false);
    setBookmarkOpen(false);
    forgetPhoto();
    setStatus((existing ? `Updated “${name}”.` : `Bookmarked “${name}”.`) + photoNote);
    if (narrow()) setPane("assets");
  }

  function removeBookmark(id: string) {
    const next = bookmarks.filter((item) => item.id !== id);
    setBookmarks(next);
    saveBookmarks(next);
    setPicked((current) => current.filter((key) => key !== `b:${id}`));
    void deleteImage(id).catch(() => undefined);
    if (userId) void deleteBookmarkImage({ data: id }).catch(() => undefined);
  }

  function removeCharacter(id: string) {
    const next = characters.filter((item) => item.id !== id);
    setCharacters(next);
    saveCharacters(next);
    setPicked((current) => current.filter((key) => key !== `c:${id}`));
  }

  function togglePick(key: string) {
    setPicked((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  }

  function applySelected() {
    if (picked.length === 0) return;
    const library = [...customSnippets, ...SEED_SNIPPETS];
    let next = doc;
    let snippetSlot = slot;
    let focus = focusPath;
    let clusterId = cluster;
    let wroteSnippets = false;
    let applied = 0;
    for (const key of picked) {
      if (key.startsWith("b:")) {
        const bookmark = bookmarks.find((item) => item.id === key.slice(2));
        if (!bookmark) continue;
        if (bookmark.kind === "subject" && bookmark.subject) {
          const subject = structuredClone(bookmark.subject);
          const onlyEmpty = next.subjects.length === 1 && !subjectFilled(next.subjects[0] ?? emptySubject());
          if (onlyEmpty && !wroteSnippets) {
            next = { ...next, subjects: [subject] };
            snippetSlot = 0;
          } else {
            next = { ...next, subjects: [...next.subjects, subject] };
            snippetSlot = next.subjects.length - 1;
          }
          clusterId = "casting";
          focus = `subjects.${snippetSlot}.subject_id`;
          applied += 1;
          continue;
        }
        next = applySection(next, bookmark.cluster, bookmark.fields, snippetSlot);
        clusterId = bookmark.cluster;
        const first = clusterById(bookmark.cluster).fields[0];
        focus = first ? resolvePath(first.path, snippetSlot) : focus;
        applied += 1;
        continue;
      }
      if (key.startsWith("c:")) {
        const character = characters.find((item) => item.id === key.slice(2));
        if (!character) continue;
        const subject = structuredClone(character.subject);
        const onlyEmpty = next.subjects.length === 1 && !subjectFilled(next.subjects[0] ?? emptySubject());
        if (onlyEmpty && !wroteSnippets) {
          next = { ...next, subjects: [subject] };
          snippetSlot = 0;
        } else {
          next = { ...next, subjects: [...next.subjects, subject] };
          snippetSlot = next.subjects.length - 1;
        }
        clusterId = "casting";
        focus = `subjects.${snippetSlot}.subject_id`;
        applied += 1;
        continue;
      }
      const snippet = library.find((item) => item.id === key.slice(2));
      if (!snippet) continue;
      const placed = placeSnippet(next, snippet, snippetSlot, focus, clusterId);
      next = placed.doc;
      focus = placed.focus;
      clusterId = placed.cluster;
      wroteSnippets = true;
      applied += 1;
    }
    if (applied === 0) {
      setPicked([]);
      setStatus("Those assets are gone.");
      return;
    }
    setDoc(next);
    setSubjectIndex(snippetSlot);
    setCluster(clusterId);
    setFocusPath(focus);
    setPicked([]);
    setStatus(applied === 1 ? "Applied 1 asset." : `Applied ${applied} assets.`);
    if (narrow()) setPane("forge");
  }

  async function onCopy(kind: "json" | "line") {
    await copyText(kind === "json" ? json : toPromptLine(doc));
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1400);
  }

  function onApplyLook(look: Look) {
    const next = applyLook(doc, look, slot);
    setDoc(next);
    setUntouched(false);
    const who = doc.subjects[slot]?.subject_id.trim() || `Subject ${slot + 1}`;
    if (look.kind === "pose") {
      setCluster("posture");
      setFocusPath(`subjects.${slot}.kinetic_posture`);
      setStatus(`${look.name} applied to ${who}.`);
    } else if (look.kind === "angle") {
      setCluster("framing");
      setStatus(`${look.name} applied to the camera.`);
    } else if (look.kind === "light") {
      setCluster("key");
      setStatus(`${look.name} applied to the key light.`);
    } else {
      setCluster("environment");
      setStatus(`${look.name} applied to the setting.`);
    }
  }

  const libraryShown = library.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const who = item.doc.subjects[0]?.subject_id.toLowerCase() ?? "";
    return item.title.toLowerCase().includes(q) || who.includes(q) || item.source.toLowerCase().includes(q);
  });

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <header className="shrink-0 border-b border-border bg-raised">
        <div className="flex items-center gap-3 px-3 py-2 lg:h-14">
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-fg">
              <Flame className="size-5" aria-hidden="true" />
            </div>
            <h1 className="text-base font-semibold tracking-tight">Prompt Forge</h1>
          </div>
          <input
            aria-label="Prompt title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-faint"
            placeholder="Untitled"
          />
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <Actions
              confirmNew={confirmNew}
              onNew={onNew}
              onSave={onSave}
              onLibrary={() => setLibraryOpen(true)}
              compact={false}
            />
            <AccountSlot />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 px-3 pb-2 lg:hidden">
          <Actions
            confirmNew={confirmNew}
            onNew={onNew}
            onSave={onSave}
            onLibrary={() => setLibraryOpen(true)}
            compact
          />
        </div>
        <AccountSlot compact />
        <div className="grid grid-cols-3 border-t border-border lg:hidden">
          {(
            [
              ["source", "Source"],
              ["forge", "Structure"],
              ["assets", "Assets"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPane(id)}
              className={cn(
                "h-11 text-sm font-medium",
                pane === id ? "border-b-2 border-primary text-primary" : "text-muted",
              )}
              aria-pressed={pane === id}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <section
          className={cn(
            "min-h-0 min-w-0 flex-col border-border lg:flex lg:w-80 lg:shrink-0 lg:border-r",
            pane === "source" ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="flex items-start justify-between gap-3 px-4 pt-4">
            <div>
              <h2 className="text-base font-medium">Source</h2>
              <p className="text-sm text-muted">A paragraph, tag soup, or your JSON.</p>
            </div>
            <button type="button" className="btn btn-ghost" onClick={loadSample}>
              Sample
            </button>
          </div>
          <div className="min-h-0 flex-1 px-4 pt-3">
            <textarea
              id="source-input"
              value={source}
              onChange={(event) => {
                setSource(event.target.value);
                setUntouched(false);
                setConfirmNew(false);
              }}
              onFocus={(event) => {
                if (untouched) event.currentTarget.select();
              }}
              placeholder="Paste a prompt or the full JSON…"
              className="field h-full min-h-48 resize-none"
              aria-label="Raw prompt"
            />
          </div>
          <div className="shrink-0 space-y-2 px-4 py-3">
            <div className="flex items-center justify-between text-xs text-faint">
              <span className="tabular-nums">{source.length} characters</span>
              <span className="hidden lg:inline">Ctrl + Enter</span>
            </div>
            <button id="parse-button" type="button" className="btn btn-primary w-full" onClick={runParse}>
              Parse & Standardize
            </button>
            <p className="text-sm text-muted" aria-live="polite">
              {status}
            </p>
          </div>
        </section>

        <section
          className={cn(
            "min-h-0 min-w-0 flex-1 flex-col",
            pane === "forge" ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="flex min-h-0 flex-1">
            <nav className="hidden w-44 shrink-0 overflow-y-auto border-r border-border lg:block" aria-label="Clusters">
              <ClusterMenu doc={doc} slot={slot} active={cluster} onPick={openCluster} />
            </nav>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              {jsonMode !== "full" ? (
                <>
              <div className="shrink-0 border-b border-border lg:hidden">
                <div className="flex gap-2 overflow-x-auto px-3 pt-3">
                  {CLUSTER_GROUPS.map((group) => {
                    const selected = active.group === group;
                    return (
                      <button
                        key={group}
                        type="button"
                        onClick={() => {
                          const first = CLUSTERS.find((item) => item.group === group);
                          if (first) openCluster(first.id);
                        }}
                        className={cn(
                          "h-11 shrink-0 rounded-full px-3 text-sm font-medium",
                          selected ? "bg-primary text-primary-fg" : "border border-border text-muted",
                        )}
                      >
                        {group === "Aesthetic DNA" ? "Aesthetic" : group}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2 overflow-x-auto px-3 py-2">
                  {CLUSTERS.filter((item) => item.group === active.group).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openCluster(item.id)}
                      className={cn(
                        "h-11 shrink-0 rounded-full px-3 text-sm",
                        item.id === cluster
                          ? "bg-surface text-primary"
                          : "border border-border text-muted",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {active.group === "Subject" ? (
                <div className="flex shrink-0 items-center gap-2 overflow-x-auto px-4 pt-3">
                  {doc.subjects.map((subject, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSubjectIndex(index)}
                      className={cn(
                        "h-11 shrink-0 rounded-full px-3 text-sm",
                        index === slot ? "bg-primary text-primary-fg" : "border border-border text-muted",
                      )}
                    >
                      {subject.subject_id.trim() || `Subject ${index + 1}`}
                    </button>
                  ))}
                  <button type="button" className="btn btn-ghost shrink-0" onClick={addSubject}>
                    <Plus className="size-4" />
                    Add
                  </button>
                  {doc.subjects.length > 1 ? (
                    <button type="button" className="btn btn-ghost shrink-0" onClick={removeSubject}>
                      Remove
                    </button>
                  ) : null}
                </div>
              ) : null}

              <div className="flex shrink-0 items-end justify-between gap-3 px-4 pt-4 pb-2">
                <div>
                  <p className="text-xs font-medium tracking-wide text-faint">{active.group}</p>
                  <h2 className="text-base font-medium">{active.label}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="btn btn-ghost" aria-label="Bookmark this section" onClick={openBookmark}>
                    <BookmarkPlus className="size-4" />
                    Bookmark
                  </button>
                  <p className="text-sm text-faint tabular-nums">{filled} filled</p>
                </div>
              </div>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4">
                {active.fields.map((field) => (
                  <FieldCard
                    key={field.path}
                    field={field}
                    doc={doc}
                    slot={slot}
                    onFocus={setFocusPath}
                    onChange={(value) => setDoc(setAt(doc, resolvePath(field.path, slot), value))}
                    onSave={() => saveField(field)}
                  />
                ))}
              </div>
                </>
              ) : null}
              <JsonBlock json={json} copied={copied} mode={jsonMode} onCopy={onCopy} onMode={setJsonMode} />
            </div>
          </div>
        </section>

        <aside
          className={cn(
            "min-h-0 min-w-0 flex-col border-border lg:flex lg:w-72 lg:shrink-0 lg:border-l",
            pane === "assets" ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="shrink-0 px-4 pt-4">
            <h2 className="text-base font-medium">Assets</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                aria-pressed={assetShelf === "saved"}
                onClick={() => setAssetShelf("saved")}
                className={cn(
                  "h-11 rounded-md text-sm font-medium",
                  assetShelf === "saved" ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted",
                )}
              >
                Saved
              </button>
              <button
                type="button"
                aria-pressed={assetShelf === "looks"}
                onClick={() => setAssetShelf("looks")}
                className={cn(
                  "h-11 rounded-md text-sm font-medium",
                  assetShelf === "looks" ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted",
                )}
              >
                Looks
              </button>
            </div>
            <p className="mt-2 text-sm text-muted">
              {assetShelf === "looks"
                ? lookFilter === "pose" || lookFilter === "adult"
                  ? `A click writes the pose onto ${doc.subjects[slot]?.subject_id.trim() || `Subject ${slot + 1}`}.`
                  : "A click writes the angle, light, or setting. The person stays as they are."
                : "Pick cards across tags. Apply drops them into this prompt in the order you chose."}
            </p>
          </div>
          {assetShelf === "looks" ? (
            <div className="flex shrink-0 gap-2 overflow-x-auto px-4 py-3">
              {LOOK_FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLookFilter(item.id)}
                  aria-pressed={lookFilter === item.id}
                  className={cn(
                    "h-11 shrink-0 rounded-full px-3 text-sm font-medium",
                    lookFilter === item.id ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : (
            <>
          <div className="flex shrink-0 gap-2 overflow-x-auto px-4 py-3">
            {[
              { id: "all", label: "All" },
              ...knownTags.map((tag) => ({ id: tag.toLowerCase(), label: tag })),
              { id: "pieces", label: "Pieces" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAssetFilter(item.id)}
                aria-pressed={assetFilter === item.id}
                className={cn(
                  "h-11 shrink-0 rounded-full px-3 text-sm font-medium",
                  assetFilter === item.id ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          {assetFilter === "pieces" ? (
            <div className="flex shrink-0 gap-2 overflow-x-auto px-4 pb-3">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={cn(
                    "h-11 shrink-0 rounded-full px-3 text-sm font-medium",
                    filter === item.id ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
            </>
          )}
          <div className={cn("min-h-0 flex-1 overflow-y-auto px-4 pb-3", assetShelf === "looks" ? "" : "space-y-2")}>
            {assetShelf === "looks" ? (
              <div className="grid grid-cols-2 gap-2">
                {looksFor(lookFilter).map((look) => {
                  const on = lookIsApplied(doc, look, slot);
                  return (
                    <button
                      key={look.id}
                      type="button"
                      onClick={() => onApplyLook(look)}
                      aria-pressed={on}
                      className={cn(
                        "overflow-hidden rounded-md border bg-surface text-left",
                        on ? "border-primary" : "border-border",
                      )}
                    >
                      <div className="aspect-[4/5] bg-bg">
                        <PoseArt art={look.art} />
                      </div>
                      <p className="px-2 py-2 text-sm font-medium">{look.name}</p>
                    </button>
                  );
                })}
              </div>
            ) : assetFilter === "pieces" ? (
              snippets.map((snippet) => {
                const key = `s:${snippet.id}`;
                return (
                  <AssetCard
                    key={snippet.id}
                    eyebrow={snippet.category === "note" ? "Note" : clusterById(snippet.category).label}
                    title={snippet.title}
                    body={snippet.body}
                    picked={picked.includes(key)}
                    onPick={() => togglePick(key)}
                    onDelete={snippet.custom ? () => removeSnippet(snippet.id) : undefined}
                  />
                );
              })
            ) : shownBookmarks.length === 0 && (assetFilter !== "all" || characters.length === 0) ? (
              <p className="text-sm text-muted">
                {assetFilter === "all"
                  ? "Nothing bookmarked yet. Use Bookmark on the open section. A subject saves the whole person. Any other section saves just that block."
                  : "Nothing uses that tag yet."}
              </p>
            ) : (
              <>
                {shownBookmarks.map((bookmark) => {
                  const key = `b:${bookmark.id}`;
                  const body =
                    bookmark.kind === "subject" && bookmark.subject
                      ? characterBlurb(bookmark.subject)
                      : sectionBlurb(bookmark.fields);
                  return (
                    <AssetCard
                      key={bookmark.id}
                      eyebrow={bookmark.kind === "subject" ? "Subject" : clusterById(bookmark.cluster).label}
                      title={bookmark.name}
                      body={body || "No details yet"}
                      tags={bookmark.tags}
                      imageId={bookmark.hasImage ? bookmark.id : undefined}
                      remote={Boolean(userId)}
                      picked={picked.includes(key)}
                      onPick={() => togglePick(key)}
                      onDelete={() => removeBookmark(bookmark.id)}
                    />
                  );
                })}
                {assetFilter === "all"
                  ? characters.map((character) => {
                      const key = `c:${character.id}`;
                      return (
                        <AssetCard
                          key={character.id}
                          eyebrow="Character"
                          title={character.name}
                          body={characterBlurb(character.subject) || "No details yet"}
                          picked={picked.includes(key)}
                          onPick={() => togglePick(key)}
                          onDelete={() => removeCharacter(character.id)}
                        />
                      );
                    })
                  : null}
              </>
            )}
          </div>
          {assetShelf === "saved" ? (
          <div className="shrink-0 border-t border-border">
            <div className="flex items-center gap-2 px-3 py-2">
              <p className="mr-auto text-sm text-muted tabular-nums">{picked.length} selected</p>
              {picked.length > 0 ? (
                <button type="button" className="btn btn-ghost" onClick={() => setPicked([])}>
                  Clear
                </button>
              ) : null}
              <button type="button" className="btn btn-primary" disabled={picked.length === 0} onClick={applySelected}>
                Apply
              </button>
            </div>
            {assetFilter === "pieces" ? (
              <div className="border-t border-border p-3">
                {adding ? (
                  <form
                    className="space-y-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      addSnippet();
                    }}
                  >
                    <input
                      aria-label="Snippet title"
                      value={draftTitle}
                      onChange={(event) => setDraftTitle(event.target.value)}
                      placeholder="Title"
                      className="field"
                    />
                    <select
                      aria-label="Snippet cluster"
                      value={draftCategory}
                      onChange={(event) => setDraftCategory(event.target.value as SnippetCategory)}
                      className="field"
                    >
                      {CLUSTERS.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.group} — {item.label}
                        </option>
                      ))}
                      <option value="note">Note — inserts into the open field</option>
                    </select>
                    <textarea
                      aria-label="Snippet text"
                      value={draftBody}
                      onChange={(event) => setDraftBody(event.target.value)}
                      placeholder="Reusable text"
                      rows={3}
                      className="field resize-y"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary flex-1"
                        disabled={!draftTitle.trim() || !draftBody.trim()}
                      >
                        Save snippet
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={() => setAdding(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button type="button" className="btn btn-ghost w-full" onClick={() => setAdding(true)}>
                    <Plus className="size-4" />
                    New snippet
                  </button>
                )}
              </div>
            ) : null}
          </div>
          ) : null}
        </aside>
      </div>

      {bookmarkOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 lg:items-center lg:p-6" onClick={closeBookmark}>
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="bookmark-title"
            className="flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-t-xl border border-border bg-raised lg:rounded-xl"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              void commitBookmark();
            }}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <h2 id="bookmark-title" className="text-base font-medium">
                Bookmark {active.group === "Subject" ? "subject" : active.label}
              </h2>
              <button
                type="button"
                className="ml-auto flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-fg"
                aria-label="Close bookmark"
                onClick={closeBookmark}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <p className="text-sm text-muted">
                {active.group === "Subject"
                  ? "Saves this whole subject. The photo stays on the card and is not sent with the prompt."
                  : `Saves ${active.label} as it is right now. Applying it replaces that section. The photo is only for you.`}
              </p>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Name</span>
                <input
                  aria-label="Bookmark name"
                  value={bookmarkName}
                  onChange={(event) => setBookmarkName(event.target.value)}
                  className="field"
                />
              </label>
              <div className="space-y-2">
                <span className="text-sm font-medium">Tags</span>
                <div className="flex gap-2">
                  <input
                    aria-label="New tag"
                    value={tagDraft}
                    onChange={(event) => setTagDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === ",") {
                        event.preventDefault();
                        addTag(tagDraft);
                      }
                    }}
                    placeholder="Type a tag"
                    className="field"
                  />
                  <button type="button" className="btn btn-ghost shrink-0" onClick={() => addTag(tagDraft)}>
                    Add
                  </button>
                </div>
                {bookmarkTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {bookmarkTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-3 text-sm font-medium text-primary-fg"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="size-3.5" />
                        <span className="sr-only">Remove {tag}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-faint">No tags yet. Add one, or tap a tag you already use.</p>
                )}
                {knownTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {knownTags.map((tag) => {
                      const on = bookmarkTags.some((item) => item.toLowerCase() === tag.toLowerCase());
                      return (
                        <button
                          key={tag}
                          type="button"
                          aria-pressed={on}
                          className={cn(
                            "h-11 rounded-full px-3 text-sm font-medium",
                            on ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted",
                          )}
                          onClick={() => (on ? removeTag(tag) : addTag(tag))}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Photo</span>
                {photoPreview ? (
                  <img src={photoPreview} alt="" className="h-36 w-full rounded-lg object-cover" />
                ) : null}
                <div className="flex gap-2">
                  <label className="btn btn-ghost flex-1">
                    <ImagePlus className="size-4" />
                    {photoPreview ? "Replace photo" : "Add photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        void onPhoto(file);
                      }}
                    />
                  </label>
                  {photoPreview ? (
                    <button type="button" className="btn btn-ghost" onClick={forgetPhoto}>
                      Remove
                    </button>
                  ) : null}
                </div>
                {photoError ? <p className="text-sm text-muted">{photoError}</p> : null}
              </div>
            </div>
            <div className="border-t border-border p-3">
              <button type="submit" className="btn btn-primary w-full" disabled={!bookmarkName.trim() || savingBookmark}>
                {savingBookmark ? "Saving" : "Save bookmark"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {libraryOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-bg/80" onClick={() => setLibraryOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="library-title"
            className="flex h-full w-full max-w-md flex-col border-l border-border bg-raised"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <h2 id="library-title" className="text-base font-medium">
                Library
              </h2>
              <button
                type="button"
                className="ml-auto flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-fg"
                aria-label="Close library"
                onClick={() => setLibraryOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="px-4 py-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
                <input
                  aria-label="Search library"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search saved prompts"
                  className="field pl-9"
                />
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              {library.length === 0 ? (
                <p className="text-sm text-muted">Nothing saved yet. Parse a prompt, then use Save to library.</p>
              ) : libraryShown.length === 0 ? (
                <p className="text-sm text-muted">No prompts match that search.</p>
              ) : (
                <ul className="space-y-2">
                  {libraryShown.map((item) => (
                    <li key={item.id} className="rounded-lg border border-border bg-surface">
                      <button type="button" onClick={() => onLoad(item)} className="w-full px-3 py-3 text-left">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted">
                          {item.doc.subjects[0]?.subject_id || "No subject yet"}
                        </p>
                        <p className="mt-2 text-xs text-faint tabular-nums">{formatWhen(item.updatedAt)}</p>
                      </button>
                      <div className="flex justify-end border-t border-border">
                        <button
                          type="button"
                          className="h-11 px-3 text-sm text-muted hover:text-fg"
                          onClick={() => onDelete(item.id)}
                        >
                          {pendingDelete === item.id ? "Confirm delete" : "Delete"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ClusterMenu({
  doc,
  slot,
  active,
  onPick,
}: {
  doc: PromptDoc;
  slot: number;
  active: ClusterId;
  onPick: (id: ClusterId) => void;
}) {
  return (
    <div className="py-2">
      {CLUSTER_GROUPS.map((group) => (
        <div key={group} className="pb-2">
          <p className="px-3 pt-3 pb-1 text-xs font-medium tracking-wide text-faint">{group}</p>
          {CLUSTERS.filter((item) => item.group === group).map((item) => {
            const on = item.id === active;
            const filled = clusterHasContent(doc, item, slot);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onPick(item.id)}
                className={cn(
                  "flex h-11 w-full items-center gap-2 px-3 text-left text-sm",
                  on ? "bg-surface font-medium text-primary" : "text-muted hover:bg-surface hover:text-fg",
                )}
                aria-current={on ? "true" : undefined}
              >
                <span className={cn("size-1.5 shrink-0 rounded-full", filled ? "bg-primary" : "bg-border")} />
                {item.label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function FieldCard({
  field,
  doc,
  slot,
  onFocus,
  onChange,
  onSave,
}: {
  field: FieldDef;
  doc: PromptDoc;
  slot: number;
  onFocus: (path: string) => void;
  onChange: (value: string | string[]) => void;
  onSave: () => void;
}) {
  const path = resolvePath(field.path, slot);
  const value = getAt(doc, path);
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor={path} className="text-sm font-medium">
          {field.label}
        </label>
        <button
          type="button"
          className="ml-auto flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
          aria-label={`Save ${field.label} to assets`}
          onClick={onSave}
        >
          <BookmarkIcon className="size-4" />
        </button>
      </div>
      {field.kind === "palette" && Array.isArray(value) ? (
        <PaletteField colors={value} onChange={onChange} />
      ) : field.kind === "list" && Array.isArray(value) ? (
        <textarea
          id={path}
          data-path={path}
          rows={field.rows}
          value={value.join("\n")}
          placeholder={field.hint}
          onFocus={() => onFocus(path)}
          onChange={(event) => onChange(event.target.value.split("\n"))}
          onBlur={(event) =>
            onChange(
              event.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            )
          }
          className="field resize-y"
        />
      ) : (
        <textarea
          id={path}
          data-path={path}
          rows={field.rows}
          value={typeof value === "string" ? value : ""}
          placeholder={field.hint}
          onFocus={() => onFocus(path)}
          onChange={(event) => onChange(event.target.value)}
          className="field resize-y"
        />
      )}
    </div>
  );
}

function PaletteField({
  colors,
  onChange,
}: {
  colors: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {colors.length === 0 ? <p className="text-sm text-faint">No swatches yet.</p> : null}
      {colors.map((hex, index) => (
        <div key={`${hex}-${index}`} className="flex items-center gap-2">
          <input
            aria-label={`Palette color ${index + 1}`}
            type="color"
            value={safeHex(hex)}
            onChange={(event) => {
              const next = [...colors];
              next[index] = event.target.value.toUpperCase();
              onChange(next);
            }}
            className="size-11 shrink-0 rounded-md border border-border bg-bg"
          />
          <input
            aria-label={`Hex ${index + 1}`}
            value={hex}
            onChange={(event) => {
              const next = [...colors];
              next[index] = event.target.value;
              onChange(next);
            }}
            className="field font-mono"
          />
          <button
            type="button"
            aria-label={`Remove color ${index + 1}`}
            className="flex size-11 items-center justify-center text-muted hover:text-fg"
            onClick={() => onChange(colors.filter((_, item) => item !== index))}
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-ghost" onClick={() => onChange([...colors, "#C46A3A"])}>
        <Plus className="size-4" />
        Add swatch
      </button>
    </div>
  );
}

function AccountSlot({ compact = false }: { compact?: boolean }) {
  const { isPending } = useCurrentUserState();
  if (isPending) return compact ? null : <div className="h-11 w-24 animate-pulse rounded-md bg-surface" />;
  if (compact) {
    return (
      <div className="border-t border-border px-3 py-2 lg:hidden">
        <SignedOut>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted">Sign in to keep this in your account.</p>
            <Link to="/login" className="btn btn-primary shrink-0">
              Sign in
            </Link>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    );
  }
  return (
    <>
      <SignedOut>
        <Link to="/login" className="btn btn-ghost">
          Sign in
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}

function AssetCard({
  eyebrow,
  title,
  body,
  tags,
  imageId,
  remote = false,
  picked,
  onPick,
  onDelete,
}: {
  eyebrow: string;
  title: string;
  body: string;
  tags?: string[];
  imageId?: string;
  remote?: boolean;
  picked: boolean;
  onPick: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className={cn("rounded-lg border bg-surface", picked ? "border-primary" : "border-border")}>
      <button type="button" onClick={onPick} aria-pressed={picked} className="flex w-full items-start gap-3 px-3 py-3 text-left">
        {imageId ? <BookmarkPhoto id={imageId} remote={remote} /> : null}
        <span className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-wide text-primary">{eyebrow}</p>
          <p className="mt-1 text-sm font-medium">{title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{body}</p>
          {tags && tags.length > 0 ? <p className="mt-1 text-xs text-faint">{tags.join(" · ")}</p> : null}
        </span>
        <PickMark on={picked} />
      </button>
      {onDelete ? (
        <div className="flex justify-end border-t border-border">
          <button
            type="button"
            className="flex size-11 items-center justify-center text-muted hover:text-fg"
            aria-label={`Delete ${title}`}
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function BookmarkPhoto({ id, remote }: { id: string; remote: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    let objectUrl = "";
    const load = remote
      ? loadBookmarkImage({ data: id }).then((data) => (data ? base64ToBlob(data) : loadImage(id)))
      : loadImage(id);
    load
      .then((blob) => {
        if (!alive || !blob) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, remote]);
  if (!url) return <span className="size-14 shrink-0 rounded-md bg-bg" />;
  return <img src={url} alt="" className="size-14 shrink-0 rounded-md object-cover" />;
}

function PickMark({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
        on ? "border-primary bg-primary text-primary-fg" : "border-border bg-bg",
      )}
      aria-hidden="true"
    >
      {on ? <Check className="size-3" /> : null}
    </span>
  );
}

function Actions({
  confirmNew,
  onNew,
  onSave,
  onLibrary,
  compact,
}: {
  confirmNew: boolean;
  onNew: () => void;
  onSave: () => void;
  onLibrary: () => void;
  compact: boolean;
}) {
  return (
    <>
      <button type="button" className={cn("btn btn-ghost", compact && "w-full px-2")} onClick={onNew} aria-label="New prompt">
        <FilePlus className="size-4" />
        {confirmNew ? "Discard?" : compact ? "New" : "New prompt"}
      </button>
      <button
        type="button"
        className={cn("btn btn-ghost", compact && "w-full px-2")}
        onClick={onSave}
        aria-label="Save to library"
      >
        <BookmarkIcon className="size-4" />
        {compact ? "Save" : "Save to library"}
      </button>
      <button
        type="button"
        className={cn("btn btn-ghost", compact && "w-full px-2")}
        onClick={onLibrary}
        aria-label="Open library"
      >
        <Library className="size-4" />
        Library
      </button>
    </>
  );
}

function JsonBlock({
  json,
  copied,
  mode,
  onCopy,
  onMode,
}: {
  json: string;
  copied: Copied;
  mode: JsonMode;
  onCopy: (kind: "json" | "line") => void;
  onMode: (mode: JsonMode) => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden border-t border-border bg-bg",
        mode === "peek" && "h-52 shrink-0",
        mode === "full" && "min-h-0 flex-1",
        mode === "hidden" && "shrink-0",
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center gap-2 px-3 py-2">
        <div className="mr-auto">
          <p className="text-xs font-medium tracking-wide text-muted">JSON</p>
          <p className="text-xs text-faint">
            {mode === "full" ? "Full document" : mode === "hidden" ? "Hidden" : "Live — a fraction"}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost w-11 px-0"
          aria-label={mode === "hidden" ? "Show JSON" : "Hide JSON"}
          onClick={() => onMode(mode === "hidden" ? "peek" : "hidden")}
        >
          {mode === "hidden" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        <button
          type="button"
          className="btn btn-ghost w-11 px-0"
          aria-label={mode === "full" ? "Show a fraction of the JSON" : "Show the full JSON"}
          onClick={() => onMode(mode === "full" ? "peek" : "full")}
        >
          {mode === "full" ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
        {mode === "hidden" ? null : (
          <>
            <button type="button" className="btn btn-ghost" onClick={() => onCopy("line")}>
              {copied === "line" ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied === "line" ? "Copied" : "Copy line"}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onCopy("json")}>
              {copied === "json" ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied === "json" ? "Copied" : "Copy JSON"}
            </button>
          </>
        )}
      </div>
      {mode === "hidden" ? null : (
        <pre
          id="json-output"
          className="min-h-0 flex-1 overflow-auto px-4 pb-4 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap"
        >
          {json.split("\n").map((line, index) => (
            <div key={index}>{colorLine(line)}</div>
          ))}
        </pre>
      )}
    </div>
  );
}

function colorLine(line: string) {
  const match = line.match(/^(\s*)("(?:\\.|[^"\\])*")(\s*:\s*)(.*)$/);
  if (!match) return <span className="text-faint">{line}</span>;
  return (
    <>
      {match[1]}
      <span className="text-primary">{match[2]}</span>
      <span className="text-faint">{match[3]}</span>
      <span className="text-fg">{match[4]}</span>
    </>
  );
}
