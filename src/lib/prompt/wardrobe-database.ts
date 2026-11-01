// Auto-generated from Lib_Wardrobe/wardrobe_library.json
import { setAt, type PromptDoc } from "./model.ts";

export type WardrobeSlot =
  | "outerwear"
  | "layer_top"
  | "top"
  | "dress_onepiece"
  | "bottom"
  | "belt_waist"
  | "legwear"
  | "shoes"
  | "headwear"
  | "eyewear"
  | "neckwear"
  | "jewelry"
  | "bag"
  | "accessory";

export type WardrobeItem = {
  id: string;
  name: string;
  slot: WardrobeSlot;
  subcategory: string;
  style_tags: string[];
  colors: string[];
  materials: string[];
  patterns?: string[];
  fit_silhouette?: string;
  details?: string[];
  styling_notes?: string;
  prompt: string;
  prompt_brand_free?: string;
  negative?: string[];
  source_images?: string[];
  render_style_seen?: "illustration" | "photo" | "both";
  outfit_ids?: string[];
  image: string;
  is_custom?: boolean;
  created_at?: number;
};

export type WardrobeOutfit = {
  id: string;
  name: string;
  style_tags: string[];
  slots: Record<WardrobeSlot, string[]>;
  item_ids: string[];
  prompt: string;
  prompt_brand_free?: string;
  negative?: string[];
  source_images?: string[];
  image: string;
  user_created?: boolean;
  is_custom?: boolean;
  created_at?: number;
};

export type WardrobeSlotInfo = {
  slot: WardrobeSlot;
  description: string;
  subcategories: string[];
  item_count: number;
};

export const WARDROBE_SLOTS: WardrobeSlotInfo[] = [
  {
    "slot": "headwear",
    "description": "Hats, beanies, caps, hair bows, headbands, durags, balaclavas",
    "subcategories": [
      "balaclava",
      "beanie",
      "cap",
      "durag",
      "hair_ribbon",
      "headband"
    ],
    "item_count": 9
  },
  {
    "slot": "eyewear",
    "description": "Sunglasses and glasses",
    "subcategories": [
      "glasses",
      "sunglasses"
    ],
    "item_count": 3
  },
  {
    "slot": "jewelry",
    "description": "Necklaces, earrings, rings, bracelets",
    "subcategories": [
      "bracelets",
      "earrings",
      "necklace",
      "necklace_layered",
      "rings"
    ],
    "item_count": 13
  },
  {
    "slot": "neckwear",
    "description": "Chokers, ties, scarves, collars",
    "subcategories": [
      "choker",
      "collar_ribbon",
      "necktie",
      "scarf"
    ],
    "item_count": 6
  },
  {
    "slot": "top",
    "description": "Tees, tanks, blouses, sweaters, crop tops, bustiers",
    "subcategories": [
      "blouse",
      "bralette_top",
      "bustier",
      "cami",
      "crop_tee",
      "knit_top",
      "long_sleeve_tee",
      "polo",
      "sweater",
      "sweatshirt",
      "tank",
      "tee",
      "tube_top"
    ],
    "item_count": 37
  },
  {
    "slot": "layer_top",
    "description": "Shirts or long-sleeves worn open or under/over another top",
    "subcategories": [
      "camp_shirt",
      "long_sleeve_tee",
      "shirt"
    ],
    "item_count": 4
  },
  {
    "slot": "outerwear",
    "description": "Jackets, hoodies, blazers, puffers, vests, capes",
    "subcategories": [
      "blazer",
      "cape",
      "denim_jacket",
      "fleece_jacket",
      "leather_blazer",
      "leather_jacket",
      "puffer",
      "track_jacket",
      "tweed_jacket",
      "vest",
      "work_jacket",
      "zip_hoodie"
    ],
    "item_count": 19
  },
  {
    "slot": "dress_onepiece",
    "description": "Dresses, pinafores, bodysuits (replace top + bottom)",
    "subcategories": [
      "corset_bodysuit",
      "knit_dress",
      "pinafore",
      "tee_dress"
    ],
    "item_count": 5
  },
  {
    "slot": "bottom",
    "description": "Jeans, trousers, skirts, shorts, sweatpants",
    "subcategories": [
      "bloomers",
      "cargo_pants",
      "jeans",
      "maxi_skirt",
      "mini_skirt",
      "puffer_pants",
      "shorts",
      "sweatpants",
      "track_pants",
      "trousers"
    ],
    "item_count": 39
  },
  {
    "slot": "belt_waist",
    "description": "Belts and hip chains",
    "subcategories": [
      "belt",
      "chain_belt"
    ],
    "item_count": 11
  },
  {
    "slot": "legwear",
    "description": "Socks, loose socks, leg warmers, stockings",
    "subcategories": [
      "knee_socks",
      "leg_warmers",
      "loose_socks",
      "socks",
      "thigh_highs"
    ],
    "item_count": 10
  },
  {
    "slot": "shoes",
    "description": "All footwear",
    "subcategories": [
      "ankle_boots",
      "cowboy_boots",
      "derbies",
      "knee_boots",
      "loafers",
      "mary_janes",
      "platform_boots",
      "platform_sneakers",
      "pumps",
      "sandals",
      "slouch_boots",
      "sneakers",
      "work_boots"
    ],
    "item_count": 34
  },
  {
    "slot": "bag",
    "description": "Bags of every size",
    "subcategories": [
      "basket",
      "belt_bag",
      "crossbody",
      "mini_bag",
      "shoulder_bag",
      "sling",
      "top_handle",
      "tote"
    ],
    "item_count": 16
  },
  {
    "slot": "accessory",
    "description": "Charms, keychains, wallet chains, watches, corsages, carried props",
    "subcategories": [
      "bag_charm",
      "carried_prop",
      "chain_charm",
      "corsage",
      "keychain",
      "wallet_chain",
      "watch"
    ],
    "item_count": 7
  }
];

export const STYLE_TAG_VOCABULARY: Record<string, string> = {
  "gyaru": "Japanese 90s/00s gal style: tan-glam, loose socks, rhinestones, pink, bold accessories",
  "y2k": "Late-90s/early-2000s pop fashion: low rise, baby tees, rhinestones, butterflies, glossy pink",
  "y2k_streetwear": "Early-2000s girls' streetwear: crop tees, baggy jeans, mini bags, star charms, zip hoodies",
  "streetwear_90s": "90s/00s hip-hop and skate street basics: oversized tees, baggy denim, high-tops, chains",
  "hip_hop_2000s": "2000s rap-video staples: dark denim sets, Old English lettering, durags, fitted caps, gold",
  "uk_drill": "UK road style: matching tracksuits, glossy puffers, balaclava wraps, camo cargos, runners",
  "luxury_street": "Designer streetwear: logo tracksuits, luxury sneakers, statement knits, premium basics",
  "avant_garde_dark": "Dark avant-garde menswear: waxed denim, leather, drape, long drawcords, monochrome",
  "avant_garde_rick": "Rick-Owens-like silhouettes: massive platform soles, sheer jersey, skinny stacked legs",
  "avant_garde_diy": "Deconstructed DIY art pieces: belts as garments, painted/distressed hardware, draped chains",
  "gothic": "Black-dominant dark style: crosses, grommets, studs, lace, patent",
  "gothic_lolita": "Dark Lolita: Victorian blouses, bloomers, ribbons, platform Mary Janes, black and red",
  "classic_lolita": "Soft Lolita: lace headdresses, frilled collars, bishop sleeves, demure shapes",
  "coquette": "Girly romantic: bows, ribbons, lace trims, pink, ruffles, pearls",
  "kawaii": "Cute Japanese style: plush charms, bows, pastel, playful proportions",
  "vintage_romantic": "Old-fashioned feminine: maxi skirts, Peter Pan collars, eyelet lace, polka dots",
  "mori_girl": "Forest-girl softness: loose blouses, long skirts, baskets, natural materials",
  "french_casual": "Effortless Parisian basics: Breton stripes, simple bags, soft neutrals",
  "cozy_layered": "Soft oversized layering: sherpa, chunky knits, slouchy boots",
  "dark_academia": "Scholarly classics: tartan, ties, satchels, loafers, browns and navies",
  "preppy": "Clean collegiate: collared blouses, plaid, polos, pleated skirts",
  "preppy_90s": "Clueless-era preppy: tweed sets, gingham, thigh-highs, platform pumps",
  "preppy_sport": "Varsity and football-jersey knitwear with stripes and felt letters",
  "japanese_school": "Japanese school-uniform (JK) codes: blazers, pleated skirts, loafers, loose socks",
  "harajuku_street": "Japanese street casual with text graphics and fitted basics",
  "sportswear": "Athletic pieces worn as fashion: track sets, bike shorts, tennis skirts, runners",
  "techwear": "Utility hardware and technical fabrics: cobra buckles, slings, sculpted soles",
  "grunge": "Undone layering: distressed denim, loose ties, layered chains, worn textures",
  "punk": "Studs, spikes, bullet belts, wallet chains, DIY hardware",
  "rock_moto": "Leather jackets, skinny black denim, Chelsea boots, silver jewelry",
  "leather_tailoring": "Tailored leather suiting and polished leather footwear",
  "indie_sleaze": "2000s party style: thigh-highs, knit minis, wire glasses, pointy pumps",
  "western": "Cowboy codes: western stitching, metal toe caps, bandana print, flares",
  "americana": "Classic US workwear basics: A-shirts, straight jeans, belts, trucker jackets",
  "vintage_workwear": "Work-heritage pieces: braided belts, desert boots, painter denim, canvas",
  "skater": "Skate-shop staples: puffy skate shoes, slip-ons, loose denim",
  "minimal_basics": "Plain staples that go with anything",
  "romantic_couture": "Couture-level romantic pieces: floral appliqué tulle, corsetry, capes",
  "fairycore": "Ethereal floaty pieces with flowers and sheer layers"
};

