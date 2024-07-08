'use client';

import { useState } from 'react';
import PdfInput from './PdfInput';
import Loader from './Loader';
import Spinner from '../Spinner';
import Modal from './Modal';
import SyncLoader from 'react-spinners/SyncLoader';
import Image from 'next/image';


export default function MessageInput({ chatId, addMessageToChatHistory }) {
  const [message, setMessage] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [showPdfInput, setShowPdfInput] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    setIsSending(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${chatId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfUrl, message, title: message }),
      });

      if (!response.body) {
        console.error('ReadableStream not supported in this browser.');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullMessage = '';

      const firstChunk = await reader.read();
      fullMessage += decoder.decode(firstChunk.value);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullMessage += decoder.decode(value);
      }

      addMessageToChatHistory({ user_query: message, model_response: fullMessage });
      setMessage('');
      setPdfUrl('');
      setShowPdfInput(false);
      setIsSending(false);
    } catch (error) {
      console.error('Error:', error);
      setIsSending(false);
    }
  };

  const handlePdfInputChange = (url) => {
    setPdfUrl(url);
    setShowPdfInput(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSending && message.trim() !== '') {
      sendMessage();
    }
  };

  return (
    <>
      {isSending && (
        <Modal>
          <div className="w-full flex items-center justify-center">
            <svg
              className="animate-spin h-10 w-10 text-orange-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.42.876 4.63 2.292 6.292l1.415-1.415zm12.707 1.415A7.962 7.962 0 0120 12h-4a8 8 0 01-8 8v4c2.42 0 4.63-.876 6.292-2.292l1.415-1.415z"
              ></path>
            </svg>
            <Image src="https://cdn.svgator.com/images/2023/03/simple-svg-animated-loaders.svg" width={100} height={100}/>
          </div>
          <div className="text-white text-center mt-4">
            Waiting for response...
          </div>
        </Modal>
      )}
      <div className="fixed bottom-0 left-0 right-0 text-white bg-gray-800 p-4 flex items-center justify-between sm:justify-start space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          className="flex-grow p-2 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-600 h-12"
          disabled={isSending}
        />
        {showPdfInput && <PdfInput pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />}
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPdfInput(!showPdfInput)}
            className="flex-grow p-2 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-600 h-12"
          >
            Add PDF
          </button>
          <button
            onClick={sendMessage}
            disabled={message.trim() === '' || isSending}
            className={`p-2 bg-orange-600 rounded-lg text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 h-12 ${message.trim() === '' || isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSending ? <SyncLoader color="#ffffff" size={4} /> : 'Send'}
          </button>
        </div>
      </div>
    </>
  );
}
