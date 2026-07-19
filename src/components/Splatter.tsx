import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Scroll-triggered paint splatter background layer.
 * Renders 1-2 organic SVG splats per section with a bouncy scale-in
 * animation when the container enters the viewport.
 */

// 5 organic splat SVG paths (viewBox 0 0 200 200)
const SPLATS: string[] = [
  // 1 — irregular blob w/ drips
  "M100 20 C 140 25 175 55 170 95 C 195 110 185 155 145 160 C 150 190 110 195 95 170 C 65 195 30 175 40 140 C 5 130 10 85 45 80 C 40 45 70 15 100 20 Z M 60 175 l 3 15 l -6 2 z M 175 55 l 10 4 l -3 8 z",
  // 2 — spiky splat
  "M100 10 L120 45 L160 30 L150 70 L195 80 L155 105 L180 145 L135 135 L130 180 L100 150 L70 185 L65 140 L20 150 L45 110 L5 90 L45 75 L35 30 L75 45 Z",
  // 3 — soft cloud drop
  "M50 90 C 30 60 70 30 100 45 C 130 20 175 55 160 95 C 190 120 160 165 120 155 C 100 185 55 175 55 140 C 20 135 25 95 50 90 Z",
  // 4 — comet w/ trail
  "M110 30 C 160 40 180 90 155 130 C 175 150 145 175 120 165 C 105 185 75 175 78 150 C 45 155 30 115 55 95 C 40 65 75 25 110 30 Z M 45 60 l -20 -15 l 5 20 z M 180 100 l 20 -5 l -8 15 z",
  // 5 — small burst w/ dots
  "M100 40 C 135 35 160 70 145 105 C 170 115 160 155 125 150 C 115 175 80 170 75 145 C 45 145 35 105 60 90 C 55 55 80 40 100 40 Z",
];

const COLORS = [
  { c: "#F4A11D", w: 70 }, // amber (dominant)
  { c: "#F4A11D", w: 15 }, // amber extra weight
  { c: "#3DDC97", w: 6 },  // fluoro green
  { c: "#3B82F6", w: 5 },  // blue
  { c: "#E91E63", w: 4 },  // magenta
];

// Deterministic PRNG so SSR + hydration match
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickColor(rand: () => number) {
  const total = COLORS.reduce((a, b) => a + b.w, 0);
  let r = rand() * total;
  for (const c of COLORS) {
    if ((r -= c.w) <= 0) return c.c;
  }
  return COLORS[0].c;
}

interface SplatConfig {
  path: string;
  color: string;
  top: string;
  left: string;
  size: number; // px
  rot: number;
  opacity: number;
  delay: number; // ms
  dots: { x: number; y: number; r: number }[];
}

export function Splatter({
  seed = 1,
  count = 2,
  className = "",
}: {
  seed?: number;
  count?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  const splats = useMemo<SplatConfig[]>(() => {
    const rand = mulberry32(seed * 9973 + 17);
    return Array.from({ length: count }).map((_, i) => {
      const size = 220 + rand() * 340;
      return {
        path: SPLATS[Math.floor(rand() * SPLATS.length)],
        color: pickColor(rand),
        top: `${8 + rand() * 74}%`,
        left: `${4 + rand() * 82}%`,
        size,
        rot: rand() * 360,
        opacity: 0.08 + rand() * 0.07, // 8–15%
        delay: i * 120 + Math.floor(rand() * 140),
        dots: Array.from({ length: 3 + Math.floor(rand() * 4) }).map(() => ({
          x: (rand() - 0.5) * size * 1.1,
          y: (rand() - 0.5) * size * 1.1,
          r: 2 + rand() * 5,
        })),
      };
    });
  }, [seed, count]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      {splats.map((s, i) => (
        <div
          key={i}
          className="splat"
          data-in={inView ? "1" : "0"}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            marginLeft: -s.size / 2,
            marginTop: -s.size / 2,
            opacity: s.opacity,
            transform: inView
              ? `rotate(${s.rot}deg) scale(1)`
              : `rotate(${s.rot}deg) scale(0)`,
            transition: `transform 620ms cubic-bezier(.34,1.56,.64,1) ${s.delay}ms`,
            willChange: "transform",
          }}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
            <path d={s.path} fill={s.color} />
            {s.dots.map((d, j) => (
              <circle
                key={j}
                cx={100 + d.x / 4}
                cy={100 + d.y / 4}
                r={d.r}
                fill={s.color}
                opacity={0.75}
              />
            ))}
          </svg>
        </div>
      ))}
    </div>
  );
}

export default Splatter;
