import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { deleteBookmarkImage, loadBookmarkImage, loadCloud, saveBookmarkImage, saveCloudBlob } from "@/lib/prompt/cloud";
import {
  Bookmark as BookmarkIcon,
  BookmarkPlus,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FilePlus,
  Flame,
  Grid2X2,
  Grid3X3,
  ImagePlus,
  Layers,
  Library,
  Maximize2,
  Minimize2,
  Plus,
  Search,
  Shirt,
  Sparkles,
  SunMedium,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  CAST_MODELS,
  CAST_CATEGORIES,
  filterCastModels,
  applyCastModel,
  isCastModelApplied,
  type CastModelItem,
  type CastCategory,
} from "@/lib/prompt/cast-database";
import { applySection, captureFields, fieldsHaveContent, normalizeTag, sectionBlurb } from "@/lib/prompt/bookmarks";
import { applyLook, lookIsApplied, looksFor, LOOK_FILTERS, LOOKS, customOutfitToLook, type Look, type LookFilter } from "@/lib/prompt/looks";
import { PoseCardVisual } from "@/components/pose-art";
import { PoseCatalogModal } from "@/components/pose-catalog-modal";
import {
  POSE_LIBRARY,
  POSE_CATEGORIES,
  filterPoses,
  isPoseApplied,
  type PoseItem,
  type PoseCategory,
} from "@/lib/prompt/pose-database";
import { CameraCatalogModal } from "@/components/camera-catalog-modal";
import {
  CAMERA_LIBRARY,
  CAMERA_CATEGORIES,
  filterCameraOptions,
  isCameraApplied,
  type CameraItem,
  type CameraCategory,
} from "@/lib/prompt/camera-database";
import { LightingCatalogModal } from "@/components/lighting-catalog-modal";
import {
  LIGHTING_LIBRARY,
  LIGHTING_CATEGORIES,
  filterLightingOptions,
  isLightingApplied,
  type LightingItem,
  type LightingCategory,
} from "@/lib/prompt/lighting-database";
import {
  WardrobeCatalogModal,
  CatalogItemImage,
  CatalogOutfitImage,
} from "@/components/wardrobe-catalog-modal";
import {
  applyWardrobeItem,
  applyWardrobeOutfit,
  isWardrobeItemApplied,
  isWardrobeOutfitApplied,
  filterWardrobeItems,
  filterWardrobeOutfits,
  combineWardrobeItems,
  combineWardrobeOutfits,
  WARDROBE_ITEMS,
  WARDROBE_OUTFITS,
  type WardrobeItem,
  type WardrobeOutfit,
  type WardrobeSlot,
} from "@/lib/prompt/wardrobe-database";
import {
  loadCustomItems,
  loadCustomOutfits,
  CUSTOM_LIBRARY_CHANGE_EVENT,
} from "@/lib/prompt/custom-library-store";
import { deleteImage, fileToThumbnail, loadImage, saveImage } from "@/lib/prompt/images";
import { parsePrompt } from "@/lib/prompt/parse";
import { SEED_SNIPPETS } from "@/lib/prompt/snippets";
import {
  loadBookmarks,
  loadCharacters,
  loadDraft,
  loadLibrary,
  loadSnippets,
  saveBookmarks,
  saveCharacters,
  saveDraft,
  saveLibrary,
  saveSnippets,
} from "@/lib/prompt/storage";
import {
  CLUSTER_GROUPS,
  CLUSTERS,
  clusterById,
  clusterHasContent,
  countFilled,
  emptyDoc,
  emptySubject,
  getAt,
  resolvePath,
  setAt,
  titleFromDoc,
  toJson,
  toPromptLine,
  type Bookmark,
  type ClusterId,
  type Draft,
  type FieldDef,
  type PromptDoc,
  type SavedCharacter,
  type SavedPrompt,
  type Snippet,
  type SnippetCategory,
  type Subject,
} from "@/lib/prompt/model";

const SAMPLE_TITLE = "Cliffside ranger";
const SAMPLE_SOURCE =
  "a young elven ranger with long silver hair and piercing blue eyes, wearing a weathered crimson cloak over black leather armor, standing on a cliff edge, looking out to sea, stormy ocean background, sea spray in the foreground, cinematic dark fantasy oil painting, dramatic rim lighting, 85mm lens, shallow depth of field, no text, no watermark";

const SAMPLE_DOC = parsePrompt(SAMPLE_SOURCE).doc;

const FILTERS: Array<{ id: "all" | SnippetCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "medium", label: "Medium" },
  { id: "optics", label: "Optics" },
  { id: "key", label: "Lighting" },
  { id: "framing", label: "Frame" },
  { id: "wardrobe", label: "Wardrobe" },
  { id: "exclusions", label: "Exclude" },
  { id: "note", label: "Notes" },
];

type Pane = "source" | "forge" | "assets";
type AssetTab = "cast" | "wardrobe" | "poses" | "lighting" | "camera" | "saved";
type Copied = "json" | "line" | null;
type JsonMode = "peek" | "full" | "hidden";

const WARDROBE_SLOT_PILLS: Array<{ id: WardrobeSlot | "all"; label: string }> = [
  { id: "all", label: "All Pieces" },
  { id: "top", label: "Tops" },
  { id: "outerwear", label: "Outerwear" },
  { id: "bottom", label: "Bottoms" },
  { id: "shoes", label: "Footwear" },
  { id: "headwear", label: "Headwear" },
  { id: "jewelry", label: "Jewelry" },
  { id: "bag", label: "Bags" },
  { id: "accessory", label: "Accessories" },
  { id: "neckwear", label: "Neckwear" },
  { id: "eyewear", label: "Eyewear" },
  { id: "belt_waist", label: "Belts" },
  { id: "dress_onepiece", label: "Dresses" },
  { id: "layer_top", label: "Mid-Layers" },
  { id: "legwear", label: "Legwear" },
];

function WardrobeItemCard({
  item,
  applied,
  density,
  onSelect,
}: {
  item: WardrobeItem;
  applied: boolean;
  density: "comfortable" | "compact";
  onSelect: () => void;
}) {
  if (density === "compact") {
    return (
      <button
        type="button"
        onClick={onSelect}
        title={`${item.name} (${item.slot}) - Click to apply to active subject`}
        aria-pressed={applied}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-lg border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-xs",
          applied ? "border-emerald-500 ring-2 ring-emerald-500/40" : "border-border",
        )}
      >
        <div className="relative aspect-square w-full bg-neutral-900/40 overflow-hidden">
          <CatalogItemImage item={item} />
          <span className="absolute top-1 left-1 rounded bg-black/75 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-neutral-300">
            {item.slot.replace("dress_onepiece", "dress").replace("belt_waist", "belt").slice(0, 5)}
          </span>
          {applied && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
              <Check className="size-2.5 stroke-[3]" />
            </span>
          )}
          {item.is_custom && (
            <span className="absolute bottom-1 right-1 rounded bg-purple-500/90 px-1 py-0.5 text-[8px] font-bold uppercase text-white">
              Custom
            </span>
          )}
        </div>
        <div className="p-1.5">
          <p className="text-[11px] font-medium leading-tight text-foreground truncate group-hover:text-primary">
            {item.name}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={applied}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-md",
        applied ? "border-emerald-500 ring-2 ring-emerald-500/40" : "border-border",
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-neutral-900/40 overflow-hidden">
        <CatalogItemImage item={item} />
        <span className="absolute top-1.5 left-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-200">
          {item.slot.replace("_", " ")}
        </span>
        {applied && (
          <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
            <Check className="size-3 stroke-[3]" />
          </span>
        )}
        {item.is_custom && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-purple-500/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
            Custom
          </span>
        )}
      </div>
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary">
            {item.name}
          </h4>
          <p className="mt-1 text-[10px] text-muted line-clamp-1 capitalize">
            {item.colors[0] ? `${item.colors[0]} · ` : ""}{item.subcategory.replace("_", " ")}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-[9px] font-medium text-faint">
            {item.style_tags[0] ? `#${item.style_tags[0].replace("_", " ")}` : item.slot}
          </span>
          <span className={cn("text-[10px] font-semibold", applied ? "text-emerald-500" : "text-primary group-hover:underline")}>
            {applied ? "Applied" : "+ Apply"}
          </span>
        </div>
      </div>
    </button>
  );
}

function WardrobeOutfitCard({
  outfit,
  applied,
  density,
  onSelect,
}: {
  outfit: WardrobeOutfit;
  applied: boolean;
  density: "comfortable" | "compact";
  onSelect: () => void;
}) {
  const pieceCount = outfit.item_ids?.length || 0;

  if (density === "compact") {
    return (
      <button
        type="button"
        onClick={onSelect}
        title={`${outfit.name} - Click to apply full outfit`}
        aria-pressed={applied}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-lg border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-xs",
          applied ? "border-rose-500 ring-2 ring-rose-500/40" : "border-border",
        )}
      >
        <div className="relative aspect-square w-full bg-neutral-900/40 overflow-hidden">
          <CatalogOutfitImage outfit={outfit} />
          <span className="absolute top-1 left-1 rounded bg-rose-500/90 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
            Outfit
          </span>
          {applied && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-white shadow">
              <Check className="size-2.5 stroke-[3]" />
            </span>
          )}
        </div>
        <div className="p-1.5">
          <p className="text-[11px] font-medium leading-tight text-foreground truncate group-hover:text-primary">
            {outfit.name}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={applied}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-md",
        applied ? "border-rose-500 ring-2 ring-rose-500/40" : "border-border",
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-neutral-900/40 overflow-hidden">
        <CatalogOutfitImage outfit={outfit} />
        <span className="absolute top-1.5 left-1.5 rounded-md bg-rose-500/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
          Full Look
        </span>
        {applied && (
          <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-md">
            <Check className="size-3 stroke-[3]" />
          </span>
        )}
      </div>
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary">
            {outfit.name}
          </h4>
          <p className="mt-1 text-[10px] text-muted line-clamp-1">
            {pieceCount ? `${pieceCount} pieces` : "Preset outfit"}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-[9px] font-medium text-faint">
            {outfit.style_tags[0] ? `#${outfit.style_tags[0].replace("_", " ")}` : "Preset"}
          </span>
          <span className={cn("text-[10px] font-semibold", applied ? "text-rose-400" : "text-primary group-hover:underline")}>
            {applied ? "Applied" : "+ Apply Outfit"}
          </span>
        </div>
      </div>
    </button>
  );
}

