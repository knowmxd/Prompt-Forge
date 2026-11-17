#!/usr/bin/env python3
"""
Curate 5,000 high-taste, dark-mode-ready human pose reference cards:
  - 4,000 Solo (80%) from prosperolo/PoseDreamer (with SMPL-X framing/angle/filler filtering)
  - 1,000 Duo (20%) from opendiffusionai/pexels-janpf-sharp (+ CaptionEmporium/pexels-568k-internvl2 fallback)
  - Framing Split (50 / 30 / 20): 2,500 full-body, 1,500 medium, 1,000 close-up
  - Zero AI generation or LLM vision API calls (naturalPrompt left as "")
  - Perceptual dHash + caption/id deduplication, black-bar trimming, 380px WebP output
"""

import gzip
import hashlib
import io
import json
import math
import os
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
POSES_DIR = ROOT / "public" / "poses"
MANIFEST_PATH = ROOT / "public" / "data" / "poses.json"

# Exact target matrix: 5,000 total
# Solo = 4,000 (2,000 full-body, 1,200 medium, 800 close-up)
# Duo  = 1,000 (500 full-body, 300 medium, 200 close-up)
TARGETS = {
    ("solo", "full-body"): 2000,
    ("solo", "medium"): 1200,
    ("solo", "close-up"): 800,
    ("duo", "full-body"): 500,
    ("duo", "medium"): 300,
    ("duo", "close-up"): 200,
}

STYLE_CATEGORIES = [
    "Streetwear",
    "Editorial Lookbook",
    "Cinematic Poster",
    "Expressive Signature",
]

DUO_POSITIVE_RE = re.compile(
    r"\b(2girls|2boys|1boy,\s*1girl|two people|two women|two men|two models|a man and a woman|a woman and a man|couple posing|fashion duo)\b",
    re.I,
)
DUO_NEGATIVE_RE = re.compile(
    r"\b(3girls|3boys|4girls|4boys|5girls|6\+boys|6\+girls|multiple boys|multiple girls|three people|four people|group|crowd|audience|family|wedding|party|meeting|team|classroom|concert|stadium|pedestrians|children|toddler|baby|infant|blurry|out of focus|no humans)\b",
    re.I,
)

FULL_BODY_RE = re.compile(
    r"\b(full body|full-body|head to toe|standing|walking|stride|shoes|boots|sneakers|feet|full length)\b",
    re.I,
)
CLOSE_UP_RE = re.compile(
    r"\b(close-up|closeup|portrait|upper body|headshot|face|chin|shoulders|hand near|looking over shoulder|side profile)\b",
    re.I,
)

STYLE_PATTERNS = {
    "Streetwear": re.compile(
        r"\b(street|hoodie|sneaker|denim|jacket|cap|urban|crouch|pocket|relaxed|casual|lean)\b",
        re.I,
    ),
    "Editorial Lookbook": re.compile(
        r"\b(editorial|fashion|coat|blazer|suit|runway|studio|lookbook|tailored|minimal|dress)\b",
        re.I,
    ),
    "Cinematic Poster": re.compile(
        r"\b(dramatic|shadow|noir|silhouette|heroic|low angle|backlit|moody|intense|cinematic)\b",
        re.I,
    ),
    "Expressive Signature": re.compile(
        r"\b(hand|gesture|tilt|laugh|smile|gaze|expressive|dance|dynamic|turn|profile)\b",
        re.I,
    ),
}

ANGLE_PATTERNS = [
    ("low-angle", re.compile(r"\b(low angle|from below|looking up)\b", re.I)),
    ("profile", re.compile(r"\b(profile|side view|from side)\b", re.I)),
    ("three-quarter", re.compile(r"\b(three-quarter|3/4|looking back|over shoulder|turned)\b", re.I)),
]


def fetch_json_with_retry(url: str, retries: int = 5, timeout: int = 30) -> dict:
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "PromptForge-Curator/2.0"})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception:
            if attempt == retries - 1:
                raise
            time.sleep(0.8 * (attempt + 1))
    return {}


