#!/usr/bin/env python3
"""
Weighted Solo-Subject Pose Reference Ingestion Pipeline (5,000 Poses)
Streams CaptionEmporium/pexels-568k-internvl2, enforces strict solo-subject &
portrait/square framing rules, distributes across 5 weighted pose buckets
(Standing 1,250 / Portrait 1,250 / Seated 900 / Action 900 / Editorial 700),
deduplicates via ID + perceptual dHash, and saves local WebP thumbnails +
public/data/poses.json.

Important Scope Rule: Leaves naturalPrompt as "" (visual-first layout pass).
"""

import concurrent.futures
import gzip
import io
import json
import re
import time
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / "public" / "data" / "poses.json"
POSES_DIR = ROOT / "public" / "poses"
DATASET_URL = "https://huggingface.co/datasets/CaptionEmporium/pexels-568k-internvl2/resolve/main/train.jsonl.gz"

MAX_EDGE = 384
WEBP_QUALITY = 78

BUCKET_TARGETS = {
    "Standing": 1250,
    "Portrait": 1250,
    "Seated": 900,
    "Action": 900,
    "Editorial": 700,
}

# Negative / noise filter: reject multi-person, crowd, distant, or non-pose clutter
NEGATIVE_RE = re.compile(
    r"\b("
    r"group|crowd|crowded|couple|couples|family|families|team|teams|audience|"
    r"meeting|party|wedding|bride and groom|two people|two women|two men|"
    r"two girls|two boys|two individuals|three people|several people|multiple people|"
    r"many people|friends|colleagues|gathering|pedestrians|passersby|spectators|"
    r"players|children|kids|toddler|baby|infant|newborn|pregnant belly|"
    r"mannequin|statue|sculpture|doll|figurine|painting|illustration|drawing|sketch|"
    r"cartoon|anime|3d render|blurry|out of focus|silhouette of crowd|"
    r"in the distance|from afar|tiny figure|aerial view|bird'?s[- ]eye|drone shot|"
    r"dog|puppy|cat|kitten|horse|cow|sheep|bird|food|plate|laptop|computer screen|"
    r"smartphone screen|steering wheel|car interior|hospital|surgery|dentist|"
    r"text overlay|watermark|collage|split screen|before and after|mirror selfie of two"
    r")\b",
    re.I,
)

# Explicit solo-subject anchoring
SOLO_ANCHOR_RE = re.compile(
    r"\b("
    r"a woman|a young woman|a man|a young man|a person|a girl|a boy|"
    r"a model|a fashion model|a dancer|a ballerina|an athlete|a runner|"
    r"a performer|a martial artist|a yogi|solo|single woman|single man|"
    r"one person|one woman|one man|individual|portrait of a|she is|he is|"
    r"woman is|man is|woman standing|man standing|woman sitting|man sitting|"
    r"woman wearing|man wearing|young woman|young man"
    r")\b",
    re.I,
)

# Secondary multi-person guard in caption prose (e.g. "two figures", "people walking", "others in background")
MULTI_PERSON_PROSE_RE = re.compile(
    r"\b("
    r"people|persons|individuals|men and women|women and men|both of them|"
    r"each other|holding hands|hugging|kissing|embracing|shaking hands|"
    r"talking to someone|group of|pair of|duo|trio|four |five |six |"
    r"background people|other people|onlookers|bystanders"
    r")\b",
    re.I,
)

