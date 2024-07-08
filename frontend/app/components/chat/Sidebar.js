"use client"

import { useState, useEffect, useRef } from 'react';
import NewChatButton from './NewChatButton';
import Loader from './Loader';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MdOutlineDeleteOutline, MdDriveFileRenameOutline } from "react-icons/md";
import { FiEdit, FiMenu, FiX, FiMoreVertical } from "react-icons/fi";

export default function Sidebar({ height, chatHistory }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [editingChatSlug, setEditingChatSlug] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [selectedChatSlug, setSelectedChatSlug] = useState(null);

  const router = useRouter();
  const modalRef = useRef(null);

  // Get current chatSlug from URL path
  const path = usePathname();
  const chatSlug = path.split('/chat/')[1]; // Extracts the slug from the URL

  // Helper function to fetch chats
  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/titles?page=${page}&limit=15`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.data) {
        // Sort chats by updatedAt descending
        const sortedChats = data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        // If page is 1, replace chats; otherwise, append to existing chats
        const updatedChats = page === 1 ? sortedChats : [...chats, ...sortedChats];
        setChats(updatedChats);
        setTotalResults(data.totalResults);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chats on initial load and when page changes
  useEffect(() => {
    fetchChats();
  }, [page, chatHistory]);

  // Close modal when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle editing chat
  const handleEdit = (chat) => {
    setEditingChatSlug(chat.slug);
    setNewTitle(chat.title); // Set the current title in newTitle
    setModalVisible(false);
  };

  // Handle deleting chat
  const handleDelete = async (chatSlug) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${chatSlug}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setChats(chats.filter(chat => chat.slug !== chatSlug));
        setTotalResults(totalResults - 1);
        setModalVisible(false);
        router.push('/chat')
      } else {
        console.error('Failed to delete chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  // Handle updating chat
  const handleUpdate = async (chatSlug) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${chatSlug}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        setChats(chats.map(chat => (chat.slug === chatSlug ? { ...chat, title: newTitle } : chat)));
        setEditingChatSlug(null);
      } else {
        console.error('Failed to update chat');
      }
    } catch (error) {
      console.error('Error updating chat:', error);
    }
  };

  const openModal = (event, chatSlug) => {
    const { clientX, clientY } = event;
    setModalPosition({ x: clientX, y: clientY });
    setSelectedChatSlug(chatSlug);
    setModalVisible(true);
  };

  return (
    <div className={`w-1/4 h-${height} bg-gray-800 p-4 flex flex-col`}>
      <Link href="/chat/test">
        <span className='block md:inline-block py-2 px-4 bg-orange-600 text-black rounded-lg shadow-md hover:bg-orange-700 dark:hover:bg-orange-700 dark:bg-orange-600 my-8'>Test API</span>
      </Link>
      <Link href='/chat'>
        <h2 className="text-xl mb-4 text-white">Chats</h2>
      </Link>
      <NewChatButton />
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div key={chat.slug} className="relative group">
            {editingChatSlug === chat.slug ? (
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => handleUpdate(chat.slug)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate(chat.slug)}
                  className="flex-1 p-2 bg-gray-700 rounded text-white"
                />
                <button onClick={() => handleUpdate(chat.slug)} className="p-1 bg-gray-600 rounded-lg text-white mx-2">
                  <MdDriveFileRenameOutline />
                </button>
              </div>
            ) : (
              <Link href={`/chat/${chat.slug}`} passHref>
                <span
                  className={`block p-2 mb-2 bg-gray-700 rounded-lg text-white ${chatSlug === chat.slug ? 'bg-orange-600' : ''}`}
                >
                  {chat.title}
                </span>
              </Link>
            )}
            {!editingChatSlug && (
              <div className="absolute right-0 top-0 p-2 hidden group-hover:flex space-x-2">
                <button onClick={(event) => openModal(event, chat.slug)} className="p-1 bg-gray-600 rounded-lg text-white">
                  <FiMoreVertical />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {loading && <Loader />}
      {chats.length < totalResults && (
        <button onClick={() => setPage(page + 1)} className="w-full p-2 mt-4 bg-orange-600 rounded">
          Load More
        </button>
      )}
      {modalVisible && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="bg-white p-4 rounded-lg shadow-md"
            style={{ top: modalPosition.y, left: modalPosition.x, position: 'absolute' }}
          >
            <button onClick={() => handleEdit({ slug: selectedChatSlug, title: chats.find(chat => chat.slug === selectedChatSlug)?.title })} className="flex items-center w-full text-left p-2 hover:bg-gray-200">
              <MdDriveFileRenameOutline className="mr-2" /> Rename
            </button>
            <button onClick={() => handleDelete(selectedChatSlug)} className="flex items-center w-full text-left p-2 hover:bg-gray-200">
              <MdOutlineDeleteOutline className="mr-2" /> Delete
            </button>
            <button onClick={() => setModalVisible(false)} className="flex items-center w-full text-left p-2 hover:bg-gray-200">
              <FiX className="mr-2" /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}