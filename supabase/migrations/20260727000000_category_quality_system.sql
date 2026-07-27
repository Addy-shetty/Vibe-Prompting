-- =====================================================
-- CATEGORY & QUALITY SYSTEM
-- Migration: 20260727000000_category_quality_system.sql
-- Purpose: Add quality tracking, examples, and category features
-- =====================================================

-- 1. CREATE PROMPT QUALITY TABLE
-- Tracks both user feedback and automated quality metrics
CREATE TABLE IF NOT EXISTS prompt_quality (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,

  -- User feedback metrics
  user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
  user_copied BOOLEAN DEFAULT false,
  user_reused BOOLEAN DEFAULT false,

  -- Automated quality scores (0.0 to 1.0)
  specificity_score FLOAT CHECK (specificity_score BETWEEN 0 AND 1),
  structure_score FLOAT CHECK (structure_score BETWEEN 0 AND 1),
  safety_score FLOAT CHECK (safety_score BETWEEN 0 AND 1),
  relevance_score FLOAT CHECK (relevance_score BETWEEN 0 AND 1),

  -- Overall score (generated as average of 4 scores)
  overall_score FLOAT GENERATED ALWAYS AS (
    (COALESCE(specificity_score, 0) +
     COALESCE(structure_score, 0) +
     COALESCE(safety_score, 0) +
     COALESCE(relevance_score, 0)) /
    NULLIF(
      (CASE WHEN specificity_score IS NOT NULL THEN 1 ELSE 0 END +
       CASE WHEN structure_score IS NOT NULL THEN 1 ELSE 0 END +
       CASE WHEN safety_score IS NOT NULL THEN 1 ELSE 0 END +
       CASE WHEN relevance_score IS NOT NULL THEN 1 ELSE 0 END),
      0
    )
  ) STORED,

  -- Metadata
  evaluation_model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for prompt_quality
CREATE INDEX IF NOT EXISTS idx_prompt_quality_prompt_id ON prompt_quality(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_quality_overall_score ON prompt_quality(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_quality_user_rating ON prompt_quality(user_rating DESC);

-- RLS for prompt_quality
ALTER TABLE prompt_quality ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view quality data for own prompts" ON prompt_quality;
DROP POLICY IF EXISTS "Users can insert quality data for own prompts" ON prompt_quality;
DROP POLICY IF EXISTS "Users can update quality data for own prompts" ON prompt_quality;

CREATE POLICY "Users can view quality data for own prompts"
  ON prompt_quality FOR SELECT
  USING (
    prompt_id IN (
      SELECT id FROM prompts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert quality data for own prompts"
  ON prompt_quality FOR INSERT
  WITH CHECK (
    prompt_id IN (
      SELECT id FROM prompts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update quality data for own prompts"
  ON prompt_quality FOR UPDATE
  USING (
    prompt_id IN (
      SELECT id FROM prompts WHERE user_id = auth.uid()
    )
  );

-- 2. CREATE PROMPT EXAMPLES TABLE
-- Stores curated examples and high-quality prompts for each category
CREATE TABLE IF NOT EXISTS prompt_examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  tier TEXT CHECK (tier IN ('basic', 'advanced', 'expert')),

  -- Example content
  user_input_example TEXT,
  generated_output TEXT,

  -- Metadata
  is_curated BOOLEAN DEFAULT false,
  source TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Composite index for efficient category + tier queries
CREATE INDEX IF NOT EXISTS idx_prompt_examples_category_tier ON prompt_examples(category, tier);
CREATE INDEX IF NOT EXISTS idx_prompt_examples_usage_count ON prompt_examples(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_examples_is_curated ON prompt_examples(is_curated);

-- RLS for prompt_examples (publicly readable for all authenticated users)
ALTER TABLE prompt_examples ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view prompt examples" ON prompt_examples;
DROP POLICY IF EXISTS "Service role can manage examples" ON prompt_examples;

CREATE POLICY "Anyone can view prompt examples"
  ON prompt_examples FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage examples"
  ON prompt_examples FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. ALTER PROMPTS TABLE
-- Add new columns for quality tracking and categorization
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'prompts'
    AND column_name = 'copy_count'
  ) THEN
    ALTER TABLE prompts ADD COLUMN copy_count INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'prompts'
    AND column_name = 'quality_score'
  ) THEN
    ALTER TABLE prompts ADD COLUMN quality_score FLOAT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'prompts'
    AND column_name = 'generation_metadata'
  ) THEN
    ALTER TABLE prompts ADD COLUMN generation_metadata JSONB;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'prompts'
    AND column_name = 'is_example'
  ) THEN
    ALTER TABLE prompts ADD COLUMN is_example BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Note: category column already exists from init_schema.sql

-- Create indexes for new prompt columns
CREATE INDEX IF NOT EXISTS idx_prompts_quality_score ON prompts(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_copy_count ON prompts(copy_count DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_is_example ON prompts(is_example);

-- 4. ALTER REQUEST_LOG TABLE
-- Track category and examples used in each generation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'request_log'
    AND column_name = 'category'
  ) THEN
    ALTER TABLE request_log ADD COLUMN category TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'request_log'
    AND column_name = 'examples_used'
  ) THEN
    ALTER TABLE request_log ADD COLUMN examples_used TEXT[];
  END IF;
END $$;

-- Create index for category queries
CREATE INDEX IF NOT EXISTS idx_request_log_category ON request_log(category);

-- 5. HELPER FUNCTIONS

-- Function to increment usage count on prompt examples
CREATE OR REPLACE FUNCTION increment_example_usage(p_example_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE prompt_examples
  SET usage_count = usage_count + 1
  WHERE id = p_example_id;
END;
$$;

-- Function to increment copy count on prompts
CREATE OR REPLACE FUNCTION increment_prompt_copy_count(p_prompt_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE prompts
  SET copy_count = copy_count + 1
  WHERE id = p_prompt_id;
END;
$$;

-- Function to update prompt quality score from prompt_quality table
CREATE OR REPLACE FUNCTION update_prompt_quality_score(p_prompt_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_avg_score FLOAT;
BEGIN
  -- Calculate average overall score from all quality entries
  SELECT AVG(overall_score) INTO v_avg_score
  FROM prompt_quality
  WHERE prompt_id = p_prompt_id
  AND overall_score IS NOT NULL;

  -- Update the prompt's quality_score
  UPDATE prompts
  SET quality_score = v_avg_score
  WHERE id = p_prompt_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_example_usage TO authenticated;
GRANT EXECUTE ON FUNCTION increment_prompt_copy_count TO authenticated;
GRANT EXECUTE ON FUNCTION update_prompt_quality_score TO authenticated;

-- 6. TRIGGER TO AUTO-UPDATE PROMPT QUALITY SCORE
CREATE OR REPLACE FUNCTION trigger_update_prompt_quality_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM update_prompt_quality_score(NEW.prompt_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_prompt_quality_change ON prompt_quality;
CREATE TRIGGER on_prompt_quality_change
  AFTER INSERT OR UPDATE ON prompt_quality
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_prompt_quality_score();

-- =====================================================
-- DOWN MIGRATION (commented out - for rollback reference)
-- =====================================================
-- To rollback this migration, run the following:
--
-- DROP TRIGGER IF EXISTS on_prompt_quality_change ON prompt_quality;
-- DROP FUNCTION IF EXISTS trigger_update_prompt_quality_score();
-- DROP FUNCTION IF EXISTS update_prompt_quality_score(UUID);
-- DROP FUNCTION IF EXISTS increment_prompt_copy_count(UUID);
-- DROP FUNCTION IF EXISTS increment_example_usage(UUID);
--
-- ALTER TABLE request_log DROP COLUMN IF EXISTS examples_used;
-- ALTER TABLE request_log DROP COLUMN IF EXISTS category;
--
-- ALTER TABLE prompts DROP COLUMN IF EXISTS is_example;
-- ALTER TABLE prompts DROP COLUMN IF EXISTS generation_metadata;
-- ALTER TABLE prompts DROP COLUMN IF EXISTS quality_score;
-- ALTER TABLE prompts DROP COLUMN IF EXISTS copy_count;
--
-- DROP TABLE IF EXISTS prompt_examples;
-- DROP TABLE IF EXISTS prompt_quality;
-- =====================================================
