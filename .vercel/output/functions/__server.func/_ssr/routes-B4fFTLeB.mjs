import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signOut, t as authClient } from "./client-IWHfIGH2.mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { A as saveSnippets, C as loadLibrary, D as saveCharacters, E as saveBookmarks, F as toPromptLine, N as titleFromDoc, O as saveDraft, P as toJson, S as loadDraft, T as resolvePath, _ as getAt, b as loadBookmarks, c as clusterHasContent, d as docFromFlat, g as filledKeys, h as emptySubject, i as authMiddleware, j as setAt, k as saveLibrary, l as coerceDoc, m as emptyFields, n as CLUSTER_GROUPS, p as emptyDoc, r as SECTION_KEYS, s as clusterById, t as CLUSTERS, u as countFilled, v as isNativeDoc, w as loadSnippets, x as loadCharacters } from "./storage-Cb0j-4Jv.mjs";
import { a as hasGateSessionMarker } from "./server-CW2nNadZ.mjs";
import { _ as BookmarkPlus, a as Plus, c as Library, d as FilePlus, f as Copy, g as Bookmark, h as Check, i as Search, l as ImagePlus, m as ChevronDown, o as Minimize2, p as ChevronUp, r as Trash2, s as Maximize2, t as X, u as Flame } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B4fFTLeB.js
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
function pose(id, name, posture, adult = false) {
	return {
		id,
		name,
		kind: "pose",
		adult,
		posture
	};
}
var LOOKS = [
	pose("hip-cock", "Hip cock", "Weight on the left leg, right knee soft, one hand on the hip, shoulders dropped, chin level."),
	pose("pockets", "Hands in pockets", "Standing easy, both hands buried in pockets, weight even, shoulders relaxed."),
	pose("crossed", "Arms crossed", "Standing square, arms folded across the chest, weight even, chin level."),
	pose("stride", "Mid stride", "Walking toward the lens, one leg reaching, the other trailing, arms in an easy swing."),
	pose("crossed-sit", "Legs crossed", "Seated, one knee crossed over the other, one arm along the chair back, torso upright."),
	pose("stool", "Forward lean", "Seated on a stool, elbows on the knees, torso hinged forward, eyes up toward the lens."),
	pose("shoulder", "Over the shoulder", "Back mostly to the lens, head turned over one shoulder, arms relaxed at the sides."),
	pose("hair", "Hands in hair", "Both arms lifted, hands in the hair, elbows wide, weight on one hip."),
	pose("kneel", "Kneeling tall", "Upright on both knees, spine long, hands resting on the thighs."),
	pose("recline", "Side recline", "Lying on one side, head propped on a hand, the other arm along the body, legs softly bent."),
	pose("wall", "Wall lean", "One shoulder against a wall, ankles crossed, arms folded low."),
	pose("crouch", "One knee down", "A low crouch, one knee on the ground, the other foot planted, one forearm across the raised knee."),
	pose("arched", "Arched stand", "Standing with the back deeply arched, hips pressed forward, both arms raised and hands behind the head, chest lifted.", true),
	pose("open-seat", "Seated open", "Seated on the floor, knees fallen open, hands planted behind the hips, torso leaned back.", true),
	pose("all-fours", "All fours", "On hands and knees, spine long with a slight dip, head turned toward the lens.", true),
	pose("lying-back", "Lying back", "Lying on the back, knees bent and apart, one arm resting above the head.", true),
	pose("folded", "Folded forward", "Standing, folded forward at the hips, back flat, hands resting on the thighs.", true),
	pose("knee-up", "Knee raised", "Reclined on one elbow, the far knee raised, the near leg extended.", true),
	pose("kneel-arch", "Kneeling arch", "Upright on both knees, back arched, hips forward, hands resting on the thighs.", true),
	pose("leg-up", "Leg up", "Standing on one leg, the other knee lifted and turned out, held at the thigh.", true),
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
		axis: "camera behind the subject, eye level, face hidden"
	},
	{
		id: "window-light",
		name: "Window light",
		kind: "light",
		style: "soft directional window light",
		fixture: "large window, camera-left",
		lightAngle: "slightly above eye line, slow falloff, open shadows"
	},
	{
		id: "hard-side",
		name: "Hard side",
		kind: "light",
		style: "hard side light, deep shadow on the off side",
		fixture: "small bare source, camera-left",
		lightAngle: "level with the face, fast falloff, little fill"
	},
	{
		id: "rim",
		name: "Rim light",
		kind: "light",
		style: "edge-lit, subject mostly in shadow",
		fixture: "kicker from behind, camera-right",
		lightAngle: "behind the subject, just out of frame, thin bright rim"
	},
	{
		id: "overhead",
		name: "Soft overhead",
		kind: "light",
		style: "large soft overhead, short shadows under the brow and chin",
		fixture: "overhead soft source",
		lightAngle: "straight down, slightly in front, gentle wrap"
	},
	{
		id: "golden",
		name: "Golden hour",
		kind: "light",
		style: "low warm sun, long shadows",
		fixture: "sun near the horizon, camera-left",
		lightAngle: "low, skimming, warm key with a cool open shadow"
	},
	{
		id: "low-key",
		name: "Low key",
		kind: "light",
		style: "low key, one small pool of light, the rest falls off to black",
		fixture: "single practical, close",
		lightAngle: "just above the face, tight falloff, no fill"
	},
	{
		id: "studio",
		name: "Seamless studio",
		kind: "setting",
		location: "seamless paper studio, warm gray cyclorama",
		atmosphere: "clear air, no weather",
		props: []
	},
	{
		id: "sidewalk",
		name: "City sidewalk",
		kind: "setting",
		location: "city sidewalk between mid-rise buildings",
		atmosphere: "clear, late daylight",
		props: ["concrete pavement", "building fronts"]
	},
	{
		id: "window-room",
		name: "Window room",
		kind: "setting",
		location: "plain interior, one tall window",
		atmosphere: "clear indoor air, daylight from the window",
		props: ["bare floor", "tall window"]
	},
	{
		id: "warehouse",
		name: "Warehouse",
		kind: "setting",
		location: "empty warehouse, high ceiling, concrete floor",
		atmosphere: "slight haze, cool daylight from high openings",
		props: ["concrete floor", "distant columns"]
	},
	{
		id: "field",
		name: "Open field",
		kind: "setting",
		location: "open field, horizon low, no buildings",
		atmosphere: "clear, a little wind",
		props: ["tall grass"]
	},
	{
		id: "night-street",
		name: "Night street",
		kind: "setting",
		location: "city street at night",
		atmosphere: "clear night, damp air",
		props: ["wet pavement", "distant streetlights"]
	}
].map((look) => ({
	...look,
	art: FIGURES[look.id]
}));
var LOOK_FILTERS = [
	{
		id: "pose",
		label: "Poses"
	},
	{
		id: "angle",
		label: "Angles"
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
	return LOOKS.filter((look) => look.kind === filter);
}
function applyLook(doc, look, subjectIndex) {
	if (look.kind === "pose") return setAt(doc, `subjects.${subjectIndex}.kinetic_posture`, look.posture ?? "");
	if (look.kind === "angle") {
		const next = setAt(doc, "scene_composition.framing_doctrine.named_principle", look.principle ?? "");
		return setAt(next, "scene_composition.framing_doctrine.camera_elevation_and_axis", look.axis ?? "");
	}
	if (look.kind === "light") {
		let next = setAt(doc, "aesthetic_dna.lighting_architecture.lighting_style", look.style ?? "");
		next = setAt(next, "aesthetic_dna.lighting_architecture.key_source.fixture_or_origin", look.fixture ?? "");
		return setAt(next, "aesthetic_dna.lighting_architecture.key_source.angle_and_elevation", look.lightAngle ?? "");
	}
	let next = setAt(doc, "scene_composition.environmental_staging.location_context", look.location ?? "");
	next = setAt(next, "scene_composition.environmental_staging.atmosphere_and_air_density", look.atmosphere ?? "");
	return setAt(next, "scene_composition.environmental_staging.grounded_props", look.props ?? []);
}
function lookIsApplied(doc, look, subjectIndex) {
	if (look.kind === "pose") return doc.subjects[subjectIndex]?.kinetic_posture === look.posture;
	if (look.kind === "angle") return doc.scene_composition.framing_doctrine.named_principle === look.principle && doc.scene_composition.framing_doctrine.camera_elevation_and_axis === look.axis;
	if (look.kind === "light") return doc.aesthetic_dna.lighting_architecture.lighting_style === look.style && doc.aesthetic_dna.lighting_architecture.key_source.fixture_or_origin === look.fixture;
	return doc.scene_composition.environmental_staging.location_context === look.location;
}
var CLAY = "#d9cbb8";
var INK = "#8c8376";
var AMBER = "#e08a3c";
function ExtraMark({ extra }) {
	if (extra.t === "floor") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
		x1: "10",
		y1: "148",
		x2: "110",
		y2: "148",
		stroke: INK,
		strokeWidth: "2",
		strokeLinecap: "round"
	});
	if (extra.t === "horizon") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
		x1: "8",
		y1: "132",
		x2: "112",
		y2: "132",
		stroke: INK,
		strokeWidth: "2",
		strokeLinecap: "round"
	});
	if (extra.t === "sun") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		stroke: AMBER,
		fill: AMBER,
		strokeLinecap: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: extra.x,
				cy: extra.y,
				r: "5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: extra.x - 11,
				y1: extra.y,
				x2: extra.x - 7,
				y2: extra.y,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: extra.x + 7,
				y1: extra.y,
				x2: extra.x + 11,
				y2: extra.y,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: extra.x,
				y1: extra.y - 11,
				x2: extra.x,
				y2: extra.y - 7,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: extra.x,
				y1: extra.y + 7,
				x2: extra.x,
				y2: extra.y + 11,
				strokeWidth: "2"
			})
		]
	});
	if (extra.t === "window") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		stroke: AMBER,
		fill: "none",
		strokeWidth: "2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: extra.x,
				y: extra.y,
				width: "22",
				height: "36",
				rx: "1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: extra.x + 11,
				y1: extra.y,
				x2: extra.x + 11,
				y2: extra.y + 36
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: extra.x,
				y1: extra.y + 18,
				x2: extra.x + 22,
				y2: extra.y + 18
			})
		]
	});
	if (extra.t === "block") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x: extra.x,
		y: extra.y,
		width: extra.w,
		height: extra.h,
		fill: "none",
		stroke: INK,
		strokeWidth: "2"
	});
	if (extra.t === "cam") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		stroke: AMBER,
		fill: "none",
		strokeWidth: "2",
		strokeLinecap: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: extra.x,
			y: extra.y,
			width: "16",
			height: "10",
			rx: "2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: extra.x + 16,
			y1: extra.y + 5,
			x2: extra.x + 26,
			y2: extra.y + 5 + extra.rot / 8
		})]
	});
}
function PoseArt({ art }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 120 156",
		className: "h-full w-full",
		"aria-hidden": "true",
		children: [
			art.extras?.map((extra, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExtraMark, { extra }, index)),
			art.limbs.map((limb, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: limb[0],
				y1: limb[1],
				x2: limb[2],
				y2: limb[3],
				stroke: CLAY,
				strokeWidth: limb[4] ?? 7,
				strokeLinecap: "round"
			}, index)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: art.head[0],
				cy: art.head[1],
				r: art.head[2],
				fill: CLAY
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
		label: "Light"
	},
	{
		id: "accent",
		label: "Accents"
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
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "btn btn-ghost",
												"aria-label": "Bookmark this section",
												onClick: openBookmark,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, { className: "size-4" }), "Bookmark"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-faint tabular-nums",
												children: [filled, " filled"]
											})]
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
								children: assetShelf === "looks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-2",
									children: looksFor(lookFilter).map((look) => {
										const on = lookIsApplied(doc, look, slot);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => onApplyLook(look),
											"aria-pressed": on,
											className: cn("overflow-hidden rounded-md border bg-surface text-left", on ? "border-primary" : "border-border"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "aspect-[4/5] bg-bg",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoseArt, { art: look.art })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "px-2 py-2 text-sm font-medium",
												children: look.name
											})]
										}, look.id);
									})
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
			}) : null
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
