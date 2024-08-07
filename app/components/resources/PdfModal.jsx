import React, { useState } from 'react';
import PdfViewer from './PdfViewer';
import { toast } from 'react-toastify';
import { fetcher } from '@/app/utils/fetcher';
import ChatModal from './ChatModal';
import { MdChatBubbleOutline, MdLogin } from 'react-icons/md';
import { useAuth } from '@/app/customHooks/AuthContext';
import LinkButton from '../LinkButton';

const PdfModal = ({ fileUrl, onClose }) => {
  const { isLoggedIn } = useAuth()
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSlug, setChatSlug] = useState(null);

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleAskAI = async () => {
    if(!isLoggedIn){
      return
    }
    try {
      const newChat = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/create`, 'POST', { title: 'New Chat', pdfUrl: fileUrl });
      console.log({ newChat });
      if (newChat) {
        setChatSlug(newChat.chatOption.slug);
        setChatOpen(true);
      }
    } catch (error) {
      // toast.error('Failed to create chat session.');
    }
  };

  return (
    <>
      <PdfViewer
        fileUrl={fileUrl}
        onClose={onClose}
        onFullscreen={handleFullscreenToggle}
        isFullscreen={isFullscreen}
      />
      {isLoggedIn ?
      <button
        onClick={handleAskAI}
        className="fixed bottom-4 right-4 bg-accent-600 text-white py-4 px-6 rounded-full shadow-lg hover:bg-accent-700 transition-all duration-200 z-50 flex items-center justify-center gap-2"
      >
        <MdChatBubbleOutline fontSize={25}/> Talk With This Doucment
      </button>
    : <LinkButton text='Login To Talk with PDF' icon={<MdLogin />} link={'/login'} />  
    }
      {chatOpen && chatSlug && (
        <ChatModal
          chatSlug={chatSlug}
          fileUrl={fileUrl}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
};

export default PdfModal;
