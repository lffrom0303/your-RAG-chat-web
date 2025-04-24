"use client";
import * as React from "react";
// import { useCallback } from "react";
// import { useDropzone } from "react-dropzone";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
export default function NavBarContainer() {
  const router = useRouter();
  const path = usePathname();
  // Mutations
  // const mutation = useMutation({
  //   mutationFn: (file: File) => {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     return axios.post("/api/upload", formData);
  //   },
  // });
  // const onDrop = useCallback((acceptedFiles: any) => {
  //   mutation.mutate(acceptedFiles[0]);
  // }, []);
  // const { getInputProps } = useDropzone({ onDrop });
  const { data: chats } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await axios.get("/api/get-chats");
      return res.data;
    },
  });
  const clickToChat = (chatId: number) => {
    if (path === `/chat/${chatId}`) return;
    router.push(`/chat/${chatId}`);
  };
  return (
    <div className="nes-container h-full w-full flex flex-col gap-5 items-center text-center font-(family-name:--font-hmkj) !text-nowrap">
      <label className="nes-btn is-disabled">
        <span>点击上传文件</span>
        {/*<input {...getInputProps()} />*/}
      </label>
      <button
        type="button"
        className="nes-btn is-primary"
        onClick={() => router.push("/")}
      >
        +创建新的对话
      </button>
      <div className="title !text-lg">历史对话</div>
      <div className="h-full flex flex-col gap-5 w-full overflow-auto">
        {chats?.map((chat: any) => (
          <button
            key={chat.id}
            className={`nes-btn ${
              path === `/chat/${chat.id}` ? "is-success" : ""
            }`}
            onClick={() => {
              clickToChat(chat.id);
            }}
          >
            {chat.title}
          </button>
        ))}
      </div>
    </div>
  );
}
