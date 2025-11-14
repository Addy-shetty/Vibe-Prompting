import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  console.warn('Gemini API key not found. Get one at: https://aistudio.google.com/apikey')
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export async function generatePrompt(userInput: string, category?: string): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API key not configured')
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

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

export async function generatePromptStream(
  userInput: string,
  category?: string,
  onChunk?: (text: string) => void
): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API key not configured')
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

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
