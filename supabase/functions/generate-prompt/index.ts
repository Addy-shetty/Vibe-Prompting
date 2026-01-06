import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
}

// Credit costs by tier (simpler = more credits)
const CREDIT_COSTS = {
  basic: 5,
  advanced: 3,
  expert: 2,
}

interface GenerateRequest {
  userInput: string
  tier: 'basic' | 'advanced' | 'expert'
  requestId: string
  metadata?: Record<string, unknown>
}

// Fallback prompt generator when all LLMs fail
function generateFallbackPrompt(input: string, tier: string): string {
  const templates = {
    basic: `Enhanced prompt: ${input}\n\nPlease provide a clear and detailed response with examples where appropriate.`,
    advanced: `Act as an expert in this domain. Regarding: "${input}"\n\nPlease provide:\n1. Detailed analysis\n2. Step-by-step approach\n3. Best practices\n4. Concrete examples\n5. Potential pitfalls to avoid`,
    expert: `You are a world-class expert with deep knowledge in this field. Task: "${input}"\n\nProvide a comprehensive response including:\n\n1. Executive Summary\n2. Detailed Technical Analysis\n3. Implementation Strategy with step-by-step breakdown\n4. Code examples (where applicable)\n5. Edge cases and error handling\n6. Performance considerations\n7. Security best practices\n8. Testing approach\n9. Documentation requirements\n10. Real-world examples from production systems\n\nEnsure your response is actionable and production-ready.`,
  }

  return templates[tier as keyof typeof templates] || templates.basic
}

// Prompt validation constants
const MAX_PROMPT_LENGTH = 5000
const MIN_PROMPT_LENGTH = 3

