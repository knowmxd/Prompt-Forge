import { coerceDoc, docFromFlat, isNativeDoc } from "./assemble.ts";
import {
  countFilled,
  type PromptDoc,
} from "./model.ts";
import {
  SECTION_KEYS,
  emptyFields,
  filledKeys,
  type PromptFields,
  type SectionKey,
} from "./model.ts";

export type ParseMode = "empty" | "json" | "labeled" | "freeform";

type FlatResult = {
  fields: PromptFields;
  mode: ParseMode;
  summary: string;
};

export type ParseResult = {
  doc: PromptDoc;
  mode: ParseMode;
  summary: string;
};

const JSON_KEYS: Record<string, SectionKey | "prompt" | "negative"> = {
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
  raw: "prompt",
};

const LABELS = [
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
  "notes",
];

type Catalog = { key: SectionKey; weight: number; phrases: string[] };

const CATALOG: Catalog[] = [
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
      "shot on",
    ],
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
      "lit by",
    ],
  },
  {
    key: "foreground",
    weight: 5,
    phrases: ["foreground", "sea spray", "rose petals", "petals", "dust motes"],
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
      "storm",
    ],
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
      "hood",
    ],
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
      "arms crossed",
    ],
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
      "complexion",
    ],
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
      "4k",
    ],
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
      "mutated",
    ],
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
      "figure",
    ],
  },
];

const PRIORITY: SectionKey[] = [
  "extra",
  "camera",
  "lighting",
  "foreground",
  "background",
  "clothing",
  "pose",
  "appearance",
  "style",
  "subject",
];

const COMPILED = CATALOG.map((entry) => ({
  ...entry,
  re: phraseRegex(entry.phrases),
}));

const CAMERA_EXTRA = [
  /\b\d{2,3}\s?mm\b/i,
  /\bf\/\d(?:\.\d)?\b/i,
  /\baspect ratio\b/i,
];

const ENV_RE =
  /\b(forest|mountains?|ocean|sea|beach|desert|ruins|castle|temple|streets?|alleys?|skylines?|skies|sky|clouds|jungles?|villages?|cathedrals?|libraries|battlefields?|gardens?|caves?|snow|rain|rooftops?|nebulae|nebula|taverns?|markets?|woods|meadows?|shores?|coasts?|fog|mist|storms?|storm|city|room|interior|studio|cliff|cliffs)\b/i;

const POSE_SPLIT =
  /\s+(?=(?:standing|sitting|seated|running|walking|kneeling|crouching|leaning|reaching|jumping|dancing|fighting|aiming|holding|wielding|looking|reclining|lying|perched|posing|facing)\b)/i;

const WEAR_SPLIT =
  /\s+(?=wearing\b|dressed in\b|clad in\b|outfitted in\b)/i;

function phraseRegex(phrases: string[]): RegExp {
  const body = [...phrases]
    .sort((a, b) => b.length - a.length)
    .map((phrase) =>
      phrase
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\\\s/g, "\\s+")
        .replace(/'/g, "['’]"),
    )
    .join("|");
  return new RegExp(`(?:^|[^a-z0-9])(?:${body})(?:[^a-z0-9]|$)`, "i");
}

function normKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tidy(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/^[,;:|\s]+|[,;|\s]+$/g, "")
    .trim();
}

function tidySection(key: SectionKey, value: string): string {
  let text = tidy(value);
  if (key !== "subject") text = text.replace(/^(?:a|an|the)\s+/i, "");
  return text;
}

function push(fields: PromptFields, key: SectionKey, value: string) {
  const piece = tidySection(key, value);
  if (!piece) return;
  const parts = fields[key] ? fields[key].split(/,\s*/) : [];
  const norm = piece.toLowerCase();
  if (parts.some((part) => {
    const current = part.toLowerCase();
    return current === norm || current.includes(norm);
  })) {
    return;
  }
  const kept = parts.filter((part) => !norm.includes(part.toLowerCase()));
  kept.push(piece);
  fields[key] = kept.join(", ");
}

