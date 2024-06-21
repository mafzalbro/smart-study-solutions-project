"use client"

import React, { useState } from 'react';
const marked = require('marked');
import useTypewriter from '../customHooks/useTypewriter';

const ChatWithPdf = () => {
  const [chatChunks, setChatChunks] = useState([]);
  const [message, setMessage] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const fetchChatChunks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/chatwithpdf', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, pdfUrl }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedChunks = '';
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        accumulatedChunks += chunk;
        // Mark and append each chunk to chatChunks state
        const parsedChunk = marked.parse(chunk);
        setChatChunks(prevChunks => [...prevChunks, parsedChunk]);
      }
    } catch (error) {
      console.error('Error fetching chat chunks:', error);
    }
  };

  const typewriterText = useTypewriter(chatChunks.join(''));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChatChunks([]); // Clear previous chat chunks
    await fetchChatChunks(); // Fetch new chat chunks
    // Optionally, clear message and pdfUrl inputs if desired
    // setMessage('');
    // setPdfUrl('');
  };

  return (
    <div className="min-h-screen bg-my-bg-1 dark:bg-gray-800 text-foreground dark:text-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-my-bg-2 dark:bg-gray-900 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Chat with PDF</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Message:</label>
            <input
              type="text"
              value={message}
              placeholder="Enter your message"
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-2">PDF URL:</label>
            <input
              type="text"
              value={pdfUrl}
              placeholder="Enter the PDF URL"
              onChange={(e) => setPdfUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {chatChunks.map((chunk, index) => (
            <span key={index} dangerouslySetInnerHTML={{ __html: chunk }}></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWithPdf;
