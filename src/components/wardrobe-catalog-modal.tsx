import { useState, useMemo, useEffect } from "react";
import {
  X,
  Search,
  Check,
  Shirt,
  Filter,
  Sparkles,
  Layers,
  Tag,
  Plus,
  Trash2,
} from "lucide-react";
import {
  WARDROBE_SLOTS,
  WARDROBE_ITEMS,
  WARDROBE_OUTFITS,
  STYLE_TAG_VOCABULARY,
  type WardrobeSlot,
  type WardrobeItem,
  type WardrobeOutfit,
  filterWardrobeItems,
  filterWardrobeOutfits,
  combineWardrobeItems,
  combineWardrobeOutfits,
} from "@/lib/prompt/wardrobe-database";
import {
  loadCustomItems,
  loadCustomOutfits,
  deleteCustomItem,
  deleteCustomOutfit,
  CUSTOM_LIBRARY_CHANGE_EVENT,
} from "@/lib/prompt/custom-library-store";
import { AddLibraryItemModal } from "./add-library-item-modal";

type WardrobeCatalogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectOutfit: (outfit: WardrobeOutfit) => void;
  onSelectItem: (item: WardrobeItem) => void;
  appliedOutfitId?: string | null;
  activeOuterwear?: string;
  activeBaseLayer?: string;
  activeFootwear?: string;
};

export function CatalogItemImage({ item }: { item: WardrobeItem }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white p-3 text-center select-none">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 shadow-sm border border-neutral-200/60 mb-2 group-hover:scale-110 transition-transform">
          <Shirt className="h-6 w-6 stroke-[1.5]" />
        </div>
        <span className="text-[11px] font-semibold text-neutral-800 line-clamp-1 max-w-[90%]">
          {item.name}
        </span>
        <div className="mt-1 flex items-center gap-1">
          <span className="text-[9px] font-medium text-neutral-500 capitalize">
            {item.colors[0] || item.subcategory}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={item.image}
      alt={item.name}
      loading="lazy"
      onError={() => setHasError(true)}
      className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
    />
  );
}

export function CatalogOutfitImage({ outfit }: { outfit: WardrobeOutfit }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white p-3 text-center select-none">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-rose-50 text-rose-500 shadow-sm border border-rose-200/60 mb-2 group-hover:scale-110 transition-transform">
          <Layers className="h-7 w-7 stroke-[1.5]" />
        </div>
        <span className="text-xs font-semibold text-neutral-800 line-clamp-2 max-w-[90%]">
          {outfit.name}
        </span>
      </div>
    );
  }

  return (
    <img
      src={outfit.image}
      alt={outfit.name}
      loading="lazy"
      onError={() => setHasError(true)}
      className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
    />
  );
}

