import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FeedbackRequest {
  promptId: string
  rating?: number    // 1-5 star rating
  copied?: boolean   // user copied the prompt
  reused?: boolean   // user reused the prompt
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing authorization header')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authErr } = await supabaseClient.auth.getUser()
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Rate limit: 50 feedback submissions per minute
    const { data: rateCheck } = await supabaseAdmin.rpc('check_rate_limit_v3', {
      p_user_id: user.id, p_action: 'submit_feedback', p_max_requests: 50, p_window_seconds: 60
    })
    if (rateCheck && !rateCheck.allowed) {
      return new Response(JSON.stringify({ error: 'rate_limited', retryAfter: rateCheck.retry_after }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { promptId, rating, copied, reused }: FeedbackRequest = await req.json()
    if (!promptId) {
      return new Response(JSON.stringify({ error: 'promptId is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Validate rating range
    if (rating !== undefined && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      return new Response(JSON.stringify({ error: 'Rating must be an integer between 1 and 5' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Verify prompt exists and is accessible
    const { data: prompt, error: promptErr } = await supabaseAdmin
      .from('prompts').select('id, user_id').eq('id', promptId).single()
    if (promptErr || !prompt) {
      return new Response(JSON.stringify({ error: 'Prompt not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Upsert quality record
    const qualityUpdate: Record<string, unknown> = { prompt_id: promptId }
    if (rating !== undefined) qualityUpdate.user_rating = rating
    if (copied !== undefined) qualityUpdate.user_copied = copied
    if (reused !== undefined) qualityUpdate.user_reused = reused

    const { error: upsertErr } = await supabaseAdmin
      .from('prompt_quality').upsert(qualityUpdate, { onConflict: 'prompt_id' })
    if (upsertErr) console.error('Quality upsert failed:', upsertErr)

    // Increment copy count if user copied
    if (copied) {
      const { error: copyErr } = await supabaseAdmin.rpc('increment_prompt_copy_count', { p_prompt_id: promptId })
      if (copyErr) console.error('Copy count increment failed:', copyErr)
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('submit-feedback error:', err)
    return new Response(JSON.stringify({ error: 'internal_error', message: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})