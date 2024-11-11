'use client';

import React, { useEffect, useRef } from 'react';
import Loader from './Loader';
import ChatMessage from './ChatMessage';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '@/app/styles/chatStyles.css';
import { GoArrowUpRight } from "react-icons/go";

export default function ChatHistory({ chatHistory, pdfUrls, loading }) {
  const endOfChatRef = useRef(null);

  useEffect(() => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  if(chatHistory)
  return (
    // <div className="md:chat-message md:flex-grow overflow-y-auto p-4 mt-8 md:mt-0 dark:bg-neutral-800 dark:text-secondary">
    <div className="p-4 chat-message flex-grow overflow-y-auto mb-10 md:mb-0 md:mt-0 dark:bg-neutral-800 dark:text-secondary chat-scroll">
      {loading ? (
        <div className="flex flex-col items-center">
          <Skeleton className="w-screen h-screen" />
        </div>
      ) : (
        <>
          {pdfUrls.length > 0 && (
            <div className="bg-secondary dark:bg-neutral-700 p-4 rounded-lg mb-4">
              <h3 className="text-lg text-primary dark:text-neutral-100">PDF URLs You Provided In This Chat</h3>
              {pdfUrls.map((pdfUrl, index) => (
                <div key={index} className="mt-2">
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="dark:text-accent-300 dark:hover:text-accent-400 text-accent-500 hover:text-accent-600 inline-flex items-center">
                    {pdfUrl} <GoArrowUpRight />
                  </a>
                </div>
              ))}
            </div>
          )}

          {chatHistory?.length > 0 ? (
            chatHistory?.map((message, i) => (
              <>
              { chatHistory?.length === (i + 1) && <div ref={endOfChatRef}></div> }
              <ChatMessage key={message._id + i} message={message} />
              </>
            ))
          ) : (
            <ChatMessage
              display="flex justify-center items-center h-[75vh] text-lg text-neutral-400"
              key={Date.now()}
              message={{ user_query: 'Nothing to display', model_response: '' }}
            />
          )}
        </>
      )}
    </div>
  );
}
