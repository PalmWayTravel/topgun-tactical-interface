import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { HudCorners } from "@/components/HudCorners";
import { createFeedback } from "@/lib/bookings.functions";

const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJLbCMD3GBR0cRdLxTixN_qAc";

const searchSchema = z.object({
  booking_id: z.string().uuid().optional(),
});

export const Route = createFileRoute("/ertekeles")({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "TopGun · Értékelés" },
      { name: "description", content: "Mondd el, milyen volt a bevetés." },
    ],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  const { booking_id } = Route.useSearch();
  const submitFeedback = useServerFn(createFeedback);
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "thanks" }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const handlePick = async (stars: number) => {
    if (state.status === "submitting") return;
    setRating(stars);
    if (stars >= 4) {
      setState({ status: "submitting" });
      try {
        await submitFeedback({
          data: {
            booking_id: booking_id ?? null,
            rating: stars,
            comment: null,
            redirected_to_google: true,
          },
        });
        window.location.href = GOOGLE_REVIEW_URL;
      } catch (err) {
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "Hiba történt.",
        });
      }
    }
  };

  const handleSubmitLow = async () => {
    if (rating < 1 || rating > 3) return;
    setState({ status: "submitting" });
    try {
      await submitFeedback({
        data: {
          booking_id: booking_id ?? null,
          rating,
          comment: comment.trim() ? comment.trim() : null,
          redirected_to_google: false,
        },
      });
      setState({ status: "thanks" });
    } catch (err) {
      setState({
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
          // MISSION DEBRIEF
        </div>
        <h1 className="font-display text-3xl font-bold uppercase text-cream sm:text-4xl">
          Milyen volt a <span className="text-hud">bevetés?</span>
        </h1>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cream-dim">
          Egy kattintás — értékeld az élményt
        </p>

        {state.status === "thanks" ? (
          <div className="mt-8 border border-hud/60 bg-hud/10 p-6 text-center">
            <div className="font-display text-2xl font-bold uppercase text-hud">
              Köszönjük!
            </div>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-cream-dim">
              Köszönjük az őszinte visszajelzést — hamarosan keresünk.
            </p>
          </div>
        ) : (
          <>
            <div
              className="mt-8 flex items-center justify-center gap-2"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const active = (hover || rating) >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHover(n)}
                    onClick={() => handlePick(n)}
                    disabled={state.status === "submitting"}
                    aria-label={`${n} csillag`}
                    className={[
                      "text-5xl transition-transform hover:scale-110 disabled:opacity-50",
                      active ? "text-hud drop-shadow-[0_0_10px_rgba(244,161,29,0.6)]" : "text-cream-dim/30",
                    ].join(" ")}
                  >
                    ★
                  </button>
                );
              })}
            </div>
            <div className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-cream-dim">
              {rating > 0 ? `${rating} / 5` : "—"}
            </div>

            {rating >= 1 && rating <= 3 && state.status !== "submitting" && (
              <div className="mt-8 border-t border-hud/15 pt-6">
                <label className="block">
                  <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.3em] text-hud">
                    // Mit tudnánk jobban csinálni?
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={1000}
                    rows={4}
                    placeholder="Írd le pár sorban..."
                    className="w-full border border-hud/25 bg-background/40 px-3 py-2.5 font-mono text-sm text-cream outline-none focus:border-hud placeholder:text-cream-dim/40"
                  />
                </label>
                <button
                  onClick={handleSubmitLow}
                  className="btn-deploy mt-4 w-full justify-center"
                >
                  <span className="font-mono text-[10px] opacity-70">›››</span>
                  Visszajelzés küldése
                </button>
              </div>
            )}

            {rating >= 4 && state.status === "submitting" && (
              <div className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-hud animate-pulse">
                Átirányítás a Google értékeléshez...
              </div>
            )}

            {state.status === "error" && (
              <div className="mt-4 border border-destructive/60 bg-destructive/10 p-3 font-mono text-[10px] uppercase tracking-[0.25em] text-destructive">
                ✕ {state.message}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
