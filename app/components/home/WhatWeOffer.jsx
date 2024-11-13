import Link from 'next/link';
import { AiOutlineBook, AiOutlineFileText, AiOutlineFileSearch, AiOutlineRobot, AiOutlineQuestionCircle } from 'react-icons/ai';

const offerings = [
  { icon: <AiOutlineBook className="mx-auto text-5xl text-accent-600 group-hover:text-link-hover transition-colors duration-300" />, title: "Books", url: "/resources/type/books" },
  { icon: <AiOutlineFileText className="mx-auto text-5xl text-accent-600 group-hover:text-link-hover transition-colors duration-300" />, title: "Past Papers", url: "/resources/type/ " },
  { icon: <AiOutlineFileSearch className="mx-auto text-5xl text-accent-600 group-hover:text-link-hover transition-colors duration-300" />, title: "Notes", url: "/resources/type/notes" },
  { icon: <AiOutlineRobot className="mx-auto text-5xl text-accent-600 group-hover:text-link-hover transition-colors duration-300" />, title: "AI PDF Chat", url: "/chat" },
  { icon: <AiOutlineQuestionCircle className="mx-auto text-5xl text-accent-600 group-hover:text-link-hover transition-colors duration-300" />, title: "QnA Forum", url: "/forum" },
];

const WhatWeOffer = () => {
  return (
    <div className="my-20 sm:grid sm:grid-cols-5 flex flex-wrap justify-center items-center gap-8 px-6">
      {offerings.map((offer, index) => (
        <div key={index} className="flex flex-col items-center justify-center my-6 md:my-8 text-center hover:scale-105 transition-transform duration-300">
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
