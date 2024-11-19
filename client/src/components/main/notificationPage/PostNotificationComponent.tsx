import { User } from '../../../types';
import './PostNotificationComponent.css';

export default function PostNotificationComponent({
  title,
  text,
  fromUser,
}: {
  title: string;
  text: string;
  fromUser: User;
}) {
  return (
    <div className='post-notification'>
      <h3>{title}</h3>
      <p>{text}</p>
      <p className='from-user'>From: {fromUser.username}</p>
    </div>
  );
}
