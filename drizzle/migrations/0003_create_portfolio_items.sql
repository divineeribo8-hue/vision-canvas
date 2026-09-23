CREATE TABLE public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL CHECK (section IN ('portraits', 'personal-branding', 'product-photography', 'creative-concepts', 'events-captured-cinematically', 'videography')),
  title text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  orientation text NOT NULL DEFAULT 'landscape' CHECK (orientation IN ('portrait', 'landscape', 'square')),
  media_path text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.portfolio_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT ALL ON public.portfolio_items TO service_role;

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can view published portfolio items"
ON public.portfolio_items
FOR SELECT
TO anon
USING (published = true);

CREATE POLICY "Authenticated owners can manage portfolio items"
ON public.portfolio_items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE INDEX portfolio_items_section_sort_idx ON public.portfolio_items (section, sort_order) WHERE published = true;