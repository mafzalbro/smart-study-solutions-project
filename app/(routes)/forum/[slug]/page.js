"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiThumbsUp, FiThumbsDown, FiAlertCircle } from 'react-icons/fi';
import LinkButton from '@/app/components/LinkButton';
import AnswerModal from '@/app/components/forum/AnswerModal';
import ReportModal from '@/app/components/forum/ReportModal';
import AnswerForm from '@/app/components/forum/AnswerForm';
import QuestionModal from '@/app/components/forum/QuestionModal';
import QuestionForm from '@/app/components/forum/QuestionForm';
import AlertMessage from '@/app/components/AlertMessage';
import ClickButton from '@/app/components/ClickButton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetcher } from '@/app/utils/fetcher';
import './style.css';
import Spinner from '@/app/components/Spinner';

const QuestionPage = ({ params }) => {
  const { slug } = params;
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportDescription, setReportDescription] = useState('');
  const [alertMessage, setAlertMessage] = useState({ message: '', type: 'info' });
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchQuestion();
    }
  }, [slug, isAnswerModalOpen, isQuestionModalOpen]);

  const fetchQuestion = () => {
    setIsLoading(true);
    fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}`)
      .then(data => {
        setQuestion(data);
        setIsUpvoted(data?.isUpvoted);
        setIsDownvoted(data?.isDownvoted);
      })
      .catch(error => {
        if (error === 'Unauthorized') router.push('/login');
        if (error === 'Not Found') router.push('/forum');
        console.error('Error fetching question:', error);
      })
      .finally(() => setIsLoading(false));
  };

  
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
  
  const handleReportSubmit = () => {
    if (!reportDescription.trim()) {
      setAlertMessage({ message: "Please enter a report description.", type: "error" });
      return;
    }

    fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}/report`, "POST", { description: reportDescription })
      .then(() => {
        setAlertMessage({ message: "Question reported successfully.", type: "success" });
        setIsReportModalOpen(false);
      })
      .catch((error) => {
        console.error("Error reporting question:", error);
        setAlertMessage({ message: "Error reporting question.", type: "error" });
      });
  };

  const handleUpvote = () => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}/upvote`;
    const method = isUpvoted ? "DELETE" : "POST";

    fetcher(url, method)
      .then(() => {
        fetchQuestion();
        setIsDownvoted(false);
        setIsUpvoted(method === "POST");
      })
      .catch((error) => {
        console.error(`Error ${method.toLowerCase()}ing question:`, error);
        setAlertMessage({ message: `Error ${method.toLowerCase()}ing question.`, type: "error" });
      });
  };

  const handleDownvote = () => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}/downvote`;
    const method = isDownvoted ? "DELETE" : "POST";

    fetcher(url, method)
      .then(() => {
        fetchQuestion();
        setIsUpvoted(false);
        setIsDownvoted(method === "POST");
      })
      .catch((error) => {
        console.error(`Error ${method.toLowerCase()}ing question:`, error);
        setAlertMessage({ message: `Error ${method.toLowerCase()}ing question.`, type: "error" });
      });
  };



  const handleAlertClose = () => {
    setAlertMessage({ message: '', type: 'info' });
  };

  if (!question) return <Skeleton height={1000} width="100%"/>;
  return (
    <section className="p-10 dark:bg-neutral-900 dark:text-white">
      <LinkButton text="&larr; &nbsp;Back to Forum" link="/forum" />
      <p className='flex gap-4 mt-10'>
        <ClickButton text="Ask Question" onClick={handleQuestionModalOpen} />
        <ClickButton text="Write Answer" onClick={handleAnswerModalOpen} />
      </p>

      {isLoading ? (
        <Skeleton count={5} height={400}/>
      ) : (
        <>
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">{question?.askedBy?.role}</p>
                )}
                {question?.askedBy?.favoriteGenre && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{question?.askedBy?.favoriteGenre}</p>
                )}
              </div>
            </div>
          </div>
          <div className="p-5 my-10 rounded-lg dark:bg-neutral-800 dark:text-neutral-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center cursor-pointer" onClick={handleUpvote}>
                {isUpvoted ? (
                  <FiThumbsUp className="text-accent-500 text-lg" />
                ) : (
                  <FiThumbsUp className="text-neutral-400 text-lg" />
                )}
                <span className="ml-1">{`(${question?.upvotesCount})`}</span>
              </div>
              <div className="flex items-center cursor-pointer" onClick={handleDownvote}>
                {isDownvoted ? (
                  <FiThumbsDown className="text-accent-500 text-lg" />
                ) : (
                  <FiThumbsDown className="text-neutral-400 text-lg" />
                )}
                <span className="ml-1">{`(${question?.downvotesCount})`}</span>
              </div>
              <div className="flex items-center cursor-pointer" onClick={() => setIsReportModalOpen(true)}>
                <FiAlertCircle className="text-neutral-400 text-lg" />
                <span className="ml-1">Report</span>
              </div>
            </div>
          </div>

          {Array.isArray(question?.answers) && question?.answers?.length > 0 ? (
            question?.answers?.map((answer, index) => (
              <div key={index} className="mb-4 p-8 rounded-lg dark:bg-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-600">
                <h3 className="text-lg font-medium">Answer:</h3>
                <hr className="text-neutral-600 w-60 my-5" />
                <div
                  dangerouslySetInnerHTML={{ __html: answer?.answerText }}
                  className="question-container my-10"
                ></div>
                <hr className="text-neutral-600 w-60 my-5" />
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">{answer?.answeredBy?.role}</p>
                      )}
                      {answer?.answeredBy?.favoriteGenre && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{answer?.answeredBy?.favoriteGenre}</p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Answered at: {new Date(answer?.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No answers available for this question.</p>
          )}
        </>
      )}
      {isAnswerModalOpen && <AnswerModal isOpen={isAnswerModalOpen} onClose={handleAnswerModalClose}>
        <AnswerForm questionSlug={question?.slug} onSuccess={handleAnswerModalClose} onClose={handleAnswerModalClose}/>
      </AnswerModal>}

      {isQuestionModalOpen && <QuestionModal isOpen={isQuestionModalOpen} onClose={handleQuestionModalClose}>
        <QuestionForm />
      </QuestionModal>}

      {isReportModalOpen && (
        <ReportModal
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleReportSubmit}
          onChange={e => setReportDescription(e.target.value)}
          value={reportDescription}
        />
      )}

      {alertMessage.message && (
        <AlertMessage
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={handleAlertClose}
        />
      )}
    </section>
  );
};

export default QuestionPage;
