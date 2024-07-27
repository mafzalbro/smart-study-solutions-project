export default function AnswerModal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#FFDECC] p-8 w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/3 h-3/4 md:h-3/3 lg:h-2/2 rounded-lg shadow-lg flex justify-center items-center overflow-auto">
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="m-10 text-gray-300 hover:text-gray-600 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 inline-block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
