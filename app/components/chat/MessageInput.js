import { useState, useEffect, useRef } from 'react';
import PdfInput from './PdfInput';
import AddPdfModel from '../chat/AddPdfModel';
import Modal from '../Modal';
import { SyncLoader, PuffLoader } from 'react-spinners';
import TextInputField from '@/app/components/chat/TextInputField';
import { IoSendSharp } from "react-icons/io5";
import { TbFileTypePdf } from "react-icons/tb";
import StreamFetcher from '@/app/utils/StreamFetcher';


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
  const [error, setError] = useState(null);
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
    const input = document.querySelector('.chat-input-class input');
    if (input) {
      input.focus();
    }
  }, [isSending, chatHistory]);

  const isValidPdfUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
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

  const sendMessage = async () => {
    if (message.trim() === '') return;

    if (pdfUrl.trim() !== '' && !isValidPdfUrl(pdfUrl)) {
      setError('Invalid PDF URL');
      return;
    }

    setIsSending(true);
    setError(null); // Reset error on new send attempt

    try {
      const body = { pdfUrl, message, title: message };

      const onResponse = (newReply) => {
        setReply(newReply);
      };

      const onError = (error) => {
        setError('An error occurred while fetching the message.');
        console.error(error);
      };

      const onComplete = () => {
        addMessageToChatHistory({ user_query: message, model_response: reply });
        setMessage('');
        setPdfUrl('');
        setShowPdfInput(false);
        document.querySelector('.chat-input-class input').focus();
      };

      // Render StreamFetcher component with appropriate props
      return (
        <StreamFetcher
          url={`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${chatId}`}
          body={body}
          onResponse={onResponse}
          onError={onError}
          onComplete={onComplete}
        />
      );
    } catch (error) {
      console.error('Error:', error);
      setIsSending(false);
    }
  };

  return (
    <>
      {isSending && (
        <Modal isOpen={isSending} onClose={() => setIsSending(false)} className="bg-primary bg-opacity-50">
          <div className="w-full flex items-center justify-center gap-5">
            <SyncLoader color="white" size={12} />
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
