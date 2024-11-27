import { NavLink } from 'react-router-dom';
import { User } from '../../../types';
import './PostNotificationComponent.css';

export default function PostNotificationComponent({
  title,
  text,
  fromUser,
  questionId,
}: {
  title: string;
  text: string;
  fromUser?: User;
  questionId?: string;
}) {
  // If the notification is for a post, it will be clickable and redirect to the
  // question that this post belongs to (or the question itself if it is one)
  const notificationInfo = (
    <div className='post-notification'>
      <h3>{title}</h3>
      <p>{text}</p>
      {fromUser ? <p className='from-user'> From: {fromUser.username}</p> : null}
    </div>
  );

  return questionId ? (
    <NavLink to={`/question/${questionId}`} className='linked-notif'>
      {notificationInfo}
    </NavLink>
  ) : (
    notificationInfo
  );
}
