import { useState, useEffect, useRef } from 'react';
import PdfInput from './PdfInput';
import AddPdfModel from '../chat/AddPdfModel';
import Modal from '../Modal';
import { SyncLoader, PuffLoader } from 'react-spinners';
import Image from 'next/image';
import randomInteger from '@/app/utils/randomNo';
import useAlert from '@/app/customHooks/useAlert';
import TextInputField from '@/app/components/chat/TextInputField';
import { IoSendSharp } from "react-icons/io5";
import { TbFileTypePdf } from "react-icons/tb";

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

export default function MessageInput({ chatId, addMessageToChatHistory, chatHistory, addPdfURL, fetchChat }) {
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
  
  // fetchChat()

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
    // else {
      //   document.querySelector('.chat-input-class input').focus()
      // }
    }, [isSending, chatHistory]); // Trigger when isSending changes
    
    const isValidPdfUrl = (url) => {
      try {
      new URL(url);
      // addPdfURL(pdfUrl)
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
      <Modal isOpen={isSending} onClose={() => setIsSending(false)} className="bg-primary bg-opacity-50">
        <div className="w-full flex items-center justify-center gap-5">
          <SyncLoader color="white" size={12} />
          {/* <Image src="https://cdn.svgator.com/images/2023/03/simple-svg-animated-loaders.svg" width={100} height={100} alt="loader" /> */}
        </div>
        <div className="text-neutral-300 text-center mt-4">
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
      <div className="text-red-500 m-4">{error}</div>
    )}
    <div className="relative bottom-0 left-0 right-0 bg-secondary dark:bg-neutral-800 p-1 flex items-center justify-between space-x-2">
      <TextInputField
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message"
        disabled={isSending}
        noMargin
        padding='p-3'
        className='chat-input-class'
      />
      {showPdfInput && <PdfInput pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />}
      <div className="flex space-x-2 pb-2">
        <button
          onClick={handlePdfButtonClick}
          className="p-4 bg-accent-100 dark:bg-neutral-700 rounded-lg dark:text-secondary dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent-600"
        >
          {/* Add PDF */}
          <TbFileTypePdf size={21}/>
        </button>
        <button
          onClick={sendMessage}
          disabled={message.trim() === '' || isSending}
          className={`p-4 bg-accent-500 rounded-lg text-white hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-600 ${
            message.trim() === '' || isSending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          
          {isSending ? <PuffLoader color="#ffffff" size={4} /> : <IoSendSharp size={21}/>}
        </button>
      </div>
    </div>
    <div ref={endOfChatRef}></div>
  </>

  );
}
