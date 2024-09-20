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
  setChatPage,
  setPdfPage,
  chatPage,
  pdfPage,
  totalChats,
  totalPDFs
}) {

  // Determine the list to show based on the active tab
  const items = activeTab === 'chat' ? chats : pdfChats;
  const emptyMessage = activeTab === 'chat' ? 'No chats available' : 'No PDF chats available';
  const hasMoreItems = activeTab === 'chat' ? chats.length < totalChats : pdfChats.length < totalPDFs;

  const handleLoadMore = () => {
    if (activeTab === 'chat') {
      setChatPage(chatPage + 1);
    } else {
      setPdfPage(pdfPage + 1);
    }
  };

  return (
    <>
      <div className="sidebar-chat-list overflow-y-auto h-1/2">
        {items.map((chat) => (
          <ChatItem
            key={chat.slug}
            pdfUrls={chat.pdfUrls}
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
      {hasMoreItems && !loading && (
        <button onClick={handleLoadMore} className="justify-center inline-flex text-accent-400">
          <MdOutlineKeyboardArrowDown size={30} />
        </button>
      )}
    </>
  );
}
