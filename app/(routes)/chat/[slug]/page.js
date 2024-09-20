"use client"

import { useEffect, useState } from 'react';
import ChatHistory from '../../../components/chat/ChatHistory';
import MessageInput from '../../../components/chat/MessageInput';
import Sidebar from '../../../components/chat/sidebar/Sidebar';
import { fetcher } from '@/app/utils/fetcher';
import NewChatButton from '@/app/components/chat/NewChatButton';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Chat({ params }) {
  const { slug } = params;
  const router = useRouter()
  const [chatHistory, setChatHistory] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchChat = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const data = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${slug}`);
      
      if (data.message === "chat not found") {
        toast.error('Sorry, Chat Not Exists!')
        router.push('/chat')
        // throw new Error('Failed to fetch chat data');
      } else {
        setChatHistory(data.chatHistory);
        (data.pdfUrl) ? setPdfUrls(data.pdfUrl) : setPdfUrls([]);
      }
    } catch (error) {
      router.push('/chat')
      // console.error('Error fetching chat:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [slug]);

  const addMessageToChatHistory = (message) => {
    setChatHistory((prevHistory) => [...prevHistory, message]);
  };

  // const addPdfURL = (pdfUrl) => {
  //   // setPdfUrl(pdfUrl)
  // }


  return (
    <div className='chat-home flex h-screen'>
      <NewChatButton stickyBtn={true} />
      <Sidebar chatHistory={chatHistory} slug={slug} pdfuri={pdfUrls}/>
      <div className="flex flex-col w-full md:w-3/4">
        <ChatHistory chatHistory={chatHistory} pdfUrls={pdfUrls} loading={loading} />
        <MessageInput fetchChat={fetchChat} chatId={slug} addMessageToChatHistory={addMessageToChatHistory} chatHistory={chatHistory}/>
      </div>
    </div>
  );
}
