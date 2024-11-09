// app/components/dashboard/AnswerCard.js

import { AiOutlineComment } from "react-icons/ai";

const AnswerCard = ({ answer }) => {
  return (
    <div className="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg">
      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
        <AiOutlineComment size={20} className="text-blue-500" />
        {answer.questionText}
      </h3>
      <span className="text-neutral-500 dark:text-neutral-400">
        {new Date(answer.createdAt).toLocaleString()}
      </span>
      <p
        className="text-gray-700 dark:text-gray-300 mb-2 prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: answer.answerText }}
      ></p>
      <a
        href={`/forum/${answer.questionSlug}`}
        className="text-accent-500 dark:text-accent-300 hover:underline flex items-center gap-2"
      >
        View Full Question
      </a>
    </div>
  );
};

export default AnswerCard;
