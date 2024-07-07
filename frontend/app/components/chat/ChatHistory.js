'use client';

import React from 'react';
import Loader from './Loader';
import ChatMessage from './ChatMessage';
import '../../styles/chatStyles.css';


export default function ChatHistory({ chatHistory, pdfUrls, loading }) {
  console.log(chatHistory);
  return (
    <div className="flex-grow overflow-y-auto p-4">
      {loading ? (
        <Loader />
      ) : (
        <>
          {pdfUrls.length !== 0 && (
            <div className="bg-orange-200 p-5">
              <h3 className="text-lg">PDF URLs You Provided In this Chat Till Now</h3>
              {pdfUrls.map((pdfUrl, index) => (
                <div key={index}>
                  <a href={pdfUrl} target="_blank" className="text-blue-500">
                    {pdfUrl} &rarr;
                  </a>
                </div>
              ))}
            </div>
          )}

          {chatHistory.length !== 0 ? (
            chatHistory.map((message) => (
              <ChatMessage key={message._id} message={message} />
            ))
          ) : (
            <ChatMessage display={"flex justify-center items-center h-[75vh] text-lg"}
              key="no-messages"
              message={{ user_query: 'Nothing to display', model_response: '' }}
            />
          )}
        </>
      )}
    </div>
  );
}
