import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-hud/15">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-5">
          <Link
            to="/"
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-hud hover:opacity-80"
          >
            ‹ Vissza a főoldalra
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream-dim">
            Top Gun Paintball
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-mono text-2xl font-bold uppercase tracking-[0.12em] text-hud sm:text-3xl">
          {title}
        </h1>
        <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream-dim">
          {subtitle}
        </div>
        <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-foreground/90">
          {children}
        </div>
      </main>

      <footer className="border-t border-hud/15 py-8">
        <div className="mx-auto max-w-3xl px-6 font-mono text-[10px] uppercase tracking-[0.3em] text-cream-dim">
          © {new Date().getFullYear()} Top Gun Paintball · Nyírbátor
        </div>
      </footer>
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="pt-6 font-mono text-sm font-bold uppercase tracking-[0.18em] text-hud">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-cream">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ml-5 list-disc space-y-1.5 marker:text-hud">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
