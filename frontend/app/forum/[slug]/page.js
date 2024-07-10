"use client";

import LinkButton from '@/app/components/LinkButton';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AnswerModal from '@/app/components/forum/AnswerModal';
import AnswerForm from '@/app/components/forum/AnswerForm';
import QuestionModal from '@/app/components/forum/QuestionModal';
import QuestionForm from '@/app/components/forum/QuestionForm';
import ClickButton from '@/app/components/ClickButton';
import './style.css'

const QuestionPage = ({ params }) => {
  const { slug } = params;
  console.log(slug);
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}`, {
        credentials: 'include'
      })
        .then(response =>{ 
          if(response.status == 401) router.push('/login')
          return response.json()
        })
        .then(data => setQuestion(data))
        .catch(error => console.error('Error fetching question:', error));
    }
  }, [slug, isAnswerModalOpen, isQuestionModalOpen]);

  if (!question) return <div>Loading...</div>;

  const handleAnswerModalClose = () => {
    setIsAnswerModalOpen(false);
  };

  const handleAnswerModalOpen = () => {
    setIsAnswerModalOpen(true);
  };

  const handleQuestionModalClose = () => {
    setIsQuestionModalOpen(false);
  };

  const handleQuestionModalOpen = () => {
    setIsQuestionModalOpen(true);
  };

  return (
    <section className="p-10">
      <LinkButton text="&larr; &nbsp;Back to Forum" link="/forum"/>
      <ClickButton text="Submit Question" onClick={handleQuestionModalOpen} />
      <h1 className="text-3xl font-bold my-8">{question?.question}</h1>
      <div className="my-4">
        {question?.askedBy && <p className="mb-2">Asked by:</p>}
        <div className="flex items-center">
          {question?.askedBy?.profileImage && (
            <img
              src={question?.askedBy?.profileImage}
              alt={`${question?.askedBy?.username}'s profile`}
              className="w-10 h-10 rounded-full mr-4"
            />
          )}
          <div>
            {question?.askedBy?.username && (
              <p className="font-semibold">{question?.askedBy?.username}</p>
            )}
            {question?.askedBy?.role && (
              <p className="text-sm text-gray-500">{question?.askedBy?.role}</p>
            )}
            {question?.askedBy?.favoriteGenre && (
              <p className="text-sm text-gray-500">{question?.askedBy?.favoriteGenre}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-5 my-10 rounded-lg">
        {Array.isArray(question?.answers) && question?.answers?.length > 0 ? (
          question?.answers?.map((answer, index) => (
            <div key={index} className="mb-4 bg-white p-8 rounded-lg shadow-md">
              <h3 className='text-lg font-medium'>Answer:</h3>
              <hr className='text-orange-200 w-60 my-5'/>
              <div
                dangerouslySetInnerHTML={{ __html: answer?.answerText }}
                className="question-container my-10"
              ></div>
              <hr className='text-orange-200 w-60 my-5'/>
              <div className="mb-2">
                {answer?.answeredBy && <p className="font-semibold my-4">Answered by:</p>}
                <div className="flex items-center">
                  {answer?.answeredBy?.profileImage && (
                    <img
                      src={answer?.answeredBy?.profileImage}
                      alt={`${answer?.answeredBy?.username}'s profile`}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  )}
                  <div>
                    {answer?.answeredBy?.username && (
                      <p className="font-semibold">{answer?.answeredBy?.username}</p>
                    )}
                    {answer?.answeredBy?.role && (
                      <p className="text-sm text-gray-500">{answer?.answeredBy?.role}</p>
                    )}
                    {answer?.answeredBy?.favoriteGenre && (
                      <p className="text-sm text-gray-500">{answer?.answeredBy?.favoriteGenre}</p>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500">Answered at: {new Date(answer?.answeredAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <div>No Answers Submitted Yet!</div>
        )}
        <div className="flex mt-4">
          <ClickButton text="Ask New Question" onClick={handleQuestionModalOpen}/>
          <ClickButton text="Submit Answer" onClick={handleAnswerModalOpen} />
        </div>

        {isAnswerModalOpen && (
          <AnswerModal onClose={handleAnswerModalClose}>
            <AnswerForm
              questionSlug={slug}
              onSuccess={() => {
                setIsAnswerModalOpen(false);
              }}
              onClose={handleAnswerModalClose}
            />
          </AnswerModal>
        )}

        {isQuestionModalOpen && (
          <QuestionModal onClose={handleQuestionModalClose}>
            <div className="w-[75vw] max-w-3xl">
              <QuestionForm
                onSuccess={() => {
                  setIsQuestionModalOpen(false);
                }}
                onClose={handleQuestionModalClose}
                />
              </div>
          </QuestionModal>
        )}
      </div>
    </section>
  );
};

export default QuestionPage;
