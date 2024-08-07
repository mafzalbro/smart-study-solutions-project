"use client"

import { useEffect, useState } from 'react';
import ChatHistory from '../../../components/chat/ChatHistory';
import MessageInput from '../../../components/chat/MessageInput';
import Sidebar from '../../../components/chat/sidebar/Sidebar';
import Loader from '../../../components/chat/Loader';
import { fetcher } from '@/app/utils/fetcher';

export default function Chat({ params }) {
  const { slug } = params;
  const [chatHistory, setChatHistory] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchChat = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const data = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${slug}`);
      // console.log({data});
      
      if (!data) {
        throw new Error('Failed to fetch chat data');
      }
      // const data = await res.json();
      setChatHistory(data.chatHistory);
      (data.pdfUrl) ? setPdfUrls(data.pdfUrl) : setPdfUrls([]);
    } catch (error) {
      console.error('Error fetching chat:', error);
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
      <Sidebar chatHistory={chatHistory} slug={slug} pdfuri={pdfUrls}/>
      <div className="flex flex-col w-full md:w-3/4">
        <ChatHistory chatHistory={chatHistory} pdfUrls={pdfUrls} loading={loading} />
        <MessageInput fetchChat={fetchChat} chatId={slug} addMessageToChatHistory={addMessageToChatHistory} chatHistory={chatHistory}/>
      </div>
    </div>
  );
}
