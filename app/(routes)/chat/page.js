import NewChatButton from '../../components/chat/NewChatButton';
import Sidebar from '../../components/chat/Sidebar';
import'./style.css';


export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar height="screen"/>
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-2xl">Welcome to Chat Web App</h1>
        <p className="text-1xl my-10">Start new chat!</p>
      <NewChatButton />
      </div>
    </div>
  );
}
