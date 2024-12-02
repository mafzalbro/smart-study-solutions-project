"use client";

import LinkButton from "@/app/components/LinkButton";
import { AiOutlineMessage } from "react-icons/ai";

const QuestionLoadError = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Question Details Failed to Load!
        </h1>
        <p className="mb-8 text-lg">
          We couldn't retrieve the question details. Please try again or explore
          our forum.
        </p>
        <LinkButton
          link="/forum"
          text="Go to Forum"
          icon={<AiOutlineMessage />}
          ariaLabel="Go to Forum"
        />
      </div>
    </div>
  );
};

export default QuestionLoadError;
