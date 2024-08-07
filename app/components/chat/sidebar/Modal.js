import { MdDriveFileRenameOutline, MdOutlineDeleteOutline } from 'react-icons/md';
import { FiX } from 'react-icons/fi';

export default function Modal({ modalVisible, modalRef, modalPosition, handleEdit, handleDelete, setModalVisible, chats, pdfChats, selectedChatSlug, activeTab }) {
  return modalVisible ? (
    <div className="fixed top-0 left-0 w-full flex items-center justify-center bg-primary bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="bg-secondary dark:bg-accent-700 p-4 rounded-lg shadow-md"
        style={{ top: modalPosition.y, left: modalPosition.x, position: 'absolute' }}
      >
        <button
          onClick={() => handleEdit({ slug: selectedChatSlug, title: (activeTab === 'chat' ? chats : pdfChats).find(chat => chat.slug === selectedChatSlug)?.title })}
          className="flex items-center w-full text-left p-2 hover:bg-neutral-200 dark:hover:bg-accent-800"
        >
          <MdDriveFileRenameOutline className="mr-2" /> Rename
        </button>
        <button
          onClick={() => handleDelete(selectedChatSlug)}
          className="flex items-center w-full text-left p-2 hover:bg-neutral-200 dark:hover:bg-accent-800"
        >
          <MdOutlineDeleteOutline className="mr-2" /> Delete
        </button>
        <button
          onClick={() => setModalVisible(false)}
          className="flex items-center w-full text-left p-2 hover:bg-neutral-200 dark:hover:bg-accent-800"
        >
          <FiX className="mr-2" /> Cancel
        </button>
      </div>
    </div>
  ) : null;
}
