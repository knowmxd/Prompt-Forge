import { useState, useMemo, useEffect } from "react";
import { X, Search, Check, Palette, Filter, ExternalLink } from "lucide-react";
import {
  STYLE_CATEGORIES,
  STYLE_LIBRARY,
  type StyleCategory,
  type StyleGuideItem,
} from "@/lib/prompt/style-database";

type StyleCatalogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectStyle: (item: StyleGuideItem) => void;
  activeMediumFormat?: string;
};

export function StyleCatalogModal({
  isOpen,
  onClose,
  onSelectStyle,
  activeMediumFormat,
}: StyleCatalogModalProps) {
  const [category, setCategory] = useState<StyleCategory>("all");
  const [query, setQuery] = useState("");
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: STYLE_LIBRARY.length };
    for (const item of STYLE_LIBRARY) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STYLE_LIBRARY.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.medium_format.toLowerCase().includes(q) ||
        item.tonal_behavior.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [category, query]);

  const handlePick = (item: StyleGuideItem) => {
    onSelectStyle(item);
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 shadow-inner">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white">
                Aesthetic DNA &amp; Style Guides
              </h2>
              <span className="rounded-full bg-fuchsia-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-fuchsia-400 border border-fuchsia-500/30">
                {STYLE_LIBRARY.length} Style Studies
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Curated Notion style guides — applies medium format, optical imperfections, color palette, lighting tone, and anti-cliché exclusions
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <X className="h-4 w-4" />
          <span>Close</span>
          <kbd className="ml-1 hidden rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 sm:inline-block">
            ESC
          </kbd>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 bg-neutral-950/70 px-6 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {STYLE_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                  active
                    ? "bg-fuchsia-500 text-white font-semibold shadow-sm"
                    : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border border-neutral-800"
                }`}
              >
                <span>{cat.label.replace(/\s*\(\d+\)/, "")}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? "bg-black/25 text-white" : "bg-neutral-800 text-neutral-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search style guides (e.g. street, oil, night)..."
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 py-1.5 pl-9 pr-8 text-xs text-white placeholder-neutral-500 focus:border-fuchsia-500/50 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredItems.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-neutral-500">
            <Filter className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm font-medium text-neutral-400">No style guides match your filter</p>
            <button
              type="button"
              onClick={() => {
                setCategory("all");
                setQuery("");
              }}
              className="mt-2 text-xs text-fuchsia-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const isApplied = activeMediumFormat === item.medium_format;
              const isJustApplied = justAppliedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handlePick(item)}
                  className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-neutral-900/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-500/10 ${
                    isApplied || isJustApplied
                      ? "border-fuchsia-500 ring-1 ring-fuchsia-500/50 shadow-lg shadow-fuchsia-500/10"
                      : "border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  {/* Reference Cover Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30 opacity-80" />

                    {/* Top badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fuchsia-300 backdrop-blur-sm border border-white/10">
                        {item.badge}
                      </span>
                      {item.notionUrl && (
                        <a
                          href={item.notionUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Open Style Guide in Notion"
                          className="rounded-md bg-black/75 p-1 text-neutral-300 hover:text-white backdrop-blur-sm border border-white/10"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>

                    {/* Palette Swatches */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/75 px-2 py-1 backdrop-blur-sm border border-white/10">
                      {item.dominant_palette.map((hex) => (
                        <span
                          key={hex}
                          title={hex}
                          className="h-3 w-3 rounded-full border border-white/25"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>

                    {/* Applied checkmark */}
                    {(isApplied || isJustApplied) && (
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-fuchsia-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg">
                        <Check className="h-3 w-3 stroke-[3]" />
                        <span>Applied</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-fuchsia-300 transition-colors">
                        {item.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] font-medium text-neutral-400">
                        {item.subtitle}
                      </p>
                      <p className="mt-2 text-[11px] leading-relaxed text-neutral-300 line-clamp-3">
                        {item.medium_format}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex flex-wrap gap-1">
                        {item.anti_cliche_exclusions.slice(0, 2).map((ex) => (
                          <span
                            key={ex}
                            className="rounded bg-neutral-800 px-1.5 py-0.5 text-[9px] text-neutral-400"
                          >
                            no {ex}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-fuchsia-400 group-hover:underline">
                        {isApplied ? "Active DNA" : "+ Apply DNA"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
