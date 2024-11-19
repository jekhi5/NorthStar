import './index.css';
import { PostNotification } from '../../../types';
import useNotificationPage from '../../../hooks/useNotificationPage';

const makeBold = (test: string) => <strong>{test}</strong>;

/**
 * NotificationPage component allows users to view their individualized notifications.
 */
const NotificationPage = () => {
  const {
    notificationsWithStatus,
    error,
  }: {
    notificationsWithStatus: { postNotification: PostNotification; read: boolean }[] | null;
    error: string | null;
  } = useNotificationPage();

  return (
    <div className='notifications-page'>
      <h2>Notifications</h2>
      {error && <h4>{error}</h4>}
      {!notificationsWithStatus && !error && <h4>Loading...</h4>}
      {!error && notificationsWithStatus && notificationsWithStatus.length === 0 && (
        <h4>No notifications</h4>
      )}
      {!error && notificationsWithStatus && notificationsWithStatus.length > 0 && (
        <ul>
          {notificationsWithStatus
            .slice()
            .reverse()
            .map(({ postNotification, read }, i) => (
              <li
                key={i}
                className={`notification ${!read ? 'unread' : ''}`}
                style={{ border: !read ? '2px solid red' : 'none' }}>
                <hr />
                <h3>{!read ? makeBold(postNotification.title) : postNotification.title}</h3>
                <p>{!read ? makeBold(postNotification.text) : postNotification.text}</p>
                <p>
                  {!read
                    ? makeBold(postNotification.notificationType)
                    : postNotification.notificationType}
                </p>
                <p>
                  From:{' '}
                  {!read
                    ? makeBold(postNotification.fromUser.username)
                    : postNotification.fromUser.username}
                </p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
export default NotificationPage;
