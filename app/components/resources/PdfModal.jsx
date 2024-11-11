import React, { useState } from 'react';
import PdfViewer from './PdfViewer';
import { toast } from 'react-toastify';
import { fetcher } from '@/app/utils/fetcher';
import ChatModal from './ChatModal';
import { MdChatBubbleOutline, MdLogin, MdShoppingCart } from 'react-icons/md';
import { useAuth } from '@/app/customHooks/AuthContext';
import LinkButton from '../LinkButton';

const PdfModal = ({ fileUrl, onClose }) => {
  const { isLoggedIn, user } = useAuth()
  const isMember = user?.isMember
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

  if(!fileUrl){
    return (
      <div className="relative flex flex-col items-center justify-center pt-4 mx-auto md:w-[50vw] min-h-screen overflow-hidden">
        PDF Not Exists
    </div>
    )
  }

  return (
    <>
      <PdfViewer
        fileUrl={fileUrl}
        onClose={onClose}
        onFullscreen={handleFullscreenToggle}
        isFullscreen={isFullscreen}
      />
      {/* {console.log({isLoggedIn})} */}
      {isLoggedIn && isMember ?
      <button
        onClick={handleAskAI}
        className="fixed bottom-4 right-4 bg-accent-600 text-scondary bg-opacity-80 backdrop-blur-lg p-3 text-sm md:text-base md:py-4 md:px-6 rounded-full shadow-lg hover:bg-accent-700 transition-all duration-200 z-50 flex items-center justify-center gap-2 text-secondary"
      >
        <MdChatBubbleOutline /> <span className='hidden md:inline-block'>Talk With This Doucment</span>
        {console.log({member : isMember})}
      </button> : !isMember && !isLoggedIn ? 
      <LinkButton text='Login To Talk with this PDF' icon={<MdLogin />} link={'/login'} className='fixed bottom-4 right-4 bg-accent-600 text-scondary bg-opacity-80 backdrop-blur-lg p-3 text-sm md:text-base md:py-4 md:px-6 rounded-full shadow-lg hover:bg-accent-700 transition-all duration-200 z-50 flex items-center justify-center gap-2' /> 
      : <LinkButton text='Buy Membership to Chat with PDF' icon={<MdShoppingCart />} link={'/pricing'} className='fixed bottom-4 right-4 bg-accent-600 text-scondary bg-opacity-80 backdrop-blur-lg p-3 text-sm md:text-base md:py-4 md:px-6 rounded-full shadow-lg hover:bg-accent-700 transition-all duration-200 z-50 flex items-center justify-center gap-2' />
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
