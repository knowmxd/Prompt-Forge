import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, Filter, RotateCcw, Search, Shuffle, Sparkles, X } from "lucide-react";
import {
  POSE_FRAMING_OPTIONS,
  POSE_STYLE_OPTIONS,
  POSE_SUBJECT_OPTIONS,
  filterPoseManifest,
  pickRandomPoseManifestItem,
  type PoseFramingId,
  type PoseManifestItem,
  type PoseStyleCategoryId,
  type PoseSubjectTypeId,
} from "@/lib/prompt/pose-manifest";
import { usePoseManifest } from "@/lib/prompt/use-pose-manifest";

interface PoseCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPose: (pose: PoseManifestItem) => void;
  onClearPose: () => void;
  activePoseId?: string;
}

const CARD_ROW_HEIGHT = 286;
const GRID_GAP = 14;
const OVERSCAN_ROWS = 2;

export function PoseCatalogModal({
  isOpen,
  onClose,
  onSelectPose,
  onClearPose,
  activePoseId,
}: PoseCatalogModalProps) {
  const [styleCategory, setStyleCategory] = useState<PoseStyleCategoryId>("all");
  const [framing, setFraming] = useState<PoseFramingId>("all");
  const [subjectType, setSubjectType] = useState<PoseSubjectTypeId>("all");
  const [query, setQuery] = useState("");
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [viewportHeight, setViewportHeight] = useState(720);

  const { poses, loading, error } = usePoseManifest(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setScrollTop(0);
  }, [styleCategory, framing, subjectType, query]);

  const styleCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: poses.length,
      Streetwear: 0,
      "Editorial Lookbook": 0,
      "Cinematic Poster": 0,
      "Expressive Signature": 0,
    };
    for (const p of poses) {
      counts[p.styleCategory] = (counts[p.styleCategory] || 0) + 1;
    }
    return counts;
  }, [poses]);

  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0, solo: 0, duo: 0 };
    for (const p of poses) {
      if (styleCategory !== "all" && p.styleCategory !== styleCategory) continue;
      counts.all += 1;
      counts[p.subjectType] = (counts[p.subjectType] || 0) + 1;
    }
    return counts;
  }, [poses, styleCategory]);

  const framingCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: 0,
      "full-body": 0,
      medium: 0,
      "close-up": 0,
    };
    for (const p of poses) {
      if (styleCategory !== "all" && p.styleCategory !== styleCategory) continue;
      if (subjectType !== "all" && p.subjectType !== subjectType) continue;
      counts.all += 1;
      counts[p.framing] = (counts[p.framing] || 0) + 1;
    }
    return counts;
  }, [poses, styleCategory, subjectType]);

  const filteredPoses = useMemo(() => {
    return filterPoseManifest(poses, {
      styleCategory,
      framing,
      subjectType,
      query,
    });
  }, [poses, styleCategory, framing, subjectType, query]);

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
    const picked = pickRandomPoseManifestItem(
      pool,
      { styleCategory, framing, subjectType },
      activePoseId,
    );
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-950/95 px-5 py-3.5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
              Pose Reference Library
            </h2>
            <p className="text-xs text-neutral-400">
              5,000 curated PoseDreamer &amp; editorial duo references · 80% Solo / 20% Duo · 50/30/20 Framing
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Style Category Dropdown */}
          <div className="relative flex items-center">
            <Filter className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-amber-400" />
            <select
              id="pose-style-select"
              aria-label="Filter pose style"
              value={styleCategory}
              onChange={(e) => setStyleCategory(e.target.value as PoseStyleCategoryId)}
              className="h-9 rounded-lg border border-neutral-700 bg-neutral-900 pl-8 pr-8 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {POSE_STYLE_OPTIONS.map((opt) => {
                const count = styleCounts[opt.id] ?? 0;
                return (
                  <option key={opt.id} value={opt.id}>
                    {count > 0 ? `${opt.label} (${count.toLocaleString()})` : opt.label}
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
            title="Pick a random pose from the active filters"
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

      {/* Search Bar, Subject Toggle & Framing Filter Pills */}
      <div className="shrink-0 space-y-2.5 border-b border-neutral-800/80 bg-neutral-950/90 px-5 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 5,000 poses by style, framing, solo/duo, angle, tag, or ID..."
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

          {/* Subject Toggle (All / Solo / Duo) */}
          <div
            role="group"
            aria-label="Filter subject count"
            className="flex items-center rounded-full border border-neutral-800 bg-neutral-900 p-0.5"
          >
            {POSE_SUBJECT_OPTIONS.map((opt) => {
              const count = subjectCounts[opt.id] ?? 0;
              const isSelected = subjectType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSubjectType(opt.id)}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-cyan-500 text-black shadow-sm"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`rounded-full px-1.5 text-[10px] tabular-nums ${
                      isSelected ? "bg-black/20 text-black" : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-neutral-400 shrink-0">
            Showing{" "}
            <span className="font-bold text-amber-400">
              {filteredPoses.length.toLocaleString()}
            </span>{" "}
            {filteredPoses.length === 1 ? "pose" : "poses"}
          </div>
        </div>

        {/* Framing Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {POSE_FRAMING_OPTIONS.map((pill) => {
            const count = framingCounts[pill.id] ?? 0;
            const isSelected = framing === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setFraming(pill.id)}
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

      {/* Virtualized Visual Grid */}
      <div
        ref={scrollRef}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        className="flex-1 overflow-y-auto px-5 py-4"
      >
        {loading && poses.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-neutral-400">
            <Sparkles className="mb-3 h-8 w-8 animate-pulse text-amber-400" />
            <p className="text-sm font-medium text-white">Loading 5,000 Pose References...</p>
            <p className="mt-1 text-xs text-neutral-500">
              Preparing virtualized grid across PoseDreamer &amp; Duo references
            </p>
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center text-red-400">
            <p className="text-sm font-semibold">Failed to load pose manifest</p>
            <p className="mt-1 text-xs text-neutral-400">{error}</p>
          </div>
        ) : filteredPoses.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-neutral-500">
            <p className="text-sm font-medium text-neutral-300">
              No poses match your current filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setStyleCategory("all");
                setFraming("all");
                setSubjectType("all");
                setQuery("");
              }}
              className="mt-3 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-amber-400 hover:bg-neutral-800"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div style={{ height: `${totalHeight}px`, position: "relative" }}>
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
                const isSelected = activePoseId === pose.id;
                const isJustApplied = justAppliedId === pose.id;
                return (
                  <button
                    key={pose.id}
                    type="button"
                    onClick={() => handlePick(pose)}
                    style={{ height: `${CARD_ROW_HEIGHT}px` }}
                    className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-150 hover:shadow-lg ${
                      isSelected
                        ? "border-amber-500 bg-neutral-900 ring-2 ring-amber-500/40"
                        : "border-neutral-800 bg-neutral-900/70 hover:border-neutral-600 hover:bg-neutral-900"
                    }`}
                  >
                    {/* Visual Reference Image */}
                    <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-neutral-950">
                      <img
                        src={pose.imageUrl}
                        alt={`${pose.styleCategory} ${pose.subjectType} ${pose.framing}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Subject Type Badge */}
                      <span
                        className={`absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase backdrop-blur-sm ${
                          pose.subjectType === "duo"
                            ? "bg-cyan-500/85 text-black"
                            : "bg-black/80 text-amber-300"
                        }`}
                      >
                        {pose.subjectType}
                      </span>

                      {/* Framing & Angle Badge */}
                      <span className="absolute top-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] text-neutral-200 backdrop-blur-sm">
                        {pose.framing}
                      </span>

                      {isSelected && (
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black shadow">
                          <Check className="h-3 w-3 stroke-[3]" />
                          <span>Selected</span>
                        </div>
                      )}
                    </div>

                    {/* Card Metadata */}
                    <div className="shrink-0 p-2.5 bg-neutral-950/90 border-t border-neutral-800/70">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-semibold text-white truncate group-hover:text-amber-300">
                          {pose.styleCategory}
                        </h3>
                        <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                          {pose.id}
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-center gap-1 overflow-hidden">
                        <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[9px] text-neutral-300 shrink-0">
                          {pose.angle}
                        </span>
                        {pose.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="rounded bg-neutral-900 px-1.5 py-0.5 text-[9px] text-neutral-400 truncate border border-neutral-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isJustApplied && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-amber-500 py-1 text-center text-[10px] font-bold text-black">
                        Selected!
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950/95 px-5 py-2.5 text-xs text-neutral-400 shrink-0">
        <span>
          Visual-First Pose Library · Click any card to bind{" "}
          <code className="text-amber-400">pose_reference</code> into your live JSON
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1 font-medium text-neutral-200 hover:bg-neutral-800"
        >
          Done Browsing
        </button>
      </div>
    </div>
  );
}