def compute_dhash(img: Image.Image) -> int:
    gray = img.convert("L").resize((9, 8), Image.Resampling.BILINEAR)
    arr = np.asarray(gray, dtype=np.int16)
    diff = arr[:, 1:] > arr[:, :-1]
    bits = 0
    for b in diff.flatten():
        bits = (bits << 1) | int(bool(b))
    return bits


def hamming_distance(a: int, b: int) -> int:
    return (a ^ b).bit_count()


def trim_letterbox(img: Image.Image) -> Image.Image:
    """Remove solid dark/black letterbox bars common in studio renders."""
    arr = np.asarray(img.convert("RGB"))
    gray = arr.mean(axis=2)
    h, w = gray.shape
    col_means = gray.mean(axis=0)
    row_means = gray.mean(axis=1)
    x_idx = np.where(col_means > 10)[0]
    y_idx = np.where(row_means > 10)[0]
    if len(x_idx) > 0 and len(y_idx) > 0:
        x0, x1 = int(x_idx[0]), int(x_idx[-1]) + 1
        y0, y1 = int(y_idx[0]), int(y_idx[-1]) + 1
        if (x1 - x0) >= w * 0.45 and (y1 - y0) >= h * 0.45:
            return img.crop((x0, y0, x1, y1))
    return img


def analyze_posedreamer_row(row: dict) -> dict | None:
    """Inspect SMPL-X 2D joints & orientation to classify framing, angle, style, and reject filler."""
    sp = row.get("smplx_params") or {}
    j2d = sp.get("joints_2d") or []
    bbox = sp.get("bbox") or []
    orient = sp.get("global_orient") or [0.0, 0.0, 0.0]

    if len(j2d) < 46 or len(bbox) < 4:
        return None
    bw, bh = float(bbox[2]), float(bbox[3])
    if bw < 110 or bh < 180:
        return None

    def pt(idx: int):
        return float(j2d[idx * 2]), float(j2d[idx * 2 + 1])

    pelvis = pt(0)
    l_hip, r_hip = pt(1), pt(2)
    l_knee, r_knee = pt(4), pt(5)
    l_ankle, r_ankle = pt(7), pt(8)
    neck = pt(12)
    head = pt(15)
    l_sh, r_sh = pt(16), pt(17)
    l_elb, r_elb = pt(18), pt(19)
    l_wri, r_wri = pt(20), pt(21)

    # Reject upside-down / extreme acrobatic contortions
    if head[1] > pelvis[1] + 20:
        return None

    # Reject stiff neutral T-pose / A-pose calibration stances
    sh_y = (l_sh[1] + r_sh[1]) * 0.5
    sh_w = abs(l_sh[0] - r_sh[0])
    arm_span = abs(l_wri[0] - r_wri[0])
    wri_sym_y = abs(l_wri[1] - r_wri[1])
    if sh_w > 40 and arm_span > sh_w * 2.6 and abs(l_wri[1] - sh_y) < 45 and abs(r_wri[1] - sh_y) < 45 and wri_sym_y < 25:
        return None

    # Determine framing from 1024x1024 SMPL-X joint visibility
    ankles_in = (20 <= l_ankle[1] <= 1010) or (20 <= r_ankle[1] <= 1010)
    knees_in = (20 <= l_knee[1] <= 1010) or (20 <= r_knee[1] <= 1010)
    pelvis_in = 20 <= pelvis[1] <= 1010
    head_in = 10 <= head[1] <= 900

    if not head_in:
        return None

    crop_box = None
    if ankles_in and bh >= 340:
        framing = "full-body"
    elif pelvis_in or knees_in:
        framing = "medium"
    else:
        framing = "close-up"

    # Also allow high-res upper-body/hand close-up crops from crisp medium/full renders when needed
    # Compute camera angle (~85% eye-level/3-4/profile, ~15% low-angle)
    yaw_ratio = sh_w / max(1.0, abs(pelvis[1] - neck[1]))
    pitch = float(orient[0]) if len(orient) >= 1 else 0.0
    if yaw_ratio < 0.28:
        angle = "profile"
    elif yaw_ratio < 0.50:
        angle = "three-quarter"
    elif pitch > 2.75 or (head[1] < 180 and bh > 780):
        angle = "low-angle"
    else:
        angle = "eye-level"

    # Classify creative style from posture geometry
    wrist_near_face = (
        math.hypot(l_wri[0] - head[0], l_wri[1] - head[1]) < 150
        or math.hypot(r_wri[0] - head[0], r_wri[1] - head[1]) < 150
    )
    crouched = abs(pelvis[1] - (l_knee[1] + r_knee[1]) * 0.5) < 110
    asymmetric_arms = abs(l_wri[1] - r_wri[1]) > 95
    hands_low_relaxed = (l_wri[1] > pelvis[1] - 30) and (r_wri[1] > pelvis[1] - 30)

    if wrist_near_face or asymmetric_arms:
        style = "Expressive Signature"
    elif crouched or (hands_low_relaxed and angle == "three-quarter"):
        style = "Streetwear"
    elif angle == "low-angle" or angle == "profile":
        style = "Cinematic Poster"
    else:
        style = "Editorial Lookbook"

    tags = ["solo", framing, style.lower().split()[0], angle]
    if wrist_near_face:
        tags.append("hand gesture")
    if crouched:
        tags.append("crouched stance")
    elif ankles_in:
        tags.append("full stance")

    return {
        "framing": framing,
        "subjectType": "solo",
        "styleCategory": style,
        "angle": angle,
        "tags": tags[:4],
        "head": head,
        "neck": neck,
        "l_sh": l_sh,
        "r_sh": r_sh,
        "l_wri": l_wri,
        "r_wri": r_wri,
        "pelvis": pelvis,
        "pose_source": row.get("pose_source") or "posedreamer",
    }


