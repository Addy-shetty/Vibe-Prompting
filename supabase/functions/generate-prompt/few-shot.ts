/**
 * Few-shot prompt builder for category-aware prompt generation.
 * Retrieves top-rated examples from the database and builds a
 * structured prompt with reference examples for the LLM.
 */

import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import {
  CATEGORY_PROMPTS,
  DEFAULT_CATEGORY,
  getCategoryPrompt,
} from "./category-prompts.ts";

const DEFAULT_LIMIT = 3;

interface ExampleSource {
  same_category: number;
  cross_category: number;
  seed: number;
}

interface FewShotResult {
  fullPrompt: string;
  examplesUsed: string[];
  source: ExampleSource;
}

function buildQualityStandards(): string {
  return `## Quality Standards

The enhanced prompt must meet these criteria:
- **Specificity**: Include concrete details, not vague suggestions. Name specific tools, techniques, or frameworks.
- **Structure**: Organize with clear sections, bullet points, or numbered steps for readability.
- **Safety**: Respect ethical boundaries. For security prompts, include responsible disclosure guidance.
- **Actionability**: Every section should tell the user WHAT to do, not just WHAT to know.`;
}

/**
 * Build a few-shot prompt by retrieving the best examples from the database.
 *
 * 3-tier fallback:
 *   1. Same-category top-quality prompts
 *   2. Cross-category top-quality prompts
 *   3. Curated seed examples from prompt_examples table
 */
export async function buildFewShotPrompt(
  supabaseAdmin: SupabaseClient,
  userInput: string,
  category: string,
  tier: string,
  limit: number = DEFAULT_LIMIT
): Promise<FewShotResult> {
  const source: ExampleSource = { same_category: 0, cross_category: 0, seed: 0 };
  const examplesUsed: string[] = [];
  const exampleTexts: string[] = [];

  // Validate category
  const effectiveCategory = CATEGORY_PROMPTS[category] ? category : DEFAULT_CATEGORY;

  // ── Tier 1: Same-category prompts ──
  const { data: sameCat, error: sameErr } = await supabaseAdmin
    .from("prompts")
    .select("id, enhanced_prompt, quality_score")
    .eq("category", effectiveCategory)
    .eq("is_public", true)
    .order("quality_score", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (!sameErr && sameCat) {
    for (const row of sameCat) {
      if (exampleTexts.length >= limit) break;
      exampleTexts.push(formatExample(row.enhanced_prompt, row.quality_score, exampleTexts.length + 1));
      examplesUsed.push(row.id);
      source.same_category++;
    }
  }

  // ── Tier 2: Cross-category fallback ──
  if (exampleTexts.length < limit) {
    const remaining = limit - exampleTexts.length;
    const { data: crossCat, error: crossErr } = await supabaseAdmin
      .from("prompts")
      .select("id, enhanced_prompt, quality_score, category")
      .neq("category", effectiveCategory)
      .eq("is_public", true)
      .order("quality_score", { ascending: false, nullsFirst: false })
      .limit(remaining);

    if (!crossErr && crossCat) {
      for (const row of crossCat) {
        if (exampleTexts.length >= limit) break;
        exampleTexts.push(formatExample(row.enhanced_prompt, row.quality_score, exampleTexts.length + 1));
        examplesUsed.push(row.id);
        source.cross_category++;
      }
    }
  }

  // ── Tier 3: Curated seed examples ──
  if (exampleTexts.length < limit) {
    const remaining = limit - exampleTexts.length;
    const { data: seeds, error: seedErr } = await supabaseAdmin
      .from("prompt_examples")
      .select("id, generated_output")
      .eq("category", effectiveCategory)
      .eq("tier", tier)
      .eq("is_curated", true)
      .limit(remaining);

    if (!seedErr && seeds) {
      for (const row of seeds) {
        if (exampleTexts.length >= limit) break;
        // Seed examples have no quality_score; default to 0.7 for display
        exampleTexts.push(formatExample(row.generated_output, 0.7, exampleTexts.length + 1));
        examplesUsed.push(row.id);
        source.seed++;
      }
    }
  }

  // ── Build the full prompt ──
  const systemPrompt = getCategoryPrompt(effectiveCategory, tier);
  const referenceSection =
    exampleTexts.length > 0
      ? `\n## Reference Examples\n\n${exampleTexts.join("\n\n")}`
      : "";

  const fullPrompt = `${systemPrompt}\n${referenceSection}\n${buildQualityStandards()}\n\n## Task\n\nTransform this input into an optimized, production-ready prompt:\n\n"${userInput}"\n\nProvide ONLY the improved prompt, no explanations or meta-commentary.`;

  return { fullPrompt, examplesUsed, source };
}

/**
 * Format a single example with quality score and numbering.
 */
function formatExample(
  content: string,
  qualityScore: number | null,
  index: number
): string {
  const score = qualityScore ?? 0.5;
  const pct = Math.round(score * 100);
  const indicator = pct >= 80 ? "★" : pct >= 60 ? "◆" : "○";
  return `### Example ${index} ${indicator} (Quality: ${pct}%)\n\n${content}`;
}
