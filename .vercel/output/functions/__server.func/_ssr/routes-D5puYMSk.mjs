import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signOut, t as authClient } from "./client-IWHfIGH2.mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { A as saveSnippets, C as loadLibrary, D as saveCharacters, E as saveBookmarks, F as toPromptLine, N as titleFromDoc, O as saveDraft, P as toJson, S as loadDraft, T as resolvePath, _ as getAt, b as loadBookmarks, c as clusterHasContent, d as docFromFlat, g as filledKeys, h as emptySubject, i as authMiddleware, j as setAt, k as saveLibrary, l as coerceDoc, m as emptyFields, n as CLUSTER_GROUPS, p as emptyDoc, r as SECTION_KEYS, s as clusterById, t as CLUSTERS, u as countFilled, v as isNativeDoc, w as loadSnippets, x as loadCharacters } from "./storage-Btoi1Ksw.mjs";
import { a as hasGateSessionMarker } from "./server-CW2nNadZ.mjs";
import { A as Bookmark, C as Copy, D as ChevronDown, E as ChevronUp, O as Check, S as Download, T as CircleAlert, _ as Funnel, a as Tag, b as FileText, c as Shirt, d as Minimize2, f as Maximize2, g as ImagePlus, h as Image$1, i as Trash2, j as BookmarkPlus, k as Camera, l as Search, m as Layers, n as Upload, o as SunMedium, p as Library, s as Sparkles, t as X, u as Plus, v as FolderInput, w as Code, x as FilePlus, y as Flame } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D5puYMSk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var loadCloud = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("35f1b252bb0288056076e89a1578086f34426e118bfd374b77aab86687874380"));
var saveCloudBlob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	if (!input || !KINDS.includes(input.kind)) throw new Error("Bad save");
	return {
		kind: input.kind,
		payload: input.payload
	};
}).handler(createSsrRpc("6642210ca8f2b16029949d26ad28751503618cb28b724f363fd260d686f548fb"));
var saveBookmarkImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	if (!input || typeof input.id !== "string" || typeof input.data !== "string") throw new Error("Bad image");
	if (input.id.length > 80 || input.data.length > 2e6) throw new Error("Image too large");
	return {
		id: input.id,
		data: input.data
	};
}).handler(createSsrRpc("239261fffb9e7553ac6e1808e4792eee72b355362b32e66568863076d080fc13"));
var loadBookmarkImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => {
	if (typeof id !== "string" || id.length > 80) throw new Error("Bad image");
	return id;
}).handler(createSsrRpc("c951c842b92cf13676d146d54b1b6a5cce13a158eed03d598c44fe0e5928b52f"));
var deleteBookmarkImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => {
	if (typeof id !== "string" || id.length > 80) throw new Error("Bad image");
	return id;
}).handler(createSsrRpc("a33c529e5a0233f61036503617d4e946dd76ffa66d78073d95d05864eb850cd7"));
function normalizeTag(raw) {
	return raw.trim().replace(/\s+/g, " ").slice(0, 32);
}
function captureFields(doc, cluster, slot) {
	const fields = {};
	for (const field of cluster.fields) {
		const value = getAt(doc, resolvePath(field.path, slot));
		fields[field.path] = Array.isArray(value) ? [...value] : value;
	}
	return fields;
}
function fieldsHaveContent(fields) {
	return Object.values(fields).some((value) => Array.isArray(value) ? value.some((item) => item.trim()) : value.trim().length > 0);
}
function applySection(doc, cluster, fields, slot) {
	let next = doc;
	for (const field of clusterById(cluster).fields) {
		const value = fields[field.path];
		if (value === void 0) continue;
		next = setAt(next, resolvePath(field.path, slot), Array.isArray(value) ? [...value] : value);
	}
	return next;
}
function sectionBlurb(fields) {
	const bits = [];
	for (const value of Object.values(fields)) if (Array.isArray(value)) bits.push(...value.map((item) => item.trim()).filter(Boolean));
	else if (value.trim()) bits.push(value.trim());
	return bits.slice(0, 2).join(" · ");
}
function polar(x, y, deg, len) {
	const r = deg * Math.PI / 180;
	return [x + Math.cos(r) * len, y + Math.sin(r) * len];
}
function mannequin(spec) {
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
	const bone = (a, b, w) => [
		Math.round(a[0]),
		Math.round(a[1]),
		Math.round(b[0]),
		Math.round(b[1]),
		w
	];
	return {
		head: [
			Math.round(head[0]),
			Math.round(head[1]),
			Math.round(11 * scale)
		],
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
			bone(rKnee, rFoot, 7)
		]
	};
}
var floor = { t: "floor" };
var horizon = { t: "horizon" };
var hang = {
	lArm: 100,
	lFore: 95,
	rArm: 80,
	rFore: 85,
	lLeg: 100,
	lShin: 95,
	rLeg: 80,
	rShin: 85
};
var FIGURES = {
	"hip-cock": mannequin({
		...hang,
		lArm: 20,
		lFore: 110,
		lLeg: 110,
		lShin: 70,
		rLeg: 75,
		rShin: 80,
		extras: [floor]
	}),
	pockets: mannequin({
		...hang,
		lArm: 70,
		lFore: 120,
		rArm: 110,
		rFore: 60,
		extras: [floor]
	}),
	crossed: mannequin({
		...hang,
		lArm: 40,
		lFore: 10,
		rArm: 140,
		rFore: 170,
		extras: [floor]
	}),
	stride: mannequin({
		...hang,
		lArm: 50,
		lFore: 70,
		rArm: 130,
		rFore: 110,
		lLeg: 55,
		lShin: 70,
		rLeg: 125,
		rShin: 110,
		extras: [floor]
	}),
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
		extras: [{
			t: "block",
			x: 30,
			y: 108,
			w: 62,
			h: 8
		}]
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
		extras: [{
			t: "block",
			x: 48,
			y: 112,
			w: 28,
			h: 24
		}]
	}),
	shoulder: mannequin({
		...hang,
		torso: -70,
		extras: [floor]
	}),
	hair: mannequin({
		...hang,
		lArm: -50,
		lFore: -90,
		rArm: -130,
		rFore: -90,
		extras: [floor]
	}),
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
		extras: [floor]
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
		extras: [horizon]
	}),
	wall: mannequin({
		...hang,
		x: 70,
		torso: -75,
		lArm: 40,
		lFore: 10,
		rArm: 100,
		rFore: 130,
		extras: [{
			t: "block",
			x: 98,
			y: 18,
			w: 8,
			h: 130
		}, floor]
	}),
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
		extras: [floor]
	}),
	arched: mannequin({
		...hang,
		torso: -60,
		lArm: -40,
		lFore: -80,
		rArm: -140,
		rFore: -100,
		extras: [floor]
	}),
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
		extras: [horizon]
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
		extras: [horizon]
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
		extras: [horizon]
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
		extras: [floor]
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
		extras: [horizon]
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
		extras: [floor]
	}),
	"leg-up": mannequin({
		...hang,
		lArm: 40,
		lFore: 80,
		rArm: 100,
		rFore: 80,
		lLeg: 20,
		lShin: 80,
		extras: [floor]
	}),
	"eye-level": mannequin({
		...hang,
		extras: [{
			t: "cam",
			x: 14,
			y: 70,
			rot: 0
		}, floor]
	}),
	"low-angle": mannequin({
		...hang,
		y: 104,
		scale: 1.15,
		extras: [{
			t: "cam",
			x: 12,
			y: 120,
			rot: -40
		}, floor]
	}),
	"high-angle": mannequin({
		...hang,
		y: 112,
		scale: .72,
		extras: [{
			t: "cam",
			x: 16,
			y: 16,
			rot: 40
		}]
	}),
	"three-quarter": mannequin({
		...hang,
		torso: -75,
		extras: [{
			t: "cam",
			x: 14,
			y: 64,
			rot: -18
		}, floor]
	}),
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
		extras: [{
			t: "cam",
			x: 12,
			y: 64,
			rot: 0
		}, floor]
	}),
	behind: mannequin({
		...hang,
		extras: [{
			t: "cam",
			x: 14,
			y: 78,
			rot: 0
		}, floor]
	}),
	"window-light": mannequin({
		...hang,
		extras: [{
			t: "window",
			x: 12,
			y: 28
		}, floor]
	}),
	"hard-side": mannequin({
		...hang,
		extras: [{
			t: "sun",
			x: 18,
			y: 40
		}, floor]
	}),
	rim: mannequin({
		...hang,
		extras: [{
			t: "sun",
			x: 100,
			y: 24
		}, floor]
	}),
	overhead: mannequin({
		...hang,
		extras: [{
			t: "sun",
			x: 60,
			y: 14
		}, floor]
	}),
	golden: mannequin({
		...hang,
		extras: [{
			t: "sun",
			x: 18,
			y: 112
		}, horizon]
	}),
	"low-key": mannequin({
		...hang,
		extras: [{
			t: "sun",
			x: 60,
			y: 14
		}]
	}),
	studio: mannequin({
		...hang,
		y: 104,
		scale: .82,
		extras: [{
			t: "block",
			x: 14,
			y: 22,
			w: 92,
			h: 112
		}, floor]
	}),
	sidewalk: mannequin({
		...hang,
		y: 108,
		scale: .7,
		extras: [
			{
				t: "block",
				x: 8,
				y: 28,
				w: 24,
				h: 86
			},
			{
				t: "block",
				x: 88,
				y: 36,
				w: 24,
				h: 78
			},
			horizon
		]
	}),
	"window-room": mannequin({
		...hang,
		x: 72,
		y: 104,
		scale: .78,
		extras: [{
			t: "window",
			x: 14,
			y: 26
		}, floor]
	}),
	warehouse: mannequin({
		...hang,
		y: 112,
		scale: .62,
		extras: [
			{
				t: "block",
				x: 18,
				y: 24,
				w: 6,
				h: 100
			},
			{
				t: "block",
				x: 96,
				y: 24,
				w: 6,
				h: 100
			},
			{
				t: "block",
				x: 12,
				y: 20,
				w: 96,
				h: 6
			},
			floor
		]
	}),
	field: mannequin({
		...hang,
		y: 112,
		scale: .7,
		extras: [horizon, {
			t: "sun",
			x: 98,
			y: 36
		}]
	}),
	"night-street": mannequin({
		...hang,
		y: 110,
		scale: .68,
		extras: [
			{
				t: "sun",
				x: 24,
				y: 24
			},
			{
				t: "sun",
				x: 98,
				y: 32
			},
			{
				t: "block",
				x: 8,
				y: 40,
				w: 18,
				h: 70
			},
			{
				t: "block",
				x: 94,
				y: 46,
				w: 18,
				h: 64
			},
			floor
		]
	})
};
var POSE_CATEGORIES = [
	{
		id: "all",
		label: "All Poses"
	},
	{
		id: "knights",
		label: "Knights & Warriors"
	},
	{
		id: "modeling",
		label: "Fashion & Photo Shoots"
	},
	{
		id: "paintings",
		label: "Fine Art & Paintings"
	},
	{
		id: "cinematic",
		label: "Cinematic & Scenes"
	},
	{
		id: "couples",
		label: "Couples & Duos"
	},
	{
		id: "action",
		label: "Action & Combat"
	},
	{
		id: "fantasy",
		label: "Fantasy & Magic"
	},
	{
		id: "sitting",
		label: "Sitting & Furniture"
	},
	{
		id: "reclining",
		label: "Floor & Reclining"
	},
	{
		id: "casual",
		label: "Casual & Everyday"
	}
];
var POSE_STANCES = [
	{
		id: "all",
		label: "All Stances"
	},
	{
		id: "standing",
		label: "Standing"
	},
	{
		id: "sitting",
		label: "Sitting"
	},
	{
		id: "kneeling",
		label: "Kneeling"
	},
	{
		id: "crouching",
		label: "Crouching"
	},
	{
		id: "reclining",
		label: "Reclining"
	},
	{
		id: "dynamic",
		label: "Dynamic"
	}
];
var POSE_LIBRARY = [
	{
		id: "kng-guard-low",
		name: "Low Blade Guard",
		subtitle: "Combat Ready · Two-Handed Guard",
		category: "knights",
		stance: "dynamic",
		posture: "Combat ready stance, knees deeply bent, two hands gripping broadsword angled forward at waist level, eyes fixed on opponent.",
		image: "/poses/pose_knight_01.jpg",
		props: ["broadsword"],
		tags: [
			"knight",
			"sword",
			"guard",
			"combat",
			"two-handed",
			"battle"
		]
	},
	{
		id: "kng-shoulder-blade",
		name: "Blade on Shoulder",
		subtitle: "Confident Heroic · Broadsword Rest",
		category: "knights",
		stance: "standing",
		posture: "Standing tall and confident, heavy broadsword resting casually across right shoulder, left arm loose at side, chin tilted up.",
		image: "/poses/pose_knight_02.jpg",
		props: ["greatsword", "broadsword"],
		tags: [
			"knight",
			"sword",
			"shoulder",
			"confident",
			"heroic",
			"warrior"
		]
	},
	{
		id: "kng-fealty-kneel",
		name: "Knight's Vigil Fealty",
		subtitle: "Sacred Oath · Sword Planted",
		category: "knights",
		stance: "kneeling",
		posture: "Kneeling solemnly on one knee, two hands resting atop pommel of sword planted vertically into the ground, head bowed in quiet reverence.",
		image: "/poses/pose_knight_03.jpg",
		props: ["longsword"],
		tags: [
			"knight",
			"kneel",
			"oath",
			"fealty",
			"vigil",
			"sword",
			"reverence"
		]
	},
	{
		id: "kng-shield-wall",
		name: "Shield & Blade Guard",
		subtitle: "Defensive Braced · Heater Shield",
		category: "knights",
		stance: "standing",
		posture: "Defensive combat stance, heater shield braced forward in left hand, arming sword held ready at hip in right hand, weight balanced.",
		image: "/poses/pose_knight_04.jpg",
		props: ["arming sword", "heater shield"],
		tags: [
			"knight",
			"shield",
			"sword",
			"defensive",
			"armor",
			"guard"
		]
	},
	{
		id: "kng-crouch-parry",
		name: "Low Crouch Parry",
		subtitle: "Evasive Ready · Angled Blade",
		category: "knights",
		stance: "crouching",
		posture: "Low centered battle crouch, torso leaned forward, two hands guiding sword in angled defensive cross-parry, weight grounded.",
		image: "/poses/pose_knight_05.jpg",
		props: ["broadsword"],
		tags: [
			"knight",
			"crouch",
			"parry",
			"defensive",
			"combat"
		]
	},
	{
		id: "kng-hand-on-hilt",
		name: "Hand on Scabbard Hilt",
		subtitle: "Guarded Stride · Blade at Hip",
		category: "knights",
		stance: "standing",
		posture: "Standing upright in formal stance, left hand resting ready on sword hilt sheathed at hip, right hand relaxed on waist.",
		image: "/poses/pose_knight_06.jpg",
		props: ["sheathed longsword"],
		tags: [
			"knight",
			"sheath",
			"hilt",
			"formal",
			"guard",
			"standing"
		]
	},
	{
		id: "kng-forward-stride",
		name: "Battlefield Walk",
		subtitle: "Approaching Stride · Blade in Hand",
		category: "knights",
		stance: "standing",
		posture: "Walking forward with purposeful stride, drawn sword held loosely down in right hand pointing back, resolute gaze ahead.",
		image: "/poses/pose_knight_07.jpg",
		props: ["broadsword"],
		tags: [
			"knight",
			"stride",
			"walk",
			"sword",
			"determined"
		]
	},
	{
		id: "kng-overhead-strike",
		name: "Overhead High Guard (Vom Tag)",
		subtitle: "High Guard · Two-Handed Strike",
		category: "knights",
		stance: "standing",
		posture: "Two-handed longsword raised horizontally above helmeted head in high guard, shoulders locked, ready for downward cleave.",
		image: "/poses/pose_knight_08.jpg",
		props: ["two-handed greatsword"],
		tags: [
			"knight",
			"overhead",
			"high guard",
			"vom tag",
			"strike",
			"greatsword"
		]
	},
	{
		id: "kng-dueling-guard",
		name: "Dueling Diagonal Guard",
		subtitle: "Precision Guard · Extended Blade",
		category: "knights",
		stance: "dynamic",
		posture: "Classic fencing duel stance, sword angled diagonally upward across chest line, lead foot forward, rear leg braced.",
		image: "/poses/pose_knight_09.jpg",
		props: ["dueling sword", "longsword"],
		tags: [
			"knight",
			"duel",
			"fencing",
			"guard",
			"combat"
		]
	},
	{
		id: "art-contrapposto",
		name: "Classical Contrapposto",
		subtitle: "Marble Sculpture · Renaissance Balance",
		category: "paintings",
		stance: "standing",
		posture: "Classical Italian Renaissance contrapposto stance, weight shifted onto left hip, right arm on hip, head turned gracefully in serene contemplation.",
		image: "/poses/pose_art_01.jpg",
		tags: [
			"fine art",
			"contrapposto",
			"classical",
			"renaissance",
			"marble",
			"sculpture",
			"statue"
		]
	},
	{
		id: "art-hand-on-heart",
		name: "Hand Over Heart",
		subtitle: "Devotional Piety · Modest Gaze",
		category: "paintings",
		stance: "standing",
		posture: "Standing tall in devotional posture, right palm placed softly over the heart and breast, left hand resting at side, gentle solemn gaze.",
		image: "/poses/pose_art_02.jpg",
		tags: [
			"fine art",
			"devotion",
			"hand on heart",
			"piety",
			"portrait",
			"classical"
		]
	},
	{
		id: "art-thinker-rodin",
		name: "The Thinker (Le Penseur)",
		subtitle: "Philosophical Weight · Knuckles on Chin",
		category: "paintings",
		stance: "sitting",
		posture: "Seated hunched forward in deep philosophical contemplation, right elbow resting on left knee, chin resting firmly on folded knuckles.",
		image: "/poses/pose_art_03.jpg",
		props: ["stone block"],
		tags: [
			"fine art",
			"thinker",
			"rodin",
			"philosophical",
			"contemplation",
			"brooding"
		]
	},
	{
		id: "art-chiaroscuro-turn",
		name: "Chiaroscuro Over-Shoulder",
		subtitle: "Vermeer Portrait · Head Turn",
		category: "paintings",
		stance: "standing",
		posture: "Back turned almost three-quarters to the viewer, head turned over bare shoulder with wide curious eyes catching the key light.",
		image: "/poses/pose_art_04.jpg",
		tags: [
			"fine art",
			"vermeer",
			"chiaroscuro",
			"pearl earring",
			"over shoulder",
			"portrait"
		]
	},
	{
		id: "art-monarch-throne",
		name: "Monarch Sovereign Seat",
		subtitle: "Regal Authority · Hands on Armrests",
		category: "paintings",
		stance: "sitting",
		posture: "Seated dead-center in high-backed throne armchair, spine perfectly straight, palms resting flat and commanding upon the wooden armrests.",
		image: "/poses/pose_art_05.jpg",
		props: ["carved wooden armchair"],
		tags: [
			"fine art",
			"monarch",
			"throne",
			"regal",
			"royalty",
			"seated",
			"commanding"
		]
	},
	{
		id: "art-mona-lisa-hands",
		name: "Serene Clasped Hands",
		subtitle: "Mona Lisa Grace · Hands in Lap",
		category: "paintings",
		stance: "sitting",
		posture: "Seated turned at three-quarter angle, one hand resting gently over the other wrist in lap, serene posture with subtle enigmatic smile.",
		image: "/poses/pose_art_06.jpg",
		props: ["wooden chair"],
		tags: [
			"fine art",
			"mona lisa",
			"clasped hands",
			"lap",
			"serene",
			"renaissance"
		]
	},
	{
		id: "art-reader-book",
		name: "The Solitary Reader",
		subtitle: "Gentle Focus · Book in Hands",
		category: "paintings",
		stance: "sitting",
		posture: "Seated sideways on wooden chair, head bowed in quiet concentration, hands holding open vintage book gently on lap.",
		image: "/poses/pose_art_07.jpg",
		props: ["vintage bound book", "wooden chair"],
		tags: [
			"fine art",
			"reader",
			"book",
			"reading",
			"quiet",
			"window light"
		]
	},
	{
		id: "art-candle-bearer",
		name: "Chiaroscuro Candle Bearer",
		subtitle: "Caravaggio Drama · Single Flame",
		category: "paintings",
		stance: "standing",
		posture: "Holding burning candle in brass holder raised at shoulder height, other hand cupping the flame, warm upward light carving facial features.",
		image: "/poses/pose_art_08.jpg",
		props: ["brass candlestick holder with burning candle"],
		tags: [
			"fine art",
			"candle",
			"caravaggio",
			"flame",
			"chiaroscuro",
			"dramatic"
		]
	},
	{
		id: "art-classical-odalisque",
		name: "Classical Reclining Odalisque",
		subtitle: "Sensual Recline · Propped Elbow",
		category: "paintings",
		stance: "reclining",
		posture: "Lying on right side on velvet chaise, head propped comfortably in right palm with elbow planted, legs extended in gentle curve.",
		image: "/poses/pose_art_09.jpg",
		tags: [
			"fine art",
			"odalisque",
			"reclining",
			"chaise",
			"classical",
			"sensual"
		]
	},
	{
		id: "pho-beauty-jawline",
		name: "Beauty Frame Jawline",
		subtitle: "Editorial Beauty · Fingertips on Cheeks",
		category: "modeling",
		stance: "standing",
		posture: "Hands framing face symmetrically, delicate fingertips grazing cheekbones and jawline, elbows tucked close, direct magnetic eye contact.",
		image: "/poses/pose_photo_01.jpg",
		tags: [
			"photo shoot",
			"beauty",
			"jawline",
			"hands on face",
			"editorial",
			"close-up"
		]
	},
	{
		id: "pho-collar-adjust",
		name: "Tailored Lapel Hold",
		subtitle: "Sharp Elegance · Lapel Adjustment",
		category: "modeling",
		stance: "standing",
		posture: "Both hands holding the peak lapels of a tailored suit blazer, chest lifted, looking forward with intense focused expression.",
		image: "/poses/pose_photo_02.jpg",
		props: ["tailored blazer jacket"],
		tags: [
			"photo shoot",
			"collar",
			"lapel",
			"suit",
			"sharp",
			"tailored"
		]
	},
	{
		id: "pho-tall-stool-perch",
		name: "Tall Stool Rung Hook",
		subtitle: "Studio High Stool · Asymmetric Legs",
		category: "modeling",
		stance: "sitting",
		posture: "Perched high on tall dark wooden studio stool, one foot hooked onto lower rung, other leg hanging long toward floor, hands resting on thighs.",
		image: "/poses/pose_photo_03.jpg",
		props: ["tall dark studio stool"],
		tags: [
			"photo shoot",
			"stool",
			"perch",
			"studio",
			"long legs",
			"fashion"
		]
	},
	{
		id: "pho-key-light-tilt",
		name: "Looking Up to Key Light",
		subtitle: "Elongated Neck · High Key Gaze",
		category: "modeling",
		stance: "standing",
		posture: "Torso angled slightly away, head tilted up toward overhead softbox light, neck gracefully elongated, dreamy elevated gaze.",
		image: "/poses/pose_photo_04.jpg",
		tags: [
			"photo shoot",
			"looking up",
			"key light",
			"neck",
			"profile",
			"beauty"
		]
	},
	{
		id: "pho-coat-spin",
		name: "Billowing Coat Spin",
		subtitle: "Dynamic Swish · Motion Flair",
		category: "modeling",
		stance: "dynamic",
		posture: "Captured mid-turn in dynamic spin, arms outstretched, long tailored overcoat billowing out dramatically in sweeping motion arc.",
		image: "/poses/pose_photo_05.jpg",
		props: ["billowing tailored trench coat"],
		tags: [
			"photo shoot",
			"coat",
			"spin",
			"dynamic",
			"movement",
			"fashion"
		]
	},
	{
		id: "pho-back-shoulder-drop",
		name: "Back View Shoulder Drop",
		subtitle: "Back Contour · Three-Quarter Head Turn",
		category: "modeling",
		stance: "standing",
		posture: "Back facing the camera, right shoulder dropped slightly, head turned to the side showing sculpted jawline in profile, arms relaxed.",
		image: "/poses/pose_photo_06.jpg",
		tags: [
			"photo shoot",
			"back view",
			"profile",
			"shoulder",
			"minimalist"
		]
	},
	{
		id: "pho-hands-behind-back",
		name: "Hands Clasped Behind Back",
		subtitle: "Poised Formal · Shoulders Pinned Back",
		category: "modeling",
		stance: "standing",
		posture: "Standing erect and disciplined, hands clasped behind lower back, shoulders pinned back with wide open collarbone, regal posture.",
		image: "/poses/pose_photo_07.jpg",
		tags: [
			"photo shoot",
			"hands behind back",
			"disciplined",
			"poised",
			"posture"
		]
	},
	{
		id: "pho-studio-wall-lean",
		name: "Studio Wall Lean",
		subtitle: "Casual Architectural · Low Crossed Arms",
		category: "modeling",
		stance: "standing",
		posture: "Leaning back against seamless studio wall, arms crossed low over waist, one knee bent with foot resting back flat against wall.",
		image: "/poses/pose_photo_08.jpg",
		tags: [
			"photo shoot",
			"wall lean",
			"crossed arms",
			"foot on wall",
			"cool"
		]
	},
	{
		id: "pho-knees-to-chest",
		name: "Knees Hugged to Chest",
		subtitle: "Intimate Floor Sit · Wrapped Arms",
		category: "modeling",
		stance: "sitting",
		posture: "Seated on studio floor, knees pulled tight against chest, arms wrapped securely around shins, chin resting softly near knees.",
		image: "/poses/pose_photo_09.jpg",
		tags: [
			"photo shoot",
			"floor",
			"knees to chest",
			"hug",
			"intimate",
			"vulnerable"
		]
	},
	{
		id: "cin-windowsill-gaze",
		name: "Rainy Windowsill Perch",
		subtitle: "Melancholic City · Knee Pulled Up",
		category: "cinematic",
		stance: "sitting",
		posture: "Seated sideways inside deep wooden window frame, one knee pulled up with hands clasped around knee, gazing out into the city rain.",
		image: "/poses/pose_cine_01.jpg",
		props: ["wooden window frame"],
		tags: [
			"cinematic",
			"windowsill",
			"rain",
			"window",
			"melancholic",
			"city"
		]
	},
	{
		id: "cin-cliff-edge-wind",
		name: "Windswept Cliff Precipice",
		subtitle: "Heroic Overlook · Billowing Cloak",
		category: "cinematic",
		stance: "standing",
		posture: "Standing atop rugged rocky precipice, lead foot braced forward, ragged cloak whipping wildly in gale-force mountain winds.",
		image: "/poses/pose_cine_02.jpg",
		props: ["weathered wool cloak", "rocky cliff ledge"],
		tags: [
			"cinematic",
			"cliff",
			"overlook",
			"wind",
			"cloak",
			"heroic",
			"epic"
		]
	},
	{
		id: "cin-tavern-table-lean",
		name: "Tavern Table Confrontation",
		subtitle: "Intense Lean · Hands Flat on Wood",
		category: "cinematic",
		stance: "standing",
		posture: "Standing hunched forward over heavy rustic wooden table, both palms slammed flat against tabletop, fierce menacing eye contact.",
		image: "/poses/pose_cine_03.jpg",
		props: ["rustic wooden tavern table"],
		tags: [
			"cinematic",
			"tavern",
			"table",
			"confrontation",
			"intense",
			"lean"
		]
	},
	{
		id: "cin-water-reflection",
		name: "Touching Water Reflection",
		subtitle: "Quiet Lake Edge · Rippling Surface",
		category: "cinematic",
		stance: "kneeling",
		posture: "Kneeling on stone bank at water's edge, one arm extended downward with fingertips breaking the calm surface, watching rippling reflection.",
		image: "/poses/pose_cine_04.jpg",
		props: ["stone lake bank"],
		tags: [
			"cinematic",
			"water",
			"reflection",
			"lake",
			"ripples",
			"touch"
		]
	},
	{
		id: "cin-silhouette-walk",
		name: "Noir Silhouette Glancing Back",
		subtitle: "Dark Alleyway · Rim Light Contour",
		category: "cinematic",
		stance: "standing",
		posture: "Walking away into dramatic shadow, body in full dark silhouette with subtle rim light outline, head turned looking back over shoulder.",
		image: "/poses/pose_cine_05.jpg",
		tags: [
			"cinematic",
			"noir",
			"silhouette",
			"shadow",
			"glance",
			"mystery"
		]
	},
	{
		id: "cin-wounded-pillar",
		name: "Wounded Warrior Pillar Rest",
		subtitle: "Exhausted Battle · Head on Stone",
		category: "cinematic",
		stance: "standing",
		posture: "Leaning heavily against vertical stone pillar, forehead resting on stone with elbow braced, sword planted in earth bearing body weight.",
		image: "/poses/pose_cine_06.jpg",
		props: ["cracked stone pillar", "battle sword"],
		tags: [
			"cinematic",
			"wounded",
			"warrior",
			"pillar",
			"exhausted",
			"sword"
		]
	},
	{
		id: "cin-wristwatch-cuff",
		name: "Checking Watch at Cuff",
		subtitle: "Tense Arrival · Checking Time",
		category: "cinematic",
		stance: "standing",
		posture: "Paused in doorway, left wrist turned inward checking wristwatch dial, right hand lightly brushing suit cuff, calculating expression.",
		image: "/poses/pose_cine_07.jpg",
		props: ["luxury wristwatch", "doorway"],
		tags: [
			"cinematic",
			"watch",
			"cuff",
			"spy",
			"tension",
			"suit"
		]
	},
	{
		id: "cin-ranger-tracks",
		name: "Ranger Scout Tracking",
		subtitle: "Low Ground Crouch · Examining Trail",
		category: "cinematic",
		stance: "crouching",
		posture: "Crouched low to dirt path, one hand touching disturbed earth examining subtle tracks, body balanced and ready to spring.",
		image: "/poses/pose_cine_08.jpg",
		tags: [
			"cinematic",
			"ranger",
			"scout",
			"tracking",
			"crouch",
			"earth"
		]
	},
	{
		id: "cin-rain-trenchcoat",
		name: "Rain Drenched Trench Coat",
		subtitle: "Heavy Rain · Collar Turned Up",
		category: "cinematic",
		stance: "standing",
		posture: "Standing under driving downpour, collar of heavy trench coat turned up high, hands buried in deep pockets, chin tucked low.",
		image: "/poses/pose_cine_09.jpg",
		props: ["heavy trench coat"],
		tags: [
			"cinematic",
			"rain",
			"trench coat",
			"noir",
			"downpour",
			"street"
		]
	},
	{
		id: "act-aerial-kick",
		name: "Flying Aerial Side Kick",
		subtitle: "Martial Arts · Mid-Air Extension",
		category: "action",
		stance: "dynamic",
		posture: "Suspended mid-air in flying side kick, striking leg locked straight, arms out for counter-balance, motion dust trailing.",
		image: "/poses/pose_action_01.jpg",
		tags: [
			"action",
			"kick",
			"flying",
			"martial arts",
			"aerial"
		]
	},
	{
		id: "act-superhero-landing",
		name: "Three-Point Superhero Landing",
		subtitle: "Impact Landing · Fist to Ground",
		category: "action",
		stance: "crouching",
		posture: "Low three-point ground impact landing, one fist smashed onto cracked ground, other arm trailing back, head snapped up.",
		image: "/poses/pose_action_02.jpg",
		tags: [
			"action",
			"superhero landing",
			"fist to ground",
			"crouch",
			"impact"
		]
	},
	{
		id: "act-horse-stance-push",
		name: "Martial Arts Palm Strike",
		subtitle: "Deep Horse Stance · Double Palms",
		category: "action",
		stance: "dynamic",
		posture: "Deep martial arts horse stance, wide spread legs, both palms thrusting forcefully forward with focused energy, core braced.",
		image: "/poses/pose_action_03.jpg",
		tags: [
			"action",
			"martial arts",
			"horse stance",
			"palm strike",
			"kung fu"
		]
	},
	{
		id: "act-bow-draw",
		name: "Archer Drawn Bowstring",
		subtitle: "Full Draw · Sighting Target",
		category: "action",
		stance: "standing",
		posture: "Standing in archery stance, longbow held arm extended with drawn bowstring pulled taut to cheek, eye narrowed on target.",
		image: "/poses/pose_action_04.jpg",
		props: ["recurve longbow", "drawn arrow"],
		tags: [
			"action",
			"archer",
			"bow",
			"arrow",
			"aiming"
		]
	},
	{
		id: "act-spell-channel",
		name: "Magic Energy Channel",
		subtitle: "Arcane Thrust · Glowing Hands",
		category: "action",
		stance: "dynamic",
		posture: "Legs braced in athletic stance, one arm thrust forward channeling crackling ethereal energy from open palm, other arm swept back.",
		image: "/poses/pose_action_05.jpg",
		tags: [
			"action",
			"magic",
			"spellcasting",
			"energy",
			"channeling"
		]
	},
	{
		id: "act-dodge-roll",
		name: "Evasive Combat Roll",
		subtitle: "Acrobatic Roll · Tucked Limbs",
		category: "action",
		stance: "dynamic",
		posture: "Mid-tumble evasive combat roll across ground, knees tucked tight, body rotating to dodge incoming strike.",
		image: "/poses/pose_action_06.jpg",
		tags: [
			"action",
			"roll",
			"evasive",
			"acrobatic",
			"tumble"
		]
	},
	{
		id: "act-forward-sprint",
		name: "Full Speed Sprint",
		subtitle: "Explosive Burst · Forward Lean",
		category: "action",
		stance: "dynamic",
		posture: "Exploding into forward sprint, torso angled sharply forward, fists pumping, heels kicking up dust behind.",
		image: "/poses/pose_action_07.jpg",
		tags: [
			"action",
			"sprint",
			"run",
			"fast",
			"athletic"
		]
	},
	{
		id: "act-twin-blade-guard",
		name: "Twin Daggers Ready",
		subtitle: "Assassin Stance · Dual Knives",
		category: "action",
		stance: "dynamic",
		posture: "Low centered assassin crouch, dual daggers held reversed crossing in front of abdomen, stealthy intense gaze.",
		image: "/poses/pose_action_08.jpg",
		props: ["twin daggers"],
		tags: [
			"action",
			"assassin",
			"daggers",
			"twin blades",
			"stealth"
		]
	},
	{
		id: "act-floating-lotus",
		name: "Levitating Meditation",
		subtitle: "Mystic Levitation · Floating Lotus",
		category: "action",
		stance: "dynamic",
		posture: "Floating weightlessly in mid-air in full lotus meditation, hands resting palm-up in mudra position on knees, glowing aura.",
		image: "/poses/pose_action_09.jpg",
		tags: [
			"action",
			"levitating",
			"floating",
			"lotus",
			"meditation",
			"mystic"
		]
	},
	{
		id: "act-high-leg-kick",
		name: "Vertical Leg Split Kick",
		subtitle: "Gymnastic Flexibility · I-Shape",
		category: "action",
		stance: "dynamic",
		posture: "Standing balanced on one foot, other leg extended straight vertically into high split kick, hand holding raised foot, arm out wide.",
		image: "/poses/pose_anime_p008.jpg",
		tags: [
			"action",
			"kick",
			"split",
			"gymnastics",
			"flexibility"
		]
	},
	{
		id: "sit-cube-lean-forward",
		name: "Seated Forward Lean",
		subtitle: "Hands on Knees · Torso Hinged",
		category: "sitting",
		stance: "sitting",
		posture: "Seated on high stool, elbows resting on knees, torso hinged forward with engaged posture, intense eye contact.",
		image: "/poses/pose_3d_05.jpg",
		props: ["studio stool"],
		tags: [
			"sitting",
			"stool",
			"lean",
			"intense",
			"portrait"
		]
	},
	{
		id: "sit-legs-crossed-box",
		name: "Crossed Leg Stool Perch",
		subtitle: "One Leg Over Knee · Hand on Head",
		category: "sitting",
		stance: "sitting",
		posture: "Seated on edge of white cube, one knee crossed high over the other, one arm raised touching head, torso upright and relaxed.",
		image: "/poses/pose_3d_03.jpg",
		props: ["white posing cube"],
		tags: [
			"sitting",
			"crossed legs",
			"cube",
			"glamour",
			"perch"
		]
	},
	{
		id: "sit-hands-on-box-lean",
		name: "Hands on Box Forward Lean",
		subtitle: "Standing Lean · Hands on Posing Cube",
		category: "sitting",
		stance: "standing",
		posture: "Standing tall, leaning forward with palms planted flat on tall posing block, spine straight, one leg braced back on toes.",
		image: "/poses/pose_3d_01.jpg",
		props: ["tall posing block"],
		tags: [
			"standing",
			"lean",
			"hands on block",
			"arching",
			"athletic"
		]
	},
	{
		id: "sit-bent-over-box-rear",
		name: "Bent Over Box Rear View",
		subtitle: "Back to Camera · Hands on Block",
		category: "sitting",
		stance: "standing",
		posture: "Back facing camera, leaning forward over posing block with hands on top surface, arched back, heels raised slightly.",
		image: "/poses/pose_3d_06.jpg",
		props: ["posing block"],
		tags: [
			"standing",
			"bent over",
			"back view",
			"contour"
		],
		adult: true
	},
	{
		id: "sit-floor-arm-prop",
		name: "Floor Recline Arm Prop",
		subtitle: "Floor Seated · Knee Raised",
		category: "sitting",
		stance: "reclining",
		posture: "Seated on clean floor, leaning back on one straight arm, other knee raised with hand resting on knee, torso open to camera.",
		image: "/poses/pose_3d_09.jpg",
		tags: [
			"floor",
			"reclining",
			"arm prop",
			"relaxed"
		]
	},
	{
		id: "rec-belly-feet-up",
		name: "Belly Rest Feet Crossed",
		subtitle: "Playful Chin Rest · Feet in Air",
		category: "reclining",
		stance: "reclining",
		posture: "Lying flat on stomach, chin propped in palm with elbow planted, feet bent up in the air with ankles softly crossed.",
		image: "/poses/pose_3d_07.jpg",
		tags: [
			"floor",
			"belly",
			"chin rest",
			"feet up",
			"playful"
		]
	},
	{
		id: "rec-all-fours-arch",
		name: "All Fours Arch",
		subtitle: "Hands and Knees · Arched Spine",
		category: "reclining",
		stance: "kneeling",
		posture: "On hands and knees on the floor, spine subtly arched, head turned toward the camera lens, shoulders broad.",
		image: "/poses/pose_3d_04.jpg",
		tags: [
			"floor",
			"all-fours",
			"hands and knees",
			"arch"
		],
		adult: true
	},
	{
		id: "rec-crawling-forward",
		name: "Crawling Floor Advance",
		subtitle: "Low to Floor · Crawl Forward",
		category: "reclining",
		stance: "reclining",
		posture: "Low to the ground on elbows and knees, crawling forward with head up, shoulders engaged, legs extended back.",
		image: "/poses/pose_3d_08.jpg",
		tags: [
			"floor",
			"crawl",
			"low",
			"dynamic"
		],
		adult: true
	},
	{
		id: "fnt-staff-summon",
		name: "Staff Ground Summon",
		subtitle: "Summoner Ritual · Staff Planted",
		category: "fantasy",
		stance: "standing",
		posture: "Both hands gripping tall gnarled wizard staff planted before them, robes billowing, chanting with glowing arcane aura.",
		props: ["carved wooden wizard staff"],
		tags: [
			"fantasy",
			"mage",
			"staff",
			"summoning",
			"wizard"
		]
	},
	{
		id: "fnt-spell-circle-cast",
		name: "Two-Handed Spell Circle",
		subtitle: "Runic Circle · Palms Outward",
		category: "fantasy",
		stance: "standing",
		posture: "Standing with feet planted wide, both palms pushed forward at chest height framing glowing holographic runic magic circle.",
		tags: [
			"fantasy",
			"magic",
			"spell circle",
			"rune",
			"caster"
		]
	},
	{
		id: "fnt-kneeling-prayer",
		name: "Cleric Sacred Prayer",
		subtitle: "Divine Supplication · Clasped Hands",
		category: "fantasy",
		stance: "kneeling",
		posture: "Kneeling on both knees, hands tightly clasped before heart in solemn prayer, eyes closed, gentle divine light from above.",
		tags: [
			"fantasy",
			"cleric",
			"prayer",
			"holy",
			"kneeling"
		]
	},
	{
		id: "cas-coffee-two-hands",
		name: "Two-Handed Mug Sip",
		subtitle: "Cozy Warmth · Steam Rising",
		category: "casual",
		stance: "sitting",
		posture: "Seated comfortably, holding steaming ceramic mug with both hands cupped around warmth, blowing softly at surface.",
		props: ["ceramic coffee mug"],
		tags: [
			"casual",
			"coffee",
			"mug",
			"cozy",
			"warm"
		]
	},
	{
		id: "cas-hoodie-pockets",
		name: "Hoodie Pockets Stroll",
		subtitle: "Urban Chill · Hands Buried",
		category: "casual",
		stance: "standing",
		posture: "Walking slowly down sidewalk, both hands tucked into hoodie front pouch pocket, hood pulled up, shoulders slightly slouched.",
		props: ["oversized hoodie"],
		tags: [
			"casual",
			"hoodie",
			"urban",
			"street",
			"chill"
		]
	},
	{
		id: "cas-phone-check",
		name: "Checking Smartphone",
		subtitle: "Everyday Habit · One Hand Screen",
		category: "casual",
		stance: "standing",
		posture: "Standing on one hip, looking down at smartphone held in right hand with thumb scrolling, slight smile on lips.",
		props: ["smartphone"],
		tags: [
			"casual",
			"phone",
			"modern",
			"scrolling",
			"everyday"
		]
	},
	{
		id: "cas-leaning-counter",
		name: "Leaning on Cafe Counter",
		subtitle: "Relaxed Bar · Elbow on Surface",
		category: "casual",
		stance: "standing",
		posture: "Leaning sideways against high wooden counter, one elbow propped on surface supporting weight, smiling conversation posture.",
		props: ["wooden cafe counter"],
		tags: [
			"casual",
			"cafe",
			"counter",
			"bar",
			"talking"
		]
	},
	{
		id: "duo-back-to-back",
		name: "Back-to-Back Combat Guard",
		subtitle: "Two Figures · Mutual Defense",
		category: "couples",
		stance: "dynamic",
		posture: "Two figures standing back-to-back in defensive guard, knees bent, arms raised covering each other's blind spot, alert expressions.",
		image: "/poses/pose_duo_01.jpg",
		tags: [
			"couple",
			"duo",
			"back-to-back",
			"combat",
			"guard",
			"defense",
			"two figures"
		]
	},
	{
		id: "duo-ballroom-dip",
		name: "Dramatic Ballroom Dip",
		subtitle: "Romantic Waltz · Supported Arch",
		category: "couples",
		stance: "dynamic",
		posture: "Romantic dance partner dip, one figure supporting the other by the waist as they arch gracefully backward, hands clasped high.",
		image: "/poses/pose_duo_02.jpg",
		tags: [
			"couple",
			"duo",
			"dance",
			"waltz",
			"ballroom",
			"dip",
			"romantic",
			"arch"
		]
	},
	{
		id: "duo-rescue-carry",
		name: "Heroic Rescue Carry",
		subtitle: "Bridal Lift · In Arms",
		category: "couples",
		stance: "standing",
		posture: "Heroic bridal carry, one figure standing strong holding partner horizontally across arms, partner's arm draped securely around their neck.",
		image: "/poses/pose_duo_03.jpg",
		tags: [
			"couple",
			"duo",
			"carry",
			"rescue",
			"bridal",
			"arms",
			"heroic"
		]
	},
	{
		id: "duo-forehead-touch",
		name: "Intimate Forehead Rest",
		subtitle: "Close Embrace · Foreheads Touching",
		category: "couples",
		stance: "standing",
		posture: "Intimate standing embrace, two figures standing face-to-face with foreheads gently touching, arms wrapped around each other's waist.",
		image: "/poses/pose_duo_04.jpg",
		tags: [
			"couple",
			"duo",
			"intimate",
			"forehead",
			"embrace",
			"love",
			"tender"
		]
	},
	{
		id: "duo-conspiratorial-whisper",
		name: "Conspiratorial Whisper",
		subtitle: "Secret Shared · Hand Shielding",
		category: "couples",
		stance: "standing",
		posture: "Two figures huddled close, one leaning in to whisper into partner's ear with cupped hand shielding lips, partner listening intently.",
		image: "/poses/pose_duo_05.jpg",
		tags: [
			"couple",
			"duo",
			"whisper",
			"secret",
			"spy",
			"conspiracy",
			"huddle"
		]
	},
	{
		id: "duo-side-by-side-stroll",
		name: "Side-by-Side Hand Clasp Stroll",
		subtitle: "Walking Together · Holding Hands",
		category: "couples",
		stance: "standing",
		posture: "Two figures walking forward side-by-side, holding hands with fingers lightly intertwined, turning heads inward with soft smiles.",
		image: "/poses/pose_duo_06.jpg",
		tags: [
			"couple",
			"duo",
			"walk",
			"holding hands",
			"stroll",
			"together"
		]
	},
	{
		id: "duo-seated-shoulder-rest",
		name: "Seated Shoulder Rest",
		subtitle: "Quiet Comfort · Head on Shoulder",
		category: "couples",
		stance: "sitting",
		posture: "Seated close together on floor, one figure leaning their head gently onto partner's shoulder, knees touching in quiet companionship.",
		image: "/poses/pose_duo_07.jpg",
		tags: [
			"couple",
			"duo",
			"shoulder rest",
			"seated",
			"comfort",
			"companionship"
		]
	},
	{
		id: "duo-waltz-spin",
		name: "Dynamic Waltz Spin",
		subtitle: "Raised Arms · Dancing Turn",
		category: "couples",
		stance: "dynamic",
		posture: "Mid-dance twirl, one hand held high overhead as partner spins under the arch, free arms extended for momentum.",
		image: "/poses/pose_duo_08.jpg",
		tags: [
			"couple",
			"duo",
			"dance",
			"waltz",
			"spin",
			"twirl",
			"energy"
		]
	},
	{
		id: "duo-sparring-block",
		name: "Martial Sparring Cross-Block",
		subtitle: "Training Bout · Crossed Forearms",
		category: "couples",
		stance: "dynamic",
		posture: "Two martial artists facing off in training sparring bout, forearms crossed in mutual block, deep stances, focused energy.",
		image: "/poses/pose_duo_09.jpg",
		tags: [
			"couple",
			"duo",
			"sparring",
			"martial arts",
			"training",
			"block",
			"combat"
		]
	},
	{
		id: "art-michelangelo-david",
		name: "Michelangelo's David",
		subtitle: "Renaissance Masterpiece · Contrapposto",
		category: "paintings",
		stance: "standing",
		posture: "Classical heroic contrapposto, weight on right leg with left leg relaxed, head turned sharply left with intense brow, left hand at shoulder holding sling.",
		image: "/poses/pose_art2_01.jpg",
		props: ["leather sling pouch"],
		tags: [
			"fine art",
			"david",
			"michelangelo",
			"statue",
			"contrapposto",
			"classical"
		]
	},
	{
		id: "art-botticelli-venus",
		name: "Botticelli's Birth of Venus",
		subtitle: "Graceful Modesty · S-Curve",
		category: "paintings",
		stance: "standing",
		posture: "Weight bearing on right hip, head tilted gently to the side, one hand resting softly across chest and other shielding thigh in classical modest pose.",
		image: "/poses/pose_art2_02.jpg",
		tags: [
			"fine art",
			"venus",
			"botticelli",
			"renaissance",
			"modesty",
			"beauty"
		]
	},
	{
		id: "art-pieta-lament",
		name: "The Pietà Lamentation",
		subtitle: "Sacred Cradling · Sorrowful Grace",
		category: "paintings",
		stance: "sitting",
		posture: "Seated solemnly with torso bowed forward, both arms curved wide cradling an empty space across lap, solemn expression of quiet grief.",
		image: "/poses/pose_art2_03.jpg",
		tags: [
			"fine art",
			"pieta",
			"michelangelo",
			"lament",
			"grief",
			"sculpture"
		]
	},
	{
		id: "art-winged-victory",
		name: "Winged Victory Stride",
		subtitle: "Triumphant Forward March · Resisting Gale",
		category: "paintings",
		stance: "dynamic",
		posture: "Heroic forward lunge into oncoming wind, torso thrust forward proudly, weight surging onto front foot, drapery pressed tight against body.",
		image: "/poses/pose_art2_04.jpg",
		tags: [
			"fine art",
			"winged victory",
			"samothrace",
			"stride",
			"triumph",
			"sculpture"
		]
	},
	{
		id: "art-caravaggio-calling",
		name: "Caravaggio's Dramatic Gesture",
		subtitle: "Chiaroscuro Calling · Accusing Finger",
		category: "paintings",
		stance: "standing",
		posture: "Standing in high-contrast light, one arm thrust straight forward pointing an accusatory index finger across room, head turned in shock.",
		image: "/poses/pose_art2_05.jpg",
		tags: [
			"fine art",
			"caravaggio",
			"calling",
			"finger point",
			"baroque",
			"chiaroscuro"
		]
	},
	{
		id: "art-napoleon-alps",
		name: "Napoleon at the St. Bernard Pass",
		subtitle: "Heroic Mount · Pointing Upward",
		category: "paintings",
		stance: "dynamic",
		posture: "Rearing posture on horseback, one arm raised high pointing confidently up toward mountain summit, cloak caught in gusting wind.",
		image: "/poses/pose_art2_06.jpg",
		props: ["rearing steed", "billowing cloak"],
		tags: [
			"fine art",
			"napoleon",
			"david",
			"heroic",
			"alps",
			"mount",
			"leader"
		]
	},
	{
		id: "art-degas-ballerina-shoe",
		name: "Degas' Seated Ballerina",
		subtitle: "Slipper Adjustment · Bent Forward",
		category: "paintings",
		stance: "sitting",
		posture: "Seated on wooden bench, torso bent forward over thighs, fingers delicately adjusting satin ribbons of ballet pointe shoe on raised foot.",
		image: "/poses/pose_art2_07.jpg",
		props: ["wooden bench", "satin ballet pointe shoes"],
		tags: [
			"fine art",
			"degas",
			"ballerina",
			"ballet",
			"shoe",
			"seated",
			"impressionist"
		]
	},
	{
		id: "art-ophelia-reverie",
		name: "Ophelia's Serene Surrender",
		subtitle: "Pre-Raphaelite · Palms Upturned",
		category: "paintings",
		stance: "reclining",
		posture: "Lying flat on back in tranquil surrender, arms floating loosely outward with palms upturned, head tilted back, serene expression.",
		image: "/poses/pose_art2_08.jpg",
		tags: [
			"fine art",
			"ophelia",
			"pre-raphaelite",
			"floating",
			"surrender",
			"water"
		]
	},
	{
		id: "art-rodin-the-kiss",
		name: "Rodin's The Kiss",
		subtitle: "Intertwined Embrace · Carved Stone",
		category: "paintings",
		stance: "sitting",
		posture: "Two figures seated entwined upon carved rock pedestal, arms wrapped around neck and waist in passionate embrace, sculpted contours.",
		image: "/poses/pose_art2_09.jpg",
		props: ["carved stone pedestal"],
		tags: [
			"fine art",
			"rodin",
			"the kiss",
			"sculpture",
			"embrace",
			"lovers"
		]
	},
	{
		id: "cin-cyberpunk-alley",
		name: "Cyberpunk Alley Lean",
		subtitle: "Neon Shadows · Hands in Hooded Coat",
		category: "cinematic",
		stance: "standing",
		posture: "Leaning back casually against wet alleyway brick wall, deep oversized hoodie pulled up over brow, both hands buried in pockets.",
		image: "/poses/pose_scene_01.jpg",
		props: ["oversized techwear hoodie", "brick wall"],
		tags: [
			"cinematic",
			"cyberpunk",
			"alley",
			"hoodie",
			"neon",
			"cool"
		]
	},
	{
		id: "cin-library-ladder",
		name: "Library Ladder Reach",
		subtitle: "Rolling Ladder · High Shelf Tome",
		category: "cinematic",
		stance: "standing",
		posture: "Perched high on rolling wooden library ladder with one leg bent on rung, other arm fully extended upward pulling heavy antique tome.",
		image: "/poses/pose_scene_02.jpg",
		props: [
			"wooden rolling ladder",
			"antique book",
			"tall bookcase"
		],
		tags: [
			"cinematic",
			"library",
			"ladder",
			"books",
			"reading",
			"scholar"
		]
	},
	{
		id: "cin-diner-booth",
		name: "Late Night Diner Booth",
		subtitle: "Rain Streaked Window · Coffee Steam",
		category: "cinematic",
		stance: "sitting",
		posture: "Seated in diner booth, both hands cupped around steaming ceramic coffee mug on laminate table, gazing quietly out rain-streaked window.",
		image: "/poses/pose_scene_03.jpg",
		props: [
			"ceramic coffee mug",
			"diner booth table",
			"rainy window"
		],
		tags: [
			"cinematic",
			"diner",
			"coffee",
			"window",
			"rain",
			"melancholy"
		]
	},
	{
		id: "cin-campfire-crouch",
		name: "Campfire Embers Warmth",
		subtitle: "Wilderness Squat · Warming Palms",
		category: "cinematic",
		stance: "crouching",
		posture: "Low balanced campfire squat, elbows resting near knees, both hands held open hovering over warm glowing embers of stone pit.",
		image: "/poses/pose_scene_04.jpg",
		props: ["stone ring campfire", "glowing wood embers"],
		tags: [
			"cinematic",
			"campfire",
			"fire",
			"wilderness",
			"warmth",
			"crouch"
		]
	},
	{
		id: "cin-craftsman-loupe",
		name: "Watchmaker's Focus",
		subtitle: "Workbench Hunch · Jeweler's Loupe",
		category: "cinematic",
		stance: "sitting",
		posture: "Seated hunched closely over wooden workbench, jeweler's magnifying loupe to eye, delicate hands poised with tweezers over intricate gears.",
		image: "/poses/pose_scene_05.jpg",
		props: [
			"jeweler's loupe",
			"artisan workbench",
			"precision tweezers"
		],
		tags: [
			"cinematic",
			"craftsman",
			"watchmaker",
			"workbench",
			"focus",
			"micro"
		]
	},
	{
		id: "cin-detective-clue",
		name: "Detective Crime Scene Knee",
		subtitle: "Chalk Line Inspect · Note Pad",
		category: "cinematic",
		stance: "kneeling",
		posture: "Kneeling on one knee on hardwood floor examining subtle clue, small spiral notebook in one hand, pen poised ready to write.",
		image: "/poses/pose_scene_06.jpg",
		props: ["spiral notepad", "metal ballpoint pen"],
		tags: [
			"cinematic",
			"detective",
			"crime scene",
			"investigation",
			"notepad",
			"kneel"
		]
	},
	{
		id: "cin-rock-star-mic",
		name: "Rock Concert Mic Tilt",
		subtitle: "Stage Presence · Backbent Vocal",
		category: "cinematic",
		stance: "dynamic",
		posture: "Leaning back with knees bent into passionate vocal, two hands gripping chrome vintage microphone stand, electric guitar strapped low.",
		image: "/poses/pose_scene_07.jpg",
		props: ["vintage chrome microphone stand", "electric guitar"],
		tags: [
			"cinematic",
			"rock star",
			"microphone",
			"guitar",
			"concert",
			"music",
			"stage"
		]
	},
	{
		id: "cin-aviator-descent",
		name: "Aviator Wing Ladder Step",
		subtitle: "Flight Goggles · Stepping Down",
		category: "cinematic",
		stance: "standing",
		posture: "Stepping down metal cockpit ladder, one hand on aircraft ladder rail, other hand pushing leather flight goggles up onto forehead.",
		image: "/poses/pose_scene_08.jpg",
		props: ["leather aviator goggles", "cockpit boarding ladder"],
		tags: [
			"cinematic",
			"aviator",
			"pilot",
			"plane",
			"goggles",
			"ladder"
		]
	},
	{
		id: "cin-stargazer-lawn",
		name: "Grass Stargazer Point",
		subtitle: "Night Sky Wonder · Pointing at Stars",
		category: "cinematic",
		stance: "reclining",
		posture: "Lying flat on back on grassy lawn, one knee bent comfortably, one arm propping head while other points directly up toward the heavens.",
		image: "/poses/pose_scene_09.jpg",
		props: ["grassy field"],
		tags: [
			"cinematic",
			"stargazer",
			"lawn",
			"pointing",
			"stars",
			"recline"
		]
	},
	{
		id: "pho-backward-chair",
		name: "Backward Chair Rest",
		subtitle: "Studio Reversal · Folded Forearms",
		category: "modeling",
		stance: "sitting",
		posture: "Seated straddling wooden studio chair backwards, forearms folded resting across the backrest, direct level gaze into camera.",
		image: "/poses/pose_photo2_01.jpg",
		props: ["wooden studio chair"],
		tags: [
			"modeling",
			"chair",
			"backward",
			"portrait",
			"folded arms",
			"direct gaze"
		]
	},
	{
		id: "pho-coat-over-shoulder",
		name: "Over-the-Shoulder Coat Drape",
		subtitle: "Tailored Chic · Exposed Shoulder",
		category: "modeling",
		stance: "standing",
		posture: "Three-quarter back view, heavy wool coat slipping off one shoulder revealing collarbone, face turned back over shoulder toward lens.",
		image: "/poses/pose_photo2_02.jpg",
		props: ["heavy wool coat"],
		tags: [
			"modeling",
			"coat drape",
			"over shoulder",
			"fashion",
			"high fashion"
		]
	},
	{
		id: "pho-hair-touch-scurve",
		name: "Hair Styling S-Curve",
		subtitle: "Sensual Elegance · Hand in Hair",
		category: "modeling",
		stance: "standing",
		posture: "Graceful S-curve posture, weight shifted to hip, one hand trailing fingers slowly through hair with elbow flared, head tilted softly.",
		image: "/poses/pose_photo2_03.jpg",
		tags: [
			"modeling",
			"hair touch",
			"s-curve",
			"elegance",
			"glamour",
			"beauty"
		]
	},
	{
		id: "pho-floor-cross-legged",
		name: "Floor Cross-Legged Zen",
		subtitle: "Editorial Floor · Ankle Rest",
		category: "modeling",
		stance: "sitting",
		posture: "Sitting cross-legged flat on seamless studio floor, spine upright, hands resting gently atop crossed ankles, calm centered expression.",
		image: "/poses/pose_photo2_04.jpg",
		tags: [
			"modeling",
			"floor",
			"cross-legged",
			"clean",
			"zen",
			"editorial"
		]
	},
	{
		id: "pho-cyc-wall-foot-kick",
		name: "Seamless Wall Foot Rest",
		subtitle: "Effortless Lean · Foot on Cyc Wall",
		category: "modeling",
		stance: "standing",
		posture: "Leaning back flat against white studio cyclorama wall, one sole planted flat behind against wall with knee bent, arms hanging relaxed.",
		image: "/poses/pose_photo2_05.jpg",
		props: ["white studio cyc wall"],
		tags: [
			"modeling",
			"wall lean",
			"foot up",
			"cool",
			"editorial",
			"studio"
		]
	},
	{
		id: "pho-sunglasses-gaze",
		name: "Sunglasses Rim Tip",
		subtitle: "Chic Eyewear · Index Finger Tip",
		category: "modeling",
		stance: "standing",
		posture: "Standing tall, delicate index finger tipping dark sunglasses down the bridge of the nose to look intently over the black acetate rims.",
		image: "/poses/pose_photo2_06.jpg",
		props: ["dark sunglasses"],
		tags: [
			"modeling",
			"sunglasses",
			"glasses",
			"eyewear",
			"portrait",
			"gaze"
		]
	},
	{
		id: "pho-runway-mid-turn",
		name: "Runway Dynamic Turn",
		subtitle: "Catwalk Pivot · Motion Stride",
		category: "modeling",
		stance: "dynamic",
		posture: "Mid-pivot turn at end of fashion catwalk, one leg planted long, torso twisting toward camera with relaxed arms and confident stride.",
		image: "/poses/pose_photo2_07.jpg",
		tags: [
			"modeling",
			"runway",
			"catwalk",
			"turn",
			"pivot",
			"stride"
		]
	},
	{
		id: "pho-profile-collar-fasten",
		name: "Silhouette Collar Pin Adjust",
		subtitle: "Clean Profile · Delicate Hands",
		category: "modeling",
		stance: "standing",
		posture: "Pure 90-degree profile silhouette, fingers poised gracefully at throat fastening an intricate collar pin or necklace clasp, chin lifted.",
		image: "/poses/pose_photo2_08.jpg",
		props: ["collar pin", "necklace"],
		tags: [
			"modeling",
			"profile",
			"silhouette",
			"hands",
			"jewelry",
			"refinement"
		]
	},
	{
		id: "pho-geometric-recline",
		name: "Angular Geometric Recline",
		subtitle: "Floor Posing · Triangular Lines",
		category: "modeling",
		stance: "reclining",
		posture: "Reclining backward on studio floor supported by straight arms behind, knees folded sideways creating striking angular geometric leg lines.",
		image: "/poses/pose_photo2_09.jpg",
		tags: [
			"modeling",
			"geometric",
			"recline",
			"angular",
			"floor",
			"editorial"
		]
	}
];
var CAMERA_CATEGORIES = [
	{
		id: "all",
		label: "All Angles & Optics"
	},
	{
		id: "elevations",
		label: "Camera Elevations"
	},
	{
		id: "framings",
		label: "Framings & Rotations"
	},
	{
		id: "lenses",
		label: "Lenses & Depth of Field"
	}
];
var CAMERA_LIBRARY = [
	{
		id: "ang-eye-level",
		name: "Eye-Level Direct Frontal",
		subtitle: "0° Elevation · Neutral Eye Horizon",
		category: "elevations",
		badge: "0° LEVEL",
		image: "/camera/elev_01.jpg",
		principle: "Eye-level neutral horizontal axis",
		axis: "camera at exact subject center height, 0° elevation, level horizon square-on",
		lens: "50mm natural prime",
		dof: "f/5.6 balanced studio sharpness",
		tags: [
			"camera",
			"eye-level",
			"neutral",
			"frontal",
			"straight-on",
			"standard"
		]
	},
	{
		id: "ang-low-angle",
		name: "Low-Angle Hero View",
		subtitle: "30° Upward Rake · Dominant Stature",
		category: "elevations",
		badge: "+30° LOW",
		image: "/camera/elev_02.jpg",
		principle: "Low-angle heroic upward rake",
		axis: "camera placed below subject center, tilted upward at 30° toward canopy",
		lens: "35mm environmental wide",
		dof: "f/4.0 soft falloff",
		tags: [
			"camera",
			"low-angle",
			"hero",
			"upward",
			"powerful",
			"elevation"
		]
	},
	{
		id: "ang-worms-eye",
		name: "Worm's-Eye Ground View",
		subtitle: "60° Steep Upward · Base to Canopy",
		category: "elevations",
		badge: "+60° WORM",
		image: "/camera/elev_03.jpg",
		principle: "Worm's-eye dramatic ground rake",
		axis: "camera resting directly on floor plane, tilted steeply upward at 60° looking up into undersides of leaves",
		lens: "24mm wide angle",
		dof: "f/8.0 deep ground-to-canopy depth",
		tags: [
			"camera",
			"worms-eye",
			"ground",
			"extreme low",
			"dramatic",
			"perspective"
		]
	},
	{
		id: "ang-high-angle",
		name: "High-Angle Lookdown",
		subtitle: "35° Downward Tilt · Overhead Stature",
		category: "elevations",
		badge: "-35° HIGH",
		image: "/camera/elev_04.jpg",
		principle: "High-angle descriptive lookdown",
		axis: "camera elevated above subject height, tilted downward at 35° capturing pot surface and foliage spread",
		lens: "50mm prime",
		dof: "f/4.0 subtle depth falloff",
		tags: [
			"camera",
			"high-angle",
			"lookdown",
			"descending",
			"elevated",
			"overview"
		]
	},
	{
		id: "ang-birds-eye",
		name: "Bird's-Eye Overhead Vantage",
		subtitle: "65° Steep Downward · Plan View",
		category: "elevations",
		badge: "-65° BIRD",
		image: "/camera/elev_05.jpg",
		principle: "Bird's-eye architectural high view",
		axis: "camera positioned high above subject at 65° downward angle surveying leaf canopy and potting soil",
		lens: "35mm wide-normal",
		dof: "f/5.6 clean depth",
		tags: [
			"camera",
			"birds-eye",
			"high vantage",
			"aerial",
			"downward",
			"overview"
		]
	},
	{
		id: "ang-top-down",
		name: "Top-Down 90° Flat-Lay",
		subtitle: "Pure 90° Nadir · Geometric Star Pattern",
		category: "elevations",
		badge: "90° NADIR",
		image: "/camera/elev_06.jpg",
		principle: "Direct overhead 90° flat-lay zenith",
		axis: "camera placed directly perpendicular overhead at 90°, looking straight down at circular radiating leaves",
		lens: "50mm macro flat-field",
		dof: "f/8.0 edge-to-edge geometric sharpness",
		tags: [
			"camera",
			"top-down",
			"flat-lay",
			"90-degree",
			"zenith",
			"overhead",
			"geometric"
		]
	},
	{
		id: "ang-dutch-angle",
		name: "Dutch Angle / Canted Tilt",
		subtitle: "20° Diagonal Horizon · Dynamic Tension",
		category: "elevations",
		badge: "20° TILT",
		image: "/camera/elev_07.jpg",
		principle: "Canted dutch angle diagonal tilt",
		axis: "camera rolled 20° along horizontal optical axis, creating slanted diagonal horizon and kinetic tension",
		lens: "40mm prime",
		dof: "f/4.0 crisp diagonal plane",
		tags: [
			"camera",
			"dutch angle",
			"canted",
			"tilt",
			"diagonal",
			"tension",
			"cinematic"
		]
	},
	{
		id: "ang-ground-rake",
		name: "Ground-Level Floor Skim",
		subtitle: "Surface Skimming · Pedestal Prominence",
		category: "elevations",
		badge: "0° FLOOR",
		image: "/camera/elev_08.jpg",
		principle: "Surface-level parallel floor rake",
		axis: "camera resting flat on floor surface, horizontal axis skimming the floor plane with prominent base support",
		lens: "28mm wide angle",
		dof: "f/5.6 blurred floor foreground",
		tags: [
			"camera",
			"ground-rake",
			"floor",
			"surface",
			"skimming",
			"low"
		]
	},
	{
		id: "ang-isometric",
		name: "Isometric 30° Axonometric",
		subtitle: "Architectural 30° · Parallel Perspective",
		category: "elevations",
		badge: "30° ISO",
		image: "/camera/elev_09.jpg",
		principle: "Isometric 30° axonometric projection",
		axis: "camera elevated at 30° angle and rotated 45° off-axis, simulated orthographic parallel perspective lines",
		lens: "85mm telephoto flat perspective",
		dof: "f/11.0 deep orthographic sharpness",
		tags: [
			"camera",
			"isometric",
			"axonometric",
			"architectural",
			"30-degree",
			"clean"
		]
	},
	{
		id: "frame-three-quarter",
		name: "Three-Quarter 45° Hero Angle",
		subtitle: "45° Lateral Turn · Dimensional Volume",
		category: "framings",
		badge: "45° TURN",
		image: "/camera/frame_01.jpg",
		principle: "Three-quarter classic portrait angle",
		axis: "camera 45° off front axis, showing both frontal foliage and side depth dimensions",
		lens: "50mm prime",
		dof: "f/4.0 natural separation",
		tags: [
			"framing",
			"three-quarter",
			"45-degree",
			"dimension",
			"classic",
			"turn"
		]
	},
	{
		id: "frame-profile-90",
		name: "Profile 90° Side View",
		subtitle: "Pure 90° Side Angle · Crisp Silhouette",
		category: "framings",
		badge: "90° SIDE",
		image: "/camera/frame_02.jpg",
		principle: "Clean 90° lateral profile view",
		axis: "camera positioned exactly 90° perpendicular to subject facing frame-right, highlighting silhouette",
		lens: "70mm portrait",
		dof: "f/5.6 crisp contours",
		tags: [
			"framing",
			"profile",
			"side view",
			"90-degree",
			"silhouette",
			"contour"
		]
	},
	{
		id: "frame-rear-angle",
		name: "Rear Angle Back View",
		subtitle: "180° Reverse Vantage · Behind Canopy",
		category: "framings",
		badge: "180° BACK",
		image: "/camera/frame_03.jpg",
		principle: "Over-the-back reverse perspective",
		axis: "camera placed behind subject at 180°, framing reverse side of foliage and stem structures",
		lens: "50mm standard",
		dof: "f/4.5 soft studio roll-off",
		tags: [
			"framing",
			"rear view",
			"back",
			"reverse",
			"behind",
			"canopy"
		]
	},
	{
		id: "frame-macro-leaf",
		name: "Macro Botanical Leaf Detail",
		subtitle: "1:1 Macro Reproduction · Vein Textures",
		category: "framings",
		badge: "1:1 MACRO",
		image: "/camera/frame_04.jpg",
		principle: "1:1 macro close-up detail study",
		axis: "extreme macro camera distance, filling 90% of frame with a single perforated monstera leaf, intricate venation",
		lens: "100mm f/2.8 dedicated macro lens",
		dof: "f/2.8 ultra-shallow depth of field, creamy bokeh falloff",
		tags: [
			"framing",
			"macro",
			"close-up",
			"leaf",
			"botanical",
			"texture",
			"detail"
		]
	},
	{
		id: "frame-tight-detail",
		name: "Tight Stem Node & Pot Rim",
		subtitle: "Medium Close-Up · Material Juncture",
		category: "framings",
		badge: "TIGHT MCU",
		image: "/camera/frame_05.jpg",
		principle: "Tight detail medium close-up",
		axis: "camera tightly framed on the organic junction where aerial root nodes emerge from soil at ceramic pot rim",
		lens: "85mm prime",
		dof: "f/2.8 tactile selective focus",
		tags: [
			"framing",
			"tight",
			"detail",
			"close-up",
			"stem",
			"ceramic",
			"texture"
		]
	},
	{
		id: "frame-medium-shot",
		name: "Medium Studio Catalog Shot",
		subtitle: "Classic Medium Framing · Base to Crown",
		category: "framings",
		badge: "MEDIUM MS",
		image: "/camera/frame_06.jpg",
		principle: "Standard medium studio framing",
		axis: "subject framed from pedestal base to top leaf tips, filling 70% of frame with clean studio margins",
		lens: "50mm studio prime",
		dof: "f/5.6 balanced editorial sharpness",
		tags: [
			"framing",
			"medium shot",
			"catalog",
			"studio",
			"balanced",
			"centered"
		]
	},
	{
		id: "frame-wide-environmental",
		name: "Wide Environmental Space",
		subtitle: "Generous Negative Space · Spatial Context",
		category: "framings",
		badge: "WIDE WS",
		image: "/camera/frame_07.jpg",
		principle: "Wide environmental studio composition",
		axis: "camera pulled back 4 meters, framing subject within expansive white minimalist studio gallery space",
		lens: "28mm wide angle",
		dof: "f/8.0 crisp environmental depth",
		tags: [
			"framing",
			"wide",
			"environmental",
			"space",
			"gallery",
			"room",
			"negative space"
		]
	},
	{
		id: "frame-distant-long",
		name: "Distant Long Shot (VLS)",
		subtitle: "Extreme Long Distance · Isolated Form",
		category: "framings",
		badge: "LONG ELS",
		image: "/camera/frame_08.jpg",
		principle: "Very long shot with immense negative space",
		axis: "distant camera vantage, subject occupies only 15% of frame centered in vast tranquil negative white void",
		lens: "35mm prime",
		dof: "f/8.0 deep atmospheric focus",
		tags: [
			"framing",
			"long shot",
			"distant",
			"isolated",
			"negative space",
			"minimalist"
		]
	},
	{
		id: "frame-foreground-peeking",
		name: "Foreground Element Peeking",
		subtitle: "Obscured Layering · Depth Framing",
		category: "framings",
		badge: "LAYERED FG",
		image: "/camera/frame_09.jpg",
		principle: "Over-the-shoulder foreground obscuration",
		axis: "camera shooting through softly blurred green foreground leaves, rack focus locked on main central plant",
		lens: "85mm portrait telephoto",
		dof: "f/1.8 shallow depth with dreamy foreground framing bokeh",
		tags: [
			"framing",
			"foreground",
			"peeking",
			"depth",
			"layers",
			"bokeh",
			"obscuration"
		]
	},
	{
		id: "lens-ultra-wide-14",
		name: "Ultra-Wide 14mm Lens",
		subtitle: "114° Field of View · Dynamic Distortion",
		category: "lenses",
		badge: "14mm f/5.6",
		image: "/camera/lens_01.jpg",
		principle: "Ultra-wide 14mm optical expansion",
		axis: "camera at close range with 14mm ultra-wide optic, subtle barrel perspective divergence emphasizing scale",
		lens: "14mm ultra-wide prime",
		dof: "f/5.6 deep hyperfocal field",
		tags: [
			"optics",
			"lens",
			"14mm",
			"ultra-wide",
			"dynamic",
			"distortion",
			"expansion"
		]
	},
	{
		id: "lens-wide-24",
		name: "Wide-Angle 24mm Editorial",
		subtitle: "84° Field of View · Foreground Emphasis",
		category: "lenses",
		badge: "24mm f/5.6",
		image: "/camera/lens_02.jpg",
		principle: "24mm architectural wide perspective",
		axis: "24mm wide lens positioned close, emphasizing cylindrical pedestal volume and spreading foliage",
		lens: "24mm f/1.4 GM wide-angle prime",
		dof: "f/5.6 sharp subject with soft environmental falloff",
		tags: [
			"optics",
			"lens",
			"24mm",
			"wide-angle",
			"editorial",
			"architectural"
		]
	},
	{
		id: "lens-classic-35",
		name: "Classic 35mm Documentary",
		subtitle: "63° Field of View · Authentic Context",
		category: "lenses",
		badge: "35mm f/4.0",
		image: "/camera/lens_03.jpg",
		principle: "Classic 35mm documentary reportage",
		axis: "35mm prime lens at eye level, offering balanced environmental storytelling with zero distortion",
		lens: "35mm f/1.4 prime lens",
		dof: "f/4.0 gentle natural roll-off",
		tags: [
			"optics",
			"lens",
			"35mm",
			"documentary",
			"natural",
			"storytelling"
		]
	},
	{
		id: "lens-standard-50",
		name: "Standard 50mm Human Prime",
		subtitle: "47° Field of View · Neutral Human Vision",
		category: "lenses",
		badge: "50mm f/5.6",
		image: "/camera/lens_04.jpg",
		principle: "Standard 50mm human perspective",
		axis: "50mm normal prime at eye level, strictly matching naked human visual perspective without magnification",
		lens: "50mm f/1.2 prime lens",
		dof: "f/5.6 clean true-to-life rendition",
		tags: [
			"optics",
			"lens",
			"50mm",
			"prime",
			"normal",
			"human perspective",
			"neutral"
		]
	},
	{
		id: "lens-portrait-85",
		name: "Portrait 85mm Prime f/1.4",
		subtitle: "29° Field of View · Creamy Bokeh Blur",
		category: "lenses",
		badge: "85mm f/1.4",
		image: "/camera/lens_05.jpg",
		principle: "Flattering 85mm telephoto compression",
		axis: "85mm portrait prime at 3m distance, compressing background with silky circular specular bokeh highlights",
		lens: "85mm f/1.4 portrait prime lens",
		dof: "f/1.4 wide-open aperture, razor focus on front leaves with creamy melted backdrop",
		tags: [
			"optics",
			"lens",
			"85mm",
			"portrait",
			"bokeh",
			"shallow dof",
			"compression"
		]
	},
	{
		id: "lens-telephoto-135",
		name: "Medium Telephoto 135mm",
		subtitle: "18° Field of View · Subject Isolation",
		category: "lenses",
		badge: "135mm f/5.6",
		image: "/camera/lens_06.jpg",
		principle: "135mm optical plane compression",
		axis: "135mm telephoto lens at 5m distance, drawing background elements close and completely isolating subject",
		lens: "135mm f/1.8 telephoto lens",
		dof: "f/5.6 intense plane flattening",
		tags: [
			"optics",
			"lens",
			"135mm",
			"telephoto",
			"isolation",
			"compression",
			"studio"
		]
	},
	{
		id: "lens-super-tele-200",
		name: "Super-Telephoto 200mm",
		subtitle: "12° Field of View · Extreme Flat Graphic",
		category: "lenses",
		badge: "200mm f/5.6",
		image: "/camera/lens_07.jpg",
		principle: "200mm super-telephoto graphic flattening",
		axis: "camera at 8m distance with 200mm telephoto, collapsing spatial depth into a graphic flat plane",
		lens: "200mm f/2.8 telephoto prime",
		dof: "f/5.6 graphic compressed focal plane",
		tags: [
			"optics",
			"lens",
			"200mm",
			"super-telephoto",
			"flattening",
			"graphic",
			"distance"
		]
	},
	{
		id: "lens-shallow-dof",
		name: "Ultra-Shallow Depth of Field f/1.2",
		subtitle: "Razor Thin Plane · Dreamy Meltdown",
		category: "lenses",
		badge: "f/1.2 DREAM",
		image: "/camera/lens_08.jpg",
		principle: "Dreamy ultra-shallow depth of field",
		axis: "85mm lens shot wide-open at f/1.2, paper-thin focus slice on single leaf tip while remainder dissolves into pure blur",
		lens: "85mm f/1.2 prime lens",
		dof: "f/1.2 ultra-shallow depth of field, creamy dreamy bokeh meltdown",
		tags: [
			"optics",
			"lens",
			"aperture",
			"f1.2",
			"shallow dof",
			"bokeh",
			"dreamy"
		]
	},
	{
		id: "lens-deep-field",
		name: "Deep Field Hyperfocal Focus f/16",
		subtitle: "Edge-to-Edge Sharpness · Infinite Plane",
		category: "lenses",
		badge: "f/16 SHARP",
		image: "/camera/lens_09.jpg",
		principle: "Deep field hyperfocal edge-to-edge sharpness",
		axis: "50mm prime stopped down to f/16, maintaining razor-sharp crystalline focus from front pot rim to rear studio wall",
		lens: "50mm f/1.4 stopped down to f/16",
		dof: "f/16 deep depth of field, hyperfocal edge-to-edge crystalline sharpness",
		tags: [
			"optics",
			"lens",
			"aperture",
			"f16",
			"deep focus",
			"sharpness",
			"hyperfocal"
		]
	}
];
var LIGHTING_CATEGORIES = [
	{
		id: "all",
		label: "All Setups (27)"
	},
	{
		id: "studio",
		label: "Studio & Portrait (9)"
	},
	{
		id: "cinematic",
		label: "Cinematic & Dramatic (9)"
	},
	{
		id: "atmosphere",
		label: "Color & Atmosphere (9)"
	}
];
var LIGHTING_LIBRARY = [
	{
		id: "lt-rembrandt",
		name: "Rembrandt Lighting",
		subtitle: "45° Key · Shadow Cheek Triangle",
		category: "studio",
		badge: "REMBRANDT",
		image: "/lighting/studio_01.jpg",
		style: "classic Rembrandt portrait lighting, distinct triangular highlight on the shadow cheek",
		fixture: "medium softbox key light at 45° off-camera, elevated 30°",
		angle: "45° key, 30° elevation, subtle soft reflector fill",
		shadow: "controlled rich shadows with soft penumbra, 4:1 contrast ratio",
		tags: [
			"studio",
			"portrait",
			"rembrandt",
			"triangle",
			"classic",
			"key",
			"shadow"
		]
	},
	{
		id: "lt-butterfly",
		name: "Butterfly / Paramount",
		subtitle: "High Frontal Key · Symmetrical Nose Shadow",
		category: "studio",
		badge: "BUTTERFLY",
		image: "/lighting/studio_02.jpg",
		style: "Paramount butterfly beauty lighting, symmetrical butterfly shadow directly beneath the nose",
		fixture: "overhead beauty dish with diffusion sock directly above camera axis",
		angle: "frontal elevated 45° directly centered on subject",
		shadow: "clean carved shadows beneath cheekbones and jawline, 3:1 contrast",
		tags: [
			"studio",
			"beauty",
			"paramount",
			"butterfly",
			"frontal",
			"glamour",
			"high"
		]
	},
	{
		id: "lt-split",
		name: "Split Lighting",
		subtitle: "90° Lateral Key · Dramatic Half-Shadow",
		category: "studio",
		badge: "SPLIT",
		image: "/lighting/studio_03.jpg",
		style: "hard split lighting, exact half of the face illuminated while the other half falls into deep shadow",
		fixture: "unfiltered fresnel key placed 90° lateral to subject at eye level",
		angle: "90° camera-side rake, level with eye horizon",
		shadow: "deep carved shadow bisecting facial planes, zero fill, 8:1 contrast ratio",
		tags: [
			"studio",
			"split",
			"hard",
			"lateral",
			"high contrast",
			"dramatic",
			"half"
		]
	},
	{
		id: "lt-loop",
		name: "Loop Lighting",
		subtitle: "30° Key · Small Downward Nose Shadow",
		category: "studio",
		badge: "LOOP",
		image: "/lighting/studio_04.jpg",
		style: "flattering loop portrait lighting, small subtle shadow of the nose looping down toward the cheek corner",
		fixture: "large octabox positioned 30° off-axis, slightly higher than eye level",
		angle: "30° key off-camera, 20° elevation",
		shadow: "soft open shadows with gentle tonal roll-off, 2.5:1 ratio",
		tags: [
			"studio",
			"portrait",
			"loop",
			"flattering",
			"commercial",
			"soft"
		]
	},
	{
		id: "lt-broad",
		name: "Broad Lighting",
		subtitle: "Turned Subject · Key on Broad Side of Face",
		category: "studio",
		badge: "BROAD",
		image: "/lighting/studio_05.jpg",
		style: "broad portrait lighting, key light illuminating the side of the face turned toward the camera",
		fixture: "diffused studio softbox illuminating the visible broad facial plane",
		angle: "45° key toward turned cheek, widening facial presence",
		shadow: "narrow shadow side turned away from lens, gentle falloff",
		tags: [
			"studio",
			"broad",
			"portrait",
			"turned",
			"wide",
			"softbox"
		]
	},
	{
		id: "lt-short",
		name: "Short Lighting",
		subtitle: "Turned Subject · Key on Narrow Side of Face",
		category: "studio",
		badge: "SHORT",
		image: "/lighting/studio_06.jpg",
		style: "short portrait lighting, key light illuminating the side of the face turned away from the camera for slimming contour",
		fixture: "grid-focused strip softbox aimed at the narrow turned cheek",
		angle: "45° off-axis aimed at the far facial plane",
		shadow: "sculpted broad side in graceful shadow facing camera, high definition",
		tags: [
			"studio",
			"short",
			"portrait",
			"slimming",
			"contour",
			"sculpted"
		]
	},
	{
		id: "lt-high-key",
		name: "High-Key Commercial",
		subtitle: "Bright Even Wash · Zero Harsh Shadow",
		category: "studio",
		badge: "HIGH-KEY",
		image: "/lighting/studio_07.jpg",
		style: "clean high-key commercial lighting, bright luminous white wash with soft pastel tones",
		fixture: "dual diffused softboxes with seamless white bounce reflectors",
		angle: "balanced twin frontal keys, wrap-around fill",
		shadow: "minimal shadow depth, translucent penumbra, 1.2:1 contrast ratio",
		tags: [
			"studio",
			"high-key",
			"commercial",
			"bright",
			"clean",
			"white",
			"luminous"
		]
	},
	{
		id: "lt-low-key",
		name: "Low-Key Dramatic",
		subtitle: "Minimal Lumens · Moody Dominant Blacks",
		category: "studio",
		badge: "LOW-KEY",
		image: "/lighting/studio_08.jpg",
		style: "moody low-key chiaroscuro lighting, deep cavernous black negative space with punchy selective highlights",
		fixture: "single spotlight snoot focusing tight directional beam",
		angle: "60° steep oblique angle, isolated spotlight",
		shadow: "pure crushed blacks, total negative fill, 12:1 contrast ratio",
		tags: [
			"studio",
			"low-key",
			"dramatic",
			"moody",
			"dark",
			"snoot",
			"shadows"
		]
	},
	{
		id: "lt-clamshell",
		name: "Clamshell Beauty",
		subtitle: "Overhead Key + Under-Chin Reflector Fill",
		category: "studio",
		badge: "CLAMSHELL",
		image: "/lighting/studio_09.jpg",
		style: "glamour clamshell beauty lighting, luminous upper key balanced by soft lower bounce fill under the chin",
		fixture: "upper beauty dish combined with horizontal silver reflector below chest",
		angle: "stacked vertical axis, high frontal key with low upward bounce fill",
		shadow: "creamy delicate shadows, glowing skin luminescence, 2:1 ratio",
		tags: [
			"studio",
			"beauty",
			"clamshell",
			"glamour",
			"reflector",
			"fill",
			"soft"
		]
	},
	{
		id: "lt-chiaroscuro",
		name: "Chiaroscuro Master",
		subtitle: "Caravaggio-Style Hard Contrast",
		category: "cinematic",
		badge: "CHIAROSCURO",
		image: "/lighting/cinematic_01.jpg",
		style: "Caravaggio-inspired chiaroscuro lighting, extreme contrast between golden radiant illumination and velvety pitch darkness",
		fixture: "directional oil-lantern / warm hard tungsten beam cutting through dark air",
		angle: "steep 50° high rake from frame left",
		shadow: "impenetrable deep shadows sculpting anatomical contours",
		tags: [
			"cinematic",
			"chiaroscuro",
			"caravaggio",
			"oil painting",
			"dramatic",
			"renaissance"
		]
	},
	{
		id: "lt-film-noir",
		name: "Film Noir Venetian Blinds",
		subtitle: "Striped Slatted Hard Shadow Projection",
		category: "cinematic",
		badge: "FILM NOIR",
		image: "/lighting/cinematic_02.jpg",
		style: "vintage film noir expressionist lighting, crisp horizontal shadow slats cast by Venetian blinds across the face",
		fixture: "hard elliptical spotlight projected through slatted window blinds",
		angle: "lateral 60° side rake projecting distinct striped geometry",
		shadow: "knife-edge razor shadows alternating with bright slivers of light",
		practical: "Venetian window blind shadow caster",
		tags: [
			"cinematic",
			"film noir",
			"venetian blinds",
			"slats",
			"detective",
			"mystery",
			"stripes"
		]
	},
	{
		id: "lt-volumetric",
		name: "Volumetric God Rays",
		subtitle: "Sun Shafts Through Atmospheric Mist",
		category: "cinematic",
		badge: "GOD RAYS",
		image: "/lighting/cinematic_03.jpg",
		style: "cinematic volumetric god rays, majestic beams of crepuscular light slicing through dusty air",
		fixture: "powerful directional sunbeam shining through high clerestory opening",
		angle: "steep 45° overhead diagonal rake illuminating air particles",
		shadow: "diffuse atmospheric falloff with radiant Tyndall scattering",
		practical: "suspended airborne dust and misty particles catching light rays",
		tags: [
			"cinematic",
			"god rays",
			"volumetric",
			"sunbeams",
			"mist",
			"crepuscular",
			"haze"
		]
	},
	{
		id: "lt-edge-rim",
		name: "Edge Rim Silhouette",
		subtitle: "Rear Separation Rim · Dark Core Silhouette",
		category: "cinematic",
		badge: "EDGE RIM",
		image: "/lighting/cinematic_04.jpg",
		style: "dramatic edge rim lighting, razor-sharp bright contour tracing the subject outline against a dark void",
		fixture: "high-power rim strip light positioned directly behind the subject",
		angle: "170° rear back-light grazing edges from behind",
		shadow: "subject face and frontal planes plunged into deep silhouette",
		tags: [
			"cinematic",
			"rim",
			"edge",
			"kicker",
			"silhouette",
			"separation",
			"backlight"
		]
	},
	{
		id: "lt-overhead",
		name: "Top-Down Overhead Spotlight",
		subtitle: "90° Interrogation Zenith · Heavy Brow Shadow",
		category: "cinematic",
		badge: "TOP-DOWN",
		image: "/lighting/cinematic_05.jpg",
		style: "stark top-down overhead spotlight, theatrical zenith lighting casting dramatic downward shadows under brows and cheekbones",
		fixture: "narrow bare spotlight mounted directly above head at 90°",
		angle: "90° straight down zenith angle",
		shadow: "deep socket eye shadows and pronounced chin shadows",
		tags: [
			"cinematic",
			"top-down",
			"overhead",
			"spotlight",
			"zenith",
			"interrogation",
			"moody"
		]
	},
	{
		id: "lt-underlighting",
		name: "Underlighting / Uplight",
		subtitle: "Horror / Campfire Uplight from Floor",
		category: "cinematic",
		badge: "UNDERLIGHT",
		image: "/lighting/cinematic_06.jpg",
		style: "eerie theatrical underlighting, sinister upward illumination reversing natural shadow gravity",
		fixture: "low footlight spotlight positioned at floor level pointing up",
		angle: "steep -60° upward rake from ground plane",
		shadow: "unnatural inverted upward shadows cast across nose and forehead",
		tags: [
			"cinematic",
			"underlighting",
			"uplight",
			"horror",
			"campfire",
			"unnatural",
			"eerie"
		]
	},
	{
		id: "lt-window-rake",
		name: "Soft Window Light Rake",
		subtitle: "Large North-Facing Soft Window Diffusion",
		category: "cinematic",
		badge: "WINDOW RAKE",
		image: "/lighting/cinematic_07.jpg",
		style: "painterly Vermeer-style window light, delicate organic gradation softly washing across the face",
		fixture: "tall casement window on overcast morning, diffuse sky light",
		angle: "70° side rake, gentle wrap around cheek",
		shadow: "silky smooth falloff with luminous open mid-tones",
		practical: "large mullioned studio window",
		tags: [
			"cinematic",
			"window",
			"natural",
			"vermeer",
			"soft",
			"morning",
			"painterly"
		]
	},
	{
		id: "lt-hard-sun",
		name: "Hard Direct Noon Sunlight",
		subtitle: "Unfiltered Midday Sun · Razor Sharp Cast",
		category: "cinematic",
		badge: "HARD SUN",
		image: "/lighting/cinematic_08.jpg",
		style: "uncompromising hard direct midday sunlight, intense blinding illumination with razor-sharp black shadows",
		fixture: "unfiltered scorching direct sun in cloudless sky",
		angle: "65° high diagonal beam, blazing intensity",
		shadow: "hard-edged razor shadows with zero feathering or diffusion",
		tags: [
			"cinematic",
			"hard sun",
			"midday",
			"direct",
			"harsh",
			"desert",
			"sharp"
		]
	},
	{
		id: "lt-silhouette",
		name: "Dark Silhouette",
		subtitle: "Bright Backlit Gradient · Complete Black Subject",
		category: "cinematic",
		badge: "SILHOUETTE",
		image: "/lighting/cinematic_09.jpg",
		style: "graphic backlit silhouette, pure black subject form cleanly stamped against a bright luminous gradient background",
		fixture: "wide cyclorama wash light illuminating background wall",
		angle: "180° back illumination, zero light on camera-facing side",
		shadow: "100% solid ink black form with sharp edge profile",
		tags: [
			"cinematic",
			"silhouette",
			"backlit",
			"graphic",
			"shadow",
			"black",
			"stencil"
		]
	},
	{
		id: "lt-golden-hour",
		name: "Golden Hour Warm Glow",
		subtitle: "Low-Angle Setting Sun · 3000K Amber",
		category: "atmosphere",
		badge: "GOLDEN HOUR",
		image: "/lighting/atmosphere_01.jpg",
		style: "romantic golden hour magic, rich honey-amber sunlight raking across features with long warm shadows",
		fixture: "low setting sun just above the horizon at magic hour",
		angle: "15° low-angle horizontal sweep, warm rim accents",
		shadow: "long stretching warm amber shadows with soft atmospheric glow",
		practical: "radiant setting sun at the horizon",
		tags: [
			"atmosphere",
			"golden hour",
			"sunset",
			"warm",
			"amber",
			"magic hour",
			"sun"
		]
	},
	{
		id: "lt-blue-hour",
		name: "Blue Hour Twilight",
		subtitle: "Deep Indigo Sky · 8000K Cool Ambient",
		category: "atmosphere",
		badge: "BLUE HOUR",
		image: "/lighting/atmosphere_02.jpg",
		style: "ethereal blue hour twilight, cool monochromatic deep indigo sky light wrapping gently in stillness",
		fixture: "ambient evening twilight sky right after sunset",
		angle: "omni-directional soft overhead sky dome",
		shadow: "deep navy blue shadows, velvety cool tonal saturation",
		practical: "fading twilight horizon",
		tags: [
			"atmosphere",
			"blue hour",
			"twilight",
			"dusk",
			"cool",
			"indigo",
			"evening"
		]
	},
	{
		id: "lt-cyberpunk",
		name: "Cyberpunk Dual-Tone",
		subtitle: "Cyan Key + Magenta Rim Dual Saturation",
		category: "atmosphere",
		badge: "CYBERPUNK",
		image: "/lighting/atmosphere_03.jpg",
		style: "futuristic cyberpunk neon lighting, electric cyan blue key light colliding with vibrant magenta-pink rim accents",
		fixture: "paired colored neon light tubes and glowing advertising panels",
		angle: "cyan key at 45° left, magenta kicker at 135° right",
		shadow: "vivid dual-tone chromatic color contrast in shadows",
		practical: "glowing neon signs and holographic city light spills",
		tags: [
			"atmosphere",
			"cyberpunk",
			"neon",
			"cyan",
			"magenta",
			"dual-tone",
			"futuristic"
		]
	},
	{
		id: "lt-candlelight",
		name: "Warm Candlelight",
		subtitle: "Flickering Warm Point Source · 1900K Intimacy",
		category: "atmosphere",
		badge: "CANDLELIGHT",
		image: "/lighting/atmosphere_04.jpg",
		style: "intimate candlelight glow, flickering warm amber point source casting soft organic movement and deep mystery",
		fixture: "single beeswax candle flame placed nearby",
		angle: "low 30° close-proximity point source from frame-right",
		shadow: "rapid inverse-square falloff, intimate darkness hugging the light",
		practical: "flickering beeswax candle flame with gentle smoke",
		tags: [
			"atmosphere",
			"candlelight",
			"candle",
			"flame",
			"intimate",
			"warm",
			"fire"
		]
	},
	{
		id: "lt-moonlight",
		name: "Moonlight Silver",
		subtitle: "Cool Silver Beams · Nocturnal Mystique",
		category: "atmosphere",
		badge: "MOONLIGHT",
		image: "/lighting/atmosphere_05.jpg",
		style: "nocturnal moonlight illumination, cool silvery blue beams piercing darkness with mysterious elegance",
		fixture: "full moon in clear night sky casting crisp cool illumination",
		angle: "55° elevated side rake from night sky",
		shadow: "deep nocturnal shadows with subtle cyan-silver highlights",
		practical: "glowing full moon in starry night sky",
		tags: [
			"atmosphere",
			"moonlight",
			"night",
			"silver",
			"lunar",
			"nocturnal",
			"mystic"
		]
	},
	{
		id: "lt-overcast",
		name: "Moody Overcast Diffuse",
		subtitle: "Giant Cloud Softbox · Shadowless Flatness",
		category: "atmosphere",
		badge: "OVERCAST",
		image: "/lighting/atmosphere_06.jpg",
		style: "melancholic overcast daylight, soft giant natural diffuser casting calm, muted, shadowless illumination",
		fixture: "heavy gray cloud deck acting as an enormous seamless softbox",
		angle: "uniform top-down atmospheric sky dome",
		shadow: "gentle ambient occlusion in crevices, soft low contrast",
		practical: "thick overcast cloud canopy",
		tags: [
			"atmosphere",
			"overcast",
			"clouds",
			"diffuse",
			"soft",
			"gray",
			"muted"
		]
	},
	{
		id: "lt-prism",
		name: "Prism Rainbow Caustics",
		subtitle: "Refracted Spectral Colors & Light Streaks",
		category: "atmosphere",
		badge: "PRISM CAUSTICS",
		image: "/lighting/atmosphere_07.jpg",
		style: "dreamy prism refraction caustics, shimmering rainbow spectral flares and chromatic aberrations projected across surfaces",
		fixture: "direct sunlight refracted through beveled crystal prism glass",
		angle: "angled dynamic sweep splashing rainbow caustic ribbons",
		shadow: "soft shadows accented by vivid spectral color separation",
		practical: "faceted glass crystal and optical prism caustics",
		tags: [
			"atmosphere",
			"prism",
			"rainbow",
			"caustics",
			"refraction",
			"spectrum",
			"flare"
		]
	},
	{
		id: "lt-bioluminescent",
		name: "Bioluminescent Emerald",
		subtitle: "Alien Phosphor Glow · Deep Deep Sea",
		category: "atmosphere",
		badge: "BIOLUMINESCENT",
		image: "/lighting/atmosphere_08.jpg",
		style: "surreal bioluminescent glow, luminous eerie emerald-green phosphor light emanating from an organic source",
		fixture: "glowing bioluminescent spores and algae clusters",
		angle: "soft upward and lateral green emission wrapping the form",
		shadow: "deep shadowy voids contrasting with radiant neon green luminescence",
		practical: "glowing bioluminescent flora and fungal spores",
		tags: [
			"atmosphere",
			"bioluminescent",
			"emerald",
			"glow",
			"phosphor",
			"alien",
			"organic"
		]
	},
	{
		id: "lt-sodium-vapor",
		name: "Sodium Vapor Streetlamp",
		subtitle: "Gritty Industrial Amber · Monochromatic Night",
		category: "atmosphere",
		badge: "SODIUM VAPOR",
		image: "/lighting/atmosphere_09.jpg",
		style: "gritty cinematic sodium vapor street lighting, stark monochromatic yellowish-orange industrial amber cast",
		fixture: "high-pressure sodium vapor municipal streetlamp overhead",
		angle: "70° overhead streetlamp cone, isolated amber puddle",
		shadow: "harsh industrial shadows with distinct single-wavelength amber saturation",
		practical: "humming industrial streetlamp fixture overhead",
		tags: [
			"atmosphere",
			"sodium vapor",
			"streetlamp",
			"amber",
			"urban",
			"gritty",
			"night"
		]
	}
];
var WARDROBE_SLOTS = [
	{
		"slot": "headwear",
		"description": "Hats, beanies, caps, hair bows, headbands, durags, balaclavas",
		"subcategories": [
			"balaclava",
			"beanie",
			"cap",
			"durag",
			"hair_ribbon",
			"headband"
		],
		"item_count": 9
	},
	{
		"slot": "eyewear",
		"description": "Sunglasses and glasses",
		"subcategories": ["glasses", "sunglasses"],
		"item_count": 3
	},
	{
		"slot": "jewelry",
		"description": "Necklaces, earrings, rings, bracelets",
		"subcategories": [
			"bracelets",
			"earrings",
			"necklace",
			"necklace_layered",
			"rings"
		],
		"item_count": 13
	},
	{
		"slot": "neckwear",
		"description": "Chokers, ties, scarves, collars",
		"subcategories": [
			"choker",
			"collar_ribbon",
			"necktie",
			"scarf"
		],
		"item_count": 6
	},
	{
		"slot": "top",
		"description": "Tees, tanks, blouses, sweaters, crop tops, bustiers",
		"subcategories": [
			"blouse",
			"bralette_top",
			"bustier",
			"cami",
			"crop_tee",
			"knit_top",
			"long_sleeve_tee",
			"polo",
			"sweater",
			"sweatshirt",
			"tank",
			"tee",
			"tube_top"
		],
		"item_count": 37
	},
	{
		"slot": "layer_top",
		"description": "Shirts or long-sleeves worn open or under/over another top",
		"subcategories": [
			"camp_shirt",
			"long_sleeve_tee",
			"shirt"
		],
		"item_count": 4
	},
	{
		"slot": "outerwear",
		"description": "Jackets, hoodies, blazers, puffers, vests, capes",
		"subcategories": [
			"blazer",
			"cape",
			"denim_jacket",
			"fleece_jacket",
			"leather_blazer",
			"leather_jacket",
			"puffer",
			"track_jacket",
			"tweed_jacket",
			"vest",
			"work_jacket",
			"zip_hoodie"
		],
		"item_count": 19
	},
	{
		"slot": "dress_onepiece",
		"description": "Dresses, pinafores, bodysuits (replace top + bottom)",
		"subcategories": [
			"corset_bodysuit",
			"knit_dress",
			"pinafore",
			"tee_dress"
		],
		"item_count": 5
	},
	{
		"slot": "bottom",
		"description": "Jeans, trousers, skirts, shorts, sweatpants",
		"subcategories": [
			"bloomers",
			"cargo_pants",
			"jeans",
			"maxi_skirt",
			"mini_skirt",
			"puffer_pants",
			"shorts",
			"sweatpants",
			"track_pants",
			"trousers"
		],
		"item_count": 39
	},
	{
		"slot": "belt_waist",
		"description": "Belts and hip chains",
		"subcategories": ["belt", "chain_belt"],
		"item_count": 11
	},
	{
		"slot": "legwear",
		"description": "Socks, loose socks, leg warmers, stockings",
		"subcategories": [
			"knee_socks",
			"leg_warmers",
			"loose_socks",
			"socks",
			"thigh_highs"
		],
		"item_count": 10
	},
	{
		"slot": "shoes",
		"description": "All footwear",
		"subcategories": [
			"ankle_boots",
			"cowboy_boots",
			"derbies",
			"knee_boots",
			"loafers",
			"mary_janes",
			"platform_boots",
			"platform_sneakers",
			"pumps",
			"sandals",
			"slouch_boots",
			"sneakers",
			"work_boots"
		],
		"item_count": 34
	},
	{
		"slot": "bag",
		"description": "Bags of every size",
		"subcategories": [
			"basket",
			"belt_bag",
			"crossbody",
			"mini_bag",
			"shoulder_bag",
			"sling",
			"top_handle",
			"tote"
		],
		"item_count": 16
	},
	{
		"slot": "accessory",
		"description": "Charms, keychains, wallet chains, watches, corsages, carried props",
		"subcategories": [
			"bag_charm",
			"carried_prop",
			"chain_charm",
			"corsage",
			"keychain",
			"wallet_chain",
			"watch"
		],
		"item_count": 7
	}
];
var STYLE_TAG_VOCABULARY = {
	"gyaru": "Japanese 90s/00s gal style: tan-glam, loose socks, rhinestones, pink, bold accessories",
	"y2k": "Late-90s/early-2000s pop fashion: low rise, baby tees, rhinestones, butterflies, glossy pink",
	"y2k_streetwear": "Early-2000s girls' streetwear: crop tees, baggy jeans, mini bags, star charms, zip hoodies",
	"streetwear_90s": "90s/00s hip-hop and skate street basics: oversized tees, baggy denim, high-tops, chains",
	"hip_hop_2000s": "2000s rap-video staples: dark denim sets, Old English lettering, durags, fitted caps, gold",
	"uk_drill": "UK road style: matching tracksuits, glossy puffers, balaclava wraps, camo cargos, runners",
	"luxury_street": "Designer streetwear: logo tracksuits, luxury sneakers, statement knits, premium basics",
	"avant_garde_dark": "Dark avant-garde menswear: waxed denim, leather, drape, long drawcords, monochrome",
	"avant_garde_rick": "Rick-Owens-like silhouettes: massive platform soles, sheer jersey, skinny stacked legs",
	"avant_garde_diy": "Deconstructed DIY art pieces: belts as garments, painted/distressed hardware, draped chains",
	"gothic": "Black-dominant dark style: crosses, grommets, studs, lace, patent",
	"gothic_lolita": "Dark Lolita: Victorian blouses, bloomers, ribbons, platform Mary Janes, black and red",
	"classic_lolita": "Soft Lolita: lace headdresses, frilled collars, bishop sleeves, demure shapes",
	"coquette": "Girly romantic: bows, ribbons, lace trims, pink, ruffles, pearls",
	"kawaii": "Cute Japanese style: plush charms, bows, pastel, playful proportions",
	"vintage_romantic": "Old-fashioned feminine: maxi skirts, Peter Pan collars, eyelet lace, polka dots",
	"mori_girl": "Forest-girl softness: loose blouses, long skirts, baskets, natural materials",
	"french_casual": "Effortless Parisian basics: Breton stripes, simple bags, soft neutrals",
	"cozy_layered": "Soft oversized layering: sherpa, chunky knits, slouchy boots",
	"dark_academia": "Scholarly classics: tartan, ties, satchels, loafers, browns and navies",
	"preppy": "Clean collegiate: collared blouses, plaid, polos, pleated skirts",
	"preppy_90s": "Clueless-era preppy: tweed sets, gingham, thigh-highs, platform pumps",
	"preppy_sport": "Varsity and football-jersey knitwear with stripes and felt letters",
	"japanese_school": "Japanese school-uniform (JK) codes: blazers, pleated skirts, loafers, loose socks",
	"harajuku_street": "Japanese street casual with text graphics and fitted basics",
	"sportswear": "Athletic pieces worn as fashion: track sets, bike shorts, tennis skirts, runners",
	"techwear": "Utility hardware and technical fabrics: cobra buckles, slings, sculpted soles",
	"grunge": "Undone layering: distressed denim, loose ties, layered chains, worn textures",
	"punk": "Studs, spikes, bullet belts, wallet chains, DIY hardware",
	"rock_moto": "Leather jackets, skinny black denim, Chelsea boots, silver jewelry",
	"leather_tailoring": "Tailored leather suiting and polished leather footwear",
	"indie_sleaze": "2000s party style: thigh-highs, knit minis, wire glasses, pointy pumps",
	"western": "Cowboy codes: western stitching, metal toe caps, bandana print, flares",
	"americana": "Classic US workwear basics: A-shirts, straight jeans, belts, trucker jackets",
	"vintage_workwear": "Work-heritage pieces: braided belts, desert boots, painter denim, canvas",
	"skater": "Skate-shop staples: puffy skate shoes, slip-ons, loose denim",
	"minimal_basics": "Plain staples that go with anything",
	"romantic_couture": "Couture-level romantic pieces: floral appliqué tulle, corsetry, capes",
	"fairycore": "Ethereal floaty pieces with flowers and sheer layers"
};
var WARDROBE_ITEMS = [
	{
		"id": "headwear_balaclava_wrap_white_01",
		"name": "White wrapped balaclava face mask",
		"slot": "headwear",
		"subcategory": "balaclava",
		"style_tags": ["uk_drill", "streetwear_90s"],
		"colors": ["white", "cream"],
		"materials": ["cotton jersey"],
		"patterns": [],
		"fit_silhouette": "full head wrap covering the head and lower face, only eyes visible",
		"details": ["fabric knotted at the back with loose tails"],
		"styling_notes": "worn with matching tracksuits",
		"prompt": "white cotton jersey fabric wrapped tightly around the head as a balaclava, covering head and lower face with only the eyes showing, knotted at the back",
		"negative": [],
		"source_images": ["H5", "I3"],
		"render_style_seen": "photo",
		"outfit_ids": [
			"outfit_H5",
			"outfit_I3_green",
			"outfit_I3_yellow"
		],
		"image": "/shots/items/headwear_balaclava_wrap_white_01.jpg"
	},
	{
		"id": "headwear_beanie_rib_red_01",
		"name": "Red ribbed beanie",
		"slot": "headwear",
		"subcategory": "beanie",
		"style_tags": [
			"streetwear_90s",
			"y2k_streetwear",
			"grunge"
		],
		"colors": ["brick red"],
		"materials": ["rib knit"],
		"patterns": [],
		"fit_silhouette": "slouchy cuffed beanie sitting back on the head",
		"details": ["folded cuff"],
		"styling_notes": "worn pushed back from the forehead",
		"prompt": "brick red ribbed knit cuffed beanie, slightly slouchy, sitting back on the head",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_left"],
		"image": "/shots/items/headwear_beanie_rib_red_01.jpg"
	},
	{
		"id": "headwear_beanie_skull_swoosh_black_01",
		"name": "Black skull beanie",
		"slot": "headwear",
		"subcategory": "beanie",
		"style_tags": ["uk_drill", "sportswear"],
		"colors": ["black", "white"],
		"materials": ["rib knit"],
		"patterns": [],
		"fit_silhouette": "short fitted beanie sitting high on the head",
		"details": ["small white swoosh logo"],
		"styling_notes": "",
		"prompt": "short fitted black knit skull beanie with a small white logo on the cuff",
		"negative": [],
		"source_images": ["I4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I4"],
		"image": "/shots/items/headwear_beanie_skull_swoosh_black_01.jpg"
	},
	{
		"id": "headwear_cap_baseball_black_backwards_01",
		"name": "Black baseball cap",
		"slot": "headwear",
		"subcategory": "cap",
		"style_tags": ["streetwear_90s", "luxury_street"],
		"colors": ["black", "white"],
		"materials": ["cotton twill"],
		"patterns": [],
		"fit_silhouette": "curved brim cap",
		"details": ["small front logo"],
		"styling_notes": "worn backwards or low",
		"prompt": "black cotton baseball cap with a small white front logo",
		"negative": [],
		"source_images": ["E3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E3_right"],
		"image": "/shots/items/headwear_cap_baseball_black_backwards_01.jpg"
	},
	{
		"id": "headwear_cap_fitted_la_green_01",
		"name": "Forest green LA fitted cap",
		"slot": "headwear",
		"subcategory": "cap",
		"style_tags": ["streetwear_90s", "hip_hop_2000s"],
		"colors": ["forest green", "white"],
		"materials": ["wool twill"],
		"patterns": [],
		"fit_silhouette": "structured fitted cap with flat-to-curved brim",
		"details": ["white interlocking LA logo on front", "gray underbrim"],
		"styling_notes": "worn low over the eyes",
		"prompt": "structured forest green fitted baseball cap with a white interlocking LA logo on the front",
		"prompt_brand_free": "structured forest green fitted baseball cap with a white interlocking two-letter logo on the front",
		"negative": [],
		"source_images": ["G5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G5"],
		"image": "/shots/items/headwear_cap_fitted_la_green_01.jpg"
	},
	{
		"id": "headwear_durag_black_01",
		"name": "Black durag",
		"slot": "headwear",
		"subcategory": "durag",
		"style_tags": ["streetwear_90s", "hip_hop_2000s"],
		"colors": ["black"],
		"materials": ["silky polyester"],
		"patterns": [],
		"fit_silhouette": "tied close over the head",
		"details": ["smooth sheen"],
		"styling_notes": "worn under loose locs",
		"prompt": "black silky durag tied snugly over the head",
		"negative": [],
		"source_images": ["E1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E1"],
		"image": "/shots/items/headwear_durag_black_01.jpg"
	},
	{
		"id": "headwear_headband_lace_ruffle_white_01",
		"name": "White lace ruffle headband",
		"slot": "headwear",
		"subcategory": "headband",
		"style_tags": [
			"coquette",
			"classic_lolita",
			"kawaii"
		],
		"colors": ["white"],
		"materials": ["lace", "cotton"],
		"patterns": [],
		"fit_silhouette": "narrow band across the crown with frilled edges",
		"details": ["gathered lace ruffle"],
		"styling_notes": "worn across the top of the head behind bangs",
		"prompt": "white frilled lace ruffle headband sitting across the crown of the head, gathered lace edging like a maid or Lolita headdress",
		"negative": [],
		"source_images": ["A3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A3"],
		"image": "/shots/items/headwear_headband_lace_ruffle_white_01.jpg"
	},
	{
		"id": "headwear_ribbon_bows_white_01",
		"name": "White ribbon hair bows",
		"slot": "headwear",
		"subcategory": "hair_ribbon",
		"style_tags": ["coquette", "kawaii"],
		"colors": ["white"],
		"materials": ["satin ribbon"],
		"patterns": [],
		"fit_silhouette": "medium bows tied high on twin tails with long tails",
		"details": ["long trailing ribbon tails"],
		"styling_notes": "one bow on each high twin tail",
		"prompt": "white satin ribbon bows tied high on each twin tail, long ribbon tails trailing down",
		"negative": [],
		"source_images": ["A5"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A5"],
		"image": "/shots/items/headwear_ribbon_bows_white_01.jpg"
	},
	{
		"id": "headwear_ribbon_hair_ties_black_01",
		"name": "Black ribbon hair bows",
		"slot": "headwear",
		"subcategory": "hair_ribbon",
		"style_tags": [
			"kawaii",
			"coquette",
			"gothic_lolita"
		],
		"colors": ["black"],
		"materials": ["satin ribbon"],
		"patterns": [],
		"fit_silhouette": "small bows tied at the base of low pigtails or twin tails, tails hanging",
		"details": ["glossy satin", "floppy loops"],
		"styling_notes": "one bow on each pigtail",
		"prompt": "small glossy black satin ribbon bows tied at the base of each pigtail, loops and tails hanging loosely",
		"negative": [],
		"source_images": ["A2", "B1"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A2", "outfit_B1"],
		"image": "/shots/items/headwear_ribbon_hair_ties_black_01.jpg"
	},
	{
		"id": "eyewear_glasses_oval_wire_01",
		"name": "Small oval wire-rim glasses",
		"slot": "eyewear",
		"subcategory": "glasses",
		"style_tags": ["indie_sleaze", "y2k"],
		"colors": ["silver"],
		"materials": ["thin metal"],
		"patterns": [],
		"fit_silhouette": "small narrow oval lenses",
		"details": ["clear lenses", "thin wire frame"],
		"styling_notes": "",
		"prompt": "small narrow oval clear-lens glasses with thin silver wire frames",
		"negative": [],
		"source_images": ["F1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F1"],
		"image": "/shots/items/eyewear_glasses_oval_wire_01.jpg"
	},
	{
		"id": "eyewear_sunglasses_shield_aviator_brown_01",
		"name": "Oversized brown shield aviators",
		"slot": "eyewear",
		"subcategory": "sunglasses",
		"style_tags": ["luxury_street", "avant_garde_dark"],
		"colors": ["brown", "gold"],
		"materials": ["metal", "tinted lens"],
		"patterns": [],
		"fit_silhouette": "oversized aviator-shield shape",
		"details": ["brown gradient tint", "thin metal frame"],
		"styling_notes": "",
		"prompt": "oversized brown-tinted shield aviator sunglasses with a thin gold metal frame",
		"negative": [],
		"source_images": ["E4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E4"],
		"image": "/shots/items/eyewear_sunglasses_shield_aviator_brown_01.jpg"
	},
	{
		"id": "eyewear_sunglasses_white_orange_lens_01",
		"name": "White sunglasses with orange lenses",
		"slot": "eyewear",
		"subcategory": "sunglasses",
		"style_tags": ["y2k_streetwear", "y2k"],
		"colors": ["white", "orange red"],
		"materials": ["plastic"],
		"patterns": [],
		"fit_silhouette": "rectangular wraparound frames",
		"details": ["gradient orange-red lenses", "small logo on temples"],
		"styling_notes": "pushed up on top of the head like a headband",
		"prompt": "glossy white rectangular sunglasses with gradient orange-red lenses, pushed up on top of the head",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_right"],
		"image": "/shots/items/eyewear_sunglasses_white_orange_lens_01.jpg"
	},
	{
		"id": "jewelry_bracelets_beaded_stack_01",
		"name": "Beaded bracelet stack",
		"slot": "jewelry",
		"subcategory": "bracelets",
		"style_tags": ["y2k_streetwear", "streetwear_90s"],
		"colors": [
			"white",
			"gold",
			"multicolor"
		],
		"materials": ["beads"],
		"patterns": [],
		"fit_silhouette": "two or three thin stretch bracelets on one wrist",
		"details": [],
		"styling_notes": "",
		"prompt": "stack of two or three thin beaded stretch bracelets on the wrist",
		"negative": [],
		"source_images": [
			"D2",
			"G3",
			"H4"
		],
		"render_style_seen": "both",
		"outfit_ids": [
			"outfit_D2_right",
			"outfit_G3",
			"outfit_H4"
		],
		"image": "/shots/items/jewelry_bracelets_beaded_stack_01.jpg"
	},
	{
		"id": "jewelry_bracelets_silver_bangle_stack_01",
		"name": "Silver bangle stack",
		"slot": "jewelry",
		"subcategory": "bracelets",
		"style_tags": ["luxury_street", "rock_moto"],
		"colors": ["silver"],
		"materials": ["silver metal"],
		"patterns": [],
		"fit_silhouette": "several bangles and chain bracelets on each wrist",
		"details": [],
		"styling_notes": "",
		"prompt": "stacked chunky silver bangles and chain bracelets on the wrist",
		"negative": [],
		"source_images": ["E3", "F1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E3_right", "outfit_F1"],
		"image": "/shots/items/jewelry_bracelets_silver_bangle_stack_01.jpg"
	},
	{
		"id": "jewelry_earrings_gold_hoops_01",
		"name": "Gold hoop earrings",
		"slot": "jewelry",
		"subcategory": "earrings",
		"style_tags": ["streetwear_90s", "y2k_streetwear"],
		"colors": ["gold"],
		"materials": ["gold metal"],
		"patterns": [],
		"fit_silhouette": "small to medium thin hoops",
		"details": [],
		"styling_notes": "",
		"prompt": "small thin polished gold hoop earrings, about one inch across, worn in both ears",
		"negative": [],
		"source_images": ["C4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_C4"],
		"image": "/shots/items/jewelry_earrings_gold_hoops_01.jpg"
	},
	{
		"id": "jewelry_earrings_small_hoops_silver_01",
		"name": "Small silver hoops",
		"slot": "jewelry",
		"subcategory": "earrings",
		"style_tags": ["minimal_basics", "indie_sleaze"],
		"colors": ["silver"],
		"materials": ["silver metal"],
		"patterns": [],
		"fit_silhouette": "small huggie hoops",
		"details": [],
		"styling_notes": "",
		"prompt": "small silver huggie hoop earrings hugging the earlobe, polished finish",
		"negative": [],
		"source_images": ["F1", "F2"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F1", "outfit_F2"],
		"image": "/shots/items/jewelry_earrings_small_hoops_silver_01.jpg"
	},
	{
		"id": "jewelry_earrings_stud_diamond_01",
		"name": "Diamond stud earring",
		"slot": "jewelry",
		"subcategory": "earrings",
		"style_tags": ["minimal_basics", "hip_hop_2000s"],
		"colors": ["silver", "clear"],
		"materials": ["metal", "crystal"],
		"patterns": [],
		"fit_silhouette": "small single stud",
		"details": [],
		"styling_notes": "",
		"prompt": "small sparkling round diamond stud earring in a silver setting, worn in one or both ears",
		"negative": [],
		"source_images": ["G4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G4"],
		"image": "/shots/items/jewelry_earrings_stud_diamond_01.jpg"
	},
	{
		"id": "jewelry_necklace_initial_pendant_gold_01",
		"name": "Gold initial pendant chain",
		"slot": "jewelry",
		"subcategory": "necklace",
		"style_tags": ["streetwear_90s", "hip_hop_2000s"],
		"colors": ["gold"],
		"materials": ["gold metal"],
		"patterns": [],
		"fit_silhouette": "thin gold chain with a letter charm at the sternum",
		"details": ["single gold letter initial pendant"],
		"styling_notes": "",
		"prompt": "thin gold chain necklace with a single gold block-letter initial pendant",
		"negative": [],
		"source_images": ["G2", "G5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G2", "outfit_G5"],
		"image": "/shots/items/jewelry_necklace_initial_pendant_gold_01.jpg"
	},
	{
		"id": "jewelry_necklace_layered_butterfly_silver_01",
		"name": "Layered silver butterfly necklaces",
		"slot": "jewelry",
		"subcategory": "necklace_layered",
		"style_tags": ["y2k", "coquette"],
		"colors": ["silver"],
		"materials": ["silver metal"],
		"patterns": [],
		"fit_silhouette": "two or three fine chains of graduated length",
		"details": ["rhinestone butterfly pendant"],
		"styling_notes": "layered under a choker",
		"prompt": "two or three fine layered silver chains with a sparkly rhinestone butterfly pendant",
		"negative": [],
		"source_images": ["C3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C3"],
		"image": "/shots/items/jewelry_necklace_layered_butterfly_silver_01.jpg"
	},
	{
		"id": "jewelry_necklace_layered_rosary_pearl_key_01",
		"name": "Layered rosary, pearl and key necklaces",
		"slot": "jewelry",
		"subcategory": "necklace_layered",
		"style_tags": [
			"grunge",
			"gothic",
			"coquette"
		],
		"colors": ["silver", "ivory"],
		"materials": ["silver metal", "pearls"],
		"patterns": [],
		"fit_silhouette": "four or five stacked strands of varying lengths",
		"details": [
			"rosary bead chain",
			"pearl strand",
			"small cross pendant",
			"antique skeleton key pendant"
		],
		"styling_notes": "stacked over a shirt collar",
		"prompt": "layered antique silver necklaces stacked at the collar: rosary bead chain, pearl strand, small cross pendant and an ornate skeleton-key pendant",
		"negative": [],
		"source_images": ["B5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_B5"],
		"image": "/shots/items/jewelry_necklace_layered_rosary_pearl_key_01.jpg"
	},
	{
		"id": "jewelry_necklace_layered_silver_chains_01",
		"name": "Layered silver chains",
		"slot": "jewelry",
		"subcategory": "necklace_layered",
		"style_tags": [
			"streetwear_90s",
			"y2k_streetwear",
			"grunge"
		],
		"colors": ["silver"],
		"materials": ["silver metal"],
		"patterns": [],
		"fit_silhouette": "two or three chains at staggered lengths",
		"details": ["small pendant on the longest strand"],
		"styling_notes": "",
		"prompt": "two or three layered silver chain necklaces at staggered lengths, small pendant on the longest",
		"negative": [],
		"source_images": [
			"D3",
			"F2",
			"F3",
			"H3"
		],
		"render_style_seen": "both",
		"outfit_ids": [
			"outfit_D3_left",
			"outfit_F2",
			"outfit_F3",
			"outfit_H3"
		],
		"image": "/shots/items/jewelry_necklace_layered_silver_chains_01.jpg"
	},
	{
		"id": "jewelry_necklace_medallion_gold_01",
		"name": "Gold medallion chain",
		"slot": "jewelry",
		"subcategory": "necklace",
		"style_tags": ["uk_drill", "hip_hop_2000s"],
		"colors": ["gold"],
		"materials": ["gold metal"],
		"patterns": [],
		"fit_silhouette": "medium chain with round pendant",
		"details": ["round gold coin medallion"],
		"styling_notes": "",
		"prompt": "gold chain necklace with a round coin medallion pendant",
		"negative": [],
		"source_images": ["I4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I4"],
		"image": "/shots/items/jewelry_necklace_medallion_gold_01.jpg"
	},
	{
		"id": "jewelry_necklace_thin_chain_silver_01",
		"name": "Thin silver chain necklace",
		"slot": "jewelry",
		"subcategory": "necklace",
		"style_tags": ["minimal_basics", "streetwear_90s"],
		"colors": ["silver"],
		"materials": ["silver metal"],
		"patterns": [],
		"fit_silhouette": "single fine chain at the collarbone",
		"details": [],
		"styling_notes": "",
		"prompt": "single fine silver chain necklace resting at the collarbone",
		"negative": [],
		"source_images": [
			"D2",
			"E1",
			"E3",
			"F4",
			"F6"
		],
		"render_style_seen": "both",
		"outfit_ids": [
			"outfit_D2_left",
			"outfit_E1",
			"outfit_E3_left",
			"outfit_F4",
			"outfit_F6"
		],
		"image": "/shots/items/jewelry_necklace_thin_chain_silver_01.jpg"
	},
	{
		"id": "jewelry_necklace_thin_gold_pendant_01",
		"name": "Thin gold pendant necklace",
		"slot": "jewelry",
		"subcategory": "necklace",
		"style_tags": ["streetwear_90s", "minimal_basics"],
		"colors": ["gold"],
		"materials": ["gold metal"],
		"patterns": [],
		"fit_silhouette": "delicate short chain",
		"details": ["tiny pendant"],
		"styling_notes": "",
		"prompt": "delicate thin gold chain necklace with a tiny pendant resting at the collarbone",
		"negative": [],
		"source_images": ["C4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_C4"],
		"image": "/shots/items/jewelry_necklace_thin_gold_pendant_01.jpg"
	},
	{
		"id": "jewelry_rings_silver_01",
		"name": "Silver rings",
		"slot": "jewelry",
		"subcategory": "rings",
		"style_tags": ["streetwear_90s", "rock_moto"],
		"colors": ["silver"],
		"materials": ["silver metal"],
		"patterns": [],
		"fit_silhouette": "a few bands on the fingers",
		"details": [],
		"styling_notes": "",
		"prompt": "a few chunky silver rings on the fingers",
		"negative": [],
		"source_images": [
			"F3",
			"G2",
			"I4"
		],
		"render_style_seen": "photo",
		"outfit_ids": [
			"outfit_F3",
			"outfit_G2",
			"outfit_I4"
		],
		"image": "/shots/items/jewelry_rings_silver_01.jpg"
	},
	{
		"id": "neckwear_choker_cord_thin_black_01",
		"name": "Thin black cord choker",
		"slot": "neckwear",
		"subcategory": "choker",
		"style_tags": [
			"y2k_streetwear",
			"streetwear_90s",
			"grunge"
		],
		"colors": ["black"],
		"materials": ["cord"],
		"patterns": [],
		"fit_silhouette": "thin cord snug at the neck",
		"details": [],
		"styling_notes": "",
		"prompt": "thin black cord choker worn snug around the neck",
		"negative": [],
		"source_images": [
			"D2",
			"G5",
			"D3"
		],
		"render_style_seen": "both",
		"outfit_ids": [
			"outfit_D2_right",
			"outfit_D3_left",
			"outfit_G5"
		],
		"image": "/shots/items/neckwear_choker_cord_thin_black_01.jpg"
	},
	{
		"id": "neckwear_choker_ribbon_bow_black_01",
		"name": "Black ribbon bow choker",
		"slot": "neckwear",
		"subcategory": "choker",
		"style_tags": ["coquette", "gothic_lolita"],
		"colors": ["black"],
		"materials": ["satin ribbon"],
		"patterns": [],
		"fit_silhouette": "thin ribbon tied snugly around the neck",
		"details": ["front bow with long tails falling to the chest"],
		"styling_notes": "worn with a ruffled blouse",
		"prompt": "thin black satin ribbon tied snug around the neck as a choker, small bow at the front with two long tails falling down the chest",
		"negative": [],
		"source_images": ["A5"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A5"],
		"image": "/shots/items/neckwear_choker_ribbon_bow_black_01.jpg"
	},
	{
		"id": "neckwear_choker_velvet_heart_pink_01",
		"name": "Pink velvet heart choker",
		"slot": "neckwear",
		"subcategory": "choker",
		"style_tags": [
			"coquette",
			"y2k",
			"kawaii"
		],
		"colors": ["dusty pink", "silver"],
		"materials": ["velvet"],
		"patterns": [],
		"fit_silhouette": "snug velvet band",
		"details": ["small silver heart charm at center"],
		"styling_notes": "worn with layered silver chains",
		"prompt": "dusty pink velvet ribbon choker with a small silver heart charm at the center",
		"negative": [],
		"source_images": ["C3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C3"],
		"image": "/shots/items/neckwear_choker_velvet_heart_pink_01.jpg"
	},
	{
		"id": "neckwear_collar_ribbon_tie_brown_01",
		"name": "Brown collar with skinny ribbon bow tie",
		"slot": "neckwear",
		"subcategory": "collar_ribbon",
		"style_tags": [
			"dark_academia",
			"preppy",
			"kawaii"
		],
		"colors": ["dark chocolate brown"],
		"materials": ["cotton twill", "satin ribbon"],
		"patterns": [],
		"fit_silhouette": "pointed shirt collar peeking above a crew neck, long narrow ribbon hanging to mid-torso",
		"details": ["sharp pointed collar tips", "thin ribbon tied in a small bow with long trailing tails"],
		"styling_notes": "collar sits over the neckline of a striped tee",
		"prompt": "dark chocolate brown pointed shirt collar with a long skinny brown satin ribbon tied in a small bow at the throat, tails hanging down the chest",
		"negative": [],
		"source_images": ["A1"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A1"],
		"image": "/shots/items/neckwear_collar_ribbon_tie_brown_01.jpg"
	},
	{
		"id": "neckwear_necktie_stripe_brown_01",
		"name": "Brown striped necktie",
		"slot": "neckwear",
		"subcategory": "necktie",
		"style_tags": [
			"dark_academia",
			"preppy",
			"grunge"
		],
		"colors": ["chocolate brown", "gold"],
		"materials": ["silk"],
		"patterns": ["diagonal stripes"],
		"fit_silhouette": "standard tie worn loose under an open collar",
		"details": ["thin gold diagonal stripes"],
		"styling_notes": "knotted loosely, hanging over a sweater",
		"prompt": "chocolate brown silk necktie with thin gold diagonal repp stripes, knotted loosely and hanging over the sweater",
		"negative": [],
		"source_images": ["B5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_B5"],
		"image": "/shots/items/neckwear_necktie_stripe_brown_01.jpg"
	},
	{
		"id": "neckwear_scarf_plaid_fringe_camel_01",
		"name": "Camel plaid fringed scarf",
		"slot": "neckwear",
		"subcategory": "scarf",
		"style_tags": [
			"japanese_school",
			"dark_academia",
			"preppy"
		],
		"colors": [
			"camel",
			"peach",
			"cream"
		],
		"materials": ["brushed wool"],
		"patterns": ["plaid"],
		"fit_silhouette": "long wide scarf wrapped up over the chin with ends hanging",
		"details": ["long fringe tassels"],
		"styling_notes": "pulled up to cover the mouth",
		"prompt": "long wide camel and peach plaid brushed-wool scarf wrapped high around the neck up over the chin, fringed ends hanging down the chest",
		"negative": [],
		"source_images": ["B4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B4"],
		"image": "/shots/items/neckwear_scarf_plaid_fringe_camel_01.jpg"
	},
	{
		"id": "top_baby_tee_i_dont_smoke_cream_01",
		"name": "Cream baby tee with red slogan",
		"slot": "top",
		"subcategory": "tee",
		"style_tags": [
			"avant_garde_dark",
			"indie_sleaze",
			"luxury_street"
		],
		"colors": ["cream", "brick red"],
		"materials": ["cotton jersey"],
		"patterns": ["slogan text"],
		"fit_silhouette": "tight shrunken short-sleeve tee",
		"details": ["red serif slogan I DON'T SMOKE across chest"],
		"styling_notes": "worn tight with a bullet belt",
		"prompt": "tight shrunken cream cotton baby tee with I DON'T SMOKE printed in bold brick-red serif letters across the chest",
		"negative": [],
		"source_images": ["E5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E5"],
		"image": "/shots/items/top_baby_tee_i_dont_smoke_cream_01.jpg"
	},
	{
		"id": "top_blouse_cascade_ruffle_white_01",
		"name": "White cascading ruffle blouse",
		"slot": "top",
		"subcategory": "blouse",
		"style_tags": ["coquette", "vintage_romantic"],
		"colors": ["white"],
		"materials": ["cotton voile"],
		"patterns": [],
		"fit_silhouette": "loose, hip length with peplum, wide scoop neck",
		"details": [
			"tiers of cascading ruffles down the front",
			"ruffled shoulders",
			"balloon sleeves with frilled cuffs",
			"gathered peplum hem"
		],
		"styling_notes": "worn untucked over jeans",
		"prompt": "soft white cotton blouse covered in tiers of cascading ruffles down the front, ruffled shoulders, voluminous balloon sleeves with frilled cuffs, gathered peplum hem",
		"negative": [],
		"source_images": ["A5"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A5"],
		"image": "/shots/items/top_blouse_cascade_ruffle_white_01.jpg"
	},
	{
		"id": "top_blouse_oversized_round_collar_white_01",
		"name": "White oversized round-collar blouse",
		"slot": "top",
		"subcategory": "blouse",
		"style_tags": [
			"mori_girl",
			"dark_academia",
			"french_casual"
		],
		"colors": ["white"],
		"materials": ["cotton poplin"],
		"patterns": [],
		"fit_silhouette": "loose oversized fit, dropped shoulders, puffy elbow-to-3/4 sleeves",
		"details": ["small rounded collar", "ruffled sleeve cuffs"],
		"styling_notes": "tucked into a high-waisted plaid maxi skirt",
		"prompt": "oversized white cotton blouse with a small rounded collar, dropped shoulders, puffy three-quarter sleeves ending in ruffled cuffs, tucked in",
		"negative": [],
		"source_images": ["B3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B3"],
		"image": "/shots/items/top_blouse_oversized_round_collar_white_01.jpg"
	},
	{
		"id": "top_blouse_puff_sleeve_collared_skyblue_01",
		"name": "Sky-blue puff-sleeve collared blouse",
		"slot": "top",
		"subcategory": "blouse",
		"style_tags": [
			"preppy",
			"japanese_school",
			"kawaii"
		],
		"colors": ["pale sky blue"],
		"materials": ["cotton poplin"],
		"patterns": [],
		"fit_silhouette": "button-front shirt, big puffed long sleeves gathered into long fitted cuffs",
		"details": ["sharp pointed collar", "small buttons"],
		"styling_notes": "worn under a sleeveless plaid pinafore",
		"prompt": "pale sky-blue cotton button-front blouse with a sharp pointed collar, very full puffed long sleeves gathered into long fitted cuffs",
		"negative": [],
		"source_images": ["B1"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B1"],
		"image": "/shots/items/top_blouse_puff_sleeve_collared_skyblue_01.jpg"
	},
	{
		"id": "top_blouse_sheer_ruffle_blue_01",
		"name": "Pale blue sheer ruffle-neck blouse",
		"slot": "top",
		"subcategory": "blouse",
		"style_tags": [
			"coquette",
			"vintage_romantic",
			"classic_lolita"
		],
		"colors": ["powder blue"],
		"materials": ["sheer chiffon"],
		"patterns": [],
		"fit_silhouette": "high ruffled neck, long voluminous balloon sleeves",
		"details": [
			"frilled stand collar",
			"semi-transparent sleeves",
			"ruffled wrist cuffs"
		],
		"styling_notes": "worn under a pinafore so only neck and sleeves show",
		"prompt": "sheer powder-blue chiffon blouse with a high frilled stand collar, long translucent balloon sleeves gathered into ruffled cuffs at the wrists",
		"negative": [],
		"source_images": ["A2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A2"],
		"image": "/shots/items/top_blouse_sheer_ruffle_blue_01.jpg"
	},
	{
		"id": "top_blouse_victorian_lace_bib_white_01",
		"name": "White Victorian lace bib blouse",
		"slot": "top",
		"subcategory": "blouse",
		"style_tags": [
			"gothic_lolita",
			"classic_lolita",
			"vintage_romantic"
		],
		"colors": ["white"],
		"materials": ["cotton", "eyelet lace"],
		"patterns": [],
		"fit_silhouette": "loose bishop sleeves, high neck, tucked in",
		"details": [
			"high ruffled stand collar",
			"lace bib yoke over the chest",
			"ruffled shoulder caps",
			"front button placket",
			"eyelet lace ruffle cuffs"
		],
		"styling_notes": "tucked into high-waisted bloomers with suspenders over the top",
		"prompt": "white Victorian cotton blouse with a high ruffled stand collar, wide lace bib yoke across the chest, ruffled shoulder flounces, full bishop sleeves ending in deep eyelet-lace ruffled cuffs",
		"negative": [],
		"source_images": ["A4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A4"],
		"image": "/shots/items/top_blouse_victorian_lace_bib_white_01.jpg"
	},
	{
		"id": "top_bralette_lace_cross_chain_black_01",
		"name": "Black scalloped lace crop top with cross chains",
		"slot": "top",
		"subcategory": "bralette_top",
		"style_tags": [
			"gothic",
			"y2k",
			"punk"
		],
		"colors": ["black", "silver"],
		"materials": ["lace"],
		"patterns": [],
		"fit_silhouette": "short cropped lace top",
		"details": [
			"scalloped lace edges",
			"silver chain straps",
			"small dangling cross charms"
		],
		"styling_notes": "worn with the faux-leather micro skirt",
		"prompt": "black scalloped floral lace cropped top with thin silver chain straps and small dangling silver cross charms",
		"negative": [],
		"source_images": ["C1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C1"],
		"image": "/shots/items/top_bralette_lace_cross_chain_black_01.jpg"
	},
	{
		"id": "top_bustier_stacked_belts_multicolor_01",
		"name": "Stacked painted-belt bustier",
		"slot": "top",
		"subcategory": "bustier",
		"style_tags": [
			"avant_garde_diy",
			"punk",
			"y2k"
		],
		"colors": [
			"hot pink",
			"lime green",
			"cobalt",
			"yellow",
			"red",
			"orange",
			"lilac",
			"black"
		],
		"materials": ["distressed painted leather", "metal buckles"],
		"patterns": ["multicolor"],
		"fit_silhouette": "about fifteen belts buckled tightly one above another from bust to hips forming a strapless top",
		"details": [
			"each belt a different color with cracked paint",
			"tarnished buckles",
			"O-rings and grommets",
			"one belt tail hanging down the front"
		],
		"styling_notes": "worn as the entire top layer",
		"prompt": "strapless bustier built from about fifteen distressed painted leather belts stacked tightly from bust to hips, hot pink, lime, cobalt, yellow, red, lilac and black, tarnished buckles and grommets",
		"negative": [],
		"source_images": ["C2"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C2"],
		"image": "/shots/items/top_bustier_stacked_belts_multicolor_01.jpg"
	},
	{
		"id": "top_cami_floral_lace_bow_cream_01",
		"name": "Cream ditsy floral lace cami",
		"slot": "top",
		"subcategory": "cami",
		"style_tags": ["coquette", "y2k"],
		"colors": ["cream", "dusty pink"],
		"materials": ["rib knit cotton", "lace"],
		"patterns": ["ditsy floral"],
		"fit_silhouette": "fitted cropped camisole with thin straps",
		"details": [
			"lace trim along the neckline",
			"pink ribbon bow at center front",
			"ruched center"
		],
		"styling_notes": "cropped above the skirt",
		"prompt": "fitted cropped cream rib-knit camisole with a tiny pink ditsy floral print, lace-trimmed sweetheart neckline, thin straps and a pink ribbon bow at center front",
		"negative": [],
		"source_images": ["C3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C3"],
		"image": "/shots/items/top_cami_floral_lace_bow_cream_01.jpg"
	},
	{
		"id": "top_knit_puff_sleeve_peter_pan_red_01",
		"name": "Red ribbed knit top with lace Peter Pan collar",
		"slot": "top",
		"subcategory": "knit_top",
		"style_tags": [
			"coquette",
			"vintage_romantic",
			"kawaii"
		],
		"colors": ["tomato red", "white"],
		"materials": ["rib knit", "lace"],
		"patterns": [],
		"fit_silhouette": "fitted short top, short puff sleeves, tucked into a high waist",
		"details": ["white Peter Pan collar edged with scalloped lace", "vertical ribbing"],
		"styling_notes": "tucked into a high-waisted maxi skirt",
		"prompt": "fitted tomato-red vertical rib-knit short-sleeve top with puffed sleeves and a rounded white Peter Pan collar trimmed in scalloped lace",
		"negative": [],
		"source_images": ["A3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A3"],
		"image": "/shots/items/top_knit_puff_sleeve_peter_pan_red_01.jpg"
	},
	{
		"id": "top_longsleeve_breton_stripe_bw_01",
		"name": "Black and white striped long-sleeve tee",
		"slot": "top",
		"subcategory": "long_sleeve_tee",
		"style_tags": [
			"french_casual",
			"preppy",
			"minimal_basics"
		],
		"colors": ["black", "white"],
		"materials": ["cotton jersey"],
		"patterns": ["horizontal stripes"],
		"fit_silhouette": "regular fit, crew neck, long sleeves",
		"details": ["bold even-width horizontal stripes about 1 inch wide"],
		"styling_notes": "layered under a collared shirt collar with a ribbon tie",
		"prompt": "fitted long-sleeve cotton jersey top with bold even black and white horizontal Breton stripes, about one inch wide, crew neckline",
		"negative": [],
		"source_images": ["A1"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A1"],
		"image": "/shots/items/top_longsleeve_breton_stripe_bw_01.jpg"
	},
	{
		"id": "top_longsleeve_sheer_jersey_pink_01",
		"name": "Bubblegum pink sheer long-sleeve tee",
		"slot": "top",
		"subcategory": "long_sleeve_tee",
		"style_tags": ["avant_garde_dark", "avant_garde_rick"],
		"colors": ["bubblegum pink"],
		"materials": ["sheer fine jersey"],
		"patterns": [],
		"fit_silhouette": "slim fit, extra long sleeves bunching at the wrists",
		"details": ["semi-sheer", "raw lightweight hand"],
		"styling_notes": "worn with coated jeans and platform sneakers",
		"prompt": "slim bubblegum pink sheer fine jersey long-sleeve tee with extra long sleeves bunching at the wrists",
		"negative": [],
		"source_images": ["H3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_H3"],
		"image": "/shots/items/top_longsleeve_sheer_jersey_pink_01.jpg"
	},
	{
		"id": "top_polo_raglan_crop_white_green_01",
		"name": "White and green cropped raglan polo",
		"slot": "top",
		"subcategory": "polo",
		"style_tags": [
			"preppy",
			"sportswear",
			"y2k_streetwear"
		],
		"colors": ["white", "forest green"],
		"materials": ["pique cotton"],
		"patterns": ["colorblock"],
		"fit_silhouette": "fitted cropped above the navel, short raglan sleeves",
		"details": [
			"forest green raglan sleeves and collar",
			"white stripe along the sleeves",
			"short button placket"
		],
		"styling_notes": "worn with a matching green pleated skirt",
		"prompt": "fitted cropped white polo shirt with forest green raglan short sleeves, green collar, a thin white stripe along the sleeves and a short button placket",
		"negative": [],
		"source_images": ["D2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D2_right"],
		"image": "/shots/items/top_polo_raglan_crop_white_green_01.jpg"
	},
	{
		"id": "top_ringer_baby_tee_magical_script_white_01",
		"name": "White ringer baby tee with pink script",
		"slot": "top",
		"subcategory": "crop_tee",
		"style_tags": [
			"y2k_streetwear",
			"y2k",
			"kawaii"
		],
		"colors": [
			"white",
			"hot pink",
			"black"
		],
		"materials": ["cotton jersey"],
		"patterns": ["script text"],
		"fit_silhouette": "fitted cropped baby tee",
		"details": ["black ringer collar", "pink script word 'Magical' across chest with a small gold sparkle"],
		"styling_notes": "worn under an off-shoulder hoodie",
		"prompt": "fitted cropped white ringer baby tee with black trim and the word Magical in hot-pink cursive script across the chest with a tiny gold sparkle",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_right"],
		"image": "/shots/items/top_ringer_baby_tee_magical_script_white_01.jpg"
	},
	{
		"id": "top_ringer_crop_tee_starburst_navy_01",
		"name": "Navy ringer crop tee with starburst",
		"slot": "top",
		"subcategory": "crop_tee",
		"style_tags": ["streetwear_90s", "y2k_streetwear"],
		"colors": [
			"navy",
			"white",
			"teal",
			"coral"
		],
		"materials": ["cotton jersey"],
		"patterns": ["graphic"],
		"fit_silhouette": "fitted cropped above the navel, short sleeves",
		"details": ["white ringer trim at neck and sleeves", "teal and coral starburst graphic on chest"],
		"styling_notes": "worn with very baggy jeans",
		"prompt": "fitted navy cropped ringer tee with white contrast trim on the collar and sleeve hems, a teal and coral starburst graphic on the chest",
		"negative": [],
		"source_images": ["C4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_C4"],
		"image": "/shots/items/top_ringer_crop_tee_starburst_navy_01.jpg"
	},
	{
		"id": "top_sweater_cable_knit_cream_01",
		"name": "Cream cable-knit crewneck sweater",
		"slot": "top",
		"subcategory": "sweater",
		"style_tags": [
			"avant_garde_dark",
			"minimal_basics",
			"luxury_street"
		],
		"colors": ["cream"],
		"materials": ["chunky wool"],
		"patterns": ["cable knit"],
		"fit_silhouette": "relaxed crewneck",
		"details": ["vertical cable patterns", "ribbed hem"],
		"styling_notes": "",
		"prompt": "relaxed cream chunky cable-knit wool crewneck sweater with raised vertical cables, ribbed collar, cuffs and hem",
		"negative": [],
		"source_images": ["E4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E4"],
		"image": "/shots/items/top_sweater_cable_knit_cream_01.jpg"
	},
	{
		"id": "top_sweater_fine_knit_camel_01",
		"name": "Camel fine-knit crewneck",
		"slot": "top",
		"subcategory": "sweater",
		"style_tags": [
			"minimal_basics",
			"dark_academia",
			"leather_tailoring"
		],
		"colors": ["camel khaki"],
		"materials": ["fine wool knit"],
		"patterns": [],
		"fit_silhouette": "slim crewneck, long sleeves",
		"details": [],
		"styling_notes": "",
		"prompt": "slim camel khaki fine-gauge wool crewneck sweater, smooth flat knit, long fitted sleeves, ribbed cuffs and hem",
		"negative": [],
		"source_images": ["G5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G5"],
		"image": "/shots/items/top_sweater_fine_knit_camel_01.jpg"
	},
	{
		"id": "top_sweater_mohair_deep_v_pink_01",
		"name": "Pink fuzzy open-knit deep-V sweater",
		"slot": "top",
		"subcategory": "sweater",
		"style_tags": [
			"coquette",
			"grunge",
			"y2k"
		],
		"colors": ["dusty pink"],
		"materials": ["mohair-blend loose knit"],
		"patterns": ["pointelle"],
		"fit_silhouette": "oversized slouchy fit, very wide deep V neckline, long sleeves past the wrists",
		"details": [
			"fuzzy halo texture",
			"loose see-through knit with ladder holes",
			"rib panels"
		],
		"styling_notes": "layered over a collared shirt and tie",
		"prompt": "oversized dusty-pink fuzzy mohair sweater in a loose see-through open knit with ladder holes, very wide plunging V neckline, long slouchy sleeves",
		"negative": [],
		"source_images": ["B5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_B5"],
		"image": "/shots/items/top_sweater_mohair_deep_v_pink_01.jpg"
	},
	{
		"id": "top_sweater_varsity_stripe_orange_01",
		"name": "Orange varsity-stripe knit sweater",
		"slot": "top",
		"subcategory": "sweater",
		"style_tags": [
			"preppy_sport",
			"streetwear_90s",
			"luxury_street"
		],
		"colors": [
			"bright orange",
			"chocolate brown",
			"white"
		],
		"materials": ["chunky wool knit"],
		"patterns": ["varsity stripes"],
		"fit_silhouette": "boxy crewneck, slightly cropped at the hip",
		"details": [
			"brown and white vertical stripes running down shoulders and sleeves",
			"large brown chenille letters across chest",
			"ribbed collar and cuffs"
		],
		"styling_notes": "worn untucked with coated jeans",
		"prompt": "boxy bright orange chunky knit crewneck sweater with brown and white football-jersey stripes down the shoulders and sleeves and big brown felt letters across the chest",
		"negative": [],
		"source_images": ["E2"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E2"],
		"image": "/shots/items/top_sweater_varsity_stripe_orange_01.jpg"
	},
	{
		"id": "top_sweater_vneck_long_pink_01",
		"name": "Pink V-neck school sweater",
		"slot": "top",
		"subcategory": "sweater",
		"style_tags": [
			"japanese_school",
			"kawaii",
			"preppy"
		],
		"colors": ["salmon pink"],
		"materials": ["fine rib knit"],
		"patterns": [],
		"fit_silhouette": "long loose fit reaching the hips, sleeves extending past the blazer cuffs",
		"details": ["ribbed hem", "V neckline"],
		"styling_notes": "worn under a blazer, hem peeking below it",
		"prompt": "salmon-pink fine rib-knit V-neck school sweater, long and loose, ribbed hem showing below the blazer and sleeves peeking out over the hands",
		"negative": [],
		"source_images": ["B4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B4"],
		"image": "/shots/items/top_sweater_vneck_long_pink_01.jpg"
	},
	{
		"id": "top_sweatshirt_crew_script_heather_gray_01",
		"name": "Heather gray script-logo crewneck sweatshirt",
		"slot": "top",
		"subcategory": "sweatshirt",
		"style_tags": [
			"uk_drill",
			"sportswear",
			"streetwear_90s"
		],
		"colors": ["heather gray", "white"],
		"materials": ["fleece"],
		"patterns": [],
		"fit_silhouette": "relaxed crewneck sweatshirt",
		"details": ["small white script logo embroidered on chest", "ribbed cuffs and hem"],
		"styling_notes": "white tee peeking below the hem",
		"prompt": "relaxed heather gray fleece crewneck sweatshirt with a small white script logo embroidered on the chest, white tee hem peeking out",
		"negative": [],
		"source_images": ["H5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_H5"],
		"image": "/shots/items/top_sweatshirt_crew_script_heather_gray_01.jpg"
	},
	{
		"id": "top_tank_ribbed_cross_logo_black_01",
		"name": "Black ribbed tank with silver cross logo",
		"slot": "top",
		"subcategory": "tank",
		"style_tags": [
			"luxury_street",
			"avant_garde_dark",
			"gothic"
		],
		"colors": ["black", "silver"],
		"materials": ["rib knit cotton"],
		"patterns": [],
		"fit_silhouette": "fitted, deep armholes",
		"details": ["small silver gothic cross logo on chest"],
		"styling_notes": "worn with wide drawstring pants",
		"prompt": "fitted black ribbed cotton tank top with a small silver gothic cross logo embroidered on the chest",
		"negative": [],
		"source_images": ["E3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E3_right"],
		"image": "/shots/items/top_tank_ribbed_cross_logo_black_01.jpg"
	},
	{
		"id": "top_tank_ribbed_heather_gray_01",
		"name": "Heather gray ribbed tank",
		"slot": "top",
		"subcategory": "tank",
		"style_tags": [
			"uk_drill",
			"sportswear",
			"minimal_basics"
		],
		"colors": ["heather gray"],
		"materials": ["rib knit"],
		"patterns": [],
		"fit_silhouette": "relaxed tank top",
		"details": ["small tonal script chest logo"],
		"styling_notes": "tucked into cargo pants",
		"prompt": "relaxed heather gray ribbed tank top with a small tonal script logo on the chest",
		"negative": [],
		"source_images": ["I4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I4"],
		"image": "/shots/items/top_tank_ribbed_heather_gray_01.jpg"
	},
	{
		"id": "top_tank_ribbed_white_01",
		"name": "White ribbed A-shirt tank",
		"slot": "top",
		"subcategory": "tank",
		"style_tags": [
			"americana",
			"minimal_basics",
			"vintage_workwear"
		],
		"colors": ["white"],
		"materials": ["rib knit cotton"],
		"patterns": [],
		"fit_silhouette": "fitted classic A-shirt",
		"details": [],
		"styling_notes": "tucked into belted jeans",
		"prompt": "classic white ribbed cotton A-shirt tank top, fitted, tucked in",
		"negative": [],
		"source_images": ["F5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F5"],
		"image": "/shots/items/top_tank_ribbed_white_01.jpg"
	},
	{
		"id": "top_tank_scoop_black_01",
		"name": "Black scoop-neck fitted tank",
		"slot": "top",
		"subcategory": "tank",
		"style_tags": ["minimal_basics", "preppy_90s"],
		"colors": ["black"],
		"materials": ["stretch jersey"],
		"patterns": [],
		"fit_silhouette": "fitted, low scoop neckline",
		"details": [],
		"styling_notes": "under a cropped jacket",
		"prompt": "fitted black stretch jersey tank top with a low scoop neckline",
		"negative": [],
		"source_images": ["D1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_D1"],
		"image": "/shots/items/top_tank_scoop_black_01.jpg"
	},
	{
		"id": "top_tee_boxy_flag_spikes_black_01",
		"name": "Black boxy tee with spiked flag print",
		"slot": "top",
		"subcategory": "tee",
		"style_tags": [
			"punk",
			"grunge",
			"luxury_street"
		],
		"colors": [
			"faded black",
			"red",
			"white"
		],
		"materials": ["washed cotton"],
		"patterns": ["airbrush graphic"],
		"fit_silhouette": "boxy cropped wide tee with raw cut neckline",
		"details": ["airbrushed blurry American flag covered in spikes with a white spike-burst halo", "AMERICAN SABOTAGE text below"],
		"styling_notes": "",
		"prompt": "faded black boxy cropped tee with a raw-cut neckline and a blurry airbrushed American flag graphic covered in spikes, white spike halo, AMERICAN SABOTAGE text below",
		"negative": [],
		"source_images": ["I2"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I2"],
		"image": "/shots/items/top_tee_boxy_flag_spikes_black_01.jpg"
	},
	{
		"id": "top_tee_crew_black_01",
		"name": "Black crew tee",
		"slot": "top",
		"subcategory": "tee",
		"style_tags": ["minimal_basics", "avant_garde_dark"],
		"colors": ["black"],
		"materials": ["cotton jersey"],
		"patterns": [],
		"fit_silhouette": "regular crew neck tee",
		"details": [],
		"styling_notes": "base layer under jackets",
		"prompt": "plain black cotton jersey crew-neck t-shirt, regular fit, smooth matte finish, no graphics",
		"negative": [],
		"source_images": ["E1", "F3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E1", "outfit_F3"],
		"image": "/shots/items/top_tee_crew_black_01.jpg"
	},
	{
		"id": "top_tee_crew_heather_oatmeal_01",
		"name": "Heather oatmeal crew tee",
		"slot": "top",
		"subcategory": "tee",
		"style_tags": ["minimal_basics"],
		"colors": ["heather oatmeal"],
		"materials": ["cotton jersey"],
		"patterns": [],
		"fit_silhouette": "regular crew tee",
		"details": [],
		"styling_notes": "",
		"prompt": "heather oatmeal light gray soft cotton crew-neck tee, regular fit, plain, worn under a leather jacket",
		"negative": [],
		"source_images": ["G4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G4"],
		"image": "/shots/items/top_tee_crew_heather_oatmeal_01.jpg"
	},
	{
		"id": "top_tee_fitted_faded_graphic_cream_01",
		"name": "Cream fitted faded-print tee",
		"slot": "top",
		"subcategory": "tee",
		"style_tags": [
			"vintage_workwear",
			"minimal_basics",
			"americana"
		],
		"colors": ["cream", "faded gray"],
		"materials": ["cotton jersey"],
		"patterns": ["faded graphic"],
		"fit_silhouette": "slim fitted crew tee",
		"details": ["sun-faded chest print"],
		"styling_notes": "tucked into jeans",
		"prompt": "slim fitted cream cotton crew tee with a faded, barely-there chest graphic, tucked in",
		"negative": [],
		"source_images": ["E3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E3_left"],
		"image": "/shots/items/top_tee_fitted_faded_graphic_cream_01.jpg"
	},
	{
		"id": "top_tee_graphic_text_white_01",
		"name": "White graphic text tee",
		"slot": "top",
		"subcategory": "tee",
		"style_tags": ["streetwear_90s", "minimal_basics"],
		"colors": ["white", "black"],
		"materials": ["cotton jersey"],
		"patterns": ["text graphic"],
		"fit_silhouette": "regular crew tee",
		"details": ["large black text print on front"],
		"styling_notes": "under an open camp shirt",
		"prompt": "white cotton crew tee with large bold black text printed on the front",
		"negative": [],
		"source_images": ["H4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_H4"],
		"image": "/shots/items/top_tee_graphic_text_white_01.jpg"
	},
	{
		"id": "top_tee_japanese_text_offwhite_01",
		"name": "Off-white tee with bold Japanese text",
		"slot": "top",
		"subcategory": "tee",
		"style_tags": ["harajuku_street", "minimal_basics"],
		"colors": ["off-white", "black"],
		"materials": ["cotton jersey"],
		"patterns": ["text graphic"],
		"fit_silhouette": "fitted short-sleeve crew tee, slightly cropped",
		"details": ["bold black brush-style Japanese characters across chest"],
		"styling_notes": "tucked loosely at low-rise jeans",
		"prompt": "fitted off-white short-sleeve crew tee with bold thick black Japanese text characters printed across the chest",
		"negative": [],
		"source_images": ["C5"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_C5"],
		"image": "/shots/items/top_tee_japanese_text_offwhite_01.jpg"
	},
	{
		"id": "top_tee_long_white_01",
		"name": "White long-line tee",
		"slot": "top",
		"subcategory": "tee",
		"style_tags": ["streetwear_90s", "minimal_basics"],
		"colors": ["white"],
		"materials": ["cotton jersey"],
		"patterns": [],
		"fit_silhouette": "long hip-length tee",
		"details": [],
		"styling_notes": "",
		"prompt": "plain white long-line cotton crew tee falling past the hips",
		"negative": [],
		"source_images": [
			"F4",
			"I3",
			"H5"
		],
		"render_style_seen": "photo",
		"outfit_ids": [
			"outfit_F4",
			"outfit_H5",
			"outfit_I3_green"
		],
		"image": "/shots/items/top_tee_long_white_01.jpg"
	},
	{
		"id": "top_tee_mesh_oversized_black_01",
		"name": "Black oversized mesh tee",
		"slot": "top",
		"subcategory": "tee",
		"style_tags": [
			"streetwear_90s",
			"sportswear",
			"grunge"
		],
		"colors": ["black"],
		"materials": ["athletic mesh jersey"],
		"patterns": [],
		"fit_silhouette": "boxy oversized short-sleeve",
		"details": ["slight sheen"],
		"styling_notes": "layered over a white long-sleeve tee",
		"prompt": "boxy oversized black athletic mesh short-sleeve tee layered over a white long-sleeve",
		"negative": [],
		"source_images": ["F2"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F2"],
		"image": "/shots/items/top_tee_mesh_oversized_black_01.jpg"
	},
	{
		"id": "top_tee_oversized_black_01",
		"name": "Black oversized tee",
		"slot": "top",
		"subcategory": "tee",
		"style_tags": ["streetwear_90s", "minimal_basics"],
		"colors": ["black"],
		"materials": ["heavy cotton jersey"],
		"patterns": [],
		"fit_silhouette": "boxy oversized short-sleeve",
		"details": [],
		"styling_notes": "",
		"prompt": "boxy oversized black heavy cotton t-shirt with dropped shoulders and sleeves past the elbow, plain, no graphics",
		"negative": [],
		"source_images": ["F6"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F6"],
		"image": "/shots/items/top_tee_oversized_black_01.jpg"
	},
	{
		"id": "top_tee_oversized_collegiate_slate_01",
		"name": "Oversized slate collegiate tee",
		"slot": "top",
		"subcategory": "tee",
		"style_tags": [
			"streetwear_90s",
			"sportswear",
			"y2k_streetwear"
		],
		"colors": ["slate teal gray", "white"],
		"materials": ["heavy cotton jersey"],
		"patterns": ["varsity text"],
		"fit_silhouette": "very oversized, dropped shoulders, sleeves to the elbow",
		"details": ["white collegiate block lettering and number 07 across chest", "front half-tucked"],
		"styling_notes": "half-tucked into bike shorts",
		"prompt": "very oversized slate teal-gray heavy cotton tee with white collegiate block lettering and the number 07 across the chest, dropped shoulders, front half-tucked",
		"negative": [],
		"source_images": ["D2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D2_left"],
		"image": "/shots/items/top_tee_oversized_collegiate_slate_01.jpg"
	},
	{
		"id": "top_tee_vinyl_heart_print_white_01",
		"name": "White tee with vinyl-record heart print",
		"slot": "top",
		"subcategory": "tee",
		"style_tags": ["streetwear_90s", "minimal_basics"],
		"colors": [
			"white",
			"black",
			"multicolor",
			"tan"
		],
		"materials": ["cotton jersey"],
		"patterns": ["photo collage graphic"],
		"fit_silhouette": "regular crew tee",
		"details": ["back print: heart shape made of stacked black vinyl records with colorful labels", "small record-shop logos and badges below"],
		"styling_notes": "product flat lay, print on the back",
		"prompt": "white crew tee with a large back print of a heart made from overlapping black vinyl records with colorful center labels, small record-store logos and badges below",
		"negative": [],
		"source_images": ["I1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I1"],
		"image": "/shots/items/top_tee_vinyl_heart_print_white_01.jpg"
	},
	{
		"id": "top_tube_bandeau_black_01",
		"name": "Black tube top",
		"slot": "top",
		"subcategory": "tube_top",
		"style_tags": [
			"y2k_streetwear",
			"y2k",
			"minimal_basics"
		],
		"colors": ["black"],
		"materials": ["stretch jersey"],
		"patterns": [],
		"fit_silhouette": "strapless band across the bust",
		"details": [],
		"styling_notes": "peeks out under an open hoodie",
		"prompt": "simple black stretch jersey strapless tube top, smooth fitted band across the bust, peeking out from an open hoodie",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_left"],
		"image": "/shots/items/top_tube_bandeau_black_01.jpg"
	},
	{
		"id": "layer_top_camp_shirt_bandana_red_01",
		"name": "Red bandana-print camp shirt",
		"slot": "layer_top",
		"subcategory": "camp_shirt",
		"style_tags": [
			"streetwear_90s",
			"western",
			"luxury_street"
		],
		"colors": [
			"red",
			"coral",
			"white"
		],
		"materials": ["rayon"],
		"patterns": ["bandana paisley"],
		"fit_silhouette": "boxy short-sleeve camp collar shirt",
		"details": ["red and white bandana paisley print on the lower body", "solid coral upper"],
		"styling_notes": "worn open over a graphic tee",
		"prompt": "boxy short-sleeve red camp collar shirt with a red and white bandana paisley print across the lower half, worn open",
		"negative": [],
		"source_images": ["H4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_H4"],
		"image": "/shots/items/layer_top_camp_shirt_bandana_red_01.jpg"
	},
	{
		"id": "layer_top_longsleeve_white_01",
		"name": "White long-sleeve under-tee",
		"slot": "layer_top",
		"subcategory": "long_sleeve_tee",
		"style_tags": [
			"streetwear_90s",
			"grunge",
			"minimal_basics"
		],
		"colors": ["white"],
		"materials": ["cotton jersey"],
		"patterns": [],
		"fit_silhouette": "fitted long sleeves visible under a short-sleeve tee",
		"details": [],
		"styling_notes": "sleeves showing below the short-sleeve layer",
		"prompt": "plain white long-sleeve cotton tee worn underneath, sleeves showing below a short-sleeve top",
		"negative": [],
		"source_images": ["F2"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F2"],
		"image": "/shots/items/layer_top_longsleeve_white_01.jpg"
	},
	{
		"id": "layer_top_longsleeve_white_tee_g3_01",
		"name": "White long-sleeve tee",
		"slot": "layer_top",
		"subcategory": "long_sleeve_tee",
		"style_tags": ["streetwear_90s", "minimal_basics"],
		"colors": ["white"],
		"materials": ["cotton jersey"],
		"patterns": [],
		"fit_silhouette": "regular long sleeves under a vest",
		"details": [],
		"styling_notes": "",
		"prompt": "plain white cotton long-sleeve tee worn under a vest",
		"negative": [],
		"source_images": ["G3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G3"],
		"image": "/shots/items/layer_top_longsleeve_white_tee_g3_01.jpg"
	},
	{
		"id": "layer_top_shirt_pintuck_collared_white_01",
		"name": "White pintuck collared shirt",
		"slot": "layer_top",
		"subcategory": "shirt",
		"style_tags": [
			"dark_academia",
			"preppy",
			"grunge"
		],
		"colors": ["white"],
		"materials": ["cotton poplin"],
		"patterns": ["pintucks"],
		"fit_silhouette": "classic button shirt worn under a sweater, hem showing",
		"details": ["fine vertical pintucks on the front", "pointed collar"],
		"styling_notes": "collar out over the sweater, shirttail hanging below",
		"prompt": "crisp white cotton collared shirt with fine vertical pintuck pleats down the front, pointed collar spread over a sweater, shirttail peeking out at the hem",
		"negative": [],
		"source_images": ["B5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_B5"],
		"image": "/shots/items/layer_top_shirt_pintuck_collared_white_01.jpg"
	},
	{
		"id": "outerwear_blazer_leather_black_01",
		"name": "Black leather blazer",
		"slot": "outerwear",
		"subcategory": "leather_blazer",
		"style_tags": [
			"leather_tailoring",
			"rock_moto",
			"avant_garde_dark"
		],
		"colors": ["black"],
		"materials": ["soft lambskin leather"],
		"patterns": [],
		"fit_silhouette": "relaxed single-breasted blazer, hip length",
		"details": [
			"notch lapels",
			"soft worn sheen",
			"patch pockets"
		],
		"styling_notes": "worn open over a black tee as a leather suit",
		"prompt": "relaxed black soft lambskin leather blazer with notch lapels, single-breasted, worn-in satin sheen, part of a matching leather suit",
		"negative": [],
		"source_images": ["E1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E1"],
		"image": "/shots/items/outerwear_blazer_leather_black_01.jpg"
	},
	{
		"id": "outerwear_blazer_school_navy_01",
		"name": "Navy school blazer",
		"slot": "outerwear",
		"subcategory": "blazer",
		"style_tags": [
			"japanese_school",
			"preppy",
			"dark_academia"
		],
		"colors": ["slate navy", "red"],
		"materials": ["wool"],
		"patterns": [],
		"fit_silhouette": "single-breasted, hip length, slightly boxy",
		"details": [
			"notched lapels",
			"small buttons on the cuffs",
			"red accent buttons"
		],
		"styling_notes": "sleeves pushed so a sweater cuff peeks out",
		"prompt": "slate navy single-breasted Japanese school uniform blazer, notched lapels, hip length, small red buttons on the cuffs",
		"negative": [],
		"source_images": ["B4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B4"],
		"image": "/shots/items/outerwear_blazer_school_navy_01.jpg"
	},
	{
		"id": "outerwear_cape_tulle_floral_applique_blush_01",
		"name": "Blush tulle floral cape",
		"slot": "outerwear",
		"subcategory": "cape",
		"style_tags": ["romantic_couture", "fairycore"],
		"colors": [
			"blush",
			"dusty rose",
			"plum"
		],
		"materials": ["sheer tulle", "embroidered lace"],
		"patterns": ["floral embroidery"],
		"fit_silhouette": "sheer drape from one shoulder pooling into a long floor train",
		"details": [
			"embroidered trailing flowers",
			"3D flower appliques",
			"scalloped lace edge"
		],
		"styling_notes": "draped from one shoulder over the bodysuit",
		"prompt": "sheer blush tulle cape draped from one shoulder into a long pooling floor-length train, scattered embroidered vines and 3D pink flower appliques, scalloped lace edge",
		"negative": [],
		"source_images": ["D4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_D4"],
		"image": "/shots/items/outerwear_cape_tulle_floral_applique_blush_01.jpg"
	},
	{
		"id": "outerwear_hoodie_crop_varsity_letters_teal_01",
		"name": "Teal cropped zip hoodie with pink varsity letters",
		"slot": "outerwear",
		"subcategory": "zip_hoodie",
		"style_tags": ["y2k_streetwear", "streetwear_90s"],
		"colors": [
			"emerald teal",
			"pink",
			"white"
		],
		"materials": ["fleece"],
		"patterns": ["varsity letters"],
		"fit_silhouette": "cropped boxy zip hoodie, drop shoulders",
		"details": [
			"large pink chenille-style varsity letters outlined in white across the front",
			"hood",
			"ribbed hem"
		],
		"styling_notes": "half-zipped low over a black tube top",
		"prompt": "cropped emerald teal fleece zip hoodie with big pink varsity applique letters outlined in white across the chest, hood, ribbed hem, zipped halfway",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_left"],
		"image": "/shots/items/outerwear_hoodie_crop_varsity_letters_teal_01.jpg"
	},
	{
		"id": "outerwear_hoodie_ribbon_bow_pink_01",
		"name": "Dusty pink bow-trim zip hoodie",
		"slot": "outerwear",
		"subcategory": "zip_hoodie",
		"style_tags": [
			"coquette",
			"y2k",
			"kawaii"
		],
		"colors": ["dusty pink", "cream"],
		"materials": ["soft rib knit"],
		"patterns": [],
		"fit_silhouette": "cropped boxy zip hoodie, long full sleeves bunched at the wrist",
		"details": [
			"cream satin ribbon bows sewn in a row down each sleeve",
			"hood",
			"ribbed cuffs"
		],
		"styling_notes": "worn open and slipped off the shoulders",
		"prompt": "cropped dusty pink soft knit zip-up hoodie with rows of small cream satin ribbon bows sewn down each sleeve, long bunched sleeves, worn open off the shoulders",
		"negative": [],
		"source_images": ["C3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C3"],
		"image": "/shots/items/outerwear_hoodie_ribbon_bow_pink_01.jpg"
	},
	{
		"id": "outerwear_hoodie_zip_mustard_01",
		"name": "Mustard yellow zip hoodie",
		"slot": "outerwear",
		"subcategory": "zip_hoodie",
		"style_tags": ["streetwear_90s", "y2k_streetwear"],
		"colors": ["mustard yellow"],
		"materials": ["fleece"],
		"patterns": [],
		"fit_silhouette": "oversized zip hoodie",
		"details": ["hood", "ribbed cuffs"],
		"styling_notes": "worn slipped off the shoulders, arms crossed",
		"prompt": "oversized mustard yellow fleece zip hoodie worn open and slipped off the shoulders",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_right"],
		"image": "/shots/items/outerwear_hoodie_zip_mustard_01.jpg"
	},
	{
		"id": "outerwear_jacket_cropped_patent_trucker_black_01",
		"name": "Black patent cropped trucker jacket",
		"slot": "outerwear",
		"subcategory": "leather_jacket",
		"style_tags": [
			"avant_garde_dark",
			"rock_moto",
			"indie_sleaze"
		],
		"colors": ["black"],
		"materials": ["crinkled patent leather"],
		"patterns": [],
		"fit_silhouette": "short boxy trucker cut, cropped at the ribs",
		"details": [
			"point collar",
			"two flap chest pockets",
			"high wet-look shine with crinkles"
		],
		"styling_notes": "hung up or worn open",
		"prompt": "cropped boxy black glossy crinkled patent leather trucker jacket with point collar, two flap chest pockets and button front",
		"negative": [],
		"source_images": ["E5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E5"],
		"image": "/shots/items/outerwear_jacket_cropped_patent_trucker_black_01.jpg"
	},
	{
		"id": "outerwear_jacket_denim_trucker_dark_rinse_01",
		"name": "Dark rinse trucker jacket with copper buttons",
		"slot": "outerwear",
		"subcategory": "denim_jacket",
		"style_tags": [
			"streetwear_90s",
			"hip_hop_2000s",
			"americana"
		],
		"colors": ["dark indigo", "copper"],
		"materials": ["raw denim"],
		"patterns": [],
		"fit_silhouette": "fitted trucker cut, waist length",
		"details": [
			"copper shank buttons",
			"two flap chest pockets",
			"small red embroidered chest logo",
			"contrast orange stitching"
		],
		"styling_notes": "worn buttoned as a matching denim set",
		"prompt": "fitted dark-rinse raw indigo denim trucker jacket with copper buttons, two flap chest pockets, orange contrast stitching and a tiny red embroidered chest logo",
		"negative": [],
		"source_images": ["G1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G1"],
		"image": "/shots/items/outerwear_jacket_denim_trucker_dark_rinse_01.jpg"
	},
	{
		"id": "outerwear_jacket_denim_trucker_medium_wash_01",
		"name": "Medium-wash denim trucker jacket",
		"slot": "outerwear",
		"subcategory": "denim_jacket",
		"style_tags": [
			"streetwear_90s",
			"americana",
			"grunge"
		],
		"colors": ["medium blue denim"],
		"materials": ["denim"],
		"patterns": [],
		"fit_silhouette": "classic trucker cut at the waist",
		"details": [
			"faded worn wash",
			"chest flap pockets",
			"button front"
		],
		"styling_notes": "worn open over a black tee",
		"prompt": "faded medium-wash denim trucker jacket, classic waist length, chest flap pockets, worn open",
		"negative": [],
		"source_images": ["F3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F3"],
		"image": "/shots/items/outerwear_jacket_denim_trucker_medium_wash_01.jpg"
	},
	{
		"id": "outerwear_jacket_moto_biker_black_01",
		"name": "Black leather moto jacket",
		"slot": "outerwear",
		"subcategory": "leather_jacket",
		"style_tags": ["rock_moto", "minimal_basics"],
		"colors": ["black", "silver"],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "classic fitted biker cut at the waist",
		"details": [
			"asymmetric front zip",
			"snap-down notch lapels",
			"zip cuffs",
			"silver hardware"
		],
		"styling_notes": "worn open over a heather tee",
		"prompt": "classic black leather moto biker jacket with asymmetric silver zip, snap-down lapels and zippered cuffs, worn open",
		"negative": [],
		"source_images": ["G4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G4"],
		"image": "/shots/items/outerwear_jacket_moto_biker_black_01.jpg"
	},
	{
		"id": "outerwear_jacket_sherpa_lined_cropped_black_01",
		"name": "Black sherpa-lined cropped jacket",
		"slot": "outerwear",
		"subcategory": "work_jacket",
		"style_tags": ["streetwear_90s", "vintage_workwear"],
		"colors": ["black", "heather gray"],
		"materials": ["cotton canvas", "sherpa"],
		"patterns": [],
		"fit_silhouette": "cropped boxy jacket worn off the shoulders",
		"details": ["gray fleece lining visible", "hood"],
		"styling_notes": "slipped down to the elbows",
		"prompt": "cropped boxy black canvas jacket lined in gray sherpa fleece, hooded, worn slipped down off the shoulders",
		"negative": [],
		"source_images": ["F4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F4"],
		"image": "/shots/items/outerwear_jacket_sherpa_lined_cropped_black_01.jpg"
	},
	{
		"id": "outerwear_jacket_sherpa_shaggy_cream_01",
		"name": "Cream shaggy sherpa jacket",
		"slot": "outerwear",
		"subcategory": "fleece_jacket",
		"style_tags": [
			"kawaii",
			"french_casual",
			"cozy_layered"
		],
		"colors": ["cream", "ivory"],
		"materials": ["curly sherpa fleece", "rib knit"],
		"patterns": [],
		"fit_silhouette": "oversized boxy fit, dropped shoulders, hip length, wide balloon sleeves",
		"details": [
			"large notched shawl collar",
			"big curly-pile patch pockets",
			"cream rib-knit cuffs",
			"open front"
		],
		"styling_notes": "worn open and slipping off one shoulder over a striped tee",
		"prompt": "oversized cream ivory shaggy curly sherpa fleece jacket, plush textured teddy pile, wide shawl collar, big patch pockets, dropped shoulders, voluminous sleeves ending in ribbed knit cuffs, worn open",
		"negative": [
			"smooth faux fur",
			"fitted cut",
			"zip front"
		],
		"source_images": ["A1"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A1"],
		"image": "/shots/items/outerwear_jacket_sherpa_shaggy_cream_01.jpg"
	},
	{
		"id": "outerwear_jacket_tweed_gingham_cropped_bw_01",
		"name": "Black and white gingham tweed cropped jacket",
		"slot": "outerwear",
		"subcategory": "tweed_jacket",
		"style_tags": [
			"preppy_90s",
			"coquette",
			"preppy"
		],
		"colors": ["black", "white"],
		"materials": ["boucle tweed"],
		"patterns": ["gingham check"],
		"fit_silhouette": "cropped boxy jacket at the waist, long sleeves",
		"details": [
			"solid black trim along edges and cuffs",
			"collarless open front",
			"small black buttons"
		],
		"styling_notes": "worn open over a black tank",
		"prompt": "cropped boxy black and white gingham boucle tweed jacket, collarless, edged in solid black trim along the front and cuffs, worn open",
		"negative": [],
		"source_images": ["D1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_D1"],
		"image": "/shots/items/outerwear_jacket_tweed_gingham_cropped_bw_01.jpg"
	},
	{
		"id": "outerwear_puffer_glossy_forest_green_01",
		"name": "Glossy forest green puffer",
		"slot": "outerwear",
		"subcategory": "puffer",
		"style_tags": ["uk_drill", "streetwear_90s"],
		"colors": ["forest green", "yellow"],
		"materials": ["glossy nylon", "down fill"],
		"patterns": [],
		"fit_silhouette": "bulky hip-length puffer, high funnel collar",
		"details": ["fat horizontal baffles", "small yellow script chest logo"],
		"styling_notes": "zipped up over a white tee with matching pants",
		"prompt": "bulky glossy forest green nylon puffer jacket with fat baffles, high funnel collar and a small yellow script logo on the chest",
		"negative": [],
		"source_images": ["I3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I3_green"],
		"image": "/shots/items/outerwear_puffer_glossy_forest_green_01.jpg"
	},
	{
		"id": "outerwear_puffer_glossy_mustard_yellow_01",
		"name": "Glossy yellow puffer",
		"slot": "outerwear",
		"subcategory": "puffer",
		"style_tags": ["uk_drill", "streetwear_90s"],
		"colors": ["golden yellow", "white"],
		"materials": ["glossy nylon", "down fill"],
		"patterns": [],
		"fit_silhouette": "bulky hip-length puffer, high collar",
		"details": [
			"fat baffles",
			"small white script chest logo",
			"elastic cuffs"
		],
		"styling_notes": "with matching yellow puffer pants",
		"prompt": "bulky glossy golden yellow nylon puffer jacket with fat baffles, high collar, elastic cuffs and a small white script chest logo",
		"negative": [],
		"source_images": ["I3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I3_yellow"],
		"image": "/shots/items/outerwear_puffer_glossy_mustard_yellow_01.jpg"
	},
	{
		"id": "outerwear_puffer_thermal_gradient_01",
		"name": "Thermal-gradient puffer jacket",
		"slot": "outerwear",
		"subcategory": "puffer",
		"style_tags": [
			"streetwear_90s",
			"luxury_street",
			"techwear"
		],
		"colors": [
			"sky blue",
			"yellow",
			"orange",
			"magenta",
			"black"
		],
		"materials": ["matte nylon", "down fill"],
		"patterns": ["radial heatmap gradient"],
		"fit_silhouette": "boxy hip-length puffer",
		"details": [
			"thermal-camera radial gradient: sky blue edges into yellow, orange, magenta and a black core at center chest",
			"stand collar with snaps",
			"snap placket",
			"horizontal baffles",
			"lower patch pockets",
			"elastic cuffs"
		],
		"styling_notes": "product shot, flat lay",
		"prompt": "boxy hip-length matte nylon puffer jacket printed with a thermal-camera heatmap: sky blue edges fading to yellow, orange, magenta and a black core at the center chest, snap stand collar",
		"negative": [],
		"source_images": ["H1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_H1"],
		"image": "/shots/items/outerwear_puffer_thermal_gradient_01.jpg"
	},
	{
		"id": "outerwear_track_jacket_royal_blue_stripe_01",
		"name": "Royal blue striped track jacket",
		"slot": "outerwear",
		"subcategory": "track_jacket",
		"style_tags": [
			"sportswear",
			"luxury_street",
			"streetwear_90s"
		],
		"colors": [
			"royal blue",
			"yellow",
			"white"
		],
		"materials": ["satin tricot"],
		"patterns": ["sleeve stripes"],
		"fit_silhouette": "relaxed zip track jacket, stand collar",
		"details": [
			"yellow and white piping along shoulders and sleeves",
			"striped cuffs",
			"white script logo embroidered on chest"
		],
		"styling_notes": "worn open over a bare chest with chain",
		"prompt": "royal blue satin tricot track jacket with yellow and white piping along the shoulders and sleeves, striped cuffs and a white script logo embroidered on the chest, worn open",
		"negative": [],
		"source_images": ["G2"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G2"],
		"image": "/shots/items/outerwear_track_jacket_royal_blue_stripe_01.jpg"
	},
	{
		"id": "outerwear_vest_leopard_utility_01",
		"name": "Leopard utility puffer vest",
		"slot": "outerwear",
		"subcategory": "vest",
		"style_tags": ["luxury_street", "streetwear_90s"],
		"colors": [
			"tan",
			"brown",
			"black"
		],
		"materials": ["fleece", "nylon"],
		"patterns": ["leopard print"],
		"fit_silhouette": "boxy hip-length puffer vest, high zip neck",
		"details": [
			"chest flap pockets",
			"woven tan label patches",
			"toggle drawcord hem"
		],
		"styling_notes": "over a white long-sleeve, crossbody bag over it",
		"prompt": "boxy leopard print fleece utility puffer vest with high zip neck, chest flap pockets, woven tan logo label patches and toggle drawcord hem",
		"negative": [],
		"source_images": ["G3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G3"],
		"image": "/shots/items/outerwear_vest_leopard_utility_01.jpg"
	},
	{
		"id": "outerwear_windbreaker_colorblock_navy_white_01",
		"name": "Navy and white oversized windbreaker",
		"slot": "outerwear",
		"subcategory": "track_jacket",
		"style_tags": [
			"streetwear_90s",
			"sportswear",
			"japanese_school"
		],
		"colors": ["navy", "white"],
		"materials": ["nylon"],
		"patterns": ["colorblock"],
		"fit_silhouette": "very oversized, hip length, huge balloon sleeves gathered at the wrist",
		"details": [
			"tall funnel neck zipped to the chin",
			"full front zip",
			"white curved shoulder panels",
			"small oval chest patch"
		],
		"styling_notes": "zipped to the chin, sleeves swallowing the hands",
		"prompt": "very oversized navy nylon windbreaker with white curved shoulder panels, tall funnel neck zipped to the chin, small oval chest patch, huge balloon sleeves gathered at the wrists",
		"negative": [],
		"source_images": ["B2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B2"],
		"image": "/shots/items/outerwear_windbreaker_colorblock_navy_white_01.jpg"
	},
	{
		"id": "dress_onepiece_corset_bodysuit_floral_lace_rose_01",
		"name": "Rose floral lace corset bodysuit",
		"slot": "dress_onepiece",
		"subcategory": "corset_bodysuit",
		"style_tags": ["romantic_couture", "coquette"],
		"colors": [
			"dusty rose",
			"blush",
			"plum",
			"black"
		],
		"materials": [
			"sheer tulle",
			"embroidered lace",
			"3D floral appliques"
		],
		"patterns": ["floral embroidery"],
		"fit_silhouette": "sculpted corset bodysuit with defined waist, balconette cups",
		"details": [
			"black boning channels and underwire outlines",
			"black waist band",
			"embroidered vines and 3D flower appliques",
			"adjustable black straps with gold sliders",
			"attached black garter straps"
		],
		"styling_notes": "shown on a dress form as couture",
		"prompt": "couture dusty rose corset bodysuit in sheer blush tulle covered with embroidered vines and 3D plum and pink flower appliques, black boning lines, black waistband, thin black straps with gold sliders",
		"negative": ["cheap costume look"],
		"source_images": ["D4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_D4"],
		"image": "/shots/items/dress_onepiece_corset_bodysuit_floral_lace_rose_01.jpg"
	},
	{
		"id": "dress_onepiece_knit_sleeveless_mock_studded_black_01",
		"name": "Black studded mock-neck knit mini dress",
		"slot": "dress_onepiece",
		"subcategory": "knit_dress",
		"style_tags": [
			"indie_sleaze",
			"y2k",
			"gothic"
		],
		"colors": ["black", "silver"],
		"materials": ["rib knit"],
		"patterns": [],
		"fit_silhouette": "fitted sleeveless mini, high mock neck",
		"details": ["silver stud trim around the neckline", "fine vertical ribbing"],
		"styling_notes": "belted low at the hips",
		"prompt": "fitted black ribbed knit sleeveless mini dress with a high mock neck trimmed in small silver studs",
		"negative": [],
		"source_images": ["F1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F1"],
		"image": "/shots/items/dress_onepiece_knit_sleeveless_mock_studded_black_01.jpg"
	},
	{
		"id": "dress_onepiece_tee_dress_ribbed_offwhite_01",
		"name": "Off-white ribbed tee mini dress",
		"slot": "dress_onepiece",
		"subcategory": "tee_dress",
		"style_tags": [
			"minimal_basics",
			"sportswear",
			"y2k"
		],
		"colors": ["off-white"],
		"materials": ["rib knit cotton"],
		"patterns": [],
		"fit_silhouette": "body-skimming short-sleeve mini, crew neck",
		"details": ["fine vertical ribbing", "tiny chest logo"],
		"styling_notes": "worn with slouch socks and chunky sneakers",
		"prompt": "body-skimming off-white fine rib-knit short-sleeve t-shirt mini dress, crew neck, tiny printed chest logo",
		"negative": [],
		"source_images": ["D5"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D5"],
		"image": "/shots/items/dress_onepiece_tee_dress_ribbed_offwhite_01.jpg"
	},
	{
		"id": "dress_pinafore_maxi_ruffle_navy_01",
		"name": "Navy ruffle maxi pinafore dress",
		"slot": "dress_onepiece",
		"subcategory": "pinafore",
		"style_tags": [
			"vintage_romantic",
			"coquette",
			"mori_girl"
		],
		"colors": ["deep navy"],
		"materials": ["cotton crinkle gauze"],
		"patterns": [],
		"fit_silhouette": "fitted bodice, thin straps, full gathered maxi skirt to the ankles",
		"details": [
			"ruffled square neckline",
			"seamed waist",
			"ruffle hem",
			"lots of soft drape"
		],
		"styling_notes": "layered over a sheer blouse, skirt lifted at one side",
		"prompt": "deep navy crinkled cotton maxi pinafore dress, thin shoulder straps, ruffled square neckline, fitted bodice, very full gathered ankle-length skirt with a ruffled hem",
		"negative": [],
		"source_images": ["A2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A2"],
		"image": "/shots/items/dress_pinafore_maxi_ruffle_navy_01.jpg"
	},
	{
		"id": "dress_pinafore_plaid_belted_coral_01",
		"name": "Coral plaid belted pinafore mini dress",
		"slot": "dress_onepiece",
		"subcategory": "pinafore",
		"style_tags": [
			"preppy",
			"japanese_school",
			"y2k"
		],
		"colors": [
			"coral red",
			"pink",
			"white"
		],
		"materials": ["wool-blend suiting"],
		"patterns": ["tartan plaid"],
		"fit_silhouette": "sleeveless fitted V-front bodice, defined waist, short pleated flared mini skirt",
		"details": ["matching self-fabric belt with a big black square buckle", "deep V neckline over a blouse"],
		"styling_notes": "layered over a collared blouse",
		"prompt": "sleeveless coral-red and pink tartan plaid pinafore mini dress, fitted V-neck bodice, matching self-fabric waist belt with a large black square buckle, short pleated flared skirt",
		"negative": [],
		"source_images": ["B1"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B1"],
		"image": "/shots/items/dress_pinafore_plaid_belted_coral_01.jpg"
	},
	{
		"id": "bottom_bike_shorts_black_lace_hem_01",
		"name": "Black bike shorts with lace hem",
		"slot": "bottom",
		"subcategory": "shorts",
		"style_tags": [
			"kawaii",
			"y2k",
			"coquette"
		],
		"colors": ["black", "blush pink"],
		"materials": ["stretch jersey", "lace"],
		"patterns": [],
		"fit_silhouette": "snug high-rise bike shorts ending mid-thigh",
		"details": ["scalloped blush pink lace trim peeking at the hem"],
		"styling_notes": "peeks out below an oversized jacket",
		"prompt": "snug black stretch bike shorts ending at mid-thigh, finished with a delicate scalloped blush-pink lace trim at the leg hem",
		"negative": [],
		"source_images": ["A1"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A1"],
		"image": "/shots/items/bottom_bike_shorts_black_lace_hem_01.jpg"
	},
	{
		"id": "bottom_bike_shorts_side_stripe_black_01",
		"name": "Black side-stripe bike shorts",
		"slot": "bottom",
		"subcategory": "shorts",
		"style_tags": [
			"sportswear",
			"streetwear_90s",
			"y2k_streetwear"
		],
		"colors": ["black", "white"],
		"materials": ["spandex"],
		"patterns": ["side stripe"],
		"fit_silhouette": "snug mid-thigh bike shorts",
		"details": ["single white stripe down the outer side seam"],
		"styling_notes": "worn with an oversized tee",
		"prompt": "snug black spandex bike shorts ending mid-thigh with a single white stripe down the outer side seam",
		"negative": [],
		"source_images": ["D2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D2_left"],
		"image": "/shots/items/bottom_bike_shorts_side_stripe_black_01.jpg"
	},
	{
		"id": "bottom_bloomer_shorts_suspender_black_01",
		"name": "Black bloomer shorts with suspenders",
		"slot": "bottom",
		"subcategory": "bloomers",
		"style_tags": ["gothic_lolita", "kawaii"],
		"colors": ["black"],
		"materials": ["cotton twill"],
		"patterns": [],
		"fit_silhouette": "very high wide corset-like waistband, puffed pumpkin legs gathered at the upper thigh",
		"details": [
			"thin black suspender straps",
			"long loose ribbon ties hanging at the sides",
			"ruffled leg openings"
		],
		"styling_notes": "worn over a tucked blouse",
		"prompt": "black high-waisted puffy bloomer shorts with a wide structured waistband, pumpkin-shaped legs gathered into frilled cuffs, thin black suspenders, long black ribbon ties dangling at the hips",
		"negative": [],
		"source_images": ["A4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A4"],
		"image": "/shots/items/bottom_bloomer_shorts_suspender_black_01.jpg"
	},
	{
		"id": "bottom_cargo_pants_camo_nylon_gray_01",
		"name": "Gray camo nylon cargo pants",
		"slot": "bottom",
		"subcategory": "cargo_pants",
		"style_tags": [
			"uk_drill",
			"streetwear_90s",
			"techwear"
		],
		"colors": [
			"charcoal",
			"gray",
			"white"
		],
		"materials": ["nylon"],
		"patterns": ["cloud camouflage"],
		"fit_silhouette": "baggy cargos with elastic ankles",
		"details": [
			"large charcoal, gray and white cloud camo",
			"cargo pockets",
			"small logo patch on thigh"
		],
		"styling_notes": "bunched over black sneakers",
		"prompt": "baggy nylon cargo pants in charcoal, gray and white cloud camouflage with cargo pockets and elastic ankles bunching over sneakers",
		"negative": [],
		"source_images": ["I4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I4"],
		"image": "/shots/items/bottom_cargo_pants_camo_nylon_gray_01.jpg"
	},
	{
		"id": "bottom_jeans_baggy_dark_indigo_01",
		"name": "Baggy dark indigo jeans",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": [
			"streetwear_90s",
			"y2k_streetwear",
			"hip_hop_2000s"
		],
		"colors": ["dark indigo"],
		"materials": ["denim"],
		"patterns": [],
		"fit_silhouette": "low-rise, extremely wide and long, stacking and pooling over sneakers",
		"details": ["heavy creases", "five-pocket"],
		"styling_notes": "belted low, hems pooling over chunky sneakers",
		"prompt": "very baggy dark indigo denim jeans, low rise, extremely wide legs, long hems stacking and pooling over the sneakers",
		"negative": [],
		"source_images": ["C4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_C4"],
		"image": "/shots/items/bottom_jeans_baggy_dark_indigo_01.jpg"
	},
	{
		"id": "bottom_jeans_baggy_lightwash_low_rise_01",
		"name": "Light-wash baggy low-rise jeans",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": [
			"y2k_streetwear",
			"streetwear_90s",
			"hip_hop_2000s"
		],
		"colors": ["light blue denim"],
		"materials": ["denim"],
		"patterns": [],
		"fit_silhouette": "low-rise, very wide straight legs, long hems over the shoes",
		"details": ["faded light wash", "wide waistband"],
		"styling_notes": "worn low on the hips",
		"prompt": "light-wash faded baggy denim jeans, low rise, very wide straight legs and long hems puddling over the sneakers",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_left"],
		"image": "/shots/items/bottom_jeans_baggy_lightwash_low_rise_01.jpg"
	},
	{
		"id": "bottom_jeans_coated_skinny_black_01",
		"name": "Glossy coated black skinny jeans",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": [
			"y2k",
			"indie_sleaze",
			"avant_garde_dark"
		],
		"colors": ["black"],
		"materials": ["waxed coated denim"],
		"patterns": [],
		"fit_silhouette": "low to mid rise, skinny, high shine",
		"details": ["waxy wet-look sheen", "five-pocket"],
		"styling_notes": "worn with a fitted tee or long-sleeve",
		"prompt": "black waxed coated skinny jeans with a glossy wet-look sheen, five-pocket, snug through the leg",
		"negative": [],
		"source_images": ["C5", "H3"],
		"render_style_seen": "both",
		"outfit_ids": ["outfit_C5", "outfit_H3"],
		"image": "/shots/items/bottom_jeans_coated_skinny_black_01.jpg"
	},
	{
		"id": "bottom_jeans_flare_western_applique_lightwash_01",
		"name": "Light-wash western appliqué flare jeans",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": ["western", "luxury_street"],
		"colors": ["light faded blue denim"],
		"materials": ["denim"],
		"patterns": ["western scroll applique"],
		"fit_silhouette": "bootcut flare, long hem resting on the boot",
		"details": ["raw-edge frayed denim appliqué in western scroll, flame and star shapes", "faded light wash"],
		"styling_notes": "hem breaking over cowboy boots",
		"prompt": "light faded wash bootcut flare jeans covered in raw-edge frayed denim appliqué of western scrolls, flames and stars, long hems breaking over cowboy boots",
		"negative": [],
		"source_images": ["I5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I5"],
		"image": "/shots/items/bottom_jeans_flare_western_applique_lightwash_01.jpg"
	},
	{
		"id": "bottom_jeans_gothic_embroidered_dark_rinse_01",
		"name": "Dark rinse jeans with Old English embroidery",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": [
			"hip_hop_2000s",
			"streetwear_90s",
			"luxury_street"
		],
		"colors": ["dark indigo", "white"],
		"materials": ["raw denim"],
		"patterns": ["Old English lettering"],
		"fit_silhouette": "straight leg, full length",
		"details": ["white gothic blackletter embroidered words across both front thighs"],
		"styling_notes": "matching the dark rinse jacket",
		"prompt": "dark-rinse indigo straight-leg jeans with white gothic Old English blackletter embroidery across the front thighs",
		"negative": [],
		"source_images": ["G1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G1"],
		"image": "/shots/items/bottom_jeans_gothic_embroidered_dark_rinse_01.jpg"
	},
	{
		"id": "bottom_jeans_paint_splatter_lightwash_01",
		"name": "Paint-splattered light-wash jeans",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": [
			"vintage_workwear",
			"americana",
			"grunge"
		],
		"colors": ["light blue denim", "multicolor paint"],
		"materials": ["denim"],
		"patterns": ["paint splatter"],
		"fit_silhouette": "straight leg, relaxed, full length",
		"details": ["paint drips and splatters on thighs", "worn faded knees"],
		"styling_notes": "worn with desert boots",
		"prompt": "light-wash faded straight-leg jeans with paint splatters and drips across the thighs, relaxed workwear fit",
		"negative": [],
		"source_images": ["E3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E3_left"],
		"image": "/shots/items/bottom_jeans_paint_splatter_lightwash_01.jpg"
	},
	{
		"id": "bottom_jeans_shredded_bleached_baggy_01",
		"name": "Bleached shredded baggy jeans",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": [
			"grunge",
			"luxury_street",
			"streetwear_90s"
		],
		"colors": ["bleached gray", "off-white"],
		"materials": ["denim"],
		"patterns": ["acid wash"],
		"fit_silhouette": "baggy straight leg, long",
		"details": [
			"heavy shredding and rips all over",
			"bleached acid-wash marbling",
			"frayed threads"
		],
		"styling_notes": "",
		"prompt": "baggy bleached light-gray acid-wash jeans heavily shredded with rips and frayed holes all over the legs",
		"negative": [],
		"source_images": ["H4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_H4"],
		"image": "/shots/items/bottom_jeans_shredded_bleached_baggy_01.jpg"
	},
	{
		"id": "bottom_jeans_skinny_black_stacked_01",
		"name": "Black stacked skinny jeans",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": ["streetwear_90s", "rock_moto"],
		"colors": ["black"],
		"materials": ["stretch denim"],
		"patterns": [],
		"fit_silhouette": "skinny, stacked at the ankles over boots",
		"details": [],
		"styling_notes": "",
		"prompt": "black stretch skinny jeans stacking in folds at the ankles over boots",
		"negative": [],
		"source_images": ["F4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F4"],
		"image": "/shots/items/bottom_jeans_skinny_black_stacked_01.jpg"
	},
	{
		"id": "bottom_jeans_skinny_distressed_raw_hem_black_01",
		"name": "Black distressed raw-hem skinny jeans",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": ["rock_moto", "grunge"],
		"colors": ["black"],
		"materials": ["stretch denim"],
		"patterns": [],
		"fit_silhouette": "skinny, cropped at the ankle",
		"details": ["shredded knee rips", "frayed raw cut hem"],
		"styling_notes": "",
		"prompt": "black skinny jeans with shredded knee rips and a frayed raw-cut hem cropped above the ankle",
		"negative": [],
		"source_images": ["G4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G4"],
		"image": "/shots/items/bottom_jeans_skinny_distressed_raw_hem_black_01.jpg"
	},
	{
		"id": "bottom_jeans_skinny_patchwork_faded_gray_01",
		"name": "Faded gray skinny jeans with black patch",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": ["avant_garde_dark", "rock_moto"],
		"colors": ["faded gray", "black"],
		"materials": ["stretch denim"],
		"patterns": ["patchwork"],
		"fit_silhouette": "skinny with long stacked legs tucked into boots",
		"details": [
			"black patchwork panel on one thigh",
			"exposed raw seams",
			"faded wash"
		],
		"styling_notes": "stacked into platform boots",
		"prompt": "faded gray skinny jeans with a black denim patchwork panel across one thigh, exposed raw seams, long legs stacking into the boots",
		"negative": [],
		"source_images": ["E4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E4"],
		"image": "/shots/items/bottom_jeans_skinny_patchwork_faded_gray_01.jpg"
	},
	{
		"id": "bottom_jeans_skinny_ripped_cuffed_lightwash_01",
		"name": "Light-wash ripped cuffed skinny jeans",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": ["streetwear_90s", "grunge"],
		"colors": ["light blue denim"],
		"materials": ["stretch denim"],
		"patterns": [],
		"fit_silhouette": "skinny, cuffed at the ankle",
		"details": ["ripped knees", "rolled cuffs"],
		"styling_notes": "cuffed to show white socks",
		"prompt": "light-wash skinny jeans with ripped knees and rolled cuffs at the ankle",
		"negative": [],
		"source_images": ["F3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F3"],
		"image": "/shots/items/bottom_jeans_skinny_ripped_cuffed_lightwash_01.jpg"
	},
	{
		"id": "bottom_jeans_straight_lace_hem_lightwash_01",
		"name": "Light-wash jeans with lace hem",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": ["coquette", "y2k"],
		"colors": ["light blue denim", "white"],
		"materials": ["denim", "lace"],
		"patterns": [],
		"fit_silhouette": "mid-rise straight leg, full length grazing the shoe",
		"details": ["white scalloped lace trim sewn around the hem"],
		"styling_notes": "worn with pointed heels",
		"prompt": "light-wash blue straight-leg jeans, full length, finished with a band of white scalloped lace trim around each hem",
		"negative": [],
		"source_images": ["A5"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A5"],
		"image": "/shots/items/bottom_jeans_straight_lace_hem_lightwash_01.jpg"
	},
	{
		"id": "bottom_jeans_straight_medium_wash_01",
		"name": "Medium-wash straight jeans",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": ["americana", "vintage_workwear"],
		"colors": ["medium blue denim"],
		"materials": ["denim"],
		"patterns": [],
		"fit_silhouette": "mid-rise relaxed straight leg",
		"details": [],
		"styling_notes": "",
		"prompt": "medium-wash relaxed straight-leg jeans, mid rise, classic five-pocket",
		"negative": [],
		"source_images": ["F5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F5"],
		"image": "/shots/items/bottom_jeans_straight_medium_wash_01.jpg"
	},
	{
		"id": "bottom_jeans_waxed_straight_charcoal_01",
		"name": "Charcoal waxed straight jeans",
		"slot": "bottom",
		"subcategory": "jeans",
		"style_tags": [
			"avant_garde_dark",
			"luxury_street",
			"indie_sleaze"
		],
		"colors": ["charcoal black"],
		"materials": ["waxed coated denim"],
		"patterns": [],
		"fit_silhouette": "straight leg, full length, slight stack",
		"details": ["matte-to-shiny waxed coating", "slight crinkle"],
		"styling_notes": "",
		"prompt": "charcoal black waxed coated straight-leg jeans with a leather-like semi-gloss finish and light crinkling",
		"negative": [],
		"source_images": ["E2", "E5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E2", "outfit_E5"],
		"image": "/shots/items/bottom_jeans_waxed_straight_charcoal_01.jpg"
	},
	{
		"id": "bottom_jorts_cargo_long_medium_wash_01",
		"name": "Long baggy cargo jorts",
		"slot": "bottom",
		"subcategory": "shorts",
		"style_tags": [
			"y2k_streetwear",
			"hip_hop_2000s",
			"streetwear_90s"
		],
		"colors": ["medium blue denim"],
		"materials": ["denim"],
		"patterns": [],
		"fit_silhouette": "very baggy shorts ending below the knee",
		"details": ["side cargo pockets", "wide legs"],
		"styling_notes": "worn low with tube socks",
		"prompt": "very baggy medium-wash denim jorts ending below the knee with side cargo pockets, wide straight legs",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_right"],
		"image": "/shots/items/bottom_jorts_cargo_long_medium_wash_01.jpg"
	},
	{
		"id": "bottom_pants_wide_drawstring_black_01",
		"name": "Black wide drawstring trousers",
		"slot": "bottom",
		"subcategory": "trousers",
		"style_tags": ["avant_garde_dark", "luxury_street"],
		"colors": ["black"],
		"materials": ["heavy jersey"],
		"patterns": [],
		"fit_silhouette": "very wide straight leg, puddling hem",
		"details": ["extra long drawcords hanging past the knees", "dropped crotch"],
		"styling_notes": "pooling over black shoes",
		"prompt": "very wide black heavy jersey drawstring trousers with extra long drawcords hanging to the knees, slightly dropped crotch and puddling hems",
		"negative": [],
		"source_images": ["E3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E3_right"],
		"image": "/shots/items/bottom_pants_wide_drawstring_black_01.jpg"
	},
	{
		"id": "bottom_puffer_pants_glossy_yellow_01",
		"name": "Glossy yellow puffer pants",
		"slot": "bottom",
		"subcategory": "puffer_pants",
		"style_tags": ["uk_drill", "techwear"],
		"colors": ["golden yellow"],
		"materials": ["glossy nylon"],
		"patterns": [],
		"fit_silhouette": "padded relaxed pants with elastic cuffs",
		"details": [],
		"styling_notes": "matching the yellow puffer",
		"prompt": "padded glossy golden yellow nylon puffer pants with elastic ankle cuffs, matching the jacket",
		"negative": [],
		"source_images": ["I3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I3_yellow"],
		"image": "/shots/items/bottom_puffer_pants_glossy_yellow_01.jpg"
	},
	{
		"id": "bottom_shorts_lace_trim_leopard_01",
		"name": "Leopard lace-trim micro shorts",
		"slot": "bottom",
		"subcategory": "shorts",
		"style_tags": ["indie_sleaze", "y2k"],
		"colors": ["leopard brown", "black"],
		"materials": ["satin", "lace"],
		"patterns": ["leopard print"],
		"fit_silhouette": "tiny shorts peeking under the dress hem",
		"details": ["black lace trim"],
		"styling_notes": "visible just below a mini dress",
		"prompt": "tiny leopard print satin shorts edged with black lace peeking below a mini dress hem",
		"negative": [],
		"source_images": ["F1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F1"],
		"image": "/shots/items/bottom_shorts_lace_trim_leopard_01.jpg"
	},
	{
		"id": "bottom_shorts_nylon_black_01",
		"name": "Black nylon shorts",
		"slot": "bottom",
		"subcategory": "shorts",
		"style_tags": ["sportswear", "streetwear_90s"],
		"colors": ["black"],
		"materials": ["nylon"],
		"patterns": [],
		"fit_silhouette": "above-knee relaxed shorts",
		"details": [],
		"styling_notes": "",
		"prompt": "relaxed black nylon shorts ending above the knee",
		"negative": [],
		"source_images": ["F6"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F6"],
		"image": "/shots/items/bottom_shorts_nylon_black_01.jpg"
	},
	{
		"id": "bottom_skirt_bubble_mini_brown_01",
		"name": "Dark brown bubble mini skirt",
		"slot": "bottom",
		"subcategory": "mini_skirt",
		"style_tags": [
			"coquette",
			"y2k",
			"grunge"
		],
		"colors": ["dark chocolate brown"],
		"materials": ["cotton"],
		"patterns": [],
		"fit_silhouette": "short puffy bubble hem mini skirt",
		"details": ["gathered ruffled balloon hem"],
		"styling_notes": "under a long sweater and shirttail",
		"prompt": "dark chocolate brown puffy bubble-hem mini skirt with a soft gathered balloon silhouette",
		"negative": [],
		"source_images": ["B5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_B5"],
		"image": "/shots/items/bottom_skirt_bubble_mini_brown_01.jpg"
	},
	{
		"id": "bottom_skirt_denim_cargo_pleated_mini_black_01",
		"name": "Washed black denim cargo micro skirt",
		"slot": "bottom",
		"subcategory": "mini_skirt",
		"style_tags": [
			"y2k",
			"gyaru",
			"grunge"
		],
		"colors": ["washed black", "charcoal"],
		"materials": ["denim"],
		"patterns": [],
		"fit_silhouette": "low-rise pleated micro mini",
		"details": [
			"front flap cargo pockets with snaps",
			"frayed raw hem",
			"faded wash"
		],
		"styling_notes": "worn with a low pink belt and chains",
		"prompt": "washed charcoal black denim low-rise pleated micro mini skirt with flap cargo pockets, snap buttons and a frayed raw hem",
		"negative": [],
		"source_images": ["C3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C3"],
		"image": "/shots/items/bottom_skirt_denim_cargo_pleated_mini_black_01.jpg"
	},
	{
		"id": "bottom_skirt_gingham_mini_pink_01",
		"name": "Pink gingham mini skirt",
		"slot": "bottom",
		"subcategory": "mini_skirt",
		"style_tags": [
			"preppy_90s",
			"coquette",
			"y2k"
		],
		"colors": ["baby pink", "white"],
		"materials": ["cotton tweed"],
		"patterns": ["gingham check"],
		"fit_silhouette": "fitted straight mini, high waist",
		"details": ["small gingham check"],
		"styling_notes": "",
		"prompt": "fitted high-waisted baby pink and white gingham check straight mini skirt",
		"negative": [],
		"source_images": ["D1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_D1"],
		"image": "/shots/items/bottom_skirt_gingham_mini_pink_01.jpg"
	},
	{
		"id": "bottom_skirt_maxi_polkadot_tiered_cream_01",
		"name": "Cream polka-dot tiered maxi skirt",
		"slot": "bottom",
		"subcategory": "maxi_skirt",
		"style_tags": [
			"coquette",
			"vintage_romantic",
			"mori_girl"
		],
		"colors": ["cream", "black"],
		"materials": ["cotton voile", "eyelet lace"],
		"patterns": ["small polka dots"],
		"fit_silhouette": "high waist, ankle length, full A-line",
		"details": ["double ruffle tier at the hip like a peplum", "wide scalloped eyelet lace band at the hem"],
		"styling_notes": "worn with a tucked knit top",
		"prompt": "high-waisted ankle-length cream skirt with tiny black polka dots, a double ruffled tier around the hips, full flowing body ending in a wide scalloped eyelet lace hem",
		"negative": [],
		"source_images": ["A3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A3"],
		"image": "/shots/items/bottom_skirt_maxi_polkadot_tiered_cream_01.jpg"
	},
	{
		"id": "bottom_skirt_maxi_tartan_blue_green_01",
		"name": "Blue-green tartan pleated maxi skirt",
		"slot": "bottom",
		"subcategory": "maxi_skirt",
		"style_tags": [
			"dark_academia",
			"mori_girl",
			"preppy"
		],
		"colors": [
			"navy",
			"teal blue",
			"forest green",
			"mustard yellow"
		],
		"materials": ["wool"],
		"patterns": ["tartan plaid"],
		"fit_silhouette": "high waist, ankle length, softly pleated A-line",
		"details": ["Black Watch style tartan with thin yellow overcheck"],
		"styling_notes": "worn with a tucked blouse and socks with sandals",
		"prompt": "high-waisted ankle-length pleated wool maxi skirt in a navy, teal and forest-green tartan with a thin mustard-yellow overcheck",
		"negative": [],
		"source_images": ["B3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B3"],
		"image": "/shots/items/bottom_skirt_maxi_tartan_blue_green_01.jpg"
	},
	{
		"id": "bottom_skirt_pleated_micro_faux_leather_black_01",
		"name": "Black faux-leather pleated micro skirt",
		"slot": "bottom",
		"subcategory": "mini_skirt",
		"style_tags": [
			"gothic",
			"y2k",
			"punk"
		],
		"colors": ["black"],
		"materials": ["faux leather"],
		"patterns": [],
		"fit_silhouette": "low-rise, wide smooth yoke, very short knife pleats",
		"details": ["side zip", "satin sheen"],
		"styling_notes": "worn with a studded belt and hanging cross chain",
		"prompt": "black glossy faux-leather low-rise micro mini skirt with a wide smooth hip yoke, short sharp knife pleats and a silver side zip",
		"negative": [],
		"source_images": ["C1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C1"],
		"image": "/shots/items/bottom_skirt_pleated_micro_faux_leather_black_01.jpg"
	},
	{
		"id": "bottom_skirt_pleated_micro_gray_plaid_01",
		"name": "Gray plaid pleated micro skirt",
		"slot": "bottom",
		"subcategory": "mini_skirt",
		"style_tags": [
			"japanese_school",
			"y2k",
			"gyaru"
		],
		"colors": ["charcoal gray", "white"],
		"materials": ["wool-blend"],
		"patterns": ["plaid"],
		"fit_silhouette": "very short knife-pleated school skirt",
		"details": ["crisp pleats"],
		"styling_notes": "worn with blazer and loose socks",
		"prompt": "charcoal gray plaid knife-pleated school uniform micro mini skirt with crisp pleats",
		"negative": [],
		"source_images": ["B4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B4"],
		"image": "/shots/items/bottom_skirt_pleated_micro_gray_plaid_01.jpg"
	},
	{
		"id": "bottom_skirt_pleated_mini_forest_green_01",
		"name": "Forest green pleated mini skirt",
		"slot": "bottom",
		"subcategory": "mini_skirt",
		"style_tags": [
			"preppy",
			"sportswear",
			"japanese_school"
		],
		"colors": ["forest green"],
		"materials": ["cotton twill"],
		"patterns": [],
		"fit_silhouette": "short flared pleated tennis mini",
		"details": ["crisp pleats", "slight bubble at the hem"],
		"styling_notes": "",
		"prompt": "short forest green pleated tennis mini skirt with crisp flared pleats",
		"negative": [],
		"source_images": ["D2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D2_right"],
		"image": "/shots/items/bottom_skirt_pleated_mini_forest_green_01.jpg"
	},
	{
		"id": "bottom_skirt_pleated_tennis_white_01",
		"name": "White pleated tennis mini skirt",
		"slot": "bottom",
		"subcategory": "mini_skirt",
		"style_tags": [
			"japanese_school",
			"sportswear",
			"preppy"
		],
		"colors": ["white"],
		"materials": ["cotton twill"],
		"patterns": [],
		"fit_silhouette": "short A-line mini with crisp knife pleats",
		"details": ["crisp even pleats"],
		"styling_notes": "peeks out below an oversized jacket",
		"prompt": "crisp white knife-pleated tennis mini skirt, short flared A-line",
		"negative": [],
		"source_images": ["B2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B2"],
		"image": "/shots/items/bottom_skirt_pleated_tennis_white_01.jpg"
	},
	{
		"id": "bottom_sweatpants_heather_gray_script_01",
		"name": "Heather gray sweatpants",
		"slot": "bottom",
		"subcategory": "sweatpants",
		"style_tags": ["uk_drill", "sportswear"],
		"colors": ["heather gray", "white"],
		"materials": ["fleece"],
		"patterns": [],
		"fit_silhouette": "relaxed joggers, elastic cuffs bunched over sneakers",
		"details": ["small white script logo on thigh"],
		"styling_notes": "matching the crewneck",
		"prompt": "relaxed heather gray fleece sweatpants with elastic cuffs bunching over sneakers and a small white script logo on the thigh",
		"negative": [],
		"source_images": ["H5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_H5"],
		"image": "/shots/items/bottom_sweatpants_heather_gray_script_01.jpg"
	},
	{
		"id": "bottom_sweatpants_mustard_old_english_01",
		"name": "Mustard sweatpants with gothic logo",
		"slot": "bottom",
		"subcategory": "sweatpants",
		"style_tags": [
			"luxury_street",
			"streetwear_90s",
			"hip_hop_2000s"
		],
		"colors": ["mustard gold", "black"],
		"materials": ["fleece"],
		"patterns": ["Old English lettering"],
		"fit_silhouette": "relaxed joggers with elastic cuffs, bunched at the ankle",
		"details": ["black Old English logo print on the thigh with a circle emblem", "drawstring waist"],
		"styling_notes": "bunched over high-top sneakers",
		"prompt": "relaxed mustard gold fleece joggers with a black gothic Old English Billionaire Boys Club print on the thigh, drawstring waist and elastic ankle cuffs",
		"prompt_brand_free": "relaxed mustard gold fleece joggers with a black gothic Old English blackletter logo print and circular emblem on the thigh, drawstring waist, elastic ankle cuffs",
		"negative": [],
		"source_images": ["G3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G3"],
		"image": "/shots/items/bottom_sweatpants_mustard_old_english_01.jpg"
	},
	{
		"id": "bottom_track_pants_nylon_forest_green_01",
		"name": "Forest green nylon track pants",
		"slot": "bottom",
		"subcategory": "track_pants",
		"style_tags": ["uk_drill", "sportswear"],
		"colors": ["forest green"],
		"materials": ["nylon"],
		"patterns": [],
		"fit_silhouette": "relaxed straight leg",
		"details": [],
		"styling_notes": "matching the green puffer",
		"prompt": "relaxed forest green nylon track pants matching the jacket",
		"negative": [],
		"source_images": ["I3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I3_green"],
		"image": "/shots/items/bottom_track_pants_nylon_forest_green_01.jpg"
	},
	{
		"id": "bottom_track_pants_piped_cream_01",
		"name": "Cream track pants with black piping",
		"slot": "bottom",
		"subcategory": "track_pants",
		"style_tags": ["sportswear", "streetwear_90s"],
		"colors": ["cream", "black"],
		"materials": ["tricot"],
		"patterns": ["side stripe"],
		"fit_silhouette": "straight relaxed leg, ankle length",
		"details": ["thin black piping down the outer seam"],
		"styling_notes": "with tall white socks",
		"prompt": "cream tricot track pants with a thin black stripe piping down the outer seam, relaxed straight leg ending at the ankle",
		"negative": [],
		"source_images": ["F2"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F2"],
		"image": "/shots/items/bottom_track_pants_piped_cream_01.jpg"
	},
	{
		"id": "bottom_track_pants_royal_blue_stripe_01",
		"name": "Royal blue striped track pants",
		"slot": "bottom",
		"subcategory": "track_pants",
		"style_tags": [
			"sportswear",
			"luxury_street",
			"streetwear_90s"
		],
		"colors": [
			"royal blue",
			"yellow",
			"white"
		],
		"materials": ["satin tricot"],
		"patterns": ["side stripes"],
		"fit_silhouette": "straight relaxed leg",
		"details": ["yellow and white stripes down the outer leg", "small script logo on thigh"],
		"styling_notes": "matching the track jacket",
		"prompt": "matching royal blue satin tricot track pants with yellow and white stripes down the outer leg and a small script logo on the thigh",
		"negative": [],
		"source_images": ["G2"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G2"],
		"image": "/shots/items/bottom_track_pants_royal_blue_stripe_01.jpg"
	},
	{
		"id": "bottom_trousers_leather_straight_black_01",
		"name": "Black leather straight trousers",
		"slot": "bottom",
		"subcategory": "trousers",
		"style_tags": ["leather_tailoring", "rock_moto"],
		"colors": ["black"],
		"materials": ["soft leather"],
		"patterns": [],
		"fit_silhouette": "relaxed straight leg, full length breaking on the boot",
		"details": ["natural creasing at knees", "subtle shine"],
		"styling_notes": "matched with the leather blazer",
		"prompt": "black soft leather straight-leg trousers, relaxed fit, full length breaking over boots, natural creases at the knees",
		"negative": [],
		"source_images": ["E1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E1"],
		"image": "/shots/items/bottom_trousers_leather_straight_black_01.jpg"
	},
	{
		"id": "bottom_trousers_pleated_wide_khaki_01",
		"name": "Khaki pleated wide trousers",
		"slot": "bottom",
		"subcategory": "trousers",
		"style_tags": [
			"vintage_workwear",
			"minimal_basics",
			"streetwear_90s"
		],
		"colors": ["stone khaki"],
		"materials": ["cotton twill"],
		"patterns": [],
		"fit_silhouette": "high-rise, front pleats, wide relaxed legs",
		"details": ["soft drape"],
		"styling_notes": "belted with a nylon belt",
		"prompt": "stone khaki cotton twill pleated trousers with a high rise and wide relaxed legs",
		"negative": [],
		"source_images": ["G5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G5"],
		"image": "/shots/items/bottom_trousers_pleated_wide_khaki_01.jpg"
	},
	{
		"id": "belt_waist_braided_leather_tan_01",
		"name": "Tan braided leather belt",
		"slot": "belt_waist",
		"subcategory": "belt",
		"style_tags": ["vintage_workwear", "americana"],
		"colors": ["tan"],
		"materials": ["braided leather"],
		"patterns": [],
		"fit_silhouette": "standard width",
		"details": ["woven braid", "brass buckle"],
		"styling_notes": "",
		"prompt": "tan woven braided leather belt with a brass buckle",
		"negative": [],
		"source_images": ["E3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E3_left"],
		"image": "/shots/items/belt_waist_braided_leather_tan_01.jpg"
	},
	{
		"id": "belt_waist_bullet_silver_01",
		"name": "Silver bullet belt",
		"slot": "belt_waist",
		"subcategory": "belt",
		"style_tags": [
			"punk",
			"rock_moto",
			"avant_garde_dark"
		],
		"colors": ["silver", "black"],
		"materials": ["metal", "leather"],
		"patterns": [],
		"fit_silhouette": "belt worn at the hips",
		"details": ["row of upright silver bullet-cartridge spikes all the way around"],
		"styling_notes": "",
		"prompt": "black belt lined with a continuous row of upright silver bullet-cartridge spikes, worn on the hips",
		"negative": [],
		"source_images": ["E5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E5"],
		"image": "/shots/items/belt_waist_bullet_silver_01.jpg"
	},
	{
		"id": "belt_waist_chain_charms_heart_butterfly_01",
		"name": "Silver charm chain belt",
		"slot": "belt_waist",
		"subcategory": "chain_belt",
		"style_tags": [
			"y2k",
			"coquette",
			"gyaru"
		],
		"colors": ["silver", "pink"],
		"materials": ["metal chain"],
		"patterns": [],
		"fit_silhouette": "two draped chains across the front hips",
		"details": [
			"heart charms",
			"cross charm",
			"rhinestone butterfly charm"
		],
		"styling_notes": "hung alongside the pink belt",
		"prompt": "draped silver chain belt across the hips with dangling heart, cross and rhinestone butterfly charms",
		"negative": [],
		"source_images": ["C3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C3"],
		"image": "/shots/items/belt_waist_chain_charms_heart_butterfly_01.jpg"
	},
	{
		"id": "belt_waist_draped_chains_silver_01",
		"name": "Draped silver hip chains",
		"slot": "belt_waist",
		"subcategory": "chain_belt",
		"style_tags": [
			"punk",
			"avant_garde_diy",
			"y2k"
		],
		"colors": ["silver"],
		"materials": ["metal curb chain"],
		"patterns": [],
		"fit_silhouette": "many silver chains looped from the waist across hips and thighs",
		"details": ["multiple drape lengths", "swagged loops"],
		"styling_notes": "hung off the lowest belt",
		"prompt": "multiple silver curb chains swagged in loose loops from the hips across the thighs, layered drape lengths",
		"negative": [],
		"source_images": ["C2"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C2"],
		"image": "/shots/items/belt_waist_draped_chains_silver_01.jpg"
	},
	{
		"id": "belt_waist_grommet_studded_black_01",
		"name": "Black grommet studded belt",
		"slot": "belt_waist",
		"subcategory": "belt",
		"style_tags": [
			"gothic",
			"punk",
			"y2k"
		],
		"colors": ["black", "silver"],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "wide belt worn slung low with the long tail hanging down the thigh",
		"details": ["rows of silver grommets and round studs", "large rounded roller buckle"],
		"styling_notes": "buckled off-center so the tail drops",
		"prompt": "wide black leather belt with rows of silver grommets and round studs, large silver rounded buckle, slung low on the hips with the long tail hanging down",
		"negative": [],
		"source_images": ["C1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C1"],
		"image": "/shots/items/belt_waist_grommet_studded_black_01.jpg"
	},
	{
		"id": "belt_waist_leather_black_silver_buckle_01",
		"name": "Black leather belt",
		"slot": "belt_waist",
		"subcategory": "belt",
		"style_tags": [
			"minimal_basics",
			"americana",
			"streetwear_90s"
		],
		"colors": ["black", "silver"],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "classic width",
		"details": ["silver buckle"],
		"styling_notes": "",
		"prompt": "classic black leather belt with a silver buckle",
		"negative": [],
		"source_images": [
			"F4",
			"F5",
			"G1"
		],
		"render_style_seen": "photo",
		"outfit_ids": [
			"outfit_F4",
			"outfit_F5",
			"outfit_G1"
		],
		"image": "/shots/items/belt_waist_leather_black_silver_buckle_01.jpg"
	},
	{
		"id": "belt_waist_leather_brown_gold_buckle_01",
		"name": "Brown leather belt with gold buckle",
		"slot": "belt_waist",
		"subcategory": "belt",
		"style_tags": [
			"streetwear_90s",
			"western",
			"vintage_workwear"
		],
		"colors": ["brown", "gold"],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "standard width belt",
		"details": ["gold rectangular buckle"],
		"styling_notes": "threaded through baggy jeans",
		"prompt": "classic brown leather belt with a gold rectangular buckle",
		"negative": [],
		"source_images": ["C4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_C4"],
		"image": "/shots/items/belt_waist_leather_brown_gold_buckle_01.jpg"
	},
	{
		"id": "belt_waist_leather_red_silver_buckle_01",
		"name": "Red leather belt",
		"slot": "belt_waist",
		"subcategory": "belt",
		"style_tags": ["y2k_streetwear", "streetwear_90s"],
		"colors": ["red", "silver"],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "standard belt worn low",
		"details": ["silver rectangular buckle"],
		"styling_notes": "over low-rise jorts",
		"prompt": "glossy red leather belt with a silver rectangular buckle worn low on the hips",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_right"],
		"image": "/shots/items/belt_waist_leather_red_silver_buckle_01.jpg"
	},
	{
		"id": "belt_waist_nylon_cobra_buckle_black_01",
		"name": "Black nylon quick-release belt",
		"slot": "belt_waist",
		"subcategory": "belt",
		"style_tags": ["techwear", "streetwear_90s"],
		"colors": ["black", "gunmetal"],
		"materials": ["nylon webbing"],
		"patterns": [],
		"fit_silhouette": "slim webbing belt",
		"details": ["metal quick-release cobra buckle"],
		"styling_notes": "",
		"prompt": "black nylon webbing belt with a gunmetal quick-release cobra buckle",
		"negative": [],
		"source_images": ["G5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G5"],
		"image": "/shots/items/belt_waist_nylon_cobra_buckle_black_01.jpg"
	},
	{
		"id": "belt_waist_rhinestone_star_buckle_pink_01",
		"name": "Pink rhinestone star-buckle belt",
		"slot": "belt_waist",
		"subcategory": "belt",
		"style_tags": [
			"y2k",
			"gyaru",
			"coquette"
		],
		"colors": ["blush pink", "silver"],
		"materials": ["leather", "rhinestones"],
		"patterns": [],
		"fit_silhouette": "wide belt slung low on the hips",
		"details": ["studded with rhinestones", "big ornate silver star buckle"],
		"styling_notes": "worn low over a denim mini",
		"prompt": "wide blush-pink leather belt studded with rhinestones and a big ornate silver star buckle, slung low on the hips",
		"negative": [],
		"source_images": ["C3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C3"],
		"image": "/shots/items/belt_waist_rhinestone_star_buckle_pink_01.jpg"
	},
	{
		"id": "belt_waist_studded_oring_black_01",
		"name": "Black studded O-ring hip belt",
		"slot": "belt_waist",
		"subcategory": "belt",
		"style_tags": [
			"indie_sleaze",
			"punk",
			"y2k"
		],
		"colors": ["black", "silver"],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "slung loosely on the hips",
		"details": ["silver studs", "large O-ring hardware"],
		"styling_notes": "over a knit dress",
		"prompt": "black leather hip belt with silver studs and large O-ring hardware slung loosely low on the hips",
		"negative": [],
		"source_images": ["F1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F1"],
		"image": "/shots/items/belt_waist_studded_oring_black_01.jpg"
	},
	{
		"id": "legwear_knee_sock_cross_black_01",
		"name": "Black knee socks with silver cross",
		"slot": "legwear",
		"subcategory": "knee_socks",
		"style_tags": ["gothic", "gothic_lolita"],
		"colors": ["black", "silver"],
		"materials": ["knit"],
		"patterns": ["embroidered cross"],
		"fit_silhouette": "knee-high, opaque",
		"details": ["silver embroidered gothic cross on the outer calf"],
		"styling_notes": "worn mismatched with a red lace-up sock",
		"prompt": "opaque black knee-high socks with a small silver embroidered gothic cross on the outer calf",
		"negative": [],
		"source_images": ["A4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A4"],
		"image": "/shots/items/legwear_knee_sock_cross_black_01.jpg"
	},
	{
		"id": "legwear_leg_warmers_chunky_cream_01",
		"name": "Cream chunky ribbed leg warmers",
		"slot": "legwear",
		"subcategory": "leg_warmers",
		"style_tags": [
			"kawaii",
			"y2k",
			"japanese_school"
		],
		"colors": ["cream"],
		"materials": ["chunky rib knit"],
		"patterns": [],
		"fit_silhouette": "thick slouchy tubes bunched from ankle to mid-calf",
		"details": ["deep vertical ribbing", "scrunched folds"],
		"styling_notes": "pulled over the top of slouch boots",
		"prompt": "thick cream chunky rib-knit leg warmers scrunched and bunched over the tops of boots, slouchy stacked folds around the calves",
		"negative": [],
		"source_images": ["A1"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A1"],
		"image": "/shots/items/legwear_leg_warmers_chunky_cream_01.jpg"
	},
	{
		"id": "legwear_loose_socks_cable_knit_white_01",
		"name": "White cable-knit loose socks",
		"slot": "legwear",
		"subcategory": "loose_socks",
		"style_tags": [
			"japanese_school",
			"gyaru",
			"y2k"
		],
		"colors": ["white"],
		"materials": ["chunky cable knit"],
		"patterns": [],
		"fit_silhouette": "extra thick and long, slouched in heavy rings from ankle to calf",
		"details": ["chunky cable pattern"],
		"styling_notes": "worn with brown loafers",
		"prompt": "extra-thick white chunky cable-knit loose socks slouched in heavy rolls from the ankle up the calf, 90s Japanese gyaru style",
		"negative": [],
		"source_images": ["B4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B4"],
		"image": "/shots/items/legwear_loose_socks_cable_knit_white_01.jpg"
	},
	{
		"id": "legwear_loose_socks_slouch_white_01",
		"name": "White slouchy loose socks",
		"slot": "legwear",
		"subcategory": "loose_socks",
		"style_tags": [
			"japanese_school",
			"gyaru",
			"y2k",
			"streetwear_90s"
		],
		"colors": ["white"],
		"materials": ["rib knit"],
		"patterns": [],
		"fit_silhouette": "thick tube socks pushed down into loose rings around the calf",
		"details": ["bunched slouch rings"],
		"styling_notes": "with loafers or sneakers",
		"prompt": "thick white ribbed slouch socks pushed down into loose bunched rings around the lower calf, Japanese loose-socks style",
		"negative": [],
		"source_images": [
			"B2",
			"D2",
			"D5"
		],
		"render_style_seen": "illustration",
		"outfit_ids": [
			"outfit_B2",
			"outfit_D2_left",
			"outfit_D5"
		],
		"image": "/shots/items/legwear_loose_socks_slouch_white_01.jpg"
	},
	{
		"id": "legwear_sock_ribbon_lace_up_red_01",
		"name": "Red sheer sock with ribbon lace-up",
		"slot": "legwear",
		"subcategory": "socks",
		"style_tags": ["gothic_lolita", "coquette"],
		"colors": ["crimson red"],
		"materials": ["sheer nylon", "satin ribbon"],
		"patterns": [],
		"fit_silhouette": "mid-calf sheer sock",
		"details": ["red satin ribbon criss-crossing up the calf like ballet laces", "loose bow tails at top"],
		"styling_notes": "worn on one leg only, mismatched pair",
		"prompt": "sheer crimson red mid-calf sock wrapped with red satin ribbon criss-crossing up the calf like ballet-shoe lacing, bow tails hanging loose",
		"negative": [],
		"source_images": ["A4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A4"],
		"image": "/shots/items/legwear_sock_ribbon_lace_up_red_01.jpg"
	},
	{
		"id": "legwear_socks_crew_white_01",
		"name": "White crew socks",
		"slot": "legwear",
		"subcategory": "socks",
		"style_tags": [
			"minimal_basics",
			"japanese_school",
			"streetwear_90s"
		],
		"colors": ["white"],
		"materials": ["cotton rib"],
		"patterns": [],
		"fit_silhouette": "crew height, ending mid-calf, smooth",
		"details": ["fine ribbed cuff"],
		"styling_notes": "worn with loafers, sandals or sneakers",
		"prompt": "plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf",
		"negative": [],
		"source_images": [
			"A2",
			"B3",
			"D2",
			"F3",
			"F6",
			"G3",
			"G4",
			"G5"
		],
		"render_style_seen": "both",
		"outfit_ids": [
			"outfit_A2",
			"outfit_B3",
			"outfit_D2_right",
			"outfit_F3",
			"outfit_F6",
			"outfit_G3",
			"outfit_G4",
			"outfit_G5"
		],
		"image": "/shots/items/legwear_socks_crew_white_01.jpg"
	},
	{
		"id": "legwear_socks_tall_ribbed_white_01",
		"name": "Tall white ribbed socks",
		"slot": "legwear",
		"subcategory": "socks",
		"style_tags": ["streetwear_90s", "sportswear"],
		"colors": ["white"],
		"materials": ["rib knit"],
		"patterns": [],
		"fit_silhouette": "over-the-calf socks pulled up high",
		"details": [],
		"styling_notes": "shown between hem and shoe",
		"prompt": "tall white ribbed over-the-calf socks pulled up high",
		"negative": [],
		"source_images": ["F2"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F2"],
		"image": "/shots/items/legwear_socks_tall_ribbed_white_01.jpg"
	},
	{
		"id": "legwear_socks_tube_gray_01",
		"name": "Gray ribbed tube socks",
		"slot": "legwear",
		"subcategory": "socks",
		"style_tags": ["streetwear_90s", "sportswear"],
		"colors": ["heather gray"],
		"materials": ["rib knit"],
		"patterns": [],
		"fit_silhouette": "mid-calf tube socks",
		"details": [],
		"styling_notes": "with chunky sneakers and jorts",
		"prompt": "heather gray ribbed tube socks pulled up to mid-calf",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_right"],
		"image": "/shots/items/legwear_socks_tube_gray_01.jpg"
	},
	{
		"id": "legwear_thigh_highs_lace_top_black_01",
		"name": "Black sheer lace-top thigh-highs",
		"slot": "legwear",
		"subcategory": "thigh_highs",
		"style_tags": [
			"indie_sleaze",
			"gothic",
			"coquette"
		],
		"colors": ["black"],
		"materials": ["sheer nylon", "lace"],
		"patterns": [],
		"fit_silhouette": "thigh-high stockings",
		"details": ["wide black lace band at the top"],
		"styling_notes": "with pointed heels",
		"prompt": "sheer black thigh-high stockings with a wide black lace band at the top",
		"negative": [],
		"source_images": ["F1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F1"],
		"image": "/shots/items/legwear_thigh_highs_lace_top_black_01.jpg"
	},
	{
		"id": "legwear_thigh_highs_sheer_white_01",
		"name": "Sheer white thigh-high stockings",
		"slot": "legwear",
		"subcategory": "thigh_highs",
		"style_tags": [
			"coquette",
			"preppy_90s",
			"y2k"
		],
		"colors": ["white"],
		"materials": ["sheer nylon"],
		"patterns": [],
		"fit_silhouette": "thigh-high with an opaque band at the top",
		"details": ["sheer leg", "solid welt band"],
		"styling_notes": "worn with platform pumps",
		"prompt": "sheer white thigh-high stockings with a solid opaque welt band at the top of the thigh",
		"negative": [],
		"source_images": ["D1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_D1"],
		"image": "/shots/items/legwear_thigh_highs_sheer_white_01.jpg"
	},
	{
		"id": "shoes_boots_chelsea_suede_brown_01",
		"name": "Dark brown suede Chelsea boots",
		"slot": "shoes",
		"subcategory": "ankle_boots",
		"style_tags": ["rock_moto", "leather_tailoring"],
		"colors": ["dark brown"],
		"materials": ["suede"],
		"patterns": [],
		"fit_silhouette": "ankle-high Chelsea boot, low heel",
		"details": ["elastic side gores", "almond toe"],
		"styling_notes": "with white socks under cropped jeans",
		"prompt": "dark brown suede ankle Chelsea boots with elastic side panels, almond toe and low heel",
		"negative": [],
		"source_images": ["G4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G4"],
		"image": "/shots/items/shoes_boots_chelsea_suede_brown_01.jpg"
	},
	{
		"id": "shoes_boots_desert_suede_tan_01",
		"name": "Tan suede desert boots",
		"slot": "shoes",
		"subcategory": "ankle_boots",
		"style_tags": ["vintage_workwear", "americana"],
		"colors": ["tan", "sand"],
		"materials": ["suede"],
		"patterns": [],
		"fit_silhouette": "ankle-high lace-up chukka/work boot",
		"details": ["crepe-style sole"],
		"styling_notes": "",
		"prompt": "sand tan suede lace-up ankle desert boots with a soft crepe sole",
		"negative": [],
		"source_images": ["E3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E3_left"],
		"image": "/shots/items/shoes_boots_desert_suede_tan_01.jpg"
	},
	{
		"id": "shoes_boots_hiker_nubuck_black_01",
		"name": "Black nubuck hiking boots",
		"slot": "shoes",
		"subcategory": "work_boots",
		"style_tags": ["vintage_workwear", "streetwear_90s"],
		"colors": ["black", "gold"],
		"materials": ["nubuck"],
		"patterns": [],
		"fit_silhouette": "ankle-high lace-up hiker",
		"details": ["gold speed hooks", "padded collar"],
		"styling_notes": "",
		"prompt": "black nubuck ankle-high lace-up hiking boots with gold speed hooks and a padded collar",
		"negative": [],
		"source_images": ["F4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F4"],
		"image": "/shots/items/shoes_boots_hiker_nubuck_black_01.jpg"
	},
	{
		"id": "shoes_boots_knee_high_glossy_black_01",
		"name": "Glossy black knee-high boots",
		"slot": "shoes",
		"subcategory": "knee_boots",
		"style_tags": [
			"y2k",
			"gyaru",
			"preppy"
		],
		"colors": ["black"],
		"materials": ["glossy leather"],
		"patterns": [],
		"fit_silhouette": "knee-high fitted shaft, low block heel, round toe",
		"details": ["sleek shine"],
		"styling_notes": "worn bare-legged with a mini dress",
		"prompt": "sleek glossy black leather knee-high boots with a fitted shaft, rounded toe and low chunky block heel",
		"negative": [],
		"source_images": ["B1"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B1"],
		"image": "/shots/items/shoes_boots_knee_high_glossy_black_01.jpg"
	},
	{
		"id": "shoes_boots_platform_tractor_black_01",
		"name": "Black platform tractor-sole boots",
		"slot": "shoes",
		"subcategory": "platform_boots",
		"style_tags": [
			"avant_garde_dark",
			"avant_garde_rick",
			"gothic"
		],
		"colors": ["black"],
		"materials": ["leather", "rubber"],
		"patterns": [],
		"fit_silhouette": "calf-high boot on a huge rounded tractor platform",
		"details": ["exaggerated bulbous lug sole", "pull-on shaft"],
		"styling_notes": "jeans tucked inside",
		"prompt": "black leather calf-high boots on a huge rounded tractor-tread platform sole, bulbous exaggerated shape, jeans tucked in",
		"negative": ["thin sole", "pointed toe"],
		"source_images": ["E4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E4"],
		"image": "/shots/items/shoes_boots_platform_tractor_black_01.jpg"
	},
	{
		"id": "shoes_boots_pointed_cuban_heel_black_01",
		"name": "Black pointed Cuban-heel boots",
		"slot": "shoes",
		"subcategory": "ankle_boots",
		"style_tags": [
			"leather_tailoring",
			"western",
			"rock_moto"
		],
		"colors": ["black", "tan"],
		"materials": ["polished leather"],
		"patterns": [],
		"fit_silhouette": "pointed toe ankle boot, short Cuban heel",
		"details": ["tan stacked leather sole edge", "high polish"],
		"styling_notes": "under leather trousers",
		"prompt": "polished black leather pointed-toe ankle boots with a short Cuban heel and a contrasting tan stacked leather sole",
		"negative": [],
		"source_images": ["E1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E1"],
		"image": "/shots/items/shoes_boots_pointed_cuban_heel_black_01.jpg"
	},
	{
		"id": "shoes_boots_slouch_suede_brown_01",
		"name": "Dark brown slouchy suede boots",
		"slot": "shoes",
		"subcategory": "slouch_boots",
		"style_tags": [
			"french_casual",
			"y2k",
			"cozy_layered"
		],
		"colors": ["dark brown"],
		"materials": ["suede"],
		"patterns": [],
		"fit_silhouette": "mid-calf slouch shaft with heavy wrinkles, low block heel, rounded toe",
		"details": ["soft collapsed shaft", "stacked accordion folds"],
		"styling_notes": "worn with leg warmers spilling over the top",
		"prompt": "dark brown soft suede mid-calf slouch boots, shaft collapsing into deep accordion wrinkles, rounded toe, short chunky block heel",
		"negative": ["stiff riding boot", "stiletto heel"],
		"source_images": ["A1"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A1"],
		"image": "/shots/items/shoes_boots_slouch_suede_brown_01.jpg"
	},
	{
		"id": "shoes_cowboy_boots_metal_toe_black_01",
		"name": "Black cowboy boots with silver toe cap",
		"slot": "shoes",
		"subcategory": "cowboy_boots",
		"style_tags": ["western", "luxury_street"],
		"colors": [
			"black",
			"silver",
			"white"
		],
		"materials": ["polished leather", "engraved metal"],
		"patterns": ["decorative stitching"],
		"fit_silhouette": "pointed western boot, stacked heel",
		"details": [
			"white decorative western stitching on the vamp",
			"engraved silver metal toe cap",
			"small silver flower and star studs on the heel"
		],
		"styling_notes": "under flare jeans",
		"prompt": "polished black leather pointed cowboy boots with white decorative western stitching, an engraved silver metal toe cap, and small silver flower and star studs on the stacked heel",
		"negative": [],
		"source_images": ["I5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I5"],
		"image": "/shots/items/shoes_cowboy_boots_metal_toe_black_01.jpg"
	},
	{
		"id": "shoes_derby_chunky_black_leather_01",
		"name": "Black chunky leather derby shoes",
		"slot": "shoes",
		"subcategory": "derbies",
		"style_tags": [
			"grunge",
			"punk",
			"streetwear_90s"
		],
		"colors": ["black", "yellow"],
		"materials": ["smooth leather"],
		"patterns": [],
		"fit_silhouette": "3-eye derby on a chunky air-cushion sole",
		"details": ["yellow welt stitching", "rounded toe"],
		"styling_notes": "with white socks",
		"prompt": "black smooth leather three-eyelet derby shoes on a chunky air-cushioned sole with yellow welt stitching, rounded toe",
		"negative": [],
		"source_images": ["F2", "F3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F2", "outfit_F3"],
		"image": "/shots/items/shoes_derby_chunky_black_leather_01.jpg"
	},
	{
		"id": "shoes_loafers_bow_chunky_black_patent_01",
		"name": "Black patent bow loafers",
		"slot": "shoes",
		"subcategory": "loafers",
		"style_tags": [
			"japanese_school",
			"coquette",
			"preppy"
		],
		"colors": ["black"],
		"materials": ["patent leather"],
		"patterns": [],
		"fit_silhouette": "chunky low-heel loafer with slightly lugged sole",
		"details": ["small bow or tassel ornament on the vamp", "high shine"],
		"styling_notes": "worn with slouch socks",
		"prompt": "glossy black patent leather loafers with a small bow ornament on the vamp, chunky slightly lugged sole and low heel",
		"negative": [],
		"source_images": ["B2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B2"],
		"image": "/shots/items/shoes_loafers_bow_chunky_black_patent_01.jpg"
	},
	{
		"id": "shoes_loafers_leather_black_01",
		"name": "Black leather loafers",
		"slot": "shoes",
		"subcategory": "loafers",
		"style_tags": ["luxury_street", "leather_tailoring"],
		"colors": ["black"],
		"materials": ["polished leather"],
		"patterns": [],
		"fit_silhouette": "slim low loafer",
		"details": [],
		"styling_notes": "under puddled wide pants",
		"prompt": "slim polished black leather loafers with a low heel and almond toe, high shine, peeking under puddled trouser hems",
		"negative": [],
		"source_images": ["E3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E3_right"],
		"image": "/shots/items/shoes_loafers_leather_black_01.jpg"
	},
	{
		"id": "shoes_loafers_penny_black_patent_01",
		"name": "Black patent penny loafers",
		"slot": "shoes",
		"subcategory": "loafers",
		"style_tags": [
			"japanese_school",
			"preppy",
			"dark_academia"
		],
		"colors": ["black"],
		"materials": ["patent leather"],
		"patterns": [],
		"fit_silhouette": "slim low-heeled penny loafer, rounded toe",
		"details": [
			"glossy mirror shine",
			"penny strap across the vamp",
			"low stacked heel"
		],
		"styling_notes": "worn with white socks",
		"prompt": "glossy black patent leather penny loafers, classic penny strap across the vamp, rounded toe, low stacked heel, mirror-like shine",
		"negative": [],
		"source_images": ["A2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A2"],
		"image": "/shots/items/shoes_loafers_penny_black_patent_01.jpg"
	},
	{
		"id": "shoes_loafers_penny_dark_brown_01",
		"name": "Dark brown penny loafers",
		"slot": "shoes",
		"subcategory": "loafers",
		"style_tags": ["japanese_school", "preppy"],
		"colors": ["dark brown"],
		"materials": ["polished leather"],
		"patterns": [],
		"fit_silhouette": "classic low-heel penny loafer, rounded toe",
		"details": ["penny strap", "subtle polish"],
		"styling_notes": "worn with loose socks",
		"prompt": "dark brown polished leather penny loafers, classic penny strap, rounded toe, low heel",
		"negative": [],
		"source_images": ["B4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B4"],
		"image": "/shots/items/shoes_loafers_penny_dark_brown_01.jpg"
	},
	{
		"id": "shoes_mary_janes_flat_cream_01",
		"name": "Cream Mary Jane flats",
		"slot": "shoes",
		"subcategory": "mary_janes",
		"style_tags": [
			"coquette",
			"kawaii",
			"classic_lolita"
		],
		"colors": ["cream"],
		"materials": ["smooth leather"],
		"patterns": [],
		"fit_silhouette": "flat round-toe Mary Janes with a single strap",
		"details": ["thin buckled instep strap"],
		"styling_notes": "peeking under a maxi hem",
		"prompt": "soft cream leather round-toe Mary Jane flats with a single thin buckled strap across the instep",
		"negative": [],
		"source_images": ["A3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A3"],
		"image": "/shots/items/shoes_mary_janes_flat_cream_01.jpg"
	},
	{
		"id": "shoes_mary_janes_platform_black_patent_01",
		"name": "Black patent platform Mary Janes",
		"slot": "shoes",
		"subcategory": "mary_janes",
		"style_tags": [
			"gothic_lolita",
			"gothic",
			"y2k"
		],
		"colors": ["black", "silver"],
		"materials": ["patent leather"],
		"patterns": [],
		"fit_silhouette": "chunky 2-inch platform sole, thick block heel, rounded toe",
		"details": [
			"single buckled ankle strap",
			"glossy finish",
			"silver buckle"
		],
		"styling_notes": "worn with mismatched knee socks",
		"prompt": "glossy black patent leather platform Mary Jane shoes, chunky two-inch platform sole and thick block heel, rounded toe, single silver-buckled strap",
		"negative": ["sneaker sole", "pointed toe"],
		"source_images": ["A4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A4"],
		"image": "/shots/items/shoes_mary_janes_platform_black_patent_01.jpg"
	},
	{
		"id": "shoes_mary_janes_platform_star_pink_01",
		"name": "Pink patent star platform Mary Janes",
		"slot": "shoes",
		"subcategory": "mary_janes",
		"style_tags": [
			"y2k",
			"coquette",
			"kawaii"
		],
		"colors": ["pastel pink", "black"],
		"materials": ["patent leather"],
		"patterns": ["stars"],
		"fit_silhouette": "towering platform pump with thick block heel, rounded toe",
		"details": ["black star prints scattered over the platform and heel", "ankle strap with buckle"],
		"styling_notes": "worn with white thigh-highs",
		"prompt": "glossy pastel pink patent platform Mary Jane pumps, chunky block heel and thick platform sprinkled with small black stars, buckled ankle strap",
		"negative": ["stiletto", "flat"],
		"source_images": ["D1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_D1"],
		"image": "/shots/items/shoes_mary_janes_platform_star_pink_01.jpg"
	},
	{
		"id": "shoes_pumps_pointed_buckle_black_01",
		"name": "Black pointed buckle pumps",
		"slot": "shoes",
		"subcategory": "pumps",
		"style_tags": ["indie_sleaze", "luxury_street"],
		"colors": ["black", "silver"],
		"materials": ["patent leather"],
		"patterns": [],
		"fit_silhouette": "sharp pointed-toe pump, slim heel",
		"details": ["silver buckle hardware on the vamp"],
		"styling_notes": "",
		"prompt": "sharp pointed-toe glossy black patent pumps with a slim heel and silver buckle hardware across the vamp",
		"negative": [],
		"source_images": ["F1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F1"],
		"image": "/shots/items/shoes_pumps_pointed_buckle_black_01.jpg"
	},
	{
		"id": "shoes_pumps_pointed_stiletto_black_suede_01",
		"name": "Black suede pointed stilettos",
		"slot": "shoes",
		"subcategory": "pumps",
		"style_tags": ["coquette", "indie_sleaze"],
		"colors": ["black"],
		"materials": ["suede"],
		"patterns": [],
		"fit_silhouette": "classic pointed-toe pump, thin stiletto heel about 3.5 inches",
		"details": ["matte suede"],
		"styling_notes": "peeking out under lace-hem jeans",
		"prompt": "matte black suede pointed-toe stiletto pumps with a slim three-and-a-half-inch heel",
		"negative": [],
		"source_images": ["A5"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A5"],
		"image": "/shots/items/shoes_pumps_pointed_stiletto_black_suede_01.jpg"
	},
	{
		"id": "shoes_sandals_two_buckle_black_01",
		"name": "Black two-strap buckle sandals",
		"slot": "shoes",
		"subcategory": "sandals",
		"style_tags": [
			"mori_girl",
			"french_casual",
			"dark_academia"
		],
		"colors": ["black", "gold"],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "flat footbed slide sandal with two wide straps",
		"details": ["gold pin buckles", "chunky sole"],
		"styling_notes": "worn over white crew socks",
		"prompt": "black leather two-strap slide sandals with gold pin buckles on wide straps and a chunky footbed sole, worn over white socks",
		"negative": [],
		"source_images": ["B3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B3"],
		"image": "/shots/items/shoes_sandals_two_buckle_black_01.jpg"
	},
	{
		"id": "shoes_slip_on_bandana_red_01",
		"name": "Red bandana-print slip-on sneakers",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": [
			"skater",
			"streetwear_90s",
			"western"
		],
		"colors": ["red", "white"],
		"materials": ["canvas"],
		"patterns": ["bandana print"],
		"fit_silhouette": "low canvas slip-on",
		"details": ["white rubber sole", "red and white bandana pattern"],
		"styling_notes": "",
		"prompt": "red and white bandana-print canvas slip-on sneakers with white rubber soles",
		"negative": [],
		"source_images": ["H4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_H4"],
		"image": "/shots/items/shoes_slip_on_bandana_red_01.jpg"
	},
	{
		"id": "shoes_sneakers_air_runner_black_01",
		"name": "Black air-sole runners",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": ["uk_drill", "sportswear"],
		"colors": ["black"],
		"materials": ["mesh", "synthetic"],
		"patterns": [],
		"fit_silhouette": "low running sneaker with visible air units",
		"details": ["wavy side overlays", "all-black"],
		"styling_notes": "",
		"prompt": "all-black running sneakers with wavy layered side overlays and visible air cushioning",
		"negative": [],
		"source_images": ["I4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I4"],
		"image": "/shots/items/shoes_sneakers_air_runner_black_01.jpg"
	},
	{
		"id": "shoes_sneakers_chunky_low_white_01",
		"name": "Chunky white low-top sneakers",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": [
			"streetwear_90s",
			"y2k_streetwear",
			"sportswear"
		],
		"colors": ["white"],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "chunky low-top court sneaker with thick cupsole",
		"details": ["perforated toe", "white laces"],
		"styling_notes": "peeking out under pooled jeans",
		"prompt": "chunky all-white leather low-top court sneakers with a thick cupsole, perforated toe box and white laces",
		"negative": ["running sneaker", "thin sole"],
		"source_images": [
			"C4",
			"H5",
			"I3"
		],
		"render_style_seen": "both",
		"outfit_ids": [
			"outfit_C4",
			"outfit_H5",
			"outfit_I3_green"
		],
		"image": "/shots/items/shoes_sneakers_chunky_low_white_01.jpg"
	},
	{
		"id": "shoes_sneakers_chunky_white_gray_01",
		"name": "Chunky white skate-runner sneakers",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": ["y2k_streetwear", "streetwear_90s"],
		"colors": ["white", "light gray"],
		"materials": ["leather", "mesh"],
		"patterns": [],
		"fit_silhouette": "bulky padded sneaker",
		"details": ["thick laces", "layered panels"],
		"styling_notes": "",
		"prompt": "bulky white and light gray padded sneakers with layered panels and thick laces",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_right"],
		"image": "/shots/items/shoes_sneakers_chunky_white_gray_01.jpg"
	},
	{
		"id": "shoes_sneakers_court_low_white_01",
		"name": "White low court sneakers",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": [
			"sportswear",
			"streetwear_90s",
			"minimal_basics"
		],
		"colors": ["white"],
		"materials": ["smooth leather"],
		"patterns": [],
		"fit_silhouette": "slim low-profile court shoe",
		"details": ["minimal panels", "flat cupsole"],
		"styling_notes": "",
		"prompt": "clean white smooth leather low-profile court sneakers with minimal panels and a flat cupsole",
		"negative": [],
		"source_images": ["G2"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G2"],
		"image": "/shots/items/shoes_sneakers_court_low_white_01.jpg"
	},
	{
		"id": "shoes_sneakers_high_top_custom_white_01",
		"name": "White custom-drawn high-top sneakers",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": ["streetwear_90s", "hip_hop_2000s"],
		"colors": ["white", "black"],
		"materials": ["leather"],
		"patterns": ["hand-drawn graphics"],
		"fit_silhouette": "chunky high-top basketball sneaker",
		"details": ["black marker-drawn doodles and spots on one shoe", "ankle strap"],
		"styling_notes": "with white socks",
		"prompt": "chunky white leather high-top basketball sneakers, one customized with black hand-drawn marker doodles and spots, ankle strap",
		"negative": [],
		"source_images": ["G3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G3"],
		"image": "/shots/items/shoes_sneakers_high_top_custom_white_01.jpg"
	},
	{
		"id": "shoes_sneakers_high_top_white_01",
		"name": "White high-top sneakers",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": ["streetwear_90s", "sportswear"],
		"colors": ["white"],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "classic high-top basketball sneaker",
		"details": [
			"padded collar",
			"tonal swoosh-style side panel",
			"white laces"
		],
		"styling_notes": "worn with slouch socks",
		"prompt": "clean white leather high-top basketball sneakers with a padded ankle collar, tonal side panel and white laces",
		"negative": [],
		"source_images": ["D2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D2_left"],
		"image": "/shots/items/shoes_sneakers_high_top_white_01.jpg"
	},
	{
		"id": "shoes_sneakers_mesh_netting_cream_01",
		"name": "Cream sneakers with mesh netting",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": ["streetwear_90s", "sportswear"],
		"colors": ["white", "cream"],
		"materials": ["leather", "mesh"],
		"patterns": [],
		"fit_silhouette": "mid-cut retro basketball sneaker",
		"details": [
			"mesh netting side panels",
			"wing eyelets",
			"visible air unit"
		],
		"styling_notes": "",
		"prompt": "white and cream retro mid-cut basketball sneakers with mesh netting side panels, plastic wing eyelets and a visible air heel",
		"negative": [],
		"source_images": ["G5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G5"],
		"image": "/shots/items/shoes_sneakers_mesh_netting_cream_01.jpg"
	},
	{
		"id": "shoes_sneakers_metallic_silver_wave_01",
		"name": "Metallic silver wave-line sneakers",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": [
			"uk_drill",
			"y2k_streetwear",
			"sportswear"
		],
		"colors": [
			"metallic silver",
			"white",
			"red"
		],
		"materials": ["metallic synthetic"],
		"patterns": ["ripple lines"],
		"fit_silhouette": "sleek low running sneaker with full-length air sole",
		"details": ["layered ripple wave lines", "reflective piping"],
		"styling_notes": "",
		"prompt": "sleek metallic silver running sneakers with layered water-ripple wave lines, reflective piping and a full-length visible air sole",
		"negative": [],
		"source_images": ["I3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I3_yellow"],
		"image": "/shots/items/shoes_sneakers_metallic_silver_wave_01.jpg"
	},
	{
		"id": "shoes_sneakers_platform_high_top_megalug_black_01",
		"name": "Black platform high-top sneakers",
		"slot": "shoes",
		"subcategory": "platform_sneakers",
		"style_tags": [
			"avant_garde_rick",
			"avant_garde_dark",
			"gothic"
		],
		"colors": ["black"],
		"materials": ["canvas", "rubber"],
		"patterns": [],
		"fit_silhouette": "high-top canvas sneaker on a massive lugged platform",
		"details": ["huge chunky tooth-tread sole", "long loose laces"],
		"styling_notes": "jeans tucked or stacked over",
		"prompt": "black canvas high-top sneakers on a massive chunky tooth-lugged platform rubber sole, long loose black laces",
		"negative": ["thin sole", "white sole"],
		"source_images": ["H3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_H3"],
		"image": "/shots/items/shoes_sneakers_platform_high_top_megalug_black_01.jpg"
	},
	{
		"id": "shoes_sneakers_puffy_skate_black_01",
		"name": "Black puffy skate sneakers",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": [
			"hip_hop_2000s",
			"skater",
			"y2k_streetwear"
		],
		"colors": ["black", "white"],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "bulky padded early-2000s skate shoe",
		"details": ["thick padded tongue and collar", "chunky white laces"],
		"styling_notes": "under stacked jeans",
		"prompt": "bulky black leather early-2000s skate sneakers with a thick padded tongue and collar and fat white laces",
		"negative": [],
		"source_images": ["G1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G1"],
		"image": "/shots/items/shoes_sneakers_puffy_skate_black_01.jpg"
	},
	{
		"id": "shoes_sneakers_running_white_black_lace_01",
		"name": "White retro running sneakers",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": [
			"streetwear_90s",
			"sportswear",
			"y2k_streetwear"
		],
		"colors": [
			"white",
			"black",
			"gray"
		],
		"materials": ["leather", "mesh"],
		"patterns": [],
		"fit_silhouette": "chunky 90s runner with visible air-cushion sole",
		"details": ["layered overlays", "black laces"],
		"styling_notes": "worn with white crew socks",
		"prompt": "chunky white retro 90s running sneakers with layered leather and mesh overlays, a visible air-cushion midsole and contrasting black laces",
		"negative": [],
		"source_images": ["D2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D2_right"],
		"image": "/shots/items/shoes_sneakers_running_white_black_lace_01.jpg"
	},
	{
		"id": "shoes_sneakers_sculpted_pod_sole_gray_01",
		"name": "Sculpted gray pod-sole sneakers",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": [
			"y2k",
			"sportswear",
			"techwear"
		],
		"colors": [
			"light gray",
			"cream",
			"silver"
		],
		"materials": ["synthetic", "rubber"],
		"patterns": ["organic blob panels"],
		"fit_silhouette": "very chunky running shoe, rounded pod outsole",
		"details": [
			"bubbly organic camo-like overlay panels",
			"rows of round cushioning pods on the sole",
			"thin laces"
		],
		"styling_notes": "worn with slouchy white socks",
		"prompt": "very chunky light gray and cream sculpted running sneakers with bubbly organic blob-shaped overlay panels and rows of round cushioning pods around the outsole",
		"negative": [],
		"source_images": ["D5"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D5"],
		"image": "/shots/items/shoes_sneakers_sculpted_pod_sole_gray_01.jpg"
	},
	{
		"id": "shoes_sneakers_teal_low_01",
		"name": "Teal and white low sneakers",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": ["y2k_streetwear", "streetwear_90s"],
		"colors": ["teal", "white"],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "low-top sneaker",
		"details": ["teal overlays on white"],
		"styling_notes": "mostly hidden under baggy jeans",
		"prompt": "low-top white leather sneakers with teal green overlays",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_left"],
		"image": "/shots/items/shoes_sneakers_teal_low_01.jpg"
	},
	{
		"id": "shoes_sneakers_tweed_suede_beige_cc_01",
		"name": "Beige tweed and suede luxury sneakers",
		"slot": "shoes",
		"subcategory": "sneakers",
		"style_tags": ["luxury_street", "streetwear_90s"],
		"colors": [
			"beige",
			"tan",
			"cream",
			"white"
		],
		"materials": ["woven tweed", "suede"],
		"patterns": ["tweed"],
		"fit_silhouette": "low-top runner on a white sole",
		"details": [
			"woven beige tweed panels",
			"tan suede overlays",
			"interlocking CC logo on the side",
			"cream laces"
		],
		"styling_notes": "worn with pulled-up white socks",
		"prompt": "low-top Chanel sneakers in beige woven tweed with tan suede overlays, white interlocking CC side logo, cream laces and white sole",
		"prompt_brand_free": "low-top runner sneakers in beige woven tweed with tan suede overlays, small white interlocking-letter side logo, cream laces and white rubber sole",
		"negative": [],
		"source_images": ["E2", "F6"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_E2", "outfit_F6"],
		"image": "/shots/items/shoes_sneakers_tweed_suede_beige_cc_01.jpg"
	},
	{
		"id": "bag_baguette_croc_black_01",
		"name": "Black croc baguette bag",
		"slot": "bag",
		"subcategory": "shoulder_bag",
		"style_tags": [
			"indie_sleaze",
			"y2k",
			"luxury_street"
		],
		"colors": ["black", "silver"],
		"materials": ["croc-embossed leather"],
		"patterns": ["croc texture"],
		"fit_silhouette": "slim baguette tucked under the arm",
		"details": ["silver hardware"],
		"styling_notes": "",
		"prompt": "slim black croc-embossed leather baguette shoulder bag with silver hardware tucked under the arm",
		"negative": [],
		"source_images": ["F1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F1"],
		"image": "/shots/items/bag_baguette_croc_black_01.jpg"
	},
	{
		"id": "bag_baguette_faux_fur_pink_01",
		"name": "Pink fuzzy baguette bag",
		"slot": "bag",
		"subcategory": "shoulder_bag",
		"style_tags": [
			"y2k",
			"y2k_streetwear",
			"gyaru"
		],
		"colors": ["baby pink"],
		"materials": ["faux fur", "patent"],
		"patterns": [],
		"fit_silhouette": "small baguette on a short shoulder strap",
		"details": ["fluffy fur body", "glossy pink strap"],
		"styling_notes": "tucked under the arm",
		"prompt": "small fluffy baby pink faux-fur baguette bag on a short glossy pink shoulder strap",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_left"],
		"image": "/shots/items/bag_baguette_faux_fur_pink_01.jpg"
	},
	{
		"id": "bag_baguette_studded_butterfly_cream_01",
		"name": "Cream studded baguette bag with butterflies",
		"slot": "bag",
		"subcategory": "shoulder_bag",
		"style_tags": [
			"y2k",
			"gyaru",
			"coquette"
		],
		"colors": [
			"cream",
			"silver",
			"pink"
		],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "small baguette bag on a short shoulder strap",
		"details": [
			"silver studs and grommets",
			"butterfly charms",
			"dangling chains",
			"studded strap"
		],
		"styling_notes": "tucked under the arm",
		"prompt": "small cream leather baguette shoulder bag covered in silver studs, with dangling butterfly charms and chains on a studded short strap",
		"negative": [],
		"source_images": ["C3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C3"],
		"image": "/shots/items/bag_baguette_studded_butterfly_cream_01.jpg"
	},
	{
		"id": "bag_basket_wicker_ribbon_01",
		"name": "Wicker basket bag with ribbon bows",
		"slot": "bag",
		"subcategory": "basket",
		"style_tags": [
			"coquette",
			"mori_girl",
			"vintage_romantic"
		],
		"colors": ["natural tan", "white"],
		"materials": ["woven wicker", "satin ribbon"],
		"patterns": [],
		"fit_silhouette": "bucket-shaped basket with two rounded bamboo-style handles",
		"details": ["two large white satin bows tied on the handles"],
		"styling_notes": "carried by the handles at the side",
		"prompt": "natural tan woven wicker basket bag with two arched handles, a big white satin ribbon bow tied at the base of each handle, tails hanging",
		"negative": [],
		"source_images": ["A2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A2"],
		"image": "/shots/items/bag_basket_wicker_ribbon_01.jpg"
	},
	{
		"id": "bag_belt_bag_plaid_patch_01",
		"name": "Plaid crossbody belt bag",
		"slot": "bag",
		"subcategory": "belt_bag",
		"style_tags": ["streetwear_90s", "luxury_street"],
		"colors": [
			"brown",
			"red",
			"cream"
		],
		"materials": ["woven plaid canvas"],
		"patterns": ["plaid"],
		"fit_silhouette": "small curved belt bag worn crossbody on the chest",
		"details": ["round patch appliques", "brown strap"],
		"styling_notes": "slung across the chest over the vest",
		"prompt": "small brown and red plaid canvas belt bag with round patch appliques, worn crossbody across the chest",
		"negative": [],
		"source_images": ["G3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_G3"],
		"image": "/shots/items/bag_belt_bag_plaid_patch_01.jpg"
	},
	{
		"id": "bag_crossbody_colorblock_pink_teal_01",
		"name": "Pink and teal colorblock mini bag",
		"slot": "bag",
		"subcategory": "crossbody",
		"style_tags": ["y2k_streetwear", "streetwear_90s"],
		"colors": [
			"hot pink",
			"teal",
			"mustard yellow",
			"gold"
		],
		"materials": ["leather"],
		"patterns": ["colorblock"],
		"fit_silhouette": "small boxy flap bag on a shoulder strap",
		"details": [
			"teal flap over pink body",
			"mustard yellow strap",
			"gold clasp"
		],
		"styling_notes": "worn on one shoulder at the hip",
		"prompt": "small boxy colorblock shoulder bag with a teal front flap over a hot-pink body, gold clasp and mustard-yellow strap",
		"negative": [],
		"source_images": ["C4"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_C4"],
		"image": "/shots/items/bag_crossbody_colorblock_pink_teal_01.jpg"
	},
	{
		"id": "bag_hobo_glossy_black_bow_charm_01",
		"name": "Black glossy leather hobo with bow charm",
		"slot": "bag",
		"subcategory": "shoulder_bag",
		"style_tags": [
			"y2k",
			"coquette",
			"gyaru"
		],
		"colors": ["black", "silver"],
		"materials": ["glossy leather"],
		"patterns": [],
		"fit_silhouette": "slouchy medium dome-shaped bag on two shoulder straps",
		"details": ["buckled strap tabs with silver hardware", "silver ribbon-bow charm on a chain"],
		"styling_notes": "held by the handles in front of the legs",
		"prompt": "slouchy glossy black leather hobo shoulder bag with buckled strap tabs, silver hardware and a dangling silver ribbon-bow charm",
		"negative": [],
		"source_images": ["B1"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B1"],
		"image": "/shots/items/bag_hobo_glossy_black_bow_charm_01.jpg"
	},
	{
		"id": "bag_messenger_satchel_tan_01",
		"name": "Tan leather messenger satchel",
		"slot": "bag",
		"subcategory": "crossbody",
		"style_tags": [
			"dark_academia",
			"mori_girl",
			"vintage_workwear"
		],
		"colors": ["tan", "camel"],
		"materials": ["smooth leather"],
		"patterns": [],
		"fit_silhouette": "medium squared satchel on a long crossbody strap",
		"details": ["front flap with a single buckle strap", "brass hardware"],
		"styling_notes": "worn crossbody at the hip",
		"prompt": "camel tan leather messenger satchel with a front flap fastened by one buckle strap, brass hardware, long thin crossbody strap",
		"negative": [],
		"source_images": ["B3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_B3"],
		"image": "/shots/items/bag_messenger_satchel_tan_01.jpg"
	},
	{
		"id": "bag_mini_top_handle_lilac_01",
		"name": "Lilac mini top-handle bag",
		"slot": "bag",
		"subcategory": "mini_bag",
		"style_tags": [
			"y2k",
			"y2k_streetwear",
			"kawaii"
		],
		"colors": ["lilac"],
		"materials": ["patent leather"],
		"patterns": [],
		"fit_silhouette": "tiny boxy handbag on a short handle",
		"details": ["front flap"],
		"styling_notes": "dangling from the fingers",
		"prompt": "tiny glossy lilac boxy handbag with a front flap and a short top handle",
		"negative": [],
		"source_images": ["D2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D2_right"],
		"image": "/shots/items/bag_mini_top_handle_lilac_01.jpg"
	},
	{
		"id": "bag_satchel_flap_crossbody_charcoal_01",
		"name": "Charcoal flap satchel",
		"slot": "bag",
		"subcategory": "crossbody",
		"style_tags": ["dark_academia", "french_casual"],
		"colors": ["charcoal", "black"],
		"materials": ["matte leather"],
		"patterns": [],
		"fit_silhouette": "medium boxy satchel on a thin long strap",
		"details": ["fold-over front flap", "structured rectangular body"],
		"styling_notes": "worn on the shoulder, resting at the hip",
		"prompt": "matte charcoal black leather flap satchel bag, boxy rectangular shape, fold-over front flap, thin long shoulder strap, resting at the hip",
		"negative": [],
		"source_images": ["A1"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A1"],
		"image": "/shots/items/bag_satchel_flap_crossbody_charcoal_01.jpg"
	},
	{
		"id": "bag_satchel_top_handle_red_01",
		"name": "Red structured top-handle satchel",
		"slot": "bag",
		"subcategory": "top_handle",
		"style_tags": [
			"coquette",
			"vintage_romantic",
			"preppy"
		],
		"colors": ["bright red", "silver"],
		"materials": ["smooth leather"],
		"patterns": [],
		"fit_silhouette": "structured rectangular handbag with a single arched handle",
		"details": ["front flap with silver turn-lock", "rivet studs along the strap tabs"],
		"styling_notes": "held in front with both hands",
		"prompt": "glossy bright red structured leather top-handle satchel, rectangular body, arched handle, front flap with a silver turn-lock clasp and small silver rivets",
		"negative": [],
		"source_images": ["A3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A3"],
		"image": "/shots/items/bag_satchel_top_handle_red_01.jpg"
	},
	{
		"id": "bag_shoulder_faux_fur_brown_01",
		"name": "Brown faux fur shoulder bag",
		"slot": "bag",
		"subcategory": "shoulder_bag",
		"style_tags": [
			"y2k",
			"grunge",
			"coquette"
		],
		"colors": ["brown", "olive"],
		"materials": ["shaggy faux fur", "leather"],
		"patterns": [],
		"fit_silhouette": "soft slouchy medium bag on a long olive leather strap",
		"details": ["long-pile fur body"],
		"styling_notes": "hung on the shoulder with a plush charm attached",
		"prompt": "slouchy brown shaggy faux-fur shoulder bag on a long olive-brown leather strap",
		"negative": [],
		"source_images": ["B5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_B5"],
		"image": "/shots/items/bag_shoulder_faux_fur_brown_01.jpg"
	},
	{
		"id": "bag_shoulder_leather_brown_01",
		"name": "Brown leather shoulder bag",
		"slot": "bag",
		"subcategory": "shoulder_bag",
		"style_tags": ["streetwear_90s", "vintage_workwear"],
		"colors": ["cognac brown"],
		"materials": ["leather"],
		"patterns": [],
		"fit_silhouette": "medium soft slouch bag",
		"details": [],
		"styling_notes": "on the shoulder behind the back",
		"prompt": "medium slouchy cognac brown smooth leather shoulder bag with a single short strap, soft unstructured body",
		"negative": [],
		"source_images": ["D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D3_right"],
		"image": "/shots/items/bag_shoulder_leather_brown_01.jpg"
	},
	{
		"id": "bag_sling_nylon_black_01",
		"name": "Black nylon sling bag",
		"slot": "bag",
		"subcategory": "sling",
		"style_tags": [
			"sportswear",
			"techwear",
			"streetwear_90s"
		],
		"colors": ["black"],
		"materials": ["nylon"],
		"patterns": [],
		"fit_silhouette": "compact crossbody sling worn across the back",
		"details": ["cord strap", "zip pockets"],
		"styling_notes": "",
		"prompt": "compact black nylon crossbody sling bag with zip pockets, worn across the back",
		"negative": [],
		"source_images": ["F6"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F6"],
		"image": "/shots/items/bag_sling_nylon_black_01.jpg"
	},
	{
		"id": "bag_tote_canvas_cream_01",
		"name": "Cream canvas tote",
		"slot": "bag",
		"subcategory": "tote",
		"style_tags": ["minimal_basics", "french_casual"],
		"colors": ["cream"],
		"materials": ["cotton canvas"],
		"patterns": [],
		"fit_silhouette": "flat rectangular tote on long handles",
		"details": [],
		"styling_notes": "hung on the shoulder behind the arm",
		"prompt": "plain cream cotton canvas tote bag with long shoulder handles",
		"negative": [],
		"source_images": ["D2"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_D2_left"],
		"image": "/shots/items/bag_tote_canvas_cream_01.jpg"
	},
	{
		"id": "bag_tote_ruffle_trim_black_01",
		"name": "Black ruffle-trim tote",
		"slot": "bag",
		"subcategory": "tote",
		"style_tags": ["coquette", "gothic_lolita"],
		"colors": ["black"],
		"materials": ["canvas"],
		"patterns": [],
		"fit_silhouette": "large soft rectangular tote with thin handles",
		"details": ["gathered ruffle trim around the opening"],
		"styling_notes": "carried low at the side",
		"prompt": "large soft black canvas tote bag with a gathered ruffle frill around the top opening and thin shoulder handles",
		"negative": [],
		"source_images": ["A5"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_A5"],
		"image": "/shots/items/bag_tote_ruffle_trim_black_01.jpg"
	},
	{
		"id": "accessory_binder_faux_fur_pink_01",
		"name": "Pink fuzzy patch binder",
		"slot": "accessory",
		"subcategory": "carried_prop",
		"style_tags": [
			"y2k",
			"preppy_90s",
			"kawaii"
		],
		"colors": ["baby pink", "rainbow"],
		"materials": ["faux fur"],
		"patterns": [],
		"fit_silhouette": "notebook binder carried against the hip",
		"details": [
			"fluffy pink fur cover",
			"rainbow patch",
			"GIRL POWER patch",
			"assorted pins"
		],
		"styling_notes": "carried under the arm",
		"prompt": "fluffy baby pink faux-fur covered binder decorated with a rainbow patch, a GIRL POWER patch and small pins, carried under the arm",
		"negative": [],
		"source_images": ["D1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_D1"],
		"image": "/shots/items/accessory_binder_faux_fur_pink_01.jpg"
	},
	{
		"id": "accessory_chain_cross_filigree_charm_01",
		"name": "Silver filigree cross hip charm",
		"slot": "accessory",
		"subcategory": "chain_charm",
		"style_tags": [
			"gothic",
			"gothic_lolita",
			"punk"
		],
		"colors": ["silver"],
		"materials": ["metal"],
		"patterns": [],
		"fit_silhouette": "large ornate cross hanging from an O-ring off the skirt zip",
		"details": [
			"gothic filigree cross",
			"big O-ring",
			"short chain"
		],
		"styling_notes": "dangles at the hip",
		"prompt": "large ornate silver gothic filigree cross pendant hanging from a big silver O-ring and chain at the hip",
		"negative": [],
		"source_images": ["C1"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_C1"],
		"image": "/shots/items/accessory_chain_cross_filigree_charm_01.jpg"
	},
	{
		"id": "accessory_corsage_rose_shoulder_01",
		"name": "Dusty rose shoulder corsage",
		"slot": "accessory",
		"subcategory": "corsage",
		"style_tags": ["romantic_couture", "coquette"],
		"colors": ["dusty rose", "sage green"],
		"materials": ["silk flower", "beads"],
		"patterns": [],
		"fit_silhouette": "large single rose on the shoulder",
		"details": ["sage leaves", "dangling bead strands"],
		"styling_notes": "pinned on the shoulder strap",
		"prompt": "large dusty rose silk rose corsage with sage-green leaves and short dangling bead strands pinned at the shoulder",
		"negative": [],
		"source_images": ["D4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_D4"],
		"image": "/shots/items/accessory_corsage_rose_shoulder_01.jpg"
	},
	{
		"id": "accessory_keychain_star_gold_01",
		"name": "Gold star belt-loop charm",
		"slot": "accessory",
		"subcategory": "keychain",
		"style_tags": [
			"y2k_streetwear",
			"streetwear_90s",
			"kawaii"
		],
		"colors": ["gold", "yellow"],
		"materials": ["metal"],
		"patterns": [],
		"fit_silhouette": "small star charm hanging from the belt loop",
		"details": ["short chain clip"],
		"styling_notes": "clipped to a front belt loop",
		"prompt": "small gold star charm keychain dangling from a front belt loop on a short chain",
		"negative": [],
		"source_images": ["C4", "D3"],
		"render_style_seen": "illustration",
		"outfit_ids": ["outfit_C4", "outfit_D3_left"],
		"image": "/shots/items/accessory_keychain_star_gold_01.jpg"
	},
	{
		"id": "accessory_plush_keychain_kitty_01",
		"name": "White kitty plush bag charm",
		"slot": "accessory",
		"subcategory": "bag_charm",
		"style_tags": [
			"kawaii",
			"y2k",
			"coquette"
		],
		"colors": [
			"white",
			"pink",
			"brown"
		],
		"materials": ["plush"],
		"patterns": ["houndstooth"],
		"fit_silhouette": "palm-size plush hanging from a bag strap",
		"details": ["pink bow on the ear", "tiny houndstooth outfit"],
		"styling_notes": "clipped to the shoulder bag strap",
		"prompt": "small fluffy white cartoon cat plush keychain with a pink bow on one ear and a tiny brown houndstooth dress, dangling from a bag strap",
		"negative": [],
		"source_images": ["B5"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_B5"],
		"image": "/shots/items/accessory_plush_keychain_kitty_01.jpg"
	},
	{
		"id": "accessory_wallet_chain_silver_01",
		"name": "Silver wallet chain",
		"slot": "accessory",
		"subcategory": "wallet_chain",
		"style_tags": [
			"punk",
			"grunge",
			"streetwear_90s"
		],
		"colors": ["silver"],
		"materials": ["metal"],
		"patterns": [],
		"fit_silhouette": "single chain looped from belt loop to back pocket",
		"details": [],
		"styling_notes": "",
		"prompt": "silver wallet chain looping from a front belt loop around to the back pocket",
		"negative": [],
		"source_images": ["F3"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_F3"],
		"image": "/shots/items/accessory_wallet_chain_silver_01.jpg"
	},
	{
		"id": "accessory_watch_digital_black_01",
		"name": "Black digital sports watch",
		"slot": "accessory",
		"subcategory": "watch",
		"style_tags": ["sportswear", "uk_drill"],
		"colors": ["black"],
		"materials": ["resin"],
		"patterns": [],
		"fit_silhouette": "chunky wrist watch",
		"details": [],
		"styling_notes": "",
		"prompt": "chunky black matte resin digital sports watch with a wide strap and square face",
		"negative": [],
		"source_images": ["I4"],
		"render_style_seen": "photo",
		"outfit_ids": ["outfit_I4"],
		"image": "/shots/items/accessory_watch_digital_black_01.jpg"
	}
];
var WARDROBE_OUTFITS = [
	{
		"id": "outfit_A1",
		"name": "Cream Sherpa & Stripes",
		"style_tags": [
			"french_casual",
			"kawaii",
			"y2k",
			"cozy_layered",
			"dark_academia"
		],
		"slots": {
			"outerwear": ["outerwear_jacket_sherpa_shaggy_cream_01"],
			"layer_top": [],
			"top": ["top_longsleeve_breton_stripe_bw_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_bike_shorts_black_lace_hem_01"],
			"belt_waist": [],
			"legwear": ["legwear_leg_warmers_chunky_cream_01"],
			"shoes": ["shoes_boots_slouch_suede_brown_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": ["neckwear_collar_ribbon_tie_brown_01"],
			"jewelry": [],
			"bag": ["bag_satchel_flap_crossbody_charcoal_01"],
			"accessory": []
		},
		"item_ids": [
			"outerwear_jacket_sherpa_shaggy_cream_01",
			"top_longsleeve_breton_stripe_bw_01",
			"bottom_bike_shorts_black_lace_hem_01",
			"legwear_leg_warmers_chunky_cream_01",
			"shoes_boots_slouch_suede_brown_01",
			"neckwear_collar_ribbon_tie_brown_01",
			"bag_satchel_flap_crossbody_charcoal_01"
		],
		"prompt": "oversized cream ivory shaggy curly sherpa fleece jacket, plush textured teddy pile, wide shawl collar, big patch pockets, dropped shoulders, voluminous sleeves ending in ribbed knit cuffs, worn open; fitted long-sleeve cotton jersey top with bold even black and white horizontal Breton stripes, about one inch wide, crew neckline; snug black stretch bike shorts ending at mid-thigh, finished with a delicate scalloped blush-pink lace trim at the leg hem; thick cream chunky rib-knit leg warmers scrunched and bunched over the tops of boots, slouchy stacked folds around the calves; dark brown soft suede mid-calf slouch boots, shaft collapsing into deep accordion wrinkles, rounded toe, short chunky block heel; dark chocolate brown pointed shirt collar with a long skinny brown satin ribbon tied in a small bow at the throat, tails hanging down the chest; matte charcoal black leather flap satchel bag, boxy rectangular shape, fold-over front flap, thin long shoulder strap, resting at the hip",
		"negative": [
			"smooth faux fur",
			"fitted cut",
			"zip front",
			"stiff riding boot",
			"stiletto heel"
		],
		"source_images": ["A1"],
		"image": "/shots/outfits/outfit_A1.jpg",
		"user_created": false
	},
	{
		"id": "outfit_A2",
		"name": "Navy Pinafore Picnic",
		"style_tags": [
			"coquette",
			"vintage_romantic",
			"japanese_school",
			"mori_girl",
			"classic_lolita"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_blouse_sheer_ruffle_blue_01"],
			"dress_onepiece": ["dress_pinafore_maxi_ruffle_navy_01"],
			"bottom": [],
			"belt_waist": [],
			"legwear": ["legwear_socks_crew_white_01"],
			"shoes": ["shoes_loafers_penny_black_patent_01"],
			"headwear": ["headwear_ribbon_hair_ties_black_01"],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": ["bag_basket_wicker_ribbon_01"],
			"accessory": []
		},
		"item_ids": [
			"top_blouse_sheer_ruffle_blue_01",
			"dress_pinafore_maxi_ruffle_navy_01",
			"legwear_socks_crew_white_01",
			"shoes_loafers_penny_black_patent_01",
			"headwear_ribbon_hair_ties_black_01",
			"bag_basket_wicker_ribbon_01"
		],
		"prompt": "sheer powder-blue chiffon blouse with a high frilled stand collar, long translucent balloon sleeves gathered into ruffled cuffs at the wrists; deep navy crinkled cotton maxi pinafore dress, thin shoulder straps, ruffled square neckline, fitted bodice, very full gathered ankle-length skirt with a ruffled hem; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; glossy black patent leather penny loafers, classic penny strap across the vamp, rounded toe, low stacked heel, mirror-like shine; small glossy black satin ribbon bows tied at the base of each pigtail, loops and tails hanging loosely; natural tan woven wicker basket bag with two arched handles, a big white satin ribbon bow tied at the base of each handle, tails hanging",
		"negative": [],
		"source_images": ["A2"],
		"image": "/shots/outfits/outfit_A2.jpg",
		"user_created": false
	},
	{
		"id": "outfit_A3",
		"name": "Red Knit & Polka Maxi",
		"style_tags": [
			"coquette",
			"kawaii",
			"vintage_romantic",
			"classic_lolita",
			"mori_girl"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_knit_puff_sleeve_peter_pan_red_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_skirt_maxi_polkadot_tiered_cream_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_mary_janes_flat_cream_01"],
			"headwear": ["headwear_headband_lace_ruffle_white_01"],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": ["bag_satchel_top_handle_red_01"],
			"accessory": []
		},
		"item_ids": [
			"top_knit_puff_sleeve_peter_pan_red_01",
			"bottom_skirt_maxi_polkadot_tiered_cream_01",
			"shoes_mary_janes_flat_cream_01",
			"headwear_headband_lace_ruffle_white_01",
			"bag_satchel_top_handle_red_01"
		],
		"prompt": "fitted tomato-red vertical rib-knit short-sleeve top with puffed sleeves and a rounded white Peter Pan collar trimmed in scalloped lace; high-waisted ankle-length cream skirt with tiny black polka dots, a double ruffled tier around the hips, full flowing body ending in a wide scalloped eyelet lace hem; soft cream leather round-toe Mary Jane flats with a single thin buckled strap across the instep; white frilled lace ruffle headband sitting across the crown of the head, gathered lace edging like a maid or Lolita headdress; glossy bright red structured leather top-handle satchel, rectangular body, arched handle, front flap with a silver turn-lock clasp and small silver rivets",
		"negative": [],
		"source_images": ["A3"],
		"image": "/shots/outfits/outfit_A3.jpg",
		"user_created": false
	},
	{
		"id": "outfit_A4",
		"name": "Gothic Lolita Bloomers",
		"style_tags": [
			"gothic_lolita",
			"gothic",
			"classic_lolita",
			"coquette",
			"kawaii"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_blouse_victorian_lace_bib_white_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_bloomer_shorts_suspender_black_01"],
			"belt_waist": [],
			"legwear": ["legwear_knee_sock_cross_black_01", "legwear_sock_ribbon_lace_up_red_01"],
			"shoes": ["shoes_mary_janes_platform_black_patent_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"top_blouse_victorian_lace_bib_white_01",
			"bottom_bloomer_shorts_suspender_black_01",
			"legwear_knee_sock_cross_black_01",
			"legwear_sock_ribbon_lace_up_red_01",
			"shoes_mary_janes_platform_black_patent_01"
		],
		"prompt": "white Victorian cotton blouse with a high ruffled stand collar, wide lace bib yoke across the chest, ruffled shoulder flounces, full bishop sleeves ending in deep eyelet-lace ruffled cuffs; black high-waisted puffy bloomer shorts with a wide structured waistband, pumpkin-shaped legs gathered into frilled cuffs, thin black suspenders, long black ribbon ties dangling at the hips; opaque black knee-high socks with a small silver embroidered gothic cross on the outer calf; sheer crimson red mid-calf sock wrapped with red satin ribbon criss-crossing up the calf like ballet-shoe lacing, bow tails hanging loose; glossy black patent leather platform Mary Jane shoes, chunky two-inch platform sole and thick block heel, rounded toe, single silver-buckled strap",
		"negative": ["sneaker sole", "pointed toe"],
		"source_images": ["A4"],
		"image": "/shots/outfits/outfit_A4.jpg",
		"user_created": false
	},
	{
		"id": "outfit_A5",
		"name": "Ruffles & Lace-Hem Denim",
		"style_tags": [
			"coquette",
			"gothic_lolita",
			"indie_sleaze",
			"kawaii",
			"vintage_romantic"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_blouse_cascade_ruffle_white_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_straight_lace_hem_lightwash_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_pumps_pointed_stiletto_black_suede_01"],
			"headwear": ["headwear_ribbon_bows_white_01"],
			"eyewear": [],
			"neckwear": ["neckwear_choker_ribbon_bow_black_01"],
			"jewelry": [],
			"bag": ["bag_tote_ruffle_trim_black_01"],
			"accessory": []
		},
		"item_ids": [
			"top_blouse_cascade_ruffle_white_01",
			"bottom_jeans_straight_lace_hem_lightwash_01",
			"shoes_pumps_pointed_stiletto_black_suede_01",
			"headwear_ribbon_bows_white_01",
			"neckwear_choker_ribbon_bow_black_01",
			"bag_tote_ruffle_trim_black_01"
		],
		"prompt": "soft white cotton blouse covered in tiers of cascading ruffles down the front, ruffled shoulders, voluminous balloon sleeves with frilled cuffs, gathered peplum hem; light-wash blue straight-leg jeans, full length, finished with a band of white scalloped lace trim around each hem; matte black suede pointed-toe stiletto pumps with a slim three-and-a-half-inch heel; white satin ribbon bows tied high on each twin tail, long ribbon tails trailing down; thin black satin ribbon tied snug around the neck as a choker, small bow at the front with two long tails falling down the chest; large soft black canvas tote bag with a gathered ruffle frill around the top opening and thin shoulder handles",
		"negative": [],
		"source_images": ["A5"],
		"image": "/shots/outfits/outfit_A5.jpg",
		"user_created": false
	},
	{
		"id": "outfit_B1",
		"name": "Coral Plaid Pinafore",
		"style_tags": [
			"preppy",
			"y2k",
			"coquette",
			"gyaru",
			"japanese_school"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_blouse_puff_sleeve_collared_skyblue_01"],
			"dress_onepiece": ["dress_pinafore_plaid_belted_coral_01"],
			"bottom": [],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_boots_knee_high_glossy_black_01"],
			"headwear": ["headwear_ribbon_hair_ties_black_01"],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": ["bag_hobo_glossy_black_bow_charm_01"],
			"accessory": []
		},
		"item_ids": [
			"top_blouse_puff_sleeve_collared_skyblue_01",
			"dress_pinafore_plaid_belted_coral_01",
			"shoes_boots_knee_high_glossy_black_01",
			"headwear_ribbon_hair_ties_black_01",
			"bag_hobo_glossy_black_bow_charm_01"
		],
		"prompt": "pale sky-blue cotton button-front blouse with a sharp pointed collar, very full puffed long sleeves gathered into long fitted cuffs; sleeveless coral-red and pink tartan plaid pinafore mini dress, fitted V-neck bodice, matching self-fabric waist belt with a large black square buckle, short pleated flared skirt; sleek glossy black leather knee-high boots with a fitted shaft, rounded toe and low chunky block heel; small glossy black satin ribbon bows tied at the base of each pigtail, loops and tails hanging loosely; slouchy glossy black leather hobo shoulder bag with buckled strap tabs, silver hardware and a dangling silver ribbon-bow charm",
		"negative": [],
		"source_images": ["B1"],
		"image": "/shots/outfits/outfit_B1.jpg",
		"user_created": false
	},
	{
		"id": "outfit_B2",
		"name": "Windbreaker Schoolgirl",
		"style_tags": [
			"japanese_school",
			"preppy",
			"sportswear",
			"streetwear_90s",
			"coquette"
		],
		"slots": {
			"outerwear": ["outerwear_windbreaker_colorblock_navy_white_01"],
			"layer_top": [],
			"top": [],
			"dress_onepiece": [],
			"bottom": ["bottom_skirt_pleated_tennis_white_01"],
			"belt_waist": [],
			"legwear": ["legwear_loose_socks_slouch_white_01"],
			"shoes": ["shoes_loafers_bow_chunky_black_patent_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"outerwear_windbreaker_colorblock_navy_white_01",
			"bottom_skirt_pleated_tennis_white_01",
			"legwear_loose_socks_slouch_white_01",
			"shoes_loafers_bow_chunky_black_patent_01"
		],
		"prompt": "very oversized navy nylon windbreaker with white curved shoulder panels, tall funnel neck zipped to the chin, small oval chest patch, huge balloon sleeves gathered at the wrists; crisp white knife-pleated tennis mini skirt, short flared A-line; thick white ribbed slouch socks pushed down into loose bunched rings around the lower calf, Japanese loose-socks style; glossy black patent leather loafers with a small bow ornament on the vamp, chunky slightly lugged sole and low heel",
		"negative": [],
		"source_images": ["B2"],
		"image": "/shots/outfits/outfit_B2.jpg",
		"user_created": false
	},
	{
		"id": "outfit_B3",
		"name": "Tartan Maxi & Satchel",
		"style_tags": [
			"dark_academia",
			"mori_girl",
			"french_casual",
			"japanese_school",
			"minimal_basics"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_blouse_oversized_round_collar_white_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_skirt_maxi_tartan_blue_green_01"],
			"belt_waist": [],
			"legwear": ["legwear_socks_crew_white_01"],
			"shoes": ["shoes_sandals_two_buckle_black_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": ["bag_messenger_satchel_tan_01"],
			"accessory": []
		},
		"item_ids": [
			"top_blouse_oversized_round_collar_white_01",
			"bottom_skirt_maxi_tartan_blue_green_01",
			"legwear_socks_crew_white_01",
			"shoes_sandals_two_buckle_black_01",
			"bag_messenger_satchel_tan_01"
		],
		"prompt": "oversized white cotton blouse with a small rounded collar, dropped shoulders, puffy three-quarter sleeves ending in ruffled cuffs, tucked in; high-waisted ankle-length pleated wool maxi skirt in a navy, teal and forest-green tartan with a thin mustard-yellow overcheck; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; black leather two-strap slide sandals with gold pin buckles on wide straps and a chunky footbed sole, worn over white socks; camel tan leather messenger satchel with a front flap fastened by one buckle strap, brass hardware, long thin crossbody strap",
		"negative": [],
		"source_images": ["B3"],
		"image": "/shots/outfits/outfit_B3.jpg",
		"user_created": false
	},
	{
		"id": "outfit_B4",
		"name": "Winter JK Uniform",
		"style_tags": [
			"japanese_school",
			"preppy",
			"dark_academia",
			"gyaru",
			"y2k"
		],
		"slots": {
			"outerwear": ["outerwear_blazer_school_navy_01"],
			"layer_top": [],
			"top": ["top_sweater_vneck_long_pink_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_skirt_pleated_micro_gray_plaid_01"],
			"belt_waist": [],
			"legwear": ["legwear_loose_socks_cable_knit_white_01"],
			"shoes": ["shoes_loafers_penny_dark_brown_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": ["neckwear_scarf_plaid_fringe_camel_01"],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"outerwear_blazer_school_navy_01",
			"top_sweater_vneck_long_pink_01",
			"bottom_skirt_pleated_micro_gray_plaid_01",
			"legwear_loose_socks_cable_knit_white_01",
			"shoes_loafers_penny_dark_brown_01",
			"neckwear_scarf_plaid_fringe_camel_01"
		],
		"prompt": "slate navy single-breasted Japanese school uniform blazer, notched lapels, hip length, small red buttons on the cuffs; salmon-pink fine rib-knit V-neck school sweater, long and loose, ribbed hem showing below the blazer and sleeves peeking out over the hands; charcoal gray plaid knife-pleated school uniform micro mini skirt with crisp pleats; extra-thick white chunky cable-knit loose socks slouched in heavy rolls from the ankle up the calf, 90s Japanese gyaru style; dark brown polished leather penny loafers, classic penny strap, rounded toe, low heel; long wide camel and peach plaid brushed-wool scarf wrapped high around the neck up over the chin, fringed ends hanging down the chest",
		"negative": [],
		"source_images": ["B4"],
		"image": "/shots/outfits/outfit_B4.jpg",
		"user_created": false
	},
	{
		"id": "outfit_B5",
		"name": "Pink Mohair & Tie",
		"style_tags": [
			"grunge",
			"coquette",
			"y2k",
			"dark_academia",
			"preppy"
		],
		"slots": {
			"outerwear": [],
			"layer_top": ["layer_top_shirt_pintuck_collared_white_01"],
			"top": ["top_sweater_mohair_deep_v_pink_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_skirt_bubble_mini_brown_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": [],
			"headwear": [],
			"eyewear": [],
			"neckwear": ["neckwear_necktie_stripe_brown_01"],
			"jewelry": ["jewelry_necklace_layered_rosary_pearl_key_01"],
			"bag": ["bag_shoulder_faux_fur_brown_01"],
			"accessory": ["accessory_plush_keychain_kitty_01"]
		},
		"item_ids": [
			"layer_top_shirt_pintuck_collared_white_01",
			"top_sweater_mohair_deep_v_pink_01",
			"bottom_skirt_bubble_mini_brown_01",
			"neckwear_necktie_stripe_brown_01",
			"jewelry_necklace_layered_rosary_pearl_key_01",
			"bag_shoulder_faux_fur_brown_01",
			"accessory_plush_keychain_kitty_01"
		],
		"prompt": "crisp white cotton collared shirt with fine vertical pintuck pleats down the front, pointed collar spread over a sweater, shirttail peeking out at the hem; oversized dusty-pink fuzzy mohair sweater in a loose see-through open knit with ladder holes, very wide plunging V neckline, long slouchy sleeves; dark chocolate brown puffy bubble-hem mini skirt with a soft gathered balloon silhouette; chocolate brown silk necktie with thin gold diagonal repp stripes, knotted loosely and hanging over the sweater; layered antique silver necklaces stacked at the collar: rosary bead chain, pearl strand, small cross pendant and an ornate skeleton-key pendant; slouchy brown shaggy faux-fur shoulder bag on a long olive-brown leather strap; small fluffy white cartoon cat plush keychain with a pink bow on one ear and a tiny brown houndstooth dress, dangling from a bag strap",
		"negative": [],
		"source_images": ["B5"],
		"image": "/shots/outfits/outfit_B5.jpg",
		"user_created": false
	},
	{
		"id": "outfit_C1",
		"name": "Gothic Leather Micro",
		"style_tags": [
			"gothic",
			"punk",
			"y2k",
			"gothic_lolita"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_bralette_lace_cross_chain_black_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_skirt_pleated_micro_faux_leather_black_01"],
			"belt_waist": ["belt_waist_grommet_studded_black_01"],
			"legwear": [],
			"shoes": [],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": ["accessory_chain_cross_filigree_charm_01"]
		},
		"item_ids": [
			"top_bralette_lace_cross_chain_black_01",
			"bottom_skirt_pleated_micro_faux_leather_black_01",
			"belt_waist_grommet_studded_black_01",
			"accessory_chain_cross_filigree_charm_01"
		],
		"prompt": "black scalloped floral lace cropped top with thin silver chain straps and small dangling silver cross charms; black glossy faux-leather low-rise micro mini skirt with a wide smooth hip yoke, short sharp knife pleats and a silver side zip; wide black leather belt with rows of silver grommets and round studs, large silver rounded buckle, slung low on the hips with the long tail hanging down; large ornate silver gothic filigree cross pendant hanging from a big silver O-ring and chain at the hip",
		"negative": [],
		"source_images": ["C1"],
		"image": "/shots/outfits/outfit_C1.jpg",
		"user_created": false
	},
	{
		"id": "outfit_C2",
		"name": "Painted Belt Bustier",
		"style_tags": [
			"avant_garde_diy",
			"punk",
			"y2k"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_bustier_stacked_belts_multicolor_01"],
			"dress_onepiece": [],
			"bottom": [],
			"belt_waist": ["belt_waist_draped_chains_silver_01"],
			"legwear": [],
			"shoes": [],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": ["top_bustier_stacked_belts_multicolor_01", "belt_waist_draped_chains_silver_01"],
		"prompt": "strapless bustier built from about fifteen distressed painted leather belts stacked tightly from bust to hips, hot pink, lime, cobalt, yellow, red, lilac and black, tarnished buckles and grommets; multiple silver curb chains swagged in loose loops from the hips across the thighs, layered drape lengths",
		"negative": [],
		"source_images": ["C2"],
		"image": "/shots/outfits/outfit_C2.jpg",
		"user_created": false
	},
	{
		"id": "outfit_C3",
		"name": "Pink Bow Hoodie Y2K",
		"style_tags": [
			"y2k",
			"coquette",
			"gyaru",
			"kawaii",
			"grunge"
		],
		"slots": {
			"outerwear": ["outerwear_hoodie_ribbon_bow_pink_01"],
			"layer_top": [],
			"top": ["top_cami_floral_lace_bow_cream_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_skirt_denim_cargo_pleated_mini_black_01"],
			"belt_waist": ["belt_waist_rhinestone_star_buckle_pink_01", "belt_waist_chain_charms_heart_butterfly_01"],
			"legwear": [],
			"shoes": [],
			"headwear": [],
			"eyewear": [],
			"neckwear": ["neckwear_choker_velvet_heart_pink_01"],
			"jewelry": ["jewelry_necklace_layered_butterfly_silver_01"],
			"bag": ["bag_baguette_studded_butterfly_cream_01"],
			"accessory": []
		},
		"item_ids": [
			"outerwear_hoodie_ribbon_bow_pink_01",
			"top_cami_floral_lace_bow_cream_01",
			"bottom_skirt_denim_cargo_pleated_mini_black_01",
			"belt_waist_rhinestone_star_buckle_pink_01",
			"belt_waist_chain_charms_heart_butterfly_01",
			"neckwear_choker_velvet_heart_pink_01",
			"jewelry_necklace_layered_butterfly_silver_01",
			"bag_baguette_studded_butterfly_cream_01"
		],
		"prompt": "cropped dusty pink soft knit zip-up hoodie with rows of small cream satin ribbon bows sewn down each sleeve, long bunched sleeves, worn open off the shoulders; fitted cropped cream rib-knit camisole with a tiny pink ditsy floral print, lace-trimmed sweetheart neckline, thin straps and a pink ribbon bow at center front; washed charcoal black denim low-rise pleated micro mini skirt with flap cargo pockets, snap buttons and a frayed raw hem; wide blush-pink leather belt studded with rhinestones and a big ornate silver star buckle, slung low on the hips; draped silver chain belt across the hips with dangling heart, cross and rhinestone butterfly charms; dusty pink velvet ribbon choker with a small silver heart charm at the center; two or three fine layered silver chains with a sparkly rhinestone butterfly pendant; small cream leather baguette shoulder bag covered in silver studs, with dangling butterfly charms and chains on a studded short strap",
		"negative": [],
		"source_images": ["C3"],
		"image": "/shots/outfits/outfit_C3.jpg",
		"user_created": false
	},
	{
		"id": "outfit_C4",
		"name": "Baggy Denim & Ringer Crop",
		"style_tags": [
			"streetwear_90s",
			"y2k_streetwear",
			"hip_hop_2000s",
			"kawaii",
			"minimal_basics"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_ringer_crop_tee_starburst_navy_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_baggy_dark_indigo_01"],
			"belt_waist": ["belt_waist_leather_brown_gold_buckle_01"],
			"legwear": [],
			"shoes": ["shoes_sneakers_chunky_low_white_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_necklace_thin_gold_pendant_01", "jewelry_earrings_gold_hoops_01"],
			"bag": ["bag_crossbody_colorblock_pink_teal_01"],
			"accessory": ["accessory_keychain_star_gold_01"]
		},
		"item_ids": [
			"top_ringer_crop_tee_starburst_navy_01",
			"bottom_jeans_baggy_dark_indigo_01",
			"belt_waist_leather_brown_gold_buckle_01",
			"shoes_sneakers_chunky_low_white_01",
			"jewelry_necklace_thin_gold_pendant_01",
			"jewelry_earrings_gold_hoops_01",
			"bag_crossbody_colorblock_pink_teal_01",
			"accessory_keychain_star_gold_01"
		],
		"prompt": "fitted navy cropped ringer tee with white contrast trim on the collar and sleeve hems, a teal and coral starburst graphic on the chest; very baggy dark indigo denim jeans, low rise, extremely wide legs, long hems stacking and pooling over the sneakers; classic brown leather belt with a gold rectangular buckle; chunky all-white leather low-top court sneakers with a thick cupsole, perforated toe box and white laces; delicate thin gold chain necklace with a tiny pendant resting at the collarbone; small thin polished gold hoop earrings, about one inch across, worn in both ears; small boxy colorblock shoulder bag with a teal front flap over a hot-pink body, gold clasp and mustard-yellow strap; small gold star charm keychain dangling from a front belt loop on a short chain",
		"negative": ["running sneaker", "thin sole"],
		"source_images": ["C4"],
		"image": "/shots/outfits/outfit_C4.jpg",
		"user_created": false
	},
	{
		"id": "outfit_C5",
		"name": "Japanese Text Tee",
		"style_tags": [
			"avant_garde_dark",
			"harajuku_street",
			"indie_sleaze",
			"minimal_basics",
			"y2k"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_tee_japanese_text_offwhite_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_coated_skinny_black_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": [],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": ["top_tee_japanese_text_offwhite_01", "bottom_jeans_coated_skinny_black_01"],
		"prompt": "fitted off-white short-sleeve crew tee with bold thick black Japanese text characters printed across the chest; black waxed coated skinny jeans with a glossy wet-look sheen, five-pocket, snug through the leg",
		"negative": [],
		"source_images": ["C5"],
		"image": "/shots/outfits/outfit_C5.jpg",
		"user_created": false
	},
	{
		"id": "outfit_D1",
		"name": "Clueless Gingham Set",
		"style_tags": [
			"preppy_90s",
			"coquette",
			"y2k",
			"kawaii",
			"minimal_basics"
		],
		"slots": {
			"outerwear": ["outerwear_jacket_tweed_gingham_cropped_bw_01"],
			"layer_top": [],
			"top": ["top_tank_scoop_black_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_skirt_gingham_mini_pink_01"],
			"belt_waist": [],
			"legwear": ["legwear_thigh_highs_sheer_white_01"],
			"shoes": ["shoes_mary_janes_platform_star_pink_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": ["accessory_binder_faux_fur_pink_01"]
		},
		"item_ids": [
			"outerwear_jacket_tweed_gingham_cropped_bw_01",
			"top_tank_scoop_black_01",
			"bottom_skirt_gingham_mini_pink_01",
			"legwear_thigh_highs_sheer_white_01",
			"shoes_mary_janes_platform_star_pink_01",
			"accessory_binder_faux_fur_pink_01"
		],
		"prompt": "cropped boxy black and white gingham boucle tweed jacket, collarless, edged in solid black trim along the front and cuffs, worn open; fitted black stretch jersey tank top with a low scoop neckline; fitted high-waisted baby pink and white gingham check straight mini skirt; sheer white thigh-high stockings with a solid opaque welt band at the top of the thigh; glossy pastel pink patent platform Mary Jane pumps, chunky block heel and thick platform sprinkled with small black stars, buckled ankle strap; fluffy baby pink faux-fur covered binder decorated with a rainbow patch, a GIRL POWER patch and small pins, carried under the arm",
		"negative": ["stiletto", "flat"],
		"source_images": ["D1"],
		"image": "/shots/outfits/outfit_D1.jpg",
		"user_created": false
	},
	{
		"id": "outfit_D2_left",
		"name": "Campus Sporty (Left)",
		"style_tags": [
			"streetwear_90s",
			"sportswear",
			"minimal_basics",
			"y2k_streetwear",
			"french_casual"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_tee_oversized_collegiate_slate_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_bike_shorts_side_stripe_black_01"],
			"belt_waist": [],
			"legwear": ["legwear_loose_socks_slouch_white_01"],
			"shoes": ["shoes_sneakers_high_top_white_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_necklace_thin_chain_silver_01"],
			"bag": ["bag_tote_canvas_cream_01"],
			"accessory": []
		},
		"item_ids": [
			"top_tee_oversized_collegiate_slate_01",
			"bottom_bike_shorts_side_stripe_black_01",
			"legwear_loose_socks_slouch_white_01",
			"shoes_sneakers_high_top_white_01",
			"jewelry_necklace_thin_chain_silver_01",
			"bag_tote_canvas_cream_01"
		],
		"prompt": "very oversized slate teal-gray heavy cotton tee with white collegiate block lettering and the number 07 across the chest, dropped shoulders, front half-tucked; snug black spandex bike shorts ending mid-thigh with a single white stripe down the outer side seam; thick white ribbed slouch socks pushed down into loose bunched rings around the lower calf, Japanese loose-socks style; clean white leather high-top basketball sneakers with a padded ankle collar, tonal side panel and white laces; single fine silver chain necklace resting at the collarbone; plain cream cotton canvas tote bag with long shoulder handles",
		"negative": [],
		"source_images": ["D2"],
		"image": "/shots/outfits/outfit_D2_left.jpg",
		"user_created": false
	},
	{
		"id": "outfit_D2_right",
		"name": "Campus Sporty (Right)",
		"style_tags": [
			"y2k_streetwear",
			"streetwear_90s",
			"sportswear",
			"japanese_school",
			"preppy"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_polo_raglan_crop_white_green_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_skirt_pleated_mini_forest_green_01"],
			"belt_waist": [],
			"legwear": ["legwear_socks_crew_white_01"],
			"shoes": ["shoes_sneakers_running_white_black_lace_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": ["neckwear_choker_cord_thin_black_01"],
			"jewelry": ["jewelry_bracelets_beaded_stack_01"],
			"bag": ["bag_mini_top_handle_lilac_01"],
			"accessory": []
		},
		"item_ids": [
			"top_polo_raglan_crop_white_green_01",
			"bottom_skirt_pleated_mini_forest_green_01",
			"legwear_socks_crew_white_01",
			"shoes_sneakers_running_white_black_lace_01",
			"neckwear_choker_cord_thin_black_01",
			"jewelry_bracelets_beaded_stack_01",
			"bag_mini_top_handle_lilac_01"
		],
		"prompt": "fitted cropped white polo shirt with forest green raglan short sleeves, green collar, a thin white stripe along the sleeves and a short button placket; short forest green pleated tennis mini skirt with crisp flared pleats; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; chunky white retro 90s running sneakers with layered leather and mesh overlays, a visible air-cushion midsole and contrasting black laces; thin black cord choker worn snug around the neck; stack of two or three thin beaded stretch bracelets on the wrist; tiny glossy lilac boxy handbag with a front flap and a short top handle",
		"negative": [],
		"source_images": ["D2"],
		"image": "/shots/outfits/outfit_D2_right.jpg",
		"user_created": false
	},
	{
		"id": "outfit_D3_left",
		"name": "Y2K Street (Left)",
		"style_tags": [
			"y2k_streetwear",
			"streetwear_90s",
			"grunge",
			"y2k",
			"gyaru"
		],
		"slots": {
			"outerwear": ["outerwear_hoodie_crop_varsity_letters_teal_01"],
			"layer_top": [],
			"top": ["top_tube_bandeau_black_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_baggy_lightwash_low_rise_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_sneakers_teal_low_01"],
			"headwear": ["headwear_beanie_rib_red_01"],
			"eyewear": [],
			"neckwear": ["neckwear_choker_cord_thin_black_01"],
			"jewelry": ["jewelry_necklace_layered_silver_chains_01"],
			"bag": ["bag_baguette_faux_fur_pink_01"],
			"accessory": ["accessory_keychain_star_gold_01"]
		},
		"item_ids": [
			"outerwear_hoodie_crop_varsity_letters_teal_01",
			"top_tube_bandeau_black_01",
			"bottom_jeans_baggy_lightwash_low_rise_01",
			"shoes_sneakers_teal_low_01",
			"headwear_beanie_rib_red_01",
			"neckwear_choker_cord_thin_black_01",
			"jewelry_necklace_layered_silver_chains_01",
			"bag_baguette_faux_fur_pink_01",
			"accessory_keychain_star_gold_01"
		],
		"prompt": "cropped emerald teal fleece zip hoodie with big pink varsity applique letters outlined in white across the chest, hood, ribbed hem, zipped halfway; simple black stretch jersey strapless tube top, smooth fitted band across the bust, peeking out from an open hoodie; light-wash faded baggy denim jeans, low rise, very wide straight legs and long hems puddling over the sneakers; low-top white leather sneakers with teal green overlays; brick red ribbed knit cuffed beanie, slightly slouchy, sitting back on the head; thin black cord choker worn snug around the neck; two or three layered silver chain necklaces at staggered lengths, small pendant on the longest; small fluffy baby pink faux-fur baguette bag on a short glossy pink shoulder strap; small gold star charm keychain dangling from a front belt loop on a short chain",
		"negative": [],
		"source_images": ["D3"],
		"image": "/shots/outfits/outfit_D3_left.jpg",
		"user_created": false
	},
	{
		"id": "outfit_D3_right",
		"name": "Y2K Street (Right)",
		"style_tags": [
			"streetwear_90s",
			"y2k_streetwear",
			"y2k",
			"hip_hop_2000s",
			"kawaii"
		],
		"slots": {
			"outerwear": ["outerwear_hoodie_zip_mustard_01"],
			"layer_top": [],
			"top": ["top_ringer_baby_tee_magical_script_white_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jorts_cargo_long_medium_wash_01"],
			"belt_waist": ["belt_waist_leather_red_silver_buckle_01"],
			"legwear": ["legwear_socks_tube_gray_01"],
			"shoes": ["shoes_sneakers_chunky_white_gray_01"],
			"headwear": [],
			"eyewear": ["eyewear_sunglasses_white_orange_lens_01"],
			"neckwear": [],
			"jewelry": [],
			"bag": ["bag_shoulder_leather_brown_01"],
			"accessory": []
		},
		"item_ids": [
			"outerwear_hoodie_zip_mustard_01",
			"top_ringer_baby_tee_magical_script_white_01",
			"bottom_jorts_cargo_long_medium_wash_01",
			"belt_waist_leather_red_silver_buckle_01",
			"legwear_socks_tube_gray_01",
			"shoes_sneakers_chunky_white_gray_01",
			"eyewear_sunglasses_white_orange_lens_01",
			"bag_shoulder_leather_brown_01"
		],
		"prompt": "oversized mustard yellow fleece zip hoodie worn open and slipped off the shoulders; fitted cropped white ringer baby tee with black trim and the word Magical in hot-pink cursive script across the chest with a tiny gold sparkle; very baggy medium-wash denim jorts ending below the knee with side cargo pockets, wide straight legs; glossy red leather belt with a silver rectangular buckle worn low on the hips; heather gray ribbed tube socks pulled up to mid-calf; bulky white and light gray padded sneakers with layered panels and thick laces; glossy white rectangular sunglasses with gradient orange-red lenses, pushed up on top of the head; medium slouchy cognac brown smooth leather shoulder bag with a single short strap, soft unstructured body",
		"negative": [],
		"source_images": ["D3"],
		"image": "/shots/outfits/outfit_D3_right.jpg",
		"user_created": false
	},
	{
		"id": "outfit_D4",
		"name": "Floral Corset & Tulle Cape",
		"style_tags": [
			"romantic_couture",
			"coquette",
			"fairycore"
		],
		"slots": {
			"outerwear": ["outerwear_cape_tulle_floral_applique_blush_01"],
			"layer_top": [],
			"top": [],
			"dress_onepiece": ["dress_onepiece_corset_bodysuit_floral_lace_rose_01"],
			"bottom": [],
			"belt_waist": [],
			"legwear": [],
			"shoes": [],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": ["accessory_corsage_rose_shoulder_01"]
		},
		"item_ids": [
			"outerwear_cape_tulle_floral_applique_blush_01",
			"dress_onepiece_corset_bodysuit_floral_lace_rose_01",
			"accessory_corsage_rose_shoulder_01"
		],
		"prompt": "sheer blush tulle cape draped from one shoulder into a long pooling floor-length train, scattered embroidered vines and 3D pink flower appliques, scalloped lace edge; couture dusty rose corset bodysuit in sheer blush tulle covered with embroidered vines and 3D plum and pink flower appliques, black boning lines, black waistband, thin black straps with gold sliders; large dusty rose silk rose corsage with sage-green leaves and short dangling bead strands pinned at the shoulder",
		"negative": ["cheap costume look"],
		"source_images": ["D4"],
		"image": "/shots/outfits/outfit_D4.jpg",
		"user_created": false
	},
	{
		"id": "outfit_D5",
		"name": "Tee Dress & Pod Sneakers",
		"style_tags": [
			"y2k",
			"sportswear",
			"gyaru",
			"japanese_school",
			"minimal_basics"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": [],
			"dress_onepiece": ["dress_onepiece_tee_dress_ribbed_offwhite_01"],
			"bottom": [],
			"belt_waist": [],
			"legwear": ["legwear_loose_socks_slouch_white_01"],
			"shoes": ["shoes_sneakers_sculpted_pod_sole_gray_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"dress_onepiece_tee_dress_ribbed_offwhite_01",
			"legwear_loose_socks_slouch_white_01",
			"shoes_sneakers_sculpted_pod_sole_gray_01"
		],
		"prompt": "body-skimming off-white fine rib-knit short-sleeve t-shirt mini dress, crew neck, tiny printed chest logo; thick white ribbed slouch socks pushed down into loose bunched rings around the lower calf, Japanese loose-socks style; very chunky light gray and cream sculpted running sneakers with bubbly organic blob-shaped overlay panels and rows of round cushioning pods around the outsole",
		"negative": [],
		"source_images": ["D5"],
		"image": "/shots/outfits/outfit_D5.jpg",
		"user_created": false
	},
	{
		"id": "outfit_E1",
		"name": "All-Leather Suit",
		"style_tags": [
			"leather_tailoring",
			"rock_moto",
			"avant_garde_dark",
			"minimal_basics",
			"streetwear_90s"
		],
		"slots": {
			"outerwear": ["outerwear_blazer_leather_black_01"],
			"layer_top": [],
			"top": ["top_tee_crew_black_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_trousers_leather_straight_black_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_boots_pointed_cuban_heel_black_01"],
			"headwear": ["headwear_durag_black_01"],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_necklace_thin_chain_silver_01"],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"outerwear_blazer_leather_black_01",
			"top_tee_crew_black_01",
			"bottom_trousers_leather_straight_black_01",
			"shoes_boots_pointed_cuban_heel_black_01",
			"headwear_durag_black_01",
			"jewelry_necklace_thin_chain_silver_01"
		],
		"prompt": "relaxed black soft lambskin leather blazer with notch lapels, single-breasted, worn-in satin sheen, part of a matching leather suit; plain black cotton jersey crew-neck t-shirt, regular fit, smooth matte finish, no graphics; black soft leather straight-leg trousers, relaxed fit, full length breaking over boots, natural creases at the knees; polished black leather pointed-toe ankle boots with a short Cuban heel and a contrasting tan stacked leather sole; black silky durag tied snugly over the head; single fine silver chain necklace resting at the collarbone",
		"negative": [],
		"source_images": ["E1"],
		"image": "/shots/outfits/outfit_E1.jpg",
		"user_created": false
	},
	{
		"id": "outfit_E2",
		"name": "Varsity Knit & Tweed Sneakers",
		"style_tags": [
			"luxury_street",
			"streetwear_90s",
			"avant_garde_dark",
			"indie_sleaze",
			"preppy_sport"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_sweater_varsity_stripe_orange_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_waxed_straight_charcoal_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_sneakers_tweed_suede_beige_cc_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"top_sweater_varsity_stripe_orange_01",
			"bottom_jeans_waxed_straight_charcoal_01",
			"shoes_sneakers_tweed_suede_beige_cc_01"
		],
		"prompt": "boxy bright orange chunky knit crewneck sweater with brown and white football-jersey stripes down the shoulders and sleeves and big brown felt letters across the chest; charcoal black waxed coated straight-leg jeans with a leather-like semi-gloss finish and light crinkling; low-top Chanel sneakers in beige woven tweed with tan suede overlays, white interlocking CC side logo, cream laces and white sole",
		"prompt_brand_free": "boxy bright orange chunky knit crewneck sweater with brown and white football-jersey stripes down the shoulders and sleeves and big brown felt letters across the chest; charcoal black waxed coated straight-leg jeans with a leather-like semi-gloss finish and light crinkling; low-top runner sneakers in beige woven tweed with tan suede overlays, small white interlocking-letter side logo, cream laces and white rubber sole",
		"negative": [],
		"source_images": ["E2"],
		"image": "/shots/outfits/outfit_E2.jpg",
		"user_created": false
	},
	{
		"id": "outfit_E3_left",
		"name": "Paint-Splatter Workwear",
		"style_tags": [
			"americana",
			"vintage_workwear",
			"minimal_basics",
			"grunge",
			"streetwear_90s"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_tee_fitted_faded_graphic_cream_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_paint_splatter_lightwash_01"],
			"belt_waist": ["belt_waist_braided_leather_tan_01"],
			"legwear": [],
			"shoes": ["shoes_boots_desert_suede_tan_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_necklace_thin_chain_silver_01"],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"top_tee_fitted_faded_graphic_cream_01",
			"bottom_jeans_paint_splatter_lightwash_01",
			"belt_waist_braided_leather_tan_01",
			"shoes_boots_desert_suede_tan_01",
			"jewelry_necklace_thin_chain_silver_01"
		],
		"prompt": "slim fitted cream cotton crew tee with a faded, barely-there chest graphic, tucked in; light-wash faded straight-leg jeans with paint splatters and drips across the thighs, relaxed workwear fit; tan woven braided leather belt with a brass buckle; sand tan suede lace-up ankle desert boots with a soft crepe sole; single fine silver chain necklace resting at the collarbone",
		"negative": [],
		"source_images": ["E3"],
		"image": "/shots/outfits/outfit_E3_left.jpg",
		"user_created": false
	},
	{
		"id": "outfit_E3_right",
		"name": "Dark Luxe Black",
		"style_tags": [
			"luxury_street",
			"avant_garde_dark",
			"gothic",
			"leather_tailoring",
			"rock_moto"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_tank_ribbed_cross_logo_black_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_pants_wide_drawstring_black_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_loafers_leather_black_01"],
			"headwear": ["headwear_cap_baseball_black_backwards_01"],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_bracelets_silver_bangle_stack_01"],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"top_tank_ribbed_cross_logo_black_01",
			"bottom_pants_wide_drawstring_black_01",
			"shoes_loafers_leather_black_01",
			"headwear_cap_baseball_black_backwards_01",
			"jewelry_bracelets_silver_bangle_stack_01"
		],
		"prompt": "fitted black ribbed cotton tank top with a small silver gothic cross logo embroidered on the chest; very wide black heavy jersey drawstring trousers with extra long drawcords hanging to the knees, slightly dropped crotch and puddling hems; slim polished black leather loafers with a low heel and almond toe, high shine, peeking under puddled trouser hems; black cotton baseball cap with a small white front logo; stacked chunky silver bangles and chain bracelets on the wrist",
		"negative": [],
		"source_images": ["E3"],
		"image": "/shots/outfits/outfit_E3_right.jpg",
		"user_created": false
	},
	{
		"id": "outfit_E4",
		"name": "Cable Knit & Tractor Boots",
		"style_tags": [
			"avant_garde_dark",
			"luxury_street",
			"avant_garde_rick",
			"gothic",
			"minimal_basics"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_sweater_cable_knit_cream_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_skinny_patchwork_faded_gray_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_boots_platform_tractor_black_01"],
			"headwear": [],
			"eyewear": ["eyewear_sunglasses_shield_aviator_brown_01"],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"top_sweater_cable_knit_cream_01",
			"bottom_jeans_skinny_patchwork_faded_gray_01",
			"shoes_boots_platform_tractor_black_01",
			"eyewear_sunglasses_shield_aviator_brown_01"
		],
		"prompt": "relaxed cream chunky cable-knit wool crewneck sweater with raised vertical cables, ribbed collar, cuffs and hem; faded gray skinny jeans with a black denim patchwork panel across one thigh, exposed raw seams, long legs stacking into the boots; black leather calf-high boots on a huge rounded tractor-tread platform sole, bulbous exaggerated shape, jeans tucked in; oversized brown-tinted shield aviator sunglasses with a thin gold metal frame",
		"negative": ["thin sole", "pointed toe"],
		"source_images": ["E4"],
		"image": "/shots/outfits/outfit_E4.jpg",
		"user_created": false
	},
	{
		"id": "outfit_E5",
		"name": "Slogan Baby Tee & Bullet Belt",
		"style_tags": [
			"avant_garde_dark",
			"indie_sleaze",
			"luxury_street",
			"rock_moto",
			"punk"
		],
		"slots": {
			"outerwear": ["outerwear_jacket_cropped_patent_trucker_black_01"],
			"layer_top": [],
			"top": ["top_baby_tee_i_dont_smoke_cream_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_waxed_straight_charcoal_01"],
			"belt_waist": ["belt_waist_bullet_silver_01"],
			"legwear": [],
			"shoes": [],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"outerwear_jacket_cropped_patent_trucker_black_01",
			"top_baby_tee_i_dont_smoke_cream_01",
			"bottom_jeans_waxed_straight_charcoal_01",
			"belt_waist_bullet_silver_01"
		],
		"prompt": "cropped boxy black glossy crinkled patent leather trucker jacket with point collar, two flap chest pockets and button front; tight shrunken cream cotton baby tee with I DON'T SMOKE printed in bold brick-red serif letters across the chest; charcoal black waxed coated straight-leg jeans with a leather-like semi-gloss finish and light crinkling; black belt lined with a continuous row of upright silver bullet-cartridge spikes, worn on the hips",
		"negative": [],
		"source_images": ["E5"],
		"image": "/shots/outfits/outfit_E5.jpg",
		"user_created": false
	},
	{
		"id": "outfit_F1",
		"name": "Indie Sleaze Mini",
		"style_tags": [
			"indie_sleaze",
			"y2k",
			"luxury_street",
			"gothic",
			"coquette"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": [],
			"dress_onepiece": ["dress_onepiece_knit_sleeveless_mock_studded_black_01"],
			"bottom": ["bottom_shorts_lace_trim_leopard_01"],
			"belt_waist": ["belt_waist_studded_oring_black_01"],
			"legwear": ["legwear_thigh_highs_lace_top_black_01"],
			"shoes": ["shoes_pumps_pointed_buckle_black_01"],
			"headwear": [],
			"eyewear": ["eyewear_glasses_oval_wire_01"],
			"neckwear": [],
			"jewelry": ["jewelry_bracelets_silver_bangle_stack_01", "jewelry_earrings_small_hoops_silver_01"],
			"bag": ["bag_baguette_croc_black_01"],
			"accessory": []
		},
		"item_ids": [
			"dress_onepiece_knit_sleeveless_mock_studded_black_01",
			"bottom_shorts_lace_trim_leopard_01",
			"belt_waist_studded_oring_black_01",
			"legwear_thigh_highs_lace_top_black_01",
			"shoes_pumps_pointed_buckle_black_01",
			"eyewear_glasses_oval_wire_01",
			"jewelry_bracelets_silver_bangle_stack_01",
			"jewelry_earrings_small_hoops_silver_01",
			"bag_baguette_croc_black_01"
		],
		"prompt": "fitted black ribbed knit sleeveless mini dress with a high mock neck trimmed in small silver studs; tiny leopard print satin shorts edged with black lace peeking below a mini dress hem; black leather hip belt with silver studs and large O-ring hardware slung loosely low on the hips; sheer black thigh-high stockings with a wide black lace band at the top; sharp pointed-toe glossy black patent pumps with a slim heel and silver buckle hardware across the vamp; small narrow oval clear-lens glasses with thin silver wire frames; stacked chunky silver bangles and chain bracelets on the wrist; small silver huggie hoop earrings hugging the earlobe, polished finish; slim black croc-embossed leather baguette shoulder bag with silver hardware tucked under the arm",
		"negative": [],
		"source_images": ["F1"],
		"image": "/shots/outfits/outfit_F1.jpg",
		"user_created": false
	},
	{
		"id": "outfit_F2",
		"name": "Mesh Layer & Derbies",
		"style_tags": [
			"streetwear_90s",
			"grunge",
			"sportswear",
			"minimal_basics",
			"indie_sleaze"
		],
		"slots": {
			"outerwear": [],
			"layer_top": ["layer_top_longsleeve_white_01"],
			"top": ["top_tee_mesh_oversized_black_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_track_pants_piped_cream_01"],
			"belt_waist": [],
			"legwear": ["legwear_socks_tall_ribbed_white_01"],
			"shoes": ["shoes_derby_chunky_black_leather_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_earrings_small_hoops_silver_01", "jewelry_necklace_layered_silver_chains_01"],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"layer_top_longsleeve_white_01",
			"top_tee_mesh_oversized_black_01",
			"bottom_track_pants_piped_cream_01",
			"legwear_socks_tall_ribbed_white_01",
			"shoes_derby_chunky_black_leather_01",
			"jewelry_earrings_small_hoops_silver_01",
			"jewelry_necklace_layered_silver_chains_01"
		],
		"prompt": "plain white long-sleeve cotton tee worn underneath, sleeves showing below a short-sleeve top; boxy oversized black athletic mesh short-sleeve tee layered over a white long-sleeve; cream tricot track pants with a thin black stripe piping down the outer seam, relaxed straight leg ending at the ankle; tall white ribbed over-the-calf socks pulled up high; black smooth leather three-eyelet derby shoes on a chunky air-cushioned sole with yellow welt stitching, rounded toe; small silver huggie hoop earrings hugging the earlobe, polished finish; two or three layered silver chain necklaces at staggered lengths, small pendant on the longest",
		"negative": [],
		"source_images": ["F2"],
		"image": "/shots/outfits/outfit_F2.jpg",
		"user_created": false
	},
	{
		"id": "outfit_F3",
		"name": "Denim on Denim 90s",
		"style_tags": [
			"streetwear_90s",
			"grunge",
			"minimal_basics",
			"punk",
			"americana"
		],
		"slots": {
			"outerwear": ["outerwear_jacket_denim_trucker_medium_wash_01"],
			"layer_top": [],
			"top": ["top_tee_crew_black_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_skinny_ripped_cuffed_lightwash_01"],
			"belt_waist": [],
			"legwear": ["legwear_socks_crew_white_01"],
			"shoes": ["shoes_derby_chunky_black_leather_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_rings_silver_01", "jewelry_necklace_layered_silver_chains_01"],
			"bag": [],
			"accessory": ["accessory_wallet_chain_silver_01"]
		},
		"item_ids": [
			"outerwear_jacket_denim_trucker_medium_wash_01",
			"top_tee_crew_black_01",
			"bottom_jeans_skinny_ripped_cuffed_lightwash_01",
			"legwear_socks_crew_white_01",
			"shoes_derby_chunky_black_leather_01",
			"jewelry_rings_silver_01",
			"jewelry_necklace_layered_silver_chains_01",
			"accessory_wallet_chain_silver_01"
		],
		"prompt": "faded medium-wash denim trucker jacket, classic waist length, chest flap pockets, worn open; plain black cotton jersey crew-neck t-shirt, regular fit, smooth matte finish, no graphics; light-wash skinny jeans with ripped knees and rolled cuffs at the ankle; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; black smooth leather three-eyelet derby shoes on a chunky air-cushioned sole with yellow welt stitching, rounded toe; a few chunky silver rings on the fingers; two or three layered silver chain necklaces at staggered lengths, small pendant on the longest; silver wallet chain looping from a front belt loop around to the back pocket",
		"negative": [],
		"source_images": ["F3"],
		"image": "/shots/outfits/outfit_F3.jpg",
		"user_created": false
	},
	{
		"id": "outfit_F4",
		"name": "Black Workwear",
		"style_tags": [
			"streetwear_90s",
			"minimal_basics",
			"vintage_workwear",
			"americana",
			"rock_moto"
		],
		"slots": {
			"outerwear": ["outerwear_jacket_sherpa_lined_cropped_black_01"],
			"layer_top": [],
			"top": ["top_tee_long_white_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_skinny_black_stacked_01"],
			"belt_waist": ["belt_waist_leather_black_silver_buckle_01"],
			"legwear": [],
			"shoes": ["shoes_boots_hiker_nubuck_black_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_necklace_thin_chain_silver_01"],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"outerwear_jacket_sherpa_lined_cropped_black_01",
			"top_tee_long_white_01",
			"bottom_jeans_skinny_black_stacked_01",
			"belt_waist_leather_black_silver_buckle_01",
			"shoes_boots_hiker_nubuck_black_01",
			"jewelry_necklace_thin_chain_silver_01"
		],
		"prompt": "cropped boxy black canvas jacket lined in gray sherpa fleece, hooded, worn slipped down off the shoulders; plain white long-line cotton crew tee falling past the hips; black stretch skinny jeans stacking in folds at the ankles over boots; classic black leather belt with a silver buckle; black nubuck ankle-high lace-up hiking boots with gold speed hooks and a padded collar; single fine silver chain necklace resting at the collarbone",
		"negative": [],
		"source_images": ["F4"],
		"image": "/shots/outfits/outfit_F4.jpg",
		"user_created": false
	},
	{
		"id": "outfit_F5",
		"name": "White Tank Americana",
		"style_tags": [
			"americana",
			"minimal_basics",
			"vintage_workwear",
			"streetwear_90s"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_tank_ribbed_white_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_straight_medium_wash_01"],
			"belt_waist": ["belt_waist_leather_black_silver_buckle_01"],
			"legwear": [],
			"shoes": [],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"top_tank_ribbed_white_01",
			"bottom_jeans_straight_medium_wash_01",
			"belt_waist_leather_black_silver_buckle_01"
		],
		"prompt": "classic white ribbed cotton A-shirt tank top, fitted, tucked in; medium-wash relaxed straight-leg jeans, mid rise, classic five-pocket; classic black leather belt with a silver buckle",
		"negative": [],
		"source_images": ["F5"],
		"image": "/shots/outfits/outfit_F5.jpg",
		"user_created": false
	},
	{
		"id": "outfit_F6",
		"name": "All-Black & Tweed Sneakers",
		"style_tags": [
			"streetwear_90s",
			"minimal_basics",
			"sportswear",
			"japanese_school",
			"luxury_street"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_tee_oversized_black_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_shorts_nylon_black_01"],
			"belt_waist": [],
			"legwear": ["legwear_socks_crew_white_01"],
			"shoes": ["shoes_sneakers_tweed_suede_beige_cc_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_necklace_thin_chain_silver_01"],
			"bag": ["bag_sling_nylon_black_01"],
			"accessory": []
		},
		"item_ids": [
			"top_tee_oversized_black_01",
			"bottom_shorts_nylon_black_01",
			"legwear_socks_crew_white_01",
			"shoes_sneakers_tweed_suede_beige_cc_01",
			"jewelry_necklace_thin_chain_silver_01",
			"bag_sling_nylon_black_01"
		],
		"prompt": "boxy oversized black heavy cotton t-shirt with dropped shoulders and sleeves past the elbow, plain, no graphics; relaxed black nylon shorts ending above the knee; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; low-top Chanel sneakers in beige woven tweed with tan suede overlays, white interlocking CC side logo, cream laces and white sole; single fine silver chain necklace resting at the collarbone; compact black nylon crossbody sling bag with zip pockets, worn across the back",
		"prompt_brand_free": "boxy oversized black heavy cotton t-shirt with dropped shoulders and sleeves past the elbow, plain, no graphics; relaxed black nylon shorts ending above the knee; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; low-top runner sneakers in beige woven tweed with tan suede overlays, small white interlocking-letter side logo, cream laces and white rubber sole; single fine silver chain necklace resting at the collarbone; compact black nylon crossbody sling bag with zip pockets, worn across the back",
		"negative": [],
		"source_images": ["F6"],
		"image": "/shots/outfits/outfit_F6.jpg",
		"user_created": false
	},
	{
		"id": "outfit_G1",
		"name": "Dark Denim Set",
		"style_tags": [
			"hip_hop_2000s",
			"streetwear_90s",
			"americana",
			"luxury_street",
			"minimal_basics"
		],
		"slots": {
			"outerwear": ["outerwear_jacket_denim_trucker_dark_rinse_01"],
			"layer_top": [],
			"top": [],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_gothic_embroidered_dark_rinse_01"],
			"belt_waist": ["belt_waist_leather_black_silver_buckle_01"],
			"legwear": [],
			"shoes": ["shoes_sneakers_puffy_skate_black_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"outerwear_jacket_denim_trucker_dark_rinse_01",
			"bottom_jeans_gothic_embroidered_dark_rinse_01",
			"belt_waist_leather_black_silver_buckle_01",
			"shoes_sneakers_puffy_skate_black_01"
		],
		"prompt": "fitted dark-rinse raw indigo denim trucker jacket with copper buttons, two flap chest pockets, orange contrast stitching and a tiny red embroidered chest logo; dark-rinse indigo straight-leg jeans with white gothic Old English blackletter embroidery across the front thighs; classic black leather belt with a silver buckle; bulky black leather early-2000s skate sneakers with a thick padded tongue and collar and fat white laces",
		"negative": [],
		"source_images": ["G1"],
		"image": "/shots/outfits/outfit_G1.jpg",
		"user_created": false
	},
	{
		"id": "outfit_G2",
		"name": "Royal Blue Tracksuit",
		"style_tags": [
			"streetwear_90s",
			"sportswear",
			"luxury_street",
			"hip_hop_2000s",
			"minimal_basics"
		],
		"slots": {
			"outerwear": ["outerwear_track_jacket_royal_blue_stripe_01"],
			"layer_top": [],
			"top": [],
			"dress_onepiece": [],
			"bottom": ["bottom_track_pants_royal_blue_stripe_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_sneakers_court_low_white_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_necklace_initial_pendant_gold_01", "jewelry_rings_silver_01"],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"outerwear_track_jacket_royal_blue_stripe_01",
			"bottom_track_pants_royal_blue_stripe_01",
			"shoes_sneakers_court_low_white_01",
			"jewelry_necklace_initial_pendant_gold_01",
			"jewelry_rings_silver_01"
		],
		"prompt": "royal blue satin tricot track jacket with yellow and white piping along the shoulders and sleeves, striped cuffs and a white script logo embroidered on the chest, worn open; matching royal blue satin tricot track pants with yellow and white stripes down the outer leg and a small script logo on the thigh; clean white smooth leather low-profile court sneakers with minimal panels and a flat cupsole; thin gold chain necklace with a single gold block-letter initial pendant; a few chunky silver rings on the fingers",
		"negative": [],
		"source_images": ["G2"],
		"image": "/shots/outfits/outfit_G2.jpg",
		"user_created": false
	},
	{
		"id": "outfit_G3",
		"name": "Leopard Vest & Mustard Joggers",
		"style_tags": [
			"streetwear_90s",
			"luxury_street",
			"hip_hop_2000s",
			"minimal_basics",
			"japanese_school"
		],
		"slots": {
			"outerwear": ["outerwear_vest_leopard_utility_01"],
			"layer_top": ["layer_top_longsleeve_white_tee_g3_01"],
			"top": [],
			"dress_onepiece": [],
			"bottom": ["bottom_sweatpants_mustard_old_english_01"],
			"belt_waist": [],
			"legwear": ["legwear_socks_crew_white_01"],
			"shoes": ["shoes_sneakers_high_top_custom_white_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_bracelets_beaded_stack_01"],
			"bag": ["bag_belt_bag_plaid_patch_01"],
			"accessory": []
		},
		"item_ids": [
			"outerwear_vest_leopard_utility_01",
			"layer_top_longsleeve_white_tee_g3_01",
			"bottom_sweatpants_mustard_old_english_01",
			"legwear_socks_crew_white_01",
			"shoes_sneakers_high_top_custom_white_01",
			"jewelry_bracelets_beaded_stack_01",
			"bag_belt_bag_plaid_patch_01"
		],
		"prompt": "boxy leopard print fleece utility puffer vest with high zip neck, chest flap pockets, woven tan logo label patches and toggle drawcord hem; plain white cotton long-sleeve tee worn under a vest; relaxed mustard gold fleece joggers with a black gothic Old English Billionaire Boys Club print on the thigh, drawstring waist and elastic ankle cuffs; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; chunky white leather high-top basketball sneakers, one customized with black hand-drawn marker doodles and spots, ankle strap; stack of two or three thin beaded stretch bracelets on the wrist; small brown and red plaid canvas belt bag with round patch appliques, worn crossbody across the chest",
		"prompt_brand_free": "boxy leopard print fleece utility puffer vest with high zip neck, chest flap pockets, woven tan logo label patches and toggle drawcord hem; plain white cotton long-sleeve tee worn under a vest; relaxed mustard gold fleece joggers with a black gothic Old English blackletter logo print and circular emblem on the thigh, drawstring waist, elastic ankle cuffs; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; chunky white leather high-top basketball sneakers, one customized with black hand-drawn marker doodles and spots, ankle strap; stack of two or three thin beaded stretch bracelets on the wrist; small brown and red plaid canvas belt bag with round patch appliques, worn crossbody across the chest",
		"negative": [],
		"source_images": ["G3"],
		"image": "/shots/outfits/outfit_G3.jpg",
		"user_created": false
	},
	{
		"id": "outfit_G4",
		"name": "Classic Moto Jacket",
		"style_tags": [
			"minimal_basics",
			"rock_moto",
			"grunge",
			"hip_hop_2000s",
			"japanese_school"
		],
		"slots": {
			"outerwear": ["outerwear_jacket_moto_biker_black_01"],
			"layer_top": [],
			"top": ["top_tee_crew_heather_oatmeal_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_skinny_distressed_raw_hem_black_01"],
			"belt_waist": [],
			"legwear": ["legwear_socks_crew_white_01"],
			"shoes": ["shoes_boots_chelsea_suede_brown_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_earrings_stud_diamond_01"],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"outerwear_jacket_moto_biker_black_01",
			"top_tee_crew_heather_oatmeal_01",
			"bottom_jeans_skinny_distressed_raw_hem_black_01",
			"legwear_socks_crew_white_01",
			"shoes_boots_chelsea_suede_brown_01",
			"jewelry_earrings_stud_diamond_01"
		],
		"prompt": "classic black leather moto biker jacket with asymmetric silver zip, snap-down lapels and zippered cuffs, worn open; heather oatmeal light gray soft cotton crew-neck tee, regular fit, plain, worn under a leather jacket; black skinny jeans with shredded knee rips and a frayed raw-cut hem cropped above the ankle; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; dark brown suede ankle Chelsea boots with elastic side panels, almond toe and low heel; small sparkling round diamond stud earring in a silver setting, worn in one or both ears",
		"negative": [],
		"source_images": ["G4"],
		"image": "/shots/outfits/outfit_G4.jpg",
		"user_created": false
	},
	{
		"id": "outfit_G5",
		"name": "Camel Knit & LA Cap",
		"style_tags": [
			"streetwear_90s",
			"minimal_basics",
			"hip_hop_2000s",
			"dark_academia",
			"grunge"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_sweater_fine_knit_camel_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_trousers_pleated_wide_khaki_01"],
			"belt_waist": ["belt_waist_nylon_cobra_buckle_black_01"],
			"legwear": ["legwear_socks_crew_white_01"],
			"shoes": ["shoes_sneakers_mesh_netting_cream_01"],
			"headwear": ["headwear_cap_fitted_la_green_01"],
			"eyewear": [],
			"neckwear": ["neckwear_choker_cord_thin_black_01"],
			"jewelry": ["jewelry_necklace_initial_pendant_gold_01"],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"top_sweater_fine_knit_camel_01",
			"bottom_trousers_pleated_wide_khaki_01",
			"belt_waist_nylon_cobra_buckle_black_01",
			"legwear_socks_crew_white_01",
			"shoes_sneakers_mesh_netting_cream_01",
			"headwear_cap_fitted_la_green_01",
			"neckwear_choker_cord_thin_black_01",
			"jewelry_necklace_initial_pendant_gold_01"
		],
		"prompt": "slim camel khaki fine-gauge wool crewneck sweater, smooth flat knit, long fitted sleeves, ribbed cuffs and hem; stone khaki cotton twill pleated trousers with a high rise and wide relaxed legs; black nylon webbing belt with a gunmetal quick-release cobra buckle; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; white and cream retro mid-cut basketball sneakers with mesh netting side panels, plastic wing eyelets and a visible air heel; structured forest green fitted baseball cap with a white interlocking LA logo on the front; thin black cord choker worn snug around the neck; thin gold chain necklace with a single gold block-letter initial pendant",
		"prompt_brand_free": "slim camel khaki fine-gauge wool crewneck sweater, smooth flat knit, long fitted sleeves, ribbed cuffs and hem; stone khaki cotton twill pleated trousers with a high rise and wide relaxed legs; black nylon webbing belt with a gunmetal quick-release cobra buckle; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; white and cream retro mid-cut basketball sneakers with mesh netting side panels, plastic wing eyelets and a visible air heel; structured forest green fitted baseball cap with a white interlocking two-letter logo on the front; thin black cord choker worn snug around the neck; thin gold chain necklace with a single gold block-letter initial pendant",
		"negative": [],
		"source_images": ["G5"],
		"image": "/shots/outfits/outfit_G5.jpg",
		"user_created": false
	},
	{
		"id": "outfit_H1",
		"name": "Thermal Heatmap Puffer",
		"style_tags": [
			"luxury_street",
			"streetwear_90s",
			"techwear"
		],
		"slots": {
			"outerwear": ["outerwear_puffer_thermal_gradient_01"],
			"layer_top": [],
			"top": [],
			"dress_onepiece": [],
			"bottom": [],
			"belt_waist": [],
			"legwear": [],
			"shoes": [],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": ["outerwear_puffer_thermal_gradient_01"],
		"prompt": "boxy hip-length matte nylon puffer jacket printed with a thermal-camera heatmap: sky blue edges fading to yellow, orange, magenta and a black core at the center chest, snap stand collar",
		"negative": [],
		"source_images": ["H1"],
		"image": "/shots/outfits/outfit_H1.jpg",
		"user_created": false
	},
	{
		"id": "outfit_H3",
		"name": "Pink Sheer & Platforms",
		"style_tags": [
			"avant_garde_dark",
			"avant_garde_rick",
			"gothic",
			"grunge",
			"indie_sleaze"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_longsleeve_sheer_jersey_pink_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_coated_skinny_black_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_sneakers_platform_high_top_megalug_black_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_necklace_layered_silver_chains_01"],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"top_longsleeve_sheer_jersey_pink_01",
			"bottom_jeans_coated_skinny_black_01",
			"shoes_sneakers_platform_high_top_megalug_black_01",
			"jewelry_necklace_layered_silver_chains_01"
		],
		"prompt": "slim bubblegum pink sheer fine jersey long-sleeve tee with extra long sleeves bunching at the wrists; black waxed coated skinny jeans with a glossy wet-look sheen, five-pocket, snug through the leg; black canvas high-top sneakers on a massive chunky tooth-lugged platform rubber sole, long loose black laces; two or three layered silver chain necklaces at staggered lengths, small pendant on the longest",
		"negative": ["thin sole", "white sole"],
		"source_images": ["H3"],
		"image": "/shots/outfits/outfit_H3.jpg",
		"user_created": false
	},
	{
		"id": "outfit_H4",
		"name": "Bandana Shirt & Shredded Denim",
		"style_tags": [
			"streetwear_90s",
			"luxury_street",
			"western",
			"grunge",
			"minimal_basics"
		],
		"slots": {
			"outerwear": [],
			"layer_top": ["layer_top_camp_shirt_bandana_red_01"],
			"top": ["top_tee_graphic_text_white_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_shredded_bleached_baggy_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_slip_on_bandana_red_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_bracelets_beaded_stack_01"],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"layer_top_camp_shirt_bandana_red_01",
			"top_tee_graphic_text_white_01",
			"bottom_jeans_shredded_bleached_baggy_01",
			"shoes_slip_on_bandana_red_01",
			"jewelry_bracelets_beaded_stack_01"
		],
		"prompt": "boxy short-sleeve red camp collar shirt with a red and white bandana paisley print across the lower half, worn open; white cotton crew tee with large bold black text printed on the front; baggy bleached light-gray acid-wash jeans heavily shredded with rips and frayed holes all over the legs; red and white bandana-print canvas slip-on sneakers with white rubber soles; stack of two or three thin beaded stretch bracelets on the wrist",
		"negative": [],
		"source_images": ["H4"],
		"image": "/shots/outfits/outfit_H4.jpg",
		"user_created": false
	},
	{
		"id": "outfit_H5",
		"name": "Gray Tracksuit & Wrap Mask",
		"style_tags": [
			"streetwear_90s",
			"sportswear",
			"uk_drill",
			"minimal_basics",
			"y2k_streetwear"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_sweatshirt_crew_script_heather_gray_01", "top_tee_long_white_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_sweatpants_heather_gray_script_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_sneakers_chunky_low_white_01"],
			"headwear": ["headwear_balaclava_wrap_white_01"],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"top_sweatshirt_crew_script_heather_gray_01",
			"top_tee_long_white_01",
			"bottom_sweatpants_heather_gray_script_01",
			"shoes_sneakers_chunky_low_white_01",
			"headwear_balaclava_wrap_white_01"
		],
		"prompt": "relaxed heather gray fleece crewneck sweatshirt with a small white script logo embroidered on the chest, white tee hem peeking out; plain white long-line cotton crew tee falling past the hips; relaxed heather gray fleece sweatpants with elastic cuffs bunching over sneakers and a small white script logo on the thigh; chunky all-white leather low-top court sneakers with a thick cupsole, perforated toe box and white laces; white cotton jersey fabric wrapped tightly around the head as a balaclava, covering head and lower face with only the eyes showing, knotted at the back",
		"negative": ["running sneaker", "thin sole"],
		"source_images": ["H5"],
		"image": "/shots/outfits/outfit_H5.jpg",
		"user_created": false
	},
	{
		"id": "outfit_I1",
		"name": "Vinyl Heart Tee",
		"style_tags": ["minimal_basics", "streetwear_90s"],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_tee_vinyl_heart_print_white_01"],
			"dress_onepiece": [],
			"bottom": [],
			"belt_waist": [],
			"legwear": [],
			"shoes": [],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": ["top_tee_vinyl_heart_print_white_01"],
		"prompt": "white crew tee with a large back print of a heart made from overlapping black vinyl records with colorful center labels, small record-store logos and badges below",
		"negative": [],
		"source_images": ["I1"],
		"image": "/shots/outfits/outfit_I1.jpg",
		"user_created": false
	},
	{
		"id": "outfit_I2",
		"name": "Spiked Flag Tee",
		"style_tags": [
			"grunge",
			"luxury_street",
			"punk"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_tee_boxy_flag_spikes_black_01"],
			"dress_onepiece": [],
			"bottom": [],
			"belt_waist": [],
			"legwear": [],
			"shoes": [],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": ["top_tee_boxy_flag_spikes_black_01"],
		"prompt": "faded black boxy cropped tee with a raw-cut neckline and a blurry airbrushed American flag graphic covered in spikes, white spike halo, AMERICAN SABOTAGE text below",
		"negative": [],
		"source_images": ["I2"],
		"image": "/shots/outfits/outfit_I2.jpg",
		"user_created": false
	},
	{
		"id": "outfit_I3_green",
		"name": "Green Puffer Set",
		"style_tags": [
			"streetwear_90s",
			"uk_drill",
			"sportswear",
			"minimal_basics",
			"y2k_streetwear"
		],
		"slots": {
			"outerwear": ["outerwear_puffer_glossy_forest_green_01"],
			"layer_top": [],
			"top": ["top_tee_long_white_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_track_pants_nylon_forest_green_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_sneakers_chunky_low_white_01"],
			"headwear": ["headwear_balaclava_wrap_white_01"],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"outerwear_puffer_glossy_forest_green_01",
			"top_tee_long_white_01",
			"bottom_track_pants_nylon_forest_green_01",
			"shoes_sneakers_chunky_low_white_01",
			"headwear_balaclava_wrap_white_01"
		],
		"prompt": "bulky glossy forest green nylon puffer jacket with fat baffles, high funnel collar and a small yellow script logo on the chest; plain white long-line cotton crew tee falling past the hips; relaxed forest green nylon track pants matching the jacket; chunky all-white leather low-top court sneakers with a thick cupsole, perforated toe box and white laces; white cotton jersey fabric wrapped tightly around the head as a balaclava, covering head and lower face with only the eyes showing, knotted at the back",
		"negative": ["running sneaker", "thin sole"],
		"source_images": ["I3"],
		"image": "/shots/outfits/outfit_I3_green.jpg",
		"user_created": false
	},
	{
		"id": "outfit_I3_yellow",
		"name": "Yellow Puffer Set",
		"style_tags": [
			"uk_drill",
			"streetwear_90s",
			"sportswear",
			"techwear",
			"y2k_streetwear"
		],
		"slots": {
			"outerwear": ["outerwear_puffer_glossy_mustard_yellow_01"],
			"layer_top": [],
			"top": [],
			"dress_onepiece": [],
			"bottom": ["bottom_puffer_pants_glossy_yellow_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_sneakers_metallic_silver_wave_01"],
			"headwear": ["headwear_balaclava_wrap_white_01"],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": [
			"outerwear_puffer_glossy_mustard_yellow_01",
			"bottom_puffer_pants_glossy_yellow_01",
			"shoes_sneakers_metallic_silver_wave_01",
			"headwear_balaclava_wrap_white_01"
		],
		"prompt": "bulky glossy golden yellow nylon puffer jacket with fat baffles, high collar, elastic cuffs and a small white script chest logo; padded glossy golden yellow nylon puffer pants with elastic ankle cuffs, matching the jacket; sleek metallic silver running sneakers with layered water-ripple wave lines, reflective piping and a full-length visible air sole; white cotton jersey fabric wrapped tightly around the head as a balaclava, covering head and lower face with only the eyes showing, knotted at the back",
		"negative": [],
		"source_images": ["I3"],
		"image": "/shots/outfits/outfit_I3_yellow.jpg",
		"user_created": false
	},
	{
		"id": "outfit_I4",
		"name": "Camo Cargos & Tank",
		"style_tags": [
			"uk_drill",
			"sportswear",
			"streetwear_90s",
			"hip_hop_2000s",
			"minimal_basics"
		],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": ["top_tank_ribbed_heather_gray_01"],
			"dress_onepiece": [],
			"bottom": ["bottom_cargo_pants_camo_nylon_gray_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_sneakers_air_runner_black_01"],
			"headwear": ["headwear_beanie_skull_swoosh_black_01"],
			"eyewear": [],
			"neckwear": [],
			"jewelry": ["jewelry_rings_silver_01", "jewelry_necklace_medallion_gold_01"],
			"bag": [],
			"accessory": ["accessory_watch_digital_black_01"]
		},
		"item_ids": [
			"top_tank_ribbed_heather_gray_01",
			"bottom_cargo_pants_camo_nylon_gray_01",
			"shoes_sneakers_air_runner_black_01",
			"headwear_beanie_skull_swoosh_black_01",
			"jewelry_rings_silver_01",
			"jewelry_necklace_medallion_gold_01",
			"accessory_watch_digital_black_01"
		],
		"prompt": "relaxed heather gray ribbed tank top with a small tonal script logo on the chest; baggy nylon cargo pants in charcoal, gray and white cloud camouflage with cargo pockets and elastic ankles bunching over sneakers; all-black running sneakers with wavy layered side overlays and visible air cushioning; short fitted black knit skull beanie with a small white logo on the cuff; a few chunky silver rings on the fingers; gold chain necklace with a round coin medallion pendant; chunky black matte resin digital sports watch with a wide strap and square face",
		"negative": [],
		"source_images": ["I4"],
		"image": "/shots/outfits/outfit_I4.jpg",
		"user_created": false
	},
	{
		"id": "outfit_I5",
		"name": "Western Flare & Metal-Toe Boot",
		"style_tags": ["luxury_street", "western"],
		"slots": {
			"outerwear": [],
			"layer_top": [],
			"top": [],
			"dress_onepiece": [],
			"bottom": ["bottom_jeans_flare_western_applique_lightwash_01"],
			"belt_waist": [],
			"legwear": [],
			"shoes": ["shoes_cowboy_boots_metal_toe_black_01"],
			"headwear": [],
			"eyewear": [],
			"neckwear": [],
			"jewelry": [],
			"bag": [],
			"accessory": []
		},
		"item_ids": ["bottom_jeans_flare_western_applique_lightwash_01", "shoes_cowboy_boots_metal_toe_black_01"],
		"prompt": "light faded wash bootcut flare jeans covered in raw-edge frayed denim appliqué of western scrolls, flames and stars, long hems breaking over cowboy boots; polished black leather pointed cowboy boots with white decorative western stitching, an engraved silver metal toe cap, and small silver flower and star studs on the stacked heel",
		"negative": [],
		"source_images": ["I5"],
		"image": "/shots/outfits/outfit_I5.jpg",
		"user_created": false
	}
];
var WARDROBE_ITEMS_BY_ID = new Map(WARDROBE_ITEMS.map((item) => [item.id, item]));
var WARDROBE_OUTFITS_BY_ID = new Map(WARDROBE_OUTFITS.map((outfit) => [outfit.id, outfit]));
function applyWardrobeItem(doc, item, slotIndex) {
	let next = doc;
	const basePath = `subjects.${slotIndex}.wardrobe_architecture`;
	const arch = doc.subjects[slotIndex]?.wardrobe_architecture;
	if (!arch) return doc;
	if (item.slot === "outerwear") next = setAt(next, `${basePath}.layering_system.outerwear`, item.prompt);
	else if (item.slot === "layer_top") next = setAt(next, `${basePath}.layering_system.mid_layer`, item.prompt);
	else if (item.slot === "top") {
		const existingBase = arch.layering_system.base_layer.trim();
		if (existingBase.includes("jeans") || existingBase.includes("skirt") || existingBase.includes("pants") || existingBase.includes("shorts")) next = setAt(next, `${basePath}.layering_system.base_layer`, `${item.prompt}; ${existingBase}`);
		else next = setAt(next, `${basePath}.layering_system.base_layer`, item.prompt);
	} else if (item.slot === "bottom") {
		const existingBase = arch.layering_system.base_layer.trim();
		if (existingBase && !existingBase.includes(item.prompt)) next = setAt(next, `${basePath}.layering_system.base_layer`, `${existingBase}; ${item.prompt}`);
		else next = setAt(next, `${basePath}.layering_system.base_layer`, item.prompt);
	} else if (item.slot === "dress_onepiece") next = setAt(next, `${basePath}.layering_system.base_layer`, item.prompt);
	else if (item.slot === "shoes") next = setAt(next, `${basePath}.footwear`, item.prompt);
	else {
		const currentAccessories = arch.accessories ?? [];
		if (!currentAccessories.includes(item.prompt)) next = setAt(next, `${basePath}.accessories`, [...currentAccessories, item.prompt]);
	}
	if (item.materials && item.materials.length > 0) {
		const currentMats = arch.textiles_and_weight.trim();
		const newMats = item.materials.join(", ");
		if (!currentMats) next = setAt(next, `${basePath}.textiles_and_weight`, newMats);
		else if (!currentMats.includes(item.materials[0])) next = setAt(next, `${basePath}.textiles_and_weight`, `${currentMats}, ${newMats}`);
	}
	if (item.details && item.details.length > 0) {
		const currentDetails = arch.hardware_and_details.trim();
		const newDetails = item.details.join("; ");
		if (!currentDetails) next = setAt(next, `${basePath}.hardware_and_details`, newDetails);
		else if (!currentDetails.includes(item.details[0])) next = setAt(next, `${basePath}.hardware_and_details`, `${currentDetails}; ${newDetails}`);
	}
	if (item.negative && item.negative.length > 0) {
		const currentNegs = doc.anti_cliche_exclusions ?? [];
		const mergedNegs = Array.from(/* @__PURE__ */ new Set([...currentNegs, ...item.negative]));
		next = setAt(next, "anti_cliche_exclusions", mergedNegs);
	}
	return next;
}
function applyWardrobeOutfit(doc, outfit, slotIndex) {
	let next = doc;
	const basePath = `subjects.${slotIndex}.wardrobe_architecture`;
	const items = outfit.item_ids.map((id) => WARDROBE_ITEMS_BY_ID.get(id)).filter((i) => Boolean(i));
	const resolvePrompt = (idOrPrompt) => {
		return WARDROBE_ITEMS_BY_ID.get(idOrPrompt)?.prompt || idOrPrompt;
	};
	const outerwearItems = (outfit.slots.outerwear || []).map(resolvePrompt).filter(Boolean);
	next = setAt(next, `${basePath}.layering_system.outerwear`, outerwearItems.join("; "));
	const midItems = (outfit.slots.layer_top || []).map(resolvePrompt).filter(Boolean);
	next = setAt(next, `${basePath}.layering_system.mid_layer`, midItems.join("; "));
	const dressItems = (outfit.slots.dress_onepiece || []).map(resolvePrompt).filter(Boolean);
	if (dressItems.length > 0) next = setAt(next, `${basePath}.layering_system.base_layer`, dressItems.join("; "));
	else {
		const topItems = (outfit.slots.top || []).map(resolvePrompt).filter(Boolean);
		const bottomItems = (outfit.slots.bottom || []).map(resolvePrompt).filter(Boolean);
		const baseJoined = [...topItems, ...bottomItems].join("; ");
		if (baseJoined) next = setAt(next, `${basePath}.layering_system.base_layer`, baseJoined);
		else if (outfit.is_custom && outfit.prompt && !outerwearItems.length && !midItems.length) next = setAt(next, `${basePath}.layering_system.base_layer`, outfit.prompt);
	}
	const shoesItems = (outfit.slots.shoes || []).map(resolvePrompt).filter(Boolean);
	next = setAt(next, `${basePath}.footwear`, shoesItems.join("; "));
	const accessorySlots = [
		"headwear",
		"eyewear",
		"neckwear",
		"jewelry",
		"belt_waist",
		"legwear",
		"bag",
		"accessory"
	];
	const accList = [];
	for (const slotName of accessorySlots) {
		const slotItemIds = outfit.slots[slotName] || [];
		for (const id of slotItemIds) {
			const p = resolvePrompt(id);
			if (p && !accList.includes(p)) accList.push(p);
		}
	}
	next = setAt(next, `${basePath}.accessories`, accList);
	const materials = Array.from(new Set(items.flatMap((i) => i.materials || [])));
	if (materials.length > 0) next = setAt(next, `${basePath}.textiles_and_weight`, materials.join(", "));
	const details = Array.from(new Set(items.flatMap((i) => i.details || [])));
	if (details.length > 0) next = setAt(next, `${basePath}.hardware_and_details`, details.join("; "));
	if (outfit.negative && outfit.negative.length > 0) {
		const currentNegs = doc.anti_cliche_exclusions ?? [];
		const mergedNegs = Array.from(/* @__PURE__ */ new Set([...currentNegs, ...outfit.negative]));
		next = setAt(next, "anti_cliche_exclusions", mergedNegs);
	}
	return next;
}
function isWardrobeOutfitApplied(doc, outfit, slotIndex) {
	const arch = doc.subjects[slotIndex]?.wardrobe_architecture;
	if (!arch) return false;
	const outfitOuter = (outfit.slots.outerwear || []).map((id) => WARDROBE_ITEMS_BY_ID.get(id)?.prompt).filter(Boolean).join("; ");
	if (outfitOuter && arch.layering_system.outerwear !== outfitOuter) return false;
	const outfitShoes = (outfit.slots.shoes || []).map((id) => WARDROBE_ITEMS_BY_ID.get(id)?.prompt).filter(Boolean).join("; ");
	if (outfitShoes && arch.footwear !== outfitShoes) return false;
	const dressItems = (outfit.slots.dress_onepiece || []).map((id) => WARDROBE_ITEMS_BY_ID.get(id)?.prompt).filter(Boolean);
	if (dressItems.length > 0) return arch.layering_system.base_layer === dressItems.join("; ");
	const topItems = (outfit.slots.top || []).map((id) => WARDROBE_ITEMS_BY_ID.get(id)?.prompt).filter(Boolean);
	if (topItems.length > 0 && topItems[0] && !arch.layering_system.base_layer.includes(topItems[0])) return false;
	return true;
}
function filterWardrobeItems(items, query, slot = "all", styleTag) {
	const q = query.trim().toLowerCase();
	return items.filter((item) => {
		if (slot !== "all" && item.slot !== slot) return false;
		if (styleTag && !item.style_tags.includes(styleTag)) return false;
		if (!q) return true;
		return item.name.toLowerCase().includes(q) || item.prompt.toLowerCase().includes(q) || item.subcategory.toLowerCase().includes(q) || item.materials && item.materials.some((m) => m.toLowerCase().includes(q)) || item.colors && item.colors.some((c) => c.toLowerCase().includes(q)) || item.details && item.details.some((d) => d.toLowerCase().includes(q)) || item.style_tags && item.style_tags.some((t) => t.toLowerCase().includes(q));
	});
}
function filterWardrobeOutfits(outfits, query, styleTag) {
	const q = query.trim().toLowerCase();
	return outfits.filter((outfit) => {
		if (styleTag && !outfit.style_tags.includes(styleTag)) return false;
		if (!q) return true;
		return outfit.name.toLowerCase().includes(q) || outfit.prompt.toLowerCase().includes(q) || outfit.style_tags && outfit.style_tags.some((t) => t.toLowerCase().includes(q));
	});
}
/**
* Merge custom items with built-in items, placing custom items at the top
*/
function combineWardrobeItems(builtIn, custom) {
	if (!custom || custom.length === 0) return builtIn;
	const customIds = new Set(custom.map((c) => c.id));
	const filteredBuiltIn = builtIn.filter((b) => !customIds.has(b.id));
	return [...custom, ...filteredBuiltIn];
}
/**
* Merge custom outfits with built-in outfits, placing custom outfits at the top
*/
function combineWardrobeOutfits(builtIn, custom) {
	if (!custom || custom.length === 0) return builtIn;
	const customIds = new Set(custom.map((c) => c.id));
	const filteredBuiltIn = builtIn.filter((b) => !customIds.has(b.id));
	return [...custom, ...filteredBuiltIn];
}
function pose(id, name, posture, adult = false, image, props, category = "modeling", stance = "standing") {
	return {
		id,
		name,
		kind: "pose",
		adult,
		posture,
		image,
		props,
		category,
		stance
	};
}
var RAW_LEGACY = [
	pose("hip-cock", "Hip cock", "Weight on the left leg, right knee soft, one hand on the hip, shoulders dropped, chin level.", false, "/poses/pose_anime_p001.jpg", void 0, "modeling", "standing"),
	pose("pockets", "Hands in pockets", "Standing easy, both hands buried in pockets, weight even, shoulders relaxed.", false, "/poses/pose_model_05.jpg", void 0, "modeling", "standing"),
	pose("crossed", "Arms crossed", "Standing square, arms folded across the chest, weight even, chin level.", false, "/poses/pose_model_08.jpg", void 0, "modeling", "standing"),
	pose("stride", "Mid stride", "Walking toward the lens, one leg reaching, the other trailing, arms in an easy swing.", false, "/poses/pose_model_09.jpg", void 0, "modeling", "dynamic"),
	pose("crossed-sit", "Legs crossed", "Seated, one knee crossed over the other, one arm along the chair back, torso upright.", false, "/poses/pose_3d_03.jpg", ["white posing cube"], "sitting", "sitting"),
	pose("stool", "Forward lean", "Seated on a stool, elbows on the knees, torso hinged forward, eyes up toward the lens.", false, "/poses/pose_3d_05.jpg", ["studio stool"], "sitting", "sitting"),
	pose("shoulder", "Over the shoulder", "Back mostly to the lens, head turned over one shoulder, arms relaxed at the sides.", false, "/poses/pose_model_07.jpg", void 0, "modeling", "standing"),
	pose("hair", "Hands in hair", "Both arms lifted, hands in the hair, elbows wide, weight on one hip.", false, "/poses/pose_model_02.jpg", void 0, "modeling", "standing"),
	pose("kneel", "Kneeling tall", "Upright on both knees, spine long, hands resting on the thighs.", false, "/poses/pose_knight_03.jpg", void 0, "sitting", "kneeling"),
	pose("recline", "Side recline", "Lying on one side, head propped on a hand, the other arm along the body, legs softly bent.", false, "/poses/pose_3d_09.jpg", void 0, "reclining", "reclining"),
	pose("wall", "Wall lean", "One shoulder against a wall, ankles crossed, arms folded low.", false, "/poses/pose_model_05.jpg", void 0, "casual", "standing"),
	pose("crouch", "One knee down", "A low crouch, one knee on the ground, the other foot planted, one forearm across the raised knee.", false, "/poses/pose_action_02.jpg", void 0, "action", "crouching"),
	pose("arched", "Arched stand", "Standing with the back deeply arched, hips pressed forward, both arms raised and hands behind the head, chest lifted.", true, "/poses/pose_3d_02.jpg", void 0, "modeling", "standing"),
	pose("open-seat", "Seated open", "Seated on the floor, knees fallen open, hands planted behind the hips, torso leaned back.", true, "/poses/pose_3d_09.jpg", void 0, "sitting", "sitting"),
	pose("all-fours", "All fours", "On hands and knees, spine long with a slight dip, head turned toward the lens.", true, "/poses/pose_3d_04.jpg", void 0, "reclining", "kneeling"),
	pose("lying-back", "Lying back", "Lying on the back, knees bent and apart, one arm resting above the head.", true, "/poses/pose_3d_07.jpg", void 0, "reclining", "reclining"),
	pose("folded", "Folded forward", "Standing, folded forward at the hips, back flat, hands resting on the thighs.", true, "/poses/pose_3d_01.jpg", ["tall posing block"], "sitting", "standing"),
	pose("knee-up", "Knee raised", "Reclined on one elbow, the far knee raised, the near leg extended.", true, "/poses/pose_3d_09.jpg", void 0, "reclining", "reclining"),
	pose("kneel-arch", "Kneeling arch", "Upright on both knees, back arched, hips forward, hands resting on the thighs.", true, "/poses/pose_3d_04.jpg", void 0, "reclining", "kneeling"),
	pose("leg-up", "Leg up", "Standing on one leg, the other knee lifted and turned out, held at the thigh.", true, "/poses/pose_action_01.jpg", void 0, "action", "dynamic")
];
var POSE_DATABASE_LOOKS = POSE_LIBRARY.map((item) => ({
	id: item.id,
	name: item.name,
	subtitle: item.subtitle,
	kind: "pose",
	category: item.category,
	stance: item.stance,
	adult: item.adult,
	image: item.image,
	posture: item.posture,
	props: item.props,
	tags: item.tags
}));
var CAMERA_DATABASE_LOOKS = CAMERA_LIBRARY.map((item) => ({
	id: item.id,
	name: item.name,
	subtitle: item.subtitle,
	kind: "angle",
	category: item.category,
	badge: item.badge,
	image: item.image,
	principle: item.principle,
	axis: item.axis,
	lens: item.lens,
	dof: item.dof,
	tags: item.tags
}));
var NON_POSE_LOOKS = [
	{
		id: "eye-level",
		name: "Eye level",
		kind: "angle",
		principle: "Square eye-level portrait",
		axis: "eye level, centered, camera square to the subject"
	},
	{
		id: "low-angle",
		name: "Low angle",
		kind: "angle",
		principle: "Worm's-eye upward rake",
		axis: "camera near the floor, tilted up, subject looming"
	},
	{
		id: "high-angle",
		name: "High angle",
		kind: "angle",
		principle: "High-angle downward look",
		axis: "camera above eye line, tilted down, subject smaller in the frame"
	},
	{
		id: "three-quarter",
		name: "Three-quarter",
		kind: "angle",
		principle: "Three-quarter turn",
		axis: "camera 45° off axis, eye level, subject turned toward lens"
	},
	{
		id: "profile",
		name: "Profile",
		kind: "angle",
		principle: "Clean profile",
		axis: "camera at 90°, eye level, subject facing frame-left"
	},
	{
		id: "behind",
		name: "From behind",
		kind: "angle",
		principle: "Over-the-back view",
		axis: "camera directly behind the subject, back to lens"
	},
	{
		id: "warehouse",
		name: "Warehouse",
		kind: "setting",
		location: "empty industrial warehouse with tall concrete ceilings",
		atmosphere: "slight atmospheric haze, cool daylight through dirty skylights",
		props: ["polished concrete floor", "distant steel beams"]
	},
	{
		id: "field",
		name: "Open field",
		kind: "setting",
		location: "windswept open grass field stretching to low horizon",
		atmosphere: "clear golden hour air, gentle breeze rustling vegetation",
		props: ["tall wild grasses", "distant rolling hills"]
	},
	{
		id: "night-street",
		name: "Rainy street",
		kind: "setting",
		location: "urban city street at night immediately after rain",
		atmosphere: "damp air, reflections shimmering in puddles",
		props: [
			"wet asphalt",
			"glowing street lamps",
			"steaming manhole"
		]
	}
];
var WARDROBE_DATABASE_LOOKS = WARDROBE_OUTFITS.map((outfit) => ({
	id: outfit.id,
	name: outfit.name,
	subtitle: `${outfit.item_ids.length} pieces · ${outfit.style_tags.slice(0, 2).map((t) => `#${t.replace(/_/g, " ")}`).join(" ")}`,
	kind: "wardrobe",
	category: "wardrobe",
	badge: "OUTFIT",
	image: outfit.image,
	tags: outfit.style_tags,
	outfitId: outfit.id
}));
var LIGHTING_DATABASE_LOOKS = LIGHTING_LIBRARY.map((item) => ({
	id: item.id,
	name: item.name,
	subtitle: item.subtitle,
	kind: "light",
	category: item.category,
	badge: item.badge,
	image: item.image,
	style: item.style,
	fixture: item.fixture,
	lightAngle: item.angle,
	shadow: item.shadow,
	practical: item.practical,
	tags: item.tags
}));
var seenIds = /* @__PURE__ */ new Set();
var ALL_DRAFTS = [];
for (const draft of [
	...WARDROBE_DATABASE_LOOKS,
	...LIGHTING_DATABASE_LOOKS,
	...CAMERA_DATABASE_LOOKS,
	...RAW_LEGACY,
	...POSE_DATABASE_LOOKS,
	...NON_POSE_LOOKS
]) if (!seenIds.has(draft.id)) {
	seenIds.add(draft.id);
	ALL_DRAFTS.push(draft);
}
var LOOKS = ALL_DRAFTS.map((look) => ({
	...look,
	art: FIGURES[look.id] ?? {
		head: [
			60,
			40,
			10
		],
		limbs: []
	}
}));
var LOOK_FILTERS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "wardrobe",
		label: "Wardrobe"
	},
	{
		id: "angle",
		label: "Camera & Angles"
	},
	{
		id: "knights",
		label: "Knights"
	},
	{
		id: "modeling",
		label: "Photoshoot"
	},
	{
		id: "paintings",
		label: "Fine Art"
	},
	{
		id: "cinematic",
		label: "Cinematic"
	},
	{
		id: "couples",
		label: "Couples & Duos"
	},
	{
		id: "action",
		label: "Action"
	},
	{
		id: "sitting",
		label: "Sitting"
	},
	{
		id: "reclining",
		label: "Floor"
	},
	{
		id: "pose",
		label: "All Poses"
	},
	{
		id: "light",
		label: "Light"
	},
	{
		id: "setting",
		label: "Setting"
	},
	{
		id: "adult",
		label: "Adult"
	}
];
function looksFor(filter) {
	if (filter === "adult") return LOOKS.filter((look) => look.adult);
	if (filter === "pose") return LOOKS.filter((look) => look.kind === "pose" && !look.adult);
	if (filter === "knights") return LOOKS.filter((look) => look.category === "knights");
	if (filter === "modeling") return LOOKS.filter((look) => look.category === "modeling" && !look.adult);
	if (filter === "paintings") return LOOKS.filter((look) => look.category === "paintings");
	if (filter === "cinematic") return LOOKS.filter((look) => look.category === "cinematic");
	if (filter === "couples") return LOOKS.filter((look) => look.category === "couples");
	if (filter === "action") return LOOKS.filter((look) => look.category === "action");
	if (filter === "sitting") return LOOKS.filter((look) => look.category === "sitting" && !look.adult);
	if (filter === "reclining") return LOOKS.filter((look) => look.category === "reclining" && !look.adult);
	if (filter === "wardrobe") return LOOKS.filter((look) => look.kind === "wardrobe");
	if (filter === "all") return LOOKS.filter((look) => !look.adult);
	return LOOKS.filter((look) => look.kind === filter);
}
function customOutfitToLook(outfit) {
	return {
		id: outfit.id,
		name: outfit.name,
		subtitle: `${outfit.item_ids?.length ? `${outfit.item_ids.length} pieces` : "custom outfit"} · ${outfit.style_tags.slice(0, 2).map((t) => `#${t.replace(/_/g, " ")}`).join(" ")}`,
		kind: "wardrobe",
		category: "wardrobe",
		badge: "CUSTOM",
		image: outfit.image,
		tags: outfit.style_tags,
		outfitId: outfit.id,
		customOutfit: outfit,
		art: {
			head: [
				60,
				40,
				10
			],
			limbs: []
		}
	};
}
function applyLook(doc, look, subjectIndex) {
	if (look.kind === "wardrobe" && look.outfitId) {
		const outfit = WARDROBE_OUTFITS_BY_ID.get(look.outfitId) || look.customOutfit;
		if (outfit) return applyWardrobeOutfit(doc, outfit, subjectIndex);
	}
	if (look.kind === "pose") {
		let next = setAt(doc, `subjects.${subjectIndex}.kinetic_posture`, look.posture ?? "");
		if (look.props && look.props.length > 0) {
			const currentProps = doc.scene_composition.environmental_staging.grounded_props ?? [];
			const merged = Array.from(/* @__PURE__ */ new Set([...currentProps, ...look.props]));
			next = setAt(next, "scene_composition.environmental_staging.grounded_props", merged);
		}
		return next;
	}
	if (look.kind === "angle") {
		let next = setAt(doc, "scene_composition.framing_doctrine.named_principle", look.principle ?? "");
		next = setAt(next, "scene_composition.framing_doctrine.camera_elevation_and_axis", look.axis ?? "");
		if (look.lens) next = setAt(next, "aesthetic_dna.optics.lens_type_and_focal_length", look.lens);
		if (look.dof) next = setAt(next, "aesthetic_dna.optics.aperture_and_dof", look.dof);
		return next;
	}
	if (look.kind === "light") {
		let next = setAt(doc, "aesthetic_dna.lighting_architecture.lighting_style", look.style ?? "");
		if (look.fixture) next = setAt(next, "aesthetic_dna.lighting_architecture.key_source.fixture_or_origin", look.fixture);
		if (look.lightAngle) next = setAt(next, "aesthetic_dna.lighting_architecture.key_source.angle_and_elevation", look.lightAngle);
		if (look.shadow) next = setAt(next, "aesthetic_dna.lighting_architecture.fill_and_negative_space.shadow_depth", look.shadow);
		if (look.practical) next = setAt(next, "aesthetic_dna.lighting_architecture.accent_and_practicals.practical_sources", look.practical);
		return next;
	}
	let next = setAt(doc, "scene_composition.environmental_staging.location_context", look.location ?? "");
	next = setAt(next, "scene_composition.environmental_staging.atmosphere_and_air_density", look.atmosphere ?? "");
	return setAt(next, "scene_composition.environmental_staging.grounded_props", look.props ?? []);
}
function lookIsApplied(doc, look, subjectIndex) {
	if (look.kind === "wardrobe" && look.outfitId) {
		const outfit = WARDROBE_OUTFITS_BY_ID.get(look.outfitId) || look.customOutfit;
		if (outfit) return isWardrobeOutfitApplied(doc, outfit, subjectIndex);
	}
	if (look.kind === "pose") return doc.subjects[subjectIndex]?.kinetic_posture === look.posture;
	if (look.kind === "angle") return doc.scene_composition.framing_doctrine.named_principle === look.principle && doc.scene_composition.framing_doctrine.camera_elevation_and_axis === look.axis;
	if (look.kind === "light") return doc.aesthetic_dna.lighting_architecture.lighting_style === look.style && (!look.fixture || doc.aesthetic_dna.lighting_architecture.key_source.fixture_or_origin === look.fixture);
	return doc.scene_composition.environmental_staging.location_context === look.location;
}
function PoseCardVisual({ image, id, name, subtitle, category, stance, badge, active }) {
	if (image) {
		const leftTag = badge || (id ? id.toUpperCase() : null);
		const rightTag = badge ? category || stance : stance || category;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-full w-full overflow-hidden bg-neutral-950",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: name ?? "Visual Preview",
					loading: "lazy",
					className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				}),
				leftTag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute top-2 left-2 rounded bg-black/85 px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider text-amber-400 backdrop-blur-sm",
					children: leftTag
				}),
				rightTag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute top-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300 backdrop-blur-sm capitalize",
					children: rightTag
				}),
				active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 border-2 border-amber-500 bg-amber-500/10 pointer-events-none" })
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 p-3 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mb-2 flex h-20 w-16 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 48 72",
					className: "h-14 w-10 text-neutral-400",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "24",
							cy: "14",
							r: "8",
							stroke: "currentColor",
							fill: "#262626"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "24",
							y1: "6",
							x2: "24",
							y2: "22",
							stroke: "currentColor",
							strokeWidth: "1",
							strokeDasharray: "2 2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "16",
							y1: "14",
							x2: "32",
							y2: "14",
							stroke: "currentColor",
							strokeWidth: "1",
							strokeDasharray: "2 2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M20 22 L28 22 L26 42 L22 42 Z",
							stroke: "currentColor",
							fill: "#262626"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "16",
							cy: "24",
							r: "2.5",
							fill: "currentColor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "32",
							cy: "24",
							r: "2.5",
							fill: "currentColor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "16",
							y1: "24",
							x2: "12",
							y2: "38",
							stroke: "currentColor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "32",
							y1: "24",
							x2: "36",
							y2: "38",
							stroke: "currentColor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "22",
							y1: "42",
							x2: "20",
							y2: "64",
							stroke: "currentColor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "26",
							y1: "42",
							x2: "28",
							y2: "64",
							stroke: "currentColor"
						})
					]
				})
			}),
			id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-mono text-amber-400",
				children: id.toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 line-clamp-1 text-xs font-medium text-neutral-300",
				children: name ?? "Pose"
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "line-clamp-1 text-[10px] text-neutral-500",
				children: subtitle
			})
		]
	});
}
function PoseCatalogModal({ isOpen, onClose, onSelectPose, activePosture }) {
	const [category, setCategory] = (0, import_react.useState)("all");
	const [stance, setStance] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [justAppliedId, setJustAppliedId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		function handleKeyDown(e) {
			if (e.key === "Escape" && isOpen) onClose();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);
	(0, import_react.useEffect)(() => {
		if (isOpen) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);
	const categoryCounts = (0, import_react.useMemo)(() => {
		const counts = { all: POSE_LIBRARY.length };
		for (const pose of POSE_LIBRARY) counts[pose.category] = (counts[pose.category] || 0) + 1;
		return counts;
	}, []);
	const filteredPoses = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return POSE_LIBRARY.filter((pose) => {
			if (category !== "all" && pose.category !== category) return false;
			if (stance !== "all" && pose.stance !== stance) return false;
			if (!q) return true;
			return pose.name.toLowerCase().includes(q) || pose.subtitle && pose.subtitle.toLowerCase().includes(q) || pose.posture.toLowerCase().includes(q) || pose.id.toLowerCase().includes(q) || pose.tags.some((t) => t.toLowerCase().includes(q));
		});
	}, [
		category,
		stance,
		query
	]);
	const handlePick = (pose) => {
		onSelectPose(pose);
		setJustAppliedId(pose.id);
		setTimeout(() => {
			setJustAppliedId((cur) => cur === pose.id ? null : cur);
		}, 2e3);
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "dialog",
		"aria-modal": "true",
		className: "fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold text-white tracking-wide",
							children: "Pose Reference Gallery"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-neutral-400",
							children: "Select any pose to instantly inject studio-grade kinetic posture into your prompt"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-6 max-w-md flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search poses by keyword, subject, ID (e.g. sword, stool, S-curve)...",
								className: "w-full rounded-full border border-neutral-800 bg-neutral-900/90 py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500",
								autoFocus: true
							}),
							query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setQuery(""),
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white",
						title: "Close (Esc)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 border-b border-neutral-800/80 bg-neutral-950/80 px-6 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: POSE_CATEGORIES.map((cat) => {
						const count = categoryCounts[cat.id] ?? 0;
						const isSelected = category === cat.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCategory(cat.id),
							className: `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${isSelected ? "bg-amber-500 text-black shadow-sm font-semibold" : "border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700 hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-1.5 py-0.2 text-[10px] ${isSelected ? "bg-black/20 text-black" : "bg-neutral-800 text-neutral-400"}`,
								children: count
							})]
						}, cat.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 overflow-x-auto pb-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 text-neutral-500 font-mono text-[11px] uppercase tracking-wider",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3 w-3" }), " Stance:"]
						}), POSE_STANCES.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setStance(st.id),
							className: `rounded px-2.5 py-1 text-xs transition-colors ${stance === st.id ? "bg-neutral-800 text-amber-400 font-medium" : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"}`,
							children: st.label
						}, st.id))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs font-mono text-neutral-400 shrink-0",
						children: [
							"Showing ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-amber-400",
								children: filteredPoses.length
							}),
							" poses"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto p-6",
				children: filteredPoses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-64 flex-col items-center justify-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mb-2 h-8 w-8 text-neutral-600" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-neutral-400",
							children: "No poses match your search filter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setQuery("");
								setCategory("all");
								setStance("all");
							},
							className: "mt-3 text-xs text-amber-400 underline hover:text-amber-300",
							children: "Reset all filters"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
					children: filteredPoses.map((pose) => {
						const isApplied = activePosture === pose.posture;
						const justApplied = justAppliedId === pose.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handlePick(pose),
							className: `group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${isApplied ? "border-amber-500 ring-2 ring-amber-500/50 bg-neutral-900" : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "aspect-[4/5] w-full bg-neutral-950",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoseCardVisual, {
									image: pose.image,
									id: pose.id,
									name: pose.name,
									subtitle: pose.subtitle,
									category: pose.category,
									stance: pose.stance,
									active: isApplied
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col justify-between p-3 bg-neutral-900/90",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "line-clamp-1 text-xs font-bold text-white group-hover:text-amber-400",
											children: pose.name
										}), isApplied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500 text-black",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-2.5 w-2.5 stroke-[3]" })
										}) : null]
									}), pose.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 line-clamp-1 text-[11px] text-neutral-400",
										children: pose.subtitle
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 border-t border-neutral-800/80 pt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "line-clamp-2 text-[10px] text-neutral-400 leading-relaxed font-sans",
											children: pose.posture
										})
									}),
									justApplied && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-x-0 bottom-0 flex items-center justify-center bg-amber-500 py-1 text-[11px] font-bold text-black animate-in slide-in-from-bottom-2",
										children: "Applied to Prompt!"
									})
								]
							})]
						}, pose.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-2.5 text-xs text-neutral-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Tip: Clicking any pose card immediately writes its kinetic description into your prompt JSON." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-lg bg-neutral-900 px-4 py-1.5 font-medium text-white hover:bg-neutral-800 border border-neutral-800",
					children: "Done Browsing"
				})]
			})
		]
	});
}
function CameraCatalogModal({ isOpen, onClose, onSelectCamera, activePrinciple }) {
	const [category, setCategory] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [justAppliedId, setJustAppliedId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		function handleKeyDown(e) {
			if (e.key === "Escape" && isOpen) onClose();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);
	(0, import_react.useEffect)(() => {
		if (isOpen) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);
	const categoryCounts = (0, import_react.useMemo)(() => {
		const counts = { all: CAMERA_LIBRARY.length };
		for (const item of CAMERA_LIBRARY) counts[item.category] = (counts[item.category] || 0) + 1;
		return counts;
	}, []);
	const filteredItems = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return CAMERA_LIBRARY.filter((item) => {
			if (category !== "all" && item.category !== category) return false;
			if (!q) return true;
			return item.name.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.principle.toLowerCase().includes(q) || item.axis.toLowerCase().includes(q) || item.badge.toLowerCase().includes(q) || item.id.toLowerCase().includes(q) || item.tags.some((t) => t.toLowerCase().includes(q));
		});
	}, [category, query]);
	const handlePick = (item) => {
		onSelectCamera(item);
		setJustAppliedId(item.id);
		setTimeout(() => {
			setJustAppliedId((cur) => cur === item.id ? null : cur);
		}, 2e3);
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "dialog",
		"aria-modal": "true",
		className: "fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold tracking-tight text-white",
								children: "Camera & Optics Reference Gallery"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-400 border border-emerald-500/30",
								children: "27 Benchmark Angles"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-neutral-400",
							children: "Benchmark angles, elevations, and focal lengths illustrated on botanical monstera reference"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-80 max-w-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search angles (e.g. worm, dutch, 85mm, macro)...",
								className: "w-full rounded-full border border-neutral-800 bg-neutral-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
							}),
							query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setQuery(""),
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white",
						title: "Close (Esc)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 border-b border-neutral-800/80 bg-neutral-950/80 px-6 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: CAMERA_CATEGORIES.map((cat) => {
						const count = categoryCounts[cat.id] ?? 0;
						const isSelected = category === cat.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCategory(cat.id),
							className: `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${isSelected ? "bg-emerald-500 text-black shadow-sm font-semibold" : "border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700 hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-1.5 py-0.2 text-[10px] ${isSelected ? "bg-black/20 text-black" : "bg-neutral-800 text-neutral-400"}`,
								children: count
							})]
						}, cat.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center justify-between text-xs text-neutral-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3 w-3 text-neutral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select any card to instantly update camera framing, elevation, and optics in your prompt" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[11px] text-neutral-500",
						children: [
							"Showing ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-white",
								children: filteredItems.length
							}),
							" angles"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto p-6",
				children: filteredItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-64 flex-col items-center justify-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-8 w-8 text-neutral-600 mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-neutral-300",
							children: "No camera angles match your search"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-neutral-500",
							children: "Try searching for \"low\", \"dutch\", \"macro\", or \"50mm\""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setQuery("");
								setCategory("all");
							},
							className: "mt-4 rounded-full border border-neutral-700 bg-neutral-800 px-4 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700",
							children: "Reset Filters"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7",
					children: filteredItems.map((item) => {
						const isApplied = activePrinciple === item.principle;
						const justApplied = justAppliedId === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handlePick(item),
							className: `group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${justApplied ? "border-emerald-500 bg-neutral-900 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/50" : isApplied ? "border-emerald-500/80 bg-neutral-900/90 ring-1 ring-emerald-500/40" : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/80"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-square w-full overflow-hidden bg-neutral-950",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: item.image,
										alt: item.name,
										loading: "lazy",
										className: "h-full w-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute top-2 left-2 rounded bg-black/85 px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider text-emerald-400 backdrop-blur-sm shadow-sm border border-emerald-500/20",
										children: item.badge
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute top-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300 backdrop-blur-sm",
										children: item.category === "elevations" ? "Elevation" : item.category === "framings" ? "Framing" : "Optics"
									}),
									(isApplied || justApplied) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 border-2 border-emerald-500 bg-emerald-500/10 pointer-events-none" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "line-clamp-1 text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors",
											children: item.name
										}), (isApplied || justApplied) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex shrink-0 items-center text-emerald-400",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 line-clamp-1 text-[11px] text-neutral-400",
										children: item.subtitle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex-1 rounded bg-black/40 p-1.5 text-[10px] text-neutral-300 border border-neutral-800/60 font-mono",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "line-clamp-2 italic leading-relaxed text-neutral-300",
											children: [
												"\"",
												item.axis,
												"\""
											]
										})
									}),
									item.lens && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-center gap-1 text-[10px] text-emerald-400/90 font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-neutral-500",
											children: "Optics:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "line-clamp-1",
											children: item.lens
										})]
									}),
									justApplied && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 rounded bg-emerald-500 py-1 text-center text-[10px] font-bold text-black animate-in fade-in duration-150",
										children: "Applied to Prompt!"
									})
								]
							})]
						}, item.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-3 text-xs text-neutral-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tip: Camera angles update both framing principle and exact elevation axis in your prompt JSON." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-lg bg-neutral-800 px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-700",
					children: "Done Browsing"
				})]
			})
		]
	});
}
function LightingCatalogModal({ isOpen, onClose, onSelectLighting, activeStyle }) {
	const [category, setCategory] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [justAppliedId, setJustAppliedId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		function handleKeyDown(e) {
			if (e.key === "Escape" && isOpen) onClose();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);
	(0, import_react.useEffect)(() => {
		if (isOpen) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);
	const categoryCounts = (0, import_react.useMemo)(() => {
		const counts = { all: LIGHTING_LIBRARY.length };
		for (const item of LIGHTING_LIBRARY) counts[item.category] = (counts[item.category] || 0) + 1;
		return counts;
	}, []);
	const filteredItems = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return LIGHTING_LIBRARY.filter((item) => {
			if (category !== "all" && item.category !== category) return false;
			if (!q) return true;
			return item.name.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.style.toLowerCase().includes(q) || item.fixture.toLowerCase().includes(q) || item.angle.toLowerCase().includes(q) || item.badge.toLowerCase().includes(q) || item.id.toLowerCase().includes(q) || item.tags.some((t) => t.toLowerCase().includes(q));
		});
	}, [category, query]);
	const handlePick = (item) => {
		onSelectLighting(item);
		setJustAppliedId(item.id);
		setTimeout(() => {
			setJustAppliedId((cur) => cur === item.id ? null : cur);
		}, 2e3);
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "dialog",
		"aria-modal": "true",
		className: "fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SunMedium, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold tracking-tight text-white",
								children: "Visual Lighting Studio"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-amber-400 border border-amber-500/30",
								children: "27 Benchmark Setups"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-neutral-400",
							children: "Benchmark portrait & cinematic lighting illustrated on classical Roman matte plaster bust reference"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-80 max-w-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search lighting (e.g. rembrandt, chiaroscuro, neon, noir)...",
								className: "w-full rounded-full border border-neutral-800 bg-neutral-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
							}),
							query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setQuery(""),
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white",
						title: "Close (Esc)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 border-b border-neutral-800/80 bg-neutral-950/80 px-6 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: LIGHTING_CATEGORIES.map((cat) => {
						const count = categoryCounts[cat.id] ?? 0;
						const isSelected = category === cat.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCategory(cat.id),
							className: `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${isSelected ? "bg-amber-400 text-black shadow-sm font-semibold" : "border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700 hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-1.5 py-0.2 text-[10px] ${isSelected ? "bg-black/20 text-black" : "bg-neutral-800 text-neutral-400"}`,
								children: count
							})]
						}, cat.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center justify-between text-xs text-neutral-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3 w-3 text-neutral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select any card to instantly apply lighting style, key fixtures, angles, and shadow contrast to your prompt" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[11px] text-neutral-500",
						children: [
							"Showing ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-white",
								children: filteredItems.length
							}),
							" setups"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto p-6",
				children: filteredItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-64 flex-col items-center justify-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-8 w-8 text-neutral-600 mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-neutral-300",
							children: "No lighting setups match your search"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-neutral-500",
							children: "Try searching for \"rembrandt\", \"noir\", \"volumetric\", or \"golden\""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setQuery("");
								setCategory("all");
							},
							className: "mt-4 rounded-full border border-neutral-700 bg-neutral-800 px-4 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700",
							children: "Reset Filters"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7",
					children: filteredItems.map((item) => {
						const isApplied = activeStyle === item.style;
						const justApplied = justAppliedId === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handlePick(item),
							className: `group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${justApplied ? "border-amber-400 bg-neutral-900 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50" : isApplied ? "border-amber-400/80 bg-neutral-900/90 ring-1 ring-amber-400/40" : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/80"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-square w-full overflow-hidden bg-neutral-950",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: item.image,
										alt: item.name,
										loading: "lazy",
										className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute top-2 left-2 rounded bg-black/85 px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider text-amber-400 backdrop-blur-sm shadow-sm border border-amber-500/20",
										children: item.badge
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute top-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300 backdrop-blur-sm",
										children: item.category === "studio" ? "Studio" : item.category === "cinematic" ? "Cinematic" : "Atmosphere"
									}),
									(isApplied || justApplied) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 border-2 border-amber-400 bg-amber-400/10 pointer-events-none" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "line-clamp-1 text-xs font-semibold text-white group-hover:text-amber-400 transition-colors",
											children: item.name
										}), (isApplied || justApplied) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex shrink-0 items-center text-amber-400",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 line-clamp-1 text-[11px] text-neutral-400",
										children: item.subtitle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex-1 rounded bg-black/40 p-1.5 text-[10px] text-neutral-300 border border-neutral-800/60 font-mono",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "line-clamp-2 italic leading-relaxed text-neutral-300",
											children: [
												"\"",
												item.style,
												"\""
											]
										})
									}),
									item.fixture && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-center gap-1 text-[10px] text-amber-400/90 font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-neutral-500",
											children: "Fixture:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "line-clamp-1",
											children: item.fixture
										})]
									}),
									justApplied && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 rounded bg-amber-400 py-1 text-center text-[10px] font-bold text-black animate-in fade-in duration-150",
										children: "Applied to Lighting Style!"
									})
								]
							})]
						}, item.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-3 text-xs text-neutral-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tip: Lighting setups update lighting style, key fixtures, angles, and shadow depth in your prompt JSON." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-lg bg-neutral-800 px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-700",
					children: "Done Browsing"
				})]
			})
		]
	});
}
var DB_NAME$1 = "prompt_forge_custom_library";
var DB_VERSION = 1;
var STORE_ITEMS = "items";
var STORE_OUTFITS = "outfits";
var LOCAL_STORAGE_ITEMS_KEY = "prompt-forge:custom-items:v1";
var LOCAL_STORAGE_OUTFITS_KEY = "prompt-forge:custom-outfits:v1";
var CUSTOM_LIBRARY_CHANGE_EVENT = "prompt-forge:custom-library-changed";
var memoryItemsCache = null;
var memoryOutfitsCache = null;
function getIndexedDB() {
	if (typeof window === "undefined") return null;
	return window.indexedDB || null;
}
function openDB() {
	const idb = getIndexedDB();
	if (!idb) return Promise.resolve(null);
	return new Promise((resolve) => {
		try {
			const request = idb.open(DB_NAME$1, DB_VERSION);
			request.onupgradeneeded = (e) => {
				const db = e.target.result;
				if (!db.objectStoreNames.contains(STORE_ITEMS)) db.createObjectStore(STORE_ITEMS, { keyPath: "id" });
				if (!db.objectStoreNames.contains(STORE_OUTFITS)) db.createObjectStore(STORE_OUTFITS, { keyPath: "id" });
			};
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => {
				console.warn("IndexedDB open failed, falling back to localStorage", request.error);
				resolve(null);
			};
		} catch (err) {
			console.warn("IndexedDB error:", err);
			resolve(null);
		}
	});
}
function readLocalStorage(key) {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function writeLocalStorage(key, data) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(key, JSON.stringify(data));
	} catch (e) {
		console.warn("localStorage write failed (quota exceeded?):", e);
	}
}
function notifyChange() {
	if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(CUSTOM_LIBRARY_CHANGE_EVENT));
}
/**
* Load all custom items from IndexedDB (or fallback cache)
*/
async function loadCustomItems() {
	if (memoryItemsCache) return memoryItemsCache;
	const db = await openDB();
	if (!db) {
		memoryItemsCache = readLocalStorage(LOCAL_STORAGE_ITEMS_KEY);
		return memoryItemsCache;
	}
	return new Promise((resolve) => {
		try {
			const req = db.transaction(STORE_ITEMS, "readonly").objectStore(STORE_ITEMS).getAll();
			req.onsuccess = () => {
				const items = req.result || [];
				memoryItemsCache = items;
				resolve(items);
			};
			req.onerror = () => {
				memoryItemsCache = readLocalStorage(LOCAL_STORAGE_ITEMS_KEY);
				resolve(memoryItemsCache);
			};
		} catch {
			memoryItemsCache = readLocalStorage(LOCAL_STORAGE_ITEMS_KEY);
			resolve(memoryItemsCache);
		}
	});
}
/**
* Load all custom outfits from IndexedDB (or fallback cache)
*/
async function loadCustomOutfits() {
	if (memoryOutfitsCache) return memoryOutfitsCache;
	const db = await openDB();
	if (!db) {
		memoryOutfitsCache = readLocalStorage(LOCAL_STORAGE_OUTFITS_KEY);
		return memoryOutfitsCache;
	}
	return new Promise((resolve) => {
		try {
			const req = db.transaction(STORE_OUTFITS, "readonly").objectStore(STORE_OUTFITS).getAll();
			req.onsuccess = () => {
				const outfits = req.result || [];
				memoryOutfitsCache = outfits;
				resolve(outfits);
			};
			req.onerror = () => {
				memoryOutfitsCache = readLocalStorage(LOCAL_STORAGE_OUTFITS_KEY);
				resolve(memoryOutfitsCache);
			};
		} catch {
			memoryOutfitsCache = readLocalStorage(LOCAL_STORAGE_OUTFITS_KEY);
			resolve(memoryOutfitsCache);
		}
	});
}
/**
* Save or update a custom wardrobe item
*/
async function saveCustomItem(item) {
	const customItem = {
		...item,
		is_custom: true,
		created_at: item.created_at || Date.now()
	};
	const db = await openDB();
	if (db) await new Promise((resolve, reject) => {
		try {
			const req = db.transaction(STORE_ITEMS, "readwrite").objectStore(STORE_ITEMS).put(customItem);
			req.onsuccess = () => resolve();
			req.onerror = () => reject(req.error);
		} catch (err) {
			reject(err);
		}
	});
	memoryItemsCache = [customItem, ...(await loadCustomItems()).filter((i) => i.id !== customItem.id)];
	try {
		writeLocalStorage(LOCAL_STORAGE_ITEMS_KEY, memoryItemsCache);
	} catch {}
	notifyChange();
}
/**
* Delete a custom wardrobe item
*/
async function deleteCustomItem(id) {
	const db = await openDB();
	if (db) await new Promise((resolve, reject) => {
		try {
			const req = db.transaction(STORE_ITEMS, "readwrite").objectStore(STORE_ITEMS).delete(id);
			req.onsuccess = () => resolve();
			req.onerror = () => reject(req.error);
		} catch (err) {
			reject(err);
		}
	});
	memoryItemsCache = (await loadCustomItems()).filter((i) => i.id !== id);
	writeLocalStorage(LOCAL_STORAGE_ITEMS_KEY, memoryItemsCache);
	notifyChange();
}
/**
* Save or update a custom wardrobe outfit
*/
async function saveCustomOutfit(outfit) {
	const customOutfit = {
		...outfit,
		is_custom: true,
		created_at: outfit.created_at || Date.now()
	};
	const db = await openDB();
	if (db) await new Promise((resolve, reject) => {
		try {
			const req = db.transaction(STORE_OUTFITS, "readwrite").objectStore(STORE_OUTFITS).put(customOutfit);
			req.onsuccess = () => resolve();
			req.onerror = () => reject(req.error);
		} catch (err) {
			reject(err);
		}
	});
	memoryOutfitsCache = [customOutfit, ...(await loadCustomOutfits()).filter((o) => o.id !== customOutfit.id)];
	try {
		writeLocalStorage(LOCAL_STORAGE_OUTFITS_KEY, memoryOutfitsCache);
	} catch {}
	notifyChange();
}
/**
* Delete a custom wardrobe outfit
*/
async function deleteCustomOutfit(id) {
	const db = await openDB();
	if (db) await new Promise((resolve, reject) => {
		try {
			const req = db.transaction(STORE_OUTFITS, "readwrite").objectStore(STORE_OUTFITS).delete(id);
			req.onsuccess = () => resolve();
			req.onerror = () => reject(req.error);
		} catch (err) {
			reject(err);
		}
	});
	memoryOutfitsCache = (await loadCustomOutfits()).filter((o) => o.id !== id);
	writeLocalStorage(LOCAL_STORAGE_OUTFITS_KEY, memoryOutfitsCache);
	notifyChange();
}
/**
* Export all user-added library items & outfits to formatted JSON
*/
async function exportCustomLibraryJson() {
	const items = await loadCustomItems();
	const outfits = await loadCustomOutfits();
	const exportData = {
		version: "1.0",
		exported_at: (/* @__PURE__ */ new Date()).toISOString(),
		items,
		outfits
	};
	return JSON.stringify(exportData, null, 2);
}
/**
* Import custom library items & outfits from a JSON string
*/
async function importCustomLibraryJson(jsonStr) {
	let parsed;
	try {
		parsed = JSON.parse(jsonStr);
	} catch {
		throw new Error("Invalid JSON format. Please check the file contents.");
	}
	if (!parsed || typeof parsed !== "object") throw new Error("Invalid library format. Expected an object with items and/or outfits.");
	const record = parsed;
	let importedItems = 0;
	let importedOutfits = 0;
	if (Array.isArray(record.items)) {
		for (const rawItem of record.items) if (rawItem && typeof rawItem === "object" && "name" in rawItem && "prompt" in rawItem) {
			const item = rawItem;
			await saveCustomItem({
				id: item.id || `custom_item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
				name: String(item.name).trim(),
				slot: item.slot || "outerwear",
				subcategory: String(item.subcategory || "custom").trim(),
				style_tags: Array.isArray(item.style_tags) ? item.style_tags.map(String) : ["custom"],
				colors: Array.isArray(item.colors) ? item.colors.map(String) : [],
				materials: Array.isArray(item.materials) ? item.materials.map(String) : [],
				prompt: String(item.prompt).trim(),
				image: String(item.image || ""),
				is_custom: true,
				created_at: typeof item.created_at === "number" ? item.created_at : Date.now()
			});
			importedItems++;
		}
	}
	if (Array.isArray(record.outfits)) {
		for (const rawOutfit of record.outfits) if (rawOutfit && typeof rawOutfit === "object" && "name" in rawOutfit && "prompt" in rawOutfit) {
			const outfit = rawOutfit;
			await saveCustomOutfit({
				id: outfit.id || `custom_outfit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
				name: String(outfit.name).trim(),
				style_tags: Array.isArray(outfit.style_tags) ? outfit.style_tags.map(String) : ["custom"],
				slots: outfit.slots && typeof outfit.slots === "object" ? outfit.slots : {
					outerwear: [],
					layer_top: [],
					top: [],
					dress_onepiece: [],
					bottom: [],
					belt_waist: [],
					legwear: [],
					shoes: [],
					headwear: [],
					eyewear: [],
					neckwear: [],
					jewelry: [],
					bag: [],
					accessory: []
				},
				item_ids: Array.isArray(outfit.item_ids) ? outfit.item_ids.map(String) : [],
				prompt: String(outfit.prompt).trim(),
				image: String(outfit.image || ""),
				is_custom: true,
				created_at: typeof outfit.created_at === "number" ? outfit.created_at : Date.now()
			});
			importedOutfits++;
		}
	}
	return {
		itemsCount: importedItems,
		outfitsCount: importedOutfits
	};
}
/**
* Image processing helper:
* Resizes an image File/Blob to a maximum dimension (e.g. 1000px) and outputs a WebP/JPEG data URL.
*/
async function optimizeReferenceImage(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				const maxDim = 1e3;
				let width = img.naturalWidth || img.width;
				let height = img.naturalHeight || img.height;
				if (width > maxDim || height > maxDim) {
					if (width > height) {
						height = Math.round(height * maxDim / width);
						width = maxDim;
					} else {
						width = Math.round(width * maxDim / height);
						height = maxDim;
					}
				}
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					resolve(e.target?.result);
					return;
				}
				ctx.fillStyle = "#ffffff";
				ctx.fillRect(0, 0, width, height);
				ctx.drawImage(img, 0, 0, width, height);
				let dataUrl = canvas.toDataURL("image/webp", .88);
				if (!dataUrl.startsWith("data:image/webp")) dataUrl = canvas.toDataURL("image/jpeg", .88);
				resolve(dataUrl);
			};
			img.onerror = () => reject(/* @__PURE__ */ new Error("Failed to load image file"));
			img.src = e.target?.result;
		};
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Failed to read file"));
		reader.readAsDataURL(file);
	});
}
var POPULAR_STYLE_TAGS = [
	"streetwear_90s",
	"y2k",
	"minimal_basics",
	"vintage_romantic",
	"coquette",
	"cyberpunk",
	"grunge",
	"techwear",
	"gothic_lolita",
	"dark_academia",
	"french_casual",
	"preppy"
];
function AddLibraryItemModal({ isOpen, onClose, onSaved, initialType = "item" }) {
	const [itemType, setItemType] = (0, import_react.useState)(initialType);
	const [editorMode, setEditorMode] = (0, import_react.useState)("form");
	const [name, setName] = (0, import_react.useState)("");
	const [slot, setSlot] = (0, import_react.useState)("outerwear");
	const [subcategory, setSubcategory] = (0, import_react.useState)("");
	const [colors, setColors] = (0, import_react.useState)("");
	const [materials, setMaterials] = (0, import_react.useState)("");
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [selectedTags, setSelectedTags] = (0, import_react.useState)(["custom"]);
	const [customTagInput, setCustomTagInput] = (0, import_react.useState)("");
	const [imageDataUrl, setImageDataUrl] = (0, import_react.useState)("");
	const [imageFileName, setImageFileName] = (0, import_react.useState)("");
	const [outfitOuterwear, setOutfitOuterwear] = (0, import_react.useState)("");
	const [outfitBaseLayer, setOutfitBaseLayer] = (0, import_react.useState)("");
	const [outfitFootwear, setOutfitFootwear] = (0, import_react.useState)("");
	const [outfitAccessories, setOutfitAccessories] = (0, import_react.useState)("");
	const [jsonText, setJsonText] = (0, import_react.useState)("");
	const [jsonError, setJsonError] = (0, import_react.useState)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [isProcessingImage, setIsProcessingImage] = (0, import_react.useState)(false);
	const [statusMsg, setStatusMsg] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const importFileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function handleKeyDown(e) {
			if (e.key === "Escape" && isOpen) onClose();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);
	(0, import_react.useEffect)(() => {
		if (editorMode === "json") {
			if (itemType === "item") {
				const itemObj = {
					name: name || "Custom Garment",
					slot,
					subcategory: subcategory || "piece",
					style_tags: selectedTags,
					colors: colors ? colors.split(",").map((c) => c.trim()).filter(Boolean) : [],
					materials: materials ? materials.split(",").map((m) => m.trim()).filter(Boolean) : [],
					prompt: prompt || "",
					image: imageDataUrl || ""
				};
				setJsonText(JSON.stringify(itemObj, null, 2));
			} else {
				const outfitObj = {
					name: name || "Custom Outfit Look",
					style_tags: selectedTags,
					slots: {
						outerwear: outfitOuterwear ? [outfitOuterwear] : [],
						layer_top: [],
						top: [],
						dress_onepiece: [],
						bottom: [],
						belt_waist: [],
						legwear: [],
						shoes: outfitFootwear ? [outfitFootwear] : [],
						headwear: [],
						eyewear: [],
						neckwear: [],
						jewelry: [],
						bag: [],
						accessory: outfitAccessories ? [outfitAccessories] : []
					},
					prompt: prompt || `${outfitOuterwear ? outfitOuterwear + "; " : ""}${outfitBaseLayer || ""}`,
					image: imageDataUrl || ""
				};
				setJsonText(JSON.stringify(outfitObj, null, 2));
			}
			setJsonError(null);
		}
	}, [
		editorMode,
		itemType,
		name,
		slot,
		subcategory,
		colors,
		materials,
		prompt,
		selectedTags,
		imageDataUrl,
		outfitOuterwear,
		outfitBaseLayer,
		outfitFootwear,
		outfitAccessories
	]);
	if (!isOpen) return null;
	async function handleFileSelected(file) {
		if (!file.type.startsWith("image/")) {
			setStatusMsg({
				type: "error",
				text: "Please select an image file (PNG, JPG, WEBP)."
			});
			return;
		}
		try {
			setIsProcessingImage(true);
			setImageFileName(file.name);
			const optimized = await optimizeReferenceImage(file);
			setImageDataUrl(optimized);
			setStatusMsg({
				type: "success",
				text: `Loaded image "${file.name}"`
			});
		} catch {
			setStatusMsg({
				type: "error",
				text: "Failed to process image file."
			});
		} finally {
			setIsProcessingImage(false);
		}
	}
	function handleDragOver(e) {
		e.preventDefault();
		setIsDragging(true);
	}
	function handleDragLeave() {
		setIsDragging(false);
	}
	function handleDrop(e) {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (file) handleFileSelected(file);
	}
	function handleJsonChange(text) {
		setJsonText(text);
		try {
			const parsed = JSON.parse(text);
			setJsonError(null);
			if (parsed.name) setName(parsed.name);
			if (parsed.prompt) setPrompt(parsed.prompt);
			if (parsed.slot) setSlot(parsed.slot);
			if (parsed.subcategory) setSubcategory(parsed.subcategory);
			if (Array.isArray(parsed.style_tags)) setSelectedTags(parsed.style_tags);
			if (Array.isArray(parsed.colors)) setColors(parsed.colors.join(", "));
			if (Array.isArray(parsed.materials)) setMaterials(parsed.materials.join(", "));
			if (parsed.image) setImageDataUrl(parsed.image);
		} catch (err) {
			setJsonError(err.message || "Invalid JSON syntax");
		}
	}
	function toggleTag(tagKey) {
		if (selectedTags.includes(tagKey)) setSelectedTags(selectedTags.filter((t) => t !== tagKey));
		else setSelectedTags([...selectedTags, tagKey]);
	}
	function addCustomTag() {
		const clean = customTagInput.trim().toLowerCase().replace(/\s+/g, "_");
		if (clean && !selectedTags.includes(clean)) {
			setSelectedTags([...selectedTags, clean]);
			setCustomTagInput("");
		}
	}
	async function handleSave() {
		if (!name.trim()) {
			setStatusMsg({
				type: "error",
				text: "Please enter a name for this library entry."
			});
			return;
		}
		if (!prompt.trim() && editorMode === "form") {
			setStatusMsg({
				type: "error",
				text: "Please provide a prompt description that translates to the AI generator."
			});
			return;
		}
		if (!imageDataUrl) {
			setStatusMsg({
				type: "error",
				text: "Please upload or drop a reference image for this piece."
			});
			return;
		}
		const idSuffix = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		try {
			if (itemType === "item") {
				const newItem = {
					id: `custom_item_${idSuffix}`,
					name: name.trim(),
					slot,
					subcategory: subcategory.trim() || slot,
					style_tags: selectedTags.length ? selectedTags : ["custom"],
					colors: colors ? colors.split(",").map((c) => c.trim()).filter(Boolean) : [],
					materials: materials ? materials.split(",").map((m) => m.trim()).filter(Boolean) : [],
					prompt: prompt.trim(),
					image: imageDataUrl,
					is_custom: true,
					created_at: Date.now()
				};
				await saveCustomItem(newItem);
				onSaved(newItem.name, "item");
			} else {
				const slotsRecord = {
					outerwear: outfitOuterwear.trim() ? [outfitOuterwear.trim()] : [],
					layer_top: [],
					top: [],
					dress_onepiece: [],
					bottom: [],
					belt_waist: [],
					legwear: [],
					shoes: outfitFootwear.trim() ? [outfitFootwear.trim()] : [],
					headwear: [],
					eyewear: [],
					neckwear: [],
					jewelry: [],
					bag: [],
					accessory: outfitAccessories.trim() ? [outfitAccessories.trim()] : []
				};
				const newOutfit = {
					id: `custom_outfit_${idSuffix}`,
					name: name.trim(),
					style_tags: selectedTags.length ? selectedTags : ["custom"],
					slots: slotsRecord,
					item_ids: [],
					prompt: prompt.trim() || `${outfitOuterwear ? outfitOuterwear + "; " : ""}${outfitBaseLayer || ""}`,
					image: imageDataUrl,
					is_custom: true,
					created_at: Date.now()
				};
				await saveCustomOutfit(newOutfit);
				onSaved(newOutfit.name, "outfit");
			}
			onClose();
		} catch {
			setStatusMsg({
				type: "error",
				text: "Failed to save item to local storage."
			});
		}
	}
	async function handleExport() {
		try {
			const json = await exportCustomLibraryJson();
			const blob = new Blob([json], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `prompt-forge-custom-library-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
			a.click();
			URL.revokeObjectURL(url);
			setStatusMsg({
				type: "success",
				text: "Exported custom library JSON file."
			});
		} catch {
			setStatusMsg({
				type: "error",
				text: "Export failed."
			});
		}
	}
	function handleImportClick() {
		importFileRef.current?.click();
	}
	async function handleImportFile(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const res = await importCustomLibraryJson(await file.text());
			setStatusMsg({
				type: "success",
				text: `Imported ${res.itemsCount} piece(s) and ${res.outfitsCount} outfit(s)!`
			});
			onSaved(`Imported ${res.itemsCount + res.outfitsCount} items`, "item");
		} catch (err) {
			setStatusMsg({
				type: "error",
				text: err.message || "Import failed"
			});
		} finally {
			if (e.target) e.target.value = "";
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-neutral-800 bg-neutral-950 text-white shadow-2xl overflow-hidden",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-900/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-semibold text-white",
								children: "Add to Wardrobe Library"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-400 border border-rose-500/30",
								children: "CUSTOM"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-neutral-400",
							children: "Upload your reference photo, define prompt translation, and organize with custom tags"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				statusMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center justify-between px-6 py-2 text-xs border-b ${statusMsg.type === "success" ? "bg-emerald-950/60 border-emerald-800 text-emerald-300" : "bg-red-950/60 border-red-800 text-red-300"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [statusMsg.type === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: statusMsg.text })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setStatusMsg(null),
						className: "opacity-70 hover:opacity-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/30 px-6 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setItemType("item"),
							className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${itemType === "item" ? "bg-rose-500 text-black shadow-sm" : "text-neutral-400 hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Individual Piece" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setItemType("outfit"),
							className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${itemType === "outfit" ? "bg-rose-500 text-black shadow-sm" : "text-neutral-400 hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Full Outfit Look" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setEditorMode("form"),
							className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${editorMode === "form" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Form Fields" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setEditorMode("json"),
							className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${editorMode === "json" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "JSON Editor" })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-6 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2",
							children: ["Reference Image ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-rose-500",
								children: "*"
							})]
						}),
						imageDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-neutral-700 bg-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: imageDataUrl,
									alt: "Preview",
									className: "h-full w-full object-contain p-1"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium text-white truncate",
										children: imageFileName || "Custom Reference Photo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-[11px] text-emerald-400 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Optimized for persistent library storage"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => fileInputRef.current?.click(),
											className: "rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors",
											children: "Replace Image"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setImageDataUrl("");
												setImageFileName("");
											},
											className: "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-950/40 transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remove" })]
										})]
									})
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onDragOver: handleDragOver,
							onDragLeave: handleDragLeave,
							onDrop: handleDrop,
							onClick: () => fileInputRef.current?.click(),
							className: `flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${isDragging ? "border-rose-500 bg-rose-500/10 text-white" : "border-neutral-800 bg-neutral-900/30 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-900/60"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 mb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "h-6 w-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-white",
									children: isProcessingImage ? "Optimizing image..." : "Click to browse or drag & drop reference photo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-neutral-500",
									children: "PNG, JPG, or WEBP · automatically optimized for studio catalog preview"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileInputRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: (e) => {
								const file = e.target.files?.[0];
								if (file) handleFileSelected(file);
							}
						})
					] }), editorMode === "form" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs font-semibold text-neutral-300 mb-1.5",
								children: [
									itemType === "item" ? "Piece Name" : "Outfit Name",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-rose-500",
										children: "*"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: itemType === "item" ? "e.g. Distressed Leather Moto Jacket, Platform Oxford Loafers" : "e.g. Cyberpunk Techwear Ensemble, Parisian Cafe Chic",
								className: "w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
							})] }),
							itemType === "item" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-xs font-semibold text-neutral-300 mb-1.5",
										children: ["Wardrobe Slot ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: slot,
										onChange: (e) => setSlot(e.target.value),
										className: "w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white capitalize focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50",
										children: WARDROBE_SLOTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s.slot,
											children: s.slot.replace("_", " ")
										}, s.slot))
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-neutral-300 mb-1.5",
										children: "Subcategory"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: subcategory,
										onChange: (e) => setSubcategory(e.target.value),
										placeholder: "e.g. jacket, boots, hoodie, tote",
										className: "w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-neutral-300 mb-1.5",
										children: "Colors"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: colors,
										onChange: (e) => setColors(e.target.value),
										placeholder: "e.g. black, distressed brown, silver",
										className: "w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-neutral-300 mb-1.5",
										children: "Materials & Textiles"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: materials,
										onChange: (e) => setMaterials(e.target.value),
										placeholder: "e.g. cowhide leather, heavy denim, silk",
										className: "w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-xs font-semibold text-neutral-300 mb-1.5",
										children: ["Prompt Translation Output ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 3,
										value: prompt,
										onChange: (e) => setPrompt(e.target.value),
										placeholder: "e.g. classic oversized black leather moto biker jacket with asymmetric silver zip, wide notch lapels, and zippered cuffs, worn open",
										className: "w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-xs text-white placeholder-neutral-500 font-mono leading-relaxed focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] text-neutral-500",
										children: "This standalone description will be injected into your prompt JSON when this piece is clicked."
									})
								] })
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-neutral-300 mb-1.5",
										children: "Outerwear"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: outfitOuterwear,
										onChange: (e) => setOutfitOuterwear(e.target.value),
										placeholder: "e.g. cropped sherpa jacket",
										className: "w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-neutral-300 mb-1.5",
										children: "Base Layer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: outfitBaseLayer,
										onChange: (e) => setOutfitBaseLayer(e.target.value),
										placeholder: "e.g. striped cotton tee; pleated mini skirt",
										className: "w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-neutral-300 mb-1.5",
										children: "Footwear"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: outfitFootwear,
										onChange: (e) => setOutfitFootwear(e.target.value),
										placeholder: "e.g. slouchy suede mid-calf boots",
										className: "w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-neutral-300 mb-1.5",
										children: "Accessories"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: outfitAccessories,
										onChange: (e) => setOutfitAccessories(e.target.value),
										placeholder: "e.g. leather crossbody bag, knit leg warmers",
										className: "w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
									})] })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs font-semibold text-neutral-300 mb-1.5",
								children: ["Full Outfit Prompt Translation ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-rose-500",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: prompt,
								onChange: (e) => setPrompt(e.target.value),
								placeholder: "e.g. oversized cream ivory sherpa jacket; Breton striped crew-neck tee; black bike shorts; dark brown suede slouch boots; black leather crossbody camera bag",
								className: "w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-xs text-white placeholder-neutral-500 font-mono leading-relaxed focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
							})] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-neutral-300 mb-2",
									children: "Style Tags & Organization"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5 mb-3",
									children: POPULAR_STYLE_TAGS.map((t) => {
										const active = selectedTags.includes(t);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => toggleTag(t),
											className: `rounded-full px-2.5 py-1 text-[11px] font-mono transition-all ${active ? "bg-rose-500 text-black font-semibold shadow-sm" : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"}`,
											children: ["#", t.replace(/_/g, " ")]
										}, t);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 max-w-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: customTagInput,
										onChange: (e) => setCustomTagInput(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												addCustomTag();
											}
										},
										placeholder: "Type custom tag and press Enter",
										className: "flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: addCustomTag,
										className: "flex items-center gap-1 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tag" })]
									})]
								})
							] })
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-mono text-neutral-400",
								children: "Edit or paste raw JSON piece schema:"
							}), jsonError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-red-400 flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }),
									" ",
									jsonError
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-emerald-400 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Valid JSON"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 14,
							value: jsonText,
							onChange: (e) => handleJsonChange(e.target.value),
							className: `w-full rounded-xl border bg-black/80 p-4 font-mono text-xs leading-relaxed focus:outline-none ${jsonError ? "border-red-500/80 text-red-200" : "border-neutral-800 text-neutral-200 focus:border-rose-500"}`,
							spellCheck: false
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-neutral-800 bg-neutral-900/60 px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleExport,
								title: "Export all custom library items to JSON",
								className: "flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-neutral-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export JSON" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleImportClick,
								title: "Import items from a JSON library file",
								className: "flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderInput, { className: "h-3.5 w-3.5 text-neutral-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Import JSON" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: importFileRef,
								type: "file",
								accept: ".json",
								className: "hidden",
								onChange: handleImportFile
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "rounded-lg px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleSave,
							className: "flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2 text-xs font-semibold text-black hover:bg-rose-400 shadow-md transition-all active:scale-95",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save to Library" })]
						})]
					})]
				})
			]
		})
	});
}
function WardrobeCatalogModal({ isOpen, onClose, onSelectOutfit, onSelectItem, appliedOutfitId, activeOuterwear, activeBaseLayer, activeFootwear }) {
	const [tab, setTab] = (0, import_react.useState)("outfits");
	const [slot, setSlot] = (0, import_react.useState)("all");
	const [selectedTag, setSelectedTag] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [justAppliedId, setJustAppliedId] = (0, import_react.useState)(null);
	const [justAppliedMsg, setJustAppliedMsg] = (0, import_react.useState)("");
	const [customItems, setCustomItems] = (0, import_react.useState)([]);
	const [customOutfits, setCustomOutfits] = (0, import_react.useState)([]);
	const [addModalOpen, setAddModalOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		function handleKeyDown(e) {
			if (e.key === "Escape" && isOpen && !addModalOpen) onClose();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		isOpen,
		onClose,
		addModalOpen
	]);
	(0, import_react.useEffect)(() => {
		async function refreshCustom() {
			const [items, outfits] = await Promise.all([loadCustomItems(), loadCustomOutfits()]);
			setCustomItems(items);
			setCustomOutfits(outfits);
		}
		if (isOpen) refreshCustom();
		window.addEventListener(CUSTOM_LIBRARY_CHANGE_EVENT, refreshCustom);
		return () => window.removeEventListener(CUSTOM_LIBRARY_CHANGE_EVENT, refreshCustom);
	}, [isOpen]);
	(0, import_react.useEffect)(() => {
		if (isOpen) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);
	const allOutfits = (0, import_react.useMemo)(() => {
		return combineWardrobeOutfits(WARDROBE_OUTFITS, customOutfits);
	}, [customOutfits]);
	const allItems = (0, import_react.useMemo)(() => {
		return combineWardrobeItems(WARDROBE_ITEMS, customItems);
	}, [customItems]);
	const filteredOutfits = (0, import_react.useMemo)(() => {
		return filterWardrobeOutfits(allOutfits, query, selectedTag === "all" ? void 0 : selectedTag);
	}, [
		allOutfits,
		query,
		selectedTag
	]);
	const filteredItems = (0, import_react.useMemo)(() => {
		return filterWardrobeItems(allItems, query, slot, selectedTag === "all" ? void 0 : selectedTag);
	}, [
		allItems,
		query,
		slot,
		selectedTag
	]);
	const prominentTags = (0, import_react.useMemo)(() => {
		const counts = {};
		const pool = tab === "outfits" ? allOutfits : allItems;
		for (const entry of pool) for (const t of entry.style_tags || []) counts[t] = (counts[t] || 0) + 1;
		const tags = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);
		if ((tab === "outfits" ? customOutfits.length > 0 : customItems.length > 0) && !tags.includes("custom")) return ["custom", ...tags.slice(0, 9)];
		return tags;
	}, [
		tab,
		allOutfits,
		allItems,
		customOutfits.length,
		customItems.length
	]);
	const handlePickOutfit = (outfit) => {
		onSelectOutfit(outfit);
		setJustAppliedId(outfit.id);
		setJustAppliedMsg("Outfit Applied to All Wardrobe Fields!");
		setTimeout(() => {
			setJustAppliedId((cur) => cur === outfit.id ? null : cur);
		}, 2500);
	};
	const handlePickItem = (item) => {
		onSelectItem(item);
		setJustAppliedId(item.id);
		const slotLabel = item.slot.replace("_", " ");
		setJustAppliedMsg(`Applied to ${slotLabel.toUpperCase()}!`);
		setTimeout(() => {
			setJustAppliedId((cur) => cur === item.id ? null : cur);
		}, 2500);
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "dialog",
		"aria-modal": "true",
		className: "fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200 text-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-inner",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold tracking-tight text-white",
							children: "Wardrobe & Attire Studio"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-rose-400 border border-rose-500/30",
							children: [
								allOutfits.length,
								" Outfits · ",
								allItems.length,
								" Pieces",
								(customItems.length > 0 || customOutfits.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1 text-rose-300",
									children: [
										"(",
										customItems.length + customOutfits.length,
										" custom)"
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-neutral-400",
						children: "White-background studio product shots & full outfits with precise prompt translation"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-64 max-w-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "Search wardrobe (e.g. sherpa, leather, boots)...",
									className: "w-full rounded-full border border-neutral-800 bg-neutral-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
								}),
								query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setQuery(""),
									className: "absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setAddModalOpen(true),
							className: "flex items-center gap-1.5 rounded-full border border-rose-500/50 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 hover:border-rose-500 transition-all shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add to Library" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white",
							title: "Close (Esc)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 border-b border-neutral-800/80 bg-neutral-950/80 px-6 py-3 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setTab("outfits");
									setSelectedTag("all");
								},
								className: `flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${tab === "outfits" ? "bg-rose-500 text-black shadow-md" : "text-neutral-400 hover:text-white"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Full Outfits (",
									allOutfits.length,
									")"
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setTab("items");
									setSelectedTag("all");
								},
								className: `flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${tab === "items" ? "bg-rose-500 text-black shadow-md" : "text-neutral-400 hover:text-white"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Individual Pieces (",
									allItems.length,
									")"
								] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-neutral-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5 text-neutral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab === "outfits" ? "Click an outfit to populate all layers, footwear, textiles, and accessories at once" : "Click any garment to update that specific wardrobe slot in your prompt" })]
						})]
					}),
					tab === "items" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSlot("all"),
							className: `shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all ${slot === "all" ? "bg-neutral-200 text-black font-semibold" : "border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white"}`,
							children: [
								"All Pieces (",
								allItems.length,
								")"
							]
						}), WARDROBE_SLOTS.map((s) => {
							const count = allItems.filter((i) => i.slot === s.slot).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSlot(s.slot),
								className: `shrink-0 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all capitalize ${slot === s.slot ? "bg-rose-500 text-black font-semibold" : "border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.slot.replace("_", " ") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] opacity-70 font-mono",
									children: [
										"(",
										count,
										")"
									]
								})]
							}, s.slot);
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-1 text-[11px] text-neutral-500 font-mono mr-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Styles:" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSelectedTag("all"),
								className: `shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${selectedTag === "all" ? "bg-neutral-300 text-black font-semibold" : "border border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:text-white"}`,
								children: "All Styles"
							}),
							prominentTags.map((tagKey) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelectedTag(tagKey),
								className: `shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${selectedTag === tagKey ? "bg-rose-500/90 text-black font-semibold" : "border border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:text-white"}`,
								title: STYLE_TAG_VOCABULARY[tagKey],
								children: ["#", tagKey.replace(/_/g, " ")]
							}, tagKey))
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto p-6",
				children: tab === "outfits" ? filteredOutfits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-64 flex-col items-center justify-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-8 w-8 text-neutral-600 mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-neutral-300",
							children: "No outfits match your filter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setQuery("");
								setSelectedTag("all");
							},
							className: "mt-4 rounded-full border border-neutral-700 bg-neutral-800 px-4 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700",
							children: "Reset Filters"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
					children: filteredOutfits.map((outfit) => {
						const isApplied = appliedOutfitId === outfit.id;
						const justApplied = justAppliedId === outfit.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handlePickOutfit(outfit),
							className: `group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${justApplied ? "border-rose-400 bg-neutral-900 shadow-lg shadow-rose-500/20 ring-2 ring-rose-400/50" : isApplied ? "border-rose-400/80 bg-neutral-900/90 ring-1 ring-rose-400/40" : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/80"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-[3/4] w-full overflow-hidden bg-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: outfit.image,
										alt: outfit.name,
										loading: "lazy",
										className: "h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute top-2 left-2 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded bg-black/85 px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider text-rose-400 backdrop-blur-sm shadow-sm border border-rose-500/20",
											children: outfit.item_ids.length ? `${outfit.item_ids.length} PIECES` : "LOOK"
										}), outfit.is_custom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded bg-rose-500 px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-black shadow-sm",
											children: "CUSTOM"
										})]
									}),
									outfit.is_custom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										role: "button",
										tabIndex: 0,
										onClick: async (e) => {
											e.stopPropagation();
											await deleteCustomOutfit(outfit.id);
										},
										onKeyDown: async (e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.stopPropagation();
												await deleteCustomOutfit(outfit.id);
											}
										},
										className: "absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-neutral-400 hover:bg-red-500 hover:text-white transition-colors shadow-sm cursor-pointer",
										title: "Delete custom outfit",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
									}),
									(isApplied || justApplied) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 border-2 border-rose-500 bg-rose-500/10 pointer-events-none" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "line-clamp-1 text-xs font-semibold text-white group-hover:text-rose-400 transition-colors",
											children: outfit.name
										}), (isApplied || justApplied) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex shrink-0 items-center text-rose-400",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 flex flex-wrap gap-1",
										children: outfit.style_tags.slice(0, 3).map((tagKey) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded bg-neutral-800 px-1.5 py-0.2 text-[9px] text-neutral-300 font-mono",
											children: ["#", tagKey.replace(/_/g, " ")]
										}, tagKey))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex-1 rounded bg-black/40 p-2 text-[10px] text-neutral-300 border border-neutral-800/60 font-mono",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "line-clamp-3 italic leading-relaxed text-neutral-300",
											children: [
												"\"",
												outfit.prompt,
												"\""
											]
										})
									}),
									justApplied && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 rounded bg-rose-500 py-1 text-center text-[10px] font-bold text-black animate-in fade-in duration-150",
										children: justAppliedMsg
									})
								]
							})]
						}, outfit.id);
					})
				}) : filteredItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-64 flex-col items-center justify-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-8 w-8 text-neutral-600 mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-neutral-300",
							children: "No items match your filter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setQuery("");
								setSlot("all");
								setSelectedTag("all");
							},
							className: "mt-4 rounded-full border border-neutral-700 bg-neutral-800 px-4 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700",
							children: "Reset Filters"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7",
					children: filteredItems.map((item) => {
						const isApplied = activeOuterwear === item.prompt || activeBaseLayer === item.prompt || activeFootwear === item.prompt;
						const justApplied = justAppliedId === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handlePickItem(item),
							className: `group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${justApplied ? "border-rose-400 bg-neutral-900 shadow-lg shadow-rose-500/20 ring-2 ring-rose-400/50" : isApplied ? "border-rose-400/80 bg-neutral-900/90 ring-1 ring-rose-400/40" : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/80"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-square w-full overflow-hidden bg-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: item.image,
										alt: item.name,
										loading: "lazy",
										className: "h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute top-2 left-2 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded bg-black/85 px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-rose-400 backdrop-blur-sm shadow-sm border border-rose-500/20 uppercase",
											children: item.slot.replace("_", " ")
										}), item.is_custom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded bg-rose-500 px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider text-black shadow-sm",
											children: "CUSTOM"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute top-2 right-2 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-medium text-neutral-300 backdrop-blur-sm capitalize",
											children: item.subcategory.replace("_", " ")
										}), item.is_custom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											role: "button",
											tabIndex: 0,
											onClick: async (e) => {
												e.stopPropagation();
												await deleteCustomItem(item.id);
											},
											onKeyDown: async (e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.stopPropagation();
													await deleteCustomItem(item.id);
												}
											},
											className: "flex h-5 w-5 items-center justify-center rounded-full bg-black/80 text-neutral-400 hover:bg-red-500 hover:text-white transition-colors shadow-sm cursor-pointer",
											title: "Delete custom piece",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
										})]
									}),
									(isApplied || justApplied) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 border-2 border-rose-500 bg-rose-500/10 pointer-events-none" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "line-clamp-1 text-xs font-semibold text-white group-hover:text-rose-400 transition-colors",
											children: item.name
										}), (isApplied || justApplied) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex shrink-0 items-center text-rose-400",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 line-clamp-1 text-[10px] text-neutral-400",
										children: [...item.colors, ...item.materials].slice(0, 3).join(" · ") || item.subcategory
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex-1 rounded bg-black/40 p-1.5 text-[10px] text-neutral-300 border border-neutral-800/60 font-mono",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "line-clamp-2 italic leading-relaxed text-neutral-300",
											children: [
												"\"",
												item.prompt,
												"\""
											]
										})
									}),
									justApplied && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 rounded bg-rose-500 py-1 text-center text-[10px] font-bold text-black animate-in fade-in duration-150",
										children: justAppliedMsg
									})
								]
							})]
						}, item.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-3 text-xs text-neutral-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tip: Selecting an outfit sets outerwear, mid layer, base layer, footwear, accessories, and textiles in your prompt JSON simultaneously." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-lg bg-neutral-800 px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-700",
					children: "Done Browsing"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddLibraryItemModal, {
				isOpen: addModalOpen,
				onClose: () => setAddModalOpen(false),
				initialType: tab === "outfits" ? "outfit" : "item",
				onSaved: (savedName) => {
					setJustAppliedMsg(`Saved "${savedName}" to your library!`);
					setTimeout(() => setJustAppliedMsg(""), 3500);
				}
			})
		]
	});
}
var DB_NAME = "prompt-forge";
var STORE = "images";
function openDb() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? /* @__PURE__ */ new Error("Could not open image storage"));
	});
}
function finish(tx) {
	return new Promise((resolve, reject) => {
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("Image storage failed"));
		tx.onabort = () => reject(tx.error ?? /* @__PURE__ */ new Error("Image storage failed"));
	});
}
async function saveImage(id, blob) {
	const db = await openDb();
	try {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).put(blob, id);
		await finish(tx);
	} finally {
		db.close();
	}
}
async function loadImage(id) {
	const db = await openDb();
	try {
		const tx = db.transaction(STORE, "readonly");
		const request = tx.objectStore(STORE).get(id);
		const blob = await new Promise((resolve, reject) => {
			request.onsuccess = () => {
				const value = request.result;
				resolve(value instanceof Blob ? value : null);
			};
			request.onerror = () => reject(request.error ?? /* @__PURE__ */ new Error("Could not read image"));
		});
		await finish(tx);
		return blob;
	} finally {
		db.close();
	}
}
async function deleteImage(id) {
	const db = await openDb();
	try {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).delete(id);
		await finish(tx);
	} finally {
		db.close();
	}
}
async function fileToThumbnail(file) {
	if (!file.type.startsWith("image/")) throw new Error("Not an image");
	if (file.size > 20971520) throw new Error("Image is too large");
	const bitmap = await createImageBitmap(file);
	try {
		const scale = Math.min(1, 640 / Math.max(bitmap.width, bitmap.height));
		const canvas = document.createElement("canvas");
		canvas.width = Math.max(1, Math.round(bitmap.width * scale));
		canvas.height = Math.max(1, Math.round(bitmap.height * scale));
		const context = canvas.getContext("2d");
		if (!context) throw new Error("Could not read that photo");
		context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
		const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", .82));
		if (!blob) throw new Error("Could not read that photo");
		return blob;
	} finally {
		bitmap.close();
	}
}
var JSON_KEYS = {
	subject: "subject",
	subjects: "subject",
	character: "subject",
	protagonist: "subject",
	who: "subject",
	"main subject": "subject",
	appearance: "appearance",
	features: "appearance",
	"appearance features": "appearance",
	physical: "appearance",
	"physical features": "appearance",
	hair: "appearance",
	eyes: "appearance",
	expression: "appearance",
	clothing: "clothing",
	clothes: "clothing",
	outfit: "clothing",
	wardrobe: "clothing",
	attire: "clothing",
	costume: "clothing",
	pose: "pose",
	action: "pose",
	"pose action": "pose",
	gesture: "pose",
	background: "background",
	bg: "background",
	setting: "background",
	environment: "background",
	scene: "background",
	backdrop: "background",
	foreground: "foreground",
	fg: "foreground",
	style: "style",
	"art direction": "style",
	"style art direction": "style",
	aesthetic: "style",
	medium: "style",
	lighting: "lighting",
	light: "lighting",
	lights: "lighting",
	camera: "camera",
	composition: "camera",
	"camera composition": "camera",
	lens: "camera",
	framing: "camera",
	extra: "extra",
	extras: "extra",
	details: "extra",
	"extra details": "extra",
	"extra details negative": "extra",
	notes: "extra",
	other: "extra",
	negative: "negative",
	negatives: "negative",
	"negative prompt": "negative",
	neg: "negative",
	prompt: "prompt",
	positive: "prompt",
	"positive prompt": "prompt",
	text: "prompt",
	description: "prompt",
	raw: "prompt"
};
var LABELS = [
	"extra details / negative",
	"appearance / features",
	"style / art direction",
	"camera / composition",
	"pose / action",
	"negative prompt",
	"physical features",
	"art direction",
	"extra details",
	"subject",
	"appearance",
	"features",
	"clothing",
	"clothes",
	"outfit",
	"wardrobe",
	"pose",
	"action",
	"background",
	"setting",
	"environment",
	"foreground",
	"style",
	"aesthetic",
	"lighting",
	"camera",
	"composition",
	"negative",
	"extra",
	"notes"
];
var CATALOG = [
	{
		key: "camera",
		weight: 6,
		phrases: [
			"depth of field",
			"shallow focus",
			"deep focus",
			"rule of thirds",
			"over the shoulder",
			"bird's eye",
			"worm's eye",
			"dutch angle",
			"low angle",
			"high angle",
			"close-up",
			"close up",
			"extreme close",
			"medium shot",
			"wide shot",
			"full body",
			"cowboy shot",
			"three-quarter view",
			"profile view",
			"from behind",
			"from above",
			"wide angle",
			"telephoto",
			"anamorphic",
			"tilt shift",
			"bokeh",
			"headshot",
			"macro",
			"framing",
			"composition",
			"lens",
			"shot on"
		]
	},
	{
		key: "lighting",
		weight: 6,
		phrases: [
			"cinematic lighting",
			"dramatic lighting",
			"studio lighting",
			"rim lighting",
			"rim light",
			"golden hour",
			"blue hour",
			"volumetric",
			"god rays",
			"chiaroscuro",
			"candlelight",
			"firelight",
			"moonlight",
			"sunlight",
			"backlight",
			"backlit",
			"key light",
			"fill light",
			"soft light",
			"hard light",
			"neon",
			"spotlight",
			"catchlight",
			"lighting",
			"lit by"
		]
	},
	{
		key: "foreground",
		weight: 5,
		phrases: [
			"foreground",
			"sea spray",
			"rose petals",
			"petals",
			"dust motes"
		]
	},
	{
		key: "background",
		weight: 5,
		phrases: [
			"background",
			"cityscape",
			"landscape",
			"throne room",
			"mountains",
			"mountain",
			"ocean",
			"sea",
			"beach",
			"desert",
			"ruins",
			"castle",
			"temple",
			"street",
			"alley",
			"skyline",
			"sky",
			"clouds",
			"jungle",
			"village",
			"cathedral",
			"library",
			"battlefield",
			"garden",
			"cave",
			"snow",
			"rain",
			"rooftop",
			"nebula",
			"tavern",
			"market",
			"forest",
			"woods",
			"meadow",
			"shore",
			"coast",
			"fog",
			"mist",
			"storm"
		]
	},
	{
		key: "clothing",
		weight: 5,
		phrases: [
			"wearing",
			"dressed",
			"outfit",
			"attire",
			"costume",
			"armor",
			"armour",
			"leather",
			"cloak",
			"cape",
			"gown",
			"dress",
			"robe",
			"jacket",
			"coat",
			"shirt",
			"blouse",
			"skirt",
			"pants",
			"jeans",
			"boots",
			"shoes",
			"heels",
			"helmet",
			"crown",
			"jewelry",
			"necklace",
			"gloves",
			"scarf",
			"uniform",
			"kimono",
			"silk",
			"velvet",
			"lace",
			"corset",
			"hoodie",
			"tunic",
			"gauntlets",
			"bracers",
			"hood"
		]
	},
	{
		key: "pose",
		weight: 6,
		phrases: [
			"standing",
			"sitting",
			"seated",
			"running",
			"walking",
			"kneeling",
			"crouching",
			"leaning",
			"reaching",
			"jumping",
			"dancing",
			"fighting",
			"aiming",
			"holding",
			"wielding",
			"looking",
			"reclining",
			"lying",
			"perched",
			"posing",
			"facing",
			"mid-motion",
			"mid motion",
			"arms crossed"
		]
	},
	{
		key: "appearance",
		weight: 5,
		phrases: [
			"silver hair",
			"black hair",
			"blonde hair",
			"blue eyes",
			"green eyes",
			"brown eyes",
			"heterochromia",
			"freckles",
			"stubble",
			"makeup",
			"lipstick",
			"expression",
			"smile",
			"smiling",
			"beard",
			"scars",
			"scar",
			"hair",
			"eyes",
			"eye",
			"brows",
			"eyelashes",
			"wrinkles",
			"tattoo",
			"braids",
			"ponytail",
			"bangs",
			"complexion"
		]
	},
	{
		key: "style",
		weight: 4,
		phrases: [
			"oil painting",
			"digital painting",
			"concept art",
			"dark fantasy",
			"film still",
			"editorial photography",
			"photorealistic",
			"hyperrealistic",
			"watercolor",
			"illustration",
			"anime",
			"manga",
			"cel shading",
			"octane",
			"unreal engine",
			"artstation",
			"masterpiece",
			"best quality",
			"ultra-detailed",
			"ultra detailed",
			"highly detailed",
			"award winning",
			"fine art",
			"painterly",
			"cinematic",
			"filmic",
			"photograph",
			"photography",
			"photo",
			"render",
			"8k",
			"4k"
		]
	},
	{
		key: "extra",
		weight: 5,
		phrases: [
			"extra fingers",
			"extra limbs",
			"bad hands",
			"bad anatomy",
			"malformed",
			"deformed",
			"disfigured",
			"watermark",
			"signature",
			"jpeg artifacts",
			"low quality",
			"worst quality",
			"blurry",
			"mutated"
		]
	},
	{
		key: "subject",
		weight: 4,
		phrases: [
			"1girl",
			"1boy",
			"2girls",
			"woman",
			"man",
			"girl",
			"boy",
			"person",
			"child",
			"ranger",
			"knight",
			"warrior",
			"wizard",
			"mage",
			"elven",
			"elf",
			"orc",
			"dragon",
			"fox",
			"wolf",
			"cat",
			"dog",
			"robot",
			"android",
			"astronaut",
			"queen",
			"king",
			"witch",
			"vampire",
			"samurai",
			"ninja",
			"pirate",
			"goddess",
			"angel",
			"soldier",
			"archer",
			"traveler",
			"creature",
			"monster",
			"lady",
			"figure"
		]
	}
];
var PRIORITY = [
	"extra",
	"camera",
	"lighting",
	"foreground",
	"background",
	"clothing",
	"pose",
	"appearance",
	"style",
	"subject"
];
var COMPILED = CATALOG.map((entry) => ({
	...entry,
	re: phraseRegex(entry.phrases)
}));
var CAMERA_EXTRA = [
	/\b\d{2,3}\s?mm\b/i,
	/\bf\/\d(?:\.\d)?\b/i,
	/\baspect ratio\b/i
];
var ENV_RE = /\b(forest|mountains?|ocean|sea|beach|desert|ruins|castle|temple|streets?|alleys?|skylines?|skies|sky|clouds|jungles?|villages?|cathedrals?|libraries|battlefields?|gardens?|caves?|snow|rain|rooftops?|nebulae|nebula|taverns?|markets?|woods|meadows?|shores?|coasts?|fog|mist|storms?|storm|city|room|interior|studio|cliff|cliffs)\b/i;
var POSE_SPLIT = /\s+(?=(?:standing|sitting|seated|running|walking|kneeling|crouching|leaning|reaching|jumping|dancing|fighting|aiming|holding|wielding|looking|reclining|lying|perched|posing|facing)\b)/i;
var WEAR_SPLIT = /\s+(?=wearing\b|dressed in\b|clad in\b|outfitted in\b)/i;
function phraseRegex(phrases) {
	const body = [...phrases].sort((a, b) => b.length - a.length).map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\s/g, "\\s+").replace(/'/g, "['’]")).join("|");
	return new RegExp(`(?:^|[^a-z0-9])(?:${body})(?:[^a-z0-9]|$)`, "i");
}
function normKey(key) {
	return key.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function tidy(value) {
	return value.replace(/\s+/g, " ").replace(/^[,;:|\s]+|[,;|\s]+$/g, "").trim();
}
function tidySection(key, value) {
	let text = tidy(value);
	if (key !== "subject") text = text.replace(/^(?:a|an|the)\s+/i, "");
	return text;
}
function push(fields, key, value) {
	const piece = tidySection(key, value);
	if (!piece) return;
	const parts = fields[key] ? fields[key].split(/,\s*/) : [];
	const norm = piece.toLowerCase();
	if (parts.some((part) => {
		const current = part.toLowerCase();
		return current === norm || current.includes(norm);
	})) return;
	const kept = parts.filter((part) => !norm.includes(part.toLowerCase()));
	kept.push(piece);
	fields[key] = kept.join(", ");
}
function joinRaw(current, addition) {
	const next = tidy(addition);
	if (!next) return current;
	if (!current.trim()) return next;
	if (current.toLowerCase().includes(next.toLowerCase())) return current;
	return `${current.replace(/,\s*$/, "")}, ${next}`;
}
function collectStrings(value) {
	if (typeof value === "string") return tidy(value);
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	if (Array.isArray(value)) return value.map(collectStrings).filter(Boolean).join(", ");
	if (value && typeof value === "object") return Object.values(value).map(collectStrings).filter(Boolean).join(", ");
	return "";
}
function tryParseJson(input) {
	let text = input.trim();
	if (text.startsWith("```")) text = text.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
	if (!text.startsWith("{") && !text.startsWith("[")) return null;
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
}
function scorePhrase(phrase) {
	const totals = /* @__PURE__ */ new Map();
	for (const entry of COMPILED) {
		const flags = entry.re.flags.includes("g") ? entry.re.flags : `${entry.re.flags}g`;
		const re = new RegExp(entry.re.source, flags);
		const count = [...phrase.matchAll(re)].length;
		if (count > 0) totals.set(entry.key, (totals.get(entry.key) ?? 0) + entry.weight * count);
	}
	if (CAMERA_EXTRA.some((re) => re.test(phrase))) totals.set("camera", (totals.get("camera") ?? 0) + 6);
	let winner = null;
	let best = 0;
	for (const key of PRIORITY) {
		const score = totals.get(key) ?? 0;
		if (score > best) {
			best = score;
			winner = key;
		}
	}
	return best >= 4 ? winner : null;
}
function forceRoute(phrase) {
	const text = tidy(phrase);
	let match = text.match(/^(.+?)\s+in the foreground$/i);
	if (match?.[1]) return {
		key: "foreground",
		text: match[1]
	};
	match = text.match(/^(?:in the )?foreground\s*[:\-]?\s*(.+)$/i);
	if (match?.[1]) return {
		key: "foreground",
		text: match[1]
	};
	match = text.match(/^(.+?)\s+foreground$/i);
	if (match?.[1]) return {
		key: "foreground",
		text: match[1]
	};
	match = text.match(/^(.+?)\s+in the background$/i);
	if (match?.[1]) return {
		key: "background",
		text: match[1]
	};
	match = text.match(/^(?:the )?background(?:\s+of|\s+is)?\s*[:\-]?\s*(.+)$/i);
	if (match?.[1]) return {
		key: "background",
		text: match[1]
	};
	match = text.match(/^(.+?)\s+background$/i);
	if (match?.[1]) return {
		key: "background",
		text: match[1]
	};
	match = text.match(/^wearing\s+(.+)$/i);
	if (match?.[1]) return {
		key: "clothing",
		text: match[1]
	};
	match = text.match(/^(?:dressed|clad|outfitted)\s+in\s+(.+)$/i);
	if (match?.[1]) return {
		key: "clothing",
		text: match[1]
	};
	if (/^(?:no|without|avoid)\s+/i.test(text) && /\b(text|watermark|logo|signature|words|letters|border|frame|blur|artifact|people|humans|modern)\b/i.test(text)) return {
		key: "extra",
		text
	};
	return null;
}
function isEnvironment(place) {
	if (/\b(standing|sitting|looking|holding|wearing|walking|running)\b/i.test(place)) return false;
	return ENV_RE.test(place);
}
function splitLookahead(phrase, re) {
	const parts = phrase.split(re).map(tidy).filter(Boolean);
	return parts.length > 0 ? parts : [phrase];
}
function splitInClothing(phrase) {
	const match = phrase.match(/^(.*)\s+in\s+(a|an|the)\s+(.+)$/i);
	if (!match) return [phrase];
	const right = tidy(`${match[2]} ${match[3]}`);
	if (scorePhrase(right) === "clothing" || scorePhrase(match[3] ?? "") === "clothing") return [tidy(match[1] ?? ""), right].filter(Boolean);
	return [phrase];
}
function splitEnvironment(phrase) {
	const match = phrase.match(/^(.*)\s+(?:in|inside|amid|amidst|under|beneath)\s+(?:a|an|the\s+)?(.{2,80})$/i);
	if (!match) return [phrase];
	const left = tidy(match[1] ?? "");
	const place = tidy(match[2] ?? "");
	if (!left || !place || !isEnvironment(place)) return [phrase];
	return [left, place];
}
function splitWith(phrase) {
	const match = phrase.match(/^(.*)\s+with\s+(.+)$/i);
	if (!match) return [phrase];
	const left = tidy(match[1] ?? "");
	const right = tidy(match[2] ?? "");
	if (!left || !right) return [phrase];
	const rightKey = forceRoute(right)?.key ?? scorePhrase(right);
	if (rightKey === "appearance" || rightKey === "clothing") return [left, right];
	return [phrase];
}
function splitAnd(phrase) {
	const bits = phrase.split(/\s+(?:and|&)\s+/i).map(tidy).filter(Boolean);
	if (bits.length < 2) return [phrase];
	if (new Set(bits.map((bit) => forceRoute(bit)?.key ?? scorePhrase(bit)).filter((key) => key != null)).size <= 1) return [phrase];
	return bits.flatMap((bit) => splitAnd(bit));
}
function explode(clause) {
	const worn = splitLookahead(clause, WEAR_SPLIT);
	const out = [];
	for (const wear of worn) {
		const clothed = splitInClothing(wear);
		for (const cloth of clothed) {
			const posed = splitLookahead(cloth, POSE_SPLIT);
			for (const pose of posed) {
				const places = splitEnvironment(pose);
				for (const place of places) {
					const withParts = splitWith(place);
					for (const part of withParts) out.push(...splitAnd(part));
				}
			}
		}
	}
	return out;
}
function splitDelimiters(input) {
	const parts = [];
	let buf = "";
	let depth = 0;
	for (const ch of input) {
		if (ch === "(" || ch === "[" || ch === "{") depth += 1;
		if ((ch === ")" || ch === "]" || ch === "}") && depth > 0) depth -= 1;
		if (depth === 0 && (ch === "\n" || ch === "," || ch === ";" || ch === "|")) {
			const piece = tidy(buf);
			if (piece) parts.push(piece);
			buf = "";
			continue;
		}
		buf += ch;
	}
	const last = tidy(buf);
	if (last) parts.push(last);
	return parts;
}
function peelMedium(phrase) {
	const match = phrase.match(/^(?:a\s+|an\s+)?(.*?\b(?:concept art|photograph|photography|illustration|painting|portrait|render|photo|image|shot))\s+of\s+(.+)$/i);
	if (!match?.[1] || !match[2]) return {
		medium: null,
		rest: phrase
	};
	return {
		medium: tidy(match[1]),
		rest: tidy(match[2])
	};
}
var MJ_RE = /--(ar|aspect|stylize|chaos|weird|niji|style|quality|seed|tile|no|[scwvq])\b([\s\S]*?)(?=\s--|$)/gi;
function extractDirectives(text) {
	let negative = "";
	let body = text;
	const neg = body.match(/\bnegative\s*prompt\s*[:\-]\s*([\s\S]*)$/i);
	if (neg?.index != null) {
		negative = tidy(neg[1] ?? "");
		body = body.slice(0, neg.index).trim();
	}
	const mjs = [];
	body = body.replace(MJ_RE, (full) => {
		mjs.push(tidy(full));
		return " ";
	}).trim();
	return {
		body,
		mjs,
		negative
	};
}
function routeMj(token) {
	const match = token.match(/^--(\w+)\s*([\s\S]*)$/);
	if (!match) return {
		key: "extra",
		text: token
	};
	const flag = match[1]?.toLowerCase() ?? "";
	const value = tidy(match[2] ?? "");
	if (flag === "ar" || flag === "aspect") return {
		key: "camera",
		text: `aspect ratio ${value}`
	};
	if (flag === "no") return {
		key: "extra",
		text: value
	};
	if (flag === "v") return {
		key: "style",
		text: value ? `midjourney v${value}` : "midjourney"
	};
	if (flag === "niji") return {
		key: "style",
		text: value ? `niji ${value}` : "niji"
	};
	if (flag === "stylize" || flag === "s") return {
		key: "style",
		text: `stylize ${value}`
	};
	if (flag === "chaos" || flag === "c") return {
		key: "style",
		text: `chaos ${value}`
	};
	if (flag === "weird" || flag === "w") return {
		key: "style",
		text: `weird ${value}`
	};
	if (flag === "style") return {
		key: "style",
		text: value ? `${value} style` : "stylized"
	};
	if (flag === "q" || flag === "quality") return {
		key: "style",
		text: `quality ${value}`
	};
	if (flag === "seed") return {
		key: "extra",
		text: `seed ${value}`
	};
	return {
		key: "extra",
		text: tidy(`${flag} ${value}`)
	};
}
function classifyFreeform(text) {
	const fields = emptyFields();
	const { body, mjs, negative } = extractDirectives(text);
	let subjectSet = false;
	for (const clause of splitDelimiters(body)) for (const atom of explode(clause)) {
		const peeled = peelMedium(atom);
		if (peeled.medium) push(fields, "style", peeled.medium);
		const phrase = peeled.rest;
		if (!phrase) continue;
		const forced = forceRoute(phrase);
		if (forced) {
			push(fields, forced.key, forced.text);
			if (forced.key === "subject") subjectSet = true;
			continue;
		}
		const key = scorePhrase(phrase);
		if (key === "subject" || key == null && !subjectSet) {
			push(fields, "subject", phrase);
			subjectSet = true;
			continue;
		}
		if (key) {
			push(fields, key, phrase);
			continue;
		}
		push(fields, "extra", phrase);
	}
	for (const token of mjs) {
		const routed = routeMj(token);
		push(fields, routed.key, routed.text);
	}
	if (negative) fields.extra = joinRaw(fields.extra, negative);
	return fields;
}
function labelRegex() {
	const alt = LABELS.map((label) => label.split("/").map((part) => part.trim().split(/\s+/).map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+")).join("\\s*/\\s*")).join("|");
	return new RegExp(`(?:^|[\\n|])\\s*(?:[-*]\\s+)?(?:#{1,6}\\s*)?(?:\\*\\*|__)?\\[?(${alt})\\]?(?:\\*\\*|__)?\\s*(?::|\\s-\\s)\\s*`, "gi");
}
function tryLabeled(text) {
	const matches = [...text.matchAll(labelRegex())];
	if (matches.length < 2) return null;
	const fields = emptyFields();
	const first = matches[0];
	if (!first || first.index == null) return null;
	const preamble = tidy(text.slice(0, first.index));
	matches.forEach((match, index) => {
		const mapped = JSON_KEYS[normKey(match[1] ?? "")];
		const key = mapped === "prompt" || mapped === "negative" || !mapped ? mapped === "negative" ? "extra" : null : mapped;
		const start = (match.index ?? 0) + match[0].length;
		const end = index + 1 < matches.length ? matches[index + 1]?.index ?? text.length : text.length;
		const body = tidy(text.slice(start, end).replace(/^\|+\s*|\s*\|+$/g, ""));
		if (!key || !body) return;
		fields[key] = fields[key] ? `${fields[key]}, ${body}` : body;
	});
	if (preamble && !fields.subject) fields.subject = preamble;
	if (filledKeys(fields).length < 2) return null;
	return fields;
}
function summaryFor(fields, mode, fallback) {
	const count = filledKeys(fields).length;
	if (count === 0) return "Nothing recognizable to sort.";
	if (mode === "freeform" && count === 1 && fields.subject) return "Couldn't split this cleanly — left it on Subject.";
	return fallback.replace("{n}", String(count));
}
function fromFreeform(text, template) {
	const fields = classifyFreeform(text);
	return {
		fields,
		mode: "freeform",
		summary: summaryFor(fields, "freeform", template)
	};
}
function mapJson(value) {
	if (typeof value === "string") return fromFreeform(value, "Sorted a JSON string into {n} sections.");
	if (Array.isArray(value)) {
		const text = value.map(collectStrings).filter(Boolean).join(", ");
		if (!text) return null;
		return fromFreeform(text, "Sorted a JSON list into {n} sections.");
	}
	if (!value || typeof value !== "object") return null;
	const fields = emptyFields();
	let known = 0;
	let promptText = "";
	let negative = "";
	const unknown = [];
	for (const [key, item] of Object.entries(value)) {
		const mapped = JSON_KEYS[normKey(key)];
		const text = collectStrings(item);
		if (mapped === "prompt") {
			known += 1;
			if (text) promptText = joinRaw(promptText, text);
			continue;
		}
		if (mapped === "negative") {
			known += 1;
			if (text) negative = joinRaw(negative, text);
			continue;
		}
		if (mapped) {
			known += 1;
			if (text) fields[mapped] = joinRaw(fields[mapped], text);
			continue;
		}
		if (text) unknown.push(`${key}: ${text}`);
	}
	if (known === 0) {
		const blob = collectStrings(value);
		if (!blob) return null;
		return fromFreeform(blob, "Sorted JSON values into {n} sections.");
	}
	if (promptText) {
		const parsed = classifyFreeform(promptText);
		for (const key of SECTION_KEYS) if (!fields[key]) fields[key] = parsed[key];
		else if (parsed[key]) fields[key] = joinRaw(fields[key], parsed[key]);
	}
	if (negative) fields.extra = joinRaw(fields.extra, negative);
	if (unknown.length > 0) fields.extra = joinRaw(fields.extra, unknown.join("; "));
	const count = filledKeys(fields).length;
	return {
		fields,
		mode: "json",
		summary: count ? `Mapped JSON into ${count} ${count === 1 ? "section" : "sections"}.` : "JSON parsed, but every section was empty."
	};
}
function parseFlat(raw) {
	const input = raw.replace(/\u00a0/g, " ").replace(/[“”]/g, "\"").replace(/[‘’]/g, "'").trim();
	if (!input) return {
		fields: emptyFields(),
		mode: "empty",
		summary: "Nothing to parse yet."
	};
	const json = tryParseJson(input);
	if (json !== null) {
		const mapped = mapJson(json);
		if (mapped) return mapped;
	}
	const neg = input.match(/\bnegative\s*prompt\s*[:\-]\s*([\s\S]*)$/i);
	const positive = neg?.index != null ? input.slice(0, neg.index).trim() : input;
	const negative = neg ? tidy(neg[1] ?? "") : "";
	const labeled = tryLabeled(positive);
	if (labeled) {
		if (negative) labeled.extra = joinRaw(labeled.extra, negative);
		const count = filledKeys(labeled).length;
		return {
			fields: labeled,
			mode: "labeled",
			summary: `Split ${count} labeled ${count === 1 ? "section" : "sections"}.`
		};
	}
	const fields = classifyFreeform(input);
	return {
		fields,
		mode: "freeform",
		summary: summaryFor(fields, "freeform", "Sorted this into {n} sections.")
	};
}
function parsePrompt(raw) {
	const input = raw.replace(/\u00a0/g, " ").replace(/[“”]/g, "\"").replace(/[‘’]/g, "'").trim();
	if (!input) return {
		doc: emptyDocSafe(),
		mode: "empty",
		summary: "Nothing to parse yet."
	};
	const json = tryParseJson(input);
	if (json !== null && isNativeDoc(json)) {
		const doc = coerceDoc(json);
		const count = countFilled(doc);
		return {
			doc,
			mode: "json",
			summary: count ? `Loaded your format, ${count} ${count === 1 ? "field" : "fields"} filled.` : "Loaded your format. Every field was empty."
		};
	}
	const flat = parseFlat(input);
	return {
		doc: docFromFlat(flat.fields),
		mode: flat.mode,
		summary: flat.summary
	};
}
function emptyDocSafe() {
	return docFromFlat(emptyFields());
}
var SEED_SNIPPETS = [
	{
		id: "seed-medium-film",
		title: "35mm still",
		category: "medium",
		custom: false,
		body: "35mm film still, physical grain, slight halation"
	},
	{
		id: "seed-medium-gouache",
		title: "Gouache plate",
		category: "medium",
		custom: false,
		body: "gouache on toned paper, dry brush edges, pigment texture"
	},
	{
		id: "seed-optics-85",
		title: "85mm shallow",
		category: "optics",
		custom: false,
		body: "85mm spherical, f/2, shallow focus, gentle falloff"
	},
	{
		id: "seed-key-window",
		title: "North window",
		category: "key",
		custom: false,
		body: "large north window, soft directional key, 4:1 contrast",
		target: "aesthetic_dna.lighting_architecture.key_source.fixture_or_origin"
	},
	{
		id: "seed-accent-rim",
		title: "Fire rim",
		category: "accent",
		custom: false,
		body: "warm rim from a practical fire, cool shadow side"
	},
	{
		id: "seed-frame-worm",
		title: "Worm's-eye rake",
		category: "framing",
		custom: false,
		body: "Worm's-Eye Upward Rake, low axis, subject towering"
	},
	{
		id: "seed-wardrobe-travel",
		title: "Weathered layers",
		category: "wardrobe",
		custom: false,
		body: "weathered wool cloak over a linen shirt, scuffed boots, road dust",
		target: "subjects.{i}.wardrobe_architecture.layering_system.outerwear"
	},
	{
		id: "seed-exclude",
		title: "Anti-cliché pack",
		category: "exclusions",
		custom: false,
		body: "beauty lighting\ncentered hero smile\nplastic skin\nextra fingers\nwatermark"
	}
];
var SAMPLE_TITLE = "Cliffside ranger";
var SAMPLE_SOURCE = "a young elven ranger with long silver hair and piercing blue eyes, wearing a weathered crimson cloak over black leather armor, standing on a cliff edge, looking out to sea, stormy ocean background, sea spray in the foreground, cinematic dark fantasy oil painting, dramatic rim lighting, 85mm lens, shallow depth of field, no text, no watermark";
var SAMPLE_DOC = parsePrompt(SAMPLE_SOURCE).doc;
var FILTERS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "medium",
		label: "Medium"
	},
	{
		id: "optics",
		label: "Optics"
	},
	{
		id: "key",
		label: "Lighting"
	},
	{
		id: "framing",
		label: "Frame"
	},
	{
		id: "wardrobe",
		label: "Wardrobe"
	},
	{
		id: "exclusions",
		label: "Exclude"
	},
	{
		id: "note",
		label: "Notes"
	}
];
function cn(...parts) {
	return parts.filter(Boolean).join(" ");
}
function narrow() {
	return window.matchMedia("(max-width: 1023px)").matches;
}
function formatWhen(ts) {
	const minutes = Math.round((Date.now() - ts) / 6e4);
	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.round(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.round(hours / 24);
	if (days < 14) return `${days}d ago`;
	return new Date(ts).toLocaleDateString();
}
async function copyText(value) {
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
function appendText(current, piece) {
	const next = piece.trim();
	if (!next) return current;
	if (!current.trim()) return next;
	if (current.toLowerCase().includes(next.toLowerCase())) return current;
	return `${current.replace(/,\s*$/, "")}, ${next}`;
}
function placeSnippet(doc, snippet, slot, focusPath, activeId) {
	const targetCluster = snippet.category === "note" ? clusterById(activeId) : clusterById(snippet.category);
	const chosen = (snippet.target ? targetCluster.fields.find((item) => item.path === snippet.target) : snippet.category === "note" ? targetCluster.fields.find((item) => resolvePath(item.path, slot) === focusPath) ?? targetCluster.fields.find((item) => item.kind !== "palette") : targetCluster.fields.find((item) => item.kind !== "palette")) ?? targetCluster.fields[0];
	if (!chosen) return {
		doc,
		focus: focusPath,
		cluster: activeId
	};
	const resolved = resolvePath(chosen.path, slot);
	const current = getAt(doc, resolved);
	let nextDoc = doc;
	if (chosen.kind === "list" || chosen.kind === "palette" || Array.isArray(current)) {
		const incoming = snippet.body.split(/\n+/).map((line) => line.trim()).filter(Boolean);
		const next = [...Array.isArray(current) ? current.filter((item) => item.trim()) : []];
		for (const line of incoming) if (!next.some((item) => item.toLowerCase() === line.toLowerCase())) next.push(line);
		nextDoc = setAt(doc, resolved, next);
	} else {
		const text = typeof current === "string" ? current : "";
		if (!text.toLowerCase().includes(snippet.body.trim().toLowerCase())) nextDoc = setAt(doc, resolved, appendText(text, snippet.body));
	}
	return {
		doc: nextDoc,
		focus: resolved,
		cluster: snippet.category === "note" ? activeId : snippet.category
	};
}
function safeHex(value) {
	return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#C46A3A";
}
function subjectFilled(subject) {
	const probe = emptyDoc();
	probe.subjects = [subject];
	return countFilled(probe) > 0;
}
function characterName(subject, fallback) {
	const named = subject.subject_id.trim();
	if (named) return named.length > 48 ? `${named.slice(0, 48).trim()}…` : named;
	const feature = subject.casting_and_physique.demographics_and_features.trim().split(",")[0]?.trim() ?? "";
	if (feature) return feature.length > 48 ? `${feature.slice(0, 48).trim()}…` : feature;
	return fallback;
}
function characterBlurb(subject) {
	return [
		subject.casting_and_physique.hair_and_grooming,
		subject.casting_and_physique.demographics_and_features,
		subject.wardrobe_architecture.layering_system.outerwear,
		subject.kinetic_posture
	].map((line) => line.trim()).filter(Boolean).slice(0, 2).join(" · ");
}
function blobToBase64(blob) {
	return blob.arrayBuffer().then((buffer) => {
		const bytes = new Uint8Array(buffer);
		let binary = "";
		for (const byte of bytes) binary += String.fromCharCode(byte);
		return btoa(binary);
	});
}
function base64ToBlob(data) {
	const binary = atob(data);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
	return new Blob([bytes], { type: "image/jpeg" });
}
function PromptForge() {
	const [title, setTitle] = (0, import_react.useState)(SAMPLE_TITLE);
	const [source, setSource] = (0, import_react.useState)(SAMPLE_SOURCE);
	const [doc, setDoc] = (0, import_react.useState)(SAMPLE_DOC);
	const [cluster, setCluster] = (0, import_react.useState)("casting");
	const [subjectIndex, setSubjectIndex] = (0, import_react.useState)(0);
	const [focusPath, setFocusPath] = (0, import_react.useState)("subjects.0.subject_id");
	const [currentId, setCurrentId] = (0, import_react.useState)(null);
	const [pane, setPane] = (0, import_react.useState)("forge");
	const [libraryOpen, setLibraryOpen] = (0, import_react.useState)(false);
	const [library, setLibrary] = (0, import_react.useState)([]);
	const [customSnippets, setCustomSnippets] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("Sample loaded. Jump to a cluster, or paste over the source.");
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [jsonMode, setJsonMode] = (0, import_react.useState)("peek");
	const [confirmNew, setConfirmNew] = (0, import_react.useState)(false);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const [untouched, setUntouched] = (0, import_react.useState)(true);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [draftTitle, setDraftTitle] = (0, import_react.useState)("");
	const [draftBody, setDraftBody] = (0, import_react.useState)("");
	const [draftCategory, setDraftCategory] = (0, import_react.useState)("medium");
	const [characters, setCharacters] = (0, import_react.useState)([]);
	const [bookmarks, setBookmarks] = (0, import_react.useState)([]);
	const [assetFilter, setAssetFilter] = (0, import_react.useState)("all");
	const [assetShelf, setAssetShelf] = (0, import_react.useState)("saved");
	const [lookFilter, setLookFilter] = (0, import_react.useState)("pose");
	const [poseGalleryOpen, setPoseGalleryOpen] = (0, import_react.useState)(false);
	const [cameraGalleryOpen, setCameraGalleryOpen] = (0, import_react.useState)(false);
	const [lightingGalleryOpen, setLightingGalleryOpen] = (0, import_react.useState)(false);
	const [wardrobeGalleryOpen, setWardrobeGalleryOpen] = (0, import_react.useState)(false);
	const [appliedOutfitId, setAppliedOutfitId] = (0, import_react.useState)(null);
	const [customOutfits, setCustomOutfits] = (0, import_react.useState)([]);
	const [lookSearch, setLookSearch] = (0, import_react.useState)("");
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [bookmarkOpen, setBookmarkOpen] = (0, import_react.useState)(false);
	const [bookmarkName, setBookmarkName] = (0, import_react.useState)("");
	const [bookmarkTags, setBookmarkTags] = (0, import_react.useState)([]);
	const [tagDraft, setTagDraft] = (0, import_react.useState)("");
	const [photoPreview, setPhotoPreview] = (0, import_react.useState)(null);
	const [photoBlob, setPhotoBlob] = (0, import_react.useState)(null);
	const [photoError, setPhotoError] = (0, import_react.useState)("");
	const [savingBookmark, setSavingBookmark] = (0, import_react.useState)(false);
	const [accountReady, setAccountReady] = (0, import_react.useState)(false);
	const imagesSynced = (0, import_react.useRef)(false);
	const { user, isPending } = useCurrentUserState();
	const userId = user?.id ?? null;
	const slot = Math.min(subjectIndex, Math.max(doc.subjects.length - 1, 0));
	const active = clusterById(cluster);
	(0, import_react.useEffect)(() => {
		async function refreshCustomOutfits() {
			const outfits = await loadCustomOutfits();
			setCustomOutfits(outfits);
		}
		refreshCustomOutfits();
		window.addEventListener(CUSTOM_LIBRARY_CHANGE_EVENT, refreshCustomOutfits);
		return () => window.removeEventListener(CUSTOM_LIBRARY_CHANGE_EVENT, refreshCustomOutfits);
	}, []);
	const shelfLooks = (0, import_react.useMemo)(() => {
		const base = looksFor(lookFilter);
		if (lookFilter === "wardrobe" && customOutfits.length > 0) return [...customOutfits.map(customOutfitToLook), ...base];
		return base;
	}, [lookFilter, customOutfits]);
	(0, import_react.useEffect)(() => {
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
				if (!snap.draft && snap.library.length === 0 && snap.snippets.length === 0 && snap.characters.length === 0 && snap.bookmarks.length === 0) applyLocal();
				else {
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
		hydrate();
		return () => {
			cancelled = true;
		};
	}, [isPending, userId]);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		const draft = {
			title,
			source,
			doc,
			cluster,
			subjectIndex: slot,
			currentId
		};
		saveDraft(draft);
		if (!accountReady) return;
		const handle = window.setTimeout(() => {
			saveCloudBlob({ data: {
				kind: "draft",
				payload: draft
			} }).catch(() => void 0);
		}, 600);
		return () => window.clearTimeout(handle);
	}, [
		ready,
		accountReady,
		title,
		source,
		doc,
		cluster,
		slot,
		currentId
	]);
	(0, import_react.useEffect)(() => {
		if (!accountReady) return;
		const handle = window.setTimeout(() => {
			saveCloudBlob({ data: {
				kind: "library",
				payload: library
			} }).catch(() => void 0);
			saveCloudBlob({ data: {
				kind: "snippets",
				payload: customSnippets
			} }).catch(() => void 0);
			saveCloudBlob({ data: {
				kind: "characters",
				payload: characters
			} }).catch(() => void 0);
			saveCloudBlob({ data: {
				kind: "bookmarks",
				payload: bookmarks
			} }).catch(() => void 0);
		}, 500);
		return () => window.clearTimeout(handle);
	}, [
		accountReady,
		library,
		customSnippets,
		characters,
		bookmarks
	]);
	(0, import_react.useEffect)(() => {
		if (!accountReady || imagesSynced.current) return;
		imagesSynced.current = true;
		for (const bookmark of bookmarks) {
			if (!bookmark.hasImage) continue;
			loadImage(bookmark.id).then(async (blob) => {
				if (!blob) return;
				await saveBookmarkImage({ data: {
					id: bookmark.id,
					data: await blobToBase64(blob)
				} });
			}).catch(() => void 0);
		}
	}, [accountReady, bookmarks]);
	(0, import_react.useEffect)(() => {
		function onKey(event) {
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
	const json = (0, import_react.useMemo)(() => toJson(doc), [doc]);
	const filled = countFilled(doc);
	const snippets = (0, import_react.useMemo)(() => {
		const all = [...customSnippets, ...SEED_SNIPPETS];
		if (filter === "all") return all;
		return all.filter((item) => item.category === filter);
	}, [customSnippets, filter]);
	const knownTags = (0, import_react.useMemo)(() => {
		const seen = /* @__PURE__ */ new Map();
		for (const item of bookmarks) for (const tag of item.tags) {
			const key = tag.toLowerCase();
			if (!seen.has(key)) seen.set(key, tag);
		}
		return [...seen.values()].sort((a, b) => a.localeCompare(b));
	}, [bookmarks]);
	const shownBookmarks = (0, import_react.useMemo)(() => {
		if (assetFilter === "all") return bookmarks;
		if (assetFilter === "pieces") return [];
		return bookmarks.filter((item) => item.tags.some((tag) => tag.toLowerCase() === assetFilter));
	}, [assetFilter, bookmarks]);
	function openCluster(id, index = slot) {
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
		if ((source.trim().length > 0 || filled > 0) && !confirmNew) {
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
			const next = library.map((item) => item.id === currentId ? {
				...item,
				title: nextTitle,
				source,
				doc,
				updatedAt: now
			} : item);
			setLibrary(next);
			saveLibrary(next);
			setStatus("Updated in the library.");
			return;
		}
		const id = crypto.randomUUID();
		const next = [{
			id,
			title: nextTitle,
			source,
			doc,
			createdAt: now,
			updatedAt: now
		}, ...library];
		setCurrentId(id);
		setLibrary(next);
		saveLibrary(next);
		setStatus("Saved to the library.");
	}
	function onLoad(item) {
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
	function onDelete(id) {
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
	function saveField(field) {
		const resolved = resolvePath(field.path, slot);
		const value = getAt(doc, resolved);
		const body = Array.isArray(value) ? value.filter(Boolean).join("\n") : value.trim();
		if (!body) {
			setStatus(`${field.label} is empty.`);
			return;
		}
		const next = [{
			id: crypto.randomUUID(),
			title: body.split("\n")[0]?.trim().slice(0, 42) || field.label,
			body,
			category: cluster,
			custom: true
		}, ...customSnippets];
		setCustomSnippets(next);
		saveSnippets(next);
		setStatus(`Saved ${field.label} to assets.`);
	}
	function addSnippet() {
		const body = draftBody.trim();
		const name = draftTitle.trim();
		if (!body || !name) return;
		const next = [{
			id: crypto.randomUUID(),
			title: name,
			body,
			category: draftCategory,
			custom: true
		}, ...customSnippets];
		setCustomSnippets(next);
		saveSnippets(next);
		setDraftTitle("");
		setDraftBody("");
		setAdding(false);
		setStatus(`Asset “${name}” saved.`);
	}
	function removeSnippet(id) {
		const next = customSnippets.filter((item) => item.id !== id);
		setCustomSnippets(next);
		saveSnippets(next);
		setPicked((current) => current.filter((key) => key !== `s:${id}`));
	}
	function addSubject() {
		const index = doc.subjects.length;
		setDoc((current) => ({
			...current,
			subjects: [...current.subjects, emptySubject()]
		}));
		setSubjectIndex(index);
		setCluster("casting");
		setFocusPath(`subjects.${index}.subject_id`);
	}
	function removeSubject() {
		if (doc.subjects.length <= 1) return;
		setDoc((current) => ({
			...current,
			subjects: current.subjects.filter((_, index) => index !== slot)
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
		if (active.group === "Subject") {
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
	function addTag(raw) {
		const next = normalizeTag(raw);
		if (!next) return;
		const label = knownTags.find((tag) => tag.toLowerCase() === next.toLowerCase()) ?? next;
		setBookmarkTags((current) => current.some((tag) => tag.toLowerCase() === label.toLowerCase()) ? current : [...current, label]);
		setTagDraft("");
	}
	function removeTag(label) {
		setBookmarkTags((current) => current.filter((tag) => tag.toLowerCase() !== label.toLowerCase()));
	}
	async function onPhoto(file) {
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
		const existing = bookmarks.find((item) => person ? item.kind === "subject" && item.name.toLowerCase() === name.toLowerCase() : item.kind === "section" && item.cluster === cluster && item.name.toLowerCase() === name.toLowerCase());
		const id = existing?.id ?? crypto.randomUUID();
		setSavingBookmark(true);
		let hasImage = existing?.hasImage ?? false;
		let photoNote = "";
		if (photoBlob) try {
			await saveImage(id, photoBlob);
			hasImage = true;
			if (userId) await saveBookmarkImage({ data: {
				id,
				data: await blobToBase64(photoBlob)
			} });
		} catch {
			photoNote = " The photo couldn't be stored.";
			hasImage = existing?.hasImage ?? false;
		}
		const item = {
			id,
			name,
			tags: bookmarkTags,
			cluster,
			kind,
			subject,
			fields,
			hasImage,
			createdAt: existing?.createdAt ?? Date.now()
		};
		const next = existing ? bookmarks.map((entry) => entry.id === id ? item : entry) : [item, ...bookmarks];
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
	function removeBookmark(id) {
		const next = bookmarks.filter((item) => item.id !== id);
		setBookmarks(next);
		saveBookmarks(next);
		setPicked((current) => current.filter((key) => key !== `b:${id}`));
		deleteImage(id).catch(() => void 0);
		if (userId) deleteBookmarkImage({ data: id }).catch(() => void 0);
	}
	function removeCharacter(id) {
		const next = characters.filter((item) => item.id !== id);
		setCharacters(next);
		saveCharacters(next);
		setPicked((current) => current.filter((key) => key !== `c:${id}`));
	}
	function togglePick(key) {
		setPicked((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
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
					if (next.subjects.length === 1 && !subjectFilled(next.subjects[0] ?? emptySubject()) && !wroteSnippets) {
						next = {
							...next,
							subjects: [subject]
						};
						snippetSlot = 0;
					} else {
						next = {
							...next,
							subjects: [...next.subjects, subject]
						};
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
				if (next.subjects.length === 1 && !subjectFilled(next.subjects[0] ?? emptySubject()) && !wroteSnippets) {
					next = {
						...next,
						subjects: [subject]
					};
					snippetSlot = 0;
				} else {
					next = {
						...next,
						subjects: [...next.subjects, subject]
					};
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
	async function onCopy(kind) {
		await copyText(kind === "json" ? json : toPromptLine(doc));
		setCopied(kind);
		window.setTimeout(() => setCopied(null), 1400);
	}
	function onApplyLook(look) {
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
			setStatus(`${look.name} applied to lighting.`);
		} else if (look.kind === "wardrobe") {
			setCluster("wardrobe");
			if (look.outfitId) setAppliedOutfitId(look.outfitId);
			setStatus(`${look.name} applied to wardrobe.`);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "shrink-0 border-b border-border bg-raised",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 px-3 py-2 lg:h-14",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex size-9 items-center justify-center rounded-md bg-primary text-primary-fg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
										className: "size-5",
										"aria-hidden": "true"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-base font-semibold tracking-tight",
									children: "Prompt Forge"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Prompt title",
								value: title,
								onChange: (event) => setTitle(event.target.value),
								className: "min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-faint",
								placeholder: "Untitled"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto hidden items-center gap-2 lg:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
									confirmNew,
									onNew,
									onSave,
									onLibrary: () => setLibraryOpen(true),
									compact: false
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountSlot, {})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2 px-3 pb-2 lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
							confirmNew,
							onNew,
							onSave,
							onLibrary: () => setLibraryOpen(true),
							compact: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountSlot, { compact: true }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 border-t border-border lg:hidden",
						children: [
							["source", "Source"],
							["forge", "Structure"],
							["assets", "Assets"]
						].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPane(id),
							className: cn("h-11 text-sm font-medium", pane === id ? "border-b-2 border-primary text-primary" : "text-muted"),
							"aria-pressed": pane === id,
							children: label
						}, id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: cn("min-h-0 min-w-0 flex-col border-border lg:flex lg:w-80 lg:shrink-0 lg:border-r", pane === "source" ? "flex" : "hidden lg:flex"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 px-4 pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-medium",
									children: "Source"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "A paragraph, tag soup, or your JSON."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-ghost",
									onClick: loadSample,
									children: "Sample"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "min-h-0 flex-1 px-4 pt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									id: "source-input",
									value: source,
									onChange: (event) => {
										setSource(event.target.value);
										setUntouched(false);
										setConfirmNew(false);
									},
									onFocus: (event) => {
										if (untouched) event.currentTarget.select();
									},
									placeholder: "Paste a prompt or the full JSON…",
									className: "field h-full min-h-48 resize-none",
									"aria-label": "Raw prompt"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "shrink-0 space-y-2 px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-faint",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums",
											children: [source.length, " characters"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden lg:inline",
											children: "Ctrl + Enter"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										id: "parse-button",
										type: "button",
										className: "btn btn-primary w-full",
										onClick: runParse,
										children: "Parse & Standardize"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										"aria-live": "polite",
										children: status
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: cn("min-h-0 min-w-0 flex-1 flex-col", pane === "forge" ? "flex" : "hidden lg:flex"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-h-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "hidden w-44 shrink-0 overflow-y-auto border-r border-border lg:block",
								"aria-label": "Clusters",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClusterMenu, {
									doc,
									slot,
									active: cluster,
									onPick: openCluster
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-h-0 min-w-0 flex-1 flex-col",
								children: [jsonMode !== "full" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "shrink-0 border-b border-border lg:hidden",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex gap-2 overflow-x-auto px-3 pt-3",
											children: CLUSTER_GROUPS.map((group) => {
												const selected = active.group === group;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														const first = CLUSTERS.find((item) => item.group === group);
														if (first) openCluster(first.id);
													},
													className: cn("h-11 shrink-0 rounded-full px-3 text-sm font-medium", selected ? "bg-primary text-primary-fg" : "border border-border text-muted"),
													children: group === "Aesthetic DNA" ? "Aesthetic" : group
												}, group);
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex gap-2 overflow-x-auto px-3 py-2",
											children: CLUSTERS.filter((item) => item.group === active.group).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => openCluster(item.id),
												className: cn("h-11 shrink-0 rounded-full px-3 text-sm", item.id === cluster ? "bg-surface text-primary" : "border border-border text-muted"),
												children: item.label
											}, item.id))
										})]
									}),
									active.group === "Subject" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex shrink-0 items-center gap-2 overflow-x-auto px-4 pt-3",
										children: [
											doc.subjects.map((subject, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setSubjectIndex(index),
												className: cn("h-11 shrink-0 rounded-full px-3 text-sm", index === slot ? "bg-primary text-primary-fg" : "border border-border text-muted"),
												children: subject.subject_id.trim() || `Subject ${index + 1}`
											}, index)),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "btn btn-ghost shrink-0",
												onClick: addSubject,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add"]
											}),
											doc.subjects.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "btn btn-ghost shrink-0",
												onClick: removeSubject,
												children: "Remove"
											}) : null
										]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex shrink-0 items-end justify-between gap-3 px-4 pt-4 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium tracking-wide text-faint",
											children: active.group
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-base font-medium",
											children: active.label
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												(cluster === "framing" || cluster === "optics") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setCameraGalleryOpen(true),
													className: "flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Camera Gallery" })]
												}),
												cluster === "key" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setLightingGalleryOpen(true),
													className: "flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all shadow-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SunMedium, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lighting Studio (27)" })]
												}),
												cluster === "posture" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setPoseGalleryOpen(true),
													className: "flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all shadow-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pose Gallery" })]
												}),
												cluster === "wardrobe" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setWardrobeGalleryOpen(true),
													className: "flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all shadow-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Wardrobe Studio (213 Pieces & 49 Outfits)" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													className: "btn btn-ghost",
													"aria-label": "Bookmark this section",
													onClick: openBookmark,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, { className: "size-4" }), "Bookmark"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-sm text-faint tabular-nums",
													children: [filled, " filled"]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4",
										children: active.fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldCard, {
											field,
											doc,
											slot,
											onFocus: setFocusPath,
											onChange: (value) => setDoc(setAt(doc, resolvePath(field.path, slot), value)),
											onSave: () => saveField(field)
										}, field.path))
									})
								] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonBlock, {
									json,
									copied,
									mode: jsonMode,
									onCopy,
									onMode: setJsonMode
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: cn("min-h-0 min-w-0 flex-col border-border lg:flex lg:w-72 lg:shrink-0 lg:border-l", pane === "assets" ? "flex" : "hidden lg:flex"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "shrink-0 px-4 pt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-base font-medium",
										children: "Assets"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-pressed": assetShelf === "saved",
											onClick: () => setAssetShelf("saved"),
											className: cn("h-11 rounded-md text-sm font-medium", assetShelf === "saved" ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted"),
											children: "Saved"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-pressed": assetShelf === "looks",
											onClick: () => setAssetShelf("looks"),
											className: cn("h-11 rounded-md text-sm font-medium", assetShelf === "looks" ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted"),
											children: "Looks"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted",
										children: assetShelf === "looks" ? lookFilter === "pose" || lookFilter === "adult" ? `A click writes the pose onto ${doc.subjects[slot]?.subject_id.trim() || `Subject ${slot + 1}`}.` : "A click writes the angle, light, or setting. The person stays as they are." : "Pick cards across tags. Apply drops them into this prompt in the order you chose."
									})
								]
							}),
							assetShelf === "looks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex shrink-0 gap-2 overflow-x-auto px-4 py-3",
								children: LOOK_FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setLookFilter(item.id),
									"aria-pressed": lookFilter === item.id,
									className: cn("h-11 shrink-0 rounded-full px-3 text-sm font-medium", lookFilter === item.id ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted"),
									children: item.label
								}, item.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex shrink-0 gap-2 overflow-x-auto px-4 py-3",
								children: [
									{
										id: "all",
										label: "All"
									},
									...knownTags.map((tag) => ({
										id: tag.toLowerCase(),
										label: tag
									})),
									{
										id: "pieces",
										label: "Pieces"
									}
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setAssetFilter(item.id),
									"aria-pressed": assetFilter === item.id,
									className: cn("h-11 shrink-0 rounded-full px-3 text-sm font-medium", assetFilter === item.id ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted"),
									children: item.label
								}, item.id))
							}), assetFilter === "pieces" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex shrink-0 gap-2 overflow-x-auto px-4 pb-3",
								children: FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setFilter(item.id),
									className: cn("h-11 shrink-0 rounded-full px-3 text-sm font-medium", filter === item.id ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted"),
									children: item.label
								}, item.id))
							}) : null] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("min-h-0 flex-1 overflow-y-auto px-4 pb-3", assetShelf === "looks" ? "" : "space-y-2"),
								children: assetShelf === "looks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										lookFilter === "angle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setCameraGalleryOpen(true),
											className: "flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Browse Camera & Optics Gallery (27 Angles)" })]
										}) : lookFilter === "light" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setLightingGalleryOpen(true),
											className: "flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SunMedium, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Browse Visual Lighting Studio (27 Setups)" })]
										}) : lookFilter === "wardrobe" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setWardrobeGalleryOpen(true),
											className: "flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Browse Wardrobe Studio (213 Pieces & 49 Outfits)" })]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setPoseGalleryOpen(true),
											className: "flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Browse Full Pose Gallery (Large View)" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: lookSearch,
													onChange: (e) => setLookSearch(e.target.value),
													placeholder: "Search in shelf (e.g. rembrandt, low angle, 85mm)...",
													className: "w-full rounded-md border border-border bg-bg py-1.5 pl-8 pr-3 text-xs text-foreground placeholder-muted focus:border-primary focus:outline-none"
												}),
												lookSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setLookSearch(""),
													className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 gap-2",
											children: shelfLooks.filter((look) => {
												if (!lookSearch.trim()) return true;
												const q = lookSearch.toLowerCase();
												return look.name.toLowerCase().includes(q) || look.subtitle && look.subtitle.toLowerCase().includes(q) || look.posture && look.posture.toLowerCase().includes(q) || look.principle && look.principle.toLowerCase().includes(q) || look.axis && look.axis.toLowerCase().includes(q) || look.style && look.style.toLowerCase().includes(q) || look.fixture && look.fixture.toLowerCase().includes(q) || look.badge && look.badge.toLowerCase().includes(q) || look.id.toLowerCase().includes(q);
											}).map((look) => {
												const on = lookIsApplied(doc, look, slot);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => onApplyLook(look),
													"aria-pressed": on,
													className: cn("group overflow-hidden rounded-lg border bg-surface text-left transition-all hover:border-primary/60", on ? "border-primary ring-1 ring-primary/40 shadow-sm" : "border-border"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "aspect-[4/5] bg-bg relative",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoseCardVisual, {
															image: look.image,
															id: look.id,
															name: look.name,
															subtitle: look.subtitle,
															category: look.category,
															stance: look.stance,
															badge: look.badge,
															active: on
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "p-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-between gap-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-xs font-semibold truncate group-hover:text-primary",
																children: look.name
															}), on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-primary shrink-0" })]
														}), look.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[10px] text-muted truncate mt-0.5",
															children: look.subtitle
														})]
													})]
												}, look.id);
											})
										})
									]
								}) : assetFilter === "pieces" ? snippets.map((snippet) => {
									const key = `s:${snippet.id}`;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetCard, {
										eyebrow: snippet.category === "note" ? "Note" : clusterById(snippet.category).label,
										title: snippet.title,
										body: snippet.body,
										picked: picked.includes(key),
										onPick: () => togglePick(key),
										onDelete: snippet.custom ? () => removeSnippet(snippet.id) : void 0
									}, snippet.id);
								}) : shownBookmarks.length === 0 && (assetFilter !== "all" || characters.length === 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: assetFilter === "all" ? "Nothing bookmarked yet. Use Bookmark on the open section. A subject saves the whole person. Any other section saves just that block." : "Nothing uses that tag yet."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [shownBookmarks.map((bookmark) => {
									const key = `b:${bookmark.id}`;
									const body = bookmark.kind === "subject" && bookmark.subject ? characterBlurb(bookmark.subject) : sectionBlurb(bookmark.fields);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetCard, {
										eyebrow: bookmark.kind === "subject" ? "Subject" : clusterById(bookmark.cluster).label,
										title: bookmark.name,
										body: body || "No details yet",
										tags: bookmark.tags,
										imageId: bookmark.hasImage ? bookmark.id : void 0,
										remote: Boolean(userId),
										picked: picked.includes(key),
										onPick: () => togglePick(key),
										onDelete: () => removeBookmark(bookmark.id)
									}, bookmark.id);
								}), assetFilter === "all" ? characters.map((character) => {
									const key = `c:${character.id}`;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetCard, {
										eyebrow: "Character",
										title: character.name,
										body: characterBlurb(character.subject) || "No details yet",
										picked: picked.includes(key),
										onPick: () => togglePick(key),
										onDelete: () => removeCharacter(character.id)
									}, character.id);
								}) : null] })
							}),
							assetShelf === "saved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "shrink-0 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 px-3 py-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mr-auto text-sm text-muted tabular-nums",
											children: [picked.length, " selected"]
										}),
										picked.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "btn btn-ghost",
											onClick: () => setPicked([]),
											children: "Clear"
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "btn btn-primary",
											disabled: picked.length === 0,
											onClick: applySelected,
											children: "Apply"
										})
									]
								}), assetFilter === "pieces" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border-t border-border p-3",
									children: adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										className: "space-y-2",
										onSubmit: (event) => {
											event.preventDefault();
											addSnippet();
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												"aria-label": "Snippet title",
												value: draftTitle,
												onChange: (event) => setDraftTitle(event.target.value),
												placeholder: "Title",
												className: "field"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												"aria-label": "Snippet cluster",
												value: draftCategory,
												onChange: (event) => setDraftCategory(event.target.value),
												className: "field",
												children: [CLUSTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: item.id,
													children: [
														item.group,
														" — ",
														item.label
													]
												}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "note",
													children: "Note — inserts into the open field"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												"aria-label": "Snippet text",
												value: draftBody,
												onChange: (event) => setDraftBody(event.target.value),
												placeholder: "Reusable text",
												rows: 3,
												className: "field resize-y"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "submit",
													className: "btn btn-primary flex-1",
													disabled: !draftTitle.trim() || !draftBody.trim(),
													children: "Save snippet"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "btn btn-ghost",
													onClick: () => setAdding(false),
													children: "Cancel"
												})]
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "btn btn-ghost w-full",
										onClick: () => setAdding(true),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New snippet"]
									})
								}) : null]
							}) : null
						]
					})
				]
			}),
			bookmarkOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-end justify-center bg-bg/80 lg:items-center lg:p-6",
				onClick: closeBookmark,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "bookmark-title",
					className: "flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-t-xl border border-border bg-raised lg:rounded-xl",
					onClick: (event) => event.stopPropagation(),
					onSubmit: (event) => {
						event.preventDefault();
						commitBookmark();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								id: "bookmark-title",
								className: "text-base font-medium",
								children: ["Bookmark ", active.group === "Subject" ? "subject" : active.label]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "ml-auto flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-fg",
								"aria-label": "Close bookmark",
								onClick: closeBookmark,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: active.group === "Subject" ? "Saves this whole subject. The photo stays on the card and is not sent with the prompt." : `Saves ${active.label} as it is right now. Applying it replaces that section. The photo is only for you.`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": "Bookmark name",
										value: bookmarkName,
										onChange: (event) => setBookmarkName(event.target.value),
										className: "field"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium",
											children: "Tags"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												"aria-label": "New tag",
												value: tagDraft,
												onChange: (event) => setTagDraft(event.target.value),
												onKeyDown: (event) => {
													if (event.key === "Enter" || event.key === ",") {
														event.preventDefault();
														addTag(tagDraft);
													}
												},
												placeholder: "Type a tag",
												className: "field"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "btn btn-ghost shrink-0",
												onClick: () => addTag(tagDraft),
												children: "Add"
											})]
										}),
										bookmarkTags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-2",
											children: bookmarkTags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "inline-flex h-11 items-center gap-2 rounded-full bg-primary px-3 text-sm font-medium text-primary-fg",
												onClick: () => removeTag(tag),
												children: [
													tag,
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "sr-only",
														children: ["Remove ", tag]
													})
												]
											}, tag))
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-faint",
											children: "No tags yet. Add one, or tap a tag you already use."
										}),
										knownTags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-2 pt-1",
											children: knownTags.map((tag) => {
												const on = bookmarkTags.some((item) => item.toLowerCase() === tag.toLowerCase());
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-pressed": on,
													className: cn("h-11 rounded-full px-3 text-sm font-medium", on ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted"),
													onClick: () => on ? removeTag(tag) : addTag(tag),
													children: tag
												}, tag);
											})
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium",
											children: "Photo"
										}),
										photoPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: photoPreview,
											alt: "",
											className: "h-36 w-full rounded-lg object-cover"
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "btn btn-ghost flex-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" }),
													photoPreview ? "Replace photo" : "Add photo",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "file",
														accept: "image/*",
														className: "sr-only",
														onChange: (event) => {
															const file = event.target.files?.[0];
															event.target.value = "";
															onPhoto(file);
														}
													})
												]
											}), photoPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "btn btn-ghost",
												onClick: forgetPhoto,
												children: "Remove"
											}) : null]
										}),
										photoError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted",
											children: photoError
										}) : null
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-border p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "btn btn-primary w-full",
								disabled: !bookmarkName.trim() || savingBookmark,
								children: savingBookmark ? "Saving" : "Save bookmark"
							})
						})
					]
				})
			}) : null,
			libraryOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex justify-end bg-bg/80",
				onClick: () => setLibraryOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "library-title",
					className: "flex h-full w-full max-w-md flex-col border-l border-border bg-raised",
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "library-title",
								className: "text-base font-medium",
								children: "Library"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "ml-auto flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-fg",
								"aria-label": "Close library",
								onClick: () => setLibraryOpen(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									"aria-label": "Search library",
									value: query,
									onChange: (event) => setQuery(event.target.value),
									placeholder: "Search saved prompts",
									className: "field pl-9"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
							children: library.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Nothing saved yet. Parse a prompt, then use Save to library."
							}) : libraryShown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "No prompts match that search."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2",
								children: libraryShown.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-lg border border-border bg-surface",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => onLoad(item),
										className: "w-full px-3 py-3 text-left",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium",
												children: item.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 line-clamp-2 text-sm text-muted",
												children: item.doc.subjects[0]?.subject_id || "No subject yet"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-xs text-faint tabular-nums",
												children: formatWhen(item.updatedAt)
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-end border-t border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "h-11 px-3 text-sm text-muted hover:text-fg",
											onClick: () => onDelete(item.id),
											children: pendingDelete === item.id ? "Confirm delete" : "Delete"
										})
									})]
								}, item.id))
							})
						})
					]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoseCatalogModal, {
				isOpen: poseGalleryOpen,
				onClose: () => setPoseGalleryOpen(false),
				onSelectPose: (pose) => {
					const matchedLook = LOOKS.find((l) => l.id === pose.id);
					if (matchedLook) onApplyLook(matchedLook);
					else onApplyLook({
						id: pose.id,
						name: pose.name,
						kind: "pose",
						posture: pose.posture,
						props: pose.props,
						category: pose.category,
						stance: pose.stance
					});
				},
				activePosture: doc.subjects[slot]?.kinetic_posture
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraCatalogModal, {
				isOpen: cameraGalleryOpen,
				onClose: () => setCameraGalleryOpen(false),
				onSelectCamera: (item) => {
					const matchedLook = LOOKS.find((l) => l.id === item.id);
					if (matchedLook) onApplyLook(matchedLook);
					else onApplyLook({
						id: item.id,
						name: item.name,
						subtitle: item.subtitle,
						kind: "angle",
						principle: item.principle,
						axis: item.axis,
						lens: item.lens,
						dof: item.dof,
						badge: item.badge
					});
				},
				activePrinciple: doc.scene_composition.framing_doctrine.named_principle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LightingCatalogModal, {
				isOpen: lightingGalleryOpen,
				onClose: () => setLightingGalleryOpen(false),
				onSelectLighting: (item) => {
					const matchedLook = LOOKS.find((l) => l.id === item.id);
					if (matchedLook) onApplyLook(matchedLook);
					else onApplyLook({
						id: item.id,
						name: item.name,
						subtitle: item.subtitle,
						kind: "light",
						style: item.style,
						fixture: item.fixture,
						lightAngle: item.angle,
						shadow: item.shadow,
						practical: item.practical,
						badge: item.badge
					});
				},
				activeStyle: doc.aesthetic_dna.lighting_architecture.lighting_style
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WardrobeCatalogModal, {
				isOpen: wardrobeGalleryOpen,
				onClose: () => setWardrobeGalleryOpen(false),
				onSelectOutfit: (outfit) => {
					const updated = applyWardrobeOutfit(doc, outfit, slot);
					setDoc(updated);
					setAppliedOutfitId(outfit.id);
					setCluster("wardrobe");
					setStatus(`${outfit.name} applied to all wardrobe fields.`);
				},
				onSelectItem: (item) => {
					const updated = applyWardrobeItem(doc, item, slot);
					setDoc(updated);
					setCluster("wardrobe");
					const slotLabel = item.slot.replace("_", " ");
					setStatus(`${item.name} applied to ${slotLabel}.`);
				},
				appliedOutfitId,
				activeOuterwear: doc.subjects[slot]?.wardrobe_architecture?.layering_system?.outerwear,
				activeBaseLayer: doc.subjects[slot]?.wardrobe_architecture?.layering_system?.base_layer,
				activeFootwear: doc.subjects[slot]?.wardrobe_architecture?.footwear
			})
		]
	});
}
function ClusterMenu({ doc, slot, active, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-2",
		children: CLUSTER_GROUPS.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-3 pt-3 pb-1 text-xs font-medium tracking-wide text-faint",
				children: group
			}), CLUSTERS.filter((item) => item.group === group).map((item) => {
				const on = item.id === active;
				const filled = clusterHasContent(doc, item, slot);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPick(item.id),
					className: cn("flex h-11 w-full items-center gap-2 px-3 text-left text-sm", on ? "bg-surface font-medium text-primary" : "text-muted hover:bg-surface hover:text-fg"),
					"aria-current": on ? "true" : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 shrink-0 rounded-full", filled ? "bg-primary" : "bg-border") }), item.label]
				}, item.id);
			})]
		}, group))
	});
}
function FieldCard({ field, doc, slot, onFocus, onChange, onSave }) {
	const path = resolvePath(field.path, slot);
	const value = getAt(doc, path);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: path,
				className: "text-sm font-medium",
				children: field.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "ml-auto flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-fg",
				"aria-label": `Save ${field.label} to assets`,
				onClick: onSave,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" })
			})]
		}), field.kind === "palette" && Array.isArray(value) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaletteField, {
			colors: value,
			onChange
		}) : field.kind === "list" && Array.isArray(value) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			id: path,
			"data-path": path,
			rows: field.rows,
			value: value.join("\n"),
			placeholder: field.hint,
			onFocus: () => onFocus(path),
			onChange: (event) => onChange(event.target.value.split("\n")),
			onBlur: (event) => onChange(event.target.value.split("\n").map((line) => line.trim()).filter(Boolean)),
			className: "field resize-y"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			id: path,
			"data-path": path,
			rows: field.rows,
			value: typeof value === "string" ? value : "",
			placeholder: field.hint,
			onFocus: () => onFocus(path),
			onChange: (event) => onChange(event.target.value),
			className: "field resize-y"
		})]
	});
}
function PaletteField({ colors, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			colors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-faint",
				children: "No swatches yet."
			}) : null,
			colors.map((hex, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": `Palette color ${index + 1}`,
						type: "color",
						value: safeHex(hex),
						onChange: (event) => {
							const next = [...colors];
							next[index] = event.target.value.toUpperCase();
							onChange(next);
						},
						className: "size-11 shrink-0 rounded-md border border-border bg-bg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": `Hex ${index + 1}`,
						value: hex,
						onChange: (event) => {
							const next = [...colors];
							next[index] = event.target.value;
							onChange(next);
						},
						className: "field font-mono"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": `Remove color ${index + 1}`,
						className: "flex size-11 items-center justify-center text-muted hover:text-fg",
						onClick: () => onChange(colors.filter((_, item) => item !== index)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				]
			}, `${hex}-${index}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "btn btn-ghost",
				onClick: () => onChange([...colors, "#C46A3A"]),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add swatch"]
			})
		]
	});
}
function AccountSlot({ compact = false }) {
	const { isPending } = useCurrentUserState();
	if (isPending) return compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-11 w-24 animate-pulse rounded-md bg-surface" });
	if (compact) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-border px-3 py-2 lg:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Sign in to keep this in your account."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "btn btn-primary shrink-0",
				children: "Sign in"
			})]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "btn btn-ghost",
		children: "Sign in"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) })] });
}
function AssetCard({ eyebrow, title, body, tags, imageId, remote = false, picked, onPick, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-lg border bg-surface", picked ? "border-primary" : "border-border"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onPick,
			"aria-pressed": picked,
			className: "flex w-full items-start gap-3 px-3 py-3 text-left",
			children: [
				imageId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPhoto, {
					id: imageId,
					remote
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-primary",
							children: eyebrow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-medium",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-sm text-muted",
							children: body
						}),
						tags && tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-faint",
							children: tags.join(" · ")
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickMark, { on: picked })
			]
		}), onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "flex size-11 items-center justify-center text-muted hover:text-fg",
				"aria-label": `Delete ${title}`,
				onClick: onDelete,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
			})
		}) : null]
	});
}
function BookmarkPhoto({ id, remote }) {
	const [url, setUrl] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		let objectUrl = "";
		(remote ? loadBookmarkImage({ data: id }).then((data) => data ? base64ToBlob(data) : loadImage(id)) : loadImage(id)).then((blob) => {
			if (!alive || !blob) return;
			objectUrl = URL.createObjectURL(blob);
			setUrl(objectUrl);
		}).catch(() => void 0);
		return () => {
			alive = false;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [id, remote]);
	if (!url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-14 shrink-0 rounded-md bg-bg" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: "",
		className: "size-14 shrink-0 rounded-md object-cover"
	});
}
function PickMark({ on }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border", on ? "border-primary bg-primary text-primary-fg" : "border-border bg-bg"),
		"aria-hidden": "true",
		children: on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }) : null
	});
}
function Actions({ confirmNew, onNew, onSave, onLibrary, compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: cn("btn btn-ghost", compact && "w-full px-2"),
			onClick: onNew,
			"aria-label": "New prompt",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlus, { className: "size-4" }), confirmNew ? "Discard?" : compact ? "New" : "New prompt"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: cn("btn btn-ghost", compact && "w-full px-2"),
			onClick: onSave,
			"aria-label": "Save to library",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), compact ? "Save" : "Save to library"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: cn("btn btn-ghost", compact && "w-full px-2"),
			onClick: onLibrary,
			"aria-label": "Open library",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "size-4" }), "Library"]
		})
	] });
}
function JsonBlock({ json, copied, mode, onCopy, onMode }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col overflow-hidden border-t border-border bg-bg", mode === "peek" && "h-52 shrink-0", mode === "full" && "min-h-0 flex-1", mode === "hidden" && "shrink-0"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex shrink-0 flex-wrap items-center gap-2 px-3 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mr-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: "JSON"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-faint",
						children: mode === "full" ? "Full document" : mode === "hidden" ? "Hidden" : "Live — a fraction"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-ghost w-11 px-0",
					"aria-label": mode === "hidden" ? "Show JSON" : "Hide JSON",
					onClick: () => onMode(mode === "hidden" ? "peek" : "hidden"),
					children: mode === "hidden" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-ghost w-11 px-0",
					"aria-label": mode === "full" ? "Show a fraction of the JSON" : "Show the full JSON",
					onClick: () => onMode(mode === "full" ? "peek" : "full"),
					children: mode === "full" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-4" })
				}),
				mode === "hidden" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => onCopy("line"),
					children: [copied === "line" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied === "line" ? "Copied" : "Copy line"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn btn-primary",
					onClick: () => onCopy("json"),
					children: [copied === "json" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied === "json" ? "Copied" : "Copy JSON"]
				})] })
			]
		}), mode === "hidden" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			id: "json-output",
			className: "min-h-0 flex-1 overflow-auto px-4 pb-4 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap",
			children: json.split("\n").map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: colorLine(line) }, index))
		})]
	});
}
function colorLine(line) {
	const match = line.match(/^(\s*)("(?:\\.|[^"\\])*")(\s*:\s*)(.*)$/);
	if (!match) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-faint",
		children: line
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		match[1],
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-primary",
			children: match[2]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-faint",
			children: match[3]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-fg",
			children: match[4]
		})
	] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptForge, {});
}
//#endregion
export { Home as component };
