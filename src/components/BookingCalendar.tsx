import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { HudCorners } from "@/components/HudCorners";
import { createBooking, getMonthAvailability } from "@/lib/bookings.functions";

const HU_MONTHS = [
  "Január", "Február", "Március", "Április", "Május", "Június",
  "Július", "Augusztus", "Szeptember", "Október", "November", "December",
];
const HU_DOW = ["H", "K", "Sz", "Cs", "P", "Sz", "V"];

const TIME_SLOTS = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const PACKAGES = [
  { code: "PKG-01", name: "Gyerek" },
  { code: "PKG-02", name: "Pro" },
  { code: "PKG-03", name: "Master" },
];

function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startDow = (first.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day: number | null; date: Date | null }> = [];
  for (let i = 0; i < startDow; i++) cells.push({ day: null, date: null });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, date: new Date(year, month, d) });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, date: null });
  return cells;
}

export function BookingCalendar() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [pkg, setPkg] = useState<string>("PKG-02");
  const [squad, setSquad] = useState(8);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<
    { status: "idle" } | { status: "success"; id: string } | { status: "error"; message: string }
  >({ status: "idle" });

  const submitBooking = useServerFn(createBooking);
  const fetchAvailability = useServerFn(getMonthAvailability);

  const [booked, setBooked] = useState<Record<string, string[]>>({});
  const [availLoading, setAvailLoading] = useState(true);

  const loadAvailability = useCallback(
    async (year: number, month: number) => {
      setAvailLoading(true);
      try {
        const res = await fetchAvailability({ data: { year, month: month + 1 } });
        setBooked(res.booked ?? {});
      } catch {
        setBooked({});
      } finally {
        setAvailLoading(false);
      }
    },
    [fetchAvailability],
  );

  useEffect(() => {
    void loadAvailability(cursor.getFullYear(), cursor.getMonth());
  }, [cursor, loadAvailability]);

  const bookedForSelected = useMemo(
    () => (selected ? (booked[dateKey(selected)] ?? []) : []),
    [booked, selected],
  );

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneValid = phone.trim().replace(/[^\d]/g, "").length >= 7;
  const nameValid = name.trim().length >= 2;
  const contactValid = nameValid && emailValid && phoneValid;
  const canDeploy = !!selected && !!slot && contactValid && consent && !submitting;

  const handleSubmit = async () => {
    if (!selected || !slot || !contactValid || !consent) return;
    setSubmitting(true);
    setSubmitState({ status: "idle" });
    try {
      const res = await submitBooking({
        data: {
          booking_date: dateKey(selected),
          time_slot: slot,
          package_code: pkg,
          squad_size: squad,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
      });
      setSubmitState({ status: "success", id: res.id });
      void loadAvailability(cursor.getFullYear(), cursor.getMonth());
      setSelected(null);
      setSlot(null);
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      setSubmitState({
        status: "error",
        message: err instanceof Error ? err.message : "Ismeretlen hiba.",
      });
      void loadAvailability(cursor.getFullYear(), cursor.getMonth());
    } finally {
      setSubmitting(false);
    }
  };

  const cells = useMemo(
    () => monthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  );

  const nav = (delta: number) => {
    const n = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
    setCursor(n);
    setSelected(null);
    setSlot(null);
  };

  // Real availability based on active bookings
  const dayStatus = (d: Date) => {
    if (d < today) return "past";
    const taken = booked[dateKey(d)]?.length ?? 0;
    if (taken >= TIME_SLOTS.length) return "full";
    if (taken > 0) return "hot";
    return "open";
  };

  // Slots earlier than the current hour are expired (today only)
  const isPastSlot = (d: Date | null, t: string) => {
    if (!d) return false;
    const now = new Date();
    if (dateKey(d) !== dateKey(now)) return false;
    const [h, m] = t.split(":").map(Number);
    return (h ?? 0) * 60 + (m ?? 0) <= now.getHours() * 60 + now.getMinutes();
  };


  const isSelected = (d: Date | null) =>
    !!(d && selected && d.getTime() === selected.getTime());

  return (
    <section id="booking" className="relative border-t border-hud/20 py-28">
      <div className="pointer-events-none absolute inset-0 hud-grid opacity-25" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="label-mono mb-4">// SCHED · MISSION TIMESLOT</div>
        <h2 className="font-display text-4xl font-bold uppercase text-cream sm:text-6xl">
          Foglalj <span className="text-hud">bevetési időt</span>
        </h2>
        <p className="mt-4 max-w-xl font-mono text-xs uppercase tracking-[0.2em] text-cream-dim">
          Válassz dátumot · idősávot · csomagot — a többit a HQ kezeli.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* ===================== CALENDAR PANEL ===================== */}
          <div className="hud-corners-4 relative border border-hud/30 bg-surface/50 p-6 sm:p-8">
            <HudCorners />

            {/* top telemetry */}
            <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em]">
              <span className="flex items-center gap-2 text-hud">
                <span className="h-1.5 w-1.5 animate-hud-pulse rounded-full bg-hud" />
                CAL · ONLINE
              </span>
              <span className="text-cream-dim">SYNC · LIVE FEED</span>
            </div>

            {/* month nav */}
            <div className="flex items-center justify-between border-y border-hud/20 py-4">
              <button
                onClick={() => nav(-1)}
                data-hover
                className="grid h-9 w-9 place-items-center border border-hud/40 font-mono text-hud transition hover:bg-hud/10"
                aria-label="Előző hónap"
              >
                ‹
              </button>
              <div className="text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream-dim">
                  Hónap · MO_{String(cursor.getMonth() + 1).padStart(2, "0")}
                </div>
                <div className="font-display text-2xl font-bold uppercase tracking-wider text-cream sm:text-3xl">
                  {HU_MONTHS[cursor.getMonth()]}{" "}
                  <span className="text-hud">{cursor.getFullYear()}</span>
                </div>
              </div>
              <button
                onClick={() => nav(1)}
                data-hover
                className="grid h-9 w-9 place-items-center border border-hud/40 font-mono text-hud transition hover:bg-hud/10"
                aria-label="Következő hónap"
              >
                ›
              </button>
            </div>

            {/* dow header */}
            <div className="mt-6 grid grid-cols-7 gap-1 sm:gap-2">
              {HU_DOW.map((d, i) => (
                <div
                  key={i}
                  className={`py-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] ${
                    i >= 5 ? "text-hud" : "text-cream-dim"
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* day grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {cells.map((c, i) => {
                if (!c.date) {
                  return (
                    <div
                      key={i}
                      className="aspect-square border border-transparent bg-background/20"
                    />
                  );
                }
                const st = dayStatus(c.date);
                const sel = isSelected(c.date);
                const isToday = c.date.getTime() === today.getTime();
                const disabled = st === "past" || st === "full";
                return (
                  <button
                    key={i}
                    disabled={disabled}
                    data-hover={!disabled || undefined}
                    onClick={() => {
                      setSelected(c.date);
                      setSlot(null);
                    }}
                    className={[
                      "group relative aspect-square border font-mono text-sm transition-all",
                      sel
                        ? "border-hud bg-hud text-background shadow-[0_0_20px_-4px_rgba(244,161,29,0.7)]"
                        : disabled
                          ? "cursor-not-allowed border-hud/10 bg-background/30 text-cream-dim/30"
                          : "border-hud/25 bg-background/40 text-cream hover:border-hud hover:bg-hud/10",
                    ].join(" ")}
                  >
                    {/* corner ticks on selected */}
                    {sel && (
                      <>
                        <span className="absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-background" />
                        <span className="absolute right-0 top-0 h-1.5 w-1.5 border-r border-t border-background" />
                        <span className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-background" />
                        <span className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-background" />
                      </>
                    )}
                    <span className="absolute left-1 top-1 text-[10px] opacity-70">
                      {c.day}
                    </span>
                    {/* status indicator */}
                    {!sel && st !== "past" && (
                      <span
                        className={[
                          "absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                          st === "open" ? "bg-hud" : "",
                          st === "hot" ? "bg-hud animate-hud-pulse" : "",
                          st === "full" ? "bg-cream-dim/30" : "",
                        ].join(" ")}
                      />
                    )}
                    {isToday && !sel && (
                      <span className="absolute inset-0 border border-hud/60" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* legend */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hud/15 pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-cream-dim">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-hud" /> Szabad
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-hud-pulse rounded-full bg-hud" /> Telik
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cream-dim/40" /> Megtelt
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 border border-hud/60" /> Ma
              </span>
            </div>
          </div>

          {/* ===================== MISSION PANEL ===================== */}
          <div className="hud-corners-4 relative border border-hud/30 bg-surface/50 p-6 sm:p-8">
            <HudCorners />

            <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em]">
              <span className="text-hud">// MISSION PARAMS</span>
              <span className="text-cream-dim">ID · TG-{String(Date.now()).slice(-5)}</span>
            </div>

            {/* selected date readout */}
            <div className="relative border border-hud/25 bg-background/40 p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream-dim">
                Kijelölt dátum
              </div>
              <div className="mt-1 font-display text-xl font-bold uppercase text-cream">
                {selected
                  ? `${selected.getFullYear()}. ${HU_MONTHS[selected.getMonth()]} ${selected.getDate()}.`
                  : "— válassz a naptárból —"}
              </div>
              <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-hud">
                <span className="h-1 w-1 animate-hud-pulse rounded-full bg-hud" />
                {selected ? "TARGET LOCKED" : "AWAITING TARGET"}
              </div>
            </div>

            {/* time slots */}
            <div className="mt-6">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-hud">
                Idősáv
                {selected && (
                  <span className="ml-2 text-cream-dim">
                    {availLoading
                      ? "· SYNC…"
                      : `· ${TIME_SLOTS.length - bookedForSelected.length} szabad`}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((t) => {
                  const isBooked = bookedForSelected.includes(t);
                  const isExpired = isPastSlot(selected, t);
                  const dis = !selected || isBooked || isExpired || availLoading;
                  const sel = slot === t;
                  return (
                    <button
                      key={t}
                      disabled={dis}
                      data-hover={!dis || undefined}
                      onClick={() => setSlot(t)}
                      title={isBooked ? "Foglalt" : isExpired ? "Lejárt" : undefined}
                      className={[
                        "relative border py-2.5 font-mono text-xs tracking-wider transition",
                        sel
                          ? "border-hud bg-hud text-background"
                          : dis
                            ? "cursor-not-allowed border-hud/10 text-cream-dim/30"
                            : "border-hud/30 text-cream hover:border-hud hover:bg-hud/10",
                      ].join(" ")}
                    >
                      {t}
                      {(isBooked || isExpired) && (
                        <span className="absolute inset-x-0 bottom-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-cream-dim/50">
                          {isBooked ? "Foglalt" : "Lejárt"}
                        </span>
                      )}
                    </button>
                  );
                })}

              </div>
            </div>


            {/* package */}
            <div className="mt-6">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-hud">
                Csomag
              </div>
              <div className="grid grid-cols-1 gap-2">
                {PACKAGES.map((p) => {
                  const sel = pkg === p.code;
                  return (
                    <button
                      key={p.code}
                      data-hover
                      onClick={() => setPkg(p.code)}
                      className={[
                        "flex items-center justify-between border px-3 py-2.5 font-mono text-xs uppercase tracking-[0.2em] transition",
                        sel
                          ? "border-hud bg-hud/10 text-cream"
                          : "border-hud/25 text-cream-dim hover:border-hud/60 hover:text-cream",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`h-2 w-2 ${sel ? "bg-hud" : "border border-hud/40"}`}
                        />
                        {p.name}
                      </span>
                      <span className="text-hud">{p.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* squad size */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em]">
                <span className="text-hud">Csapatlétszám</span>
                <span className="text-cream">{squad} fő</span>
              </div>
              <input
                type="range"
                min={4}
                max={40}
                step={1}
                value={squad}
                onChange={(e) => setSquad(Number(e.target.value))}
                className="hud-range w-full"
              />
              <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-cream-dim">
                <span>4</span><span>20</span><span>40</span>
              </div>
            </div>

            {/* operator contact */}
            <div className="mt-6 border-t border-hud/15 pt-6">
              <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em]">
                <span className="text-hud">// Operátor azonosító</span>
                <span className={contactValid ? "text-hud" : "text-cream-dim"}>
                  {contactValid ? "VERIFIED" : "REQUIRED"}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <ContactField
                  label="Név · CALLSIGN"
                  placeholder="Kovács János"
                  value={name}
                  onChange={setName}
                  valid={nameValid}
                  touched={name.length > 0}
                  maxLength={80}
                />
                <ContactField
                  label="E-mail · COMMS"
                  placeholder="operator@example.com"
                  value={email}
                  onChange={setEmail}
                  valid={emailValid}
                  touched={email.length > 0}
                  type="email"
                  maxLength={120}
                />
                <ContactField
                  label="Telefon · SECURE LINE"
                  placeholder="+36 30 123 4567"
                  value={phone}
                  onChange={setPhone}
                  valid={phoneValid}
                  touched={phone.length > 0}
                  type="tel"
                  maxLength={30}
                />
              </div>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.25em] text-cream-dim">
                Az adatokat kizárólag a foglalás egyeztetésére használjuk.
              </p>
            </div>

            {/* deploy */}
            <button
              disabled={!canDeploy}
              data-hover={canDeploy ? true : undefined}
              onClick={handleSubmit}
              className="btn-deploy mt-6 w-full justify-center disabled:opacity-40"
            >
              <span className="font-mono text-[10px] opacity-70">›››</span>
              {submitting
                ? "Küldés..."
                : !selected || !slot
                  ? "Válassz dátumot + időt"
                  : !contactValid
                    ? "Add meg az elérhetőséged"
                    : "Bevetés foglalása"}
            </button>
            {submitState.status === "success" && (
              <div className="mt-4 border border-hud/60 bg-hud/10 p-3 font-mono text-[11px] uppercase tracking-[0.2em] text-hud">
                ✓ Foglalás rögzítve · hamarosan felvesszük veled a kapcsolatot.
                <div className="mt-1 text-[9px] text-cream-dim">REF · {submitState.id.slice(0, 8).toUpperCase()}</div>
                <div className="mt-2 border-t border-hud/25 pt-2 text-[10px] normal-case tracking-normal text-cream-dim">
                  Lemondanád?{" "}
                  <a
                    href={`/lemondas?booking_id=${submitState.id}`}
                    className="text-hud underline underline-offset-2 hover:opacity-80"
                  >
                    Kattints ide
                  </a>
                </div>
              </div>
            )}
            {submitState.status === "error" && (
              <div className="mt-4 border border-destructive/60 bg-destructive/10 p-3 font-mono text-[11px] uppercase tracking-[0.2em] text-destructive">
                ✕ {submitState.message}
              </div>
            )}
            <div className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-cream-dim">
              Visszaigazolás · 24 órán belül
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactField({
  label, placeholder, value, onChange, valid, touched, type = "text", maxLength,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  valid: boolean;
  touched: boolean;
  type?: string;
  maxLength?: number;
}) {
  const showError = touched && !valid;
  const showOk = touched && valid;
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em]">
        <span className="text-cream-dim">{label}</span>
        <span className={showError ? "text-destructive" : showOk ? "text-hud" : "text-cream-dim/50"}>
          {showError ? "✕ ERR" : showOk ? "✓ OK" : "··"}
        </span>
      </div>
      <div
        className={[
          "relative border bg-background/40 transition",
          showError ? "border-destructive/70" : showOk ? "border-hud/70" : "border-hud/25 focus-within:border-hud/60",
        ].join(" ")}
      >
        <span className="absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-hud/60" />
        <span className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-hud/60" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          data-hover
          className="w-full bg-transparent px-3 py-2.5 font-mono text-sm text-cream outline-none placeholder:text-cream-dim/40"
        />
      </div>
    </label>
  );
}
