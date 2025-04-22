import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamText } from "ai";
import { pc } from "@/lib/pinecone";
import { content as mockContent } from "@/mock";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});
export async function POST(req: Request) {
  const { messages } = await req.json();
  // let lastMessage = messages[messages.length - 1];
  // let content = await getContent(lastMessage.content);
  let content = mockContent;
  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: content,
    messages,
  });

  return result.toDataStreamResponse();
}
const getContent = async (query: string) => {
  const model = "multilingual-e5-large";
  const index = pc.index("chatbot");
  const embedding: any = await pc.inference.embed(model, [query], {
    inputType: "query",
  });
  const queryResponse = await index.query({
    topK: 3,
    vector: embedding.data[0].values,
    includeValues: false,
    includeMetadata: true,
  });
  return queryResponse.matches
    .map((match: any) => match.metadata.text)
    .join(" ");
};
