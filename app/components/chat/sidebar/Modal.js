import { MdDriveFileRenameOutline, MdOutlineDeleteOutline, MdPictureAsPdf, MdLink } from 'react-icons/md';
// import { TbFileTypePdf } from "react-icons/tb";

import { FiX } from 'react-icons/fi';
import Link from 'next/link';

export default function Modal({ modalVisible, modalRef, modalPosition, handleEdit, handleDelete, setModalVisible, chats, pdfChats, selectedChatSlug, activeTab, deleting }) {
  return modalVisible ? (
    <div className="fixed top-0 left-0 w-full flex items-center justify-center bg-primary bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="bg-secondary dark:bg-accent-700 p-4 rounded-lg shadow-md"
        style={{ top: modalPosition.y / 1.3, left: modalPosition.x * 1.1, position: 'absolute' }}
      >
        <button
          onClick={() => handleEdit({ slug: selectedChatSlug, title: (activeTab === 'chat' ? chats : pdfChats).find(chat => chat.slug === selectedChatSlug)?.title })}
          className="flex items-center w-full text-left p-2 hover:bg-neutral-200 dark:hover:bg-accent-800"
        >
          <MdDriveFileRenameOutline className="mr-2" /> Rename
        </button>
        <button
        disabled={deleting}
          onClick={() => handleDelete(selectedChatSlug)}
          className="flex items-center w-full text-left p-2 hover:bg-neutral-200 dark:hover:bg-accent-800 disabled:text-neutral-700 disabled:dark:text-neutral-400"
        >
          <MdOutlineDeleteOutline className="mr-2" /> {deleting ? 'Deleting...':'Delete'}
        </button>
        {activeTab === 'pdf'  && <Link href={`${pdfChats.find((chat) => chat.slug === selectedChatSlug)?.pdfUrls}`} className="flex items-center w-full text-left p-2 hover:bg-neutral-200 dark:hover:bg-accent-800" target='_blank'><MdLink className="mr-2"/>PDF</Link>}
        
        {/* {console.log(pdfChats.map((chat) => chat.slug === selectedChatSlug)?.pdfUrls)} */}

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
