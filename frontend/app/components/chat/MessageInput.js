'use client';

import { useState } from 'react';
import PdfInput from './PdfInput';
import Loader from './Loader';
import Spinner from '../Spinner';

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
  
      // Read the first chunk separately to ensure immediate display
      const firstChunk = await reader.read();
      fullMessage += decoder.decode(firstChunk.value);
  
      // Continue reading remaining chunks if available
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

  // Function to handle PDF input change
  const handlePdfInputChange = (url) => {
    setPdfUrl(url);
    setShowPdfInput(true); // Show the PDF input when URL is set
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 text-white bg-gray-800 p-4 flex items-center justify-between sm:justify-start space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-grow p-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-orange-600 h-12"
        disabled={isSending} // Disable input while sending
      />
      {showPdfInput && <PdfInput pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />}
      <div className="flex space-x-2">
        <button onClick={() => setShowPdfInput(!showPdfInput)} className="p-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-orange-600 h-12">
          Add PDF
        </button>
        <button
          onClick={sendMessage}
          disabled={message.trim() === '' || isSending} // Disable the button if message is empty or sending
          className={`p-2 bg-orange-600 rounded text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 h-12 ${message.trim() === '' || isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSending ? <Spinner /> : 'Send'}
        </button>
      </div>
    </div>
  );
}