export const WARDROBE_ITEMS: WardrobeItem[] = [
  {
    "id": "headwear_balaclava_wrap_white_01",
    "name": "White wrapped balaclava face mask",
    "slot": "headwear",
    "subcategory": "balaclava",
    "style_tags": [
      "uk_drill",
      "streetwear_90s"
    ],
    "colors": [
      "white",
      "cream"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [],
    "fit_silhouette": "full head wrap covering the head and lower face, only eyes visible",
    "details": [
      "fabric knotted at the back with loose tails"
    ],
    "styling_notes": "worn with matching tracksuits",
    "prompt": "white cotton jersey fabric wrapped tightly around the head as a balaclava, covering head and lower face with only the eyes showing, knotted at the back",
    "negative": [],
    "source_images": [
      "H5",
      "I3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_H5",
      "outfit_I3_green",
      "outfit_I3_yellow"
    ],
    "image": "/shots/items/headwear_balaclava_wrap_white_01.jpg"
  },
  {
    "id": "headwear_beanie_rib_red_01",
    "name": "Red ribbed beanie",
    "slot": "headwear",
    "subcategory": "beanie",
    "style_tags": [
      "streetwear_90s",
      "y2k_streetwear",
      "grunge"
    ],
    "colors": [
      "brick red"
    ],
    "materials": [
      "rib knit"
    ],
    "patterns": [],
    "fit_silhouette": "slouchy cuffed beanie sitting back on the head",
    "details": [
      "folded cuff"
    ],
    "styling_notes": "worn pushed back from the forehead",
    "prompt": "brick red ribbed knit cuffed beanie, slightly slouchy, sitting back on the head",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_left"
    ],
    "image": "/shots/items/headwear_beanie_rib_red_01.jpg"
  },
  {
    "id": "headwear_beanie_skull_swoosh_black_01",
    "name": "Black skull beanie",
    "slot": "headwear",
    "subcategory": "beanie",
    "style_tags": [
      "uk_drill",
      "sportswear"
    ],
    "colors": [
      "black",
      "white"
    ],
    "materials": [
      "rib knit"
    ],
    "patterns": [],
    "fit_silhouette": "short fitted beanie sitting high on the head",
    "details": [
      "small white swoosh logo"
    ],
    "styling_notes": "",
    "prompt": "short fitted black knit skull beanie with a small white logo on the cuff",
    "negative": [],
    "source_images": [
      "I4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I4"
    ],
    "image": "/shots/items/headwear_beanie_skull_swoosh_black_01.jpg"
  },
  {
    "id": "headwear_cap_baseball_black_backwards_01",
    "name": "Black baseball cap",
    "slot": "headwear",
    "subcategory": "cap",
    "style_tags": [
      "streetwear_90s",
      "luxury_street"
    ],
    "colors": [
      "black",
      "white"
    ],
    "materials": [
      "cotton twill"
    ],
    "patterns": [],
    "fit_silhouette": "curved brim cap",
    "details": [
      "small front logo"
    ],
    "styling_notes": "worn backwards or low",
    "prompt": "black cotton baseball cap with a small white front logo",
    "negative": [],
    "source_images": [
      "E3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E3_right"
    ],
    "image": "/shots/items/headwear_cap_baseball_black_backwards_01.jpg"
  },
  {
    "id": "headwear_cap_fitted_la_green_01",
    "name": "Forest green LA fitted cap",
    "slot": "headwear",
    "subcategory": "cap",
    "style_tags": [
      "streetwear_90s",
      "hip_hop_2000s"
    ],
    "colors": [
      "forest green",
      "white"
    ],
    "materials": [
      "wool twill"
    ],
    "patterns": [],
    "fit_silhouette": "structured fitted cap with flat-to-curved brim",
    "details": [
      "white interlocking LA logo on front",
      "gray underbrim"
    ],
    "styling_notes": "worn low over the eyes",
    "prompt": "structured forest green fitted baseball cap with a white interlocking LA logo on the front",
    "prompt_brand_free": "structured forest green fitted baseball cap with a white interlocking two-letter logo on the front",
    "negative": [],
    "source_images": [
      "G5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G5"
    ],
    "image": "/shots/items/headwear_cap_fitted_la_green_01.jpg"
  },
  {
    "id": "headwear_durag_black_01",
    "name": "Black durag",
    "slot": "headwear",
    "subcategory": "durag",
    "style_tags": [
      "streetwear_90s",
      "hip_hop_2000s"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "silky polyester"
    ],
    "patterns": [],
    "fit_silhouette": "tied close over the head",
    "details": [
      "smooth sheen"
    ],
    "styling_notes": "worn under loose locs",
    "prompt": "black silky durag tied snugly over the head",
    "negative": [],
    "source_images": [
      "E1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E1"
    ],
    "image": "/shots/items/headwear_durag_black_01.jpg"
  },
  {
    "id": "headwear_headband_lace_ruffle_white_01",
    "name": "White lace ruffle headband",
    "slot": "headwear",
    "subcategory": "headband",
    "style_tags": [
      "coquette",
      "classic_lolita",
      "kawaii"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "lace",
      "cotton"
    ],
    "patterns": [],
    "fit_silhouette": "narrow band across the crown with frilled edges",
    "details": [
      "gathered lace ruffle"
    ],
    "styling_notes": "worn across the top of the head behind bangs",
    "prompt": "white frilled lace ruffle headband sitting across the crown of the head, gathered lace edging like a maid or Lolita headdress",
    "negative": [],
    "source_images": [
      "A3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A3"
    ],
    "image": "/shots/items/headwear_headband_lace_ruffle_white_01.jpg"
  },
  {
    "id": "headwear_ribbon_bows_white_01",
    "name": "White ribbon hair bows",
    "slot": "headwear",
    "subcategory": "hair_ribbon",
    "style_tags": [
      "coquette",
      "kawaii"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "satin ribbon"
    ],
    "patterns": [],
    "fit_silhouette": "medium bows tied high on twin tails with long tails",
    "details": [
      "long trailing ribbon tails"
    ],
    "styling_notes": "one bow on each high twin tail",
    "prompt": "white satin ribbon bows tied high on each twin tail, long ribbon tails trailing down",
    "negative": [],
    "source_images": [
      "A5"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A5"
    ],
    "image": "/shots/items/headwear_ribbon_bows_white_01.jpg"
  },
  {
    "id": "headwear_ribbon_hair_ties_black_01",
    "name": "Black ribbon hair bows",
    "slot": "headwear",
    "subcategory": "hair_ribbon",
    "style_tags": [
      "kawaii",
      "coquette",
      "gothic_lolita"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "satin ribbon"
    ],
    "patterns": [],
    "fit_silhouette": "small bows tied at the base of low pigtails or twin tails, tails hanging",
    "details": [
      "glossy satin",
      "floppy loops"
    ],
    "styling_notes": "one bow on each pigtail",
    "prompt": "small glossy black satin ribbon bows tied at the base of each pigtail, loops and tails hanging loosely",
    "negative": [],
    "source_images": [
      "A2",
      "B1"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A2",
      "outfit_B1"
    ],
    "image": "/shots/items/headwear_ribbon_hair_ties_black_01.jpg"
  },
  {
    "id": "eyewear_glasses_oval_wire_01",
    "name": "Small oval wire-rim glasses",
    "slot": "eyewear",
    "subcategory": "glasses",
    "style_tags": [
      "indie_sleaze",
      "y2k"
    ],
    "colors": [
      "silver"
    ],
    "materials": [
      "thin metal"
    ],
    "patterns": [],
    "fit_silhouette": "small narrow oval lenses",
    "details": [
      "clear lenses",
      "thin wire frame"
    ],
    "styling_notes": "",
    "prompt": "small narrow oval clear-lens glasses with thin silver wire frames",
    "negative": [],
    "source_images": [
      "F1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F1"
    ],
    "image": "/shots/items/eyewear_glasses_oval_wire_01.jpg"
  },
  {
    "id": "eyewear_sunglasses_shield_aviator_brown_01",
    "name": "Oversized brown shield aviators",
    "slot": "eyewear",
    "subcategory": "sunglasses",
    "style_tags": [
      "luxury_street",
      "avant_garde_dark"
    ],
    "colors": [
      "brown",
      "gold"
    ],
    "materials": [
      "metal",
      "tinted lens"
    ],
    "patterns": [],
    "fit_silhouette": "oversized aviator-shield shape",
    "details": [
      "brown gradient tint",
      "thin metal frame"
    ],
    "styling_notes": "",
    "prompt": "oversized brown-tinted shield aviator sunglasses with a thin gold metal frame",
    "negative": [],
    "source_images": [
      "E4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E4"
    ],
    "image": "/shots/items/eyewear_sunglasses_shield_aviator_brown_01.jpg"
  },
  {
    "id": "eyewear_sunglasses_white_orange_lens_01",
    "name": "White sunglasses with orange lenses",
    "slot": "eyewear",
    "subcategory": "sunglasses",
    "style_tags": [
      "y2k_streetwear",
      "y2k"
    ],
    "colors": [
      "white",
      "orange red"
    ],
    "materials": [
      "plastic"
    ],
    "patterns": [],
    "fit_silhouette": "rectangular wraparound frames",
    "details": [
      "gradient orange-red lenses",
      "small logo on temples"
    ],
    "styling_notes": "pushed up on top of the head like a headband",
    "prompt": "glossy white rectangular sunglasses with gradient orange-red lenses, pushed up on top of the head",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_right"
    ],
    "image": "/shots/items/eyewear_sunglasses_white_orange_lens_01.jpg"
  },
  {
    "id": "jewelry_bracelets_beaded_stack_01",
    "name": "Beaded bracelet stack",
    "slot": "jewelry",
    "subcategory": "bracelets",
    "style_tags": [
      "y2k_streetwear",
      "streetwear_90s"
    ],
    "colors": [
      "white",
      "gold",
      "multicolor"
    ],
    "materials": [
      "beads"
    ],
    "patterns": [],
    "fit_silhouette": "two or three thin stretch bracelets on one wrist",
    "details": [],
    "styling_notes": "",
    "prompt": "stack of two or three thin beaded stretch bracelets on the wrist",
    "negative": [],
    "source_images": [
      "D2",
      "G3",
      "H4"
    ],
    "render_style_seen": "both",
    "outfit_ids": [
      "outfit_D2_right",
      "outfit_G3",
      "outfit_H4"
    ],
    "image": "/shots/items/jewelry_bracelets_beaded_stack_01.jpg"
  },
  {
    "id": "jewelry_bracelets_silver_bangle_stack_01",
    "name": "Silver bangle stack",
    "slot": "jewelry",
    "subcategory": "bracelets",
    "style_tags": [
      "luxury_street",
      "rock_moto"
    ],
    "colors": [
      "silver"
    ],
    "materials": [
      "silver metal"
    ],
    "patterns": [],
    "fit_silhouette": "several bangles and chain bracelets on each wrist",
    "details": [],
    "styling_notes": "",
    "prompt": "stacked chunky silver bangles and chain bracelets on the wrist",
    "negative": [],
    "source_images": [
      "E3",
      "F1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E3_right",
      "outfit_F1"
    ],
    "image": "/shots/items/jewelry_bracelets_silver_bangle_stack_01.jpg"
  },
  {
    "id": "jewelry_earrings_gold_hoops_01",
    "name": "Gold hoop earrings",
    "slot": "jewelry",
    "subcategory": "earrings",
    "style_tags": [
      "streetwear_90s",
      "y2k_streetwear"
    ],
    "colors": [
      "gold"
    ],
    "materials": [
      "gold metal"
    ],
    "patterns": [],
    "fit_silhouette": "small to medium thin hoops",
    "details": [],
    "styling_notes": "",
    "prompt": "small thin polished gold hoop earrings, about one inch across, worn in both ears",
    "negative": [],
    "source_images": [
      "C4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_C4"
    ],
    "image": "/shots/items/jewelry_earrings_gold_hoops_01.jpg"
  },
  {
    "id": "jewelry_earrings_small_hoops_silver_01",
    "name": "Small silver hoops",
    "slot": "jewelry",
    "subcategory": "earrings",
    "style_tags": [
      "minimal_basics",
      "indie_sleaze"
    ],
    "colors": [
      "silver"
    ],
    "materials": [
      "silver metal"
    ],
    "patterns": [],
    "fit_silhouette": "small huggie hoops",
    "details": [],
    "styling_notes": "",
    "prompt": "small silver huggie hoop earrings hugging the earlobe, polished finish",
    "negative": [],
    "source_images": [
      "F1",
      "F2"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F1",
      "outfit_F2"
    ],
    "image": "/shots/items/jewelry_earrings_small_hoops_silver_01.jpg"
  },
  {
    "id": "jewelry_earrings_stud_diamond_01",
    "name": "Diamond stud earring",
    "slot": "jewelry",
    "subcategory": "earrings",
    "style_tags": [
      "minimal_basics",
      "hip_hop_2000s"
    ],
    "colors": [
      "silver",
      "clear"
    ],
    "materials": [
      "metal",
      "crystal"
    ],
    "patterns": [],
    "fit_silhouette": "small single stud",
    "details": [],
    "styling_notes": "",
    "prompt": "small sparkling round diamond stud earring in a silver setting, worn in one or both ears",
    "negative": [],
    "source_images": [
      "G4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G4"
    ],
    "image": "/shots/items/jewelry_earrings_stud_diamond_01.jpg"
  },
  {
    "id": "jewelry_necklace_initial_pendant_gold_01",
    "name": "Gold initial pendant chain",
    "slot": "jewelry",
    "subcategory": "necklace",
    "style_tags": [
      "streetwear_90s",
      "hip_hop_2000s"
    ],
    "colors": [
      "gold"
    ],
    "materials": [
      "gold metal"
    ],
    "patterns": [],
    "fit_silhouette": "thin gold chain with a letter charm at the sternum",
    "details": [
      "single gold letter initial pendant"
    ],
    "styling_notes": "",
    "prompt": "thin gold chain necklace with a single gold block-letter initial pendant",
    "negative": [],
    "source_images": [
      "G2",
      "G5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G2",
      "outfit_G5"
    ],
    "image": "/shots/items/jewelry_necklace_initial_pendant_gold_01.jpg"
  },
  {
    "id": "jewelry_necklace_layered_butterfly_silver_01",
    "name": "Layered silver butterfly necklaces",
    "slot": "jewelry",
    "subcategory": "necklace_layered",
    "style_tags": [
      "y2k",
      "coquette"
    ],
    "colors": [
      "silver"
    ],
    "materials": [
      "silver metal"
    ],
    "patterns": [],
    "fit_silhouette": "two or three fine chains of graduated length",
    "details": [
      "rhinestone butterfly pendant"
    ],
    "styling_notes": "layered under a choker",
    "prompt": "two or three fine layered silver chains with a sparkly rhinestone butterfly pendant",
    "negative": [],
    "source_images": [
      "C3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C3"
    ],
    "image": "/shots/items/jewelry_necklace_layered_butterfly_silver_01.jpg"
  },
  {
    "id": "jewelry_necklace_layered_rosary_pearl_key_01",
    "name": "Layered rosary, pearl and key necklaces",
    "slot": "jewelry",
    "subcategory": "necklace_layered",
    "style_tags": [
      "grunge",
      "gothic",
      "coquette"
    ],
    "colors": [
      "silver",
      "ivory"
    ],
    "materials": [
      "silver metal",
      "pearls"
    ],
    "patterns": [],
    "fit_silhouette": "four or five stacked strands of varying lengths",
    "details": [
      "rosary bead chain",
      "pearl strand",
      "small cross pendant",
      "antique skeleton key pendant"
    ],
    "styling_notes": "stacked over a shirt collar",
    "prompt": "layered antique silver necklaces stacked at the collar: rosary bead chain, pearl strand, small cross pendant and an ornate skeleton-key pendant",
    "negative": [],
    "source_images": [
      "B5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_B5"
    ],
    "image": "/shots/items/jewelry_necklace_layered_rosary_pearl_key_01.jpg"
  },
  {
    "id": "jewelry_necklace_layered_silver_chains_01",
    "name": "Layered silver chains",
    "slot": "jewelry",
    "subcategory": "necklace_layered",
    "style_tags": [
      "streetwear_90s",
      "y2k_streetwear",
      "grunge"
    ],
    "colors": [
      "silver"
    ],
    "materials": [
      "silver metal"
    ],
    "patterns": [],
    "fit_silhouette": "two or three chains at staggered lengths",
    "details": [
      "small pendant on the longest strand"
    ],
    "styling_notes": "",
    "prompt": "two or three layered silver chain necklaces at staggered lengths, small pendant on the longest",
    "negative": [],
    "source_images": [
      "D3",
      "F2",
      "F3",
      "H3"
    ],
    "render_style_seen": "both",
    "outfit_ids": [
      "outfit_D3_left",
      "outfit_F2",
      "outfit_F3",
      "outfit_H3"
    ],
    "image": "/shots/items/jewelry_necklace_layered_silver_chains_01.jpg"
  },
  {
    "id": "jewelry_necklace_medallion_gold_01",
    "name": "Gold medallion chain",
    "slot": "jewelry",
    "subcategory": "necklace",
    "style_tags": [
      "uk_drill",
      "hip_hop_2000s"
    ],
    "colors": [
      "gold"
    ],
    "materials": [
      "gold metal"
    ],
    "patterns": [],
    "fit_silhouette": "medium chain with round pendant",
    "details": [
      "round gold coin medallion"
    ],
    "styling_notes": "",
    "prompt": "gold chain necklace with a round coin medallion pendant",
    "negative": [],
    "source_images": [
      "I4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I4"
    ],
    "image": "/shots/items/jewelry_necklace_medallion_gold_01.jpg"
  },
  {
    "id": "jewelry_necklace_thin_chain_silver_01",
    "name": "Thin silver chain necklace",
    "slot": "jewelry",
    "subcategory": "necklace",
    "style_tags": [
      "minimal_basics",
      "streetwear_90s"
    ],
    "colors": [
      "silver"
    ],
    "materials": [
      "silver metal"
    ],
    "patterns": [],
    "fit_silhouette": "single fine chain at the collarbone",
    "details": [],
    "styling_notes": "",
    "prompt": "single fine silver chain necklace resting at the collarbone",
    "negative": [],
    "source_images": [
      "D2",
      "E1",
      "E3",
      "F4",
      "F6"
    ],
    "render_style_seen": "both",
    "outfit_ids": [
      "outfit_D2_left",
      "outfit_E1",
      "outfit_E3_left",
      "outfit_F4",
      "outfit_F6"
    ],
    "image": "/shots/items/jewelry_necklace_thin_chain_silver_01.jpg"
  },
  {
    "id": "jewelry_necklace_thin_gold_pendant_01",
    "name": "Thin gold pendant necklace",
    "slot": "jewelry",
    "subcategory": "necklace",
    "style_tags": [
      "streetwear_90s",
      "minimal_basics"
    ],
    "colors": [
      "gold"
    ],
    "materials": [
      "gold metal"
    ],
    "patterns": [],
    "fit_silhouette": "delicate short chain",
    "details": [
      "tiny pendant"
    ],
    "styling_notes": "",
    "prompt": "delicate thin gold chain necklace with a tiny pendant resting at the collarbone",
    "negative": [],
    "source_images": [
      "C4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_C4"
    ],
    "image": "/shots/items/jewelry_necklace_thin_gold_pendant_01.jpg"
  },
  {
    "id": "jewelry_rings_silver_01",
    "name": "Silver rings",
    "slot": "jewelry",
    "subcategory": "rings",
    "style_tags": [
      "streetwear_90s",
      "rock_moto"
    ],
    "colors": [
      "silver"
    ],
    "materials": [
      "silver metal"
    ],
    "patterns": [],
    "fit_silhouette": "a few bands on the fingers",
    "details": [],
    "styling_notes": "",
    "prompt": "a few chunky silver rings on the fingers",
    "negative": [],
    "source_images": [
      "F3",
      "G2",
      "I4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F3",
      "outfit_G2",
      "outfit_I4"
    ],
    "image": "/shots/items/jewelry_rings_silver_01.jpg"
  },
  {
    "id": "neckwear_choker_cord_thin_black_01",
    "name": "Thin black cord choker",
    "slot": "neckwear",
    "subcategory": "choker",
    "style_tags": [
      "y2k_streetwear",
      "streetwear_90s",
      "grunge"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "cord"
    ],
    "patterns": [],
    "fit_silhouette": "thin cord snug at the neck",
    "details": [],
    "styling_notes": "",
    "prompt": "thin black cord choker worn snug around the neck",
    "negative": [],
    "source_images": [
      "D2",
      "G5",
      "D3"
    ],
    "render_style_seen": "both",
    "outfit_ids": [
      "outfit_D2_right",
      "outfit_D3_left",
      "outfit_G5"
    ],
    "image": "/shots/items/neckwear_choker_cord_thin_black_01.jpg"
  },
  {
    "id": "neckwear_choker_ribbon_bow_black_01",
    "name": "Black ribbon bow choker",
    "slot": "neckwear",
    "subcategory": "choker",
    "style_tags": [
      "coquette",
      "gothic_lolita"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "satin ribbon"
    ],
    "patterns": [],
    "fit_silhouette": "thin ribbon tied snugly around the neck",
    "details": [
      "front bow with long tails falling to the chest"
    ],
    "styling_notes": "worn with a ruffled blouse",
    "prompt": "thin black satin ribbon tied snug around the neck as a choker, small bow at the front with two long tails falling down the chest",
    "negative": [],
    "source_images": [
      "A5"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A5"
    ],
    "image": "/shots/items/neckwear_choker_ribbon_bow_black_01.jpg"
  },
  {
    "id": "neckwear_choker_velvet_heart_pink_01",
    "name": "Pink velvet heart choker",
    "slot": "neckwear",
    "subcategory": "choker",
    "style_tags": [
      "coquette",
      "y2k",
      "kawaii"
    ],
    "colors": [
      "dusty pink",
      "silver"
    ],
    "materials": [
      "velvet"
    ],
    "patterns": [],
    "fit_silhouette": "snug velvet band",
    "details": [
      "small silver heart charm at center"
    ],
    "styling_notes": "worn with layered silver chains",
    "prompt": "dusty pink velvet ribbon choker with a small silver heart charm at the center",
    "negative": [],
    "source_images": [
      "C3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C3"
    ],
    "image": "/shots/items/neckwear_choker_velvet_heart_pink_01.jpg"
  },
  {
    "id": "neckwear_collar_ribbon_tie_brown_01",
    "name": "Brown collar with skinny ribbon bow tie",
    "slot": "neckwear",
    "subcategory": "collar_ribbon",
    "style_tags": [
      "dark_academia",
      "preppy",
      "kawaii"
    ],
    "colors": [
      "dark chocolate brown"
    ],
    "materials": [
      "cotton twill",
      "satin ribbon"
    ],
    "patterns": [],
    "fit_silhouette": "pointed shirt collar peeking above a crew neck, long narrow ribbon hanging to mid-torso",
    "details": [
      "sharp pointed collar tips",
      "thin ribbon tied in a small bow with long trailing tails"
    ],
    "styling_notes": "collar sits over the neckline of a striped tee",
    "prompt": "dark chocolate brown pointed shirt collar with a long skinny brown satin ribbon tied in a small bow at the throat, tails hanging down the chest",
    "negative": [],
    "source_images": [
      "A1"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A1"
    ],
    "image": "/shots/items/neckwear_collar_ribbon_tie_brown_01.jpg"
  },
  {
    "id": "neckwear_necktie_stripe_brown_01",
    "name": "Brown striped necktie",
    "slot": "neckwear",
    "subcategory": "necktie",
    "style_tags": [
      "dark_academia",
      "preppy",
      "grunge"
    ],
    "colors": [
      "chocolate brown",
      "gold"
    ],
    "materials": [
      "silk"
    ],
    "patterns": [
      "diagonal stripes"
    ],
    "fit_silhouette": "standard tie worn loose under an open collar",
    "details": [
      "thin gold diagonal stripes"
    ],
    "styling_notes": "knotted loosely, hanging over a sweater",
    "prompt": "chocolate brown silk necktie with thin gold diagonal repp stripes, knotted loosely and hanging over the sweater",
    "negative": [],
    "source_images": [
      "B5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_B5"
    ],
    "image": "/shots/items/neckwear_necktie_stripe_brown_01.jpg"
  },
  {
    "id": "neckwear_scarf_plaid_fringe_camel_01",
    "name": "Camel plaid fringed scarf",
    "slot": "neckwear",
    "subcategory": "scarf",
    "style_tags": [
      "japanese_school",
      "dark_academia",
      "preppy"
    ],
    "colors": [
      "camel",
      "peach",
      "cream"
    ],
    "materials": [
      "brushed wool"
    ],
    "patterns": [
      "plaid"
    ],
    "fit_silhouette": "long wide scarf wrapped up over the chin with ends hanging",
    "details": [
      "long fringe tassels"
    ],
    "styling_notes": "pulled up to cover the mouth",
    "prompt": "long wide camel and peach plaid brushed-wool scarf wrapped high around the neck up over the chin, fringed ends hanging down the chest",
    "negative": [],
    "source_images": [
      "B4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B4"
    ],
    "image": "/shots/items/neckwear_scarf_plaid_fringe_camel_01.jpg"
  },
  {
    "id": "top_baby_tee_i_dont_smoke_cream_01",
    "name": "Cream baby tee with red slogan",
    "slot": "top",
    "subcategory": "tee",
    "style_tags": [
      "avant_garde_dark",
      "indie_sleaze",
      "luxury_street"
    ],
    "colors": [
      "cream",
      "brick red"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [
      "slogan text"
    ],
    "fit_silhouette": "tight shrunken short-sleeve tee",
    "details": [
      "red serif slogan I DON'T SMOKE across chest"
    ],
    "styling_notes": "worn tight with a bullet belt",
    "prompt": "tight shrunken cream cotton baby tee with I DON'T SMOKE printed in bold brick-red serif letters across the chest",
    "negative": [],
    "source_images": [
      "E5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E5"
    ],
    "image": "/shots/items/top_baby_tee_i_dont_smoke_cream_01.jpg"
  },
  {
    "id": "top_blouse_cascade_ruffle_white_01",
    "name": "White cascading ruffle blouse",
    "slot": "top",
    "subcategory": "blouse",
    "style_tags": [
      "coquette",
      "vintage_romantic"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "cotton voile"
    ],
    "patterns": [],
    "fit_silhouette": "loose, hip length with peplum, wide scoop neck",
    "details": [
      "tiers of cascading ruffles down the front",
      "ruffled shoulders",
      "balloon sleeves with frilled cuffs",
      "gathered peplum hem"
    ],
    "styling_notes": "worn untucked over jeans",
    "prompt": "soft white cotton blouse covered in tiers of cascading ruffles down the front, ruffled shoulders, voluminous balloon sleeves with frilled cuffs, gathered peplum hem",
    "negative": [],
    "source_images": [
      "A5"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A5"
    ],
    "image": "/shots/items/top_blouse_cascade_ruffle_white_01.jpg"
  },
  {
    "id": "top_blouse_oversized_round_collar_white_01",
    "name": "White oversized round-collar blouse",
    "slot": "top",
    "subcategory": "blouse",
    "style_tags": [
      "mori_girl",
      "dark_academia",
      "french_casual"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "cotton poplin"
    ],
    "patterns": [],
    "fit_silhouette": "loose oversized fit, dropped shoulders, puffy elbow-to-3/4 sleeves",
    "details": [
      "small rounded collar",
      "ruffled sleeve cuffs"
    ],
    "styling_notes": "tucked into a high-waisted plaid maxi skirt",
    "prompt": "oversized white cotton blouse with a small rounded collar, dropped shoulders, puffy three-quarter sleeves ending in ruffled cuffs, tucked in",
    "negative": [],
    "source_images": [
      "B3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B3"
    ],
    "image": "/shots/items/top_blouse_oversized_round_collar_white_01.jpg"
  },
  {
    "id": "top_blouse_puff_sleeve_collared_skyblue_01",
    "name": "Sky-blue puff-sleeve collared blouse",
    "slot": "top",
    "subcategory": "blouse",
    "style_tags": [
      "preppy",
      "japanese_school",
      "kawaii"
    ],
    "colors": [
      "pale sky blue"
    ],
    "materials": [
      "cotton poplin"
    ],
    "patterns": [],
    "fit_silhouette": "button-front shirt, big puffed long sleeves gathered into long fitted cuffs",
    "details": [
      "sharp pointed collar",
      "small buttons"
    ],
    "styling_notes": "worn under a sleeveless plaid pinafore",
    "prompt": "pale sky-blue cotton button-front blouse with a sharp pointed collar, very full puffed long sleeves gathered into long fitted cuffs",
    "negative": [],
    "source_images": [
      "B1"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B1"
    ],
    "image": "/shots/items/top_blouse_puff_sleeve_collared_skyblue_01.jpg"
  },
  {
    "id": "top_blouse_sheer_ruffle_blue_01",
    "name": "Pale blue sheer ruffle-neck blouse",
    "slot": "top",
    "subcategory": "blouse",
    "style_tags": [
      "coquette",
      "vintage_romantic",
      "classic_lolita"
    ],
    "colors": [
      "powder blue"
    ],
    "materials": [
      "sheer chiffon"
    ],
    "patterns": [],
    "fit_silhouette": "high ruffled neck, long voluminous balloon sleeves",
    "details": [
      "frilled stand collar",
      "semi-transparent sleeves",
      "ruffled wrist cuffs"
    ],
    "styling_notes": "worn under a pinafore so only neck and sleeves show",
    "prompt": "sheer powder-blue chiffon blouse with a high frilled stand collar, long translucent balloon sleeves gathered into ruffled cuffs at the wrists",
    "negative": [],
    "source_images": [
      "A2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A2"
    ],
    "image": "/shots/items/top_blouse_sheer_ruffle_blue_01.jpg"
  },
  {
    "id": "top_blouse_victorian_lace_bib_white_01",
    "name": "White Victorian lace bib blouse",
    "slot": "top",
    "subcategory": "blouse",
    "style_tags": [
      "gothic_lolita",
      "classic_lolita",
      "vintage_romantic"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "cotton",
      "eyelet lace"
    ],
    "patterns": [],
    "fit_silhouette": "loose bishop sleeves, high neck, tucked in",
    "details": [
      "high ruffled stand collar",
      "lace bib yoke over the chest",
      "ruffled shoulder caps",
      "front button placket",
      "eyelet lace ruffle cuffs"
    ],
    "styling_notes": "tucked into high-waisted bloomers with suspenders over the top",
    "prompt": "white Victorian cotton blouse with a high ruffled stand collar, wide lace bib yoke across the chest, ruffled shoulder flounces, full bishop sleeves ending in deep eyelet-lace ruffled cuffs",
    "negative": [],
    "source_images": [
      "A4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A4"
    ],
    "image": "/shots/items/top_blouse_victorian_lace_bib_white_01.jpg"
  },
  {
    "id": "top_bralette_lace_cross_chain_black_01",
    "name": "Black scalloped lace crop top with cross chains",
    "slot": "top",
    "subcategory": "bralette_top",
    "style_tags": [
      "gothic",
      "y2k",
      "punk"
    ],
    "colors": [
      "black",
      "silver"
    ],
    "materials": [
      "lace"
    ],
    "patterns": [],
    "fit_silhouette": "short cropped lace top",
    "details": [
      "scalloped lace edges",
      "silver chain straps",
      "small dangling cross charms"
    ],
    "styling_notes": "worn with the faux-leather micro skirt",
    "prompt": "black scalloped floral lace cropped top with thin silver chain straps and small dangling silver cross charms",
    "negative": [],
    "source_images": [
      "C1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C1"
    ],
    "image": "/shots/items/top_bralette_lace_cross_chain_black_01.jpg"
  },
  {
    "id": "top_bustier_stacked_belts_multicolor_01",
    "name": "Stacked painted-belt bustier",
    "slot": "top",
    "subcategory": "bustier",
    "style_tags": [
      "avant_garde_diy",
      "punk",
      "y2k"
    ],
    "colors": [
      "hot pink",
      "lime green",
      "cobalt",
      "yellow",
      "red",
      "orange",
      "lilac",
      "black"
    ],
    "materials": [
      "distressed painted leather",
      "metal buckles"
    ],
    "patterns": [
      "multicolor"
    ],
    "fit_silhouette": "about fifteen belts buckled tightly one above another from bust to hips forming a strapless top",
    "details": [
      "each belt a different color with cracked paint",
      "tarnished buckles",
      "O-rings and grommets",
      "one belt tail hanging down the front"
    ],
    "styling_notes": "worn as the entire top layer",
    "prompt": "strapless bustier built from about fifteen distressed painted leather belts stacked tightly from bust to hips, hot pink, lime, cobalt, yellow, red, lilac and black, tarnished buckles and grommets",
    "negative": [],
    "source_images": [
      "C2"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C2"
    ],
    "image": "/shots/items/top_bustier_stacked_belts_multicolor_01.jpg"
  },
  {
    "id": "top_cami_floral_lace_bow_cream_01",
    "name": "Cream ditsy floral lace cami",
    "slot": "top",
    "subcategory": "cami",
    "style_tags": [
      "coquette",
      "y2k"
    ],
    "colors": [
      "cream",
      "dusty pink"
    ],
    "materials": [
      "rib knit cotton",
      "lace"
    ],
    "patterns": [
      "ditsy floral"
    ],
    "fit_silhouette": "fitted cropped camisole with thin straps",
    "details": [
      "lace trim along the neckline",
      "pink ribbon bow at center front",
      "ruched center"
    ],
    "styling_notes": "cropped above the skirt",
    "prompt": "fitted cropped cream rib-knit camisole with a tiny pink ditsy floral print, lace-trimmed sweetheart neckline, thin straps and a pink ribbon bow at center front",
    "negative": [],
    "source_images": [
      "C3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C3"
    ],
    "image": "/shots/items/top_cami_floral_lace_bow_cream_01.jpg"
  },
  {
    "id": "top_knit_puff_sleeve_peter_pan_red_01",
    "name": "Red ribbed knit top with lace Peter Pan collar",
    "slot": "top",
    "subcategory": "knit_top",
    "style_tags": [
      "coquette",
      "vintage_romantic",
      "kawaii"
    ],
    "colors": [
      "tomato red",
      "white"
    ],
    "materials": [
      "rib knit",
      "lace"
    ],
    "patterns": [],
    "fit_silhouette": "fitted short top, short puff sleeves, tucked into a high waist",
    "details": [
      "white Peter Pan collar edged with scalloped lace",
      "vertical ribbing"
    ],
    "styling_notes": "tucked into a high-waisted maxi skirt",
    "prompt": "fitted tomato-red vertical rib-knit short-sleeve top with puffed sleeves and a rounded white Peter Pan collar trimmed in scalloped lace",
    "negative": [],
    "source_images": [
      "A3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A3"
    ],
    "image": "/shots/items/top_knit_puff_sleeve_peter_pan_red_01.jpg"
  },
  {
    "id": "top_longsleeve_breton_stripe_bw_01",
    "name": "Black and white striped long-sleeve tee",
    "slot": "top",
    "subcategory": "long_sleeve_tee",
    "style_tags": [
      "french_casual",
      "preppy",
      "minimal_basics"
    ],
    "colors": [
      "black",
      "white"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [
      "horizontal stripes"
    ],
    "fit_silhouette": "regular fit, crew neck, long sleeves",
    "details": [
      "bold even-width horizontal stripes about 1 inch wide"
    ],
    "styling_notes": "layered under a collared shirt collar with a ribbon tie",
    "prompt": "fitted long-sleeve cotton jersey top with bold even black and white horizontal Breton stripes, about one inch wide, crew neckline",
    "negative": [],
    "source_images": [
      "A1"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A1"
    ],
    "image": "/shots/items/top_longsleeve_breton_stripe_bw_01.jpg"
  },
  {
    "id": "top_longsleeve_sheer_jersey_pink_01",
    "name": "Bubblegum pink sheer long-sleeve tee",
    "slot": "top",
    "subcategory": "long_sleeve_tee",
    "style_tags": [
      "avant_garde_dark",
      "avant_garde_rick"
    ],
    "colors": [
      "bubblegum pink"
    ],
    "materials": [
      "sheer fine jersey"
    ],
    "patterns": [],
    "fit_silhouette": "slim fit, extra long sleeves bunching at the wrists",
    "details": [
      "semi-sheer",
      "raw lightweight hand"
    ],
    "styling_notes": "worn with coated jeans and platform sneakers",
    "prompt": "slim bubblegum pink sheer fine jersey long-sleeve tee with extra long sleeves bunching at the wrists",
    "negative": [],
    "source_images": [
      "H3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_H3"
    ],
    "image": "/shots/items/top_longsleeve_sheer_jersey_pink_01.jpg"
  },
  {
    "id": "top_polo_raglan_crop_white_green_01",
    "name": "White and green cropped raglan polo",
    "slot": "top",
    "subcategory": "polo",
    "style_tags": [
      "preppy",
      "sportswear",
      "y2k_streetwear"
    ],
    "colors": [
      "white",
      "forest green"
    ],
    "materials": [
      "pique cotton"
    ],
    "patterns": [
      "colorblock"
    ],
    "fit_silhouette": "fitted cropped above the navel, short raglan sleeves",
    "details": [
      "forest green raglan sleeves and collar",
      "white stripe along the sleeves",
      "short button placket"
    ],
    "styling_notes": "worn with a matching green pleated skirt",
    "prompt": "fitted cropped white polo shirt with forest green raglan short sleeves, green collar, a thin white stripe along the sleeves and a short button placket",
    "negative": [],
    "source_images": [
      "D2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D2_right"
    ],
    "image": "/shots/items/top_polo_raglan_crop_white_green_01.jpg"
  },
  {
    "id": "top_ringer_baby_tee_magical_script_white_01",
    "name": "White ringer baby tee with pink script",
    "slot": "top",
    "subcategory": "crop_tee",
    "style_tags": [
      "y2k_streetwear",
      "y2k",
      "kawaii"
    ],
    "colors": [
      "white",
      "hot pink",
      "black"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [
      "script text"
    ],
    "fit_silhouette": "fitted cropped baby tee",
    "details": [
      "black ringer collar",
      "pink script word 'Magical' across chest with a small gold sparkle"
    ],
    "styling_notes": "worn under an off-shoulder hoodie",
    "prompt": "fitted cropped white ringer baby tee with black trim and the word Magical in hot-pink cursive script across the chest with a tiny gold sparkle",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_right"
    ],
    "image": "/shots/items/top_ringer_baby_tee_magical_script_white_01.jpg"
  },
  {
    "id": "top_ringer_crop_tee_starburst_navy_01",
    "name": "Navy ringer crop tee with starburst",
    "slot": "top",
    "subcategory": "crop_tee",
    "style_tags": [
      "streetwear_90s",
      "y2k_streetwear"
    ],
    "colors": [
      "navy",
      "white",
      "teal",
      "coral"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [
      "graphic"
    ],
    "fit_silhouette": "fitted cropped above the navel, short sleeves",
    "details": [
      "white ringer trim at neck and sleeves",
      "teal and coral starburst graphic on chest"
    ],
    "styling_notes": "worn with very baggy jeans",
    "prompt": "fitted navy cropped ringer tee with white contrast trim on the collar and sleeve hems, a teal and coral starburst graphic on the chest",
    "negative": [],
    "source_images": [
      "C4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_C4"
    ],
    "image": "/shots/items/top_ringer_crop_tee_starburst_navy_01.jpg"
  },
  {
    "id": "top_sweater_cable_knit_cream_01",
    "name": "Cream cable-knit crewneck sweater",
    "slot": "top",
    "subcategory": "sweater",
    "style_tags": [
      "avant_garde_dark",
      "minimal_basics",
      "luxury_street"
    ],
    "colors": [
      "cream"
    ],
    "materials": [
      "chunky wool"
    ],
    "patterns": [
      "cable knit"
    ],
    "fit_silhouette": "relaxed crewneck",
    "details": [
      "vertical cable patterns",
      "ribbed hem"
    ],
    "styling_notes": "",
    "prompt": "relaxed cream chunky cable-knit wool crewneck sweater with raised vertical cables, ribbed collar, cuffs and hem",
    "negative": [],
    "source_images": [
      "E4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E4"
    ],
    "image": "/shots/items/top_sweater_cable_knit_cream_01.jpg"
  },
  {
    "id": "top_sweater_fine_knit_camel_01",
    "name": "Camel fine-knit crewneck",
    "slot": "top",
    "subcategory": "sweater",
    "style_tags": [
      "minimal_basics",
      "dark_academia",
      "leather_tailoring"
    ],
    "colors": [
      "camel khaki"
    ],
    "materials": [
      "fine wool knit"
    ],
    "patterns": [],
    "fit_silhouette": "slim crewneck, long sleeves",
    "details": [],
    "styling_notes": "",
    "prompt": "slim camel khaki fine-gauge wool crewneck sweater, smooth flat knit, long fitted sleeves, ribbed cuffs and hem",
    "negative": [],
    "source_images": [
      "G5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G5"
    ],
    "image": "/shots/items/top_sweater_fine_knit_camel_01.jpg"
  },
  {
    "id": "top_sweater_mohair_deep_v_pink_01",
    "name": "Pink fuzzy open-knit deep-V sweater",
    "slot": "top",
    "subcategory": "sweater",
    "style_tags": [
      "coquette",
      "grunge",
      "y2k"
    ],
    "colors": [
      "dusty pink"
    ],
    "materials": [
      "mohair-blend loose knit"
    ],
    "patterns": [
      "pointelle"
    ],
    "fit_silhouette": "oversized slouchy fit, very wide deep V neckline, long sleeves past the wrists",
    "details": [
      "fuzzy halo texture",
      "loose see-through knit with ladder holes",
      "rib panels"
    ],
    "styling_notes": "layered over a collared shirt and tie",
    "prompt": "oversized dusty-pink fuzzy mohair sweater in a loose see-through open knit with ladder holes, very wide plunging V neckline, long slouchy sleeves",
    "negative": [],
    "source_images": [
      "B5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_B5"
    ],
    "image": "/shots/items/top_sweater_mohair_deep_v_pink_01.jpg"
  },
  {
    "id": "top_sweater_varsity_stripe_orange_01",
    "name": "Orange varsity-stripe knit sweater",
    "slot": "top",
    "subcategory": "sweater",
    "style_tags": [
      "preppy_sport",
      "streetwear_90s",
      "luxury_street"
    ],
    "colors": [
      "bright orange",
      "chocolate brown",
      "white"
    ],
    "materials": [
      "chunky wool knit"
    ],
    "patterns": [
      "varsity stripes"
    ],
    "fit_silhouette": "boxy crewneck, slightly cropped at the hip",
    "details": [
      "brown and white vertical stripes running down shoulders and sleeves",
      "large brown chenille letters across chest",
      "ribbed collar and cuffs"
    ],
    "styling_notes": "worn untucked with coated jeans",
    "prompt": "boxy bright orange chunky knit crewneck sweater with brown and white football-jersey stripes down the shoulders and sleeves and big brown felt letters across the chest",
    "negative": [],
    "source_images": [
      "E2"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E2"
    ],
    "image": "/shots/items/top_sweater_varsity_stripe_orange_01.jpg"
  },
  {
    "id": "top_sweater_vneck_long_pink_01",
    "name": "Pink V-neck school sweater",
    "slot": "top",
    "subcategory": "sweater",
    "style_tags": [
      "japanese_school",
      "kawaii",
      "preppy"
    ],
    "colors": [
      "salmon pink"
    ],
    "materials": [
      "fine rib knit"
    ],
    "patterns": [],
    "fit_silhouette": "long loose fit reaching the hips, sleeves extending past the blazer cuffs",
    "details": [
      "ribbed hem",
      "V neckline"
    ],
    "styling_notes": "worn under a blazer, hem peeking below it",
    "prompt": "salmon-pink fine rib-knit V-neck school sweater, long and loose, ribbed hem showing below the blazer and sleeves peeking out over the hands",
    "negative": [],
    "source_images": [
      "B4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B4"
    ],
    "image": "/shots/items/top_sweater_vneck_long_pink_01.jpg"
  },
  {
    "id": "top_sweatshirt_crew_script_heather_gray_01",
    "name": "Heather gray script-logo crewneck sweatshirt",
    "slot": "top",
    "subcategory": "sweatshirt",
    "style_tags": [
      "uk_drill",
      "sportswear",
      "streetwear_90s"
    ],
    "colors": [
      "heather gray",
      "white"
    ],
    "materials": [
      "fleece"
    ],
    "patterns": [],
    "fit_silhouette": "relaxed crewneck sweatshirt",
    "details": [
      "small white script logo embroidered on chest",
      "ribbed cuffs and hem"
    ],
    "styling_notes": "white tee peeking below the hem",
    "prompt": "relaxed heather gray fleece crewneck sweatshirt with a small white script logo embroidered on the chest, white tee hem peeking out",
    "negative": [],
    "source_images": [
      "H5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_H5"
    ],
    "image": "/shots/items/top_sweatshirt_crew_script_heather_gray_01.jpg"
  },
  {
    "id": "top_tank_ribbed_cross_logo_black_01",
    "name": "Black ribbed tank with silver cross logo",
    "slot": "top",
    "subcategory": "tank",
    "style_tags": [
      "luxury_street",
      "avant_garde_dark",
      "gothic"
    ],
    "colors": [
      "black",
      "silver"
    ],
    "materials": [
      "rib knit cotton"
    ],
    "patterns": [],
    "fit_silhouette": "fitted, deep armholes",
    "details": [
      "small silver gothic cross logo on chest"
    ],
    "styling_notes": "worn with wide drawstring pants",
    "prompt": "fitted black ribbed cotton tank top with a small silver gothic cross logo embroidered on the chest",
    "negative": [],
    "source_images": [
      "E3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E3_right"
    ],
    "image": "/shots/items/top_tank_ribbed_cross_logo_black_01.jpg"
  },
  {
    "id": "top_tank_ribbed_heather_gray_01",
    "name": "Heather gray ribbed tank",
    "slot": "top",
    "subcategory": "tank",
    "style_tags": [
      "uk_drill",
      "sportswear",
      "minimal_basics"
    ],
    "colors": [
      "heather gray"
    ],
    "materials": [
      "rib knit"
    ],
    "patterns": [],
    "fit_silhouette": "relaxed tank top",
    "details": [
      "small tonal script chest logo"
    ],
    "styling_notes": "tucked into cargo pants",
    "prompt": "relaxed heather gray ribbed tank top with a small tonal script logo on the chest",
    "negative": [],
    "source_images": [
      "I4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I4"
    ],
    "image": "/shots/items/top_tank_ribbed_heather_gray_01.jpg"
  },
  {
    "id": "top_tank_ribbed_white_01",
    "name": "White ribbed A-shirt tank",
    "slot": "top",
    "subcategory": "tank",
    "style_tags": [
      "americana",
      "minimal_basics",
      "vintage_workwear"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "rib knit cotton"
    ],
    "patterns": [],
    "fit_silhouette": "fitted classic A-shirt",
    "details": [],
    "styling_notes": "tucked into belted jeans",
    "prompt": "classic white ribbed cotton A-shirt tank top, fitted, tucked in",
    "negative": [],
    "source_images": [
      "F5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F5"
    ],
    "image": "/shots/items/top_tank_ribbed_white_01.jpg"
  },
  {
    "id": "top_tank_scoop_black_01",
    "name": "Black scoop-neck fitted tank",
    "slot": "top",
    "subcategory": "tank",
    "style_tags": [
      "minimal_basics",
      "preppy_90s"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "stretch jersey"
    ],
    "patterns": [],
    "fit_silhouette": "fitted, low scoop neckline",
    "details": [],
    "styling_notes": "under a cropped jacket",
    "prompt": "fitted black stretch jersey tank top with a low scoop neckline",
    "negative": [],
    "source_images": [
      "D1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_D1"
    ],
    "image": "/shots/items/top_tank_scoop_black_01.jpg"
  },
  {
    "id": "top_tee_boxy_flag_spikes_black_01",
    "name": "Black boxy tee with spiked flag print",
    "slot": "top",
    "subcategory": "tee",
    "style_tags": [
      "punk",
      "grunge",
      "luxury_street"
    ],
    "colors": [
      "faded black",
      "red",
      "white"
    ],
    "materials": [
      "washed cotton"
    ],
    "patterns": [
      "airbrush graphic"
    ],
    "fit_silhouette": "boxy cropped wide tee with raw cut neckline",
    "details": [
      "airbrushed blurry American flag covered in spikes with a white spike-burst halo",
      "AMERICAN SABOTAGE text below"
    ],
    "styling_notes": "",
    "prompt": "faded black boxy cropped tee with a raw-cut neckline and a blurry airbrushed American flag graphic covered in spikes, white spike halo, AMERICAN SABOTAGE text below",
    "negative": [],
    "source_images": [
      "I2"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I2"
    ],
    "image": "/shots/items/top_tee_boxy_flag_spikes_black_01.jpg"
  },
  {
    "id": "top_tee_crew_black_01",
    "name": "Black crew tee",
    "slot": "top",
    "subcategory": "tee",
    "style_tags": [
      "minimal_basics",
      "avant_garde_dark"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [],
    "fit_silhouette": "regular crew neck tee",
    "details": [],
    "styling_notes": "base layer under jackets",
    "prompt": "plain black cotton jersey crew-neck t-shirt, regular fit, smooth matte finish, no graphics",
    "negative": [],
    "source_images": [
      "E1",
      "F3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E1",
      "outfit_F3"
    ],
    "image": "/shots/items/top_tee_crew_black_01.jpg"
  },
  {
    "id": "top_tee_crew_heather_oatmeal_01",
    "name": "Heather oatmeal crew tee",
    "slot": "top",
    "subcategory": "tee",
    "style_tags": [
      "minimal_basics"
    ],
    "colors": [
      "heather oatmeal"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [],
    "fit_silhouette": "regular crew tee",
    "details": [],
    "styling_notes": "",
    "prompt": "heather oatmeal light gray soft cotton crew-neck tee, regular fit, plain, worn under a leather jacket",
    "negative": [],
    "source_images": [
      "G4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G4"
    ],
    "image": "/shots/items/top_tee_crew_heather_oatmeal_01.jpg"
  },
  {
    "id": "top_tee_fitted_faded_graphic_cream_01",
    "name": "Cream fitted faded-print tee",
    "slot": "top",
    "subcategory": "tee",
    "style_tags": [
      "vintage_workwear",
      "minimal_basics",
      "americana"
    ],
    "colors": [
      "cream",
      "faded gray"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [
      "faded graphic"
    ],
    "fit_silhouette": "slim fitted crew tee",
    "details": [
      "sun-faded chest print"
    ],
    "styling_notes": "tucked into jeans",
    "prompt": "slim fitted cream cotton crew tee with a faded, barely-there chest graphic, tucked in",
    "negative": [],
    "source_images": [
      "E3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E3_left"
    ],
    "image": "/shots/items/top_tee_fitted_faded_graphic_cream_01.jpg"
  },
  {
    "id": "top_tee_graphic_text_white_01",
    "name": "White graphic text tee",
    "slot": "top",
    "subcategory": "tee",
    "style_tags": [
      "streetwear_90s",
      "minimal_basics"
    ],
    "colors": [
      "white",
      "black"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [
      "text graphic"
    ],
    "fit_silhouette": "regular crew tee",
    "details": [
      "large black text print on front"
    ],
    "styling_notes": "under an open camp shirt",
    "prompt": "white cotton crew tee with large bold black text printed on the front",
    "negative": [],
    "source_images": [
      "H4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_H4"
    ],
    "image": "/shots/items/top_tee_graphic_text_white_01.jpg"
  },
  {
    "id": "top_tee_japanese_text_offwhite_01",
    "name": "Off-white tee with bold Japanese text",
    "slot": "top",
    "subcategory": "tee",
    "style_tags": [
      "harajuku_street",
      "minimal_basics"
    ],
    "colors": [
      "off-white",
      "black"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [
      "text graphic"
    ],
    "fit_silhouette": "fitted short-sleeve crew tee, slightly cropped",
    "details": [
      "bold black brush-style Japanese characters across chest"
    ],
    "styling_notes": "tucked loosely at low-rise jeans",
    "prompt": "fitted off-white short-sleeve crew tee with bold thick black Japanese text characters printed across the chest",
    "negative": [],
    "source_images": [
      "C5"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_C5"
    ],
    "image": "/shots/items/top_tee_japanese_text_offwhite_01.jpg"
  },
  {
    "id": "top_tee_long_white_01",
    "name": "White long-line tee",
    "slot": "top",
    "subcategory": "tee",
    "style_tags": [
      "streetwear_90s",
      "minimal_basics"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [],
    "fit_silhouette": "long hip-length tee",
    "details": [],
    "styling_notes": "",
    "prompt": "plain white long-line cotton crew tee falling past the hips",
    "negative": [],
    "source_images": [
      "F4",
      "I3",
      "H5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F4",
      "outfit_H5",
      "outfit_I3_green"
    ],
    "image": "/shots/items/top_tee_long_white_01.jpg"
  },
  {
    "id": "top_tee_mesh_oversized_black_01",
    "name": "Black oversized mesh tee",
    "slot": "top",
    "subcategory": "tee",
    "style_tags": [
      "streetwear_90s",
      "sportswear",
      "grunge"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "athletic mesh jersey"
    ],
    "patterns": [],
    "fit_silhouette": "boxy oversized short-sleeve",
    "details": [
      "slight sheen"
    ],
    "styling_notes": "layered over a white long-sleeve tee",
    "prompt": "boxy oversized black athletic mesh short-sleeve tee layered over a white long-sleeve",
    "negative": [],
    "source_images": [
      "F2"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F2"
    ],
    "image": "/shots/items/top_tee_mesh_oversized_black_01.jpg"
  },
  {
    "id": "top_tee_oversized_black_01",
    "name": "Black oversized tee",
    "slot": "top",
    "subcategory": "tee",
    "style_tags": [
      "streetwear_90s",
      "minimal_basics"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "heavy cotton jersey"
    ],
    "patterns": [],
    "fit_silhouette": "boxy oversized short-sleeve",
    "details": [],
    "styling_notes": "",
    "prompt": "boxy oversized black heavy cotton t-shirt with dropped shoulders and sleeves past the elbow, plain, no graphics",
    "negative": [],
    "source_images": [
      "F6"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F6"
    ],
    "image": "/shots/items/top_tee_oversized_black_01.jpg"
  },
  {
    "id": "top_tee_oversized_collegiate_slate_01",
    "name": "Oversized slate collegiate tee",
    "slot": "top",
    "subcategory": "tee",
    "style_tags": [
      "streetwear_90s",
      "sportswear",
      "y2k_streetwear"
    ],
    "colors": [
      "slate teal gray",
      "white"
    ],
    "materials": [
      "heavy cotton jersey"
    ],
    "patterns": [
      "varsity text"
    ],
    "fit_silhouette": "very oversized, dropped shoulders, sleeves to the elbow",
    "details": [
      "white collegiate block lettering and number 07 across chest",
      "front half-tucked"
    ],
    "styling_notes": "half-tucked into bike shorts",
    "prompt": "very oversized slate teal-gray heavy cotton tee with white collegiate block lettering and the number 07 across the chest, dropped shoulders, front half-tucked",
    "negative": [],
    "source_images": [
      "D2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D2_left"
    ],
    "image": "/shots/items/top_tee_oversized_collegiate_slate_01.jpg"
  },
  {
    "id": "top_tee_vinyl_heart_print_white_01",
    "name": "White tee with vinyl-record heart print",
    "slot": "top",
    "subcategory": "tee",
    "style_tags": [
      "streetwear_90s",
      "minimal_basics"
    ],
    "colors": [
      "white",
      "black",
      "multicolor",
      "tan"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [
      "photo collage graphic"
    ],
    "fit_silhouette": "regular crew tee",
    "details": [
      "back print: heart shape made of stacked black vinyl records with colorful labels",
      "small record-shop logos and badges below"
    ],
    "styling_notes": "product flat lay, print on the back",
    "prompt": "white crew tee with a large back print of a heart made from overlapping black vinyl records with colorful center labels, small record-store logos and badges below",
    "negative": [],
    "source_images": [
      "I1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I1"
    ],
    "image": "/shots/items/top_tee_vinyl_heart_print_white_01.jpg"
  },
  {
    "id": "top_tube_bandeau_black_01",
    "name": "Black tube top",
    "slot": "top",
    "subcategory": "tube_top",
    "style_tags": [
      "y2k_streetwear",
      "y2k",
      "minimal_basics"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "stretch jersey"
    ],
    "patterns": [],
    "fit_silhouette": "strapless band across the bust",
    "details": [],
    "styling_notes": "peeks out under an open hoodie",
    "prompt": "simple black stretch jersey strapless tube top, smooth fitted band across the bust, peeking out from an open hoodie",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_left"
    ],
    "image": "/shots/items/top_tube_bandeau_black_01.jpg"
  },
  {
    "id": "layer_top_camp_shirt_bandana_red_01",
    "name": "Red bandana-print camp shirt",
    "slot": "layer_top",
    "subcategory": "camp_shirt",
    "style_tags": [
      "streetwear_90s",
      "western",
      "luxury_street"
    ],
    "colors": [
      "red",
      "coral",
      "white"
    ],
    "materials": [
      "rayon"
    ],
    "patterns": [
      "bandana paisley"
    ],
    "fit_silhouette": "boxy short-sleeve camp collar shirt",
    "details": [
      "red and white bandana paisley print on the lower body",
      "solid coral upper"
    ],
    "styling_notes": "worn open over a graphic tee",
    "prompt": "boxy short-sleeve red camp collar shirt with a red and white bandana paisley print across the lower half, worn open",
    "negative": [],
    "source_images": [
      "H4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_H4"
    ],
    "image": "/shots/items/layer_top_camp_shirt_bandana_red_01.jpg"
  },
  {
    "id": "layer_top_longsleeve_white_01",
    "name": "White long-sleeve under-tee",
    "slot": "layer_top",
    "subcategory": "long_sleeve_tee",
    "style_tags": [
      "streetwear_90s",
      "grunge",
      "minimal_basics"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [],
    "fit_silhouette": "fitted long sleeves visible under a short-sleeve tee",
    "details": [],
    "styling_notes": "sleeves showing below the short-sleeve layer",
    "prompt": "plain white long-sleeve cotton tee worn underneath, sleeves showing below a short-sleeve top",
    "negative": [],
    "source_images": [
      "F2"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F2"
    ],
    "image": "/shots/items/layer_top_longsleeve_white_01.jpg"
  },
  {
    "id": "layer_top_longsleeve_white_tee_g3_01",
    "name": "White long-sleeve tee",
    "slot": "layer_top",
    "subcategory": "long_sleeve_tee",
    "style_tags": [
      "streetwear_90s",
      "minimal_basics"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "cotton jersey"
    ],
    "patterns": [],
    "fit_silhouette": "regular long sleeves under a vest",
    "details": [],
    "styling_notes": "",
    "prompt": "plain white cotton long-sleeve tee worn under a vest",
    "negative": [],
    "source_images": [
      "G3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G3"
    ],
    "image": "/shots/items/layer_top_longsleeve_white_tee_g3_01.jpg"
  },
  {
    "id": "layer_top_shirt_pintuck_collared_white_01",
    "name": "White pintuck collared shirt",
    "slot": "layer_top",
    "subcategory": "shirt",
    "style_tags": [
      "dark_academia",
      "preppy",
      "grunge"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "cotton poplin"
    ],
    "patterns": [
      "pintucks"
    ],
    "fit_silhouette": "classic button shirt worn under a sweater, hem showing",
    "details": [
      "fine vertical pintucks on the front",
      "pointed collar"
    ],
    "styling_notes": "collar out over the sweater, shirttail hanging below",
    "prompt": "crisp white cotton collared shirt with fine vertical pintuck pleats down the front, pointed collar spread over a sweater, shirttail peeking out at the hem",
    "negative": [],
    "source_images": [
      "B5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_B5"
    ],
    "image": "/shots/items/layer_top_shirt_pintuck_collared_white_01.jpg"
  },
  {
    "id": "outerwear_blazer_leather_black_01",
    "name": "Black leather blazer",
    "slot": "outerwear",
    "subcategory": "leather_blazer",
    "style_tags": [
      "leather_tailoring",
      "rock_moto",
      "avant_garde_dark"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "soft lambskin leather"
    ],
    "patterns": [],
    "fit_silhouette": "relaxed single-breasted blazer, hip length",
    "details": [
      "notch lapels",
      "soft worn sheen",
      "patch pockets"
    ],
    "styling_notes": "worn open over a black tee as a leather suit",
    "prompt": "relaxed black soft lambskin leather blazer with notch lapels, single-breasted, worn-in satin sheen, part of a matching leather suit",
    "negative": [],
    "source_images": [
      "E1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E1"
    ],
    "image": "/shots/items/outerwear_blazer_leather_black_01.jpg"
  },
  {
    "id": "outerwear_blazer_school_navy_01",
    "name": "Navy school blazer",
    "slot": "outerwear",
    "subcategory": "blazer",
    "style_tags": [
      "japanese_school",
      "preppy",
      "dark_academia"
    ],
    "colors": [
      "slate navy",
      "red"
    ],
    "materials": [
      "wool"
    ],
    "patterns": [],
    "fit_silhouette": "single-breasted, hip length, slightly boxy",
    "details": [
      "notched lapels",
      "small buttons on the cuffs",
      "red accent buttons"
    ],
    "styling_notes": "sleeves pushed so a sweater cuff peeks out",
    "prompt": "slate navy single-breasted Japanese school uniform blazer, notched lapels, hip length, small red buttons on the cuffs",
    "negative": [],
    "source_images": [
      "B4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B4"
    ],
    "image": "/shots/items/outerwear_blazer_school_navy_01.jpg"
  },
  {
    "id": "outerwear_cape_tulle_floral_applique_blush_01",
    "name": "Blush tulle floral cape",
    "slot": "outerwear",
    "subcategory": "cape",
    "style_tags": [
      "romantic_couture",
      "fairycore"
    ],
    "colors": [
      "blush",
      "dusty rose",
      "plum"
    ],
    "materials": [
      "sheer tulle",
      "embroidered lace"
    ],
    "patterns": [
      "floral embroidery"
    ],
    "fit_silhouette": "sheer drape from one shoulder pooling into a long floor train",
    "details": [
      "embroidered trailing flowers",
      "3D flower appliques",
      "scalloped lace edge"
    ],
    "styling_notes": "draped from one shoulder over the bodysuit",
    "prompt": "sheer blush tulle cape draped from one shoulder into a long pooling floor-length train, scattered embroidered vines and 3D pink flower appliques, scalloped lace edge",
    "negative": [],
    "source_images": [
      "D4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_D4"
    ],
    "image": "/shots/items/outerwear_cape_tulle_floral_applique_blush_01.jpg"
  },
  {
    "id": "outerwear_hoodie_crop_varsity_letters_teal_01",
    "name": "Teal cropped zip hoodie with pink varsity letters",
    "slot": "outerwear",
    "subcategory": "zip_hoodie",
    "style_tags": [
      "y2k_streetwear",
      "streetwear_90s"
    ],
    "colors": [
      "emerald teal",
      "pink",
      "white"
    ],
    "materials": [
      "fleece"
    ],
    "patterns": [
      "varsity letters"
    ],
    "fit_silhouette": "cropped boxy zip hoodie, drop shoulders",
    "details": [
      "large pink chenille-style varsity letters outlined in white across the front",
      "hood",
      "ribbed hem"
    ],
    "styling_notes": "half-zipped low over a black tube top",
    "prompt": "cropped emerald teal fleece zip hoodie with big pink varsity applique letters outlined in white across the chest, hood, ribbed hem, zipped halfway",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_left"
    ],
    "image": "/shots/items/outerwear_hoodie_crop_varsity_letters_teal_01.jpg"
  },
  {
    "id": "outerwear_hoodie_ribbon_bow_pink_01",
    "name": "Dusty pink bow-trim zip hoodie",
    "slot": "outerwear",
    "subcategory": "zip_hoodie",
    "style_tags": [
      "coquette",
      "y2k",
      "kawaii"
    ],
    "colors": [
      "dusty pink",
      "cream"
    ],
    "materials": [
      "soft rib knit"
    ],
    "patterns": [],
    "fit_silhouette": "cropped boxy zip hoodie, long full sleeves bunched at the wrist",
    "details": [
      "cream satin ribbon bows sewn in a row down each sleeve",
      "hood",
      "ribbed cuffs"
    ],
    "styling_notes": "worn open and slipped off the shoulders",
    "prompt": "cropped dusty pink soft knit zip-up hoodie with rows of small cream satin ribbon bows sewn down each sleeve, long bunched sleeves, worn open off the shoulders",
    "negative": [],
    "source_images": [
      "C3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C3"
    ],
    "image": "/shots/items/outerwear_hoodie_ribbon_bow_pink_01.jpg"
  },
  {
    "id": "outerwear_hoodie_zip_mustard_01",
    "name": "Mustard yellow zip hoodie",
    "slot": "outerwear",
    "subcategory": "zip_hoodie",
    "style_tags": [
      "streetwear_90s",
      "y2k_streetwear"
    ],
    "colors": [
      "mustard yellow"
    ],
    "materials": [
      "fleece"
    ],
    "patterns": [],
    "fit_silhouette": "oversized zip hoodie",
    "details": [
      "hood",
      "ribbed cuffs"
    ],
    "styling_notes": "worn slipped off the shoulders, arms crossed",
    "prompt": "oversized mustard yellow fleece zip hoodie worn open and slipped off the shoulders",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_right"
    ],
    "image": "/shots/items/outerwear_hoodie_zip_mustard_01.jpg"
  },
  {
    "id": "outerwear_jacket_cropped_patent_trucker_black_01",
    "name": "Black patent cropped trucker jacket",
    "slot": "outerwear",
    "subcategory": "leather_jacket",
    "style_tags": [
      "avant_garde_dark",
      "rock_moto",
      "indie_sleaze"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "crinkled patent leather"
    ],
    "patterns": [],
    "fit_silhouette": "short boxy trucker cut, cropped at the ribs",
    "details": [
      "point collar",
      "two flap chest pockets",
      "high wet-look shine with crinkles"
    ],
    "styling_notes": "hung up or worn open",
    "prompt": "cropped boxy black glossy crinkled patent leather trucker jacket with point collar, two flap chest pockets and button front",
    "negative": [],
    "source_images": [
      "E5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E5"
    ],
    "image": "/shots/items/outerwear_jacket_cropped_patent_trucker_black_01.jpg"
  },
  {
    "id": "outerwear_jacket_denim_trucker_dark_rinse_01",
    "name": "Dark rinse trucker jacket with copper buttons",
    "slot": "outerwear",
    "subcategory": "denim_jacket",
    "style_tags": [
      "streetwear_90s",
      "hip_hop_2000s",
      "americana"
    ],
    "colors": [
      "dark indigo",
      "copper"
    ],
    "materials": [
      "raw denim"
    ],
    "patterns": [],
    "fit_silhouette": "fitted trucker cut, waist length",
    "details": [
      "copper shank buttons",
      "two flap chest pockets",
      "small red embroidered chest logo",
      "contrast orange stitching"
    ],
    "styling_notes": "worn buttoned as a matching denim set",
    "prompt": "fitted dark-rinse raw indigo denim trucker jacket with copper buttons, two flap chest pockets, orange contrast stitching and a tiny red embroidered chest logo",
    "negative": [],
    "source_images": [
      "G1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G1"
    ],
    "image": "/shots/items/outerwear_jacket_denim_trucker_dark_rinse_01.jpg"
  },
  {
    "id": "outerwear_jacket_denim_trucker_medium_wash_01",
    "name": "Medium-wash denim trucker jacket",
    "slot": "outerwear",
    "subcategory": "denim_jacket",
    "style_tags": [
      "streetwear_90s",
      "americana",
      "grunge"
    ],
    "colors": [
      "medium blue denim"
    ],
    "materials": [
      "denim"
    ],
    "patterns": [],
    "fit_silhouette": "classic trucker cut at the waist",
    "details": [
      "faded worn wash",
      "chest flap pockets",
      "button front"
    ],
    "styling_notes": "worn open over a black tee",
    "prompt": "faded medium-wash denim trucker jacket, classic waist length, chest flap pockets, worn open",
    "negative": [],
    "source_images": [
      "F3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F3"
    ],
    "image": "/shots/items/outerwear_jacket_denim_trucker_medium_wash_01.jpg"
  },
  {
    "id": "outerwear_jacket_moto_biker_black_01",
    "name": "Black leather moto jacket",
    "slot": "outerwear",
    "subcategory": "leather_jacket",
    "style_tags": [
      "rock_moto",
      "minimal_basics"
    ],
    "colors": [
      "black",
      "silver"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "classic fitted biker cut at the waist",
    "details": [
      "asymmetric front zip",
      "snap-down notch lapels",
      "zip cuffs",
      "silver hardware"
    ],
    "styling_notes": "worn open over a heather tee",
    "prompt": "classic black leather moto biker jacket with asymmetric silver zip, snap-down lapels and zippered cuffs, worn open",
    "negative": [],
    "source_images": [
      "G4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G4"
    ],
    "image": "/shots/items/outerwear_jacket_moto_biker_black_01.jpg"
  },
  {
    "id": "outerwear_jacket_sherpa_lined_cropped_black_01",
    "name": "Black sherpa-lined cropped jacket",
    "slot": "outerwear",
    "subcategory": "work_jacket",
    "style_tags": [
      "streetwear_90s",
      "vintage_workwear"
    ],
    "colors": [
      "black",
      "heather gray"
    ],
    "materials": [
      "cotton canvas",
      "sherpa"
    ],
    "patterns": [],
    "fit_silhouette": "cropped boxy jacket worn off the shoulders",
    "details": [
      "gray fleece lining visible",
      "hood"
    ],
    "styling_notes": "slipped down to the elbows",
    "prompt": "cropped boxy black canvas jacket lined in gray sherpa fleece, hooded, worn slipped down off the shoulders",
    "negative": [],
    "source_images": [
      "F4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F4"
    ],
    "image": "/shots/items/outerwear_jacket_sherpa_lined_cropped_black_01.jpg"
  },
  {
    "id": "outerwear_jacket_sherpa_shaggy_cream_01",
    "name": "Cream shaggy sherpa jacket",
    "slot": "outerwear",
    "subcategory": "fleece_jacket",
    "style_tags": [
      "kawaii",
      "french_casual",
      "cozy_layered"
    ],
    "colors": [
      "cream",
      "ivory"
    ],
    "materials": [
      "curly sherpa fleece",
      "rib knit"
    ],
    "patterns": [],
    "fit_silhouette": "oversized boxy fit, dropped shoulders, hip length, wide balloon sleeves",
    "details": [
      "large notched shawl collar",
      "big curly-pile patch pockets",
      "cream rib-knit cuffs",
      "open front"
    ],
    "styling_notes": "worn open and slipping off one shoulder over a striped tee",
    "prompt": "oversized cream ivory shaggy curly sherpa fleece jacket, plush textured teddy pile, wide shawl collar, big patch pockets, dropped shoulders, voluminous sleeves ending in ribbed knit cuffs, worn open",
    "negative": [
      "smooth faux fur",
      "fitted cut",
      "zip front"
    ],
    "source_images": [
      "A1"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A1"
    ],
    "image": "/shots/items/outerwear_jacket_sherpa_shaggy_cream_01.jpg"
  },
  {
    "id": "outerwear_jacket_tweed_gingham_cropped_bw_01",
    "name": "Black and white gingham tweed cropped jacket",
    "slot": "outerwear",
    "subcategory": "tweed_jacket",
    "style_tags": [
      "preppy_90s",
      "coquette",
      "preppy"
    ],
    "colors": [
      "black",
      "white"
    ],
    "materials": [
      "boucle tweed"
    ],
    "patterns": [
      "gingham check"
    ],
    "fit_silhouette": "cropped boxy jacket at the waist, long sleeves",
    "details": [
      "solid black trim along edges and cuffs",
      "collarless open front",
      "small black buttons"
    ],
    "styling_notes": "worn open over a black tank",
    "prompt": "cropped boxy black and white gingham boucle tweed jacket, collarless, edged in solid black trim along the front and cuffs, worn open",
    "negative": [],
    "source_images": [
      "D1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_D1"
    ],
    "image": "/shots/items/outerwear_jacket_tweed_gingham_cropped_bw_01.jpg"
  },
  {
    "id": "outerwear_puffer_glossy_forest_green_01",
    "name": "Glossy forest green puffer",
    "slot": "outerwear",
    "subcategory": "puffer",
    "style_tags": [
      "uk_drill",
      "streetwear_90s"
    ],
    "colors": [
      "forest green",
      "yellow"
    ],
    "materials": [
      "glossy nylon",
      "down fill"
    ],
    "patterns": [],
    "fit_silhouette": "bulky hip-length puffer, high funnel collar",
    "details": [
      "fat horizontal baffles",
      "small yellow script chest logo"
    ],
    "styling_notes": "zipped up over a white tee with matching pants",
    "prompt": "bulky glossy forest green nylon puffer jacket with fat baffles, high funnel collar and a small yellow script logo on the chest",
    "negative": [],
    "source_images": [
      "I3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I3_green"
    ],
    "image": "/shots/items/outerwear_puffer_glossy_forest_green_01.jpg"
  },
  {
    "id": "outerwear_puffer_glossy_mustard_yellow_01",
    "name": "Glossy yellow puffer",
    "slot": "outerwear",
    "subcategory": "puffer",
    "style_tags": [
      "uk_drill",
      "streetwear_90s"
    ],
    "colors": [
      "golden yellow",
      "white"
    ],
    "materials": [
      "glossy nylon",
      "down fill"
    ],
    "patterns": [],
    "fit_silhouette": "bulky hip-length puffer, high collar",
    "details": [
      "fat baffles",
      "small white script chest logo",
      "elastic cuffs"
    ],
    "styling_notes": "with matching yellow puffer pants",
    "prompt": "bulky glossy golden yellow nylon puffer jacket with fat baffles, high collar, elastic cuffs and a small white script chest logo",
    "negative": [],
    "source_images": [
      "I3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I3_yellow"
    ],
    "image": "/shots/items/outerwear_puffer_glossy_mustard_yellow_01.jpg"
  },
  {
    "id": "outerwear_puffer_thermal_gradient_01",
    "name": "Thermal-gradient puffer jacket",
    "slot": "outerwear",
    "subcategory": "puffer",
    "style_tags": [
      "streetwear_90s",
      "luxury_street",
      "techwear"
    ],
    "colors": [
      "sky blue",
      "yellow",
      "orange",
      "magenta",
      "black"
    ],
    "materials": [
      "matte nylon",
      "down fill"
    ],
    "patterns": [
      "radial heatmap gradient"
    ],
    "fit_silhouette": "boxy hip-length puffer",
    "details": [
      "thermal-camera radial gradient: sky blue edges into yellow, orange, magenta and a black core at center chest",
      "stand collar with snaps",
      "snap placket",
      "horizontal baffles",
      "lower patch pockets",
      "elastic cuffs"
    ],
    "styling_notes": "product shot, flat lay",
    "prompt": "boxy hip-length matte nylon puffer jacket printed with a thermal-camera heatmap: sky blue edges fading to yellow, orange, magenta and a black core at the center chest, snap stand collar",
    "negative": [],
    "source_images": [
      "H1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_H1"
    ],
    "image": "/shots/items/outerwear_puffer_thermal_gradient_01.jpg"
  },
  {
    "id": "outerwear_track_jacket_royal_blue_stripe_01",
    "name": "Royal blue striped track jacket",
    "slot": "outerwear",
    "subcategory": "track_jacket",
    "style_tags": [
      "sportswear",
      "luxury_street",
      "streetwear_90s"
    ],
    "colors": [
      "royal blue",
      "yellow",
      "white"
    ],
    "materials": [
      "satin tricot"
    ],
    "patterns": [
      "sleeve stripes"
    ],
    "fit_silhouette": "relaxed zip track jacket, stand collar",
    "details": [
      "yellow and white piping along shoulders and sleeves",
      "striped cuffs",
      "white script logo embroidered on chest"
    ],
    "styling_notes": "worn open over a bare chest with chain",
    "prompt": "royal blue satin tricot track jacket with yellow and white piping along the shoulders and sleeves, striped cuffs and a white script logo embroidered on the chest, worn open",
    "negative": [],
    "source_images": [
      "G2"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G2"
    ],
    "image": "/shots/items/outerwear_track_jacket_royal_blue_stripe_01.jpg"
  },
  {
    "id": "outerwear_vest_leopard_utility_01",
    "name": "Leopard utility puffer vest",
    "slot": "outerwear",
    "subcategory": "vest",
    "style_tags": [
      "luxury_street",
      "streetwear_90s"
    ],
    "colors": [
      "tan",
      "brown",
      "black"
    ],
    "materials": [
      "fleece",
      "nylon"
    ],
    "patterns": [
      "leopard print"
    ],
    "fit_silhouette": "boxy hip-length puffer vest, high zip neck",
    "details": [
      "chest flap pockets",
      "woven tan label patches",
      "toggle drawcord hem"
    ],
    "styling_notes": "over a white long-sleeve, crossbody bag over it",
    "prompt": "boxy leopard print fleece utility puffer vest with high zip neck, chest flap pockets, woven tan logo label patches and toggle drawcord hem",
    "negative": [],
    "source_images": [
      "G3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G3"
    ],
    "image": "/shots/items/outerwear_vest_leopard_utility_01.jpg"
  },
  {
    "id": "outerwear_windbreaker_colorblock_navy_white_01",
    "name": "Navy and white oversized windbreaker",
    "slot": "outerwear",
    "subcategory": "track_jacket",
    "style_tags": [
      "streetwear_90s",
      "sportswear",
      "japanese_school"
    ],
    "colors": [
      "navy",
      "white"
    ],
    "materials": [
      "nylon"
    ],
    "patterns": [
      "colorblock"
    ],
    "fit_silhouette": "very oversized, hip length, huge balloon sleeves gathered at the wrist",
    "details": [
      "tall funnel neck zipped to the chin",
      "full front zip",
      "white curved shoulder panels",
      "small oval chest patch"
    ],
    "styling_notes": "zipped to the chin, sleeves swallowing the hands",
    "prompt": "very oversized navy nylon windbreaker with white curved shoulder panels, tall funnel neck zipped to the chin, small oval chest patch, huge balloon sleeves gathered at the wrists",
    "negative": [],
    "source_images": [
      "B2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B2"
    ],
    "image": "/shots/items/outerwear_windbreaker_colorblock_navy_white_01.jpg"
  },
  {
    "id": "dress_onepiece_corset_bodysuit_floral_lace_rose_01",
    "name": "Rose floral lace corset bodysuit",
    "slot": "dress_onepiece",
    "subcategory": "corset_bodysuit",
    "style_tags": [
      "romantic_couture",
      "coquette"
    ],
    "colors": [
      "dusty rose",
      "blush",
      "plum",
      "black"
    ],
    "materials": [
      "sheer tulle",
      "embroidered lace",
      "3D floral appliques"
    ],
    "patterns": [
      "floral embroidery"
    ],
    "fit_silhouette": "sculpted corset bodysuit with defined waist, balconette cups",
    "details": [
      "black boning channels and underwire outlines",
      "black waist band",
      "embroidered vines and 3D flower appliques",
      "adjustable black straps with gold sliders",
      "attached black garter straps"
    ],
    "styling_notes": "shown on a dress form as couture",
    "prompt": "couture dusty rose corset bodysuit in sheer blush tulle covered with embroidered vines and 3D plum and pink flower appliques, black boning lines, black waistband, thin black straps with gold sliders",
    "negative": [
      "cheap costume look"
    ],
    "source_images": [
      "D4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_D4"
    ],
    "image": "/shots/items/dress_onepiece_corset_bodysuit_floral_lace_rose_01.jpg"
  },
  {
    "id": "dress_onepiece_knit_sleeveless_mock_studded_black_01",
    "name": "Black studded mock-neck knit mini dress",
    "slot": "dress_onepiece",
    "subcategory": "knit_dress",
    "style_tags": [
      "indie_sleaze",
      "y2k",
      "gothic"
    ],
    "colors": [
      "black",
      "silver"
    ],
    "materials": [
      "rib knit"
    ],
    "patterns": [],
    "fit_silhouette": "fitted sleeveless mini, high mock neck",
    "details": [
      "silver stud trim around the neckline",
      "fine vertical ribbing"
    ],
    "styling_notes": "belted low at the hips",
    "prompt": "fitted black ribbed knit sleeveless mini dress with a high mock neck trimmed in small silver studs",
    "negative": [],
    "source_images": [
      "F1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F1"
    ],
    "image": "/shots/items/dress_onepiece_knit_sleeveless_mock_studded_black_01.jpg"
  },
  {
    "id": "dress_onepiece_tee_dress_ribbed_offwhite_01",
    "name": "Off-white ribbed tee mini dress",
    "slot": "dress_onepiece",
    "subcategory": "tee_dress",
    "style_tags": [
      "minimal_basics",
      "sportswear",
      "y2k"
    ],
    "colors": [
      "off-white"
    ],
    "materials": [
      "rib knit cotton"
    ],
    "patterns": [],
    "fit_silhouette": "body-skimming short-sleeve mini, crew neck",
    "details": [
      "fine vertical ribbing",
      "tiny chest logo"
    ],
    "styling_notes": "worn with slouch socks and chunky sneakers",
    "prompt": "body-skimming off-white fine rib-knit short-sleeve t-shirt mini dress, crew neck, tiny printed chest logo",
    "negative": [],
    "source_images": [
      "D5"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D5"
    ],
    "image": "/shots/items/dress_onepiece_tee_dress_ribbed_offwhite_01.jpg"
  },
  {
    "id": "dress_pinafore_maxi_ruffle_navy_01",
    "name": "Navy ruffle maxi pinafore dress",
    "slot": "dress_onepiece",
    "subcategory": "pinafore",
    "style_tags": [
      "vintage_romantic",
      "coquette",
      "mori_girl"
    ],
    "colors": [
      "deep navy"
    ],
    "materials": [
      "cotton crinkle gauze"
    ],
    "patterns": [],
    "fit_silhouette": "fitted bodice, thin straps, full gathered maxi skirt to the ankles",
    "details": [
      "ruffled square neckline",
      "seamed waist",
      "ruffle hem",
      "lots of soft drape"
    ],
    "styling_notes": "layered over a sheer blouse, skirt lifted at one side",
    "prompt": "deep navy crinkled cotton maxi pinafore dress, thin shoulder straps, ruffled square neckline, fitted bodice, very full gathered ankle-length skirt with a ruffled hem",
    "negative": [],
    "source_images": [
      "A2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A2"
    ],
    "image": "/shots/items/dress_pinafore_maxi_ruffle_navy_01.jpg"
  },
  {
    "id": "dress_pinafore_plaid_belted_coral_01",
    "name": "Coral plaid belted pinafore mini dress",
    "slot": "dress_onepiece",
    "subcategory": "pinafore",
    "style_tags": [
      "preppy",
      "japanese_school",
      "y2k"
    ],
    "colors": [
      "coral red",
      "pink",
      "white"
    ],
    "materials": [
      "wool-blend suiting"
    ],
    "patterns": [
      "tartan plaid"
    ],
    "fit_silhouette": "sleeveless fitted V-front bodice, defined waist, short pleated flared mini skirt",
    "details": [
      "matching self-fabric belt with a big black square buckle",
      "deep V neckline over a blouse"
    ],
    "styling_notes": "layered over a collared blouse",
    "prompt": "sleeveless coral-red and pink tartan plaid pinafore mini dress, fitted V-neck bodice, matching self-fabric waist belt with a large black square buckle, short pleated flared skirt",
    "negative": [],
    "source_images": [
      "B1"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B1"
    ],
    "image": "/shots/items/dress_pinafore_plaid_belted_coral_01.jpg"
  },
  {
    "id": "bottom_bike_shorts_black_lace_hem_01",
    "name": "Black bike shorts with lace hem",
    "slot": "bottom",
    "subcategory": "shorts",
    "style_tags": [
      "kawaii",
      "y2k",
      "coquette"
    ],
    "colors": [
      "black",
      "blush pink"
    ],
    "materials": [
      "stretch jersey",
      "lace"
    ],
    "patterns": [],
    "fit_silhouette": "snug high-rise bike shorts ending mid-thigh",
    "details": [
      "scalloped blush pink lace trim peeking at the hem"
    ],
    "styling_notes": "peeks out below an oversized jacket",
    "prompt": "snug black stretch bike shorts ending at mid-thigh, finished with a delicate scalloped blush-pink lace trim at the leg hem",
    "negative": [],
    "source_images": [
      "A1"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A1"
    ],
    "image": "/shots/items/bottom_bike_shorts_black_lace_hem_01.jpg"
  },
  {
    "id": "bottom_bike_shorts_side_stripe_black_01",
    "name": "Black side-stripe bike shorts",
    "slot": "bottom",
    "subcategory": "shorts",
    "style_tags": [
      "sportswear",
      "streetwear_90s",
      "y2k_streetwear"
    ],
    "colors": [
      "black",
      "white"
    ],
    "materials": [
      "spandex"
    ],
    "patterns": [
      "side stripe"
    ],
    "fit_silhouette": "snug mid-thigh bike shorts",
    "details": [
      "single white stripe down the outer side seam"
    ],
    "styling_notes": "worn with an oversized tee",
    "prompt": "snug black spandex bike shorts ending mid-thigh with a single white stripe down the outer side seam",
    "negative": [],
    "source_images": [
      "D2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D2_left"
    ],
    "image": "/shots/items/bottom_bike_shorts_side_stripe_black_01.jpg"
  },
  {
    "id": "bottom_bloomer_shorts_suspender_black_01",
    "name": "Black bloomer shorts with suspenders",
    "slot": "bottom",
    "subcategory": "bloomers",
    "style_tags": [
      "gothic_lolita",
      "kawaii"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "cotton twill"
    ],
    "patterns": [],
    "fit_silhouette": "very high wide corset-like waistband, puffed pumpkin legs gathered at the upper thigh",
    "details": [
      "thin black suspender straps",
      "long loose ribbon ties hanging at the sides",
      "ruffled leg openings"
    ],
    "styling_notes": "worn over a tucked blouse",
    "prompt": "black high-waisted puffy bloomer shorts with a wide structured waistband, pumpkin-shaped legs gathered into frilled cuffs, thin black suspenders, long black ribbon ties dangling at the hips",
    "negative": [],
    "source_images": [
      "A4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A4"
    ],
    "image": "/shots/items/bottom_bloomer_shorts_suspender_black_01.jpg"
  },
  {
    "id": "bottom_cargo_pants_camo_nylon_gray_01",
    "name": "Gray camo nylon cargo pants",
    "slot": "bottom",
    "subcategory": "cargo_pants",
    "style_tags": [
      "uk_drill",
      "streetwear_90s",
      "techwear"
    ],
    "colors": [
      "charcoal",
      "gray",
      "white"
    ],
    "materials": [
      "nylon"
    ],
    "patterns": [
      "cloud camouflage"
    ],
    "fit_silhouette": "baggy cargos with elastic ankles",
    "details": [
      "large charcoal, gray and white cloud camo",
      "cargo pockets",
      "small logo patch on thigh"
    ],
    "styling_notes": "bunched over black sneakers",
    "prompt": "baggy nylon cargo pants in charcoal, gray and white cloud camouflage with cargo pockets and elastic ankles bunching over sneakers",
    "negative": [],
    "source_images": [
      "I4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I4"
    ],
    "image": "/shots/items/bottom_cargo_pants_camo_nylon_gray_01.jpg"
  },
  {
    "id": "bottom_jeans_baggy_dark_indigo_01",
    "name": "Baggy dark indigo jeans",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "streetwear_90s",
      "y2k_streetwear",
      "hip_hop_2000s"
    ],
    "colors": [
      "dark indigo"
    ],
    "materials": [
      "denim"
    ],
    "patterns": [],
    "fit_silhouette": "low-rise, extremely wide and long, stacking and pooling over sneakers",
    "details": [
      "heavy creases",
      "five-pocket"
    ],
    "styling_notes": "belted low, hems pooling over chunky sneakers",
    "prompt": "very baggy dark indigo denim jeans, low rise, extremely wide legs, long hems stacking and pooling over the sneakers",
    "negative": [],
    "source_images": [
      "C4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_C4"
    ],
    "image": "/shots/items/bottom_jeans_baggy_dark_indigo_01.jpg"
  },
  {
    "id": "bottom_jeans_baggy_lightwash_low_rise_01",
    "name": "Light-wash baggy low-rise jeans",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "y2k_streetwear",
      "streetwear_90s",
      "hip_hop_2000s"
    ],
    "colors": [
      "light blue denim"
    ],
    "materials": [
      "denim"
    ],
    "patterns": [],
    "fit_silhouette": "low-rise, very wide straight legs, long hems over the shoes",
    "details": [
      "faded light wash",
      "wide waistband"
    ],
    "styling_notes": "worn low on the hips",
    "prompt": "light-wash faded baggy denim jeans, low rise, very wide straight legs and long hems puddling over the sneakers",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_left"
    ],
    "image": "/shots/items/bottom_jeans_baggy_lightwash_low_rise_01.jpg"
  },
  {
    "id": "bottom_jeans_coated_skinny_black_01",
    "name": "Glossy coated black skinny jeans",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "y2k",
      "indie_sleaze",
      "avant_garde_dark"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "waxed coated denim"
    ],
    "patterns": [],
    "fit_silhouette": "low to mid rise, skinny, high shine",
    "details": [
      "waxy wet-look sheen",
      "five-pocket"
    ],
    "styling_notes": "worn with a fitted tee or long-sleeve",
    "prompt": "black waxed coated skinny jeans with a glossy wet-look sheen, five-pocket, snug through the leg",
    "negative": [],
    "source_images": [
      "C5",
      "H3"
    ],
    "render_style_seen": "both",
    "outfit_ids": [
      "outfit_C5",
      "outfit_H3"
    ],
    "image": "/shots/items/bottom_jeans_coated_skinny_black_01.jpg"
  },
  {
    "id": "bottom_jeans_flare_western_applique_lightwash_01",
    "name": "Light-wash western appliqué flare jeans",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "western",
      "luxury_street"
    ],
    "colors": [
      "light faded blue denim"
    ],
    "materials": [
      "denim"
    ],
    "patterns": [
      "western scroll applique"
    ],
    "fit_silhouette": "bootcut flare, long hem resting on the boot",
    "details": [
      "raw-edge frayed denim appliqué in western scroll, flame and star shapes",
      "faded light wash"
    ],
    "styling_notes": "hem breaking over cowboy boots",
    "prompt": "light faded wash bootcut flare jeans covered in raw-edge frayed denim appliqué of western scrolls, flames and stars, long hems breaking over cowboy boots",
    "negative": [],
    "source_images": [
      "I5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I5"
    ],
    "image": "/shots/items/bottom_jeans_flare_western_applique_lightwash_01.jpg"
  },
  {
    "id": "bottom_jeans_gothic_embroidered_dark_rinse_01",
    "name": "Dark rinse jeans with Old English embroidery",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "hip_hop_2000s",
      "streetwear_90s",
      "luxury_street"
    ],
    "colors": [
      "dark indigo",
      "white"
    ],
    "materials": [
      "raw denim"
    ],
    "patterns": [
      "Old English lettering"
    ],
    "fit_silhouette": "straight leg, full length",
    "details": [
      "white gothic blackletter embroidered words across both front thighs"
    ],
    "styling_notes": "matching the dark rinse jacket",
    "prompt": "dark-rinse indigo straight-leg jeans with white gothic Old English blackletter embroidery across the front thighs",
    "negative": [],
    "source_images": [
      "G1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G1"
    ],
    "image": "/shots/items/bottom_jeans_gothic_embroidered_dark_rinse_01.jpg"
  },
  {
    "id": "bottom_jeans_paint_splatter_lightwash_01",
    "name": "Paint-splattered light-wash jeans",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "vintage_workwear",
      "americana",
      "grunge"
    ],
    "colors": [
      "light blue denim",
      "multicolor paint"
    ],
    "materials": [
      "denim"
    ],
    "patterns": [
      "paint splatter"
    ],
    "fit_silhouette": "straight leg, relaxed, full length",
    "details": [
      "paint drips and splatters on thighs",
      "worn faded knees"
    ],
    "styling_notes": "worn with desert boots",
    "prompt": "light-wash faded straight-leg jeans with paint splatters and drips across the thighs, relaxed workwear fit",
    "negative": [],
    "source_images": [
      "E3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E3_left"
    ],
    "image": "/shots/items/bottom_jeans_paint_splatter_lightwash_01.jpg"
  },
  {
    "id": "bottom_jeans_shredded_bleached_baggy_01",
    "name": "Bleached shredded baggy jeans",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "grunge",
      "luxury_street",
      "streetwear_90s"
    ],
    "colors": [
      "bleached gray",
      "off-white"
    ],
    "materials": [
      "denim"
    ],
    "patterns": [
      "acid wash"
    ],
    "fit_silhouette": "baggy straight leg, long",
    "details": [
      "heavy shredding and rips all over",
      "bleached acid-wash marbling",
      "frayed threads"
    ],
    "styling_notes": "",
    "prompt": "baggy bleached light-gray acid-wash jeans heavily shredded with rips and frayed holes all over the legs",
    "negative": [],
    "source_images": [
      "H4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_H4"
    ],
    "image": "/shots/items/bottom_jeans_shredded_bleached_baggy_01.jpg"
  },
  {
    "id": "bottom_jeans_skinny_black_stacked_01",
    "name": "Black stacked skinny jeans",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "streetwear_90s",
      "rock_moto"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "stretch denim"
    ],
    "patterns": [],
    "fit_silhouette": "skinny, stacked at the ankles over boots",
    "details": [],
    "styling_notes": "",
    "prompt": "black stretch skinny jeans stacking in folds at the ankles over boots",
    "negative": [],
    "source_images": [
      "F4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F4"
    ],
    "image": "/shots/items/bottom_jeans_skinny_black_stacked_01.jpg"
  },
  {
    "id": "bottom_jeans_skinny_distressed_raw_hem_black_01",
    "name": "Black distressed raw-hem skinny jeans",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "rock_moto",
      "grunge"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "stretch denim"
    ],
    "patterns": [],
    "fit_silhouette": "skinny, cropped at the ankle",
    "details": [
      "shredded knee rips",
      "frayed raw cut hem"
    ],
    "styling_notes": "",
    "prompt": "black skinny jeans with shredded knee rips and a frayed raw-cut hem cropped above the ankle",
    "negative": [],
    "source_images": [
      "G4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G4"
    ],
    "image": "/shots/items/bottom_jeans_skinny_distressed_raw_hem_black_01.jpg"
  },
  {
    "id": "bottom_jeans_skinny_patchwork_faded_gray_01",
    "name": "Faded gray skinny jeans with black patch",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "avant_garde_dark",
      "rock_moto"
    ],
    "colors": [
      "faded gray",
      "black"
    ],
    "materials": [
      "stretch denim"
    ],
    "patterns": [
      "patchwork"
    ],
    "fit_silhouette": "skinny with long stacked legs tucked into boots",
    "details": [
      "black patchwork panel on one thigh",
      "exposed raw seams",
      "faded wash"
    ],
    "styling_notes": "stacked into platform boots",
    "prompt": "faded gray skinny jeans with a black denim patchwork panel across one thigh, exposed raw seams, long legs stacking into the boots",
    "negative": [],
    "source_images": [
      "E4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E4"
    ],
    "image": "/shots/items/bottom_jeans_skinny_patchwork_faded_gray_01.jpg"
  },
  {
    "id": "bottom_jeans_skinny_ripped_cuffed_lightwash_01",
    "name": "Light-wash ripped cuffed skinny jeans",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "streetwear_90s",
      "grunge"
    ],
    "colors": [
      "light blue denim"
    ],
    "materials": [
      "stretch denim"
    ],
    "patterns": [],
    "fit_silhouette": "skinny, cuffed at the ankle",
    "details": [
      "ripped knees",
      "rolled cuffs"
    ],
    "styling_notes": "cuffed to show white socks",
    "prompt": "light-wash skinny jeans with ripped knees and rolled cuffs at the ankle",
    "negative": [],
    "source_images": [
      "F3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F3"
    ],
    "image": "/shots/items/bottom_jeans_skinny_ripped_cuffed_lightwash_01.jpg"
  },
  {
    "id": "bottom_jeans_straight_lace_hem_lightwash_01",
    "name": "Light-wash jeans with lace hem",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "coquette",
      "y2k"
    ],
    "colors": [
      "light blue denim",
      "white"
    ],
    "materials": [
      "denim",
      "lace"
    ],
    "patterns": [],
    "fit_silhouette": "mid-rise straight leg, full length grazing the shoe",
    "details": [
      "white scalloped lace trim sewn around the hem"
    ],
    "styling_notes": "worn with pointed heels",
    "prompt": "light-wash blue straight-leg jeans, full length, finished with a band of white scalloped lace trim around each hem",
    "negative": [],
    "source_images": [
      "A5"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A5"
    ],
    "image": "/shots/items/bottom_jeans_straight_lace_hem_lightwash_01.jpg"
  },
  {
    "id": "bottom_jeans_straight_medium_wash_01",
    "name": "Medium-wash straight jeans",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "americana",
      "vintage_workwear"
    ],
    "colors": [
      "medium blue denim"
    ],
    "materials": [
      "denim"
    ],
    "patterns": [],
    "fit_silhouette": "mid-rise relaxed straight leg",
    "details": [],
    "styling_notes": "",
    "prompt": "medium-wash relaxed straight-leg jeans, mid rise, classic five-pocket",
    "negative": [],
    "source_images": [
      "F5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F5"
    ],
    "image": "/shots/items/bottom_jeans_straight_medium_wash_01.jpg"
  },
  {
    "id": "bottom_jeans_waxed_straight_charcoal_01",
    "name": "Charcoal waxed straight jeans",
    "slot": "bottom",
    "subcategory": "jeans",
    "style_tags": [
      "avant_garde_dark",
      "luxury_street",
      "indie_sleaze"
    ],
    "colors": [
      "charcoal black"
    ],
    "materials": [
      "waxed coated denim"
    ],
    "patterns": [],
    "fit_silhouette": "straight leg, full length, slight stack",
    "details": [
      "matte-to-shiny waxed coating",
      "slight crinkle"
    ],
    "styling_notes": "",
    "prompt": "charcoal black waxed coated straight-leg jeans with a leather-like semi-gloss finish and light crinkling",
    "negative": [],
    "source_images": [
      "E2",
      "E5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E2",
      "outfit_E5"
    ],
    "image": "/shots/items/bottom_jeans_waxed_straight_charcoal_01.jpg"
  },
  {
    "id": "bottom_jorts_cargo_long_medium_wash_01",
    "name": "Long baggy cargo jorts",
    "slot": "bottom",
    "subcategory": "shorts",
    "style_tags": [
      "y2k_streetwear",
      "hip_hop_2000s",
      "streetwear_90s"
    ],
    "colors": [
      "medium blue denim"
    ],
    "materials": [
      "denim"
    ],
    "patterns": [],
    "fit_silhouette": "very baggy shorts ending below the knee",
    "details": [
      "side cargo pockets",
      "wide legs"
    ],
    "styling_notes": "worn low with tube socks",
    "prompt": "very baggy medium-wash denim jorts ending below the knee with side cargo pockets, wide straight legs",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_right"
    ],
    "image": "/shots/items/bottom_jorts_cargo_long_medium_wash_01.jpg"
  },
  {
    "id": "bottom_pants_wide_drawstring_black_01",
    "name": "Black wide drawstring trousers",
    "slot": "bottom",
    "subcategory": "trousers",
    "style_tags": [
      "avant_garde_dark",
      "luxury_street"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "heavy jersey"
    ],
    "patterns": [],
    "fit_silhouette": "very wide straight leg, puddling hem",
    "details": [
      "extra long drawcords hanging past the knees",
      "dropped crotch"
    ],
    "styling_notes": "pooling over black shoes",
    "prompt": "very wide black heavy jersey drawstring trousers with extra long drawcords hanging to the knees, slightly dropped crotch and puddling hems",
    "negative": [],
    "source_images": [
      "E3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E3_right"
    ],
    "image": "/shots/items/bottom_pants_wide_drawstring_black_01.jpg"
  },
  {
    "id": "bottom_puffer_pants_glossy_yellow_01",
    "name": "Glossy yellow puffer pants",
    "slot": "bottom",
    "subcategory": "puffer_pants",
    "style_tags": [
      "uk_drill",
      "techwear"
    ],
    "colors": [
      "golden yellow"
    ],
    "materials": [
      "glossy nylon"
    ],
    "patterns": [],
    "fit_silhouette": "padded relaxed pants with elastic cuffs",
    "details": [],
    "styling_notes": "matching the yellow puffer",
    "prompt": "padded glossy golden yellow nylon puffer pants with elastic ankle cuffs, matching the jacket",
    "negative": [],
    "source_images": [
      "I3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I3_yellow"
    ],
    "image": "/shots/items/bottom_puffer_pants_glossy_yellow_01.jpg"
  },
  {
    "id": "bottom_shorts_lace_trim_leopard_01",
    "name": "Leopard lace-trim micro shorts",
    "slot": "bottom",
    "subcategory": "shorts",
    "style_tags": [
      "indie_sleaze",
      "y2k"
    ],
    "colors": [
      "leopard brown",
      "black"
    ],
    "materials": [
      "satin",
      "lace"
    ],
    "patterns": [
      "leopard print"
    ],
    "fit_silhouette": "tiny shorts peeking under the dress hem",
    "details": [
      "black lace trim"
    ],
    "styling_notes": "visible just below a mini dress",
    "prompt": "tiny leopard print satin shorts edged with black lace peeking below a mini dress hem",
    "negative": [],
    "source_images": [
      "F1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F1"
    ],
    "image": "/shots/items/bottom_shorts_lace_trim_leopard_01.jpg"
  },
  {
    "id": "bottom_shorts_nylon_black_01",
    "name": "Black nylon shorts",
    "slot": "bottom",
    "subcategory": "shorts",
    "style_tags": [
      "sportswear",
      "streetwear_90s"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "nylon"
    ],
    "patterns": [],
    "fit_silhouette": "above-knee relaxed shorts",
    "details": [],
    "styling_notes": "",
    "prompt": "relaxed black nylon shorts ending above the knee",
    "negative": [],
    "source_images": [
      "F6"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F6"
    ],
    "image": "/shots/items/bottom_shorts_nylon_black_01.jpg"
  },
  {
    "id": "bottom_skirt_bubble_mini_brown_01",
    "name": "Dark brown bubble mini skirt",
    "slot": "bottom",
    "subcategory": "mini_skirt",
    "style_tags": [
      "coquette",
      "y2k",
      "grunge"
    ],
    "colors": [
      "dark chocolate brown"
    ],
    "materials": [
      "cotton"
    ],
    "patterns": [],
    "fit_silhouette": "short puffy bubble hem mini skirt",
    "details": [
      "gathered ruffled balloon hem"
    ],
    "styling_notes": "under a long sweater and shirttail",
    "prompt": "dark chocolate brown puffy bubble-hem mini skirt with a soft gathered balloon silhouette",
    "negative": [],
    "source_images": [
      "B5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_B5"
    ],
    "image": "/shots/items/bottom_skirt_bubble_mini_brown_01.jpg"
  },
  {
    "id": "bottom_skirt_denim_cargo_pleated_mini_black_01",
    "name": "Washed black denim cargo micro skirt",
    "slot": "bottom",
    "subcategory": "mini_skirt",
    "style_tags": [
      "y2k",
      "gyaru",
      "grunge"
    ],
    "colors": [
      "washed black",
      "charcoal"
    ],
    "materials": [
      "denim"
    ],
    "patterns": [],
    "fit_silhouette": "low-rise pleated micro mini",
    "details": [
      "front flap cargo pockets with snaps",
      "frayed raw hem",
      "faded wash"
    ],
    "styling_notes": "worn with a low pink belt and chains",
    "prompt": "washed charcoal black denim low-rise pleated micro mini skirt with flap cargo pockets, snap buttons and a frayed raw hem",
    "negative": [],
    "source_images": [
      "C3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C3"
    ],
    "image": "/shots/items/bottom_skirt_denim_cargo_pleated_mini_black_01.jpg"
  },
  {
    "id": "bottom_skirt_gingham_mini_pink_01",
    "name": "Pink gingham mini skirt",
    "slot": "bottom",
    "subcategory": "mini_skirt",
    "style_tags": [
      "preppy_90s",
      "coquette",
      "y2k"
    ],
    "colors": [
      "baby pink",
      "white"
    ],
    "materials": [
      "cotton tweed"
    ],
    "patterns": [
      "gingham check"
    ],
    "fit_silhouette": "fitted straight mini, high waist",
    "details": [
      "small gingham check"
    ],
    "styling_notes": "",
    "prompt": "fitted high-waisted baby pink and white gingham check straight mini skirt",
    "negative": [],
    "source_images": [
      "D1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_D1"
    ],
    "image": "/shots/items/bottom_skirt_gingham_mini_pink_01.jpg"
  },
  {
    "id": "bottom_skirt_maxi_polkadot_tiered_cream_01",
    "name": "Cream polka-dot tiered maxi skirt",
    "slot": "bottom",
    "subcategory": "maxi_skirt",
    "style_tags": [
      "coquette",
      "vintage_romantic",
      "mori_girl"
    ],
    "colors": [
      "cream",
      "black"
    ],
    "materials": [
      "cotton voile",
      "eyelet lace"
    ],
    "patterns": [
      "small polka dots"
    ],
    "fit_silhouette": "high waist, ankle length, full A-line",
    "details": [
      "double ruffle tier at the hip like a peplum",
      "wide scalloped eyelet lace band at the hem"
    ],
    "styling_notes": "worn with a tucked knit top",
    "prompt": "high-waisted ankle-length cream skirt with tiny black polka dots, a double ruffled tier around the hips, full flowing body ending in a wide scalloped eyelet lace hem",
    "negative": [],
    "source_images": [
      "A3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A3"
    ],
    "image": "/shots/items/bottom_skirt_maxi_polkadot_tiered_cream_01.jpg"
  },
  {
    "id": "bottom_skirt_maxi_tartan_blue_green_01",
    "name": "Blue-green tartan pleated maxi skirt",
    "slot": "bottom",
    "subcategory": "maxi_skirt",
    "style_tags": [
      "dark_academia",
      "mori_girl",
      "preppy"
    ],
    "colors": [
      "navy",
      "teal blue",
      "forest green",
      "mustard yellow"
    ],
    "materials": [
      "wool"
    ],
    "patterns": [
      "tartan plaid"
    ],
    "fit_silhouette": "high waist, ankle length, softly pleated A-line",
    "details": [
      "Black Watch style tartan with thin yellow overcheck"
    ],
    "styling_notes": "worn with a tucked blouse and socks with sandals",
    "prompt": "high-waisted ankle-length pleated wool maxi skirt in a navy, teal and forest-green tartan with a thin mustard-yellow overcheck",
    "negative": [],
    "source_images": [
      "B3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B3"
    ],
    "image": "/shots/items/bottom_skirt_maxi_tartan_blue_green_01.jpg"
  },
  {
    "id": "bottom_skirt_pleated_micro_faux_leather_black_01",
    "name": "Black faux-leather pleated micro skirt",
    "slot": "bottom",
    "subcategory": "mini_skirt",
    "style_tags": [
      "gothic",
      "y2k",
      "punk"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "faux leather"
    ],
    "patterns": [],
    "fit_silhouette": "low-rise, wide smooth yoke, very short knife pleats",
    "details": [
      "side zip",
      "satin sheen"
    ],
    "styling_notes": "worn with a studded belt and hanging cross chain",
    "prompt": "black glossy faux-leather low-rise micro mini skirt with a wide smooth hip yoke, short sharp knife pleats and a silver side zip",
    "negative": [],
    "source_images": [
      "C1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C1"
    ],
    "image": "/shots/items/bottom_skirt_pleated_micro_faux_leather_black_01.jpg"
  },
  {
    "id": "bottom_skirt_pleated_micro_gray_plaid_01",
    "name": "Gray plaid pleated micro skirt",
    "slot": "bottom",
    "subcategory": "mini_skirt",
    "style_tags": [
      "japanese_school",
      "y2k",
      "gyaru"
    ],
    "colors": [
      "charcoal gray",
      "white"
    ],
    "materials": [
      "wool-blend"
    ],
    "patterns": [
      "plaid"
    ],
    "fit_silhouette": "very short knife-pleated school skirt",
    "details": [
      "crisp pleats"
    ],
    "styling_notes": "worn with blazer and loose socks",
    "prompt": "charcoal gray plaid knife-pleated school uniform micro mini skirt with crisp pleats",
    "negative": [],
    "source_images": [
      "B4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B4"
    ],
    "image": "/shots/items/bottom_skirt_pleated_micro_gray_plaid_01.jpg"
  },
  {
    "id": "bottom_skirt_pleated_mini_forest_green_01",
    "name": "Forest green pleated mini skirt",
    "slot": "bottom",
    "subcategory": "mini_skirt",
    "style_tags": [
      "preppy",
      "sportswear",
      "japanese_school"
    ],
    "colors": [
      "forest green"
    ],
    "materials": [
      "cotton twill"
    ],
    "patterns": [],
    "fit_silhouette": "short flared pleated tennis mini",
    "details": [
      "crisp pleats",
      "slight bubble at the hem"
    ],
    "styling_notes": "",
    "prompt": "short forest green pleated tennis mini skirt with crisp flared pleats",
    "negative": [],
    "source_images": [
      "D2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D2_right"
    ],
    "image": "/shots/items/bottom_skirt_pleated_mini_forest_green_01.jpg"
  },
  {
    "id": "bottom_skirt_pleated_tennis_white_01",
    "name": "White pleated tennis mini skirt",
    "slot": "bottom",
    "subcategory": "mini_skirt",
    "style_tags": [
      "japanese_school",
      "sportswear",
      "preppy"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "cotton twill"
    ],
    "patterns": [],
    "fit_silhouette": "short A-line mini with crisp knife pleats",
    "details": [
      "crisp even pleats"
    ],
    "styling_notes": "peeks out below an oversized jacket",
    "prompt": "crisp white knife-pleated tennis mini skirt, short flared A-line",
    "negative": [],
    "source_images": [
      "B2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B2"
    ],
    "image": "/shots/items/bottom_skirt_pleated_tennis_white_01.jpg"
  },
  {
    "id": "bottom_sweatpants_heather_gray_script_01",
    "name": "Heather gray sweatpants",
    "slot": "bottom",
    "subcategory": "sweatpants",
    "style_tags": [
      "uk_drill",
      "sportswear"
    ],
    "colors": [
      "heather gray",
      "white"
    ],
    "materials": [
      "fleece"
    ],
    "patterns": [],
    "fit_silhouette": "relaxed joggers, elastic cuffs bunched over sneakers",
    "details": [
      "small white script logo on thigh"
    ],
    "styling_notes": "matching the crewneck",
    "prompt": "relaxed heather gray fleece sweatpants with elastic cuffs bunching over sneakers and a small white script logo on the thigh",
    "negative": [],
    "source_images": [
      "H5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_H5"
    ],
    "image": "/shots/items/bottom_sweatpants_heather_gray_script_01.jpg"
  },
  {
    "id": "bottom_sweatpants_mustard_old_english_01",
    "name": "Mustard sweatpants with gothic logo",
    "slot": "bottom",
    "subcategory": "sweatpants",
    "style_tags": [
      "luxury_street",
      "streetwear_90s",
      "hip_hop_2000s"
    ],
    "colors": [
      "mustard gold",
      "black"
    ],
    "materials": [
      "fleece"
    ],
    "patterns": [
      "Old English lettering"
    ],
    "fit_silhouette": "relaxed joggers with elastic cuffs, bunched at the ankle",
    "details": [
      "black Old English logo print on the thigh with a circle emblem",
      "drawstring waist"
    ],
    "styling_notes": "bunched over high-top sneakers",
    "prompt": "relaxed mustard gold fleece joggers with a black gothic Old English Billionaire Boys Club print on the thigh, drawstring waist and elastic ankle cuffs",
    "prompt_brand_free": "relaxed mustard gold fleece joggers with a black gothic Old English blackletter logo print and circular emblem on the thigh, drawstring waist, elastic ankle cuffs",
    "negative": [],
    "source_images": [
      "G3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G3"
    ],
    "image": "/shots/items/bottom_sweatpants_mustard_old_english_01.jpg"
  },
  {
    "id": "bottom_track_pants_nylon_forest_green_01",
    "name": "Forest green nylon track pants",
    "slot": "bottom",
    "subcategory": "track_pants",
    "style_tags": [
      "uk_drill",
      "sportswear"
    ],
    "colors": [
      "forest green"
    ],
    "materials": [
      "nylon"
    ],
    "patterns": [],
    "fit_silhouette": "relaxed straight leg",
    "details": [],
    "styling_notes": "matching the green puffer",
    "prompt": "relaxed forest green nylon track pants matching the jacket",
    "negative": [],
    "source_images": [
      "I3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I3_green"
    ],
    "image": "/shots/items/bottom_track_pants_nylon_forest_green_01.jpg"
  },
  {
    "id": "bottom_track_pants_piped_cream_01",
    "name": "Cream track pants with black piping",
    "slot": "bottom",
    "subcategory": "track_pants",
    "style_tags": [
      "sportswear",
      "streetwear_90s"
    ],
    "colors": [
      "cream",
      "black"
    ],
    "materials": [
      "tricot"
    ],
    "patterns": [
      "side stripe"
    ],
    "fit_silhouette": "straight relaxed leg, ankle length",
    "details": [
      "thin black piping down the outer seam"
    ],
    "styling_notes": "with tall white socks",
    "prompt": "cream tricot track pants with a thin black stripe piping down the outer seam, relaxed straight leg ending at the ankle",
    "negative": [],
    "source_images": [
      "F2"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F2"
    ],
    "image": "/shots/items/bottom_track_pants_piped_cream_01.jpg"
  },
  {
    "id": "bottom_track_pants_royal_blue_stripe_01",
    "name": "Royal blue striped track pants",
    "slot": "bottom",
    "subcategory": "track_pants",
    "style_tags": [
      "sportswear",
      "luxury_street",
      "streetwear_90s"
    ],
    "colors": [
      "royal blue",
      "yellow",
      "white"
    ],
    "materials": [
      "satin tricot"
    ],
    "patterns": [
      "side stripes"
    ],
    "fit_silhouette": "straight relaxed leg",
    "details": [
      "yellow and white stripes down the outer leg",
      "small script logo on thigh"
    ],
    "styling_notes": "matching the track jacket",
    "prompt": "matching royal blue satin tricot track pants with yellow and white stripes down the outer leg and a small script logo on the thigh",
    "negative": [],
    "source_images": [
      "G2"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G2"
    ],
    "image": "/shots/items/bottom_track_pants_royal_blue_stripe_01.jpg"
  },
  {
    "id": "bottom_trousers_leather_straight_black_01",
    "name": "Black leather straight trousers",
    "slot": "bottom",
    "subcategory": "trousers",
    "style_tags": [
      "leather_tailoring",
      "rock_moto"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "soft leather"
    ],
    "patterns": [],
    "fit_silhouette": "relaxed straight leg, full length breaking on the boot",
    "details": [
      "natural creasing at knees",
      "subtle shine"
    ],
    "styling_notes": "matched with the leather blazer",
    "prompt": "black soft leather straight-leg trousers, relaxed fit, full length breaking over boots, natural creases at the knees",
    "negative": [],
    "source_images": [
      "E1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E1"
    ],
    "image": "/shots/items/bottom_trousers_leather_straight_black_01.jpg"
  },
  {
    "id": "bottom_trousers_pleated_wide_khaki_01",
    "name": "Khaki pleated wide trousers",
    "slot": "bottom",
    "subcategory": "trousers",
    "style_tags": [
      "vintage_workwear",
      "minimal_basics",
      "streetwear_90s"
    ],
    "colors": [
      "stone khaki"
    ],
    "materials": [
      "cotton twill"
    ],
    "patterns": [],
    "fit_silhouette": "high-rise, front pleats, wide relaxed legs",
    "details": [
      "soft drape"
    ],
    "styling_notes": "belted with a nylon belt",
    "prompt": "stone khaki cotton twill pleated trousers with a high rise and wide relaxed legs",
    "negative": [],
    "source_images": [
      "G5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G5"
    ],
    "image": "/shots/items/bottom_trousers_pleated_wide_khaki_01.jpg"
  },
  {
    "id": "belt_waist_braided_leather_tan_01",
    "name": "Tan braided leather belt",
    "slot": "belt_waist",
    "subcategory": "belt",
    "style_tags": [
      "vintage_workwear",
      "americana"
    ],
    "colors": [
      "tan"
    ],
    "materials": [
      "braided leather"
    ],
    "patterns": [],
    "fit_silhouette": "standard width",
    "details": [
      "woven braid",
      "brass buckle"
    ],
    "styling_notes": "",
    "prompt": "tan woven braided leather belt with a brass buckle",
    "negative": [],
    "source_images": [
      "E3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E3_left"
    ],
    "image": "/shots/items/belt_waist_braided_leather_tan_01.jpg"
  },
  {
    "id": "belt_waist_bullet_silver_01",
    "name": "Silver bullet belt",
    "slot": "belt_waist",
    "subcategory": "belt",
    "style_tags": [
      "punk",
      "rock_moto",
      "avant_garde_dark"
    ],
    "colors": [
      "silver",
      "black"
    ],
    "materials": [
      "metal",
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "belt worn at the hips",
    "details": [
      "row of upright silver bullet-cartridge spikes all the way around"
    ],
    "styling_notes": "",
    "prompt": "black belt lined with a continuous row of upright silver bullet-cartridge spikes, worn on the hips",
    "negative": [],
    "source_images": [
      "E5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E5"
    ],
    "image": "/shots/items/belt_waist_bullet_silver_01.jpg"
  },
  {
    "id": "belt_waist_chain_charms_heart_butterfly_01",
    "name": "Silver charm chain belt",
    "slot": "belt_waist",
    "subcategory": "chain_belt",
    "style_tags": [
      "y2k",
      "coquette",
      "gyaru"
    ],
    "colors": [
      "silver",
      "pink"
    ],
    "materials": [
      "metal chain"
    ],
    "patterns": [],
    "fit_silhouette": "two draped chains across the front hips",
    "details": [
      "heart charms",
      "cross charm",
      "rhinestone butterfly charm"
    ],
    "styling_notes": "hung alongside the pink belt",
    "prompt": "draped silver chain belt across the hips with dangling heart, cross and rhinestone butterfly charms",
    "negative": [],
    "source_images": [
      "C3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C3"
    ],
    "image": "/shots/items/belt_waist_chain_charms_heart_butterfly_01.jpg"
  },
  {
    "id": "belt_waist_draped_chains_silver_01",
    "name": "Draped silver hip chains",
    "slot": "belt_waist",
    "subcategory": "chain_belt",
    "style_tags": [
      "punk",
      "avant_garde_diy",
      "y2k"
    ],
    "colors": [
      "silver"
    ],
    "materials": [
      "metal curb chain"
    ],
    "patterns": [],
    "fit_silhouette": "many silver chains looped from the waist across hips and thighs",
    "details": [
      "multiple drape lengths",
      "swagged loops"
    ],
    "styling_notes": "hung off the lowest belt",
    "prompt": "multiple silver curb chains swagged in loose loops from the hips across the thighs, layered drape lengths",
    "negative": [],
    "source_images": [
      "C2"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C2"
    ],
    "image": "/shots/items/belt_waist_draped_chains_silver_01.jpg"
  },
  {
    "id": "belt_waist_grommet_studded_black_01",
    "name": "Black grommet studded belt",
    "slot": "belt_waist",
    "subcategory": "belt",
    "style_tags": [
      "gothic",
      "punk",
      "y2k"
    ],
    "colors": [
      "black",
      "silver"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "wide belt worn slung low with the long tail hanging down the thigh",
    "details": [
      "rows of silver grommets and round studs",
      "large rounded roller buckle"
    ],
    "styling_notes": "buckled off-center so the tail drops",
    "prompt": "wide black leather belt with rows of silver grommets and round studs, large silver rounded buckle, slung low on the hips with the long tail hanging down",
    "negative": [],
    "source_images": [
      "C1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C1"
    ],
    "image": "/shots/items/belt_waist_grommet_studded_black_01.jpg"
  },
  {
    "id": "belt_waist_leather_black_silver_buckle_01",
    "name": "Black leather belt",
    "slot": "belt_waist",
    "subcategory": "belt",
    "style_tags": [
      "minimal_basics",
      "americana",
      "streetwear_90s"
    ],
    "colors": [
      "black",
      "silver"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "classic width",
    "details": [
      "silver buckle"
    ],
    "styling_notes": "",
    "prompt": "classic black leather belt with a silver buckle",
    "negative": [],
    "source_images": [
      "F4",
      "F5",
      "G1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F4",
      "outfit_F5",
      "outfit_G1"
    ],
    "image": "/shots/items/belt_waist_leather_black_silver_buckle_01.jpg"
  },
  {
    "id": "belt_waist_leather_brown_gold_buckle_01",
    "name": "Brown leather belt with gold buckle",
    "slot": "belt_waist",
    "subcategory": "belt",
    "style_tags": [
      "streetwear_90s",
      "western",
      "vintage_workwear"
    ],
    "colors": [
      "brown",
      "gold"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "standard width belt",
    "details": [
      "gold rectangular buckle"
    ],
    "styling_notes": "threaded through baggy jeans",
    "prompt": "classic brown leather belt with a gold rectangular buckle",
    "negative": [],
    "source_images": [
      "C4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_C4"
    ],
    "image": "/shots/items/belt_waist_leather_brown_gold_buckle_01.jpg"
  },
  {
    "id": "belt_waist_leather_red_silver_buckle_01",
    "name": "Red leather belt",
    "slot": "belt_waist",
    "subcategory": "belt",
    "style_tags": [
      "y2k_streetwear",
      "streetwear_90s"
    ],
    "colors": [
      "red",
      "silver"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "standard belt worn low",
    "details": [
      "silver rectangular buckle"
    ],
    "styling_notes": "over low-rise jorts",
    "prompt": "glossy red leather belt with a silver rectangular buckle worn low on the hips",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_right"
    ],
    "image": "/shots/items/belt_waist_leather_red_silver_buckle_01.jpg"
  },
  {
    "id": "belt_waist_nylon_cobra_buckle_black_01",
    "name": "Black nylon quick-release belt",
    "slot": "belt_waist",
    "subcategory": "belt",
    "style_tags": [
      "techwear",
      "streetwear_90s"
    ],
    "colors": [
      "black",
      "gunmetal"
    ],
    "materials": [
      "nylon webbing"
    ],
    "patterns": [],
    "fit_silhouette": "slim webbing belt",
    "details": [
      "metal quick-release cobra buckle"
    ],
    "styling_notes": "",
    "prompt": "black nylon webbing belt with a gunmetal quick-release cobra buckle",
    "negative": [],
    "source_images": [
      "G5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G5"
    ],
    "image": "/shots/items/belt_waist_nylon_cobra_buckle_black_01.jpg"
  },
  {
    "id": "belt_waist_rhinestone_star_buckle_pink_01",
    "name": "Pink rhinestone star-buckle belt",
    "slot": "belt_waist",
    "subcategory": "belt",
    "style_tags": [
      "y2k",
      "gyaru",
      "coquette"
    ],
    "colors": [
      "blush pink",
      "silver"
    ],
    "materials": [
      "leather",
      "rhinestones"
    ],
    "patterns": [],
    "fit_silhouette": "wide belt slung low on the hips",
    "details": [
      "studded with rhinestones",
      "big ornate silver star buckle"
    ],
    "styling_notes": "worn low over a denim mini",
    "prompt": "wide blush-pink leather belt studded with rhinestones and a big ornate silver star buckle, slung low on the hips",
    "negative": [],
    "source_images": [
      "C3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C3"
    ],
    "image": "/shots/items/belt_waist_rhinestone_star_buckle_pink_01.jpg"
  },
  {
    "id": "belt_waist_studded_oring_black_01",
    "name": "Black studded O-ring hip belt",
    "slot": "belt_waist",
    "subcategory": "belt",
    "style_tags": [
      "indie_sleaze",
      "punk",
      "y2k"
    ],
    "colors": [
      "black",
      "silver"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "slung loosely on the hips",
    "details": [
      "silver studs",
      "large O-ring hardware"
    ],
    "styling_notes": "over a knit dress",
    "prompt": "black leather hip belt with silver studs and large O-ring hardware slung loosely low on the hips",
    "negative": [],
    "source_images": [
      "F1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F1"
    ],
    "image": "/shots/items/belt_waist_studded_oring_black_01.jpg"
  },
  {
    "id": "legwear_knee_sock_cross_black_01",
    "name": "Black knee socks with silver cross",
    "slot": "legwear",
    "subcategory": "knee_socks",
    "style_tags": [
      "gothic",
      "gothic_lolita"
    ],
    "colors": [
      "black",
      "silver"
    ],
    "materials": [
      "knit"
    ],
    "patterns": [
      "embroidered cross"
    ],
    "fit_silhouette": "knee-high, opaque",
    "details": [
      "silver embroidered gothic cross on the outer calf"
    ],
    "styling_notes": "worn mismatched with a red lace-up sock",
    "prompt": "opaque black knee-high socks with a small silver embroidered gothic cross on the outer calf",
    "negative": [],
    "source_images": [
      "A4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A4"
    ],
    "image": "/shots/items/legwear_knee_sock_cross_black_01.jpg"
  },
  {
    "id": "legwear_leg_warmers_chunky_cream_01",
    "name": "Cream chunky ribbed leg warmers",
    "slot": "legwear",
    "subcategory": "leg_warmers",
    "style_tags": [
      "kawaii",
      "y2k",
      "japanese_school"
    ],
    "colors": [
      "cream"
    ],
    "materials": [
      "chunky rib knit"
    ],
    "patterns": [],
    "fit_silhouette": "thick slouchy tubes bunched from ankle to mid-calf",
    "details": [
      "deep vertical ribbing",
      "scrunched folds"
    ],
    "styling_notes": "pulled over the top of slouch boots",
    "prompt": "thick cream chunky rib-knit leg warmers scrunched and bunched over the tops of boots, slouchy stacked folds around the calves",
    "negative": [],
    "source_images": [
      "A1"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A1"
    ],
    "image": "/shots/items/legwear_leg_warmers_chunky_cream_01.jpg"
  },
  {
    "id": "legwear_loose_socks_cable_knit_white_01",
    "name": "White cable-knit loose socks",
    "slot": "legwear",
    "subcategory": "loose_socks",
    "style_tags": [
      "japanese_school",
      "gyaru",
      "y2k"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "chunky cable knit"
    ],
    "patterns": [],
    "fit_silhouette": "extra thick and long, slouched in heavy rings from ankle to calf",
    "details": [
      "chunky cable pattern"
    ],
    "styling_notes": "worn with brown loafers",
    "prompt": "extra-thick white chunky cable-knit loose socks slouched in heavy rolls from the ankle up the calf, 90s Japanese gyaru style",
    "negative": [],
    "source_images": [
      "B4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B4"
    ],
    "image": "/shots/items/legwear_loose_socks_cable_knit_white_01.jpg"
  },
  {
    "id": "legwear_loose_socks_slouch_white_01",
    "name": "White slouchy loose socks",
    "slot": "legwear",
    "subcategory": "loose_socks",
    "style_tags": [
      "japanese_school",
      "gyaru",
      "y2k",
      "streetwear_90s"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "rib knit"
    ],
    "patterns": [],
    "fit_silhouette": "thick tube socks pushed down into loose rings around the calf",
    "details": [
      "bunched slouch rings"
    ],
    "styling_notes": "with loafers or sneakers",
    "prompt": "thick white ribbed slouch socks pushed down into loose bunched rings around the lower calf, Japanese loose-socks style",
    "negative": [],
    "source_images": [
      "B2",
      "D2",
      "D5"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B2",
      "outfit_D2_left",
      "outfit_D5"
    ],
    "image": "/shots/items/legwear_loose_socks_slouch_white_01.jpg"
  },
  {
    "id": "legwear_sock_ribbon_lace_up_red_01",
    "name": "Red sheer sock with ribbon lace-up",
    "slot": "legwear",
    "subcategory": "socks",
    "style_tags": [
      "gothic_lolita",
      "coquette"
    ],
    "colors": [
      "crimson red"
    ],
    "materials": [
      "sheer nylon",
      "satin ribbon"
    ],
    "patterns": [],
    "fit_silhouette": "mid-calf sheer sock",
    "details": [
      "red satin ribbon criss-crossing up the calf like ballet laces",
      "loose bow tails at top"
    ],
    "styling_notes": "worn on one leg only, mismatched pair",
    "prompt": "sheer crimson red mid-calf sock wrapped with red satin ribbon criss-crossing up the calf like ballet-shoe lacing, bow tails hanging loose",
    "negative": [],
    "source_images": [
      "A4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A4"
    ],
    "image": "/shots/items/legwear_sock_ribbon_lace_up_red_01.jpg"
  },
  {
    "id": "legwear_socks_crew_white_01",
    "name": "White crew socks",
    "slot": "legwear",
    "subcategory": "socks",
    "style_tags": [
      "minimal_basics",
      "japanese_school",
      "streetwear_90s"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "cotton rib"
    ],
    "patterns": [],
    "fit_silhouette": "crew height, ending mid-calf, smooth",
    "details": [
      "fine ribbed cuff"
    ],
    "styling_notes": "worn with loafers, sandals or sneakers",
    "prompt": "plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf",
    "negative": [],
    "source_images": [
      "A2",
      "B3",
      "D2",
      "F3",
      "F6",
      "G3",
      "G4",
      "G5"
    ],
    "render_style_seen": "both",
    "outfit_ids": [
      "outfit_A2",
      "outfit_B3",
      "outfit_D2_right",
      "outfit_F3",
      "outfit_F6",
      "outfit_G3",
      "outfit_G4",
      "outfit_G5"
    ],
    "image": "/shots/items/legwear_socks_crew_white_01.jpg"
  },
  {
    "id": "legwear_socks_tall_ribbed_white_01",
    "name": "Tall white ribbed socks",
    "slot": "legwear",
    "subcategory": "socks",
    "style_tags": [
      "streetwear_90s",
      "sportswear"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "rib knit"
    ],
    "patterns": [],
    "fit_silhouette": "over-the-calf socks pulled up high",
    "details": [],
    "styling_notes": "shown between hem and shoe",
    "prompt": "tall white ribbed over-the-calf socks pulled up high",
    "negative": [],
    "source_images": [
      "F2"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F2"
    ],
    "image": "/shots/items/legwear_socks_tall_ribbed_white_01.jpg"
  },
  {
    "id": "legwear_socks_tube_gray_01",
    "name": "Gray ribbed tube socks",
    "slot": "legwear",
    "subcategory": "socks",
    "style_tags": [
      "streetwear_90s",
      "sportswear"
    ],
    "colors": [
      "heather gray"
    ],
    "materials": [
      "rib knit"
    ],
    "patterns": [],
    "fit_silhouette": "mid-calf tube socks",
    "details": [],
    "styling_notes": "with chunky sneakers and jorts",
    "prompt": "heather gray ribbed tube socks pulled up to mid-calf",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_right"
    ],
    "image": "/shots/items/legwear_socks_tube_gray_01.jpg"
  },
  {
    "id": "legwear_thigh_highs_lace_top_black_01",
    "name": "Black sheer lace-top thigh-highs",
    "slot": "legwear",
    "subcategory": "thigh_highs",
    "style_tags": [
      "indie_sleaze",
      "gothic",
      "coquette"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "sheer nylon",
      "lace"
    ],
    "patterns": [],
    "fit_silhouette": "thigh-high stockings",
    "details": [
      "wide black lace band at the top"
    ],
    "styling_notes": "with pointed heels",
    "prompt": "sheer black thigh-high stockings with a wide black lace band at the top",
    "negative": [],
    "source_images": [
      "F1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F1"
    ],
    "image": "/shots/items/legwear_thigh_highs_lace_top_black_01.jpg"
  },
  {
    "id": "legwear_thigh_highs_sheer_white_01",
    "name": "Sheer white thigh-high stockings",
    "slot": "legwear",
    "subcategory": "thigh_highs",
    "style_tags": [
      "coquette",
      "preppy_90s",
      "y2k"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "sheer nylon"
    ],
    "patterns": [],
    "fit_silhouette": "thigh-high with an opaque band at the top",
    "details": [
      "sheer leg",
      "solid welt band"
    ],
    "styling_notes": "worn with platform pumps",
    "prompt": "sheer white thigh-high stockings with a solid opaque welt band at the top of the thigh",
    "negative": [],
    "source_images": [
      "D1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_D1"
    ],
    "image": "/shots/items/legwear_thigh_highs_sheer_white_01.jpg"
  },
  {
    "id": "shoes_boots_chelsea_suede_brown_01",
    "name": "Dark brown suede Chelsea boots",
    "slot": "shoes",
    "subcategory": "ankle_boots",
    "style_tags": [
      "rock_moto",
      "leather_tailoring"
    ],
    "colors": [
      "dark brown"
    ],
    "materials": [
      "suede"
    ],
    "patterns": [],
    "fit_silhouette": "ankle-high Chelsea boot, low heel",
    "details": [
      "elastic side gores",
      "almond toe"
    ],
    "styling_notes": "with white socks under cropped jeans",
    "prompt": "dark brown suede ankle Chelsea boots with elastic side panels, almond toe and low heel",
    "negative": [],
    "source_images": [
      "G4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G4"
    ],
    "image": "/shots/items/shoes_boots_chelsea_suede_brown_01.jpg"
  },
  {
    "id": "shoes_boots_desert_suede_tan_01",
    "name": "Tan suede desert boots",
    "slot": "shoes",
    "subcategory": "ankle_boots",
    "style_tags": [
      "vintage_workwear",
      "americana"
    ],
    "colors": [
      "tan",
      "sand"
    ],
    "materials": [
      "suede"
    ],
    "patterns": [],
    "fit_silhouette": "ankle-high lace-up chukka/work boot",
    "details": [
      "crepe-style sole"
    ],
    "styling_notes": "",
    "prompt": "sand tan suede lace-up ankle desert boots with a soft crepe sole",
    "negative": [],
    "source_images": [
      "E3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E3_left"
    ],
    "image": "/shots/items/shoes_boots_desert_suede_tan_01.jpg"
  },
  {
    "id": "shoes_boots_hiker_nubuck_black_01",
    "name": "Black nubuck hiking boots",
    "slot": "shoes",
    "subcategory": "work_boots",
    "style_tags": [
      "vintage_workwear",
      "streetwear_90s"
    ],
    "colors": [
      "black",
      "gold"
    ],
    "materials": [
      "nubuck"
    ],
    "patterns": [],
    "fit_silhouette": "ankle-high lace-up hiker",
    "details": [
      "gold speed hooks",
      "padded collar"
    ],
    "styling_notes": "",
    "prompt": "black nubuck ankle-high lace-up hiking boots with gold speed hooks and a padded collar",
    "negative": [],
    "source_images": [
      "F4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F4"
    ],
    "image": "/shots/items/shoes_boots_hiker_nubuck_black_01.jpg"
  },
  {
    "id": "shoes_boots_knee_high_glossy_black_01",
    "name": "Glossy black knee-high boots",
    "slot": "shoes",
    "subcategory": "knee_boots",
    "style_tags": [
      "y2k",
      "gyaru",
      "preppy"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "glossy leather"
    ],
    "patterns": [],
    "fit_silhouette": "knee-high fitted shaft, low block heel, round toe",
    "details": [
      "sleek shine"
    ],
    "styling_notes": "worn bare-legged with a mini dress",
    "prompt": "sleek glossy black leather knee-high boots with a fitted shaft, rounded toe and low chunky block heel",
    "negative": [],
    "source_images": [
      "B1"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B1"
    ],
    "image": "/shots/items/shoes_boots_knee_high_glossy_black_01.jpg"
  },
  {
    "id": "shoes_boots_platform_tractor_black_01",
    "name": "Black platform tractor-sole boots",
    "slot": "shoes",
    "subcategory": "platform_boots",
    "style_tags": [
      "avant_garde_dark",
      "avant_garde_rick",
      "gothic"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "leather",
      "rubber"
    ],
    "patterns": [],
    "fit_silhouette": "calf-high boot on a huge rounded tractor platform",
    "details": [
      "exaggerated bulbous lug sole",
      "pull-on shaft"
    ],
    "styling_notes": "jeans tucked inside",
    "prompt": "black leather calf-high boots on a huge rounded tractor-tread platform sole, bulbous exaggerated shape, jeans tucked in",
    "negative": [
      "thin sole",
      "pointed toe"
    ],
    "source_images": [
      "E4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E4"
    ],
    "image": "/shots/items/shoes_boots_platform_tractor_black_01.jpg"
  },
  {
    "id": "shoes_boots_pointed_cuban_heel_black_01",
    "name": "Black pointed Cuban-heel boots",
    "slot": "shoes",
    "subcategory": "ankle_boots",
    "style_tags": [
      "leather_tailoring",
      "western",
      "rock_moto"
    ],
    "colors": [
      "black",
      "tan"
    ],
    "materials": [
      "polished leather"
    ],
    "patterns": [],
    "fit_silhouette": "pointed toe ankle boot, short Cuban heel",
    "details": [
      "tan stacked leather sole edge",
      "high polish"
    ],
    "styling_notes": "under leather trousers",
    "prompt": "polished black leather pointed-toe ankle boots with a short Cuban heel and a contrasting tan stacked leather sole",
    "negative": [],
    "source_images": [
      "E1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E1"
    ],
    "image": "/shots/items/shoes_boots_pointed_cuban_heel_black_01.jpg"
  },
  {
    "id": "shoes_boots_slouch_suede_brown_01",
    "name": "Dark brown slouchy suede boots",
    "slot": "shoes",
    "subcategory": "slouch_boots",
    "style_tags": [
      "french_casual",
      "y2k",
      "cozy_layered"
    ],
    "colors": [
      "dark brown"
    ],
    "materials": [
      "suede"
    ],
    "patterns": [],
    "fit_silhouette": "mid-calf slouch shaft with heavy wrinkles, low block heel, rounded toe",
    "details": [
      "soft collapsed shaft",
      "stacked accordion folds"
    ],
    "styling_notes": "worn with leg warmers spilling over the top",
    "prompt": "dark brown soft suede mid-calf slouch boots, shaft collapsing into deep accordion wrinkles, rounded toe, short chunky block heel",
    "negative": [
      "stiff riding boot",
      "stiletto heel"
    ],
    "source_images": [
      "A1"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A1"
    ],
    "image": "/shots/items/shoes_boots_slouch_suede_brown_01.jpg"
  },
  {
    "id": "shoes_cowboy_boots_metal_toe_black_01",
    "name": "Black cowboy boots with silver toe cap",
    "slot": "shoes",
    "subcategory": "cowboy_boots",
    "style_tags": [
      "western",
      "luxury_street"
    ],
    "colors": [
      "black",
      "silver",
      "white"
    ],
    "materials": [
      "polished leather",
      "engraved metal"
    ],
    "patterns": [
      "decorative stitching"
    ],
    "fit_silhouette": "pointed western boot, stacked heel",
    "details": [
      "white decorative western stitching on the vamp",
      "engraved silver metal toe cap",
      "small silver flower and star studs on the heel"
    ],
    "styling_notes": "under flare jeans",
    "prompt": "polished black leather pointed cowboy boots with white decorative western stitching, an engraved silver metal toe cap, and small silver flower and star studs on the stacked heel",
    "negative": [],
    "source_images": [
      "I5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I5"
    ],
    "image": "/shots/items/shoes_cowboy_boots_metal_toe_black_01.jpg"
  },
  {
    "id": "shoes_derby_chunky_black_leather_01",
    "name": "Black chunky leather derby shoes",
    "slot": "shoes",
    "subcategory": "derbies",
    "style_tags": [
      "grunge",
      "punk",
      "streetwear_90s"
    ],
    "colors": [
      "black",
      "yellow"
    ],
    "materials": [
      "smooth leather"
    ],
    "patterns": [],
    "fit_silhouette": "3-eye derby on a chunky air-cushion sole",
    "details": [
      "yellow welt stitching",
      "rounded toe"
    ],
    "styling_notes": "with white socks",
    "prompt": "black smooth leather three-eyelet derby shoes on a chunky air-cushioned sole with yellow welt stitching, rounded toe",
    "negative": [],
    "source_images": [
      "F2",
      "F3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F2",
      "outfit_F3"
    ],
    "image": "/shots/items/shoes_derby_chunky_black_leather_01.jpg"
  },
  {
    "id": "shoes_loafers_bow_chunky_black_patent_01",
    "name": "Black patent bow loafers",
    "slot": "shoes",
    "subcategory": "loafers",
    "style_tags": [
      "japanese_school",
      "coquette",
      "preppy"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "patent leather"
    ],
    "patterns": [],
    "fit_silhouette": "chunky low-heel loafer with slightly lugged sole",
    "details": [
      "small bow or tassel ornament on the vamp",
      "high shine"
    ],
    "styling_notes": "worn with slouch socks",
    "prompt": "glossy black patent leather loafers with a small bow ornament on the vamp, chunky slightly lugged sole and low heel",
    "negative": [],
    "source_images": [
      "B2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B2"
    ],
    "image": "/shots/items/shoes_loafers_bow_chunky_black_patent_01.jpg"
  },
  {
    "id": "shoes_loafers_leather_black_01",
    "name": "Black leather loafers",
    "slot": "shoes",
    "subcategory": "loafers",
    "style_tags": [
      "luxury_street",
      "leather_tailoring"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "polished leather"
    ],
    "patterns": [],
    "fit_silhouette": "slim low loafer",
    "details": [],
    "styling_notes": "under puddled wide pants",
    "prompt": "slim polished black leather loafers with a low heel and almond toe, high shine, peeking under puddled trouser hems",
    "negative": [],
    "source_images": [
      "E3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E3_right"
    ],
    "image": "/shots/items/shoes_loafers_leather_black_01.jpg"
  },
  {
    "id": "shoes_loafers_penny_black_patent_01",
    "name": "Black patent penny loafers",
    "slot": "shoes",
    "subcategory": "loafers",
    "style_tags": [
      "japanese_school",
      "preppy",
      "dark_academia"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "patent leather"
    ],
    "patterns": [],
    "fit_silhouette": "slim low-heeled penny loafer, rounded toe",
    "details": [
      "glossy mirror shine",
      "penny strap across the vamp",
      "low stacked heel"
    ],
    "styling_notes": "worn with white socks",
    "prompt": "glossy black patent leather penny loafers, classic penny strap across the vamp, rounded toe, low stacked heel, mirror-like shine",
    "negative": [],
    "source_images": [
      "A2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A2"
    ],
    "image": "/shots/items/shoes_loafers_penny_black_patent_01.jpg"
  },
  {
    "id": "shoes_loafers_penny_dark_brown_01",
    "name": "Dark brown penny loafers",
    "slot": "shoes",
    "subcategory": "loafers",
    "style_tags": [
      "japanese_school",
      "preppy"
    ],
    "colors": [
      "dark brown"
    ],
    "materials": [
      "polished leather"
    ],
    "patterns": [],
    "fit_silhouette": "classic low-heel penny loafer, rounded toe",
    "details": [
      "penny strap",
      "subtle polish"
    ],
    "styling_notes": "worn with loose socks",
    "prompt": "dark brown polished leather penny loafers, classic penny strap, rounded toe, low heel",
    "negative": [],
    "source_images": [
      "B4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B4"
    ],
    "image": "/shots/items/shoes_loafers_penny_dark_brown_01.jpg"
  },
  {
    "id": "shoes_mary_janes_flat_cream_01",
    "name": "Cream Mary Jane flats",
    "slot": "shoes",
    "subcategory": "mary_janes",
    "style_tags": [
      "coquette",
      "kawaii",
      "classic_lolita"
    ],
    "colors": [
      "cream"
    ],
    "materials": [
      "smooth leather"
    ],
    "patterns": [],
    "fit_silhouette": "flat round-toe Mary Janes with a single strap",
    "details": [
      "thin buckled instep strap"
    ],
    "styling_notes": "peeking under a maxi hem",
    "prompt": "soft cream leather round-toe Mary Jane flats with a single thin buckled strap across the instep",
    "negative": [],
    "source_images": [
      "A3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A3"
    ],
    "image": "/shots/items/shoes_mary_janes_flat_cream_01.jpg"
  },
  {
    "id": "shoes_mary_janes_platform_black_patent_01",
    "name": "Black patent platform Mary Janes",
    "slot": "shoes",
    "subcategory": "mary_janes",
    "style_tags": [
      "gothic_lolita",
      "gothic",
      "y2k"
    ],
    "colors": [
      "black",
      "silver"
    ],
    "materials": [
      "patent leather"
    ],
    "patterns": [],
    "fit_silhouette": "chunky 2-inch platform sole, thick block heel, rounded toe",
    "details": [
      "single buckled ankle strap",
      "glossy finish",
      "silver buckle"
    ],
    "styling_notes": "worn with mismatched knee socks",
    "prompt": "glossy black patent leather platform Mary Jane shoes, chunky two-inch platform sole and thick block heel, rounded toe, single silver-buckled strap",
    "negative": [
      "sneaker sole",
      "pointed toe"
    ],
    "source_images": [
      "A4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A4"
    ],
    "image": "/shots/items/shoes_mary_janes_platform_black_patent_01.jpg"
  },
  {
    "id": "shoes_mary_janes_platform_star_pink_01",
    "name": "Pink patent star platform Mary Janes",
    "slot": "shoes",
    "subcategory": "mary_janes",
    "style_tags": [
      "y2k",
      "coquette",
      "kawaii"
    ],
    "colors": [
      "pastel pink",
      "black"
    ],
    "materials": [
      "patent leather"
    ],
    "patterns": [
      "stars"
    ],
    "fit_silhouette": "towering platform pump with thick block heel, rounded toe",
    "details": [
      "black star prints scattered over the platform and heel",
      "ankle strap with buckle"
    ],
    "styling_notes": "worn with white thigh-highs",
    "prompt": "glossy pastel pink patent platform Mary Jane pumps, chunky block heel and thick platform sprinkled with small black stars, buckled ankle strap",
    "negative": [
      "stiletto",
      "flat"
    ],
    "source_images": [
      "D1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_D1"
    ],
    "image": "/shots/items/shoes_mary_janes_platform_star_pink_01.jpg"
  },
  {
    "id": "shoes_pumps_pointed_buckle_black_01",
    "name": "Black pointed buckle pumps",
    "slot": "shoes",
    "subcategory": "pumps",
    "style_tags": [
      "indie_sleaze",
      "luxury_street"
    ],
    "colors": [
      "black",
      "silver"
    ],
    "materials": [
      "patent leather"
    ],
    "patterns": [],
    "fit_silhouette": "sharp pointed-toe pump, slim heel",
    "details": [
      "silver buckle hardware on the vamp"
    ],
    "styling_notes": "",
    "prompt": "sharp pointed-toe glossy black patent pumps with a slim heel and silver buckle hardware across the vamp",
    "negative": [],
    "source_images": [
      "F1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F1"
    ],
    "image": "/shots/items/shoes_pumps_pointed_buckle_black_01.jpg"
  },
  {
    "id": "shoes_pumps_pointed_stiletto_black_suede_01",
    "name": "Black suede pointed stilettos",
    "slot": "shoes",
    "subcategory": "pumps",
    "style_tags": [
      "coquette",
      "indie_sleaze"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "suede"
    ],
    "patterns": [],
    "fit_silhouette": "classic pointed-toe pump, thin stiletto heel about 3.5 inches",
    "details": [
      "matte suede"
    ],
    "styling_notes": "peeking out under lace-hem jeans",
    "prompt": "matte black suede pointed-toe stiletto pumps with a slim three-and-a-half-inch heel",
    "negative": [],
    "source_images": [
      "A5"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A5"
    ],
    "image": "/shots/items/shoes_pumps_pointed_stiletto_black_suede_01.jpg"
  },
  {
    "id": "shoes_sandals_two_buckle_black_01",
    "name": "Black two-strap buckle sandals",
    "slot": "shoes",
    "subcategory": "sandals",
    "style_tags": [
      "mori_girl",
      "french_casual",
      "dark_academia"
    ],
    "colors": [
      "black",
      "gold"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "flat footbed slide sandal with two wide straps",
    "details": [
      "gold pin buckles",
      "chunky sole"
    ],
    "styling_notes": "worn over white crew socks",
    "prompt": "black leather two-strap slide sandals with gold pin buckles on wide straps and a chunky footbed sole, worn over white socks",
    "negative": [],
    "source_images": [
      "B3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B3"
    ],
    "image": "/shots/items/shoes_sandals_two_buckle_black_01.jpg"
  },
  {
    "id": "shoes_slip_on_bandana_red_01",
    "name": "Red bandana-print slip-on sneakers",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "skater",
      "streetwear_90s",
      "western"
    ],
    "colors": [
      "red",
      "white"
    ],
    "materials": [
      "canvas"
    ],
    "patterns": [
      "bandana print"
    ],
    "fit_silhouette": "low canvas slip-on",
    "details": [
      "white rubber sole",
      "red and white bandana pattern"
    ],
    "styling_notes": "",
    "prompt": "red and white bandana-print canvas slip-on sneakers with white rubber soles",
    "negative": [],
    "source_images": [
      "H4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_H4"
    ],
    "image": "/shots/items/shoes_slip_on_bandana_red_01.jpg"
  },
  {
    "id": "shoes_sneakers_air_runner_black_01",
    "name": "Black air-sole runners",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "uk_drill",
      "sportswear"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "mesh",
      "synthetic"
    ],
    "patterns": [],
    "fit_silhouette": "low running sneaker with visible air units",
    "details": [
      "wavy side overlays",
      "all-black"
    ],
    "styling_notes": "",
    "prompt": "all-black running sneakers with wavy layered side overlays and visible air cushioning",
    "negative": [],
    "source_images": [
      "I4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I4"
    ],
    "image": "/shots/items/shoes_sneakers_air_runner_black_01.jpg"
  },
  {
    "id": "shoes_sneakers_chunky_low_white_01",
    "name": "Chunky white low-top sneakers",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "streetwear_90s",
      "y2k_streetwear",
      "sportswear"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "chunky low-top court sneaker with thick cupsole",
    "details": [
      "perforated toe",
      "white laces"
    ],
    "styling_notes": "peeking out under pooled jeans",
    "prompt": "chunky all-white leather low-top court sneakers with a thick cupsole, perforated toe box and white laces",
    "negative": [
      "running sneaker",
      "thin sole"
    ],
    "source_images": [
      "C4",
      "H5",
      "I3"
    ],
    "render_style_seen": "both",
    "outfit_ids": [
      "outfit_C4",
      "outfit_H5",
      "outfit_I3_green"
    ],
    "image": "/shots/items/shoes_sneakers_chunky_low_white_01.jpg"
  },
  {
    "id": "shoes_sneakers_chunky_white_gray_01",
    "name": "Chunky white skate-runner sneakers",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "y2k_streetwear",
      "streetwear_90s"
    ],
    "colors": [
      "white",
      "light gray"
    ],
    "materials": [
      "leather",
      "mesh"
    ],
    "patterns": [],
    "fit_silhouette": "bulky padded sneaker",
    "details": [
      "thick laces",
      "layered panels"
    ],
    "styling_notes": "",
    "prompt": "bulky white and light gray padded sneakers with layered panels and thick laces",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_right"
    ],
    "image": "/shots/items/shoes_sneakers_chunky_white_gray_01.jpg"
  },
  {
    "id": "shoes_sneakers_court_low_white_01",
    "name": "White low court sneakers",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "sportswear",
      "streetwear_90s",
      "minimal_basics"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "smooth leather"
    ],
    "patterns": [],
    "fit_silhouette": "slim low-profile court shoe",
    "details": [
      "minimal panels",
      "flat cupsole"
    ],
    "styling_notes": "",
    "prompt": "clean white smooth leather low-profile court sneakers with minimal panels and a flat cupsole",
    "negative": [],
    "source_images": [
      "G2"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G2"
    ],
    "image": "/shots/items/shoes_sneakers_court_low_white_01.jpg"
  },
  {
    "id": "shoes_sneakers_high_top_custom_white_01",
    "name": "White custom-drawn high-top sneakers",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "streetwear_90s",
      "hip_hop_2000s"
    ],
    "colors": [
      "white",
      "black"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [
      "hand-drawn graphics"
    ],
    "fit_silhouette": "chunky high-top basketball sneaker",
    "details": [
      "black marker-drawn doodles and spots on one shoe",
      "ankle strap"
    ],
    "styling_notes": "with white socks",
    "prompt": "chunky white leather high-top basketball sneakers, one customized with black hand-drawn marker doodles and spots, ankle strap",
    "negative": [],
    "source_images": [
      "G3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G3"
    ],
    "image": "/shots/items/shoes_sneakers_high_top_custom_white_01.jpg"
  },
  {
    "id": "shoes_sneakers_high_top_white_01",
    "name": "White high-top sneakers",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "streetwear_90s",
      "sportswear"
    ],
    "colors": [
      "white"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "classic high-top basketball sneaker",
    "details": [
      "padded collar",
      "tonal swoosh-style side panel",
      "white laces"
    ],
    "styling_notes": "worn with slouch socks",
    "prompt": "clean white leather high-top basketball sneakers with a padded ankle collar, tonal side panel and white laces",
    "negative": [],
    "source_images": [
      "D2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D2_left"
    ],
    "image": "/shots/items/shoes_sneakers_high_top_white_01.jpg"
  },
  {
    "id": "shoes_sneakers_mesh_netting_cream_01",
    "name": "Cream sneakers with mesh netting",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "streetwear_90s",
      "sportswear"
    ],
    "colors": [
      "white",
      "cream"
    ],
    "materials": [
      "leather",
      "mesh"
    ],
    "patterns": [],
    "fit_silhouette": "mid-cut retro basketball sneaker",
    "details": [
      "mesh netting side panels",
      "wing eyelets",
      "visible air unit"
    ],
    "styling_notes": "",
    "prompt": "white and cream retro mid-cut basketball sneakers with mesh netting side panels, plastic wing eyelets and a visible air heel",
    "negative": [],
    "source_images": [
      "G5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G5"
    ],
    "image": "/shots/items/shoes_sneakers_mesh_netting_cream_01.jpg"
  },
  {
    "id": "shoes_sneakers_metallic_silver_wave_01",
    "name": "Metallic silver wave-line sneakers",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "uk_drill",
      "y2k_streetwear",
      "sportswear"
    ],
    "colors": [
      "metallic silver",
      "white",
      "red"
    ],
    "materials": [
      "metallic synthetic"
    ],
    "patterns": [
      "ripple lines"
    ],
    "fit_silhouette": "sleek low running sneaker with full-length air sole",
    "details": [
      "layered ripple wave lines",
      "reflective piping"
    ],
    "styling_notes": "",
    "prompt": "sleek metallic silver running sneakers with layered water-ripple wave lines, reflective piping and a full-length visible air sole",
    "negative": [],
    "source_images": [
      "I3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I3_yellow"
    ],
    "image": "/shots/items/shoes_sneakers_metallic_silver_wave_01.jpg"
  },
  {
    "id": "shoes_sneakers_platform_high_top_megalug_black_01",
    "name": "Black platform high-top sneakers",
    "slot": "shoes",
    "subcategory": "platform_sneakers",
    "style_tags": [
      "avant_garde_rick",
      "avant_garde_dark",
      "gothic"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "canvas",
      "rubber"
    ],
    "patterns": [],
    "fit_silhouette": "high-top canvas sneaker on a massive lugged platform",
    "details": [
      "huge chunky tooth-tread sole",
      "long loose laces"
    ],
    "styling_notes": "jeans tucked or stacked over",
    "prompt": "black canvas high-top sneakers on a massive chunky tooth-lugged platform rubber sole, long loose black laces",
    "negative": [
      "thin sole",
      "white sole"
    ],
    "source_images": [
      "H3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_H3"
    ],
    "image": "/shots/items/shoes_sneakers_platform_high_top_megalug_black_01.jpg"
  },
  {
    "id": "shoes_sneakers_puffy_skate_black_01",
    "name": "Black puffy skate sneakers",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "hip_hop_2000s",
      "skater",
      "y2k_streetwear"
    ],
    "colors": [
      "black",
      "white"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "bulky padded early-2000s skate shoe",
    "details": [
      "thick padded tongue and collar",
      "chunky white laces"
    ],
    "styling_notes": "under stacked jeans",
    "prompt": "bulky black leather early-2000s skate sneakers with a thick padded tongue and collar and fat white laces",
    "negative": [],
    "source_images": [
      "G1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G1"
    ],
    "image": "/shots/items/shoes_sneakers_puffy_skate_black_01.jpg"
  },
  {
    "id": "shoes_sneakers_running_white_black_lace_01",
    "name": "White retro running sneakers",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "streetwear_90s",
      "sportswear",
      "y2k_streetwear"
    ],
    "colors": [
      "white",
      "black",
      "gray"
    ],
    "materials": [
      "leather",
      "mesh"
    ],
    "patterns": [],
    "fit_silhouette": "chunky 90s runner with visible air-cushion sole",
    "details": [
      "layered overlays",
      "black laces"
    ],
    "styling_notes": "worn with white crew socks",
    "prompt": "chunky white retro 90s running sneakers with layered leather and mesh overlays, a visible air-cushion midsole and contrasting black laces",
    "negative": [],
    "source_images": [
      "D2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D2_right"
    ],
    "image": "/shots/items/shoes_sneakers_running_white_black_lace_01.jpg"
  },
  {
    "id": "shoes_sneakers_sculpted_pod_sole_gray_01",
    "name": "Sculpted gray pod-sole sneakers",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "y2k",
      "sportswear",
      "techwear"
    ],
    "colors": [
      "light gray",
      "cream",
      "silver"
    ],
    "materials": [
      "synthetic",
      "rubber"
    ],
    "patterns": [
      "organic blob panels"
    ],
    "fit_silhouette": "very chunky running shoe, rounded pod outsole",
    "details": [
      "bubbly organic camo-like overlay panels",
      "rows of round cushioning pods on the sole",
      "thin laces"
    ],
    "styling_notes": "worn with slouchy white socks",
    "prompt": "very chunky light gray and cream sculpted running sneakers with bubbly organic blob-shaped overlay panels and rows of round cushioning pods around the outsole",
    "negative": [],
    "source_images": [
      "D5"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D5"
    ],
    "image": "/shots/items/shoes_sneakers_sculpted_pod_sole_gray_01.jpg"
  },
  {
    "id": "shoes_sneakers_teal_low_01",
    "name": "Teal and white low sneakers",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "y2k_streetwear",
      "streetwear_90s"
    ],
    "colors": [
      "teal",
      "white"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "low-top sneaker",
    "details": [
      "teal overlays on white"
    ],
    "styling_notes": "mostly hidden under baggy jeans",
    "prompt": "low-top white leather sneakers with teal green overlays",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_left"
    ],
    "image": "/shots/items/shoes_sneakers_teal_low_01.jpg"
  },
  {
    "id": "shoes_sneakers_tweed_suede_beige_cc_01",
    "name": "Beige tweed and suede luxury sneakers",
    "slot": "shoes",
    "subcategory": "sneakers",
    "style_tags": [
      "luxury_street",
      "streetwear_90s"
    ],
    "colors": [
      "beige",
      "tan",
      "cream",
      "white"
    ],
    "materials": [
      "woven tweed",
      "suede"
    ],
    "patterns": [
      "tweed"
    ],
    "fit_silhouette": "low-top runner on a white sole",
    "details": [
      "woven beige tweed panels",
      "tan suede overlays",
      "interlocking CC logo on the side",
      "cream laces"
    ],
    "styling_notes": "worn with pulled-up white socks",
    "prompt": "low-top Chanel sneakers in beige woven tweed with tan suede overlays, white interlocking CC side logo, cream laces and white sole",
    "prompt_brand_free": "low-top runner sneakers in beige woven tweed with tan suede overlays, small white interlocking-letter side logo, cream laces and white rubber sole",
    "negative": [],
    "source_images": [
      "E2",
      "F6"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_E2",
      "outfit_F6"
    ],
    "image": "/shots/items/shoes_sneakers_tweed_suede_beige_cc_01.jpg"
  },
  {
    "id": "bag_baguette_croc_black_01",
    "name": "Black croc baguette bag",
    "slot": "bag",
    "subcategory": "shoulder_bag",
    "style_tags": [
      "indie_sleaze",
      "y2k",
      "luxury_street"
    ],
    "colors": [
      "black",
      "silver"
    ],
    "materials": [
      "croc-embossed leather"
    ],
    "patterns": [
      "croc texture"
    ],
    "fit_silhouette": "slim baguette tucked under the arm",
    "details": [
      "silver hardware"
    ],
    "styling_notes": "",
    "prompt": "slim black croc-embossed leather baguette shoulder bag with silver hardware tucked under the arm",
    "negative": [],
    "source_images": [
      "F1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F1"
    ],
    "image": "/shots/items/bag_baguette_croc_black_01.jpg"
  },
  {
    "id": "bag_baguette_faux_fur_pink_01",
    "name": "Pink fuzzy baguette bag",
    "slot": "bag",
    "subcategory": "shoulder_bag",
    "style_tags": [
      "y2k",
      "y2k_streetwear",
      "gyaru"
    ],
    "colors": [
      "baby pink"
    ],
    "materials": [
      "faux fur",
      "patent"
    ],
    "patterns": [],
    "fit_silhouette": "small baguette on a short shoulder strap",
    "details": [
      "fluffy fur body",
      "glossy pink strap"
    ],
    "styling_notes": "tucked under the arm",
    "prompt": "small fluffy baby pink faux-fur baguette bag on a short glossy pink shoulder strap",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_left"
    ],
    "image": "/shots/items/bag_baguette_faux_fur_pink_01.jpg"
  },
  {
    "id": "bag_baguette_studded_butterfly_cream_01",
    "name": "Cream studded baguette bag with butterflies",
    "slot": "bag",
    "subcategory": "shoulder_bag",
    "style_tags": [
      "y2k",
      "gyaru",
      "coquette"
    ],
    "colors": [
      "cream",
      "silver",
      "pink"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "small baguette bag on a short shoulder strap",
    "details": [
      "silver studs and grommets",
      "butterfly charms",
      "dangling chains",
      "studded strap"
    ],
    "styling_notes": "tucked under the arm",
    "prompt": "small cream leather baguette shoulder bag covered in silver studs, with dangling butterfly charms and chains on a studded short strap",
    "negative": [],
    "source_images": [
      "C3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C3"
    ],
    "image": "/shots/items/bag_baguette_studded_butterfly_cream_01.jpg"
  },
  {
    "id": "bag_basket_wicker_ribbon_01",
    "name": "Wicker basket bag with ribbon bows",
    "slot": "bag",
    "subcategory": "basket",
    "style_tags": [
      "coquette",
      "mori_girl",
      "vintage_romantic"
    ],
    "colors": [
      "natural tan",
      "white"
    ],
    "materials": [
      "woven wicker",
      "satin ribbon"
    ],
    "patterns": [],
    "fit_silhouette": "bucket-shaped basket with two rounded bamboo-style handles",
    "details": [
      "two large white satin bows tied on the handles"
    ],
    "styling_notes": "carried by the handles at the side",
    "prompt": "natural tan woven wicker basket bag with two arched handles, a big white satin ribbon bow tied at the base of each handle, tails hanging",
    "negative": [],
    "source_images": [
      "A2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A2"
    ],
    "image": "/shots/items/bag_basket_wicker_ribbon_01.jpg"
  },
  {
    "id": "bag_belt_bag_plaid_patch_01",
    "name": "Plaid crossbody belt bag",
    "slot": "bag",
    "subcategory": "belt_bag",
    "style_tags": [
      "streetwear_90s",
      "luxury_street"
    ],
    "colors": [
      "brown",
      "red",
      "cream"
    ],
    "materials": [
      "woven plaid canvas"
    ],
    "patterns": [
      "plaid"
    ],
    "fit_silhouette": "small curved belt bag worn crossbody on the chest",
    "details": [
      "round patch appliques",
      "brown strap"
    ],
    "styling_notes": "slung across the chest over the vest",
    "prompt": "small brown and red plaid canvas belt bag with round patch appliques, worn crossbody across the chest",
    "negative": [],
    "source_images": [
      "G3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_G3"
    ],
    "image": "/shots/items/bag_belt_bag_plaid_patch_01.jpg"
  },
  {
    "id": "bag_crossbody_colorblock_pink_teal_01",
    "name": "Pink and teal colorblock mini bag",
    "slot": "bag",
    "subcategory": "crossbody",
    "style_tags": [
      "y2k_streetwear",
      "streetwear_90s"
    ],
    "colors": [
      "hot pink",
      "teal",
      "mustard yellow",
      "gold"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [
      "colorblock"
    ],
    "fit_silhouette": "small boxy flap bag on a shoulder strap",
    "details": [
      "teal flap over pink body",
      "mustard yellow strap",
      "gold clasp"
    ],
    "styling_notes": "worn on one shoulder at the hip",
    "prompt": "small boxy colorblock shoulder bag with a teal front flap over a hot-pink body, gold clasp and mustard-yellow strap",
    "negative": [],
    "source_images": [
      "C4"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_C4"
    ],
    "image": "/shots/items/bag_crossbody_colorblock_pink_teal_01.jpg"
  },
  {
    "id": "bag_hobo_glossy_black_bow_charm_01",
    "name": "Black glossy leather hobo with bow charm",
    "slot": "bag",
    "subcategory": "shoulder_bag",
    "style_tags": [
      "y2k",
      "coquette",
      "gyaru"
    ],
    "colors": [
      "black",
      "silver"
    ],
    "materials": [
      "glossy leather"
    ],
    "patterns": [],
    "fit_silhouette": "slouchy medium dome-shaped bag on two shoulder straps",
    "details": [
      "buckled strap tabs with silver hardware",
      "silver ribbon-bow charm on a chain"
    ],
    "styling_notes": "held by the handles in front of the legs",
    "prompt": "slouchy glossy black leather hobo shoulder bag with buckled strap tabs, silver hardware and a dangling silver ribbon-bow charm",
    "negative": [],
    "source_images": [
      "B1"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B1"
    ],
    "image": "/shots/items/bag_hobo_glossy_black_bow_charm_01.jpg"
  },
  {
    "id": "bag_messenger_satchel_tan_01",
    "name": "Tan leather messenger satchel",
    "slot": "bag",
    "subcategory": "crossbody",
    "style_tags": [
      "dark_academia",
      "mori_girl",
      "vintage_workwear"
    ],
    "colors": [
      "tan",
      "camel"
    ],
    "materials": [
      "smooth leather"
    ],
    "patterns": [],
    "fit_silhouette": "medium squared satchel on a long crossbody strap",
    "details": [
      "front flap with a single buckle strap",
      "brass hardware"
    ],
    "styling_notes": "worn crossbody at the hip",
    "prompt": "camel tan leather messenger satchel with a front flap fastened by one buckle strap, brass hardware, long thin crossbody strap",
    "negative": [],
    "source_images": [
      "B3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_B3"
    ],
    "image": "/shots/items/bag_messenger_satchel_tan_01.jpg"
  },
  {
    "id": "bag_mini_top_handle_lilac_01",
    "name": "Lilac mini top-handle bag",
    "slot": "bag",
    "subcategory": "mini_bag",
    "style_tags": [
      "y2k",
      "y2k_streetwear",
      "kawaii"
    ],
    "colors": [
      "lilac"
    ],
    "materials": [
      "patent leather"
    ],
    "patterns": [],
    "fit_silhouette": "tiny boxy handbag on a short handle",
    "details": [
      "front flap"
    ],
    "styling_notes": "dangling from the fingers",
    "prompt": "tiny glossy lilac boxy handbag with a front flap and a short top handle",
    "negative": [],
    "source_images": [
      "D2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D2_right"
    ],
    "image": "/shots/items/bag_mini_top_handle_lilac_01.jpg"
  },
  {
    "id": "bag_satchel_flap_crossbody_charcoal_01",
    "name": "Charcoal flap satchel",
    "slot": "bag",
    "subcategory": "crossbody",
    "style_tags": [
      "dark_academia",
      "french_casual"
    ],
    "colors": [
      "charcoal",
      "black"
    ],
    "materials": [
      "matte leather"
    ],
    "patterns": [],
    "fit_silhouette": "medium boxy satchel on a thin long strap",
    "details": [
      "fold-over front flap",
      "structured rectangular body"
    ],
    "styling_notes": "worn on the shoulder, resting at the hip",
    "prompt": "matte charcoal black leather flap satchel bag, boxy rectangular shape, fold-over front flap, thin long shoulder strap, resting at the hip",
    "negative": [],
    "source_images": [
      "A1"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A1"
    ],
    "image": "/shots/items/bag_satchel_flap_crossbody_charcoal_01.jpg"
  },
  {
    "id": "bag_satchel_top_handle_red_01",
    "name": "Red structured top-handle satchel",
    "slot": "bag",
    "subcategory": "top_handle",
    "style_tags": [
      "coquette",
      "vintage_romantic",
      "preppy"
    ],
    "colors": [
      "bright red",
      "silver"
    ],
    "materials": [
      "smooth leather"
    ],
    "patterns": [],
    "fit_silhouette": "structured rectangular handbag with a single arched handle",
    "details": [
      "front flap with silver turn-lock",
      "rivet studs along the strap tabs"
    ],
    "styling_notes": "held in front with both hands",
    "prompt": "glossy bright red structured leather top-handle satchel, rectangular body, arched handle, front flap with a silver turn-lock clasp and small silver rivets",
    "negative": [],
    "source_images": [
      "A3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A3"
    ],
    "image": "/shots/items/bag_satchel_top_handle_red_01.jpg"
  },
  {
    "id": "bag_shoulder_faux_fur_brown_01",
    "name": "Brown faux fur shoulder bag",
    "slot": "bag",
    "subcategory": "shoulder_bag",
    "style_tags": [
      "y2k",
      "grunge",
      "coquette"
    ],
    "colors": [
      "brown",
      "olive"
    ],
    "materials": [
      "shaggy faux fur",
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "soft slouchy medium bag on a long olive leather strap",
    "details": [
      "long-pile fur body"
    ],
    "styling_notes": "hung on the shoulder with a plush charm attached",
    "prompt": "slouchy brown shaggy faux-fur shoulder bag on a long olive-brown leather strap",
    "negative": [],
    "source_images": [
      "B5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_B5"
    ],
    "image": "/shots/items/bag_shoulder_faux_fur_brown_01.jpg"
  },
  {
    "id": "bag_shoulder_leather_brown_01",
    "name": "Brown leather shoulder bag",
    "slot": "bag",
    "subcategory": "shoulder_bag",
    "style_tags": [
      "streetwear_90s",
      "vintage_workwear"
    ],
    "colors": [
      "cognac brown"
    ],
    "materials": [
      "leather"
    ],
    "patterns": [],
    "fit_silhouette": "medium soft slouch bag",
    "details": [],
    "styling_notes": "on the shoulder behind the back",
    "prompt": "medium slouchy cognac brown smooth leather shoulder bag with a single short strap, soft unstructured body",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D3_right"
    ],
    "image": "/shots/items/bag_shoulder_leather_brown_01.jpg"
  },
  {
    "id": "bag_sling_nylon_black_01",
    "name": "Black nylon sling bag",
    "slot": "bag",
    "subcategory": "sling",
    "style_tags": [
      "sportswear",
      "techwear",
      "streetwear_90s"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "nylon"
    ],
    "patterns": [],
    "fit_silhouette": "compact crossbody sling worn across the back",
    "details": [
      "cord strap",
      "zip pockets"
    ],
    "styling_notes": "",
    "prompt": "compact black nylon crossbody sling bag with zip pockets, worn across the back",
    "negative": [],
    "source_images": [
      "F6"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F6"
    ],
    "image": "/shots/items/bag_sling_nylon_black_01.jpg"
  },
  {
    "id": "bag_tote_canvas_cream_01",
    "name": "Cream canvas tote",
    "slot": "bag",
    "subcategory": "tote",
    "style_tags": [
      "minimal_basics",
      "french_casual"
    ],
    "colors": [
      "cream"
    ],
    "materials": [
      "cotton canvas"
    ],
    "patterns": [],
    "fit_silhouette": "flat rectangular tote on long handles",
    "details": [],
    "styling_notes": "hung on the shoulder behind the arm",
    "prompt": "plain cream cotton canvas tote bag with long shoulder handles",
    "negative": [],
    "source_images": [
      "D2"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_D2_left"
    ],
    "image": "/shots/items/bag_tote_canvas_cream_01.jpg"
  },
  {
    "id": "bag_tote_ruffle_trim_black_01",
    "name": "Black ruffle-trim tote",
    "slot": "bag",
    "subcategory": "tote",
    "style_tags": [
      "coquette",
      "gothic_lolita"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "canvas"
    ],
    "patterns": [],
    "fit_silhouette": "large soft rectangular tote with thin handles",
    "details": [
      "gathered ruffle trim around the opening"
    ],
    "styling_notes": "carried low at the side",
    "prompt": "large soft black canvas tote bag with a gathered ruffle frill around the top opening and thin shoulder handles",
    "negative": [],
    "source_images": [
      "A5"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_A5"
    ],
    "image": "/shots/items/bag_tote_ruffle_trim_black_01.jpg"
  },
  {
    "id": "accessory_binder_faux_fur_pink_01",
    "name": "Pink fuzzy patch binder",
    "slot": "accessory",
    "subcategory": "carried_prop",
    "style_tags": [
      "y2k",
      "preppy_90s",
      "kawaii"
    ],
    "colors": [
      "baby pink",
      "rainbow"
    ],
    "materials": [
      "faux fur"
    ],
    "patterns": [],
    "fit_silhouette": "notebook binder carried against the hip",
    "details": [
      "fluffy pink fur cover",
      "rainbow patch",
      "GIRL POWER patch",
      "assorted pins"
    ],
    "styling_notes": "carried under the arm",
    "prompt": "fluffy baby pink faux-fur covered binder decorated with a rainbow patch, a GIRL POWER patch and small pins, carried under the arm",
    "negative": [],
    "source_images": [
      "D1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_D1"
    ],
    "image": "/shots/items/accessory_binder_faux_fur_pink_01.jpg"
  },
  {
    "id": "accessory_chain_cross_filigree_charm_01",
    "name": "Silver filigree cross hip charm",
    "slot": "accessory",
    "subcategory": "chain_charm",
    "style_tags": [
      "gothic",
      "gothic_lolita",
      "punk"
    ],
    "colors": [
      "silver"
    ],
    "materials": [
      "metal"
    ],
    "patterns": [],
    "fit_silhouette": "large ornate cross hanging from an O-ring off the skirt zip",
    "details": [
      "gothic filigree cross",
      "big O-ring",
      "short chain"
    ],
    "styling_notes": "dangles at the hip",
    "prompt": "large ornate silver gothic filigree cross pendant hanging from a big silver O-ring and chain at the hip",
    "negative": [],
    "source_images": [
      "C1"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_C1"
    ],
    "image": "/shots/items/accessory_chain_cross_filigree_charm_01.jpg"
  },
  {
    "id": "accessory_corsage_rose_shoulder_01",
    "name": "Dusty rose shoulder corsage",
    "slot": "accessory",
    "subcategory": "corsage",
    "style_tags": [
      "romantic_couture",
      "coquette"
    ],
    "colors": [
      "dusty rose",
      "sage green"
    ],
    "materials": [
      "silk flower",
      "beads"
    ],
    "patterns": [],
    "fit_silhouette": "large single rose on the shoulder",
    "details": [
      "sage leaves",
      "dangling bead strands"
    ],
    "styling_notes": "pinned on the shoulder strap",
    "prompt": "large dusty rose silk rose corsage with sage-green leaves and short dangling bead strands pinned at the shoulder",
    "negative": [],
    "source_images": [
      "D4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_D4"
    ],
    "image": "/shots/items/accessory_corsage_rose_shoulder_01.jpg"
  },
  {
    "id": "accessory_keychain_star_gold_01",
    "name": "Gold star belt-loop charm",
    "slot": "accessory",
    "subcategory": "keychain",
    "style_tags": [
      "y2k_streetwear",
      "streetwear_90s",
      "kawaii"
    ],
    "colors": [
      "gold",
      "yellow"
    ],
    "materials": [
      "metal"
    ],
    "patterns": [],
    "fit_silhouette": "small star charm hanging from the belt loop",
    "details": [
      "short chain clip"
    ],
    "styling_notes": "clipped to a front belt loop",
    "prompt": "small gold star charm keychain dangling from a front belt loop on a short chain",
    "negative": [],
    "source_images": [
      "C4",
      "D3"
    ],
    "render_style_seen": "illustration",
    "outfit_ids": [
      "outfit_C4",
      "outfit_D3_left"
    ],
    "image": "/shots/items/accessory_keychain_star_gold_01.jpg"
  },
  {
    "id": "accessory_plush_keychain_kitty_01",
    "name": "White kitty plush bag charm",
    "slot": "accessory",
    "subcategory": "bag_charm",
    "style_tags": [
      "kawaii",
      "y2k",
      "coquette"
    ],
    "colors": [
      "white",
      "pink",
      "brown"
    ],
    "materials": [
      "plush"
    ],
    "patterns": [
      "houndstooth"
    ],
    "fit_silhouette": "palm-size plush hanging from a bag strap",
    "details": [
      "pink bow on the ear",
      "tiny houndstooth outfit"
    ],
    "styling_notes": "clipped to the shoulder bag strap",
    "prompt": "small fluffy white cartoon cat plush keychain with a pink bow on one ear and a tiny brown houndstooth dress, dangling from a bag strap",
    "negative": [],
    "source_images": [
      "B5"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_B5"
    ],
    "image": "/shots/items/accessory_plush_keychain_kitty_01.jpg"
  },
  {
    "id": "accessory_wallet_chain_silver_01",
    "name": "Silver wallet chain",
    "slot": "accessory",
    "subcategory": "wallet_chain",
    "style_tags": [
      "punk",
      "grunge",
      "streetwear_90s"
    ],
    "colors": [
      "silver"
    ],
    "materials": [
      "metal"
    ],
    "patterns": [],
    "fit_silhouette": "single chain looped from belt loop to back pocket",
    "details": [],
    "styling_notes": "",
    "prompt": "silver wallet chain looping from a front belt loop around to the back pocket",
    "negative": [],
    "source_images": [
      "F3"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_F3"
    ],
    "image": "/shots/items/accessory_wallet_chain_silver_01.jpg"
  },
  {
    "id": "accessory_watch_digital_black_01",
    "name": "Black digital sports watch",
    "slot": "accessory",
    "subcategory": "watch",
    "style_tags": [
      "sportswear",
      "uk_drill"
    ],
    "colors": [
      "black"
    ],
    "materials": [
      "resin"
    ],
    "patterns": [],
    "fit_silhouette": "chunky wrist watch",
    "details": [],
    "styling_notes": "",
    "prompt": "chunky black matte resin digital sports watch with a wide strap and square face",
    "negative": [],
    "source_images": [
      "I4"
    ],
    "render_style_seen": "photo",
    "outfit_ids": [
      "outfit_I4"
    ],
    "image": "/shots/items/accessory_watch_digital_black_01.jpg"
  }
];

export const WARDROBE_OUTFITS: WardrobeOutfit[] = [
  {
    "id": "outfit_A1",
    "name": "Cream Sherpa & Stripes",
    "style_tags": [
      "french_casual",
      "kawaii",
      "y2k",
      "cozy_layered",
      "dark_academia"
    ],
    "slots": {
      "outerwear": [
        "outerwear_jacket_sherpa_shaggy_cream_01"
      ],
      "layer_top": [],
      "top": [
        "top_longsleeve_breton_stripe_bw_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_bike_shorts_black_lace_hem_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_leg_warmers_chunky_cream_01"
      ],
      "shoes": [
        "shoes_boots_slouch_suede_brown_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [
        "neckwear_collar_ribbon_tie_brown_01"
      ],
      "jewelry": [],
      "bag": [
        "bag_satchel_flap_crossbody_charcoal_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "outerwear_jacket_sherpa_shaggy_cream_01",
      "top_longsleeve_breton_stripe_bw_01",
      "bottom_bike_shorts_black_lace_hem_01",
      "legwear_leg_warmers_chunky_cream_01",
      "shoes_boots_slouch_suede_brown_01",
      "neckwear_collar_ribbon_tie_brown_01",
      "bag_satchel_flap_crossbody_charcoal_01"
    ],
    "prompt": "oversized cream ivory shaggy curly sherpa fleece jacket, plush textured teddy pile, wide shawl collar, big patch pockets, dropped shoulders, voluminous sleeves ending in ribbed knit cuffs, worn open; fitted long-sleeve cotton jersey top with bold even black and white horizontal Breton stripes, about one inch wide, crew neckline; snug black stretch bike shorts ending at mid-thigh, finished with a delicate scalloped blush-pink lace trim at the leg hem; thick cream chunky rib-knit leg warmers scrunched and bunched over the tops of boots, slouchy stacked folds around the calves; dark brown soft suede mid-calf slouch boots, shaft collapsing into deep accordion wrinkles, rounded toe, short chunky block heel; dark chocolate brown pointed shirt collar with a long skinny brown satin ribbon tied in a small bow at the throat, tails hanging down the chest; matte charcoal black leather flap satchel bag, boxy rectangular shape, fold-over front flap, thin long shoulder strap, resting at the hip",
    "negative": [
      "smooth faux fur",
      "fitted cut",
      "zip front",
      "stiff riding boot",
      "stiletto heel"
    ],
    "source_images": [
      "A1"
    ],
    "image": "/shots/outfits/outfit_A1.jpg",
    "user_created": false
  },
  {
    "id": "outfit_A2",
    "name": "Navy Pinafore Picnic",
    "style_tags": [
      "coquette",
      "vintage_romantic",
      "japanese_school",
      "mori_girl",
      "classic_lolita"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_blouse_sheer_ruffle_blue_01"
      ],
      "dress_onepiece": [
        "dress_pinafore_maxi_ruffle_navy_01"
      ],
      "bottom": [],
      "belt_waist": [],
      "legwear": [
        "legwear_socks_crew_white_01"
      ],
      "shoes": [
        "shoes_loafers_penny_black_patent_01"
      ],
      "headwear": [
        "headwear_ribbon_hair_ties_black_01"
      ],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [
        "bag_basket_wicker_ribbon_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "top_blouse_sheer_ruffle_blue_01",
      "dress_pinafore_maxi_ruffle_navy_01",
      "legwear_socks_crew_white_01",
      "shoes_loafers_penny_black_patent_01",
      "headwear_ribbon_hair_ties_black_01",
      "bag_basket_wicker_ribbon_01"
    ],
    "prompt": "sheer powder-blue chiffon blouse with a high frilled stand collar, long translucent balloon sleeves gathered into ruffled cuffs at the wrists; deep navy crinkled cotton maxi pinafore dress, thin shoulder straps, ruffled square neckline, fitted bodice, very full gathered ankle-length skirt with a ruffled hem; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; glossy black patent leather penny loafers, classic penny strap across the vamp, rounded toe, low stacked heel, mirror-like shine; small glossy black satin ribbon bows tied at the base of each pigtail, loops and tails hanging loosely; natural tan woven wicker basket bag with two arched handles, a big white satin ribbon bow tied at the base of each handle, tails hanging",
    "negative": [],
    "source_images": [
      "A2"
    ],
    "image": "/shots/outfits/outfit_A2.jpg",
    "user_created": false
  },
  {
    "id": "outfit_A3",
    "name": "Red Knit & Polka Maxi",
    "style_tags": [
      "coquette",
      "kawaii",
      "vintage_romantic",
      "classic_lolita",
      "mori_girl"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_knit_puff_sleeve_peter_pan_red_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_skirt_maxi_polkadot_tiered_cream_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_mary_janes_flat_cream_01"
      ],
      "headwear": [
        "headwear_headband_lace_ruffle_white_01"
      ],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [
        "bag_satchel_top_handle_red_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "top_knit_puff_sleeve_peter_pan_red_01",
      "bottom_skirt_maxi_polkadot_tiered_cream_01",
      "shoes_mary_janes_flat_cream_01",
      "headwear_headband_lace_ruffle_white_01",
      "bag_satchel_top_handle_red_01"
    ],
    "prompt": "fitted tomato-red vertical rib-knit short-sleeve top with puffed sleeves and a rounded white Peter Pan collar trimmed in scalloped lace; high-waisted ankle-length cream skirt with tiny black polka dots, a double ruffled tier around the hips, full flowing body ending in a wide scalloped eyelet lace hem; soft cream leather round-toe Mary Jane flats with a single thin buckled strap across the instep; white frilled lace ruffle headband sitting across the crown of the head, gathered lace edging like a maid or Lolita headdress; glossy bright red structured leather top-handle satchel, rectangular body, arched handle, front flap with a silver turn-lock clasp and small silver rivets",
    "negative": [],
    "source_images": [
      "A3"
    ],
    "image": "/shots/outfits/outfit_A3.jpg",
    "user_created": false
  },
  {
    "id": "outfit_A4",
    "name": "Gothic Lolita Bloomers",
    "style_tags": [
      "gothic_lolita",
      "gothic",
      "classic_lolita",
      "coquette",
      "kawaii"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_blouse_victorian_lace_bib_white_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_bloomer_shorts_suspender_black_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_knee_sock_cross_black_01",
        "legwear_sock_ribbon_lace_up_red_01"
      ],
      "shoes": [
        "shoes_mary_janes_platform_black_patent_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_blouse_victorian_lace_bib_white_01",
      "bottom_bloomer_shorts_suspender_black_01",
      "legwear_knee_sock_cross_black_01",
      "legwear_sock_ribbon_lace_up_red_01",
      "shoes_mary_janes_platform_black_patent_01"
    ],
    "prompt": "white Victorian cotton blouse with a high ruffled stand collar, wide lace bib yoke across the chest, ruffled shoulder flounces, full bishop sleeves ending in deep eyelet-lace ruffled cuffs; black high-waisted puffy bloomer shorts with a wide structured waistband, pumpkin-shaped legs gathered into frilled cuffs, thin black suspenders, long black ribbon ties dangling at the hips; opaque black knee-high socks with a small silver embroidered gothic cross on the outer calf; sheer crimson red mid-calf sock wrapped with red satin ribbon criss-crossing up the calf like ballet-shoe lacing, bow tails hanging loose; glossy black patent leather platform Mary Jane shoes, chunky two-inch platform sole and thick block heel, rounded toe, single silver-buckled strap",
    "negative": [
      "sneaker sole",
      "pointed toe"
    ],
    "source_images": [
      "A4"
    ],
    "image": "/shots/outfits/outfit_A4.jpg",
    "user_created": false
  },
  {
    "id": "outfit_A5",
    "name": "Ruffles & Lace-Hem Denim",
    "style_tags": [
      "coquette",
      "gothic_lolita",
      "indie_sleaze",
      "kawaii",
      "vintage_romantic"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_blouse_cascade_ruffle_white_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_straight_lace_hem_lightwash_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_pumps_pointed_stiletto_black_suede_01"
      ],
      "headwear": [
        "headwear_ribbon_bows_white_01"
      ],
      "eyewear": [],
      "neckwear": [
        "neckwear_choker_ribbon_bow_black_01"
      ],
      "jewelry": [],
      "bag": [
        "bag_tote_ruffle_trim_black_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "top_blouse_cascade_ruffle_white_01",
      "bottom_jeans_straight_lace_hem_lightwash_01",
      "shoes_pumps_pointed_stiletto_black_suede_01",
      "headwear_ribbon_bows_white_01",
      "neckwear_choker_ribbon_bow_black_01",
      "bag_tote_ruffle_trim_black_01"
    ],
    "prompt": "soft white cotton blouse covered in tiers of cascading ruffles down the front, ruffled shoulders, voluminous balloon sleeves with frilled cuffs, gathered peplum hem; light-wash blue straight-leg jeans, full length, finished with a band of white scalloped lace trim around each hem; matte black suede pointed-toe stiletto pumps with a slim three-and-a-half-inch heel; white satin ribbon bows tied high on each twin tail, long ribbon tails trailing down; thin black satin ribbon tied snug around the neck as a choker, small bow at the front with two long tails falling down the chest; large soft black canvas tote bag with a gathered ruffle frill around the top opening and thin shoulder handles",
    "negative": [],
    "source_images": [
      "A5"
    ],
    "image": "/shots/outfits/outfit_A5.jpg",
    "user_created": false
  },
  {
    "id": "outfit_B1",
    "name": "Coral Plaid Pinafore",
    "style_tags": [
      "preppy",
      "y2k",
      "coquette",
      "gyaru",
      "japanese_school"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_blouse_puff_sleeve_collared_skyblue_01"
      ],
      "dress_onepiece": [
        "dress_pinafore_plaid_belted_coral_01"
      ],
      "bottom": [],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_boots_knee_high_glossy_black_01"
      ],
      "headwear": [
        "headwear_ribbon_hair_ties_black_01"
      ],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [
        "bag_hobo_glossy_black_bow_charm_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "top_blouse_puff_sleeve_collared_skyblue_01",
      "dress_pinafore_plaid_belted_coral_01",
      "shoes_boots_knee_high_glossy_black_01",
      "headwear_ribbon_hair_ties_black_01",
      "bag_hobo_glossy_black_bow_charm_01"
    ],
    "prompt": "pale sky-blue cotton button-front blouse with a sharp pointed collar, very full puffed long sleeves gathered into long fitted cuffs; sleeveless coral-red and pink tartan plaid pinafore mini dress, fitted V-neck bodice, matching self-fabric waist belt with a large black square buckle, short pleated flared skirt; sleek glossy black leather knee-high boots with a fitted shaft, rounded toe and low chunky block heel; small glossy black satin ribbon bows tied at the base of each pigtail, loops and tails hanging loosely; slouchy glossy black leather hobo shoulder bag with buckled strap tabs, silver hardware and a dangling silver ribbon-bow charm",
    "negative": [],
    "source_images": [
      "B1"
    ],
    "image": "/shots/outfits/outfit_B1.jpg",
    "user_created": false
  },
  {
    "id": "outfit_B2",
    "name": "Windbreaker Schoolgirl",
    "style_tags": [
      "japanese_school",
      "preppy",
      "sportswear",
      "streetwear_90s",
      "coquette"
    ],
    "slots": {
      "outerwear": [
        "outerwear_windbreaker_colorblock_navy_white_01"
      ],
      "layer_top": [],
      "top": [],
      "dress_onepiece": [],
      "bottom": [
        "bottom_skirt_pleated_tennis_white_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_loose_socks_slouch_white_01"
      ],
      "shoes": [
        "shoes_loafers_bow_chunky_black_patent_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "outerwear_windbreaker_colorblock_navy_white_01",
      "bottom_skirt_pleated_tennis_white_01",
      "legwear_loose_socks_slouch_white_01",
      "shoes_loafers_bow_chunky_black_patent_01"
    ],
    "prompt": "very oversized navy nylon windbreaker with white curved shoulder panels, tall funnel neck zipped to the chin, small oval chest patch, huge balloon sleeves gathered at the wrists; crisp white knife-pleated tennis mini skirt, short flared A-line; thick white ribbed slouch socks pushed down into loose bunched rings around the lower calf, Japanese loose-socks style; glossy black patent leather loafers with a small bow ornament on the vamp, chunky slightly lugged sole and low heel",
    "negative": [],
    "source_images": [
      "B2"
    ],
    "image": "/shots/outfits/outfit_B2.jpg",
    "user_created": false
  },
  {
    "id": "outfit_B3",
    "name": "Tartan Maxi & Satchel",
    "style_tags": [
      "dark_academia",
      "mori_girl",
      "french_casual",
      "japanese_school",
      "minimal_basics"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_blouse_oversized_round_collar_white_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_skirt_maxi_tartan_blue_green_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_socks_crew_white_01"
      ],
      "shoes": [
        "shoes_sandals_two_buckle_black_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [
        "bag_messenger_satchel_tan_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "top_blouse_oversized_round_collar_white_01",
      "bottom_skirt_maxi_tartan_blue_green_01",
      "legwear_socks_crew_white_01",
      "shoes_sandals_two_buckle_black_01",
      "bag_messenger_satchel_tan_01"
    ],
    "prompt": "oversized white cotton blouse with a small rounded collar, dropped shoulders, puffy three-quarter sleeves ending in ruffled cuffs, tucked in; high-waisted ankle-length pleated wool maxi skirt in a navy, teal and forest-green tartan with a thin mustard-yellow overcheck; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; black leather two-strap slide sandals with gold pin buckles on wide straps and a chunky footbed sole, worn over white socks; camel tan leather messenger satchel with a front flap fastened by one buckle strap, brass hardware, long thin crossbody strap",
    "negative": [],
    "source_images": [
      "B3"
    ],
    "image": "/shots/outfits/outfit_B3.jpg",
    "user_created": false
  },
  {
    "id": "outfit_B4",
    "name": "Winter JK Uniform",
    "style_tags": [
      "japanese_school",
      "preppy",
      "dark_academia",
      "gyaru",
      "y2k"
    ],
    "slots": {
      "outerwear": [
        "outerwear_blazer_school_navy_01"
      ],
      "layer_top": [],
      "top": [
        "top_sweater_vneck_long_pink_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_skirt_pleated_micro_gray_plaid_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_loose_socks_cable_knit_white_01"
      ],
      "shoes": [
        "shoes_loafers_penny_dark_brown_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [
        "neckwear_scarf_plaid_fringe_camel_01"
      ],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "outerwear_blazer_school_navy_01",
      "top_sweater_vneck_long_pink_01",
      "bottom_skirt_pleated_micro_gray_plaid_01",
      "legwear_loose_socks_cable_knit_white_01",
      "shoes_loafers_penny_dark_brown_01",
      "neckwear_scarf_plaid_fringe_camel_01"
    ],
    "prompt": "slate navy single-breasted Japanese school uniform blazer, notched lapels, hip length, small red buttons on the cuffs; salmon-pink fine rib-knit V-neck school sweater, long and loose, ribbed hem showing below the blazer and sleeves peeking out over the hands; charcoal gray plaid knife-pleated school uniform micro mini skirt with crisp pleats; extra-thick white chunky cable-knit loose socks slouched in heavy rolls from the ankle up the calf, 90s Japanese gyaru style; dark brown polished leather penny loafers, classic penny strap, rounded toe, low heel; long wide camel and peach plaid brushed-wool scarf wrapped high around the neck up over the chin, fringed ends hanging down the chest",
    "negative": [],
    "source_images": [
      "B4"
    ],
    "image": "/shots/outfits/outfit_B4.jpg",
    "user_created": false
  },
  {
    "id": "outfit_B5",
    "name": "Pink Mohair & Tie",
    "style_tags": [
      "grunge",
      "coquette",
      "y2k",
      "dark_academia",
      "preppy"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [
        "layer_top_shirt_pintuck_collared_white_01"
      ],
      "top": [
        "top_sweater_mohair_deep_v_pink_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_skirt_bubble_mini_brown_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [],
      "headwear": [],
      "eyewear": [],
      "neckwear": [
        "neckwear_necktie_stripe_brown_01"
      ],
      "jewelry": [
        "jewelry_necklace_layered_rosary_pearl_key_01"
      ],
      "bag": [
        "bag_shoulder_faux_fur_brown_01"
      ],
      "accessory": [
        "accessory_plush_keychain_kitty_01"
      ]
    },
    "item_ids": [
      "layer_top_shirt_pintuck_collared_white_01",
      "top_sweater_mohair_deep_v_pink_01",
      "bottom_skirt_bubble_mini_brown_01",
      "neckwear_necktie_stripe_brown_01",
      "jewelry_necklace_layered_rosary_pearl_key_01",
      "bag_shoulder_faux_fur_brown_01",
      "accessory_plush_keychain_kitty_01"
    ],
    "prompt": "crisp white cotton collared shirt with fine vertical pintuck pleats down the front, pointed collar spread over a sweater, shirttail peeking out at the hem; oversized dusty-pink fuzzy mohair sweater in a loose see-through open knit with ladder holes, very wide plunging V neckline, long slouchy sleeves; dark chocolate brown puffy bubble-hem mini skirt with a soft gathered balloon silhouette; chocolate brown silk necktie with thin gold diagonal repp stripes, knotted loosely and hanging over the sweater; layered antique silver necklaces stacked at the collar: rosary bead chain, pearl strand, small cross pendant and an ornate skeleton-key pendant; slouchy brown shaggy faux-fur shoulder bag on a long olive-brown leather strap; small fluffy white cartoon cat plush keychain with a pink bow on one ear and a tiny brown houndstooth dress, dangling from a bag strap",
    "negative": [],
    "source_images": [
      "B5"
    ],
    "image": "/shots/outfits/outfit_B5.jpg",
    "user_created": false
  },
  {
    "id": "outfit_C1",
    "name": "Gothic Leather Micro",
    "style_tags": [
      "gothic",
      "punk",
      "y2k",
      "gothic_lolita"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_bralette_lace_cross_chain_black_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_skirt_pleated_micro_faux_leather_black_01"
      ],
      "belt_waist": [
        "belt_waist_grommet_studded_black_01"
      ],
      "legwear": [],
      "shoes": [],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": [
        "accessory_chain_cross_filigree_charm_01"
      ]
    },
    "item_ids": [
      "top_bralette_lace_cross_chain_black_01",
      "bottom_skirt_pleated_micro_faux_leather_black_01",
      "belt_waist_grommet_studded_black_01",
      "accessory_chain_cross_filigree_charm_01"
    ],
    "prompt": "black scalloped floral lace cropped top with thin silver chain straps and small dangling silver cross charms; black glossy faux-leather low-rise micro mini skirt with a wide smooth hip yoke, short sharp knife pleats and a silver side zip; wide black leather belt with rows of silver grommets and round studs, large silver rounded buckle, slung low on the hips with the long tail hanging down; large ornate silver gothic filigree cross pendant hanging from a big silver O-ring and chain at the hip",
    "negative": [],
    "source_images": [
      "C1"
    ],
    "image": "/shots/outfits/outfit_C1.jpg",
    "user_created": false
  },
  {
    "id": "outfit_C2",
    "name": "Painted Belt Bustier",
    "style_tags": [
      "avant_garde_diy",
      "punk",
      "y2k"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_bustier_stacked_belts_multicolor_01"
      ],
      "dress_onepiece": [],
      "bottom": [],
      "belt_waist": [
        "belt_waist_draped_chains_silver_01"
      ],
      "legwear": [],
      "shoes": [],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_bustier_stacked_belts_multicolor_01",
      "belt_waist_draped_chains_silver_01"
    ],
    "prompt": "strapless bustier built from about fifteen distressed painted leather belts stacked tightly from bust to hips, hot pink, lime, cobalt, yellow, red, lilac and black, tarnished buckles and grommets; multiple silver curb chains swagged in loose loops from the hips across the thighs, layered drape lengths",
    "negative": [],
    "source_images": [
      "C2"
    ],
    "image": "/shots/outfits/outfit_C2.jpg",
    "user_created": false
  },
  {
    "id": "outfit_C3",
    "name": "Pink Bow Hoodie Y2K",
    "style_tags": [
      "y2k",
      "coquette",
      "gyaru",
      "kawaii",
      "grunge"
    ],
    "slots": {
      "outerwear": [
        "outerwear_hoodie_ribbon_bow_pink_01"
      ],
      "layer_top": [],
      "top": [
        "top_cami_floral_lace_bow_cream_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_skirt_denim_cargo_pleated_mini_black_01"
      ],
      "belt_waist": [
        "belt_waist_rhinestone_star_buckle_pink_01",
        "belt_waist_chain_charms_heart_butterfly_01"
      ],
      "legwear": [],
      "shoes": [],
      "headwear": [],
      "eyewear": [],
      "neckwear": [
        "neckwear_choker_velvet_heart_pink_01"
      ],
      "jewelry": [
        "jewelry_necklace_layered_butterfly_silver_01"
      ],
      "bag": [
        "bag_baguette_studded_butterfly_cream_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "outerwear_hoodie_ribbon_bow_pink_01",
      "top_cami_floral_lace_bow_cream_01",
      "bottom_skirt_denim_cargo_pleated_mini_black_01",
      "belt_waist_rhinestone_star_buckle_pink_01",
      "belt_waist_chain_charms_heart_butterfly_01",
      "neckwear_choker_velvet_heart_pink_01",
      "jewelry_necklace_layered_butterfly_silver_01",
      "bag_baguette_studded_butterfly_cream_01"
    ],
    "prompt": "cropped dusty pink soft knit zip-up hoodie with rows of small cream satin ribbon bows sewn down each sleeve, long bunched sleeves, worn open off the shoulders; fitted cropped cream rib-knit camisole with a tiny pink ditsy floral print, lace-trimmed sweetheart neckline, thin straps and a pink ribbon bow at center front; washed charcoal black denim low-rise pleated micro mini skirt with flap cargo pockets, snap buttons and a frayed raw hem; wide blush-pink leather belt studded with rhinestones and a big ornate silver star buckle, slung low on the hips; draped silver chain belt across the hips with dangling heart, cross and rhinestone butterfly charms; dusty pink velvet ribbon choker with a small silver heart charm at the center; two or three fine layered silver chains with a sparkly rhinestone butterfly pendant; small cream leather baguette shoulder bag covered in silver studs, with dangling butterfly charms and chains on a studded short strap",
    "negative": [],
    "source_images": [
      "C3"
    ],
    "image": "/shots/outfits/outfit_C3.jpg",
    "user_created": false
  },
  {
    "id": "outfit_C4",
    "name": "Baggy Denim & Ringer Crop",
    "style_tags": [
      "streetwear_90s",
      "y2k_streetwear",
      "hip_hop_2000s",
      "kawaii",
      "minimal_basics"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_ringer_crop_tee_starburst_navy_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_baggy_dark_indigo_01"
      ],
      "belt_waist": [
        "belt_waist_leather_brown_gold_buckle_01"
      ],
      "legwear": [],
      "shoes": [
        "shoes_sneakers_chunky_low_white_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_necklace_thin_gold_pendant_01",
        "jewelry_earrings_gold_hoops_01"
      ],
      "bag": [
        "bag_crossbody_colorblock_pink_teal_01"
      ],
      "accessory": [
        "accessory_keychain_star_gold_01"
      ]
    },
    "item_ids": [
      "top_ringer_crop_tee_starburst_navy_01",
      "bottom_jeans_baggy_dark_indigo_01",
      "belt_waist_leather_brown_gold_buckle_01",
      "shoes_sneakers_chunky_low_white_01",
      "jewelry_necklace_thin_gold_pendant_01",
      "jewelry_earrings_gold_hoops_01",
      "bag_crossbody_colorblock_pink_teal_01",
      "accessory_keychain_star_gold_01"
    ],
    "prompt": "fitted navy cropped ringer tee with white contrast trim on the collar and sleeve hems, a teal and coral starburst graphic on the chest; very baggy dark indigo denim jeans, low rise, extremely wide legs, long hems stacking and pooling over the sneakers; classic brown leather belt with a gold rectangular buckle; chunky all-white leather low-top court sneakers with a thick cupsole, perforated toe box and white laces; delicate thin gold chain necklace with a tiny pendant resting at the collarbone; small thin polished gold hoop earrings, about one inch across, worn in both ears; small boxy colorblock shoulder bag with a teal front flap over a hot-pink body, gold clasp and mustard-yellow strap; small gold star charm keychain dangling from a front belt loop on a short chain",
    "negative": [
      "running sneaker",
      "thin sole"
    ],
    "source_images": [
      "C4"
    ],
    "image": "/shots/outfits/outfit_C4.jpg",
    "user_created": false
  },
  {
    "id": "outfit_C5",
    "name": "Japanese Text Tee",
    "style_tags": [
      "avant_garde_dark",
      "harajuku_street",
      "indie_sleaze",
      "minimal_basics",
      "y2k"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_tee_japanese_text_offwhite_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_coated_skinny_black_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_tee_japanese_text_offwhite_01",
      "bottom_jeans_coated_skinny_black_01"
    ],
    "prompt": "fitted off-white short-sleeve crew tee with bold thick black Japanese text characters printed across the chest; black waxed coated skinny jeans with a glossy wet-look sheen, five-pocket, snug through the leg",
    "negative": [],
    "source_images": [
      "C5"
    ],
    "image": "/shots/outfits/outfit_C5.jpg",
    "user_created": false
  },
  {
    "id": "outfit_D1",
    "name": "Clueless Gingham Set",
    "style_tags": [
      "preppy_90s",
      "coquette",
      "y2k",
      "kawaii",
      "minimal_basics"
    ],
    "slots": {
      "outerwear": [
        "outerwear_jacket_tweed_gingham_cropped_bw_01"
      ],
      "layer_top": [],
      "top": [
        "top_tank_scoop_black_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_skirt_gingham_mini_pink_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_thigh_highs_sheer_white_01"
      ],
      "shoes": [
        "shoes_mary_janes_platform_star_pink_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": [
        "accessory_binder_faux_fur_pink_01"
      ]
    },
    "item_ids": [
      "outerwear_jacket_tweed_gingham_cropped_bw_01",
      "top_tank_scoop_black_01",
      "bottom_skirt_gingham_mini_pink_01",
      "legwear_thigh_highs_sheer_white_01",
      "shoes_mary_janes_platform_star_pink_01",
      "accessory_binder_faux_fur_pink_01"
    ],
    "prompt": "cropped boxy black and white gingham boucle tweed jacket, collarless, edged in solid black trim along the front and cuffs, worn open; fitted black stretch jersey tank top with a low scoop neckline; fitted high-waisted baby pink and white gingham check straight mini skirt; sheer white thigh-high stockings with a solid opaque welt band at the top of the thigh; glossy pastel pink patent platform Mary Jane pumps, chunky block heel and thick platform sprinkled with small black stars, buckled ankle strap; fluffy baby pink faux-fur covered binder decorated with a rainbow patch, a GIRL POWER patch and small pins, carried under the arm",
    "negative": [
      "stiletto",
      "flat"
    ],
    "source_images": [
      "D1"
    ],
    "image": "/shots/outfits/outfit_D1.jpg",
    "user_created": false
  },
  {
    "id": "outfit_D2_left",
    "name": "Campus Sporty (Left)",
    "style_tags": [
      "streetwear_90s",
      "sportswear",
      "minimal_basics",
      "y2k_streetwear",
      "french_casual"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_tee_oversized_collegiate_slate_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_bike_shorts_side_stripe_black_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_loose_socks_slouch_white_01"
      ],
      "shoes": [
        "shoes_sneakers_high_top_white_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_necklace_thin_chain_silver_01"
      ],
      "bag": [
        "bag_tote_canvas_cream_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "top_tee_oversized_collegiate_slate_01",
      "bottom_bike_shorts_side_stripe_black_01",
      "legwear_loose_socks_slouch_white_01",
      "shoes_sneakers_high_top_white_01",
      "jewelry_necklace_thin_chain_silver_01",
      "bag_tote_canvas_cream_01"
    ],
    "prompt": "very oversized slate teal-gray heavy cotton tee with white collegiate block lettering and the number 07 across the chest, dropped shoulders, front half-tucked; snug black spandex bike shorts ending mid-thigh with a single white stripe down the outer side seam; thick white ribbed slouch socks pushed down into loose bunched rings around the lower calf, Japanese loose-socks style; clean white leather high-top basketball sneakers with a padded ankle collar, tonal side panel and white laces; single fine silver chain necklace resting at the collarbone; plain cream cotton canvas tote bag with long shoulder handles",
    "negative": [],
    "source_images": [
      "D2"
    ],
    "image": "/shots/outfits/outfit_D2_left.jpg",
    "user_created": false
  },
  {
    "id": "outfit_D2_right",
    "name": "Campus Sporty (Right)",
    "style_tags": [
      "y2k_streetwear",
      "streetwear_90s",
      "sportswear",
      "japanese_school",
      "preppy"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_polo_raglan_crop_white_green_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_skirt_pleated_mini_forest_green_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_socks_crew_white_01"
      ],
      "shoes": [
        "shoes_sneakers_running_white_black_lace_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [
        "neckwear_choker_cord_thin_black_01"
      ],
      "jewelry": [
        "jewelry_bracelets_beaded_stack_01"
      ],
      "bag": [
        "bag_mini_top_handle_lilac_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "top_polo_raglan_crop_white_green_01",
      "bottom_skirt_pleated_mini_forest_green_01",
      "legwear_socks_crew_white_01",
      "shoes_sneakers_running_white_black_lace_01",
      "neckwear_choker_cord_thin_black_01",
      "jewelry_bracelets_beaded_stack_01",
      "bag_mini_top_handle_lilac_01"
    ],
    "prompt": "fitted cropped white polo shirt with forest green raglan short sleeves, green collar, a thin white stripe along the sleeves and a short button placket; short forest green pleated tennis mini skirt with crisp flared pleats; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; chunky white retro 90s running sneakers with layered leather and mesh overlays, a visible air-cushion midsole and contrasting black laces; thin black cord choker worn snug around the neck; stack of two or three thin beaded stretch bracelets on the wrist; tiny glossy lilac boxy handbag with a front flap and a short top handle",
    "negative": [],
    "source_images": [
      "D2"
    ],
    "image": "/shots/outfits/outfit_D2_right.jpg",
    "user_created": false
  },
  {
    "id": "outfit_D3_left",
    "name": "Y2K Street (Left)",
    "style_tags": [
      "y2k_streetwear",
      "streetwear_90s",
      "grunge",
      "y2k",
      "gyaru"
    ],
    "slots": {
      "outerwear": [
        "outerwear_hoodie_crop_varsity_letters_teal_01"
      ],
      "layer_top": [],
      "top": [
        "top_tube_bandeau_black_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_baggy_lightwash_low_rise_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_sneakers_teal_low_01"
      ],
      "headwear": [
        "headwear_beanie_rib_red_01"
      ],
      "eyewear": [],
      "neckwear": [
        "neckwear_choker_cord_thin_black_01"
      ],
      "jewelry": [
        "jewelry_necklace_layered_silver_chains_01"
      ],
      "bag": [
        "bag_baguette_faux_fur_pink_01"
      ],
      "accessory": [
        "accessory_keychain_star_gold_01"
      ]
    },
    "item_ids": [
      "outerwear_hoodie_crop_varsity_letters_teal_01",
      "top_tube_bandeau_black_01",
      "bottom_jeans_baggy_lightwash_low_rise_01",
      "shoes_sneakers_teal_low_01",
      "headwear_beanie_rib_red_01",
      "neckwear_choker_cord_thin_black_01",
      "jewelry_necklace_layered_silver_chains_01",
      "bag_baguette_faux_fur_pink_01",
      "accessory_keychain_star_gold_01"
    ],
    "prompt": "cropped emerald teal fleece zip hoodie with big pink varsity applique letters outlined in white across the chest, hood, ribbed hem, zipped halfway; simple black stretch jersey strapless tube top, smooth fitted band across the bust, peeking out from an open hoodie; light-wash faded baggy denim jeans, low rise, very wide straight legs and long hems puddling over the sneakers; low-top white leather sneakers with teal green overlays; brick red ribbed knit cuffed beanie, slightly slouchy, sitting back on the head; thin black cord choker worn snug around the neck; two or three layered silver chain necklaces at staggered lengths, small pendant on the longest; small fluffy baby pink faux-fur baguette bag on a short glossy pink shoulder strap; small gold star charm keychain dangling from a front belt loop on a short chain",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "image": "/shots/outfits/outfit_D3_left.jpg",
    "user_created": false
  },
  {
    "id": "outfit_D3_right",
    "name": "Y2K Street (Right)",
    "style_tags": [
      "streetwear_90s",
      "y2k_streetwear",
      "y2k",
      "hip_hop_2000s",
      "kawaii"
    ],
    "slots": {
      "outerwear": [
        "outerwear_hoodie_zip_mustard_01"
      ],
      "layer_top": [],
      "top": [
        "top_ringer_baby_tee_magical_script_white_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jorts_cargo_long_medium_wash_01"
      ],
      "belt_waist": [
        "belt_waist_leather_red_silver_buckle_01"
      ],
      "legwear": [
        "legwear_socks_tube_gray_01"
      ],
      "shoes": [
        "shoes_sneakers_chunky_white_gray_01"
      ],
      "headwear": [],
      "eyewear": [
        "eyewear_sunglasses_white_orange_lens_01"
      ],
      "neckwear": [],
      "jewelry": [],
      "bag": [
        "bag_shoulder_leather_brown_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "outerwear_hoodie_zip_mustard_01",
      "top_ringer_baby_tee_magical_script_white_01",
      "bottom_jorts_cargo_long_medium_wash_01",
      "belt_waist_leather_red_silver_buckle_01",
      "legwear_socks_tube_gray_01",
      "shoes_sneakers_chunky_white_gray_01",
      "eyewear_sunglasses_white_orange_lens_01",
      "bag_shoulder_leather_brown_01"
    ],
    "prompt": "oversized mustard yellow fleece zip hoodie worn open and slipped off the shoulders; fitted cropped white ringer baby tee with black trim and the word Magical in hot-pink cursive script across the chest with a tiny gold sparkle; very baggy medium-wash denim jorts ending below the knee with side cargo pockets, wide straight legs; glossy red leather belt with a silver rectangular buckle worn low on the hips; heather gray ribbed tube socks pulled up to mid-calf; bulky white and light gray padded sneakers with layered panels and thick laces; glossy white rectangular sunglasses with gradient orange-red lenses, pushed up on top of the head; medium slouchy cognac brown smooth leather shoulder bag with a single short strap, soft unstructured body",
    "negative": [],
    "source_images": [
      "D3"
    ],
    "image": "/shots/outfits/outfit_D3_right.jpg",
    "user_created": false
  },
  {
    "id": "outfit_D4",
    "name": "Floral Corset & Tulle Cape",
    "style_tags": [
      "romantic_couture",
      "coquette",
      "fairycore"
    ],
    "slots": {
      "outerwear": [
        "outerwear_cape_tulle_floral_applique_blush_01"
      ],
      "layer_top": [],
      "top": [],
      "dress_onepiece": [
        "dress_onepiece_corset_bodysuit_floral_lace_rose_01"
      ],
      "bottom": [],
      "belt_waist": [],
      "legwear": [],
      "shoes": [],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": [
        "accessory_corsage_rose_shoulder_01"
      ]
    },
    "item_ids": [
      "outerwear_cape_tulle_floral_applique_blush_01",
      "dress_onepiece_corset_bodysuit_floral_lace_rose_01",
      "accessory_corsage_rose_shoulder_01"
    ],
    "prompt": "sheer blush tulle cape draped from one shoulder into a long pooling floor-length train, scattered embroidered vines and 3D pink flower appliques, scalloped lace edge; couture dusty rose corset bodysuit in sheer blush tulle covered with embroidered vines and 3D plum and pink flower appliques, black boning lines, black waistband, thin black straps with gold sliders; large dusty rose silk rose corsage with sage-green leaves and short dangling bead strands pinned at the shoulder",
    "negative": [
      "cheap costume look"
    ],
    "source_images": [
      "D4"
    ],
    "image": "/shots/outfits/outfit_D4.jpg",
    "user_created": false
  },
  {
    "id": "outfit_D5",
    "name": "Tee Dress & Pod Sneakers",
    "style_tags": [
      "y2k",
      "sportswear",
      "gyaru",
      "japanese_school",
      "minimal_basics"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [],
      "dress_onepiece": [
        "dress_onepiece_tee_dress_ribbed_offwhite_01"
      ],
      "bottom": [],
      "belt_waist": [],
      "legwear": [
        "legwear_loose_socks_slouch_white_01"
      ],
      "shoes": [
        "shoes_sneakers_sculpted_pod_sole_gray_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "dress_onepiece_tee_dress_ribbed_offwhite_01",
      "legwear_loose_socks_slouch_white_01",
      "shoes_sneakers_sculpted_pod_sole_gray_01"
    ],
    "prompt": "body-skimming off-white fine rib-knit short-sleeve t-shirt mini dress, crew neck, tiny printed chest logo; thick white ribbed slouch socks pushed down into loose bunched rings around the lower calf, Japanese loose-socks style; very chunky light gray and cream sculpted running sneakers with bubbly organic blob-shaped overlay panels and rows of round cushioning pods around the outsole",
    "negative": [],
    "source_images": [
      "D5"
    ],
    "image": "/shots/outfits/outfit_D5.jpg",
    "user_created": false
  },
  {
    "id": "outfit_E1",
    "name": "All-Leather Suit",
    "style_tags": [
      "leather_tailoring",
      "rock_moto",
      "avant_garde_dark",
      "minimal_basics",
      "streetwear_90s"
    ],
    "slots": {
      "outerwear": [
        "outerwear_blazer_leather_black_01"
      ],
      "layer_top": [],
      "top": [
        "top_tee_crew_black_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_trousers_leather_straight_black_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_boots_pointed_cuban_heel_black_01"
      ],
      "headwear": [
        "headwear_durag_black_01"
      ],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_necklace_thin_chain_silver_01"
      ],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "outerwear_blazer_leather_black_01",
      "top_tee_crew_black_01",
      "bottom_trousers_leather_straight_black_01",
      "shoes_boots_pointed_cuban_heel_black_01",
      "headwear_durag_black_01",
      "jewelry_necklace_thin_chain_silver_01"
    ],
    "prompt": "relaxed black soft lambskin leather blazer with notch lapels, single-breasted, worn-in satin sheen, part of a matching leather suit; plain black cotton jersey crew-neck t-shirt, regular fit, smooth matte finish, no graphics; black soft leather straight-leg trousers, relaxed fit, full length breaking over boots, natural creases at the knees; polished black leather pointed-toe ankle boots with a short Cuban heel and a contrasting tan stacked leather sole; black silky durag tied snugly over the head; single fine silver chain necklace resting at the collarbone",
    "negative": [],
    "source_images": [
      "E1"
    ],
    "image": "/shots/outfits/outfit_E1.jpg",
    "user_created": false
  },
  {
    "id": "outfit_E2",
    "name": "Varsity Knit & Tweed Sneakers",
    "style_tags": [
      "luxury_street",
      "streetwear_90s",
      "avant_garde_dark",
      "indie_sleaze",
      "preppy_sport"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_sweater_varsity_stripe_orange_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_waxed_straight_charcoal_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_sneakers_tweed_suede_beige_cc_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_sweater_varsity_stripe_orange_01",
      "bottom_jeans_waxed_straight_charcoal_01",
      "shoes_sneakers_tweed_suede_beige_cc_01"
    ],
    "prompt": "boxy bright orange chunky knit crewneck sweater with brown and white football-jersey stripes down the shoulders and sleeves and big brown felt letters across the chest; charcoal black waxed coated straight-leg jeans with a leather-like semi-gloss finish and light crinkling; low-top Chanel sneakers in beige woven tweed with tan suede overlays, white interlocking CC side logo, cream laces and white sole",
    "prompt_brand_free": "boxy bright orange chunky knit crewneck sweater with brown and white football-jersey stripes down the shoulders and sleeves and big brown felt letters across the chest; charcoal black waxed coated straight-leg jeans with a leather-like semi-gloss finish and light crinkling; low-top runner sneakers in beige woven tweed with tan suede overlays, small white interlocking-letter side logo, cream laces and white rubber sole",
    "negative": [],
    "source_images": [
      "E2"
    ],
    "image": "/shots/outfits/outfit_E2.jpg",
    "user_created": false
  },
  {
    "id": "outfit_E3_left",
    "name": "Paint-Splatter Workwear",
    "style_tags": [
      "americana",
      "vintage_workwear",
      "minimal_basics",
      "grunge",
      "streetwear_90s"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_tee_fitted_faded_graphic_cream_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_paint_splatter_lightwash_01"
      ],
      "belt_waist": [
        "belt_waist_braided_leather_tan_01"
      ],
      "legwear": [],
      "shoes": [
        "shoes_boots_desert_suede_tan_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_necklace_thin_chain_silver_01"
      ],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_tee_fitted_faded_graphic_cream_01",
      "bottom_jeans_paint_splatter_lightwash_01",
      "belt_waist_braided_leather_tan_01",
      "shoes_boots_desert_suede_tan_01",
      "jewelry_necklace_thin_chain_silver_01"
    ],
    "prompt": "slim fitted cream cotton crew tee with a faded, barely-there chest graphic, tucked in; light-wash faded straight-leg jeans with paint splatters and drips across the thighs, relaxed workwear fit; tan woven braided leather belt with a brass buckle; sand tan suede lace-up ankle desert boots with a soft crepe sole; single fine silver chain necklace resting at the collarbone",
    "negative": [],
    "source_images": [
      "E3"
    ],
    "image": "/shots/outfits/outfit_E3_left.jpg",
    "user_created": false
  },
  {
    "id": "outfit_E3_right",
    "name": "Dark Luxe Black",
    "style_tags": [
      "luxury_street",
      "avant_garde_dark",
      "gothic",
      "leather_tailoring",
      "rock_moto"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_tank_ribbed_cross_logo_black_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_pants_wide_drawstring_black_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_loafers_leather_black_01"
      ],
      "headwear": [
        "headwear_cap_baseball_black_backwards_01"
      ],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_bracelets_silver_bangle_stack_01"
      ],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_tank_ribbed_cross_logo_black_01",
      "bottom_pants_wide_drawstring_black_01",
      "shoes_loafers_leather_black_01",
      "headwear_cap_baseball_black_backwards_01",
      "jewelry_bracelets_silver_bangle_stack_01"
    ],
    "prompt": "fitted black ribbed cotton tank top with a small silver gothic cross logo embroidered on the chest; very wide black heavy jersey drawstring trousers with extra long drawcords hanging to the knees, slightly dropped crotch and puddling hems; slim polished black leather loafers with a low heel and almond toe, high shine, peeking under puddled trouser hems; black cotton baseball cap with a small white front logo; stacked chunky silver bangles and chain bracelets on the wrist",
    "negative": [],
    "source_images": [
      "E3"
    ],
    "image": "/shots/outfits/outfit_E3_right.jpg",
    "user_created": false
  },
  {
    "id": "outfit_E4",
    "name": "Cable Knit & Tractor Boots",
    "style_tags": [
      "avant_garde_dark",
      "luxury_street",
      "avant_garde_rick",
      "gothic",
      "minimal_basics"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_sweater_cable_knit_cream_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_skinny_patchwork_faded_gray_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_boots_platform_tractor_black_01"
      ],
      "headwear": [],
      "eyewear": [
        "eyewear_sunglasses_shield_aviator_brown_01"
      ],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_sweater_cable_knit_cream_01",
      "bottom_jeans_skinny_patchwork_faded_gray_01",
      "shoes_boots_platform_tractor_black_01",
      "eyewear_sunglasses_shield_aviator_brown_01"
    ],
    "prompt": "relaxed cream chunky cable-knit wool crewneck sweater with raised vertical cables, ribbed collar, cuffs and hem; faded gray skinny jeans with a black denim patchwork panel across one thigh, exposed raw seams, long legs stacking into the boots; black leather calf-high boots on a huge rounded tractor-tread platform sole, bulbous exaggerated shape, jeans tucked in; oversized brown-tinted shield aviator sunglasses with a thin gold metal frame",
    "negative": [
      "thin sole",
      "pointed toe"
    ],
    "source_images": [
      "E4"
    ],
    "image": "/shots/outfits/outfit_E4.jpg",
    "user_created": false
  },
  {
    "id": "outfit_E5",
    "name": "Slogan Baby Tee & Bullet Belt",
    "style_tags": [
      "avant_garde_dark",
      "indie_sleaze",
      "luxury_street",
      "rock_moto",
      "punk"
    ],
    "slots": {
      "outerwear": [
        "outerwear_jacket_cropped_patent_trucker_black_01"
      ],
      "layer_top": [],
      "top": [
        "top_baby_tee_i_dont_smoke_cream_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_waxed_straight_charcoal_01"
      ],
      "belt_waist": [
        "belt_waist_bullet_silver_01"
      ],
      "legwear": [],
      "shoes": [],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "outerwear_jacket_cropped_patent_trucker_black_01",
      "top_baby_tee_i_dont_smoke_cream_01",
      "bottom_jeans_waxed_straight_charcoal_01",
      "belt_waist_bullet_silver_01"
    ],
    "prompt": "cropped boxy black glossy crinkled patent leather trucker jacket with point collar, two flap chest pockets and button front; tight shrunken cream cotton baby tee with I DON'T SMOKE printed in bold brick-red serif letters across the chest; charcoal black waxed coated straight-leg jeans with a leather-like semi-gloss finish and light crinkling; black belt lined with a continuous row of upright silver bullet-cartridge spikes, worn on the hips",
    "negative": [],
    "source_images": [
      "E5"
    ],
    "image": "/shots/outfits/outfit_E5.jpg",
    "user_created": false
  },
  {
    "id": "outfit_F1",
    "name": "Indie Sleaze Mini",
    "style_tags": [
      "indie_sleaze",
      "y2k",
      "luxury_street",
      "gothic",
      "coquette"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [],
      "dress_onepiece": [
        "dress_onepiece_knit_sleeveless_mock_studded_black_01"
      ],
      "bottom": [
        "bottom_shorts_lace_trim_leopard_01"
      ],
      "belt_waist": [
        "belt_waist_studded_oring_black_01"
      ],
      "legwear": [
        "legwear_thigh_highs_lace_top_black_01"
      ],
      "shoes": [
        "shoes_pumps_pointed_buckle_black_01"
      ],
      "headwear": [],
      "eyewear": [
        "eyewear_glasses_oval_wire_01"
      ],
      "neckwear": [],
      "jewelry": [
        "jewelry_bracelets_silver_bangle_stack_01",
        "jewelry_earrings_small_hoops_silver_01"
      ],
      "bag": [
        "bag_baguette_croc_black_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "dress_onepiece_knit_sleeveless_mock_studded_black_01",
      "bottom_shorts_lace_trim_leopard_01",
      "belt_waist_studded_oring_black_01",
      "legwear_thigh_highs_lace_top_black_01",
      "shoes_pumps_pointed_buckle_black_01",
      "eyewear_glasses_oval_wire_01",
      "jewelry_bracelets_silver_bangle_stack_01",
      "jewelry_earrings_small_hoops_silver_01",
      "bag_baguette_croc_black_01"
    ],
    "prompt": "fitted black ribbed knit sleeveless mini dress with a high mock neck trimmed in small silver studs; tiny leopard print satin shorts edged with black lace peeking below a mini dress hem; black leather hip belt with silver studs and large O-ring hardware slung loosely low on the hips; sheer black thigh-high stockings with a wide black lace band at the top; sharp pointed-toe glossy black patent pumps with a slim heel and silver buckle hardware across the vamp; small narrow oval clear-lens glasses with thin silver wire frames; stacked chunky silver bangles and chain bracelets on the wrist; small silver huggie hoop earrings hugging the earlobe, polished finish; slim black croc-embossed leather baguette shoulder bag with silver hardware tucked under the arm",
    "negative": [],
    "source_images": [
      "F1"
    ],
    "image": "/shots/outfits/outfit_F1.jpg",
    "user_created": false
  },
  {
    "id": "outfit_F2",
    "name": "Mesh Layer & Derbies",
    "style_tags": [
      "streetwear_90s",
      "grunge",
      "sportswear",
      "minimal_basics",
      "indie_sleaze"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [
        "layer_top_longsleeve_white_01"
      ],
      "top": [
        "top_tee_mesh_oversized_black_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_track_pants_piped_cream_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_socks_tall_ribbed_white_01"
      ],
      "shoes": [
        "shoes_derby_chunky_black_leather_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_earrings_small_hoops_silver_01",
        "jewelry_necklace_layered_silver_chains_01"
      ],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "layer_top_longsleeve_white_01",
      "top_tee_mesh_oversized_black_01",
      "bottom_track_pants_piped_cream_01",
      "legwear_socks_tall_ribbed_white_01",
      "shoes_derby_chunky_black_leather_01",
      "jewelry_earrings_small_hoops_silver_01",
      "jewelry_necklace_layered_silver_chains_01"
    ],
    "prompt": "plain white long-sleeve cotton tee worn underneath, sleeves showing below a short-sleeve top; boxy oversized black athletic mesh short-sleeve tee layered over a white long-sleeve; cream tricot track pants with a thin black stripe piping down the outer seam, relaxed straight leg ending at the ankle; tall white ribbed over-the-calf socks pulled up high; black smooth leather three-eyelet derby shoes on a chunky air-cushioned sole with yellow welt stitching, rounded toe; small silver huggie hoop earrings hugging the earlobe, polished finish; two or three layered silver chain necklaces at staggered lengths, small pendant on the longest",
    "negative": [],
    "source_images": [
      "F2"
    ],
    "image": "/shots/outfits/outfit_F2.jpg",
    "user_created": false
  },
  {
    "id": "outfit_F3",
    "name": "Denim on Denim 90s",
    "style_tags": [
      "streetwear_90s",
      "grunge",
      "minimal_basics",
      "punk",
      "americana"
    ],
    "slots": {
      "outerwear": [
        "outerwear_jacket_denim_trucker_medium_wash_01"
      ],
      "layer_top": [],
      "top": [
        "top_tee_crew_black_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_skinny_ripped_cuffed_lightwash_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_socks_crew_white_01"
      ],
      "shoes": [
        "shoes_derby_chunky_black_leather_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_rings_silver_01",
        "jewelry_necklace_layered_silver_chains_01"
      ],
      "bag": [],
      "accessory": [
        "accessory_wallet_chain_silver_01"
      ]
    },
    "item_ids": [
      "outerwear_jacket_denim_trucker_medium_wash_01",
      "top_tee_crew_black_01",
      "bottom_jeans_skinny_ripped_cuffed_lightwash_01",
      "legwear_socks_crew_white_01",
      "shoes_derby_chunky_black_leather_01",
      "jewelry_rings_silver_01",
      "jewelry_necklace_layered_silver_chains_01",
      "accessory_wallet_chain_silver_01"
    ],
    "prompt": "faded medium-wash denim trucker jacket, classic waist length, chest flap pockets, worn open; plain black cotton jersey crew-neck t-shirt, regular fit, smooth matte finish, no graphics; light-wash skinny jeans with ripped knees and rolled cuffs at the ankle; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; black smooth leather three-eyelet derby shoes on a chunky air-cushioned sole with yellow welt stitching, rounded toe; a few chunky silver rings on the fingers; two or three layered silver chain necklaces at staggered lengths, small pendant on the longest; silver wallet chain looping from a front belt loop around to the back pocket",
    "negative": [],
    "source_images": [
      "F3"
    ],
    "image": "/shots/outfits/outfit_F3.jpg",
    "user_created": false
  },
  {
    "id": "outfit_F4",
    "name": "Black Workwear",
    "style_tags": [
      "streetwear_90s",
      "minimal_basics",
      "vintage_workwear",
      "americana",
      "rock_moto"
    ],
    "slots": {
      "outerwear": [
        "outerwear_jacket_sherpa_lined_cropped_black_01"
      ],
      "layer_top": [],
      "top": [
        "top_tee_long_white_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_skinny_black_stacked_01"
      ],
      "belt_waist": [
        "belt_waist_leather_black_silver_buckle_01"
      ],
      "legwear": [],
      "shoes": [
        "shoes_boots_hiker_nubuck_black_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_necklace_thin_chain_silver_01"
      ],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "outerwear_jacket_sherpa_lined_cropped_black_01",
      "top_tee_long_white_01",
      "bottom_jeans_skinny_black_stacked_01",
      "belt_waist_leather_black_silver_buckle_01",
      "shoes_boots_hiker_nubuck_black_01",
      "jewelry_necklace_thin_chain_silver_01"
    ],
    "prompt": "cropped boxy black canvas jacket lined in gray sherpa fleece, hooded, worn slipped down off the shoulders; plain white long-line cotton crew tee falling past the hips; black stretch skinny jeans stacking in folds at the ankles over boots; classic black leather belt with a silver buckle; black nubuck ankle-high lace-up hiking boots with gold speed hooks and a padded collar; single fine silver chain necklace resting at the collarbone",
    "negative": [],
    "source_images": [
      "F4"
    ],
    "image": "/shots/outfits/outfit_F4.jpg",
    "user_created": false
  },
  {
    "id": "outfit_F5",
    "name": "White Tank Americana",
    "style_tags": [
      "americana",
      "minimal_basics",
      "vintage_workwear",
      "streetwear_90s"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_tank_ribbed_white_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_straight_medium_wash_01"
      ],
      "belt_waist": [
        "belt_waist_leather_black_silver_buckle_01"
      ],
      "legwear": [],
      "shoes": [],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_tank_ribbed_white_01",
      "bottom_jeans_straight_medium_wash_01",
      "belt_waist_leather_black_silver_buckle_01"
    ],
    "prompt": "classic white ribbed cotton A-shirt tank top, fitted, tucked in; medium-wash relaxed straight-leg jeans, mid rise, classic five-pocket; classic black leather belt with a silver buckle",
    "negative": [],
    "source_images": [
      "F5"
    ],
    "image": "/shots/outfits/outfit_F5.jpg",
    "user_created": false
  },
  {
    "id": "outfit_F6",
    "name": "All-Black & Tweed Sneakers",
    "style_tags": [
      "streetwear_90s",
      "minimal_basics",
      "sportswear",
      "japanese_school",
      "luxury_street"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_tee_oversized_black_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_shorts_nylon_black_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_socks_crew_white_01"
      ],
      "shoes": [
        "shoes_sneakers_tweed_suede_beige_cc_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_necklace_thin_chain_silver_01"
      ],
      "bag": [
        "bag_sling_nylon_black_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "top_tee_oversized_black_01",
      "bottom_shorts_nylon_black_01",
      "legwear_socks_crew_white_01",
      "shoes_sneakers_tweed_suede_beige_cc_01",
      "jewelry_necklace_thin_chain_silver_01",
      "bag_sling_nylon_black_01"
    ],
    "prompt": "boxy oversized black heavy cotton t-shirt with dropped shoulders and sleeves past the elbow, plain, no graphics; relaxed black nylon shorts ending above the knee; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; low-top Chanel sneakers in beige woven tweed with tan suede overlays, white interlocking CC side logo, cream laces and white sole; single fine silver chain necklace resting at the collarbone; compact black nylon crossbody sling bag with zip pockets, worn across the back",
    "prompt_brand_free": "boxy oversized black heavy cotton t-shirt with dropped shoulders and sleeves past the elbow, plain, no graphics; relaxed black nylon shorts ending above the knee; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; low-top runner sneakers in beige woven tweed with tan suede overlays, small white interlocking-letter side logo, cream laces and white rubber sole; single fine silver chain necklace resting at the collarbone; compact black nylon crossbody sling bag with zip pockets, worn across the back",
    "negative": [],
    "source_images": [
      "F6"
    ],
    "image": "/shots/outfits/outfit_F6.jpg",
    "user_created": false
  },
  {
    "id": "outfit_G1",
    "name": "Dark Denim Set",
    "style_tags": [
      "hip_hop_2000s",
      "streetwear_90s",
      "americana",
      "luxury_street",
      "minimal_basics"
    ],
    "slots": {
      "outerwear": [
        "outerwear_jacket_denim_trucker_dark_rinse_01"
      ],
      "layer_top": [],
      "top": [],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_gothic_embroidered_dark_rinse_01"
      ],
      "belt_waist": [
        "belt_waist_leather_black_silver_buckle_01"
      ],
      "legwear": [],
      "shoes": [
        "shoes_sneakers_puffy_skate_black_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "outerwear_jacket_denim_trucker_dark_rinse_01",
      "bottom_jeans_gothic_embroidered_dark_rinse_01",
      "belt_waist_leather_black_silver_buckle_01",
      "shoes_sneakers_puffy_skate_black_01"
    ],
    "prompt": "fitted dark-rinse raw indigo denim trucker jacket with copper buttons, two flap chest pockets, orange contrast stitching and a tiny red embroidered chest logo; dark-rinse indigo straight-leg jeans with white gothic Old English blackletter embroidery across the front thighs; classic black leather belt with a silver buckle; bulky black leather early-2000s skate sneakers with a thick padded tongue and collar and fat white laces",
    "negative": [],
    "source_images": [
      "G1"
    ],
    "image": "/shots/outfits/outfit_G1.jpg",
    "user_created": false
  },
  {
    "id": "outfit_G2",
    "name": "Royal Blue Tracksuit",
    "style_tags": [
      "streetwear_90s",
      "sportswear",
      "luxury_street",
      "hip_hop_2000s",
      "minimal_basics"
    ],
    "slots": {
      "outerwear": [
        "outerwear_track_jacket_royal_blue_stripe_01"
      ],
      "layer_top": [],
      "top": [],
      "dress_onepiece": [],
      "bottom": [
        "bottom_track_pants_royal_blue_stripe_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_sneakers_court_low_white_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_necklace_initial_pendant_gold_01",
        "jewelry_rings_silver_01"
      ],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "outerwear_track_jacket_royal_blue_stripe_01",
      "bottom_track_pants_royal_blue_stripe_01",
      "shoes_sneakers_court_low_white_01",
      "jewelry_necklace_initial_pendant_gold_01",
      "jewelry_rings_silver_01"
    ],
    "prompt": "royal blue satin tricot track jacket with yellow and white piping along the shoulders and sleeves, striped cuffs and a white script logo embroidered on the chest, worn open; matching royal blue satin tricot track pants with yellow and white stripes down the outer leg and a small script logo on the thigh; clean white smooth leather low-profile court sneakers with minimal panels and a flat cupsole; thin gold chain necklace with a single gold block-letter initial pendant; a few chunky silver rings on the fingers",
    "negative": [],
    "source_images": [
      "G2"
    ],
    "image": "/shots/outfits/outfit_G2.jpg",
    "user_created": false
  },
  {
    "id": "outfit_G3",
    "name": "Leopard Vest & Mustard Joggers",
    "style_tags": [
      "streetwear_90s",
      "luxury_street",
      "hip_hop_2000s",
      "minimal_basics",
      "japanese_school"
    ],
    "slots": {
      "outerwear": [
        "outerwear_vest_leopard_utility_01"
      ],
      "layer_top": [
        "layer_top_longsleeve_white_tee_g3_01"
      ],
      "top": [],
      "dress_onepiece": [],
      "bottom": [
        "bottom_sweatpants_mustard_old_english_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_socks_crew_white_01"
      ],
      "shoes": [
        "shoes_sneakers_high_top_custom_white_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_bracelets_beaded_stack_01"
      ],
      "bag": [
        "bag_belt_bag_plaid_patch_01"
      ],
      "accessory": []
    },
    "item_ids": [
      "outerwear_vest_leopard_utility_01",
      "layer_top_longsleeve_white_tee_g3_01",
      "bottom_sweatpants_mustard_old_english_01",
      "legwear_socks_crew_white_01",
      "shoes_sneakers_high_top_custom_white_01",
      "jewelry_bracelets_beaded_stack_01",
      "bag_belt_bag_plaid_patch_01"
    ],
    "prompt": "boxy leopard print fleece utility puffer vest with high zip neck, chest flap pockets, woven tan logo label patches and toggle drawcord hem; plain white cotton long-sleeve tee worn under a vest; relaxed mustard gold fleece joggers with a black gothic Old English Billionaire Boys Club print on the thigh, drawstring waist and elastic ankle cuffs; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; chunky white leather high-top basketball sneakers, one customized with black hand-drawn marker doodles and spots, ankle strap; stack of two or three thin beaded stretch bracelets on the wrist; small brown and red plaid canvas belt bag with round patch appliques, worn crossbody across the chest",
    "prompt_brand_free": "boxy leopard print fleece utility puffer vest with high zip neck, chest flap pockets, woven tan logo label patches and toggle drawcord hem; plain white cotton long-sleeve tee worn under a vest; relaxed mustard gold fleece joggers with a black gothic Old English blackletter logo print and circular emblem on the thigh, drawstring waist, elastic ankle cuffs; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; chunky white leather high-top basketball sneakers, one customized with black hand-drawn marker doodles and spots, ankle strap; stack of two or three thin beaded stretch bracelets on the wrist; small brown and red plaid canvas belt bag with round patch appliques, worn crossbody across the chest",
    "negative": [],
    "source_images": [
      "G3"
    ],
    "image": "/shots/outfits/outfit_G3.jpg",
    "user_created": false
  },
  {
    "id": "outfit_G4",
    "name": "Classic Moto Jacket",
    "style_tags": [
      "minimal_basics",
      "rock_moto",
      "grunge",
      "hip_hop_2000s",
      "japanese_school"
    ],
    "slots": {
      "outerwear": [
        "outerwear_jacket_moto_biker_black_01"
      ],
      "layer_top": [],
      "top": [
        "top_tee_crew_heather_oatmeal_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_skinny_distressed_raw_hem_black_01"
      ],
      "belt_waist": [],
      "legwear": [
        "legwear_socks_crew_white_01"
      ],
      "shoes": [
        "shoes_boots_chelsea_suede_brown_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_earrings_stud_diamond_01"
      ],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "outerwear_jacket_moto_biker_black_01",
      "top_tee_crew_heather_oatmeal_01",
      "bottom_jeans_skinny_distressed_raw_hem_black_01",
      "legwear_socks_crew_white_01",
      "shoes_boots_chelsea_suede_brown_01",
      "jewelry_earrings_stud_diamond_01"
    ],
    "prompt": "classic black leather moto biker jacket with asymmetric silver zip, snap-down lapels and zippered cuffs, worn open; heather oatmeal light gray soft cotton crew-neck tee, regular fit, plain, worn under a leather jacket; black skinny jeans with shredded knee rips and a frayed raw-cut hem cropped above the ankle; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; dark brown suede ankle Chelsea boots with elastic side panels, almond toe and low heel; small sparkling round diamond stud earring in a silver setting, worn in one or both ears",
    "negative": [],
    "source_images": [
      "G4"
    ],
    "image": "/shots/outfits/outfit_G4.jpg",
    "user_created": false
  },
  {
    "id": "outfit_G5",
    "name": "Camel Knit & LA Cap",
    "style_tags": [
      "streetwear_90s",
      "minimal_basics",
      "hip_hop_2000s",
      "dark_academia",
      "grunge"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_sweater_fine_knit_camel_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_trousers_pleated_wide_khaki_01"
      ],
      "belt_waist": [
        "belt_waist_nylon_cobra_buckle_black_01"
      ],
      "legwear": [
        "legwear_socks_crew_white_01"
      ],
      "shoes": [
        "shoes_sneakers_mesh_netting_cream_01"
      ],
      "headwear": [
        "headwear_cap_fitted_la_green_01"
      ],
      "eyewear": [],
      "neckwear": [
        "neckwear_choker_cord_thin_black_01"
      ],
      "jewelry": [
        "jewelry_necklace_initial_pendant_gold_01"
      ],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_sweater_fine_knit_camel_01",
      "bottom_trousers_pleated_wide_khaki_01",
      "belt_waist_nylon_cobra_buckle_black_01",
      "legwear_socks_crew_white_01",
      "shoes_sneakers_mesh_netting_cream_01",
      "headwear_cap_fitted_la_green_01",
      "neckwear_choker_cord_thin_black_01",
      "jewelry_necklace_initial_pendant_gold_01"
    ],
    "prompt": "slim camel khaki fine-gauge wool crewneck sweater, smooth flat knit, long fitted sleeves, ribbed cuffs and hem; stone khaki cotton twill pleated trousers with a high rise and wide relaxed legs; black nylon webbing belt with a gunmetal quick-release cobra buckle; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; white and cream retro mid-cut basketball sneakers with mesh netting side panels, plastic wing eyelets and a visible air heel; structured forest green fitted baseball cap with a white interlocking LA logo on the front; thin black cord choker worn snug around the neck; thin gold chain necklace with a single gold block-letter initial pendant",
    "prompt_brand_free": "slim camel khaki fine-gauge wool crewneck sweater, smooth flat knit, long fitted sleeves, ribbed cuffs and hem; stone khaki cotton twill pleated trousers with a high rise and wide relaxed legs; black nylon webbing belt with a gunmetal quick-release cobra buckle; plain bright white cotton crew socks with a fine ribbed cuff, pulled up neatly to mid-calf; white and cream retro mid-cut basketball sneakers with mesh netting side panels, plastic wing eyelets and a visible air heel; structured forest green fitted baseball cap with a white interlocking two-letter logo on the front; thin black cord choker worn snug around the neck; thin gold chain necklace with a single gold block-letter initial pendant",
    "negative": [],
    "source_images": [
      "G5"
    ],
    "image": "/shots/outfits/outfit_G5.jpg",
    "user_created": false
  },
  {
    "id": "outfit_H1",
    "name": "Thermal Heatmap Puffer",
    "style_tags": [
      "luxury_street",
      "streetwear_90s",
      "techwear"
    ],
    "slots": {
      "outerwear": [
        "outerwear_puffer_thermal_gradient_01"
      ],
      "layer_top": [],
      "top": [],
      "dress_onepiece": [],
      "bottom": [],
      "belt_waist": [],
      "legwear": [],
      "shoes": [],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "outerwear_puffer_thermal_gradient_01"
    ],
    "prompt": "boxy hip-length matte nylon puffer jacket printed with a thermal-camera heatmap: sky blue edges fading to yellow, orange, magenta and a black core at the center chest, snap stand collar",
    "negative": [],
    "source_images": [
      "H1"
    ],
    "image": "/shots/outfits/outfit_H1.jpg",
    "user_created": false
  },
  {
    "id": "outfit_H3",
    "name": "Pink Sheer & Platforms",
    "style_tags": [
      "avant_garde_dark",
      "avant_garde_rick",
      "gothic",
      "grunge",
      "indie_sleaze"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_longsleeve_sheer_jersey_pink_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_coated_skinny_black_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_sneakers_platform_high_top_megalug_black_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_necklace_layered_silver_chains_01"
      ],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_longsleeve_sheer_jersey_pink_01",
      "bottom_jeans_coated_skinny_black_01",
      "shoes_sneakers_platform_high_top_megalug_black_01",
      "jewelry_necklace_layered_silver_chains_01"
    ],
    "prompt": "slim bubblegum pink sheer fine jersey long-sleeve tee with extra long sleeves bunching at the wrists; black waxed coated skinny jeans with a glossy wet-look sheen, five-pocket, snug through the leg; black canvas high-top sneakers on a massive chunky tooth-lugged platform rubber sole, long loose black laces; two or three layered silver chain necklaces at staggered lengths, small pendant on the longest",
    "negative": [
      "thin sole",
      "white sole"
    ],
    "source_images": [
      "H3"
    ],
    "image": "/shots/outfits/outfit_H3.jpg",
    "user_created": false
  },
  {
    "id": "outfit_H4",
    "name": "Bandana Shirt & Shredded Denim",
    "style_tags": [
      "streetwear_90s",
      "luxury_street",
      "western",
      "grunge",
      "minimal_basics"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [
        "layer_top_camp_shirt_bandana_red_01"
      ],
      "top": [
        "top_tee_graphic_text_white_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_shredded_bleached_baggy_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_slip_on_bandana_red_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_bracelets_beaded_stack_01"
      ],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "layer_top_camp_shirt_bandana_red_01",
      "top_tee_graphic_text_white_01",
      "bottom_jeans_shredded_bleached_baggy_01",
      "shoes_slip_on_bandana_red_01",
      "jewelry_bracelets_beaded_stack_01"
    ],
    "prompt": "boxy short-sleeve red camp collar shirt with a red and white bandana paisley print across the lower half, worn open; white cotton crew tee with large bold black text printed on the front; baggy bleached light-gray acid-wash jeans heavily shredded with rips and frayed holes all over the legs; red and white bandana-print canvas slip-on sneakers with white rubber soles; stack of two or three thin beaded stretch bracelets on the wrist",
    "negative": [],
    "source_images": [
      "H4"
    ],
    "image": "/shots/outfits/outfit_H4.jpg",
    "user_created": false
  },
  {
    "id": "outfit_H5",
    "name": "Gray Tracksuit & Wrap Mask",
    "style_tags": [
      "streetwear_90s",
      "sportswear",
      "uk_drill",
      "minimal_basics",
      "y2k_streetwear"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_sweatshirt_crew_script_heather_gray_01",
        "top_tee_long_white_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_sweatpants_heather_gray_script_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_sneakers_chunky_low_white_01"
      ],
      "headwear": [
        "headwear_balaclava_wrap_white_01"
      ],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_sweatshirt_crew_script_heather_gray_01",
      "top_tee_long_white_01",
      "bottom_sweatpants_heather_gray_script_01",
      "shoes_sneakers_chunky_low_white_01",
      "headwear_balaclava_wrap_white_01"
    ],
    "prompt": "relaxed heather gray fleece crewneck sweatshirt with a small white script logo embroidered on the chest, white tee hem peeking out; plain white long-line cotton crew tee falling past the hips; relaxed heather gray fleece sweatpants with elastic cuffs bunching over sneakers and a small white script logo on the thigh; chunky all-white leather low-top court sneakers with a thick cupsole, perforated toe box and white laces; white cotton jersey fabric wrapped tightly around the head as a balaclava, covering head and lower face with only the eyes showing, knotted at the back",
    "negative": [
      "running sneaker",
      "thin sole"
    ],
    "source_images": [
      "H5"
    ],
    "image": "/shots/outfits/outfit_H5.jpg",
    "user_created": false
  },
  {
    "id": "outfit_I1",
    "name": "Vinyl Heart Tee",
    "style_tags": [
      "minimal_basics",
      "streetwear_90s"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_tee_vinyl_heart_print_white_01"
      ],
      "dress_onepiece": [],
      "bottom": [],
      "belt_waist": [],
      "legwear": [],
      "shoes": [],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_tee_vinyl_heart_print_white_01"
    ],
    "prompt": "white crew tee with a large back print of a heart made from overlapping black vinyl records with colorful center labels, small record-store logos and badges below",
    "negative": [],
    "source_images": [
      "I1"
    ],
    "image": "/shots/outfits/outfit_I1.jpg",
    "user_created": false
  },
  {
    "id": "outfit_I2",
    "name": "Spiked Flag Tee",
    "style_tags": [
      "grunge",
      "luxury_street",
      "punk"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_tee_boxy_flag_spikes_black_01"
      ],
      "dress_onepiece": [],
      "bottom": [],
      "belt_waist": [],
      "legwear": [],
      "shoes": [],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "top_tee_boxy_flag_spikes_black_01"
    ],
    "prompt": "faded black boxy cropped tee with a raw-cut neckline and a blurry airbrushed American flag graphic covered in spikes, white spike halo, AMERICAN SABOTAGE text below",
    "negative": [],
    "source_images": [
      "I2"
    ],
    "image": "/shots/outfits/outfit_I2.jpg",
    "user_created": false
  },
  {
    "id": "outfit_I3_green",
    "name": "Green Puffer Set",
    "style_tags": [
      "streetwear_90s",
      "uk_drill",
      "sportswear",
      "minimal_basics",
      "y2k_streetwear"
    ],
    "slots": {
      "outerwear": [
        "outerwear_puffer_glossy_forest_green_01"
      ],
      "layer_top": [],
      "top": [
        "top_tee_long_white_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_track_pants_nylon_forest_green_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_sneakers_chunky_low_white_01"
      ],
      "headwear": [
        "headwear_balaclava_wrap_white_01"
      ],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "outerwear_puffer_glossy_forest_green_01",
      "top_tee_long_white_01",
      "bottom_track_pants_nylon_forest_green_01",
      "shoes_sneakers_chunky_low_white_01",
      "headwear_balaclava_wrap_white_01"
    ],
    "prompt": "bulky glossy forest green nylon puffer jacket with fat baffles, high funnel collar and a small yellow script logo on the chest; plain white long-line cotton crew tee falling past the hips; relaxed forest green nylon track pants matching the jacket; chunky all-white leather low-top court sneakers with a thick cupsole, perforated toe box and white laces; white cotton jersey fabric wrapped tightly around the head as a balaclava, covering head and lower face with only the eyes showing, knotted at the back",
    "negative": [
      "running sneaker",
      "thin sole"
    ],
    "source_images": [
      "I3"
    ],
    "image": "/shots/outfits/outfit_I3_green.jpg",
    "user_created": false
  },
  {
    "id": "outfit_I3_yellow",
    "name": "Yellow Puffer Set",
    "style_tags": [
      "uk_drill",
      "streetwear_90s",
      "sportswear",
      "techwear",
      "y2k_streetwear"
    ],
    "slots": {
      "outerwear": [
        "outerwear_puffer_glossy_mustard_yellow_01"
      ],
      "layer_top": [],
      "top": [],
      "dress_onepiece": [],
      "bottom": [
        "bottom_puffer_pants_glossy_yellow_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_sneakers_metallic_silver_wave_01"
      ],
      "headwear": [
        "headwear_balaclava_wrap_white_01"
      ],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "outerwear_puffer_glossy_mustard_yellow_01",
      "bottom_puffer_pants_glossy_yellow_01",
      "shoes_sneakers_metallic_silver_wave_01",
      "headwear_balaclava_wrap_white_01"
    ],
    "prompt": "bulky glossy golden yellow nylon puffer jacket with fat baffles, high collar, elastic cuffs and a small white script chest logo; padded glossy golden yellow nylon puffer pants with elastic ankle cuffs, matching the jacket; sleek metallic silver running sneakers with layered water-ripple wave lines, reflective piping and a full-length visible air sole; white cotton jersey fabric wrapped tightly around the head as a balaclava, covering head and lower face with only the eyes showing, knotted at the back",
    "negative": [],
    "source_images": [
      "I3"
    ],
    "image": "/shots/outfits/outfit_I3_yellow.jpg",
    "user_created": false
  },
  {
    "id": "outfit_I4",
    "name": "Camo Cargos & Tank",
    "style_tags": [
      "uk_drill",
      "sportswear",
      "streetwear_90s",
      "hip_hop_2000s",
      "minimal_basics"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [
        "top_tank_ribbed_heather_gray_01"
      ],
      "dress_onepiece": [],
      "bottom": [
        "bottom_cargo_pants_camo_nylon_gray_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_sneakers_air_runner_black_01"
      ],
      "headwear": [
        "headwear_beanie_skull_swoosh_black_01"
      ],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [
        "jewelry_rings_silver_01",
        "jewelry_necklace_medallion_gold_01"
      ],
      "bag": [],
      "accessory": [
        "accessory_watch_digital_black_01"
      ]
    },
    "item_ids": [
      "top_tank_ribbed_heather_gray_01",
      "bottom_cargo_pants_camo_nylon_gray_01",
      "shoes_sneakers_air_runner_black_01",
      "headwear_beanie_skull_swoosh_black_01",
      "jewelry_rings_silver_01",
      "jewelry_necklace_medallion_gold_01",
      "accessory_watch_digital_black_01"
    ],
    "prompt": "relaxed heather gray ribbed tank top with a small tonal script logo on the chest; baggy nylon cargo pants in charcoal, gray and white cloud camouflage with cargo pockets and elastic ankles bunching over sneakers; all-black running sneakers with wavy layered side overlays and visible air cushioning; short fitted black knit skull beanie with a small white logo on the cuff; a few chunky silver rings on the fingers; gold chain necklace with a round coin medallion pendant; chunky black matte resin digital sports watch with a wide strap and square face",
    "negative": [],
    "source_images": [
      "I4"
    ],
    "image": "/shots/outfits/outfit_I4.jpg",
    "user_created": false
  },
  {
    "id": "outfit_I5",
    "name": "Western Flare & Metal-Toe Boot",
    "style_tags": [
      "luxury_street",
      "western"
    ],
    "slots": {
      "outerwear": [],
      "layer_top": [],
      "top": [],
      "dress_onepiece": [],
      "bottom": [
        "bottom_jeans_flare_western_applique_lightwash_01"
      ],
      "belt_waist": [],
      "legwear": [],
      "shoes": [
        "shoes_cowboy_boots_metal_toe_black_01"
      ],
      "headwear": [],
      "eyewear": [],
      "neckwear": [],
      "jewelry": [],
      "bag": [],
      "accessory": []
    },
    "item_ids": [
      "bottom_jeans_flare_western_applique_lightwash_01",
      "shoes_cowboy_boots_metal_toe_black_01"
    ],
    "prompt": "light faded wash bootcut flare jeans covered in raw-edge frayed denim appliqué of western scrolls, flames and stars, long hems breaking over cowboy boots; polished black leather pointed cowboy boots with white decorative western stitching, an engraved silver metal toe cap, and small silver flower and star studs on the stacked heel",
    "negative": [],
    "source_images": [
      "I5"
    ],
    "image": "/shots/outfits/outfit_I5.jpg",
    "user_created": false
  }
];

