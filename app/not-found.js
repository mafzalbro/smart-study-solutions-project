"use client";

import GoBackButton from "./components/GoBackButton";
import LinkButton from "./components/LinkButton";
import { AiOutlineHome, AiOutlineBook, AiOutlineMessage } from "react-icons/ai";

const NotFound = () => {
  return (
    <div className="min-h-96 my-32 flex flex-col justify-center items-center">
      <GoBackButton />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="mb-8 text-lg">
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <div className="flex justify-center space-x-4">
          <LinkButton
            link="/"
            text="Home"
            ariaLabel="Go to Home"
            icon={<AiOutlineHome className="text-xl" />}
          />
          <LinkButton
            link="/resources"
            text="Resources"
            ariaLabel="Go to Resources"
            icon={<AiOutlineBook className="text-xl" />}
          />
          <LinkButton
            link="/forum"
            text="Forum"
            ariaLabel="Go to Forum"
            icon={<AiOutlineMessage className="text-xl" />}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
