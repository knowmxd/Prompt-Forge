export type CameraCategory = "all" | "elevations" | "framings" | "lenses";

export type CameraItem = {
  id: string;
  name: string;
  subtitle: string;
  category: Exclude<CameraCategory, "all">;
  badge: string;
  image: string;
  principle: string;
  axis: string;
  lens?: string;
  dof?: string;
  tags: string[];
};

export const CAMERA_CATEGORIES: Array<{ id: CameraCategory; label: string }> = [
  { id: "all", label: "All Angles & Optics" },
  { id: "elevations", label: "Camera Elevations" },
  { id: "framings", label: "Framings & Rotations" },
  { id: "lenses", label: "Lenses & Depth of Field" },
];

export const CAMERA_LIBRARY: CameraItem[] = [
  // --- CAMERA ELEVATIONS & ANGLES (9 Options) ---
  {
    id: "ang-eye-level",
    name: "Eye-Level Direct Frontal",
    subtitle: "0° Elevation · Neutral Eye Horizon",
    category: "elevations",
    badge: "0° LEVEL",
    image: "/camera/elev_01.jpg",
    principle: "Eye-level neutral horizontal axis",
    axis: "camera at exact subject center height, 0° elevation, level horizon square-on",
    lens: "50mm natural prime",
    dof: "f/5.6 balanced studio sharpness",
    tags: ["camera", "eye-level", "neutral", "frontal", "straight-on", "standard"],
  },
  {
    id: "ang-low-angle",
    name: "Low-Angle Hero View",
    subtitle: "30° Upward Rake · Dominant Stature",
    category: "elevations",
    badge: "+30° LOW",
    image: "/camera/elev_02.jpg",
    principle: "Low-angle heroic upward rake",
    axis: "camera placed below subject center, tilted upward at 30° emphasizing imposing vertical stature",
    lens: "35mm environmental wide",
    dof: "f/4.0 soft falloff",
    tags: ["camera", "low-angle", "hero", "upward", "powerful", "elevation"],
  },
  {
    id: "ang-worms-eye",
    name: "Worm's-Eye Ground View",
    subtitle: "60° Steep Upward · Base to Apex",
    category: "elevations",
    badge: "+60° WORM",
    image: "/camera/elev_03.jpg",
    principle: "Worm's-eye dramatic ground rake",
    axis: "camera resting directly on floor plane, tilted steeply upward at 60° looking up at the subject's towering underside and overhead silhouette",
    lens: "24mm wide angle",
    dof: "f/8.0 deep foreground-to-apex depth",
    tags: ["camera", "worms-eye", "ground", "extreme low", "dramatic", "perspective"],
  },
  {
    id: "ang-high-angle",
    name: "High-Angle Lookdown",
    subtitle: "35° Downward Tilt · Overhead Stature",
    category: "elevations",
    badge: "-35° HIGH",
    image: "/camera/elev_04.jpg",
    principle: "High-angle descriptive lookdown",
    axis: "camera elevated above subject height, tilted downward at 35° capturing upper silhouette, stance footprint, and spatial spread",
    lens: "50mm prime",
    dof: "f/4.0 subtle depth falloff",
    tags: ["camera", "high-angle", "lookdown", "descending", "elevated", "overview"],
  },
  {
    id: "ang-birds-eye",
    name: "Bird's-Eye Overhead Vantage",
    subtitle: "65° Steep Downward · Plan View",
    category: "elevations",
    badge: "-65° BIRD",
    image: "/camera/elev_05.jpg",
    principle: "Bird's-eye architectural high view",
    axis: "camera positioned high above subject at 65° downward angle surveying upper form and surrounding ground plane",
    lens: "35mm wide-normal",
    dof: "f/5.6 clean depth",
    tags: ["camera", "birds-eye", "high vantage", "aerial", "downward", "overview"],
  },
  {
    id: "ang-top-down",
    name: "Top-Down 90° Flat-Lay",
    subtitle: "Pure 90° Nadir · Geometric Overhead Pattern",
    category: "elevations",
    badge: "90° NADIR",
    image: "/camera/elev_06.jpg",
    principle: "Direct overhead 90° flat-lay zenith",
    axis: "camera placed directly perpendicular overhead at 90°, looking straight down in radial plan-view geometry",
    lens: "50mm macro flat-field",
    dof: "f/8.0 edge-to-edge geometric sharpness",
    tags: ["camera", "top-down", "flat-lay", "90-degree", "zenith", "overhead", "geometric"],
  },
  {
    id: "ang-dutch-angle",
    name: "Dutch Angle / Canted Tilt",
    subtitle: "20° Diagonal Horizon · Dynamic Tension",
    category: "elevations",
    badge: "20° TILT",
    image: "/camera/elev_07.jpg",
    principle: "Canted dutch angle diagonal tilt",
    axis: "camera rolled 20° along horizontal optical axis, creating slanted diagonal horizon and kinetic tension",
    lens: "40mm prime",
    dof: "f/4.0 crisp diagonal plane",
    tags: ["camera", "dutch angle", "canted", "tilt", "diagonal", "tension", "cinematic"],
  },
  {
    id: "ang-ground-rake",
    name: "Ground-Level Floor Skim",
    subtitle: "Surface Skimming · Grounded Prominence",
    category: "elevations",
    badge: "0° FLOOR",
    image: "/camera/elev_08.jpg",
    principle: "Surface-level parallel floor rake",
    axis: "camera resting flat on floor surface, horizontal axis skimming the ground plane with prominent foreground base support",
    lens: "28mm wide angle",
    dof: "f/5.6 blurred floor foreground",
    tags: ["camera", "ground-rake", "floor", "surface", "skimming", "low"],
  },
  {
    id: "ang-isometric",
    name: "Isometric 30° Axonometric",
    subtitle: "Architectural 30° · Parallel Perspective",
    category: "elevations",
    badge: "30° ISO",
    image: "/camera/elev_09.jpg",
    principle: "Isometric 30° axonometric projection",
    axis: "camera elevated at 30° angle and rotated 45° off-axis, simulated orthographic parallel perspective lines",
    lens: "85mm telephoto flat perspective",
    dof: "f/11.0 deep orthographic sharpness",
    tags: ["camera", "isometric", "axonometric", "architectural", "30-degree", "clean"],
  },

  // --- FRAMINGS & ROTATIONS (9 Options) ---
  {
    id: "frame-three-quarter",
    name: "Three-Quarter 45° Hero Angle",
    subtitle: "45° Lateral Turn · Dimensional Volume",
    category: "framings",
    badge: "45° TURN",
    image: "/camera/frame_01.jpg",
    principle: "Three-quarter classic portrait angle",
    axis: "camera 45° off front axis, showing both frontal plane and side depth dimensions",
    lens: "50mm prime",
    dof: "f/4.0 natural separation",
    tags: ["framing", "three-quarter", "45-degree", "dimension", "classic", "turn"],
  },
  {
    id: "frame-profile-90",
    name: "Profile 90° Side View",
    subtitle: "Pure 90° Side Angle · Crisp Silhouette",
    category: "framings",
    badge: "90° SIDE",
    image: "/camera/frame_02.jpg",
    principle: "Clean 90° lateral profile view",
    axis: "camera positioned exactly 90° perpendicular to subject facing frame-right, highlighting silhouette",
    lens: "70mm portrait",
    dof: "f/5.6 crisp contours",
    tags: ["framing", "profile", "side view", "90-degree", "silhouette", "contour"],
  },
  {
    id: "frame-rear-angle",
    name: "Rear Angle Back View",
    subtitle: "180° Reverse Vantage · Rear Silhouette",
    category: "framings",
    badge: "180° BACK",
    image: "/camera/frame_03.jpg",
    principle: "Over-the-back reverse perspective",
    axis: "camera placed behind subject at 180°, framing rear silhouette, posture, and back details",
    lens: "50mm standard",
    dof: "f/4.5 soft studio roll-off",
    tags: ["framing", "rear view", "back", "reverse", "behind", "silhouette"],
  },
  {
    id: "frame-macro-leaf",
    name: "Macro 1:1 Detail Study",
    subtitle: "1:1 Macro Reproduction · Surface Micro-Texture",
    category: "framings",
    badge: "1:1 MACRO",
    image: "/camera/frame_04.jpg",
    principle: "1:1 macro close-up detail study",
    axis: "extreme 1:1 macro camera distance, filling 90% of frame with intricate surface micro-texture and fine structural detail",
    lens: "100mm f/2.8 dedicated macro lens",
    dof: "f/2.8 ultra-shallow depth of field, creamy bokeh falloff",
    tags: ["framing", "macro", "close-up", "micro-texture", "surface", "texture", "detail"],
  },
  {
    id: "frame-tight-detail",
    name: "Tight Juncture & Surface Detail",
    subtitle: "Medium Close-Up · Material Junction",
    category: "framings",
    badge: "TIGHT MCU",
    image: "/camera/frame_05.jpg",
    principle: "Tight detail medium close-up",
    axis: "camera tightly framed in medium close-up isolating material junctions, fine craftsmanship, and tactile surface contours",
    lens: "85mm prime",
    dof: "f/2.8 tactile selective focus",
    tags: ["framing", "tight", "detail", "close-up", "juncture", "material", "texture"],
  },
  {
    id: "frame-medium-shot",
    name: "Medium Studio Catalog Shot",
    subtitle: "Classic Medium Framing · Waist to Crown",
    category: "framings",
    badge: "MEDIUM MS",
    image: "/camera/frame_06.jpg",
    principle: "Standard medium studio framing",
    axis: "subject framed cleanly from lower torso or base to crown, filling 70% of frame with balanced studio margins",
    lens: "50mm studio prime",
    dof: "f/5.6 balanced editorial sharpness",
    tags: ["framing", "medium shot", "catalog", "studio", "balanced", "centered"],
  },
  {
    id: "frame-wide-environmental",
    name: "Wide Environmental Space",
    subtitle: "Generous Negative Space · Spatial Context",
    category: "framings",
    badge: "WIDE WS",
    image: "/camera/frame_07.jpg",
    principle: "Wide environmental studio composition",
    axis: "camera pulled back 4 meters, framing the full subject within an expansive environment with generous negative space",
    lens: "28mm wide angle",
    dof: "f/8.0 crisp environmental depth",
    tags: ["framing", "wide", "environmental", "space", "gallery", "room", "negative space"],
  },
  {
    id: "frame-distant-long",
    name: "Distant Long Shot (VLS)",
    subtitle: "Extreme Long Distance · Isolated Form",
    category: "framings",
    badge: "LONG ELS",
    image: "/camera/frame_08.jpg",
    principle: "Very long shot with immense negative space",
    axis: "distant camera vantage, subject occupies only 15% of frame centered inside vast open negative space",
    lens: "35mm prime",
    dof: "f/8.0 deep atmospheric focus",
    tags: ["framing", "long shot", "distant", "isolated", "negative space", "minimalist"],
  },
  {
    id: "frame-foreground-peeking",
    name: "Foreground Element Peeking",
    subtitle: "Obscured Layering · Depth Framing",
    category: "framings",
    badge: "LAYERED FG",
    image: "/camera/frame_09.jpg",
    principle: "Over-the-shoulder foreground obscuration",
    axis: "camera shooting past softly blurred foreground framing elements, rack focus locked crisply on main subject",
    lens: "85mm portrait telephoto",
    dof: "f/1.8 shallow depth with dreamy foreground framing bokeh",
    tags: ["framing", "foreground", "peeking", "depth", "layers", "bokeh", "obscuration"],
  },

  // --- LENSES & OPTICAL DEPTH (9 Options) ---
  {
    id: "lens-ultra-wide-14",
    name: "Ultra-Wide 14mm Lens",
    subtitle: "114° Field of View · Dynamic Distortion",
    category: "lenses",
    badge: "14mm f/5.6",
    image: "/camera/lens_01.jpg",
    principle: "Ultra-wide 14mm optical expansion",
    axis: "camera at close range with 14mm ultra-wide optic, subtle barrel perspective divergence emphasizing scale",
    lens: "14mm ultra-wide prime",
    dof: "f/5.6 deep hyperfocal field",
    tags: ["optics", "lens", "14mm", "ultra-wide", "dynamic", "distortion", "expansion"],
  },
  {
    id: "lens-wide-24",
    name: "Wide-Angle 24mm Editorial",
    subtitle: "84° Field of View · Foreground Emphasis",
    category: "lenses",
    badge: "24mm f/5.6",
    image: "/camera/lens_02.jpg",
    principle: "24mm architectural wide perspective",
    axis: "24mm wide lens positioned close, emphasizing foreground volume and expansive surrounding perspective",
    lens: "24mm f/1.4 GM wide-angle prime",
    dof: "f/5.6 sharp subject with soft environmental falloff",
    tags: ["optics", "lens", "24mm", "wide-angle", "editorial", "architectural"],
  },
  {
    id: "lens-classic-35",
    name: "Classic 35mm Documentary",
    subtitle: "63° Field of View · Authentic Context",
    category: "lenses",
    badge: "35mm f/4.0",
    image: "/camera/lens_03.jpg",
    principle: "Classic 35mm documentary reportage",
    axis: "35mm prime lens at eye level, offering balanced environmental storytelling with zero distortion",
    lens: "35mm f/1.4 prime lens",
    dof: "f/4.0 gentle natural roll-off",
    tags: ["optics", "lens", "35mm", "documentary", "natural", "storytelling"],
  },
  {
    id: "lens-standard-50",
    name: "Standard 50mm Human Prime",
    subtitle: "47° Field of View · Neutral Human Vision",
    category: "lenses",
    badge: "50mm f/5.6",
    image: "/camera/lens_04.jpg",
    principle: "Standard 50mm human perspective",
    axis: "50mm normal prime at eye level, strictly matching naked human visual perspective without magnification",
    lens: "50mm f/1.2 prime lens",
    dof: "f/5.6 clean true-to-life rendition",
    tags: ["optics", "lens", "50mm", "prime", "normal", "human perspective", "neutral"],
  },
  {
    id: "lens-portrait-85",
    name: "Portrait 85mm Prime f/1.4",
    subtitle: "29° Field of View · Creamy Bokeh Blur",
    category: "lenses",
    badge: "85mm f/1.4",
    image: "/camera/lens_05.jpg",
    principle: "Flattering 85mm telephoto compression",
    axis: "85mm portrait prime at 3m distance, compressing background with silky circular specular bokeh highlights",
    lens: "85mm f/1.4 portrait prime lens",
    dof: "f/1.4 wide-open aperture, razor focus on primary subject with creamy melted backdrop",
    tags: ["optics", "lens", "85mm", "portrait", "bokeh", "shallow dof", "compression"],
  },
  {
    id: "lens-telephoto-135",
    name: "Medium Telephoto 135mm",
    subtitle: "18° Field of View · Subject Isolation",
    category: "lenses",
    badge: "135mm f/5.6",
    image: "/camera/lens_06.jpg",
    principle: "135mm optical plane compression",
    axis: "135mm telephoto lens at 5m distance, drawing background elements close and completely isolating subject",
    lens: "135mm f/1.8 telephoto lens",
    dof: "f/5.6 intense plane flattening",
    tags: ["optics", "lens", "135mm", "telephoto", "isolation", "compression", "studio"],
  },
  {
    id: "lens-super-tele-200",
    name: "Super-Telephoto 200mm",
    subtitle: "12° Field of View · Extreme Flat Graphic",
    category: "lenses",
    badge: "200mm f/5.6",
    image: "/camera/lens_07.jpg",
    principle: "200mm super-telephoto graphic flattening",
    axis: "camera at 8m distance with 200mm telephoto, collapsing spatial depth into a graphic flat plane",
    lens: "200mm f/2.8 telephoto prime",
    dof: "f/5.6 graphic compressed focal plane",
    tags: ["optics", "lens", "200mm", "super-telephoto", "flattening", "graphic", "distance"],
  },
  {
    id: "lens-shallow-dof",
    name: "Ultra-Shallow Depth of Field f/1.2",
    subtitle: "Razor Thin Plane · Dreamy Meltdown",
    category: "lenses",
    badge: "f/1.2 DREAM",
    image: "/camera/lens_08.jpg",
    principle: "Dreamy ultra-shallow depth of field",
    axis: "85mm lens shot wide-open at f/1.2, paper-thin focus slice on primary focal point while foreground and background dissolve into smooth blur",
    lens: "85mm f/1.2 prime lens",
    dof: "f/1.2 ultra-shallow depth of field, creamy dreamy bokeh meltdown",
    tags: ["optics", "lens", "aperture", "f1.2", "shallow dof", "bokeh", "dreamy"],
  },
  {
    id: "lens-deep-field",
    name: "Deep Field Hyperfocal Focus f/16",
    subtitle: "Edge-to-Edge Sharpness · Infinite Plane",
    category: "lenses",
    badge: "f/16 SHARP",
    image: "/camera/lens_09.jpg",
    principle: "Deep field hyperfocal edge-to-edge sharpness",
    axis: "50mm prime stopped down to f/16, maintaining razor-sharp crystalline focus from closest foreground plane to distant background",
    lens: "50mm f/1.4 stopped down to f/16",
    dof: "f/16 deep depth of field, hyperfocal edge-to-edge crystalline sharpness",
    tags: ["optics", "lens", "aperture", "f16", "deep focus", "sharpness", "hyperfocal"],
  },
];

