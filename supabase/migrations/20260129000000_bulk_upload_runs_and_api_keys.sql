-- Bulk upload runs: store previous scrape/bulk-upload sessions for revisiting
CREATE TABLE IF NOT EXISTS public.bulk_upload_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  name text,
  file_name text,
  product_count integer NOT NULL DEFAULT 0,
  products jsonb NOT NULL DEFAULT '[]'::jsonb
);

-- User API keys: store provider API keys per user (e.g. Firecrawl) for cloud-backed scraping
CREATE TABLE IF NOT EXISTS public.user_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  key_value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bulk_upload_runs_user_id ON public.bulk_upload_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_bulk_upload_runs_created_at ON public.bulk_upload_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_user_id ON public.user_api_keys(user_id);

-- RLS: bulk_upload_runs - users see only their own runs
ALTER TABLE public.bulk_upload_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own bulk upload runs" ON public.bulk_upload_runs;
CREATE POLICY "Users can manage own bulk upload runs"
ON public.bulk_upload_runs FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS: user_api_keys - users see only their own keys
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own API keys" ON public.user_api_keys;
CREATE POLICY "Users can manage own API keys"
ON public.user_api_keys FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
