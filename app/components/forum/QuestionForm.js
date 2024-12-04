import { useState, useEffect } from "react";
import { useRouter } from "next-nprogress-bar";
import { toast } from "react-toastify";
import { fetcher } from "@/app/utils/fetcher";
import TextInputField from "@/app/components/TextInputField";
import TextAreaField from "@/app/components/TextAreaField";
import WhiteContainer from "../WhiteContainer";
import { useAuth } from "@/app/customHooks/AuthContext";
import { AiFillLock } from "react-icons/ai";

const QuestionForm = ({ onSuccess, onClose }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/categories`
        );
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = tags.split(",").map((tag) => tag.trim());

    setIsSubmitting(true); // Disable form elements during submission

    try {
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/submit`,
        "POST",
        { question, category, tags: tagsArray }
      );

      toast.success("Question submitted successfully!");

      // Navigate to the newly created question's page
      router.push(`/forum/${data.newQuestion.slug}`);

      setQuestion("");
      setDescription("");
      setTags("");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message || "Failed to submit question");
    } finally {
      setIsSubmitting(false); // Re-enable form elements after submission
    }
  };
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-8 px-4 text-center">
        <div className="bg-accent-100 dark:bg-accent-600 p-6 rounded-lg shadow-lg w-full max-w-md">
          <AiFillLock className="text-5xl text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-accent-900 dark:text-accent-100 mb-2">
            Please Log In to Submit Your Question
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You need to log in to submit questions or participate in the forum.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="py-2 px-6 bg-accent-500 text-white font-semibold rounded-lg shadow-md hover:bg-accent-700 transition-all duration-300"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <WhiteContainer>
      <form onSubmit={handleSubmit} className="space-y-6 p-6 w-full">
        <TextInputField
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          label="Question"
          required
        />
        {/* <TextAreaField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide more details about your question"
          label="Description"
          rows={4}
        /> */}
        <div>
          <label className="block text-secondary font-bold mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border dark:text-secondary dark:bg-neutral-800 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <TextInputField
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Comma-separated tags here"
          label="Tags (Optional)"
        />
        <button
          type="submit"
          disabled={isSubmitting || question === "" || category === ""}
          className={`block w-full py-2 px-4 bg-accent-500 text-white font-semibold rounded-lg shadow-sm hover:bg-accent-700 disabled:hover:bg-accent-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </WhiteContainer>
  );
};

export default QuestionForm;
