import useChatroom from '../../../hooks/useChatroom';

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

  return (
    <div className='chatroom'>
      <h2>Chatroom</h2>
      <div className='messages'>
        {messages.map((msg, index) => (
          <div key={index} className='message'>
            <span className='user'>
              {msg.sentBy && msg.sentBy.username
                ? msg.sentBy.username
                : `${currentUser.username} (me)`}
            </span>
            : {msg.content}
            <span className='timestamp'>{new Date(msg.sentDateTime).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className='input-area'>
        <input
          type='text'
          value={newMessageContent}
          onChange={e => setNewMessageContent(e.target.value)}
          placeholder='Type a message...'
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatroom;
