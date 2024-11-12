"use client";

import { useState, useEffect, useRef } from "react";
import NewChatButton from "../NewChatButton";
import SidebarHeader from "./SidebarHeader";
import SidebarTabs from "./SidebarTabs";
import ChatList from "./ChatList";
import Modal from "./Modal";
import SidebarToggleButton from "./SidebarToggleButton";
import { useRouter } from "next/navigation";
import { fetcher } from "@/app/utils/fetcher";
import LimitReachedComponent from "../LimitReachedComponent";

export default function Sidebar({ chatHistory, slug, pdfuri, userChatInfo }) {
  const sidebarRef = useRef();
  const [chats, setChats] = useState([]);
  const [pdfChats, setPdfChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [chatPage, setChatPage] = useState(1);
  const [pdfPage, setPdfPage] = useState(1);
  const [totalChats, setTotalChats] = useState(0);
  const [totalPDFs, setTotalPDFs] = useState(0);
  const [editingChatSlug, setEditingChatSlug] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [selectedChatSlug, setSelectedChatSlug] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // State for active tab
  const limit = 10;

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const router = useRouter();
  const modalRef = useRef(null);

  // Helper function to get unique items based on 'slug'
  const getUniqueItemsBySlug = (items) => {
    const uniqueItems = [];
    const seenSlugs = new Set();

    for (const item of items) {
      if (!seenSlugs.has(item.slug)) {
        seenSlugs.add(item.slug);
        uniqueItems.push(item);
      }
    }

    return uniqueItems;
  };

  // Fetch chats
  const fetchChats = async () => {
    setLoading(true);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/titles?page=${chatPage}&limit=${limit}`;
      const data = await fetcher(endpoint);
      if (data && data.data) {
        const sortedChats = data.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        const updatedChats =
          chatPage === 1 ? sortedChats : [...chats, ...sortedChats];

        // Filter unique chats based on 'slug'
        const uniqueChats = getUniqueItemsBySlug(updatedChats);

        setChats(uniqueChats);
        setTotalChats(data.totalResults);
      } else {
        console.error("Data structure is unexpected or data is null.");
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch PDFs
  const fetchPDFs = async () => {
    setLoading(true);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/pdf-titles?page=${pdfPage}&limit=${limit}`;
      const data = await fetcher(endpoint);
      if (data && data.data) {
        const sortedPDFs = data.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        const updatedPDFs =
          pdfPage === 1 ? sortedPDFs : [...pdfChats, ...sortedPDFs];

        // Filter unique PDFs based on 'slug'
        const uniquePDFs = getUniqueItemsBySlug(updatedPDFs);

        setPdfChats(uniquePDFs);
        setTotalPDFs(data.totalResults);
      } else {
        console.error("Data structure is unexpected or data is null.");
      }
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Determine active tab based on slug and chat history
  useEffect(() => {
    if (slug) {
      const allChats = [...chats, ...pdfChats];
      const isPdf = allChats.some(
        (chat) => chat.slug === slug && chat.pdfUrls && chat.pdfUrls.length > 0
      );
      setActiveTab(isPdf ? "pdf" : "chat");
    }

    if ((pdfuri || []).length > 0) {
      setActiveTab("pdf");
    }
  }, [slug, chatHistory]);

  // Fetch chats or PDFs on page or tab change
  useEffect(() => {
    if (activeTab === "chat") {
      fetchChats();
    } else {
      fetchPDFs();
    }
  }, [chatPage, pdfPage, activeTab, chatHistory]);
  // }, [chatPage, pdfPage, activeTab, chatHistory, pdfuri]);

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
    setNewTitle(
      chat.title.length > 15 ? chat.title.slice(0, 15) + "..." : chat.title
    );
    setModalVisible(false);
  };

  // Handle deleting chat
  const handleDelete = async (chatSlug) => {
    try {
      setDeleting(true);
      const res = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${chatSlug}`,
        "DELETE"
      );
      setDeleting(false);
      if (res) {
        if (activeTab === "chat") {
          setChats(chats.filter((chat) => chat.slug !== chatSlug));
        } else {
          setPdfChats(pdfChats.filter((chat) => chat.slug !== chatSlug));
        }
        setTotalChats(totalChats - 1);
        setModalVisible(false);
        router.push("/chat");
      } else {
        console.error("Failed to delete chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  // Handle updating chat
  const handleUpdate = async (chatSlug) => {
    try {
      const res = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${chatSlug}`,
        "PUT",
        { title: newTitle }
      );
      if (res) {
        if (activeTab === "chat") {
          setChats(
            chats.map((chat) =>
              chat.slug === chatSlug ? { ...chat, title: newTitle } : chat
            )
          );
        } else {
          setPdfChats(
            pdfChats.map((chat) =>
              chat.slug === chatSlug ? { ...chat, title: newTitle } : chat
            )
          );
        }
        setEditingChatSlug(null);
      } else {
        console.error("Failed to update chat");
      }
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  };

  const openModal = (event, chatSlug) => {
    const { clientX, clientY } = event;
    setModalPosition({ x: clientX, y: clientY });
    setSelectedChatSlug(chatSlug);
    setModalVisible(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={sidebarRef}
        className={`text-sm md:text-base sidebar md:w-1/4 md:opacity-100 backdrop-blur-sm ${
          !isSidebarVisible
            ? "w-0 p-0 overflow-hidden md:overflow-visible opacity-0 pointer-events-none md:pointer-events-auto"
            : "pointer-events-auto p-4 overflow-visible fixed md:relative w-[60%] h-screen opacity-100"
        } bg-secondary bg-opacity-80 dark:bg-opacity-80 bg-blend-color-dodge md:bg-transparent text-primary dark:text-secondary dark:bg-neutral-800 md:p-4 flex flex-col gap-8 md:gap-6 transition-opacity ease-in-out duration-500 z-20 dark:shadow-2xl md:border-r dark:border-none`}
      >
        <SidebarHeader />
        {userChatInfo && userChatInfo.chatOptionsUsed !== 2 ? (
          <NewChatButton className="hidden md:block" />
        ) : (
          <LimitReachedComponent newButton userChatInfo={userChatInfo} />
        )}
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
          deleting={deleting}
          setChatPage={setChatPage}
          setPdfPage={setPdfPage}
          chatPage={chatPage}
          pdfPage={pdfPage}
          totalChats={totalChats}
          totalPDFs={totalPDFs}
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
          deleting={deleting}
        />
      </div>
      <SidebarToggleButton
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
      />
    </>
  );
}
