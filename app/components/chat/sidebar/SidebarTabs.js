import { FaHistory, FaFilePdf } from 'react-icons/fa';

export default function SidebarTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex border-b border-neutral-300 text-sm dark:border-neutral-600">
      <button
        onClick={() => setActiveTab('chat')}
        className={`p-2 flex-1 text-center flex items-center justify-center gap-2 transition-colors duration-300 ease-in-out ${
          activeTab === 'chat'
            ? 'text-accent-600  dark:text-accent-400 font-semibold border-b-4 border-accent-600 dark:border-accent-400'
            : 'bg-transparent text-neutral-600 dark:text-secondary'
        }`}
      >
        <FaHistory />
        {/* Chat History */}
        Chat
      </button>
      <button
        onClick={() => setActiveTab('pdf')}
        className={`p-2 flex-1 text-center flex items-center justify-center gap-2 transition-colors duration-300 ease-in-out ${
          activeTab === 'pdf'
            ? 'text-accent-600 dark:text-accent-400 font-semibold border-b-4 border-accent-600 dark:border-accent-400'
            : 'bg-transparent text-neutral-600 dark:text-secondary'
        }`}
      >
        <FaFilePdf />
        PDF Logs
      </button>
    </div>
  );
}
