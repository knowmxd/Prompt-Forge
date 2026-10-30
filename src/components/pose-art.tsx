import type { Art, Extra } from "@/lib/prompt/figure";

const CLAY = "#d9cbb8";
const INK = "#8c8376";
const AMBER = "#e08a3c";

function ExtraMark({ extra }: { extra: Extra }) {
  if (extra.t === "floor") {
    return <line x1="10" y1="148" x2="110" y2="148" stroke={INK} strokeWidth="2" strokeLinecap="round" />;
  }
  if (extra.t === "horizon") {
    return <line x1="8" y1="132" x2="112" y2="132" stroke={INK} strokeWidth="2" strokeLinecap="round" />;
  }
  if (extra.t === "sun") {
    return (
      <g stroke={AMBER} fill={AMBER} strokeLinecap="round">
        <circle cx={extra.x} cy={extra.y} r="5" />
        <line x1={extra.x - 11} y1={extra.y} x2={extra.x - 7} y2={extra.y} strokeWidth="2" />
        <line x1={extra.x + 7} y1={extra.y} x2={extra.x + 11} y2={extra.y} strokeWidth="2" />
        <line x1={extra.x} y1={extra.y - 11} x2={extra.x} y2={extra.y - 7} strokeWidth="2" />
        <line x1={extra.x} y1={extra.y + 7} x2={extra.x} y2={extra.y + 11} strokeWidth="2" />
      </g>
    );
  }
  if (extra.t === "window") {
    return (
      <g stroke={AMBER} fill="none" strokeWidth="2">
        <rect x={extra.x} y={extra.y} width="22" height="36" rx="1" />
        <line x1={extra.x + 11} y1={extra.y} x2={extra.x + 11} y2={extra.y + 36} />
        <line x1={extra.x} y1={extra.y + 18} x2={extra.x + 22} y2={extra.y + 18} />
      </g>
    );
  }
  if (extra.t === "block") {
    return <rect x={extra.x} y={extra.y} width={extra.w} height={extra.h} fill="none" stroke={INK} strokeWidth="2" />;
  }
  if (extra.t === "cam") {
    return (
      <g stroke={AMBER} fill="none" strokeWidth="2" strokeLinecap="round">
        <rect x={extra.x} y={extra.y} width="16" height="10" rx="2" />
        <line x1={extra.x + 16} y1={extra.y + 5} x2={extra.x + 26} y2={extra.y + 5 + extra.rot / 8} />
      </g>
    );
  }
}

export function PoseArt({ art }: { art: Art }) {
  return (
    <svg viewBox="0 0 120 156" className="h-full w-full" aria-hidden="true">
      {art.extras?.map((extra, index) => (
        <ExtraMark key={index} extra={extra} />
      ))}
      {art.limbs.map((limb, index) => (
        <line
          key={index}
          x1={limb[0]}
          y1={limb[1]}
          x2={limb[2]}
          y2={limb[3]}
          stroke={CLAY}
          strokeWidth={limb[4] ?? 7}
          strokeLinecap="round"
        />
      ))}
      <circle cx={art.head[0]} cy={art.head[1]} r={art.head[2]} fill={CLAY} />
    </svg>
  );
}
