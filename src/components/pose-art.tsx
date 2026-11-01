import type { Art } from "@/lib/prompt/figure";

type PoseVisualProps = {
  image?: string;
  id?: string;
  name?: string;
  subtitle?: string;
  category?: string;
  stance?: string;
  badge?: string;
  active?: boolean;
};

export function PoseCardVisual({
  image,
  id,
  name,
  subtitle,
  category,
  stance,
  badge,
  active,
}: PoseVisualProps) {
  if (image) {
    const leftTag = badge || (id ? id.toUpperCase() : null);
    const rightTag = badge ? (category || stance) : (stance || category);
    return (
      <div className="relative h-full w-full overflow-hidden bg-neutral-950">
        <img
          src={image}
          alt={name ?? "Visual Preview"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {leftTag && (
          <span className="absolute top-2 left-2 rounded bg-black/85 px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider text-amber-400 backdrop-blur-sm">
            {leftTag}
          </span>
        )}
        {rightTag && (
          <span className="absolute top-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300 backdrop-blur-sm capitalize">
            {rightTag}
          </span>
        )}
        {active && (
          <div className="absolute inset-0 border-2 border-amber-500 bg-amber-500/10 pointer-events-none" />
        )}
      </div>
    );
  }

  // Fallback clean geometric mannequin preview
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 p-3 text-center">
      <div className="relative mb-2 flex h-20 w-16 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900">
        <svg
          viewBox="0 0 48 72"
          className="h-14 w-10 text-neutral-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {/* Head & Crosshairs */}
          <circle cx="24" cy="14" r="8" stroke="currentColor" fill="#262626" />
          <line x1="24" y1="6" x2="24" y2="22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="16" y1="14" x2="32" y2="14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          {/* Torso & Joints */}
          <path d="M20 22 L28 22 L26 42 L22 42 Z" stroke="currentColor" fill="#262626" />
          <circle cx="16" cy="24" r="2.5" fill="currentColor" />
          <circle cx="32" cy="24" r="2.5" fill="currentColor" />
          {/* Limbs */}
          <line x1="16" y1="24" x2="12" y2="38" stroke="currentColor" />
          <line x1="32" y1="24" x2="36" y2="38" stroke="currentColor" />
          <line x1="22" y1="42" x2="20" y2="64" stroke="currentColor" />
          <line x1="26" y1="42" x2="28" y2="64" stroke="currentColor" />
        </svg>
      </div>
      {id && (
        <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-mono text-amber-400">
          {id.toUpperCase()}
        </span>
      )}
      <span className="mt-1 line-clamp-1 text-xs font-medium text-neutral-300">
        {name ?? "Pose"}
      </span>
      {subtitle && (
        <span className="line-clamp-1 text-[10px] text-neutral-500">
          {subtitle}
        </span>
      )}
    </div>
  );
}

// Backwards-compatible export for existing legacy callers
export function PoseArt({ art: _art }: { art?: Art }) {
  return <PoseCardVisual />;
}
