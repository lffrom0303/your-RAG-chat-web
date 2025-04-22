"use client";

import React from "react";

import { useChat } from "@ai-sdk/react";

export default function ChatContainer() {
  const { messages, input, handleInputChange, handleSubmit, data, status } =
    useChat({
      api: "/api/chat",
    });
  const endRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="h-full w-full flex flex-col font-(family-name:--font-hmkj)">
      <div className="nes-container flex-1 overflow-auto">
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
                    isUser ? "close" : "reddit"
                  } is-medium`}
                ></i>
                <div
                  className={`nes-balloon text-sm inline-block p-2 break-words whitespace-pre-wrap max-w-[60%] ${
                    isUser ? "from-right" : "from-left"
                  }`}
                >
                  <p className="text-lg">{message.content}</p>
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
        className="nes-container flex flex-row p-2 gap-5 -mt-0.5"
      >
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
      </form>
    </div>
  );
}
