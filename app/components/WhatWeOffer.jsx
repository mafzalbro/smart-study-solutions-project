import { FaBook, FaFileAlt, FaStickyNote, FaRobot, FaQuestionCircle } from 'react-icons/fa';

const WhatWeOffer = () => {
  return (
    // <div className="my-24 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
    <div className="my-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-accent-50 dark:bg-neutral-900 rounded-full mb-4 flex items-center justify-center">
          <FaBook className="text-2xl text-accent-600" />
        </div>
        <p className="font-semibold text-primary dark:text-secondary">Books</p>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-accent-50 dark:bg-neutral-900 rounded-full mb-4 flex items-center justify-center">
          <FaFileAlt className="text-2xl text-accent-600" />
        </div>
        <p className="font-semibold text-primary dark:text-secondary">Past Papers</p>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-accent-50 dark:bg-neutral-900 rounded-full mb-4 flex items-center justify-center">
          <FaStickyNote className="text-2xl text-accent-600" />
        </div>
        <p className="font-semibold text-primary dark:text-secondary">Notes</p>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-accent-50 dark:bg-neutral-900 rounded-full mb-4 flex items-center justify-center">
          <FaRobot className="text-2xl text-accent-600" />
        </div>
        <p className="font-semibold text-primary dark:text-secondary">AI PDF Chat</p>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-accent-50 dark:bg-neutral-900 rounded-full mb-4 flex items-center justify-center">
          <FaQuestionCircle className="text-2xl text-accent-600" />
        </div>
        <p className="font-semibold text-primary dark:text-secondary">QnA Forum</p>
      </div>
    </div>
  );
};

export default WhatWeOffer;
