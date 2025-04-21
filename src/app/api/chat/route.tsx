import { createDeepSeek } from '@ai-sdk/deepseek';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const deepseek = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});
export async function POST(req: Request) {
    const { messages } = await req.json();
    const result = streamText({
        model: deepseek('deepseek-chat'),
        system: 'You are a helpful assistant.',
        messages,
    });

    return result.toDataStreamResponse();
}
