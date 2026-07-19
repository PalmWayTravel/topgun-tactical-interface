import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { HudCorners } from "@/components/HudCorners";
import { getBookingForCancel, cancelBooking } from "@/lib/bookings.functions";

const HU_MONTHS = [
  "Január", "Február", "Március", "Április", "Május", "Június",
  "Július", "Augusztus", "Szeptember", "Október", "November", "December",
];

const PACKAGE_NAMES: Record<string, string> = {
  "PKG-01": "Gyerek",
  "PKG-02": "Pro",
  "PKG-03": "Master",
};

const searchSchema = z.object({
  booking_id: z.string().uuid().optional(),
});

export const Route = createFileRoute("/lemondas")({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "TopGun · Foglalás lemondása" },
      { name: "description", content: "Foglalás lemondása." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CancelPage,
});

type Booking = {
  id: string;
  booking_date: string;
  time_slot: string;
  package_code: string;
  squad_size: number;
  name: string;
  status: string;
};

type LoadState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "not_found" }
  | { status: "already_cancelled"; booking: Booking }
  | { status: "ready"; booking: Booking }
  | { status: "error"; message: string };

type ActionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "done" }
  | { status: "error"; message: string };

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${y}. ${HU_MONTHS[m - 1]} ${d}.`;
}

function CancelPage() {
  const { booking_id } = Route.useSearch();
  const fetchBooking = useServerFn(getBookingForCancel);
  const submitCancel = useServerFn(cancelBooking);
  const [load, setLoad] = useState<LoadState>({ status: "loading" });
  const [action, setAction] = useState<ActionState>({ status: "idle" });

  useEffect(() => {
    if (!booking_id) {
      setLoad({ status: "missing" });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchBooking({ data: { id: booking_id } });
        if (cancelled) return;
        if (!res.found) {
          setLoad({ status: "not_found" });
          return;
        }
        if (res.booking.status === "cancelled") {
          setLoad({ status: "already_cancelled", booking: res.booking });
          return;
        }
        setLoad({ status: "ready", booking: res.booking });
      } catch (err) {
        if (cancelled) return;
        setLoad({
          status: "error",
          message: err instanceof Error ? err.message : "Hiba történt.",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [booking_id, fetchBooking]);

  const handleCancel = async () => {
    if (load.status !== "ready") return;
    setAction({ status: "submitting" });
    try {
      const res = await submitCancel({ data: { id: load.booking.id } });
      if (!res.ok) {
        if (res.reason === "already_cancelled") {
          setLoad({ status: "already_cancelled", booking: load.booking });
          setAction({ status: "idle" });
          return;
        }
        setLoad({ status: "not_found" });
        setAction({ status: "idle" });
        return;
      }
      setAction({ status: "done" });
    } catch (err) {
      setAction({
        status: "error",
        message: err instanceof Error ? err.message : "Hiba történt.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-background text-cream grid place-items-center px-6 py-12">
      <div className="hud-corners-4 relative w-full max-w-lg border border-hud/30 bg-surface/50 p-8">
        <HudCorners />
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-hud">
          // MISSION ABORT
        </div>
        <h1 className="font-display text-3xl font-bold uppercase text-cream sm:text-4xl">
          Foglalás <span className="text-hud">lemondása</span>
        </h1>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cream-dim">
          Ellenőrizd az adatokat, majd erősítsd meg
        </p>

        <div className="mt-8">
          {load.status === "loading" && (
            <div className="border border-hud/25 bg-background/40 p-6 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-hud animate-pulse">
              Foglalás betöltése...
            </div>
          )}

          {load.status === "missing" && (
            <ErrorBox title="Hiányzó azonosító">
              A link nem tartalmaz foglalás-azonosítót. Használd a visszaigazoló emailben kapott linket.
            </ErrorBox>
          )}

          {load.status === "not_found" && (
            <ErrorBox title="Nem található">
              A megadott foglalás nem található. Lehet, hogy hibás a link.
            </ErrorBox>
          )}

          {load.status === "error" && (
            <ErrorBox title="Hiba">{load.message}</ErrorBox>
          )}

          {load.status === "already_cancelled" && (
            <>
              <BookingSummary booking={load.booking} />
              <div className="mt-6 border border-hud/30 bg-background/40 p-4 font-mono text-[11px] uppercase tracking-[0.25em] text-cream-dim">
                ⓘ Ez a foglalás már korábban lemondásra került.
              </div>
            </>
          )}

          {load.status === "ready" && action.status !== "done" && (
            <>
              <BookingSummary booking={load.booking} />
              <div className="mt-6 border border-destructive/40 bg-destructive/5 p-4 font-mono text-[10px] uppercase tracking-[0.25em] text-cream-dim">
                Ezt a foglalást <span className="text-destructive">végleg lemondod</span>. A művelet nem visszavonható.
              </div>
              <button
                onClick={handleCancel}
                disabled={action.status === "submitting"}
                className="btn-deploy mt-6 w-full justify-center border-destructive/70 text-destructive hover:bg-destructive/10 disabled:opacity-40"
              >
                <span className="font-mono text-[10px] opacity-70">›››</span>
                {action.status === "submitting" ? "Lemondás..." : "Foglalás lemondása"}
              </button>
              {action.status === "error" && (
                <div className="mt-4 border border-destructive/60 bg-destructive/10 p-3 font-mono text-[10px] uppercase tracking-[0.25em] text-destructive">
                  ✕ {action.message}
                </div>
              )}
            </>
          )}

          {action.status === "done" && (
            <div className="border border-hud/60 bg-hud/10 p-6 text-center">
              <div className="font-display text-2xl font-bold uppercase text-hud">
                Foglalás lemondva
              </div>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-cream-dim">
                A HQ értesítést kap a lemondásról. Köszönjük, hogy szóltál!
              </p>
              <a
                href="/"
                className="mt-6 inline-block border border-hud/50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-hud hover:bg-hud/10"
              >
                ‹ Vissza a főoldalra
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function BookingSummary({ booking }: { booking: Booking }) {
  return (
    <div className="relative border border-hud/25 bg-background/40 p-5">
      <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-hud" />
      <span className="absolute right-0 top-0 h-2 w-2 border-r border-t border-hud" />
      <span className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-hud" />
      <span className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-hud" />
      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-cream-dim">
        REF · {booking.id.slice(0, 8).toUpperCase()}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4 font-mono text-[11px] uppercase tracking-[0.2em]">
        <Field label="Dátum" value={formatDate(booking.booking_date)} />
        <Field label="Idősáv" value={booking.time_slot} />
        <Field label="Csomag" value={PACKAGE_NAMES[booking.package_code] ?? booking.package_code} />
        <Field label="Létszám" value={`${booking.squad_size} fő`} />
        <div className="col-span-2">
          <Field label="Név" value={booking.name} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] text-cream-dim">{label}</div>
      <div className="mt-1 text-cream">{value}</div>
    </div>
  );
}

function ErrorBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-destructive/60 bg-destructive/10 p-5">
      <div className="font-display text-lg font-bold uppercase text-destructive">
        ✕ {title}
      </div>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-cream-dim">
        {children}
      </p>
      <a
        href="/"
        className="mt-4 inline-block border border-hud/50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-hud hover:bg-hud/10"
      >
        ‹ Vissza a főoldalra
      </a>
    </div>
  );
}
