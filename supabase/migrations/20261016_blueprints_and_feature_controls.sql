-- ====================================================================
-- ZABORAA ENTERPRISE CLOUD INFRASTRUCTURE ARCHITECTURE
-- Migration: Blueprints Storage, Feature Controls & Metadata
-- ====================================================================

-- 1. BLUEPRINTS TABLE
CREATE TABLE IF NOT EXISTS public.blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  title TEXT NOT NULL CHECK (char_length(trim(title)) >= 2 AND char_length(title) <= 255),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  storage_path TEXT,
  storage_url TEXT,
  config_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;

-- Blueprints RLS Policies
DROP POLICY IF EXISTS "Users can view their own blueprints" ON public.blueprints;
CREATE POLICY "Users can view their own blueprints"
  ON public.blueprints
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can insert their own blueprints" ON public.blueprints;
CREATE POLICY "Users can insert their own blueprints"
  ON public.blueprints
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Users can update their own blueprints" ON public.blueprints;
CREATE POLICY "Users can update their own blueprints"
  ON public.blueprints
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can delete their own blueprints" ON public.blueprints;
CREATE POLICY "Users can delete their own blueprints"
  ON public.blueprints
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_blueprints_user_id ON public.blueprints (user_id);
CREATE INDEX IF NOT EXISTS idx_blueprints_created_at ON public.blueprints (created_at DESC);

-- 2. FEATURE CONTROLS CONFIGURATION TABLE (Optional central persistence)
CREATE TABLE IF NOT EXISTS public.admin_feature_controls (
  id TEXT PRIMARY KEY DEFAULT 'global_feature_controls',
  export_dossier BOOLEAN NOT NULL DEFAULT true,
  export_executive_summary BOOLEAN NOT NULL DEFAULT true,
  export_4k BOOLEAN NOT NULL DEFAULT true,
  generate_blueprint BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.admin_feature_controls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view feature controls" ON public.admin_feature_controls;
CREATE POLICY "Public can view feature controls"
  ON public.admin_feature_controls
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admins can update feature controls" ON public.admin_feature_controls;
CREATE POLICY "Admins can update feature controls"
  ON public.admin_feature_controls
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
