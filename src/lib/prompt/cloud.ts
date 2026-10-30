import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  bookmarksFromUnknown,
  charactersFromUnknown,
  draftFromUnknown,
  libraryFromUnknown,
  snippetsFromUnknown,
} from "@/lib/prompt/storage";

const KINDS = ["draft", "library", "snippets", "characters", "bookmarks"] as const;
type CloudKind = (typeof KINDS)[number];

export type CloudSnapshot = {
  draft: ReturnType<typeof draftFromUnknown>;
  library: ReturnType<typeof libraryFromUnknown>;
  snippets: ReturnType<typeof snippetsFromUnknown>;
  characters: ReturnType<typeof charactersFromUnknown>;
  bookmarks: ReturnType<typeof bookmarksFromUnknown>;
};

function emptySnapshot(): CloudSnapshot {
  return { draft: null, library: [], snippets: [], characters: [], bookmarks: [] };
}

function normalize(kind: CloudKind, payload: unknown) {
  if (kind === "draft") return draftFromUnknown(payload);
  if (kind === "library") return libraryFromUnknown(payload);
  if (kind === "snippets") return snippetsFromUnknown(payload);
  if (kind === "characters") return charactersFromUnknown(payload);
  return bookmarksFromUnknown(payload);
}

export const loadCloud = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<CloudSnapshot> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ kind: string; payload: string }>`
      select kind, payload from user_blobs where user_id = ${context.userId}
    `;
    const snapshot = emptySnapshot();
    for (const row of rows) {
      if (!KINDS.includes(row.kind as CloudKind)) continue;
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(row.payload);
      } catch {
        parsed = null;
      }
      const kind = row.kind as CloudKind;
      if (kind === "draft") snapshot.draft = draftFromUnknown(parsed);
      else if (kind === "library") snapshot.library = libraryFromUnknown(parsed);
      else if (kind === "snippets") snapshot.snippets = snippetsFromUnknown(parsed);
      else if (kind === "characters") snapshot.characters = charactersFromUnknown(parsed);
      else snapshot.bookmarks = bookmarksFromUnknown(parsed);
    }
    return snapshot;
  });

export const saveCloudBlob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind: string; payload: unknown }) => {
    if (!input || !KINDS.includes(input.kind as CloudKind)) throw new Error("Bad save");
    return { kind: input.kind as CloudKind, payload: input.payload };
  })
  .handler(async ({ context, data }) => {
    const normalized = normalize(data.kind, data.payload);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      insert into user_blobs (user_id, kind, payload)
      values (${context.userId}, ${data.kind}, ${JSON.stringify(normalized)})
      on conflict (user_id, kind) do update set payload = excluded.payload
    `;
    return { ok: true as const };
  });

export const saveBookmarkImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; data: string }) => {
    if (!input || typeof input.id !== "string" || typeof input.data !== "string") throw new Error("Bad image");
    if (input.id.length > 80 || input.data.length > 2_000_000) throw new Error("Image too large");
    return { id: input.id, data: input.data };
  })
  .handler(async ({ context, data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      insert into bookmark_images (user_id, bookmark_id, data)
      values (${context.userId}, ${data.id}, ${data.data})
      on conflict (user_id, bookmark_id) do update set data = excluded.data
    `;
    return { ok: true as const };
  });

export const loadBookmarkImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => {
    if (typeof id !== "string" || id.length > 80) throw new Error("Bad image");
    return id;
  })
  .handler(async ({ context, data: id }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ data: string }>`
      select data from bookmark_images where user_id = ${context.userId} and bookmark_id = ${id}
    `;
    return rows[0]?.data ?? null;
  });

export const deleteBookmarkImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => {
    if (typeof id !== "string" || id.length > 80) throw new Error("Bad image");
    return id;
  })
  .handler(async ({ context, data: id }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`delete from bookmark_images where user_id = ${context.userId} and bookmark_id = ${id}`;
    return { ok: true as const };
  });
