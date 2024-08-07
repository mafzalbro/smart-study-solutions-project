import NewChatButton from '@/app/components/chat/NewChatButton';
import Sidebar from '@/app/components/chat/sidebar/Sidebar';


export default function Home() {
  return (
    <div className="flex chat-home h-screen">
      <Sidebar/>
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-2xl">Welcome to Chat Web App</h1>
        <p className="text-1xl my-10">Start new chat!</p>
      <NewChatButton />
      </div>
    </div>
  );
}
