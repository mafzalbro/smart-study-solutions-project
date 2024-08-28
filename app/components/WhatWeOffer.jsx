import Link from 'next/link';
import { FaBook, FaFileAlt, FaStickyNote, FaRobot, FaQuestionCircle } from 'react-icons/fa';

const offerings = [
  { icon: <FaBook className="text-2xl text-accent-600" />, title: "Books", url: "/resources/type/book" },
  { icon: <FaFileAlt className="text-2xl text-accent-600" />, title: "Past Papers", url: "/resources/type/past-papers" },
  { icon: <FaStickyNote className="text-2xl text-accent-600" />, title: "Notes", url: "/resources/type/notes" },
  { icon: <FaRobot className="text-2xl text-accent-600" />, title: "AI PDF Chat", url: "/chat" },
  { icon: <FaQuestionCircle className="text-2xl text-accent-600" />, title: "QnA Forum", url: "/forum" },
];

const WhatWeOffer = () => {
  return (
    <div className="my-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {offerings.map((offer, index) => (
        <Link href={offer.url} key={index} className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-accent-50 dark:bg-neutral-900 rounded-full mb-4 flex items-center justify-center">
            {offer.icon}
          </div>
          <p className="font-semibold text-primary dark:text-secondary hover:text-link-hover">{offer.title}</p>
        </Link>
      ))}
    </div>
  );
};

export default WhatWeOffer;
