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
import './style.css';
import ClickButton from '@/app/components/ClickButton';
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

  useEffect(() => {
    if (slug) {
      fetchQuestion();
    }
  }, [slug, isAnswerModalOpen, isQuestionModalOpen]);

  const fetchQuestion = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}`, {
      credentials: 'include'
    })
      .then(response => {
        if (response.status === 401) router.push('/login');
        return response.json();
      })
      .then(data => {
        setQuestion(data);
        // Check if user has upvoted or downvoted
        setIsUpvoted(data?.isUpvoted);
        setIsDownvoted(data?.isDownvoted);
      })
      .catch(error => console.error('Error fetching question:', error));
  };

  if (!question) return <Spinner />;

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
    // Validate report description
    if (!reportDescription.trim()) {
      setAlertMessage({ message: 'Please enter a report description.', type: 'error' });
      return;
    }

    // Call your API to submit the report
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ description: reportDescription }),
    })
      .then(response => {
        if (response.ok) {
          setAlertMessage({ message: 'Question reported successfully.', type: 'success' });
          setIsReportModalOpen(false); // Close the report modal upon success
        } else {
          console.error('Failed to report question:', response.statusText);
          setAlertMessage({ message: 'Failed to report question.', type: 'error' });
        }
      })
      .catch(error => {
        console.error('Error reporting question:', error);
        setAlertMessage({ message: 'Error reporting question.', type: 'error' });
      });
  };

  const handleUpvote = () => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}/upvote`;
    const method = isUpvoted ? 'DELETE' : 'POST';

    fetch(url, {
      method: method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(response => {
        if (response.ok) {
          fetchQuestion(); // Fetch updated question data
          setIsDownvoted(false); // Unset downvote status if upvote is successful
          setIsUpvoted(method === 'POST'); // Toggle upvote status based on method
        } else {
          console.error(`Failed to ${method.toLowerCase()} question:`, response.statusText);
          setAlertMessage({ message: `Failed to ${method.toLowerCase()} question.`, type: 'error' });
        }
      })
      .catch(error => {
        console.error(`Error ${method.toLowerCase()} question:`, error);
        setAlertMessage({ message: `Error ${method.toLowerCase()} question.`, type: 'error' });
      });
  };

  const handleDownvote = () => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}/downvote`;
    const method = isDownvoted ? 'DELETE' : 'POST';

    fetch(url, {
      method: method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(response => {
        if (response.ok) {
          fetchQuestion(); // Fetch updated question data
          setIsUpvoted(false); // Unset upvote status if downvote is successful
          setIsDownvoted(method === 'POST'); // Toggle downvote status based on method
        } else {
          console.error(`Failed to ${method.toLowerCase()} question:`, response.statusText);
          setAlertMessage({ message: `Failed to ${method.toLowerCase()} question.`, type: 'error' });
        }
      })
      .catch(error => {
        console.error(`Error ${method.toLowerCase()} question:`, error);
        setAlertMessage({ message: `Error ${method.toLowerCase()} question.`, type: 'error' });
      });
  };

  const handleAlertClose = () => {
    setAlertMessage({ message: '', type: 'info' });
  };

  return (
    <section className="p-10">
      <LinkButton text="&larr; &nbsp;Back to Forum" link="/forum" />
      <p className='flex gap-4 mt-10'>
      <ClickButton text="Ask Question" onClick={handleQuestionModalOpen} />
      <ClickButton text="Write Answer" onClick={handleAnswerModalOpen} />
      </p>

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
        <div className="flex items-center space-x-4">
          {/* Upvote Icon */}
          <div
            className="flex items-center cursor-pointer"
            onClick={handleUpvote}
          >
            {isUpvoted ? (
              <FiThumbsUp className="text-orange-500 text-lg" />
            ) : (
              <FiThumbsUp className="text-gray-600 text-lg" />
            )}
            <span className="ml-1">{`(${question?.upvotesCount})`}</span>
          </div>

          {/* Downvote Icon */}
          <div
            className="flex items-center cursor-pointer"
            onClick={handleDownvote}
          >
            {isDownvoted ? (
              <FiThumbsDown className="text-orange-500 text-lg" />
            ) : (
              <FiThumbsDown className="text-gray-600 text-lg" />
            )}
            <span className="ml-1">{`(${question?.downvotesCount})`}</span>
          </div>

          {/* Report Icon */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setIsReportModalOpen(true)}
          >
            <FiAlertCircle className="text-gray-600 text-lg" />
            <span className="ml-1">Report</span>
          </div>
        </div>
      </div>

      {Array.isArray(question?.answers) && question?.answers?.length > 0 ? (
        question?.answers?.map((answer, index) => (
          <div key={index} className="mb-4 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-lg font-medium">Answer:</h3>
            <hr className="text-orange-200 w-60 my-5" />
            <div
              dangerouslySetInnerHTML={{ __html: answer?.answerText }}
              className="question-container my-10"
            ></div>
            <hr className="text-orange-200 w-60 my-5" />
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
            <p className="text-xs text-gray-500">
              Answered at: {new Date(answer?.answeredAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <div>No Answers Submitted Yet!</div>
      )}

      <div className="flex mt-4 gap-4">
        <ClickButton onClick={handleQuestionModalOpen} text="Add More Question"/>
        <ClickButton onClick={handleAnswerModalOpen} text="Give Answer"/>
      </div>

      {isAnswerModalOpen && (
        <AnswerModal onClose={handleAnswerModalClose}>
          <AnswerForm
            onSubmitSuccess={() => {
              fetchQuestion();
              setIsAnswerModalOpen(false);
            }}
            questionSlug={question?.slug}
          />
        </AnswerModal>
      )}

      {isQuestionModalOpen && (
        <QuestionModal onClose={handleQuestionModalClose}>
          <QuestionForm
            onSubmitSuccess={() => {
              fetchQuestion();
              setIsQuestionModalOpen(false);
            }}
          />
        </QuestionModal>
      )}

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
