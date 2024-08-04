// app/components/chat/NewChatButton.js
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CiEdit } from "react-icons/ci";

export default function NewChatButton() {
  const [creatingChat, setCreatingChat] = useState(false);
  const router = useRouter();

  const createNewChat = async () => {
    setCreatingChat(true);
    try {
      const newChat = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/create`, 'POST', { title: 'New Chat' });
      if (newChat) {
        // const newChat = await res.json();
        const slug = newChat.chatOption.slug;
        router.push(`/chat/${slug}`);
      } else {
        router.push("/login");
        console.error('Failed to create new chat');
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    } finally {
      setCreatingChat(false);
    }
  };

  return (
    <button 
      onClick={createNewChat} 
      className={`block md:inline-block py-2 px-4 bg-accent-600 text-secondary rounded-lg shadow-md hover:bg-accent-700 dark:hover:bg-accent-700 dark:bg-accent-600 my-4 ${creatingChat ? 'opacity-50 pointer-events-none' : ''}`} 
      disabled={creatingChat}
    >
      {creatingChat ? 'Creating Chat...' : <span className='flex justify-center items-center gap-1'><CiEdit /> <span>Create New Chat</span></span>}
    </button>
  );
}
