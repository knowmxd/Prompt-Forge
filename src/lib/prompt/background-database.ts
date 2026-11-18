import { setAt, type PromptDoc } from "./model.ts";

export type BackgroundCategory =
  | "all"
  | "urban"
  | "brutalist"
  | "liminal"
  | "ruins"
  | "nature"
  | "textures";

export type BackgroundItem = {
  id: string;
  name: string;
  subtitle: string;
  category: Exclude<BackgroundCategory, "all">;
  badge: string;
  image: string;
  location: string;
  atmosphere: string;
  props: string[];
  tags: string[];
};

export const BACKGROUND_CATEGORIES: Array<{ id: BackgroundCategory; label: string }> = [
  {
    "id": "all",
    "label": "All (139)"
  },
  {
    "id": "urban",
    "label": "Urban & Street (36)"
  },
  {
    "id": "brutalist",
    "label": "Brutalist & Minimal (20)"
  },
  {
    "id": "liminal",
    "label": "Liminal & Neon (29)"
  },
  {
    "id": "ruins",
    "label": "Gothic & Ruins (28)"
  },
  {
    "id": "nature",
    "label": "Nature & Coast (13)"
  },
  {
    "id": "textures",
    "label": "Walls & Portals (13)"
  }
];

export const BACKGROUND_LIBRARY: BackgroundItem[] = [
  {
    "id": "bg_01_laundromat_night_glow",
    "name": "Midnight Laundromat Glow",
    "subtitle": "Dim Washer Row \u00b7 Warm Drum Light",
    "category": "liminal",
    "badge": "LIMINAL",
    "image": "/backgrounds/bg_01_laundromat_night_glow.webp",
    "location": "dark late-night laundromat interior with a row of stainless steel front-loading washing machines, one lit drum glowing warm amber",
    "atmosphere": "dim nocturnal indoor air lit by a single overhead fluorescent tube and warm orange washer drum glow",
    "props": [
      "blue plastic waiting chair",
      "stainless steel washing machines",
      "tiled linoleum floor"
    ],
    "tags": [
      "laundromat",
      "night",
      "liminal",
      "fluorescent",
      "indoor",
      "moody"
    ]
  },
  {
    "id": "bg_02_teal_laundromat_corridor",
    "name": "Cyan Laundromat Aisle",
    "subtitle": "Teal Fluorescent \u00b7 Empty Night",
    "category": "liminal",
    "badge": "NEON",
    "image": "/backgrounds/bg_02_teal_laundromat_corridor.webp",
    "location": "narrow empty laundromat aisle bathed in deep cyan-teal fluorescent light with rows of dark washers and ceiling fans",
    "atmosphere": "heavy teal-cyan nocturnal color cast, cool humid indoor air with faint red exit sign glow",
    "props": [
      "stainless steel dryers",
      "rolling laundry cart",
      "ceiling fans",
      "metal folding table"
    ],
    "tags": [
      "laundromat",
      "teal",
      "cyan",
      "liminal",
      "night",
      "neon"
    ]
  },
  {
    "id": "bg_03_24h_laundromat_storefront",
    "name": "24-Hour Laundromat Window",
    "subtitle": "Street-Level Glass \u00b7 Pink Neon",
    "category": "liminal",
    "badge": "STREET NIGHT",
    "image": "/backgrounds/bg_03_24h_laundromat_storefront.webp",
    "location": "street-level view looking through the glass storefront of a 24-hour laundromat with rows of washers and a pink neon sign",
    "atmosphere": "cool damp night street foreground contrasting with bright fluorescent white and magenta-pink interior glow",
    "props": [
      "glass storefront door",
      "24 hour laundromat window lettering",
      "folding chairs",
      "coin laundry machines"
    ],
    "tags": [
      "laundromat",
      "storefront",
      "night",
      "pink neon",
      "urban",
      "cinematic"
    ]
  },
  {
    "id": "bg_04_scorched_pine_forest",
    "name": "Charred Monochrome Woods",
    "subtitle": "Stark Tree Trunks \u00b7 Ash Mist",
    "category": "nature",
    "badge": "MONOCHROME",
    "image": "/backgrounds/bg_04_scorched_pine_forest.webp",
    "location": "charred monochrome forest clearing with tall bare blackened tree trunks rising from ash-covered ground",
    "atmosphere": "hazy silver-gray mist filtering through sparse trunks with long dramatic ground shadows",
    "props": [
      "charred tree trunks",
      "fallen burnt branches",
      "ash-covered forest floor"
    ],
    "tags": [
      "forest",
      "monochrome",
      "charred",
      "mist",
      "dark",
      "nature"
    ]
  },
  {
    "id": "bg_05_wildfire_brush_smoke",
    "name": "Wildfire Brush Clearing",
    "subtitle": "Orange Embers \u00b7 Thick Haze",
    "category": "nature",
    "badge": "ATMOSPHERE",
    "image": "/backgrounds/bg_05_wildfire_brush_smoke.webp",
    "location": "smoldering woodland clearing with low orange flames burning through dry underbrush beneath bare silhouetted trees",
    "atmosphere": "thick warm smoke haze diffusing pale daylight into a muted amber-gray sky",
    "props": [
      "bare woodland trees",
      "smoldering brush",
      "fallen charred logs"
    ],
    "tags": [
      "wildfire",
      "smoke",
      "embers",
      "forest",
      "haze",
      "dramatic"
    ]
  },
  {
    "id": "bg_06_moss_boardwalk_trail",
    "name": "Mossy Ravine Boardwalk",
    "subtitle": "Wooden Plank Path \u00b7 Lush Green",
    "category": "nature",
    "badge": "FOREST",
    "image": "/backgrounds/bg_06_moss_boardwalk_trail.webp",
    "location": "narrow weathered wooden boardwalk winding alongside a steep moss-draped rock wall in a lush Pacific Northwest forest",
    "atmosphere": "crisp dappled morning sunlight filtering through dense green canopy",
    "props": [
      "weathered timber boardwalk",
      "moss-covered boulders",
      "forest ferns"
    ],
    "tags": [
      "boardwalk",
      "moss",
      "forest",
      "trail",
      "green",
      "nature"
    ]
  },
  {
    "id": "bg_07_golden_moss_archway",
    "name": "Enchanted Moss Tunnel",
    "subtitle": "Overgrown Canopy \u00b7 Golden Light",
    "category": "nature",
    "badge": "FANTASY",
    "image": "/backgrounds/bg_07_golden_moss_archway.webp",
    "location": "cavernous natural archway formed by colossal moss-draped tree roots and hanging vines framing a glowing clearing",
    "atmosphere": "warm golden-green volumetric sunlight pouring through the distant forest opening",
    "props": [
      "hanging moss curtains",
      "gnarled tree roots",
      "winding dirt footpath"
    ],
    "tags": [
      "moss",
      "tunnel",
      "fantasy",
      "golden light",
      "forest",
      "overgrown"
    ]
  },
  {
    "id": "bg_08_stone_forest_stairway",
    "name": "Forest Stone Staircase",
    "subtitle": "Ancient Steps \u00b7 Tall Cedars",
    "category": "nature",
    "badge": "FOREST",
    "image": "/backgrounds/bg_08_stone_forest_stairway.webp",
    "location": "steep weathered stone staircase climbing up a narrow corridor between tall cedar trunks in a dense green forest",
    "atmosphere": "cool diffused shade beneath thick overhead foliage",
    "props": [
      "uneven stone steps",
      "mossy stone borders",
      "tall cedar trunks"
    ],
    "tags": [
      "stairs",
      "stone",
      "forest",
      "cedar",
      "trail",
      "nature"
    ]
  },
  {
    "id": "bg_09_foggy_shrine_torii",
    "name": "Misty Torii Shrine Steps",
    "subtitle": "Stone Lantern \u00b7 White Fog",
    "category": "nature",
    "badge": "SHRINE",
    "image": "/backgrounds/bg_09_foggy_shrine_torii.webp",
    "location": "wet stone shrine stairway ascending into thick white mist toward a towering silhouette torii gate with a carved stone lantern in the foreground",
    "atmosphere": "dense cool mountain fog softening distant trees and wrapping the shrine in quiet haze",
    "props": [
      "carved stone lantern",
      "wet stone steps",
      "torii gate",
      "mossy stone wall"
    ],
    "tags": [
      "torii",
      "shrine",
      "fog",
      "japan",
      "stairs",
      "mist"
    ]
  },
  {
    "id": "bg_10_emerald_moss_steps",
    "name": "Emerald Timber Steps",
    "subtitle": "Deep Rainforest \u00b7 Wet Ferns",
    "category": "nature",
    "badge": "FOREST",
    "image": "/backgrounds/bg_10_emerald_moss_steps.webp",
    "location": "narrow rustic timber-and-stone steps ascending through a vibrant emerald rainforest carpeted in moss and ferns",
    "atmosphere": "moist cool forest air with soft overhead canopy glow",
    "props": [
      "mossy log steps",
      "lush ferns",
      "dense green foliage"
    ],
    "tags": [
      "rainforest",
      "moss",
      "steps",
      "green",
      "trail",
      "nature"
    ]
  },
  {
    "id": "bg_11_woodland_torii_path",
    "name": "Woodland Torii Approach",
    "subtitle": "Sunlit Mist \u00b7 Wet Stone",
    "category": "nature",
    "badge": "SHRINE",
    "image": "/backgrounds/bg_11_woodland_torii_path.webp",
    "location": "traditional wooden torii gate standing across a wet flagstone forest path framed by towering straight tree trunks",
    "atmosphere": "bright misty morning backlight glowing through the upper canopy",
    "props": [
      "wooden torii gate",
      "wet flagstone path",
      "mossy stones",
      "tall forest trunks"
    ],
    "tags": [
      "torii",
      "shrine",
      "forest",
      "mist",
      "japan",
      "path"
    ]
  },
  {
    "id": "bg_12_stormy_fjord_peaks",
    "name": "Stormy Fjord Waters",
    "subtitle": "Dark Cliffs \u00b7 Low Rain Clouds",
    "category": "nature",
    "badge": "COAST",
    "image": "/backgrounds/bg_12_stormy_fjord_peaks.webp",
    "location": "vast calm dark fjord water flanked by steep sheer mountain cliffs beneath heavy slate-gray storm clouds",
    "atmosphere": "brooding overcast maritime air with distant rain shafts between peaks",
    "props": [
      "rippling dark water",
      "steep fjord cliffs",
      "low storm clouds"
    ],
    "tags": [
      "fjord",
      "mountains",
      "storm",
      "water",
      "dramatic",
      "nature"
    ]
  },
  {
    "id": "bg_13_cobalt_sea_stacks",
    "name": "Cobalt Sea Stack Cove",
    "subtitle": "Black Sand \u00b7 Twilight Blue",
    "category": "nature",
    "badge": "COAST",
    "image": "/backgrounds/bg_13_cobalt_sea_stacks.webp",
    "location": "black volcanic sand beach framed by a towering dark basalt cliff on the left and jagged sea stacks in the surf",
    "atmosphere": "deep twilight cobalt-blue maritime atmosphere with soft white ocean foam",
    "props": [
      "black volcanic sand",
      "basalt cliff wall",
      "distant sea stacks",
      "ocean surf"
    ],
    "tags": [
      "beach",
      "black sand",
      "blue hour",
      "cliffs",
      "iceland",
      "coast"
    ]
  },
  {
    "id": "bg_14_basalt_columns_beach",
    "name": "Basalt Column Cliffs",
    "subtitle": "Hexagonal Rock \u00b7 Black Sand",
    "category": "nature",
    "badge": "COAST",
    "image": "/backgrounds/bg_14_basalt_columns_beach.webp",
    "location": "dramatic stepped hexagonal basalt rock columns rising beside a sweeping black volcanic sand shoreline under storm clouds",
    "atmosphere": "crisp overcast coastal air with pale gray sky and silver ocean horizon",
    "props": [
      "hexagonal basalt columns",
      "black sand beach",
      "white surf line"
    ],
    "tags": [
      "basalt",
      "iceland",
      "black sand",
      "cliffs",
      "coast",
      "dramatic"
    ]
  },
  {
    "id": "bg_15_emerald_sea_arch_beach",
    "name": "Mossy Sea Arch Beach",
    "subtitle": "Black Sand \u00b7 Lone Horizon",
    "category": "nature",
    "badge": "COAST",
    "image": "/backgrounds/bg_15_emerald_sea_arch_beach.webp",
    "location": "expansive black sand beach stretching toward a massive moss-topped coastal rock headland and natural sea arch",
    "atmosphere": "misty North Atlantic sea spray softening the horizon under bright overcast sky",
    "props": [
      "black volcanic sand",
      "moss-covered headland",
      "natural sea arch",
      "ocean waves"
    ],
    "tags": [
      "black sand",
      "sea arch",
      "coast",
      "iceland",
      "minimal",
      "nature"
    ]
  },
  {
    "id": "bg_16_cryo_lab_corridor",
    "name": "Cobalt Cryo Lab Corridor",
    "subtitle": "Glowing Cylinders \u00b7 Reflections",
    "category": "liminal",
    "badge": "SCI-FI",
    "image": "/backgrounds/bg_16_cryo_lab_corridor.webp",
    "location": "futuristic sterile laboratory corridor lined with tall glowing electric-blue glass bio-containment cylinders and reflective white floors",
    "atmosphere": "intense cool cobalt-blue specular glow with crisp reflections across polished lab flooring",
    "props": [
      "glowing blue glass cylinders",
      "metallic lab framing",
      "reflective white floor"
    ],
    "tags": [
      "sci-fi",
      "lab",
      "blue",
      "futuristic",
      "corridor",
      "glow"
    ]
  },
  {
    "id": "bg_17_vaulted_gothic_cloister",
    "name": "Mossy Vaulted Cloister",
    "subtitle": "Ribbed Stone Arches \u00b7 Decay",
    "category": "ruins",
    "badge": "GOTHIC",
    "image": "/backgrounds/bg_17_vaulted_gothic_cloister.webp",
    "location": "ancient weathered stone cloister corridor with ornate ribbed gothic vaulting overhead and damp mossy flagstones underfoot",
    "atmosphere": "cool shadowed stone interior with soft daylight entering from side arches",
    "props": [
      "ribbed stone vaults",
      "carved stone pillars",
      "damp mossy flagstones"
    ],
    "tags": [
      "gothic",
      "cloister",
      "ruins",
      "stone",
      "cathedral",
      "dark"
    ]
  },
  {
    "id": "bg_18_dark_circus_ring",
    "name": "Empty Circus Big Top",
    "subtitle": "Red Ring \u00b7 String Lights",
    "category": "liminal",
    "badge": "CIRCUS",
    "image": "/backgrounds/bg_18_dark_circus_ring.webp",
    "location": "dark empty circus tent interior spotlighting a red-and-gold star-patterned sawdust ring beneath overhead string lights",
    "atmosphere": "theatrical dusty spotlight haze surrounded by pitch-black tiered bleachers",
    "props": [
      "red circular stage mat",
      "sawdust ring border",
      "overhead string lights",
      "center tent pole"
    ],
    "tags": [
      "circus",
      "stage",
      "liminal",
      "dark",
      "spotlight",
      "theatrical"
    ]
  },
  {
    "id": "bg_19_red_curtain_checker_room",
    "name": "Red Curtain Checker Room",
    "subtitle": "Velvet Drapes \u00b7 Black & White",
    "category": "liminal",
    "badge": "SURREAL",
    "image": "/backgrounds/bg_19_red_curtain_checker_room.webp",
    "location": "surreal theatrical chamber framed by heavy parted crimson velvet curtains opening onto a black-and-white checkered floor and red-checked backdrop",
    "atmosphere": "warm dramatic stage lighting casting soft folds across the velvet drapes",
    "props": [
      "parted crimson velvet curtains",
      "black and white checkered floor",
      "checkered back wall"
    ],
    "tags": [
      "surreal",
      "twin peaks",
      "red curtain",
      "checkerboard",
      "liminal",
      "stage"
    ]
  },
  {
    "id": "bg_20_crimson_carpet_chapel",
    "name": "Crimson Carpet Chapel Hall",
    "subtitle": "Gothic Arches \u00b7 Red Sofa",
    "category": "liminal",
    "badge": "GOTHIC",
    "image": "/backgrounds/bg_20_crimson_carpet_chapel.webp",
    "location": "empty vaulted gothic hall with pale plaster pointed arches, a plush deep-red wall-to-wall carpet, and a lone red velvet settee on the left",
    "atmosphere": "eerie dim interior glow from a single high circular oculus light above the dark doorway",
    "props": [
      "red wall-to-wall carpet",
      "red velvet sofa",
      "pointed gothic arches",
      "dark arched doorway"
    ],
    "tags": [
      "chapel",
      "red carpet",
      "gothic",
      "liminal",
      "velvet",
      "minimal"
    ]
  },
  {
    "id": "bg_21_checker_cathedral_nave",
    "name": "Checkered Cathedral Nave",
    "subtitle": "Tall Lancet Window \u00b7 Marble",
    "category": "ruins",
    "badge": "GOTHIC",
    "image": "/backgrounds/bg_21_checker_cathedral_nave.webp",
    "location": "symmetrical dark gothic church corridor with glossy black-white-and-red checkered marble floor leading toward a glowing arched stained-glass window",
    "atmosphere": "cool backlit daylight streaming down the reflective marble aisle against dark carved walls",
    "props": [
      "checkered marble floor",
      "dark gothic columns",
      "tall arched window"
    ],
    "tags": [
      "cathedral",
      "marble",
      "gothic",
      "symmetrical",
      "dark",
      "corridor"
    ]
  },
  {
    "id": "bg_22_decayed_theater_stage",
    "name": "Abandoned Velvet Theater",
    "subtitle": "Tattered Drapes \u00b7 Wooden Steps",
    "category": "ruins",
    "badge": "THEATER",
    "image": "/backgrounds/bg_22_decayed_theater_stage.webp",
    "location": "weathered abandoned theater stage framed by dusty crimson velvet proscenium curtains, peeling plaster, and narrow wooden stairs at center",
    "atmosphere": "dim dusty ambient light revealing aged textures and faded crimson fabric",
    "props": [
      "tattered red velvet curtains",
      "wooden stage steps",
      "weathered floorboards",
      "peeling proscenium"
    ],
    "tags": [
      "theater",
      "abandoned",
      "velvet",
      "stage",
      "ruins",
      "vintage"
    ]
  },
  {
    "id": "bg_23_graffiti_red_shutter_alley",
    "name": "Red Shutter Graffiti Alley",
    "subtitle": "Roll-Up Door \u00b7 Tagging",
    "category": "urban",
    "badge": "STREET",
    "image": "/backgrounds/bg_23_graffiti_red_shutter_alley.webp",
    "location": "gritty urban alleyway featuring a bright red corrugated roll-up shutter covered in graffiti beside concrete stairs and metal railings",
    "atmosphere": "moody evening overhead alley light catching damp concrete and painted tags",
    "props": [
      "red corrugated metal shutter",
      "graffiti-covered brick wall",
      "metal stair railing"
    ],
    "tags": [
      "alley",
      "graffiti",
      "red shutter",
      "urban",
      "streetwear",
      "gritty"
    ]
  },
  {
    "id": "bg_24_underwater_pool_ladder",
    "name": "Underwater Pool Ladder",
    "subtitle": "Turquoise Caustics \u00b7 Chrome",
    "category": "liminal",
    "badge": "AQUATIC",
    "image": "/backgrounds/bg_24_underwater_pool_ladder.webp",
    "location": "submerged upward-looking view from the bottom of a bright turquoise swimming pool toward a chrome pool ladder and rippling water surface",
    "atmosphere": "refracted sunlit water caustics shimmering across crisp pool-blue water",
    "props": [
      "chrome pool ladder",
      "curved white pool wall",
      "rippling water surface"
    ],
    "tags": [
      "underwater",
      "pool",
      "turquoise",
      "caustics",
      "aquatic",
      "summer"
    ]
  },
  {
    "id": "bg_25_chalk_brick_parking_lot",
    "name": "Whitewashed Brick Parking Lot",
    "subtitle": "Crisp Lines \u00b7 Pale Dusk",
    "category": "textures",
    "badge": "URBAN",
    "image": "/backgrounds/bg_25_chalk_brick_parking_lot.webp",
    "location": "minimalist urban parking lot with crisp yellow diagonal pavement markings in front of a tall pale painted cinderblock wall with faint graffiti",
    "atmosphere": "clean late-afternoon twilight sky casting even flat light across the wall",
    "props": [
      "pale painted cinderblock wall",
      "diagonal yellow parking lines",
      "dark asphalt"
    ],
    "tags": [
      "parking lot",
      "minimal",
      "brick wall",
      "urban",
      "streetwear",
      "clean"
    ]
  },
  {
    "id": "bg_26_raw_concrete_studio_cube",
    "name": "Raw Concrete Studio Cube",
    "subtitle": "Cast-In-Place \u00b7 Soft Daylight",
    "category": "brutalist",
    "badge": "BRUTALIST",
    "image": "/backgrounds/bg_26_raw_concrete_studio_cube.webp",
    "location": "empty raw cast-concrete architectural room with board-formed ceiling seams and soft directional daylight grazing the floor",
    "atmosphere": "clean minimal ambient daylight creating a soft gradient across raw gray concrete",
    "props": [
      "raw concrete walls",
      "smooth concrete floor",
      "cast concrete ceiling"
    ],
    "tags": [
      "concrete",
      "brutalist",
      "minimal",
      "studio",
      "architecture",
      "gray"
    ]
  },
  {
    "id": "bg_27_crt_television_tower",
    "name": "CRT Television Tower",
    "subtitle": "Tangled Cables \u00b7 Gallery White",
    "category": "liminal",
    "badge": "TECH ART",
    "image": "/backgrounds/bg_27_crt_television_tower.webp",
    "location": "stacked pyramid tower of vintage CRT box televisions wrapped in trailing black cables displaying monochrome figures in a stark white gallery",
    "atmosphere": "cool blue-white CRT screen glow against clean neutral gallery light",
    "props": [
      "stacked CRT televisions",
      "tangled black power cables",
      "white gallery wall"
    ],
    "tags": [
      "crt",
      "tv",
      "installation",
      "retro tech",
      "gallery",
      "liminal"
    ]
  },
  {
    "id": "bg_28_graffiti_rooftop_skyline",
    "name": "Graffiti Rooftop Skyline",
    "subtitle": "Night High-Rises \u00b7 Gravel",
    "category": "urban",
    "badge": "ROOFTOP",
    "image": "/backgrounds/bg_28_graffiti_rooftop_skyline.webp",
    "location": "dark gravel urban rooftop overlooking a tagged concrete parapet wall with illuminated city skyscrapers rising against a cloudy night sky",
    "atmosphere": "cool urban night glow from surrounding high-rise windows",
    "props": [
      "graffiti-tagged parapet wall",
      "dark rooftop gravel",
      "distant lit skyscrapers"
    ],
    "tags": [
      "rooftop",
      "skyline",
      "night",
      "graffiti",
      "city",
      "urban"
    ]
  },
  {
    "id": "bg_29_neon_arcade_aisle",
    "name": "Neon Retro Arcade Aisle",
    "subtitle": "UV Carpet \u00b7 Glowing Cabinets",
    "category": "liminal",
    "badge": "ARCADE",
    "image": "/backgrounds/bg_29_neon_arcade_aisle.webp",
    "location": "dark retro video arcade interior with glowing neon-blue and magenta game cabinets reflecting over patterned UV carpet",
    "atmosphere": "saturated electric-blue, magenta, and cyan neon glow in dark ambient air",
    "props": [
      "glowing arcade cabinets",
      "neon ceiling trims",
      "UV-patterned arcade carpet"
    ],
    "tags": [
      "arcade",
      "neon",
      "retro",
      "cyber",
      "night",
      "liminal"
    ]
  },
  {
    "id": "bg_30_vintage_arcade_row",
    "name": "Dim Vintage Arcade Row",
    "subtitle": "CRT Screens \u00b7 Bar Stools",
    "category": "liminal",
    "badge": "ARCADE",
    "image": "/backgrounds/bg_30_vintage_arcade_row.webp",
    "location": "narrow moody arcade corridor lined with glowing vintage upright arcade cabinets, round stools, and overhead blue-cyan strip lights",
    "atmosphere": "warm CRT screen spill mixing with cool cyan ceiling reflections",
    "props": [
      "upright arcade cabinets",
      "round padded bar stools",
      "dark tiled floor"
    ],
    "tags": [
      "arcade",
      "retro",
      "gaming",
      "neon",
      "night",
      "moody"
    ]
  },
  {
    "id": "bg_31_stacked_arcade_monitors",
    "name": "CRT Monitor Wall",
    "subtitle": "Magenta Glow \u00b7 Retro Games",
    "category": "liminal",
    "badge": "ARCADE",
    "image": "/backgrounds/bg_31_stacked_arcade_monitors.webp",
    "location": "dense floor-to-ceiling wall of glowing vintage CRT televisions displaying colorful retro video game title screens under purple-magenta neon",
    "atmosphere": "vibrant purple and magenta ambient light reflecting off glass CRT screens",
    "props": [
      "stacked CRT monitors",
      "retro game screens",
      "purple neon framing"
    ],
    "tags": [
      "crt",
      "retro",
      "gaming",
      "magenta",
      "neon",
      "wall"
    ]
  },
  {
    "id": "bg_32_curved_subway_tunnel",
    "name": "Curved Tiled Subway Tunnel",
    "subtitle": "White & Ochre Tile \u00b7 Posters",
    "category": "urban",
    "badge": "SUBWAY",
    "image": "/backgrounds/bg_32_curved_subway_tunnel.webp",
    "location": "curved underground metro pedestrian tunnel clad in glossy white, cobalt-blue, and ochre-yellow ceramic tiles with framed vintage posters",
    "atmosphere": "warm overhead fluorescent strip lighting curving down the tiled passage",
    "props": [
      "curved glossy tile walls",
      "framed transit posters",
      "speckled terrazzo floor"
    ],
    "tags": [
      "subway",
      "tunnel",
      "curved",
      "metro",
      "tiles",
      "urban"
    ]
  },
  {
    "id": "bg_33_industrial_subway_stairs",
    "name": "Industrial Subway Stairwell",
    "subtitle": "White Tile \u00b7 Conduit Pipes",
    "category": "urban",
    "badge": "SUBWAY",
    "image": "/backgrounds/bg_33_industrial_subway_stairs.webp",
    "location": "gritty underground subway entrance stairwell with weathered white ceramic tiles, exposed metal conduit pipes, and yellow safety stair treads",
    "atmosphere": "harsh cool overhead fluorescent tube lighting",
    "props": [
      "white ceramic tile walls",
      "exposed metal conduit pipes",
      "steel handrails",
      "yellow stair nosing"
    ],
    "tags": [
      "subway",
      "stairs",
      "industrial",
      "urban",
      "gritty",
      "metro"
    ]
  },
  {
    "id": "bg_34_sickly_green_underpass",
    "name": "Liminal Green Underpass",
    "subtitle": "Fluorescent Cast \u00b7 Empty Turn",
    "category": "liminal",
    "badge": "LIMINAL",
    "image": "/backgrounds/bg_34_sickly_green_underpass.webp",
    "location": "empty sterile underground pedestrian passage bathed in pale sickly yellow-green fluorescent light with tiled corner walls and a green exit sign",
    "atmosphere": "eerie flat greenish-yellow fluorescent cast with soft ceiling reflections",
    "props": [
      "pale tiled walls",
      "glowing green exit sign",
      "checkered stone floor"
    ],
    "tags": [
      "liminal",
      "underpass",
      "green",
      "fluorescent",
      "empty",
      "backrooms"
    ]
  },
  {
    "id": "bg_35_ruined_metro_escalator",
    "name": "Abandoned Metro Escalator",
    "subtitle": "Crumbling Vault \u00b7 Glass Booth",
    "category": "ruins",
    "badge": "ABANDONED",
    "image": "/backgrounds/bg_35_ruined_metro_escalator.webp",
    "location": "derelict underground metro station with rusted dead escalators, a shattered cylindrical glass booth, and peeling vaulted masonry",
    "atmosphere": "cool blue-gray ambient shaft light contrasting with rusted warm debris",
    "props": [
      "rusted escalators",
      "shattered cylindrical booth",
      "crumbling concrete floor"
    ],
    "tags": [
      "abandoned",
      "metro",
      "ruins",
      "escalator",
      "post-apocalyptic",
      "dark"
    ]
  },
  {
    "id": "bg_36_long_tiled_pedestrian_tube",
    "name": "Long Tiled Metro Passage",
    "subtitle": "Tactile Yellow Line \u00b7 Tubes",
    "category": "urban",
    "badge": "SUBWAY",
    "image": "/backgrounds/bg_36_long_tiled_pedestrian_tube.webp",
    "location": "long narrow symmetrical underground subway corridor lined with white square tiles, tactile yellow floor strip, and twin fluorescent rows",
    "atmosphere": "even cool-white fluorescent illumination receding down the corridor",
    "props": [
      "white square tiled walls",
      "tactile yellow floor paving",
      "twin fluorescent strips"
    ],
    "tags": [
      "subway",
      "corridor",
      "symmetrical",
      "tiles",
      "urban",
      "minimal"
    ]
  },
  {
    "id": "bg_37_skylight_grid_gallery",
    "name": "Skylight Grid Art Gallery",
    "subtitle": "Dark Wood Bench \u00b7 White Box",
    "category": "brutalist",
    "badge": "GALLERY",
    "image": "/backgrounds/bg_37_skylight_grid_gallery.webp",
    "location": "expansive minimalist white-cube art gallery featuring an illuminated overhead frosted skylight grid and a lone dark timber bench",
    "atmosphere": "ultra-clean shadowless diffused daylight pouring from the ceiling grid",
    "props": [
      "dark timber gallery bench",
      "frosted skylight ceiling grid",
      "light terrazzo floor"
    ],
    "tags": [
      "gallery",
      "minimal",
      "white",
      "architecture",
      "clean",
      "modern"
    ]
  },
  {
    "id": "bg_38_monolith_concrete_gallery",
    "name": "Minimalist Monolith Gallery",
    "subtitle": "Faceted Stone \u00b7 Skylights",
    "category": "brutalist",
    "badge": "GALLERY",
    "image": "/backgrounds/bg_38_monolith_concrete_gallery.webp",
    "location": "clean symmetrical modern art gallery with bare gray concrete floors, crisp white walls, and a faceted geometric stone sculpture at center",
    "atmosphere": "even diffused overhead skylight strip lighting with soft ambient floor reflections",
    "props": [
      "faceted geometric stone sculpture",
      "low square plinth",
      "polished concrete floor"
    ],
    "tags": [
      "gallery",
      "minimal",
      "sculpture",
      "concrete",
      "modern",
      "clean"
    ]
  },
  {
    "id": "bg_39_white_cube_paper_city",
    "name": "White Block Installation",
    "subtitle": "Stacked Cubes \u00b7 Soft Shadow",
    "category": "brutalist",
    "badge": "SCULPTURAL",
    "image": "/backgrounds/bg_39_white_cube_paper_city.webp",
    "location": "sculptural installation of hundreds of stacked matte white cubic blocks rising like a miniature city against a shadowed industrial skylight wall",
    "atmosphere": "soft diffused gallery sidelight sculpting clean geometric shadows",
    "props": [
      "stacked white cubic blocks",
      "dark industrial window mullions"
    ],
    "tags": [
      "minimal",
      "cubes",
      "installation",
      "white",
      "geometric",
      "art"
    ]
  },
  {
    "id": "bg_40_warm_gallery_partition",
    "name": "Warm Partition Gallery",
    "subtitle": "Polished Floor \u00b7 Quiet Hall",
    "category": "brutalist",
    "badge": "GALLERY",
    "image": "/backgrounds/bg_40_warm_gallery_partition.webp",
    "location": "architectural museum corridor with a dark ceiling soffit opening into a warmly lit white gallery space with a framed portrait and seated visitor",
    "atmosphere": "warm diffused museum skylight contrasting with dark foreground shadow",
    "props": [
      "matte white partition wall",
      "polished concrete floor",
      "linear ceiling lights"
    ],
    "tags": [
      "gallery",
      "museum",
      "modern",
      "warm",
      "minimal",
      "architecture"
    ]
  },
  {
    "id": "bg_41_black_plinth_skylight_room",
    "name": "Black Plinth Light Room",
    "subtitle": "Dark Stage \u00b7 White Void",
    "category": "brutalist",
    "badge": "MINIMAL",
    "image": "/backgrounds/bg_41_black_plinth_skylight_room.webp",
    "location": "stark contemporary installation space with a large glossy black square platform resting on dark parquet beneath a glowing white skylight ceiling",
    "atmosphere": "high-contrast clean top light reflecting off the black plinth surface",
    "props": [
      "large black square platform",
      "dark parquet floor",
      "luminous white ceiling"
    ],
    "tags": [
      "minimal",
      "monochrome",
      "plinth",
      "gallery",
      "high contrast",
      "modern"
    ]
  },
  {
    "id": "bg_42_monochrome_mural_gallery",
    "name": "Monochrome Mural Gallery",
    "subtitle": "Glossy Concrete \u00b7 White Hall",
    "category": "brutalist",
    "badge": "GALLERY",
    "image": "/backgrounds/bg_42_monochrome_mural_gallery.webp",
    "location": "long sleek modern art gallery with a high-gloss dark concrete floor reflecting an abstract black-and-white mural along the white wall",
    "atmosphere": "bright diffused skylight illumination with crisp floor reflections",
    "props": [
      "glossy concrete floor",
      "large abstract monochrome wall panel",
      "white gallery walls"
    ],
    "tags": [
      "gallery",
      "modern",
      "monochrome",
      "clean",
      "minimal",
      "reflection"
    ]
  },
  {
    "id": "bg_43_noir_ruined_cathedral_fog",
    "name": "Noir Ruined Cathedral Fog",
    "subtitle": "Jagged Spires \u00b7 Storm Sky",
    "category": "ruins",
    "badge": "GOTHIC",
    "image": "/backgrounds/bg_43_noir_ruined_cathedral_fog.webp",
    "location": "monochrome apocalyptic landscape of shattered gothic cathedral silhouettes with broken crosses and jagged spires rising through dark fog",
    "atmosphere": "dramatic high-contrast storm clouds backlighting thick ground-level mist",
    "props": [
      "shattered stone spires",
      "fallen rubble path",
      "broken stone crosses"
    ],
    "tags": [
      "gothic",
      "ruins",
      "monochrome",
      "fog",
      "apocalyptic",
      "dark"
    ]
  },
  {
    "id": "bg_44_sunbeam_stone_abbey",
    "name": "Sunbeam Stone Abbey Hall",
    "subtitle": "Tall Lancet Windows \u00b7 Light",
    "category": "ruins",
    "badge": "GOTHIC",
    "image": "/backgrounds/bg_44_sunbeam_stone_abbey.webp",
    "location": "grand ruined stone abbey interior with soaring gothic arches and three tall lancet windows streaming parallel golden sunbeams across the stone floor",
    "atmosphere": "dramatic volumetric morning sunbeams cutting through cool shadowed stone air",
    "props": [
      "soaring stone arches",
      "ruined stone columns",
      "sunlit flagstone floor"
    ],
    "tags": [
      "abbey",
      "sunbeams",
      "gothic",
      "ruins",
      "cathedral",
      "light shafts"
    ]
  },
  {
    "id": "bg_45_ivy_abbey_courtyard",
    "name": "Ivy Cloister Courtyard",
    "subtitle": "Stone Basin \u00b7 Overgrown Arch",
    "category": "ruins",
    "badge": "GOTHIC",
    "image": "/backgrounds/bg_45_ivy_abbey_courtyard.webp",
    "location": "quiet mossy gothic abbey courtyard with a weathered stone water basin, vaulted colonnade on the left, and stone stairs climbing into ivy",
    "atmosphere": "cool overcast garden shade filtering through arched stone openings",
    "props": [
      "carved stone basin",
      "mossy flagstone walkway",
      "ivy-draped stone arches"
    ],
    "tags": [
      "courtyard",
      "cloister",
      "ivy",
      "ruins",
      "gothic",
      "stone"
    ]
  },
  {
    "id": "bg_46_emerald_moss_abbey_arch",
    "name": "Overgrown Abbey Nave",
    "subtitle": "Lush Moss \u00b7 Misty Forest",
    "category": "ruins",
    "badge": "GOTHIC",
    "image": "/backgrounds/bg_46_emerald_moss_abbey_arch.webp",
    "location": "roofless gothic stone abbey archway completely draped in emerald moss and creeping vines with misty woodland visible beyond",
    "atmosphere": "cool damp forest mist drifting through ancient stone arches",
    "props": [
      "moss-draped gothic arches",
      "grassy stone floor",
      "overgrown stone pillars"
    ],
    "tags": [
      "ruins",
      "abbey",
      "moss",
      "gothic",
      "forest",
      "overgrown"
    ]
  },
  {
    "id": "bg_47_broken_stone_arch_sky",
    "name": "Broken Stone Arch Sky",
    "subtitle": "Crumbled Masonry \u00b7 Blue Sky",
    "category": "ruins",
    "badge": "RUINS",
    "image": "/backgrounds/bg_47_broken_stone_arch_sky.webp",
    "location": "jagged ruined stone archway and crumbling masonry wall framing bright blue sky and drifting white clouds",
    "atmosphere": "crisp natural afternoon sunlight grazing rough weathered limestone",
    "props": [
      "crumbling limestone arch",
      "rough stone masonry"
    ],
    "tags": [
      "ruins",
      "stone",
      "arch",
      "daylight",
      "medieval",
      "outdoor"
    ]
  },
  {
    "id": "bg_48_grassy_abbey_light_shafts",
    "name": "Grassy Abbey Light Shafts",
    "subtitle": "Sunlit Turf \u00b7 Ruined Nave",
    "category": "ruins",
    "badge": "GOTHIC",
    "image": "/backgrounds/bg_48_grassy_abbey_light_shafts.webp",
    "location": "open-air ruined cathedral nave carpeted in lush green grass with golden morning light shafts streaming through triple gothic windows",
    "atmosphere": "warm misty morning sunbeams illuminating soft grass and pale stone",
    "props": [
      "tall ruined stone nave",
      "green grass carpet",
      "gothic tracery windows"
    ],
    "tags": [
      "abbey",
      "sunbeams",
      "grass",
      "ruins",
      "gothic",
      "serene"
    ]
  },
  {
    "id": "bg_49_foggy_white_cathedral_nave",
    "name": "Foggy White Cathedral",
    "subtitle": "Monochrome Mist \u00b7 High Vaults",
    "category": "ruins",
    "badge": "GOTHIC",
    "image": "/backgrounds/bg_49_foggy_white_cathedral_nave.webp",
    "location": "ethereal monochrome view inside a towering ruined cathedral filled with luminous white mist rising beneath tall gothic lancet windows",
    "atmosphere": "bright misty backlighting creating soft silhouettes and ghostly stone depth",
    "props": [
      "tall gothic lancet windows",
      "weathered stone piers",
      "rubble floor"
    ],
    "tags": [
      "cathedral",
      "fog",
      "monochrome",
      "gothic",
      "ethereal",
      "ruins"
    ]
  },
  {
    "id": "bg_50_snowy_abbey_facade",
    "name": "Snow-Dusted Abbey Facade",
    "subtitle": "Stone Gable \u00b7 Winter Sky",
    "category": "ruins",
    "badge": "GOTHIC",
    "image": "/backgrounds/bg_50_snowy_abbey_facade.webp",
    "location": "weathered dark stone gothic abbey gable with empty arched windows standing in light snow under a pale winter overcast sky",
    "atmosphere": "cold crisp winter daylight across snow-dusted turf and dark masonry",
    "props": [
      "gothic stone gable",
      "snow-dusted grass",
      "fallen stone blocks"
    ],
    "tags": [
      "snow",
      "abbey",
      "winter",
      "ruins",
      "gothic",
      "cold"
    ]
  },
  {
    "id": "bg_51_overgrown_chapel_pews",
    "name": "Overgrown Chapel Sanctuary",
    "subtitle": "Broken Glass Roof \u00b7 Vines",
    "category": "ruins",
    "badge": "GOTHIC",
    "image": "/backgrounds/bg_51_overgrown_chapel_pews.webp",
    "location": "abandoned stone chapel interior where creeping green vines and ferns overtake wooden pews, stone altar, and a shattered vaulted ceiling",
    "atmosphere": "soft diffused daylight filtering down through broken roof rafters",
    "props": [
      "ivy-covered wooden pews",
      "weathered stone altar",
      "mossy floor tiles"
    ],
    "tags": [
      "chapel",
      "abandoned",
      "overgrown",
      "vines",
      "ruins",
      "gothic"
    ]
  },
  {
    "id": "bg_52_sunlit_abbey_ruin_field",
    "name": "Wildflower Abbey Ruins",
    "subtitle": "Golden Grass \u00b7 Clear Sky",
    "category": "ruins",
    "badge": "RUINS",
    "image": "/backgrounds/bg_52_sunlit_abbey_ruin_field.webp",
    "location": "monumental crumbling stone abbey arches standing amid dry wild grass and weathered rubble under a clear late-afternoon blue sky",
    "atmosphere": "crisp natural golden-hour side light across pale limestone",
    "props": [
      "crumbling stone arcade",
      "dry wild grass",
      "scattered limestone"
    ],
    "tags": [
      "ruins",
      "abbey",
      "field",
      "stone",
      "historic",
      "outdoor"
    ]
  },
  {
    "id": "bg_53_abandoned_villa_pool",
    "name": "Abandoned Villa Pool",
    "subtitle": "Algae Water \u00b7 Tall Windows",
    "category": "ruins",
    "badge": "ABANDONED",
    "image": "/backgrounds/bg_53_abandoned_villa_pool.webp",
    "location": "derelict neoclassical indoor swimming pool with shallow green algae-stained water, peeling white walls, and tall grid windows",
    "atmosphere": "cool overcast daylight pouring through tall mullioned windows",
    "props": [
      "algae-stained tiled pool",
      "peeling white pillars",
      "tall grid windows"
    ],
    "tags": [
      "pool",
      "abandoned",
      "villa",
      "liminal",
      "decay",
      "indoor"
    ]
  },
  {
    "id": "bg_54_steamy_empty_indoor_pool",
    "name": "Steamy Foggy Pool Hall",
    "subtitle": "Thick Steam \u00b7 Pink Tile Deck",
    "category": "liminal",
    "badge": "LIMINAL",
    "image": "/backgrounds/bg_54_steamy_empty_indoor_pool.webp",
    "location": "empty retro indoor swimming pool shrouded in dense white steam with pale turquoise water, metal lane railings, and red-tiled deck",
    "atmosphere": "heavy humid steam haze diffusing bright overhead strip lights",
    "props": [
      "empty indoor pool",
      "metal pool railings",
      "red tiled deck"
    ],
    "tags": [
      "pool",
      "steam",
      "liminal",
      "fog",
      "backrooms",
      "retro"
    ]
  },
  {
    "id": "bg_55_emerald_tiled_pool_hall",
    "name": "Teal Tiled Pool Hall",
    "subtitle": "Symmetrical Reflections \u00b7 Chairs",
    "category": "liminal",
    "badge": "LIMINAL",
    "image": "/backgrounds/bg_55_emerald_tiled_pool_hall.webp",
    "location": "symmetrical vintage indoor swimming pool with deep teal-blue water, rows of white plastic poolside chairs, and glowing rectangular ceiling panels",
    "atmosphere": "cool clinical cyan-green fluorescent light reflecting off mirror-still water",
    "props": [
      "mirror-still teal pool",
      "row of white poolside chairs",
      "luminous ceiling panels"
    ],
    "tags": [
      "pool",
      "teal",
      "symmetrical",
      "liminal",
      "cinematic",
      "indoor"
    ]
  },
  {
    "id": "bg_56_overgrown_rotunda_greenhouse",
    "name": "Overgrown Rotunda Conservatory",
    "subtitle": "Glass Dome \u00b7 Mossy Benches",
    "category": "ruins",
    "badge": "GREENHOUSE",
    "image": "/backgrounds/bg_56_overgrown_rotunda_greenhouse.webp",
    "location": "abandoned circular glass-domed botanical conservatory with mossy stone benches, cracked walkway, and creeping greenery",
    "atmosphere": "soft diffused daylight filtering through weathered glass panes",
    "props": [
      "curved iron glass dome",
      "mossy stone benches",
      "overgrown stone path"
    ],
    "tags": [
      "greenhouse",
      "conservatory",
      "overgrown",
      "ruins",
      "botanical",
      "glass"
    ]
  },
  {
    "id": "bg_57_ivy_manor_conservatory",
    "name": "Ivy Manor Conservatory",
    "subtitle": "Rusted Iron \u00b7 Forest Edge",
    "category": "ruins",
    "badge": "GREENHOUSE",
    "image": "/backgrounds/bg_57_ivy_manor_conservatory.webp",
    "location": "grand abandoned Victorian glass conservatory attached to a stone manor house, wrapped in thick climbing ivy against dense green trees",
    "atmosphere": "bright overcast daylight softening weathered rust and lush foliage",
    "props": [
      "rusted iron conservatory frame",
      "climbing ivy walls",
      "stone manor facade"
    ],
    "tags": [
      "conservatory",
      "abandoned",
      "ivy",
      "manor",
      "victorian",
      "ruins"
    ]
  },
  {
    "id": "bg_58_jungle_glasshouse_dome",
    "name": "Jungle Glasshouse Dome",
    "subtitle": "Broken Panes \u00b7 Wild Ferns",
    "category": "ruins",
    "badge": "GREENHOUSE",
    "image": "/backgrounds/bg_58_jungle_glasshouse_dome.webp",
    "location": "wildly overgrown Victorian iron-and-glass conservatory interior choked with climbing vines and lush ferns under arched skylights",
    "atmosphere": "cool shaded botanical greenhouse light filtering through misty glass",
    "props": [
      "arched iron ribs",
      "dense climbing vines",
      "lush interior foliage"
    ],
    "tags": [
      "greenhouse",
      "overgrown",
      "vines",
      "botanical",
      "ruins",
      "dark"
    ]
  },
  {
    "id": "bg_59_alpine_teal_greenhouse",
    "name": "Alpine Teal Conservatory",
    "subtitle": "Verdi-Gris Iron \u00b7 Mountain Mist",
    "category": "ruins",
    "badge": "GREENHOUSE",
    "image": "/backgrounds/bg_59_alpine_teal_greenhouse.webp",
    "location": "ornate weathered green-patina glass conservatory standing before misty alpine mountains with overgrown grass at the threshold",
    "atmosphere": "cool teal-tinted overcast mountain air and soft diffused sky",
    "props": [
      "ornate iron-and-glass facade",
      "cracked stone steps",
      "wild grass"
    ],
    "tags": [
      "greenhouse",
      "teal",
      "vintage",
      "mountains",
      "overgrown",
      "cinematic"
    ]
  },
  {
    "id": "bg_60_brutalist_cantilever_towers",
    "name": "Brutalist Concrete Cantilever",
    "subtitle": "Monochrome Geometry \u00b7 Bold",
    "category": "brutalist",
    "badge": "BRUTALIST",
    "image": "/backgrounds/bg_60_brutalist_cantilever_towers.webp",
    "location": "monumental monochrome brutalist concrete sculpture-architecture of interlocking cantilevered slabs and angular shadows",
    "atmosphere": "crisp high-contrast daylight sculpting sharp concrete planes",
    "props": [
      "cantilevered concrete slabs",
      "monolithic concrete piers"
    ],
    "tags": [
      "brutalist",
      "concrete",
      "monochrome",
      "architecture",
      "geometric",
      "bold"
    ]
  },
  {
    "id": "bg_61_foggy_buzludzha_monument",
    "name": "Foggy Brutalist Saucer Monument",
    "subtitle": "Stepped Approach \u00b7 Dense Mist",
    "category": "brutalist",
    "badge": "BRUTALIST",
    "image": "/backgrounds/bg_61_foggy_buzludzha_monument.webp",
    "location": "colossal saucer-shaped concrete monument looming out of thick monochrome fog at the top of a sweeping monumental stone staircase",
    "atmosphere": "dense eerie mountain fog enveloping the brutalist silhouette",
    "props": [
      "monumental stone steps",
      "brutalist concrete saucer",
      "flanking ruin walls"
    ],
    "tags": [
      "brutalist",
      "monument",
      "fog",
      "monochrome",
      "sci-fi",
      "epic"
    ]
  },
  {
    "id": "bg_62_snowy_concrete_saucer_hull",
    "name": "Frozen Concrete Saucer Hull",
    "subtitle": "Weathered Ribbing \u00b7 Ice Mist",
    "category": "brutalist",
    "badge": "BRUTALIST",
    "image": "/backgrounds/bg_62_snowy_concrete_saucer_hull.webp",
    "location": "massive snow-encrusted brutalist concrete saucer underside looming above tiny figures in freezing white fog",
    "atmosphere": "icy overcast fog creating stark scale and atmospheric depth",
    "props": [
      "frosted concrete ribbing",
      "snowy rocky slope"
    ],
    "tags": [
      "brutalist",
      "snow",
      "monument",
      "fog",
      "scale",
      "sci-fi"
    ]
  },
  {
    "id": "bg_63_cyan_shadow_brutalist_plaza",
    "name": "Cyan Shadow Brutalist Plaza",
    "subtitle": "Tiled Terrace \u00b7 Concrete Mass",
    "category": "brutalist",
    "badge": "BRUTALIST",
    "image": "/backgrounds/bg_63_cyan_shadow_brutalist_plaza.webp",
    "location": "sharp architectural study of stepped brutalist concrete volumes rising behind a sloped skylight roof and tiled courtyard plaza",
    "atmosphere": "bright crisp daylight casting cool cyan-tinted geometric shadows",
    "props": [
      "tiled courtyard pavers",
      "stepped concrete volumes",
      "sloped metal skylight"
    ],
    "tags": [
      "brutalist",
      "plaza",
      "cyan",
      "concrete",
      "modern",
      "architecture"
    ]
  },
  {
    "id": "bg_64_monochrome_brutalist_courtyard",
    "name": "Monochrome Brutalist Courtyard",
    "subtitle": "Concrete Benches \u00b7 Walkways",
    "category": "brutalist",
    "badge": "BRUTALIST",
    "image": "/backgrounds/bg_64_monochrome_brutalist_courtyard.webp",
    "location": "clean black-and-white brutalist civic courtyard with raw concrete benches, elevated walkways, and geometric building towers",
    "atmosphere": "even overcast architectural daylight with crisp tonal separation",
    "props": [
      "minimalist concrete benches",
      "elevated concrete walkways",
      "paved plaza"
    ],
    "tags": [
      "brutalist",
      "courtyard",
      "monochrome",
      "benches",
      "architecture",
      "urban"
    ]
  },
  {
    "id": "bg_65_concrete_bunker_stairwell",
    "name": "Concrete Bunker Stairwell",
    "subtitle": "Angular Beams \u00b7 Yellow Treads",
    "category": "brutalist",
    "badge": "BRUTALIST",
    "image": "/backgrounds/bg_65_concrete_bunker_stairwell.webp",
    "location": "stark raw concrete interior stairwell with heavy angled ceiling beams, tubular metal handrails, and yellow-edged steps",
    "atmosphere": "cool fluorescent stairwell glow mixing with warm concrete tones",
    "props": [
      "raw concrete stairs",
      "tubular steel railings",
      "angled concrete beams"
    ],
    "tags": [
      "brutalist",
      "stairwell",
      "concrete",
      "industrial",
      "urban",
      "minimal"
    ]
  },
  {
    "id": "bg_66_monochrome_barbican_stairs",
    "name": "Barbican Concrete Stairs",
    "subtitle": "High-Rise Grid \u00b7 Monochrome",
    "category": "brutalist",
    "badge": "BRUTALIST",
    "image": "/backgrounds/bg_66_monochrome_barbican_stairs.webp",
    "location": "symmetrical black-and-white brutalist concrete staircase rising toward a towering gridded modernist apartment block",
    "atmosphere": "crisp overcast daylight emphasizing raw concrete grain and repeating geometry",
    "props": [
      "concrete stairwell walls",
      "concrete steps",
      "gridded high-rise facade"
    ],
    "tags": [
      "brutalist",
      "barbican",
      "stairs",
      "monochrome",
      "architecture",
      "urban"
    ]
  },
  {
    "id": "bg_67_european_corner_bistro_night",
    "name": "Corner Bistro Patio Dusk",
    "subtitle": "Red Door \u00b7 Cobblestone",
    "category": "urban",
    "badge": "EUROPEAN",
    "image": "/backgrounds/bg_67_european_corner_bistro_night.webp",
    "location": "moody European cobblestone street corner outside an ivy-draped bistro with a crimson doorway, chalkboard menus, and empty metal patio tables",
    "atmosphere": "soft blue-hour twilight with warm interior window light spilling onto cobblestones",
    "props": [
      "metal cafe tables and chairs",
      "crimson bistro door",
      "cobblestone pavement",
      "ivy facade"
    ],
    "tags": [
      "european",
      "cafe",
      "bistro",
      "cobblestone",
      "dusk",
      "urban"
    ]
  },
  {
    "id": "bg_68_graffiti_carved_arch_door",
    "name": "Graffiti Carved Stone Portal",
    "subtitle": "Wooden Double Doors \u00b7 Tags",
    "category": "textures",
    "badge": "STREET",
    "image": "/backgrounds/bg_68_graffiti_carved_arch_door.webp",
    "location": "ornate carved stone doorway framing weathered wooden double doors surrounded by colorful street graffiti tags and stone steps",
    "atmosphere": "even overcast street light highlighting stone relief and spray-painted textures",
    "props": [
      "carved stone archway",
      "wooden double doors",
      "graffiti-tagged stonework",
      "stone steps"
    ],
    "tags": [
      "doorway",
      "graffiti",
      "architecture",
      "streetwear",
      "european",
      "portal"
    ]
  },
  {
    "id": "bg_69_crimson_neon_alley_arch",
    "name": "Crimson Neon Alley Arch",
    "subtitle": "Glowing Red Passage \u00b7 Brick",
    "category": "urban",
    "badge": "NIGHT",
    "image": "/backgrounds/bg_69_crimson_neon_alley_arch.webp",
    "location": "narrow graffiti-covered brick alleyway leading through a stone arch bathed in intense saturated crimson-red neon light",
    "atmosphere": "dramatic blood-red nocturnal glow spilling across damp cobblestones and tagged walls",
    "props": [
      "brick archway",
      "graffiti-covered walls",
      "damp alley pavement"
    ],
    "tags": [
      "alley",
      "red neon",
      "night",
      "graffiti",
      "cinematic",
      "urban"
    ]
  },
  {
    "id": "bg_70_snowy_graffiti_brick_walk",
    "name": "Snowy Graffiti Brick Walk",
    "subtitle": "Streetlamp Glow \u00b7 Night",
    "category": "urban",
    "badge": "NIGHT",
    "image": "/backgrounds/bg_70_snowy_graffiti_brick_walk.webp",
    "location": "snow-dusted brick sidewalk running beside a long graffiti-tagged brick perimeter wall lit by a glowing vintage streetlamp at night",
    "atmosphere": "crisp cold winter night air with warm sodium streetlamp pool and long shadows",
    "props": [
      "graffiti brick perimeter wall",
      "snow-dusted sidewalk",
      "bare winter trees",
      "streetlamp"
    ],
    "tags": [
      "winter",
      "snow",
      "night",
      "graffiti",
      "brick",
      "streetlamp"
    ]
  },
  {
    "id": "bg_71_overgrown_berlin_alley",
    "name": "Overgrown Urban Cobble Path",
    "subtitle": "Street Signs \u00b7 Wild Ivy",
    "category": "urban",
    "badge": "STREET",
    "image": "/backgrounds/bg_71_overgrown_berlin_alley.webp",
    "location": "sunlit European cobblestone lane bordered by wild overgrown bushes, weathered street signs, and a graffiti-covered building facade",
    "atmosphere": "bright crisp afternoon sunlight casting sharp foliage shadows on cobblestones",
    "props": [
      "cobblestone lane",
      "overgrown roadside foliage",
      "metal street signs"
    ],
    "tags": [
      "street",
      "cobblestone",
      "berlin",
      "overgrown",
      "daylight",
      "urban"
    ]
  },
  {
    "id": "bg_72_evening_corner_deli_street",
    "name": "Evening Corner Shop Street",
    "subtitle": "Warm Windows \u00b7 Bicycles",
    "category": "urban",
    "badge": "STREET",
    "image": "/backgrounds/bg_72_evening_corner_deli_street.webp",
    "location": "gritty European neighborhood corner at dusk with warm glowing storefront windows, sticker-covered bollards, parked bicycles, and cobblestones",
    "atmosphere": "blue-hour twilight balanced against warm amber shopfront spill",
    "props": [
      "cobblestone corner",
      "stickered street bollards",
      "warm shop windows",
      "balconies"
    ],
    "tags": [
      "street",
      "dusk",
      "european",
      "urban",
      "shopfront",
      "cinematic"
    ]
  },
  {
    "id": "bg_73_nyc_water_tower_rooftop",
    "name": "NYC Water Tower Rooftop",
    "subtitle": "Blue Hour \u00b7 Empire State",
    "category": "urban",
    "badge": "NYC",
    "image": "/backgrounds/bg_73_nyc_water_tower_rooftop.webp",
    "location": "flat New York City brick-parapet rooftop at blue hour with iconic wooden water towers silhouetted against the lit Empire State Building skyline",
    "atmosphere": "deep cobalt twilight sky with warm city horizon haze",
    "props": [
      "wooden rooftop water towers",
      "brick parapet wall",
      "flat tar roof"
    ],
    "tags": [
      "nyc",
      "rooftop",
      "water tower",
      "blue hour",
      "skyline",
      "cinematic"
    ]
  },
  {
    "id": "bg_74_golden_hour_fire_escape",
    "name": "Golden Hour Fire Escape",
    "subtitle": "Potted Plants \u00b7 Brick Canyon",
    "category": "urban",
    "badge": "NYC",
    "image": "/backgrounds/bg_74_golden_hour_fire_escape.webp",
    "location": "narrow sunlit New York City brick canyon lined with wrought-iron fire escapes overflowing with potted greenery at golden hour",
    "atmosphere": "warm amber sunset light slicing between tall tenement brick facades",
    "props": [
      "wrought-iron fire escapes",
      "potted balcony plants",
      "warm brick facade"
    ],
    "tags": [
      "nyc",
      "fire escape",
      "golden hour",
      "brick",
      "urban",
      "warm"
    ]
  },
  {
    "id": "bg_75_night_brooklyn_brownstone",
    "name": "Brooklyn Storefront Night",
    "subtitle": "Fire Escape \u00b7 Warm Brick",
    "category": "urban",
    "badge": "NYC",
    "image": "/backgrounds/bg_75_night_brooklyn_brownstone.webp",
    "location": "classic red-brick Brooklyn townhouse at night with a black wrought-iron fire escape, closed shuttered storefront, and warm streetlight glow",
    "atmosphere": "quiet nocturnal urban air with warm streetlamp illumination on brick",
    "props": [
      "red-brick townhouse facade",
      "black fire escape",
      "shuttered storefront",
      "curbside sidewalk"
    ],
    "tags": [
      "brooklyn",
      "nyc",
      "night",
      "brick",
      "fire escape",
      "streetwear"
    ]
  },
  {
    "id": "bg_76_sunlit_tenement_laundry",
    "name": "Tenement Fire Escape Laundry",
    "subtitle": "Hard Noon Sun \u00b7 Cream Brick",
    "category": "urban",
    "badge": "NYC",
    "image": "/backgrounds/bg_76_sunlit_tenement_laundry.webp",
    "location": "weathered cream-brick city tenement facade with zig-zagging iron fire escapes and a clothesline of hanging laundry in sharp afternoon sun",
    "atmosphere": "high-contrast afternoon sunlight casting crisp geometric fire-escape shadows",
    "props": [
      "cream-brick facade",
      "iron fire escapes",
      "hanging laundry clothesline"
    ],
    "tags": [
      "tenement",
      "fire escape",
      "laundry",
      "sunlight",
      "nyc",
      "urban"
    ]
  },
  {
    "id": "bg_77_willow_canal_footbridge",
    "name": "Willow Canal Footbridge",
    "subtitle": "Backlit Water \u00b7 Cobble Bank",
    "category": "urban",
    "badge": "CANAL",
    "image": "/backgrounds/bg_77_willow_canal_footbridge.webp",
    "location": "arched iron footbridge spanning a calm urban canal framed by drooping willow branches and a cobblestone towpath",
    "atmosphere": "bright hazy morning backlight shimmering across calm canal water",
    "props": [
      "arched iron footbridge",
      "cobblestone towpath",
      "weeping willow branches",
      "canal water"
    ],
    "tags": [
      "canal",
      "bridge",
      "willow",
      "backlit",
      "urban",
      "serene"
    ]
  },
  {
    "id": "bg_78_underbridge_canal_path",
    "name": "Underbridge Canal Towpath",
    "subtitle": "Stone Vault \u00b7 Railings",
    "category": "urban",
    "badge": "CANAL",
    "image": "/backgrounds/bg_78_underbridge_canal_path.webp",
    "location": "shaded stone canal tunnel framing a sunlit tree-lined canal path with metal towpath railings and mirror-like water reflections",
    "atmosphere": "cool shadowed stone arch opening onto bright green sunlit foliage",
    "props": [
      "stone bridge arch",
      "metal towpath railing",
      "calm reflective canal"
    ],
    "tags": [
      "canal",
      "tunnel",
      "bridge",
      "reflection",
      "urban",
      "london"
    ]
  },
  {
    "id": "bg_79_graffiti_arch_canal_sunbeam",
    "name": "Graffiti Canal Tunnel Light",
    "subtitle": "Sunlit Mist \u00b7 Brick Vault",
    "category": "urban",
    "badge": "CANAL",
    "image": "/backgrounds/bg_79_graffiti_arch_canal_sunbeam.webp",
    "location": "curved brick canal underpass covered in graffiti opening onto a sunlit green canal towpath with soft morning light rays",
    "atmosphere": "misty golden sunbeams filtering into the shaded brick tunnel",
    "props": [
      "curved brick arch",
      "concrete towpath",
      "reflective canal water"
    ],
    "tags": [
      "canal",
      "tunnel",
      "graffiti",
      "sunbeams",
      "urban",
      "cinematic"
    ]
  },
  {
    "id": "bg_80_mossy_brick_canal_arch",
    "name": "Mossy Brick Canal Arch",
    "subtitle": "Autumn Foliage \u00b7 Dark Water",
    "category": "urban",
    "badge": "CANAL",
    "image": "/backgrounds/bg_80_mossy_brick_canal_arch.webp",
    "location": "weathered mossy brick canal bridge arch with graffiti-tagged abutments framing bright autumn greenery and still dark water",
    "atmosphere": "deep cool arch shadow contrasting with sunlit leaves beyond",
    "props": [
      "mossy brick arch",
      "metal canal railing",
      "dark reflective water"
    ],
    "tags": [
      "canal",
      "arch",
      "brick",
      "graffiti",
      "urban",
      "moody"
    ]
  },
  {
    "id": "bg_81_crimson_alley_metal_door",
    "name": "Crimson Backstage Alley",
    "subtitle": "Red Floodlight \u00b7 Trash Can",
    "category": "urban",
    "badge": "NIGHT",
    "image": "/backgrounds/bg_81_crimson_alley_metal_door.webp",
    "location": "tight urban service alley flooded in intense deep crimson-red light with a corrugated roll-up gate, graffiti walls, and a metal trash can",
    "atmosphere": "saturated red nocturnal floodlight with deep indigo sky shadows above",
    "props": [
      "metal trash can",
      "corrugated roll-up gate",
      "tagged brick walls",
      "open green service door"
    ],
    "tags": [
      "alley",
      "crimson",
      "red light",
      "night",
      "gritty",
      "streetwear"
    ]
  },
  {
    "id": "bg_82_amber_lantern_alley_stairs",
    "name": "Amber Lamp Alley Stairs",
    "subtitle": "Weathered Steps \u00b7 Night",
    "category": "urban",
    "badge": "NIGHT",
    "image": "/backgrounds/bg_82_amber_lantern_alley_stairs.webp",
    "location": "narrow worn stone alley staircase climbing toward a glowing warm amber wall lantern between shadowed plastered walls",
    "atmosphere": "quiet nocturnal urban air lit by a single warm overhead street lamp",
    "props": [
      "worn stone alley steps",
      "wrought-iron balcony railing",
      "weathered plaster walls"
    ],
    "tags": [
      "alley",
      "stairs",
      "night",
      "amber light",
      "moody",
      "european"
    ]
  },
  {
    "id": "bg_83_sodium_cobble_alley_night",
    "name": "Sodium Cobble Alley Night",
    "subtitle": "Warm Orange Glow \u00b7 Narrow",
    "category": "urban",
    "badge": "NIGHT",
    "image": "/backgrounds/bg_83_sodium_cobble_alley_night.webp",
    "location": "narrow medieval cobblestone alleyway glowing in rich sodium-vapor orange-amber light between dark historic stone buildings",
    "atmosphere": "warm monochromatic orange night glow with wet cobblestone specular highlights",
    "props": [
      "wet cobblestone alley",
      "historic stone walls",
      "warm wall sconces"
    ],
    "tags": [
      "alley",
      "cobblestone",
      "sodium vapor",
      "night",
      "orange",
      "cinematic"
    ]
  },
  {
    "id": "bg_84_european_cobble_canyon",
    "name": "European Limestone Street",
    "subtitle": "Cast-Iron Post \u00b7 Soft Sky",
    "category": "urban",
    "badge": "EUROPEAN",
    "image": "/backgrounds/bg_84_european_cobble_canyon.webp",
    "location": "curving narrow European street lined with grand weathered limestone facades, a green cast-iron bollard post, and wet cobblestones",
    "atmosphere": "soft diffused overcast daylight with subtle specular sheen on wet stone",
    "props": [
      "cobblestone pavement",
      "cast-iron street post",
      "carved limestone facades"
    ],
    "tags": [
      "european",
      "cobblestone",
      "limestone",
      "street",
      "editorial",
      "classic"
    ]
  },
  {
    "id": "bg_85_dumbo_manhattan_bridge_dusk",
    "name": "DUMBO Bridge Blue Hour",
    "subtitle": "Cobblestone \u00b7 Brick Warehouses",
    "category": "urban",
    "badge": "NYC",
    "image": "/backgrounds/bg_85_dumbo_manhattan_bridge_dusk.webp",
    "location": "iconic DUMBO cobblestone street flanked by tall red-brick warehouses framing the illuminated steel towers of the Manhattan Bridge at dusk",
    "atmosphere": "deep twilight blue sky balanced with warm golden streetlamp glow",
    "props": [
      "cobblestone street",
      "red-brick warehouse facades",
      "parked city cars",
      "steel suspension bridge"
    ],
    "tags": [
      "dumbo",
      "nyc",
      "bridge",
      "blue hour",
      "streetwear",
      "cinematic"
    ]
  },
  {
    "id": "bg_86_noir_cobble_alley_lamp",
    "name": "Noir Cobble Streetlamp",
    "subtitle": "Monochrome \u00b7 String Lights",
    "category": "urban",
    "badge": "NOIR",
    "image": "/backgrounds/bg_86_noir_cobble_alley_lamp.webp",
    "location": "monochrome late-night cobblestone street between tall warehouse walls lit by a single glowing streetlamp and overhead cables",
    "atmosphere": "crisp film-noir night contrast with glowing highlights on damp cobbles",
    "props": [
      "cobblestone street",
      "parked vintage-feel sedans",
      "glowing streetlamp",
      "fire escapes"
    ],
    "tags": [
      "noir",
      "monochrome",
      "night",
      "cobblestone",
      "streetlamp",
      "cinematic"
    ]
  },
  {
    "id": "bg_87_infinite_red_checker_hall",
    "name": "Infinite Red Checker Hall",
    "subtitle": "Tilted Portals \u00b7 Surreal",
    "category": "liminal",
    "badge": "SURREAL",
    "image": "/backgrounds/bg_87_infinite_red_checker_hall.webp",
    "location": "dizzying surreal corridor lined with vivid crimson walls and a black-and-white checkered floor receding through progressively tilted white doorways",
    "atmosphere": "even cool overhead light tube casting crisp surreal geometric depth",
    "props": [
      "checkered floor",
      "crimson corridor walls",
      "tilted white doorframes"
    ],
    "tags": [
      "surreal",
      "red",
      "checkerboard",
      "corridor",
      "liminal",
      "optical"
    ]
  },
  {
    "id": "bg_88_magenta_fog_kitchen_window",
    "name": "Magenta Fog Kitchen Window",
    "subtitle": "Mint Teal Room \u00b7 Dusk",
    "category": "liminal",
    "badge": "CINEMATIC",
    "image": "/backgrounds/bg_88_magenta_fog_kitchen_window.webp",
    "location": "dim mint-teal vintage kitchen interior framing a glowing window looking out onto bare tree branches shrouded in deep magenta-pink fog",
    "atmosphere": "eerie dual-tone teal interior shadows against luminous magenta dusk mist outside",
    "props": [
      "vintage gas stove",
      "kitchen counter",
      "misted window frame"
    ],
    "tags": [
      "liminal",
      "magenta",
      "teal",
      "kitchen",
      "window",
      "cinematic"
    ]
  },
  {
    "id": "bg_89_tokyo_crosswalk_overcast",
    "name": "Tokyo Crosswalk Overcast",
    "subtitle": "Zebra Stripes \u00b7 Utility Wires",
    "category": "urban",
    "badge": "TOKYO",
    "image": "/backgrounds/bg_89_tokyo_crosswalk_overcast.webp",
    "location": "quiet Japanese city intersection with bold white zebra crosswalk stripes, tiled mid-rise buildings, leafy street trees, and overhead power lines",
    "atmosphere": "cool overcast Tokyo daylight with crisp urban contrast",
    "props": [
      "white zebra crosswalk",
      "tiled corner storefront",
      "overhead utility wires",
      "street trees"
    ],
    "tags": [
      "tokyo",
      "japan",
      "crosswalk",
      "urban",
      "streetwear",
      "editorial"
    ]
  },
  {
    "id": "bg_90_brick_roll_shutter_wall",
    "name": "Brick Roll-Up Shutter Wall",
    "subtitle": "Clean Street \u00b7 Tag Detail",
    "category": "textures",
    "badge": "STREET",
    "image": "/backgrounds/bg_90_brick_roll_shutter_wall.webp",
    "location": "symmetrical red-brick urban loading bay featuring a weathered gray corrugated metal roll-up door with a clean white outline tag",
    "atmosphere": "crisp natural afternoon street light grazing brick and galvanized steel",
    "props": [
      "gray corrugated roll-up door",
      "red-brick facade",
      "yellow safety bollards"
    ],
    "tags": [
      "brick",
      "shutter",
      "streetwear",
      "urban",
      "minimal",
      "backdrop"
    ]
  },
  {
    "id": "bg_91_weathered_concrete_side_steps",
    "name": "Weathered Concrete Side Steps",
    "subtitle": "Steel Rail \u00b7 Plaster Wall",
    "category": "textures",
    "badge": "MINIMAL",
    "image": "/backgrounds/bg_91_weathered_concrete_side_steps.webp",
    "location": "minimalist architectural study of weathered concrete steps and a galvanized pipe handrail ascending diagonally against a cracked gray plaster wall",
    "atmosphere": "soft diffused daylight highlighting subtle concrete stains and hairline cracks",
    "props": [
      "concrete steps",
      "galvanized steel handrail",
      "cracked plaster wall"
    ],
    "tags": [
      "stairs",
      "concrete",
      "minimal",
      "streetwear",
      "backdrop",
      "clean"
    ]
  },
  {
    "id": "bg_92_bougainvillea_blue_door",
    "name": "Bougainvillea Blue Portal",
    "subtitle": "Magenta Blooms \u00b7 White Wall",
    "category": "textures",
    "badge": "MEDITERRANEAN",
    "image": "/backgrounds/bg_92_bougainvillea_blue_door.webp",
    "location": "bright whitewashed Mediterranean wall with an arched cobalt-blue wooden door framed by cascading magenta bougainvillea blossoms and fallen petals",
    "atmosphere": "even soft daylight bringing out vivid magenta flowers against clean white stucco",
    "props": [
      "arched cobalt-blue wooden door",
      "terracotta urn",
      "cascading bougainvillea",
      "petal-strewn stone"
    ],
    "tags": [
      "bougainvillea",
      "mediterranean",
      "blue door",
      "floral",
      "editorial",
      "clean"
    ]
  },
  {
    "id": "bg_93_peeling_plaster_corner_steps",
    "name": "Peeling Plaster Corner Steps",
    "subtitle": "Muted Earth \u00b7 Quiet Shade",
    "category": "textures",
    "badge": "MINIMAL",
    "image": "/backgrounds/bg_93_peeling_plaster_corner_steps.webp",
    "location": "quiet sun-washed courtyard corner with a short weathered stone staircase climbing along a peeling cream-and-gray stucco wall",
    "atmosphere": "soft angled afternoon sunlight casting a clean diagonal shadow across the ground",
    "props": [
      "weathered stone steps",
      "peeling stucco wall",
      "swept concrete courtyard"
    ],
    "tags": [
      "minimal",
      "stucco",
      "stairs",
      "editorial",
      "clean",
      "backdrop"
    ]
  },
  {
    "id": "bg_94_bombed_wall_sky_portal",
    "name": "Shattered Wall Sky Portal",
    "subtitle": "Rubble Floor \u00b7 Bright Clouds",
    "category": "ruins",
    "badge": "RUINS",
    "image": "/backgrounds/bg_94_bombed_wall_sky_portal.webp",
    "location": "jagged human-scale breach blown through a weathered concrete ruin wall framing bright blue sky and white clouds beyond tiled debris",
    "atmosphere": "cool shadowed interior contrasting with luminous daylight sky outside",
    "props": [
      "jagged breached concrete wall",
      "tiled rubble floor",
      "broken debris"
    ],
    "tags": [
      "ruins",
      "portal",
      "sky",
      "rubble",
      "editorial",
      "dramatic"
    ]
  },
  {
    "id": "bg_95_sunlit_abandoned_loft_floor",
    "name": "Sunlit Abandoned Loft",
    "subtitle": "Geometric Light \u00b7 Raw Walls",
    "category": "ruins",
    "badge": "STUDIO",
    "image": "/backgrounds/bg_95_sunlit_abandoned_loft_floor.webp",
    "location": "vacant industrial loft interior with peeling gray plaster walls, red baseboard stripe, and sharp afternoon window light grids across the concrete floor",
    "atmosphere": "bright directional afternoon sunbeams casting crisp windowpane shadows",
    "props": [
      "peeling plaster walls",
      "bare concrete floor",
      "high industrial windows"
    ],
    "tags": [
      "loft",
      "industrial",
      "sunbeams",
      "studio",
      "editorial",
      "minimal"
    ]
  },
  {
    "id": "bg_96_weathered_brick_flower_door",
    "name": "Weathered Brick Garden Door",
    "subtitle": "Peeling Wood \u00b7 Purple Blooms",
    "category": "textures",
    "badge": "RUSTIC",
    "image": "/backgrounds/bg_96_weathered_brick_flower_door.webp",
    "location": "aged wooden garden door recessed in a crumbling red-brick and peeling stucco wall crowned with cascading purple bougainvillea",
    "atmosphere": "soft diffused overcast daylight emphasizing rich brick and weathered wood textures",
    "props": [
      "peeling green wooden door",
      "crumbling red brick wall",
      "purple climbing flowers"
    ],
    "tags": [
      "brick",
      "rustic",
      "door",
      "floral",
      "editorial",
      "texture"
    ]
  },
  {
    "id": "bg_97_mint_dado_pipe_wall",
    "name": "Mint Dado Industrial Wall",
    "subtitle": "Vertical Pipes \u00b7 Minimal",
    "category": "textures",
    "badge": "INDUSTRIAL",
    "image": "/backgrounds/bg_97_mint_dado_pipe_wall.webp",
    "location": "minimalist industrial interior wall split horizontally between crisp white plaster and muted mint-green paint with vertical painted conduit pipes",
    "atmosphere": "soft directional ambient light casting gentle vertical pipe shadows",
    "props": [
      "painted vertical conduit pipes",
      "two-tone mint and white wall",
      "concrete floor"
    ],
    "tags": [
      "minimal",
      "mint",
      "pipes",
      "industrial",
      "editorial",
      "backdrop"
    ]
  },
  {
    "id": "bg_98_red_brick_louver_backdrop",
    "name": "Red Brick Louver Backdrop",
    "subtitle": "Concrete Base \u00b7 Clean Grid",
    "category": "textures",
    "badge": "URBAN",
    "image": "/backgrounds/bg_98_red_brick_louver_backdrop.webp",
    "location": "flat symmetrical urban street backdrop of clean red-brown brick over a weathered concrete plinth topped by horizontal metal louvers",
    "atmosphere": "even flat overcast daylight ideal for clean lookbook and streetwear framing",
    "props": [
      "red-brown brick wall",
      "weathered concrete plinth",
      "metal louver vents"
    ],
    "tags": [
      "brick",
      "backdrop",
      "streetwear",
      "lookbook",
      "minimal",
      "clean"
    ]
  },
  {
    "id": "bg_99_teal_garage_white_brick",
    "name": "Teal Garage White Brick",
    "subtitle": "Symmetrical Gate \u00b7 Concrete",
    "category": "textures",
    "badge": "URBAN",
    "image": "/backgrounds/bg_99_teal_garage_white_brick.webp",
    "location": "clean symmetrical urban facade featuring bright painted teal-blue metal double garage doors recessed into white-painted brick over cracked concrete",
    "atmosphere": "soft even overcast daylight with zero harsh shadows",
    "props": [
      "painted teal metal double doors",
      "white-painted brick wall",
      "cracked concrete apron"
    ],
    "tags": [
      "teal",
      "garage",
      "white brick",
      "minimal",
      "streetwear",
      "backdrop"
    ]
  },
  {
    "id": "bg_100_corrugated_steel_loading_dock",
    "name": "Corrugated Steel Loading Dock",
    "subtitle": "Weathered Metal \u00b7 Brutalist",
    "category": "brutalist",
    "badge": "INDUSTRIAL",
    "image": "/backgrounds/bg_100_corrugated_steel_loading_dock.webp",
    "location": "weathered corrugated grey steel industrial facade with a raised concrete loading ledge and faded metal double doors",
    "atmosphere": "flat overcast daylight with cool metallic tones and subtle surface rust",
    "props": [
      "corrugated steel cladding",
      "raised concrete ledge",
      "industrial metal doors"
    ],
    "tags": [
      "industrial",
      "corrugated",
      "steel",
      "brutalist",
      "loading dock",
      "minimal"
    ]
  },
  {
    "id": "bg_101_stucco_stairs_iron_rail",
    "name": "Stucco Steps & Iron Rail",
    "subtitle": "Cracked Plaster \u00b7 Daylight",
    "category": "textures",
    "badge": "URBAN",
    "image": "/backgrounds/bg_101_stucco_stairs_iron_rail.webp",
    "location": "weathered cream stucco building corner with crumbling concrete steps, black wrought-iron handrail, and faded blue graffiti",
    "atmosphere": "bright crisp daylight with clear blue sky on the left",
    "props": [
      "crumbling concrete steps",
      "black iron handrail",
      "peeling cream stucco"
    ],
    "tags": [
      "stairs",
      "stucco",
      "urban",
      "daylight",
      "backdrop",
      "editorial"
    ]
  },
  {
    "id": "bg_102_flash_lit_night_lawn",
    "name": "Flash-Lit Night Lawn",
    "subtitle": "Pitch Black Sky \u00b7 Grass",
    "category": "liminal",
    "badge": "LIMINAL",
    "image": "/backgrounds/bg_102_flash_lit_night_lawn.webp",
    "location": "open manicured green grass lawn at night illuminated sharply in the foreground by direct camera flash against a pitch-black void sky",
    "atmosphere": "stark nocturnal void with harsh foreground flash falloff into pure darkness",
    "props": [
      "flash-lit green grass",
      "pitch-black night horizon"
    ],
    "tags": [
      "liminal",
      "night",
      "flash",
      "grass",
      "void",
      "editorial"
    ]
  },
  {
    "id": "bg_103_foggy_curve_streetlamp",
    "name": "Foggy Curve Streetlamp",
    "subtitle": "Wet Sidewalk \u00b7 Night",
    "category": "liminal",
    "badge": "NIGHT",
    "image": "/backgrounds/bg_103_foggy_curve_streetlamp.webp",
    "location": "empty curving suburban sidewalk and asphalt road at night beneath tall streetlamps casting pools of warm light through coastal mist",
    "atmosphere": "damp nocturnal fog diffusing overhead streetlamp glow",
    "props": [
      "curved concrete sidewalk",
      "tall streetlamp",
      "empty asphalt road"
    ],
    "tags": [
      "night",
      "fog",
      "streetlamp",
      "liminal",
      "sidewalk",
      "moody"
    ]
  },
  {
    "id": "bg_104_gritty_poster_alley_door",
    "name": "Gritty Poster Alley Door",
    "subtitle": "Torn Flyers \u00b7 Night",
    "category": "urban",
    "badge": "ALLEY",
    "image": "/backgrounds/bg_104_gritty_poster_alley_door.webp",
    "location": "dark weathered alleyway wall with a scarred metal door, torn wheatpaste posters, wire mesh window, and littered concrete ground",
    "atmosphere": "dim amber streetlight spill over gritty nocturnal textures",
    "props": [
      "torn wheatpaste posters",
      "scarred metal door",
      "littered concrete"
    ],
    "tags": [
      "alley",
      "gritty",
      "posters",
      "night",
      "urban",
      "streetwear"
    ]
  },
  {
    "id": "bg_105_white_crosswalk_shutter",
    "name": "Crosswalk & Roll Shutter",
    "subtitle": "Minimal Facade \u00b7 Daylight",
    "category": "textures",
    "badge": "URBAN",
    "image": "/backgrounds/bg_105_white_crosswalk_shutter.webp",
    "location": "clean off-white urban building facade with a closed corrugated steel roll-up shutter directly behind crisp white zebra crosswalk stripes",
    "atmosphere": "even overcast daylight with clean geometric contrast",
    "props": [
      "closed metal roll-up shutter",
      "white zebra crosswalk",
      "off-white masonry wall"
    ],
    "tags": [
      "crosswalk",
      "shutter",
      "minimal",
      "streetwear",
      "backdrop",
      "clean"
    ]
  },
  {
    "id": "bg_106_sodium_brick_side_alley",
    "name": "Sodium Brick Side Alley",
    "subtitle": "Warm Wall Sconce \u00b7 Night",
    "category": "urban",
    "badge": "NIGHT",
    "image": "/backgrounds/bg_106_sodium_brick_side_alley.webp",
    "location": "dark urban brick side street at night illuminated by a single warm amber wall-mounted sconce above boarded windows and faint graffiti",
    "atmosphere": "warm sodium-amber night glow against deep blue-black shadows",
    "props": [
      "brick side facade",
      "warm amber wall sconce",
      "wet asphalt curb"
    ],
    "tags": [
      "brick",
      "alley",
      "night",
      "amber",
      "urban",
      "cinematic"
    ]
  },
  {
    "id": "bg_107_tactile_curb_brick_alley",
    "name": "Tactile Curb Brick Alley",
    "subtitle": "Boarded Door \u00b7 Dusk",
    "category": "urban",
    "badge": "ALLEY",
    "image": "/backgrounds/bg_107_tactile_curb_brick_alley.webp",
    "location": "narrow city brick alley entrance at dusk with a weathered green-grey wooden door, yellow tactile curb ramp, and distant streetlamp",
    "atmosphere": "cool blue-hour dusk transitioning into distant warm streetlights",
    "props": [
      "weathered alley door",
      "yellow tactile curb ramp",
      "brick corner wall"
    ],
    "tags": [
      "alley",
      "dusk",
      "brick",
      "urban",
      "nyc",
      "street"
    ]
  },
  {
    "id": "bg_108_vaporwave_twilight_sidewalk",
    "name": "Twilight Pastel Sidewalk",
    "subtitle": "Magenta-Blue Glow \u00b7 Dusk",
    "category": "liminal",
    "badge": "NEON",
    "image": "/backgrounds/bg_108_vaporwave_twilight_sidewalk.webp",
    "location": "quiet suburban sidewalk lined by tall evergreens under a surreal magenta-violet and cobalt twilight sky with glowing distant streetlamp",
    "atmosphere": "dreamy magenta-blue twilight ambient color cast",
    "props": [
      "concrete sidewalk slabs",
      "tall evergreen hedge",
      "distant streetlamp"
    ],
    "tags": [
      "twilight",
      "magenta",
      "liminal",
      "sidewalk",
      "vaporwave",
      "surreal"
    ]
  },
  {
    "id": "bg_109_noir_chainlink_gate_night",
    "name": "Noir Chain-Link Gate",
    "subtitle": "Flash-Lit Fence \u00b7 Night",
    "category": "liminal",
    "badge": "NOIR",
    "image": "/backgrounds/bg_109_noir_chainlink_gate_night.webp",
    "location": "padlocked double chain-link fence gate at night catching sharp silver flash highlights against a pitch-black background with distant city lights",
    "atmosphere": "high-contrast monochrome night flash against deep void",
    "props": [
      "chain-link fence gate",
      "metal padlock chain",
      "distant night lights"
    ],
    "tags": [
      "chainlink",
      "fence",
      "noir",
      "night",
      "flash",
      "monochrome"
    ]
  },
  {
    "id": "bg_110_surreal_park_trees_void",
    "name": "Spotlight Trees in Void",
    "subtitle": "Night Hill \u00b7 Liminal",
    "category": "liminal",
    "badge": "LIMINAL",
    "image": "/backgrounds/bg_110_surreal_park_trees_void.webp",
    "location": "rolling green park hillside at night with isolated small trees casting crisp shadows under unseen spotlights against a pure black sky",
    "atmosphere": "surreal stage-lit nocturnal park atmosphere with zero horizon glow",
    "props": [
      "spotlight-lit green lawn",
      "isolated park trees",
      "pitch-black sky"
    ],
    "tags": [
      "liminal",
      "park",
      "trees",
      "night",
      "surreal",
      "minimal"
    ]
  },
  {
    "id": "bg_111_sickly_green_station_stairs",
    "name": "Acid-Green Station Stairs",
    "subtitle": "Metal Rails \u00b7 Night",
    "category": "liminal",
    "badge": "SUBWAY",
    "image": "/backgrounds/bg_111_sickly_green_station_stairs.webp",
    "location": "empty outdoor concrete staircase descending toward dark train tracks under eerie acid-green sodium-vapor lighting at night",
    "atmosphere": "heavy greenish-yellow nocturnal cast with long rail shadows",
    "props": [
      "concrete station stairs",
      "galvanized pipe railings",
      "dark rail platform"
    ],
    "tags": [
      "stairs",
      "night",
      "green",
      "liminal",
      "station",
      "moody"
    ]
  },
  {
    "id": "bg_112_gothic_ivy_balcony_mist",
    "name": "Gothic Ivy Balcony & Mist",
    "subtitle": "Stone Arch \u00b7 Castle",
    "category": "ruins",
    "badge": "GOTHIC",
    "image": "/backgrounds/bg_112_gothic_ivy_balcony_mist.webp",
    "location": "ivy-draped carved gothic stone archway opening onto a stone balustrade terrace with glowing lanterns overlooking a misty dark lake and distant castle",
    "atmosphere": "cool moonlit blue fog drifting over dark water and medieval towers",
    "props": [
      "ivy-covered stone arch",
      "carved stone balustrade",
      "glowing terrace lanterns"
    ],
    "tags": [
      "gothic",
      "castle",
      "ivy",
      "balcony",
      "mist",
      "fantasy"
    ]
  },
  {
    "id": "bg_113_overgrown_night_forest_path",
    "name": "Overgrown Night Forest Path",
    "subtitle": "Graffiti Wall \u00b7 Leaves",
    "category": "ruins",
    "badge": "FOREST",
    "image": "/backgrounds/bg_113_overgrown_night_forest_path.webp",
    "location": "damp leaf-strewn asphalt path winding under a dense dark tree canopy beside a graffiti-tagged concrete wall toward a warm amber light ahead",
    "atmosphere": "moody nocturnal woodland air lit by distant warm tunnel glow",
    "props": [
      "leaf-strewn asphalt path",
      "graffiti concrete wall",
      "overhanging tree canopy"
    ],
    "tags": [
      "forest",
      "path",
      "night",
      "graffiti",
      "leaves",
      "moody"
    ]
  },
  {
    "id": "bg_114_tiled_metro_corner_stairs",
    "name": "Tiled Metro Corner Stairs",
    "subtitle": "Fluorescent \u00b7 Liminal",
    "category": "liminal",
    "badge": "SUBWAY",
    "image": "/backgrounds/bg_114_tiled_metro_corner_stairs.webp",
    "location": "quiet tiled underground pedestrian tunnel turning up a concrete staircase with tactile yellow floor strip under dim overhead fluorescent bars",
    "atmosphere": "muted olive-amber fluorescent indoor light with deep stair shadows",
    "props": [
      "ceramic tiled tunnel walls",
      "tactile floor strip",
      "overhead fluorescent tubes"
    ],
    "tags": [
      "subway",
      "tunnel",
      "stairs",
      "liminal",
      "fluorescent",
      "urban"
    ]
  },
  {
    "id": "bg_115_crimson_lamp_empty_road",
    "name": "Crimson Lamp Empty Road",
    "subtitle": "Red Glow \u00b7 Night",
    "category": "liminal",
    "badge": "NEON",
    "image": "/backgrounds/bg_115_crimson_lamp_empty_road.webp",
    "location": "curving empty asphalt road at night drenched in deep crimson-orange light from a single glowing streetlamp surrounded by dark trees",
    "atmosphere": "saturated red-orange nocturnal haze against deep emerald-black shadows",
    "props": [
      "curving asphalt road",
      "crimson-lit streetlamp",
      "dark roadside trees"
    ],
    "tags": [
      "red",
      "night",
      "road",
      "liminal",
      "cinematic",
      "moody"
    ]
  },
  {
    "id": "bg_116_angled_concrete_wall_grid",
    "name": "Angled Concrete & Grid Facade",
    "subtitle": "Modernist \u00b7 Overcast",
    "category": "brutalist",
    "badge": "BRUTALIST",
    "image": "/backgrounds/bg_116_angled_concrete_wall_grid.webp",
    "location": "sloped weathered raw concrete retaining wall in front of a stark black-and-white geometric grid building facade above cracked asphalt",
    "atmosphere": "cool flat overcast daylight emphasizing concrete streaks and grid geometry",
    "props": [
      "sloped concrete retaining wall",
      "grid window facade",
      "cracked asphalt ground"
    ],
    "tags": [
      "brutalist",
      "concrete",
      "geometric",
      "modernist",
      "urban",
      "minimal"
    ]
  },
  {
    "id": "bg_117_amber_cobble_night_alley",
    "name": "Amber Cobble Night Alley",
    "subtitle": "Twin Lamps \u00b7 Noir",
    "category": "urban",
    "badge": "NOIR",
    "image": "/backgrounds/bg_117_amber_cobble_night_alley.webp",
    "location": "narrow dark brick cobblestone alley at night lit by two warm yellow wall lamps receding into pitch-black shadow",
    "atmosphere": "dramatic high-contrast amber pools in a deep noir alley",
    "props": [
      "cobblestone alley floor",
      "twin wall-mounted lamps",
      "weathered brick walls"
    ],
    "tags": [
      "alley",
      "cobblestone",
      "night",
      "noir",
      "amber",
      "cinematic"
    ]
  },
  {
    "id": "bg_118_cyan_fluorescent_subway",
    "name": "Cyan Fluorescent Subway",
    "subtitle": "Steel Pillars \u00b7 Stairs",
    "category": "liminal",
    "badge": "SUBWAY",
    "image": "/backgrounds/bg_118_cyan_fluorescent_subway.webp",
    "location": "gritty underground subway station platform bathed in cool cyan-teal fluorescent light with riveted steel columns and central exit stairs",
    "atmosphere": "cold cyan-emerald underground fluorescent ambience",
    "props": [
      "riveted steel pillars",
      "tiled platform floor",
      "central subway staircase"
    ],
    "tags": [
      "subway",
      "cyan",
      "fluorescent",
      "liminal",
      "underground",
      "cinematic"
    ]
  },
  {
    "id": "bg_119_dusk_country_road_tower",
    "name": "Dusk Road & Utility Pole",
    "subtitle": "Violet Sky \u00b7 Foliage",
    "category": "nature",
    "badge": "DUSK",
    "image": "/backgrounds/bg_119_dusk_country_road_tower.webp",
    "location": "empty winding country asphalt road bordered by wild summer brush and a tall wooden utility pole beneath a deep violet-pink dusk sky",
    "atmosphere": "calm twilight gradient from coral horizon to cobalt zenith",
    "props": [
      "winding asphalt road",
      "wooden utility pole",
      "wild roadside brush"
    ],
    "tags": [
      "dusk",
      "road",
      "twilight",
      "nature",
      "sky",
      "cinematic"
    ]
  },
  {
    "id": "bg_120_coastal_abandoned_house",
    "name": "Coastal Abandoned House",
    "subtitle": "Blue Hour \u00b7 Overgrown",
    "category": "ruins",
    "badge": "COAST",
    "image": "/backgrounds/bg_120_coastal_abandoned_house.webp",
    "location": "weathered cream coastal cottage overgrown with ivy, broken windows, and an open iron gate overlooking a calm dark-blue sea at twilight",
    "atmosphere": "cool deep blue-hour coastal air with crisp foreground textures",
    "props": [
      "overgrown stucco cottage",
      "open iron gate",
      "cracked concrete yard"
    ],
    "tags": [
      "abandoned",
      "coast",
      "blue hour",
      "ruins",
      "ivy",
      "cinematic"
    ]
  },
  {
    "id": "bg_121_twilight_trailer_scrapyard",
    "name": "Twilight Trailer & Scrapyard",
    "subtitle": "Pink Chair \u00b7 Industry",
    "category": "ruins",
    "badge": "URBAN",
    "image": "/backgrounds/bg_121_twilight_trailer_scrapyard.webp",
    "location": "weathered white caravan trailer and a lone pink plastic chair beside a rubble pile under chain-link barbed wire against distant factory smokestacks at dusk",
    "atmosphere": "clear magenta-blue twilight sky over gritty industrial wasteland",
    "props": [
      "weathered caravan trailer",
      "pink plastic chair",
      "industrial skyline fence"
    ],
    "tags": [
      "industrial",
      "dusk",
      "gritty",
      "wasteland",
      "editorial",
      "cinematic"
    ]
  },
  {
    "id": "bg_122_flash_lit_abandoned_farmhouse",
    "name": "Abandoned Farmhouse Dusk",
    "subtitle": "Dead Tree \u00b7 Tall Grass",
    "category": "ruins",
    "badge": "RUINS",
    "image": "/backgrounds/bg_122_flash_lit_abandoned_farmhouse.webp",
    "location": "decayed white wooden farmhouse with dark empty windows at the end of a rutted dirt track flanked by tall dry grass and a gnarled bare tree at dusk",
    "atmosphere": "eerie twilight blue sky with subtle warm flash illumination on foreground brush",
    "props": [
      "decayed wooden farmhouse",
      "gnarled bare tree",
      "rutted dirt track"
    ],
    "tags": [
      "abandoned",
      "farmhouse",
      "ruins",
      "dusk",
      "creepy",
      "editorial"
    ]
  },
  {
    "id": "bg_123_grey_stone_cobble_passage",
    "name": "Grey Stone Cobble Passage",
    "subtitle": "Symmetric \u00b7 Overcast",
    "category": "urban",
    "badge": "STREET",
    "image": "/backgrounds/bg_123_grey_stone_cobble_passage.webp",
    "location": "narrow symmetrical European passage between weathered dark grey stone buildings with wet cobblestone paving and tall recessed windows",
    "atmosphere": "soft even overcast daylight with subtle sheen on cobblestones",
    "props": [
      "wet cobblestone passage",
      "dark grey stone facades",
      "iron wall bollard"
    ],
    "tags": [
      "cobblestone",
      "european",
      "alley",
      "street",
      "stone",
      "editorial"
    ]
  },
  {
    "id": "bg_124_arched_stone_tunnel_alley",
    "name": "Arched Stone Tunnel Alley",
    "subtitle": "Overhead Wires \u00b7 Cobbles",
    "category": "urban",
    "badge": "STREET",
    "image": "/backgrounds/bg_124_arched_stone_tunnel_alley.webp",
    "location": "old European cobblestone lane curving into a dark arched stone tunnel beneath weathered masonry facades and overhead utility cables",
    "atmosphere": "cool shaded daylight contrasting with the pitch-dark tunnel mouth",
    "props": [
      "arched stone tunnel",
      "green wooden door",
      "cobblestone lane"
    ],
    "tags": [
      "tunnel",
      "cobblestone",
      "european",
      "street",
      "gothic",
      "urban"
    ]
  },
  {
    "id": "bg_125_night_skyscraper_rooftop",
    "name": "Night Skyscraper Rooftop",
    "subtitle": "City Lights \u00b7 Parapet",
    "category": "urban",
    "badge": "NYC",
    "image": "/backgrounds/bg_125_night_skyscraper_rooftop.webp",
    "location": "high-rise concrete rooftop terrace at night with low parapet walls, HVAC units, and coiled cables framed against glowing downtown glass skyscrapers",
    "atmosphere": "crisp nocturnal city air with warm and cool skyscraper window glow",
    "props": [
      "concrete rooftop parapet",
      "rooftop HVAC units",
      "coiled utility cables"
    ],
    "tags": [
      "rooftop",
      "nyc",
      "skyscrapers",
      "night",
      "urban",
      "cinematic"
    ]
  },
  {
    "id": "bg_126_industrial_rooftop_vents",
    "name": "Industrial Rooftop Vents",
    "subtitle": "Turbine Fans \u00b7 Overcast",
    "category": "brutalist",
    "badge": "ROOFTOP",
    "image": "/backgrounds/bg_126_industrial_rooftop_vents.webp",
    "location": "weathered tar-and-gravel urban rooftop scattered with galvanized turbine exhaust vents, metal access stairs, and concrete parapet walls",
    "atmosphere": "flat overcast city daylight with crisp metallic highlights",
    "props": [
      "galvanized turbine vents",
      "metal access staircase",
      "concrete parapet wall"
    ],
    "tags": [
      "rooftop",
      "industrial",
      "vents",
      "urban",
      "editorial",
      "streetwear"
    ]
  },
  {
    "id": "bg_127_parapet_rooftop_dish",
    "name": "Parapet Rooftop & Dish",
    "subtitle": "Symmetrical \u00b7 Concrete",
    "category": "brutalist",
    "badge": "ROOFTOP",
    "image": "/backgrounds/bg_127_parapet_rooftop_dish.webp",
    "location": "walled concrete rooftop courtyard surrounded by pale panelled parapet walls with a mounted grey satellite dish against a clear blue sky",
    "atmosphere": "clean afternoon shade across the rooftop deck with bright sky above",
    "props": [
      "concrete rooftop deck",
      "mounted satellite dish",
      "panelled parapet wall"
    ],
    "tags": [
      "rooftop",
      "concrete",
      "minimal",
      "urban",
      "streetwear",
      "backdrop"
    ]
  },
  {
    "id": "bg_128_heavy_fog_brutalist_walk",
    "name": "Heavy Fog Concrete Walk",
    "subtitle": "Tower Blocks \u00b7 Mist",
    "category": "brutalist",
    "badge": "FOG",
    "image": "/backgrounds/bg_128_heavy_fog_brutalist_walk.webp",
    "location": "wide damp asphalt pedestrian walkway cutting between symmetrical modernist apartment blocks swallowed by dense white morning fog",
    "atmosphere": "thick enveloping white mist diffusing all harsh edges and distance",
    "props": [
      "wet asphalt walkway",
      "modernist apartment blocks",
      "tall streetlamp poles"
    ],
    "tags": [
      "fog",
      "brutalist",
      "mist",
      "liminal",
      "walkway",
      "moody"
    ]
  },
  {
    "id": "bg_129_rainy_crosswalk_dark_facade",
    "name": "Dark Facade Crosswalk",
    "subtitle": "Skylight Ceiling \u00b7 Street",
    "category": "urban",
    "badge": "STREET",
    "image": "/backgrounds/bg_129_rainy_crosswalk_dark_facade.webp",
    "location": "clean urban street crossing with white zebra stripes, European pedestrian sign, and a sleek black arched building facade beside trees",
    "atmosphere": "cool overcast daylight with crisp pavement markings",
    "props": [
      "zebra crosswalk stripes",
      "blue pedestrian sign",
      "black arched facade"
    ],
    "tags": [
      "street",
      "crosswalk",
      "modern",
      "urban",
      "editorial",
      "clean"
    ]
  },
  {
    "id": "bg_130_wooden_fence_brick_alley",
    "name": "Wooden Fence Brick Alley",
    "subtitle": "Warm Spill \u00b7 Night",
    "category": "urban",
    "badge": "ALLEY",
    "image": "/backgrounds/bg_130_wooden_fence_brick_alley.webp",
    "location": "tight urban walkway wedged between a dark brick apartment wall with lit windows and a weathered vertical wooden privacy fence at night",
    "atmosphere": "warm amber window spill and distant streetlights in a narrow corridor",
    "props": [
      "vertical wooden fence",
      "brick apartment wall",
      "narrow concrete walkway"
    ],
    "tags": [
      "alley",
      "night",
      "wood fence",
      "brick",
      "urban",
      "moody"
    ]
  },
  {
    "id": "bg_131_amber_lamp_chainlink_lot",
    "name": "Amber Lamp Chain-Link Lot",
    "subtitle": "Weeds \u00b7 Night Void",
    "category": "liminal",
    "badge": "NIGHT",
    "image": "/backgrounds/bg_131_amber_lamp_chainlink_lot.webp",
    "location": "vacant overgrown urban lot at night under a single tall amber streetlamp illuminating chain-link construction fencing and dry weeds",
    "atmosphere": "warm sodium-amber pool surrounded by deep nocturnal darkness",
    "props": [
      "chain-link lot fence",
      "tall amber streetlamp",
      "overgrown dry weeds"
    ],
    "tags": [
      "night",
      "amber",
      "chainlink",
      "lot",
      "liminal",
      "gritty"
    ]
  },
  {
    "id": "bg_132_amber_night_park_bench",
    "name": "Amber Night Park Bench",
    "subtitle": "Empty Playground \u00b7 Void",
    "category": "liminal",
    "badge": "NIGHT",
    "image": "/backgrounds/bg_132_amber_night_park_bench.webp",
    "location": "empty wooden park bench facing a shadowed playground climbing structure on dry grass under warm amber park lighting at night",
    "atmosphere": "isolated warm-lit nocturnal park clearing with pitch-dark woods behind",
    "props": [
      "wooden park bench",
      "shadowed playground frame",
      "dry nocturnal grass"
    ],
    "tags": [
      "park",
      "bench",
      "night",
      "liminal",
      "amber",
      "moody"
    ]
  },
  {
    "id": "bg_133_warm_wall_bench_night",
    "name": "Warm Wall & Iron Bench",
    "subtitle": "Gravel Lot \u00b7 Night",
    "category": "liminal",
    "badge": "NIGHT",
    "image": "/backgrounds/bg_133_warm_wall_bench_night.webp",
    "location": "wrought-iron park bench resting on gravel against a pale stucco building wall bathed in warm amber light from a single roof-corner floodlight",
    "atmosphere": "warm golden-amber night glow against a pitch-black sky",
    "props": [
      "wrought-iron bench",
      "stucco building wall",
      "gravel parking apron"
    ],
    "tags": [
      "bench",
      "night",
      "amber",
      "liminal",
      "minimal",
      "moody"
    ]
  },
  {
    "id": "bg_134_night_metal_fire_escape_alley",
    "name": "Night Fire Escape Alley",
    "subtitle": "Cool Floodlight \u00b7 Brick",
    "category": "urban",
    "badge": "NYC",
    "image": "/backgrounds/bg_134_night_metal_fire_escape_alley.webp",
    "location": "narrow damp brick courtyard alley at night with exterior black metal fire-escape stairs and balconies lit by a crisp cool-white floodlight",
    "atmosphere": "cool moonlight-toned floodlight over wet asphalt and brick",
    "props": [
      "black metal fire-escape stairs",
      "brick townhouse facades",
      "wet asphalt alley"
    ],
    "tags": [
      "fire escape",
      "nyc",
      "night",
      "alley",
      "urban",
      "cinematic"
    ]
  },
  {
    "id": "bg_135_cracked_stucco_brick_wall",
    "name": "Cracked Stucco & Brick",
    "subtitle": "Exposed Masonry \u00b7 Backdrop",
    "category": "textures",
    "badge": "TEXTURE",
    "image": "/backgrounds/bg_135_cracked_stucco_brick_wall.webp",
    "location": "heavily weathered pale plaster wall split by a jagged vertical fissure revealing raw red brickwork and wild weeds at the base",
    "atmosphere": "even overcast daylight highlighting deep crack shadows and raw texture",
    "props": [
      "cracked plaster facade",
      "exposed red brick",
      "baseboard weeds"
    ],
    "tags": [
      "texture",
      "brick",
      "cracked",
      "wall",
      "ruins",
      "backdrop"
    ]
  },
  {
    "id": "bg_136_raw_concrete_box_room",
    "name": "Raw Concrete Box Room",
    "subtitle": "Monochrome \u00b7 Empty Studio",
    "category": "brutalist",
    "badge": "STUDIO",
    "image": "/backgrounds/bg_136_raw_concrete_box_room.webp",
    "location": "stark empty brutalist concrete room with board-formed grey concrete back wall, poured concrete floor, and raw ceiling slab",
    "atmosphere": "soft diffused directional daylight from an unseen side opening",
    "props": [
      "board-formed concrete wall",
      "poured concrete floor"
    ],
    "tags": [
      "concrete",
      "studio",
      "brutalist",
      "minimal",
      "monochrome",
      "backdrop"
    ]
  },
  {
    "id": "bg_137_limestone_quarry_catacomb",
    "name": "Limestone Quarry Catacomb",
    "subtitle": "Carved Pillars \u00b7 Deep",
    "category": "ruins",
    "badge": "RUINS",
    "image": "/backgrounds/bg_137_limestone_quarry_catacomb.webp",
    "location": "subterranean hand-cut limestone quarry chamber with massive square stone pillars, chalky dust floor, and deep dark corridor",
    "atmosphere": "cool diffused entrance daylight fading into pitch-dark subterranean passages",
    "props": [
      "cut limestone pillars",
      "chalky stone floor",
      "dark subterranean corridor"
    ],
    "tags": [
      "catacomb",
      "quarry",
      "stone",
      "ruins",
      "underground",
      "cinematic"
    ]
  },
  {
    "id": "bg_138_troglodyte_cave_chamber",
    "name": "Carved Cave Room & Curtain",
    "subtitle": "Chalky Wall \u00b7 Warm",
    "category": "ruins",
    "badge": "INTERIOR",
    "image": "/backgrounds/bg_138_troglodyte_cave_chamber.webp",
    "location": "ancient rough-hewn plaster cave room with a hanging wicker pendant shade, dusty earth floor, and a draped doorway leading into darkness",
    "atmosphere": "warm muted ambient daylight from the room entrance",
    "props": [
      "rough-hewn chalky walls",
      "draped fabric doorway",
      "wicker pendant shade"
    ],
    "tags": [
      "cave",
      "interior",
      "rustic",
      "editorial",
      "minimal",
      "warm"
    ]
  },
  {
    "id": "bg_139_berlin_graffiti_cafe_patio",
    "name": "Graffiti Cafe Patio",
    "subtitle": "Picnic Table \u00b7 Street",
    "category": "urban",
    "badge": "STREET",
    "image": "/backgrounds/bg_139_berlin_graffiti_cafe_patio.webp",
    "location": "colorful graffiti-covered European brick cafe facade with Cafe Cinema mural, wooden picnic benches, and tall multi-pane windows",
    "atmosphere": "shaded urban courtyard daylight with vibrant mural colors",
    "props": [
      "wooden picnic table",
      "graffiti mural facade",
      "multi-pane cafe window"
    ],
    "tags": [
      "graffiti",
      "cafe",
      "berlin",
      "street",
      "colorful",
      "urban"
    ]
  }
];

export function filterBackgrounds(
  query: string,
  category: BackgroundCategory = "all",
): BackgroundItem[] {
  const q = query.trim().toLowerCase();
  return BACKGROUND_LIBRARY.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.atmosphere.toLowerCase().includes(q) ||
      item.props.some((p) => p.toLowerCase().includes(q)) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function applyBackgroundItem(doc: PromptDoc, item: BackgroundItem): PromptDoc {
  let next = setAt(doc, "scene_composition.environmental_staging.location_context", item.location);
  next = setAt(next, "scene_composition.environmental_staging.atmosphere_and_air_density", item.atmosphere);
  next = setAt(next, "scene_composition.environmental_staging.grounded_props", [...item.props]);
  return next;
}

export function isBackgroundApplied(doc: PromptDoc, item: BackgroundItem): boolean {
  const current = doc.scene_composition.environmental_staging.location_context.trim().toLowerCase();
  if (!current) return false;
  return current === item.location.trim().toLowerCase();
}
