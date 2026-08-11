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

export const getMonthAvailability = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ year: z.number().int().min(2000).max(2100), month: z.number().int().min(1).max(12) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const start = `${data.year}-${String(data.month).padStart(2, "0")}-01`;
    const endDate = new Date(Date.UTC(data.year, data.month, 1));
    const end = endDate.toISOString().slice(0, 10);
    const lastDay = new Date(Date.UTC(data.year, data.month, 0)).toISOString().slice(0, 10);
    const { data: rows, error } = await supabaseAdmin
      .from("bookings")
      .select("booking_date, time_slot")
      .neq("status", "cancelled")
      .gte("booking_date", start)
      .lt("booking_date", end);
    if (error) {
      console.error("getMonthAvailability error", error);
      throw new Error("Nem sikerült betölteni a foglaltságot.");
    }
    const booked: Record<string, string[]> = {};
    for (const r of rows ?? []) {
      const key = r.booking_date as string;
      (booked[key] ??= []).push(r.time_slot as string);
    }

    // Closed (blocked) days overlapping this month
    const { data: blocks, error: blockErr } = await supabaseAdmin
      .from("blocked_dates")
      .select("start_date, end_date, reason")
      .lte("start_date", lastDay)
      .gte("end_date", start);
    if (blockErr) {
      console.error("getMonthAvailability blocked error", blockErr);
      throw new Error("Nem sikerült betölteni a foglaltságot.");
    }
    const blocked: Record<string, string | null> = {};
    for (const b of blocks ?? []) {
      const cur = new Date(`${b.start_date}T00:00:00Z`);
      const last = new Date(`${b.end_date}T00:00:00Z`);
      while (cur <= last) {
        const key = cur.toISOString().slice(0, 10);
        if (key >= start && key <= lastDay) blocked[key] = (b.reason as string | null) ?? null;
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
    }
    return { booked, blocked };
  });


export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    // Past-time check in Europe/Budapest
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Budapest",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).formatToParts(new Date());
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
    const nowKey = `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
    const slotKey = `${data.booking_date} ${data.time_slot}`;
    if (slotKey < nowKey) {
      throw new Error("Ez az időpont már elmúlt, kérlek válassz jövőbeli időpontot.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: blocked, error: blockedErr } = await supabaseAdmin
      .from("blocked_dates")
      .select("id")
      .lte("start_date", data.booking_date)
      .gte("end_date", data.booking_date)
      .limit(1);
    if (blockedErr) {
      console.error("createBooking blocked check error", blockedErr);
      throw new Error("Nem sikerült rögzíteni a foglalást.");
    }
    if (blocked && blocked.length > 0) {
      throw new Error("Ez az időszak jelenleg zárva tart, kérlek válassz másik dátumot.");
    }



    const { data: taken, error: checkErr } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .eq("booking_date", data.booking_date)
      .eq("time_slot", data.time_slot)
      .neq("status", "cancelled")
      .limit(1);
    if (checkErr) {
      console.error("createBooking check error", checkErr);
      throw new Error("Nem sikerült rögzíteni a foglalást.");
    }
    if (taken && taken.length > 0) throw new Error("Ez az időpont már foglalt, kérlek válassz másikat.");

    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert(data)
      .select("id")
      .single();
    if (error) {
      console.error("createBooking error", error);
      // 23505 = unique_violation (partial unique index on active slots)
      if (error.code === "23505" || /duplicate key|unique constraint/i.test(error.message ?? "")) {
        throw new Error("Ez az időpont már foglalt, kérlek válassz másikat.");
      }
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

// ===================== ZÁRVA TARTÁS (blocked dates) =====================

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const listBlockedDates = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const todayKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const { data, error } = await supabaseAdmin
    .from("blocked_dates")
    .select("*")
    .gte("end_date", todayKey)
    .order("start_date", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const addBlockedDate = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        start_date: dateStr,
        end_date: dateStr,
        reason: z.string().trim().max(200).nullable().optional(),
      })
      .refine((v) => v.end_date >= v.start_date, {
        message: "A záró dátum nem lehet korábbi a kezdő dátumnál.",
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("blocked_dates")
      .insert({
        start_date: data.start_date,
        end_date: data.end_date,
        reason: data.reason?.trim() ? data.reason.trim() : null,
      })
      .select("*")
      .single();
    if (error) {
      console.error("addBlockedDate error", error);
      throw new Error("Nem sikerült rögzíteni a zárást.");
    }
    return row;
  });

export const deleteBlockedDate = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("blocked_dates").delete().eq("id", data.id);
    if (error) {
      console.error("deleteBlockedDate error", error);
      throw new Error("Nem sikerült törölni a zárást.");
    }
    return { ok: true as const };
  });
