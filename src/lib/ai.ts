// Secure AI client using Supabase Edge Functions
import { supabase } from './supabase'

export async function generatePrompt(userInput: string, category?: string): Promise<string> {
  const systemPrompt = `You are an expert AI prompt engineer. Generate a high-quality, detailed prompt based on the user's input.

Guidelines:
- Make it clear, specific, and actionable
- Include relevant context and constraints
- Optimize for ${category || 'general use'}
- Keep it between 50-300 words
- Output ONLY the generated prompt, no explanations

User input: ${userInput}`

  const { data, error} = await supabase.functions.invoke('generate-prompt', {
    body: { prompt: systemPrompt, model: 'gemini' }
  })

  if (error) throw new Error(error.message)
  if (!data?.text) throw new Error('No response from AI')

  return data.text
}

export async function generatePromptStream(
  userInput: string,
  category?: string,
  onChunk?: (text: string) => void
): Promise<string> {
  // For now, use non-streaming (Edge Functions don't support streaming easily)
  const result = await generatePrompt(userInput, category)
  
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
