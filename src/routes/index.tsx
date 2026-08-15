import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HudCorners } from "@/components/HudCorners";
import { Crosshair } from "@/components/Crosshair";
import { Reveal } from "@/components/Reveal";

import { useIsMobile } from "@/hooks/use-mobile";
import heroFallback from "@/assets/hero-fallback.webp";
import heroVideo from "@/assets/topgun-hero.mp4";
import heroVideoMobile from "@/assets/topgun-hero-mobile.mp4";
import logoAsset from "@/assets/topgun-logo.webp";

import squad1Asset from "@/assets/real-squad-1.webp";
import squad2Asset from "@/assets/real-squad-2.webp";
import g3 from "@/assets/gallery-3.webp";
import gear1Asset from "@/assets/real-gear-1.webp";
import gear2Asset from "@/assets/real-gear-2.webp";
import kidsAsset from "@/assets/real-kids.webp";
import { lazy, Suspense } from "react";
const BookingCalendar = lazy(() =>
  import("@/components/BookingCalendar").then((m) => ({ default: m.BookingCalendar }))
);

export const Route = createFileRoute("/")({
  component: TopGunPage,
});

/* ---------------- LOGO ---------------- */
function Logo({ className = "", size = "h-10" }: { className?: string; size?: string }) {
  return (
    <img
      src={logoAsset}
      alt="Top Gun Paintball logó"
      width={800}
      height={578}
      className={`${size} w-auto select-none ${className}`}
      draggable={false}
    />
  );
}

