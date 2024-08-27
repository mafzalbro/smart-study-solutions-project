"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiThumbsUp, FiThumbsDown, FiAlertCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi'; // Added icons for toggling
import { BiSolidUpvote, BiUpvote, BiDownvote, BiSolidDownvote } from "react-icons/bi";
import LinkButton from '@/app/components/LinkButton';
import AnswerModal from '@/app/components/forum/AnswerModal';
import ReportModal from '@/app/components/forum/ReportModal';
import AnswerForm from '@/app/components/forum/AnswerForm';
import QuestionModal from '@/app/components/forum/QuestionModal';
import QuestionForm from '@/app/components/forum/QuestionForm';
import QuestionPageSkeleton from '@/app/components/forum/skeletons/QuestionPageSkeleton';
import AlertMessage from '@/app/components/AlertMessage';
import ClickButton from '@/app/components/ClickButton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetcher } from '@/app/utils/fetcher';
import './style.css';
import { FaChevronLeft, FaQuestion } from 'react-icons/fa';
import Link from 'next/link';
import { TbEdit } from 'react-icons/tb';

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
  const [upvotesCount, setUpvotesCount] = useState(0);
  const [downvotesCount, setDownvotesCount] = useState(0);

  const [isUpvotedAnswer, setIsUpvotedAnswer] = useState({});
  const [isDownvotedAnswer, setIsDownvotedAnswer] = useState({});
  const [upvotesAnswerCount, setUpvotesAnswerCount] = useState({});
  const [downvotesAnswerCount, setDownvotesAnswerCount] = useState({});

  const [isLoading, setIsLoading] = useState(true);

    // New state to track answer visibility
    const [expandedAnswers, setExpandedAnswers] = useState({});


  useEffect(() => {
    if (slug) {
      fetchQuestion();
    }
  }, [slug, isAnswerModalOpen]);
  // }, [slug, isAnswerModalOpen, isQuestionModalOpen]);

  const fetchQuestion = () => {
    setIsLoading(true);
    fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}`)
      .then(data => {

        if(data){
          setQuestion(data);
          data?.answers.map((answer, i) => {
            handleAnswerInteractions(answer, i)
            setExpandedAnswers(prev => ({
              ...prev,
              [i]: true
            }))
          })
            setIsUpvoted(data?.isUpvoted);
            setIsDownvoted(data?.isDownvoted);
            setUpvotesCount(data?.upvotesCount);
            setDownvotesCount(data?.downvotesCount);
          }
          })
          .catch(error => {
            if (error === 'Unauthorized') router.push('/login');
        if (error === 'Not Found') router.push('/forum');
        console.error('Error fetching question:', error);
      })
      .finally(() => setIsLoading(false));
  };

  
    // Toggle function for expanding/collapsing answers
    const toggleAnswerVisibility = (index) => {
      setExpandedAnswers(prev => ({
        ...prev,
        [index]: !prev[index]
      }));
    };

    const handleAnswerInteractions = (data, index) => {

      setIsUpvotedAnswer(prev => ({
        ...prev,
        [index]: data ? data?.isUpvoted : prev[index] ? true : false
      }));

      setIsDownvotedAnswer(prev => ({
        ...prev,
        [index]: data ? data?.isDownvoted : prev[index] ? true : false
      }));
      
      setUpvotesAnswerCount(prev => ({
        ...prev,
        [index]: data ? data?.upvotesCount : prev[index]
      }));
      
      setDownvotesAnswerCount(prev => ({
        ...prev,
        [index]: data ? data?.downvotesCount : prev[index]
      }));


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
      if (!isUpvoted) {
        setIsUpvoted(true);
        setIsDownvoted(false);
        setUpvotesCount(prev => prev + 1)
        setUpvotesCount(prev => prev - 1)
      }
        fetcher(url, "POST")
        .then((data) => {
          setIsUpvoted(data?.isUpvoted);
          setIsDownvoted(data?.isDownvoted);
          setUpvotesCount(data?.upvotesCount);
          setDownvotesCount(data?.downvotesCount);
        })
        .catch((error) => {
          setIsUpvoted(false);
        setIsDownvoted(true);
        setUpvotesCount(prev => prev - 1)
        setUpvotesCount(prev => prev + 1)
          console.error("Error upvoting question:", error);
          setAlertMessage({ message: "Error upvoting question.", type: "error" });
        });
  };
  

  const handleDownvote = () => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}/downvote`;
    
    if (!isDownvoted) {
      setIsUpvoted(false);
      setIsDownvoted(true);
      setUpvotesCount(prev => prev - 1)
      setUpvotesCount(prev => prev + 1)
    }
      fetcher(url, "POST")
      .then((data) => {
        setIsUpvoted(data?.isUpvoted);
        setIsDownvoted(data?.isDownvoted);
        setUpvotesCount(data?.upvotesCount);
        setDownvotesCount(data?.downvotesCount);
      })
      .catch((error) => {
        
        setIsUpvoted(true);
        setIsDownvoted(false);
        setUpvotesCount(prev => prev + 1)
        setUpvotesCount(prev => prev - 1)
        console.error(`Error downvoting question:`, error);
        setAlertMessage({ message: `Error downvoting question.`, type: "error" });
      });
  };

  const handleAnswerUpvote = (questionId, answerId, index) => {
    // /questions/:questionId/answers/:answerId/upvote
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${questionId}/answers/${answerId}/upvote`;
  
    if (!isUpvotedAnswer[index]) {
      handleAnswerInteractions(null, index)
    } 
      fetcher(url, "PUT")
      .then((data) => {
        handleAnswerInteractions(data, index)
      })
      .catch((error) => {
        handleAnswerInteractions(null, index)
        console.error("Error upvoting question:", error);
        setAlertMessage({ message: "Error upvoting question.", type: "error" });
      });

  };
  
  
  const handleAnswerDownvote = (questionId, answerId, index) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${questionId}/answers/${answerId}/downvote`;
    if (!isDownvotedAnswer[index]) {
      handleAnswerInteractions(null, index)
    } 
    
    fetcher(url, "PUT")
      .then((data) => {
        handleAnswerInteractions(data, index)
      })
      .catch((error) => {
        handleAnswerInteractions(null, index)
        console.error(`Error downvoting answer:`, error);
        setAlertMessage({ message: `Error downvoting answer.`, type: "error" });
      });
  };



  const handleAlertClose = () => {
    setAlertMessage({ message: '', type: 'info' });
  };


  if (isLoading && !question) return (
    <section className='px-4 py-8 md:p-10'>
    <Link href="/forum" className="text-accent-600 dark:text-accent-300 flex items-center">
      <FaChevronLeft className="mr-1" /> Back to Forum Home
    </Link>
    
    <QuestionPageSkeleton />
    </section>
  );
  
  if (!isLoading && !question) return <div className='text-center py-80 px-4 md:px-8 text-red-600'>Question Details Failed to Load!</div>;

  return (
    <section className="px-4 py-8 md:p-10">
        <Link href="/forum" className="text-accent-600 dark:text-accent-300 flex items-center">
          <FaChevronLeft className="mr-1" /> Back to Forum Home
        </Link>

      <p className='flex gap-4 mt-10'>
        <ClickButton text="Ask Question" icon={<FaQuestion />} onClick={handleQuestionModalOpen} />
        <ClickButton text="Write Answer" icon={<TbEdit />} onClick={handleAnswerModalOpen} />
      </p>

      {isLoading ? (<QuestionPageSkeleton />) : (
        <div className='main-qna-container'>
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
              <button disabled={isUpvoted} className="flex items-center cursor-pointer disabled:pointer-events-none" onClick={handleUpvote}>
                {isUpvoted ? (
                  <BiSolidUpvote className="text-accent-500 text-lg" />
                ) : (
                  <BiUpvote className="text-neutral-400 text-lg" />
                )}
                <span className="ml-1">{`(${upvotesCount})`}</span>
              </button>
              <button disabled={isDownvoted} className="flex items-center cursor-pointer disabled:pointer-events-none" onClick={handleDownvote}>
                {isDownvoted ? (
                  <BiSolidDownvote className="text-accent-500 text-lg" />
                ) : (
                  <BiDownvote className="text-neutral-400 text-lg" />
                )}
                <span className="ml-1">{`(${downvotesCount})`}</span>
              </button>
              <div className="flex items-center cursor-pointer" onClick={() => setIsReportModalOpen(true)}>
                <FiAlertCircle className="text-neutral-400 text-lg" />
                <span className="ml-1">Report</span>
              </div>
            </div>
          </div>

          {Array.isArray(question?.answers) && question?.answers?.length > 0 ? (
            question?.answers?.map((answer, index) => (
              <div key={index} className={`relative mb-4 p-8 pt-0 rounded-lg dark:bg-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-600 transition-all duration-300 ${expandedAnswers[index] ? 'h-full': 'h-auto'}`}>
                <div className="flex justify-between cursor-pointer pt-8" onClick={()=> toggleAnswerVisibility(index)}>
                <h3 className="text-lg font-medium">Answer {index + 1}</h3>
                <span className='cursor-pointer'>
                    {expandedAnswers[index] ? (
                      <FiChevronUp className="text-neutral-400 hover:text-accent-300 dark:text-neutral-600 text-xl" />
                    ) : (
                      <FiChevronDown className="text-neutral-300 hover:text-accent-300 text-xl" />
                    )}
                  </span>
                  </div>

                {expandedAnswers[index] &&
                <div className={`transition-all duration-400 ease-in-out ${expandedAnswers[index] ? '-top-10': 'top-0'}`}>
                <hr className="w-60 my-5" />
                <div
                  dangerouslySetInnerHTML={{ __html: answer?.answerText }}
                  className="question-container my-10"
                  ></div>
            <div className="p-5 my-10 rounded-lg dark:bg-neutral-800 dark:text-neutral-100">
              <div className="flex items-center space-x-4">
              <button disabled={isUpvotedAnswer[index]} className="flex items-center cursor-pointer disabled:pointer-events-none" onClick={() => handleAnswerUpvote(question?._id, answer?._id, index)}>
                {isUpvotedAnswer[index] ? (
                  <BiSolidUpvote className="text-accent-500 text-lg" />
                ) : (
                  <BiUpvote className="text-neutral-400 text-lg" />
                )}
                <span className="ml-1">{`(${upvotesAnswerCount[index]})`}</span>
              </button>
              <button disabled={isDownvotedAnswer[index]} className="flex items-center cursor-pointer disabled:pointer-events-none" onClick={() => handleAnswerDownvote(question?._id, answer?._id, index)}>
                {isDownvotedAnswer[index] ? (
                  <BiSolidDownvote className="text-accent-500 text-lg"/>
                ) : (
                  <BiDownvote className="text-neutral-400 text-lg" />
                )}
                <span className="ml-1">{`(${downvotesAnswerCount[index]})`}</span>
              </button>
              {/* <div className="flex items-center cursor-pointer" onClick={() => setIsReportModalOpen(true)}>
                <FiAlertCircle className="text-neutral-400 text-lg" />
                <span className="ml-1">Report</span>
              </div> */}
            </div>
          </div>
                <hr className="w-60 my-5" />
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
                }
              </div>
            ))
          ) : (
            <p className='py-4'>No Answers Available for this Question. Be the First 💗</p>
          )}
        </div>
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
