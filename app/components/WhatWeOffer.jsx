import Link from 'next/link';
import { FaBook, FaFileAlt, FaStickyNote, FaRobot, FaQuestionCircle } from 'react-icons/fa';

const offerings = [
  { icon: <FaBook className="mx-auto text-5xl text-accent-600" />, title: "Books", url: "/resources/type/book" },
  { icon: <FaFileAlt className="mx-auto text-5xl text-accent-600" />, title: "Past Papers", url: "/resources/type/past-papers" },
  { icon: <FaStickyNote className="mx-auto text-5xl text-accent-600" />, title: "Notes", url: "/resources/type/notes" },
  { icon: <FaRobot className="mx-auto text-5xl text-accent-600" />, title: "AI PDF Chat", url: "/chat" },
  { icon: <FaQuestionCircle className="mx-auto text-5xl text-accent-600" />, title: "QnA Forum", url: "/forum" },
];

const WhatWeOffer = () => {
  return (
    <div className="my-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {offerings.map((offer, index) => (
        <div key={index} className="flex items-center justify-center w-full my-4 md:my-8">
            <Link href={offer.url} className="px-2 group">
            {offer.icon}
          <p className="mt-4 font-semibold text-primary dark:text-secondary group-hover:text-link-hover">{offer.title}</p>
        </Link>
      </div>
      ))}
    </div>
  );
};

export default WhatWeOffer;
