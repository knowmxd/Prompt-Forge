#!/usr/bin/env python3
"""
Overhaul and refine naturalPrompt, title, and subjectCount across all 4,123 pose cards
in public/data/poses.json for high-precision Nano Banana / Gemini / Flux structured JSON prompting.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "public" / "data" / "poses.json"

TYPO_FIXES = {
    "aginst": "against",
    "caouch": "couch",
    "couche": "couch",
    "carressing": "caressing",
    "holdinh": "holding",
    "thouching": "touching",
    "sittinh": "sitting",
    "standinh": "standing",
    "lookinh": "looking",
    "streching": "stretching",
    "recieving": "receiving",
    "seperate": "separate",
    "ballance": "balance",
    "knelling": "kneeling",
    "siting": "sitting",
    "standig": "standing",
    "walkig": "walking",
    "runing": "running",
    "bended": "bent",
}

ANGLE_PHRASES = {
    "front": "viewed straight-on from the front",
    "side": "viewed in side profile",
    "diagonal": "viewed from a three-quarter diagonal angle",
    "above": "viewed from a high angle above",
    "below": "viewed from a low angle below",
}

FRAMING_PHRASES = {
    "full-body": "full-body framing",
    "medium": "medium waist-up framing",
    "close-up": "close-up upper-body framing",
}

DUO_KEYWORDS = (
    "two females",
    "two males",
    "two girls",
    "two boys",
    "two women",
    "two men",
    "two people",
    "two characters",
    "two figures",
    "two models",
    "couple",
    "both of them",
    "each other",
    "hugging each",
    "back-to-back",
    "side by side",
)

# Posemaniacs tag -> (category, natural clause)
# Category prevents redundant stacking (e.g. sitting + sitting-on-chair)
PM_PRIMARY_STANCE = {
    "sitting-on-chair": "Seated on a chair",
    "sitting": "Seated",
    "kneeling": "Kneeling",
    "squatting": "Squatting low",
    "lying": "Reclining",
    "on-back": "Lying on the back",
    "on-side": "Lying on one side",
    "hand-standing": "Balancing in a handstand",
    "floating": "Suspended mid-air",
    "falling": "Captured mid-fall",
    "hanging": "Hanging from above",
    "jumping": "Leaping mid-air",
    "running": "Running mid-stride",
    "walking": "Walking mid-stride",
    "standing": "Standing upright",
}

PM_MODIFIERS = {
    "twisting-body": "with a twisted torso",
    "twisting-neck": "head turned sharply to the side",
    "hand-on-hip": "one hand resting on the hip",
    "crossing-arms": "arms crossed over the chest",
    "crossing-legs": "legs crossed",
    "raising-arm": "one arm raised upward",
    "raising-leg": "one leg lifted",
    "leaning": "leaning casually",
    "pointing": "pointing outward",
    "punching": "throwing a punch",
    "kicking": "extending a kick",
    "throwing": "winding up a throw",
    "pushing": "pushing forward",
    "pulling": "pulling back",
}

PM_CONTEXT = {
    "fashion": "in an editorial fashion stance",
    "idol": "in an expressive stage pose",
    "ballet": "with graceful ballet alignment",
    "dancing": "in a fluid dance movement",
    "yoga": "in a balanced yoga hold",
    "fighting": "in a dynamic combat stance",
    "parkour": "in an agile parkour motion",
    "athletics": "in an athletic form",
    "fitness": "in an active fitness stance",
    "body-building": "flexing with strong definition",
    "basketball": "in a basketball motion",
    "baseball": "in a baseball motion",
    "soccer": "in a soccer motion",
    "volleyball": "in a volleyball motion",
    "swimming": "in a swimming motion",
    "ball-game": "in a dynamic court motion",
    "sports": "in an athletic motion",
    "couple": "in a paired interaction",
}

PM_MOOD = {
    "cool": "with poised, confident energy",
    "relax": "with relaxed, natural weight distribution",
    "sexy": "with an alluring, poised silhouette",
    "sad": "with a subdued, introspective mood",
}

PM_TITLE_WORDS = {
    "sitting-on-chair": "Chair Sit",
    "hand-on-hip": "Hand on Hip",
    "crossing-arms": "Crossed Arms",
    "crossing-legs": "Crossed Legs",
    "raising-arm": "Raised Arm",
    "raising-leg": "Raised Leg",
    "twisting-body": "Torso Twist",
    "twisting-neck": "Head Turn",
    "on-back": "On Back",
    "on-side": "On Side",
    "hand-standing": "Handstand",
    "body-building": "Flex",
    "ball-game": "Court",
    "daily-life": "Casual",
    "relax": "Relaxed",
}


def fix_typos(text: str) -> str:
    def repl(match: re.Match[str]) -> str:
        word = match.group(0)
        fixed = TYPO_FIXES.get(word.lower())
        if not fixed:
            return word
        return fixed.capitalize() if word[0].isupper() else fixed

    return re.sub(r"\b[a-zA-Z]+\b", repl, text)


def clean_punctuation(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r",{2,}", ",", text)
    text = re.sub(r"^[,.;:\-\s]+", "", text)
    text = re.sub(r"[,;\-\s]+$", "", text)
    if text and text[-1] not in ".!?":
        text += "."
    if text:
        text = text[0].upper() + text[1:]
    return text


def refine_posemyart(item: dict) -> dict:
    raw = fix_typos(item.get("naturalPrompt") or item.get("title") or "")
    title = fix_typos(item.get("title") or "")
    combined_lower = f"{title} {raw}".lower()

    # Ensure duo poses are accurately flagged as 2 subjects
    is_duo = item.get("subjectCount", 1) >= 2 or any(k in combined_lower for k in DUO_KEYWORDS)
    subject_count = 2 if is_duo else 1

    text = raw

    # Strip meta-catalog suffixes/filler (never strip words after "like a")
    filler_patterns = [
        r",?\s*\b(?:male|female|anime|casual|fashion|simple|basic|drawing)?\s*(?:model|drawing|pose|hand|character)\s*(?:pose|reference)s?(?:\s+for\s+beginners)?\b\.?$",
        r",?\s*\b(?:male|female)\s+(?:anime\s+body\s+base|model|face|feet|hand|hands|pose|sitting|standing|nude)\.?$",
        r",?\s*\b(?:casual|anime|simple)\s+(?:hand|hands|pose)\.?$",
        r",?\s*\bfor a (?:fashion )?(?:illustration|drawing|reference)\b\.?$",
        r",?\s*\bposing(?: confidently| casually| elegantly)?\b(?=\s*(?:$|,))",
        r"(?<!like a )(?<!as a )\bpose\s*$",
    ]
    for pat in filler_patterns:
        text = re.sub(pat, "", text, flags=re.IGNORECASE).strip()

    if not is_duo:
        # Remove gender/entity prefixes so the pose never conflicts with Cast cards
        prefix_patterns = [
            r"^(?:[a-z]+\s+){0,2}(?:female|male|woman|man|girl|boy|model|mannequin|character)\s+(?:model\s+|mannequin\s+)?(?:is\s+|are\s+)?",
            r"^(?:female|male|woman|man|girl|boy)\s+(?:standing|sitting|kneeling|lying|leaning|crouching|walking|running)\s+pose\b\s*(?:with\s+)?",
        ]
        for pat in prefix_patterns:
            new_text = re.sub(pat, "", text, flags=re.IGNORECASE).strip()
            if new_text and len(new_text) >= 8:
                text = new_text

        # Replace gendered possessives/pronouns with neutral phrasing
        possessive_replacements = [
            (r"\b(?:her|his) (left|right) (\w+)\b", r"the \1 \2"),
            (r"\b(?:her|his) (hands|arms|legs|feet|knees|hips|hip|shoulders|shoulder|elbows|elbow|eyes|hair|face|head|back|chest|waist|pocket|pockets|chin|neck|cheek|cheeks|thigh|thighs|sunglasses|glasses|sword|dagger|axe|gun|weapon|phone|cup|mug|book|bag|hat|cap)\b", r"the \1"),
            (r"\b(with|in|on|against|at|by|to|around|over|under|from) (?:her|his)\b", r"\1 the"),
            (r"\bboth of (?:her|his) ", "both "),
            (r"\b(?:her|his) own\b", "their"),
            (r"\b(?:her|his)\b", "their"),
            (r"\b(?:she|he) is\b", ""),
            (r"\b(?:she|he)\b", "the subject"),
            (r"\b(?:herself|himself)\b", "themself"),
        ]
        for pat, rep in possessive_replacements:
            text = re.sub(pat, rep, text, flags=re.IGNORECASE)

        # Clean awkward phrasing left by prefix stripping
        text = re.sub(r"^with\s+", "", text, flags=re.IGNORECASE)
        text = re.sub(r"^and\s+", "", text, flags=re.IGNORECASE)
        text = re.sub(r"^sitting on the knees\b", "Kneeling upright", text, flags=re.IGNORECASE)
        text = re.sub(r"\bholding the arm\b", "arms crossed", text, flags=re.IGNORECASE)
    else:
        # Clean duo phrasing without losing relational clarity
        text = re.sub(r"\b(?:two\s+)?(?:females|males)\b", "two subjects", text, flags=re.IGNORECASE)
        text = re.sub(r"\bfemale and male couple\b", "couple", text, flags=re.IGNORECASE)
        text = re.sub(r"\bfemale and male\b", "two subjects", text, flags=re.IGNORECASE)
        text = re.sub(r"\bboth of them are\b", "both", text, flags=re.IGNORECASE)
        text = re.sub(r"\b(?:having a )?casual conversation\b", "in casual conversation", text, flags=re.IGNORECASE)
        text = re.sub(r"^couple is\b", "Two subjects", text, flags=re.IGNORECASE)
        text = re.sub(r"^two subjects are\b", "Two subjects", text, flags=re.IGNORECASE)

    # Clean duplicate words, duplicate whitespace & normalize
    text = re.sub(r"\b(\w+)\s+\1\b", r"\1", text, flags=re.IGNORECASE)
    text = re.sub(r"\bposing and\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\band posing\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\blike a\.?$", "like a runway model", text, flags=re.IGNORECASE)
    text = re.sub(r",\s*,", ",", text)
    text = clean_punctuation(text)

    # Fallback if stripping made it too short
    if len(text) < 14:
        text = clean_punctuation(raw)

    # Clean title trailing "pose" clutter only if very long, keep recognizable
    clean_title = re.sub(r"\s+", " ", title).strip()
    if len(clean_title) > 48:
        clean_title = clean_title[:48].rsplit(" ", 1)[0]

    item["subjectCount"] = subject_count
    item["title"] = clean_title or item["title"]
    item["naturalPrompt"] = text
    return item


def refine_opensegra(item: dict) -> dict:
    raw = fix_typos(item.get("naturalPrompt") or "")
    angle = item.get("angle", "front")

    # Strip the trailing boilerplate OpenSegra tags we appended earlier:
    # e.g. ", glamour reference, standing posture, front angle."
    parts = [p.strip() for p in raw.rstrip(".").split(",") if p.strip()]
    filtered_parts = []
    for p in parts:
        pl = p.lower()
        if pl.endswith("reference"):
            continue
        if pl.endswith("angle"):
            continue
        if pl in ("standing posture", "sitting posture", "kneeling and all fours posture", "lying posture", "action posture", "duo posture"):
            continue
        filtered_parts.append(p)

    core = ", ".join(filtered_parts) if filtered_parts else (item.get("title") or "").split("(")[0].strip()
    angle_phrase = ANGLE_PHRASES.get(angle, f"viewed from a {angle} angle")

    sentence = f"{core}, {angle_phrase}"
    item["naturalPrompt"] = clean_punctuation(sentence)
    return item


def refine_posemaniacs(item: dict) -> dict:
    tags = [t.lower() for t in item.get("tags", [])]
    framing = item.get("framing", "full-body")
    angle = item.get("angle", "front")

    # 1. Pick single best primary stance (never stack sitting + sitting-on-chair)
    stance = None
    for key, phrase in PM_PRIMARY_STANCE.items():
        if key in tags:
            stance = phrase
            break
    if not stance:
        stance = "Standing in a balanced posture"

    # 2. Pick up to 2 distinct limb/torso modifiers
    mods = []
    for key, phrase in PM_MODIFIERS.items():
        if key in tags:
            mods.append(phrase)
        if len(mods) >= 2:
            break

    # 3. Pick 1 context if relevant (skip generic daily-life)
    context = None
    for key, phrase in PM_CONTEXT.items():
        if key in tags:
            context = phrase
            break

    # 4. Pick 1 mood if no context or as subtle closer
    mood = None
    for key, phrase in PM_MOOD.items():
        if key in tags:
            mood = phrase
            break

    # Assemble fluid, non-repetitive sentence
    clauses = [stance]
    if mods:
        clauses.append(" and ".join(mods) if len(mods) == 2 else mods[0])
    if context:
        clauses.append(context)
    elif mood:
        clauses.append(mood)

    framing_phrase = FRAMING_PHRASES.get(framing, "full-body framing")
    angle_phrase = ANGLE_PHRASES.get(angle, f"viewed from a {angle} angle")
    clauses.append(f"{framing_phrase}, {angle_phrase}")

    sentence = clean_punctuation(", ".join(clauses))

    # Build clean deduplicated 2-4 word title
    ignore_title = {"full-body", "medium", "close-up", "paired-models", "solo-model", "daily-life"}
    title_tokens = []
    seen_words = set()
    for t in tags:
        if t in ignore_title:
            continue
        label = PM_TITLE_WORDS.get(t, t.replace("-", " ").title())
        words = label.lower().split()
        # Skip if any core word already in title (e.g. "Sitting" in "Chair Sit" vs "Sitting")
        if any(w[:3] in seen_words for w in words):
            continue
        for w in words:
            seen_words.add(w[:3])
        title_tokens.append(label)
        if len(title_tokens) >= 3:
            break

    item["title"] = " · ".join(title_tokens) if len(title_tokens) >= 2 else (title_tokens[0] if title_tokens else "Studio Pose")
    item["naturalPrompt"] = sentence
    return item


def main() -> None:
    items = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    counts = {"posemyart": 0, "opensegra": 0, "posemaniacs": 0}
    duo_fixed = 0

    refined = []
    for item in items:
        src = item.get("source")
        old_sc = item.get("subjectCount", 1)
        if src == "posemyart":
            out = refine_posemyart(item)
        elif src == "opensegra":
            out = refine_opensegra(item)
        elif src == "posemaniacs":
            out = refine_posemaniacs(item)
        else:
            out = item
        if out.get("subjectCount", 1) != old_sc:
            duo_fixed += 1
        counts[src] = counts.get(src, 0) + 1
        refined.append(out)

    MANIFEST_PATH.write_text(json.dumps(refined, indent=2), encoding="utf-8")
    print(f"Refined {len(refined)} pose cards: {counts} (fixed {duo_fixed} duo subjectCount entries)")


if __name__ == "__main__":
    main()
