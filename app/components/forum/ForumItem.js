import Link from "next/link";
import LinkText from "../LinkText";
import { FaArrowRight } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { MdCategory } from "react-icons/md";

const ForumItem = ({ question }) => {
  return (
    <div
      className="relative overflow-hidden p-6 md:p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 
      w-full sm:w-1/2 md:w-1/3 lg:w-1/3"
    >
      {/* Gradient overlay for light and dark mode */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-transparent to-transparent dark:from-blue-900 opacity-20 pointer-events-none"></div>

      {/* Question Title */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3 transition-all duration-200 hover:text-blue-600 dark:hover:text-blue-400">
        {question.question}
      </h2>

      {/* Question Metadata */}
      <div className="text-sm flex flex-col gap-2 mb-4">
        {question?.askedBy && question.askedBy?.username && (
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
            <AiOutlineUser className="text-blue-500" />
            <span>
              Asked by:{" "}
              <span className="capitalize font-semibold">
                {question.askedBy?.username}
              </span>
            </span>
          </p>
        )}
        {question.category && question.category.name && (
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
            <MdCategory className="text-blue-500" />
            <span>
              Category:{" "}
              <Link
                href={`/forum/category/${question.category.slug}`}
                className="hover:text-blue-500 capitalize font-semibold"
              >
                {question.category.name}
              </Link>
            </span>
          </p>
        )}
      </div>

      {/* Question Description */}
      {question.description && (
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
          {question.description}
        </p>
      )}

      {/* Read More Link */}
      <div className="flex items-center justify-between mt-6">
        <LinkText
          text="Read More"
          link={`/forum/${question.slug}`}
          icon={<FaArrowRight />}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors duration-200 flex items-center gap-2"
        />
      </div>
    </div>
  );
};

export default ForumItem;
