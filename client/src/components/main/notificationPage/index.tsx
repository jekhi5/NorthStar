import './index.css';
import { PostNotification } from '../../../types';
import useNotificationPage from '../../../hooks/useNotificationPage';

/**
 * NotificationPage component allows users to view their individualized notifications.
 */
const NotificationPage = () => {
  const { notifications }: { notifications: PostNotification[] } = useNotificationPage();

  return (
    <div className='notifications-page'>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <h4>No notifications</h4>
      ) : (
        <ul>
          {notifications.map((notification, i) => (
            <li key={i} className='notification'>
              <hr />
              <p>{notification.title}</p>
              <p>{notification.text}</p>
              <p>{notification.postType}</p>
              <p>{notification.fromUser.username}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
