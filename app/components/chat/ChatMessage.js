'use client';

import React from 'react';
const marked = require('marked');

export default function ChatMessage({ message, display }) {
  const renderMarkdown = (text) => {
    const html = marked.parse(text);
    return { __html: html };
  };

  return (
    <div className={`p-2 mb-2 rounded chat-message ${display}`}>
      <p className="text-orange-600" dangerouslySetInnerHTML={renderMarkdown(message.user_query)} />
      <p dangerouslySetInnerHTML={renderMarkdown(message.model_response)} />
    </div>
  );
}
