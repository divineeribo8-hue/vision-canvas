CREATE TABLE public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  package_name text NOT NULL,
  price text NOT NULL,
  duration text NOT NULL,
  deliverables text NOT NULL,
  preferred_date text NOT NULL,
  preferred_time text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  location_choice text NOT NULL,
  location_details text,
  inspiration_notes text,
  inspiration_files jsonb NOT NULL DEFAULT '[]'::jsonb,
  vision text NOT NULL,
  relevant_notes text,
  contact_method text,
  status text NOT NULL DEFAULT 'booking_request_sent',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.booking_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_requests TO authenticated;
GRANT ALL ON public.booking_requests TO service_role;

ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit booking requests"
ON public.booking_requests
FOR INSERT
TO anon
WITH CHECK (status = 'booking_request_sent');

CREATE POLICY "Authenticated users can read booking requests"
ON public.booking_requests
FOR SELECT
TO authenticated
USING (true);