function PoseCard({
  pose,
  applied,
  density,
  onSelect,
}: {
  pose: PoseItem;
  applied: boolean;
  density: "comfortable" | "compact";
  onSelect: () => void;
}) {
  if (density === "compact") {
    return (
      <button
        type="button"
        onClick={onSelect}
        title={`${pose.name} (${pose.stance}) - Click to apply posture`}
        aria-pressed={applied}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-lg border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-xs",
          applied ? "border-amber-500 ring-2 ring-amber-500/40" : "border-border",
        )}
      >
        <div className="relative aspect-square w-full bg-neutral-900/60 overflow-hidden">
          {pose.image ? (
            <img
              src={pose.image}
              alt={pose.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted font-mono text-[9px] uppercase">
              {pose.category}
            </div>
          )}
          <span className="absolute top-1 left-1 rounded bg-black/80 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-400">
            {pose.category.slice(0, 7)}
          </span>
          {applied && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-black shadow font-bold">
              <Check className="size-2.5 stroke-[3]" />
            </span>
          )}
          <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 py-0.5 text-[7px] font-medium text-neutral-300 capitalize">
            {pose.stance}
          </span>
        </div>
        <div className="p-1.5">
          <p className="text-[11px] font-medium leading-tight text-foreground truncate group-hover:text-primary">
            {pose.name}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={applied}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-md",
        applied ? "border-amber-500 ring-2 ring-amber-500/40" : "border-border",
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-neutral-900/60 overflow-hidden">
        {pose.image ? (
          <img
            src={pose.image}
            alt={pose.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted font-mono text-xs uppercase">
            {pose.category}
          </div>
        )}
        <span className="absolute top-1.5 left-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-400">
          {pose.category}
        </span>
        {applied && (
          <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-amber-500 text-black shadow font-bold">
            <Check className="size-3 stroke-[3]" />
          </span>
        )}
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[8px] font-medium text-neutral-300 capitalize">
          {pose.stance}
        </span>
      </div>
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary">
            {pose.name}
          </h4>
          {pose.subtitle && (
            <p className="mt-1 text-[10px] text-muted line-clamp-1">
              {pose.subtitle}
            </p>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-[9px] font-medium text-faint truncate max-w-[120px]">
            {pose.tags[0] ? `#${pose.tags[0]}` : pose.stance}
          </span>
          <span className={cn("text-[10px] font-semibold", applied ? "text-amber-500" : "text-primary group-hover:underline")}>
            {applied ? "Applied" : "+ Apply"}
          </span>
        </div>
      </div>
    </button>
  );
}

function LightingCard({
  item,
  applied,
  density,
  onSelect,
}: {
  item: LightingItem;
  applied: boolean;
  density: "comfortable" | "compact";
  onSelect: () => void;
}) {
  if (density === "compact") {
    return (
      <button
        type="button"
        onClick={onSelect}
        title={`${item.name} (${item.badge}) - Click to apply lighting setup`}
        aria-pressed={applied}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-lg border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-xs",
          applied ? "border-amber-500 ring-2 ring-amber-500/40" : "border-border",
        )}
      >
        <div className="relative aspect-square w-full bg-neutral-900/60 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <span className="absolute top-1 left-1 rounded bg-black/80 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-400">
            {item.badge}
          </span>
          {applied && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-black shadow font-bold">
              <Check className="size-2.5 stroke-[3]" />
            </span>
          )}
        </div>
        <div className="p-1.5">
          <p className="text-[11px] font-medium leading-tight text-foreground truncate group-hover:text-primary">
            {item.name}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={applied}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-md",
        applied ? "border-amber-500 ring-2 ring-amber-500/40" : "border-border",
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-neutral-900/60 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <span className="absolute top-1.5 left-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-400">
          {item.badge}
        </span>
        {applied && (
          <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-amber-500 text-black shadow font-bold">
            <Check className="size-3 stroke-[3]" />
          </span>
        )}
      </div>
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary">
            {item.name}
          </h4>
          <p className="mt-1 text-[10px] text-muted line-clamp-1">
            {item.subtitle}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-[9px] font-medium text-faint capitalize">
            {item.category}
          </span>
          <span className={cn("text-[10px] font-semibold", applied ? "text-amber-500" : "text-primary group-hover:underline")}>
            {applied ? "Applied" : "+ Apply"}
          </span>
        </div>
      </div>
    </button>
  );
}

function CameraCard({
  item,
  applied,
  density,
  onSelect,
}: {
  item: CameraItem;
  applied: boolean;
  density: "comfortable" | "compact";
  onSelect: () => void;
}) {
  if (density === "compact") {
    return (
      <button
        type="button"
        onClick={onSelect}
        title={`${item.name} (${item.badge}) - Click to apply camera framing & optics`}
        aria-pressed={applied}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-lg border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-xs",
          applied ? "border-emerald-500 ring-2 ring-emerald-500/40" : "border-border",
        )}
      >
        <div className="relative aspect-square w-full bg-neutral-900/60 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <span className="absolute top-1 left-1 rounded bg-black/80 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-400">
            {item.badge}
          </span>
          {applied && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow font-bold">
              <Check className="size-2.5 stroke-[3]" />
            </span>
          )}
        </div>
        <div className="p-1.5">
          <p className="text-[11px] font-medium leading-tight text-foreground truncate group-hover:text-primary">
            {item.name}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={applied}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-md",
        applied ? "border-emerald-500 ring-2 ring-emerald-500/40" : "border-border",
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-neutral-900/60 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <span className="absolute top-1.5 left-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
          {item.badge}
        </span>
        {applied && (
          <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow font-bold">
            <Check className="size-3 stroke-[3]" />
          </span>
        )}
      </div>
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary">
            {item.name}
          </h4>
          <p className="mt-1 text-[10px] text-muted line-clamp-1">
            {item.subtitle}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-[9px] font-medium text-faint capitalize">
            {item.lens || item.category}
          </span>
          <span className={cn("text-[10px] font-semibold", applied ? "text-emerald-500" : "text-primary group-hover:underline")}>
            {applied ? "Applied" : "+ Apply"}
          </span>
        </div>
      </div>
    </button>
  );
}

function CastModelCard({
  model,
  applied,
  density,
  onSelect,
}: {
  model: CastModelItem;
  applied: boolean;
  density: "comfortable" | "compact";
  onSelect: () => void;
}) {
  if (density === "compact") {
    return (
      <button
        type="button"
        onClick={onSelect}
        title={`${model.name} (${model.badge}) - Click to set as active subject model`}
        aria-pressed={applied}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-lg border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-xs",
          applied ? "border-purple-500 ring-2 ring-purple-500/40" : "border-border",
        )}
      >
        <div className="relative aspect-[4/5] w-full bg-neutral-900/60 overflow-hidden">
          <img
            src={model.image}
            alt={model.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <span className="absolute top-1 left-1 rounded bg-black/80 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-purple-400">
            {model.badge}
          </span>
          {applied && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-purple-500 text-white shadow font-bold">
              <Check className="size-2.5 stroke-[3]" />
            </span>
          )}
        </div>
        <div className="p-1.5">
          <p className="text-[11px] font-medium leading-tight text-foreground truncate group-hover:text-primary">
            {model.name}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={applied}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-md",
        applied ? "border-purple-500 ring-2 ring-purple-500/40" : "border-border",
      )}
    >
      <div className="relative aspect-[4/5] w-full bg-neutral-900/60 overflow-hidden">
        <img
          src={model.image}
          alt={model.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <span className="absolute top-1.5 left-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-400">
          {model.badge}
        </span>
        {applied && (
          <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-purple-500 text-white shadow font-bold">
            <Check className="size-3 stroke-[3]" />
          </span>
        )}
      </div>
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary">
            {model.name}
          </h4>
          <p className="mt-1 text-[10px] text-muted line-clamp-2">
            {model.description}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-[9px] font-medium text-faint">
            {model.tags[0] ? `#${model.tags[0]}` : model.category.replace("_", " ")}
          </span>
          <span className={cn("text-[10px] font-semibold", applied ? "text-purple-400" : "text-primary group-hover:underline")}>
            {applied ? "Applied" : "+ Apply"}
          </span>
        </div>
      </div>
    </button>
  );
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function narrow() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

function formatWhen(ts: number) {
  const minutes = Math.round((Date.now() - ts) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 14) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}

function appendText(current: string, piece: string) {
  const next = piece.trim();
  if (!next) return current;
  if (!current.trim()) return next;
  if (current.toLowerCase().includes(next.toLowerCase())) return current;
  return `${current.replace(/,\s*$/, "")}, ${next}`;
}

function placeSnippet(
  doc: PromptDoc,
  snippet: Snippet,
  slot: number,
  focusPath: string,
  activeId: ClusterId,
): { doc: PromptDoc; focus: string; cluster: ClusterId } {
  const targetCluster = snippet.category === "note" ? clusterById(activeId) : clusterById(snippet.category);
  const field = snippet.target
    ? targetCluster.fields.find((item) => item.path === snippet.target)
    : snippet.category === "note"
      ? (targetCluster.fields.find((item) => resolvePath(item.path, slot) === focusPath) ??
        targetCluster.fields.find((item) => item.kind !== "palette"))
      : targetCluster.fields.find((item) => item.kind !== "palette");
  const chosen = field ?? targetCluster.fields[0];
  if (!chosen) return { doc, focus: focusPath, cluster: activeId };
  const resolved = resolvePath(chosen.path, slot);
  const current = getAt(doc, resolved);
  let nextDoc = doc;
  if (chosen.kind === "list" || chosen.kind === "palette" || Array.isArray(current)) {
    const incoming = snippet.body
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    const base = Array.isArray(current) ? current.filter((item) => item.trim()) : [];
    const next = [...base];
    for (const line of incoming) {
      if (!next.some((item) => item.toLowerCase() === line.toLowerCase())) next.push(line);
    }
    nextDoc = setAt(doc, resolved, next);
  } else {
    const text = typeof current === "string" ? current : "";
    if (!text.toLowerCase().includes(snippet.body.trim().toLowerCase())) {
      nextDoc = setAt(doc, resolved, appendText(text, snippet.body));
    }
  }
  return {
    doc: nextDoc,
    focus: resolved,
    cluster: snippet.category === "note" ? activeId : snippet.category,
  };
}

function safeHex(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#C46A3A";
}

function subjectFilled(subject: Subject) {
  const probe = emptyDoc();
  probe.subjects = [subject];
  return countFilled(probe) > 0;
}

function characterName(subject: Subject, fallback: string) {
  const named = subject.subject_id.trim();
  if (named) return named.length > 48 ? `${named.slice(0, 48).trim()}…` : named;
  const feature = subject.casting_and_physique.demographics_and_features.trim().split(",")[0]?.trim() ?? "";
  if (feature) return feature.length > 48 ? `${feature.slice(0, 48).trim()}…` : feature;
  return fallback;
}

function characterBlurb(subject: Subject) {
  return [
    subject.casting_and_physique.hair_and_grooming,
    subject.casting_and_physique.demographics_and_features,
    subject.wardrobe_architecture.layering_system.outerwear,
    subject.kinetic_posture,
  ]
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" · ");
}

function blobToBase64(blob: Blob) {
  return blob.arrayBuffer().then((buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  });
}

function base64ToBlob(data: string) {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: "image/jpeg" });
}

