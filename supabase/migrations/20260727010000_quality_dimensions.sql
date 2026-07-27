-- Add actionability_score, clarity_score, quality_label, and suggestions to prompt_quality
-- These augment the existing specificity/structure/safety/relevance columns

ALTER TABLE prompt_quality ADD COLUMN IF NOT EXISTS actionability_score FLOAT CHECK (actionability_score BETWEEN 0 AND 1);
ALTER TABLE prompt_quality ADD COLUMN IF NOT EXISTS clarity_score FLOAT CHECK (clarity_score BETWEEN 0 AND 1);
ALTER TABLE prompt_quality ADD COLUMN IF NOT EXISTS quality_label TEXT;
ALTER TABLE prompt_quality ADD COLUMN IF NOT EXISTS suggestions TEXT[];
ALTER TABLE prompt_quality ADD COLUMN IF NOT EXISTS evaluation_metadata JSONB;

-- Recreate overall_score to include new dimensions when available
-- (existing overall_score is GENERATED ALWAYS from the original 4 columns)
-- We keep the original and add a trigger or application-level calculation for the expanded set

COMMENT ON COLUMN prompt_quality.actionability_score IS '0-1: tells user WHAT to do, not just WHAT to know';
COMMENT ON COLUMN prompt_quality.clarity_score IS '0-1: language quality, no ambiguity, accessible';
COMMENT ON COLUMN prompt_quality.quality_label IS 'excellent/good/fair/poor based on overall_score';
COMMENT ON COLUMN prompt_quality.suggestions IS 'Auto-generated improvement tips for low-scoring dimensions';
