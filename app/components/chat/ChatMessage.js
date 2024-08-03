import React from 'react';
import { FaUser, FaRobot } from 'react-icons/fa'; // Import profile and bot icons
const marked = require('marked');

export default function ChatMessage({ message, display }) {
  const renderMarkdown = (text) => {
    const html = marked.parse(text);
    return { __html: html };
  };

  return (
    <>
    {message && message?.model_response !== '' && <div className={`p-4 mb-2 rounded-lg dark:bg-neutral-900 dark:text-secondary ${display}`}>
      <div className="flex items-start mb-2">
        <FaUser className="text-accent-500 text-2xl mr-2" size={20}/> {/* User icon */}
        <p className="text-accent-500 flex-1" dangerouslySetInnerHTML={renderMarkdown(message.user_query)} />
      </div>
      <div className="flex items-start">
        <FaRobot className="text-accent-400 text-2xl mr-2"  size={20}/> {/* Bot icon */}
        <p dangerouslySetInnerHTML={renderMarkdown(message.model_response)} />
      </div>
    </div>
    }

    {message && message?.model_response === '' && <div className={`p-4 mb-2 text-center rounded-lg dark:bg-neutral-900 dark:text-secondary ${display}`}>
            <p className="text-accent-500 flex-1" dangerouslySetInnerHTML={renderMarkdown(message.user_query)} />
            <p dangerouslySetInnerHTML={renderMarkdown(message.model_response)} />
        </div>
    }
    </>
  );
}
