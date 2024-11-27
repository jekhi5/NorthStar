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
  fromUser?: User;
  postId?: string;
}) {
  const notificationInfo = (
    <div className='post-notification'>
      <h3>{title}</h3>
      <p>{text}</p>
      {fromUser ? <p className='from-user'> From: {fromUser.username}</p> : null}
    </div>
  );

  return postId ? (
    <NavLink to={`/question/${postId}`} className='linked-notif'>
      {notificationInfo}
    </NavLink>
  ) : (
    notificationInfo
  );
}
