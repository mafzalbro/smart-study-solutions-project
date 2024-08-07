"use client";

import { useState, useEffect, useRef } from 'react';
import NewChatButton from '../NewChatButton';
import Loader from '../Loader';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MdOutlineDeleteOutline, MdDriveFileRenameOutline, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FiX, FiMoreVertical, FiCheck } from "react-icons/fi";
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md';
import { GrTest } from "react-icons/gr";

import { fetcher } from '@/app/utils/fetcher';
import { FaHome } from 'react-icons/fa';

export default function Sidebar() {
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

  // Get current chatSlug from URL path
  const path = usePathname();
  const chatSlug = path.split('/chat/')[1]; // Extracts the slug from the URL

  // Fetch chats based on the active tab
  const fetchChats = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'chat'
        ? `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/titles?page=${page}&limit=15`
        : `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/pdf-titles?page=${page}&limit=15`;
        
      const data = await fetcher(endpoint);
      if (data.data) {
        // Sort chats by updatedAt descending
        const sortedChats = data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        // If page is 1, replace chats; otherwise, append to existing chats
        const updatedChats = page === 1 ? sortedChats : [...(activeTab === 'chat' ? chats : pdfChats), ...sortedChats];
        if (activeTab === 'chat') {
          setChats(updatedChats);
        } else {
          setPdfChats(updatedChats);
        }
        setTotalResults(data.totalResults);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className={`sidebar md:w-1/4 md:opacity-100 ${!isSidebarVisible ? 'w-0 overflow-hidden p-0 opacity-0 pointer-events-none md:pointer-events-auto': 'pointer-events-auto overflow-auto p-4 fixed md:relative w-[55%] h-full opacity-100'} bg-secondary bg-opacity-90 bg-blend-color-dodge md:bg-transparent text-primary dark:text-secondary dark:bg-neutral-800 md:p-4 flex flex-col gap-10 transition-opacity ease-in-out duration-700 z-20 dark:shadow-2xl md:border-r dark:border-none`}>
        <div className='flex justify-between'>
          <Link href='/chat' className='flex gap-2 items-center justify-center'>
            <h2 className="text-xl" title='Chat Home'><FaHome /> </h2>
          </Link>
          <Link href="/chat/test-api">
            <span className='flex items-center gap-2 text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-500'>
              <GrTest />
              Test API</span>
          </Link>
        </div>
        <NewChatButton />

        {/* Tabs for Chat History and PDF Logs */}
        <div className="flex border-b border-neutral-300 dark:border-neutral-600">
          {/* <button
            onClick={() => setActiveTab('chat')}
            className={`p-2 flex-1 text-center ${activeTab === 'chat' ? 'bg-accent-600 text-white' : 'bg-transparent text-neutral-600 dark:text-secondary'}`}
          >
            Chat History
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`p-2 flex-1 text-center ${activeTab === 'pdf' ? 'bg-accent-600 text-white' : 'bg-transparent text-neutral-600 dark:text-secondary'}`}
          >
            PDF Logs
          </button> */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`p-2 flex-1 text-center ${activeTab === 'chat' ? 'text-accent-600 border-b-2 border-accent-600' : 'bg-transparent text-neutral-600 dark:text-secondary '}`}
          >
            Chat History
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`p-2 flex-1 text-center ${activeTab === 'pdf' ? 'text-accent-600 border-b-2 border-accent-600' : 'bg-transparent text-neutral-600 dark:text-secondary'}`}
          >
            PDF Logs
          </button>
        </div>

{/* Chats or PDF Chats */}
<div className="sidebar flex-1 overflow-y-auto">
  {(activeTab === 'chat' ? chats : pdfChats).map((chat) => (
    <div key={chat.slug} className="relative group">
      {editingChatSlug === chat.slug ? (
        <div className="flex items-center mb-2 outline-accent-500">
          <input
            type="text"
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={() => handleUpdate(chat.slug)}
            onKeyDown={(e) => e.key === 'Enter' && handleUpdate(chat.slug)}
            className="flex-1 p-2 mx-2 mt-1 bg-secondary dark:bg-accent-900 rounded-lg text-neutral-700 dark:text-secondary outline-none focus:ring-2 ring-accent-500"
          />
          <button onClick={() => handleUpdate(chat.slug)} className="p-1 dark:bg-neutral-600 rounded-lg dark:text-secondary">
            <FiCheck />
          </button>
        </div>
      ) : (
        <Link href={`/chat/${chat.slug}`} passHref>
          <span
            title={chat.title}
            className={`block p-2 mb-2 rounded-lg ${chatSlug === chat.slug ? 'bg-accent-500 dark:bg-accent-700 text-secondary' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-secondary'}`}
          >
            {chat.title.length > 15 ? chat.title.slice(0, 15) + '...' : chat.title}
          </span>
        </Link>
      )}
      {!editingChatSlug && chatSlug === chat.slug && (
        <div className="absolute right-0 top-0 p-2 space-x-2">
          <button onClick={(event) => openModal(event, chat.slug)} className="p-1 rounded-lg text-secondary">
            <FiMoreVertical />
          </button>
        </div>
      )}
      {!editingChatSlug && (
        <div className="absolute right-0 top-0 p-2 hidden group-hover:flex space-x-2">
          <button onClick={(event) => openModal(event, chat.slug)} className="p-1 font-bold rounded-lg">
            <FiMoreVertical />
          </button>
        </div>
      )}
    </div>
  ))}
</div>
{loading && <Loader />}
{(activeTab === 'chat' ? chats.length : pdfChats.length) < totalResults && (
  <button onClick={() => setPage(page + 1)} className="justify-center inline-flex">
    <MdOutlineKeyboardArrowDown size={30} color='white' />
  </button>
)}
{modalVisible && (
  <div className="fixed top-0 left-0 w-full flex items-center justify-center bg-primary bg-opacity-50 z-50">
    <div
      ref={modalRef}
      className="bg-secondary dark:bg-accent-700 p-4 rounded-lg shadow-md"
      style={{ top: modalPosition.y, left: modalPosition.x, position: 'absolute' }}
    >
      <button
        onClick={() => handleEdit({ slug: selectedChatSlug, title: (activeTab === 'chat' ? chats : pdfChats).find(chat => chat.slug === selectedChatSlug)?.title })}
        className="flex items-center w-full text-left p-2 hover:bg-neutral-200 dark:hover:bg-accent-800"
      >
        <MdDriveFileRenameOutline className="mr-2" /> Rename
      </button>
      <button
        onClick={() => handleDelete(selectedChatSlug)}
        className="flex items-center w-full text-left p-2 hover:bg-neutral-200 dark:hover:bg-accent-800"
      >
        <MdOutlineDeleteOutline className="mr-2" /> Delete
      </button>
      <button
        onClick={() => setModalVisible(false)}
        className="flex items-center w-full text-left p-2 hover:bg-neutral-200 dark:hover:bg-accent-800"
      >
        <FiX className="mr-2" /> Cancel
      </button>
    </div>
  </div>
)}
<button
  onClick={toggleSidebar}
  className={`fixed z-20 transition-all ease-in-out duration-200 rounded-full m-4 p-2 bg-accent-50 text-primary mt-2 ${!isSidebarVisible ? 'left-0' : 'left-[60%]'} md:hidden`}
>
  {isSidebarVisible ? <MdOutlineArrowBackIosNew /> : <MdOutlineArrowForwardIos />}
</button>
</div>
</>
)};