import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Database,
  Loader2,
  RotateCcw,
  Search,
  Shuffle,
  Sparkles,
  X,
} from "lucide-react";
import {
  DATASET_FILTER_OPTIONS,
  POSE_TAG_PILLS,
  filterPoseManifest,
  pickRandomPoseManifestItem,
  type PoseDatasetId,
  type PoseManifestItem,
} from "@/lib/prompt/pose-manifest";
import { usePoseManifest } from "@/lib/prompt/use-pose-manifest";

type PoseCatalogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectPose: (pose: PoseManifestItem) => void;
  onClearPose: () => void;
  activePoseId?: string;
  activePosture?: string;
};

const CARD_ROW_HEIGHT = 312;
const GRID_GAP = 16;
const OVERSCAN_ROWS = 2;

export function PoseCatalogModal({
  isOpen,
  onClose,
  onSelectPose,
  onClearPose,
  activePoseId,
  activePosture,
}: PoseCatalogModalProps) {
  const { poses, loading, error } = usePoseManifest(isOpen);

  const [dataset, setDataset] = useState<PoseDatasetId>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null);

  // Virtualization state
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [viewportHeight, setViewportHeight] = useState(720);

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

  // Lock body scroll when open
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

  // Track container dimensions for responsive column virtualization
  useEffect(() => {
    if (!isOpen) return;
    const el = scrollRef.current;
    if (!el) return;

    const measure = () => {
      setViewportWidth(el.clientWidth || 1200);
      setViewportHeight(el.clientHeight || 720);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  // Reset scroll to top on filter changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setScrollTop(0);
  }, [dataset, selectedTag, query]);

  const datasetCounts = useMemo(() => {
    let booru3d = 0;
    let densepose = 0;
    for (const p of poses) {
      if (p.dataset === "booru3d") booru3d += 1;
      else if (p.dataset === "densepose") densepose += 1;
    }
    return { all: poses.length, booru3d, densepose };
  }, [poses]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const p of poses) {
      if (dataset !== "all" && p.dataset !== dataset) continue;
      counts.all += 1;
      for (const pill of POSE_TAG_PILLS) {
        if (pill.id === "all") continue;
        const matches =
          p.tags.some((t) => t.toLowerCase() === pill.id) ||
          p.cameraAngle.toLowerCase() === pill.id ||
          (pill.id === "portrait" && p.cameraAngle === "close-up");
        if (matches) {
          counts[pill.id] = (counts[pill.id] || 0) + 1;
        }
      }
    }
    return counts;
  }, [poses, dataset]);

  const filteredPoses = useMemo(() => {
    return filterPoseManifest(poses, {
      dataset,
      tag: selectedTag,
      query,
    });
  }, [poses, dataset, selectedTag, query]);

  // Responsive column count matching Tailwind grid breakpoints inside padded area
  const cols = useMemo(() => {
    if (viewportWidth >= 1280) return 6;
    if (viewportWidth >= 1024) return 5;
    if (viewportWidth >= 768) return 4;
    if (viewportWidth >= 640) return 3;
    return 2;
  }, [viewportWidth]);

  const rowStride = CARD_ROW_HEIGHT + GRID_GAP;
  const totalRows = Math.ceil(filteredPoses.length / cols);
  const totalHeight = Math.max(0, totalRows * rowStride - GRID_GAP);
  const startRow = Math.max(0, Math.floor(scrollTop / rowStride) - OVERSCAN_ROWS);
  const endRow = Math.min(
    totalRows,
    Math.ceil((scrollTop + viewportHeight) / rowStride) + OVERSCAN_ROWS,
  );
  const visibleSlice = useMemo(() => {
    return filteredPoses.slice(startRow * cols, endRow * cols);
  }, [filteredPoses, startRow, endRow, cols]);

  const handlePick = (pose: PoseManifestItem) => {
    onSelectPose(pose);
    setJustAppliedId(pose.id);
    window.setTimeout(() => {
      setJustAppliedId((cur) => (cur === pose.id ? null : cur));
    }, 1800);
  };

  const handleRandomPose = () => {
    const pool = filteredPoses.length > 0 ? filteredPoses : poses;
    const picked = pickRandomPoseManifestItem(pool, dataset, activePoseId);
    if (picked) {
      handlePick(picked);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pose Reference Library"
      className="fixed inset-0 z-50 flex flex-col bg-black/92 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-950 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Pose Reference Library
            </h2>
            <p className="text-xs text-neutral-400">
              {poses.length > 0
                ? `${poses.length.toLocaleString()} curated 3D Mannequin & DensePose references · Click any card to populate JSON & prompt`
                : "Loading pose manifest..."}
            </p>
          </div>
        </div>

        {/* Dataset Dropdown Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="pose-dataset-select" className="sr-only">
            Pose Dataset Filter
          </label>
          <div className="relative flex items-center">
            <Database className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-amber-400" />
            <select
              id="pose-dataset-select"
              value={dataset}
              onChange={(e) => setDataset(e.target.value as PoseDatasetId)}
              className="h-9 rounded-lg border border-neutral-700 bg-neutral-900 pl-8 pr-8 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {DATASET_FILTER_OPTIONS.map((opt) => {
                const cnt =
                  opt.id === "all"
                    ? datasetCounts.all
                    : opt.id === "booru3d"
                      ? datasetCounts.booru3d
                      : datasetCounts.densepose;
                const display =
                  cnt > 0 ? `${opt.label.replace(/\s*\([^)]*\)/, "")} (${cnt.toLocaleString()})` : opt.label;
                return (
                  <option key={opt.id} value={opt.id}>
                    {display}
                  </option>
                );
              })}
            </select>
          </div>

          <button
            type="button"
            onClick={handleRandomPose}
            disabled={poses.length === 0}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/20 disabled:opacity-40"
            title="Pick a random pose from the active dataset"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Random Pose</span>
          </button>

          <button
            type="button"
            onClick={onClearPose}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white"
            title="Clear active subject pose"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Pose</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white"
            title="Close (Esc)"
            aria-label="Close pose reference library"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search Bar & Quick Tag Pills */}
      <div className="shrink-0 space-y-2.5 border-b border-neutral-800/80 bg-neutral-950/90 px-5 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 10,000 poses by posture, hand gesture, angle, or ID..."
              className="w-full rounded-full border border-neutral-800 bg-neutral-900/90 py-2 pl-10 pr-8 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs font-mono text-neutral-400 shrink-0">
            Showing{" "}
            <span className="font-bold text-amber-400">
              {filteredPoses.length.toLocaleString()}
            </span>{" "}
            {filteredPoses.length === 1 ? "pose" : "poses"}
          </div>
        </div>

        {/* Category / Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {POSE_TAG_PILLS.map((pill) => {
            const count = tagCounts[pill.id] ?? 0;
            const isSelected = selectedTag === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedTag(pill.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-amber-500 text-black shadow-sm font-semibold"
                    : "border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700 hover:text-white"
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] tabular-nums ${
                    isSelected ? "bg-black/20 text-black" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Virtualized 10,000-Card Viewport */}
      <div
        ref={scrollRef}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        className="min-h-0 flex-1 overflow-y-auto p-5"
      >
        {loading ? (
          <div className="flex h-72 flex-col items-center justify-center gap-3 text-neutral-400">
            <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
            <p className="text-sm">Loading 10,000 Pose References...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center text-center text-red-400">
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : filteredPoses.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <Search className="mb-2 h-8 w-8 text-neutral-600" />
            <p className="text-sm text-neutral-400">No poses match your current filter</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDataset("all");
                setSelectedTag("all");
              }}
              className="mt-3 text-xs text-amber-400 underline hover:text-amber-300"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div style={{ height: `${totalHeight}px`, position: "relative", width: "100%" }}>
            <div
              style={{
                position: "absolute",
                top: `${startRow * rowStride}px`,
                left: 0,
                right: 0,
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gap: `${GRID_GAP}px`,
              }}
            >
              {visibleSlice.map((pose) => {
                const isApplied =
                  activePoseId === pose.id ||
                  (Boolean(activePosture) &&
                    activePosture?.trim().toLowerCase() === pose.naturalPrompt.trim().toLowerCase());
                const justApplied = justAppliedId === pose.id;

                return (
                  <button
                    key={pose.id}
                    type="button"
                    onClick={() => handlePick(pose)}
                    style={{ height: `${CARD_ROW_HEIGHT}px` }}
                    className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-150 hover:shadow-lg ${
                      isApplied
                        ? "border-amber-500 ring-2 ring-amber-500/60 bg-neutral-900"
                        : "border-neutral-800 bg-neutral-900/70 hover:border-neutral-600 hover:bg-neutral-900"
                    }`}
                  >
                    {/* Visual Image Container */}
                    <div className="relative h-48 w-full shrink-0 overflow-hidden bg-neutral-950">
                      <img
                        src={pose.imageUrl}
                        alt={pose.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      <span
                        className={`absolute top-2 left-2 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wide backdrop-blur-sm ${
                          pose.dataset === "booru3d"
                            ? "bg-black/85 text-amber-300 border border-amber-500/30"
                            : "bg-black/85 text-sky-300 border border-sky-500/30"
                        }`}
                      >
                        {pose.dataset === "booru3d" ? "3D Mesh" : "DensePose"}
                      </span>
                      <span className="absolute top-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300 backdrop-blur-sm">
                        {pose.cameraAngle}
                      </span>
                      {isApplied && (
                        <span className="absolute bottom-2 right-2 flex h-5 items-center gap-1 rounded-full bg-amber-500 px-2 text-[10px] font-bold text-black shadow">
                          <Check className="h-3 w-3 stroke-[3]" />
                          Selected
                        </span>
                      )}
                    </div>

                    {/* Concise Title, Prompt Snippet & Tags */}
                    <div className="flex min-h-0 flex-1 flex-col justify-between p-2.5 bg-neutral-900/95">
                      <div>
                        <h4 className="line-clamp-1 text-xs font-bold text-white group-hover:text-amber-400">
                          {pose.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-neutral-400">
                          {pose.naturalPrompt}
                        </p>
                      </div>

                      <div className="mt-1.5 flex flex-wrap gap-1 overflow-hidden max-h-5">
                        {pose.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-neutral-800 px-1.5 py-0.5 text-[9px] font-medium text-neutral-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {justApplied && (
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-amber-500 py-1 text-[11px] font-bold text-black">
                        Applied to JSON & Prompt!
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-neutral-800 bg-neutral-950 px-5 py-2 text-xs text-neutral-400">
        <div>
          Tip: Click any pose card to populate <code className="text-amber-300">pose_reference</code> +{" "}
          <code className="text-amber-300">kinetic_posture</code> in your live JSON and natural prompt.
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-1.5 font-medium text-white hover:bg-neutral-800"
        >
          Done Browsing
        </button>
      </div>
    </div>
  );
}
