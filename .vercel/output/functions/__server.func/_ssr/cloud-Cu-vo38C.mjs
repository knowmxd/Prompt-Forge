import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { M as snippetsFromUnknown, a as bookmarksFromUnknown, f as draftFromUnknown, i as authMiddleware, o as charactersFromUnknown, y as libraryFromUnknown } from "./storage-Cb0j-4Jv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cloud-Cu-vo38C.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var KINDS = [
	"draft",
	"library",
	"snippets",
	"characters",
	"bookmarks"
];
function emptySnapshot() {
	return {
		draft: null,
		library: [],
		snippets: [],
		characters: [],
		bookmarks: []
	};
}
function normalize(kind, payload) {
	if (kind === "draft") return draftFromUnknown(payload);
	if (kind === "library") return libraryFromUnknown(payload);
	if (kind === "snippets") return snippetsFromUnknown(payload);
	if (kind === "characters") return charactersFromUnknown(payload);
	return bookmarksFromUnknown(payload);
}
var loadCloud_createServerFn_handler = createServerRpc({
	id: "35f1b252bb0288056076e89a1578086f34426e118bfd374b77aab86687874380",
	name: "loadCloud",
	filename: "src/lib/prompt/cloud.ts"
}, (opts) => loadCloud.__executeServer(opts));
var loadCloud = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadCloud_createServerFn_handler, async ({ context }) => {
	const { getSql } = await import("./db-DjO7aOfm.mjs").then((n) => n.t).then((n) => n.t);
	const rows = await (await getSql())`
      select kind, payload from user_blobs where user_id = ${context.userId}
    `;
	const snapshot = emptySnapshot();
	for (const row of rows) {
		if (!KINDS.includes(row.kind)) continue;
		let parsed = null;
		try {
			parsed = JSON.parse(row.payload);
		} catch {
			parsed = null;
		}
		const kind = row.kind;
		if (kind === "draft") snapshot.draft = draftFromUnknown(parsed);
		else if (kind === "library") snapshot.library = libraryFromUnknown(parsed);
		else if (kind === "snippets") snapshot.snippets = snippetsFromUnknown(parsed);
		else if (kind === "characters") snapshot.characters = charactersFromUnknown(parsed);
		else snapshot.bookmarks = bookmarksFromUnknown(parsed);
	}
	return snapshot;
});
var saveCloudBlob_createServerFn_handler = createServerRpc({
	id: "6642210ca8f2b16029949d26ad28751503618cb28b724f363fd260d686f548fb",
	name: "saveCloudBlob",
	filename: "src/lib/prompt/cloud.ts"
}, (opts) => saveCloudBlob.__executeServer(opts));
var saveCloudBlob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	if (!input || !KINDS.includes(input.kind)) throw new Error("Bad save");
	return {
		kind: input.kind,
		payload: input.payload
	};
}).handler(saveCloudBlob_createServerFn_handler, async ({ context, data }) => {
	const normalized = normalize(data.kind, data.payload);
	const { getSql } = await import("./db-DjO7aOfm.mjs").then((n) => n.t).then((n) => n.t);
	await (await getSql())`
      insert into user_blobs (user_id, kind, payload)
      values (${context.userId}, ${data.kind}, ${JSON.stringify(normalized)})
      on conflict (user_id, kind) do update set payload = excluded.payload
    `;
	return { ok: true };
});
var saveBookmarkImage_createServerFn_handler = createServerRpc({
	id: "239261fffb9e7553ac6e1808e4792eee72b355362b32e66568863076d080fc13",
	name: "saveBookmarkImage",
	filename: "src/lib/prompt/cloud.ts"
}, (opts) => saveBookmarkImage.__executeServer(opts));
var saveBookmarkImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	if (!input || typeof input.id !== "string" || typeof input.data !== "string") throw new Error("Bad image");
	if (input.id.length > 80 || input.data.length > 2e6) throw new Error("Image too large");
	return {
		id: input.id,
		data: input.data
	};
}).handler(saveBookmarkImage_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-DjO7aOfm.mjs").then((n) => n.t).then((n) => n.t);
	await (await getSql())`
      insert into bookmark_images (user_id, bookmark_id, data)
      values (${context.userId}, ${data.id}, ${data.data})
      on conflict (user_id, bookmark_id) do update set data = excluded.data
    `;
	return { ok: true };
});
var loadBookmarkImage_createServerFn_handler = createServerRpc({
	id: "c951c842b92cf13676d146d54b1b6a5cce13a158eed03d598c44fe0e5928b52f",
	name: "loadBookmarkImage",
	filename: "src/lib/prompt/cloud.ts"
}, (opts) => loadBookmarkImage.__executeServer(opts));
var loadBookmarkImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => {
	if (typeof id !== "string" || id.length > 80) throw new Error("Bad image");
	return id;
}).handler(loadBookmarkImage_createServerFn_handler, async ({ context, data: id }) => {
	const { getSql } = await import("./db-DjO7aOfm.mjs").then((n) => n.t).then((n) => n.t);
	return (await (await getSql())`
      select data from bookmark_images where user_id = ${context.userId} and bookmark_id = ${id}
    `)[0]?.data ?? null;
});
var deleteBookmarkImage_createServerFn_handler = createServerRpc({
	id: "a33c529e5a0233f61036503617d4e946dd76ffa66d78073d95d05864eb850cd7",
	name: "deleteBookmarkImage",
	filename: "src/lib/prompt/cloud.ts"
}, (opts) => deleteBookmarkImage.__executeServer(opts));
var deleteBookmarkImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => {
	if (typeof id !== "string" || id.length > 80) throw new Error("Bad image");
	return id;
}).handler(deleteBookmarkImage_createServerFn_handler, async ({ context, data: id }) => {
	const { getSql } = await import("./db-DjO7aOfm.mjs").then((n) => n.t).then((n) => n.t);
	await (await getSql())`delete from bookmark_images where user_id = ${context.userId} and bookmark_id = ${id}`;
	return { ok: true };
});
//#endregion
export { deleteBookmarkImage_createServerFn_handler, loadBookmarkImage_createServerFn_handler, loadCloud_createServerFn_handler, saveBookmarkImage_createServerFn_handler, saveCloudBlob_createServerFn_handler };
