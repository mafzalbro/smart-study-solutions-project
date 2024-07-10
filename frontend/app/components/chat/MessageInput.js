import { useState, useEffect, useRef } from 'react';
import PdfInput from './PdfInput';
import AddPdfModel from '../chat/AddPdfModel';
import Modal from '../Modal';
import SyncLoader from 'react-spinners/SyncLoader';
import Image from 'next/image';
import randomInteger from '@/app/utils/randomNo';
import useAlert from '@/app/customHooks/useAlert';

const messages = [
  'Waiting for response...',
  'Analyzing your query...',
  'Finding best solution...',
  'This is taking longer than expected...',
  'Hang tight, we’re almost there...',
  'Still processing your request...',
  'Thank you for your patience...',
  'Apologies for the delay...',
  'Almost done, just a moment...',
  'Still working on it...',
];

export default function MessageInput({ chatId, addMessageToChatHistory, chatHistory }) {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [showPdfInput, setShowPdfInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [waitingMessageIndex, setWaitingMessageIndex] = useState(0);
  const [error, setError] = useAlert(null); // State to manage errors
  const inputRef = useRef(null);
  const endOfChatRef = useRef(null);

  useEffect(() => {
    let timer = null;
    const random = randomInteger(3, 7);

    if (isSending) {
      timer = setTimeout(() => {
        setWaitingMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, random * 1000);
    } else {
      setWaitingMessageIndex(0);
    }

    return () => clearTimeout(timer);
  }, [isSending, waitingMessageIndex]);

  useEffect(() => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [reply]);

  useEffect(() => {
    // Focus on the input field when component mounts or after a message is sent
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSending]); // Trigger when isSending changes

  const isValidPdfUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;

    // Validate PDF URL before sending
    if (pdfUrl.trim() !== '' && !isValidPdfUrl(pdfUrl)) {
      setError('Invalid PDF URL'); // Set error message
      return;
    }

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
      setReply(fullMessage);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullMessage += decoder.decode(value);
        setReply(fullMessage);
      }

      addMessageToChatHistory({ user_query: message, model_response: fullMessage });
      setMessage('');
      setPdfUrl('');
      setShowPdfInput(false);
      setIsSending(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error:', error);
      setIsSending(false);
    }
  };

  const handlePdfButtonClick = () => {
    if (chatHistory.length === 0) {
      setShowPdfInput(!showPdfInput);
    } else {
      setShowModal(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSending && message.trim() !== '') {
      sendMessage();
    }
  };

  return (
    <>
      {isSending && (
        <Modal isOpen={isSending} onClose={() => setIsSending(false)}>
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
            <Image src="https://cdn.svgator.com/images/2023/03/simple-svg-animated-loaders.svg" width={100} height={100} alt="loader" />
          </div>
          <div className="text-white text-center mt-4">
            {messages[waitingMessageIndex]}
          </div>
        </Modal>
      )}
      <AddPdfModel
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreateNewChat={() => {
          setShowModal(false);
          // Add logic to create a new chat here
        }}
      />
      {error && (
        <div className="text-red-600 m-4">{error}</div>
      )}
      <div className="fixed bottom-0 left-0 right-0 text-white bg-gray-800 p-4 flex items-center justify-between sm:justify-start space-x-2">
        <input
          ref={inputRef}
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
            onClick={handlePdfButtonClick}
            className="flex-grow p-2 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-600 h-12"
          >
            Add PDF
          </button>
          <button
            onClick={sendMessage}
            disabled={message.trim() === '' || isSending}
            className={`p-2 bg-orange-600 rounded-lg text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 h-12 ${
              message.trim() === '' || isSending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSending ? <SyncLoader color="#ffffff" size={4} /> : 'Send'}
          </button>
        </div>
      </div>
      <div ref={endOfChatRef}></div>
    </>
  );
}
