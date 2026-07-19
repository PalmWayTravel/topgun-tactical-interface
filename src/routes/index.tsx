import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HudCorners } from "@/components/HudCorners";
import { Crosshair } from "@/components/Crosshair";
import { Reveal } from "@/components/Reveal";
import { Splatter } from "@/components/Splatter";

import heroFallback from "@/assets/hero-fallback.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import kidsImg from "@/assets/kids.jpg";
import { BookingCalendar } from "@/components/BookingCalendar";

export const Route = createFileRoute("/")({
  component: TopGunPage,
});

/* ---------------- LOGO PLACEHOLDER ---------------- */
function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="none" stroke="#F4A11D" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="10" fill="none" stroke="#F4A11D" strokeWidth="1" />
        <circle cx="20" cy="20" r="2" fill="#F4A11D" />
        <line x1="20" y1="2" x2="20" y2="10" stroke="#F4A11D" strokeWidth="1.5" />
        <line x1="20" y1="30" x2="20" y2="38" stroke="#F4A11D" strokeWidth="1.5" />
        <line x1="2" y1="20" x2="10" y2="20" stroke="#F4A11D" strokeWidth="1.5" />
        <line x1="30" y1="20" x2="38" y2="20" stroke="#F4A11D" strokeWidth="1.5" />
      </svg>
      <div className="leading-none">
        <div className="font-display text-xl font-bold uppercase tracking-[0.18em] text-cream">
          Top<span className="text-hud">Gun</span>
        </div>
        <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-cream-dim">Paintball · Tactical Field</div>
      </div>
    </div>
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
  return (
    <section id="top" className="relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden hud-scanlines">
      {/* Background fallback image — replaced by video when available */}
      <div className="absolute inset-0">
        <img
          src={heroFallback}
          alt=""
          className="h-full w-full object-cover opacity-70 motion-safe:animate-glow-drift"
          width={1920}
          height={1080}
        />
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
      <Splatter seed={11} count={2} />
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
        <div className="mt-1 text-cream-dim">N 47°29′ · E 19°02′</div>
        <div className="mt-1 text-cream-dim">FIELD · 12.4 HA</div>
      </div>
      <div className="absolute right-8 top-24 hidden text-right font-mono text-[10px] uppercase tracking-[0.25em] text-hud/80 md:block">
        <div>SECTOR · TG-01</div>
        <div className="mt-1 text-cream-dim">MISSION READY</div>
        <div className="mt-1 text-cream-dim">SEASON · 2026</div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <div className="label-mono mb-6 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-hud" />
            Mission Briefing · Hungary
            <span className="inline-block h-px w-8 bg-hud" />
          </div>
        </Reveal>
        <Reveal delay={180}>
          <h1 className="font-display text-[15vw] font-bold uppercase leading-[0.85] tracking-tight text-cream sm:text-[12vw] md:text-[9rem] lg:text-[11rem]">
            Top<span className="text-hud text-hud-glow">Gun</span>
          </h1>
        </Reveal>
        <Reveal delay={360}>
          <p className="mt-6 max-w-xl font-mono text-sm uppercase tracking-[0.18em] text-cream-dim">
            Taktikai paintball pálya // Precíz csapatok // Filmszerű bevetések
          </p>
        </Reveal>
        <Reveal delay={520}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a href="#booking" className="btn-deploy">
              <span className="font-mono text-[10px] opacity-70">›››</span>
              Deploy · Foglalás
            </a>
            <a href="#packages" className="btn-ghost-hud">Bevetési opciók</a>
          </div>
        </Reveal>
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
    <section id="briefing" className="relative border-t border-hud/15 py-28">
      <div className="pointer-events-none absolute inset-0 hud-grid opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="label-mono mb-6">// FILE_001 — TOPGUN/BRIEFING.TXT</div>
        </Reveal>
        <Reveal delay={140}>
          <h2 className="font-display text-4xl font-bold uppercase leading-tight text-cream sm:text-6xl lg:text-7xl">
            Itt nem játszol. <span className="text-hud">Bevetésen vagy.</span>
          </h2>
        </Reveal>
        <Reveal delay={300}>
          <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-cream-dim md:text-lg">
            12 hektár tematikus terep, falusi rom, erdei sávok, bunker mező. Profi felszerelés,
            bemelegítés, taktikai brief, jegyző bíró. Te csak megnyered.
          </p>
        </Reveal>
        <Reveal delay={460}>
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-hud/20 bg-hud/20 sm:grid-cols-3">
            {[
              ["01", "Brief", "Szabályok és csapatok"],
              ["02", "Deploy", "Felszerelés, bemelegítés"],
              ["03", "Engage", "Több játékmód a tereppen"],
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
  const items = [
    "1 pálya / szektor",
    "Városi rendezvények állandó résztvevője",
  ];
  return (
    <section className="relative border-t border-hud/15 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:gap-6">
          {items.map((label) => (
            <div
              key={label}
              className="hud-corners-4 relative flex-1 border border-hud/30 bg-surface/60 px-6 py-5 text-center"
            >
              <HudCorners />
              <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-cream sm:text-sm">
                <span className="h-1.5 w-1.5 shrink-0 bg-hud animate-hud-pulse" />
                <span>{label}</span>
              </div>
            </div>
          ))}
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
      perks: ["100 golyó", "Gyerek marker", "Teljes felszerelés", "Bíró + brief"],
      featured: false,
    },
    {
      code: "PKG-02",
      title: "Pro",
      tag: "Klasszikus",
      price: "7 000",
      unit: "Ft / fő",
      perks: ["200 golyó", "Teljes felszerelés", "Bíró + brief", "Több játékmód"],
      featured: true,
    },
    {
      code: "PKG-03",
      title: "Master",
      tag: "Hosszú bevetés",
      price: "9 000",
      unit: "Ft / fő",
      perks: ["500 golyó", "Teljes felszerelés", "Bíró + brief", "Hosszabb játékidő"],
      featured: false,
    },
  ];
  return (
    <section id="packages" className="relative border-t border-hud/15 py-28">
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
    { src: g1, code: "IMG_001", label: "Engage" },
    { src: g2, code: "IMG_002", label: "Bunker" },
    { src: g3, code: "IMG_003", label: "Sunset Ops" },
    { src: g4, code: "IMG_004", label: "Gear" },
    { src: g5, code: "IMG_005", label: "Squad" },
  ];
  return (
    <section id="gallery" className="relative border-t border-hud/15 py-28">
      <div className="mx-auto max-w-7xl px-6">
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
    <section id="kids" className="relative border-t border-hud/15 py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <Reveal>
          <figure className="hud-corners-4 relative overflow-hidden border border-hud/25">
            <HudCorners />
            <img
              src={kidsImg}
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
    <section id="location" className="relative border-t border-hud/15 py-28">
      <div className="mx-auto max-w-7xl px-6">
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
      </div>
    </section>
  );
}

/* ---------------- REVIEWS ---------------- */
function Reviews() {
  const items = [
    { n: "Bence T.", r: 5, t: "Brutál hangulat, profi szervezés. A legénybúcsú legjobb része." },
    { n: "Anna K.", r: 5, t: "Céges csapatépítőnek tökéletes. Mindenki kiosztotta egymást." },
    { n: "Márk P.", r: 5, t: "A gyerek szülinapra is királyság, külön junior pálya, animátor." },
  ];
  return (
    <section id="reviews" className="relative border-t border-hud/15 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="label-mono mb-4">// FEEDBACK · VERIFIED · GOOGLE</div>
        </Reveal>
        <Reveal delay={140}>
          <h2 className="font-display text-4xl font-bold uppercase text-cream sm:text-6xl">
            Bevetési <span className="text-hud">jelentések</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((rev, i) => (
            <Reveal key={rev.n} delay={i * 120}>
              <article data-hover className="hud-corners-4 relative h-full border border-hud/25 bg-surface/60 p-7">
                <HudCorners />
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-cream-dim">
                  <span>REC · 00{i + 1}</span>
                  <span className="text-hud">{"★".repeat(rev.r)}</span>
                </div>
                <p className="mt-5 text-cream">"{rev.t}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-hud/15 pt-4">
                  <div className="grid h-9 w-9 place-items-center border border-hud/40 font-mono text-xs text-hud">
                    {rev.n.charAt(0)}
                  </div>
                  <div>
                    <div className="font-mono text-sm text-cream">{rev.n}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream-dim">Google Review</div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
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
        <Logo />
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
        <BookingCalendar />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
