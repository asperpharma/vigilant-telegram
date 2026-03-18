-- Add external_id column to products table for idempotency
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS external_id TEXT UNIQUE;

-- Create index for faster lookups by external_id
CREATE INDEX IF NOT EXISTS idx_products_external_id ON public.products(external_id);
