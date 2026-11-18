#!/usr/bin/env python3
"""
Unified 3-Source 3D Mannequin Pose Library Ingestion Pipeline
=============================================================
Outputs clean optimized .webp renders under public/poses/{source}/ and a unified
manifest at public/data/poses.json:
  1. PoseMy.Art (posemyart): 2,000 curated camera-ready poses (dHash + title dedup)
  2. OpenSegra (opensegra): All 1,439 angle cards across 288 poses (Front/Side/Diagonal/Above/Below)
  3. Posemaniacs (posemaniacs): Clean paired unique poseIds (Male + Female unified into 1 card via variants)
"""

import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path

import numpy as np
import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
POSES_DIR = ROOT / "public" / "poses"
MANIFEST_PATH = ROOT / "public" / "data" / "poses.json"

POSEMYART_TARGET = 2000
MAX_IMG_WIDTH = 360
WEBP_QUALITY = 82

# Filters for PoseMy.Art curation
POSEMYART_EXCLUDE_RE = re.compile(
    r"\b("
    r"zombie|monster|demon|demonic|werewolf|goblin|orc|troll|ogre|skeleton|skull|"
    r"mermaid|centaur|dragon|alien|ghost|corpse|dead|creature|chibi|horror|gore|"
    r"blood|decapitat|contort|glitch|spider|crawler|wolf|cat-drawing|deer-drawing|"
    r"castle|house-drawing|car-drawing|tree-drawing|room-drawing|animals-drawing|"
    r"wheelchair-drawing|horse|dog|dragon|wings|tail|horns|christmas-drawing|birthday"
    r")\b",
    re.I,
)

POSEMYART_PRIORITY_PATTERNS = [
    (6, re.compile(r"\b(fashion|lookbook|editorial|model|runway|coat|dress|sunglasses|street|casual|cool|confident|chic|style)\b", re.I)),
    (5, re.compile(r"\b(standing|leaning|lean|pocket|hip|crossed arms|arms crossed|walking|stride|turn|over shoulder|looking back)\b", re.I)),
    (4, re.compile(r"\b(sitting|seated|chair|couch|stool|bench|crouching|kneeling|floor sitting|cross-legged|relax|relaxed)\b", re.I)),
    (4, re.compile(r"\b(hand|gesture|chin|pointing|touching hair|close-up|portrait|upper body|holding coffee|holding cup|holding phone|holding camera)\b", re.I)),
    (4, re.compile(r"\b(couple|duo|two figures|two people|friends|hugging|holding hands|back to back|conversation|talking)\b", re.I)),
    (-5, re.compile(r"\b(weird|fool|silly|goofy|absurd|falling down|hit|damage|crawling|sprawl|upside down)\b", re.I)),
]

POSEMYART_DUO_RE = re.compile(
    r"\b(couple|duo|two figures|two people|two girls|two boys|two men|two women|two models|friends|handshake|hugging|kiss|embracing|sword fight|carrying|best-friends|couples)\b",
    re.I,
)

# Posemaniacs filtering
POSEMANIACS_EXCLUDE_TAGS = {"fool", "sumo", "damage", "on-stomach"}
POSEMANIACS_PRIORITY_TAGS = {
    "fashion": 6,
    "standing": 5,
    "cool": 5,
    "relax": 5,
    "walking": 5,
    "leaning": 5,
    "hand-on-hip": 5,
    "sitting-on-chair": 5,
    "sitting": 4,
    "daily-life": 4,
    "crossing-arms": 4,
    "crossing-legs": 4,
    "raising-arm": 3,
    "twisting-neck": 3,
    "twisting-body": 3,
    "pointing": 3,
    "couple": 4,
    "idol": 3,
    "dancing": 2,
    "kneeling": 2,
    "squatting": 2,
}

OPENSEGRA_ANGLE_MAP = {
    "正面": "front",
    "横": "side",
    "斜め": "diagonal",
    "上から": "above",
    "下から": "below",
}

