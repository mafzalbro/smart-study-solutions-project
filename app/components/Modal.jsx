export default function Modal({ children }) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    );
  }
  