import { useState, useEffect } from 'react';
import { fetcher } from '@/app/utils/fetcher';
import AlertMessage from '@/app/components/AlertMessage';

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
        setCategories(data.data); // Assuming data.data contains the array of categories
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
    <div>
      {alertMessage.message && (
        <AlertMessage
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={handleAlertClose}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md w-full">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 border border-gray-100 outline-orange-600 rounded-lg"
            placeholder="Enter your question"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="max-h-52 min-h-40 w-full p-2 border border-gray-100 outline-orange-600 rounded-lg"
            placeholder="Provide more details about your question"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-100 outline-orange-600 rounded-lg"
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border border-gray-100 outline-orange-600 rounded-lg"
            placeholder="Comma-separated tags here"
          />
        </div>
        <button
          type="submit"
          className="block w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;
