import { type PromptDoc, setAt } from "./model.ts";

export type CastCategory =
  | "all"
  | "cyber_street"
  | "dark_fantasy"
  | "high_fashion"
  | "cinematic_historical";

export type CastModelItem = {
  id: string;
  name: string;
  badge: string;
  category: Exclude<CastCategory, "all">;
  image: string;
  description: string;
  casting: {
    demographics_and_features: string;
    skin_and_surface_microdetails: string;
    hair_and_grooming: string;
  };
  wardrobe: {
    layering_system: {
      base_layer?: string;
      mid_layer?: string;
      outerwear?: string;
    };
    textiles_and_weight?: string;
    hardware_and_details?: string;
    wear_and_patina?: string;
    footwear?: string;
    accessories: string[];
  };
  kinetic_posture: string;
  tags: string[];
};

export const CAST_CATEGORIES: Array<{ id: CastCategory; label: string }> = [
  { id: "all", label: "All Models" },
  { id: "cyber_street", label: "Cyber & Tactical" },
  { id: "dark_fantasy", label: "Dark Fantasy & Occult" },
  { id: "high_fashion", label: "Avant-Garde & Fashion" },
  { id: "cinematic_historical", label: "Cinematic & Narrative" },
];

export const CAST_MODELS: CastModelItem[] = [
  {
    id: "cast-anatomical-dancer",
    name: "The Anatomical Virtuoso",
    badge: "ANATOMY",
    category: "high_fashion",
    image: "/cast/IMG_4163.JPG",
    description: "Athletic male turnaround model with sculpted dark beard, high-volume pompadour, and multi-exposure arm studies.",
    casting: {
      demographics_and_features: "Caucasian male in early 30s, sharp angular jawline, defined cheekbones, straight Roman nose bridge, athletic classical muscular physique, deep-set hazel eyes",
      skin_and_surface_microdetails: "Natural skin texture, visible pores, light forearm vascularity, soft matte studio highlights, clean skin tone without blemishes",
      hair_and_grooming: "Dark brown high-volume textured pompadour with tapered sides, immaculately groomed full dense beard with sharp cheekline contours and crisp neckline",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Minimalist black athletic briefs, bare chest and torso showing muscular definition",
      },
      textiles_and_weight: "Matte stretch performance cotton-spandex, high-elasticity knit",
      hardware_and_details: "Clean seamless waistband, zero hardware",
      wear_and_patina: "Pristine studio presentation",
      footwear: "Barefoot with arched dancer feet",
      accessories: [],
    },
    kinetic_posture: "Turnaround posture study, one leg crossed over the other, arms captured in fluid balletic dancer extensions, head turned in 90-degree profile",
    tags: ["anatomical", "beard", "pompadour", "dancer", "physique", "turnaround", "classical", "male"],
  },
  {
    id: "cast-veiled-pontiff",
    name: "The Veiled Pontiff",
    badge: "OCCULT",
    category: "dark_fantasy",
    image: "/cast/IMG_4164.JPG",
    description: "Hierarchical ecclesiastical figure draped in gold floral damask robes with an embroidered crimson mitre and complete silk face veil.",
    casting: {
      demographics_and_features: "Figure veiled beneath heavy liturgical textiles, tall imposing priestly stature, slender pale hands with gold signet ring",
      skin_and_surface_microdetails: "Concealed face beneath sheer golden damask cloth clinging softly to nose and mouth contours, pale veined skin on exposed hands",
      hair_and_grooming: "Fully concealed beneath episcopal headwear and facial mourning veil",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Floor-length ecclesiastical cassock in antique gold silk damask with subtle floral jacquard weave",
        mid_layer: "Rose-coral silk satin wide-cuff undertunic sleeves peeking through sleeve cuffs",
        outerwear: "Triangular draped shoulder mantle (amice) and floor-skimming papal chasuble",
      },
      textiles_and_weight: "Heavyweight floral silk brocade damask, stiff metallic gold wire embroidery, smooth rose silk lining",
      hardware_and_details: "Gold bullion filigree knotwork embroidery along mitre edges and borders, large cabochon gold bishop's ring on right ring finger",
      wear_and_patina: "Antique liturgical patina, soft ceremonial folds",
      footwear: "Black leather ceremonial slippers",
      accessories: ["Embroidered crimson and gold mitre headdress", "Opaque gold damask face veil", "White folded linen ceremonial handkerchief"],
    },
    kinetic_posture: "Standing erect in solemn ceremonial benediction, left hand clutching folded white linen against abdomen, right hand raised in open rhetorical gesture",
    tags: ["pontiff", "pope", "mitre", "gold damask", "veil", "clerical", "ecclesiastical", "occult", "religious"],
  },
  {
    id: "cast-street-martyr",
    name: "Street Martyr (Saint Sebastian)",
    badge: "MARTYR",
    category: "cyber_street",
    image: "/cast/IMG_4165.JPG",
    description: "Athletic Black vocalist in tactical streetwear with target arrows piercing through his back while singing into a handheld mic.",
    casting: {
      demographics_and_features: "Black male in early 20s, sculpted high cheekbones, strong square jaw, intense dark brown eyes, athletic lean physique",
      skin_and_surface_microdetails: "Smooth dark skin with natural specular sweat sheen, clean close skin texture, slender expressive hands",
      hair_and_grooming: "Neatly parted individual box braids falling across temples and nape with tapered hairline",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Fitted matte black compression long-sleeve crewneck",
        mid_layer: "Wide-leg black tactical cargo trousers with hanging nylon straps and oversized gusseted flap pockets",
      },
      textiles_and_weight: "High-density technical nylon ripstop cargo pants, four-way stretch technical elastane top",
      hardware_and_details: "Black coated metal D-rings, hanging webbing straps, bead bracelet on right wrist, black matte ring on index finger",
      wear_and_patina: "Clean dystopian stage performance condition",
      footwear: "Chunky lug-sole black tactical combat boots with exaggerated tread",
      accessories: ["Handheld dynamic stage microphone", "Five wooden target arrows with goose-feather fletching and steel bodkin points piercing the back"],
    },
    kinetic_posture: "Dynamic hunched performance posture, crouched low with knees bent, left hand gripping microphone to mouth in mid-verse delivery",
    tags: ["saint sebastian", "martyr", "braids", "arrows", "microphone", "singer", "streetwear", "tactical cargos"],
  },
  {
    id: "cast-void-stahl-knight",
    name: "Void Stahl Knight",
    badge: "KNIGHT",
    category: "dark_fantasy",
    image: "/cast/IMG_4166.JPG",
    description: "Faceless knight draped in an interlocking chainmail coif over a featureless black mask, holding a polished double-edged greatsword.",
    casting: {
      demographics_and_features: "Imposing athletic broad-shouldered physique, completely featureless black lycra mask underneath chainmail hood",
      skin_and_surface_microdetails: "Concealed beneath matte black balaclava, stark smooth void silhouette",
      hair_and_grooming: "Fully enclosed in metal chainmail coif",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Matte black fitted crewneck thermal long-sleeve",
        mid_layer: "High-waisted wide-leg black tactical trousers with deep utility bellows pockets",
      },
      textiles_and_weight: "Four-in-one interlocking riveted steel chainmail links, heavy cotton drill cargo pants",
      hardware_and_details: "Polished carbon steel double-edged broadsword with cruciform crossguard and faceted octagonal pommel, black leather gauntlet gloves",
      wear_and_patina: "Clean museum-grade steel polish with subtle oil sheen, pristine matte black garments",
      footwear: "Black leather round-toe combat boots",
      accessories: ["Riveted steel chainmail coif mantle", "Two-handed steel longsword held blade down", "Reinforced black leather gloves"],
    },
    kinetic_posture: "Standing erect at attention, both hands resting firmly on the wire-wrapped hilt of the upright longsword, tip resting near the floor",
    tags: ["knight", "chainmail", "coif", "sword", "broadsword", "void", "faceless", "tactical knight"],
  },
  {
    id: "cast-hermes-vanguard",
    name: "Hermes Vanguard",
    badge: "COURIER",
    category: "cyber_street",
    image: "/cast/IMG_4167.JPG",
    description: "Avant-garde tactical courier wearing a winged matte black combat helmet with playing cards tucked in the band, carrying a cylindrical canister.",
    casting: {
      demographics_and_features: "Lean young male in early 20s, sharp jawline, high cheekbones, slender neck, dark focused eyes, pale neutral skin tone",
      skin_and_surface_microdetails: "Natural skin texture, fine pores, smooth complexion with sculpted neck tendons visible under tension",
      hair_and_grooming: "Short cropped hair concealed beneath helmet strap and chinstrap buckled tight",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Ultra-clean matte black long-sleeve compression shirt",
        mid_layer: "Drop-crotch wide-leg black pleated dress trousers with oversized volume",
      },
      textiles_and_weight: "Matte performance jersey top, heavy wool-blend twill trousers with fluid drape",
      hardware_and_details: "Nylon chin-strap clip, black leather riding gloves, webbing shoulder harness holding back canister",
      wear_and_patina: "Immaculate minimalist dystopia",
      footwear: "Heavy black lug-sole leather platform boots",
      accessories: [
        "Matte black combat helmet with sculpted aerodynamic Hermes wings attached to both sides",
        "Two vintage playing cards (King of Clubs, 10 of Clubs) tucked into the helmet retention band",
        "Cylindrical black aluminum messenger canister quiver with carry handle strapped diagonally across back",
      ],
    },
    kinetic_posture: "Standing with right hand adjusting harness strap on chest, head tilted down and to the side, stoic courier readiness",
    tags: ["hermes", "wings", "winged helmet", "playing cards", "canister", "courier", "messenger", "cyberpunk"],
  },
  {
    id: "cast-flame-runner",
    name: "Flame-Carved Runner",
    badge: "STREETWEAR",
    category: "cyber_street",
    image: "/cast/IMG_4168.JPG",
    description: "Athletic Black model with a bleached platinum blonde buzzcut featuring shaved dark flame silhouettes on the temple fade.",
    casting: {
      demographics_and_features: "Black male in early 20s, strikingly chiseled jawline, prominent high cheekbones, sharp brow ridge, athletic muscular runner build",
      skin_and_surface_microdetails: "Smooth rich dark bronze skin with subtle specular rim highlights, clean skin texture without blemishes",
      hair_and_grooming: "Bleached platinum blonde buzzcut with intricate dark contrast flame patterns shaved into the left temple and side fade",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Fitted crewneck black long-sleeve t-shirt",
        mid_layer: "Relaxed baggy black utility cargo pants with dual deep side thigh pockets",
      },
      textiles_and_weight: "Heavyweight ring-spun combed cotton top, washed cotton twill cargo trousers",
      hardware_and_details: "Minimalist black belt, tonal stitching, button flap closures",
      wear_and_patina: "Crisp modern streetwear finish",
      footwear: "Black leather workwear boots with thick rubber soles",
      accessories: [],
    },
    kinetic_posture: "Standing three-quarters turn, hands clasped lightly before the chest in focused anticipation, intense profile gaze",
    tags: ["flame hair", "buzzcut", "bleached hair", "platinum blonde", "black model", "cargo pants", "streetwear"],
  },
  {
    id: "cast-saurian-crest",
    name: "Saurian Crest Hybrid",
    badge: "CHIMERA",
    category: "dark_fantasy",
    image: "/cast/IMG_4169.JPG",
    description: "Bioluminescent reptilian alien hybrid with textured midnight scale skin and a sweeping dorsal cranial crest.",
    casting: {
      demographics_and_features: "Tall extraterrestrial humanoid male, lean hyper-defined musculature, sweeping aerodynamic cranial horn/crest extending upward and back from forehead, sunken alien black eyes, nostril slits, chiseled predatory facial structure",
      skin_and_surface_microdetails: "All-over epidermal reptile scales in midnight charcoal-navy, granular scute micro-textures across shoulders and clavicle, specular light catching individual hexagonal scale facets",
      hair_and_grooming: "Hairless smooth textured scale crest replacing hair and scalp",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Bare scaly textured torso and limbs, raw natural bio-armored form",
      },
      textiles_and_weight: "Natural biological reptilian dermal plating",
      hardware_and_details: "Zero garments, pure creature turnaround aesthetic",
      wear_and_patina: "Lustrous organic sheen",
      footwear: "Bare reptilian clawed feet",
      accessories: [],
    },
    kinetic_posture: "Standing erect in anatomical specimen pose, relaxed fingers at sides, stoic predator stillness with chin slightly raised",
    tags: ["alien", "reptile", "crest", "scales", "extraterrestrial", "chimera", "dark fantasy", "creature"],
  },
  {
    id: "cast-crescent-balaclava",
    name: "Crescent Thorn Balaclava",
    badge: "OCCULT",
    category: "cyber_street",
    image: "/cast/IMG_4170.JPG",
    description: "Faceless silhouette in a textured boucle mask with glowing white crescent eyes, crowned by a rusted barbed wire wreath.",
    casting: {
      demographics_and_features: "Slender lean male silhouette, completely enclosed face beneath heavy knit mask, two glowing white curved crescent-moon eye slits",
      skin_and_surface_microdetails: "Concealed beneath coarse black boucle terry knit texture, stark contrast against illuminated white eye slits",
      hair_and_grooming: "Fully concealed head beneath form-fitting balaclava mask",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Textured black boucle workwear jacket with classic pointed collar and front zip",
        mid_layer: "Tapered black canvas utility jeans with reinforced knee panel stitching",
      },
      textiles_and_weight: "Coarse textured loop-back boucle wool jacket, heavyweight 14oz black washed canvas jeans",
      hardware_and_details: "Rusted steel barbed wire woven into a double-ringed crown of thorns, matte black tactical gloves",
      wear_and_patina: "Weathered raw industrial edges, aged rusted iron wire",
      footwear: "Black brushed suede side-zip combat boots",
      accessories: ["Rusted barbed wire crown of thorns", "Integrated luminescent crescent eye lenses"],
    },
    kinetic_posture: "Standing dead center facing forward, hands hanging relaxed at sides, ominous static surveillance presence",
    tags: ["balaclava", "crescent eyes", "barbed wire", "crown of thorns", "boucle jacket", "faceless", "occult street"],
  },
  {
    id: "cast-snatch-streetwear",
    name: "Snatch 3-Hole Balaclava",
    badge: "STREETWEAR",
    category: "cyber_street",
    image: "/cast/IMG_4171.JPG",
    description: "Streetwear icon wearing a classic 3-hole knitted ski mask and an oversized cream vintage movie graphic tee.",
    casting: {
      demographics_and_features: "Black male in early 20s, expressive warm brown eyes visible through mask eye holes, full lips visible through mouth opening, athletic build",
      skin_and_surface_microdetails: "Rich dark skin tone visible around eye and mouth contours, subtle lip moisture, clear eye sclera",
      hair_and_grooming: "Hair fully enclosed inside heavy gauge knitted ski mask",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Oversized drop-shoulder cream/off-white vintage graphic t-shirt",
        mid_layer: "Loose relaxed black jeans/chinos",
      },
      textiles_and_weight: "Heavyweight 240gsm vintage-washed organic cotton jersey tee, chunky ribbed acrylic-wool knit ski mask",
      hardware_and_details: "Distressed black screenprint with bold serif typography 'snatch' and halftone photo print of three masked figures across chest",
      wear_and_patina: "Soft vintage garment dye, cracked screenprint texture",
      footwear: "Black classic skate sneakers",
      accessories: ["Classic black ribbed knit 3-hole ski mask with reinforced eye and mouth stitching"],
    },
    kinetic_posture: "Casual street stance, arms hanging relaxed, head turned slightly off-center with intense direct eye contact",
    tags: ["balaclava", "ski mask", "graphic tee", "vintage tee", "streetwear", "snatch", "cream shirt"],
  },
  {
    id: "cast-saint-sebastian-motion",
    name: "Saint Sebastian in Motion",
    badge: "DYNAMIC",
    category: "cyber_street",
    image: "/cast/IMG_4172.JPG",
    description: "Vocalist in dynamic singing pose, microphone clutched to lips, five target arrows lodged in his back amidst an intense performance.",
    casting: {
      demographics_and_features: "Black male in early 20s, sharp angular profile, deep-set determined eyes, tight braided dreadlocks, athletic performer physique",
      skin_and_surface_microdetails: "Natural skin texture with specular rim light catching cheekbone and brow, visible neck tension and vocal cords",
      hair_and_grooming: "Two-strand twist braids falling over temples and behind ears, sharp edge-up hairline",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Form-fitting black long-sleeve performance crewneck",
        mid_layer: "Wide-leg black cargo trousers with oversized accordion pockets",
      },
      textiles_and_weight: "Matte performance elastane-nylon blend, sturdy cotton-nylon ripstop",
      hardware_and_details: "Tonal matte black buttons, webbing straps, cord lock toggles",
      wear_and_patina: "High-energy stage wear with dramatic tension",
      footwear: "Chunky black lugged leather boots",
      accessories: ["Black metal vocal microphone", "Five wooden target arrows with feather fletching piercing upper back and shoulder blade"],
    },
    kinetic_posture: "Wide athletic crouch, left foot lunging forward with knees bent, upper body angled forward with microphone gripped tightly against mouth",
    tags: ["saint sebastian", "performer", "singer", "dynamic", "microphone", "arrows", "braids", "cargos"],
  },
  {
    id: "cast-moth-seraph",
    name: "Moth Seraph Chimera",
    badge: "CHIMERA",
    category: "dark_fantasy",
    image: "/cast/IMG_4173.JPG",
    description: "Ethereal female moth chimera with feathery antennae, oversized black compound eyes, textured moth wings, and a fur collar.",
    casting: {
      demographics_and_features: "Young female chimera in early 20s, delicate oval face, tiny button nose, full glossy lips, giant obsidian glossy insectoid eyes with zero white sclera, delicate feathery moth antennae protruding from hairline",
      skin_and_surface_microdetails: "Fine brown and sepia mottled freckled moth-wing pigmentation across cheeks, bridge of nose, neck, and forearms",
      hair_and_grooming: "Tousled jet-black feathered wolf cut with curtain bangs framing the antennae",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Fitted ribbed black cotton tank top",
        mid_layer: "Fluffy taupe-brown shearling/rabbit-fur choker neck collar",
        outerwear: "Ultra-wide leg black tactical cargo trousers pooling over shoes",
      },
      textiles_and_weight: "Natural shearling fur, fine-rib cotton jersey, heavy technical nylon canvas pants, real velvety moth-wing scales",
      hardware_and_details: "Massive realistic Cecropia moth wings spanning across shoulder blades with intricate vein maps and eye-spot patterns",
      wear_and_patina: "Soft biological downy fur against rugged modern textiles",
      footwear: "Exaggerated black platform chunky wedge boots",
      accessories: ["Pair of feathery moth antennae", "Giant feathered moth wings mounted behind shoulders", "Plush fur collar"],
    },
    kinetic_posture: "Standing poised and still, wings flared wide behind her back, head turned in 45-degree angle with inquisitive alien gaze",
    tags: ["moth", "chimera", "antennae", "wings", "fur collar", "black eyes", "cargo pants", "dark fantasy"],
  },
  {
    id: "cast-antique-doll",
    name: "Antique Doll Automaton",
    badge: "AVANT-GARDE",
    category: "high_fashion",
    image: "/cast/IMG_4174.JPG",
    description: "Surreal automaton wearing a weathered, cracked porcelain baby doll mask with hollow black eye sockets and auburn hair.",
    casting: {
      demographics_and_features: "Slender androgynous figure with delicate posture, wearing an antique cracked porcelain doll face with chubby painted cheeks and hollow pitch-black eye sockets",
      skin_and_surface_microdetails: "Craquelure porcelain glaze with hairline fracture cracks and aged sepia grime patina around eyes and mouth",
      hair_and_grooming: "Tousled frizzy strawberry-blonde/auburn shoulder-length synthetic doll hair parted down center",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Fine-gauge ribbed black wool turtleneck knit sweater",
        mid_layer: "Tailored slim-fit black wool dress trousers with sharp center creases",
      },
      textiles_and_weight: "Fine merino wool turtleneck, crisp structured suiting wool trousers",
      hardware_and_details: "Concealed front zip trouser closure, clean minimalist lines without extraneous adornment",
      wear_and_patina: "Impeccably clean tailoring juxtaposed against decaying vintage porcelain mask",
      footwear: "Polished black leather Chelsea boots with elastic side gussets",
      accessories: ["Weathered antique porcelain doll face mask with hollowed eye cavities"],
    },
    kinetic_posture: "Rigid upright mannequin posture, hands resting at sides with fingers slightly curled, uncanny clockwork stillness",
    tags: ["doll", "porcelain mask", "cracked", "automaton", "creepy cute", "auburn hair", "turtleneck", "tailored"],
  },
  {
    id: "cast-shrouded-oracle",
    name: "The Shrouded Oracle",
    badge: "MYSTIC",
    category: "dark_fantasy",
    image: "/cast/IMG_4175.JPG",
    description: "Tall, enigmatic figure completely veiled behind a thick curtain of waist-length dreadlocks falling over the entire face.",
    casting: {
      demographics_and_features: "Tall, slender, imposing figure with long elegant neck and slender fingers, facial features completely shrouded beneath dense hair",
      skin_and_surface_microdetails: "Smooth rich dark skin visible on hands and neck beneath hair strands, subtle matte sheen",
      hair_and_grooming: "Extraordinary dense curtain of uniform thick black dreadlocks falling past shoulders and chest, entirely concealing the face and eyes",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Matte black fitted stretch-cotton long-sleeve crewneck",
        mid_layer: "Wide-leg oversized black cotton twill cargo trousers with deep bellows pockets",
      },
      textiles_and_weight: "Lightweight stretch cotton top, heavy structured 12oz cotton twill trousers with fluid pooling hems",
      hardware_and_details: "Deep functional utility pockets with reinforced stitching, clean tonal black hardware",
      wear_and_patina: "Deep unwashed midnight black throughout",
      footwear: "Black leather round-toe derby boots",
      accessories: [],
    },
    kinetic_posture: "Standing motionless with arms hanging at sides, head angled slightly downward, enigmatic and impenetrable presence",
    tags: ["dreadlocks", "hair veil", "shrouded", "oracle", "minimalist", "all black", "cargos", "mystic"],
  },
  {
    id: "cast-burned-soldier",
    name: "The Burned Soldier",
    badge: "MILITARY",
    category: "cinematic_historical",
    image: "/cast/IMG_4177.JPG",
    description: "War-torn combat veteran with a face fully wrapped in aged medical gauze bandages, smoking a lit cigarette in an olive tactical helmet.",
    casting: {
      demographics_and_features: "Broad-shouldered battle-hardened male soldier, head and entire face completely wrapped in tight horizontal layers of medical gauze, weathered lips holding a lit cigarette",
      skin_and_surface_microdetails: "Weathered lips with dry chapping, smoke curling from lit cigarette tip, dirt and powder smudge stains on bandages around bridge of nose",
      hair_and_grooming: "Fully concealed beneath tight gauze wraps and padded combat helmet liner",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Olive-drab military field undershirt",
        mid_layer: "Weathered olive-drab tactical M65 field jacket with multiple velcro chest rigs, utility pockets, and ammo pouches",
        outerwear: "Matching olive-drab military cargo trousers with reinforced knees",
      },
      textiles_and_weight: "Heavyweight weathered cotton duck canvas, nylon webbing tactical chest rig, coarse cotton medical gauze bandages",
      hardware_and_details: "Matte green composite ballistic combat helmet with chin strap, fingerless tactical shooting gloves with knuckle padding",
      wear_and_patina: "Heavily scuffed, battle-worn patina, grease stains, washed sun-bleached olive fabric",
      footwear: "Distressed black leather combat boots caked with dry field grime",
      accessories: ["Lit burning cigarette with smoke trail", "Ballistic Kevlar combat helmet", "Fingerless tactical shooting gloves", "Medical gauze face wraps"],
    },
    kinetic_posture: "Standing three-quarters turn, left hand bringing cigarette to lips, shoulders relaxed with stoic survivalist fatalism",
    tags: ["burned man", "bandages", "gauze", "cigarette", "soldier", "military helmet", "field jacket", "post-apocalyptic"],
  },
  {
    id: "cast-streetwear-reaper",
    name: "Streetwear Grim Reaper",
    badge: "REAPER",
    category: "dark_fantasy",
    image: "/cast/IMG_5082.JPG",
    description: "Skeletal reaper figure in a hooded black cowl and cargo pants, resting chin on skeletal hand while seated beside a rustic iron scythe.",
    casting: {
      demographics_and_features: "Real biological human skull, hollow deep eye sockets, complete nasal cavity, intact white teeth, articulated skeletal neck vertebrae, ribcage, and skeletal hand bones",
      skin_and_surface_microdetails: "Bone patina with ivory micro-cracks, subtle shadows inside cranial sutures, matte bone texture without polish",
      hair_and_grooming: "Bone skull crowned by draped black fabric hood",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Distressed sheer black waffle-knit long-sleeve draped across visible ribcage bones",
        mid_layer: "Heavy oversized black washed canvas utility cargo trousers",
        outerwear: "Draped black jersey hood cowl framing the skull",
      },
      textiles_and_weight: "Washed soft cotton jersey hood, distressed slub cotton long-sleeve, rugged heavy canvas cargo pants",
      hardware_and_details: "Full-size traditional farmer's scythe with curved aged ash wood snath and pitted blackened curved iron blade",
      wear_and_patina: "Aged iron rust along the scythe blade edge, vintage stone-washed fade on cargo pants",
      footwear: "Black distressed leather work boots",
      accessories: ["Rustic curved iron scythe with wooden snath handle", "Draped cowl hood"],
    },
    kinetic_posture: "Seated on a weathered timber bench inside an industrial warehouse, resting skeletal chin contemplatively on left bony hand, scythe leaning against leg",
    tags: ["grim reaper", "skeleton", "skull", "scythe", "hood", "cargo pants", "seated", "streetwear reaper"],
  },
  {
    id: "cast-void-sentinel",
    name: "The Void Sentinel",
    badge: "VOID",
    category: "cyber_street",
    image: "/cast/IMG_5083.JPG",
    description: "Striking model with jet-black obsidian skin, a sculpted afro silhouette, and piercing glowing white irises in drop-crotch cargo pants.",
    casting: {
      demographics_and_features: "Black male in early 20s, sculpted high cheekbones, strong square jawline, athletic lean build, intense solid glowing white irises with zero pupil or sclera differentiation",
      skin_and_surface_microdetails: "Uniform matte obsidian skin tone, smooth velvety texture with soft specular highlights along collarbone and temples",
      hair_and_grooming: "Rounded sculptural afro with tight dense texture and crisp silhouette boundary",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Form-fitting matte black ribbed compression long-sleeve top with extended sleeves",
        mid_layer: "Avant-garde drop-crotch black nylon technical trousers with voluminous tapered legs",
      },
      textiles_and_weight: "Lightweight matte technical nylon with crisp crinkle texture, fine-rib cotton elastane",
      hardware_and_details: "Tonal concealed zip pockets, elasticated drawstring waistband, ribbed ankle cuffs",
      wear_and_patina: "Immaculate minimalist monochrome",
      footwear: "High-top lace-up black tactical combat boots with chunky sculpted lugs",
      accessories: ["Solid glowing luminescent white eye contacts"],
    },
    kinetic_posture: "Standing upright facing camera against neutral concrete wall, hands loose at sides, penetrating direct gaze with otherworldly intensity",
    tags: ["void", "white eyes", "afro", "obsidian skin", "drop crotch", "cyberpunk", "sentinel", "monochrome"],
  },
  {
    id: "cast-tactical-grille",
    name: "Tactical Grille Fighter",
    badge: "COMBAT",
    category: "cyber_street",
    image: "/cast/IMG_5084.JPG",
    description: "Athletic fighter in a matte olive FAST helmet with NVG mount, tinted tactical goggles, and flashing gold teeth grillz.",
    casting: {
      demographics_and_features: "Athletic Black male in early 20s, intense competitive expression, bared teeth revealing full gold grillz on bottom teeth, defined jaw and neck musculature",
      skin_and_surface_microdetails: "Rich dark skin with perspiration sheen, defined muscular contours on arms and chest, clear specular skin highlights",
      hair_and_grooming: "Short cropped hair concealed beneath padded tactical helmet liner and retention harness",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Tight athletic crewneck black short-sleeve t-shirt",
        mid_layer: "Loose black combat cargo trousers with oversized thigh flap pockets",
      },
      textiles_and_weight: "Breathable performance moisture-wicking poly-cotton jersey, 500D Cordura cargo fabric",
      hardware_and_details: "Matte olive-drab FAST high-cut ballistic helmet with NVG mounting shroud and ARC accessory rails, tinted ballistic goggles with black strap",
      wear_and_patina: "Clean modern tactical kit",
      footwear: "Heavy black leather combat boots with deep lug tread",
      accessories: ["Polished yellow-gold bottom teeth grillz", "FAST tactical helmet", "Low-profile tinted tactical goggles"],
    },
    kinetic_posture: "Dynamic evasive combat stride, leaping forward with right knee raised high, body twisting as if ducking fire with aggressive grit",
    tags: ["tactical", "fast helmet", "goggles", "gold grillz", "fighter", "combat", "dynamic stride", "black soldier"],
  },
  {
    id: "cast-gothic-minimalist",
    name: "Gothic Minimalist",
    badge: "ALT",
    category: "high_fashion",
    image: "/cast/IMG_5085.JPG",
    description: "Alternative female model with blunt micro-bangs, facial piercings (septum and lip labret), and an oversized rhinestone gothic tee.",
    casting: {
      demographics_and_features: "Southeast Asian / East Asian female in early 20s, delicate oval face, warm golden undertone, almond-shaped dark brown eyes, soft defined lips",
      skin_and_surface_microdetails: "Satin skin finish, natural subtle pores, high cheekbone glow, silver ball septum ring, double spider-bite lip piercings on lower lip",
      hair_and_grooming: "Jet-black waist-length straight hair with blunt ultra-short micro-bangs cut straight across mid-forehead",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Oversized washed black cotton crewneck t-shirt falling to mid-thigh",
        mid_layer: "Fitted black cycling shorts/tights underneath",
      },
      textiles_and_weight: "Heavyweight 260gsm organic cotton jersey with soft brushed feel",
      hardware_and_details: "Clear glass rhinestone heat-transfer gothic Old English lettering 'Echo Thug' wrapping around lower tee hemline, silver stainless steel body piercings",
      wear_and_patina: "Crisp studio lighting with polished metal reflection",
      footwear: "Black platform combat boots",
      accessories: ["Silver septum horseshoe ring", "Twin silver lower lip labret piercings"],
    },
    kinetic_posture: "Standing three-quarters turn, relaxed posture with hands hanging loose, chin slightly tilted upward with aloof model gaze",
    tags: ["micro bangs", "septum piercing", "lip piercings", "gothic", "rhinestones", "alt model", "oversized tee", "female"],
  },
  {
    id: "cast-pierrot-gunslinger",
    name: "Pierrot Gunslinger",
    badge: "HARLEQUIN",
    category: "high_fashion",
    image: "/cast/IMG_5086.JPG",
    description: "Theatrical Pierrot clown in chalk-white face paint, pointed red felt cone hat, and ruffled collar, wielding a pistol and glass of whiskey.",
    casting: {
      demographics_and_features: "Fair-skinned male in early 30s, expressive brow and high cheekbones beneath theatrical makeup, razor-sharp jawline, intense focused hazel eyes",
      skin_and_surface_microdetails: "Chalk-white theatrical clown greasepaint across entire face and neck, black painted diamond tears under left eye, exaggerated red painted smile and black clown nose tip",
      hair_and_grooming: "Shaved clean fade, crown concealed beneath red cone hat",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Bright crimson red felted wool long-sleeve smock tunic with oversized pom-pom front buttons",
        mid_layer: "Pleated white cotton organdy ruffled Elizabethan neck collar",
        outerwear: "Dark navy-black tailored straight-leg trousers",
      },
      textiles_and_weight: "Boiled felted red wool tunic, crisp starched cotton organdy ruff, smooth wool suiting trousers",
      hardware_and_details: "Semi-automatic polymer frame 9mm pistol in right hand, heavy glass rocks tumbler with whiskey and ice in left hand",
      wear_and_patina: "Theatrical cabaret glamour meeting neo-noir edge",
      footwear: "Polished black leather oxford dress shoes",
      accessories: ["Pointed conical red felt clown hat", "Pleated white ruff collar", "9mm handgun", "Whiskey rocks glass"],
    },
    kinetic_posture: "Aggressive action stance, feet planted wide, right arm aiming pistol directly forward, left hand holding whiskey tumbler at waist height",
    tags: ["pierrot", "clown", "face paint", "gun", "pistol", "whiskey", "ruff collar", "red hat", "harlequin", "noir"],
  },
  {
    id: "cast-camcorder-cyborg",
    name: "Camcorder Cyber-Cyborg",
    badge: "CYBORG",
    category: "cyber_street",
    image: "/cast/IMG_5087.JPG",
    description: "East Asian athletic male with a vintage silver miniDV digital camcorder masking-taped across his left eye like a cybernetic ocular lens.",
    casting: {
      demographics_and_features: "East Asian male in early 20s, high sculpted cheekbones, athletic defined pectorals and abdominal musculature, broad shoulders, closed right eye, straight masculine jaw",
      skin_and_surface_microdetails: "Smooth warm ivory skin texture, natural collarbone and pectoral definition, realistic masking tape adhesive wrinkles and edges adhering to skin",
      hair_and_grooming: "Clean uniform buzzcut skin fade across scalp and nape",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Bare athletic torso and shoulders, minimal low-slung black utility trousers",
      },
      textiles_and_weight: "Crepe paper masking tape, brushed silver metallic plastic camera casing, cotton canvas pants",
      hardware_and_details: "Vintage silver Samsung VP-L700U MiniDV digital video camcorder with flip-out LCD screen taped firmly across left eye socket with two strips of beige masking tape",
      wear_and_patina: "Lo-fi retro-futurist cybernetic modification",
      footwear: "Black tactical shoes",
      accessories: ["Silver MiniDV camcorder", "Beige paper masking tape strips securing camera to brow and temple"],
    },
    kinetic_posture: "Standing erect at attention, bare-chested portrait and profile turnaround, right eye serenely closed as the digital camcorder records the viewer",
    tags: ["camcorder", "cyborg", "tape", "miniDV", "surveillance", "lo-fi cyber", "buzzcut", "athletic", "east asian"],
  },
  {
    id: "cast-silverback-couture",
    name: "Silverback Haute Couture",
    badge: "BEAST",
    category: "high_fashion",
    image: "/cast/IMG_5089.JPG",
    description: "Anthropomorphic silverback gorilla in high fashion, wearing a black cable-knit sweater, wide trousers, and a miniature horned rabbit skull.",
    casting: {
      demographics_and_features: "Mature silverback gorilla head and upper body anatomy, weathered leathery sagittal crest face, deep soulful dark eyes, realistic facial fur patterns, gold-capped canine tooth",
      skin_and_surface_microdetails: "Dense glossy black fur coats arms and shoulders, textured wrinkled charcoal skin on face and hands, metallic gold tooth glint",
      hair_and_grooming: "Sculpted black fur crown topped with a white miniature horned rabbit (jackalope) skull hairpiece",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Tight short-sleeve black cable-knit sweater with geometric architectural ribbing",
        mid_layer: "Massive avant-garde drop-crotch black wool trousers with billowing volume",
      },
      textiles_and_weight: "Dense chunky merino wool cable-knit, heavy structured suiting wool trousers",
      hardware_and_details: "Sculpted white resin horned bunny skull accessory resting between ears on top of head, gold incisor tooth cap",
      wear_and_patina: "Editorial runway luxury aesthetic",
      footwear: "Integrated black leather platform boots",
      accessories: ["Miniature white horned rabbit skull hairpiece", "Gold canine cap"],
    },
    kinetic_posture: "Standing tall in imposing runway stance, massive arms hanging at sides, head turned in 90-degree profile displaying regal profile and skull accessory",
    tags: ["gorilla", "silverback", "couture", "cable knit", "rabbit skull", "gold tooth", "drop crotch", "anthropomorphic"],
  },
  {
    id: "cast-contemplative-apostle",
    name: "The Contemplative Apostle",
    badge: "BIBLICAL",
    category: "cinematic_historical",
    image: "/cast/IMG_5090.JPG",
    description: "Sorrowful biblical or Renaissance figure with shoulder-length parted brown hair, soft beard, and dark linen robes over a rust-red tunic.",
    casting: {
      demographics_and_features: "Caucasian male in early 30s, gentle sorrowful green-hazel eyes, prominent straight Roman nose bridge, soft high cheekbones, compassionate melancholic expression",
      skin_and_surface_microdetails: "Fine natural skin texture, gentle crows feet around eyes, natural lip pinkness, soft skin undertones under directional Caravaggesque lighting",
      hair_and_grooming: "Center-parted silky dark brown shoulder-length wavy hair, well-trimmed soft natural beard and mustache",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Coarse rust-red woven linen tunic with simple round neckline",
        outerwear: "Heavy charcoal-black draped linen mantle cloak enveloping shoulders and lap",
      },
      textiles_and_weight: "Rough-spun textured natural linen, hand-dyed earthy earth-tone pigments, heavy organic drape",
      hardware_and_details: "Zero metal hardware, pure classical draping",
      wear_and_patina: "Softly worn historical linen with gentle organic creasing",
      footwear: "Simple brown leather strap sandals",
      accessories: [],
    },
    kinetic_posture: "Seated on a rough-hewn granite boulder, head bowed in deep contemplative prayer with hands clasped tight in lap, sorrowful downward gaze",
    tags: ["apostle", "jesus", "renaissance", "biblical", "linen robes", "beard", "sorrowful", "clasped hands", "historical"],
  },
  {
    id: "cast-panzer-guard",
    name: "Panzer Guard / Jin-Roh",
    badge: "TACTICAL",
    category: "cyber_street",
    image: "/cast/IMG_5091.JPG",
    description: "Heavy assault shock trooper in a matte black Stahlhelm helmet, gas mask with glowing red eye lenses, and spiked armor pauldrons.",
    casting: {
      demographics_and_features: "Massive broad-shouldered heavy assault soldier, imposing hulking presence, face completely enclosed in dual-filter military gas mask",
      skin_and_surface_microdetails: "Concealed beneath matte rubberized gas mask with circular glowing red glass lenses emitting faint light",
      hair_and_grooming: "Fully enclosed beneath military Stahlhelm helmet with low rim",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Heavy black tactical BDU combat fatigue shirt and trousers",
        outerwear: "Segmented ballistic chest armor with ab plates, spiked shoulder pauldrons, reinforced forearm shield guard, and knee/shin armor",
      },
      textiles_and_weight: "Matte molded polyurethane ballistic armor plates, reinforced ripstop tactical nylon, rubberized gas mask hood",
      hardware_and_details: "Molded spikes on shoulder pauldrons, forearm riot shield plate on left arm, quick-release duty belt with utility pouch",
      wear_and_patina: "Matte tactical finish with subtle scuffing along armor edges",
      footwear: "Heavy reinforced steel-toe combat boots",
      accessories: ["Matte black Stahlhelm helmet", "Dual-filter gas mask with glowing red lenses", "Spiked pauldrons", "Forearm riot armor"],
    },
    kinetic_posture: "Wide intimidating guard stance, fists clenched at sides, chest squared forward, ready for tactical breach",
    tags: ["jin-roh", "panzer cop", "gas mask", "red lenses", "stahlhelm", "spiked armor", "heavy soldier", "dystopian"],
  },
  {
    id: "cast-clear-shield-exec",
    name: "Clear Shield Executive",
    badge: "CORP",
    category: "high_fashion",
    image: "/cast/IMG_5092.JPG",
    description: "Corporate executive in a bespoke charcoal wool suit and red silk tie, wearing a transparent molded plastic face shield with black elastic straps.",
    casting: {
      demographics_and_features: "Caucasian male in early 30s, square masculine jaw, clean-shaven, slicked dark brown side-parted hair, stoic corporate expression",
      skin_and_surface_microdetails: "Pristine groomed skin visible through the crystal-clear plastic face shield, specular light reflections dancing along the plastic curve",
      hair_and_grooming: "Classic executive side-part with high-shine pomade, trimmed sideburns, zero facial hair",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Crisp structured white cotton spread-collar dress shirt",
        mid_layer: "Bespoke two-button charcoal grey virgin wool blazer jacket with notch lapels",
        outerwear: "Matching tailored flat-front charcoal wool trousers",
      },
      textiles_and_weight: "Super 130s English virgin wool twill, 100% Egyptian cotton poplin shirt, lustrous crimson red woven silk tie",
      hardware_and_details: "Dark horn blazer buttons, matching crimson red silk pocket square in chest pocket, twin black elastic bands strapping face shield",
      wear_and_patina: "Razor-sharp boardroom tailoring juxtaposed with dystopian medical transparency",
      footwear: "Mirror-shine polished black leather oxford dress shoes",
      accessories: ["Contoured transparent polycarbonate face shield mask with dual black elastic retention straps", "Crimson silk tie and pocket square"],
    },
    kinetic_posture: "Standing erect in corporate posture, hands relaxed at sides, direct unblinking gaze through the clear face shield",
    tags: ["suit", "corporate", "executive", "clear mask", "face shield", "red tie", "american psycho", "dystopian", "charcoal suit"],
  },
  {
    id: "cast-pastoral-coquette",
    name: "Pastoral Coquette",
    badge: "COQUETTE",
    category: "cinematic_historical",
    image: "/cast/IMG_5093.JPG",
    description: "Ethereal young woman with soft brunette curtain bangs and pearl earrings, wearing a pastel green floral stripe day dress with pink bow.",
    casting: {
      demographics_and_features: "Young Caucasian female in early 20s, delicate heart-shaped face, soft rounded jawline, porcelain complexion, warm brown doe eyes, rosy flushed cheeks",
      skin_and_surface_microdetails: "Luminous dewy skin finish, soft natural blush across apples of cheeks and nose bridge, natural pink lip tint",
      hair_and_grooming: "Dark chocolate wavy brunette hair cascading past shoulders with soft eyebrow-grazing curtain bangs",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Tea-length pastel sage-green and ivory striped short-sleeve day dress with delicate ditsy floral vine motifs",
      },
      textiles_and_weight: "Lightweight breathable cotton lawn with fluid drape, soft baby-pink satin ribbon bow at V-neckline",
      hardware_and_details: "Delicate pink satin ribbon bow pinned at center cleavage, classic pearl teardrop drop earrings in silver settings",
      wear_and_patina: "Fresh, breezy spring pastoral charm",
      footwear: "White leather Mary Jane block heels with round toes and ankle straps",
      accessories: ["Dangling pearl drop earrings", "Baby pink satin ribbon chest bow"],
    },
    kinetic_posture: "Standing three-quarters turn with slight head tilt, hands resting softly beside thighs, wistful and romantic profile gaze",
    tags: ["coquette", "floral dress", "pastoral", "french girl", "mary janes", "pearl earrings", "brunette", "bangs", "vintage"],
  },
  {
    id: "cast-horned-satyr",
    name: "The Horned Satyr",
    badge: "SATYR",
    category: "dark_fantasy",
    image: "/cast/IMG_5095.JPG",
    description: "Towering gothic male model wearing a matte black cowl with upward-curving devil horns, draped in a floor-length black cape.",
    casting: {
      demographics_and_features: "Tall athletic male in late 20s, sharp angular jawline, sunken hollow cheeks, high defined cheekbones, deep-set shadowy eyes",
      skin_and_surface_microdetails: "Matte fair skin texture under dramatic overhead rim lighting, sharp bone contours in profile",
      hair_and_grooming: "Scalp enclosed in sculpted matte black horned leather/latex skullcap with twin upward-sweeping curved horns",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Form-fitting black long-sleeve crewneck top",
        mid_layer: "Wide-leg black utility cargo trousers with voluminous silhouette",
        outerwear: "Dramatic floor-length black wool-cashmere cape draped over shoulders",
      },
      textiles_and_weight: "Heavy flowing black wool cape with weighted drape, stretch cotton long-sleeve, structured cotton twill cargos",
      hardware_and_details: "Twin sculpted matte black devil horns curving smoothly upward, tonal concealed closures",
      wear_and_patina: "Midnight black monochromatic darkness with crisp edge rim lighting",
      footwear: "Chunky black platform shoes",
      accessories: ["Matte black horned cowl headpiece with twin curved devil horns", "Floor-sweeping dramatic black cape"],
    },
    kinetic_posture: "Standing tall and commanding at center, arms at sides, cape falling straight down, head turned in sharp 90-degree profile displaying the horn curvature",
    tags: ["horns", "devil", "satyr", "cape", "cloak", "all black", "gothic", "monochrome", "dark fantasy"],
  },
  {
    id: "cast-queen-of-chalices",
    name: "Queen of Chalices",
    badge: "ROYAL",
    category: "dark_fantasy",
    image: "/cast/IMG_5096.JPG",
    description: "Regal Black queen with luminous icy blue eyes, wearing a jeweled crown over a mourning veil and hooded wool cloak, holding a black stone chalice.",
    casting: {
      demographics_and_features: "Striking Black female in late 20s, graceful aristocratic facial structure, high sculpted cheekbones, full lips, piercing luminescent icy pale blue eyes with intense contrast",
      skin_and_surface_microdetails: "Flawless dark cocoa skin texture with soft velvet matte finish, dramatic specular catchlight in pale blue irises",
      hair_and_grooming: "Hair enclosed beneath black mourning veil and sheer headwrap, crowned by an antique bronze jeweled coronet",
    },
    wardrobe: {
      layering_system: {
        base_layer: "Floor-length black silk georgette mourning dress",
        mid_layer: "Sheer black chiffon facial veil draped from the crown",
        outerwear: "Heavyweight black textured wool hooded cloak enveloping the entire body down to the floor",
      },
      textiles_and_weight: "Heavy nubby wool bouclé cloak, sheer floaty silk chiffon veil, filigree antique bronze metal",
      hardware_and_details: "Intricate antique bronze filigree crown studded with pearls and faceted crystals, hand-carved black slate chalice goblet",
      wear_and_patina: "Sovereign ecclesiastical solemnity, antique metallic patina",
      footwear: "Concealed black leather ceremonial boots",
      accessories: ["Antique jeweled bronze crown / coronet", "Carved black stone ceremonial chalice goblet", "Hooded mourning cloak"],
    },
    kinetic_posture: "Standing erect in solemn royal majesty, holding the black stone chalice with both hands at waist height, gazing forward with piercing icy blue eyes",
    tags: ["queen", "chalice", "crown", "blue eyes", "black queen", "hooded cloak", "mourning veil", "regal", "dark fantasy", "occult"],
  },
];

