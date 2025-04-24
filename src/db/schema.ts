import { integer, pgTable, text, serial } from "drizzle-orm/pg-core";

export const chatTable = pgTable("chats", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  model: text("model").notNull(),
});
export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").references(() => chatTable.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
});

export type ChatModel = typeof chatTable.$inferSelect;
export type MessageModel = typeof messagesTable.$inferSelect;
