import { NavLink } from 'react-router-dom';
import { User } from '../../../types';
import './PostNotificationComponent.css';

export default function PostNotificationComponent({
  title,
  text,
  fromUser,
  postId,
}: {
  title: string;
  text: string;
  fromUser: User;
  postId: string;
}) {
  return (
    <NavLink to={`/question/${postId}`} className='linked-notif'>
      <div className='post-notification'>
        <h3>{title}</h3>
        <p>{text}</p>
        <p className='from-user'> From: {fromUser?.username || 'Unknown User'}</p>
      </div>
    </NavLink>
  );
}
