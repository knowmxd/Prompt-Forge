import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const lib = JSON.parse(fs.readFileSync("Lib_Wardrobe/wardrobe_library.json", "utf8"));
const missingItems = lib.items.filter((item) => {
  return (item.source_images || []).some((s) => s.startsWith("generated:"));
});

console.log(`Found ${missingItems.length} missing items to generate shots for.`);

if (missingItems.length === 0) {
  process.exit(0);
}

// Icon SVG silhouettes by slot
function getSlotSvg(slot, subcategory, primaryColorHex) {
  const c = primaryColorHex || "#262626";
  const dim = 'style="width: 170px; height: 170px; display: block;"';
  if (slot === "headwear") {
    return `<svg ${dim} viewBox="0 0 100 100" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 70 C20 40, 35 25, 50 25 C65 25, 80 40, 80 70 Z" fill="${c}" fill-opacity="0.18" />
      <path d="M15 70 C15 65, 85 65, 85 70 C85 75, 15 75, 15 70 Z" fill="${c}" />
      <circle cx="50" cy="22" r="3" fill="${c}" />
    </svg>`;
  }
  if (slot === "eyewear") {
    return `<svg ${dim} viewBox="0 0 100 100" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <rect x="12" y="40" width="32" height="22" rx="6" fill="${c}" fill-opacity="0.25" />
      <rect x="56" y="40" width="32" height="22" rx="6" fill="${c}" fill-opacity="0.25" />
      <path d="M44 48 Q50 44 56 48" />
      <path d="M12 45 L5 38" />
      <path d="M88 45 L95 38" />
    </svg>`;
  }
  if (slot === "jewelry" || slot === "neckwear") {
    return `<svg ${dim} viewBox="0 0 100 100" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M25 30 Q50 75 75 30" fill="none" stroke-width="4" />
      <circle cx="50" cy="65" r="8" fill="${c}" />
      <path d="M50 73 L50 85" stroke-width="4" />
      <path d="M44 79 L56 79" stroke-width="4" />
    </svg>`;
  }
  if (slot === "top" || slot === "layer_top") {
    return `<svg ${dim} viewBox="0 0 100 100" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M35 20 L40 28 L60 28 L65 20 L88 32 L80 46 L72 42 L72 82 L28 82 L28 42 L20 46 L12 32 Z" fill="${c}" fill-opacity="0.22" />
      <path d="M40 28 Q50 34 60 28" />
      <line x1="28" y1="80" x2="72" y2="80" stroke-width="4" />
    </svg>`;
  }
  if (slot === "outerwear") {
    return `<svg ${dim} viewBox="0 0 100 100" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M32 18 L68 18 L92 32 L82 50 L74 46 L74 84 L26 84 L26 46 L18 50 L8 32 Z" fill="${c}" fill-opacity="0.25" />
      <line x1="50" y1="18" x2="50" y2="84" stroke-dasharray="3 3" />
      <path d="M32 18 L48 38 L26 46" fill="none" />
      <path d="M68 18 L52 38 L74 46" fill="none" />
    </svg>`;
  }
  if (slot === "dress_onepiece") {
    return `<svg ${dim} viewBox="0 0 100 100" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M36 20 L64 20 L62 44 L78 84 L22 84 L38 44 Z" fill="${c}" fill-opacity="0.22" />
      <line x1="38" y1="44" x2="62" y2="44" />
    </svg>`;
  }
  if (slot === "bottom") {
    return `<svg ${dim} viewBox="0 0 100 100" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M28 20 L72 20 L76 84 L53 84 L50 48 L47 84 L24 84 Z" fill="${c}" fill-opacity="0.22" />
      <line x1="32" y1="30" x2="68" y2="30" />
      <line x1="50" y1="20" x2="50" y2="48" />
    </svg>`;
  }
  if (slot === "shoes") {
    return `<svg ${dim} viewBox="0 0 100 100" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 55 C20 45, 35 45, 45 48 L72 48 C82 48, 88 56, 88 68 L15 68 C15 60, 16 57, 20 55 Z" fill="${c}" fill-opacity="0.25" />
      <rect x="12" y="68" width="78" height="8" rx="3" fill="${c}" />
      <line x1="45" y1="48" x2="52" y2="60" />
      <line x1="53" y1="48" x2="60" y2="60" />
    </svg>`;
  }
  if (slot === "bag") {
    return `<svg ${dim} viewBox="0 0 100 100" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <rect x="22" y="42" width="56" height="42" rx="6" fill="${c}" fill-opacity="0.2" />
      <path d="M35 42 C35 24, 65 24, 65 42" fill="none" stroke-width="4" />
      <line x1="50" y1="52" x2="50" y2="62" />
    </svg>`;
  }
  // Default accessory / belt
  return `<svg ${dim} viewBox="0 0 100 100" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <rect x="15" y="38" width="70" height="24" rx="4" fill="${c}" fill-opacity="0.2" />
    <rect x="25" y="34" width="20" height="32" rx="3" stroke-width="4" />
    <circle cx="65" cy="50" r="3" fill="${c}" />
    <circle cx="75" cy="50" r="3" fill="${c}" />
  </svg>`;
}

