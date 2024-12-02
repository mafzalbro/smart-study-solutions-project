"use client";

import { useEffect, useState } from "react";
import ChatHistory from "../../../components/chat/ChatHistory";
import MessageInput from "../../../components/chat/MessageInput";
import Sidebar from "../../../components/chat/sidebar/Sidebar";
import { fetcher } from "@/app/utils/fetcher";
import NewChatButton from "@/app/components/chat/NewChatButton";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LimitReachedComponent from "@/app/components/chat/LimitReachedComponent";
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";
import { useAuth } from "@/app/customHooks/AuthContext";

export default function Chat({ params }) {
  const { slug } = params;
  const router = useRouter();
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userChatInfo, setUserChatInfo] = useState({});

  const fetchChat = async () => {
    if (!slug) return;

    await removeOlderCacheAfterMutation(`/chat/${slug}`);
    setLoading(true);
    try {
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/${slug}`
      );

      if (data.message === "chat not found") {
        toast.error("Sorry, Chat Not Exists!");
        router.push("/chat");
        // throw new Error('Failed to fetch chat data');
      } else {
        setChatHistory(data.chatHistory);
        data.pdfUrl
          ? setPdfUrls(data.pdfUrl)
          : data.pdfText
          ? setPdfUrls("PDFTEXT")
          : setPdfUrls([]);
      }
    } catch (error) {
      router.push("/chat");
      // console.error('Error fetching chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatInfo = async () => {
    try {
      // if (!!userChatInfo?.queriesUsed) {
      //   if (window !== undefined) {
      //     if (pdfUrls === "PDFTEXT") {
      //       // const info = {
      //       //   query_used: userChatInfo.queriesUsed,
      //       //   pdf_text: pdfUrls,
      //       //   slug: slug,
      //       // };
      //       // window.sessionStorage.setItem("limit", JSON.stringify(info));
      //       setUserChatInfo((prev) => ({
      //         ...prev,
      //         queriesUsed: prev.queriesUsed + 1,
      //       }));
      //     }
      //   }
      // } else {
      const info = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/info/`
      );
      if (
        info.message === "User's information for today fetched successfully"
      ) {
        setUserChatInfo(info.data);
        sessionStorage.setItem("query_used", info.data.queriesUsed);
      } else {
        setUserChatInfo({});
      }
      // }
    } catch (error) {}
  };

  useEffect(() => {
    if (window !== undefined) {
      sessionStorage.clear();
    }
    fetchChatInfo();
  }, [slug]);

  useEffect(() => {
    fetchChat();
  }, [slug]);

  // const addPdfURL = (pdfUrl) => {
  //   // setPdfUrl(pdfUrl)
  // }

  const addMessageToChatHistory = (message) => {
    setChatHistory((prevHistory) => [...prevHistory, message]);
  };

  return (
    <div>
      <LimitReachedComponent
        pdfUrls={pdfUrls}
        fetchChatInfo={fetchChatInfo}
        userChatInfo={userChatInfo}
        setUserChatInfo={setUserChatInfo}
      />
      <div className="chat-home flex h-screen">
        {((userChatInfo && userChatInfo.chatOptionsUsed <= 2) ||
          user?.isMember) && <NewChatButton stickyBtn={true} />}

        <Sidebar
          chatHistory={chatHistory}
          slug={slug}
          pdfuri={pdfUrls}
          userChatInfo={userChatInfo}
          slugBaar="yes"
        />

        <div className="flex flex-col w-full md:w-3/4">
          <ChatHistory
            chatHistory={chatHistory}
            pdfUrls={pdfUrls == "PDFTEXT" ? [] : pdfUrls}
            loading={loading}
          />

          <MessageInput
            fetchChat={fetchChat}
            userChatInfo={userChatInfo}
            fetchChatInfo={fetchChatInfo}
            chatId={slug}
            addMessageToChatHistory={addMessageToChatHistory}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
          
        </div>
      </div>
    </div>
  );
}

{
  /* {userChatInfo && userChatInfo.queriesUsed < 10 ? ( */
}
// ) : (
//   <LimitReachedComponent
//     userChatInfo={userChatInfo}
//     setUserChatInfo={setUserChatInfo}
//     inputArea={true}
//   />
// )}
