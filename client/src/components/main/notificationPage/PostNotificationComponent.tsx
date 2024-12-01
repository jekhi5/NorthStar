import { NavLink } from 'react-router-dom';
import { User } from '../../../types';
import './PostNotificationComponent.css';

export default function PostNotificationComponent({
  title,
  text,
  fromUser,
  questionId,
  markNotifAsRead,
}: {
  title: string;
  text: string;
  fromUser?: User;
  questionId?: string;
  markNotifAsRead: () => Promise<void>;
}) {
  // If the notification is for a post, it will be clickable and redirect to the
  // question that this post belongs to (or the question itself if it is one)
  const notificationInfo = (
    <div className='post-notification'>
      <h3>{title}</h3>
      <p>{text}</p>
      {fromUser ? (
        <p className='from-user'>
          From: <NavLink to={`/profile/${fromUser.username}`}>{fromUser.username}</NavLink>
        </p>
      ) : null}
    </div>
  );

  return questionId ? (
    <NavLink to={`/question/${questionId}`} className='linked-notif' onClick={markNotifAsRead}>
      {notificationInfo}
    </NavLink>
  ) : (
    notificationInfo
  );
}
