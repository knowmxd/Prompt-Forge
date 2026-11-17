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
  Copy,
  Check,
  Code2,
  SlidersHorizontal,
  ExternalLink,
  Plus,
  RefreshCw,
  Undo2,
  Dices,
  FileText,
} from "lucide-react";
import type { PromptDoc, ClusterId } from "@/lib/prompt/model";
import { STYLE_LIBRARY } from "@/lib/prompt/style-database";
import { CAST_MODELS } from "@/lib/prompt/cast-database";
import { WARDROBE_OUTFITS } from "@/lib/prompt/wardrobe-database";
import { POSE_LIBRARY } from "@/lib/prompt/pose-database";
import { LIGHTING_LIBRARY } from "@/lib/prompt/lighting-database";
import { CAMERA_LIBRARY } from "@/lib/prompt/camera-database";
import type { LockedSlots } from "./prompt-summary-pills";

type AssetTabKey = "cast" | "wardrobe" | "poses" | "lighting" | "camera" | "styles";

export type VisualBoardProps = {
  doc: PromptDoc;
  slot: number;
  lockedSlots: LockedSlots;
  activeAssetTab: string;
  canUndo: boolean;
  sourceDrawerOpen: boolean;
  onToggleSourceDrawer: () => void;
  onSelectSubject: (index: number) => void;
  onAddSubject: () => void;
  onRemoveSubject: () => void;
  onUndo: () => void;
  onRemixUnlocked: () => void;
  onToggleLock: (slotKey: keyof LockedSlots) => void;
  onClearStyle: () => void;
  onClearModel: () => void;
  onClearOutfit: () => void;
  onClearPose: () => void;
  onClearLighting: () => void;
  onClearCamera: () => void;
  onResetCanvas: () => void;
  onOpenAssetTab: (tab: AssetTabKey) => void;
  onDrillDownToCluster: (clusterId: ClusterId) => void;
  onSwitchToSegmented: () => void;
  onCopyPrompt: (format: "line" | "json") => void;
  copiedFormat: "line" | "json" | null;
};