# Weighted taxonomy: (category, subCategory, default_framing, regex_pattern, tags)
SUBQUERY_RULES = [
    # 1. Standing (Target: 1,250)
    ("Standing", "looking over shoulder", "medium",
     re.compile(r"\b(looking back|over (her|his|the) shoulder|glancing back|turned away looking)\b", re.I),
     ["solo", "standing", "looking back"]),
    ("Standing", "leaning against wall", "full-body",
     re.compile(r"\b(leaning against|leans against|against a wall|against the wall|leaning on a wall)\b", re.I),
     ["solo", "standing", "leaning"]),
    ("Standing", "hands in pockets", "full-body",
     re.compile(r"\b(hands in (her|his|the)? ?pockets|hand in pocket|pockets)\b", re.I),
     ["solo", "standing", "hands in pockets"]),
    ("Standing", "arms crossed", "medium",
     re.compile(r"\b(arms crossed|crossed arms|arms folded|folded arms)\b", re.I),
     ["solo", "standing", "arms crossed"]),
    ("Standing", "walking toward camera", "full-body",
     re.compile(r"\b(walking toward|walking forward|striding|stepping forward|walking down|walking along)\b", re.I),
     ["solo", "standing", "walking"]),
    ("Standing", "walking away", "full-body",
     re.compile(r"\b(walking away|from behind|back to the camera|facing away)\b", re.I),
     ["solo", "standing", "back view"]),
    ("Standing", "contrapposto stance", "full-body",
     re.compile(r"\b(hand on hip|hands on hips|weight shifted|one leg|contrapposto|posing confidently)\b", re.I),
     ["solo", "standing", "contrapposto"]),
    ("Standing", "street-style standing", "full-body",
     re.compile(r"\b(standing|stands)\b.*\b(street|sidewalk|urban|outfit|coat|jacket|jeans|dress|full[- ]body|full[- ]length)\b|\b(standing tall|standing upright|standing pose)\b", re.I),
     ["solo", "standing", "street style"]),
    ("Standing", "casual standing", "medium",
     re.compile(r"\b(standing|stands)\b", re.I),
     ["solo", "standing", "casual"]),

    # 2. Portrait (Target: 1,250)
    ("Portrait", "hand near chin/face", "close-up",
     re.compile(r"\b(hand (on|near|to|touching|resting) (her|his|the)? ?(chin|face|cheek|jaw|lips|neck)|resting (her|his) chin)\b", re.I),
     ["solo", "portrait", "hand near face"]),
    ("Portrait", "side profile", "close-up",
     re.compile(r"\b(side profile|in profile|profile view|looking to the side|turned sideways)\b", re.I),
     ["solo", "portrait", "profile"]),
    ("Portrait", "head tilted", "close-up",
     re.compile(r"\b(head tilt|tilted head|tilting (her|his) head|chin up|looking up)\b", re.I),
     ["solo", "portrait", "head tilt"]),
    ("Portrait", "expressive hands", "medium",
     re.compile(r"\b(raising (her|his) hand|hand gesture|hands near|fingers|reaching|touching (her|his) hair|adjusting)\b", re.I),
     ["solo", "portrait", "hands"]),
    ("Portrait", "dramatic lighting portrait", "close-up",
     re.compile(r"\b(dramatic lighting|chiaroscuro|rim light|shadow|neon|studio light|moody portrait)\b", re.I),
     ["solo", "portrait", "dramatic lighting"]),
    ("Portrait", "studio portrait", "close-up",
     re.compile(r"\b(close[- ]up|headshot|portrait|upper body|bust|studio background|plain background)\b", re.I),
     ["solo", "portrait", "studio"]),

    # 3. Seated (Target: 900)
    ("Seated", "sitting on stairs", "full-body",
     re.compile(r"\b(sitting on (the )?stairs|seated on (the )?steps|on a staircase|steps)\b", re.I),
     ["solo", "seated", "stairs"]),
    ("Seated", "crouching stance", "full-body",
     re.compile(r"\b(crouching|crouches|squatting|squats|low stance)\b", re.I),
     ["solo", "seated", "crouching"]),
    ("Seated", "kneeling pose", "full-body",
     re.compile(r"\b(kneeling|kneels|on one knee|on knees)\b", re.I),
     ["solo", "seated", "kneeling"]),
    ("Seated", "lounging on floor", "full-body",
     re.compile(r"\b(sitting on the floor|seated on the floor|on the ground|lounging|reclining|lying down|lying on)\b", re.I),
     ["solo", "seated", "floor"]),
    ("Seated", "sitting on stool/chair", "medium",
     re.compile(r"\b(sitting on a stool|sitting on a chair|seated on a|armchair|wooden chair|bench|sofa|couch|leaning forward)\b", re.I),
     ["solo", "seated", "chair"]),
    ("Seated", "seated posture", "medium",
     re.compile(r"\b(sitting|seated|sits)\b", re.I),
     ["solo", "seated", "posture"]),

    # 4. Action (Target: 900)
    ("Action", "mid-air jump", "full-body",
     re.compile(r"\b(jumping|mid[- ]air|leap|leaping|airborne|in the air)\b", re.I),
     ["solo", "action", "jump"]),
    ("Action", "contemporary dance", "full-body",
     re.compile(r"\b(dancing|dance|ballet|ballerina|pirouette|arabesque|choreography|graceful movement)\b", re.I),
     ["solo", "action", "dance"]),
    ("Action", "running stride", "full-body",
     re.compile(r"\b(running|sprinting|jogging|sprint|mid[- ]stride)\b", re.I),
     ["solo", "action", "running"]),
    ("Action", "yoga/stretching", "full-body",
     re.compile(r"\b(yoga|stretching|stretch|flexible|split|handstand|acrobatic|gymnastics|balance pose)\b", re.I),
     ["solo", "action", "yoga"]),
    ("Action", "martial arts stance", "full-body",
     re.compile(r"\b(martial arts|karate|boxing|kickboxing|punching|kicking|fighting stance|athlete|workout|exercising)\b", re.I),
     ["solo", "action", "athletic"]),

    # 5. Editorial (Target: 700)
    ("Editorial", "low-angle heroic", "full-body",
     re.compile(r"\b(low[- ]angle|from below|worm'?s[- ]eye|looking up at (the )?(woman|man|model|person))\b", re.I),
     ["solo", "editorial", "low-angle"]),
    ("Editorial", "high-angle shot", "full-body",
     re.compile(r"\b(high[- ]angle|from above|looking down at)\b", re.I),
     ["solo", "editorial", "high-angle"]),
    ("Editorial", "flowing coat/fabric", "full-body",
     re.compile(r"\b(flowing|billowing|wind[- ]blown|trench coat|long coat|silk dress|gown|cape|fabric movement)\b", re.I),
     ["solo", "editorial", "flowing"]),
    ("Editorial", "back-view silhouette", "full-body",
     re.compile(r"\b(silhouette|backlit|rim[- ]lit|shadowy figure)\b", re.I),
     ["solo", "editorial", "silhouette"]),
    ("Editorial", "high-fashion lookbook", "full-body",
     re.compile(r"\b(high[- ]fashion|editorial|lookbook|avant[- ]garde|runway|couture|fashion model|monochrome outfit|minimalist studio)\b", re.I),
     ["solo", "editorial", "fashion"]),
]


