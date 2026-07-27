-- =====================================================
-- ANALYTICS VIEWS + AUTO-PROMOTE CRON
-- Migration: 20260727020000_analytics_and_promotion.sql
-- =====================================================

-- 1. QUALITY ANALYTICS VIEW — per-category stats
CREATE OR REPLACE VIEW prompt_quality_analytics AS
WITH quality_data AS (
  SELECT
    p.category,
    pq.overall_score,
    pq.prompt_id,
    pq.created_at as evaluated_at
  FROM prompts p
  JOIN prompt_quality pq ON pq.prompt_id = p.id
  WHERE pq.overall_score IS NOT NULL
),
category_stats AS (
  SELECT
    category,
    COUNT(*) as total_evaluated,
    ROUND(AVG(overall_score)::numeric, 3) as avg_quality,
    COUNT(*) FILTER (WHERE overall_score >= 0.85) as excellent_count,
    COUNT(*) FILTER (WHERE overall_score BETWEEN 0.70 AND 0.84) as good_count,
    COUNT(*) FILTER (WHERE overall_score BETWEEN 0.50 AND 0.69) as fair_count,
    COUNT(*) FILTER (WHERE overall_score < 0.50) as poor_count
  FROM quality_data
  GROUP BY category
),
recent_stats AS (
  SELECT
    category,
    ROUND(AVG(overall_score)::numeric, 3) as avg_quality_7d,
    COUNT(*) as total_7d
  FROM quality_data
  WHERE evaluated_at >= NOW() - INTERVAL '7 days'
  GROUP BY category
)
SELECT
  cs.category,
  cs.avg_quality,
  cs.total_evaluated,
  COALESCE(rs.avg_quality_7d, cs.avg_quality) as avg_quality_7d,
  CASE
    WHEN COALESCE(rs.avg_quality_7d, 0) > cs.avg_quality + 0.05 THEN 'improving'
    WHEN COALESCE(rs.avg_quality_7d, 0) < cs.avg_quality - 0.05 THEN 'declining'
    ELSE 'stable'
  END as quality_trend,
  cs.excellent_count,
  cs.good_count,
  cs.fair_count,
  cs.poor_count
FROM category_stats cs
LEFT JOIN recent_stats rs ON rs.category = cs.category
ORDER BY cs.avg_quality DESC;

-- 2. USER PROMPT STATS VIEW
CREATE OR REPLACE VIEW user_prompt_stats AS
SELECT
  p.user_id,
  pr.username,
  COUNT(DISTINCT p.id) as total_generations,
  ROUND(AVG(pq.overall_score)::numeric, 3) as avg_quality,
  MODE() WITHIN GROUP (ORDER BY p.category) as best_category,
  COALESCE(pr.credits, 0) as credits_remaining
FROM prompts p
LEFT JOIN prompt_quality pq ON pq.prompt_id = p.id
LEFT JOIN profiles pr ON pr.id = p.user_id
GROUP BY p.user_id, pr.username, pr.credits
ORDER BY total_generations DESC;

-- RLS: users can view analytics views (aggregated data)
GRANT SELECT ON prompt_quality_analytics TO authenticated;
GRANT SELECT ON user_prompt_stats TO authenticated;

-- 3. AUTO-PROMOTE TOP PROMPTS (weekly cron via pg_cron)
-- This function runs weekly and promotes top 50 prompts per category

CREATE OR REPLACE FUNCTION weekly_prompt_rotation()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cat RECORD;
BEGIN
  -- Demote all currently promoted prompts
  UPDATE prompts SET is_example = false WHERE is_example = true;

  -- For each category, promote top 50 by quality_score
  FOR cat IN SELECT DISTINCT category FROM prompts WHERE category IS NOT NULL LOOP
    WITH ranked AS (
      SELECT id,
        ROW_NUMBER() OVER (ORDER BY quality_score DESC NULLS LAST) as rank
      FROM prompts
      WHERE category = cat.category
        AND is_public = true
        AND quality_score IS NOT NULL
    )
    UPDATE prompts
    SET is_example = true
    WHERE id IN (
      SELECT id FROM ranked WHERE rank <= 50
    );

    -- If category has fewer than 50 with scores, promote any public ones with quality_score > 0.5
    UPDATE prompts
    SET is_example = true
    WHERE category = cat.category
      AND is_public = true
      AND quality_score > 0.5
      AND is_example = false
      AND quality_score IS NOT NULL;
  END LOOP;

  -- Log the rotation
  INSERT INTO security_events (event_type, description, metadata)
  VALUES ('weekly_prompt_rotation', 'Weekly top-prompt rotation completed', jsonb_build_object('rotated_at', NOW()));
END;
$$;

-- Schedule the cron job: runs every Sunday at 03:00 UTC
-- Note: Requires pg_cron extension to be enabled
-- Run this in Supabase SQL Editor if pg_cron is available:
-- SELECT cron.schedule('weekly-prompt-rotation', '0 3 * * 0', 'SELECT weekly_prompt_rotation()');

COMMENT ON FUNCTION weekly_prompt_rotation() IS 'Weekly cron job: promotes top 50 prompts per category. Schedule with pg_cron: SELECT cron.schedule(''weekly-rotation'', ''0 3 * * 0'', ''SELECT weekly_prompt_rotation()'')';

-- =====================================================
-- DOWN MIGRATION
-- =====================================================
-- DROP VIEW IF EXISTS user_prompt_stats;
-- DROP VIEW IF EXISTS prompt_quality_analytics;
-- DROP FUNCTION IF EXISTS weekly_prompt_rotation();
-- SELECT cron.unschedule('weekly-prompt-rotation');