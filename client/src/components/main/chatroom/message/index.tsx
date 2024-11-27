import { NavLink } from 'react-router-dom';
import { Message, User } from '../../../../types';
import './index.css';

/**
 * Parameters for Message component, which takes in the message and user information.
 */
interface MessageProps {
  message: Message;
  currentUser: User;
}

/**
 * Message component represents each individual message in the chatroom.
 * It displays the username, message, and timestamp, altering the username
 * based on whether or not the current user sent the message.
 */
const MessageComponent = ({ message, currentUser }: MessageProps) => {
  const isCurrentUser = message.sentBy?.uid === currentUser.uid;

  return (
    <div className='message'>
      <NavLink to={`/profile/${message.sentBy?.uid}`} className='user'>
        <span>{isCurrentUser ? `${currentUser.username} (me)` : message.sentBy.username}</span>
      </NavLink>
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
