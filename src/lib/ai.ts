// Multi-provider AI client with fallback support
import { GoogleGenerativeAI } from '@google/generative-ai'

const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
const openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY

// Initialize Gemini if key is available
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null

export async function generatePrompt(userInput: string, category?: string): Promise<string> {
  // Try Gemini first if available
  if (genAI) {
    return generateWithGemini(userInput, category)
  }
  
  // Fallback to OpenRouter
  if (openrouterKey) {
    return generateWithOpenRouter(userInput, category)
  }

  throw new Error('No AI API key configured. Please add VITE_GEMINI_API_KEY or VITE_OPENROUTER_API_KEY to .env')
}

export async function generatePromptStream(
  userInput: string,
  category?: string,
  onChunk?: (text: string) => void
): Promise<string> {
  // Try Gemini first if available
  if (genAI) {
    return generateWithGeminiStream(userInput, category, onChunk)
  }

  // Fallback to OpenRouter
  if (openrouterKey) {
    return generateWithOpenRouterStream(userInput, category, onChunk)
  }

  throw new Error('No AI API key configured. Please add VITE_GEMINI_API_KEY or VITE_OPENROUTER_API_KEY to .env')
}

// OpenRouter implementation (FREE models available)
async function generateWithOpenRouter(userInput: string, category?: string): Promise<string> {
  const systemPrompt = `You are an expert AI prompt engineer. Generate a high-quality, detailed prompt based on the user's input.

Guidelines:
- Make it clear, specific, and actionable
- Include relevant context and constraints
- Optimize for ${category || 'general use'}
- Keep it between 50-300 words
- Output ONLY the generated prompt, no explanations

User's request: ${userInput}`

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openrouterKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.2-3b-instruct:free', // FREE model
      messages: [
        { role: 'user', content: systemPrompt }
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function generateWithOpenRouterStream(
  userInput: string,
  category?: string,
  onChunk?: (text: string) => void
): Promise<string> {
  const systemPrompt = `You are an expert AI prompt engineer. Generate a high-quality, detailed prompt based on the user's input.

Guidelines:
- Make it clear, specific, and actionable
- Include relevant context and constraints
- Optimize for ${category || 'general use'}
- Keep it between 50-300 words
- Output ONLY the generated prompt, no explanations

User's request: ${userInput}`

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openrouterKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.2-3b-instruct:free', // FREE model
      messages: [
        { role: 'user', content: systemPrompt }
      ],
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  if (!reader) throw new Error('No response body')

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(line => line.trim() !== '')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') continue

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices[0]?.delta?.content || ''
          fullText += content
          if (onChunk) {
            onChunk(fullText)
          }
        } catch (e) {
          // Skip parsing errors
        }
      }
    }
  }

  return fullText
}

// Gemini implementation (fallback)
async function generateWithGemini(userInput: string, category?: string): Promise<string> {
  if (!genAI) throw new Error('Gemini not initialized')

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const systemPrompt = `You are an expert AI prompt engineer. Generate a high-quality, detailed prompt based on the user's input.

Guidelines:
- Make it clear, specific, and actionable
- Include relevant context and constraints
- Optimize for ${category || 'general use'}
- Keep it between 50-300 words
- Output ONLY the generated prompt, no explanations

User's request: ${userInput}`

  const result = await model.generateContent(systemPrompt)
  const response = result.response
  return response.text()
}

async function generateWithGeminiStream(
  userInput: string,
  category?: string,
  onChunk?: (text: string) => void
): Promise<string> {
  if (!genAI) throw new Error('Gemini not initialized')

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const systemPrompt = `You are an expert AI prompt engineer. Generate a high-quality, detailed prompt based on the user's input.

Guidelines:
- Make it clear, specific, and actionable
- Include relevant context and constraints
- Optimize for ${category || 'general use'}
- Keep it between 50-300 words
- Output ONLY the generated prompt, no explanations

User's request: ${userInput}`

  const result = await model.generateContentStream(systemPrompt)

  let fullText = ''
  for await (const chunk of result.stream) {
    const chunkText = chunk.text()
    fullText += chunkText
    if (onChunk) {
      onChunk(fullText)
    }
  }

  return fullText
}
