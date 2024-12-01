import { NavLink } from 'react-router-dom';
import { Message, User } from '../../../../types';
import './index.css';
import defaultProfilePic from '../../../../images/default-profile-pic.png';

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
    <div className={`message ${isCurrentUser ? 'current-user' : ''}`}>
      <div className='profile-group'>
        <img
          src={message.sentBy?.profilePicture || defaultProfilePic}
          alt={`${message.sentBy?.username}'s profile`}
          className='profile-photo'
        />
        <NavLink to={`/profile/${message.sentBy?.username}`} className='username'>
          {isCurrentUser ? currentUser.username : message.sentBy?.username}
        </NavLink>
      </div>

      <div className='message-content'>
        <p>{message.content}</p>
        <div className='timestamp'>
          {new Date(message.sentDateTime).toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
