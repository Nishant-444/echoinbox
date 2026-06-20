import { groq } from '@ai-sdk/groq';
import z from 'zod';
import { APICallError, generateText, Output, TypeValidationError } from 'ai';

export async function POST(req: Request) {
  try {
    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      maxOutputTokens: 500,
      timeout: 8000,
      system: `You are an expert engagement engine for a popular anonymous messaging app.
               Your goal is to generate short strinctly under 400 characters, highly engaging, fun, and provocative (but completely safe/clean) questions.
               The questions should make the recipient eager to reply or guess who sent them.
               Keep them conversational and tailored to casual social media dynamics (like Instagram NGL).
               Absolutely do not include generic, boring questions like 'What is your favorite color?' or 'How are you?'.`,
      output: Output.object({
        schema: z.object({
          suggestions: z.array(z.string()).length(3),
        }),
      }),
      prompt:
        'Generate 3 unique, spicy, or intriguing anonymuous questions to send to a classmate or friend',
    });

    return Response.json(
      { success: true, messages: result.output.suggestions },
      { status: 200 },
    );
  } catch (error: unknown) {
    // handle timeout errors separately to provide a more specific message to the user
    if (error instanceof Error && error.name === 'TimeoutError') {
      console.error('Request timed out: Groq took longer than 8000ms.');
      return Response.json(
        { success: false, message: 'Request timed out. Please try again.' },
        { status: 408 },
      );
    }

    // handle known API call errors like rate limiting or service unavailability or wrong/missing API keys
    if (error instanceof APICallError) {
      console.error(`Groq API Error: ${error.statusCode} - ${error.message}`);
      return Response.json(
        {
          success: false,
          message:
            'AI provider is currently unavailable or rate limited. Please try again later.',
        },
        { status: 500 },
      );
    }

    // handle ai formatting errors like unexpected output structure or schema validation failures
    if (error instanceof TypeValidationError) {
      console.error(
        `Schema mismatch: The AI hallucinated and returned unexpected output. Details: ${error.message}`,
      );
      return Response.json(
        {
          success: false,
          message: 'Failed to generate properly formatted suggestions.',
        },
        { status: 500 },
      );
    }

    // handle any other unexpected errors
    console.error('Unexpected generation error:', error);
    return Response.json(
      { success: false, message: 'Failed to generate suggestions.' },
      { status: 500 },
    );
  }
}
