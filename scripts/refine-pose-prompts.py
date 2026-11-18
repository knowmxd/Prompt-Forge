#!/usr/bin/env python3
"""
Overhaul and refine naturalPrompt, title, framing, and subjectCount across all 4,123 pose cards
in public/data/poses.json for high-precision Nano Banana / Gemini / Flux structured JSON prompting.
"""

from __future__ import annotations

import html
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
    "wiht": "with",
    "refrence": "reference",
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

DUO_PATTERNS = (
    re.compile(r"\b(?:two|three|four)\s+(?:females|males|girls|boys|women|men|people|characters|figures|models|subjects|anime)\b", re.I),
    re.compile(r"\bcouple\b|\bboth of them\b|\beach other\b|\bhugging each\b|\bback-to-back\b|\bside by side\b", re.I),
    re.compile(r"\bfriends\b|\bgroup\b|\bother\s+(?:female|male|man|woman|subject|person)\b|\banother\s+(?:female|male)\b", re.I),
    re.compile(r"\b(?:male|female)\s+are\b", re.I),
    re.compile(r"\bthief is standing behind\b|\bleading a handcuffed\b|\bhelping the female\b|\bprotecting the\b|\bdefending the\b|\bcomforting (?:their|her|him|them)\b", re.I),
    re.compile(r"\b(?:flirting|talking|dancing|walking|standing)\b.*\bwith\s+the\s+(?:female|male)\b", re.I),
    re.compile(r"\b(?:kissing|kisses|holding|push|greeting|pointing at)\s+the\s+(?:female|male)\b", re.I),
    re.compile(r"\b(?:female|male)'s\s+(?:hand|arm|phone|shoulder)\b", re.I),
    re.compile(r"\b(?:female|woman)\b.*\b(?:male|man)\b|\b(?:male|man)\b.*\b(?:female|woman)\b", re.I),
    re.compile(r"\bin front of the (?:female|male)\b|\bbehind the (?:female|male)\b", re.I),
)