export function VisualBoardStudio({
  doc,
  slot,
  lockedSlots,
  activeAssetTab,
  canUndo,
  sourceDrawerOpen,
  onToggleSourceDrawer,
  onSelectSubject,
  onAddSubject,
  onRemoveSubject,
  onUndo,
  onRemixUnlocked,
  onToggleLock,
  onClearStyle,
  onClearModel,
  onClearOutfit,
  onClearPose,
  onClearLighting,
  onClearCamera,
  onResetCanvas,
  onOpenAssetTab,
  onDrillDownToCluster,
  onSwitchToSegmented,
  onCopyPrompt,
  copiedFormat,
}: VisualBoardProps) {
  const [jsonDrawerOpen, setJsonDrawerOpen] = useState(false);
  const [copyFormat, setCopyFormat] = useState<"line" | "json">("line");
  const activeSubject = doc.subjects[slot] ?? doc.subjects[0];

  // Matched Visual Entities
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

  const matchedPose = useMemo(() => {
    const post = activeSubject?.kinetic_posture || "";
    if (!post) return undefined;
    return POSE_LIBRARY.find((p) => post.toLowerCase().includes(p.name.toLowerCase()) || post.toLowerCase().includes(p.posture.toLowerCase().slice(0, 20)));
  }, [activeSubject?.kinetic_posture]);

  const matchedLighting = useMemo(() => {
    const style = doc.aesthetic_dna.lighting_architecture.lighting_style || "";
    if (!style) return undefined;
    return LIGHTING_LIBRARY.find((l) => style.toLowerCase().includes(l.name.toLowerCase()) || style.toLowerCase().includes(l.style.toLowerCase().slice(0, 20)));
  }, [doc.aesthetic_dna.lighting_architecture.lighting_style]);

  const matchedCamera = useMemo(() => {
    const shot = doc.scene_composition.framing_doctrine.named_principle || doc.scene_composition.framing_doctrine.camera_elevation_and_axis || "";
    if (!shot) return undefined;
    return CAMERA_LIBRARY.find((c) => shot.toLowerCase().includes(c.name.toLowerCase()) || shot.toLowerCase().includes(c.principle.toLowerCase().slice(0, 20)));
  }, [doc.scene_composition.framing_doctrine.named_principle, doc.scene_composition.framing_doctrine.camera_elevation_and_axis]);

  // Mix-and-match wardrobe pieces
  const wardrobeLayers = useMemo(() => {
    const wa = activeSubject?.wardrobe_architecture;
    if (!wa) return [];
    const layers: Array<{ label: string; value: string }> = [];
    if (wa.layering_system?.base_layer) layers.push({ label: "Base", value: wa.layering_system.base_layer });
    if (wa.layering_system?.mid_layer) layers.push({ label: "Mid", value: wa.layering_system.mid_layer });
    if (wa.layering_system?.outerwear) layers.push({ label: "Outer", value: wa.layering_system.outerwear });
    if (wa.footwear) layers.push({ label: "Shoes", value: wa.footwear });
    if (wa.accessories && wa.accessories.length > 0) {
      layers.push({ label: "Acc", value: wa.accessories.join(", ") });
    }
    return layers;
  }, [activeSubject?.wardrobe_architecture]);

  const palette = doc.aesthetic_dna.color_science.dominant_palette;
  const activeCount = [
    Boolean(doc.aesthetic_dna.medium_format),
    Boolean(matchedModel || activeSubject?.casting_and_physique?.demographics_and_features),
    Boolean(matchedOutfit || wardrobeLayers.length > 0),
    Boolean(activeSubject?.kinetic_posture),
    Boolean(doc.aesthetic_dna.lighting_architecture.lighting_style),
    Boolean(doc.scene_composition.framing_doctrine.named_principle || doc.scene_composition.framing_doctrine.camera_elevation_and_axis),
  ].filter(Boolean).length;

  return (
    <div className="flex flex-1 flex-col min-h-0 bg-neutral-950/60 overflow-hidden">
      {/* Board Studio Header Banner */}
      <div className="flex flex-wrap shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-surface/50 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
            <Sparkles className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground truncate">Interactive Moodboard</h2>
              <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.2 text-[10px] font-semibold text-primary shrink-0">
                {activeCount} / 6 Pins
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-muted truncate">
              Click any library item to pin it here. Prompts synthesize automatically in the background.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleSourceDrawer}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              sourceDrawerOpen
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-surface text-muted hover:text-foreground hover:border-primary/40"
            }`}
            title="Toggle Raw Prompt Paste / Import Drawer"
          >
            <FileText className="size-3.5" />
            <span className="hidden md:inline">{sourceDrawerOpen ? "Hide Source" : "Paste / Import"}</span>
          </button>

          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-foreground disabled:opacity-35 disabled:pointer-events-none transition-all"
            title="Undo last change (Ctrl+Z)"
          >
            <Undo2 className="size-3.5" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button
            type="button"
            onClick={onRemixUnlocked}
            className="flex items-center gap-1.5 rounded-lg border border-fuchsia-500/40 bg-fuchsia-500/10 px-2.5 py-1.5 text-xs font-semibold text-fuchsia-300 hover:bg-fuchsia-500/20 transition-all"
            title="Randomize unlocked slots while keeping locked Colors, Optics, or Lighting"
          >
            <Dices className="size-3.5" />
            <span>Remix</span>
          </button>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={onResetCanvas}
              className="flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all"
              title="Clear all pins"
            >
              <RotateCcw className="size-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSwitchToSegmented}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground hover:border-primary/50 hover:bg-raised transition-all"
            title="Drill down into individual prompt fields"
          >
            <SlidersHorizontal className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Cluster Pages</span>
          </button>
        </div>
      </div>

      {/* Subject Switcher Strip */}
      <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-border/50 bg-neutral-950/40 px-4 py-1.5 no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted mr-1 shrink-0">
          Active Subject:
        </span>
        {doc.subjects.map((subject, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectSubject(index)}
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all ${
              index === slot
                ? "bg-primary text-primary-fg shadow-xs"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            {subject.subject_id.trim() || `Subject ${index + 1}`}
          </button>
        ))}
        <button
          type="button"
          onClick={onAddSubject}
          className="flex shrink-0 items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] font-medium text-muted hover:border-primary/50 hover:text-foreground transition-all"
        >
          <Plus className="size-3" />
          <span>Add Subject</span>
        </button>
        {doc.subjects.length > 1 && (
          <button
            type="button"
            onClick={onRemoveSubject}
            className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            Remove
          </button>
        )}
      </div>

      {/* Main Moodboard Pin Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {/* Hero Visual Preview Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl">
          <div className="absolute inset-0 z-0">
            {matchedStyle?.image || matchedModel?.image || matchedOutfit?.image ? (
              <img
                src={matchedStyle?.image || matchedModel?.image || matchedOutfit?.image}
                alt="Aesthetic Backdrop"
                className="h-full w-full object-cover opacity-25 filter blur-sm scale-105"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-neutral-900 to-neutral-950" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
          </div>

          <div className="relative z-10 p-5 md:p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-md bg-primary/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                  {matchedStyle?.badge || "Aesthetic Synthesis"}
                </span>
                {palette && palette.length > 0 && (
                  <div className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md border border-white/10">
                    <span className="text-[10px] text-neutral-400 font-mono mr-1">Palette:</span>
                    {palette.map((hex: string) => (
                      <span
                        key={hex}
                        title={hex}
                        className="size-3.5 rounded-full border border-white/30 shadow-xs"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                {matchedStyle?.name || doc.subjects[slot]?.subject_id || "Untitled Aesthetic Canvas"}
              </h1>
              <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                {doc.aesthetic_dna.medium_format || "Select style guides, models, and lighting setups to construct your scene visually."}
              </p>
            </div>

            {/* Quick Lock Toggles */}
            <div className="flex items-center gap-1.5 rounded-xl bg-black/70 p-1.5 backdrop-blur-md border border-neutral-800 self-start md:self-auto">
              <span className="px-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Locks:
              </span>
              <button
                type="button"
                onClick={() => onToggleLock("palette")}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-all ${
                  lockedSlots.palette
                    ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/50"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="Lock Color Palette & Tonal Science"
              >
                {lockedSlots.palette ? <Lock className="size-3" /> : <Unlock className="size-3" />}
                <span>Colors</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleLock("optics")}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-all ${
                  lockedSlots.optics
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="Lock Camera Lens, Shutter & Sensor Optics"
              >
                {lockedSlots.optics ? <Lock className="size-3" /> : <Unlock className="size-3" />}
                <span>Optics</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleLock("lighting")}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-all ${
                  lockedSlots.lighting
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                    : "text-neutral-400 hover:text-white"
                }`}
                title="Lock Key, Fill & Rim Lighting Setup"
              >
                {lockedSlots.lighting ? <Lock className="size-3" /> : <Unlock className="size-3" />}
                <span>Light</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pin Slots Grid: Style, Cast, Wardrobe, Pose, Lighting, Camera */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {/* 1. Style & Medium Pin */}
          <div
            className={`group relative flex flex-col rounded-xl border bg-surface/80 p-3 shadow-xs transition-all overflow-hidden ${
              activeAssetTab === "styles"
                ? "border-fuchsia-400/70 ring-1 ring-fuchsia-400/25"
                : "border-border/70 hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-fuchsia-400">
                <Palette className="size-3.5" />
                <span>STYLE &amp; MEDIUM</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => onOpenAssetTab("styles")}
                  className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-muted hover:text-fuchsia-300 rounded-md hover:bg-neutral-800 transition-colors"
                  title="Browse & Swap Style"
                >
                  <RefreshCw className="size-2.5" />
                  <span>Swap</span>
                </button>
                {doc.aesthetic_dna.medium_format && (
                  <button
                    type="button"
                    onClick={onClearStyle}
                    className="p-1 text-muted hover:text-red-400 rounded-md hover:bg-neutral-800"
                    title="Remove Style"
                  >
                    <X className="size-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDrillDownToCluster("medium")}
                  className="p-1 text-muted hover:text-primary rounded-md hover:bg-neutral-800"
                  title="Edit in Cluster Pages"
                >
                  <ExternalLink className="size-3" />
                </button>
              </div>
            </div>

            <div className="mt-2.5 flex-1 min-h-[110px]">
              {matchedStyle ? (
                <div className="flex gap-3">
                  {matchedStyle.image && (
                    <img
                      src={matchedStyle.image}
                      alt={matchedStyle.name}
                      className="size-20 rounded-lg object-cover border border-neutral-700 shadow-xs shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-primary uppercase">{matchedStyle.badge}</span>
                    <h3 className="font-bold text-foreground text-sm truncate">{matchedStyle.name}</h3>
                    <p className="text-[11px] text-muted line-clamp-2 mt-0.5 leading-tight">
                      {matchedStyle.subtitle}
                    </p>
                  </div>
                </div>
              ) : doc.aesthetic_dna.medium_format ? (
                <div>
                  <h3 className="font-bold text-foreground text-sm">Custom Medium</h3>
                  <p className="text-[11px] text-muted line-clamp-3 mt-1">
                    {doc.aesthetic_dna.medium_format}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAssetTab("styles")}
                  className="w-full h-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/5 p-4 text-center transition-all group/btn"
                >
                  <Plus className="size-5 text-muted group-hover/btn:text-fuchsia-400 transition-colors" />
                  <span className="text-xs font-semibold text-muted group-hover/btn:text-foreground mt-1">
                    Pin a Style Guide
                  </span>
                  <span className="text-[10px] text-faint">Notion aesthetic DNA</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. Cast & Subject Model Pin */}
          <div
            className={`group relative flex flex-col rounded-xl border bg-surface/80 p-3 shadow-xs transition-all overflow-hidden ${
              activeAssetTab === "cast"
                ? "border-indigo-400/70 ring-1 ring-indigo-400/25"
                : "border-border/70 hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                <Users className="size-3.5" />
                <span>CAST MODEL</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => onOpenAssetTab("cast")}
                  className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-muted hover:text-indigo-300 rounded-md hover:bg-neutral-800 transition-colors"
                  title="Browse & Swap Cast Model"
                >
                  <RefreshCw className="size-2.5" />
                  <span>Swap</span>
                </button>
                {activeSubject?.casting_and_physique?.demographics_and_features && (
                  <button
                    type="button"
                    onClick={onClearModel}
                    className="p-1 text-muted hover:text-red-400 rounded-md hover:bg-neutral-800"
                    title="Remove Model"
                  >
                    <X className="size-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDrillDownToCluster("casting")}
                  className="p-1 text-muted hover:text-primary rounded-md hover:bg-neutral-800"
                  title="Edit in Cluster Pages"
                >
                  <ExternalLink className="size-3" />
                </button>
              </div>
            </div>

            <div className="mt-2.5 flex-1 min-h-[110px]">
              {matchedModel ? (
                <div className="flex gap-3">
                  {matchedModel.image && (
                    <img
                      src={matchedModel.image}
                      alt={matchedModel.name}
                      className="size-20 rounded-lg object-cover border border-neutral-700 shadow-xs shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">{matchedModel.category}</span>
                    <h3 className="font-bold text-foreground text-sm truncate">{matchedModel.name}</h3>
                    <p className="text-[11px] text-muted line-clamp-2 mt-0.5 leading-tight">
                      {matchedModel.casting.demographics_and_features}
                    </p>
                  </div>
                </div>
              ) : activeSubject?.casting_and_physique?.demographics_and_features ? (
                <div>
                  <h3 className="font-bold text-foreground text-sm">Custom Subject</h3>
                  <p className="text-[11px] text-muted line-clamp-3 mt-1">
                    {activeSubject.casting_and_physique.demographics_and_features}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAssetTab("cast")}
                  className="w-full h-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 hover:border-indigo-400/50 hover:bg-indigo-500/5 p-4 text-center transition-all group/btn"
                >
                  <Plus className="size-5 text-muted group-hover/btn:text-indigo-400 transition-colors" />
                  <span className="text-xs font-semibold text-muted group-hover/btn:text-foreground mt-1">
                    Pin a Cast Model
                  </span>
                  <span className="text-[10px] text-faint">Consistent turnarounds</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. Wardrobe Architecture Pin */}
          <div
            className={`group relative flex flex-col rounded-xl border bg-surface/80 p-3 shadow-xs transition-all overflow-hidden ${
              activeAssetTab === "wardrobe"
                ? "border-amber-400/70 ring-1 ring-amber-400/25"
                : "border-border/70 hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Shirt className="size-3.5" />
                <span>WARDROBE LOOK</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => onOpenAssetTab("wardrobe")}
                  className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-muted hover:text-amber-300 rounded-md hover:bg-neutral-800 transition-colors"
                  title="Browse & Swap Wardrobe"
                >
                  <RefreshCw className="size-2.5" />
                  <span>Swap</span>
                </button>
                {(matchedOutfit || wardrobeLayers.length > 0) && (
                  <button
                    type="button"
                    onClick={onClearOutfit}
                    className="p-1 text-muted hover:text-red-400 rounded-md hover:bg-neutral-800"
                    title="Remove Outfit"
                  >
                    <X className="size-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDrillDownToCluster("wardrobe")}
                  className="p-1 text-muted hover:text-primary rounded-md hover:bg-neutral-800"
                  title="Edit in Cluster Pages"
                >
                  <ExternalLink className="size-3" />
                </button>
              </div>
            </div>

            <div className="mt-2.5 flex-1 min-h-[110px]">
              {matchedOutfit ? (
                <div className="flex gap-3">
                  {matchedOutfit.image && (
                    <img
                      src={matchedOutfit.image}
                      alt={matchedOutfit.name}
                      className="size-20 rounded-lg object-cover border border-neutral-700 shadow-xs shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">
                      {matchedOutfit.style_tags[0] || "OUTFIT"}
                    </span>
                    <h3 className="font-bold text-foreground text-sm truncate">{matchedOutfit.name}</h3>
                    <p className="text-[11px] text-muted line-clamp-2 mt-0.5 leading-tight">
                      {matchedOutfit.prompt}
                    </p>
                  </div>
                </div>
              ) : wardrobeLayers.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Mix &amp; Match Layers</span>
                    <span className="text-[10px] text-muted">{wardrobeLayers.length} slots</span>
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                    {wardrobeLayers.map((layer) => (
                      <div key={layer.label} className="flex items-start gap-1.5 text-[11px]">
                        <span className="shrink-0 rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 uppercase">
                          {layer.label}
                        </span>
                        <span className="text-muted line-clamp-1 leading-tight">{layer.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAssetTab("wardrobe")}
                  className="w-full h-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 hover:border-amber-400/50 hover:bg-amber-500/5 p-4 text-center transition-all group/btn"
                >
                  <Plus className="size-5 text-muted group-hover/btn:text-amber-400 transition-colors" />
                  <span className="text-xs font-semibold text-muted group-hover/btn:text-foreground mt-1">
                    Pin an Outfit
                  </span>
                  <span className="text-[10px] text-faint">Layering &amp; styling</span>
                </button>
              )}
            </div>
          </div>

          {/* 4. Kinetic Pose & Posture Pin */}
          <div
            className={`group relative flex flex-col rounded-xl border bg-surface/80 p-3 shadow-xs transition-all overflow-hidden ${
              activeAssetTab === "poses"
                ? "border-cyan-400/70 ring-1 ring-cyan-400/25"
                : "border-border/70 hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Layers className="size-3.5" />
                <span>KINETIC POSE</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => onOpenAssetTab("poses")}
                  className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-muted hover:text-cyan-300 rounded-md hover:bg-neutral-800 transition-colors"
                  title="Browse & Swap Pose"
                >
                  <RefreshCw className="size-2.5" />
                  <span>Swap</span>
                </button>
                {activeSubject?.kinetic_posture && (
                  <button
                    type="button"
                    onClick={onClearPose}
                    className="p-1 text-muted hover:text-red-400 rounded-md hover:bg-neutral-800"
                    title="Remove Pose"
                  >
                    <X className="size-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDrillDownToCluster("posture")}
                  className="p-1 text-muted hover:text-primary rounded-md hover:bg-neutral-800"
                  title="Edit in Cluster Pages"
                >
                  <ExternalLink className="size-3" />
                </button>
              </div>
            </div>

            <div className="mt-2.5 flex-1 min-h-[110px]">
              {activeSubject?.pose_reference ? (
                <div className="flex gap-3">
                  <img
                    src={activeSubject.pose_reference.image_url}
                    alt={activeSubject.pose_reference.sub_category || activeSubject.pose_reference.reference_id}
                    className="size-20 rounded-lg object-cover object-top bg-neutral-950 border border-neutral-700 shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">
                        {activeSubject.pose_reference.category}
                      </span>
                      <span className="rounded bg-neutral-800 px-1 py-0.2 text-[9px] font-medium text-neutral-300">
                        {activeSubject.pose_reference.framing}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground text-xs truncate mt-0.5 capitalize">
                      {activeSubject.pose_reference.sub_category}
                    </h3>
                    <p className="text-[10px] text-muted truncate mt-0.5 font-mono">
                      {activeSubject.pose_reference.reference_id}
                    </p>
                  </div>
                </div>
              ) : matchedPose ? (
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">{matchedPose.category}</span>
                  <h3 className="font-bold text-foreground text-sm truncate">{matchedPose.name}</h3>
                  <p className="text-[11px] text-muted line-clamp-3 mt-1 leading-snug">
                    {matchedPose.posture}
                  </p>
                </div>
              ) : activeSubject?.kinetic_posture ? (
                <div>
                  <h3 className="font-bold text-foreground text-sm">Custom Posture</h3>
                  <p className="text-[11px] text-muted line-clamp-3 mt-1">
                    {activeSubject.kinetic_posture}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAssetTab("poses")}
                  className="w-full h-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 hover:border-cyan-400/50 hover:bg-cyan-500/5 p-4 text-center transition-all group/btn"
                >
                  <Plus className="size-5 text-muted group-hover/btn:text-cyan-400 transition-colors" />
                  <span className="text-xs font-semibold text-muted group-hover/btn:text-foreground mt-1">
                    Pin a Pose Setup
                  </span>
                  <span className="text-[10px] text-faint">Weight &amp; line of action</span>
                </button>
              )}
            </div>
          </div>

          {/* 5. Lighting Architecture Pin */}
          <div
            className={`group relative flex flex-col rounded-xl border bg-surface/80 p-3 shadow-xs transition-all overflow-hidden ${
              activeAssetTab === "lighting"
                ? "border-amber-400/70 ring-1 ring-amber-400/25"
                : "border-border/70 hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <SunMedium className="size-3.5" />
                <span>LIGHTING SETUP</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => onOpenAssetTab("lighting")}
                  className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-muted hover:text-amber-300 rounded-md hover:bg-neutral-800 transition-colors"
                  title="Browse & Swap Lighting"
                >
                  <RefreshCw className="size-2.5" />
                  <span>Swap</span>
                </button>
                {doc.aesthetic_dna.lighting_architecture.lighting_style && (
                  <button
                    type="button"
                    onClick={onClearLighting}
                    className="p-1 text-muted hover:text-red-400 rounded-md hover:bg-neutral-800"
                    title="Remove Lighting"
                  >
                    <X className="size-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDrillDownToCluster("key")}
                  className="p-1 text-muted hover:text-primary rounded-md hover:bg-neutral-800"
                  title="Edit in Cluster Pages"
                >
                  <ExternalLink className="size-3" />
                </button>
              </div>
            </div>

            <div className="mt-2.5 flex-1 min-h-[110px]">
              {matchedLighting ? (
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase">{matchedLighting.category}</span>
                  <h3 className="font-bold text-foreground text-sm truncate">{matchedLighting.name}</h3>
                  <p className="text-[11px] text-muted line-clamp-3 mt-1 leading-snug">
                    {matchedLighting.style}
                  </p>
                </div>
              ) : doc.aesthetic_dna.lighting_architecture.lighting_style ? (
                <div>
                  <h3 className="font-bold text-foreground text-sm">Custom Light</h3>
                  <p className="text-[11px] text-muted line-clamp-3 mt-1">
                    {doc.aesthetic_dna.lighting_architecture.lighting_style}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAssetTab("lighting")}
                  className="w-full h-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 hover:border-amber-400/50 hover:bg-amber-500/5 p-4 text-center transition-all group/btn"
                >
                  <Plus className="size-5 text-muted group-hover/btn:text-amber-400 transition-colors" />
                  <span className="text-xs font-semibold text-muted group-hover/btn:text-foreground mt-1">
                    Pin Lighting Architecture
                  </span>
                  <span className="text-[10px] text-faint">Key, fill &amp; rim dynamics</span>
                </button>
              )}
            </div>
          </div>

          {/* 6. Camera & Optics Pin */}
          <div
            className={`group relative flex flex-col rounded-xl border bg-surface/80 p-3 shadow-xs transition-all overflow-hidden ${
              activeAssetTab === "camera"
                ? "border-emerald-400/70 ring-1 ring-emerald-400/25"
                : "border-border/70 hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Camera className="size-3.5" />
                <span>CAMERA &amp; OPTICS</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => onOpenAssetTab("camera")}
                  className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-muted hover:text-emerald-300 rounded-md hover:bg-neutral-800 transition-colors"
                  title="Browse & Swap Camera"
                >
                  <RefreshCw className="size-2.5" />
                  <span>Swap</span>
                </button>
                {(doc.scene_composition.framing_doctrine.named_principle || doc.scene_composition.framing_doctrine.camera_elevation_and_axis) && (
                  <button
                    type="button"
                    onClick={onClearCamera}
                    className="p-1 text-muted hover:text-red-400 rounded-md hover:bg-neutral-800"
                    title="Remove Camera"
                  >
                    <X className="size-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDrillDownToCluster("framing")}
                  className="p-1 text-muted hover:text-primary rounded-md hover:bg-neutral-800"
                  title="Edit in Cluster Pages"
                >
                  <ExternalLink className="size-3" />
                </button>
              </div>
            </div>

            <div className="mt-2.5 flex-1 min-h-[110px]">
              {matchedCamera ? (
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">{matchedCamera.category}</span>
                  <h3 className="font-bold text-foreground text-sm truncate">{matchedCamera.name}</h3>
                  <p className="text-[11px] text-muted line-clamp-3 mt-1 leading-snug">
                    {matchedCamera.principle}
                  </p>
                </div>
              ) : doc.scene_composition.framing_doctrine.named_principle || doc.scene_composition.framing_doctrine.camera_elevation_and_axis ? (
                <div>
                  <h3 className="font-bold text-foreground text-sm">Custom Camera</h3>
                  <p className="text-[11px] text-muted line-clamp-3 mt-1">
                    {doc.scene_composition.framing_doctrine.named_principle ||
                      doc.scene_composition.framing_doctrine.camera_elevation_and_axis}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAssetTab("camera")}
                  className="w-full h-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 hover:border-emerald-400/50 hover:bg-emerald-500/5 p-4 text-center transition-all group/btn"
                >
                  <Plus className="size-5 text-muted group-hover/btn:text-emerald-400 transition-colors" />
                  <span className="text-xs font-semibold text-muted group-hover/btn:text-foreground mt-1">
                    Pin Camera Angle &amp; Lens
                  </span>
                  <span className="text-[10px] text-faint">Focal length &amp; depth</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Studio Footer Bar */}
      <div className="shrink-0 border-t border-border bg-neutral-950/95 px-4 py-3 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Copy Format Toggle + Primary Copy Button */}
            <div className="flex items-center rounded-xl border border-border bg-surface p-0.5">
              <button
                type="button"
                onClick={() => setCopyFormat("line")}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                  copyFormat === "line" ? "bg-neutral-800 text-white" : "text-muted hover:text-foreground"
                }`}
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => setCopyFormat("json")}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                  copyFormat === "json" ? "bg-neutral-800 text-white" : "text-muted hover:text-foreground"
                }`}
              >
                JSON
              </button>
            </div>

            <button
              type="button"
              onClick={() => onCopyPrompt(copyFormat)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-bold text-white shadow-lg transition-all ${
                copiedFormat === copyFormat
                  ? "bg-emerald-600 scale-[1.02]"
                  : "bg-primary hover:bg-primary/90 hover:shadow-primary/25"
              }`}
            >
              {copiedFormat === copyFormat ? <Check className="size-4" /> : <Copy className="size-4" />}
              <span>
                {copiedFormat === copyFormat
                  ? `${copyFormat === "json" ? "JSON" : "Prompt"} Copied!`
                  : `Copy ${copyFormat === "json" ? "JSON" : "Prompt"}`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setJsonDrawerOpen(!jsonDrawerOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted hover:text-foreground hover:border-border/80 transition-all"
              title="Peek under the hood at the synthesized JSON"
            >
              <Code2 className="size-3.5" />
              <span className="hidden md:inline">{jsonDrawerOpen ? "Hide JSON" : "Inspect"}</span>
              {jsonDrawerOpen ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="hidden md:inline">Target:</span>
            <span className="font-semibold text-foreground">
              {doc.subjects[slot]?.subject_id.trim() || `Subject ${slot + 1}`}
            </span>
            <span className="text-border">|</span>
            <button
              type="button"
              onClick={onSwitchToSegmented}
              className="text-primary hover:underline font-medium"
            >
              Fine-tune in Segmented Editor →
            </button>
          </div>
        </div>

        {/* Collapsible JSON Inspector Drawer */}
        {jsonDrawerOpen && (
          <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/90 p-3 max-h-64 overflow-y-auto font-mono text-[11px] text-neutral-300">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-neutral-400">
              <span>Synthesized JSON Schema Engine</span>
              <span className="text-[10px] uppercase font-bold text-primary">Automated Backend</span>
            </div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(doc, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
