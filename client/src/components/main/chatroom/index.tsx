import useChatroom from '../../../hooks/useChatroom';
import './index.css';
import MessageComponent from './message';

/**
 * Chatroom component displays a list of chat messages in real-time and provides an input for users to add new messages.
 * It also manages loading and error states when fetching messages from the server.
 */
const Chatroom = () => {
  const {
    messages,
    newMessageContent,
    setNewMessageContent,
    sendMessage,
    loading,
    error,
    currentUser,
  } = useChatroom();

  if (loading) {
    return <p>Loading messages...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  /*
   * Function to handle sending the message with Enter key
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className='chatroom'>
      <h2>Let&apos;s chat!</h2>
      <div className='input-area'>
        <input
          type='text'
          value={newMessageContent}
          onChange={e => setNewMessageContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Type a message...'
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div className='messages'>
        {messages.map((msg, index) => (
          <MessageComponent key={index} message={msg} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
};

export default Chatroom;