export function getCameraById(id: string): CameraItem | undefined {
  return CAMERA_LIBRARY.find((c) => c.id === id);
}

export function filterCameraOptions(options: {
  category?: CameraCategory;
  query?: string;
}): CameraItem[] {
  const { category = "all", query = "" } = options;
  const q = query.trim().toLowerCase();

  return CAMERA_LIBRARY.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.principle.toLowerCase().includes(q) ||
      item.axis.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

import { setAt, type PromptDoc } from "./model.ts";

export function applyCameraItem(doc: PromptDoc, item: CameraItem): PromptDoc {
  let next = setAt(doc, "scene_composition.framing_doctrine.named_principle", item.principle);
  next = setAt(next, "scene_composition.framing_doctrine.camera_elevation_and_axis", item.axis);
  next = setAt(next, "aesthetic_dna.optics.lens_type_and_focal_length", item.lens ?? "");
  next = setAt(next, "aesthetic_dna.optics.aperture_and_dof", item.dof ?? "");
  return next;
}

export function isCameraApplied(doc: PromptDoc, item: CameraItem): boolean {
  const framing = doc.scene_composition.framing_doctrine;
  if (!framing.named_principle && !framing.camera_elevation_and_axis) return false;
  return (
    framing.named_principle.trim().toLowerCase() === item.principle.trim().toLowerCase() ||
    framing.camera_elevation_and_axis.trim().toLowerCase() === item.axis.trim().toLowerCase()
  );
}
