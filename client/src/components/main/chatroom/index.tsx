import React from 'react';
import useChatroom from '../../../hooks/useChatroom';

const Chatroom = () => {
  const { messages, newMessageContent, setNewMessageContent, sendMessage, loading, error } =
    useChatroom();

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
            <span className='user'>{msg.sentBy.username}</span>: {msg.content}
            <span className='timestamp'>{msg.sentDateTime.toLocaleTimeString()}</span>
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
