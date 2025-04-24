import { createChat } from "@/db";

export async function POST(req: Request) {
  const { title, model } = await req.json();
  const newChat = await createChat(title, model);
  return new Response(JSON.stringify({ id: newChat?.id }), {
    status: 200,
  });
}
