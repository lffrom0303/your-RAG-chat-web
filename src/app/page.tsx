import ChatContainer from "@/components/ChatContainer";
import UploadContainer from "@/components/UploadContainer";

export default function Home() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-row h-full w-full bg-gradient-to-r from-blue-100 to-yellow-50">
        <div className="w-[20%] h-full">
          <UploadContainer />
        </div>
        <div className="w-[80%] h-full">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
}
