export default function Modal({ children, className }) {
  return (
    <div
      className={`fixed left-0 inset-0 w-screen bg-gray-800 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
    >
      <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-lg">{children}</div>
    </div>
  );
}
