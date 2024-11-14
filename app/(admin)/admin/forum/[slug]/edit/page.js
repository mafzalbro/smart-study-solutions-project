"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClickButton from "@/app/components/ClickButton";
import TextInputField from "@/app/(admin)/components/admin/TextInputField";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import { toast } from "react-toastify";
import CategorySelect from "@/app/(admin)/components/forum/CategorySelect";
import Link from "next/link";
import { removeOlderCacheAfterMutation } from "@/app/utils/caching";

const AdminQuestionDetailPage = ({ params: { slug } }) => {
  const router = useRouter();

  // State variables to hold question details
  const [question, setQuestion] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [reports, setReports] = useState([]);
  const [answers, setAnswers] = useState([]);

  // State for editing and submitting
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingAnswerText, setEditingAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to track which answer is being deleted
  const [deletingAnswerId, setDeletingAnswerId] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const data = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}`
        );

        removeOlderCacheAfterMutation("/api/qna/question");

        setQuestion(data.question);
        setTags(data.tags ? data.tags.join(",") : "");
        setCategory(data.category);
        setReports(data.reports);
        setAnswers(data.answers);
      } catch (error) {
        console.error("Failed to fetch question", error);
      }
    };
    fetchQuestion();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedQuestion = {
        question,
        tags: tags.split(",").map((tag) => tag.trim()),
        category,
      };

      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}`,
        "PUT",
        updatedQuestion
      );
      toast.success("Question updated successfully!");
      router.back();
    } catch (error) {
      toast.error("Failed to update question.");
      console.error("Failed to update question", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    setDeletingAnswerId(answerId); // Set the deleting answer ID
    setIsSubmitting(true);
    try {
      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}/answers/${answerId}`,
        "DELETE"
      );
      setAnswers(answers.filter((answer) => answer._id !== answerId));
      toast.success("Answer deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete answer.");
      console.error("Failed to delete answer", error);
    } finally {
      setIsSubmitting(false);
      setDeletingAnswerId(null); // Reset deleting ID after the operation
    }
  };

  const handleEditAnswer = (answerId, answerText) => {
    setEditingAnswerId(answerId);
    setEditingAnswerText(answerText);
  };

  const handleUpdateAnswer = async () => {
    setIsSubmitting(true);
    try {
      const updatedAnswer = { answerText: editingAnswerText };

      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}/answers/${editingAnswerId}`,
        "PUT",
        updatedAnswer
      );

      setAnswers(
        answers.map((answer) =>
          answer._id === editingAnswerId
            ? { ...answer, answerText: editingAnswerText }
            : answer
        )
      );

      toast.success("Answer updated successfully!");
      setEditingAnswerId(null); // Exit edit mode
      setEditingAnswerText("");
    } catch (error) {
      toast.error("Failed to update answer.");
      console.error("Failed to update answer", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ClickButton
        onClick={() => router.push("/admin/forum")}
        text={"Go Back"}
      />

      <div className="my-10 px-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextInputField
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Edit your question *"
            required
          />

          <TextInputField
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags (comma separated)"
          />

          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            Category:
          </label>
          <CategorySelect
            selectedCategory={category}
            onCategoryChange={setCategory}
          />

          <button
            type="submit"
            className={`inline-flex cursor-pointer items-center space-x-2 py-2 px-4 text-accent-900 bg-accent-100 hover:bg-accent-200 dark:bg-accent-300 dark:hover:bg-accent-400 rounded-lg text-center ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="my-10">
          <h2 className="text-lg font-bold">Answers</h2>
          {answers?.length > 0 ? (
            <ul className="list-disc pl-5">
              {answers?.map((answer) => (
                <li key={answer._id} className="my-2">
                  {editingAnswerId === answer._id ? (
                    <>
                      <TextInputField
                        type="text"
                        value={editingAnswerText}
                        onChange={(e) => setEditingAnswerText(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                      <button
                        onClick={handleUpdateAnswer}
                        className="text-green-600 ml-2 hover:underline"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingAnswerId(null)}
                        className="text-red-600 ml-2 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <p
                        dangerouslySetInnerHTML={{ __html: answer.answerText }}
                      ></p>
                      {answer.answeredBy && (
                        <Link
                          href={`/admin/users/${answer.answeredBy?.slug}/edit`}
                          className="text-blue-400"
                        >
                          {answer.answeredBy?.fullname}
                        </Link>
                      )}
                      <p className="text-sm text-gray-500">
                        Upvotes: {answer.upvotesCount} | Downvotes:{" "}
                        {answer.downvotesCount}
                      </p>
                      <button
                        onClick={() =>
                          handleEditAnswer(answer._id, answer.answerText)
                        }
                        className="text-blue-600 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAnswer(answer._id)}
                        className="text-red-600 hover:underline"
                        disabled={
                          deletingAnswerId === answer._id && isSubmitting
                        }
                      >
                        {deletingAnswerId === answer._id && isSubmitting
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No answers found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminQuestionDetailPage;
