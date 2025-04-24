import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { chatTable, messagesTable } from "@/db/schema";
import { eq, SQLWrapper, sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client });

export const createChat = async (title: string, model: string) => {
  try {
    const [newChat] = await db
      .insert(chatTable)
      .values({
        title,
        model,
      })
      .returning();
    return newChat;
  } catch (e) {
    console.log(e);
    return null;
  }
};

//getChat
export const getChat = async (chatId: number | SQLWrapper) => {
  try {
    const chat = await db
      .select()
      .from(chatTable)
      .where(eq(chatTable.id, chatId));
    if (!chat.length) {
      return null;
    }
    return chat[0];
  } catch (e) {
    console.log(e);
    return null;
  }
};
//getChats
export const getChats = async () => {
  try {
    return await db
      .select()
      .from(chatTable)
      .orderBy(sql`${chatTable.id} desc nulls first`);
  } catch (e) {
    return null;
  }
};
//createMessage
export const createMessage = async (
  chatId: number | undefined,
  role: "user" | "assistant",
  content: string
) => {
  try {
    // 检查参数是否有效
    if (!chatId || !role || !content) {
      console.error("Invalid parameters for createMessage:", {
        chatId,
        role,
        content,
      });
      return null;
    }

    const [newMessage] = await db
      .insert(messagesTable)
      .values({
        chatId,
        role,
        content,
      })
      .returning();
    return newMessage;
  } catch (e) {
    console.log(e);
    return null;
  }
};
//getMessagesById
export const getMessagesById = async (chatId: number) => {
  try {
    return await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.chatId, chatId))
      .orderBy(messagesTable.id);
  } catch (e) {
    console.log(e);
    return null;
  }
};
