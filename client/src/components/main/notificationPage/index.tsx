import './index.css';
import { PostNotification } from '../../../types';
import useNotificationPage from '../../../hooks/useNotificationPage';

/**
 * NotificationPage component allows users to view their individualized notifications.
 */
const NotificationPage = () => {
  const {
    notifications,
    error,
  }: { notifications: PostNotification[] | null; error: string | null } = useNotificationPage();

  return (
    <div className='notifications-page'>
      <h2>Notifications</h2>
      {error && <h4>{error}</h4>}
      {!notifications && !error && <h4>Loading...</h4>}
      {!error && notifications && notifications.length === 0 && <h4>No notifications</h4>}
      {!error && notifications && notifications.length > 0 && (
        <ul>
          {notifications.map((notification, i) => (
            <li key={i} className='notification'>
              <hr />
              <h3>{notification.title}</h3>
              <p>{notification.text}</p>
              <p>{notification.postType}</p>
              <p>From: {notification.fromUser.username}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
