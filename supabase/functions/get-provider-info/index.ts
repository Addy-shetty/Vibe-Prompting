import { createClient } from 'jsr:@supabase/supabase-js@2'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')

interface ProviderInfo {
  provider: 'gemini' | 'openrouter'
  displayName: string
  icon: string
  features: string[]
}

Deno.serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  try {
    // Determine which AI provider is configured
    let providerInfo: ProviderInfo

    if (GEMINI_API_KEY) {
      providerInfo = {
        provider: 'gemini',
        displayName: 'Google Gemini 2.0 Flash',
        icon: '🚀',
        features: [
          'Advanced reasoning',
          'Multi-modal understanding',
          'Fast response times',
          'Large context window'
        ]
      }
    } else if (OPENROUTER_API_KEY) {
      providerInfo = {
        provider: 'openrouter',
        displayName: 'OpenRouter (Llama 3.2)',
        icon: '⚡',
        features: [
          'Open source model',
          'Cost effective',
          'Multiple model options',
          'Reliable fallback'
        ]
      }
    } else {
      return new Response(
        JSON.stringify({ 
          error: 'No AI provider configured',
          details: 'Please configure GEMINI_API_KEY or OPENROUTER_API_KEY in Supabase Vault'
        }),
        {
          status: 503,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        }
      )
    }

    // Optional: Log provider query for monitoring
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      // Log the provider check (non-blocking)
      supabase.rpc('log_api_usage', {
        p_key_name: `${providerInfo.provider}_api`,
        p_endpoint: 'get-provider-info',
        p_response_time_ms: 0,
        p_status_code: 200,
        p_ip_address: req.headers.get('x-forwarded-for'),
      }).catch(console.error)
    }

    return new Response(
      JSON.stringify(providerInfo),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      }
    )
  } catch (error) {
    console.error('Error in get-provider-info:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      }
    )
  }
})