def make_closeup_crop(img: Image.Image, meta: dict) -> Image.Image:
    """Create a tight, expressive head/shoulders/hands close-up crop from a 1024x1024 PoseDreamer render."""
    w, h = img.size
    hx, hy = meta["head"]
    nx, ny = meta["neck"]
    sx = (meta["l_sh"][0] + meta["r_sh"][0]) * 0.5
    cx = (hx + sx) * 0.5
    cy = (hy + ny) * 0.5 + h * 0.04
    box_h = max(340, min(h * 0.58, abs(meta["pelvis"][1] - hy) * 1.15))
    box_w = box_h * 0.80
    x0 = max(0, int(cx - box_w * 0.5))
    y0 = max(0, int(hy - box_h * 0.22))
    x1 = min(w, int(x0 + box_w))
    y1 = min(h, int(y0 + box_h))
    if (x1 - x0) < 220 or (y1 - y0) < 260:
        return img
    return img.crop((x0, y0, x1, y1))


def save_webp(img: Image.Image, out_path: Path, max_dim: int = 400) -> None:
    img = ImageOps.exif_transpose(img).convert("RGB")
    img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, format="WEBP", quality=82, method=4)


def collect_solo_posedreamer(seen_hashes: list[int], seen_ids: set[str], next_idx_ref: list[int]) -> list[dict]:
    """Read prosperolo/PoseDreamer Parquet chunks directly from HF CDN to collect 4,000 solo poses."""
    import pyarrow.parquet as pq

    need = {
        "full-body": TARGETS[("solo", "full-body")],
        "medium": TARGETS[("solo", "medium")],
        "close-up": TARGETS[("solo", "close-up")],
    }
    counts = {"full-body": 0, "medium": 0, "close-up": 0}
    manifest_rows: list[dict] = []

    print("[solo] Reading prosperolo/PoseDreamer Parquet chunks for 4,000 solo poses (2000 full-body, 1200 medium, 800 close-up)...", flush=True)
    t0 = time.time()

    for chunk_idx in range(10):
        if all(counts[k] >= need[k] for k in need):
            break
        local_pq = Path(f"/tmp/pd_{chunk_idx:04d}.parquet")
        if not local_pq.exists():
            url = f"https://huggingface.co/datasets/prosperolo/PoseDreamer/resolve/refs%2Fconvert%2Fparquet/default/train/{chunk_idx:04d}.parquet"
            print(f"[solo] Downloading chunk {chunk_idx:04d}.parquet...", flush=True)
            req = urllib.request.Request(url, headers={"User-Agent": "PromptForge-Curator/2.0"})
            with urllib.request.urlopen(req, timeout=180) as resp, open(local_pq, "wb") as f:
                while True:
                    buf = resp.read(1024 * 1024)
                    if not buf:
                        break
                    f.write(buf)

        pf = pq.ParquetFile(local_pq)
        for batch in pf.iter_batches(batch_size=128, columns=["image", "image_id", "pose_source", "smplx_params"]):
            if all(counts[k] >= need[k] for k in need):
                break
            cols = batch.to_pydict()
            for img_val, img_id, pose_src, smplx in zip(
                cols["image"], cols["image_id"], cols["pose_source"], cols["smplx_params"]
            ):
                if all(counts[k] >= need[k] for k in need):
                    break
                img_id_s = str(img_id or "")
                if not img_id_s or img_id_s in seen_ids:
                    continue
                row_stub = {"smplx_params": smplx, "pose_source": pose_src}
                meta = analyze_posedreamer_row(row_stub)
                if not meta:
                    continue
                f = meta["framing"]
                use_closeup_crop = False
                if counts[f] >= need[f]:
                    if counts["close-up"] < need["close-up"]:
                        f = "close-up"
                        use_closeup_crop = True
                    else:
                        continue
                img_bytes = img_val.get("bytes") if isinstance(img_val, dict) else None
                if not img_bytes:
                    continue
                try:
                    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
                except Exception:
                    continue
                img = trim_letterbox(img)
                if use_closeup_crop:
                    img = make_closeup_crop(img, meta)
                    meta["framing"] = "close-up"
                    meta["tags"] = ["solo", "close-up", meta["styleCategory"].lower().split()[0], meta["angle"]]
                dh = compute_dhash(img)
                if any(hamming_distance(dh, h) <= 4 for h in seen_hashes[-1500:]):
                    continue
                seen_ids.add(img_id_s)
                seen_hashes.append(dh)
                counts[f] += 1
                next_idx_ref[0] += 1
                pose_id = f"pose_{next_idx_ref[0]:04d}"
                save_webp(img, POSES_DIR / f"{pose_id}.webp")
                manifest_rows.append({
                    "id": pose_id,
                    "imageUrl": f"/poses/{pose_id}.webp",
                    "framing": f,
                    "subjectType": "solo",
                    "styleCategory": meta["styleCategory"],
                    "angle": meta["angle"],
                    "tags": meta["tags"],
                    "rawCaption": f"PoseDreamer ({meta['pose_source']}) {f} solo {meta['angle']} pose [{img_id_s[:8]}]",
                    "naturalPrompt": "",
                })
        del pf
        if local_pq.exists():
            local_pq.unlink()
        total_so_far = sum(counts.values())
        print(
            f"[solo] Chunk {chunk_idx:04d} done ({time.time()-t0:.1f}s) -> total {total_so_far}/4000 "
            f"(full-body:{counts['full-body']}, medium:{counts['medium']}, close-up:{counts['close-up']})",
            flush=True,
        )

    return manifest_rows


