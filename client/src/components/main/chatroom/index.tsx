import useChatroom from '../../../hooks/useChatroom';
import './index.css';

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
      <h2>Chatroom</h2>
      {/* TODO need to make CSS file but for now added margin for readability */}
      <div className='input-area' style={{ marginBottom: '1rem' }}>
        <input
          type='text'
          value={newMessageContent}
          onChange={e => setNewMessageContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Type a message...'
          style={{ width: '50%', height: '2.5rem', padding: '0.5rem' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div className='messages'>
        {[...messages].reverse().map((msg, index) => (
          <div key={index} className='message' style={{ marginBottom: '1rem' }}>
            <span className='user'>
              {msg.sentBy && msg.sentBy.username
                ? msg.sentBy.username
                : `${currentUser.username} (me)`}
            </span>
            : {msg.content}
            <div className='timestamp' style={{ marginTop: '0.5rem' }}>
              {new Date(msg.sentDateTime).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatroom;
