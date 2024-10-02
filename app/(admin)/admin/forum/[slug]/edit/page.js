"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClickButton from "@/app/components/ClickButton";
import TextInputField from "@/app/(admin)/components/admin/TextInputField";
import { fetcher } from "@/app/(admin)/utils/fetcher";
import { toast } from "react-toastify";
import CategorySelect from "@/app/(admin)/components/forum/CategorySelect"; // Adjust path based on your file structure
import Link from "next/link";

const AdminQuestionDetailPage = ({ params: { slug } }) => {
  const router = useRouter();

  // State variables to hold question details
  const [question, setQuestion] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [reports, setReports] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const data = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${slug}`
        );

        console.log({data})

        // Set the form fields with the fetched data
        setQuestion(data.question);
        setTags(data.tags ? data.tags.join(',') : '');
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
    try {
      const updatedQuestion = { 
        question, 
        tags: tags.split(',').map(tag => tag.trim()), 
        category 
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
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/report/${reportId}`,
        "DELETE"
      );
      setReports(reports.filter(report => report._id !== reportId));
      toast.success("Report deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete report.");
      console.error("Failed to delete report", error);
    }
  };

  return (
    <>
      <ClickButton onClick={() => router.push('/admin/forum')} text={"Go Back"} />

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
            className="inline-flex cursor-pointer items-center space-x-2 py-2 px-4 text-accent-900 bg-accent-100 hover:bg-accent-200 dark:bg-accent-300 dark:hover:bg-accent-400 rounded-lg text-center"
          >
            Save Changes
          </button>
        </form>

        <div className="my-10">
          <h2 className="text-lg font-bold">Answers</h2>
          {answers.length > 0 ? (
            <ul className="list-disc pl-5">
              {answers.map(answer => (
                <li key={answer._id} className="my-2">
                  <p>{answer.answerText}</p>
                  {answer.answeredBy && <Link href={answer.answeredBy?.slug}>{answer.answeredBy?.name}</Link>}
                  <p className="text-sm text-gray-500">Upvotes: {answer.upvotesCount} | Downvotes: {answer.downvotesCount}</p>
                  {/* Additional actions for editing or deleting answers can go here */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No answers found.</p>
          )}
        </div>

        <div className="my-10">
          <h2 className="text-lg font-bold">Reports</h2>
          {reports.length > 0 ? (
            <ul className="list-disc pl-5">
              {reports.map(report => (
                <li key={report._id} className="my-2">
                  <p>{report.description}</p>
                  {report.reportedBy ? <Link href={'/admin/users/' + (report.reportedBy?.slug || report.reportedBy?.username)}>{report.reportedBy?.username}</Link> : <p>{report.reportedBy?.fullname || report.reportedBy?.username}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>No reports found.</p>
          )}
        </div>

      </div>
    </>
  );
};

export default AdminQuestionDetailPage;
