import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { HudCorners } from "@/components/HudCorners";
import {
  addBlockedDate,
  adminLogin,
  adminLogout,
  adminStatus,
  deleteBlockedDate,
  listBlockedDates,
  listBookings,
  listFeedback,
  updateBookingStatus,
} from "@/lib/bookings.functions";


const STATUS_OPTIONS = [
  { value: "pending", label: "Függőben" },
  { value: "confirmed", label: "Visszaigazolva" },
  { value: "completed", label: "Teljesítve" },
  { value: "cancelled", label: "Lemondva" },
] as const;
type BookingStatus = (typeof STATUS_OPTIONS)[number]["value"];

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "TopGun · Admin Console" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Booking = {
  id: string;
  created_at: string;
  booking_date: string;
  time_slot: string;
  package_code: string;
  squad_size: number;
  name: string;
  email: string;
  phone: string;
  status: string;
};

type Feedback = {
  id: string;
  created_at: string;
  booking_id: string | null;
  rating: number;
  comment: string | null;
  redirected_to_google: boolean;
};

function AdminPage() {
  const status = useServerFn(adminStatus);
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    status().then((s) => setUnlocked(s.unlocked)).catch(() => setUnlocked(false));
  }, [status]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setLoginErr(null);
    try {
      const res = await login({ data: { password } });
      if (res.ok) {
        setUnlocked(true);
        setPassword("");
      } else {
        setLoginErr("Hibás jelszó.");
      }
    } catch {
      setLoginErr("Bejelentkezési hiba.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUnlocked(false);
  };

  if (unlocked === null) {
    return (
      <main className="min-h-screen bg-background font-mono text-cream-dim grid place-items-center text-xs uppercase tracking-[0.3em]">
        <span className="animate-pulse">// INIT · CONSOLE</span>
      </main>
    );
  }

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-background text-cream grid place-items-center px-6">
        <form
          onSubmit={handleLogin}
          className="hud-corners-4 relative w-full max-w-md border border-hud/30 bg-surface/50 p-8"
        >
          <HudCorners />
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-hud">
            // ADMIN CONSOLE
          </div>
          <h1 className="font-display text-3xl font-bold uppercase text-cream">
            Belépés <span className="text-hud">HQ</span>
          </h1>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cream-dim">
            Csak engedélyezett operátoroknak
          </p>
          <label className="mt-6 block">
            <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.3em] text-cream-dim">
              Jelszó · ACCESS CODE
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full border border-hud/30 bg-background/40 px-3 py-2.5 font-mono text-sm text-cream outline-none focus:border-hud"
            />
          </label>
          {loginErr && (
            <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-destructive">
              ✕ {loginErr}
            </div>
          )}
          <button
            type="submit"
            disabled={busy || !password}
            className="btn-deploy mt-6 w-full justify-center disabled:opacity-40"
          >
            <span className="font-mono text-[10px] opacity-70">›››</span>
            {busy ? "Ellenőrzés..." : "Belépés"}
          </button>
        </form>
      </main>
    );
  }

  return <AdminConsole onLogout={handleLogout} />;
}

