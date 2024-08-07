import React from 'react';
import { FaUser, FaRobot } from 'react-icons/fa';
const marked = require('marked');
const cheerio = require('cheerio');

// Function to apply Tailwind classes to HTML content using cheerio
const addTailwindClasses = (html) => {
  const $ = cheerio.load(html);

  // Map HTML tags to Tailwind classes
  const styles = {
    'pre': 'p-4 bg-gray-100 rounded-md overflow-x-auto',
    'code': 'bg-gray-200 p-1 rounded-md',
    'blockquote': 'p-4 bg-blue-50 border-l-4 border-blue-500',
    'table': 'min-w-full bg-white border border-gray-200',
    'th': 'px-4 py-2 border-b border-gray-200 bg-gray-100',
    'td': 'px-4 py-2 border-b border-gray-200',
    'img': 'max-w-full h-auto border rounded-md',
    'a': 'text-blue-500 hover:underline',
  };

  Object.keys(styles).forEach(tag => {
    $(tag).each((i, el) => {
      $(el).addClass(styles[tag]);
    });
  });

  return $.html();
};

export default function ChatMessage({ message, display }) {
  const renderMarkdown = (text) => {
    const html = marked.parse(text);
    const styledHtml = addTailwindClasses(html);
    return { __html: styledHtml };
  };

  return (
    <>
      {message && message?.model_response !== '' && (
        <div className={`p-4 mb-2 rounded-lg dark:bg-neutral-900 dark:text-secondary ${display}`}>
          <div className="flex items-start mb-2">
            <FaUser className="text-accent-500 dark:text-accent-400 text-2xl mr-2" size={20} />
            <p className="text-accent-500 dark:text-accent-400 flex-1" dangerouslySetInnerHTML={renderMarkdown(message.user_query)} />
          </div>
          <div className="flex items-start">
            <FaRobot className="text-accent-200 dark:text-accent-400 text-2xl mr-2" size={20} />
            <p dangerouslySetInnerHTML={renderMarkdown(message.model_response)} />
          </div>
        </div>
      )}

      {message && message?.model_response === '' && (
        <div className={`p-4 mb-2 text-center rounded-lg dark:bg-neutral-900 dark:text-secondary ${display}`}>
          <p className="text-accent-500 dark:text-accent-400 flex-1" dangerouslySetInnerHTML={renderMarkdown(message.user_query)} />
          <p dangerouslySetInnerHTML={renderMarkdown(message.model_response)} />
        </div>
      )}
    </>
  );
}
