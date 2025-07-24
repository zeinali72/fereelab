import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getPgPool, getRedisClient } from '@/lib/db';

// Message interface for type safety
interface Message {
  content: string;
  role: 'user' | 'assistant' | 'system';
  id?: string;
}

// Configure OpenRouter provider
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Simple authentication check (placeholder for now)
function verifyAuthentication(req: Request): boolean {
  // TODO: Implement proper authentication verification
  // For now, just check for authorization header
  const auth = req.headers.get('authorization');
  return auth !== null; // Placeholder - in real app, verify JWT token
}

// Input validation and sanitization
function validateAndSanitizeInput(messages: unknown[]): { isValid: boolean; sanitizedMessages: Message[] } {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { isValid: false, sanitizedMessages: [] };
  }

  const sanitizedMessages = messages.map(msg => {
    if (!msg || typeof msg !== 'object' || !('content' in msg) || typeof msg.content !== 'string' || !('role' in msg)) {
      return null;
    }
    
    // Sanitize content - remove potential HTML/script tags and limit length
    const sanitizedContent = msg.content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .trim()
      .slice(0, 4000); // Limit to 4000 characters
      
    if (sanitizedContent.length === 0) {
      return null;
    }
    
    const sanitizedMessage: Message = {
      content: sanitizedContent,
      role: ['user', 'assistant', 'system'].includes(msg.role as string) ? msg.role as 'user' | 'assistant' | 'system' : 'user'
    };
    
    if ('id' in msg && typeof msg.id === 'string') {
      sanitizedMessage.id = msg.id;
    }
    
    return sanitizedMessage;
  }).filter((msg): msg is Message => msg !== null);

  return { 
    isValid: sanitizedMessages.length > 0, 
    sanitizedMessages 
  };
}

export async function POST(req: Request) {
  try {
    // Authentication check
    if (!verifyAuthentication(req)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { messages } = body;

    // Input validation and sanitization
    const { isValid, sanitizedMessages } = validateAndSanitizeInput(messages);
    if (!isValid) {
      return new Response('Invalid input: messages must be a non-empty array with valid content', { 
        status: 400 
      });
    }
    
    // Get the latest user message
    const userMessage = sanitizedMessages[sanitizedMessages.length - 1];
    
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

    // Create AI response stream with sanitized messages
    const result = await streamText({
      model: openrouter('google/gemini-flash-1.5'),
      messages: sanitizedMessages,
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