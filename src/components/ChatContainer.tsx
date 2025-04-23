"use client";

import React from "react";

import { useChat } from "@ai-sdk/react";
import { ChatRequestOptions } from "ai";
import { Md5 } from "ts-md5";
import Markdown from "react-markdown";

export default function ChatContainer() {
  const {
    append,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    data,
    status,
    stop,
    reload,
  } = useChat({
    api: "/api/chat",
  });
  const endRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
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
  const handleClickBadge = async (
    message: string,
    options?: ChatRequestOptions
  ) => {
    if (status === "submitted" || status === "streaming") {
      return;
    }
    stop();
    await append(
      {
        content: message,
        id: Md5.hashStr(message),
        role: "user",
      },
      options
    );
  };
  const modelList = [
    {
      name: "deepseek",
    },
  ];
  const [isReload, setIsReload] = React.useState(false);
  const handleStop = () => {
    setIsReload(true);
    stop();
  };
  const handleReload = async () => {
    setIsReload(false);
    await reload();
  };
  return (
    <div className="relative h-full w-full flex flex-col font-(family-name:--font-hmkj)">
      <div
        className={`${
          messages.length === 0 ? "" : "hidden"
        } w-[50%] text-center absolute top-[30%] left-[50%] -translate-[50%] animate-bounce`}
      >
        <i className="nes-icon is-small heart"></i>
        <i className="nes-icon is-small heart"></i>
        <i className="nes-icon is-small heart"></i>
        <span>你好，请问有咩可以帮到你？</span>
      </div>
      <div className="relative nes-container flex-1 overflow-auto">
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
        onSubmit={handleSubmit}
        className="nes-container flex flex-col p-2 gap-2 -mt-0.5"
      >
        <button
          onClick={() => handleStop()}
          type="button"
          className={`${
            status === "ready" ? "!hidden" : ""
          } !fixed bottom-25 right-10 nes-btn is-error`}
        >
          停止
        </button>
        <button
          onClick={() => handleReload()}
          type="button"
          className={`${
            isReload ? "" : "!hidden"
          } !fixed bottom-25 right-10 nes-btn`}
        >
          继续回答
        </button>
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
          <button type="submit" className="nes-btn is-primary text-nowrap">
            提交
          </button>
        </div>
      </form>
    </div>
  );
}