# Posemaniacs tag -> natural clause (single best primary stance)
PM_PRIMARY_STANCE = {
    "sitting-on-chair": "Seated on a chair",
    "sitting": "Seated",
    "kneeling": "Kneeling",
    "squatting": "Squatting low",
    "lying": "Reclining",
    "on-back": "Lying on the back",
    "on-side": "Lying on one side",
    "hand-standing": "Balancing in an inverted handstand",
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
    text = html.unescape(text)

    def repl(match: re.Match[str]) -> str:
        word = match.group(0)
        fixed = TYPO_FIXES.get(word.lower())
        if not fixed:
            return word
        return fixed.capitalize() if word[0].isupper() else fixed

    return re.sub(r"\b[a-zA-Z]+\b", repl, text)


def clean_punctuation(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\band\s*,", ",", text, flags=re.IGNORECASE)
    text = re.sub(r",\s*and(?=\s*[.,!?]*$)", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s+and(?=\s*[.,!?]*$)", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r",\s*\.", ".", text)
    text = re.sub(r",{2,}", ",", text)
    text = re.sub(r"^[,.;:\-\s]+", "", text)
    text = re.sub(r"[,;\-\s]+$", "", text)
    if text and text[-1] not in ".!?":
        text += "."
    if text:
        text = text[0].upper() + text[1:]
    return text


def is_multi_subject(text: str, current_count: int) -> bool:
    if current_count >= 2:
        return True
    return any(p.search(text) for p in DUO_PATTERNS)


def repair_broken_pronouns(text: str, multi: bool) -> str:
    # Fix prior replacement glitches like "next to the and", "of their.", "themself", "in front of their."
    text = re.sub(r"\bthemself\b", "themselves", text, flags=re.IGNORECASE)
    text = re.sub(r"\bin front of him\b", "straight ahead", text, flags=re.IGNORECASE)
    text = re.sub(r"\bbehind him\b", "behind them", text, flags=re.IGNORECASE)
    text = re.sub(r"\bof their(?=\s*[.,!?]*$)", "of themselves", text, flags=re.IGNORECASE)
    text = re.sub(r"\bholding their(?=\s*[.,!?]*$)", "holding their partner", text, flags=re.IGNORECASE)
    text = re.sub(r"\bin front of their(?=\s*[.,!?]*$)", "in front of them", text, flags=re.IGNORECASE)
    text = re.sub(r"\bnext to the(?=\s+(?:and|or|,|$|\.))", "next to the partner" if multi else "next to them", text, flags=re.IGNORECASE)
    text = re.sub(r"\bcomforting their\b", "comforting them", text, flags=re.IGNORECASE)
    text = re.sub(r"\bwarm their up\b", "warm themselves up", text, flags=re.IGNORECASE)
    return text


def refine_posemyart(item: dict) -> dict:
    raw = fix_typos(item.get("naturalPrompt") or item.get("title") or "")
    title = fix_typos(item.get("title") or "")
    combined = f"{title} {raw}"

    multi = is_multi_subject(combined, item.get("subjectCount", 1))
    subject_count = 3 if re.search(r"\bthree\b", combined, re.I) else (2 if multi else 1)

    text = repair_broken_pronouns(raw, multi)

    # Strip leading "Cute anime reference - a woman " or "Is, " / "Are, "
    text = re.sub(r"^(?:cute\s+)?anime\s+reference\s*[-:]\s*(?:a\s+)?(?:woman|man|girl|boy|female|male)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"^(?:is|are)[,\s]+", "", text, flags=re.IGNORECASE)

    # Strip trailing SEO tag clauses added to PoseMy.Art captions
    seo_tail_patterns = [
        r",?\s*\b(?:for\s+drawing\s+(?:people|female|male)|reference\s+for\s+drawing\s+(?:people|female|male)|poses\s+for\s+drawing\s+(?:female|male)|human\s+anatomy|walk\s+cycle\s+reference|hand\s+photo|friends\s+group|anime\s+(?:dancing|hugging))\b\.?$",
        r",?\s*\b(?:male|female|anime|casual|fashion|simple|basic|drawing)?\s*(?:model|drawing|pose|hand|character)\s*(?:pose|reference)s?(?:\s+for\s+beginners)?\b\.?$",
        r",?\s*\b(?:old\s+)?(?:male|female|woman|man)\s+(?:anime\s+body\s+base|plus\s+size\s+body\s+reference|body\s+sketch\s+reference|body\s+proportions|bow\s+aiming\s+pose|archery\s+pose|dynamic\s+action|graceful\s+bowing|holding\s+(?:weapons?|knife|lighter|dagger|hammer|axe)|relaxed\s+standing|leaning\s+back|thumbs\s+up\s+reference|looking\s+up|holding\s+(?:hips|chin)|arms\s+up|crouching\s+feet|sitting\s+close\s+up|knit(?:ting)?|knee\s+sitting|sideway(?:s)?|praying|standing(?:\s+on\s+hands)?|sitting|cool|realistic|victory|athlete|crazy(?:\s+walking)?|power|handcuff|sneaky|tired|throwing|muscle|back|head|feet|dress|smoke|smoking|flirting|playful|pointing|model(?:\s+elegant\s+sitting)?|high\s+angle|body|feet|legs|hand|hands|pose|nude)\.?$",
        r",?\s*\blying\s+(?:woman|man|female|male)\.?$",
        r",?\s*\bold\s+(?:man|woman|male|female)\.?$",
        r",?\s*\b(?:casual|anime|simple)\s+(?:hand|hands|pose)\.?$",
        r",?\s*\bfor a (?:fashion )?(?:illustration|drawing|reference)\b\.?$",
        r",?\s*\bposing(?: confidently| casually| elegantly)?\b(?=\s*(?:$|,|\.))",
        r"(?<!like a )(?<!as a )\bpose\s*\.?$",
    ]
    for _ in range(2):
        for pat in seo_tail_patterns:
            candidate = re.sub(pat, "", text, flags=re.IGNORECASE).strip()
            if candidate and len(candidate) >= 12:
                text = candidate

    if not multi:
        # Handle ultra-short terse phrases cleanly before prefix guard
        text = re.sub(
            r"^confident\s+(?:male|female)\s+with\s+a\s+gun(?:\s+pose)?\b",
            "Standing confidently holding a handgun",
            text,
            flags=re.IGNORECASE,
        )
        text = re.sub(
            r"^(?:male|female)\s+model\s+is\s+lying(?:\s+and\s+posing)?\b",
            "Lying relaxed in a reclined posture",
            text,
            flags=re.IGNORECASE,
        )

        # Remove leading gender/model prefixes so poses never conflict with Cast cards
        prefix_patterns = [
            r"^(?:back\s+view\s+of\s+)?(?:a\s+|an\s+)?(?:excited\s+|cute\s+|happy\s+and\s+drunk\s+|angry\s+|muscular\s+|brute\s+|confident\s+|suggestive\s+|relaxed\s+|casual\s+|anime\s+)*(?:female|male|woman|man|girl|boy|model|mannequin|character)\s+(?:model\s+|mannequin\s+|archer\s+)?(?:is\s+|are\s+)?",
            r"^(?:bodybuilder|waltz\s+dance)\s+(?:pose,?\s*)?(?:female|male|woman|man)?\s*(?:is\s+|are\s+)?",
            r"^(?:female|male|woman|man|girl|boy)\s+(?:standing|sitting|kneeling|lying|leaning|crouching|walking|running)\s+pose\b\s*(?:with\s+)?",
        ]
        for pat in prefix_patterns:
            new_text = re.sub(pat, "", text, flags=re.IGNORECASE).strip()
            if new_text and len(new_text) >= 10:
                text = new_text

        # Replace any remaining solo gender words with neutral terms
        text = re.sub(r"\b(?:male|female|woman|man|girl|boy)\s+(?:is|are)\b", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\b(?:anime\s+)?(?:male|female|woman|man)\s+(standing|sitting|kneeling|lying|leaning|walking|crouching|archer)\b", r"\1", text, flags=re.IGNORECASE)
        text = re.sub(r"\bconfident\s+(?:male|female)\s+with\b", "Standing confidently with", text, flags=re.IGNORECASE)
        text = re.sub(r"\b(?:male|female)\s+with\b", "Standing with", text, flags=re.IGNORECASE)
        text = re.sub(r"\b(?:male|female)\s+in\b", "Standing in", text, flags=re.IGNORECASE)
        text = re.sub(r"\b(?:male|female)\s+handcuff\b", "with wrists bound", text, flags=re.IGNORECASE)
        text = re.sub(r"\b(?:muscular|brute)\s+(?:female|male)\b", "muscular figure", text, flags=re.IGNORECASE)
        text = re.sub(r"\b(?:a\s+)?(?:male|female|woman|man)\b", "the subject", text, flags=re.IGNORECASE)

        # Clean awkward leading conjunctions or dangling "is"
        text = re.sub(r"^(?:is|are)[,\s]+", "", text, flags=re.IGNORECASE)
        text = re.sub(r"^with\s+", "", text, flags=re.IGNORECASE)
        text = re.sub(r"^and\s+", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\bsitting on the knees\b", "Kneeling upright", text, flags=re.IGNORECASE)
        text = re.sub(r"\bholding the arm\b", "arms crossed", text, flags=re.IGNORECASE)
    else:
        # Clean duo/group phrasing while preserving clear 2-subject spatial interaction
        text = re.sub(r"\btwo\s+anime\s+two\s+subjects\b", "two subjects", text, flags=re.IGNORECASE)
        text = re.sub(r"\btwo\s+(?:anime\s+)?(?:females|males|women|men)\b", "two subjects", text, flags=re.IGNORECASE)
        text = re.sub(r"\bthree\s+(?:anime\s+)?(?:females|males|women|men)\b", "three subjects", text, flags=re.IGNORECASE)
        text = re.sub(r"\bfemale\s+friends\b|\bmale\s+friends\b", "Two friends", text, flags=re.IGNORECASE)
        text = re.sub(r"\btwo\s+subjects\s+friends\b", "Two friends", text, flags=re.IGNORECASE)
        text = re.sub(r"\bfemale and male couple\b", "couple", text, flags=re.IGNORECASE)
        text = re.sub(r"\bfemale and male\b", "two subjects", text, flags=re.IGNORECASE)
        text = re.sub(r"\b(?:other|another)\s+(?:female|male)\b", "second subject", text, flags=re.IGNORECASE)
        text = re.sub(r"\b(?:the\s+)?(?:female|male)\s+(?:dancer\s+)?is\b", "one subject is", text, flags=re.IGNORECASE)
        text = re.sub(r"\b(?:female|male)'s\b", "partner's", text, flags=re.IGNORECASE)
        text = re.sub(r"\b(?:the\s+)?(?:female|male)\b", "the partner", text, flags=re.IGNORECASE)
        text = re.sub(r"\bboth of them are\b", "both", text, flags=re.IGNORECASE)
        text = re.sub(r"\b(?:having a )?casual conversation\b", "in casual conversation", text, flags=re.IGNORECASE)
        text = re.sub(r"^couple is\b", "Two subjects", text, flags=re.IGNORECASE)
        text = re.sub(r"^two subjects are\b", "Two subjects", text, flags=re.IGNORECASE)
        text = re.sub(r"^(?:male|female)\s+are\b", "Two subjects are", text, flags=re.IGNORECASE)

    # Clean duplicate words & artifacts
    text = re.sub(r"\b(\w+)\s+\1\b", r"\1", text, flags=re.IGNORECASE)
    text = re.sub(r"\bthe\s+the\b", "the", text, flags=re.IGNORECASE)
    text = re.sub(r"\bposing and\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\band posing\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\blike a\.?$", "like a runway model", text, flags=re.IGNORECASE)
    text = re.sub(r",\s*,", ",", text)
    text = clean_punctuation(text)

    if len(text) < 12:
        text = clean_punctuation(repair_broken_pronouns(raw, multi))

    # Add framing + camera angle context to concise PoseMy.Art descriptions for Gemini/Flux consistency
    framing = item.get("framing", "full-body")
    angle = item.get("angle", "front")
    framing_phrase = FRAMING_PHRASES.get(framing, "full-body framing")
    angle_phrase = ANGLE_PHRASES.get(angle, f"viewed from a {angle} angle")
    if framing_phrase not in text.lower() and angle_phrase not in text.lower():
        if len(text) < 55:
            text = clean_punctuation(f"{text.rstrip('.')}, {framing_phrase}, {angle_phrase}")

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

    parts = [p.strip() for p in raw.rstrip(".").split(",") if p.strip()]
    filtered_parts = []
    for p in parts:
        pl = p.lower()
        if pl.endswith("reference") or pl.endswith("angle") or pl.endswith("posture"):
            continue
        filtered_parts.append(p)

    core = ", ".join(filtered_parts) if filtered_parts else (item.get("title") or "").split("(")[0].strip()
    angle_phrase = ANGLE_PHRASES.get(angle, f"viewed from a {angle} angle")

    sentence = f"{core}, {angle_phrase}"
    item["naturalPrompt"] = clean_punctuation(sentence)
    return item


def refine_posemaniacs(item: dict) -> dict:
    raw_tags = list(item.get("tags", []))
    tags_lower = [t.lower() for t in raw_tags]

    # Fix mistagged handstand crops: inverted handstands show full-body height
    if "hand-standing" in tags_lower:
        item["framing"] = "full-body"
        item["tags"] = [
            "full-body" if t.lower() in ("medium", "close-up") else t
            for t in raw_tags
        ]
        tags_lower = [t.lower() for t in item["tags"]]

    framing = item.get("framing", "full-body")
    angle = item.get("angle", "front")

    stance = None
    for key, phrase in PM_PRIMARY_STANCE.items():
        if key in tags_lower:
            stance = phrase
            break
    if not stance:
        stance = "Standing in a balanced posture"

    mods = []
    for key, phrase in PM_MODIFIERS.items():
        if key in tags_lower:
            mods.append(phrase)
        if len(mods) >= 2:
            break

    context = None
    for key, phrase in PM_CONTEXT.items():
        if key in tags_lower:
            context = phrase
            break

    mood = None
    for key, phrase in PM_MOOD.items():
        if key in tags_lower:
            mood = phrase
            break

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

    ignore_title = {"full-body", "medium", "close-up", "paired-models", "solo-model", "daily-life"}
    title_tokens = []
    seen_words = set()
    for t in tags_lower:
        if t in ignore_title:
            continue
        label = PM_TITLE_WORDS.get(t, t.replace("-", " ").title())
        words = label.lower().split()
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
    print(f"Refined {len(refined)} pose cards: {counts} (updated {duo_fixed} subjectCount entries)")


if __name__ == "__main__":
    main()