function colorToHex(colorName) {
  const map = {
    black: "#171717",
    white: "#e5e5e5",
    cream: "#d97706",
    ivory: "#d97706",
    gray: "#525252",
    charcoal: "#334155",
    navy: "#1e3a8a",
    blue: "#2563eb",
    "forest green": "#166534",
    green: "#15803d",
    olive: "#4d7c0f",
    "burnt orange": "#c2410c",
    orange: "#ea580c",
    yellow: "#ca8a04",
    mustard: "#b45309",
    red: "#b91c1c",
    burgundy: "#831843",
    pink: "#db2777",
    purple: "#7e22ce",
    lavender: "#9333ea",
    brown: "#78350f",
    tan: "#b45309",
    silver: "#64748b",
    gold: "#d97706",
  };
  const lower = (colorName || "").toLowerCase();
  for (const [k, v] of Object.entries(map)) {
    if (lower.includes(k)) return v;
  }
  return "#334155";
}

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 600, height: 600 } });

for (let i = 0; i < missingItems.length; i++) {
  const item = missingItems[i];
  const outRelative = item.image.replace(/^\//, "");
  const outPath = path.join("public", outRelative);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const primaryColor = item.colors[0] || "neutral";
  const hex = colorToHex(primaryColor);
  const iconSvg = getSlotSvg(item.slot, item.subcategory, hex);

  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 600px;
      height: 600px;
      background: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 36px 32px 32px;
      overflow: hidden;
      position: relative;
    }
    .top-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 12px;
    }
    .tag-badge {
      background: #0a0a0a;
      color: #fb7185;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .subcat {
      font-size: 12px;
      font-weight: 600;
      color: #737373;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .visual-container {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .pedestal-shadow {
      position: absolute;
      bottom: 40px;
      width: 240px;
      height: 24px;
      background: radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
    }
    .icon-wrapper {
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 10px 15px rgba(0,0,0,0.06));
    }
    .bottom-info {
      width: 100%;
      background: #fafafa;
      border: 1px solid #eaeaea;
      border-radius: 12px;
      padding: 14px 16px;
      text-align: center;
    }
    .title {
      font-size: 15px;
      font-weight: 700;
      color: #171717;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
    }
    .meta {
      font-size: 11px;
      color: #737373;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .swatch {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${hex};
      border: 1px solid rgba(0,0,0,0.15);
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="top-header">
    <span class="tag-badge">${item.slot}</span>
    <span class="subcat">${item.subcategory.replace(/_/g, " ")}</span>
  </div>

  <div class="visual-container">
    <div class="icon-wrapper">
      ${iconSvg}
    </div>
    <div class="pedestal-shadow"></div>
  </div>

  <div class="bottom-info">
    <div class="title">${item.name}</div>
    <div class="meta">
      <span class="swatch"></span>
      <span>${item.colors.slice(0, 2).join(", ")}</span>
      ${item.materials.length ? `<span>•</span><span>${item.materials.slice(0, 2).join(", ")}</span>` : ""}
    </div>
  </div>
</body>
</html>`;

  await page.setContent(html);
  await page.screenshot({ path: outPath, type: "jpeg", quality: 92 });
  if ((i + 1) % 20 === 0 || i === missingItems.length - 1) {
    console.log(`Generated ${i + 1}/${missingItems.length} shots...`);
  }
}

await browser.close();
console.log(`Done! All ${missingItems.length} product shots generated.`);
