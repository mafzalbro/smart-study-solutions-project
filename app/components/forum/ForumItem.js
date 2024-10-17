import Link from "next/link";
import LinkText from "../LinkText";
import { FaArrowRight } from "react-icons/fa";

const ForumItem = ({ question }) => {
  return (
    <div className="pt-4 pb-8 px-4 md:mr-2 md:pl-0 lg:p-6 border-b border-neutral-300 dark:border-neutral-600 md:w-52 self-stretch">
      {/* <div className="p-6"> */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 my-2">
        {question.question}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
        Asked By:{" "}
        <span className="capitalize">{question.askedBy?.username}</span>
      </p>
      {question.category && (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          Category:{" "}
          <Link
            href={"/forum/category/" + question.category?.slug}
            className="hover:text-link capitalize"
          >
            {question.category?.name}
          </Link>
        </p>
      )}
      {question.description && (
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
          {question.description}
        </p>
      )}
      <div className="flex mt-4">
        <LinkText
          text="Read More"
          link={`/forum/${question.slug}`}
          icon={<FaArrowRight />}
        />
      </div>
    </div>
  );
};

export default ForumItem;
