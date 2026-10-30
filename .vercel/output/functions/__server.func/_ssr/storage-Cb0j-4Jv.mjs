import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storage-Cb0j-4Jv.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-IWHfIGH2.mjs").then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-TskHf1Od.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var SECTION_KEYS = [
	"subject",
	"appearance",
	"clothing",
	"pose",
	"background",
	"foreground",
	"style",
	"lighting",
	"camera",
	"extra"
];
function emptyFields() {
	return {
		subject: "",
		appearance: "",
		clothing: "",
		pose: "",
		background: "",
		foreground: "",
		style: "",
		lighting: "",
		camera: "",
		extra: ""
	};
}
function filledKeys(fields) {
	return SECTION_KEYS.filter((key) => fields[key].trim().length > 0);
}
function coerceFields(value) {
	const fields = emptyFields();
	if (!value || typeof value !== "object") return fields;
	const record = value;
	for (const key of SECTION_KEYS) {
		const item = record[key];
		if (typeof item === "string") fields[key] = item;
	}
	return fields;
}
var CLUSTER_IDS = [
	"medium",
	"optics",
	"key",
	"fill",
	"accent",
	"color",
	"framing",
	"planes",
	"environment",
	"casting",
	"posture",
	"wardrobe",
	"interaction",
	"thesis",
	"exclusions"
];
var text = (path, label, hint, rows = 2) => ({
	path,
	label,
	hint,
	kind: "text",
	rows
});
var CLUSTERS = [
	{
		id: "medium",
		group: "Aesthetic DNA",
		label: "Medium",
		fields: [text("aesthetic_dna.medium_format", "Medium format", "35mm film, woodblock, screenprint, gouache", 2)]
	},
	{
		id: "optics",
		group: "Aesthetic DNA",
		label: "Optics",
		fields: [
			text("aesthetic_dna.optics.lens_type_and_focal_length", "Lens & focal length", "50mm spherical, 85mm"),
			text("aesthetic_dna.optics.aperture_and_dof", "Aperture & depth of field", "f/2, shallow focus"),
			text("aesthetic_dna.optics.physical_optical_imperfections", "Optical imperfections", "grain, halation, ink bleed, paper texture")
		]
	},
	{
		id: "key",
		group: "Aesthetic DNA",
		label: "Key light",
		fields: [
			text("aesthetic_dna.lighting_architecture.lighting_style", "Lighting style", "overall contrast scheme"),
			text("aesthetic_dna.lighting_architecture.key_source.fixture_or_origin", "Fixture or origin", "window, sun, bare bulb"),
			text("aesthetic_dna.lighting_architecture.key_source.angle_and_elevation", "Angle & elevation", "45° camera-left, high"),
			text("aesthetic_dna.lighting_architecture.key_source.falloff_and_contrast_ratio", "Falloff & contrast", "fast falloff, 8:1")
		]
	},
	{
		id: "fill",
		group: "Aesthetic DNA",
		label: "Fill & shadow",
		fields: [text("aesthetic_dna.lighting_architecture.fill_and_negative_space.fill_mechanism", "Fill mechanism", "bounce, negative fill, none"), text("aesthetic_dna.lighting_architecture.fill_and_negative_space.shadow_depth", "Shadow depth", "crushed, open, inked")]
	},
	{
		id: "accent",
		group: "Aesthetic DNA",
		label: "Accents",
		fields: [
			text("aesthetic_dna.lighting_architecture.accent_and_practicals.rim_or_kicker", "Rim or kicker", "edge light from behind"),
			text("aesthetic_dna.lighting_architecture.accent_and_practicals.practical_sources", "Practical sources", "candles, neon, fire"),
			text("aesthetic_dna.lighting_architecture.accent_and_practicals.color_temperature_balance", "Color temperature", "warm key, cool fill")
		]
	},
	{
		id: "color",
		group: "Aesthetic DNA",
		label: "Color",
		fields: [{
			path: "aesthetic_dna.color_science.dominant_palette",
			label: "Dominant palette",
			hint: "#hex swatches",
			kind: "palette",
			rows: 2
		}, text("aesthetic_dna.color_science.tonal_behavior", "Tonal behavior", "hue distribution, saturation, paper or print tint", 3)]
	},
	{
		id: "framing",
		group: "Scene",
		label: "Framing",
		fields: [text("scene_composition.framing_doctrine.named_principle", "Named principle", "Worm's-Eye Upward Rake"), text("scene_composition.framing_doctrine.camera_elevation_and_axis", "Elevation & axis", "low, tilted up, centered")]
	},
	{
		id: "planes",
		group: "Scene",
		label: "Planes",
		fields: [
			text("scene_composition.framing_doctrine.spatial_planes.foreground_obstruction", "Foreground obstruction", "what cuts the frame"),
			text("scene_composition.framing_doctrine.spatial_planes.midground_interaction", "Midground interaction", "where the action sits"),
			text("scene_composition.framing_doctrine.spatial_planes.background_depth", "Background depth", "how far the scene recedes")
		]
	},
	{
		id: "environment",
		group: "Scene",
		label: "Environment",
		fields: [
			text("scene_composition.environmental_staging.location_context", "Location", "where this is", 2),
			text("scene_composition.environmental_staging.atmosphere_and_air_density", "Atmosphere", "haze, rain, smoke, clear"),
			{
				path: "scene_composition.environmental_staging.grounded_props",
				label: "Grounded props",
				hint: "One prop per line",
				kind: "list",
				rows: 3
			}
		]
	},
	{
		id: "casting",
		group: "Subject",
		label: "Casting",
		fields: [
			text("subjects.{i}.subject_id", "Subject id", "short name for this figure"),
			text("subjects.{i}.casting_and_physique.demographics_and_features", "Demographics & features", "age, face, eyes, build", 3),
			text("subjects.{i}.casting_and_physique.skin_and_surface_microdetails", "Skin & surface", "pores, scars, freckles, texture"),
			text("subjects.{i}.casting_and_physique.hair_and_grooming", "Hair & grooming", "cut, color, finish")
		]
	},
	{
		id: "posture",
		group: "Subject",
		label: "Posture",
		fields: [text("subjects.{i}.kinetic_posture", "Kinetic posture", "what the body is doing", 3)]
	},
	{
		id: "wardrobe",
		group: "Subject",
		label: "Wardrobe",
		fields: [
			text("subjects.{i}.wardrobe_architecture.layering_system.base_layer", "Base layer", "shirt, underlayer"),
			text("subjects.{i}.wardrobe_architecture.layering_system.mid_layer", "Mid layer", "vest, tunic"),
			text("subjects.{i}.wardrobe_architecture.layering_system.outerwear", "Outerwear", "cloak, coat, armor"),
			text("subjects.{i}.wardrobe_architecture.textiles_and_weight", "Textiles & weight", "wool, silk, leather"),
			text("subjects.{i}.wardrobe_architecture.hardware_and_details", "Hardware", "buckles, stitching, metal"),
			text("subjects.{i}.wardrobe_architecture.wear_and_patina", "Wear & patina", "dust, scuffs, fade"),
			text("subjects.{i}.wardrobe_architecture.footwear", "Footwear", "boots, shoes"),
			{
				path: "subjects.{i}.wardrobe_architecture.accessories",
				label: "Accessories",
				hint: "One accessory per line",
				kind: "list",
				rows: 3
			}
		]
	},
	{
		id: "interaction",
		group: "Subject",
		label: "Interaction",
		fields: [text("subjects.{i}.environmental_interaction", "Environmental interaction", "how they meet the place", 3)]
	},
	{
		id: "thesis",
		group: "Thesis",
		label: "Thesis",
		fields: [text("creative_thesis.narrative_subtext", "Narrative subtext", "what the picture is really about", 3), text("creative_thesis.focal_contradiction", "Focal contradiction", "the tension the frame holds", 3)]
	},
	{
		id: "exclusions",
		group: "Thesis",
		label: "Exclusions",
		fields: [{
			path: "anti_cliche_exclusions",
			label: "Anti-cliché exclusions",
			hint: "One exclusion per line",
			kind: "list",
			rows: 6
		}]
	}
];
var CLUSTER_GROUPS = [
	"Aesthetic DNA",
	"Scene",
	"Subject",
	"Thesis"
];
function emptySubject() {
	return {
		subject_id: "",
		casting_and_physique: {
			demographics_and_features: "",
			skin_and_surface_microdetails: "",
			hair_and_grooming: ""
		},
		kinetic_posture: "",
		wardrobe_architecture: {
			layering_system: {
				base_layer: "",
				mid_layer: "",
				outerwear: ""
			},
			textiles_and_weight: "",
			hardware_and_details: "",
			wear_and_patina: "",
			accessories: [],
			footwear: ""
		},
		environmental_interaction: ""
	};
}
function emptyDoc() {
	return {
		aesthetic_dna: {
			medium_format: "",
			optics: {
				lens_type_and_focal_length: "",
				aperture_and_dof: "",
				physical_optical_imperfections: ""
			},
			lighting_architecture: {
				lighting_style: "",
				key_source: {
					fixture_or_origin: "",
					angle_and_elevation: "",
					falloff_and_contrast_ratio: ""
				},
				fill_and_negative_space: {
					fill_mechanism: "",
					shadow_depth: ""
				},
				accent_and_practicals: {
					rim_or_kicker: "",
					practical_sources: "",
					color_temperature_balance: ""
				}
			},
			color_science: {
				dominant_palette: [],
				tonal_behavior: ""
			}
		},
		scene_composition: {
			framing_doctrine: {
				named_principle: "",
				camera_elevation_and_axis: "",
				spatial_planes: {
					foreground_obstruction: "",
					midground_interaction: "",
					background_depth: ""
				}
			},
			environmental_staging: {
				location_context: "",
				atmosphere_and_air_density: "",
				grounded_props: []
			}
		},
		subjects: [emptySubject()],
		creative_thesis: {
			narrative_subtext: "",
			focal_contradiction: ""
		},
		anti_cliche_exclusions: []
	};
}
function clusterById(id) {
	return CLUSTERS.find((cluster) => cluster.id === id) ?? CLUSTERS[0];
}
function resolvePath(path, subjectIndex) {
	return path.replaceAll("{i}", String(subjectIndex));
}
function getAt(doc, path) {
	const value = path.split(".").reduce((acc, key) => {
		if (acc == null || typeof acc !== "object") return void 0;
		return acc[key];
	}, doc);
	if (Array.isArray(value)) return value.filter((item) => typeof item === "string");
	return typeof value === "string" ? value : "";
}
function setAt(doc, path, value) {
	const clone = structuredClone(doc);
	const parts = path.split(".");
	let cursor = clone;
	for (let i = 0; i < parts.length - 1; i++) {
		const key = parts[i] ?? "";
		const next = cursor[key];
		if (next == null || typeof next !== "object") return doc;
		cursor = next;
	}
	const leaf = parts[parts.length - 1] ?? "";
	cursor[leaf] = value;
	return clone;
}
function clusterHasContent(doc, cluster, subjectIndex) {
	return cluster.fields.some((field) => {
		const value = getAt(doc, resolvePath(field.path, subjectIndex));
		return Array.isArray(value) ? value.some((item) => item.trim()) : value.trim().length > 0;
	});
}
function countFilled(doc) {
	let count = 0;
	const walk = (value) => {
		if (typeof value === "string") {
			if (value.trim()) count += 1;
			return;
		}
		if (Array.isArray(value)) {
			if (!value.some((item) => item && typeof item === "object")) {
				if (value.some((item) => typeof item === "string" && item.trim())) count += 1;
				return;
			}
			for (const item of value) walk(item);
			return;
		}
		if (value && typeof value === "object") for (const child of Object.values(value)) walk(child);
	};
	walk(doc);
	return count;
}
function toJson(doc) {
	return JSON.stringify(doc, null, 2);
}
function titleFromDoc(doc) {
	const subject = doc.subjects[0];
	const raw = subject?.subject_id.trim() || subject?.casting_and_physique.demographics_and_features.trim() || "";
	if (!raw) return "Untitled";
	const line = raw.split(",")[0]?.trim() ?? raw;
	return line.length > 48 ? `${line.slice(0, 48).trim()}…` : line;
}
function toPromptLine(doc) {
	const parts = [];
	const push = (value) => {
		const next = value.trim();
		if (next) parts.push(next);
	};
	push(doc.aesthetic_dna.medium_format);
	for (const subject of doc.subjects) {
		push(subject.subject_id);
		push(subject.casting_and_physique.demographics_and_features);
		push(subject.casting_and_physique.hair_and_grooming);
		push(subject.casting_and_physique.skin_and_surface_microdetails);
		push(subject.wardrobe_architecture.layering_system.outerwear);
		push(subject.kinetic_posture);
		push(subject.environmental_interaction);
	}
	push(doc.scene_composition.environmental_staging.location_context);
	push(doc.scene_composition.framing_doctrine.spatial_planes.foreground_obstruction);
	push(doc.aesthetic_dna.lighting_architecture.lighting_style);
	push(doc.aesthetic_dna.lighting_architecture.accent_and_practicals.rim_or_kicker);
	push(doc.aesthetic_dna.optics.lens_type_and_focal_length);
	push(doc.aesthetic_dna.optics.aperture_and_dof);
	push(doc.scene_composition.framing_doctrine.named_principle);
	const main = parts.join(", ");
	const exclusions = doc.anti_cliche_exclusions.map((item) => item.trim()).filter(Boolean);
	if (exclusions.length === 0) return main;
	const line = exclusions.join(", ");
	return main ? `${main}\nNegative prompt: ${line}` : `Negative prompt: ${line}`;
}
var HEX = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
function bits(text) {
	return text.split(/\s+and\s+|,\s*|\s+over\s+/i).map((part) => part.trim()).filter(Boolean);
}
function join(parts) {
	return parts.map((part) => part.trim()).filter(Boolean).join(", ");
}
function pullHex(text) {
	const hexes = [];
	return {
		hexes,
		rest: text.replace(HEX, (match) => {
			hexes.push(match.toUpperCase());
			return "";
		}).replace(/\s+,/g, ",").replace(/,\s*,/g, ", ").replace(/^,\s*|,\s*$/g, "").trim()
	};
}
function routeAppearance(text, subject) {
	const hair = [];
	const skin = [];
	const demo = [];
	for (const bit of bits(text)) if (/\b(hair|braid|ponytail|bangs|beard|stubble|groom)/i.test(bit)) hair.push(bit);
	else if (/\b(skin|pore|scar|freckle|wrinkle|complexion)/i.test(bit)) skin.push(bit);
	else demo.push(bit);
	subject.casting_and_physique.hair_and_grooming = join(hair);
	subject.casting_and_physique.skin_and_surface_microdetails = join(skin);
	subject.casting_and_physique.demographics_and_features = join(demo);
}
function routeClothing(text, subject) {
	const wardrobe = subject.wardrobe_architecture;
	const base = [];
	const mid = [];
	const outer = [];
	const feet = [];
	const accessories = [];
	const wear = [];
	const textiles = [];
	const hardware = [];
	for (const bit of bits(text)) {
		if (/\b(boots?|shoes?|heels?|footwear)\b/i.test(bit)) feet.push(bit);
		else if (/\b(gloves?|jewelry|necklace|crown|scarf|earrings?|rings?|bracelet)\b/i.test(bit)) accessories.push(bit);
		else if (/\b(shirt|blouse|undershirt)\b/i.test(bit)) base.push(bit);
		else if (/\b(vest|tunic|sweater)\b/i.test(bit)) mid.push(bit);
		else outer.push(bit);
		const worn = bit.match(/\b(weathered|worn|scuffed|patina|frayed|stained)\b/i);
		if (worn?.[1]) wear.push(worn[1].toLowerCase());
		const cloth = bit.match(/\b(silk|velvet|leather|linen|lace|wool|denim|cotton)\b/i);
		if (cloth?.[1]) textiles.push(cloth[1].toLowerCase());
		const metal = bit.match(/\b(buckles?|brass|steel|hardware|zippers?|embroidery)\b/i);
		if (metal?.[1]) hardware.push(metal[1].toLowerCase());
	}
	wardrobe.layering_system.base_layer = join(base);
	wardrobe.layering_system.mid_layer = join(mid);
	wardrobe.layering_system.outerwear = join(outer);
	wardrobe.footwear = join(feet);
	wardrobe.accessories = accessories;
	wardrobe.wear_and_patina = join(wear);
	wardrobe.textiles_and_weight = join(textiles);
	wardrobe.hardware_and_details = join(hardware);
}
function routeCamera(text, doc) {
	const lens = [];
	const aperture = [];
	const flaws = [];
	const principle = [];
	const elevation = [];
	for (const bit of bits(text)) {
		if (/\b(\d{2,3}\s?mm|lens|anamorphic|telephoto|macro)\b/i.test(bit)) lens.push(bit);
		else if (/\b(f\/\d|aperture|depth of field|dof|bokeh|focus)\b/i.test(bit)) aperture.push(bit);
		else if (/\b(grain|halation|aberration|vignette|ink bleed|paper texture)\b/i.test(bit)) flaws.push(bit);
		if (/\b(worm'?s?\s*eye|bird'?s?\s*eye|low angle|high angle|dutch|from above|from below|upward)\b/i.test(bit)) {
			principle.push(bit);
			elevation.push(bit);
		}
	}
	const optics = doc.aesthetic_dna.optics;
	optics.lens_type_and_focal_length = join(lens);
	optics.aperture_and_dof = join(aperture);
	optics.physical_optical_imperfections = join([optics.physical_optical_imperfections, ...flaws]);
	const framing = doc.scene_composition.framing_doctrine;
	framing.named_principle = join(principle);
	framing.camera_elevation_and_axis = join(elevation);
}
function routeLighting(text, doc) {
	const light = doc.aesthetic_dna.lighting_architecture;
	const style = [];
	const key = [];
	const fill = [];
	const shadow = [];
	const rim = [];
	const practical = [];
	const temp = [];
	for (const bit of bits(text)) if (/\brim\b|\bkicker\b/i.test(bit)) rim.push(bit);
	else if (/\b(neon|candles?|fire|lantern|practicals?)\b/i.test(bit)) practical.push(bit);
	else if (/\bfill\b/i.test(bit)) fill.push(bit);
	else if (/\b(shadow|low[- ]key|chiaroscuro)\b/i.test(bit)) shadow.push(bit);
	else if (/\b(warm|cool|kelvin|tungsten|daylight)\b/i.test(bit)) temp.push(bit);
	else if (/\b(golden hour|key light|sun|window|moonlight|moon)\b/i.test(bit)) key.push(bit);
	else style.push(bit);
	light.lighting_style = join(style);
	light.key_source.fixture_or_origin = join(key);
	light.fill_and_negative_space.fill_mechanism = join(fill);
	light.fill_and_negative_space.shadow_depth = join(shadow);
	light.accent_and_practicals.rim_or_kicker = join(rim);
	light.accent_and_practicals.practical_sources = join(practical);
	light.accent_and_practicals.color_temperature_balance = join(temp);
}
function docFromFlat(fields) {
	const doc = emptyDoc();
	const subject = doc.subjects[0] ?? emptySubject();
	doc.subjects = [subject];
	const buckets = { ...fields };
	const hexes = [];
	for (const key of Object.keys(buckets)) {
		const pulled = pullHex(buckets[key]);
		buckets[key] = pulled.rest;
		hexes.push(...pulled.hexes);
	}
	subject.subject_id = buckets.subject;
	routeAppearance(buckets.appearance, subject);
	routeClothing(buckets.clothing, subject);
	subject.kinetic_posture = buckets.pose;
	doc.scene_composition.framing_doctrine.spatial_planes.foreground_obstruction = buckets.foreground;
	doc.scene_composition.environmental_staging.location_context = buckets.background;
	if (/\b(storm|rain|fog|mist|haze|dust|smoke|snow)\b/i.test(buckets.background)) doc.scene_composition.environmental_staging.atmosphere_and_air_density = buckets.background;
	doc.aesthetic_dna.medium_format = buckets.style;
	routeLighting(buckets.lighting, doc);
	routeCamera(buckets.camera, doc);
	doc.anti_cliche_exclusions = bits(buckets.extra);
	doc.aesthetic_dna.color_science.dominant_palette = [...new Set(hexes)];
	return doc;
}
function asString(value) {
	return typeof value === "string" ? value : "";
}
function asList(value) {
	if (Array.isArray(value)) return value.map((item) => typeof item === "string" ? item.trim() : "").filter(Boolean);
	if (typeof value === "string" && value.trim()) return value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
	return [];
}
function mergeSubject(value) {
	const base = emptySubject();
	if (!value || typeof value !== "object" || Array.isArray(value)) return base;
	const item = value;
	base.subject_id = asString(item.subject_id);
	const casting = item.casting_and_physique;
	if (casting && typeof casting === "object" && !Array.isArray(casting)) {
		const face = casting;
		base.casting_and_physique.demographics_and_features = asString(face.demographics_and_features);
		base.casting_and_physique.skin_and_surface_microdetails = asString(face.skin_and_surface_microdetails);
		base.casting_and_physique.hair_and_grooming = asString(face.hair_and_grooming);
	}
	base.kinetic_posture = asString(item.kinetic_posture);
	base.environmental_interaction = asString(item.environmental_interaction);
	const wardrobe = item.wardrobe_architecture;
	if (wardrobe && typeof wardrobe === "object" && !Array.isArray(wardrobe)) {
		const clothes = wardrobe;
		const layers = clothes.layering_system;
		if (layers && typeof layers === "object" && !Array.isArray(layers)) {
			const layer = layers;
			base.wardrobe_architecture.layering_system.base_layer = asString(layer.base_layer);
			base.wardrobe_architecture.layering_system.mid_layer = asString(layer.mid_layer);
			base.wardrobe_architecture.layering_system.outerwear = asString(layer.outerwear);
		}
		base.wardrobe_architecture.textiles_and_weight = asString(clothes.textiles_and_weight);
		base.wardrobe_architecture.hardware_and_details = asString(clothes.hardware_and_details);
		base.wardrobe_architecture.wear_and_patina = asString(clothes.wear_and_patina);
		base.wardrobe_architecture.footwear = asString(clothes.footwear);
		base.wardrobe_architecture.accessories = asList(clothes.accessories);
	}
	return base;
}
function coerceSubject(value) {
	return mergeSubject(value);
}
function isNativeDoc(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const record = value;
	return "aesthetic_dna" in record || "scene_composition" in record || "creative_thesis" in record || "anti_cliche_exclusions" in record || Array.isArray(record.subjects);
}
function coerceDoc(value) {
	const doc = emptyDoc();
	if (!value || typeof value !== "object" || Array.isArray(value)) return doc;
	const record = value;
	const dna = record.aesthetic_dna;
	if (dna && typeof dna === "object" && !Array.isArray(dna)) {
		const aesthetic = dna;
		doc.aesthetic_dna.medium_format = asString(aesthetic.medium_format);
		const optics = aesthetic.optics;
		if (optics && typeof optics === "object" && !Array.isArray(optics)) {
			const lens = optics;
			doc.aesthetic_dna.optics.lens_type_and_focal_length = asString(lens.lens_type_and_focal_length);
			doc.aesthetic_dna.optics.aperture_and_dof = asString(lens.aperture_and_dof);
			doc.aesthetic_dna.optics.physical_optical_imperfections = asString(lens.physical_optical_imperfections);
		}
		const lighting = aesthetic.lighting_architecture;
		if (lighting && typeof lighting === "object" && !Array.isArray(lighting)) {
			const light = lighting;
			doc.aesthetic_dna.lighting_architecture.lighting_style = asString(light.lighting_style);
			const key = light.key_source;
			if (key && typeof key === "object" && !Array.isArray(key)) {
				const source = key;
				doc.aesthetic_dna.lighting_architecture.key_source.fixture_or_origin = asString(source.fixture_or_origin);
				doc.aesthetic_dna.lighting_architecture.key_source.angle_and_elevation = asString(source.angle_and_elevation);
				doc.aesthetic_dna.lighting_architecture.key_source.falloff_and_contrast_ratio = asString(source.falloff_and_contrast_ratio);
			}
			const fill = light.fill_and_negative_space;
			if (fill && typeof fill === "object" && !Array.isArray(fill)) {
				const shadow = fill;
				doc.aesthetic_dna.lighting_architecture.fill_and_negative_space.fill_mechanism = asString(shadow.fill_mechanism);
				doc.aesthetic_dna.lighting_architecture.fill_and_negative_space.shadow_depth = asString(shadow.shadow_depth);
			}
			const accent = light.accent_and_practicals;
			if (accent && typeof accent === "object" && !Array.isArray(accent)) {
				const practical = accent;
				doc.aesthetic_dna.lighting_architecture.accent_and_practicals.rim_or_kicker = asString(practical.rim_or_kicker);
				doc.aesthetic_dna.lighting_architecture.accent_and_practicals.practical_sources = asString(practical.practical_sources);
				doc.aesthetic_dna.lighting_architecture.accent_and_practicals.color_temperature_balance = asString(practical.color_temperature_balance);
			}
		}
		const color = aesthetic.color_science;
		if (color && typeof color === "object" && !Array.isArray(color)) {
			const science = color;
			doc.aesthetic_dna.color_science.dominant_palette = asList(science.dominant_palette);
			doc.aesthetic_dna.color_science.tonal_behavior = asString(science.tonal_behavior);
		}
	}
	const scene = record.scene_composition;
	if (scene && typeof scene === "object" && !Array.isArray(scene)) {
		const composition = scene;
		const framing = composition.framing_doctrine;
		if (framing && typeof framing === "object" && !Array.isArray(framing)) {
			const frame = framing;
			doc.scene_composition.framing_doctrine.named_principle = asString(frame.named_principle);
			doc.scene_composition.framing_doctrine.camera_elevation_and_axis = asString(frame.camera_elevation_and_axis);
			const planes = frame.spatial_planes;
			if (planes && typeof planes === "object" && !Array.isArray(planes)) {
				const space = planes;
				doc.scene_composition.framing_doctrine.spatial_planes.foreground_obstruction = asString(space.foreground_obstruction);
				doc.scene_composition.framing_doctrine.spatial_planes.midground_interaction = asString(space.midground_interaction);
				doc.scene_composition.framing_doctrine.spatial_planes.background_depth = asString(space.background_depth);
			}
		}
		const staging = composition.environmental_staging;
		if (staging && typeof staging === "object" && !Array.isArray(staging)) {
			const place = staging;
			doc.scene_composition.environmental_staging.location_context = asString(place.location_context);
			doc.scene_composition.environmental_staging.atmosphere_and_air_density = asString(place.atmosphere_and_air_density);
			doc.scene_composition.environmental_staging.grounded_props = asList(place.grounded_props);
		}
	}
	if (Array.isArray(record.subjects) && record.subjects.length > 0) doc.subjects = record.subjects.map((item) => mergeSubject(item));
	const thesis = record.creative_thesis;
	if (thesis && typeof thesis === "object" && !Array.isArray(thesis)) {
		const idea = thesis;
		doc.creative_thesis.narrative_subtext = asString(idea.narrative_subtext);
		doc.creative_thesis.focal_contradiction = asString(idea.focal_contradiction);
	}
	doc.anti_cliche_exclusions = asList(record.anti_cliche_exclusions);
	return doc;
}
var DRAFT_KEY = "prompt-forge:draft:v2";
var LIBRARY_KEY = "prompt-forge:library:v2";
var SNIPPET_KEY = "prompt-forge:snippets:v2";
var CHARACTER_KEY = "prompt-forge:characters:v1";
var BOOKMARK_KEY = "prompt-forge:bookmarks:v1";
var LEGACY_CLUSTER = {
	subject: "casting",
	appearance: "casting",
	clothing: "wardrobe",
	pose: "posture",
	background: "environment",
	foreground: "planes",
	style: "medium",
	lighting: "key",
	camera: "optics",
	extra: "exclusions"
};
function read(key) {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function write(key, value) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(key, JSON.stringify(value));
}
function isCluster(value) {
	return typeof value === "string" && CLUSTER_IDS.includes(value);
}
function docFromUnknown(value) {
	if (value && typeof value === "object" && "subject" in value && !("aesthetic_dna" in value)) return docFromFlat(coerceFields(value));
	return coerceDoc(value);
}
function draftFromUnknown(value) {
	if (!value || typeof value !== "object") return null;
	const record = value;
	if (typeof record.source !== "string" || typeof record.title !== "string") return null;
	const doc = record.doc ? docFromUnknown(record.doc) : docFromUnknown(record.fields);
	return {
		title: record.title,
		source: record.source,
		doc,
		cluster: isCluster(record.cluster) ? record.cluster : "casting",
		subjectIndex: typeof record.subjectIndex === "number" ? record.subjectIndex : 0,
		currentId: typeof record.currentId === "string" ? record.currentId : null
	};
}
function loadDraft() {
	const current = read(DRAFT_KEY);
	const legacy = read("prompt-forge:draft:v1");
	return draftFromUnknown(current ?? legacy);
}
function saveDraft(draft) {
	write(DRAFT_KEY, draft);
}
function libraryFromUnknown(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((item) => {
		if (!item || typeof item !== "object") return [];
		const record = item;
		if (typeof record.id !== "string" || typeof record.title !== "string") return [];
		return [{
			id: record.id,
			title: record.title,
			source: typeof record.source === "string" ? record.source : "",
			doc: record.doc ? docFromUnknown(record.doc) : docFromUnknown(record.fields),
			createdAt: typeof record.createdAt === "number" ? record.createdAt : Date.now(),
			updatedAt: typeof record.updatedAt === "number" ? record.updatedAt : Date.now()
		}];
	});
}
function loadLibrary() {
	const current = read(LIBRARY_KEY);
	const legacy = read("prompt-forge:library:v1");
	return libraryFromUnknown(Array.isArray(current) ? current : legacy);
}
function saveLibrary(items) {
	write(LIBRARY_KEY, items);
}
function snippetCategory(value) {
	if (value === "note") return "note";
	if (isCluster(value)) return value;
	if (typeof value === "string" && LEGACY_CLUSTER[value]) return LEGACY_CLUSTER[value];
	return null;
}
function snippetsFromUnknown(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((item) => {
		if (!item || typeof item !== "object") return [];
		const record = item;
		const category = snippetCategory(record.category);
		if (typeof record.id !== "string" || typeof record.title !== "string") return [];
		if (typeof record.body !== "string" || !category) return [];
		return [{
			id: record.id,
			title: record.title,
			body: record.body,
			category,
			custom: true,
			...typeof record.target === "string" ? { target: record.target } : {}
		}];
	});
}
function loadSnippets() {
	const current = read(SNIPPET_KEY);
	const legacy = read("prompt-forge:snippets:v1");
	return snippetsFromUnknown(Array.isArray(current) ? current : legacy);
}
function saveSnippets(items) {
	write(SNIPPET_KEY, items.filter((item) => item.custom));
}
function charactersFromUnknown(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((item) => {
		if (!item || typeof item !== "object") return [];
		const record = item;
		if (typeof record.id !== "string" || typeof record.name !== "string") return [];
		return [{
			id: record.id,
			name: record.name,
			subject: coerceSubject(record.subject),
			createdAt: typeof record.createdAt === "number" ? record.createdAt : Date.now()
		}];
	});
}
function loadCharacters() {
	return charactersFromUnknown(read(CHARACTER_KEY));
}
function saveCharacters(items) {
	write(CHARACTER_KEY, items);
}
function coerceFieldMap(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	const fields = {};
	for (const [key, item] of Object.entries(value)) if (typeof item === "string") fields[key] = item;
	else if (Array.isArray(item) && item.every((entry) => typeof entry === "string")) fields[key] = [...item];
	return fields;
}
function bookmarksFromUnknown(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((item) => {
		if (!item || typeof item !== "object") return [];
		const record = item;
		if (typeof record.id !== "string" || typeof record.name !== "string") return [];
		if (record.kind !== "subject" && record.kind !== "section") return [];
		if (!isCluster(record.cluster)) return [];
		const tags = Array.isArray(record.tags) ? record.tags.filter((tag) => typeof tag === "string" && tag.trim().length > 0) : [];
		const subject = record.kind === "subject" ? coerceSubject(record.subject) : null;
		return [{
			id: record.id,
			name: record.name,
			tags,
			cluster: record.cluster,
			kind: record.kind,
			subject,
			fields: record.kind === "section" ? coerceFieldMap(record.fields) : {},
			hasImage: record.hasImage === true,
			createdAt: typeof record.createdAt === "number" ? record.createdAt : Date.now()
		}];
	});
}
function loadBookmarks() {
	return bookmarksFromUnknown(read(BOOKMARK_KEY));
}
function saveBookmarks(items) {
	write(BOOKMARK_KEY, items);
}
//#endregion
export { saveSnippets as A, loadLibrary as C, saveCharacters as D, saveBookmarks as E, toPromptLine as F, snippetsFromUnknown as M, titleFromDoc as N, saveDraft as O, toJson as P, loadDraft as S, resolvePath as T, getAt as _, bookmarksFromUnknown as a, loadBookmarks as b, clusterHasContent as c, docFromFlat as d, draftFromUnknown as f, filledKeys as g, emptySubject as h, authMiddleware as i, setAt as j, saveLibrary as k, coerceDoc as l, emptyFields as m, CLUSTER_GROUPS as n, charactersFromUnknown as o, emptyDoc as p, SECTION_KEYS as r, clusterById as s, CLUSTERS as t, countFilled as u, isNativeDoc as v, loadSnippets as w, loadCharacters as x, libraryFromUnknown as y };