export const WARDROBE_ITEMS_BY_ID = new Map<string, WardrobeItem>(
  WARDROBE_ITEMS.map((item) => [item.id, item]),
);

export const WARDROBE_OUTFITS_BY_ID = new Map<string, WardrobeOutfit>(
  WARDROBE_OUTFITS.map((outfit) => [outfit.id, outfit]),
);

export function applyWardrobeItem(doc: PromptDoc, item: WardrobeItem, slotIndex: number): PromptDoc {
  let next = doc;
  const basePath = `subjects.${slotIndex}.wardrobe_architecture`;
  const arch = doc.subjects[slotIndex]?.wardrobe_architecture;
  if (!arch) return doc;

  // 1. Slot to Layering System mapping
  if (item.slot === "outerwear") {
    next = setAt(next, `${basePath}.layering_system.outerwear`, item.prompt);
  } else if (item.slot === "layer_top") {
    next = setAt(next, `${basePath}.layering_system.mid_layer`, item.prompt);
  } else if (item.slot === "top") {
    const existingBase = arch.layering_system.base_layer.trim();
    // If existing base has a bottom or top, set or append cleanly
    if (existingBase.includes("jeans") || existingBase.includes("skirt") || existingBase.includes("pants") || existingBase.includes("shorts")) {
      next = setAt(next, `${basePath}.layering_system.base_layer`, `${item.prompt}; ${existingBase}`);
    } else {
      next = setAt(next, `${basePath}.layering_system.base_layer`, item.prompt);
    }
  } else if (item.slot === "bottom") {
    const existingBase = arch.layering_system.base_layer.trim();
    if (existingBase && !existingBase.includes(item.prompt)) {
      next = setAt(next, `${basePath}.layering_system.base_layer`, `${existingBase}; ${item.prompt}`);
    } else {
      next = setAt(next, `${basePath}.layering_system.base_layer`, item.prompt);
    }
  } else if (item.slot === "dress_onepiece") {
    // Replaces top and bottom
    next = setAt(next, `${basePath}.layering_system.base_layer`, item.prompt);
  } else if (item.slot === "shoes") {
    next = setAt(next, `${basePath}.footwear`, item.prompt);
  } else {
    // Accessory slots: headwear, eyewear, neckwear, jewelry, belt_waist, legwear, bag, accessory
    const currentAccessories = arch.accessories ?? [];
    if (!currentAccessories.includes(item.prompt)) {
      next = setAt(next, `${basePath}.accessories`, [...currentAccessories, item.prompt]);
    }
  }

  // 2. Textiles & weight enrichment
  if (item.materials && item.materials.length > 0) {
    const currentMats = arch.textiles_and_weight.trim();
    const newMats = item.materials.join(", ");
    if (!currentMats) {
      next = setAt(next, `${basePath}.textiles_and_weight`, newMats);
    } else if (!currentMats.includes(item.materials[0])) {
      next = setAt(next, `${basePath}.textiles_and_weight`, `${currentMats}, ${newMats}`);
    }
  }

  // 3. Hardware & details enrichment
  if (item.details && item.details.length > 0) {
    const currentDetails = arch.hardware_and_details.trim();
    const newDetails = item.details.join("; ");
    if (!currentDetails) {
      next = setAt(next, `${basePath}.hardware_and_details`, newDetails);
    } else if (!currentDetails.includes(item.details[0])) {
      next = setAt(next, `${basePath}.hardware_and_details`, `${currentDetails}; ${newDetails}`);
    }
  }

  // 4. Negatives enrichment
  if (item.negative && item.negative.length > 0) {
    const currentNegs = doc.anti_cliche_exclusions ?? [];
    const mergedNegs = Array.from(new Set([...currentNegs, ...item.negative]));
    next = setAt(next, "anti_cliche_exclusions", mergedNegs);
  }

  return next;
}