/* ---------------- HEADER ---------------- */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    { id: "briefing", label: "Briefing" },
    { id: "packages", label: "Csomagok" },
    { id: "gallery", label: "Galéria" },
    { id: "kids", label: "Gyerek" },
    { id: "location", label: "Helyszín" },
    { id: "reviews", label: "Vélemények" },
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-hud/20 bg-background/85 backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 lg:px-10">
        <a href="#top"><Logo /></a>
        <nav className="hidden items-center justify-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-cream-dim transition-colors hover:text-hud"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#booking" className="btn-deploy text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-background animate-hud-pulse" />
          Foglalás
        </a>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const isMobile = useIsMobile();
  const [showVideo, setShowVideo] = useState(false);
  useEffect(() => {
    // Csak kliens oldalon, első festés után töltsük a videót
    const t = window.setTimeout(() => setShowVideo(true), 400);
    return () => window.clearTimeout(t);
  }, []);
  const videoSrc = isMobile ? heroVideoMobile : heroVideo;
  const playVideo = showVideo && !isMobile;
  return (
    <section id="top" className="relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden hud-scanlines">
      {/* Background video (poster = static fallback) */}
      <div className="absolute inset-0">
        <img
          src={heroFallback}
          alt=""
          aria-hidden
          width={1920}
          height={1080}
          className="h-full w-full object-cover opacity-70"
          fetchPriority="high"
        />
        {playVideo && (
          <video
            key={videoSrc}
            src={videoSrc}
            poster={heroFallback}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        )}
      </div>

      {/* Animated moving smoke / amber wash */}
      <div className="pointer-events-none absolute inset-0 motion-safe:animate-glow-drift" aria-hidden>
        <div className="absolute -left-[20%] top-[10%] h-[60vh] w-[60vh] rounded-full bg-hud/15 blur-[120px]" />
        <div className="absolute right-[-15%] bottom-[5%] h-[55vh] w-[55vh] rounded-full bg-hud/10 blur-[140px]" />
      </div>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
      {/* HUD grid */}
      <div className="pointer-events-none absolute inset-0 hud-grid opacity-50" aria-hidden />
      {/* HUD corners (full viewport) */}
      <div className="pointer-events-none absolute inset-6" aria-hidden>
        <div className="absolute left-0 top-0 h-6 w-6 border-l border-t border-hud" />
        <div className="absolute right-0 top-0 h-6 w-6 border-r border-t border-hud" />
        <div className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-hud" />
        <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-hud" />
      </div>
      {/* Central crosshair guide */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" aria-hidden>
        <svg width="320" height="320" viewBox="0 0 320 320">
          <circle cx="160" cy="160" r="140" fill="none" stroke="#F4A11D" strokeWidth="0.5" strokeDasharray="2 4" />
          <circle cx="160" cy="160" r="80" fill="none" stroke="#F4A11D" strokeWidth="0.5" />
          <line x1="160" y1="10" x2="160" y2="60" stroke="#F4A11D" strokeWidth="0.5" />
          <line x1="160" y1="260" x2="160" y2="310" stroke="#F4A11D" strokeWidth="0.5" />
          <line x1="10" y1="160" x2="60" y2="160" stroke="#F4A11D" strokeWidth="0.5" />
          <line x1="260" y1="160" x2="310" y2="160" stroke="#F4A11D" strokeWidth="0.5" />
        </svg>
      </div>

      {/* HUD telemetry corners */}
      <div className="absolute left-8 top-24 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-hud/80 md:block">
        <div className="animate-flicker">● SYS · ONLINE</div>
        <div className="mt-1 text-cream-dim">NYÍRBÁTOR · HU</div>
        <div className="mt-1 text-cream-dim">SECTOR · ACTIVE</div>
      </div>
      <div className="absolute right-8 top-24 hidden text-right font-mono text-[10px] uppercase tracking-[0.25em] text-hud/80 md:block">
        <div>SECTOR · TG-01</div>
        <div className="mt-1 text-cream-dim">MISSION READY</div>
        <div className="mt-1 text-cream-dim">SEASON · 2026</div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="label-mono mb-6 flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-hud" />
          Mission Briefing · Hungary
          <span className="inline-block h-px w-8 bg-hud" />
        </div>
        <h1 className="font-display text-[15vw] font-bold uppercase leading-[0.85] tracking-tight text-cream sm:text-[12vw] md:text-[9rem] lg:text-[11rem]">
          Top<span className="text-hud text-hud-glow">Gun</span>
        </h1>
        <p className="mt-6 max-w-xl font-mono text-sm uppercase tracking-[0.18em] text-cream-dim">
          Taktikai paintball pálya // Precíz csapatok // Filmszerű bevetések
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a href="#booking" className="btn-deploy">
            <span className="font-mono text-[10px] opacity-70">›››</span>
            Deploy · Foglalás
          </a>
          <a href="#packages" className="btn-ghost-hud">Bevetési opciók</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-hud/80">
        <div className="flex flex-col items-center gap-2">
          <span>Scan · Görgess</span>
          <span className="block h-8 w-px animate-hud-pulse bg-hud" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- BRIEFING ---------------- */
function Briefing() {
  return (
    <section id="briefing" className="relative overflow-hidden border-t border-hud/15 py-28">
      <div className="pointer-events-none absolute inset-0 hud-grid opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="label-mono mb-6">// FILE_001 — TOPGUN/BRIEFING.TXT</div>
        </Reveal>
        <Reveal delay={140}>
          <h2 className="font-display text-4xl font-bold uppercase leading-tight text-cream sm:text-6xl lg:text-7xl">
            Készen állsz, hogy <span className="text-hud">élesben játssz?</span>
          </h2>
        </Reveal>
        <Reveal delay={300}>
          <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-cream-dim md:text-lg">
            Roncsautó, gumibarikádok, rejtett fedezékek, ez nem szimuláció, ez a valódi terep.
            Felkészítünk rendesen: profi felszerelés, alapos eligazítás, és egy Játékmester, aki
            ott van veletek az egész bevetés alatt. Innentől már csak rajtatok múlik, ki jön ki győztesen.
          </p>
        </Reveal>
        <Reveal delay={460}>
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-hud/20 bg-hud/20 sm:grid-cols-3">
            {[
              ["01", "Brief", "Szabályok és csapatok"],
              ["02", "Deploy", "Felszerelés, bemelegítés"],
              ["03", "Engage", "Több játékmód a terepen"],
            ].map(([n, t, d]) => (
              <div key={n} className="bg-background p-6">
                <div className="font-mono text-xs text-hud">{n}</div>
                <div className="mt-2 font-display text-2xl font-bold uppercase text-cream">{t}</div>
                <div className="mt-1 text-sm text-cream-dim">{d}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- HIGHLIGHTS ---------------- */
function Highlights() {
  return (
    <section className="relative overflow-hidden border-t border-hud/15 py-16">
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="flex justify-center">
          <div className="hud-corners-4 relative inline-flex max-w-3xl items-center justify-center border-2 border-hud bg-surface/70 px-10 py-7 text-center shadow-[0_0_50px_-12px_oklch(0.78_0.17_65/0.55)]">
            <HudCorners />
            <div className="flex items-center justify-center gap-4 font-mono text-sm uppercase tracking-[0.25em] text-cream sm:text-base md:text-lg">
              <span className="h-2 w-2 shrink-0 bg-hud animate-hud-pulse shadow-[0_0_10px_var(--hud)]" />
              <span>Városi rendezvények állandó résztvevője</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PACKAGES ---------------- */
function Packages() {
  const items = [
    {
      code: "PKG-01",
      title: "Gyerek",
      tag: "Junior bevetés",
      price: "5 000",
      unit: "Ft / fő",
      perks: ["100 golyó", "Gyerek marker", "Teljes felszerelés", "Játékmester"],
      featured: false,
    },
    {
      code: "PKG-02",
      title: "Pro",
      tag: "Klasszikus",
      price: "7 000",
      unit: "Ft / fő",
      perks: ["200 golyó", "Teljes felszerelés", "Játékmester", "Több játékmód"],
      featured: true,
    },
    {
      code: "PKG-03",
      title: "Master",
      tag: "Hosszú bevetés",
      price: "9 000",
      unit: "Ft / fő",
      perks: ["500 golyó", "Teljes felszerelés", "Játékmester", "Hosszabb játékidő"],
      featured: false,
    },
  ];
  return (
    <section id="packages" className="relative overflow-hidden border-t border-hud/15 py-28">
      <div className="pointer-events-none absolute inset-0 hud-grid opacity-25" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="label-mono mb-4">// PKG · BEVETÉSI OPCIÓK</div>
        </Reveal>
        <Reveal delay={140}>
          <h2 className="font-display text-4xl font-bold uppercase text-cream sm:text-6xl">
            Válassz <span className="text-hud">küldetést</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.code} delay={i * 120}>
              <article
                data-hover
                className={`hud-corners-4 relative flex h-full flex-col border bg-surface/60 p-8 transition-all duration-300 hover:-translate-y-1 ${
                  p.featured
                    ? "border-hud bg-hud/[0.04] shadow-[0_0_40px_-10px_rgba(244,161,29,0.45)]"
                    : "border-hud/25 hover:border-hud/60"
                }`}
              >
                <HudCorners />
                {p.featured && (
                  <div className="absolute -top-3 left-6 bg-hud px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-background">
                    ● Priority
                  </div>
                )}
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-cream-dim">
                  <span>{p.code}</span>
                  <span className="text-hud">{p.tag}</span>
                </div>
                <h3 className="mt-4 font-display text-3xl font-bold uppercase text-cream">{p.title}</h3>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-bold text-hud">{p.price}</span>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-cream-dim">{p.unit}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3 text-sm text-cream/90">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-hud" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#booking"
                  className={`mt-8 inline-flex items-center justify-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] transition ${
                    p.featured
                      ? "bg-hud text-background hover:brightness-110"
                      : "border border-hud/60 text-hud hover:bg-hud/10"
                  }`}
                >
                  Lefoglalom ›
                </a>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="hud-corners-4 relative mt-8 border border-hud/30 bg-surface/40 px-6 py-4">
            <HudCorners />
            <p className="text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-cream-dim sm:text-xs">
              <span className="text-hud">// INTEL:</span> További lőszer <span className="text-cream">1.500 Ft / 100 golyó</span>
              <span className="mx-3 text-hud">·</span>
              Érvényes diákigazolvánnyal <span className="text-hud">+100 golyó ajándék!</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- GALLERY ---------------- */
function Gallery() {
  const imgs = [
    { src: squad1Asset, code: "IMG_001", label: "Squad" },
    { src: squad2Asset, code: "IMG_002", label: "Team Ops" },
    { src: g3, code: "IMG_003", label: "Sunset Ops" },
    { src: gear1Asset, code: "IMG_004", label: "Gear" },
    { src: gear2Asset, code: "IMG_005", label: "Marker" },
  ];
  return (
    <section id="gallery" className="relative overflow-hidden border-t border-hud/15 py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="label-mono mb-4">// FEED · LIVE FRAMES</div>
        </Reveal>
        <Reveal delay={140}>
          <h2 className="font-display text-4xl font-bold uppercase text-cream sm:text-6xl">
            Visszanéző <span className="text-hud">felvételek</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {imgs.map((im, i) => (
            <Reveal
              key={im.code}
              delay={i * 80}
              className={`${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
            >
              <figure
                data-hover
                className="hud-corners-4 group relative aspect-square h-full w-full overflow-hidden border border-hud/25"
              >
                <HudCorners />
                <img
                  src={im.src}
                  alt={im.label}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 font-mono text-[10px] uppercase tracking-[0.25em] text-cream">
                  <span className="text-hud">{im.code}</span>
                  <span>{im.label}</span>
                </figcaption>
                <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-hud/80">
                  <span>● REC</span>
                  <span>00:0{i + 1}:24</span>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- KIDS ---------------- */
function Kids() {
  return (
    <section id="kids" className="relative overflow-hidden border-t border-hud/15 py-28">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <Reveal>
          <figure className="hud-corners-4 relative overflow-hidden border border-hud/25">
            <HudCorners />
            <img
              src={kidsAsset}
              alt="Gyerek paintball csapat"
              loading="lazy"
              width={1280}
              height={960}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-x-3 top-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-hud">
              <span>● JUNIOR SQUAD</span>
              <span>SAFE MODE</span>
            </div>
          </figure>
        </Reveal>
        <Reveal delay={150}>
          <div>
            <div className="label-mono mb-4">// JUNIOR · 9+ ÉV</div>
            <h2 className="font-display text-4xl font-bold uppercase leading-tight text-cream sm:text-5xl">
              Gyerek bevetés. <span className="text-hud">Felnőtt élmény, biztonsággal.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-cream-dim">
              9 éves kortól ajánlott. Speciális, gyerekekre méretezett paintball markereket
              használunk, hogy a felszerelés kényelmes és biztonságos legyen. Folyamatos
              felügyelet, bemelegítés és vidám játékmódok — szülinapokra, osztályoknak,
              hétvégi programra.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 font-mono text-xs uppercase tracking-[0.2em] text-cream">
              {["Gyerek marker", "9+ év", "Felügyelet", "Diák kedvezmény"].map((x) => (
                <li key={x} className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-hud" />{x}</li>
              ))}
            </ul>
            <div className="mt-6 hud-corners-4 relative border border-hud/30 bg-surface/40 px-4 py-3">
              <HudCorners />
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-dim">
                <span className="text-hud">// BONUS:</span> Érvényes diákigazolvánnyal
                <span className="text-hud"> +100 golyó ajándék</span> minden csomaghoz.
              </p>
            </div>
            <a href="#booking" className="btn-deploy mt-10">Gyerekprogram foglalás ›</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- LOCATION ---------------- */
function Location() {
  return (
    <section id="location" className="relative overflow-hidden border-t border-hud/15 py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="label-mono mb-4">// GEO · LOCATION LOCK</div>
        </Reveal>
        <Reveal delay={140}>
          <h2 className="font-display text-4xl font-bold uppercase text-cream sm:text-6xl">
            Találkozó <span className="text-hud">koordináták</span>
          </h2>
        </Reveal>
        <Reveal delay={260}>
          <div className="hud-corners-4 relative mt-12 overflow-hidden border border-hud/30 bg-surface">
            <HudCorners />
            <div className="relative aspect-[16/9] w-full hud-grid">
              {/* Stylized HUD map */}
              <svg viewBox="0 0 800 450" className="h-full w-full">
                <defs>
                  <pattern id="topo" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 20 Q 10 10 20 20 T 40 20" fill="none" stroke="#F4A11D" strokeWidth="0.4" opacity="0.4" />
                  </pattern>
                </defs>
                <rect width="800" height="450" fill="url(#topo)" />
                <path d="M50 380 Q 200 200 400 250 T 750 100" fill="none" stroke="#F4A11D" strokeWidth="1" opacity="0.7" />
                <path d="M0 300 Q 300 350 500 280 T 800 320" fill="none" stroke="#F5E7C8" strokeWidth="0.6" opacity="0.3" />
                <circle cx="420" cy="230" r="40" fill="none" stroke="#F4A11D" strokeDasharray="3 3">
                  <animate attributeName="r" values="30;55;30" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.1;0.9" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="420" cy="230" r="6" fill="#F4A11D" />
                <line x1="420" y1="100" x2="420" y2="200" stroke="#F4A11D" strokeWidth="0.5" />
                <text x="420" y="92" fill="#F4A11D" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" letterSpacing="2">TOPGUN · NYÍRBÁTOR</text>
                <text x="420" y="260" fill="#F5E7C8" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" letterSpacing="2">BAKONYIKERT · SZABOLCS-SZATMÁR-BEREG</text>
              </svg>
              <div className="absolute inset-x-4 top-4 flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-hud">
                <span>● LOCATION LOCK</span>
                <span>SECTOR · TG-01</span>
              </div>
              <div className="absolute inset-x-4 bottom-4 grid grid-cols-1 gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-cream-dim sm:grid-cols-3">
                <div><div className="text-hud">Helyszín</div>Nyírbátor, Bakonyikert</div>
                <div><div className="text-hud">Egyeztetés</div>Előzetes bejelentkezés</div>
                <div><div className="text-hud">Telefon</div>70-603-3929 / 70-603-4088</div>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={380}>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Top+Gun+Paintball+Ny%C3%ADrb%C3%A1tor+Bakonyikert"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-hud"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M9 20l-5.447-9.894A8 8 0 1118.447 10.106L13 20H9z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Útvonalterv kérése
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- REVIEWS ---------------- */
function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden border-t border-hud/15 py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="label-mono mb-4">// FEEDBACK · VERIFIED · GOOGLE</div>
        </Reveal>
        <Reveal delay={140}>
          <h2 className="font-display text-4xl font-bold uppercase text-cream sm:text-6xl">
            Bevetési <span className="text-hud">jelentések</span>
          </h2>
        </Reveal>
        <Reveal delay={280}>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                name: "József Iván",
                rating: 5,
                text: "Életemben először paintballoztam, és tuti, hogy nem utoljára! Nagyon kedves és hozzáértő csapat fogadott minket, mindenkinek csak ajánlani tudom!",
              },
              {
                name: "József Huri",
                rating: 5,
                text: null,
              },
              {
                name: "Fanni Zajácz",
                rating: 5,
                text: null,
              },
            ].map((review, i) => (
              <Reveal key={review.name} delay={i * 120}>
                <article className="hud-corners-4 relative flex h-full flex-col border border-hud/25 bg-surface/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-hud/60">
                  <HudCorners />
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-cream-dim">
                    <span>Google</span>
                    <span className="text-hud">● Verified</span>
                  </div>
                  <div className="mt-5 flex gap-1">
                    {Array.from({ length: review.rating }).map((_, si) => (
                      <svg
                        key={si}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 text-hud"
                        aria-hidden="true"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold uppercase text-cream">{review.name}</h3>
                  {review.text ? (
                    <blockquote className="mt-5 flex-1 border-l-2 border-hud/40 pl-4 text-sm leading-relaxed text-cream/90">
                      „{review.text}”
                    </blockquote>
                  ) : (
                    <div className="mt-5 flex-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream-dim">
                        Csillagos értékelés
                      </span>
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- CONTACT / CTA ---------------- */
function Contact() {
  return (
    <section id="contact" className="relative isolate overflow-hidden border-t border-hud/20 py-28">
      <div className="pointer-events-none absolute inset-0 hud-grid opacity-40" aria-hidden />
      <div className="pointer-events-none absolute -left-[10%] top-1/2 h-[60vh] w-[60vh] -translate-y-1/2 rounded-full bg-hud/15 blur-[140px] motion-safe:animate-glow-drift" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <div className="label-mono mb-6">// FINAL · GO / NO-GO</div>
        </Reveal>
        <Reveal delay={140}>
          <h2 className="font-display text-5xl font-bold uppercase leading-[0.9] text-cream sm:text-7xl lg:text-[7rem]">
            Csatlakozz <br /> a <span className="text-hud text-hud-glow">bevetéshez</span>
          </h2>
        </Reveal>
        <Reveal delay={300}>
          <p className="mx-auto mt-8 max-w-xl font-mono text-sm uppercase tracking-[0.2em] text-cream-dim">
            Foglalj időpontot. A többit ránk bízhatod.
          </p>
        </Reveal>
        <Reveal delay={460}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="tel:+36706033929" className="btn-deploy">● Hívás · 70-603-3929</a>
            <a href="tel:+36706034088" className="btn-ghost-hud">70-603-4088</a>
            <a href="mailto:paintballtopgun@gmail.com" className="btn-ghost-hud">paintballtopgun@gmail.com</a>
          </div>
        </Reveal>
        <Reveal delay={620}>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-px border border-hud/20 bg-hud/20 sm:grid-cols-3">
            {[
              ["Helyszín", "Nyírbátor, Bakonyikert"],
              ["Nyitva", "Előzetes egyeztetés alapján"],
              ["Email", "paintballtopgun@gmail.com"],
            ].map(([k, v]) => (
              <div key={k} className="bg-background p-5 text-left">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-hud">{k}</div>
                <div className="mt-1 font-sans text-sm text-cream">{v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="border-t border-hud/15 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <Logo size="h-12" />

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cream-dim">
          <Link to="/adatkezeles" className="transition-colors hover:text-hud">
            Adatkezelési tájékoztató
          </Link>
          <Link to="/aszf" className="transition-colors hover:text-hud">
            ÁSZF
          </Link>
        </nav>

        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream-dim">
          © {new Date().getFullYear()} Top Gun Paintball · Nyírbátor · All Sectors Reserved
        </div>
      </div>
    </footer>
  );
}

/* ---------------- PAGE ---------------- */
function TopGunPage() {
  return (
    <div className="tactical-cursor-zone relative min-h-screen bg-background text-foreground">
      <Crosshair />
      <Header />
      <main>
        <Hero />
        <Briefing />
        <Highlights />
        <Packages />
        <Gallery />
        <Kids />
        <Location />
        <Reviews />
        <Suspense fallback={<div className="mx-auto max-w-6xl px-6 py-24 text-center font-mono text-xs uppercase tracking-[0.3em] text-hud">Foglalási modul betöltése…</div>}>
          <BookingCalendar />
        </Suspense>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
