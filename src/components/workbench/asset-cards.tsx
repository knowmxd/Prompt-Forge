import { Check } from "lucide-react";
import { CatalogItemImage, CatalogOutfitImage } from "@/components/wardrobe-catalog-modal";
import { PoseCardVisual } from "@/components/pose-art";
import type { WardrobeItem, WardrobeOutfit } from "@/lib/prompt/wardrobe-database";
import type { PoseItem } from "@/lib/prompt/pose-database";
import type { LightingItem } from "@/lib/prompt/lighting-database";
import type { CameraItem } from "@/lib/prompt/camera-database";
import type { CastModelItem } from "@/lib/prompt/cast-database";
import type { StyleGuideItem } from "@/lib/prompt/style-database";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function WardrobeItemCard({
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

export function WardrobeOutfitCard({
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

export function PoseCard({
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
          <PoseCardVisual
            image={pose.image}
            id={pose.id}
            name={pose.name}
            subtitle={pose.subtitle}
            category={pose.category}
            stance={pose.stance}
            active={applied}
          />
          {applied && (
            <span className="absolute top-1 right-1 z-20 flex size-4 items-center justify-center rounded-full bg-amber-500 text-black shadow font-bold">
              <Check className="size-2.5 stroke-[3]" />
            </span>
          )}
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
        <PoseCardVisual
          image={pose.image}
          id={pose.id}
          name={pose.name}
          subtitle={pose.subtitle}
          category={pose.category}
          stance={pose.stance}
          active={applied}
        />
        {applied && (
          <span className="absolute top-1.5 right-1.5 z-20 flex size-5 items-center justify-center rounded-full bg-amber-500 text-black shadow font-bold">
            <Check className="size-3 stroke-[3]" />
          </span>
        )}
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

export function LightingCard({
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

export function CameraCard({
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

export function CastModelCard({
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

export function StyleCard({
  item,
  applied,
  density,
  onSelect,
}: {
  item: StyleGuideItem;
  applied: boolean;
  density: "comfortable" | "compact";
  onSelect: () => void;
}) {
  if (density === "compact") {
    return (
      <button
        type="button"
        onClick={onSelect}
        title={`${item.name} (${item.badge}) - Click to apply Aesthetic DNA`}
        aria-pressed={applied}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-lg border bg-surface text-left transition-all hover:border-primary/60 hover:shadow-xs",
          applied ? "border-fuchsia-500 ring-2 ring-fuchsia-500/40" : "border-border",
        )}
      >
        <div className="relative aspect-square w-full bg-neutral-900/60 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform group-hover:scale-105"
          />
          <span className="absolute top-1 left-1 rounded bg-black/80 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-fuchsia-300">
            {item.badge}
          </span>
          {applied && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-fuchsia-500 text-white shadow font-bold">
              <Check className="size-2.5 stroke-[3]" />
            </span>
          )}
          <div className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded-full bg-black/75 px-1 py-0.5">
            {item.dominant_palette.slice(0, 4).map((hex) => (
              <span key={hex} className="size-2 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
            ))}
          </div>
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
        applied ? "border-fuchsia-500 ring-2 ring-fuchsia-500/40" : "border-border",
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-neutral-900/60 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform group-hover:scale-105"
        />
        <span className="absolute top-1.5 left-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-fuchsia-300">
          {item.badge}
        </span>
        {applied && (
          <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-fuchsia-500 text-white shadow font-bold">
            <Check className="size-3 stroke-[3]" />
          </span>
        )}
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-black/75 px-1.5 py-0.5 border border-white/10">
          {item.dominant_palette.map((hex) => (
            <span key={hex} title={hex} className="size-2.5 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
          ))}
        </div>
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
          <span className={cn("text-[10px] font-semibold", applied ? "text-fuchsia-400" : "text-primary group-hover:underline")}>
            {applied ? "Applied" : "+ Apply DNA"}
          </span>
        </div>
      </div>
    </button>
  );
}