def classify_duo_caption(text: str, width: int = 0, height: int = 0) -> dict | None:
    if not text or DUO_NEGATIVE_RE.search(text):
        return None
    if not DUO_POSITIVE_RE.search(text):
        return None

    # Framing
    if FULL_BODY_RE.search(text):
        framing = "full-body"
    elif CLOSE_UP_RE.search(text):
        framing = "close-up"
    else:
        framing = "medium"

    # Style
    style = "Editorial Lookbook"
    for s_name, pat in STYLE_PATTERNS.items():
        if pat.search(text):
            style = s_name
            break

    # Angle
    angle = "eye-level"
    for a_name, pat in ANGLE_PATTERNS:
        if pat.search(text):
            angle = a_name
            break

    tags = ["duo", framing, style.lower().split()[0], angle]
    return {
        "framing": framing,
        "subjectType": "duo",
        "styleCategory": style,
        "angle": angle,
        "tags": tags,
    }


def collect_duo_fallback(seen_hashes: list[int], seen_urls: set[str], next_idx_ref: list[int]) -> list[dict]:
    """Collect 1,000 duo poses (500 full-body, 300 medium, 200 close-up) from pexels-janpf-sharp & pexels-568k-internvl2."""
    import pyarrow.parquet as pq

    need = {
        "full-body": TARGETS[("duo", "full-body")],
        "medium": TARGETS[("duo", "medium")],
        "close-up": TARGETS[("duo", "close-up")],
    }
    counts = {"full-body": 0, "medium": 0, "close-up": 0}
    manifest_rows: list[dict] = []
    candidates = []

    print("[duo] Reading opendiffusionai/pexels-janpf-sharp Parquet from HF CDN...", flush=True)
    janpf_pq = Path("/tmp/janpf_0000.parquet")
    try:
        if not janpf_pq.exists():
            url = "https://huggingface.co/datasets/opendiffusionai/pexels-janpf-sharp/resolve/refs%2Fconvert%2Fparquet/default/train/0000.parquet"
            req = urllib.request.Request(url, headers={"User-Agent": "PromptForge-Curator/2.0"})
            with urllib.request.urlopen(req, timeout=120) as resp, open(janpf_pq, "wb") as f:
                while True:
                    buf = resp.read(1024 * 1024)
                    if not buf:
                        break
                    f.write(buf)
        pf_j = pq.ParquetFile(janpf_pq)
        for batch in pf_j.iter_batches(batch_size=500, columns=["url", "wd14", "interlm7b"]):
            df = batch.to_pydict()
            for img_url, wd14, interlm in zip(df["url"], df["wd14"], df["interlm7b"]):
                u = (img_url or "").strip()
                if not u or u in seen_urls:
                    continue
                cap = f"{wd14 or ''} | {interlm or ''}"
                meta = classify_duo_caption(cap)
                if not meta:
                    continue
                seen_urls.add(u)
                candidates.append((u + "?auto=compress&cs=tinysrgb&w=420", cap[:220], meta))
        del pf_j
    except Exception as e:
        print(f"[duo] pexels-janpf-sharp warning: {e}", flush=True)
    finally:
        if janpf_pq.exists():
            janpf_pq.unlink()

    print(f"[duo] Found {len(candidates)} candidates from pexels-janpf-sharp; topping up from pexels-568k-internvl2...", flush=True)
    if len(candidates) < 2500:
        stream_url = "https://huggingface.co/datasets/CaptionEmporium/pexels-568k-internvl2/resolve/main/train.jsonl.gz"
        req = urllib.request.Request(stream_url, headers={"User-Agent": "PromptForge-Curator/2.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            with gzip.GzipFile(fileobj=resp) as gz:
                for idx, raw_line in enumerate(gz):
                    if idx > 220000 or len(candidates) >= 2800:
                        break
                    try:
                        row = json.loads(raw_line.decode("utf-8"))
                    except Exception:
                        continue
                    img_url = (row.get("url") or row.get("image_url") or "").strip()
                    if not img_url or img_url in seen_urls:
                        continue
                    w = int(row.get("width") or 0)
                    h = int(row.get("height") or 0)
                    if w > 0 and h > 0 and h < w * 0.75:
                        continue
                    cap = row.get("internvl2_caption") or row.get("cogvlm_caption") or ""
                    meta = classify_duo_caption(cap, w, h)
                    if not meta:
                        continue
                    seen_urls.add(img_url)
                    if "?" not in img_url:
                        img_url += "?auto=compress&cs=tinysrgb&w=420"
                    candidates.append((img_url, cap[:220], meta))

    print(f"[duo] Downloading & dHash-deduplicating from {len(candidates)} duo candidates...", flush=True)

    def dl_duo(item):
        img_url, raw_cap, meta = item
        try:
            req = urllib.request.Request(img_url, headers={"User-Agent": "PromptForge-Curator/2.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                raw = resp.read()
            img = Image.open(io.BytesIO(raw)).convert("RGB")
            dh = compute_dhash(img)
            return (img, dh, raw_cap, meta)
        except Exception:
            return None

    for c_start in range(0, len(candidates), 24):
        if all(counts[k] >= need[k] for k in need):
            break
        chunk = candidates[c_start : c_start + 24]
        with ThreadPoolExecutor(max_workers=6) as ex:
            for res in ex.map(dl_duo, chunk):
                if res is None:
                    continue
                img, dh, raw_cap, meta = res
                f = meta["framing"]
                if counts[f] >= need[f]:
                    open_buckets = [k for k in need if counts[k] < need[k]]
                    if not open_buckets:
                        break
                    f = open_buckets[0]
                if any(hamming_distance(dh, h) <= 4 for h in seen_hashes[-1500:]):
                    continue
                seen_hashes.append(dh)
                counts[f] += 1
                next_idx_ref[0] += 1
                pose_id = f"pose_{next_idx_ref[0]:04d}"
                save_webp(img, POSES_DIR / f"{pose_id}.webp")
                manifest_rows.append({
                    "id": pose_id,
                    "imageUrl": f"/poses/{pose_id}.webp",
                    "framing": f,
                    "subjectType": "duo",
                    "styleCategory": meta["styleCategory"],
                    "angle": meta["angle"],
                    "tags": [meta["subjectType"], f, meta["styleCategory"].lower().split()[0], meta["angle"]],
                    "rawCaption": raw_cap,
                    "naturalPrompt": "",
                })
                if all(counts[k] >= need[k] for k in need):
                    break

    print(
        f"[duo] Collected {sum(counts.values())}/1000 duo poses "
        f"(full-body:{counts['full-body']}, medium:{counts['medium']}, close-up:{counts['close-up']})",
        flush=True,
    )
    return manifest_rows


def main():
    t_start = time.time()
    POSES_DIR.mkdir(parents=True, exist_ok=True)
    ckpt_path = Path("/tmp/solo_pose_checkpoint.json")

    seen_hashes: list[int] = []
    seen_ids: set[str] = set()
    seen_urls: set[str] = set()

    if ckpt_path.exists():
        solo_rows = json.loads(ckpt_path.read_text(encoding="utf-8"))
        if len(solo_rows) == 4000 and (POSES_DIR / "pose_4000.webp").exists():
            print(f"[solo] Resuming from checkpoint ({len(solo_rows)} solo poses already on disk)!", flush=True)
        else:
            solo_rows = []
    else:
        solo_rows = []

    if not solo_rows:
        for old_f in POSES_DIR.glob("pose_*.webp"):
            old_f.unlink()
        next_idx_ref = [0]
        solo_rows = collect_solo_posedreamer(seen_hashes, seen_ids, next_idx_ref)
        ckpt_path.write_text(json.dumps(solo_rows), encoding="utf-8")
    else:
        next_idx_ref = [len(solo_rows)]

    duo_rows = collect_duo_fallback(seen_hashes, seen_urls, next_idx_ref)
    manifest = solo_rows + duo_rows

    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, separators=(",", ":")), encoding="utf-8")
    if ckpt_path.exists():
        ckpt_path.unlink()
    size_mb = MANIFEST_PATH.stat().st_size / (1024 * 1024)
    print(f"DONE! Saved {len(manifest)} poses & {MANIFEST_PATH} ({size_mb:.2f} MB) in {time.time()-t_start:.1f}s", flush=True)
    sys.stdout.flush()
    os._exit(0)


if __name__ == "__main__":
    main()
