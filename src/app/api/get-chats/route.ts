import { getChats } from "@/db";

export async function GET() {
  const chats = await getChats();
  return new Response(JSON.stringify(chats), {
    status: 200,
  });
}
