import React, { useState, useEffect, useRef } from 'react';
import { fetcher } from '@/app/utils/fetcher';
import { toast } from 'react-toastify';
import ChatMessage from './ChatMessage';
import TextInputField from './TextInputField';
import SubmitButton from './SubmitButton';
import './style.css';
import { FiArrowUpRight } from 'react-icons/fi';
import Link from 'next/link';

const ChatModal = ({ chatSlug, fileUrl, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const pdfUrl = `http://localhost:8080/${fileUrl}`;

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${chatSlug}`);
        if (response.chatHistory) {
          setMessages(response.chatHistory);
          setLoading(false);
        } else {
          throw new Error('Invalid response');
        }
      } catch (error) {
        setError('Failed to load chat history.');
        toast.error('Failed to load chat history.');
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [chatSlug]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const addMessageToChatHistory = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleSendMessage = async () => {
    if (isSending) return; // Prevent sending multiple messages at once
    setIsSending(true);
  
    try {
      const token = window.localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${chatSlug}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pdfUrl, message: userMessage, title: 'User Message' }),
      });
  
      if (!response.body) {
        console.error('ReadableStream not supported in this browser.');
        return;
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullMessage = '';
      
      // Read and accumulate chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullMessage += decoder.decode(value, { stream: true });
      }
  
      // Update the message in the chat history
      addMessageToChatHistory({ user_query: userMessage, model_response: fullMessage });
  
      setUserMessage('');
      setIsSending(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error:', error);
      setIsSending(false);
    }
  };
    
  return (
    <div className="chat-container fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-secondary text-primary dark:text-secondary dark:bg-primary rounded-lg overflow-hidden w-[90vw] mx-auto h-[90vh] md:w-3/4 md:h-3/4 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center text-sm md:text-base">
          <span>Chat with Document</span>
          <span><Link href={`/chat/${chatSlug}`} target='_blank' className='text-accent-500 dark:text-accent-300 flex gap-1'>See Full History <FiArrowUpRight/></Link></span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center">Loading chat history...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} display="" />
              ))}
              <div ref={messagesEndRef} /> {/* This div will be used to scroll into view */}
            </>
          )}
        </div>
        <div className="p-4 border-t flex items-center gap-2">
          <TextInputField
            placeholder="Type your message here..."
            onChange={(e) => setUserMessage(e.target.value)}
            type="text"
            value={userMessage}
            className="w-full p-2 border rounded"
            ref={inputRef}
            padding="p-2"
            noMargin
          />
          <SubmitButton
            width="w-auto"
            onClick={handleSendMessage}
            disabled={isSending || userMessage.trim() === ''}
            processing={isSending}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatModal;