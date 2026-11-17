#!/usr/bin/env python3
"""
Ingests, curates, deduplicates, and normalizes 10,000 pose conditioning references:
  - 5,000 from toyxyz/booru3dpose_10k ("booru3d" / "3D Shaded Mannequins")
  - 5,000 from fAIseh00d/dense_pose_controlnet ("densepose" / "DensePose Body Maps")

Supports staged execution so each dataset checkpoints safely:
  python scripts/ingest-poses.py --stage densepose
  python scripts/ingest-poses.py --stage booru3d
  python scripts/ingest-poses.py --stage merge
  python scripts/ingest-poses.py --stage all

Outputs:
  - public/poses/booru3d/booru3d_0001.webp ... booru3d_5000.webp
  - public/poses/densepose/densepose_0001.webp ... densepose_5000.webp
  - public/data/poses.json (10,000 unified items)
"""

import argparse
import concurrent.futures
import io
import json
import os
import re
import tarfile
import time
import urllib.request
from pathlib import Path

import fsspec
import numpy as np
import pyarrow.parquet as pq
from PIL import Image
from sklearn.feature_extraction.text import TfidfVectorizer

ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / "public" / "data" / "poses.json"
BOORU_DIR = ROOT / "public" / "poses" / "booru3d"
DENSE_DIR = ROOT / "public" / "poses" / "densepose"
BOORU_META_CACHE = Path("/tmp/booru3d_items.json")
DENSE_META_CACHE = Path("/tmp/densepose_items.json")

TARGET_PER_DATASET = 5000
MAX_EDGE = 384
WEBP_QUALITY = 76

BOORU_SHARDS = [
    "archives/train-000.tar",
    "archives/train-001.tar",
    "archives/train-002.tar",
    "archives/train-003.tar",
    "archives/train-004.tar",
    "archives/train-005.tar",
    "archives/train-006.tar",
    "archives/validation-000.tar",
    "archives/test-000.tar",
]

DENSE_SHARD_COUNT = 72  # 72 * 150 = ~10,800 candidates -> deduplicate cleanly to 5,000

POSE_SIGNAL_WORDS = {
    "standing", "stand", "sitting", "sit", "kneeling", "kneel", "crouching", "crouch",
    "squatting", "squat", "lying", "reclining", "leaning", "bending", "arched", "arch",
    "walking", "walk", "running", "run", "jumping", "jump", "floating", "flying",
    "dancing", "dance", "stretching", "stretch", "turning", "twisting", "reaching",
    "holding", "hugging", "embracing", "kissing", "fighting", "kicking", "punching",
    "pointing", "waving", "saluting", "bowing", "praying", "sleeping", "looking",
    "looking back", "looking at viewer", "looking away", "looking up", "looking down",
    "looking to the side", "profile", "from behind", "from side", "from above", "from below",
    "dutch angle", "upside-down", "head tilt", "contrapposto", "crossed legs", "crossed arms",
    "arms behind back", "arms up", "arm up", "arms crossed", "arms at sides", "outstretched arms",
    "hand raised", "hands up", "hand on hip", "hands on hips", "hand on chest", "hand on cheek",
    "hand to mouth", "finger to mouth", "peace sign", "v", "open hand", "clenched hand",
    "grasping", "carrying", "sword", "weapon", "chair", "bench", "bed", "floor", "ground",
    "full body", "cowboy shot", "upper body", "portrait", "close-up", "wide shot",
    "1girl", "1boy", "2girls", "2boys", "1other", "multiple girls", "multiple boys", "couple",
    "solo", "2people", "two people", "group",
}

NOISE_BOORU_PATTERNS = [
    r"^score_\d+$",
    r"^year\s*\d+$",
    r"^\d+s$",
]

