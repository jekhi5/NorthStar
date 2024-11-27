import './index.css';
import { PostNotification } from '../../../types';
import useNotificationPage from '../../../hooks/useNotificationPage';
import PostNotificationComponent from './PostNotificationComponent';

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
        <ul className='notifications-list'>
          {notificationsWithStatus
            .slice()
            .reverse()
            .map(({ postNotification, read }, i) => (
              <li key={i} className='notification'>
                <PostNotificationComponent
                  title={postNotification.title}
                  text={postNotification.text}
                  fromUser={postNotification.fromUser}
                  postId={postNotification.postId}
                />
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
export default NotificationPage;
