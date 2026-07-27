// Secure AI client using Supabase Edge Functions
import { supabase } from './supabase'

export type PromptComplexity = 'basic' | 'advanced' | 'expert'

const COMPLEXITY_INSTRUCTIONS = {
  basic: `
- Focus on clarity and core functionality
- Keep it concise (50-150 words)
- Ideal for quick prototypes or simple scripts
- Structure: Objective, Core Requirements, Tech Stack`,
  
  advanced: `
- Include error handling and edge cases
- Add performance optimization notes
- Specify coding standards and best practices
- Keep it detailed (150-300 words)
- Structure: Objective, Detailed Requirements, Error Handling, Tech Stack, Constraints`,
  
  expert: `
- comprehensive architecture and system design
- Include UI/UX specifications (e.g., Tailwind, animations)
- Detail backend schema, security policies (RLS), and auth
- Add testing strategies (Unit/Integration) and deployment notes
- Keep it extensive (300-600 words)
- Structure: System Overview, Architecture, UI/UX, Backend/Schema, Security, Testing, Deployment`
}

export async function generatePrompt(
  userInput: string, 
  category?: string, 
  complexity: PromptComplexity = 'basic'
): Promise<string> {
  // Select model based on complexity
  // User preference: Use Gemini 2.0 Flash for all tiers as it generates better prompts
  const model = 'gemini' // Maps to gemini-2.0-flash-exp in backend

  const systemPrompt = `You are an expert AI prompt engineer. Generate a high-quality, detailed prompt based on the user's input.

Guidelines:
- Optimize for ${category || 'general use'}
${COMPLEXITY_INSTRUCTIONS[complexity]}
- Output ONLY the generated prompt, no explanations

User input: ${userInput}`

  const { data, error} = await supabase.functions.invoke('generate-prompt', {
    body: { prompt: systemPrompt, model }
  })

  if (error) throw new Error(error.message)
  if (!data?.text) throw new Error('No response from AI')

  // Calculate and log token usage/cost
  if (data.usage) {
    const { promptTokenCount = 0, candidatesTokenCount = 0 } = data.usage
    
    // Pricing (Approximate for Google AI Studio)
    // Gemini 2.0 Flash: Currently free in preview, but using Flash rates for estimation
    // ~$0.075/1M input
    const isPro = model.includes('pro')
    const inputRate = isPro ? 3.50 : 0.075
    const outputRate = isPro ? 10.50 : 0.30

    const inputCost = (promptTokenCount / 1000000) * inputRate
    const outputCost = (candidatesTokenCount / 1000000) * outputRate
    const totalCost = inputCost + outputCost

    if (import.meta.env.DEV) console.log("Token usage tracked");
      input: promptTokenCount,
      output: candidatesTokenCount,
      total: promptTokenCount + candidatesTokenCount,
      estimatedCost: `$${totalCost.toFixed(6)}`
    })

    // Safety check: Log warning if cost exceeds 5 cents
    if (totalCost > 0.05) {
      console.warn('⚠️ High generation cost detected!')
    }
  }

  return data.text
}

export async function generatePromptStream(
  userInput: string,
  category?: string,
  onChunk?: (text: string) => void,
  complexity: PromptComplexity = 'basic'
): Promise<string> {
  // For now, use non-streaming (Edge Functions don't support streaming easily)
  const result = await generatePrompt(userInput, category, complexity)
  
  // Simulate streaming for UX
  if (onChunk) {
    const words = result.split(' ')
    for (let i = 0; i < words.length; i++) {
      onChunk(words.slice(0, i + 1).join(' '))
      await new Promise(resolve => setTimeout(resolve, 30))
    }
  }
  
  return result
}