TAG_DESCRIPTIONS = {
    "standing": "standing upright",
    "fashion": "editorial fashion stance",
    "walking": "mid-stride walking motion",
    "running": "dynamic running stride",
    "sitting": "seated posture",
    "sitting-on-chair": "seated on a chair",
    "leaning": "relaxed leaning posture",
    "hand-on-hip": "one hand resting on the hip",
    "raising-arm": "arm raised expressively",
    "raising-leg": "one leg lifted",
    "crossing-arms": "arms folded across the torso",
    "crossing-legs": "legs crossed smoothly",
    "twisting-body": "subtle torso twist",
    "twisting-neck": "head turned subtly",
    "pointing": "hand extended pointing forward",
    "cool": "confident poised attitude",
    "relax": "relaxed natural weight shift",
    "daily-life": "everyday candid gesture",
    "couple": "two-subject paired interaction",
    "kneeling": "kneeling stance",
    "squatting": "low crouched stance",
    "dancing": "fluid expressive movement",
    "ballet": "graceful balanced extension",
    "idol": "stage-ready expressive pose",
    "sexy": "sculpted S-curve silhouette",
    "lying": "reclined floor posture",
    "on-back": "reclining on back",
    "on-side": "resting on one side",
    "fighting": "tense action stance",
    "kicking": "extended kick motion",
    "punching": "forward strike motion",
    "jumping": "airborne dynamic leap",
    "yoga": "controlled balance posture",
    "fitness": "athletic form",
    "sad": "inward contemplative posture",
    "leaning-back": "tilted back slightly",
    "looking-back": "glancing back over shoulder",
}


def get_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"User-Agent": "PromptForge-PoseLibrary/3.0"})
    return s


def compute_dhash(img: Image.Image) -> int:
    gray = img.convert("L").resize((9, 8), Image.Resampling.BILINEAR)
    arr = np.asarray(gray, dtype=np.int16)
    diff = arr[:, 1:] > arr[:, :-1]
    bits = 0
    for b in diff.flatten():
        bits = (bits << 1) | int(bool(b))
    return bits


def hamming_dist(a: int, b: int) -> int:
    return (a ^ b).bit_count()


