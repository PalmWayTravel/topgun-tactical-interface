CREATE UNIQUE INDEX IF NOT EXISTS bookings_active_slot_unique
  ON public.bookings (booking_date, time_slot)
  WHERE status <> 'cancelled';