"use client";
import * as React from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
export default function UploadContainer() {
  // Mutations
  const mutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return axios.post("/api/upload", formData);
    },
    // onSuccess: () => {
    //     // Invalidate and refetch
    //     queryClient.invalidateQueries({ queryKey: ['todos'] })
    // },
  });
  const onDrop = useCallback((acceptedFiles: any) => {
    mutation.mutate(acceptedFiles[0]);
  }, []);
  const { getInputProps } = useDropzone({ onDrop });

  return (
    <div className="nes-container -mr-0.5 h-full w-full flex flex-col items-center text-center font-(family-name:--font-hmkj)">
      <label className="nes-btn">
        <span>点击上传文件到此</span>
        <input {...getInputProps()} />
      </label>
    </div>
  );
}