def composite_and_save_webp(
    raw_bytes: bytes,
    out_path: Path,
    bg_rgb: tuple[int, int, int],
    trim_alpha: bool = False,
    target_aspect_3_4: bool = False,
) -> tuple[bool, int, str]:
    """
    Decode PNG/JPG/WebP bytes, composite alpha onto clean background,
    optionally trim excessive transparent padding, optimize to <=360px WebP,
    and return (ok, dhash, inferred_framing).
    """
    try:
        im = Image.open(BytesIO(raw_bytes))
        im.load()
    except Exception:
        return False, 0, "full-body"

    # Measure figure framing from alpha or non-background pixels before resize
    framing = "full-body"
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        rgba = im.convert("RGBA")
        alpha = rgba.getchannel("A")
        bbox = alpha.getbbox()
        if not bbox:
            return False, 0, "full-body"
        bw = bbox[2] - bbox[0]
        bh = bbox[3] - bbox[1]
        if bw < 16 or bh < 16:
            return False, 0, "full-body"

        aspect = bh / max(1, bw)
        if aspect < 1.15 and bh < rgba.height * 0.48:
            framing = "close-up"
        elif aspect < 1.65:
            framing = "medium"
        else:
            framing = "full-body"

        if trim_alpha:
            pad_x = max(12, int(bw * 0.10))
            pad_y = max(12, int(bh * 0.08))
            x0 = max(0, bbox[0] - pad_x)
            y0 = max(0, bbox[1] - pad_y)
            x1 = min(rgba.width, bbox[2] + pad_x)
            y1 = min(rgba.height, bbox[3] + pad_y)
            rgba = rgba.crop((x0, y0, x1, y1))

        canvas = Image.new("RGB", rgba.size, bg_rgb)
        canvas.paste(rgba, mask=rgba.split()[3])
        rgb = canvas
    else:
        rgb = im.convert("RGB")
        # Check non-empty variance
        arr = np.asarray(rgb, dtype=np.int16)
        if arr.std() < 3.0:
            return False, 0, "full-body"
        # Check bounding box against background color
        diff = np.abs(arr - np.asarray(bg_rgb, dtype=np.int16)).max(axis=2)
        ys, xs = np.where(diff > 18)
        if len(xs) > 40:
            bw = int(xs.max() - xs.min())
            bh = int(ys.max() - ys.min())
            aspect = bh / max(1, bw)
            if aspect < 1.25:
                framing = "close-up"
            elif aspect < 1.75:
                framing = "medium"

    if target_aspect_3_4:
        w, h = rgb.size
        desired_h = int(w * 4 / 3)
        if h < desired_h:
            padded = Image.new("RGB", (w, desired_h), bg_rgb)
            padded.paste(rgb, (0, (desired_h - h) // 2))
            rgb = padded
        elif h > desired_h * 1.15:
            desired_w = int(h * 3 / 4)
            if desired_w > w:
                padded = Image.new("RGB", (desired_w, h), bg_rgb)
                padded.paste(rgb, ((desired_w - w) // 2, 0))
                rgb = padded

    if rgb.width > MAX_IMG_WIDTH:
        new_h = max(1, int(rgb.height * (MAX_IMG_WIDTH / rgb.width)))
        rgb = rgb.resize((MAX_IMG_WIDTH, new_h), Image.Resampling.LANCZOS)

    dhash = compute_dhash(rgb)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    rgb.save(out_path, format="WEBP", quality=WEBP_QUALITY, method=4)
    return True, dhash, framing


def normalize_title_key(title: str) -> str:
    words = re.findall(r"[a-z0-9]+", title.lower())
    stop = {"a", "an", "the", "pose", "reference", "drawing", "ref", "3d", "figure", "model"}
    filtered = [w for w in words if w not in stop]
    return " ".join(filtered[:6])


def infer_posemyart_framing(text: str, visual_framing: str) -> str:
    t = text.lower()
    if any(k in t for k in ("close-up", "closeup", "headshot", "face", "portrait", "shoulder", "chin", "hand-reference", "finger", "sunglasses")):
        return "close-up"
    if any(k in t for k in ("upper body", "torso", "waist up", "chest", "arms crossed", "holding coffee", "holding phone", "holding cup")):
        return "medium"
    if any(k in t for k in ("full body", "full-body", "standing", "walking", "running", "sitting", "crouching", "kneeling", "jumping", "stride")):
        return "full-body"
    return visual_framing


def infer_angle_from_text(text: str) -> str:
    t = text.lower()
    if any(k in t for k in ("low angle", "low-angle", "from below", "worm")):
        return "below"
    if any(k in t for k in ("high angle", "high-angle", "from above", "bird")):
        return "above"
    if any(k in t for k in ("profile", "sideways", "side view", "from side")):
        return "side"
    if any(k in t for k in ("three-quarter", "3/4", "looking back", "over shoulder", "diagonal")):
        return "diagonal"
    return "front"


# ==============================================================================
# 1. POSEMY.ART CURATION (2,000 Poses)
# ==============================================================================
def ingest_posemyart(manifest_entries: list[dict]):
    print("\n=== [1/3] Curating PoseMy.Art (target: 2,000) ===", flush=True)
    sess = get_session()

    # Load search.json (5,642 structured entries)
    r_search = sess.get(
        "https://posemyart3.nyc3.cdn.digitaloceanspaces.com/search_data/search.json",
        timeout=30,
    )
    search_items = r_search.json()
    print(f"Loaded PoseMy.Art search.json: {len(search_items)} entries", flush=True)

    by_img = {}
    for it in search_items:
        img_rel = it.get("image", "")
        if not img_rel:
            continue
        by_img[img_rel] = {
            "title": (it.get("title") or "").strip(),
            "description": (it.get("description") or "").strip(),
            "image": img_rel,
            "pack": (it.get("pack") or "").strip(),
            "cats": set(),
            "url": (it.get("url") or "").strip(),
        }

    # Merge /all-poses-reference/ (~6,206 cards)
    r_html = sess.get("https://posemy.art/all-poses-reference/", timeout=40)
    soup = BeautifulSoup(r_html.text, "lxml")
    html_cards = soup.select(".image_card")
    print(f"Parsed PoseMy.Art /all-poses-reference/: {len(html_cards)} image cards", flush=True)
    for card in html_cards:
        a = card.find("a")
        img = card.find("img")
        sub = card.select_one(".image_card_subtitle")
        if not img:
            continue
        src = (img.get("src") or "").strip()
        if not src.startswith("/assets/poses_imgs/"):
            continue
        title = sub.get_text(strip=True) if sub else ""
        alt = (img.get("alt") or "").strip()
        href = (a.get("href") or "").strip() if a else ""
        cat_slug = href.strip("/").split("/")[0] if href else ""

        if src not in by_img:
            desc = alt.split(" - ", 2)[-1].strip() if " - " in alt else title
            by_img[src] = {
                "title": title,
                "description": desc,
                "image": src,
                "pack": "",
                "cats": set(),
                "url": href,
            }
        if cat_slug:
            by_img[src]["cats"].add(cat_slug.replace("-", " "))
        if not by_img[src]["title"] and title:
            by_img[src]["title"] = title

    print(f"Total unique PoseMy.Art source candidates: {len(by_img)}", flush=True)

    # Score & filter
    scored = []
    seen_title_keys = set()
    for img_rel, item in by_img.items():
        title = item["title"] or "Studio Mannequin Pose"
        desc = item["description"] or title
        cat_text = " ".join(sorted(item["cats"]))
        combined = f"{title} {desc} {item['pack']} {cat_text} {item['url']}"

        if POSEMYART_EXCLUDE_RE.search(combined):
            continue

        # Score usefulness & camera readiness
        score = 0
        for pts, pat in POSEMYART_PRIORITY_PATTERNS:
            if pat.search(combined):
                score += pts
        if desc and len(desc) > 25:
            score += 2
        if item["pack"]:
            score += 1

        t_key = normalize_title_key(title)
        scored.append((score, t_key, img_rel, item))

    # Sort descending by curation score, tiebreak deterministically
    scored.sort(key=lambda x: (-x[0], x[2]))
    print(f"Filtered PoseMy.Art candidates: {len(scored)} (downloading top candidates to curate 2,000)", flush=True)

    # Download & dHash deduplicate in batches until we reach POSEMYART_TARGET
    out_dir = POSES_DIR / "posemyart"
    accepted = []
    seen_hashes = []
    deferred = []

    pool = scored[:3600]

    def fetch_raw(entry):
        score, t_key, img_rel, item = entry
        url = f"https://posemy.art{img_rel}"
        for attempt in range(3):
            try:
                res = requests.get(url, timeout=15)
                if res.status_code == 200 and len(res.content) > 500:
                    return entry, res.content
            except Exception:
                time.sleep(0.3 * (attempt + 1))
        return entry, None

    raw_results = []
    with ThreadPoolExecutor(max_workers=16) as ex:
        for res in ex.map(fetch_raw, pool):
            if res[1] is not None:
                raw_results.append(res)
            if len(raw_results) % 400 == 0 and len(raw_results) > 0:
                print(f"  Fetched {len(raw_results)} PoseMy.Art raw thumbnails...", flush=True)

    print(f"Downloaded {len(raw_results)} PoseMy.Art candidates, running dHash deduplication...", flush=True)

    def try_accept(entry, raw_bytes, allow_title_dup: bool):
        score, t_key, img_rel, item = entry
        if not allow_title_dup and t_key and t_key in seen_title_keys:
            deferred.append((entry, raw_bytes))
            return

        next_num = len(accepted) + 1
        pid = f"posemyart_{next_num:04d}"
        out_path = out_dir / f"{pid}.webp"
        # Composite onto soft neutral light slate #eaecf0 so dark 3D outlines pop cleanly
        ok, dhash, vis_framing = composite_and_save_webp(
            raw_bytes,
            out_path,
            bg_rgb=(234, 236, 240),
            trim_alpha=False,
            target_aspect_3_4=True,
        )
        if not ok:
            return

        # Perceptual dHash dedup (hamming distance <= 4)
        for h in seen_hashes:
            if hamming_dist(dhash, h) <= 4:
                out_path.unlink(missing_ok=True)
                return

        seen_hashes.append(dhash)
        if t_key:
            seen_title_keys.add(t_key)

        title = item["title"] or "Studio Mannequin Pose"
        desc = item["description"] or title
        combined = f"{title} {desc} {' '.join(item['cats'])}"
        framing = infer_posemyart_framing(combined, vis_framing)
        angle = infer_angle_from_text(combined)
        is_duo = bool(POSEMYART_DUO_RE.search(combined))

        tags = []
        for cat in sorted(item["cats"]):
            w = cat.replace("pose references", "").replace("drawing references", "").replace("references", "").replace("poses", "").strip()
            if w and w not in tags:
                tags.append(w)
        for kw in ("standing", "sitting", "walking", "leaning", "fashion", "editorial", "streetwear", "casual", "couple", "hand", "crouching", "kneeling"):
            if kw in combined.lower() and kw not in tags:
                tags.append(kw)
        if not tags:
            tags = [framing, "3d-mannequin"]
        tags = tags[:6]

        accepted.append({
            "id": pid,
            "source": "posemyart",
            "sourceLabel": "PoseMy.Art",
            "imageUrl": f"/poses/posemyart/{pid}.webp",
            "subjectCount": 2 if is_duo else 1,
            "title": title,
            "naturalPrompt": desc,
            "framing": framing,
            "angle": angle,
            "tags": tags,
        })

    for entry, raw_bytes in raw_results:
        if len(accepted) >= POSEMYART_TARGET:
            break
        try_accept(entry, raw_bytes, allow_title_dup=False)

    if len(accepted) < POSEMYART_TARGET and deferred:
        for entry, raw_bytes in deferred:
            if len(accepted) >= POSEMYART_TARGET:
                break
            try_accept(entry, raw_bytes, allow_title_dup=True)

    manifest_entries.extend(accepted)
    print(f"✓ PoseMy.Art complete: {len(accepted)} unique poses saved.", flush=True)


# ==============================================================================
# 2. OPENSEGRA (100% of catalogue.json — ~1,439 angle cards)
# ==============================================================================
def ingest_opensegra(manifest_entries: list[dict]):
    print("\n=== [2/3] Ingesting OpenSegra (all poses x 5 angles) ===", flush=True)
    r = requests.get(
        "https://raw.githubusercontent.com/opensegra/ai-library/main/data/catalogue.json",
        timeout=30,
    )
    cat = r.json()
    poses = cat.get("poses", [])
    out_dir = POSES_DIR / "opensegra"

    tasks = []
    seq = 0
    for p in poses:
        line_name = (p.get("lineName") or "Everyday").strip()
        cls = (p.get("cls") or "Standing").strip()
        name = (p.get("name") or f"Pose {p.get('code', '')}").strip()
        is_duo = line_name.lower() == "duo" or "2人" in (p.get("line") or "")
        imgs = p.get("images") or {}
        for jp_angle, paths in imgs.items():
            angle = OPENSEGRA_ANGLE_MAP.get(jp_angle, "front")
            full_rel = paths.get("full") or ""
            thumb_rel = paths.get("thumb") or ""
            url = (
                f"https://ailibrary.opensegra.com{full_rel}"
                if full_rel
                else f"https://raw.githubusercontent.com/opensegra/ai-library/main/public{thumb_rel}"
            )
            fallback_url = (
                f"https://raw.githubusercontent.com/opensegra/ai-library/main/public{thumb_rel}"
                if thumb_rel
                else ""
            )
            seq += 1
            tasks.append((seq, p, line_name, cls, name, is_duo, angle, url, fallback_url))

    def process_opensegra_item(item):
        idx, p, line_name, cls, name, is_duo, angle, url, fallback_url = item
        pid = f"opensegra_{idx:04d}"
        out_path = out_dir / f"{pid}.webp"

        raw = None
        for u in [url, fallback_url]:
            if not u:
                continue
            for attempt in range(3):
                try:
                    res = requests.get(u, timeout=20)
                    if res.status_code == 200 and len(res.content) > 500:
                        raw = res.content
                        break
                except Exception:
                    time.sleep(0.3 * (attempt + 1))
            if raw:
                break

        if not raw:
            return None

        ok, _, _ = composite_and_save_webp(
            raw,
            out_path,
            bg_rgb=(245, 246, 248),
            trim_alpha=False,
            target_aspect_3_4=False,
        )
        if not ok:
            return None

        # Determine framing accurately from OpenSegra line + cls
        ln_low = line_name.lower()
        name_low = name.lower()
        if ln_low == "portrait":
            if any(k in name_low for k in ("face", "head", "chin", "cheek", "ear", "glasses", "hair", "eyes", "lips")):
                framing = "close-up"
            else:
                framing = "medium"
        else:
            framing = "full-body"

        short_name = name.split(",")[0].strip()
        if len(short_name) > 42:
            short_name = short_name[:39].rsplit(" ", 1)[0].strip()
        title = f"{short_name} ({angle.capitalize()})"
        natural_prompt = f"{name}, {line_name.lower()} reference, {cls.lower()} posture, {angle} angle."
        tags = list(
            dict.fromkeys(
                [
                    line_name.lower(),
                    cls.lower(),
                    angle,
                    framing,
                    *([p.get("code", "").lower()] if p.get("code") else []),
                ]
            )
        )

        return (
            idx,
            {
                "id": pid,
                "source": "opensegra",
                "sourceLabel": "OpenSegra",
                "imageUrl": f"/poses/opensegra/{pid}.webp",
                "subjectCount": 2 if is_duo else 1,
                "title": title,
                "naturalPrompt": natural_prompt,
                "framing": framing,
                "angle": angle,
                "tags": [t for t in tags if t],
            },
        )

    results = []
    with ThreadPoolExecutor(max_workers=16) as ex:
        for res in ex.map(process_opensegra_item, tasks):
            if res is not None:
                results.append(res)
            if len(results) % 250 == 0 and len(results) > 0:
                print(f"  Processed {len(results)}/{len(tasks)} OpenSegra angle cards...", flush=True)

    results.sort(key=lambda x: x[0])
    manifest_entries.extend([r[1] for r in results])
    print(f"✓ OpenSegra complete: {len(results)} angle cards saved.", flush=True)


# ==============================================================================
# 3. POSEMANIACS (Clean Unique Paired Poses — Male + Female combined into 1 card)
# ==============================================================================
def synthesize_posemaniacs_copy(tags: list[str], framing: str, angle: str, subject_count: int) -> tuple[str, str]:
    clean = [t for t in tags if t in TAG_DESCRIPTIONS]
    if not clean:
        clean = tags[:]

    # Build concise 3-6 word title
    label_words = []
    priority_order = [
        "fashion", "couple", "sitting-on-chair", "sitting", "leaning", "walking",
        "standing", "squatting", "kneeling", "hand-on-hip", "crossing-arms",
        "crossing-legs", "raising-arm", "pointing", "cool", "relax", "daily-life",
        "twisting-body", "twisting-neck", "dancing", "ballet", "idol", "lying",
    ]
    ordered = [t for t in priority_order if t in clean] + [t for t in clean if t not in priority_order]
    for t in ordered[:3]:
        label_words.append(t.replace("-", " ").title())
    if not label_words:
        label_words = ["Anatomical", "Studio"]
    title = " ".join(label_words[:3])
    if len(title.split()) < 3:
        title = f"{title} Pose"

    # Build fluent naturalPrompt grounded in Posemaniacs tags & framing
    phrases = [TAG_DESCRIPTIONS.get(t, t.replace("-", " ")) for t in ordered[:4]]
    subject_phrase = "Two figures in a paired interaction" if subject_count == 2 else "Single figure"
    frame_phrase = {
        "full-body": "full-body composition",
        "medium": "medium waist-up composition",
        "close-up": "close-up upper-body study",
    }.get(framing, "full-body composition")
    desc_core = ", ".join(phrases) if phrases else "balanced natural studio posture"
    natural_prompt = f"{subject_phrase} in a {desc_core}, {frame_phrase}, seen from a {angle} angle."
    return title, natural_prompt


def ingest_posemaniacs(manifest_entries: list[dict]):
    print("\n=== [3/3] Ingesting Posemaniacs (Paired Male/Female -> 1 Record Each) ===", flush=True)
    sess = get_session()

    # Step 1: Collect all unique poseIds + paired model thumbnails across paginated /poses
    poses_by_id: dict[str, dict] = {}
    first_tags = []
    for p in range(1, 30):
        res = sess.get(f"https://www.posemaniacs.com/poses?page={p}", timeout=20)
        m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', res.text)
        if not m:
            break
        pp = json.loads(m.group(1))["props"]["pageProps"]
        if not first_tags:
            first_tags = [t["value"] for t in pp["options"]["tags"] if t["value"]]
        for it in pp.get("poseList", []):
            pid = it["poseId"]
            rec = poses_by_id.setdefault(pid, {"models": {}, "tags": []})
            rec["models"][it["modelId"]] = it["thumbnail"]
        if not pp.get("urls", {}).get("next"):
            break

    print(f"Found {len(poses_by_id)} unique poseIds on Posemaniacs.", flush=True)

    # Step 2: Populate verified tags per poseId via /poses/{tag}?page=N
    def scan_tag(tag):
        found = set()
        p = 1
        while p <= 50:
            try:
                res = requests.get(f"https://www.posemaniacs.com/poses/{tag}?page={p}", timeout=15)
                mm = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', res.text)
                if not mm:
                    break
                data = json.loads(mm.group(1))["props"]["pageProps"]
                for it in data.get("poseList", []):
                    found.add(it["poseId"])
                if not data.get("urls", {}).get("next"):
                    break
            except Exception:
                break
            p += 1
        return tag, found

    with ThreadPoolExecutor(max_workers=12) as ex:
        for tag, found_ids in ex.map(scan_tag, first_tags):
            for pid in found_ids:
                if pid in poses_by_id and tag not in poses_by_id[pid]["tags"]:
                    poses_by_id[pid]["tags"].append(tag)

    # Step 3: Curate & prioritize practical, stylish, expressive poses
    candidates = []
    for pid, rec in poses_by_id.items():
        tag_set = set(rec["tags"])
        if tag_set & POSEMANIACS_EXCLUDE_TAGS:
            continue
        score = sum(POSEMANIACS_PRIORITY_TAGS.get(t, 1) for t in rec["tags"])
        if "couple" in tag_set:
            score += 4
        candidates.append((score, pid, rec))

    candidates.sort(key=lambda x: (-x[0], x[1]))
    print(f"Curated clean Posemaniacs paired poses: {len(candidates)} (filtered filler/weird tags).", flush=True)

    out_dir = POSES_DIR / "posemaniacs"

    def process_pair(args):
        seq_idx, (score, pid, rec) = args
        card_id = f"posemaniacs_{seq_idx:04d}"
        models = rec["models"]
        # Deterministic primary (female 00002/00004 preferred or first available) and secondary (opposite gender)
        ordered_mids = sorted(
            models.keys(),
            key=lambda m: {"00002": 0, "00004": 1, "00001": 2, "00003": 3}.get(m, 9),
        )
        primary_mid = ordered_mids[0]
        secondary_mid = ordered_mids[1] if len(ordered_mids) > 1 else None

        primary_path = out_dir / f"{card_id}_primary.webp"
        secondary_path = out_dir / f"{card_id}_secondary.webp" if secondary_mid else None

        def download_thumb(rel_url: str):
            url = f"https://cdn.posemaniacs.com{rel_url}"
            for attempt in range(3):
                try:
                    res = requests.get(url, timeout=20)
                    if res.status_code == 200 and len(res.content) > 500:
                        return res.content
                except Exception:
                    time.sleep(0.3 * (attempt + 1))
            return None

        raw_p = download_thumb(models[primary_mid])
        if not raw_p:
            return None
        ok_p, _, vis_framing = composite_and_save_webp(
            raw_p,
            primary_path,
            bg_rgb=(20, 20, 26),
            trim_alpha=True,
            target_aspect_3_4=True,
        )
        if not ok_p:
            return None

        variants = {"primary": f"/poses/posemaniacs/{card_id}_primary.webp"}
        if secondary_mid and secondary_path:
            raw_s = download_thumb(models[secondary_mid])
            if raw_s:
                ok_s, _, _ = composite_and_save_webp(
                    raw_s,
                    secondary_path,
                    bg_rgb=(20, 20, 26),
                    trim_alpha=True,
                    target_aspect_3_4=True,
                )
                if ok_s:
                    variants["secondary"] = f"/poses/posemaniacs/{card_id}_secondary.webp"

        tags = rec["tags"][:]
        tag_set = set(tags)
        subject_count = 2 if "couple" in tag_set else 1

        # Determine accurate framing
        if "sitting-on-chair" in tag_set or "sitting" in tag_set or "squatting" in tag_set:
            framing = vis_framing if vis_framing == "medium" else "full-body"
        else:
            framing = vis_framing

        angle = "diagonal" if ("twisting-body" in tag_set or "twisting-neck" in tag_set) else "front"
        title, natural_prompt = synthesize_posemaniacs_copy(tags, framing, angle, subject_count)

        # Enrich searchable studio tags cleanly
        enriched_tags = list(dict.fromkeys(tags + [framing, "paired-models" if "secondary" in variants else "solo-model"]))[:7]

        return (
            seq_idx,
            {
                "id": card_id,
                "source": "posemaniacs",
                "sourceLabel": "Posemaniacs",
                "imageUrl": variants["primary"],
                "variants": variants,
                "subjectCount": subject_count,
                "title": title,
                "naturalPrompt": natural_prompt,
                "framing": framing,
                "angle": angle,
                "tags": enriched_tags,
            },
        )

    results = []
    numbered = list(enumerate(candidates, start=1))
    with ThreadPoolExecutor(max_workers=14) as ex:
        for res in ex.map(process_pair, numbered):
            if res is not None:
                results.append(res)
            if len(results) % 150 == 0 and len(results) > 0:
                print(f"  Processed {len(results)}/{len(numbered)} Posemaniacs paired poses...", flush=True)

    results.sort(key=lambda x: x[0])
    manifest_entries.extend([r[1] for r in results])
    print(f"✓ Posemaniacs complete: {len(results)} paired unique poses saved.", flush=True)


def main():
    t0 = time.time()
    manifest_entries: list[dict] = []

    ingest_posemyart(manifest_entries)
    ingest_opensegra(manifest_entries)
    ingest_posemaniacs(manifest_entries)

    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest_entries, f, ensure_ascii=False, indent=2)

    elapsed = time.time() - t0
    by_src = {}
    for e in manifest_entries:
        by_src[e["source"]] = by_src.get(e["source"], 0) + 1

    print(f"\n=== ALL COMPLETE in {elapsed:.1f}s ===", flush=True)
    print(f"Manifest saved: {MANIFEST_PATH} ({len(manifest_entries)} total records)", flush=True)
    print("Source breakdown:", by_src, flush=True)


if __name__ == "__main__":
    main()
