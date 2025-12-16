-- Add vibe column for current mood/vibe
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vibe text;