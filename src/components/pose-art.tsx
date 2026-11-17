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
  stance = "standing",
  badge,
  active,
}: PoseVisualProps) {
  const leftTag = badge || (id ? id.toUpperCase() : null);
  const rightTag = badge ? (category || stance) : (stance || category);

  if (image) {
    return (
      <div className="group relative h-full w-full overflow-hidden bg-neutral-950">
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

  // Bespoke Gray Studio Artist Mannequin Card (100% consistent with studio photography)
  return (
    <div className="group relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-md border border-neutral-800/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/60 via-neutral-900 to-neutral-950 p-2.5 text-center transition-all hover:border-neutral-700">
      {/* Top Badges */}
      <div className="flex w-full items-center justify-between z-10">
        {leftTag ? (
          <span className="rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider text-amber-400 backdrop-blur-sm">
            {leftTag}
          </span>
        ) : <span />}
        {rightTag && (
          <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300 backdrop-blur-sm capitalize">
            {rightTag}
          </span>
        )}
      </div>

      {/* Articulated 3D Studio Mannequin Figure */}
      <div className="relative my-auto flex h-24 w-20 items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 64 88"
          className="h-full w-full filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
          fill="none"
        >
          {/* Studio Keylight Background Glow */}
          <radialGradient id={`mannequinGlow-${id || "std"}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#e4e4e7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
          </radialGradient>
          <ellipse cx="32" cy="44" rx="28" ry="36" fill={`url(#mannequinGlow-${id || "std"})`} />

          {/* Floor Shadow */}
          <ellipse cx="32" cy="80" rx="18" ry="3.5" fill="#000000" fillOpacity="0.45" />

          {/* Stance Figure Variations */}
          {stance === "sitting" ? (
            <g stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Posing Cube */}
              <rect x="22" y="48" width="20" height="24" rx="2" fill="#27272a" stroke="#3f3f46" strokeWidth="1.5" />
              {/* Head & Neck */}
              <circle cx="32" cy="18" r="7" fill="#a1a1aa" stroke="#e4e4e7" strokeWidth="1.5" />
              <line x1="32" y1="25" x2="32" y2="28" stroke="#71717a" strokeWidth="2" />
              {/* Torso & Hip */}
              <path d="M26 28 L38 28 L35 48 L29 48 Z" fill="#71717a" stroke="#d4d4d8" strokeWidth="1.5" />
              {/* Seated Limbs */}
              <polyline points="29,48 20,54 20,74" />
              <polyline points="35,48 44,54 44,74" />
              <polyline points="26,30 20,42 28,48" />
              <polyline points="38,30 44,42 36,48" />
            </g>
          ) : stance === "kneeling" || stance === "crouching" ? (
            <g stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Head */}
              <circle cx="32" cy="24" r="7" fill="#a1a1aa" stroke="#e4e4e7" strokeWidth="1.5" />
              {/* Torso */}
              <path d="M26 33 L38 33 L35 52 L29 52 Z" fill="#71717a" stroke="#d4d4d8" strokeWidth="1.5" />
              {/* Low Grounded Limbs */}
              <polyline points="29,52 18,62 26,76" />
              <polyline points="35,52 46,62 38,76" />
              <polyline points="26,34 18,48 26,60" />
              <polyline points="38,34 46,48 38,60" />
            </g>
          ) : stance === "reclining" ? (
            <g stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Propped Head */}
              <circle cx="20" cy="40" r="7" fill="#a1a1aa" stroke="#e4e4e7" strokeWidth="1.5" />
              {/* Reclined Torso */}
              <path d="M24 45 L38 52 L48 55 L38 60 Z" fill="#71717a" stroke="#d4d4d8" strokeWidth="1.5" />
              {/* Elongated Ground Limbs */}
              <polyline points="22,46 16,58 24,62" />
              <polyline points="38,60 52,64 60,68" />
              <polyline points="36,54 48,60 56,66" />
            </g>
          ) : stance === "dynamic" ? (
            <g stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Dynamic Head */}
              <circle cx="34" cy="16" r="7" fill="#a1a1aa" stroke="#e4e4e7" strokeWidth="1.5" />
              {/* Angled Torso */}
              <path d="M28 25 L40 23 L36 44 L26 44 Z" fill="#71717a" stroke="#d4d4d8" strokeWidth="1.5" />
              {/* Stride Limbs */}
              <polyline points="26,44 18,58 14,76" />
              <polyline points="36,44 44,56 52,72" />
              <polyline points="28,26 18,36 12,48" />
              <polyline points="40,24 50,34 54,46" />
            </g>
          ) : (
            <g stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Upright Standing Head */}
              <circle cx="32" cy="15" r="7" fill="#a1a1aa" stroke="#e4e4e7" strokeWidth="1.5" />
              {/* Torso Plate */}
              <path d="M26 24 L38 24 L35 46 L29 46 Z" fill="#71717a" stroke="#d4d4d8" strokeWidth="1.5" />
              {/* Ball Joints */}
              <circle cx="26" cy="25" r="2" fill="#d4d4d8" />
              <circle cx="38" cy="25" r="2" fill="#d4d4d8" />
              {/* Limbs */}
              <polyline points="26,25 20,38 22,54" />
              <polyline points="38,25 44,38 42,54" />
              <polyline points="29,46 26,62 25,78" />
              <polyline points="35,46 38,62 39,78" />
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Name & Subtitle */}
      <div className="w-full z-10 px-1">
        <span className="block truncate text-xs font-semibold text-neutral-200">
          {name ?? "Studio Pose"}
        </span>
        {subtitle && (
          <span className="block truncate text-[10px] text-neutral-400">
            {subtitle}
          </span>
        )}
      </div>

      {active && (
        <div className="absolute inset-0 border-2 border-amber-500 bg-amber-500/10 pointer-events-none rounded-md" />
      )}
    </div>
  );
}

// Backwards-compatible export for existing legacy callers
export function PoseArt({ art: _art }: { art?: Art }) {
  return <PoseCardVisual />;
}
