"use client";

import { useState, useEffect, useRef } from 'react';
import NewChatButton from '../NewChatButton';
import SidebarHeader from './SidebarHeader';
import SidebarTabs from './SidebarTabs';
import ChatList from './ChatList';
import Modal from './Modal';
import SidebarToggleButton from './SidebarToggleButton';
import { usePathname, useRouter } from 'next/navigation';
import { fetcher } from '@/app/utils/fetcher';

export default function Sidebar({ chatHistory, slug }) {
  const [chats, setChats] = useState([]);
  const [pdfChats, setPdfChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [editingChatSlug, setEditingChatSlug] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [selectedChatSlug, setSelectedChatSlug] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // State for active tab

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const router = useRouter();
  const modalRef = useRef(null);

  // Fetch chats based on the active tab
  const fetchChats = async () => {
    setLoading(true);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/titles?page=${page}&limit=15`;

      const data = await fetcher(endpoint);
      if (data && data.data) {
        // Sort chats by updatedAt descending
        const sortedChats = data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        // If page is 1, replace chats; otherwise, append to existing chats
        const updatedChats = page === 1 ? sortedChats : [...(activeTab === 'chat' ? chats : pdfChats), ...sortedChats];

        // Separate chats with PDF URLs from those without
        const newChats = updatedChats.filter(chat => Array.isArray(chat.pdfUrls) && chat.pdfUrls.length === 0);
        const newPdfChats = updatedChats.filter(chat => Array.isArray(chat.pdfUrls) && chat.pdfUrls.length > 0);

        setChats(newChats);
        setPdfChats(newPdfChats);

        setTotalResults(data.totalResults);
      } else {
        console.error('Data structure is unexpected or data is null.');
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine active tab based on slug and chat history
  useEffect(() => {
    if (slug) {
      const allChats = [...chats, ...pdfChats];
      const isPdf = allChats.some(chat => chat.slug === slug && chat.pdfUrls && chat.pdfUrls.length > 0);
      setActiveTab(isPdf ? 'pdf' : 'chat');
    }
  }, [slug, chatHistory]);

  // Fetch chats on initial load and when page or activeTab changes
  useEffect(() => {
    fetchChats();
  }, [page, activeTab]);

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
    setNewTitle(chat.title.length > 15 ? chat.title.slice(0, 15) + '...' : chat.title);
    setModalVisible(false);
  };

  // Handle deleting chat
  const handleDelete = async (chatSlug) => {
    try {
      const res = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${chatSlug}`, 'DELETE');
      if (res) {
        if (activeTab === 'chat') {
          setChats(chats.filter(chat => chat.slug !== chatSlug));
        } else {
          setPdfChats(pdfChats.filter(chat => chat.slug !== chatSlug));
        }
        setTotalResults(totalResults - 1);
        setModalVisible(false);
        router.push('/chat');
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
      const res = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${chatSlug}`, 'PUT', { title: newTitle });
      if (res) {
        if (activeTab === 'chat') {
          setChats(chats.map(chat => (chat.slug === chatSlug ? { ...chat, title: newTitle } : chat)));
        } else {
          setPdfChats(pdfChats.map(chat => (chat.slug === chatSlug ? { ...chat, title: newTitle } : chat)));
        }
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
    <>
      <div className={`sidebar md:w-1/4 md:opacity-100 ${!isSidebarVisible ? 'w-0 overflow-hidden p-0 opacity-0 pointer-events-none md:pointer-events-auto' : 'pointer-events-auto overflow-auto p-4 fixed md:relative w-[55%] h-full opacity-100'} bg-secondary bg-opacity-90 bg-blend-color-dodge md:bg-transparent text-primary dark:text-secondary dark:bg-neutral-800 md:p-4 flex flex-col gap-10 transition-opacity ease-in-out duration-700 z-20 dark:shadow-2xl md:border-r dark:border-none`}>
        <SidebarHeader />
        <NewChatButton />
        <SidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <ChatList
          chats={chats}
          pdfChats={pdfChats}
          activeTab={activeTab}
          chatSlug={slug}
          editingChatSlug={editingChatSlug}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          handleUpdate={handleUpdate}
          openModal={openModal}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          loading={loading}
          setPage={setPage}
          page={page}
          totalResults={totalResults}
        />
        <Modal
          modalVisible={modalVisible}
          modalRef={modalRef}
          modalPosition={modalPosition}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setModalVisible={setModalVisible}
          chats={chats}
          pdfChats={pdfChats}
          selectedChatSlug={selectedChatSlug}
          activeTab={activeTab}
        />
        <SidebarToggleButton
          isSidebarVisible={isSidebarVisible}
          toggleSidebar={toggleSidebar}
        />
      </div>
    </>
  );
}
