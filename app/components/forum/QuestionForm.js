import { useState, useEffect } from 'react';
import { fetcher } from '@/app/utils/fetcher';
import AlertMessage from '@/app/components/AlertMessage';
import TextInputField from '@/app/components/TextInputField';
import TextAreaField from '@/app/components/TextAreaField';
import WhiteContainer from '../WhiteContainer';

const QuestionForm = ({ onSuccess, onClose }) => {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState('');
  const [alertMessage, setAlertMessage] = useState({ message: '', type: 'info' });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/categories`);
        setCategories(data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim());

    try {
      await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/submit`,
        'POST',
        { question, description, category, tags: tagsArray }
      );

      setQuestion('');
      setDescription('');
      setTags('');
      setAlertMessage({ message: 'Question submitted successfully!', type: 'success' });

      if (onSuccess) onSuccess();
    } catch (error) {
      setAlertMessage({ message: error.message || 'Failed to submit question', type: 'error' });
    }
  };

  const handleAlertClose = () => {
    setAlertMessage({ message: '', type: 'info' });
  };

  return (
    <WhiteContainer>
      {alertMessage.message && (
        <AlertMessage
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={handleAlertClose}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-6 p-6 w-full">
        <TextInputField
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          label="Question"
          required
        />
        <TextAreaField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide more details about your question"
          label="Description"
          rows={4}
        />
        <div>
          <label className="block text-secondary font-bold mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border dark:text-secondary dark:bg-neutral-800 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600"
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <TextInputField
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Comma-separated tags here"
          label="Tags"
        />
        <button
          type="submit"
          className="block w-full py-2 px-4 bg-accent-500 text-white font-semibold rounded-lg shadow-sm hover:bg-accent-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </WhiteContainer>
  );
};

export default QuestionForm;
