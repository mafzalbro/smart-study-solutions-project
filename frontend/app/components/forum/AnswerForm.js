import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { fetcher } from '@/app/utils/fetcher';
import ReactQuill from 'react-quill';
import AlertMessage from '@/app/components/AlertMessage';

const AnswerForm = ({ questionSlug, onSuccess, onClose }) => {
  const [editorHtml, setEditorHtml] = useState('');
  const [alertMessage, setAlertMessage] = useState({ message: '', type: 'info' });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/qna/question/${questionSlug}/answer`,
        'POST',
        { answerText: editorHtml }
      );
      setAlertMessage({ message: 'Question answered successfully', type: 'success' });
      setEditorHtml(''); // Reset editor content
      onSuccess && onSuccess(data);
      onClose && onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error submitting answer:', error);
      setAlertMessage({ message: error.message || 'Failed to answer question', type: 'error' });
    }
  };

  const handleAlertClose = () => {
    setAlertMessage({ message: '', type: 'info' });
  };

  return (
    <div className="text-center w-full">
      {alertMessage.message && (
        <AlertMessage
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={handleAlertClose}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="editor-container border bg-white border-orange-300 rounded-lg overflow-auto h-[50vh]">
          <ReactQuill
            theme='snow'
            value={editorHtml}
            onChange={setEditorHtml}
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean'],
                [{ 'align': [] }],
              ],
            }}
            placeholder="Type your answer here..."
          />
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-orange-600 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-orange-700"
          >
            Submit Answer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
