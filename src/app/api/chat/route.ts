import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getPgPool, getRedisClient } from '@/lib/db';

// Configure OpenRouter provider
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Get the latest user message
    const userMessage = messages[messages.length - 1];
    
    // Save user message to PostgreSQL
    try {
      const pool = getPgPool();
      await pool.query(
        'INSERT INTO messages (content, role, created_at) VALUES ($1, $2, NOW())',
        [userMessage.content, 'user']
      );
    } catch (dbError) {
      console.warn('Database save failed for user message:', dbError);
    }

    // Create AI response stream
    const result = await streamText({
      model: openrouter('google/gemini-flash-1.5'),
      messages,
      onFinish: async (result) => {
        // Save AI response to PostgreSQL when complete
        try {
          const pool = getPgPool();
          await pool.query(
            'INSERT INTO messages (content, role, created_at) VALUES ($1, $2, NOW())',
            [result.text, 'assistant']
          );
        } catch (dbError) {
          console.warn('Database save failed for AI response:', dbError);
        }
        
        // Optional: Cache response in Redis
        try {
          const redis = await getRedisClient();
          await redis.setEx(
            `chat_response:${Date.now()}`,
            3600, // 1 hour expiry
            result.text
          );
        } catch (redisError) {
          console.warn('Redis caching failed:', redisError);
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}