def infer_framing(text_lower: str, default_framing: str) -> str:
    if any(k in text_lower for k in ("full-body", "full body", "full-length", "head to toe", "shoes", "sneakers", "boots", "heels", "standing on", "walking", "jumping", "crouching", "kneeling")):
        return "full-body"
    if any(k in text_lower for k in ("close-up", "closeup", "headshot", "face", "eyes", "chin", "cheek", "lips", "neck")):
        if not any(k in text_lower for k in ("waist", "torso", "hips", "legs")):
            return "close-up"
    if any(k in text_lower for k in ("waist-up", "medium shot", "half-body", "upper body", "torso", "hips")):
        return "medium"
    return default_framing


def compute_dhash(img: Image.Image, hash_size: int = 8) -> int:
    gray = img.convert("L").resize((hash_size + 1, hash_size), Image.Resampling.BILINEAR)
    arr = np.asarray(gray, dtype=np.int16)
    diff = arr[:, 1:] > arr[:, :-1]
    bits = 0
    for bit in diff.flatten():
        bits = (bits << 1) | int(bool(bit))
    return bits


def build_pexels_thumb_url(raw_url: str, pid: int) -> str:
    # Pexels image CDN supports fast ?auto=compress&cs=tinysrgb&w=420 resizing
    base = raw_url.split("?", 1)[0]
    if "images.pexels.com/photos/" in base:
        return f"{base}?auto=compress&cs=tinysrgb&w=420"
    return f"https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg?auto=compress&cs=tinysrgb&w=420"