export const CAST_MODELS_BY_ID = new Map<string, CastModelItem>(
  CAST_MODELS.map((model) => [model.id, model]),
);

export function filterCastModels(
  models: CastModelItem[],
  category: CastCategory,
  search: string,
): CastModelItem[] {
  let list = models;
  if (category !== "all") {
    list = list.filter((m) => m.category === category);
  }
  const q = search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.badge.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)) ||
        m.casting.demographics_and_features.toLowerCase().includes(q) ||
        m.casting.hair_and_grooming.toLowerCase().includes(q),
    );
  }
  return list;
}

export function applyCastModel(
  doc: PromptDoc,
  model: CastModelItem,
  slotIndex: number,
): PromptDoc {
  let next = doc;
  const subjectPath = `subjects.${slotIndex}`;

  // 1. Subject ID
  next = setAt(next, `${subjectPath}.subject_id`, model.name);

  // 2. Casting & Physique
  next = setAt(
    next,
    `${subjectPath}.casting_and_physique.demographics_and_features`,
    model.casting.demographics_and_features,
  );
  next = setAt(
    next,
    `${subjectPath}.casting_and_physique.skin_and_surface_microdetails`,
    model.casting.skin_and_surface_microdetails,
  );
  next = setAt(
    next,
    `${subjectPath}.casting_and_physique.hair_and_grooming`,
    model.casting.hair_and_grooming,
  );

  // 3. Wardrobe Architecture
  const wardrobePath = `${subjectPath}.wardrobe_architecture`;
  if (model.wardrobe.layering_system.base_layer) {
    next = setAt(
      next,
      `${wardrobePath}.layering_system.base_layer`,
      model.wardrobe.layering_system.base_layer,
    );
  }
  if (model.wardrobe.layering_system.mid_layer) {
    next = setAt(
      next,
      `${wardrobePath}.layering_system.mid_layer`,
      model.wardrobe.layering_system.mid_layer,
    );
  }
  if (model.wardrobe.layering_system.outerwear) {
    next = setAt(
      next,
      `${wardrobePath}.layering_system.outerwear`,
      model.wardrobe.layering_system.outerwear,
    );
  }
  if (model.wardrobe.textiles_and_weight) {
    next = setAt(
      next,
      `${wardrobePath}.textiles_and_weight`,
      model.wardrobe.textiles_and_weight,
    );
  }
  if (model.wardrobe.hardware_and_details) {
    next = setAt(
      next,
      `${wardrobePath}.hardware_and_details`,
      model.wardrobe.hardware_and_details,
    );
  }
  if (model.wardrobe.wear_and_patina) {
    next = setAt(
      next,
      `${wardrobePath}.wear_and_patina`,
      model.wardrobe.wear_and_patina,
    );
  }
  if (model.wardrobe.footwear) {
    next = setAt(next, `${wardrobePath}.footwear`, model.wardrobe.footwear);
  }
  if (model.wardrobe.accessories && model.wardrobe.accessories.length > 0) {
    next = setAt(
      next,
      `${wardrobePath}.accessories`,
      model.wardrobe.accessories,
    );
  }

  // 4. Kinetic Posture
  if (model.kinetic_posture) {
    next = setAt(next, `${subjectPath}.kinetic_posture`, model.kinetic_posture);
  }

  return next;
}

export function isCastModelApplied(
  doc: PromptDoc,
  model: CastModelItem,
  slotIndex: number,
): boolean {
  const subject = doc.subjects[slotIndex];
  if (!subject) return false;

  if (subject.subject_id.trim().toLowerCase() === model.name.toLowerCase()) {
    return true;
  }
  if (
    subject.casting_and_physique.hair_and_grooming ===
      model.casting.hair_and_grooming &&
    subject.casting_and_physique.demographics_and_features ===
      model.casting.demographics_and_features
  ) {
    return true;
  }
  return false;
}