export function applyWardrobeOutfit(doc: PromptDoc, outfit: WardrobeOutfit, slotIndex: number): PromptDoc {
  let next = doc;
  const basePath = `subjects.${slotIndex}.wardrobe_architecture`;
  const items = outfit.item_ids
    .map((id) => WARDROBE_ITEMS_BY_ID.get(id))
    .filter((i): i is WardrobeItem => Boolean(i));

  const resolvePrompt = (idOrPrompt: string) => {
    const item = WARDROBE_ITEMS_BY_ID.get(idOrPrompt);
    return item?.prompt || idOrPrompt;
  };

  // 1. Outerwear
  const outerwearItems = (outfit.slots.outerwear || [])
    .map(resolvePrompt)
    .filter(Boolean);
  next = setAt(next, `${basePath}.layering_system.outerwear`, outerwearItems.join("; "));

  // 2. Mid layer (layer_top)
  const midItems = (outfit.slots.layer_top || [])
    .map(resolvePrompt)
    .filter(Boolean);
  next = setAt(next, `${basePath}.layering_system.mid_layer`, midItems.join("; "));

  // 3. Base layer (dress_onepiece, or top + bottom, or direct prompt if custom)
  const dressItems = (outfit.slots.dress_onepiece || [])
    .map(resolvePrompt)
    .filter(Boolean);
  if (dressItems.length > 0) {
    next = setAt(next, `${basePath}.layering_system.base_layer`, dressItems.join("; "));
  } else {
    const topItems = (outfit.slots.top || [])
      .map(resolvePrompt)
      .filter(Boolean);
    const bottomItems = (outfit.slots.bottom || [])
      .map(resolvePrompt)
      .filter(Boolean);
    const baseJoined = [...topItems, ...bottomItems].join("; ");
    if (baseJoined) {
      next = setAt(next, `${basePath}.layering_system.base_layer`, baseJoined);
    } else if (outfit.is_custom && outfit.prompt && !outerwearItems.length && !midItems.length) {
      next = setAt(next, `${basePath}.layering_system.base_layer`, outfit.prompt);
    }
  }

  // 4. Footwear
  const shoesItems = (outfit.slots.shoes || [])
    .map(resolvePrompt)
    .filter(Boolean);
  next = setAt(next, `${basePath}.footwear`, shoesItems.join("; "));

  // 5. Accessories (headwear, eyewear, neckwear, jewelry, belt_waist, legwear, bag, accessory)
  const accessorySlots: WardrobeSlot[] = [
    "headwear",
    "eyewear",
    "neckwear",
    "jewelry",
    "belt_waist",
    "legwear",
    "bag",
    "accessory",
  ];
  const accList: string[] = [];
  for (const slotName of accessorySlots) {
    const slotItemIds = outfit.slots[slotName] || [];
    for (const id of slotItemIds) {
      const p = resolvePrompt(id);
      if (p && !accList.includes(p)) {
        accList.push(p);
      }
    }
  }
  next = setAt(next, `${basePath}.accessories`, accList);

  // 6. Textiles & weight
  const materials = Array.from(new Set(items.flatMap((i) => i.materials || [])));
  if (materials.length > 0) {
    next = setAt(next, `${basePath}.textiles_and_weight`, materials.join(", "));
  }

  // 7. Hardware & details
  const details = Array.from(new Set(items.flatMap((i) => i.details || [])));
  if (details.length > 0) {
    next = setAt(next, `${basePath}.hardware_and_details`, details.join("; "));
  }

  // 8. Negatives
  if (outfit.negative && outfit.negative.length > 0) {
    const currentNegs = doc.anti_cliche_exclusions ?? [];
    const mergedNegs = Array.from(new Set([...currentNegs, ...outfit.negative]));
    next = setAt(next, "anti_cliche_exclusions", mergedNegs);
  }

  return next;
}

