import { NavLink } from 'react-router-dom';
import { User } from '../../../types';
import './PostNotificationComponent.css';

export default function PostNotificationComponent({
  title,
  text,
  fromUser,
}: {
  title: string;
  text: string;
  fromUser?: User;
}) {
  return (
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
}
