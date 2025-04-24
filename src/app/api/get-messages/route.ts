import { getMessagesById } from "@/db";

export async function POST(req: Request) {
  const { chat_id } = await req.json();
  
  // 确保chat_id是数字
  const chatIdNum = chat_id ? Number(chat_id) : undefined;
  
  if (!chatIdNum) {
    return new Response(JSON.stringify([]), {
      status: 200,
    });
  }
  
  const messages = await getMessagesById(chatIdNum);
  return new Response(JSON.stringify(messages), {
    status: 200,
  });
}