export function PromptForge() {
  const [title, setTitle] = useState(SAMPLE_TITLE);
  const [source, setSource] = useState(SAMPLE_SOURCE);
  const [doc, setDoc] = useState<PromptDoc>(SAMPLE_DOC);
  const [cluster, setCluster] = useState<ClusterId>("casting");
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [focusPath, setFocusPath] = useState("subjects.0.subject_id");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pane, setPane] = useState<Pane>("forge");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [library, setLibrary] = useState<SavedPrompt[]>([]);
  const [customSnippets, setCustomSnippets] = useState<Snippet[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [status, setStatus] = useState("Sample loaded. Jump to a cluster, or paste over the source.");
  const [copied, setCopied] = useState<Copied>(null);
  const [jsonMode, setJsonMode] = useState<JsonMode>("peek");
  const [confirmNew, setConfirmNew] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [untouched, setUntouched] = useState(true);
  const [ready, setReady] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftCategory, setDraftCategory] = useState<SnippetCategory>("medium");
  const [characters, setCharacters] = useState<SavedCharacter[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [assetFilter, setAssetFilter] = useState("all");
  const [assetShelf, setAssetShelf] = useState<"saved" | "looks">("saved");
  const [assetTab, setAssetTab] = useState<AssetTab>("cast");
  const [castCategoryFilter, setCastCategoryFilter] = useState<CastCategory>("all");
  const [castSearch, setCastSearch] = useState("");
  const [wardrobeTab, setWardrobeTab] = useState<"pieces" | "outfits">("pieces");
  const [wardrobeSlot, setWardrobeSlot] = useState<WardrobeSlot | "all">("all");
  const [wardrobeSearch, setWardrobeSearch] = useState("");
  const [customItems, setCustomItems] = useState<WardrobeItem[]>([]);
  const [assetDensity, setAssetDensity] = useState<"comfortable" | "compact">("compact");
  const [assetFullscreen, setAssetFullscreen] = useState(false);
  const [poseCategoryFilter, setPoseCategoryFilter] = useState<PoseCategory>("all");
  const [poseSearch, setPoseSearch] = useState("");
  const [lightingCategoryFilter, setLightingCategoryFilter] = useState<LightingCategory>("all");
  const [lightingSearch, setLightingSearch] = useState("");
  const [cameraCategoryFilter, setCameraCategoryFilter] = useState<CameraCategory>("all");
  const [cameraSearch, setCameraSearch] = useState("");
  const [poseStanceFilter, setPoseStanceFilter] = useState<LookFilter>("pose");
  const [lookFilter, setLookFilter] = useState<LookFilter>("pose");
  const [poseGalleryOpen, setPoseGalleryOpen] = useState(false);
  const [cameraGalleryOpen, setCameraGalleryOpen] = useState(false);
  const [lightingGalleryOpen, setLightingGalleryOpen] = useState(false);
  const [wardrobeGalleryOpen, setWardrobeGalleryOpen] = useState(false);
  const [appliedOutfitId, setAppliedOutfitId] = useState<string | null>(null);
  const [customOutfits, setCustomOutfits] = useState<WardrobeOutfit[]>([]);
  const [lookSearch, setLookSearch] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [bookmarkName, setBookmarkName] = useState("");
  const [bookmarkTags, setBookmarkTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [accountReady, setAccountReady] = useState(false);
  const imagesSynced = useRef(false);
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id ?? null;

  const slot = Math.min(subjectIndex, Math.max(doc.subjects.length - 1, 0));
  const active = clusterById(cluster);

  // Subscribe to custom library changes for items and outfits
  useEffect(() => {
    async function refreshCustom() {
      const [items, outfits] = await Promise.all([loadCustomItems(), loadCustomOutfits()]);
      setCustomItems(items);
      setCustomOutfits(outfits);
    }
    refreshCustom();
    window.addEventListener(CUSTOM_LIBRARY_CHANGE_EVENT, refreshCustom);
    return () => window.removeEventListener(CUSTOM_LIBRARY_CHANGE_EVENT, refreshCustom);
  }, []);

  const allWardrobeItems = useMemo(() => {
    return combineWardrobeItems(WARDROBE_ITEMS, customItems);
  }, [customItems]);

  const allWardrobeOutfits = useMemo(() => {
    return combineWardrobeOutfits(WARDROBE_OUTFITS, customOutfits);
  }, [customOutfits]);

  const wardrobeSlotCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allWardrobeItems.length };
    for (const item of allWardrobeItems) {
      counts[item.slot] = (counts[item.slot] || 0) + 1;
    }
    return counts;
  }, [allWardrobeItems]);

  const displayedWardrobeItems = useMemo(() => {
    return filterWardrobeItems(allWardrobeItems, wardrobeSearch, wardrobeSlot);
  }, [allWardrobeItems, wardrobeSearch, wardrobeSlot]);

  const displayedWardrobeOutfits = useMemo(() => {
    return filterWardrobeOutfits(allWardrobeOutfits, wardrobeSearch);
  }, [allWardrobeOutfits, wardrobeSearch]);

  function handleSelectWardrobeItem(item: WardrobeItem) {
    const updated = applyWardrobeItem(doc, item, slot);
    setDoc(updated);
    setUntouched(false);
    const slotLabel = item.slot.replace("_", " ");
    const who = doc.subjects[slot]?.subject_id.trim() || `Subject ${slot + 1}`;
    setStatus(`Applied ${item.name} to ${who} (${slotLabel}).`);
  }

  function handleSelectWardrobeOutfit(outfit: WardrobeOutfit) {
    const updated = applyWardrobeOutfit(doc, outfit, slot);
    setDoc(updated);
    setUntouched(false);
    setAppliedOutfitId(outfit.id);
    const who = doc.subjects[slot]?.subject_id.trim() || `Subject ${slot + 1}`;
    setStatus(`Applied ${outfit.name} to ${who} (full outfit).`);
  }

  const shelfLooks = useMemo(() => {
    const base = looksFor(lookFilter);
    if (lookFilter === "wardrobe" && customOutfits.length > 0) {
      const customLooks = customOutfits.map(customOutfitToLook);
      return [...customLooks, ...base];
    }
    return base;
  }, [lookFilter, customOutfits]);

  const displayedCastModels = useMemo(() => {
    return filterCastModels(CAST_MODELS, castCategoryFilter, castSearch);
  }, [castCategoryFilter, castSearch]);

  const handleSelectCastModel = (model: CastModelItem) => {
    const updated = applyCastModel(doc, model, slot);
    setDoc(updated);
    setUntouched(false);
    setStatus(`Applied Exile Model "${model.name}" to Subject ${slot + 1} (${model.badge}). Consistent character JSON updated.`);
  };

  const displayedPoses = useMemo(() => {
    return filterPoses({
      category: poseCategoryFilter === "all" ? undefined : poseCategoryFilter,
      query: poseSearch,
      includeAdult: false,
    });
  }, [poseCategoryFilter, poseSearch]);

  const displayedLighting = useMemo(() => {
    return filterLightingOptions(lightingSearch, lightingCategoryFilter);
  }, [lightingSearch, lightingCategoryFilter]);

  const displayedCamera = useMemo(() => {
    return filterCameraOptions({
      category: cameraCategoryFilter === "all" ? undefined : cameraCategoryFilter,
      query: cameraSearch,
    });
  }, [cameraCategoryFilter, cameraSearch]);

  const handleSelectPose = (pose: PoseItem) => {
    let next = setAt(doc, `subjects.${slot}.kinetic_posture`, pose.posture);
    if (pose.props && pose.props.length > 0) {
      const currentProps = doc.scene_composition.environmental_staging.grounded_props ?? [];
      const merged = Array.from(new Set([...currentProps, ...pose.props]));
      next = setAt(next, "scene_composition.environmental_staging.grounded_props", merged);
    }
    setDoc(next);
    setUntouched(false);
    setStatus(`Applied ${pose.name} to ${doc.subjects[slot]?.subject_id.trim() || `Subject ${slot + 1}`} (posture).`);
  };

  const handleSelectLighting = (item: LightingItem) => {
    let next = setAt(doc, "aesthetic_dna.lighting_architecture.lighting_style", item.style);
    if (item.fixture) {
      next = setAt(next, "aesthetic_dna.lighting_architecture.key_source.fixture_or_origin", item.fixture);
    }
    if (item.angle) {
      next = setAt(next, "aesthetic_dna.lighting_architecture.key_source.angle_and_elevation", item.angle);
    }
    if (item.shadow) {
      next = setAt(next, "aesthetic_dna.lighting_architecture.fill_and_negative_space.shadow_depth", item.shadow);
    }
    if (item.practical) {
      next = setAt(next, "aesthetic_dna.lighting_architecture.accent_and_practicals.practical_sources", item.practical);
    }
    setDoc(next);
    setUntouched(false);
    setStatus(`Applied ${item.name} (${item.badge}).`);
  };

  const handleSelectCamera = (item: CameraItem) => {
    let next = setAt(doc, "scene_composition.framing_doctrine.named_principle", item.principle);
    next = setAt(next, "scene_composition.framing_doctrine.camera_elevation_and_axis", item.axis);
    if (item.lens) {
      next = setAt(next, "aesthetic_dna.optics.lens_type_and_focal_length", item.lens);
    }
    if (item.dof) {
      next = setAt(next, "aesthetic_dna.optics.aperture_and_dof", item.dof);
    }
    setDoc(next);
    setUntouched(false);
    setStatus(`Applied ${item.name} (${item.badge}).`);
  };

  useEffect(() => {
    if (isPending) return;
    let cancelled = false;
    setAccountReady(false);
    imagesSynced.current = false;
    async function hydrate() {
      const applyLocal = () => {
        const draft = loadDraft();
        if (draft) {
          setTitle(draft.title);
          setSource(draft.source);
          setDoc(draft.doc);
          setCluster(draft.cluster);
          setSubjectIndex(draft.subjectIndex);
          setCurrentId(draft.currentId);
          setUntouched(false);
          setStatus(userId ? "Copied this phone's copy into your account." : "Draft restored.");
        }
        setLibrary(loadLibrary());
        setCustomSnippets(loadSnippets());
        setCharacters(loadCharacters());
        setBookmarks(loadBookmarks());
      };
      if (!userId) {
        applyLocal();
        if (!cancelled) setReady(true);
        return;
      }
      try {
        const snap = await loadCloud();
        if (cancelled) return;
        const empty = !snap.draft && snap.library.length === 0 && snap.snippets.length === 0 && snap.characters.length === 0 && snap.bookmarks.length === 0;
        if (empty) {
          applyLocal();
        } else {
          if (snap.draft) {
            setTitle(snap.draft.title);
            setSource(snap.draft.source);
            setDoc(snap.draft.doc);
            setCluster(snap.draft.cluster);
            setSubjectIndex(snap.draft.subjectIndex);
            setCurrentId(snap.draft.currentId);
            setUntouched(false);
          }
          setLibrary(snap.library);
          setCustomSnippets(snap.snippets);
          setCharacters(snap.characters);
          setBookmarks(snap.bookmarks);
          setStatus("Loaded from your account.");
        }
        setAccountReady(true);
      } catch {
        applyLocal();
        setStatus("Couldn't reach your account. Using this phone's copy.");
      }
      if (!cancelled) setReady(true);
    }
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [isPending, userId]);

  useEffect(() => {
    if (!ready) return;
    const draft: Draft = { title, source, doc, cluster, subjectIndex: slot, currentId };
    saveDraft(draft);
    if (!accountReady) return;
    const handle = window.setTimeout(() => {
      void saveCloudBlob({ data: { kind: "draft", payload: draft } }).catch(() => undefined);
    }, 600);
    return () => window.clearTimeout(handle);
  }, [ready, accountReady, title, source, doc, cluster, slot, currentId]);

  useEffect(() => {
    if (!accountReady) return;
    const handle = window.setTimeout(() => {
      void saveCloudBlob({ data: { kind: "library", payload: library } }).catch(() => undefined);
      void saveCloudBlob({ data: { kind: "snippets", payload: customSnippets } }).catch(() => undefined);
      void saveCloudBlob({ data: { kind: "characters", payload: characters } }).catch(() => undefined);
      void saveCloudBlob({ data: { kind: "bookmarks", payload: bookmarks } }).catch(() => undefined);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [accountReady, library, customSnippets, characters, bookmarks]);

  useEffect(() => {
    if (!accountReady || imagesSynced.current) return;
    imagesSynced.current = true;
    for (const bookmark of bookmarks) {
      if (!bookmark.hasImage) continue;
      void loadImage(bookmark.id)
        .then(async (blob) => {
          if (!blob) return;
          await saveBookmarkImage({ data: { id: bookmark.id, data: await blobToBase64(blob) } });
        })
        .catch(() => undefined);
    }
  }, [accountReady, bookmarks]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        runParse();
      }
      if (event.key === "Escape") {
        setBookmarkOpen(false);
        setLibraryOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const json = useMemo(() => toJson(doc), [doc]);
  const filled = countFilled(doc);
  const snippets = useMemo(() => {
    const all = [...customSnippets, ...SEED_SNIPPETS];
    if (filter === "all") return all;
    return all.filter((item) => item.category === filter);
  }, [customSnippets, filter]);

  const knownTags = useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of bookmarks) {
      for (const tag of item.tags) {
        const key = tag.toLowerCase();
        if (!seen.has(key)) seen.set(key, tag);
      }
    }
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [bookmarks]);

  const shownBookmarks = useMemo(() => {
    if (assetFilter === "all") return bookmarks;
    if (assetFilter === "pieces") return [];
    return bookmarks.filter((item) => item.tags.some((tag) => tag.toLowerCase() === assetFilter));
  }, [assetFilter, bookmarks]);

  function openCluster(id: ClusterId, index = slot) {
    const next = clusterById(id);
    setCluster(id);
    const path = resolvePath(next.fields[0]?.path ?? "", index);
    if (path) setFocusPath(path);
  }

  function runParse() {
    if (!source.trim()) {
      setStatus("Paste something first.");
      setPane("source");
      return;
    }
    const result = parsePrompt(source);
    setDoc(result.doc);
    setSubjectIndex(0);
    setStatus(result.summary);
    setUntouched(false);
    setConfirmNew(false);
    if (title === "Untitled" || title === SAMPLE_TITLE) setTitle(titleFromDoc(result.doc));
    openCluster(result.doc.subjects[0]?.subject_id ? "casting" : "medium", 0);
    if (narrow()) setPane("forge");
  }

  function loadSample() {
    const result = parsePrompt(SAMPLE_SOURCE);
    setSource(SAMPLE_SOURCE);
    setDoc(result.doc);
    setTitle(SAMPLE_TITLE);
    setCurrentId(null);
    setSubjectIndex(0);
    setUntouched(true);
    setStatus(result.summary);
    setConfirmNew(false);
    openCluster("casting");
    if (narrow()) setPane("forge");
  }

  function clearWork() {
    setTitle("Untitled");
    setSource("");
    setDoc(emptyDoc());
    setCurrentId(null);
    setSubjectIndex(0);
    setUntouched(false);
    setConfirmNew(false);
    setStatus("Fresh page. Paste a prompt on the left.");
    openCluster("medium");
    if (narrow()) setPane("source");
  }

  function onNew() {
    const dirty = source.trim().length > 0 || filled > 0;
    if (dirty && !confirmNew) {
      setConfirmNew(true);
      return;
    }
    clearWork();
  }

  function onSave() {
    const now = Date.now();
    const nextTitle = title.trim() || titleFromDoc(doc);
    setTitle(nextTitle);
    if (currentId && library.some((item) => item.id === currentId)) {
      const next = library.map((item) =>
        item.id === currentId ? { ...item, title: nextTitle, source, doc, updatedAt: now } : item,
      );
      setLibrary(next);
      saveLibrary(next);
      setStatus("Updated in the library.");
      return;
    }
    const id = crypto.randomUUID();
    const item: SavedPrompt = {
      id,
      title: nextTitle,
      source,
      doc,
      createdAt: now,
      updatedAt: now,
    };
    const next = [item, ...library];
    setCurrentId(id);
    setLibrary(next);
    saveLibrary(next);
    setStatus("Saved to the library.");
  }

  function onLoad(item: SavedPrompt) {
    setTitle(item.title);
    setSource(item.source);
    setDoc(item.doc);
    setCurrentId(item.id);
    setSubjectIndex(0);
    setUntouched(false);
    setLibraryOpen(false);
    setConfirmNew(false);
    setStatus(`Loaded “${item.title}”.`);
    openCluster("casting");
    if (narrow()) setPane("forge");
  }

  function onDelete(id: string) {
    if (pendingDelete !== id) {
      setPendingDelete(id);
      return;
    }
    const next = library.filter((item) => item.id !== id);
    setLibrary(next);
    saveLibrary(next);
    if (currentId === id) setCurrentId(null);
    setPendingDelete(null);
  }

  function saveField(field: FieldDef) {
    const resolved = resolvePath(field.path, slot);
    const value = getAt(doc, resolved);
    const body = Array.isArray(value) ? value.filter(Boolean).join("\n") : value.trim();
    if (!body) {
      setStatus(`${field.label} is empty.`);
      return;
    }
    const snippet: Snippet = {
      id: crypto.randomUUID(),
      title: body.split("\n")[0]?.trim().slice(0, 42) || field.label,
      body,
      category: cluster,
      custom: true,
    };
    const next = [snippet, ...customSnippets];
    setCustomSnippets(next);
    saveSnippets(next);
    setStatus(`Saved ${field.label} to assets.`);
  }

  function addSnippet() {
    const body = draftBody.trim();
    const name = draftTitle.trim();
    if (!body || !name) return;
    const snippet: Snippet = {
      id: crypto.randomUUID(),
      title: name,
      body,
      category: draftCategory,
      custom: true,
    };
    const next = [snippet, ...customSnippets];
    setCustomSnippets(next);
    saveSnippets(next);
    setDraftTitle("");
    setDraftBody("");
    setAdding(false);
    setStatus(`Asset “${name}” saved.`);
  }

  function removeSnippet(id: string) {
    const next = customSnippets.filter((item) => item.id !== id);
    setCustomSnippets(next);
    saveSnippets(next);
    setPicked((current) => current.filter((key) => key !== `s:${id}`));
  }

  function addSubject() {
    const index = doc.subjects.length;
    setDoc((current) => ({ ...current, subjects: [...current.subjects, emptySubject()] }));
    setSubjectIndex(index);
    setCluster("casting");
    setFocusPath(`subjects.${index}.subject_id`);
  }

  function removeSubject() {
    if (doc.subjects.length <= 1) return;
    setDoc((current) => ({
      ...current,
      subjects: current.subjects.filter((_, index) => index !== slot),
    }));
    setSubjectIndex(Math.max(0, slot - 1));
  }

  function forgetPhoto() {
    setPhotoPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setPhotoBlob(null);
    setPhotoError("");
  }

  function closeBookmark() {
    setBookmarkOpen(false);
    setSavingBookmark(false);
    forgetPhoto();
  }

  function openBookmark() {
    const person = active.group === "Subject";
    if (person) {
      const current = doc.subjects[slot] ?? emptySubject();
      if (!subjectFilled(current)) {
        setStatus("This subject is empty.");
        return;
      }
      setBookmarkName(characterName(current, "Subject"));
    } else {
      const fields = captureFields(doc, active, slot);
      if (!fieldsHaveContent(fields)) {
        setStatus(`${active.label} is empty.`);
        return;
      }
      setBookmarkName(sectionBlurb(fields).split(" · ")[0]?.slice(0, 42) || active.label);
    }
    setBookmarkTags([]);
    setTagDraft("");
    forgetPhoto();
    setBookmarkOpen(true);
  }

  function addTag(raw: string) {
    const next = normalizeTag(raw);
    if (!next) return;
    const known = knownTags.find((tag) => tag.toLowerCase() === next.toLowerCase());
    const label = known ?? next;
    setBookmarkTags((current) =>
      current.some((tag) => tag.toLowerCase() === label.toLowerCase()) ? current : [...current, label],
    );
    setTagDraft("");
  }

  function removeTag(label: string) {
    setBookmarkTags((current) => current.filter((tag) => tag.toLowerCase() !== label.toLowerCase()));
  }

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    try {
      const blob = await fileToThumbnail(file);
      setPhotoPreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return URL.createObjectURL(blob);
      });
      setPhotoBlob(blob);
      setPhotoError("");
    } catch {
      setPhotoError("That photo couldn't be used. Try another image.");
    }
  }

  async function commitBookmark() {
    const name = bookmarkName.trim();
    if (!name || savingBookmark) return;
    const person = active.group === "Subject";
    const kind = person ? "subject" : "section";
    const fields = person ? {} : captureFields(doc, active, slot);
    const subject = person ? structuredClone(doc.subjects[slot] ?? emptySubject()) : null;
    const existing = bookmarks.find((item) =>
      person
        ? item.kind === "subject" && item.name.toLowerCase() === name.toLowerCase()
        : item.kind === "section" && item.cluster === cluster && item.name.toLowerCase() === name.toLowerCase(),
    );
    const id = existing?.id ?? crypto.randomUUID();
    setSavingBookmark(true);
    let hasImage = existing?.hasImage ?? false;
    let photoNote = "";
    if (photoBlob) {
      try {
        await saveImage(id, photoBlob);
        hasImage = true;
        if (userId) {
          await saveBookmarkImage({ data: { id, data: await blobToBase64(photoBlob) } });
        }
      } catch {
        photoNote = " The photo couldn't be stored.";
        hasImage = existing?.hasImage ?? false;
      }
    }
    const item: Bookmark = {
      id,
      name,
      tags: bookmarkTags,
      cluster,
      kind,
      subject,
      fields,
      hasImage,
      createdAt: existing?.createdAt ?? Date.now(),
    };
    const next = existing ? bookmarks.map((entry) => (entry.id === id ? item : entry)) : [item, ...bookmarks];
    try {
      saveBookmarks(next);
    } catch {
      setSavingBookmark(false);
      setStatus("Couldn't save that bookmark. Browser storage is full.");
      return;
    }
    setBookmarks(next);
    setAssetFilter("all");
    setSavingBookmark(false);
    setBookmarkOpen(false);
    forgetPhoto();
    setStatus((existing ? `Updated “${name}”.` : `Bookmarked “${name}”.`) + photoNote);
    if (narrow()) setPane("assets");
  }

  function removeBookmark(id: string) {
    const next = bookmarks.filter((item) => item.id !== id);
    setBookmarks(next);
    saveBookmarks(next);
    setPicked((current) => current.filter((key) => key !== `b:${id}`));
    void deleteImage(id).catch(() => undefined);
    if (userId) void deleteBookmarkImage({ data: id }).catch(() => undefined);
  }

  function removeCharacter(id: string) {
    const next = characters.filter((item) => item.id !== id);
    setCharacters(next);
    saveCharacters(next);
    setPicked((current) => current.filter((key) => key !== `c:${id}`));
  }

  function togglePick(key: string) {
    setPicked((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  }

  function applySelected() {
    if (picked.length === 0) return;
    const library = [...customSnippets, ...SEED_SNIPPETS];
    let next = doc;
    let snippetSlot = slot;
    let focus = focusPath;
    let clusterId = cluster;
    let wroteSnippets = false;
    let applied = 0;
    for (const key of picked) {
      if (key.startsWith("b:")) {
        const bookmark = bookmarks.find((item) => item.id === key.slice(2));
        if (!bookmark) continue;
        if (bookmark.kind === "subject" && bookmark.subject) {
          const subject = structuredClone(bookmark.subject);
          const onlyEmpty = next.subjects.length === 1 && !subjectFilled(next.subjects[0] ?? emptySubject());
          if (onlyEmpty && !wroteSnippets) {
            next = { ...next, subjects: [subject] };
            snippetSlot = 0;
          } else {
            next = { ...next, subjects: [...next.subjects, subject] };
            snippetSlot = next.subjects.length - 1;
          }
          clusterId = "casting";
          focus = `subjects.${snippetSlot}.subject_id`;
          applied += 1;
          continue;
        }
        next = applySection(next, bookmark.cluster, bookmark.fields, snippetSlot);
        clusterId = bookmark.cluster;
        const first = clusterById(bookmark.cluster).fields[0];
        focus = first ? resolvePath(first.path, snippetSlot) : focus;
        applied += 1;
        continue;
      }
      if (key.startsWith("c:")) {
        const character = characters.find((item) => item.id === key.slice(2));
        if (!character) continue;
        const subject = structuredClone(character.subject);
        const onlyEmpty = next.subjects.length === 1 && !subjectFilled(next.subjects[0] ?? emptySubject());
        if (onlyEmpty && !wroteSnippets) {
          next = { ...next, subjects: [subject] };
          snippetSlot = 0;
        } else {
          next = { ...next, subjects: [...next.subjects, subject] };
          snippetSlot = next.subjects.length - 1;
        }
        clusterId = "casting";
        focus = `subjects.${snippetSlot}.subject_id`;
        applied += 1;
        continue;
      }
      const snippet = library.find((item) => item.id === key.slice(2));
      if (!snippet) continue;
      const placed = placeSnippet(next, snippet, snippetSlot, focus, clusterId);
      next = placed.doc;
      focus = placed.focus;
      clusterId = placed.cluster;
      wroteSnippets = true;
      applied += 1;
    }
    if (applied === 0) {
      setPicked([]);
      setStatus("Those assets are gone.");
      return;
    }
    setDoc(next);
    setSubjectIndex(snippetSlot);
    setCluster(clusterId);
    setFocusPath(focus);
    setPicked([]);
    setStatus(applied === 1 ? "Applied 1 asset." : `Applied ${applied} assets.`);
    if (narrow()) setPane("forge");
  }

  async function onCopy(kind: "json" | "line") {
    await copyText(kind === "json" ? json : toPromptLine(doc));
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1400);
  }

  function onApplyLook(look: Look) {
    const next = applyLook(doc, look, slot);
    setDoc(next);
    setUntouched(false);
    const who = doc.subjects[slot]?.subject_id.trim() || `Subject ${slot + 1}`;
    if (look.kind === "pose") {
      setCluster("posture");
      setFocusPath(`subjects.${slot}.kinetic_posture`);
      setStatus(`${look.name} applied to ${who}.`);
    } else if (look.kind === "angle") {
      setCluster("framing");
      setStatus(`${look.name} applied to the camera.`);
    } else if (look.kind === "light") {
      setCluster("key");
      setStatus(`${look.name} applied to lighting.`);
    } else if (look.kind === "wardrobe") {
      setCluster("wardrobe");
      if (look.outfitId) setAppliedOutfitId(look.outfitId);
      setStatus(`${look.name} applied to wardrobe.`);
    } else {
      setCluster("environment");
      setStatus(`${look.name} applied to the setting.`);
    }
  }

  const libraryShown = library.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const who = item.doc.subjects[0]?.subject_id.toLowerCase() ?? "";
    return item.title.toLowerCase().includes(q) || who.includes(q) || item.source.toLowerCase().includes(q);
  });

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <header className="shrink-0 border-b border-border bg-raised">
        <div className="flex items-center gap-3 px-3 py-2 lg:h-14">
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-fg">
              <Flame className="size-5" aria-hidden="true" />
            </div>
            <h1 className="text-base font-semibold tracking-tight">Prompt Forge</h1>
          </div>
          <input
            aria-label="Prompt title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-faint"
            placeholder="Untitled"
          />
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <Actions
              confirmNew={confirmNew}
              onNew={onNew}
              onSave={onSave}
              onLibrary={() => setLibraryOpen(true)}
              compact={false}
            />
            <AccountSlot />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 px-3 pb-2 lg:hidden">
          <Actions
            confirmNew={confirmNew}
            onNew={onNew}
            onSave={onSave}
            onLibrary={() => setLibraryOpen(true)}
            compact
          />
        </div>
        <AccountSlot compact />
        <div className="grid grid-cols-3 border-t border-border lg:hidden">
          {(
            [
              ["source", "Source"],
              ["forge", "Structure"],
              ["assets", "Assets"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPane(id)}
              className={cn(
                "h-11 text-sm font-medium",
                pane === id ? "border-b-2 border-primary text-primary" : "text-muted",
              )}
              aria-pressed={pane === id}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <section
          className={cn(
            "min-h-0 min-w-0 flex-col border-border lg:flex lg:w-80 lg:shrink-0 lg:border-r",
            pane === "source" ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="flex items-start justify-between gap-3 px-4 pt-4">
            <div>
              <h2 className="text-base font-medium">Source</h2>
              <p className="text-sm text-muted">A paragraph, tag soup, or your JSON.</p>
            </div>
            <button type="button" className="btn btn-ghost" onClick={loadSample}>
              Sample
            </button>
          </div>
          <div className="min-h-0 flex-1 px-4 pt-3">
            <textarea
              id="source-input"
              value={source}
              onChange={(event) => {
                setSource(event.target.value);
                setUntouched(false);
                setConfirmNew(false);
              }}
              onFocus={(event) => {
                if (untouched) event.currentTarget.select();
              }}
              placeholder="Paste a prompt or the full JSON…"
              className="field h-full min-h-48 resize-none"
              aria-label="Raw prompt"
            />
          </div>
          <div className="shrink-0 space-y-2 px-4 py-3">
            <div className="flex items-center justify-between text-xs text-faint">
              <span className="tabular-nums">{source.length} characters</span>
              <span className="hidden lg:inline">Ctrl + Enter</span>
            </div>
            <button id="parse-button" type="button" className="btn btn-primary w-full" onClick={runParse}>
              Parse & Standardize
            </button>
            <p className="text-sm text-muted" aria-live="polite">
              {status}
            </p>
          </div>
        </section>

        <section
          className={cn(
            "min-h-0 min-w-0 flex-1 flex-col",
            pane === "forge" ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="flex min-h-0 flex-1">
            <nav className="hidden w-44 shrink-0 overflow-y-auto border-r border-border lg:block" aria-label="Clusters">
              <ClusterMenu doc={doc} slot={slot} active={cluster} onPick={openCluster} />
            </nav>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              {jsonMode !== "full" ? (
                <>
              <div className="shrink-0 border-b border-border lg:hidden">
                <div className="flex gap-2 overflow-x-auto px-3 pt-3">
                  {CLUSTER_GROUPS.map((group) => {
                    const selected = active.group === group;
                    return (
                      <button
                        key={group}
                        type="button"
                        onClick={() => {
                          const first = CLUSTERS.find((item) => item.group === group);
                          if (first) openCluster(first.id);
                        }}
                        className={cn(
                          "h-11 shrink-0 rounded-full px-3 text-sm font-medium",
                          selected ? "bg-primary text-primary-fg" : "border border-border text-muted",
                        )}
                      >
                        {group === "Aesthetic DNA" ? "Aesthetic" : group}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2 overflow-x-auto px-3 py-2">
                  {CLUSTERS.filter((item) => item.group === active.group).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openCluster(item.id)}
                      className={cn(
                        "h-11 shrink-0 rounded-full px-3 text-sm",
                        item.id === cluster
                          ? "bg-surface text-primary"
                          : "border border-border text-muted",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {active.group === "Subject" ? (
                <div className="flex shrink-0 items-center gap-2 overflow-x-auto px-4 pt-3">
                  {doc.subjects.map((subject, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSubjectIndex(index)}
                      className={cn(
                        "h-11 shrink-0 rounded-full px-3 text-sm",
                        index === slot ? "bg-primary text-primary-fg" : "border border-border text-muted",
                      )}
                    >
                      {subject.subject_id.trim() || `Subject ${index + 1}`}
                    </button>
                  ))}
                  <button type="button" className="btn btn-ghost shrink-0" onClick={addSubject}>
                    <Plus className="size-4" />
                    Add
                  </button>
                  {doc.subjects.length > 1 ? (
                    <button type="button" className="btn btn-ghost shrink-0" onClick={removeSubject}>
                      Remove
                    </button>
                  ) : null}
                </div>
              ) : null}

              <div className="flex shrink-0 items-end justify-between gap-3 px-4 pt-4 pb-2">
                <div>
                  <p className="text-xs font-medium tracking-wide text-faint">{active.group}</p>
                  <h2 className="text-base font-medium">{active.label}</h2>
                </div>
                <div className="flex items-center gap-2">
                  {cluster === "casting" && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPane("assets");
                          setAssetTab("cast");
                          if (narrow()) setAssetFullscreen(true);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-400 hover:bg-purple-500/20 transition-all shadow-sm"
                      >
                        <Users className="size-3.5" />
                        <span>Exile Cast Models ({CAST_MODELS.length})</span>
                      </button>
                    </div>
                  )}
                  {(cluster === "framing" || cluster === "optics") && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPane("assets");
                          setAssetTab("camera");
                          if (narrow()) setAssetFullscreen(true);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-sm"
                      >
                        <Camera className="size-3.5" />
                        <span>Browse Camera (27)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraGalleryOpen(true)}
                        className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-foreground transition-all shadow-sm"
                      >
                        <span>Modal</span>
                      </button>
                    </div>
                  )}
                  {cluster === "key" && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPane("assets");
                          setAssetTab("lighting");
                          if (narrow()) setAssetFullscreen(true);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all shadow-sm"
                      >
                        <SunMedium className="size-3.5" />
                        <span>Browse Lighting (27)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLightingGalleryOpen(true)}
                        className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-foreground transition-all shadow-sm"
                      >
                        <span>Modal</span>
                      </button>
                    </div>
                  )}
                  {cluster === "posture" && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPane("assets");
                          setAssetTab("poses");
                          if (narrow()) setAssetFullscreen(true);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all shadow-sm"
                      >
                        <Sparkles className="size-3.5" />
                        <span>Browse Poses (36)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPoseGalleryOpen(true)}
                        className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-foreground transition-all shadow-sm"
                      >
                        <span>Modal</span>
                      </button>
                    </div>
                  )}
                  {cluster === "wardrobe" && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPane("assets");
                          setAssetTab("wardrobe");
                          setWardrobeTab("pieces");
                          if (narrow()) setAssetFullscreen(true);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all shadow-sm"
                      >
                        <Shirt className="size-3.5" />
                        <span>Browse 294 Pieces in Asset Bar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWardrobeGalleryOpen(true)}
                        className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all shadow-sm"
                      >
                        <Layers className="size-3.5" />
                        <span>Studio Modal ({WARDROBE_OUTFITS.length} Outfits)</span>
                      </button>
                    </div>
                  )}
                  <button type="button" className="btn btn-ghost" aria-label="Bookmark this section" onClick={openBookmark}>
                    <BookmarkPlus className="size-4" />
                    Bookmark
                  </button>
                  <p className="text-sm text-faint tabular-nums">{filled} filled</p>
                </div>
              </div>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4">
                {active.fields.map((field) => (
                  <FieldCard
                    key={field.path}
                    field={field}
                    doc={doc}
                    slot={slot}
                    onFocus={setFocusPath}
                    onChange={(value) => setDoc(setAt(doc, resolvePath(field.path, slot), value))}
                    onSave={() => saveField(field)}
                  />
                ))}
              </div>
                </>
              ) : null}
              <JsonBlock json={json} copied={copied} mode={jsonMode} onCopy={onCopy} onMode={setJsonMode} />
            </div>
          </div>
        </section>

        <aside
          className={cn(
            "min-h-0 min-w-0 flex-col border-border bg-bg transition-all",
            assetFullscreen
              ? "fixed inset-0 z-50 flex h-dvh w-dvw overflow-hidden bg-bg"
              : pane === "assets"
                ? "flex flex-1"
                : "hidden lg:flex lg:w-84 xl:w-96 lg:shrink-0 lg:border-l",
          )}
        >
          {/* Header */}
          <div className="shrink-0 border-b border-border bg-raised/50 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold tracking-tight text-foreground">Asset Library</h2>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {assetTab === "cast"
                      ? `${displayedCastModels.length} Models`
                      : assetTab === "wardrobe"
                        ? `${allWardrobeItems.length} Pieces · ${allWardrobeOutfits.length} Outfits`
                        : assetTab === "poses"
                          ? `${POSE_LIBRARY.length} Poses`
                          : assetTab === "lighting"
                            ? `${LIGHTING_LIBRARY.length} Setups`
                            : assetTab === "camera"
                              ? `${CAMERA_LIBRARY.length} Angles`
                              : "Saved"}
                  </span>
                </div>
                <p className="truncate text-[10px] text-muted">
                  Target: <span className="font-medium text-foreground">{doc.subjects[slot]?.subject_id.trim() || `Subject ${slot + 1}`}</span>
                </p>
              </div>

              {/* View Density & Fullscreen Controls */}
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAssetDensity(assetDensity === "compact" ? "comfortable" : "compact")}
                  className="flex size-8 items-center justify-center rounded-md border border-border bg-surface text-muted hover:border-primary/50 hover:text-foreground transition-all"
                  title={assetDensity === "compact" ? "Switch to Comfortable View (2-column)" : "Switch to Compact View (3-column)"}
                >
                  {assetDensity === "compact" ? <Grid2X2 className="size-3.5" /> : <Grid3X3 className="size-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setAssetFullscreen(!assetFullscreen)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-all shadow-xs",
                    assetFullscreen
                      ? "bg-primary text-primary-fg"
                      : "border border-border bg-surface text-muted hover:border-primary/50 hover:text-foreground",
                  )}
                  title={assetFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
                >
                  {assetFullscreen ? (
                    <>
                      <Minimize2 className="size-3.5" />
                      <span className="text-[11px]">Exit</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="size-3.5" />
                      <span className="text-[11px] hidden sm:inline">Expand</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Top-Level Asset Category Navigation Pills */}
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {[
                { id: "cast" as const, label: "Cast", icon: Users, count: CAST_MODELS.length },
                { id: "wardrobe" as const, label: "Wardrobe", icon: Shirt, count: allWardrobeItems.length },
                { id: "poses" as const, label: "Poses", icon: Sparkles, count: POSE_LIBRARY.length },
                { id: "lighting" as const, label: "Light", icon: SunMedium, count: LIGHTING_LIBRARY.length },
                { id: "camera" as const, label: "Camera", icon: Camera, count: CAMERA_LIBRARY.length },
                { id: "saved" as const, label: "Saved", icon: BookmarkIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = assetTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    data-testid={`asset-tab-${tab.id}`}
                    onClick={() => setAssetTab(tab.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all",
                      active
                        ? "bg-primary text-primary-fg shadow-xs"
                        : "border border-border bg-surface text-muted hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={cn(
                        "rounded px-1 text-[9px] font-bold tabular-nums",
                        active ? "bg-black/25 text-white" : "bg-neutral-800/60 text-muted",
                      )}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 0: EXILE CAST MODELS (27 Models) */}
          {assetTab === "cast" && (
            <>
              <div className="shrink-0 border-b border-border bg-surface/30 px-3 py-2 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted">
                    Consistent starting characters for <span className="font-semibold text-foreground">{doc.subjects[slot]?.subject_id.trim() || `Subject ${slot + 1}`}</span>
                  </p>
                  <span className="shrink-0 rounded-md bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
                    {CAST_MODELS.length} Turnarounds
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={castSearch}
                    onChange={(e) => setCastSearch(e.target.value)}
                    placeholder={`Search ${CAST_MODELS.length} Exile models (e.g. cyber, ronin, tactical, priestess)...`}
                    className="w-full rounded-md border border-border bg-bg py-1.5 pl-8 pr-7 text-xs text-foreground placeholder-muted focus:border-primary focus:outline-none"
                  />
                  {castSearch && (
                    <button
                      type="button"
                      onClick={() => setCastSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs">
                  {CAST_CATEGORIES.map((cat) => {
                    const active = castCategoryFilter === cat.id;
                    const count = cat.id === "all"
                      ? CAST_MODELS.length
                      : CAST_MODELS.filter((m) => m.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCastCategoryFilter(cat.id)}
                        className={cn(
                          "h-7 shrink-0 rounded-full px-2.5 text-[11px] font-medium transition-all flex items-center gap-1",
                          active
                            ? "bg-purple-600 text-white shadow-xs"
                            : "border border-border bg-bg text-muted hover:text-foreground",
                        )}
                      >
                        <span>{cat.label}</span>
                        <span className={cn("text-[9px] px-1 rounded-full", active ? "bg-black/30 text-white" : "text-muted")}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
                {displayedCastModels.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted">
                    <Users className="mx-auto size-8 opacity-30 mb-2" />
                    <p>No Exile models match "{castSearch}".</p>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "grid",
                      assetDensity === "compact"
                        ? "grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1.5"
                        : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2",
                    )}
                  >
                    {displayedCastModels.map((model) => (
                      <CastModelCard
                        key={model.id}
                        model={model}
                        applied={isCastModelApplied(doc, model, slot)}
                        density={assetDensity}
                        onSelect={() => handleSelectCastModel(model)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 1: WARDROBE (Pieces & Outfits) */}
          {assetTab === "wardrobe" && (
            <>
              <div className="shrink-0 border-b border-border bg-surface/30 px-3 py-2 space-y-2">
                {/* Pieces vs Outfits sub-switcher */}
                <div className="flex items-center justify-between gap-2">
                  <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-border bg-bg p-0.5 flex-1 max-w-xs">
                    <button
                      type="button"
                      onClick={() => setWardrobeTab("pieces")}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-md py-1 text-xs font-bold transition-all",
                        wardrobeTab === "pieces"
                          ? "bg-primary text-primary-fg shadow-xs"
                          : "text-muted hover:text-foreground",
                      )}
                    >
                      <Shirt className="size-3.5" />
                      <span>Pieces ({allWardrobeItems.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWardrobeTab("outfits")}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-md py-1 text-xs font-bold transition-all",
                        wardrobeTab === "outfits"
                          ? "bg-primary text-primary-fg shadow-xs"
                          : "text-muted hover:text-foreground",
                      )}
                    >
                      <Layers className="size-3.5" />
                      <span>Outfits ({allWardrobeOutfits.length})</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setWardrobeGalleryOpen(true)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all shadow-xs"
                    title="Open Fullscreen Wardrobe Studio & Custom Item Uploader"
                  >
                    <Sparkles className="size-3.5" />
                    <span>Studio</span>
                  </button>
                </div>

                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={wardrobeSearch}
                    onChange={(e) => setWardrobeSearch(e.target.value)}
                    placeholder={
                      wardrobeTab === "pieces"
                        ? "Search 294 pieces (e.g. leather, boots, cargo, hoodie)..."
                        : "Search 49 outfits (e.g. archive, coquette, streetwear)..."
                    }
                    className="w-full rounded-md border border-border bg-bg py-1.5 pl-8 pr-7 text-xs text-foreground placeholder-muted focus:border-primary focus:outline-none"
                  />
                  {wardrobeSearch && (
                    <button
                      type="button"
                      onClick={() => setWardrobeSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Slot Filter Chips for Pieces */}
                {wardrobeTab === "pieces" && (
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs">
                    {WARDROBE_SLOT_PILLS.map((pill) => {
                      const count = wardrobeSlotCounts[pill.id] ?? 0;
                      const active = wardrobeSlot === pill.id;
                      return (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => setWardrobeSlot(pill.id)}
                          className={cn(
                            "h-7 shrink-0 rounded-full px-2.5 text-[11px] font-medium transition-all",
                            active
                              ? "bg-primary text-primary-fg shadow-xs"
                              : "border border-border bg-bg text-muted hover:text-foreground",
                          )}
                        >
                          {pill.label} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Scrollable Grid of Pieces or Outfits */}
              <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
                {wardrobeTab === "pieces" ? (
                  displayedWardrobeItems.length === 0 ? (
                    <div className="py-12 text-center text-xs text-muted">
                      <Shirt className="mx-auto size-8 opacity-30 mb-2" />
                      <p>No clothing pieces match "{wardrobeSearch}".</p>
                      <button
                        type="button"
                        onClick={() => {
                          setWardrobeSearch("");
                          setWardrobeSlot("all");
                        }}
                        className="mt-2 text-xs font-semibold text-primary underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "grid",
                        assetDensity === "compact"
                          ? "grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1.5"
                          : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2",
                      )}
                    >
                      {displayedWardrobeItems.map((item) => (
                        <WardrobeItemCard
                          key={item.id}
                          item={item}
                          applied={isWardrobeItemApplied(doc, item, slot)}
                          density={assetDensity}
                          onSelect={() => handleSelectWardrobeItem(item)}
                        />
                      ))}
                    </div>
                  )
                ) : displayedWardrobeOutfits.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted">
                    <Layers className="mx-auto size-8 opacity-30 mb-2" />
                    <p>No outfits match "{wardrobeSearch}".</p>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "grid",
                      assetDensity === "compact"
                        ? "grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1.5"
                        : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2",
                    )}
                  >
                    {displayedWardrobeOutfits.map((outfit) => (
                      <WardrobeOutfitCard
                        key={outfit.id}
                        outfit={outfit}
                        applied={isWardrobeOutfitApplied(doc, outfit, slot)}
                        density={assetDensity}
                        onSelect={() => handleSelectWardrobeOutfit(outfit)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: POSES (97 Poses) */}
          {assetTab === "poses" && (
            <>
              <div className="shrink-0 border-b border-border bg-surface/30 px-3 py-2 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted">
                    Kinetic postures for {doc.subjects[slot]?.subject_id.trim() || `Subject ${slot + 1}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPoseGalleryOpen(true)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all shadow-xs"
                  >
                    <Sparkles className="size-3.5" />
                    <span>Large Gallery ({POSE_LIBRARY.length})</span>
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={poseSearch}
                    onChange={(e) => setPoseSearch(e.target.value)}
                    placeholder={`Search ${POSE_LIBRARY.length} poses (e.g. guard, casting, casual)...`}
                    className="w-full rounded-md border border-border bg-bg py-1.5 pl-8 pr-7 text-xs text-foreground placeholder-muted focus:border-primary focus:outline-none"
                  />
                  {poseSearch && (
                    <button
                      type="button"
                      onClick={() => setPoseSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs">
                  {POSE_CATEGORIES.map((cat) => {
                    const active = poseCategoryFilter === cat.id;
                    const count = cat.id === "all"
                      ? POSE_LIBRARY.length
                      : POSE_LIBRARY.filter((p) => p.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setPoseCategoryFilter(cat.id)}
                        className={cn(
                          "h-7 shrink-0 rounded-full px-2.5 text-[11px] font-medium transition-all flex items-center gap-1",
                          active
                            ? "bg-primary text-primary-fg shadow-xs"
                            : "border border-border bg-bg text-muted hover:text-foreground",
                        )}
                      >
                        <span>{cat.label}</span>
                        <span className={cn("text-[9px] px-1 rounded-full", active ? "bg-black/30 text-white" : "text-muted")}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
                {displayedPoses.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted">
                    <Sparkles className="mx-auto size-8 opacity-30 mb-2" />
                    <p>No poses match "{poseSearch}".</p>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "grid",
                      assetDensity === "compact"
                        ? "grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1.5"
                        : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2",
                    )}
                  >
                    {displayedPoses.map((pose) => (
                      <PoseCard
                        key={pose.id}
                        pose={pose}
                        applied={isPoseApplied(doc, pose, slot)}
                        density={assetDensity}
                        onSelect={() => handleSelectPose(pose)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 3: LIGHTING (27 Setups) */}
          {assetTab === "lighting" && (
            <>
              <div className="shrink-0 border-b border-border bg-surface/30 px-3 py-2 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted">
                    Lighting architecture (style, key fixture, shadow depth)
                  </p>
                  <button
                    type="button"
                    onClick={() => setLightingGalleryOpen(true)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all shadow-xs"
                  >
                    <SunMedium className="size-3.5" />
                    <span>Studio ({LIGHTING_LIBRARY.length})</span>
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={lightingSearch}
                    onChange={(e) => setLightingSearch(e.target.value)}
                    placeholder="Search 27 lighting setups (e.g. rembrandt, chiaroscuro, neon)..."
                    className="w-full rounded-md border border-border bg-bg py-1.5 pl-8 pr-7 text-xs text-foreground placeholder-muted focus:border-primary focus:outline-none"
                  />
                  {lightingSearch && (
                    <button
                      type="button"
                      onClick={() => setLightingSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs">
                  {LIGHTING_CATEGORIES.map((cat) => {
                    const active = lightingCategoryFilter === cat.id;
                    const count = cat.id === "all"
                      ? LIGHTING_LIBRARY.length
                      : LIGHTING_LIBRARY.filter((item) => item.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setLightingCategoryFilter(cat.id)}
                        className={cn(
                          "h-7 shrink-0 rounded-full px-2.5 text-[11px] font-medium transition-all flex items-center gap-1",
                          active
                            ? "bg-primary text-primary-fg shadow-xs"
                            : "border border-border bg-bg text-muted hover:text-foreground",
                        )}
                      >
                        <span>{cat.label.replace(/\s*\(\d+\)/, "")}</span>
                        <span className={cn("text-[9px] px-1 rounded-full", active ? "bg-black/30 text-white" : "text-muted")}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
                {displayedLighting.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted">
                    <SunMedium className="mx-auto size-8 opacity-30 mb-2" />
                    <p>No lighting setups match "{lightingSearch}".</p>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "grid",
                      assetDensity === "compact"
                        ? "grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1.5"
                        : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2",
                    )}
                  >
                    {displayedLighting.map((item) => (
                      <LightingCard
                        key={item.id}
                        item={item}
                        applied={isLightingApplied(doc, item)}
                        density={assetDensity}
                        onSelect={() => handleSelectLighting(item)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 4: CAMERA & ANGLES (27 Angles & Optics) */}
          {assetTab === "camera" && (
            <>
              <div className="shrink-0 border-b border-border bg-surface/30 px-3 py-2 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted">
                    Framing doctrine, elevation & lens optics
                  </p>
                  <button
                    type="button"
                    onClick={() => setCameraGalleryOpen(true)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-xs"
                  >
                    <Camera className="size-3.5" />
                    <span>Studio ({CAMERA_LIBRARY.length})</span>
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={cameraSearch}
                    onChange={(e) => setCameraSearch(e.target.value)}
                    placeholder="Search 27 camera angles (e.g. low angle, dutch, 85mm)..."
                    className="w-full rounded-md border border-border bg-bg py-1.5 pl-8 pr-7 text-xs text-foreground placeholder-muted focus:border-primary focus:outline-none"
                  />
                  {cameraSearch && (
                    <button
                      type="button"
                      onClick={() => setCameraSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs">
                  {CAMERA_CATEGORIES.map((cat) => {
                    const active = cameraCategoryFilter === cat.id;
                    const count = cat.id === "all"
                      ? CAMERA_LIBRARY.length
                      : CAMERA_LIBRARY.filter((item) => item.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCameraCategoryFilter(cat.id)}
                        className={cn(
                          "h-7 shrink-0 rounded-full px-2.5 text-[11px] font-medium transition-all flex items-center gap-1",
                          active
                            ? "bg-primary text-primary-fg shadow-xs"
                            : "border border-border bg-bg text-muted hover:text-foreground",
                        )}
                      >
                        <span>{cat.label.replace(/\s*\(\d+\)/, "")}</span>
                        <span className={cn("text-[9px] px-1 rounded-full", active ? "bg-black/30 text-white" : "text-muted")}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
                {displayedCamera.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted">
                    <Camera className="mx-auto size-8 opacity-30 mb-2" />
                    <p>No camera angles match "{cameraSearch}".</p>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "grid",
                      assetDensity === "compact"
                        ? "grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1.5"
                        : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2",
                    )}
                  >
                    {displayedCamera.map((item) => (
                      <CameraCard
                        key={item.id}
                        item={item}
                        applied={isCameraApplied(doc, item)}
                        density={assetDensity}
                        onSelect={() => handleSelectCamera(item)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 5: SAVED & BOOKMARKS */}
          {assetTab === "saved" && (
            <>
              <div className="shrink-0 border-b border-border bg-surface/30 px-3 py-2 space-y-2">
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs">
                  {[
                    { id: "all", label: "All Saved" },
                    ...knownTags.map((tag) => ({ id: tag.toLowerCase(), label: tag })),
                    { id: "pieces", label: "Snippets" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAssetFilter(item.id)}
                      aria-pressed={assetFilter === item.id}
                      className={cn(
                        "h-7 shrink-0 rounded-full px-2.5 text-[11px] font-medium transition-all",
                        assetFilter === item.id
                          ? "bg-primary text-primary-fg shadow-xs"
                          : "border border-border bg-bg text-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {assetFilter === "pieces" && (
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs">
                    {FILTERS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFilter(item.id)}
                        className={cn(
                          "h-6 shrink-0 rounded-full px-2 text-[10px] font-medium transition-all",
                          filter === item.id
                            ? "bg-primary text-primary-fg shadow-xs"
                            : "border border-border bg-bg text-muted hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-2.5 space-y-2">
                {assetFilter === "pieces" ? (
                  snippets.map((snippet) => {
                    const key = `s:${snippet.id}`;
                    return (
                      <AssetCard
                        key={snippet.id}
                        eyebrow={snippet.category === "note" ? "Note" : clusterById(snippet.category).label}
                        title={snippet.title}
                        body={snippet.body}
                        picked={picked.includes(key)}
                        onPick={() => togglePick(key)}
                        onDelete={snippet.custom ? () => removeSnippet(snippet.id) : undefined}
                      />
                    );
                  })
                ) : shownBookmarks.length === 0 && (assetFilter !== "all" || characters.length === 0) ? (
                  <p className="py-8 text-center text-xs text-muted">
                    {assetFilter === "all"
                      ? "Nothing bookmarked yet. Use Bookmark on any open section in Structure."
                      : "Nothing uses that tag yet."}
                  </p>
                ) : (
                  <>
                    {shownBookmarks.map((bookmark) => {
                      const key = `b:${bookmark.id}`;
                      const body =
                        bookmark.kind === "subject" && bookmark.subject
                          ? characterBlurb(bookmark.subject)
                          : sectionBlurb(bookmark.fields);
                      return (
                        <AssetCard
                          key={bookmark.id}
                          eyebrow={bookmark.kind === "subject" ? "Subject" : clusterById(bookmark.cluster).label}
                          title={bookmark.name}
                          body={body || "No details yet"}
                          tags={bookmark.tags}
                          imageId={bookmark.hasImage ? bookmark.id : undefined}
                          remote={Boolean(userId)}
                          picked={picked.includes(key)}
                          onPick={() => togglePick(key)}
                          onDelete={() => removeBookmark(bookmark.id)}
                        />
                      );
                    })}
                    {assetFilter === "all" &&
                      characters.map((character) => {
                        const key = `c:${character.id}`;
                        return (
                          <AssetCard
                            key={character.id}
                            eyebrow="Character"
                            title={character.name}
                            body={characterBlurb(character.subject) || "No details yet"}
                            picked={picked.includes(key)}
                            onPick={() => togglePick(key)}
                            onDelete={() => removeCharacter(character.id)}
                          />
                        );
                      })}
                  </>
                )}
              </div>

              <div className="shrink-0 border-t border-border bg-raised/30 p-2.5">
                <div className="flex items-center gap-2">
                  <p className="mr-auto text-xs text-muted tabular-nums">{picked.length} selected</p>
                  {picked.length > 0 && (
                    <button type="button" className="btn btn-ghost text-xs" onClick={() => setPicked([])}>
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-primary text-xs"
                    disabled={picked.length === 0}
                    onClick={applySelected}
                  >
                    Apply Selected
                  </button>
                </div>

                {assetFilter === "pieces" && (
                  <div className="mt-2 border-t border-border pt-2">
                    {adding ? (
                      <form
                        className="space-y-1.5"
                        onSubmit={(event) => {
                          event.preventDefault();
                          addSnippet();
                        }}
                      >
                        <input
                          aria-label="Snippet title"
                          value={draftTitle}
                          onChange={(event) => setDraftTitle(event.target.value)}
                          placeholder="Title"
                          className="field text-xs py-1"
                        />
                        <select
                          aria-label="Snippet cluster"
                          value={draftCategory}
                          onChange={(event) => setDraftCategory(event.target.value as SnippetCategory)}
                          className="field text-xs py-1"
                        >
                          {CLUSTERS.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.group} — {item.label}
                            </option>
                          ))}
                          <option value="note">Note — inserts into the open field</option>
                        </select>
                        <textarea
                          aria-label="Snippet text"
                          value={draftBody}
                          onChange={(event) => setDraftBody(event.target.value)}
                          placeholder="Reusable text"
                          rows={2}
                          className="field resize-y text-xs"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="btn btn-primary flex-1 text-xs"
                            disabled={!draftTitle.trim() || !draftBody.trim()}
                          >
                            Save snippet
                          </button>
                          <button type="button" className="btn btn-ghost text-xs" onClick={() => setAdding(false)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button type="button" className="btn btn-ghost w-full text-xs" onClick={() => setAdding(true)}>
                        <Plus className="size-3.5" />
                        New snippet
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </aside>

      </div>

      {bookmarkOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 lg:items-center lg:p-6" onClick={closeBookmark}>
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="bookmark-title"
            className="flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-t-xl border border-border bg-raised lg:rounded-xl"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              void commitBookmark();
            }}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <h2 id="bookmark-title" className="text-base font-medium">
                Bookmark {active.group === "Subject" ? "subject" : active.label}
              </h2>
              <button
                type="button"
                className="ml-auto flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-fg"
                aria-label="Close bookmark"
                onClick={closeBookmark}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <p className="text-sm text-muted">
                {active.group === "Subject"
                  ? "Saves this whole subject. The photo stays on the card and is not sent with the prompt."
                  : `Saves ${active.label} as it is right now. Applying it replaces that section. The photo is only for you.`}
              </p>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Name</span>
                <input
                  aria-label="Bookmark name"
                  value={bookmarkName}
                  onChange={(event) => setBookmarkName(event.target.value)}
                  className="field"
                />
              </label>
              <div className="space-y-2">
                <span className="text-sm font-medium">Tags</span>
                <div className="flex gap-2">
                  <input
                    aria-label="New tag"
                    value={tagDraft}
                    onChange={(event) => setTagDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === ",") {
                        event.preventDefault();
                        addTag(tagDraft);
                      }
                    }}
                    placeholder="Type a tag"
                    className="field"
                  />
                  <button type="button" className="btn btn-ghost shrink-0" onClick={() => addTag(tagDraft)}>
                    Add
                  </button>
                </div>
                {bookmarkTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {bookmarkTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-3 text-sm font-medium text-primary-fg"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="size-3.5" />
                        <span className="sr-only">Remove {tag}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-faint">No tags yet. Add one, or tap a tag you already use.</p>
                )}
                {knownTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {knownTags.map((tag) => {
                      const on = bookmarkTags.some((item) => item.toLowerCase() === tag.toLowerCase());
                      return (
                        <button
                          key={tag}
                          type="button"
                          aria-pressed={on}
                          className={cn(
                            "h-11 rounded-full px-3 text-sm font-medium",
                            on ? "bg-primary text-primary-fg" : "border border-border bg-surface text-muted",
                          )}
                          onClick={() => (on ? removeTag(tag) : addTag(tag))}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Photo</span>
                {photoPreview ? (
                  <img src={photoPreview} alt="" className="h-36 w-full rounded-lg object-cover" />
                ) : null}
                <div className="flex gap-2">
                  <label className="btn btn-ghost flex-1">
                    <ImagePlus className="size-4" />
                    {photoPreview ? "Replace photo" : "Add photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        void onPhoto(file);
                      }}
                    />
                  </label>
                  {photoPreview ? (
                    <button type="button" className="btn btn-ghost" onClick={forgetPhoto}>
                      Remove
                    </button>
                  ) : null}
                </div>
                {photoError ? <p className="text-sm text-muted">{photoError}</p> : null}
              </div>
            </div>
            <div className="border-t border-border p-3">
              <button type="submit" className="btn btn-primary w-full" disabled={!bookmarkName.trim() || savingBookmark}>
                {savingBookmark ? "Saving" : "Save bookmark"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {libraryOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-bg/80" onClick={() => setLibraryOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="library-title"
            className="flex h-full w-full max-w-md flex-col border-l border-border bg-raised"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <h2 id="library-title" className="text-base font-medium">
                Library
              </h2>
              <button
                type="button"
                className="ml-auto flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-fg"
                aria-label="Close library"
                onClick={() => setLibraryOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="px-4 py-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
                <input
                  aria-label="Search library"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search saved prompts"
                  className="field pl-9"
                />
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              {library.length === 0 ? (
                <p className="text-sm text-muted">Nothing saved yet. Parse a prompt, then use Save to library.</p>
              ) : libraryShown.length === 0 ? (
                <p className="text-sm text-muted">No prompts match that search.</p>
              ) : (
                <ul className="space-y-2">
                  {libraryShown.map((item) => (
                    <li key={item.id} className="rounded-lg border border-border bg-surface">
                      <button type="button" onClick={() => onLoad(item)} className="w-full px-3 py-3 text-left">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted">
                          {item.doc.subjects[0]?.subject_id || "No subject yet"}
                        </p>
                        <p className="mt-2 text-xs text-faint tabular-nums">{formatWhen(item.updatedAt)}</p>
                      </button>
                      <div className="flex justify-end border-t border-border">
                        <button
                          type="button"
                          className="h-11 px-3 text-sm text-muted hover:text-fg"
                          onClick={() => onDelete(item.id)}
                        >
                          {pendingDelete === item.id ? "Confirm delete" : "Delete"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
      <PoseCatalogModal
        isOpen={poseGalleryOpen}
        onClose={() => setPoseGalleryOpen(false)}
        onSelectPose={(pose: PoseItem) => {
          const matchedLook = LOOKS.find((l) => l.id === pose.id);
          if (matchedLook) {
            onApplyLook(matchedLook);
          } else {
            const dynamicLook: Look = {
              id: pose.id,
              name: pose.name,
              kind: "pose",
              posture: pose.posture,
              props: pose.props,
              category: pose.category,
              stance: pose.stance,
            };
            onApplyLook(dynamicLook);
          }
        }}
        activePosture={doc.subjects[slot]?.kinetic_posture}
      />
      <CameraCatalogModal
        isOpen={cameraGalleryOpen}
        onClose={() => setCameraGalleryOpen(false)}
        onSelectCamera={(item: CameraItem) => {
          const matchedLook = LOOKS.find((l) => l.id === item.id);
          if (matchedLook) {
            onApplyLook(matchedLook);
          } else {
            const dynamicLook: Look = {
              id: item.id,
              name: item.name,
              subtitle: item.subtitle,
              kind: "angle",
              principle: item.principle,
              axis: item.axis,
              lens: item.lens,
              dof: item.dof,
              badge: item.badge,
            };
            onApplyLook(dynamicLook);
          }
        }}
        activePrinciple={doc.scene_composition.framing_doctrine.named_principle}
      />
      <LightingCatalogModal
        isOpen={lightingGalleryOpen}
        onClose={() => setLightingGalleryOpen(false)}
        onSelectLighting={(item: LightingItem) => {
          const matchedLook = LOOKS.find((l) => l.id === item.id);
          if (matchedLook) {
            onApplyLook(matchedLook);
          } else {
            const dynamicLook: Look = {
              id: item.id,
              name: item.name,
              subtitle: item.subtitle,
              kind: "light",
              style: item.style,
              fixture: item.fixture,
              lightAngle: item.angle,
              shadow: item.shadow,
              practical: item.practical,
              badge: item.badge,
            };
            onApplyLook(dynamicLook);
          }
        }}
        activeStyle={doc.aesthetic_dna.lighting_architecture.lighting_style}
      />
      <WardrobeCatalogModal
        isOpen={wardrobeGalleryOpen}
        onClose={() => setWardrobeGalleryOpen(false)}
        onSelectOutfit={(outfit: WardrobeOutfit) => {
          const updated = applyWardrobeOutfit(doc, outfit, slot);
          setDoc(updated);
          setAppliedOutfitId(outfit.id);
          setCluster("wardrobe");
          setStatus(`${outfit.name} applied to all wardrobe fields.`);
        }}
        onSelectItem={(item: WardrobeItem) => {
          const updated = applyWardrobeItem(doc, item, slot);
          setDoc(updated);
          setCluster("wardrobe");
          const slotLabel = item.slot.replace("_", " ");
          setStatus(`${item.name} applied to ${slotLabel}.`);
        }}
        appliedOutfitId={appliedOutfitId}
        activeOuterwear={doc.subjects[slot]?.wardrobe_architecture?.layering_system?.outerwear}
        activeBaseLayer={doc.subjects[slot]?.wardrobe_architecture?.layering_system?.base_layer}
        activeFootwear={doc.subjects[slot]?.wardrobe_architecture?.footwear}
      />
    </div>
  );
}

function ClusterMenu({
  doc,
  slot,
  active,
  onPick,
}: {
  doc: PromptDoc;
  slot: number;
  active: ClusterId;
  onPick: (id: ClusterId) => void;
}) {
  return (
    <div className="py-2">
      {CLUSTER_GROUPS.map((group) => (
        <div key={group} className="pb-2">
          <p className="px-3 pt-3 pb-1 text-xs font-medium tracking-wide text-faint">{group}</p>
          {CLUSTERS.filter((item) => item.group === group).map((item) => {
            const on = item.id === active;
            const filled = clusterHasContent(doc, item, slot);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onPick(item.id)}
                className={cn(
                  "flex h-11 w-full items-center gap-2 px-3 text-left text-sm",
                  on ? "bg-surface font-medium text-primary" : "text-muted hover:bg-surface hover:text-fg",
                )}
                aria-current={on ? "true" : undefined}
              >
                <span className={cn("size-1.5 shrink-0 rounded-full", filled ? "bg-primary" : "bg-border")} />
                {item.label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function FieldCard({
  field,
  doc,
  slot,
  onFocus,
  onChange,
  onSave,
}: {
  field: FieldDef;
  doc: PromptDoc;
  slot: number;
  onFocus: (path: string) => void;
  onChange: (value: string | string[]) => void;
  onSave: () => void;
}) {
  const path = resolvePath(field.path, slot);
  const value = getAt(doc, path);
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor={path} className="text-sm font-medium">
          {field.label}
        </label>
        <button
          type="button"
          className="ml-auto flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
          aria-label={`Save ${field.label} to assets`}
          onClick={onSave}
        >
          <BookmarkIcon className="size-4" />
        </button>
      </div>
      {field.kind === "palette" && Array.isArray(value) ? (
        <PaletteField colors={value} onChange={onChange} />
      ) : field.kind === "list" && Array.isArray(value) ? (
        <textarea
          id={path}
          data-path={path}
          rows={field.rows}
          value={value.join("\n")}
          placeholder={field.hint}
          onFocus={() => onFocus(path)}
          onChange={(event) => onChange(event.target.value.split("\n"))}
          onBlur={(event) =>
            onChange(
              event.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            )
          }
          className="field resize-y"
        />
      ) : (
        <textarea
          id={path}
          data-path={path}
          rows={field.rows}
          value={typeof value === "string" ? value : ""}
          placeholder={field.hint}
          onFocus={() => onFocus(path)}
          onChange={(event) => onChange(event.target.value)}
          className="field resize-y"
        />
      )}
    </div>
  );
}

function PaletteField({
  colors,
  onChange,
}: {
  colors: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {colors.length === 0 ? <p className="text-sm text-faint">No swatches yet.</p> : null}
      {colors.map((hex, index) => (
        <div key={`${hex}-${index}`} className="flex items-center gap-2">
          <input
            aria-label={`Palette color ${index + 1}`}
            type="color"
            value={safeHex(hex)}
            onChange={(event) => {
              const next = [...colors];
              next[index] = event.target.value.toUpperCase();
              onChange(next);
            }}
            className="size-11 shrink-0 rounded-md border border-border bg-bg"
          />
          <input
            aria-label={`Hex ${index + 1}`}
            value={hex}
            onChange={(event) => {
              const next = [...colors];
              next[index] = event.target.value;
              onChange(next);
            }}
            className="field font-mono"
          />
          <button
            type="button"
            aria-label={`Remove color ${index + 1}`}
            className="flex size-11 items-center justify-center text-muted hover:text-fg"
            onClick={() => onChange(colors.filter((_, item) => item !== index))}
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-ghost" onClick={() => onChange([...colors, "#C46A3A"])}>
        <Plus className="size-4" />
        Add swatch
      </button>
    </div>
  );
}

function AccountSlot({ compact = false }: { compact?: boolean }) {
  const { isPending } = useCurrentUserState();
  if (isPending) return compact ? null : <div className="h-11 w-24 animate-pulse rounded-md bg-surface" />;
  if (compact) {
    return (
      <div className="border-t border-border px-3 py-2 lg:hidden">
        <SignedOut>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted">Sign in to keep this in your account.</p>
            <Link to="/login" className="btn btn-primary shrink-0">
              Sign in
            </Link>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    );
  }
  return (
    <>
      <SignedOut>
        <Link to="/login" className="btn btn-ghost">
          Sign in
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}

function AssetCard({
  eyebrow,
  title,
  body,
  tags,
  imageId,
  remote = false,
  picked,
  onPick,
  onDelete,
}: {
  eyebrow: string;
  title: string;
  body: string;
  tags?: string[];
  imageId?: string;
  remote?: boolean;
  picked: boolean;
  onPick: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className={cn("rounded-lg border bg-surface", picked ? "border-primary" : "border-border")}>
      <button type="button" onClick={onPick} aria-pressed={picked} className="flex w-full items-start gap-3 px-3 py-3 text-left">
        {imageId ? <BookmarkPhoto id={imageId} remote={remote} /> : null}
        <span className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-wide text-primary">{eyebrow}</p>
          <p className="mt-1 text-sm font-medium">{title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{body}</p>
          {tags && tags.length > 0 ? <p className="mt-1 text-xs text-faint">{tags.join(" · ")}</p> : null}
        </span>
        <PickMark on={picked} />
      </button>
      {onDelete ? (
        <div className="flex justify-end border-t border-border">
          <button
            type="button"
            className="flex size-11 items-center justify-center text-muted hover:text-fg"
            aria-label={`Delete ${title}`}
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function BookmarkPhoto({ id, remote }: { id: string; remote: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    let objectUrl = "";
    const load = remote
      ? loadBookmarkImage({ data: id }).then((data) => (data ? base64ToBlob(data) : loadImage(id)))
      : loadImage(id);
    load
      .then((blob) => {
        if (!alive || !blob) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, remote]);
  if (!url) return <span className="size-14 shrink-0 rounded-md bg-bg" />;
  return <img src={url} alt="" className="size-14 shrink-0 rounded-md object-cover" />;
}

function PickMark({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
        on ? "border-primary bg-primary text-primary-fg" : "border-border bg-bg",
      )}
      aria-hidden="true"
    >
      {on ? <Check className="size-3" /> : null}
    </span>
  );
}

function Actions({
  confirmNew,
  onNew,
  onSave,
  onLibrary,
  compact,
}: {
  confirmNew: boolean;
  onNew: () => void;
  onSave: () => void;
  onLibrary: () => void;
  compact: boolean;
}) {
  return (
    <>
      <button type="button" className={cn("btn btn-ghost", compact && "w-full px-2")} onClick={onNew} aria-label="New prompt">
        <FilePlus className="size-4" />
        {confirmNew ? "Discard?" : compact ? "New" : "New prompt"}
      </button>
      <button
        type="button"
        className={cn("btn btn-ghost", compact && "w-full px-2")}
        onClick={onSave}
        aria-label="Save to library"
      >
        <BookmarkIcon className="size-4" />
        {compact ? "Save" : "Save to library"}
      </button>
      <button
        type="button"
        className={cn("btn btn-ghost", compact && "w-full px-2")}
        onClick={onLibrary}
        aria-label="Open library"
      >
        <Library className="size-4" />
        Library
      </button>
    </>
  );
}

function JsonBlock({
  json,
  copied,
  mode,
  onCopy,
  onMode,
}: {
  json: string;
  copied: Copied;
  mode: JsonMode;
  onCopy: (kind: "json" | "line") => void;
  onMode: (mode: JsonMode) => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden border-t border-border bg-bg",
        mode === "peek" && "h-52 shrink-0",
        mode === "full" && "min-h-0 flex-1",
        mode === "hidden" && "shrink-0",
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center gap-2 px-3 py-2">
        <div className="mr-auto">
          <p className="text-xs font-medium tracking-wide text-muted">JSON</p>
          <p className="text-xs text-faint">
            {mode === "full" ? "Full document" : mode === "hidden" ? "Hidden" : "Live — a fraction"}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost w-11 px-0"
          aria-label={mode === "hidden" ? "Show JSON" : "Hide JSON"}
          onClick={() => onMode(mode === "hidden" ? "peek" : "hidden")}
        >
          {mode === "hidden" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        <button
          type="button"
          className="btn btn-ghost w-11 px-0"
          aria-label={mode === "full" ? "Show a fraction of the JSON" : "Show the full JSON"}
          onClick={() => onMode(mode === "full" ? "peek" : "full")}
        >
          {mode === "full" ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
        {mode === "hidden" ? null : (
          <>
            <button type="button" className="btn btn-ghost" onClick={() => onCopy("line")}>
              {copied === "line" ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied === "line" ? "Copied" : "Copy line"}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onCopy("json")}>
              {copied === "json" ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied === "json" ? "Copied" : "Copy JSON"}
            </button>
          </>
        )}
      </div>
      {mode === "hidden" ? null : (
        <pre
          id="json-output"
          className="min-h-0 flex-1 overflow-auto px-4 pb-4 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap"
        >
          {json.split("\n").map((line, index) => (
            <div key={index}>{colorLine(line)}</div>
          ))}
        </pre>
      )}
    </div>
  );
}

function colorLine(line: string) {
  const match = line.match(/^(\s*)("(?:\\.|[^"\\])*")(\s*:\s*)(.*)$/);
  if (!match) return <span className="text-faint">{line}</span>;
  return (
    <>
      {match[1]}
      <span className="text-primary">{match[2]}</span>
      <span className="text-faint">{match[3]}</span>
      <span className="text-fg">{match[4]}</span>
    </>
  );
}
