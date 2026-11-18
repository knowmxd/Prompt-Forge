#!/usr/bin/env python3
"""
Ingest, rename, optimize to WebP, and catalog all 99 background images (IMG_9081..IMG_9180)
into public/backgrounds/*.webp and src/lib/prompt/background-database.ts.
"""

from __future__ import annotations

import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "backgrounds"
DB_PATH = ROOT / "src" / "lib" / "prompt" / "background-database.ts"

# (src_file, slug, name, subtitle, category, badge, location, atmosphere, props, tags)
BACKGROUNDS = [
    ("IMG_9081.jpeg", "bg_01_laundromat_night_glow", "Midnight Laundromat Glow", "Dim Washer Row · Warm Drum Light", "liminal", "LIMINAL",
     "dark late-night laundromat interior with a row of stainless steel front-loading washing machines, one lit drum glowing warm amber",
     "dim nocturnal indoor air lit by a single overhead fluorescent tube and warm orange washer drum glow",
     ["blue plastic waiting chair", "stainless steel washing machines", "tiled linoleum floor"],
     ["laundromat", "night", "liminal", "fluorescent", "indoor", "moody"]),

    ("IMG_9082.jpeg", "bg_02_teal_laundromat_corridor", "Cyan Laundromat Aisle", "Teal Fluorescent · Empty Night", "liminal", "NEON",
     "narrow empty laundromat aisle bathed in deep cyan-teal fluorescent light with rows of dark washers and ceiling fans",
     "heavy teal-cyan nocturnal color cast, cool humid indoor air with faint red exit sign glow",
     ["stainless steel dryers", "rolling laundry cart", "ceiling fans", "metal folding table"],
     ["laundromat", "teal", "cyan", "liminal", "night", "neon"]),

    ("IMG_9083.jpeg", "bg_03_24h_laundromat_storefront", "24-Hour Laundromat Window", "Street-Level Glass · Pink Neon", "liminal", "STREET NIGHT",
     "street-level view looking through the glass storefront of a 24-hour laundromat with rows of washers and a pink neon sign",
     "cool damp night street foreground contrasting with bright fluorescent white and magenta-pink interior glow",
     ["glass storefront door", "24 hour laundromat window lettering", "folding chairs", "coin laundry machines"],
     ["laundromat", "storefront", "night", "pink neon", "urban", "cinematic"]),

    ("IMG_9084.jpeg", "bg_04_scorched_pine_forest", "Charred Monochrome Woods", "Stark Tree Trunks · Ash Mist", "nature", "MONOCHROME",
     "charred monochrome forest clearing with tall bare blackened tree trunks rising from ash-covered ground",
     "hazy silver-gray mist filtering through sparse trunks with long dramatic ground shadows",
     ["charred tree trunks", "fallen burnt branches", "ash-covered forest floor"],
     ["forest", "monochrome", "charred", "mist", "dark", "nature"]),

    ("IMG_9085.jpeg", "bg_05_wildfire_brush_smoke", "Wildfire Brush Clearing", "Orange Embers · Thick Haze", "nature", "ATMOSPHERE",
     "smoldering woodland clearing with low orange flames burning through dry underbrush beneath bare silhouetted trees",
     "thick warm smoke haze diffusing pale daylight into a muted amber-gray sky",
     ["bare woodland trees", "smoldering brush", "fallen charred logs"],
     ["wildfire", "smoke", "embers", "forest", "haze", "dramatic"]),

    ("IMG_9086.jpeg", "bg_06_moss_boardwalk_trail", "Mossy Ravine Boardwalk", "Wooden Plank Path · Lush Green", "nature", "FOREST",
     "narrow weathered wooden boardwalk winding alongside a steep moss-draped rock wall in a lush Pacific Northwest forest",
     "crisp dappled morning sunlight filtering through dense green canopy",
     ["weathered timber boardwalk", "moss-covered boulders", "forest ferns"],
     ["boardwalk", "moss", "forest", "trail", "green", "nature"]),

    ("IMG_9087.jpeg", "bg_07_golden_moss_archway", "Enchanted Moss Tunnel", "Overgrown Canopy · Golden Light", "nature", "FANTASY",
     "cavernous natural archway formed by colossal moss-draped tree roots and hanging vines framing a glowing clearing",
     "warm golden-green volumetric sunlight pouring through the distant forest opening",
     ["hanging moss curtains", "gnarled tree roots", "winding dirt footpath"],
     ["moss", "tunnel", "fantasy", "golden light", "forest", "overgrown"]),

    ("IMG_9088.jpeg", "bg_08_stone_forest_stairway", "Forest Stone Staircase", "Ancient Steps · Tall Cedars", "nature", "FOREST",
     "steep weathered stone staircase climbing up a narrow corridor between tall cedar trunks in a dense green forest",
     "cool diffused shade beneath thick overhead foliage",
     ["uneven stone steps", "mossy stone borders", "tall cedar trunks"],
     ["stairs", "stone", "forest", "cedar", "trail", "nature"]),

    ("IMG_9089.jpeg", "bg_09_foggy_shrine_torii", "Misty Torii Shrine Steps", "Stone Lantern · White Fog", "nature", "SHRINE",
     "wet stone shrine stairway ascending into thick white mist toward a towering silhouette torii gate with a carved stone lantern in the foreground",
     "dense cool mountain fog softening distant trees and wrapping the shrine in quiet haze",
     ["carved stone lantern", "wet stone steps", "torii gate", "mossy stone wall"],
     ["torii", "shrine", "fog", "japan", "stairs", "mist"]),

    ("IMG_9090.jpeg", "bg_10_emerald_moss_steps", "Emerald Timber Steps", "Deep Rainforest · Wet Ferns", "nature", "FOREST",
     "narrow rustic timber-and-stone steps ascending through a vibrant emerald rainforest carpeted in moss and ferns",
     "moist cool forest air with soft overhead canopy glow",
     ["mossy log steps", "lush ferns", "dense green foliage"],
     ["rainforest", "moss", "steps", "green", "trail", "nature"]),

    ("IMG_9091.jpeg", "bg_11_woodland_torii_path", "Woodland Torii Approach", "Sunlit Mist · Wet Stone", "nature", "SHRINE",
     "traditional wooden torii gate standing across a wet flagstone forest path framed by towering straight tree trunks",
     "bright misty morning backlight glowing through the upper canopy",
     ["wooden torii gate", "wet flagstone path", "mossy stones", "tall forest trunks"],
     ["torii", "shrine", "forest", "mist", "japan", "path"]),

    ("IMG_9092.jpeg", "bg_12_stormy_fjord_peaks", "Stormy Fjord Waters", "Dark Cliffs · Low Rain Clouds", "nature", "COAST",
     "vast calm dark fjord water flanked by steep sheer mountain cliffs beneath heavy slate-gray storm clouds",
     "brooding overcast maritime air with distant rain shafts between peaks",
     ["rippling dark water", "steep fjord cliffs", "low storm clouds"],
     ["fjord", "mountains", "storm", "water", "dramatic", "nature"]),

    ("IMG_9093.jpeg", "bg_13_cobalt_sea_stacks", "Cobalt Sea Stack Cove", "Black Sand · Twilight Blue", "nature", "COAST",
     "black volcanic sand beach framed by a towering dark basalt cliff on the left and jagged sea stacks in the surf",
     "deep twilight cobalt-blue maritime atmosphere with soft white ocean foam",
     ["black volcanic sand", "basalt cliff wall", "distant sea stacks", "ocean surf"],
     ["beach", "black sand", "blue hour", "cliffs", "iceland", "coast"]),

    ("IMG_9094.jpeg", "bg_14_basalt_columns_beach", "Basalt Column Cliffs", "Hexagonal Rock · Black Sand", "nature", "COAST",
     "dramatic stepped hexagonal basalt rock columns rising beside a sweeping black volcanic sand shoreline under storm clouds",
     "crisp overcast coastal air with pale gray sky and silver ocean horizon",
     ["hexagonal basalt columns", "black sand beach", "white surf line"],
     ["basalt", "iceland", "black sand", "cliffs", "coast", "dramatic"]),

    ("IMG_9095.jpeg", "bg_15_emerald_sea_arch_beach", "Mossy Sea Arch Beach", "Black Sand · Lone Horizon", "nature", "COAST",
     "expansive black sand beach stretching toward a massive moss-topped coastal rock headland and natural sea arch",
     "misty North Atlantic sea spray softening the horizon under bright overcast sky",
     ["black volcanic sand", "moss-covered headland", "natural sea arch", "ocean waves"],
     ["black sand", "sea arch", "coast", "iceland", "minimal", "nature"]),

    ("IMG_9096.jpeg", "bg_16_cryo_lab_corridor", "Cobalt Cryo Lab Corridor", "Glowing Cylinders · Reflections", "liminal", "SCI-FI",
     "futuristic sterile laboratory corridor lined with tall glowing electric-blue glass bio-containment cylinders and reflective white floors",
     "intense cool cobalt-blue specular glow with crisp reflections across polished lab flooring",
     ["glowing blue glass cylinders", "metallic lab framing", "reflective white floor"],
     ["sci-fi", "lab", "blue", "futuristic", "corridor", "glow"]),

    ("IMG_9097.jpeg", "bg_17_vaulted_gothic_cloister", "Mossy Vaulted Cloister", "Ribbed Stone Arches · Decay", "ruins", "GOTHIC",
     "ancient weathered stone cloister corridor with ornate ribbed gothic vaulting overhead and damp mossy flagstones underfoot",
     "cool shadowed stone interior with soft daylight entering from side arches",
     ["ribbed stone vaults", "carved stone pillars", "damp mossy flagstones"],
     ["gothic", "cloister", "ruins", "stone", "cathedral", "dark"]),

    ("IMG_9098.jpeg", "bg_18_dark_circus_ring", "Empty Circus Big Top", "Red Ring · String Lights", "liminal", "CIRCUS",
     "dark empty circus tent interior spotlighting a red-and-gold star-patterned sawdust ring beneath overhead string lights",
     "theatrical dusty spotlight haze surrounded by pitch-black tiered bleachers",
     ["red circular stage mat", "sawdust ring border", "overhead string lights", "center tent pole"],
     ["circus", "stage", "liminal", "dark", "spotlight", "theatrical"]),

    ("IMG_9099.jpeg", "bg_19_red_curtain_checker_room", "Red Curtain Checker Room", "Velvet Drapes · Black & White", "liminal", "SURREAL",
     "surreal theatrical chamber framed by heavy parted crimson velvet curtains opening onto a black-and-white checkered floor and red-checked backdrop",
     "warm dramatic stage lighting casting soft folds across the velvet drapes",
     ["parted crimson velvet curtains", "black and white checkered floor", "checkered back wall"],
     ["surreal", "twin peaks", "red curtain", "checkerboard", "liminal", "stage"]),

    ("IMG_9100.jpeg", "bg_20_crimson_carpet_chapel", "Crimson Carpet Chapel Hall", "Gothic Arches · Red Sofa", "liminal", "GOTHIC",
     "empty vaulted gothic hall with pale plaster pointed arches, a plush deep-red wall-to-wall carpet, and a lone red velvet settee on the left",
     "eerie dim interior glow from a single high circular oculus light above the dark doorway",
     ["red wall-to-wall carpet", "red velvet sofa", "pointed gothic arches", "dark arched doorway"],
     ["chapel", "red carpet", "gothic", "liminal", "velvet", "minimal"]),

    ("IMG_9101.jpeg", "bg_21_checker_cathedral_nave", "Checkered Cathedral Nave", "Tall Lancet Window · Marble", "ruins", "GOTHIC",
     "symmetrical dark gothic church corridor with glossy black-white-and-red checkered marble floor leading toward a glowing arched stained-glass window",
     "cool backlit daylight streaming down the reflective marble aisle against dark carved walls",
     ["checkered marble floor", "dark gothic columns", "tall arched window"],
     ["cathedral", "marble", "gothic", "symmetrical", "dark", "corridor"]),

    ("IMG_9102.jpeg", "bg_22_decayed_theater_stage", "Abandoned Velvet Theater", "Tattered Drapes · Wooden Steps", "ruins", "THEATER",
     "weathered abandoned theater stage framed by dusty crimson velvet proscenium curtains, peeling plaster, and narrow wooden stairs at center",
     "dim dusty ambient light revealing aged textures and faded crimson fabric",
     ["tattered red velvet curtains", "wooden stage steps", "weathered floorboards", "peeling proscenium"],
     ["theater", "abandoned", "velvet", "stage", "ruins", "vintage"]),

    ("IMG_9103.jpeg", "bg_23_graffiti_red_shutter_alley", "Red Shutter Graffiti Alley", "Roll-Up Door · Tagging", "urban", "STREET",
     "gritty urban alleyway featuring a bright red corrugated roll-up shutter covered in graffiti beside concrete stairs and metal railings",
     "moody evening overhead alley light catching damp concrete and painted tags",
     ["red corrugated metal shutter", "graffiti-covered brick wall", "metal stair railing"],
     ["alley", "graffiti", "red shutter", "urban", "streetwear", "gritty"]),

    ("IMG_9104.jpeg", "bg_24_underwater_pool_ladder", "Underwater Pool Ladder", "Turquoise Caustics · Chrome", "liminal", "AQUATIC",
     "submerged upward-looking view from the bottom of a bright turquoise swimming pool toward a chrome pool ladder and rippling water surface",
     "refracted sunlit water caustics shimmering across crisp pool-blue water",
     ["chrome pool ladder", "curved white pool wall", "rippling water surface"],
     ["underwater", "pool", "turquoise", "caustics", "aquatic", "summer"]),

    ("IMG_9105.jpeg", "bg_25_chalk_brick_parking_lot", "Whitewashed Brick Parking Lot", "Crisp Lines · Pale Dusk", "textures", "URBAN",
     "minimalist urban parking lot with crisp yellow diagonal pavement markings in front of a tall pale painted cinderblock wall with faint graffiti",
     "clean late-afternoon twilight sky casting even flat light across the wall",
     ["pale painted cinderblock wall", "diagonal yellow parking lines", "dark asphalt"],
     ["parking lot", "minimal", "brick wall", "urban", "streetwear", "clean"]),

    ("IMG_9106.jpeg", "bg_26_raw_concrete_studio_cube", "Raw Concrete Studio Cube", "Cast-In-Place · Soft Daylight", "brutalist", "BRUTALIST",
     "empty raw cast-concrete architectural room with board-formed ceiling seams and soft directional daylight grazing the floor",
     "clean minimal ambient daylight creating a soft gradient across raw gray concrete",
     ["raw concrete walls", "smooth concrete floor", "cast concrete ceiling"],
     ["concrete", "brutalist", "minimal", "studio", "architecture", "gray"]),

    ("IMG_9107.jpeg", "bg_27_crt_television_tower", "CRT Television Tower", "Tangled Cables · Gallery White", "liminal", "TECH ART",
     "stacked pyramid tower of vintage CRT box televisions wrapped in trailing black cables displaying monochrome figures in a stark white gallery",
     "cool blue-white CRT screen glow against clean neutral gallery light",
     ["stacked CRT televisions", "tangled black power cables", "white gallery wall"],
     ["crt", "tv", "installation", "retro tech", "gallery", "liminal"]),

    ("IMG_9108.jpeg", "bg_28_graffiti_rooftop_skyline", "Graffiti Rooftop Skyline", "Night High-Rises · Gravel", "urban", "ROOFTOP",
     "dark gravel urban rooftop overlooking a tagged concrete parapet wall with illuminated city skyscrapers rising against a cloudy night sky",
     "cool urban night glow from surrounding high-rise windows",
     ["graffiti-tagged parapet wall", "dark rooftop gravel", "distant lit skyscrapers"],
     ["rooftop", "skyline", "night", "graffiti", "city", "urban"]),

    ("IMG_9109.jpeg", "bg_29_neon_arcade_aisle", "Neon Retro Arcade Aisle", "UV Carpet · Glowing Cabinets", "liminal", "ARCADE",
     "dark retro video arcade interior with glowing neon-blue and magenta game cabinets reflecting over patterned UV carpet",
     "saturated electric-blue, magenta, and cyan neon glow in dark ambient air",
     ["glowing arcade cabinets", "neon ceiling trims", "UV-patterned arcade carpet"],
     ["arcade", "neon", "retro", "cyber", "night", "liminal"]),

    ("IMG_9110.jpeg", "bg_30_vintage_arcade_row", "Dim Vintage Arcade Row", "CRT Screens · Bar Stools", "liminal", "ARCADE",
     "narrow moody arcade corridor lined with glowing vintage upright arcade cabinets, round stools, and overhead blue-cyan strip lights",
     "warm CRT screen spill mixing with cool cyan ceiling reflections",
     ["upright arcade cabinets", "round padded bar stools", "dark tiled floor"],
     ["arcade", "retro", "gaming", "neon", "night", "moody"]),

    ("IMG_9111.jpeg", "bg_31_stacked_arcade_monitors", "CRT Monitor Wall", "Magenta Glow · Retro Games", "liminal", "ARCADE",
     "dense floor-to-ceiling wall of glowing vintage CRT televisions displaying colorful retro video game title screens under purple-magenta neon",
     "vibrant purple and magenta ambient light reflecting off glass CRT screens",
     ["stacked CRT monitors", "retro game screens", "purple neon framing"],
     ["crt", "retro", "gaming", "magenta", "neon", "wall"]),

    ("IMG_9112.jpeg", "bg_32_curved_subway_tunnel", "Curved Tiled Subway Tunnel", "White & Ochre Tile · Posters", "urban", "SUBWAY",
     "curved underground metro pedestrian tunnel clad in glossy white, cobalt-blue, and ochre-yellow ceramic tiles with framed vintage posters",
     "warm overhead fluorescent strip lighting curving down the tiled passage",
     ["curved glossy tile walls", "framed transit posters", "speckled terrazzo floor"],
     ["subway", "tunnel", "curved", "metro", "tiles", "urban"]),

    ("IMG_9113.jpeg", "bg_33_industrial_subway_stairs", "Industrial Subway Stairwell", "White Tile · Conduit Pipes", "urban", "SUBWAY",
     "gritty underground subway entrance stairwell with weathered white ceramic tiles, exposed metal conduit pipes, and yellow safety stair treads",
     "harsh cool overhead fluorescent tube lighting",
     ["white ceramic tile walls", "exposed metal conduit pipes", "steel handrails", "yellow stair nosing"],
     ["subway", "stairs", "industrial", "urban", "gritty", "metro"]),

    ("IMG_9114.jpeg", "bg_34_sickly_green_underpass", "Liminal Green Underpass", "Fluorescent Cast · Empty Turn", "liminal", "LIMINAL",
     "empty sterile underground pedestrian passage bathed in pale sickly yellow-green fluorescent light with tiled corner walls and a green exit sign",
     "eerie flat greenish-yellow fluorescent cast with soft ceiling reflections",
     ["pale tiled walls", "glowing green exit sign", "checkered stone floor"],
     ["liminal", "underpass", "green", "fluorescent", "empty", "backrooms"]),

    ("IMG_9115.jpeg", "bg_35_ruined_metro_escalator", "Abandoned Metro Escalator", "Crumbling Vault · Glass Booth", "ruins", "ABANDONED",
     "derelict underground metro station with rusted dead escalators, a shattered cylindrical glass booth, and peeling vaulted masonry",
     "cool blue-gray ambient shaft light contrasting with rusted warm debris",
     ["rusted escalators", "shattered cylindrical booth", "crumbling concrete floor"],
     ["abandoned", "metro", "ruins", "escalator", "post-apocalyptic", "dark"]),

    ("IMG_9116.jpeg", "bg_36_long_tiled_pedestrian_tube", "Long Tiled Metro Passage", "Tactile Yellow Line · Tubes", "urban", "SUBWAY",
     "long narrow symmetrical underground subway corridor lined with white square tiles, tactile yellow floor strip, and twin fluorescent rows",
     "even cool-white fluorescent illumination receding down the corridor",
     ["white square tiled walls", "tactile yellow floor paving", "twin fluorescent strips"],
     ["subway", "corridor", "symmetrical", "tiles", "urban", "minimal"]),

    ("IMG_9117.jpeg", "bg_37_skylight_grid_gallery", "Skylight Grid Art Gallery", "Dark Wood Bench · White Box", "brutalist", "GALLERY",
     "expansive minimalist white-cube art gallery featuring an illuminated overhead frosted skylight grid and a lone dark timber bench",
     "ultra-clean shadowless diffused daylight pouring from the ceiling grid",
     ["dark timber gallery bench", "frosted skylight ceiling grid", "light terrazzo floor"],
     ["gallery", "minimal", "white", "architecture", "clean", "modern"]),

    ("IMG_9118.jpeg", "bg_38_monolith_concrete_gallery", "Minimalist Monolith Gallery", "Faceted Stone · Skylights", "brutalist", "GALLERY",
     "clean symmetrical modern art gallery with bare gray concrete floors, crisp white walls, and a faceted geometric stone sculpture at center",
     "even diffused overhead skylight strip lighting with soft ambient floor reflections",
     ["faceted geometric stone sculpture", "low square plinth", "polished concrete floor"],
     ["gallery", "minimal", "sculpture", "concrete", "modern", "clean"]),

    ("IMG_9119.jpeg", "bg_39_white_cube_paper_city", "White Block Installation", "Stacked Cubes · Soft Shadow", "brutalist", "SCULPTURAL",
     "sculptural installation of hundreds of stacked matte white cubic blocks rising like a miniature city against a shadowed industrial skylight wall",
     "soft diffused gallery sidelight sculpting clean geometric shadows",
     ["stacked white cubic blocks", "dark industrial window mullions"],
     ["minimal", "cubes", "installation", "white", "geometric", "art"]),

    ("IMG_9120.jpeg", "bg_40_warm_gallery_partition", "Warm Partition Gallery", "Polished Floor · Quiet Hall", "brutalist", "GALLERY",
     "architectural museum corridor with a dark ceiling soffit opening into a warmly lit white gallery space with a framed portrait and seated visitor",
     "warm diffused museum skylight contrasting with dark foreground shadow",
     ["matte white partition wall", "polished concrete floor", "linear ceiling lights"],
     ["gallery", "museum", "modern", "warm", "minimal", "architecture"]),

    ("IMG_9121.jpeg", "bg_41_black_plinth_skylight_room", "Black Plinth Light Room", "Dark Stage · White Void", "brutalist", "MINIMAL",
     "stark contemporary installation space with a large glossy black square platform resting on dark parquet beneath a glowing white skylight ceiling",
     "high-contrast clean top light reflecting off the black plinth surface",
     ["large black square platform", "dark parquet floor", "luminous white ceiling"],
     ["minimal", "monochrome", "plinth", "gallery", "high contrast", "modern"]),

    ("IMG_9122.jpeg", "bg_42_monochrome_mural_gallery", "Monochrome Mural Gallery", "Glossy Concrete · White Hall", "brutalist", "GALLERY",
     "long sleek modern art gallery with a high-gloss dark concrete floor reflecting an abstract black-and-white mural along the white wall",
     "bright diffused skylight illumination with crisp floor reflections",
     ["glossy concrete floor", "large abstract monochrome wall panel", "white gallery walls"],
     ["gallery", "modern", "monochrome", "clean", "minimal", "reflection"]),

    ("IMG_9123.jpeg", "bg_43_noir_ruined_cathedral_fog", "Noir Ruined Cathedral Fog", "Jagged Spires · Storm Sky", "ruins", "GOTHIC",
     "monochrome apocalyptic landscape of shattered gothic cathedral silhouettes with broken crosses and jagged spires rising through dark fog",
     "dramatic high-contrast storm clouds backlighting thick ground-level mist",
     ["shattered stone spires", "fallen rubble path", "broken stone crosses"],
     ["gothic", "ruins", "monochrome", "fog", "apocalyptic", "dark"]),

    ("IMG_9124.jpeg", "bg_44_sunbeam_stone_abbey", "Sunbeam Stone Abbey Hall", "Tall Lancet Windows · Light", "ruins", "GOTHIC",
     "grand ruined stone abbey interior with soaring gothic arches and three tall lancet windows streaming parallel golden sunbeams across the stone floor",
     "dramatic volumetric morning sunbeams cutting through cool shadowed stone air",
     ["soaring stone arches", "ruined stone columns", "sunlit flagstone floor"],
     ["abbey", "sunbeams", "gothic", "ruins", "cathedral", "light shafts"]),

    ("IMG_9125.jpeg", "bg_45_ivy_abbey_courtyard", "Ivy Cloister Courtyard", "Stone Basin · Overgrown Arch", "ruins", "GOTHIC",
     "quiet mossy gothic abbey courtyard with a weathered stone water basin, vaulted colonnade on the left, and stone stairs climbing into ivy",
     "cool overcast garden shade filtering through arched stone openings",
     ["carved stone basin", "mossy flagstone walkway", "ivy-draped stone arches"],
     ["courtyard", "cloister", "ivy", "ruins", "gothic", "stone"]),

    ("IMG_9126.jpeg", "bg_46_emerald_moss_abbey_arch", "Overgrown Abbey Nave", "Lush Moss · Misty Forest", "ruins", "GOTHIC",
     "roofless gothic stone abbey archway completely draped in emerald moss and creeping vines with misty woodland visible beyond",
     "cool damp forest mist drifting through ancient stone arches",
     ["moss-draped gothic arches", "grassy stone floor", "overgrown stone pillars"],
     ["ruins", "abbey", "moss", "gothic", "forest", "overgrown"]),

    ("IMG_9127.jpeg", "bg_47_broken_stone_arch_sky", "Broken Stone Arch Sky", "Crumbled Masonry · Blue Sky", "ruins", "RUINS",
     "jagged ruined stone archway and crumbling masonry wall framing bright blue sky and drifting white clouds",
     "crisp natural afternoon sunlight grazing rough weathered limestone",
     ["crumbling limestone arch", "rough stone masonry"],
     ["ruins", "stone", "arch", "daylight", "medieval", "outdoor"]),

    ("IMG_9128.jpeg", "bg_48_grassy_abbey_light_shafts", "Grassy Abbey Light Shafts", "Sunlit Turf · Ruined Nave", "ruins", "GOTHIC",
     "open-air ruined cathedral nave carpeted in lush green grass with golden morning light shafts streaming through triple gothic windows",
     "warm misty morning sunbeams illuminating soft grass and pale stone",
     ["tall ruined stone nave", "green grass carpet", "gothic tracery windows"],
     ["abbey", "sunbeams", "grass", "ruins", "gothic", "serene"]),

    ("IMG_9129.jpeg", "bg_49_foggy_white_cathedral_nave", "Foggy White Cathedral", "Monochrome Mist · High Vaults", "ruins", "GOTHIC",
     "ethereal monochrome view inside a towering ruined cathedral filled with luminous white mist rising beneath tall gothic lancet windows",
     "bright misty backlighting creating soft silhouettes and ghostly stone depth",
     ["tall gothic lancet windows", "weathered stone piers", "rubble floor"],
     ["cathedral", "fog", "monochrome", "gothic", "ethereal", "ruins"]),

    ("IMG_9130.jpeg", "bg_50_snowy_abbey_facade", "Snow-Dusted Abbey Facade", "Stone Gable · Winter Sky", "ruins", "GOTHIC",
     "weathered dark stone gothic abbey gable with empty arched windows standing in light snow under a pale winter overcast sky",
     "cold crisp winter daylight across snow-dusted turf and dark masonry",
     ["gothic stone gable", "snow-dusted grass", "fallen stone blocks"],
     ["snow", "abbey", "winter", "ruins", "gothic", "cold"]),

    ("IMG_9131.jpeg", "bg_51_overgrown_chapel_pews", "Overgrown Chapel Sanctuary", "Broken Glass Roof · Vines", "ruins", "GOTHIC",
     "abandoned stone chapel interior where creeping green vines and ferns overtake wooden pews, stone altar, and a shattered vaulted ceiling",
     "soft diffused daylight filtering down through broken roof rafters",
     ["ivy-covered wooden pews", "weathered stone altar", "mossy floor tiles"],
     ["chapel", "abandoned", "overgrown", "vines", "ruins", "gothic"]),

    ("IMG_9132.jpeg", "bg_52_sunlit_abbey_ruin_field", "Wildflower Abbey Ruins", "Golden Grass · Clear Sky", "ruins", "RUINS",
     "monumental crumbling stone abbey arches standing amid dry wild grass and weathered rubble under a clear late-afternoon blue sky",
     "crisp natural golden-hour side light across pale limestone",
     ["crumbling stone arcade", "dry wild grass", "scattered limestone"],
     ["ruins", "abbey", "field", "stone", "historic", "outdoor"]),

    ("IMG_9134.jpeg", "bg_53_abandoned_villa_pool", "Abandoned Villa Pool", "Algae Water · Tall Windows", "ruins", "ABANDONED",
     "derelict neoclassical indoor swimming pool with shallow green algae-stained water, peeling white walls, and tall grid windows",
     "cool overcast daylight pouring through tall mullioned windows",
     ["algae-stained tiled pool", "peeling white pillars", "tall grid windows"],
     ["pool", "abandoned", "villa", "liminal", "decay", "indoor"]),

    ("IMG_9135.jpeg", "bg_54_steamy_empty_indoor_pool", "Steamy Foggy Pool Hall", "Thick Steam · Pink Tile Deck", "liminal", "LIMINAL",
     "empty retro indoor swimming pool shrouded in dense white steam with pale turquoise water, metal lane railings, and red-tiled deck",
     "heavy humid steam haze diffusing bright overhead strip lights",
     ["empty indoor pool", "metal pool railings", "red tiled deck"],
     ["pool", "steam", "liminal", "fog", "backrooms", "retro"]),

    ("IMG_9136.jpeg", "bg_55_emerald_tiled_pool_hall", "Teal Tiled Pool Hall", "Symmetrical Reflections · Chairs", "liminal", "LIMINAL",
     "symmetrical vintage indoor swimming pool with deep teal-blue water, rows of white plastic poolside chairs, and glowing rectangular ceiling panels",
     "cool clinical cyan-green fluorescent light reflecting off mirror-still water",
     ["mirror-still teal pool", "row of white poolside chairs", "luminous ceiling panels"],
     ["pool", "teal", "symmetrical", "liminal", "cinematic", "indoor"]),

    ("IMG_9137.jpeg", "bg_56_overgrown_rotunda_greenhouse", "Overgrown Rotunda Conservatory", "Glass Dome · Mossy Benches", "ruins", "GREENHOUSE",
     "abandoned circular glass-domed botanical conservatory with mossy stone benches, cracked walkway, and creeping greenery",
     "soft diffused daylight filtering through weathered glass panes",
     ["curved iron glass dome", "mossy stone benches", "overgrown stone path"],
     ["greenhouse", "conservatory", "overgrown", "ruins", "botanical", "glass"]),

    ("IMG_9138.jpeg", "bg_57_ivy_manor_conservatory", "Ivy Manor Conservatory", "Rusted Iron · Forest Edge", "ruins", "GREENHOUSE",
     "grand abandoned Victorian glass conservatory attached to a stone manor house, wrapped in thick climbing ivy against dense green trees",
     "bright overcast daylight softening weathered rust and lush foliage",
     ["rusted iron conservatory frame", "climbing ivy walls", "stone manor facade"],
     ["conservatory", "abandoned", "ivy", "manor", "victorian", "ruins"]),

    ("IMG_9139.jpeg", "bg_58_jungle_glasshouse_dome", "Jungle Glasshouse Dome", "Broken Panes · Wild Ferns", "ruins", "GREENHOUSE",
     "wildly overgrown Victorian iron-and-glass conservatory interior choked with climbing vines and lush ferns under arched skylights",
     "cool shaded botanical greenhouse light filtering through misty glass",
     ["arched iron ribs", "dense climbing vines", "lush interior foliage"],
     ["greenhouse", "overgrown", "vines", "botanical", "ruins", "dark"]),

    ("IMG_9140.jpeg", "bg_59_alpine_teal_greenhouse", "Alpine Teal Conservatory", "Verdi-Gris Iron · Mountain Mist", "ruins", "GREENHOUSE",
     "ornate weathered green-patina glass conservatory standing before misty alpine mountains with overgrown grass at the threshold",
     "cool teal-tinted overcast mountain air and soft diffused sky",
     ["ornate iron-and-glass facade", "cracked stone steps", "wild grass"],
     ["greenhouse", "teal", "vintage", "mountains", "overgrown", "cinematic"]),

    ("IMG_9141.jpeg", "bg_60_brutalist_cantilever_towers", "Brutalist Concrete Cantilever", "Monochrome Geometry · Bold", "brutalist", "BRUTALIST",
     "monumental monochrome brutalist concrete sculpture-architecture of interlocking cantilevered slabs and angular shadows",
     "crisp high-contrast daylight sculpting sharp concrete planes",
     ["cantilevered concrete slabs", "monolithic concrete piers"],
     ["brutalist", "concrete", "monochrome", "architecture", "geometric", "bold"]),

    ("IMG_9142.jpeg", "bg_61_foggy_buzludzha_monument", "Foggy Brutalist Saucer Monument", "Stepped Approach · Dense Mist", "brutalist", "BRUTALIST",
     "colossal saucer-shaped concrete monument looming out of thick monochrome fog at the top of a sweeping monumental stone staircase",
     "dense eerie mountain fog enveloping the brutalist silhouette",
     ["monumental stone steps", "brutalist concrete saucer", "flanking ruin walls"],
     ["brutalist", "monument", "fog", "monochrome", "sci-fi", "epic"]),

    ("IMG_9143.jpeg", "bg_62_snowy_concrete_saucer_hull", "Frozen Concrete Saucer Hull", "Weathered Ribbing · Ice Mist", "brutalist", "BRUTALIST",
     "massive snow-encrusted brutalist concrete saucer underside looming above tiny figures in freezing white fog",
     "icy overcast fog creating stark scale and atmospheric depth",
     ["frosted concrete ribbing", "snowy rocky slope"],
     ["brutalist", "snow", "monument", "fog", "scale", "sci-fi"]),

    ("IMG_9144.jpeg", "bg_63_cyan_shadow_brutalist_plaza", "Cyan Shadow Brutalist Plaza", "Tiled Terrace · Concrete Mass", "brutalist", "BRUTALIST",
     "sharp architectural study of stepped brutalist concrete volumes rising behind a sloped skylight roof and tiled courtyard plaza",
     "bright crisp daylight casting cool cyan-tinted geometric shadows",
     ["tiled courtyard pavers", "stepped concrete volumes", "sloped metal skylight"],
     ["brutalist", "plaza", "cyan", "concrete", "modern", "architecture"]),

    ("IMG_9145.jpeg", "bg_64_monochrome_brutalist_courtyard", "Monochrome Brutalist Courtyard", "Concrete Benches · Walkways", "brutalist", "BRUTALIST",
     "clean black-and-white brutalist civic courtyard with raw concrete benches, elevated walkways, and geometric building towers",
     "even overcast architectural daylight with crisp tonal separation",
     ["minimalist concrete benches", "elevated concrete walkways", "paved plaza"],
     ["brutalist", "courtyard", "monochrome", "benches", "architecture", "urban"]),

    ("IMG_9146.jpeg", "bg_65_concrete_bunker_stairwell", "Concrete Bunker Stairwell", "Angular Beams · Yellow Treads", "brutalist", "BRUTALIST",
     "stark raw concrete interior stairwell with heavy angled ceiling beams, tubular metal handrails, and yellow-edged steps",
     "cool fluorescent stairwell glow mixing with warm concrete tones",
     ["raw concrete stairs", "tubular steel railings", "angled concrete beams"],
     ["brutalist", "stairwell", "concrete", "industrial", "urban", "minimal"]),

    ("IMG_9147.jpeg", "bg_66_monochrome_barbican_stairs", "Barbican Concrete Stairs", "High-Rise Grid · Monochrome", "brutalist", "BRUTALIST",
     "symmetrical black-and-white brutalist concrete staircase rising toward a towering gridded modernist apartment block",
     "crisp overcast daylight emphasizing raw concrete grain and repeating geometry",
     ["concrete stairwell walls", "concrete steps", "gridded high-rise facade"],
     ["brutalist", "barbican", "stairs", "monochrome", "architecture", "urban"]),

    ("IMG_9148.jpeg", "bg_67_european_corner_bistro_night", "Corner Bistro Patio Dusk", "Red Door · Cobblestone", "urban", "EUROPEAN",
     "moody European cobblestone street corner outside an ivy-draped bistro with a crimson doorway, chalkboard menus, and empty metal patio tables",
     "soft blue-hour twilight with warm interior window light spilling onto cobblestones",
     ["metal cafe tables and chairs", "crimson bistro door", "cobblestone pavement", "ivy facade"],
     ["european", "cafe", "bistro", "cobblestone", "dusk", "urban"]),

    ("IMG_9149.jpeg", "bg_68_graffiti_carved_arch_door", "Graffiti Carved Stone Portal", "Wooden Double Doors · Tags", "textures", "STREET",
     "ornate carved stone doorway framing weathered wooden double doors surrounded by colorful street graffiti tags and stone steps",
     "even overcast street light highlighting stone relief and spray-painted textures",
     ["carved stone archway", "wooden double doors", "graffiti-tagged stonework", "stone steps"],
     ["doorway", "graffiti", "architecture", "streetwear", "european", "portal"]),

    ("IMG_9150.jpeg", "bg_69_crimson_neon_alley_arch", "Crimson Neon Alley Arch", "Glowing Red Passage · Brick", "urban", "NIGHT",
     "narrow graffiti-covered brick alleyway leading through a stone arch bathed in intense saturated crimson-red neon light",
     "dramatic blood-red nocturnal glow spilling across damp cobblestones and tagged walls",
     ["brick archway", "graffiti-covered walls", "damp alley pavement"],
     ["alley", "red neon", "night", "graffiti", "cinematic", "urban"]),

    ("IMG_9151.jpeg", "bg_70_snowy_graffiti_brick_walk", "Snowy Graffiti Brick Walk", "Streetlamp Glow · Night", "urban", "NIGHT",
     "snow-dusted brick sidewalk running beside a long graffiti-tagged brick perimeter wall lit by a glowing vintage streetlamp at night",
     "crisp cold winter night air with warm sodium streetlamp pool and long shadows",
     ["graffiti brick perimeter wall", "snow-dusted sidewalk", "bare winter trees", "streetlamp"],
     ["winter", "snow", "night", "graffiti", "brick", "streetlamp"]),

    ("IMG_9152.jpeg", "bg_71_overgrown_berlin_alley", "Overgrown Urban Cobble Path", "Street Signs · Wild Ivy", "urban", "STREET",
     "sunlit European cobblestone lane bordered by wild overgrown bushes, weathered street signs, and a graffiti-covered building facade",
     "bright crisp afternoon sunlight casting sharp foliage shadows on cobblestones",
     ["cobblestone lane", "overgrown roadside foliage", "metal street signs"],
     ["street", "cobblestone", "berlin", "overgrown", "daylight", "urban"]),

    ("IMG_9153.jpeg", "bg_72_evening_corner_deli_street", "Evening Corner Shop Street", "Warm Windows · Bicycles", "urban", "STREET",
     "gritty European neighborhood corner at dusk with warm glowing storefront windows, sticker-covered bollards, parked bicycles, and cobblestones",
     "blue-hour twilight balanced against warm amber shopfront spill",
     ["cobblestone corner", "stickered street bollards", "warm shop windows", "balconies"],
     ["street", "dusk", "european", "urban", "shopfront", "cinematic"]),

    ("IMG_9154.jpeg", "bg_73_nyc_water_tower_rooftop", "NYC Water Tower Rooftop", "Blue Hour · Empire State", "urban", "NYC",
     "flat New York City brick-parapet rooftop at blue hour with iconic wooden water towers silhouetted against the lit Empire State Building skyline",
     "deep cobalt twilight sky with warm city horizon haze",
     ["wooden rooftop water towers", "brick parapet wall", "flat tar roof"],
     ["nyc", "rooftop", "water tower", "blue hour", "skyline", "cinematic"]),

    ("IMG_9155.jpeg", "bg_74_golden_hour_fire_escape", "Golden Hour Fire Escape", "Potted Plants · Brick Canyon", "urban", "NYC",
     "narrow sunlit New York City brick canyon lined with wrought-iron fire escapes overflowing with potted greenery at golden hour",
     "warm amber sunset light slicing between tall tenement brick facades",
     ["wrought-iron fire escapes", "potted balcony plants", "warm brick facade"],
     ["nyc", "fire escape", "golden hour", "brick", "urban", "warm"]),

    ("IMG_9156.jpeg", "bg_75_night_brooklyn_brownstone", "Brooklyn Storefront Night", "Fire Escape · Warm Brick", "urban", "NYC",
     "classic red-brick Brooklyn townhouse at night with a black wrought-iron fire escape, closed shuttered storefront, and warm streetlight glow",
     "quiet nocturnal urban air with warm streetlamp illumination on brick",
     ["red-brick townhouse facade", "black fire escape", "shuttered storefront", "curbside sidewalk"],
     ["brooklyn", "nyc", "night", "brick", "fire escape", "streetwear"]),

    ("IMG_9157.jpeg", "bg_76_sunlit_tenement_laundry", "Tenement Fire Escape Laundry", "Hard Noon Sun · Cream Brick", "urban", "NYC",
     "weathered cream-brick city tenement facade with zig-zagging iron fire escapes and a clothesline of hanging laundry in sharp afternoon sun",
     "high-contrast afternoon sunlight casting crisp geometric fire-escape shadows",
     ["cream-brick facade", "iron fire escapes", "hanging laundry clothesline"],
     ["tenement", "fire escape", "laundry", "sunlight", "nyc", "urban"]),

    ("IMG_9158.jpeg", "bg_77_willow_canal_footbridge", "Willow Canal Footbridge", "Backlit Water · Cobble Bank", "urban", "CANAL",
     "arched iron footbridge spanning a calm urban canal framed by drooping willow branches and a cobblestone towpath",
     "bright hazy morning backlight shimmering across calm canal water",
     ["arched iron footbridge", "cobblestone towpath", "weeping willow branches", "canal water"],
     ["canal", "bridge", "willow", "backlit", "urban", "serene"]),

    ("IMG_9159.jpeg", "bg_78_underbridge_canal_path", "Underbridge Canal Towpath", "Stone Vault · Railings", "urban", "CANAL",
     "shaded stone canal tunnel framing a sunlit tree-lined canal path with metal towpath railings and mirror-like water reflections",
     "cool shadowed stone arch opening onto bright green sunlit foliage",
     ["stone bridge arch", "metal towpath railing", "calm reflective canal"],
     ["canal", "tunnel", "bridge", "reflection", "urban", "london"]),

    ("IMG_9160.jpeg", "bg_79_graffiti_arch_canal_sunbeam", "Graffiti Canal Tunnel Light", "Sunlit Mist · Brick Vault", "urban", "CANAL",
     "curved brick canal underpass covered in graffiti opening onto a sunlit green canal towpath with soft morning light rays",
     "misty golden sunbeams filtering into the shaded brick tunnel",
     ["curved brick arch", "concrete towpath", "reflective canal water"],
     ["canal", "tunnel", "graffiti", "sunbeams", "urban", "cinematic"]),

    ("IMG_9161.jpeg", "bg_80_mossy_brick_canal_arch", "Mossy Brick Canal Arch", "Autumn Foliage · Dark Water", "urban", "CANAL",
     "weathered mossy brick canal bridge arch with graffiti-tagged abutments framing bright autumn greenery and still dark water",
     "deep cool arch shadow contrasting with sunlit leaves beyond",
     ["mossy brick arch", "metal canal railing", "dark reflective water"],
     ["canal", "arch", "brick", "graffiti", "urban", "moody"]),

    ("IMG_9162.jpeg", "bg_81_crimson_alley_metal_door", "Crimson Backstage Alley", "Red Floodlight · Trash Can", "urban", "NIGHT",
     "tight urban service alley flooded in intense deep crimson-red light with a corrugated roll-up gate, graffiti walls, and a metal trash can",
     "saturated red nocturnal floodlight with deep indigo sky shadows above",
     ["metal trash can", "corrugated roll-up gate", "tagged brick walls", "open green service door"],
     ["alley", "crimson", "red light", "night", "gritty", "streetwear"]),

    ("IMG_9163.jpeg", "bg_82_amber_lantern_alley_stairs", "Amber Lamp Alley Stairs", "Weathered Steps · Night", "urban", "NIGHT",
     "narrow worn stone alley staircase climbing toward a glowing warm amber wall lantern between shadowed plastered walls",
     "quiet nocturnal urban air lit by a single warm overhead street lamp",
     ["worn stone alley steps", "wrought-iron balcony railing", "weathered plaster walls"],
     ["alley", "stairs", "night", "amber light", "moody", "european"]),

    ("IMG_9164.jpeg", "bg_83_sodium_cobble_alley_night", "Sodium Cobble Alley Night", "Warm Orange Glow · Narrow", "urban", "NIGHT",
     "narrow medieval cobblestone alleyway glowing in rich sodium-vapor orange-amber light between dark historic stone buildings",
     "warm monochromatic orange night glow with wet cobblestone specular highlights",
     ["wet cobblestone alley", "historic stone walls", "warm wall sconces"],
     ["alley", "cobblestone", "sodium vapor", "night", "orange", "cinematic"]),

    ("IMG_9165.jpeg", "bg_84_european_cobble_canyon", "European Limestone Street", "Cast-Iron Post · Soft Sky", "urban", "EUROPEAN",
     "curving narrow European street lined with grand weathered limestone facades, a green cast-iron bollard post, and wet cobblestones",
     "soft diffused overcast daylight with subtle specular sheen on wet stone",
     ["cobblestone pavement", "cast-iron street post", "carved limestone facades"],
     ["european", "cobblestone", "limestone", "street", "editorial", "classic"]),

    ("IMG_9166.jpeg", "bg_85_dumbo_manhattan_bridge_dusk", "DUMBO Bridge Blue Hour", "Cobblestone · Brick Warehouses", "urban", "NYC",
     "iconic DUMBO cobblestone street flanked by tall red-brick warehouses framing the illuminated steel towers of the Manhattan Bridge at dusk",
     "deep twilight blue sky balanced with warm golden streetlamp glow",
     ["cobblestone street", "red-brick warehouse facades", "parked city cars", "steel suspension bridge"],
     ["dumbo", "nyc", "bridge", "blue hour", "streetwear", "cinematic"]),

    ("IMG_9167.jpeg", "bg_86_noir_cobble_alley_lamp", "Noir Cobble Streetlamp", "Monochrome · String Lights", "urban", "NOIR",
     "monochrome late-night cobblestone street between tall warehouse walls lit by a single glowing streetlamp and overhead cables",
     "crisp film-noir night contrast with glowing highlights on damp cobbles",
     ["cobblestone street", "parked vintage-feel sedans", "glowing streetlamp", "fire escapes"],
     ["noir", "monochrome", "night", "cobblestone", "streetlamp", "cinematic"]),

    ("IMG_9168.jpeg", "bg_87_infinite_red_checker_hall", "Infinite Red Checker Hall", "Tilted Portals · Surreal", "liminal", "SURREAL",
     "dizzying surreal corridor lined with vivid crimson walls and a black-and-white checkered floor receding through progressively tilted white doorways",
     "even cool overhead light tube casting crisp surreal geometric depth",
     ["checkered floor", "crimson corridor walls", "tilted white doorframes"],
     ["surreal", "red", "checkerboard", "corridor", "liminal", "optical"]),

    ("IMG_9169.jpeg", "bg_88_magenta_fog_kitchen_window", "Magenta Fog Kitchen Window", "Mint Teal Room · Dusk", "liminal", "CINEMATIC",
     "dim mint-teal vintage kitchen interior framing a glowing window looking out onto bare tree branches shrouded in deep magenta-pink fog",
     "eerie dual-tone teal interior shadows against luminous magenta dusk mist outside",
     ["vintage gas stove", "kitchen counter", "misted window frame"],
     ["liminal", "magenta", "teal", "kitchen", "window", "cinematic"]),

    ("IMG_9170.jpeg", "bg_89_tokyo_crosswalk_overcast", "Tokyo Crosswalk Overcast", "Zebra Stripes · Utility Wires", "urban", "TOKYO",
     "quiet Japanese city intersection with bold white zebra crosswalk stripes, tiled mid-rise buildings, leafy street trees, and overhead power lines",
     "cool overcast Tokyo daylight with crisp urban contrast",
     ["white zebra crosswalk", "tiled corner storefront", "overhead utility wires", "street trees"],
     ["tokyo", "japan", "crosswalk", "urban", "streetwear", "editorial"]),

    ("IMG_9171.jpeg", "bg_90_brick_roll_shutter_wall", "Brick Roll-Up Shutter Wall", "Clean Street · Tag Detail", "textures", "STREET",
     "symmetrical red-brick urban loading bay featuring a weathered gray corrugated metal roll-up door with a clean white outline tag",
     "crisp natural afternoon street light grazing brick and galvanized steel",
     ["gray corrugated roll-up door", "red-brick facade", "yellow safety bollards"],
     ["brick", "shutter", "streetwear", "urban", "minimal", "backdrop"]),

    ("IMG_9172.jpeg", "bg_91_weathered_concrete_side_steps", "Weathered Concrete Side Steps", "Steel Rail · Plaster Wall", "textures", "MINIMAL",
     "minimalist architectural study of weathered concrete steps and a galvanized pipe handrail ascending diagonally against a cracked gray plaster wall",
     "soft diffused daylight highlighting subtle concrete stains and hairline cracks",
     ["concrete steps", "galvanized steel handrail", "cracked plaster wall"],
     ["stairs", "concrete", "minimal", "streetwear", "backdrop", "clean"]),

    ("IMG_9173.jpeg", "bg_92_bougainvillea_blue_door", "Bougainvillea Blue Portal", "Magenta Blooms · White Wall", "textures", "MEDITERRANEAN",
     "bright whitewashed Mediterranean wall with an arched cobalt-blue wooden door framed by cascading magenta bougainvillea blossoms and fallen petals",
     "even soft daylight bringing out vivid magenta flowers against clean white stucco",
     ["arched cobalt-blue wooden door", "terracotta urn", "cascading bougainvillea", "petal-strewn stone"],
     ["bougainvillea", "mediterranean", "blue door", "floral", "editorial", "clean"]),

    ("IMG_9174.jpeg", "bg_93_peeling_plaster_corner_steps", "Peeling Plaster Corner Steps", "Muted Earth · Quiet Shade", "textures", "MINIMAL",
     "quiet sun-washed courtyard corner with a short weathered stone staircase climbing along a peeling cream-and-gray stucco wall",
     "soft angled afternoon sunlight casting a clean diagonal shadow across the ground",
     ["weathered stone steps", "peeling stucco wall", "swept concrete courtyard"],
     ["minimal", "stucco", "stairs", "editorial", "clean", "backdrop"]),

    ("IMG_9175.jpeg", "bg_94_bombed_wall_sky_portal", "Shattered Wall Sky Portal", "Rubble Floor · Bright Clouds", "ruins", "RUINS",
     "jagged human-scale breach blown through a weathered concrete ruin wall framing bright blue sky and white clouds beyond tiled debris",
     "cool shadowed interior contrasting with luminous daylight sky outside",
     ["jagged breached concrete wall", "tiled rubble floor", "broken debris"],
     ["ruins", "portal", "sky", "rubble", "editorial", "dramatic"]),

    ("IMG_9176.jpeg", "bg_95_sunlit_abandoned_loft_floor", "Sunlit Abandoned Loft", "Geometric Light · Raw Walls", "ruins", "STUDIO",
     "vacant industrial loft interior with peeling gray plaster walls, red baseboard stripe, and sharp afternoon window light grids across the concrete floor",
     "bright directional afternoon sunbeams casting crisp windowpane shadows",
     ["peeling plaster walls", "bare concrete floor", "high industrial windows"],
     ["loft", "industrial", "sunbeams", "studio", "editorial", "minimal"]),

    ("IMG_9177.jpeg", "bg_96_weathered_brick_flower_door", "Weathered Brick Garden Door", "Peeling Wood · Purple Blooms", "textures", "RUSTIC",
     "aged wooden garden door recessed in a crumbling red-brick and peeling stucco wall crowned with cascading purple bougainvillea",
     "soft diffused overcast daylight emphasizing rich brick and weathered wood textures",
     ["peeling green wooden door", "crumbling red brick wall", "purple climbing flowers"],
     ["brick", "rustic", "door", "floral", "editorial", "texture"]),

    ("IMG_9178.jpeg", "bg_97_mint_dado_pipe_wall", "Mint Dado Industrial Wall", "Vertical Pipes · Minimal", "textures", "INDUSTRIAL",
     "minimalist industrial interior wall split horizontally between crisp white plaster and muted mint-green paint with vertical painted conduit pipes",
     "soft directional ambient light casting gentle vertical pipe shadows",
     ["painted vertical conduit pipes", "two-tone mint and white wall", "concrete floor"],
     ["minimal", "mint", "pipes", "industrial", "editorial", "backdrop"]),

    ("IMG_9179.jpeg", "bg_98_red_brick_louver_backdrop", "Red Brick Louver Backdrop", "Concrete Base · Clean Grid", "textures", "URBAN",
     "flat symmetrical urban street backdrop of clean red-brown brick over a weathered concrete plinth topped by horizontal metal louvers",
     "even flat overcast daylight ideal for clean lookbook and streetwear framing",
     ["red-brown brick wall", "weathered concrete plinth", "metal louver vents"],
     ["brick", "backdrop", "streetwear", "lookbook", "minimal", "clean"]),

    ("IMG_9180.jpeg", "bg_99_teal_garage_white_brick", "Teal Garage White Brick", "Symmetrical Gate · Concrete", "textures", "URBAN",
     "clean symmetrical urban facade featuring bright painted teal-blue metal double garage doors recessed into white-painted brick over cracked concrete",
     "soft even overcast daylight with zero harsh shadows",
     ["painted teal metal double doors", "white-painted brick wall", "cracked concrete apron"],
     ["teal", "garage", "white brick", "minimal", "streetwear", "backdrop"]),
]


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ts_items = []

    for src_name, slug, name, subtitle, category, badge, location, atmosphere, props, tags in BACKGROUNDS:
        src_path = ROOT / src_name
        if not src_path.exists():
            raise FileNotFoundError(f"Missing source image: {src_path}")

        dest_name = f"{slug}.webp"
        dest_path = OUT_DIR / dest_name

        with Image.open(src_path) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            im.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
            im.save(dest_path, format="WEBP", quality=85, method=4)

        src_path.unlink()

        ts_items.append({
            "id": slug,
            "name": name,
            "subtitle": subtitle,
            "category": category,
            "badge": badge,
            "image": f"/backgrounds/{dest_name}",
            "location": location,
            "atmosphere": atmosphere,
            "props": props,
            "tags": tags,
        })

    # Category counts
    cat_counts = {}
    for it in ts_items:
        cat_counts[it["category"]] = cat_counts.get(it["category"], 0) + 1

    categories_ts = [
        {"id": "all", "label": f"All ({len(ts_items)})"},
        {"id": "urban", "label": f"Urban & Street ({cat_counts.get('urban', 0)})"},
        {"id": "brutalist", "label": f"Brutalist & Minimal ({cat_counts.get('brutalist', 0)})"},
        {"id": "liminal", "label": f"Liminal & Neon ({cat_counts.get('liminal', 0)})"},
        {"id": "ruins", "label": f"Gothic & Ruins ({cat_counts.get('ruins', 0)})"},
        {"id": "nature", "label": f"Nature & Coast ({cat_counts.get('nature', 0)})"},
        {"id": "textures", "label": f"Walls & Portals ({cat_counts.get('textures', 0)})"},
    ]

    ts_code = f'''import {{ setAt, type PromptDoc }} from "./model.ts";

export type BackgroundCategory =
  | "all"
  | "urban"
  | "brutalist"
  | "liminal"
  | "ruins"
  | "nature"
  | "textures";

export type BackgroundItem = {{
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
}};

export const BACKGROUND_CATEGORIES: Array<{{ id: BackgroundCategory; label: string }}> = {json.dumps(categories_ts, indent=2)};

export const BACKGROUND_LIBRARY: BackgroundItem[] = {json.dumps(ts_items, indent=2)};

export function filterBackgrounds(
  query: string,
  category: BackgroundCategory = "all",
): BackgroundItem[] {{
  const q = query.trim().toLowerCase();
  return BACKGROUND_LIBRARY.filter((item) => {{
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
  }});
}}

export function applyBackgroundItem(doc: PromptDoc, item: BackgroundItem): PromptDoc {{
  let next = setAt(doc, "scene_composition.environmental_staging.location_context", item.location);
  next = setAt(next, "scene_composition.environmental_staging.atmosphere_and_air_density", item.atmosphere);
  next = setAt(next, "scene_composition.environmental_staging.grounded_props", [...item.props]);
  return next;
}}

export function isBackgroundApplied(doc: PromptDoc, item: BackgroundItem): boolean {{
  const current = doc.scene_composition.environmental_staging.location_context.trim().toLowerCase();
  if (!current) return false;
  return current === item.location.trim().toLowerCase();
}}
'''

    DB_PATH.write_text(ts_code, encoding="utf-8")
    print(f"Converted {len(ts_items)} backgrounds to public/backgrounds/*.webp and generated {DB_PATH.name}")
    print("Category counts:", cat_counts)


if __name__ == "__main__":
    main()
