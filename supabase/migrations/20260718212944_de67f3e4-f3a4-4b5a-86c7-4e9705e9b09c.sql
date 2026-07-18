CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.notify_new_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://hook.eu1.make.com/8ro85milflt9igc1hknhm357oiw7nmf2',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := to_jsonb(row_to_json(NEW))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_notify_new ON public.bookings;
CREATE TRIGGER bookings_notify_new
AFTER INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.notify_new_booking();