export function WardrobeCatalogModal({
  isOpen,
  onClose,
  onSelectOutfit,
  onSelectItem,
  appliedOutfitId,
  activeOuterwear,
  activeBaseLayer,
  activeFootwear,
}: WardrobeCatalogModalProps) {
  const [tab, setTab] = useState<"outfits" | "items">("outfits");
  const [slot, setSlot] = useState<WardrobeSlot | "all">("all");
  const [selectedTag, setSelectedTag] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null);
  const [justAppliedMsg, setJustAppliedMsg] = useState<string>("");

  // Custom user-uploaded pieces & outfits
  const [customItems, setCustomItems] = useState<WardrobeItem[]>([]);
  const [customOutfits, setCustomOutfits] = useState<WardrobeOutfit[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !addModalOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, addModalOpen]);

  // Load custom items & subscribe to updates
  useEffect(() => {
    async function refreshCustom() {
      const [items, outfits] = await Promise.all([loadCustomItems(), loadCustomOutfits()]);
      setCustomItems(items);
      setCustomOutfits(outfits);
    }
    if (isOpen) {
      refreshCustom();
    }
    window.addEventListener(CUSTOM_LIBRARY_CHANGE_EVENT, refreshCustom);
    return () => window.removeEventListener(CUSTOM_LIBRARY_CHANGE_EVENT, refreshCustom);
  }, [isOpen]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Merge built-in + user custom items & outfits
  const allOutfits = useMemo(() => {
    return combineWardrobeOutfits(WARDROBE_OUTFITS, customOutfits);
  }, [customOutfits]);

  const allItems = useMemo(() => {
    return combineWardrobeItems(WARDROBE_ITEMS, customItems);
  }, [customItems]);

  // Filtered outfits
  const filteredOutfits = useMemo(() => {
    return filterWardrobeOutfits(
      allOutfits,
      query,
      selectedTag === "all" ? undefined : selectedTag,
    );
  }, [allOutfits, query, selectedTag]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return filterWardrobeItems(
      allItems,
      query,
      slot,
      selectedTag === "all" ? undefined : selectedTag,
    );
  }, [allItems, query, slot, selectedTag]);

  // Frequently used tags for quick filter chips (including custom if present)
  const prominentTags = useMemo(() => {
    const counts: Record<string, number> = {};
    const pool = tab === "outfits" ? allOutfits : allItems;
    for (const entry of pool) {
      for (const t of entry.style_tags || []) {
        counts[t] = (counts[t] || 0) + 1;
      }
    }
    const tags = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([t]) => t);

    // Ensure 'custom' tag appears if user has custom entries
    const hasCustom = tab === "outfits" ? customOutfits.length > 0 : customItems.length > 0;
    if (hasCustom && !tags.includes("custom")) {
      return ["custom", ...tags.slice(0, 9)];
    }
    return tags;
  }, [tab, allOutfits, allItems, customOutfits.length, customItems.length]);

  const handlePickOutfit = (outfit: WardrobeOutfit) => {
    onSelectOutfit(outfit);
    setJustAppliedId(outfit.id);
    setJustAppliedMsg("Outfit Applied to All Wardrobe Fields!");
    setTimeout(() => {
      setJustAppliedId((cur) => (cur === outfit.id ? null : cur));
    }, 2500);
  };

  const handlePickItem = (item: WardrobeItem) => {
    onSelectItem(item);
    setJustAppliedId(item.id);
    const slotLabel = item.slot.replace("_", " ");
    setJustAppliedMsg(`Applied to ${slotLabel.toUpperCase()}!`);
    setTimeout(() => {
      setJustAppliedId((cur) => (cur === item.id ? null : cur));
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200 text-white"
    >
      {/* Header Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-inner">
            <Shirt className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white">
                Wardrobe & Attire Studio
              </h2>
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-rose-400 border border-rose-500/30">
                {allOutfits.length} Outfits · {allItems.length} Pieces
                {(customItems.length > 0 || customOutfits.length > 0) && (
                  <span className="ml-1 text-rose-300">({customItems.length + customOutfits.length} custom)</span>
                )}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              White-background studio product shots & full outfits with precise prompt translation
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-64 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search wardrobe (e.g. sherpa, leather, boots)..."
              className="w-full rounded-full border border-neutral-800 bg-neutral-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Add to Library Button */}
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-rose-500/50 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 hover:border-rose-500 transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add to Library</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white"
            title="Close (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Primary Mode Tabs & Sub-Filters Bar */}
      <div className="shrink-0 border-b border-neutral-800/80 bg-neutral-950/80 px-6 py-3 space-y-3">
        {/* Outfits vs Pieces Switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                setTab("outfits");
                setSelectedTag("all");
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                tab === "outfits"
                  ? "bg-rose-500 text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Full Outfits ({allOutfits.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("items");
                setSelectedTag("all");
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                tab === "items"
                  ? "bg-rose-500 text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Individual Pieces ({allItems.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Filter className="h-3.5 w-3.5 text-neutral-500" />
            <span>
              {tab === "outfits"
                ? "Click an outfit to populate all layers, footwear, textiles, and accessories at once"
                : "Click any garment to update that specific wardrobe slot in your prompt"}
            </span>
          </div>
        </div>

        {/* Slot Pills (Only when Pieces tab is active) */}
        {tab === "items" && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSlot("all")}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                slot === "all"
                  ? "bg-neutral-200 text-black font-semibold"
                  : "border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white"
              }`}
            >
              All Pieces ({allItems.length})
            </button>
            {WARDROBE_SLOTS.map((s) => {
              const count = allItems.filter((i) => i.slot === s.slot).length;
              return (
                <button
                  key={s.slot}
                  type="button"
                  onClick={() => setSlot(s.slot)}
                  className={`shrink-0 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all capitalize ${
                    slot === s.slot
                      ? "bg-rose-500 text-black font-semibold"
                      : "border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white"
                  }`}
                >
                  <span>{s.slot.replace("_", " ")}</span>
                  <span className="text-[10px] opacity-70 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Style Tag Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex shrink-0 items-center gap-1 text-[11px] text-neutral-500 font-mono mr-1">
            <Tag className="h-3 w-3" />
            <span>Styles:</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedTag("all")}
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
              selectedTag === "all"
                ? "bg-neutral-300 text-black font-semibold"
                : "border border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:text-white"
            }`}
          >
            All Styles
          </button>
          {prominentTags.map((tagKey) => (
            <button
              key={tagKey}
              type="button"
              onClick={() => setSelectedTag(tagKey)}
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                selectedTag === tagKey
                  ? "bg-rose-500/90 text-black font-semibold"
                  : "border border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:text-white"
              }`}
              title={STYLE_TAG_VOCABULARY[tagKey]}
            >
              #{tagKey.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {tab === "outfits" ? (
          /* OUTFITS GRID (49) */
          filteredOutfits.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Search className="h-8 w-8 text-neutral-600 mb-2" />
              <p className="text-sm font-medium text-neutral-300">No outfits match your filter</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedTag("all");
                }}
                className="mt-4 rounded-full border border-neutral-700 bg-neutral-800 px-4 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {filteredOutfits.map((outfit) => {
                const isApplied = appliedOutfitId === outfit.id;
                const justApplied = justAppliedId === outfit.id;

                return (
                  <button
                    key={outfit.id}
                    type="button"
                    onClick={() => handlePickOutfit(outfit)}
                    className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${
                      justApplied
                        ? "border-rose-400 bg-neutral-900 shadow-lg shadow-rose-500/20 ring-2 ring-rose-400/50"
                        : isApplied
                          ? "border-rose-400/80 bg-neutral-900/90 ring-1 ring-rose-400/40"
                          : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/80"
                    }`}
                  >
                    {/* Outfit Flat-Lay Visual (3:4 ratio) */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                      <CatalogOutfitImage outfit={outfit} />

                      {/* Outfit Piece Count Badge & Custom Badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className="rounded bg-black/85 px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider text-rose-400 backdrop-blur-sm shadow-sm border border-rose-500/20">
                          {outfit.item_ids.length ? `${outfit.item_ids.length} PIECES` : "LOOK"}
                        </span>
                        {outfit.is_custom && (
                          <span className="rounded bg-rose-500 px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-black shadow-sm">
                            CUSTOM
                          </span>
                        )}
                      </div>

                      {/* Delete Custom Outfit Button */}
                      {outfit.is_custom && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={async (e) => {
                            e.stopPropagation();
                            await deleteCustomOutfit(outfit.id);
                          }}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              await deleteCustomOutfit(outfit.id);
                            }
                          }}
                          className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-neutral-400 hover:bg-red-500 hover:text-white transition-colors shadow-sm cursor-pointer"
                          title="Delete custom outfit"
                        >
                          <Trash2 className="h-3 w-3" />
                        </span>
                      )}

                      {/* Active Border Glow */}
                      {(isApplied || justApplied) && (
                        <div className="absolute inset-0 border-2 border-rose-500 bg-rose-500/10 pointer-events-none" />
                      )}
                    </div>

                    {/* Outfit Details */}
                    <div className="flex flex-1 flex-col p-3">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="line-clamp-1 text-xs font-semibold text-white group-hover:text-rose-400 transition-colors">
                          {outfit.name}
                        </h3>
                        {(isApplied || justApplied) && (
                          <span className="flex shrink-0 items-center text-rose-400">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>

                      {/* Style Tags */}
                      <div className="mt-1 flex flex-wrap gap-1">
                        {outfit.style_tags.slice(0, 3).map((tagKey) => (
                          <span
                            key={tagKey}
                            className="rounded bg-neutral-800 px-1.5 py-0.2 text-[9px] text-neutral-300 font-mono"
                          >
                            #{tagKey.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>

                      {/* Prompt Snippet Quote */}
                      <div className="mt-2 flex-1 rounded bg-black/40 p-2 text-[10px] text-neutral-300 border border-neutral-800/60 font-mono">
                        <p className="line-clamp-3 italic leading-relaxed text-neutral-300">
                          &quot;{outfit.prompt}&quot;
                        </p>
                      </div>

                      {/* Applied Banner */}
                      {justApplied && (
                        <div className="mt-2 rounded bg-rose-500 py-1 text-center text-[10px] font-bold text-black animate-in fade-in duration-150">
                          {justAppliedMsg}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )
        ) : (
          /* PIECES GRID (213) */
          filteredItems.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Search className="h-8 w-8 text-neutral-600 mb-2" />
              <p className="text-sm font-medium text-neutral-300">No items match your filter</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSlot("all");
                  setSelectedTag("all");
                }}
                className="mt-4 rounded-full border border-neutral-700 bg-neutral-800 px-4 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {filteredItems.map((item) => {
                const isApplied =
                  activeOuterwear === item.prompt ||
                  activeBaseLayer === item.prompt ||
                  activeFootwear === item.prompt;
                const justApplied = justAppliedId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePickItem(item)}
                    className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${
                      justApplied
                        ? "border-rose-400 bg-neutral-900 shadow-lg shadow-rose-500/20 ring-2 ring-rose-400/50"
                        : isApplied
                          ? "border-rose-400/80 bg-neutral-900/90 ring-1 ring-rose-400/40"
                          : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/80"
                    }`}
                  >
                    {/* Item Product Shot Visual (1:1 ratio) */}
                    <div className="relative aspect-square w-full overflow-hidden bg-white">
                      <CatalogItemImage item={item} />

                      {/* Slot Badge & Custom Badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className="rounded bg-black/85 px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-rose-400 backdrop-blur-sm shadow-sm border border-rose-500/20 uppercase">
                          {item.slot.replace("_", " ")}
                        </span>
                        {item.is_custom && (
                          <span className="rounded bg-rose-500 px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider text-black shadow-sm">
                            CUSTOM
                          </span>
                        )}
                      </div>

                      {/* Subcategory & Delete */}
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <span className="rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-medium text-neutral-300 backdrop-blur-sm capitalize">
                          {item.subcategory.replace("_", " ")}
                        </span>
                        {item.is_custom && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={async (e) => {
                              e.stopPropagation();
                              await deleteCustomItem(item.id);
                            }}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                await deleteCustomItem(item.id);
                              }
                            }}
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-black/80 text-neutral-400 hover:bg-red-500 hover:text-white transition-colors shadow-sm cursor-pointer"
                            title="Delete custom piece"
                          >
                            <Trash2 className="h-3 w-3" />
                          </span>
                        )}
                      </div>

                      {/* Active Border Glow */}
                      {(isApplied || justApplied) && (
                        <div className="absolute inset-0 border-2 border-rose-500 bg-rose-500/10 pointer-events-none" />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col p-3">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="line-clamp-1 text-xs font-semibold text-white group-hover:text-rose-400 transition-colors">
                          {item.name}
                        </h3>
                        {(isApplied || justApplied) && (
                          <span className="flex shrink-0 items-center text-rose-400">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>

                      {/* Materials & Colors summary */}
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-neutral-400">
                        {[...item.colors, ...item.materials].slice(0, 3).join(" · ") || item.subcategory}
                      </p>

                      {/* Prompt Quote */}
                      <div className="mt-2 flex-1 rounded bg-black/40 p-1.5 text-[10px] text-neutral-300 border border-neutral-800/60 font-mono">
                        <p className="line-clamp-2 italic leading-relaxed text-neutral-300">
                          &quot;{item.prompt}&quot;
                        </p>
                      </div>

                      {/* Applied Banner */}
                      {justApplied && (
                        <div className="mt-2 rounded bg-rose-500 py-1 text-center text-[10px] font-bold text-black animate-in fade-in duration-150">
                          {justAppliedMsg}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Footer bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-3 text-xs text-neutral-400">
        <p>
          Tip: Selecting an outfit sets outerwear, mid layer, base layer, footwear, accessories, and textiles in your prompt JSON simultaneously.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-neutral-800 px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Done Browsing
        </button>
      </div>

      {/* Add Item or Outfit Modal */}
      <AddLibraryItemModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        initialType={tab === "outfits" ? "outfit" : "item"}
        onSaved={(savedName) => {
          setJustAppliedMsg(`Saved "${savedName}" to your library!`);
          setTimeout(() => setJustAppliedMsg(""), 3500);
        }}
      />
    </div>
  );
}