NOISE_BOORU_EXACT = {
    "masterpiece", "best quality", "high quality", "good quality", "normal quality",
    "low quality", "worst quality", "highres", "absurdres", "newest", "recent", "early",
    "mid", "safe", "general", "sensitive", "questionable", "explicit", "nsfw", "sfw",
    "blurry", "bokeh", "depth of field", "chromatic aberration", "film grain", "jpeg artifacts",
    "signature", "watermark", "artist name", "commentary", "english commentary",
    "simple background", "white background", "black background", "transparent background",
    "monochrome", "greyscale", "color", "sketch", "lineart", "anime", "illustration",
    "digital art", "virtual youtuber", "vtuber", "original", "official art",
    "1girl", "1boy", "solo", "2girls", "2boys", "multiple girls", "multiple boys",
}

CATEGORY_TAGS = [
    ("standing", ("standing", "stand", "upright", "contrapposto")),
    ("sitting", ("sitting", "sit", "seated", "chair", "bench", "stool", "throne", "lap")),
    ("kneeling", ("kneeling", "kneel", "all fours", "on one knee")),
    ("crouching", ("crouching", "crouch", "squatting", "squat")),
    ("reclining", ("lying", "reclining", "on back", "on stomach", "on side", "bed")),
    ("action", ("running", "jumping", "kicking", "punching", "fighting", "walking", "lunging", "swinging", "throwing", "dancing", "leap")),
    ("hands", ("hand", "hands", "finger", "fingers", "peace sign", "pointing", "waving", "clenched", "palm", "gesture")),
    ("looking back", ("looking back", "over shoulder", "from behind")),
    ("portrait", ("upper body", "portrait", "close-up", "headshot", "bust")),
    ("full-body", ("full body", "full-body", "head to toe")),
    ("duo", ("2girls", "2boys", "couple", "two ", "two people", "two individuals", "together", "hugging", "partner")),
]


def compute_dhash(img: Image.Image, hash_size: int = 8) -> int:
    gray = img.convert("L").resize((hash_size + 1, hash_size), Image.Resampling.BILINEAR)
    arr = np.asarray(gray, dtype=np.int16)
    diff = arr[:, 1:] > arr[:, :-1]
    bits = 0
    for bit in diff.flatten():
        bits = (bits << 1) | int(bool(bit))
    return bits


def encode_webp(img: Image.Image) -> bytes:
    rgb = img.convert("RGB")
    rgb.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    rgb.save(buf, format="WEBP", quality=WEBP_QUALITY, method=3)
    return buf.getvalue()


def infer_camera_angle(text_lower: str, aspect_w_h: float, is_upper_only: bool = False) -> str:
    if any(k in text_lower for k in ("from below", "low-angle", "low angle", "worm's eye", "looking upward")):
        return "low-angle"
    if any(k in text_lower for k in ("from above", "high-angle", "high angle", "bird's eye", "overhead", "looking down at")):
        return "high-angle"
    if any(k in text_lower for k in ("close-up", "closeup", "portrait", "headshot", "upper body", "face close", "bust shot")) or is_upper_only:
        return "close-up"
    if any(k in text_lower for k in ("full body", "full-body", "wide shot", "standing", "walking", "running", "jumping")):
        return "full-body"
    if aspect_w_h < 0.78:
        return "full-body"
    return "eye-level"


def extract_clean_tags(text_lower: str, extra_tokens=()) -> list[str]:
    tags = []
    seen = set()
    for label, keywords in CATEGORY_TAGS:
        if any(kw in text_lower for kw in keywords):
            if label not in seen:
                seen.add(label)
                tags.append(label)
    for tok in extra_tokens:
        t = tok.strip().lower()
        if t and t not in seen and len(t) <= 28:
            seen.add(t)
            tags.append(t)
        if len(tags) >= 6:
            break
    if not tags:
        tags.append("pose")
    return tags[:6]


