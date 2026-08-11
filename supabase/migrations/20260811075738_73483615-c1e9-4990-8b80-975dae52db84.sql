CREATE TABLE public.blocked_dates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT blocked_dates_range_valid CHECK (end_date >= start_date)
);

GRANT ALL ON public.blocked_dates TO service_role;

ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE INDEX blocked_dates_end_date_idx ON public.blocked_dates (end_date);