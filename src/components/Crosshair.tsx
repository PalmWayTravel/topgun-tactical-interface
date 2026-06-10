import { useEffect, useRef, useState } from "react";

export function Crosshair() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mq.matches || reduced) return;
    setEnabled(true);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x, ty = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      const el = e.target as HTMLElement;
      setActive(!!el.closest("a, button, [data-hover]"));
    };

    const loop = () => {
      x += (tx - x) * 0.25;
      y += (ty - y) * 0.25;
      if (ref.current) ref.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-screen"
      style={{ transform: "translate3d(-100px,-100px,0)" }}
    >
      <svg
        width={active ? 56 : 36}
        height={active ? 56 : 36}
        viewBox="0 0 56 56"
        className="transition-all duration-150"
        style={{ filter: "drop-shadow(0 0 6px rgba(244,161,29,0.7))" }}
      >
        <circle cx="28" cy="28" r={active ? 18 : 12} fill="none" stroke="#F4A11D" strokeWidth="1" opacity="0.9" />
        <circle cx="28" cy="28" r="1.5" fill="#F4A11D" />
        <line x1="28" y1="2"  x2="28" y2={active ? 10 : 14} stroke="#F4A11D" strokeWidth="1" />
        <line x1="28" y1={active ? 46 : 42} x2="28" y2="54" stroke="#F4A11D" strokeWidth="1" />
        <line x1="2"  y1="28" x2={active ? 10 : 14} y2="28" stroke="#F4A11D" strokeWidth="1" />
        <line x1={active ? 46 : 42} y1="28" x2="54" y2="28" stroke="#F4A11D" strokeWidth="1" />
      </svg>
    </div>
  );
}
