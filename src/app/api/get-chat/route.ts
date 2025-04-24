import { getChat } from "@/db";

export async function POST(req: Request) {
  const { chat_id } = await req.json();
  // 确保chat_id是数字
  const chatIdNum = chat_id ? Number(chat_id) : undefined;
  
  if (!chatIdNum) {
    return new Response(JSON.stringify(null), {
      status: 200,
    });
  }
  
  const chat = await getChat(chatIdNum);
  return new Response(JSON.stringify(chat), {
    status: 200,
  });
}
