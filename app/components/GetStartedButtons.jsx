"use client";

import LinkButton from '@/app/components/LinkButton';
import { FaUserGraduate, FaCommentDots, FaQuestionCircle } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useAuth } from '@/app/customHooks/AuthContext';

const GetStartedButtons = () => {
  const { isLoggedIn, user } = useAuth();

  if (user === null) {
    return (
      <div className="mt-8 flex flex-col space-y-4">
        <Skeleton width={240} height={40} />
      </div>
    );
  }

  return (
    <>
      {!isLoggedIn ? (
        <LinkButton link="/login" text="Get Started" ariaLabel="Get started with our platform" icon={<FaUserGraduate className="text-lg" />} />
      ) : (
        <>
          <LinkButton link="/chat" text="AI Chat" ariaLabel="Start AI Chat" icon={<FaCommentDots className="text-lg" />} />
          <LinkButton link="/forum/submit" text="Ask Questions" ariaLabel="Submit a question" icon={<FaQuestionCircle className="text-lg" />} />
        </>
      )}
    </>
  );
};

export default GetStartedButtons;