def make_short_title(phrases: list[str], fallback: str = "Studio Pose Reference") -> str:
    words = []
    for p in phrases:
        for w in re.findall(r"[A-Za-z0-9'-]+", p):
            lw = w.lower()
            if lw in {"the", "a", "an", "is", "are", "of", "in", "on", "at", "with", "to", "for", "and", "or", "person", "someone", "individual", "subject"}:
                continue
            words.append(w.capitalize())
            if len(words) >= 4:
                return " ".join(words)
    if words:
        return " ".join(words[:5])
    return fallback


# ==============================================================================
# PART 1: BOORU3DPOSE_10K
# ==============================================================================

def clean_booru_caption(raw_caption: str):
    parts = [p.strip() for p in raw_caption.split(",") if p.strip()]
    pose_tags = []
    sentences = []
    subject_count = "single subject"

    for part in parts:
        pl = part.lower()
        if any(re.match(pat, pl) for pat in NOISE_BOORU_PATTERNS):
            continue
        if pl in NOISE_BOORU_EXACT:
            if pl in ("2girls", "2boys", "couple"):
                subject_count = "two subjects"
            elif "multiple" in pl:
                subject_count = "multiple subjects"
            continue

        if len(part.split()) >= 6:
            if any(w in pl for w in ("pose", "posture", "stand", "sit", "kneel", "lean", "arm", "hand", "head", "body", "camera", "angle", "viewpoint", "frame", "shot", "look", "crouch", "lying")):
                sentences.append(part)
            continue

        if pl in POSE_SIGNAL_WORDS or any(kw in pl for kw in ("pose", "stand", "sit", "kneel", "crouch", "lying", "lean", "hand", "arm", "finger", "leg", "look", "from ", "shot", "angle", "profile", "back", "turn", "tilt", "hug", "hold", "walk", "run", "jump", "dance", "stretch")):
            pose_tags.append(pl)

    pose_tags = list(dict.fromkeys(pose_tags))

    if sentences:
        cleaned_sents = []
        for s in sentences[:2]:
            s = s.strip().rstrip(".")
            s = s[0].upper() + s[1:]
            cleaned_sents.append(s)
        extra_cues = [t for t in pose_tags if t not in " ".join(cleaned_sents).lower()][:5]
        prompt = ". ".join(cleaned_sents) + "."
        if extra_cues:
            prompt += f" Key posture cues: {', '.join(extra_cues)}."
    elif pose_tags:
        framing = [t for t in pose_tags if t in ("full body", "cowboy shot", "upper body", "portrait", "close-up", "from behind", "from side", "from above", "from below")]
        actions = [t for t in pose_tags if t not in framing][:8]
        parts_txt = []
        if actions:
            parts_txt.append(f"{subject_count.capitalize()} captured with {', '.join(actions)}")
        else:
            parts_txt.append(f"{subject_count.capitalize()} in articulated 3D studio pose")
        if framing:
            parts_txt.append(f"framed as {', '.join(framing[:3])}")
        prompt = ", ".join(parts_txt) + "."
    else:
        fallback_bits = [p for p in parts if p.lower() not in NOISE_BOORU_EXACT][:6]
        prompt = f"3D mannequin reference posture ({', '.join(fallback_bits)})." if fallback_bits else "Articulated 3D mannequin posture reference."

    title = make_short_title(pose_tags[:4] if pose_tags else sentences[:1], "3D Mannequin Pose")
    return pose_tags, prompt, title


