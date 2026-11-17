import { useMemo, useState } from "react";
import {
  Sparkles,
  RotateCcw,
  Palette,
  Camera,
  SunMedium,
  Shirt,
  Users,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  MapPin,
} from "lucide-react";
import type { PromptDoc } from "@/lib/prompt/model";
import { STYLE_LIBRARY } from "@/lib/prompt/style-database";
import { CAST_MODELS } from "@/lib/prompt/cast-database";
import { WARDROBE_OUTFITS } from "@/lib/prompt/wardrobe-database";

export type LockedSlots = {
  palette: boolean;
  optics: boolean;
  lighting: boolean;
  exclusions: boolean;
};

export type ActiveSummaryItem = {
  id: string;
  category: "style" | "model" | "outfit" | "pose" | "lighting" | "camera" | "location";
  label: string;
  detail: string;
  color?: string;
  image?: string;
  onClear: () => void;
};

export function PromptSummaryPills({
  doc,
  slot,
  lockedSlots,
  onToggleLock,
  onClearStyle,
  onClearModel,
  onClearOutfit,
  onClearPose,
  onClearLighting,
  onClearCamera,
  onResetCanvas,
  onOpenAssetTab,
}: {
  doc: PromptDoc;
  slot: number;
  lockedSlots: LockedSlots;
  onToggleLock: (slotKey: keyof LockedSlots) => void;
  onClearStyle: () => void;
  onClearModel: () => void;
  onClearOutfit: () => void;
  onClearPose: () => void;
  onClearLighting: () => void;
  onClearCamera: () => void;
  onResetCanvas: () => void;
  onOpenAssetTab: (tab: "cast" | "wardrobe" | "poses" | "lighting" | "camera" | "styles") => void;
}) {
  const [showCanvasPreview, setShowCanvasPreview] = useState(false);

  const activeSubject = doc.subjects[slot] ?? doc.subjects[0];

  // Matched entities
  const matchedStyle = useMemo(() => {
    return STYLE_LIBRARY.find((s) => s.medium_format === doc.aesthetic_dna.medium_format);
  }, [doc.aesthetic_dna.medium_format]);

  const matchedModel = useMemo(() => {
    const desc = activeSubject?.casting_and_physique?.demographics_and_features || "";
    return CAST_MODELS.find((m) => m.casting.demographics_and_features === desc);
  }, [activeSubject?.casting_and_physique?.demographics_and_features]);

  const matchedOutfit = useMemo(() => {
    const outer = activeSubject?.wardrobe_architecture?.layering_system?.outerwear || "";
    if (!outer) return undefined;
    return WARDROBE_OUTFITS.find(
      (o) =>
        (o.slots.outerwear && o.slots.outerwear.some((piece) => outer.toLowerCase().includes(piece.toLowerCase().slice(0, 15)))) ||
        o.prompt.toLowerCase().includes(outer.toLowerCase().slice(0, 20)),
    );
  }, [activeSubject?.wardrobe_architecture?.layering_system?.outerwear]);

  // Active pills
  const pills = useMemo(() => {
    const list: ActiveSummaryItem[] = [];

    // 1. Style
    if (doc.aesthetic_dna.medium_format) {
      list.push({
        id: "style",
        category: "style",
        label: matchedStyle?.name || "Custom Medium",
        detail: matchedStyle?.badge || doc.aesthetic_dna.medium_format.slice(0, 28) + "...",
        image: matchedStyle?.image,
        onClear: onClearStyle,
      });
    }

    // 2. Cast Model
    if (activeSubject?.casting_and_physique?.demographics_and_features) {
      list.push({
        id: "model",
        category: "model",
        label: matchedModel?.name || activeSubject.subject_id.trim() || "Subject Model",
        detail: matchedModel?.badge || "Model Active",
        image: matchedModel?.image,
        onClear: onClearModel,
      });
    }

    // 3. Outfit / Wardrobe
    if (activeSubject?.wardrobe_architecture?.layering_system?.outerwear || activeSubject?.wardrobe_architecture?.layering_system?.base_layer) {
      list.push({
        id: "outfit",
        category: "outfit",
        label: matchedOutfit?.name || "Custom Wardrobe",
        detail: matchedOutfit?.style_tags[0] ? `#${matchedOutfit.style_tags[0]}` : "Active",
        image: matchedOutfit?.image,
        onClear: onClearOutfit,
      });
    }

    // 4. Pose
    if (activeSubject?.kinetic_posture) {
      list.push({
        id: "pose",
        category: "pose",
        label: "Posture",
        detail: activeSubject.kinetic_posture.slice(0, 30) + (activeSubject.kinetic_posture.length > 30 ? "..." : ""),
        onClear: onClearPose,
      });
    }

    // 5. Lighting
    if (doc.aesthetic_dna.lighting_architecture.lighting_style) {
      list.push({
        id: "lighting",
        category: "lighting",
        label: "Lighting",
        detail: doc.aesthetic_dna.lighting_architecture.lighting_style.slice(0, 26) + "...",
        onClear: onClearLighting,
      });
    }

    // 6. Camera
    if (doc.scene_composition.framing_doctrine.named_principle || doc.scene_composition.framing_doctrine.camera_elevation_and_axis) {
      list.push({
        id: "camera",
        category: "camera",
        label: "Camera",
        detail: (doc.scene_composition.framing_doctrine.named_principle || doc.scene_composition.framing_doctrine.camera_elevation_and_axis).slice(0, 26) + "...",
        onClear: onClearCamera,
      });
    }

    return list;
  }, [
    doc.aesthetic_dna.medium_format,
    doc.aesthetic_dna.lighting_architecture.lighting_style,
    doc.scene_composition.framing_doctrine,
    activeSubject,
    matchedStyle,
    matchedModel,
    matchedOutfit,
    onClearStyle,
    onClearModel,
    onClearOutfit,
    onClearPose,
    onClearLighting,
    onClearCamera,
  ]);

  const palette = doc.aesthetic_dna.color_science.dominant_palette;

  return (
    <div className="border-b border-border bg-raised/40">
      {/* Top summary row: active pills + locks + reset button */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-faint mr-1 hidden sm:inline">
            Active:
          </span>

          {pills.length === 0 ? (
            <span className="text-xs text-muted italic">
              Canvas empty. Click an asset on the right (Cast, Wardrobe, Pose, Light, Camera, Style) or parse a prompt.
            </span>
          ) : (
            pills.map((pill) => {
              const borderStyles =
                pill.category === "style"
                  ? "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300"
                  : pill.category === "model"
                    ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                    : pill.category === "outfit"
                      ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                      : pill.category === "pose"
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                        : pill.category === "lighting"
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";

              return (
                <div
                  key={pill.id}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-xs ${borderStyles}`}
                >
                  {pill.image && (
                    <img
                      src={pill.image}
                      alt=""
                      className="size-4 rounded-full object-cover border border-white/20"
                    />
                  )}
                  <span className="font-bold">{pill.label}:</span>
                  <span className="font-normal opacity-90 max-w-[140px] truncate">{pill.detail}</span>
                  <button
                    type="button"
                    onClick={pill.onClear}
                    title={`Remove ${pill.label}`}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-black/30 hover:text-white transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Right side: Slot Locks + Preview Card toggle + Reset Bar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Slot Locks */}
          <div className="hidden md:flex items-center gap-1 border-r border-border/80 pr-2">
            <span className="text-[10px] font-semibold text-faint uppercase tracking-wider mr-1">
              Locks:
            </span>
            <button
              type="button"
              onClick={() => onToggleLock("palette")}
              title={lockedSlots.palette ? "Palette Locked (won't be overwritten by Style Guides)" : "Palette Unlocked"}
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold transition-all border ${
                lockedSlots.palette
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-surface text-muted border-border hover:text-foreground"
              }`}
            >
              {lockedSlots.palette ? <Lock className="size-2.5" /> : <Unlock className="size-2.5" />}
              <span>Colors</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleLock("optics")}
              title={lockedSlots.optics ? "Optics Locked" : "Optics Unlocked"}
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold transition-all border ${
                lockedSlots.optics
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-surface text-muted border-border hover:text-foreground"
              }`}
            >
              {lockedSlots.optics ? <Lock className="size-2.5" /> : <Unlock className="size-2.5" />}
              <span>Optics</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleLock("lighting")}
              title={lockedSlots.lighting ? "Lighting Locked" : "Lighting Unlocked"}
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold transition-all border ${
                lockedSlots.lighting
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-surface text-muted border-border hover:text-foreground"
              }`}
            >
              {lockedSlots.lighting ? <Lock className="size-2.5" /> : <Unlock className="size-2.5" />}
              <span>Light</span>
            </button>
          </div>

          {/* Toggle Interactive Canvas Preview */}
          <button
            type="button"
            onClick={() => setShowCanvasPreview(!showCanvasPreview)}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
              showCanvasPreview
                ? "bg-primary text-primary-fg border-primary shadow-xs"
                : "border-border bg-surface text-muted hover:text-foreground"
            }`}
            title="Toggle Live Visual Canvas Preview"
          >
            <Sparkles className="size-3" />
            <span className="hidden sm:inline">Preview Card</span>
            {showCanvasPreview ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>

          {/* Reset All */}
          {pills.length > 0 && (
            <button
              type="button"
              onClick={onResetCanvas}
              title="Reset all active visual assets on canvas"
              className="flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Visual Canvas Preview Dropdown */}
      {showCanvasPreview && (
        <div className="border-t border-border/80 bg-neutral-950/80 p-4 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Visual Hero Left */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-md">
              {matchedStyle?.image || matchedModel?.image || matchedOutfit?.image ? (
                <img
                  src={matchedStyle?.image || matchedModel?.image || matchedOutfit?.image}
                  alt="Visual Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-600 font-mono text-xs">
                  Aesthetic Preview Canvas
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <span className="rounded bg-primary/90 px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                    {matchedStyle?.badge || "Active Composition"}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1 drop-shadow">
                    {matchedStyle?.name || doc.subjects[slot]?.subject_id || "Custom Concept"}
                  </h3>
                </div>
                {/* Palette */}
                {palette && palette.length > 0 && (
                  <div className="flex items-center gap-1 rounded-full bg-black/80 px-2 py-1 backdrop-blur-sm border border-white/10">
                    {palette.map((hex) => (
                      <span key={hex} title={hex} className="size-3 rounded-full border border-white/25" style={{ backgroundColor: hex }} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Spec Breakdown Center */}
            <div className="space-y-2 text-xs">
              <div className="rounded-lg bg-surface/70 p-2.5 border border-border">
                <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider block">
                  Aesthetic DNA &amp; Format
                </span>
                <p className="mt-0.5 text-foreground leading-snug font-medium line-clamp-2">
                  {doc.aesthetic_dna.medium_format || "Not specified"}
                </p>
                <p className="mt-1 text-[11px] text-muted line-clamp-1">
                  {doc.aesthetic_dna.color_science.tonal_behavior || "Standard tonal mapping"}
                </p>
              </div>

              <div className="rounded-lg bg-surface/70 p-2.5 border border-border">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Optics &amp; Lighting Architecture
                </span>
                <p className="mt-0.5 text-foreground leading-snug line-clamp-1">
                  <span className="font-semibold text-neutral-300">Lens:</span>{" "}
                  {doc.aesthetic_dna.optics.lens_type_and_focal_length || "50mm normal"} ·{" "}
                  {doc.aesthetic_dna.optics.aperture_and_dof || "f/2.8"}
                </p>
                <p className="mt-1 text-[11px] text-foreground leading-snug line-clamp-1">
                  <span className="font-semibold text-neutral-300">Light:</span>{" "}
                  {doc.aesthetic_dna.lighting_architecture.lighting_style || "Natural ambient"}
                </p>
              </div>
            </div>

            {/* Subject Breakdown Right */}
            <div className="space-y-2 text-xs">
              <div className="rounded-lg bg-surface/70 p-2.5 border border-border">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                  Subject Staging ({activeSubject?.subject_id.trim() || `Subject ${slot + 1}`})
                </span>
                <p className="mt-0.5 text-foreground leading-snug line-clamp-2">
                  <span className="font-semibold text-neutral-300">Kinetic Pose:</span>{" "}
                  {activeSubject?.kinetic_posture || "Neutral standing"}
                </p>
                <p className="mt-1 text-[11px] text-muted line-clamp-1">
                  <span className="font-semibold text-neutral-300">Wardrobe:</span>{" "}
                  {activeSubject?.wardrobe_architecture?.layering_system?.outerwear ||
                    activeSubject?.wardrobe_architecture?.layering_system?.base_layer ||
                    "Custom pieces"}
                </p>
              </div>

              {doc.anti_cliche_exclusions && doc.anti_cliche_exclusions.length > 0 && (
                <div className="rounded-lg bg-surface/70 p-2 border border-border">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">
                    Exclusions
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {doc.anti_cliche_exclusions.slice(0, 4).map((ex) => (
                      <span key={ex} className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-[9px] text-neutral-400">
                        no {ex}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