// Validate user input
function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt is required' }
  }

  const trimmed = prompt.trim()
  
  if (trimmed.length < MIN_PROMPT_LENGTH) {
    return { valid: false, error: `Prompt must be at least ${MIN_PROMPT_LENGTH} characters` }
  }

  if (trimmed.length > MAX_PROMPT_LENGTH) {
    return { valid: false, error: `Prompt must not exceed ${MAX_PROMPT_LENGTH} characters` }
  }

  // Check for suspicious patterns (XSS prevention)
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
  ]
  
  if (suspiciousPatterns.some(pattern => pattern.test(trimmed))) {
    return { valid: false, error: 'Invalid characters detected in prompt' }
  }

  return { valid: true }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Parse request body
    const body: GenerateRequest = await req.json()
    const { userInput, tier = 'basic', requestId, metadata = {} } = body

    if (!userInput || !requestId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userInput, requestId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2.5. Validate input content (XSS prevention, length limits)
    const validation = validatePrompt(userInput)
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: 'validation_error', message: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Validate tier
    if (!['basic', 'advanced', 'expert'].includes(tier)) {
      return new Response(
        JSON.stringify({ error: 'Invalid tier. Must be: basic, advanced, or expert' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const creditsToConsume = CREDIT_COSTS[tier]

    // 4. Create service_role client for RPC calls
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 5. Check rate limit (10 requests per minute)
    const rateLimitResult = await supabaseAdmin.rpc('check_rate_limit', {
      p_user_id: user.id,
      p_action: 'generate_prompt',
      p_max_requests: 10,
      p_window_seconds: 60,
    })

    if (rateLimitResult.error) {
      console.error('Rate limit check failed:', rateLimitResult.error)
      // Don't fail on rate limit errors, just log
    } else if (rateLimitResult.data && !rateLimitResult.data.allowed) {
      return new Response(
        JSON.stringify({
          error: 'rate_limit_exceeded',
          message: 'Too many requests. Please wait before trying again.',
          retryAfter: rateLimitResult.data.retry_after_seconds,
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 6. Consume credits atomically
    const creditResult = await supabaseAdmin.rpc('consume_user_credits', {
      p_user_id: user.id,
      p_credits_to_consume: creditsToConsume,
      p_request_id: requestId,
      p_action: 'generate_prompt',
      p_metadata: { tier, input_length: userInput.length, ...metadata },
    })

    if (creditResult.error) {
      throw new Error('Credit consumption failed: ' + creditResult.error.message)
    }

    const creditData = creditResult.data

    if (!creditData.success) {
      return new Response(
        JSON.stringify({
          error: creditData.error,
          message: creditData.message,
          currentCredits: creditData.current_credits,
          requiredCredits: creditsToConsume,
        }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 7. Generate prompt using LLM (with fallback)
    let generatedPrompt: string
    let provider: string

    try {
      // Primary: Google Gemini API
      const geminiKey = Deno.env.get('GEMINI_API_KEY')
      if (!geminiKey) {
        throw new Error('GEMINI_API_KEY not configured')
      }

      const systemPrompt = tier === 'basic'
        ? 'You are a helpful assistant that improves user prompts by adding clarity and context.'
        : tier === 'advanced'
        ? 'You are an expert prompt engineer. Transform the user input into a highly detailed, context-rich prompt optimized for AI systems. Include role definition, constraints, output format, and examples.'
        : 'You are a world-class prompt architect. Create a production-grade, multi-layered prompt with: expert persona, detailed requirements, edge case handling, structured output format, validation criteria, and concrete examples. Optimize for technical accuracy and actionable results.'

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemPrompt}\n\nTransform this prompt:\n\n"${userInput}"\n\nProvide ONLY the improved prompt, no explanations.`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: tier === 'basic' ? 500 : tier === 'advanced' ? 1000 : 2000,
            }
          }),
        }
      )

      if (!geminiResponse.ok) {
        throw new Error(`Gemini API error: ${geminiResponse.status}`)
      }

      const geminiData = await geminiResponse.json()
      generatedPrompt = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      
      if (!generatedPrompt) {
        throw new Error('Empty response from Gemini')
      }

      provider = 'gemini'
    } catch (geminiError) {
      console.error('Gemini failed:', geminiError)

      try {
        // Fallback: OpenRouter (if API key available)
        const openRouterKey = Deno.env.get('OPENROUTER_API_KEY')
        if (!openRouterKey) {
          throw new Error('No fallback provider available')
        }

        const systemPrompt = tier === 'basic'
          ? 'You are a helpful assistant that improves user prompts.'
          : tier === 'advanced'
          ? 'You are an expert prompt engineer. Create detailed, context-rich prompts.'
          : 'You are a world-class prompt architect. Create production-grade prompts with comprehensive details.'

        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': Deno.env.get('SUPABASE_URL') ?? '',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.2-3b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Transform this prompt:\n\n"${userInput}"\n\nProvide ONLY the improved prompt.` }
            ],
            max_tokens: tier === 'basic' ? 500 : tier === 'advanced' ? 1000 : 2000,
          }),
        })

        if (!openRouterResponse.ok) {
          throw new Error(`OpenRouter API error: ${openRouterResponse.status}`)
        }

        const openRouterData = await openRouterResponse.json()
        generatedPrompt = openRouterData.choices?.[0]?.message?.content ?? ''
        
        if (!generatedPrompt) {
          throw new Error('Empty response from OpenRouter')
        }

        provider = 'openrouter'
      } catch (openRouterError) {
        console.error('OpenRouter failed:', openRouterError)
        
        // Final fallback: Template-based enhancement
        generatedPrompt = generateFallbackPrompt(userInput, tier)
        provider = 'fallback'
      }
    }

    // 8. Save to database
    const { error: saveError } = await supabaseAdmin.from('prompts').insert({
      user_id: user.id,
      original_prompt: userInput,
      enhanced_prompt: generatedPrompt,
      tier,
      credits_used: creditsToConsume,
      provider,
      metadata: { request_id: requestId, ...metadata },
    })

    if (saveError) {
      console.error('Failed to save prompt:', saveError)
      // Don't fail the request, just log
    }

    // 9. Return success
    return new Response(
      JSON.stringify({
        success: true,
        prompt: generatedPrompt,
        creditsUsed: creditsToConsume,
        creditsRemaining: creditData.new_credits,
        tier,
        provider,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({
        error: 'internal_server_error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
