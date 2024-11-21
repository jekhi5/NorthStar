import { Message, User } from '../../../../types';

interface MessageProps {
  message: Message;
  currentUser: User;
}

const MessageComponent = ({ message, currentUser }: MessageProps) => {
  const isCurrentUser = message.sentBy?.uid === currentUser.uid;

  return (
    <div className='message'>
      <span className='user'>
        {isCurrentUser ? `${currentUser.username} (me)` : message.sentBy.username}
      </span>
      : {message.content}
      <div className='timestamp'>
        {new Date(message.sentDateTime).toLocaleString('en-US', {
          weekday: 'short', // Mon
          year: 'numeric', // 2024
          month: 'short', // Nov
          day: 'numeric', // 18
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </div>
    </div>
  );
};

export default MessageComponent;
