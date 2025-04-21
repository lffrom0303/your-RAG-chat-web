'use client';

import React from "react";


import { useChat } from '@ai-sdk/react';
import {Button} from "@/components/ui/button";

export default function ChatContainer() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
      api:'/api/chat'
  });
  const endRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
      <div className="h-full w-full flex flex-col">
      <div className="flex-1 overflow-auto">
          {messages.map(message => (
              <div key={message.id} className={`p-2 flex flex-row ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`text-sm inline-block p-2 break-words whitespace-pre-wrap max-w-[80%] rounded-lg ${message.role === 'user' ? 'bg-blue-200' : 'bg-white'}`}>
                    {message.content}
                </p>
              </div>
          ))}
          <div ref={endRef}></div>
      </div>

        <form onSubmit={handleSubmit} className="flex flex-row p-2 gap-5">
          <input className={'bg-white flex-1 rounded-lg p-2 h-10'} name="prompt" value={input} onChange={handleInputChange} />
          <Button type="submit">提交</Button>
        </form>
      </div>
  );
}