export function isWardrobeOutfitApplied(
  doc: PromptDoc,
  outfit: WardrobeOutfit,
  slotIndex: number,
): boolean {
  const arch = doc.subjects[slotIndex]?.wardrobe_architecture;
  if (!arch) return false;

  // Check if outerwear matches if outfit has outerwear
  const outfitOuter = (outfit.slots.outerwear || [])
    .map((id) => WARDROBE_ITEMS_BY_ID.get(id)?.prompt)
    .filter(Boolean)
    .join("; ");
  if (outfitOuter && arch.layering_system.outerwear !== outfitOuter) {
    return false;
  }

  // Check footwear if outfit has footwear
  const outfitShoes = (outfit.slots.shoes || [])
    .map((id) => WARDROBE_ITEMS_BY_ID.get(id)?.prompt)
    .filter(Boolean)
    .join("; ");
  if (outfitShoes && arch.footwear !== outfitShoes) {
    return false;
  }

  // Check base layer
  const dressItems = (outfit.slots.dress_onepiece || [])
    .map((id) => WARDROBE_ITEMS_BY_ID.get(id)?.prompt)
    .filter(Boolean);
  if (dressItems.length > 0) {
    return arch.layering_system.base_layer === dressItems.join("; ");
  }

  const topItems = (outfit.slots.top || [])
    .map((id) => WARDROBE_ITEMS_BY_ID.get(id)?.prompt)
    .filter(Boolean);
  if (topItems.length > 0 && topItems[0] && !arch.layering_system.base_layer.includes(topItems[0])) {
    return false;
  }

  return true;
}

