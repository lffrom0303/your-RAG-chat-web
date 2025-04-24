import ChatContainer from "@/components/ChatContainer";
import NavBarContainer from "@/components/NavBarContainer";

export default function Home() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-row h-full w-full bg-gradient-to-r from-blue-100 to-yellow-50 p-20 gap-10">
        <div className="w-[20%] h-full">
          <NavBarContainer />
        </div>
        <div className="w-[80%] h-full">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
}