function joinRaw(current: string, addition: string): string {
  const next = tidy(addition);
  if (!next) return current;
  if (!current.trim()) return next;
  if (current.toLowerCase().includes(next.toLowerCase())) return current;
  return `${current.replace(/,\s*$/, "")}, ${next}`;
}

function collectStrings(value: unknown): string {
  if (typeof value === "string") return tidy(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value.map(collectStrings).filter(Boolean).join(", ");
  }
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map(collectStrings)
      .filter(Boolean)
      .join(", ");
  }
  return "";
}

function tryParseJson(input: string): unknown | null {
  let text = input.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
  }
  if (!text.startsWith("{") && !text.startsWith("[")) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function scorePhrase(phrase: string): SectionKey | null {
  const totals = new Map<SectionKey, number>();
  for (const entry of COMPILED) {
    const flags = entry.re.flags.includes("g") ? entry.re.flags : `${entry.re.flags}g`;
    const re = new RegExp(entry.re.source, flags);
    const count = [...phrase.matchAll(re)].length;
    if (count > 0) totals.set(entry.key, (totals.get(entry.key) ?? 0) + entry.weight * count);
  }
  if (CAMERA_EXTRA.some((re) => re.test(phrase))) {
    totals.set("camera", (totals.get("camera") ?? 0) + 6);
  }
  let winner: SectionKey | null = null;
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

function forceRoute(phrase: string): { key: SectionKey; text: string } | null {
  const text = tidy(phrase);
  let match = text.match(/^(.+?)\s+in the foreground$/i);
  if (match?.[1]) return { key: "foreground", text: match[1] };
  match = text.match(/^(?:in the )?foreground\s*[:\-]?\s*(.+)$/i);
  if (match?.[1]) return { key: "foreground", text: match[1] };
  match = text.match(/^(.+?)\s+foreground$/i);
  if (match?.[1]) return { key: "foreground", text: match[1] };

  match = text.match(/^(.+?)\s+in the background$/i);
  if (match?.[1]) return { key: "background", text: match[1] };
  match = text.match(/^(?:the )?background(?:\s+of|\s+is)?\s*[:\-]?\s*(.+)$/i);
  if (match?.[1]) return { key: "background", text: match[1] };
  match = text.match(/^(.+?)\s+background$/i);
  if (match?.[1]) return { key: "background", text: match[1] };

  match = text.match(/^wearing\s+(.+)$/i);
  if (match?.[1]) return { key: "clothing", text: match[1] };
  match = text.match(/^(?:dressed|clad|outfitted)\s+in\s+(.+)$/i);
  if (match?.[1]) return { key: "clothing", text: match[1] };

  if (
    /^(?:no|without|avoid)\s+/i.test(text) &&
    /\b(text|watermark|logo|signature|words|letters|border|frame|blur|artifact|people|humans|modern)\b/i.test(
      text,
    )
  ) {
    return { key: "extra", text };
  }
  return null;
}

function isEnvironment(place: string): boolean {
  if (/\b(standing|sitting|looking|holding|wearing|walking|running)\b/i.test(place)) {
    return false;
  }
  return ENV_RE.test(place);
}

function splitLookahead(phrase: string, re: RegExp): string[] {
  const parts = phrase.split(re).map(tidy).filter(Boolean);
  return parts.length > 0 ? parts : [phrase];
}

function splitInClothing(phrase: string): string[] {
  const match = phrase.match(/^(.*)\s+in\s+(a|an|the)\s+(.+)$/i);
  if (!match) return [phrase];
  const right = tidy(`${match[2]} ${match[3]}`);
  if (scorePhrase(right) === "clothing" || scorePhrase(match[3] ?? "") === "clothing") {
    return [tidy(match[1] ?? ""), right].filter(Boolean);
  }
  return [phrase];
}

function splitEnvironment(phrase: string): string[] {
  const match = phrase.match(
    /^(.*)\s+(?:in|inside|amid|amidst|under|beneath)\s+(?:a|an|the\s+)?(.{2,80})$/i,
  );
  if (!match) return [phrase];
  const left = tidy(match[1] ?? "");
  const place = tidy(match[2] ?? "");
  if (!left || !place || !isEnvironment(place)) return [phrase];
  return [left, place];
}

function splitWith(phrase: string): string[] {
  const match = phrase.match(/^(.*)\s+with\s+(.+)$/i);
  if (!match) return [phrase];
  const left = tidy(match[1] ?? "");
  const right = tidy(match[2] ?? "");
  if (!left || !right) return [phrase];
  const rightKey = forceRoute(right)?.key ?? scorePhrase(right);
  if (rightKey === "appearance" || rightKey === "clothing") {
    return [left, right];
  }
  return [phrase];
}

function splitAnd(phrase: string): string[] {
  const bits = phrase
    .split(/\s+(?:and|&)\s+/i)
    .map(tidy)
    .filter(Boolean);
  if (bits.length < 2) return [phrase];
  const keys = new Set(
    bits
      .map((bit) => forceRoute(bit)?.key ?? scorePhrase(bit))
      .filter((key): key is SectionKey => key != null),
  );
  if (keys.size <= 1) return [phrase];
  return bits.flatMap((bit) => splitAnd(bit));
}

function explode(clause: string): string[] {
  const worn = splitLookahead(clause, WEAR_SPLIT);
  const out: string[] = [];
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

function splitDelimiters(input: string): string[] {
  const parts: string[] = [];
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

function peelMedium(phrase: string): { medium: string | null; rest: string } {
  const match = phrase.match(
    /^(?:a\s+|an\s+)?(.*?\b(?:concept art|photograph|photography|illustration|painting|portrait|render|photo|image|shot))\s+of\s+(.+)$/i,
  );
  if (!match?.[1] || !match[2]) return { medium: null, rest: phrase };
  return { medium: tidy(match[1]), rest: tidy(match[2]) };
}

const MJ_RE =
  /--(ar|aspect|stylize|chaos|weird|niji|style|quality|seed|tile|no|[scwvq])\b([\s\S]*?)(?=\s--|$)/gi;

function extractDirectives(text: string): { body: string; mjs: string[]; negative: string } {
  let negative = "";
  let body = text;
  const neg = body.match(/\bnegative\s*prompt\s*[:\-]\s*([\s\S]*)$/i);
  if (neg?.index != null) {
    negative = tidy(neg[1] ?? "");
    body = body.slice(0, neg.index).trim();
  }
  const mjs: string[] = [];
  body = body
    .replace(MJ_RE, (full) => {
      mjs.push(tidy(full));
      return " ";
    })
    .trim();
  return { body, mjs, negative };
}

function routeMj(token: string): { key: SectionKey; text: string } {
  const match = token.match(/^--(\w+)\s*([\s\S]*)$/);
  if (!match) return { key: "extra", text: token };
  const flag = match[1]?.toLowerCase() ?? "";
  const value = tidy(match[2] ?? "");
  if (flag === "ar" || flag === "aspect") return { key: "camera", text: `aspect ratio ${value}` };
  if (flag === "no") return { key: "extra", text: value };
  if (flag === "v") return { key: "style", text: value ? `midjourney v${value}` : "midjourney" };
  if (flag === "niji") return { key: "style", text: value ? `niji ${value}` : "niji" };
  if (flag === "stylize" || flag === "s") return { key: "style", text: `stylize ${value}` };
  if (flag === "chaos" || flag === "c") return { key: "style", text: `chaos ${value}` };
  if (flag === "weird" || flag === "w") return { key: "style", text: `weird ${value}` };
  if (flag === "style") return { key: "style", text: value ? `${value} style` : "stylized" };
  if (flag === "q" || flag === "quality") return { key: "style", text: `quality ${value}` };
  if (flag === "seed") return { key: "extra", text: `seed ${value}` };
  return { key: "extra", text: tidy(`${flag} ${value}`) };
}

function classifyFreeform(text: string): PromptFields {
  const fields = emptyFields();
  const { body, mjs, negative } = extractDirectives(text);
  let subjectSet = false;
  for (const clause of splitDelimiters(body)) {
    for (const atom of explode(clause)) {
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
      if (key === "subject" || (key == null && !subjectSet)) {
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
  }
  for (const token of mjs) {
    const routed = routeMj(token);
    push(fields, routed.key, routed.text);
  }
  if (negative) fields.extra = joinRaw(fields.extra, negative);
  return fields;
}

function labelRegex(): RegExp {
  const alt = LABELS.map((label) =>
    label
      .split("/")
      .map((part) =>
        part
          .trim()
          .split(/\s+/)
          .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("\\s+"),
      )
      .join("\\s*/\\s*"),
  ).join("|");
  return new RegExp(
    `(?:^|[\\n|])\\s*(?:[-*]\\s+)?(?:#{1,6}\\s*)?(?:\\*\\*|__)?\\[?(${alt})\\]?(?:\\*\\*|__)?\\s*(?::|\\s-\\s)\\s*`,
    "gi",
  );
}

function tryLabeled(text: string): PromptFields | null {
  const matches = [...text.matchAll(labelRegex())];
  if (matches.length < 2) return null;
  const fields = emptyFields();
  const first = matches[0];
  if (!first || first.index == null) return null;
  const preamble = tidy(text.slice(0, first.index));
  matches.forEach((match, index) => {
    const captured = match[1] ?? "";
    const mapped = JSON_KEYS[normKey(captured)];
    const key = mapped === "prompt" || mapped === "negative" || !mapped
      ? mapped === "negative"
        ? "extra"
        : null
      : mapped;
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

function summaryFor(fields: PromptFields, mode: ParseMode, fallback: string): string {
  const count = filledKeys(fields).length;
  if (count === 0) return "Nothing recognizable to sort.";
  if (mode === "freeform" && count === 1 && fields.subject) {
    return "Couldn't split this cleanly — left it on Subject.";
  }
  return fallback.replace("{n}", String(count));
}

function fromFreeform(text: string, template: string): FlatResult {
  const fields = classifyFreeform(text);
  return {
    fields,
    mode: "freeform",
    summary: summaryFor(fields, "freeform", template),
  };
}

function mapJson(value: unknown): FlatResult | null {
  if (typeof value === "string") {
    return fromFreeform(value, "Sorted a JSON string into {n} sections.");
  }
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
  const unknown: string[] = [];

  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
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
    for (const key of SECTION_KEYS) {
      if (!fields[key]) fields[key] = parsed[key];
      else if (parsed[key]) fields[key] = joinRaw(fields[key], parsed[key]);
    }
  }
  if (negative) fields.extra = joinRaw(fields.extra, negative);
  if (unknown.length > 0) fields.extra = joinRaw(fields.extra, unknown.join("; "));

  const count = filledKeys(fields).length;
  return {
    fields,
    mode: "json",
    summary: count
      ? `Mapped JSON into ${count} ${count === 1 ? "section" : "sections"}.`
      : "JSON parsed, but every section was empty.",
  };
}

function parseFlat(raw: string): FlatResult {
  const input = raw.replace(/\u00a0/g, " ").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();
  if (!input) {
    return { fields: emptyFields(), mode: "empty", summary: "Nothing to parse yet." };
  }

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
      summary: `Split ${count} labeled ${count === 1 ? "section" : "sections"}.`,
    };
  }

  const fields = classifyFreeform(input);
  return {
    fields,
    mode: "freeform",
    summary: summaryFor(fields, "freeform", "Sorted this into {n} sections."),
  };
}

export function parsePrompt(raw: string): ParseResult {
  const input = raw.replace(/\u00a0/g, " ").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();
  if (!input) {
    return { doc: emptyDocSafe(), mode: "empty", summary: "Nothing to parse yet." };
  }
  const json = tryParseJson(input);
  if (json !== null && isNativeDoc(json)) {
    const doc = coerceDoc(json);
    const count = countFilled(doc);
    return {
      doc,
      mode: "json",
      summary: count
        ? `Loaded your format, ${count} ${count === 1 ? "field" : "fields"} filled.`
        : "Loaded your format. Every field was empty.",
    };
  }
  const flat = parseFlat(input);
  return {
    doc: docFromFlat(flat.fields),
    mode: flat.mode,
    summary: flat.summary,
  };
}

function emptyDocSafe() {
  return docFromFlat(emptyFields());
}
