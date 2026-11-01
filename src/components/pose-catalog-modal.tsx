import { useState, useMemo, useEffect } from "react";
import {
  X,
  Search,
  Check,
  Sparkles,
  Maximize2,
  Filter,
} from "lucide-react";
import {
  POSE_CATEGORIES,
  POSE_STANCES,
  POSE_LIBRARY,
  type PoseCategory,
  type PoseStance,
  type PoseItem,
} from "@/lib/prompt/pose-database";
import { PoseCardVisual } from "@/components/pose-art";

type PoseCatalogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectPose: (pose: PoseItem) => void;
  activePosture?: string;
};

export function PoseCatalogModal({
  isOpen,
  onClose,
  onSelectPose,
  activePosture,
}: PoseCatalogModalProps) {
  const [category, setCategory] = useState<PoseCategory>("all");
  const [stance, setStance] = useState<PoseStance>("all");
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
    const counts: Record<string, number> = { all: POSE_LIBRARY.length };
    for (const pose of POSE_LIBRARY) {
      counts[pose.category] = (counts[pose.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtered poses
  const filteredPoses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return POSE_LIBRARY.filter((pose) => {
      if (category !== "all" && pose.category !== category) return false;
      if (stance !== "all" && pose.stance !== stance) return false;
      if (!q) return true;
      return (
        pose.name.toLowerCase().includes(q) ||
        (pose.subtitle && pose.subtitle.toLowerCase().includes(q)) ||
        pose.posture.toLowerCase().includes(q) ||
        pose.id.toLowerCase().includes(q) ||
        pose.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [category, stance, query]);

  const handlePick = (pose: PoseItem) => {
    onSelectPose(pose);
    setJustAppliedId(pose.id);
    setTimeout(() => {
      setJustAppliedId((cur) => (cur === pose.id ? null : cur));
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Pose Reference Gallery
            </h2>
            <p className="text-xs text-neutral-400">
              Select any pose to instantly inject studio-grade kinetic posture into your prompt
            </p>
          </div>
        </div>

        {/* Search Bar in Header */}
        <div className="relative mx-6 max-w-md flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search poses by keyword, subject, ID (e.g. sword, stool, S-curve)..."
            className="w-full rounded-full border border-neutral-800 bg-neutral-900/90 py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
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

      {/* Filter Navigation Bar (Inspired by Reference Screenshot) */}
      <div className="shrink-0 border-b border-neutral-800/80 bg-neutral-950/80 px-6 py-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {POSE_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] ?? 0;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-amber-500 text-black shadow-sm font-semibold"
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

        {/* Stance Sub-filter + Results Count */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="flex items-center gap-1 text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
              <Filter className="h-3 w-3" /> Stance:
            </span>
            {POSE_STANCES.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStance(st.id)}
                className={`rounded px-2.5 py-1 text-xs transition-colors ${
                  stance === st.id
                    ? "bg-neutral-800 text-amber-400 font-medium"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-neutral-400 shrink-0">
            Showing <span className="font-bold text-amber-400">{filteredPoses.length}</span> poses
          </div>
        </div>
      </div>

      {/* Main Pose Grid */}
      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        {filteredPoses.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <Search className="mb-2 h-8 w-8 text-neutral-600" />
            <p className="text-sm text-neutral-400">No poses match your search filter</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setStance("all");
              }}
              className="mt-3 text-xs text-amber-400 underline hover:text-amber-300"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredPoses.map((pose) => {
              const isApplied = activePosture === pose.posture;
              const justApplied = justAppliedId === pose.id;

              return (
                <button
                  key={pose.id}
                  type="button"
                  onClick={() => handlePick(pose)}
                  className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                    isApplied
                      ? "border-amber-500 ring-2 ring-amber-500/50 bg-neutral-900"
                      : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900"
                  }`}
                >
                  {/* Card Visual / Thumbnail */}
                  <div className="aspect-[4/5] w-full bg-neutral-950">
                    <PoseCardVisual
                      image={pose.image}
                      id={pose.id}
                      name={pose.name}
                      subtitle={pose.subtitle}
                      category={pose.category}
                      stance={pose.stance}
                      active={isApplied}
                    />
                  </div>

                  {/* Card Footer Information */}
                  <div className="flex flex-1 flex-col justify-between p-3 bg-neutral-900/90">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="line-clamp-1 text-xs font-bold text-white group-hover:text-amber-400">
                          {pose.name}
                        </h4>
                        {isApplied ? (
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500 text-black">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                        ) : null}
                      </div>

                      {pose.subtitle && (
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-neutral-400">
                          {pose.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Simple prompt explanation snippet */}
                    <div className="mt-2 border-t border-neutral-800/80 pt-2">
                      <p className="line-clamp-2 text-[10px] text-neutral-400 leading-relaxed font-sans">
                        {pose.posture}
                      </p>
                    </div>

                    {/* Just applied indicator */}
                    {justApplied && (
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-amber-500 py-1 text-[11px] font-bold text-black animate-in slide-in-from-bottom-2">
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

      {/* Bottom status bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-2.5 text-xs text-neutral-400">
        <div>
          Tip: Clicking any pose card immediately writes its kinetic description into your prompt JSON.
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-neutral-900 px-4 py-1.5 font-medium text-white hover:bg-neutral-800 border border-neutral-800"
        >
          Done Browsing
        </button>
      </div>
    </div>
  );
}
