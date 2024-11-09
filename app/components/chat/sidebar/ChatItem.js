import Link from 'next/link';
import { FiMoreVertical, FiCheck } from 'react-icons/fi';
import { MdMoreVert } from "react-icons/md";

// import { MdDriveFileRenameOutline, MdOutlineDeleteOutline } from 'react-icons/md';

export default function ChatItem({
  chat,
  chatSlug,
  editingChatSlug,
  newTitle,
  setNewTitle,
  handleUpdate,
  openModal,
  // handleEdit,
  // pdfUrls
}) {
  return (
    <div key={chat.slug} className="relative group">
      {editingChatSlug === chat.slug ? (
        <div className="flex items-center mb-2 outline-accent-500">
          <input
            type="text"
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={() => handleUpdate(chat.slug)}
            onKeyDown={(e) => e.key === 'Enter' && handleUpdate(chat.slug)}
            className="flex-1 p-2 mx-2 mt-1 bg-secondary dark:bg-accent-900 rounded-lg text-neutral-700 dark:text-secondary outline-none focus:ring-2 ring-accent-500"
          />
          <button onClick={() => handleUpdate(chat.slug)} className="p-1 dark:bg-neutral-600 rounded-lg dark:text-secondary">
            <FiCheck />
          </button>
        </div>
      ) : (
        <Link href={`/chat/${chat.slug}`} passHref>
          <span
            title={chat.title}
            className={`block px-4 py-2 mb-2 rounded-lg ${chatSlug === chat.slug ? 'bg-accent-500 dark:bg-accent-700 text-secondary' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-secondary'}`}
          >
            {chat.title.length > 15 ? chat.title.slice(0, 15) + '...' : chat.title}
          </span>
        </Link>
      )}
      {!editingChatSlug && chatSlug === chat.slug && (
        <div className="absolute right-0 top-0 p-2 space-x-2">
          <button onClick={(event) => openModal(event, chat.slug)} className="p-1 rounded-lg text-secondary">
          <MdMoreVert />
          </button>
        </div>
      )}
      {!editingChatSlug && (
        <div className="absolute right-0 top-0 p-2 hidden group-hover:flex space-x-2">
          <button onClick={(event) => openModal(event, chat.slug)} className="p-1 font-bold rounded-lg">
          <MdMoreVert />
          </button>
        </div>
      )}
    </div>
  );
}
