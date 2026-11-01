import { useState, useMemo, useEffect } from "react";
import {
  X,
  Search,
  Check,
  Camera,
  Filter,
} from "lucide-react";
import {
  CAMERA_CATEGORIES,
  CAMERA_LIBRARY,
  type CameraCategory,
  type CameraItem,
} from "@/lib/prompt/camera-database";

type CameraCatalogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectCamera: (item: CameraItem) => void;
  activePrinciple?: string;
};

export function CameraCatalogModal({
  isOpen,
  onClose,
  onSelectCamera,
  activePrinciple,
}: CameraCatalogModalProps) {
  const [category, setCategory] = useState<CameraCategory>("all");
  const [query, setQuery] = useState("");
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: CAMERA_LIBRARY.length };
    for (const item of CAMERA_LIBRARY) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtered camera items
  const filteredItems = useMemo(() => {
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
        item.id.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [category, query]);

  const handlePick = (item: CameraItem) => {
    onSelectCamera(item);
    setJustAppliedId(item.id);
    setTimeout(() => {
      setJustAppliedId((cur) => (cur === item.id ? null : cur));
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Header bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white">
                Camera & Optics Reference Gallery
              </h2>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-400 border border-emerald-500/30">
                27 Benchmark Angles
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Benchmark angles, elevations, and focal lengths illustrated on botanical monstera reference
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-80 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search angles (e.g. worm, dutch, 85mm, macro)..."
            className="w-full rounded-full border border-neutral-800 bg-neutral-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
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

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white"
          title="Close (Esc)"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Filter Navigation Bar */}
      <div className="shrink-0 border-b border-neutral-800/80 bg-neutral-950/80 px-6 py-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CAMERA_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] ?? 0;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-emerald-500 text-black shadow-sm font-semibold"
                    : "border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700 hover:text-white"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected ? "bg-black/20 text-black" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3 w-3 text-neutral-500" />
            <span>Select any card to instantly update camera framing, elevation, and optics in your prompt</span>
          </div>
          <span className="font-mono text-[11px] text-neutral-500">
            Showing <strong className="text-white">{filteredItems.length}</strong> angles
          </span>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredItems.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <Search className="h-8 w-8 text-neutral-600 mb-2" />
            <p className="text-sm font-medium text-neutral-300">No camera angles match your search</p>
            <p className="mt-1 text-xs text-neutral-500">Try searching for &quot;low&quot;, &quot;dutch&quot;, &quot;macro&quot;, or &quot;50mm&quot;</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="mt-4 rounded-full border border-neutral-700 bg-neutral-800 px-4 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {filteredItems.map((item) => {
              const isApplied = activePrinciple === item.principle;
              const justApplied = justAppliedId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handlePick(item)}
                  className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${
                    justApplied
                      ? "border-emerald-500 bg-neutral-900 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/50"
                      : isApplied
                        ? "border-emerald-500/80 bg-neutral-900/90 ring-1 ring-emerald-500/40"
                        : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/80"
                  }`}
                >
                  {/* Card Visual with Image */}
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Badge Pill */}
                    <span className="absolute top-2 left-2 rounded bg-black/85 px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider text-emerald-400 backdrop-blur-sm shadow-sm border border-emerald-500/20">
                      {item.badge}
                    </span>

                    {/* Category indicator */}
                    <span className="absolute top-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300 backdrop-blur-sm">
                      {item.category === "elevations" ? "Elevation" : item.category === "framings" ? "Framing" : "Optics"}
                    </span>

                    {/* Active Border Glow */}
                    {(isApplied || justApplied) && (
                      <div className="absolute inset-0 border-2 border-emerald-500 bg-emerald-500/10 pointer-events-none" />
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="flex flex-1 flex-col p-3">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="line-clamp-1 text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {item.name}
                      </h3>
                      {(isApplied || justApplied) && (
                        <span className="flex shrink-0 items-center text-emerald-400">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 line-clamp-1 text-[11px] text-neutral-400">
                      {item.subtitle}
                    </p>

                    <div className="mt-2 flex-1 rounded bg-black/40 p-1.5 text-[10px] text-neutral-300 border border-neutral-800/60 font-mono">
                      <p className="line-clamp-2 italic leading-relaxed text-neutral-300">
                        &quot;{item.axis}&quot;
                      </p>
                    </div>

                    {item.lens && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400/90 font-mono">
                        <span className="text-neutral-500">Optics:</span>
                        <span className="line-clamp-1">{item.lens}</span>
                      </div>
                    )}

                    {/* Applied confirmation banner */}
                    {justApplied && (
                      <div className="mt-2 rounded bg-emerald-500 py-1 text-center text-[10px] font-bold text-black animate-in fade-in duration-150">
                        Applied to Prompt!
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-3 text-xs text-neutral-400">
        <p>Tip: Camera angles update both framing principle and exact elevation axis in your prompt JSON.</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-neutral-800 px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Done Browsing
        </button>
      </div>
    </div>
  );
}
