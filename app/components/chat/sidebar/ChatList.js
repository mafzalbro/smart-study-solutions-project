import ChatItem from './ChatItem';
import Loader from '@/app/components/Spinner';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

export default function ChatList({
  chats,
  pdfChats,
  activeTab,
  chatSlug,
  editingChatSlug,
  newTitle,
  setNewTitle,
  handleUpdate,
  openModal,
  handleEdit,
  handleDelete,
  loading,
  setPage,
  page,
  totalResults
}) {

    // Determine the list to show based on the active tab
  const items = activeTab === 'chat' ? chats : pdfChats;
  const emptyMessage = activeTab === 'chat' ? 'No chats available' : 'No PDF chats available';

  return (
    <>
      <div className="sidebar flex-1 overflow-y-auto">
        {(activeTab === 'chat' ? chats : pdfChats).map((chat) => (
          <ChatItem
            key={chat.slug}
            chat={chat}
            chatSlug={chatSlug}
            editingChatSlug={editingChatSlug}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            handleUpdate={handleUpdate}
            openModal={openModal}
            handleEdit={handleEdit}
          />
        ))}
      </div>
      {loading && <Loader />}
      {!loading && items.length === 0 && <p>{emptyMessage}</p>}
      {(activeTab === 'chat' ? chats.length : pdfChats.length) < totalResults && (
        <button onClick={() => setPage(page + 1)} className="justify-center inline-flex">
          <MdOutlineKeyboardArrowDown size={30} color='white' />
        </button>
      )}
    </>
  );
}
