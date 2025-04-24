import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamText } from "ai";
// import { pc } from "@/lib/pinecone";
import { createMessage } from "@/db";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});
export async function POST(req: Request) {
  const { messages, chat_id } = await req.json();

  // 确保chat_id是数字
  const chatIdNum = chat_id ? Number(chat_id) : undefined;

  if (!chatIdNum || !messages || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }
  const lastMessage = messages[messages.length - 1];
  await createMessage(chatIdNum, lastMessage.role, lastMessage.content);
  // const content = await getContent(lastMessage.content);
  const result = streamText({
    model: deepseek("deepseek-chat"),
    // system: content,
    system: "",
    messages,
    onFinish: async (result) => {
      await createMessage(chatIdNum, "assistant", result.text);
    },
  });

  return result.toDataStreamResponse();
}
// const getContent = async (query: string) => {
//   const model = "multilingual-e5-large";
//   const index = pc.index("chatbot");
//   const embedding: any = await pc.inference.embed(model, [query], {
//     inputType: "query",
//   });
//   const queryResponse = await index.query({
//     topK: 3,
//     vector: embedding.data[0].values,
//     includeValues: false,
//     includeMetadata: true,
//   });
//   return queryResponse.matches
//     .map((match: any) => match.metadata.text)
//     .join(" ");
// };
