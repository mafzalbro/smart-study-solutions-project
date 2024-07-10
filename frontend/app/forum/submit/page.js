"use client"

import QuestionForm from '@/app/components/forum/QuestionForm';
import LinkButton from '@/app/components/LinkButton';


const SubmitQuestionPage = () => {
  return (
    <>
<div className="flex justify-center items-center h-screen">
  <div className="w-[75vw] max-w-3xl">
    <LinkButton text="&larr; &nbsp;Back to Forum" link="/forum"/>
    <QuestionForm />
  </div>
</div>
    </>

  );
};

export default SubmitQuestionPage;
