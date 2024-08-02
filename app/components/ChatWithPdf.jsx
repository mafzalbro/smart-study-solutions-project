"use client"

import Sidebar from './chat/Sidebar';
import { useEffect, useState } from 'react';
import Loader from './LoadingSpinner';

export default function Home() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchChats(page);
  }, [page]);

  const fetchChats = async (page) => {
    setLoading(true);
    const res = await fetch(`/api/chat/titles?page=${page}&limit=8`);
    const data = await res.json();
    setChats((prev) => [...prev, ...data.data]);
    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar chats={chats} fetchChats={() => setPage(page + 1)} />
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-2xl">Welcome to Chat Web App</h1>
        {loading && <Loader />}
      </div>
    </div>
  );
}