function AdminConsole({ onLogout }: { onLogout: () => void }) {
  const fetchBookings = useServerFn(listBookings);
  const fetchFeedback = useServerFn(listFeedback);
  const [tab, setTab] = useState<"bookings" | "feedback">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchBookings(), fetchFeedback()])
      .then(([b, f]) => {
        setBookings(b as Booking[]);
        setFeedback(f as Feedback[]);
      })
      .finally(() => setLoading(false));
  }, [fetchBookings, fetchFeedback]);

  return (
    <main className="min-h-screen bg-background text-cream">
      <header className="border-b border-hud/20 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-hud">
            // MISSION CONTROL
          </div>
          <h1 className="font-display text-2xl font-bold uppercase">
            Admin <span className="text-hud">Console</span>
          </h1>
        </div>
        <button
          onClick={onLogout}
          className="border border-hud/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cream hover:bg-hud/10"
        >
          Kilépés
        </button>
      </header>

      <div className="px-6 py-6">
        <div className="mb-6 flex gap-2">
          {(["bookings", "feedback"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] transition",
                tab === t
                  ? "border-hud bg-hud text-background"
                  : "border-hud/30 text-cream-dim hover:border-hud/60 hover:text-cream",
              ].join(" ")}
            >
              {t === "bookings" ? `Foglalások (${bookings.length})` : `Értékelések (${feedback.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-cream-dim">
            // BETÖLTÉS...
          </div>
        ) : tab === "bookings" ? (
          <BookingsTable
            rows={bookings}
            onStatusChange={(id, status) =>
              setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
            }
          />
        ) : (
          <FeedbackTable rows={feedback} />
        )}
      </div>
    </main>
  );
}

function BookingsTable({
  rows,
  onStatusChange,
}: {
  rows: Booking[];
  onStatusChange: (id: string, status: BookingStatus) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="border border-hud/20 p-8 text-center font-mono text-xs uppercase tracking-[0.3em] text-cream-dim">
        Nincs foglalás
      </div>
    );
  }
  return (
    <div className="overflow-x-auto border border-hud/20">
      <table className="w-full font-mono text-xs">
        <thead className="bg-surface/60 text-hud">
          <tr className="text-left uppercase tracking-[0.2em]">
            <Th>Rögzítve</Th>
            <Th>Dátum</Th>
            <Th>Idő</Th>
            <Th>Csomag</Th>
            <Th>Létszám</Th>
            <Th>Név</Th>
            <Th>E-mail</Th>
            <Th>Telefon</Th>
            <Th>Státusz</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-hud/10 text-cream">
              <Td>{new Date(r.created_at).toLocaleString("hu-HU")}</Td>
              <Td>{r.booking_date}</Td>
              <Td>{r.time_slot}</Td>
              <Td>{r.package_code}</Td>
              <Td>{r.squad_size}</Td>
              <Td>{r.name}</Td>
              <Td>
                <a className="text-hud hover:underline" href={`mailto:${r.email}`}>
                  {r.email}
                </a>
              </Td>
              <Td>
                <a className="text-hud hover:underline" href={`tel:${r.phone}`}>
                  {r.phone}
                </a>
              </Td>
              <Td>
                <StatusSelect
                  id={r.id}
                  value={(r.status as BookingStatus) ?? "pending"}
                  onChange={(s) => onStatusChange(r.id, s)}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: BookingStatus;
  onChange: (s: BookingStatus) => void;
}) {
  const update = useServerFn(updateBookingStatus);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(0);
  const [err, setErr] = useState<string | null>(null);

  const handle = async (next: BookingStatus) => {
    const prev = value;
    onChange(next);
    setSaving(true);
    setErr(null);
    try {
      await update({ data: { id, status: next } });
      setSavedAt(Date.now());
    } catch {
      setErr("Hiba");
      onChange(prev);
    } finally {
      setSaving(false);
    }
  };

  const justSaved = savedAt && Date.now() - savedAt < 1500;

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        disabled={saving}
        onChange={(e) => handle(e.target.value as BookingStatus)}
        className="border border-hud/40 bg-background/60 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-cream outline-none focus:border-hud disabled:opacity-50"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value} className="bg-background text-cream">
            {o.label}
          </option>
        ))}
      </select>
      {saving && <span className="text-[10px] text-cream-dim">…</span>}
      {!saving && justSaved && (
        <span key={savedAt} className="text-[12px] text-hud animate-flicker">✓</span>
      )}
      {err && <span className="text-[10px] text-destructive">{err}</span>}
    </div>
  );
}


function FeedbackTable({ rows }: { rows: Feedback[] }) {
  if (rows.length === 0) {
    return (
      <div className="border border-hud/20 p-8 text-center font-mono text-xs uppercase tracking-[0.3em] text-cream-dim">
        Nincs értékelés
      </div>
    );
  }
  return (
    <div className="overflow-x-auto border border-hud/20">
      <table className="w-full font-mono text-xs">
        <thead className="bg-surface/60 text-hud">
          <tr className="text-left uppercase tracking-[0.2em]">
            <Th>Dátum</Th>
            <Th>Csillag</Th>
            <Th>Komment</Th>
            <Th>Google-re küldve</Th>
            <Th>Booking ID</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-hud/10 text-cream">
              <Td>{new Date(r.created_at).toLocaleString("hu-HU")}</Td>
              <Td>
                <span className={r.rating >= 4 ? "text-hud" : "text-destructive"}>
                  {"★".repeat(r.rating)}
                  <span className="text-cream-dim/40">{"★".repeat(5 - r.rating)}</span>
                </span>
              </Td>
              <Td>{r.comment || <span className="text-cream-dim/50">—</span>}</Td>
              <Td>{r.redirected_to_google ? "✓" : "—"}</Td>
              <Td className="text-cream-dim">
                {r.booking_id ? r.booking_id.slice(0, 8) : "—"}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 text-[10px] font-semibold">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 align-middle ${className}`}>{children}</td>;
}
