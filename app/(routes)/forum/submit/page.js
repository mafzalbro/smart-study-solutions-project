"use client"

import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';
import QuestionForm from '@/app/components/forum/QuestionForm';

const QuestionPage = () => {

  return (
    <>
        <Link href="/forum" className="text-accent-600 dark:text-accent-300 flex items-center m-4 mb-0">
          <FaChevronLeft className="mr-1" /> Back to Forum Home
        </Link>
        <QuestionForm />
    </>
  );
};

export default QuestionPage;
