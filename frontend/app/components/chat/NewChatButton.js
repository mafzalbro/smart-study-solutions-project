// app/components/chat/NewChatButton.js

import { useState } from 'react';

export default function NewChatButton() {
  const [creatingChat, setCreatingChat] = useState(false);

  const createNewChat = async () => {
    setCreatingChat(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/create`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: 'New Chat' })
      });
      if (res.ok) {
        const newChat = await res.json();
        const slug = newChat.chatOption.slug;
        // Redirect to the new chat using window.location.href for client-side navigation
        window.location.href = `/chat/${slug}`;
      } else {
        console.error('Failed to create new chat');
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    } finally {
      setCreatingChat(false);
    }
  };

  return (
    <button onClick={createNewChat} className={`block md:inline-block py-2 px-4 bg-orange-600 text-black rounded-lg shadow-md hover:bg-orange-700 dark:hover:bg-orange-700 dark:bg-orange-600 my-4 ${creatingChat ? 'opacity-50 pointer-events-none' : ''}`} disabled={creatingChat}>
      {creatingChat ? 'Creating Chat...' : 'New Chat'}
    </button>
  );
}
