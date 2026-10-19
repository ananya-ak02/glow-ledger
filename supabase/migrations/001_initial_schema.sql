-- GlowLedger Initial Schema
-- Supabase Postgres with Row Level Security
-- Run via Supabase Dashboard > SQL Editor or supabase db push

-- ============================================
-- Custom Types (Enums)
-- ============================================

CREATE TYPE skin_type AS ENUM ('dry', 'oily', 'combination', 'normal', 'sensitive');
CREATE TYPE fragrance_preference AS ENUM ('loves', 'neutral', 'avoids', 'sensitive');
CREATE TYPE concern_type AS ENUM (
  'acne', 'dark_spots', 'post_acne_marks', 'pigmentation',
  'texture', 'redness', 'dullness', 'dehydration',
  'fine_lines', 'pores', 'sensitivity', 'other'
);
CREATE TYPE severity_level AS ENUM ('mild', 'moderate', 'severe');
CREATE TYPE routine_type AS ENUM ('am', 'pm');
CREATE TYPE reaction_type AS ENUM (
  'irritation', 'burning', 'breakout', 'purging',
  'allergy', 'dryness', 'other'
);
CREATE TYPE verdict_type AS ENUM ('good_fit', 'use_with_caution', 'avoid');
CREATE TYPE irritation_risk AS ENUM ('low', 'moderate', 'high');
CREATE TYPE counter_type AS ENUM ('daily_research', 'daily_ai_calls', 'daily_search_api');

-- ============================================
-- Helper: updated_at trigger function
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Table: profiles
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  skin_type skin_type,
  skin_type_notes TEXT,
  age_range TEXT,
  climate TEXT,
  budget TEXT,
  is_pregnant BOOLEAN NOT NULL DEFAULT FALSE,
  known_allergies TEXT[] NOT NULL DEFAULT '{}',
  fragrance_preference fragrance_preference,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE USING (auth.uid() = id);

-- ============================================
-- Table: skin_concerns
-- ============================================

CREATE TABLE skin_concerns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concern_type concern_type NOT NULL,
  severity severity_level NOT NULL DEFAULT 'mild',
  affected_areas TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skin_concerns_profile ON skin_concerns(profile_id);

ALTER TABLE skin_concerns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own concerns"
  ON skin_concerns FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own concerns"
  ON skin_concerns FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own concerns"
  ON skin_concerns FOR UPDATE USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete own concerns"
  ON skin_concerns FOR DELETE USING (auth.uid() = profile_id);

-- ============================================
-- Table: products (shared cache) — created BEFORE routine_steps
-- ============================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT,
  source_url TEXT,
  ingredient_list TEXT[] NOT NULL DEFAULT '{}',
  parsed_ingredients JSONB,
  category TEXT,
  open_beauty_facts_id TEXT,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cache_ttl_days INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_name ON products USING gin (to_tsvector('english', name));
CREATE INDEX idx_products_brand ON products(brand);
CREATE UNIQUE INDEX idx_products_obf_id ON products(open_beauty_facts_id)
  WHERE open_beauty_facts_id IS NOT NULL;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view products"
  ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role can insert products"
  ON products FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update products"
  ON products FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- Table: ingredients (reference/seed data)
-- ============================================

CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  aliases TEXT[] NOT NULL DEFAULT '{}',
  function TEXT NOT NULL,
  category TEXT NOT NULL,
  irritation_risk irritation_risk NOT NULL DEFAULT 'low',
  comedogenic_rating INTEGER NOT NULL DEFAULT 0
    CHECK (comedogenic_rating >= 0 AND comedogenic_rating <= 5),
  pregnancy_unsafe BOOLEAN NOT NULL DEFAULT FALSE,
  pregnancy_notes TEXT,
  common_sensitivities TEXT[] NOT NULL DEFAULT '{}',
  max_recommended_concentration TEXT,
  description TEXT
);

CREATE INDEX idx_ingredients_name ON ingredients(name);
CREATE INDEX idx_ingredients_category ON ingredients(category);

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view ingredients"
  ON ingredients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role can manage ingredients"
  ON ingredients FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- Table: routines
-- ============================================

CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  routine_type routine_type NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_routines_profile ON routines(profile_id);

CREATE TRIGGER routines_updated_at
  BEFORE UPDATE ON routines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own routines"
  ON routines FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own routines"
  ON routines FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own routines"
  ON routines FOR UPDATE USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete own routines"
  ON routines FOR DELETE USING (auth.uid() = profile_id);

-- ============================================
-- Table: routine_steps
-- ============================================

CREATE TABLE routine_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  frequency TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_routine_steps_routine ON routine_steps(routine_id);

ALTER TABLE routine_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own routine steps"
  ON routine_steps FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = routine_steps.routine_id
      AND routines.profile_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert own routine steps"
  ON routine_steps FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = routine_steps.routine_id
      AND routines.profile_id = auth.uid()
    )
  );
CREATE POLICY "Users can update own routine steps"
  ON routine_steps FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = routine_steps.routine_id
      AND routines.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = routine_steps.routine_id
      AND routines.profile_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete own routine steps"
  ON routine_steps FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = routine_steps.routine_id
      AND routines.profile_id = auth.uid()
    )
  );

