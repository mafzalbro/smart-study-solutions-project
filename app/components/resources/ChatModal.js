import React, { useState, useEffect } from 'react';
import { fetchData } from '@/app/utils/fetchChatData';
import { fetcher } from '@/app/utils/fetcher';
import { toast } from 'react-toastify';
import TextInputField from '../TextInputField';
import GoBackButton from '../GoBackButton';
import ClickButton from '../ClickButton';

const ChatModal = ({ chatSlug, fileUrl, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleSendMessage = async () => {
    try {
      const response = await fetchData(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${chatSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfUrl: pdfUrl,
          message: userMessage,
          title: 'User Message'
        }),
      });

      setMessages([...messages, { user_query: userMessage, model_response: response }]);
      setUserMessage('');
    } catch (error) {
      setError('Failed to send message.');
      toast.error('Failed to send message.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-secondary text-primary dark:text-secondary dark:bg-primary rounded-lg overflow-hidden w-3/4 h-3/4 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <GoBackButton onClick={onClose} />
          <span>Chat with AI</span>
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
            messages.map((msg, index) => (
              <div key={index} className="my-2 p-2 bg-gray-100 rounded">
                <strong>{msg.user_query ? 'You:' : 'AI:'}</strong> {msg.user_query ? msg.user_query : msg.model_response}
                <strong>{msg.user_query ? 'You:' : 'AI:'}</strong> {msg.user_query ? msg.user_query : <div dangerouslySetInnerHTML={{__html: msg.model_response}}></div>}
                
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t flex items-center gap-2">
          <TextInputField
            placeholder='Type your message here...'
            onChange={(e) => setUserMessage(e.target.value)}
            type='text'
            value={userMessage}
            padding='p-2'
            noMargin
            className='w-full border rounded'
          />
          <ClickButton onClick={handleSendMessage} text='Send'/>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
