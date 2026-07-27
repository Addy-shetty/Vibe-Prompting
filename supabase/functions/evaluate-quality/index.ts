import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EvaluateRequest {
  promptId?: string
  promptText?: string
  tier: 'basic' | 'advanced' | 'expert'
}

interface QualityScores {
  specificity: number; structure: number; actionability: number; clarity: number
}

const EVAL_TEMPLATE = `Rate this prompt on 4 dimensions (0.0-1.0):

SPECIFICITY: Concrete tools/techniques mentioned? (0=vague, 1=highly specific)
STRUCTURE: Sections, lists, clear organization? (0=wall of text, 1=professional)
ACTIONABILITY: Explicit steps to follow? (0=theoretical, 1=fully executable)
CLARITY: Easy to understand, no ambiguity? (0=confusing, 1=crystal clear)

Prompt to evaluate:
-----
PROMPT_HERE
-----

Return ONLY a JSON object: {"specificity":0.X,"structure":0.X,"actionability":0.X,"clarity":0.X}`

const TIER_WEIGHTS: Record<string, Record<string, number>> = {
  basic:    { specificity: 0.20, structure: 0.25, actionability: 0.30, clarity: 0.25 },
  advanced: { specificity: 0.30, structure: 0.25, actionability: 0.25, clarity: 0.20 },
  expert:   { specificity: 0.35, structure: 0.25, actionability: 0.20, clarity: 0.20 },
}

async function evaluateWithGemini(promptText: string, tier: string, key: string): Promise<QualityScores> {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=***
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: EVAL_TEMPLATE.replace('PROMPT_HERE', promptText) }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 256 },
      }),
    })
  if (!resp.ok) throw new Error(`Gemini: ${resp.status}`)
  const data = await resp.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  const json = raw.trim().startsWith('{') ? raw.trim() : (raw.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1]?.trim() ?? raw.match(/\{[\s\S]*\}/)?.[0] ?? '')
  if (!json) throw new Error(`Parse failed: ${raw.slice(0, 100)}`)
  const scores = JSON.parse(json)
  for (const d of ['specificity','structure','actionability','clarity']) {
    scores[d] = Math.max(0, Math.min(1, Number(scores[d]) || 0.5))
  }
  return scores as QualityScores
}

function calculateOverall(s: QualityScores, tier: string): number {
  const w = TIER_WEIGHTS[tier] ?? TIER_WEIGHTS.basic
  return Math.round((s.specificity * w.specificity + s.structure * w.structure + s.actionability * w.actionability + s.clarity * w.clarity) * 100) / 100
}

function label(score: number): string {
  if (score >= 0.85) return 'excellent'; if (score >= 0.70) return 'good'
  if (score >= 0.50) return 'fair'; return 'poor'
}

function suggestions(s: QualityScores, threshold = 0.55): string[] {
  const tips: string[] = []
  if (s.specificity < threshold) tips.push('Add concrete tool names, technique names, or framework references')
  if (s.structure < threshold) tips.push('Organize with numbered sections and bullet points for readability')
  if (s.actionability < threshold) tips.push('Replace descriptive language with explicit action steps ("Run X", "Configure Y")')
  if (s.clarity < threshold) tips.push('Simplify complex sentences and define technical terms for the target audience')
  return tips
}

function heuristicEvaluate(text: string): QualityScores {
  const techPats = [/React|Vue|Next|Node|Python|TypeScript|Kubernetes|Docker|AWS/i, /nuclei|Burp|ffuf|sqlmap|nmap|OWASP/i, /CVE|CVSS|MITRE|NIST|PCI|ISO/i]
  const specScore = Math.min(1, techPats.filter(p => p.test(text)).length * 0.2 + ((text.match(/`[^`]+`/g) || []).length > 2 ? 0.2 : 0))
  const headings = (text.match(/^#{1,3}\s.+/gm) || []).length
  const bullets = (text.match(/^[-*]\s|^\d+\.\s/gm) || []).length
  const structScore = Math.min(1, 0.3 + (headings >= 3 ? 0.3 : headings ? 0.15 : 0) + (bullets >= 4 ? 0.2 : bullets ? 0.1 : 0) + ((text.match(/```/g) || []).length >= 2 ? 0.15 : 0))
  const verbs = (text.match(/(?:^|\n)\s*(?:Run|Create|Build|Write|Configure|Deploy|Test|Check|Install|Set|Add)/gm) || []).length
  const cmds = (text.match(/^(?:\$|#|>)\s|npm\s|pip\s|docker\s|git\s|kubectl\s/gm) || []).length
  const actScore = Math.min(1, 0.2 + (verbs >= 3 ? 0.3 : verbs ? 0.15 : 0) + (cmds >= 2 ? 0.25 : cmds ? 0.1 : 0))
  const sents = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const avgLen = sents.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / Math.max(1, sents.length)
  const clarScore = Math.max(0, Math.min(1, 0.4 + (avgLen < 20 ? 0.25 : avgLen < 30 ? 0.15 : avgLen > 40 ? -0.1 : 0)))
  return { specificity: specScore, structure: structScore, actionability: actScore, clarity: clarScore }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing authorization header')
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } })
    const { data: { user }, error: authErr } = await supabaseClient.auth.getUser()
    if (authErr || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')

    const { promptId, promptText: provided, tier = 'basic' }: EvaluateRequest = await req.json()
    let promptText: string, actualId: string | null = promptId ?? null

    if (promptId) {
      const { data: p, error: fe } = await supabaseAdmin.from('prompts').select('id, enhanced_prompt, user_id').eq('id', promptId).single()
      if (fe || !p) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      if (p.user_id !== user.id) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      promptText = p.enhanced_prompt
    } else if (provided) { promptText = provided }
    else return new Response(JSON.stringify({ error: 'Missing promptId or promptText' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiKey) throw new Error('GEMINI_API_KEY not configured')

    let scores: QualityScores, provider = 'gemini'
    try { scores = await evaluateWithGemini(promptText, tier, geminiKey) }
    catch (e) { console.error('Gemini eval fail:', e); scores = heuristicEvaluate(promptText); provider = 'heuristic' }

    const overall = calculateOverall(scores, tier)
    const lbl = label(overall)
    const tips = suggestions(scores)

    if (actualId) {
      await supabaseAdmin.from('prompt_quality').upsert({
        prompt_id: actualId,
        specificity_score: scores.specificity, structure_score: scores.structure,
        actionability_score: scores.actionability, clarity_score: scores.clarity,
        overall_score: overall, quality_label: lbl, suggestions: tips,
        evaluation_metadata: { provider, tier, evaluated_at: new Date().toISOString() },
      }, { onConflict: 'prompt_id' })
    }

    return new Response(JSON.stringify({ success: true, scores, overall, label: lbl, suggestions: tips, provider }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('evaluate-quality err:', err)
    return new Response(JSON.stringify({ error: 'internal_error', message: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})