-- ============================================
-- Table: user_reactions
-- ============================================

CREATE TABLE user_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  reaction_type reaction_type NOT NULL,
  severity severity_level NOT NULL DEFAULT 'mild',
  suspected_ingredients TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  occurred_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_reactions_profile ON user_reactions(profile_id);
CREATE INDEX idx_user_reactions_product ON user_reactions(product_id);

ALTER TABLE user_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reactions"
  ON user_reactions FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own reactions"
  ON user_reactions FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own reactions"
  ON user_reactions FOR UPDATE USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete own reactions"
  ON user_reactions FOR DELETE USING (auth.uid() = profile_id);

-- ============================================
-- Table: research_reports (shared cache)
-- ============================================

CREATE TABLE research_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  search_queries TEXT[] NOT NULL DEFAULT '{}',
  reddit_snippets JSONB,
  review_snippets JSONB,
  source_links TEXT[] NOT NULL DEFAULT '{}',
  ingredient_analysis JSONB,
  ai_synthesis JSONB,
  model_used TEXT NOT NULL,
  token_count INTEGER NOT NULL DEFAULT 0,
  researched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  is_valid BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_research_reports_product ON research_reports(product_id);
CREATE INDEX idx_research_reports_valid ON research_reports(is_valid, expires_at);

ALTER TABLE research_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view valid reports"
  ON research_reports FOR SELECT TO authenticated
  USING (is_valid = true AND expires_at > NOW());
CREATE POLICY "Service role can manage reports"
  ON research_reports FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- Table: personalized_verdicts (per-user)
-- ============================================

CREATE TABLE personalized_verdicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  research_report_id UUID NOT NULL REFERENCES research_reports(id) ON DELETE CASCADE,
  verdict verdict_type NOT NULL,
  confidence REAL NOT NULL DEFAULT 0.5
    CHECK (confidence >= 0 AND confidence <= 1),
  personalized_analysis JSONB NOT NULL DEFAULT '{}',
  routine_placement JSONB,
  conflicts JSONB NOT NULL DEFAULT '[]',
  flags JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verdicts_profile ON personalized_verdicts(profile_id);
CREATE INDEX idx_verdicts_report ON personalized_verdicts(research_report_id);
CREATE UNIQUE INDEX idx_verdicts_profile_report
  ON personalized_verdicts(profile_id, research_report_id);

ALTER TABLE personalized_verdicts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verdicts"
  ON personalized_verdicts FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Service role can manage verdicts"
  ON personalized_verdicts FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- Table: wishlist
-- ============================================

CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  notes TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, product_id)
);

CREATE INDEX idx_wishlist_profile ON wishlist(profile_id);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist"
  ON wishlist FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own wishlist"
  ON wishlist FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own wishlist"
  ON wishlist FOR UPDATE USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete own wishlist"
  ON wishlist FOR DELETE USING (auth.uid() = profile_id);

-- ============================================
-- Table: usage_counters
-- ============================================

CREATE TABLE usage_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  counter_type counter_type NOT NULL,
  counter_date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 0,
  limit_value INTEGER NOT NULL,
  UNIQUE(profile_id, counter_type, counter_date)
);

CREATE INDEX idx_usage_counters_lookup
  ON usage_counters(profile_id, counter_type, counter_date);

ALTER TABLE usage_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own and global counters"
  ON usage_counters FOR SELECT
  USING (auth.uid() = profile_id OR profile_id IS NULL);
CREATE POLICY "Users can insert own counters"
  ON usage_counters FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own counters"
  ON usage_counters FOR UPDATE
  USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Service role can manage all counters"
  ON usage_counters FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- Function: increment usage counter (atomic)
-- ============================================

CREATE OR REPLACE FUNCTION increment_usage_counter(
  p_profile_id UUID,
  p_counter_type counter_type,
  p_limit_value INTEGER
)
RETURNS TABLE(new_count INTEGER, is_at_limit BOOLEAN) AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO usage_counters (profile_id, counter_type, counter_date, count, limit_value)
  VALUES (p_profile_id, p_counter_type, CURRENT_DATE, 1, p_limit_value)
  ON CONFLICT (profile_id, counter_type, counter_date)
  DO UPDATE SET count = usage_counters.count + 1
  RETURNING usage_counters.count INTO v_count;

  RETURN QUERY SELECT v_count, (v_count >= p_limit_value);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Function: check usage limit (read-only)
-- ============================================

CREATE OR REPLACE FUNCTION check_usage_limit(
  p_profile_id UUID,
  p_counter_type counter_type
)
RETURNS TABLE(current_count INTEGER, limit_val INTEGER, is_at_limit BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(uc.count, 0)::INTEGER,
    COALESCE(uc.limit_value, 0)::INTEGER,
    COALESCE(uc.count >= uc.limit_value, FALSE)
  FROM usage_counters uc
  WHERE uc.profile_id = p_profile_id
    AND uc.counter_type = p_counter_type
    AND uc.counter_date = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Trigger: auto-create profile on user signup
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