def stream_booru_shard(shard_rel_path: str):
    """Stream tar shard AND decode/encode WebP inside worker thread for 4x speed."""
    url = f"https://huggingface.co/datasets/toyxyz/booru3dpose_10k/resolve/main/{shard_rel_path}"
    pairs = {}
    req = urllib.request.Request(url, headers={"User-Agent": "PromptForge-Ingest/1.0"})
    with urllib.request.urlopen(req, timeout=300) as resp:
        with tarfile.open(fileobj=resp, mode="r|") as tar:
            for member in tar:
                if not member.isfile():
                    continue
                name = member.name
                if "/condition/" in name and name.endswith(".png"):
                    stem = os.path.splitext(os.path.basename(name))[0]
                    pairs.setdefault(stem, {})["cond"] = tar.extractfile(member).read()
                elif name.endswith(".txt"):
                    stem = os.path.splitext(os.path.basename(name))[0]
                    pairs.setdefault(stem, {})["txt"] = tar.extractfile(member).read().decode("utf-8", errors="replace").strip()

    candidates = []
    for stem, rec in pairs.items():
        if "cond" not in rec:
            continue
        raw_txt = rec.get("txt", "")
        try:
            im = Image.open(io.BytesIO(rec["cond"])).convert("RGB")
        except Exception:
            continue
        arr = np.asarray(im.resize((96, 96), Image.Resampling.BILINEAR))
        non_black = float(np.mean(np.max(arr, axis=2) > 18))
        if non_black < 0.015 or non_black > 0.94:
            continue

        dhash = compute_dhash(im)
        pose_tags, natural_prompt, title = clean_booru_caption(raw_txt)
        richness = len(pose_tags) * 2 + (5 if len(natural_prompt) > 65 else 0)
        w, h = im.size
        is_upper = any(t in ("upper body", "portrait", "close-up") for t in pose_tags)
        camera_angle = infer_camera_angle(raw_txt.lower(), w / max(h, 1), is_upper)
        tags = extract_clean_tags(raw_txt.lower(), pose_tags)

        candidates.append({
            "stem": stem,
            "richness": richness,
            "dhash": dhash,
            "tag_set": set(pose_tags) if pose_tags else set(tags),
            "webp": encode_webp(im),
            "title": title,
            "naturalPrompt": natural_prompt,
            "tags": tags,
            "cameraAngle": camera_angle,
        })

    print(f"[booru3d] Processed {shard_rel_path}: {len(candidates)} valid candidates", flush=True)
    return candidates