export function filterWardrobeItems(
  items: WardrobeItem[],
  query: string,
  slot: WardrobeSlot | "all" = "all",
  styleTag?: string,
): WardrobeItem[] {
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    if (slot !== "all" && item.slot !== slot) return false;
    if (styleTag && !item.style_tags.includes(styleTag)) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.prompt.toLowerCase().includes(q) ||
      item.subcategory.toLowerCase().includes(q) ||
      (item.materials && item.materials.some((m) => m.toLowerCase().includes(q))) ||
      (item.colors && item.colors.some((c) => c.toLowerCase().includes(q))) ||
      (item.details && item.details.some((d) => d.toLowerCase().includes(q))) ||
      (item.style_tags && item.style_tags.some((t) => t.toLowerCase().includes(q)))
    );
  });
}

export function filterWardrobeOutfits(
  outfits: WardrobeOutfit[],
  query: string,
  styleTag?: string,
): WardrobeOutfit[] {
  const q = query.trim().toLowerCase();
  return outfits.filter((outfit) => {
    if (styleTag && !outfit.style_tags.includes(styleTag)) return false;
    if (!q) return true;
    return (
      outfit.name.toLowerCase().includes(q) ||
      outfit.prompt.toLowerCase().includes(q) ||
      (outfit.style_tags && outfit.style_tags.some((t) => t.toLowerCase().includes(q)))
    );
  });
}

/**
 * Merge custom items with built-in items, placing custom items at the top
 */
export function combineWardrobeItems(
  builtIn: WardrobeItem[],
  custom: WardrobeItem[],
): WardrobeItem[] {
  if (!custom || custom.length === 0) return builtIn;
  const customIds = new Set(custom.map((c) => c.id));
  const filteredBuiltIn = builtIn.filter((b) => !customIds.has(b.id));
  return [...custom, ...filteredBuiltIn];
}

/**
 * Merge custom outfits with built-in outfits, placing custom outfits at the top
 */
export function combineWardrobeOutfits(
  builtIn: WardrobeOutfit[],
  custom: WardrobeOutfit[],
): WardrobeOutfit[] {
  if (!custom || custom.length === 0) return builtIn;
  const customIds = new Set(custom.map((c) => c.id));
  const filteredBuiltIn = builtIn.filter((b) => !customIds.has(b.id));
  return [...custom, ...filteredBuiltIn];
}
