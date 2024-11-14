import NewChatButton from "@/app/components/chat/NewChatButton";
import Sidebar from "@/app/components/chat/sidebar/Sidebar";

export default function Home() {
  return (
    <div className="flex chat-home h-screen">
      <Sidebar />
      {/* <NewChatButton stickyBtn={true} /> */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-2xl">Welcome to Chat Web App</h1>
        <p className="text-1xl my-10">Start new chat!</p>
        <NewChatButton
          load={"no"}
          className="text-primary bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl hover:from-indigo-700 hover:to-blue-600 dark:bg-gradient-to-r dark:from-indigo-800 dark:to-blue-700 dark:hover:from-indigo-900 dark:hover:to-blue-800 transition-all ease-in-out duration-300 shadow-xl transform hover:scale-105 animate__animated animate__zoomIn animate__delay-2s"
        />{" "}
      </div>
    </div>
  );
}
