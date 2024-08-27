// app/components/chat/NewChatButton.js
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { CiEdit, } from "react-icons/ci";
import { fetcher } from '@/app/utils/fetcher';
import { GrAdd } from 'react-icons/gr';
import { MdOutlineAdd } from 'react-icons/md';
import Spinner from '../Spinner';

export default function NewChatButton({stickyBtn, className}) {
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

  if(stickyBtn){
    return (
      <button 
        onClick={createNewChat} 
        className={`md:hidden fixed top-30 right-4 p-2 bg-accent-600 text-secondary rounded-lg shadow-md hover:bg-accent-700 dark:hover:bg-accent-700 dark:bg-accent-600 my-4 ${creatingChat ? 'opacity-50 pointer-events-none' : ''}`}
        disabled={creatingChat}
      >
        {creatingChat ? (
              <div className="w-4 h-4 border-2 border-secondary border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin-fast"></div>
        ) : <div><MdOutlineAdd className='text-lg'/></div>}
      </button>
    );
  } else {
    return (
      <button 
        onClick={createNewChat} 
        className={`md:inline-block py-2 px-4 bg-accent-600 text-secondary rounded-lg shadow-md hover:bg-accent-700 dark:hover:bg-accent-700 dark:bg-accent-600 my-4 ${creatingChat ? 'opacity-50 pointer-events-none' : ''} ${className ? className : ''}`} 
        disabled={creatingChat}
      >
        {creatingChat ? 'Adding...' : <span className='flex justify-center items-center gap-2'><GrAdd /> <span> Add New</span></span>}
      </button>
    );
  } 
}