def ingest_booru3d():
    BOORU_DIR.mkdir(parents=True, exist_ok=True)
    for old in BOORU_DIR.glob("*.webp"):
        old.unlink()

    t0 = time.time()
    all_candidates = []
    print("[booru3d] Streaming & encoding 9 TAR shards across 4 workers...", flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        for shard_candidates in ex.map(stream_booru_shard, BOORU_SHARDS):
            all_candidates.extend(shard_candidates)

    print(f"[booru3d] Collected {len(all_candidates)} valid candidates in {time.time() - t0:.1f}s. Deduplicating to {TARGET_PER_DATASET}...", flush=True)
    all_candidates.sort(key=lambda c: (-c["richness"], c["stem"]))

    kept = []
    kept_hashes_np = np.zeros(TARGET_PER_DATASET, dtype=np.uint64)
    kept_tag_sets = []
    popcount16 = np.array([bin(i).count("1") for i in range(65536)], dtype=np.uint8)

    def hamming_arr(h_val: int, count: int):
        xor = kept_hashes_np[:count] ^ np.uint64(h_val)
        return (
            popcount16[xor & np.uint64(0xFFFF)]
            + popcount16[(xor >> np.uint64(16)) & np.uint64(0xFFFF)]
            + popcount16[(xor >> np.uint64(32)) & np.uint64(0xFFFF)]
            + popcount16[(xor >> np.uint64(48)) & np.uint64(0xFFFF)]
        )

    rejected = []
    for c in all_candidates:
        if len(kept) >= TARGET_PER_DATASET:
            break
        n = len(kept)
        if n > 0:
            dists = hamming_arr(c["dhash"], n)
            if int(dists.min()) <= 4:
                rejected.append(c)
                continue
            tset = c["tag_set"]
            too_close_tags = False
            if len(tset) >= 3:
                for idx in np.where(dists <= 11)[0]:
                    other = kept_tag_sets[idx]
                    union = len(tset | other)
                    if union > 0 and (len(tset & other) / union) >= 0.72:
                        too_close_tags = True
                        break
            if too_close_tags:
                rejected.append(c)
                continue
        kept_hashes_np[n] = np.uint64(c["dhash"])
        kept_tag_sets.append(c["tag_set"])
        kept.append(c)

    if len(kept) < TARGET_PER_DATASET:
        for c in rejected:
            if len(kept) >= TARGET_PER_DATASET:
                break
            if int(hamming_arr(c["dhash"], len(kept)).min()) >= 2:
                kept_hashes_np[len(kept)] = np.uint64(c["dhash"])
                kept.append(c)

    items = []
    for i, c in enumerate(kept[:TARGET_PER_DATASET], 1):
        pid = f"booru3d_{i:04d}"
        (BOORU_DIR / f"{pid}.webp").write_bytes(c["webp"])
        items.append({
            "id": pid,
            "dataset": "booru3d",
            "datasetLabel": "3D Shaded Mannequins",
            "imageUrl": f"/poses/booru3d/{pid}.webp",
            "title": c["title"],
            "naturalPrompt": c["naturalPrompt"],
            "tags": c["tags"],
            "cameraAngle": c["cameraAngle"],
        })

    BOORU_META_CACHE.write_text(json.dumps(items, separators=(",", ":")), encoding="utf-8")
    print(f"[booru3d] Saved {len(items)} WebP poses + metadata checkpoint in {time.time() - t0:.1f}s", flush=True)
    return items


# ==============================================================================
# PART 2: DENSE_POSE_CONTROLNET
# ==============================================================================

def fetch_dense_shard(shard_idx: int):
    url = f"https://huggingface.co/datasets/fAIseh00d/dense_pose_controlnet/resolve/main/data/train-{shard_idx:05d}-of-00133.parquet"
    rows_out = []
    with fsspec.open(url, mode="rb") as f:
        pf = pq.ParquetFile(f)
        table = pf.read(columns=["id", "conditioning_image", "text"])
    d = table.to_pydict()
    for rid, cbytes, text in zip(d["id"], d["conditioning_image"], d["text"]):
        if not cbytes or not text or len(text.strip()) < 15:
            continue
        try:
            im = Image.open(io.BytesIO(cbytes)).convert("RGB")
        except Exception:
            continue

        small = np.asarray(im.resize((96, 96), Image.Resampling.BILINEAR), dtype=np.int16)
        bg = small[0, 0]
        fg_ratio = float(np.mean(np.abs(small - bg).sum(axis=2) > 35))
        if fg_ratio < 0.025 or fg_ratio > 0.88 or float(small.std()) < 12.0:
            continue

        w, h = im.size
        clean_txt = " ".join(text.strip().split())
        if not clean_txt.endswith((".", "!", "?")):
            clean_txt += "."
        clean_txt = clean_txt[0].upper() + clean_txt[1:]

        rows_out.append({
            "rid": rid,
            "dhash": compute_dhash(im),
            "webp": encode_webp(im),
            "title": make_short_title([clean_txt], "DensePose Action Reference"),
            "naturalPrompt": clean_txt,
            "tags": extract_clean_tags(clean_txt.lower()),
            "cameraAngle": infer_camera_angle(clean_txt.lower(), w / max(h, 1), False),
        })
    return shard_idx, rows_out


def ingest_densepose():
    DENSE_DIR.mkdir(parents=True, exist_ok=True)
    for old in DENSE_DIR.glob("*.webp"):
        old.unlink()

    t0 = time.time()
    all_candidates = []
    print(f"[densepose] Streaming {DENSE_SHARD_COUNT} Parquet shards (columns: id, conditioning_image, text)...", flush=True)

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        for idx, rows in ex.map(fetch_dense_shard, range(DENSE_SHARD_COUNT)):
            all_candidates.extend(rows)
            if (idx + 1) % 10 == 0 or (idx + 1) == DENSE_SHARD_COUNT:
                print(f"[densepose] Shard {idx + 1}/{DENSE_SHARD_COUNT} -> {len(all_candidates)} valid candidates...", flush=True)

    print(f"[densepose] Collected {len(all_candidates)} valid UV maps in {time.time() - t0:.1f}s. Computing TF-IDF + dHash deduplication...", flush=True)

    vec = TfidfVectorizer(stop_words="english", max_features=8000, ngram_range=(1, 2))
    tfidf = vec.fit_transform([c["naturalPrompt"] for c in all_candidates])

    popcount16 = np.array([bin(i).count("1") for i in range(65536)], dtype=np.uint8)
    kept = []
    kept_indices = []
    kept_hashes_np = np.zeros(TARGET_PER_DATASET, dtype=np.uint64)
    rejected = []

    def hamming_arr(h_val: int, count: int):
        xor = kept_hashes_np[:count] ^ np.uint64(h_val)
        return (
            popcount16[xor & np.uint64(0xFFFF)]
            + popcount16[(xor >> np.uint64(16)) & np.uint64(0xFFFF)]
            + popcount16[(xor >> np.uint64(32)) & np.uint64(0xFFFF)]
            + popcount16[(xor >> np.uint64(48)) & np.uint64(0xFFFF)]
        )

    for idx, c in enumerate(all_candidates):
        if len(kept) >= TARGET_PER_DATASET:
            break
        n = len(kept)
        if n > 0:
            if int(hamming_arr(c["dhash"], n).min()) <= 5:
                rejected.append(c)
                continue
            check_idx = kept_indices[-400:]
            sims = (tfidf[idx] @ tfidf[check_idx].T).toarray()[0]
            if sims.size > 0 and float(sims.max()) >= 0.76:
                rejected.append(c)
                continue
        kept_hashes_np[n] = np.uint64(c["dhash"])
        kept_indices.append(idx)
        kept.append(c)

    if len(kept) < TARGET_PER_DATASET:
        for c in rejected:
            if len(kept) >= TARGET_PER_DATASET:
                break
            if int(hamming_arr(c["dhash"], len(kept)).min()) >= 2:
                kept_hashes_np[len(kept)] = np.uint64(c["dhash"])
                kept.append(c)

    items = []
    for i, c in enumerate(kept[:TARGET_PER_DATASET], 1):
        pid = f"densepose_{i:04d}"
        (DENSE_DIR / f"{pid}.webp").write_bytes(c["webp"])
        items.append({
            "id": pid,
            "dataset": "densepose",
            "datasetLabel": "DensePose Body Maps",
            "imageUrl": f"/poses/densepose/{pid}.webp",
            "title": c["title"],
            "naturalPrompt": c["naturalPrompt"],
            "tags": c["tags"],
            "cameraAngle": c["cameraAngle"],
        })

    DENSE_META_CACHE.write_text(json.dumps(items, separators=(",", ":")), encoding="utf-8")
    print(f"[densepose] Saved {len(items)} WebP poses + metadata checkpoint in {time.time() - t0:.1f}s", flush=True)
    return items


def merge_manifests():
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    booru_items = json.loads(BOORU_META_CACHE.read_text(encoding="utf-8"))
    dense_items = json.loads(DENSE_META_CACHE.read_text(encoding="utf-8"))
    combined = booru_items + dense_items
    OUT_JSON.write_text(json.dumps(combined, separators=(",", ":")), encoding="utf-8")
    print(f"DONE! Wrote {len(combined)} total poses to {OUT_JSON} ({OUT_JSON.stat().st_size / 1e6:.2f} MB)", flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--stage", choices=["all", "booru3d", "densepose", "merge"], default="all")
    args = parser.parse_args()

    if args.stage in ("all", "booru3d"):
        ingest_booru3d()
    if args.stage in ("all", "densepose"):
        ingest_densepose()
    if args.stage in ("all", "merge"):
        merge_manifests()


if __name__ == "__main__":
    main()
