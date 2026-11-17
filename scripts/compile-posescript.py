import json, zipfile, re, os

zip_path = "/tmp/posescript_release_v2.zip"
if not os.path.exists(zip_path):
    print("Zip not found, exiting.")
    exit(1)

with zipfile.ZipFile(zip_path) as z:
    human_data = json.loads(z.read("posescript_release/posescript_human_6293.json").decode("utf-8"))

print(f"Loaded {len(human_data)} PoseScript human annotations.")

def classify_entry(text):
    t = text.lower()
    
    # Stance classification
    if any(k in t for k in ["lying", "reclining", "on back", "on stomach", "prone", "supine", "bridge backwards"]):
        stance = "reclining"
    elif any(k in t for k in ["kneeling", "on knees", "on one knee"]):
        stance = "kneeling"
    elif any(k in t for k in ["squatting", "crouch", "squat", "all fours"]):
        stance = "crouching"
    elif any(k in t for k in ["sitting", "seated", "on a chair", "on a stool", "on a bench"]):
        stance = "sitting"
    elif any(k in t for k in ["running", "jumping", "leaping", "dancing", "kick", "punch", "stride", "walking", "stepping"]):
        stance = "dynamic"
    else:
        stance = "standing"

    # Category classification (10 tighter categories)
    if any(k in t for k in ["two people", "partner", "couple", "back-to-back", "duo"]):
        cat = "couples"
    elif any(k in t for k in ["lying", "reclining", "on back", "on stomach", "prone", "supine", "bridge backwards"]):
        cat = "reclining"
    elif any(k in t for k in ["sitting", "seated", "chair", "stool", "bench", "sofa", "couch", "furniture"]):
        cat = "sitting"
    elif any(k in t for k in ["squatting", "crouch", "kneel", "all fours"]):
        cat = "crouching"
    elif any(k in t for k in ["combat", "punch", "kick", "martial", "fight", "sword", "boxer", "guard", "defensive"]):
        cat = "action"
    elif any(k in t for k in ["walking", "running", "stride", "sprint", "jog", "leaping"]):
        cat = "motion"
    elif any(k in t for k in ["dancing", "dance", "ballet", "arabesque", "celebrat", "cheering", "backbend", "stretching", "stretch", "arms raised"]):
        cat = "expressive"
    elif any(k in t for k in ["fashion", "model", "hip", "hair", "pockets", "s-curve", "silhouette"]):
        cat = "editorial"
    elif any(k in t for k in ["over the shoulder", "looking away", "turned back", "window", "gazing", "leaned back"]):
        cat = "cinematic"
    else:
        cat = "standing"

    return cat, stance

def generate_title(desc, cat, stance):
    t = desc.lower()
    if "bridge backwards" in t or "bridge" in t:
        return "Backwards Bridge Arch"
    if "squatting" in t or "squat" in t:
        return "Deep Squat Ground Balance" if ("ground" in t or "hands" in t) else "Low Squat Center"
    if "dancing pose" in t or "dance" in t:
        return "Extended Dance Arabesque" if ("leg" in t and "raised" in t) else "Expressive Dance Extension"
    if "stretching" in t:
        return "Deep Forward Fold Stretch" if "forward" in t else "Lateral Side Stretch" if "side" in t else "Standing Body Stretch"
    if "diving" in t:
        return "Poised Diving Stance"
    if "swimming" in t:
        return "Horizontal Prone Streamline"
    if "on knees" in t or "on their knees" in t or "kneeling" in t:
        return "Kneeling Backward Arc" if "backward" in t else "Upright Kneeling Stance"
    if "three limbs on the ground" in t or "hands and knees" in t or "all fours" in t:
        return "Ground Balance Support"
    if "stands on the left leg" in t or "standing on his left leg" in t or "standing on the right" in t or "stands on one leg" in t:
        return "Single Leg Balance Hold" if "holds" in t else "Single Leg Dynamic Stance"
    if "arms crossed" in t:
        return "Crossed Arms Upright"
    if "hands in" in t and "pocket" in t:
        return "Casual Pockets Stand"
    if "hand on" in t and "hip" in t:
        return "Contrapposto Hip Cock"
    if "bent double forward" in t:
        return "Full Forward Fold"

    clean = re.sub(r"^(The person is|Someone is|The position is|The person has|The person stands|A person is|The pose has|The subject is)\s*", "", desc, flags=re.I).strip()
    first_clause = re.split(r"[.,;]", clean)[0].strip()
    words = [w for w in first_clause.split() if w.lower() not in {"a", "an", "the", "their", "his", "her", "of", "with", "and"}]
    if len(words) >= 2:
        res = " ".join(words[:4]).title()
        if len(res) > 3:
            return res
    return f"{cat.title()} {stance.title()} Study"

def extract_tags(desc, cat, stance):
    t = desc.lower()
    tags = set([cat, stance])
    for w in ["hands", "arms", "legs", "feet", "torso", "balance", "leaning", "knees", "head", "stretch", "dance", "ground", "raised", "bent", "straight", "apart", "forward", "backward", "shoulders", "hip", "chest"]:
        if w in t:
            tags.add(w)
    return sorted(list(tags))

output_path = "src/lib/prompt/posescript-corpus.ts"
with open(output_path, "w", encoding="utf-8") as out:
    out.write('import type { PoseItem } from "./pose-database";\n\n')
    out.write('// PoseScript-H: 6,293 human-annotated 3D poses from AMASS paired with rich natural-language descriptions\n')
    out.write('// Delmas et al., NAVER Labs Europe (ECCV / TPAMI)\n')
    out.write('export const POSESCRIPT_CORPUS: PoseItem[] = [\n')
    
    for i, (k, v) in enumerate(human_data.items()):
        raw_desc = v[0].strip()
        # Escape any special characters for TS string literal
        desc = raw_desc.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
        cat, stance = classify_entry(raw_desc)
        title = generate_title(raw_desc, cat, stance).replace('"', '\\"')
        tags = extract_tags(raw_desc, cat, stance)
        tags_json = json.dumps(tags)
        
        idx = int(k) + 1
        item_id = f"ps-{idx:04d}"
        
        out.write('  {\n')
        out.write(f'    id: "{item_id}",\n')
        out.write(f'    name: "{title}",\n')
        out.write(f'    subtitle: "PoseScript Human · {stance.title()}",\n')
        out.write(f'    category: "{cat}",\n')
        out.write(f'    stance: "{stance}",\n')
        out.write(f'    posture: "{desc}",\n')
        out.write(f'    tags: {tags_json},\n')
        out.write('  },\n')
        
    out.write('];\n')

print(f"Successfully generated {output_path}")