def collect_candidates():
    t0 = time.time()
    # Oversample 2.1x per bucket so network drops + dHash dedup still hit exact 5,000
    oversample_caps = {k: int(v * 2.1) for k, v in BUCKET_TARGETS.items()}
    buckets: dict[str, list[dict]] = {k: [] for k in BUCKET_TARGETS}
    sub_counts: dict[str, int] = {}
    seen_ids = set()

    print(f"[ingest] Streaming {DATASET_URL} for 5,000 solo-subject pose candidates...", flush=True)
    req = urllib.request.Request(DATASET_URL, headers={"User-Agent": "PromptForge-Ingest/2.0"})
    rows_scanned = 0

    with urllib.request.urlopen(req, timeout=180) as resp:
        gz = gzip.GzipFile(fileobj=resp)
        for line in gz:
            rows_scanned += 1
            if rows_scanned % 50000 == 0:
                counts_str = ", ".join(f"{k}:{len(v)}/{oversample_caps[k]}" for k, v in buckets.items())
                print(f"[ingest] Scanned {rows_scanned:,} rows ({time.time()-t0:.1f}s) -> {counts_str}", flush=True)

            # Stop early once every bucket has reached its oversample cap
            if all(len(buckets[k]) >= oversample_caps[k] for k in BUCKET_TARGETS):
                print(f"[ingest] All buckets reached oversample cap at row {rows_scanned:,}!", flush=True)
                break

            try:
                row = json.loads(line)
            except Exception:
                continue

            if row.get("type") != "photo":
                continue

            pid = row.get("id")
            if not pid or pid in seen_ids:
                continue

            w = row.get("width") or 0
            h = row.get("height") or 0
            if w < 500 or h < 500:
                continue
            # Portrait or square orientation preference (h >= w * 0.90)
            if h < w * 0.90:
                continue

            title = row.get("title") or ""
            alt = row.get("alt") or ""
            tags_raw = row.get("tags") or ""
            cap1 = row.get("internvl2_caption") or ""
            cap2 = row.get("cogvlm_caption") or ""
            combined = f"{title} | {alt} | {tags_raw} | {cap1} | {cap2}"

            if not SOLO_ANCHOR_RE.search(combined):
                continue
            if NEGATIVE_RE.search(combined) or MULTI_PERSON_PROSE_RE.search(f"{title} {alt} {cap1} {cap2}"):
                continue

            # Match against weighted taxonomy rules
            matched_rule = None
            for cat, subcat, def_framing, pat, base_tags in SUBQUERY_RULES:
                if len(buckets[cat]) >= oversample_caps[cat]:
                    continue
                if pat.search(combined):
                    # Cap individual sub-categories so no single generic query dominates
                    max_sub = max(240, int(oversample_caps[cat] * 0.35))
                    if sub_counts.get(f"{cat}:{subcat}", 0) >= max_sub:
                        continue
                    matched_rule = (cat, subcat, def_framing, base_tags)
                    break

            if not matched_rule:
                continue

            cat, subcat, def_framing, base_tags = matched_rule
            raw_url = row.get("url") or ""
            if not raw_url:
                continue

            seen_ids.add(pid)
            sub_counts[f"{cat}:{subcat}"] = sub_counts.get(f"{cat}:{subcat}", 0) + 1
            framing = infer_framing(combined.lower(), def_framing)
            tags = list(dict.fromkeys(base_tags + [framing]))[:4]

            buckets[cat].append({
                "pid": pid,
                "thumbUrl": build_pexels_thumb_url(raw_url, pid),
                "category": cat,
                "subCategory": subcat,
                "framing": framing,
                "tags": tags,
            })

    print(f"[ingest] Finished scanning {rows_scanned:,} rows in {time.time()-t0:.1f}s.", flush=True)
    for k, v in buckets.items():
        print(f"  Bucket {k}: {len(v)} candidates (target {BUCKET_TARGETS[k]})", flush=True)
    return buckets


