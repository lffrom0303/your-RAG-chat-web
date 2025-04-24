"use client";

import React from "react";

import { useChat } from "@ai-sdk/react";
import { ChatRequestOptions } from "ai";
import { Md5 } from "ts-md5";
import Markdown from "react-markdown";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, usePathname, useParams } from "next/navigation";

export default function ChatContainer() {
  const modelList = [
    {
      name: "deepseek",
    },
  ];
  const { chat_id } = useParams();
  const { data: chat } = useQuery({
    queryKey: ["chat", chat_id],
    queryFn: async () => {
      // console.log("Fetching chat for chat_id:", chat_id);
      return await axios.post("/api/get-chat", { chat_id });
    },
    enabled: !!chat_id,
  });
  const { data: previousMessages } = useQuery({
    queryKey: ["messages", chat_id],
    queryFn: async () => {
      // console.log("Fetching messages for chat_id:", chat_id);
      return await axios.post("/api/get-messages", { chat_id });
    },
    enabled: !!chat_id,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const {
    append,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    reload,
    setMessages,
  } = useChat({
    api: "/api/chat",
    id: chat_id?.toString(),
    body: {
      model: modelList[0].name,
      chat_id,
    },
    initialMessages: previousMessages?.data,
    experimental_prepareRequestBody: ({ messages, requestBody }) => ({
      messages,
      ...requestBody,
      chat_id,
    }),
  });
  // Create a client
  const queryClient = new QueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const endRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleFirstMessage = async () => {
    console.log(
      "handleFirstMessage",
      chat?.data?.title,
      previousMessages?.data?.length
    );
    if (chat?.data?.title && previousMessages?.data?.length === 0) {
      await append(
        {
          role: "user",
          content: chat?.data?.title,
        },
        {
          body: {
            chat_id: chat_id,
          },
        }
      );
    }
  };
  React.useEffect(() => {
    handleFirstMessage();
  }, [chat?.data?.title, previousMessages]);
  const badgeList = [
    {
      name: "他的名字叫什么？",
      className: "is-dark",
      isPersonal: true,
    },
    {
      name: "他的技术栈有哪些？",
      className: "is-dark",
      isPersonal: true,
    },
    {
      name: "说下他的工作经历？",
      className: "is-dark",
      isPersonal: true,
    },
    {
      name: "用粤语回答问题",
      className: "is-success",
    },
    {
      name: "分析下金价走势",
      className: "is-warning",
    },
    {
      name: "距离新年还有多少天",
      className: "is-primary",
    },
  ];
  // Mutations
  const { mutate: createChat } = useMutation({
    mutationFn: async (input: string) => {
      return axios.post("/api/create-chat", {
        title: input,
        model: modelList[0].name,
      });
    },
    onSuccess: async (res) => {
      if (pathname === "/") {
        router.push(`/chat/${res.data.id}`);
        await queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
    },
  });
  const controlSubmit = async (
    e: { preventDefault?: () => void } | undefined
  ) => {
    if (pathname === "/") {
      createChat(input);
    }
    handleSubmit(e);
  };
  const handleClickBadge = async (
    message: string,
    options?: ChatRequestOptions
  ) => {
    if (status === "submitted" || status === "streaming") {
      return;
    }
    stop();
    if (pathname === "/") {
      createChat(message);
    } else {
      await append(
        {
          content: message,
          id: Md5.hashStr(message),
          role: "user",
        },
        options
      );
    }
  };
  const [isReload, setIsReload] = React.useState(false);
  const handleStop = () => {
    setIsReload(true);
    stop();
  };
  const handleReload = async () => {
    setIsReload(false);
    await reload();
  };
  // 当previousMessages变化时更新聊天消息
  React.useEffect(() => {
    // console.log("Previous messages changed:", previousMessages?.data);
    if (previousMessages?.data && previousMessages.data.length > 0) {
      // console.log("Setting messages to:", previousMessages.data);
      setMessages(previousMessages.data);
    }
  }, [previousMessages?.data, setMessages]);

  // 调试用：监控当前消息列表
  React.useEffect(() => {
    // console.log("Current messages:", messages);
  }, [messages]);

  return (
    <div className="relative h-full w-full flex flex-col font-(family-name:--font-hmkj) gap-10">
      <div className="relative nes-container flex-1 overflow-auto">
        <div
          className={`${
            pathname === "/" ? "" : "hidden"
          } w-[50%] text-center absolute top-[50%] left-[50%] -translate-[50%] animate-bounce`}
        >
          <i className="nes-icon is-small heart"></i>
          <i className="nes-icon is-small heart"></i>
          <i className="nes-icon is-small heart"></i>
          <span>你好，请问有咩可以帮到你？</span>
        </div>
        <div className="message-list flex flex-col">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                className={`message flex  gap-2 w-full items-end ${
                  isUser ? "justify-flex-end flex-row-reverse" : "justify-start"
                }`}
                key={message.id}
              >
                <i
                  className={`nes-icon ${
                    isUser ? "twitch" : "reddit"
                  } is-medium`}
                ></i>
                <div
                  className={`!text-lg nes-balloon text-sm inline-block p-2 break-words whitespace-pre-wrap max-w-[60%] ${
                    isUser ? "from-right" : "from-left"
                  }`}
                >
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            );
          })}
          <div
            className={`${
              status === "submitted" ? "" : "hidden"
            } message flex  gap-2 w-full items-end justify-start`}
          >
            <i className={`nes-icon reddit is-medium`}></i>
            <div
              className={`nes-balloon text-sm inline-block p-2 break-words whitespace-pre-wrap max-w-[60%] from-left`}
            >
              <p className="text-lg text-loading">帮紧你帮紧你</p>
            </div>
          </div>
          <div ref={endRef}></div>
        </div>
      </div>
      <form
        onSubmit={controlSubmit}
        className="nes-container flex flex-col p-2 gap-2 -mt-0.5 text-nowrap"
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-5">
            {badgeList.map((badge) => (
              <a
                key={badge.name}
                onClick={() => handleClickBadge(badge.name)}
                className="nes-badge"
              >
                <span className={`${badge.className}`}>{badge.name}</span>
              </a>
            ))}
          </div>
          <button
            onClick={() => handleReload()}
            type="button"
            className={`${isReload ? "" : "!hidden"} nes-btn`}
          >
            继续回答
          </button>
          <button
            onClick={() => handleStop()}
            type="button"
            className={`${
              status === "ready" ? "!hidden" : ""
            } nes-btn is-error`}
          >
            停止
          </button>
        </div>
        <div className="flex flex-row gap-5">
          <div className="nes-select !w-3xs">
            <select>
              {modelList.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            id="name_field"
            className="nes-input text-lg"
            name="prompt"
            value={input}
            onChange={handleInputChange}
          />
          <button type="submit" className="nes-btn is-primary">
            提交
          </button>
        </div>
      </form>
    </div>
  );
}
