// ForumCard.js

import Link from 'next/link';

const ForumCard = ({ question }) => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 my-6">{question.question}</h2>
      <p className="mt-2 text-gray-600 font-medium">Asked by: <span className='text-sm font-normal'>{question.askedBy?.username}</span></p>
      <p className="mt-1 text-gray-600 font-medium">Category: <span className='text-sm font-normal'>{question.category?.name}</span></p>
      <div className="flex mt-10">
        <Link href={`/forum/${question.slug}`}>
          <span className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg shadow-sm transition-colors duration-300">
            Read More
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ForumCard;
