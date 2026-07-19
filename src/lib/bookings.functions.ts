import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

type AdminSession = { unlocked?: boolean };

function adminSessionConfig() {
  const password = process.env.ADMIN_SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set (32+ chars)");
  }
  return {
    password,
    name: "topgun-admin",
    maxAge: 60 * 60 * 8, // 8h
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(adminSessionConfig());
  if (!session.data.unlocked) {
    throw new Error("UNAUTHORIZED");
  }
}

const bookingSchema = z.object({
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time_slot: z.string().min(1).max(20),
  package_code: z.string().min(1).max(20),
  squad_size: z.number().int().min(1).max(200),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().min(6).max(30),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert(data)
      .select("id")
      .single();
    if (error) {
      console.error("createBooking error", error);
      throw new Error("Nem sikerült rögzíteni a foglalást.");
    }
    return { id: row.id };
  });

const feedbackSchema = z.object({
  booking_id: z.string().uuid().nullable().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).nullable().optional(),
  redirected_to_google: z.boolean(),
});

export const createFeedback = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => feedbackSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("feedback").insert({
      booking_id: data.booking_id ?? null,
      rating: data.rating,
      comment: data.comment ?? null,
      redirected_to_google: data.redirected_to_google,
    });
    if (error) {
      console.error("createFeedback error", error);
      throw new Error("Nem sikerült elmenteni a visszajelzést.");
    }
    return { ok: true as const };
  });

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ password: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("ADMIN_PASSWORD is not set");
    if (data.password !== expected) {
      return { ok: false as const };
    }
    const session = await useSession<AdminSession>(adminSessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(adminSessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(adminSessionConfig());
  return { unlocked: !!session.data.unlocked };
});

export const listBookings = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listFeedback = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

export const updateBookingStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => statusSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const getBookingForCancel = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .select("id, booking_date, time_slot, package_code, squad_size, name, status")
      .eq("id", data.id)
      .maybeSingle();
    if (error) {
      console.error("getBookingForCancel error", error);
      throw new Error("Nem sikerült betölteni a foglalást.");
    }
    if (!row) return { found: false as const };
    return { found: true as const, booking: row };
  });

export const cancelBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing, error: readErr } = await supabaseAdmin
      .from("bookings")
      .select("id, status")
      .eq("id", data.id)
      .maybeSingle();
    if (readErr) throw new Error("Nem sikerült betölteni a foglalást.");
    if (!existing) return { ok: false as const, reason: "not_found" as const };
    if (existing.status === "cancelled") return { ok: false as const, reason: "already_cancelled" as const };
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", data.id);
    if (error) {
      console.error("cancelBooking error", error);
      throw new Error("Nem sikerült lemondani a foglalást.");
    }
    return { ok: true as const };
  });