def download_and_encode(cand: dict):
    url = cand["thumbUrl"]
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (PromptForge/2.0)"})
        with urllib.request.urlopen(req, timeout=15) as r:
            if r.status != 200:
                return None
            raw = r.read()
        im = Image.open(io.BytesIO(raw)).convert("RGB")
        w, h = im.size
        if w < 180 or h < 180:
            return None
        dhash = compute_dhash(im)
        im.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, format="WEBP", quality=WEBP_QUALITY, method=3)
        return {**cand, "dhash": dhash, "webp": buf.getvalue()}
    except Exception:
        return None


def main():
    t0 = time.time()
    POSES_DIR.mkdir(parents=True, exist_ok=True)
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    # Remove previous pose_*.webp files cleanly
    for old in POSES_DIR.glob("pose_*.webp"):
        old.unlink()

    buckets = collect_candidates()

    popcount16 = np.array([bin(i).count("1") for i in range(65536)], dtype=np.uint8)
    kept_hashes = np.zeros(sum(BUCKET_TARGETS.values()) + 500, dtype=np.uint64)
    kept_count = 0

    def min_hamming(h_val: int) -> int:
        if kept_count == 0:
            return 64
        xor = kept_hashes[:kept_count] ^ np.uint64(h_val)
        dists = (
            popcount16[xor & np.uint64(0xFFFF)]
            + popcount16[(xor >> np.uint64(16)) & np.uint64(0xFFFF)]
            + popcount16[(xor >> np.uint64(32)) & np.uint64(0xFFFF)]
            + popcount16[(xor >> np.uint64(48)) & np.uint64(0xFFFF)]
        )
        return int(dists.min())

    final_items = []
    pose_idx = 0

    for cat, target in BUCKET_TARGETS.items():
        cands = buckets[cat]
        # Interleave sub-categories so variety is maximized
        by_sub: dict[str, list[dict]] = {}
        for c in cands:
            by_sub.setdefault(c["subCategory"], []).append(c)
        ordered = []
        sub_lists = list(by_sub.values())
        max_len = max((len(lst) for lst in sub_lists), default=0)
        for i in range(max_len):
            for lst in sub_lists:
                if i < len(lst):
                    ordered.append(lst[i])

        print(f"[download] Fetching & dHash-deduplicating {cat} (target {target} from {len(ordered)} candidates)...", flush=True)
        cat_kept = 0
        batch_size = 160
        pos = 0

        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as ex:
            while cat_kept < target and pos < len(ordered):
                needed = target - cat_kept
                take = min(len(ordered) - pos, max(needed + 40, batch_size))
                batch = ordered[pos : pos + take]
                pos += take

                for res in ex.map(download_and_encode, batch):
                    if res is None:
                        continue
                    if min_hamming(res["dhash"]) <= 5:
                        continue
                    kept_hashes[kept_count] = np.uint64(res["dhash"])
                    kept_count += 1
                    cat_kept += 1
                    pose_idx += 1

                    pid_str = f"pose_{pose_idx:04d}"
                    (POSES_DIR / f"{pid_str}.webp").write_bytes(res["webp"])
                    final_items.append({
                        "id": pid_str,
                        "imageUrl": f"/poses/{pid_str}.webp",
                        "category": res["category"],
                        "subCategory": res["subCategory"],
                        "framing": res["framing"],
                        "tags": res["tags"],
                        "naturalPrompt": "",
                    })
                    if cat_kept >= target:
                        break

        print(f"[download] {cat}: saved {cat_kept}/{target} WebP poses.", flush=True)

    OUT_JSON.write_text(json.dumps(final_items, separators=(",", ":")), encoding="utf-8")
    print(
        f"DONE! Saved {len(final_items)} solo pose WebPs & {OUT_JSON} ({OUT_JSON.stat().st_size / 1e6:.2f} MB) in {time.time()-t0:.1f}s",
        flush=True,
    )


if __name__ == "__main__":
    main()
