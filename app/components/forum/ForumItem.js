import Link from 'next/link';
import LinkText from '../LinkText';

const ForumItem = ({ question }) => {
  console.log(question);

  return (
    <div className="p-6 border-b border-neutral-300 dark:border-neutral-600">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 my-2">{question.question}</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
        Asked by: <span className='font-normal'>{question.askedBy?.username}</span>
      </p>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
        Category: <span className='font-normal'>{question.category?.name}</span>
      </p>
      <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{question.description}</p>
      <div className="flex mt-4">
        <LinkText text="Read More" link={`/forum/${question.slug}`} />
      </div>
    </div>
  );
};

export default ForumItem;
