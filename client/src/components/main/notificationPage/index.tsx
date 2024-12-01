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
      <h2 className='page-title'>Notifications</h2>
      <div className='notifications-content'>
        {error && <p className='error-message'>{error}</p>}
        {!notificationsWithStatus && !error && <p className='loading-message'>Loading...</p>}
        {!error && notificationsWithStatus && notificationsWithStatus.length === 0 && (
          <p className='empty-message'>No notifications</p>
        )}
        {!error && notificationsWithStatus && notificationsWithStatus.length > 0 && (
          <ul className='notifications-list'>
            {notificationsWithStatus
              .slice()
              .reverse()
              .map(({ postNotification, read }, i) => (
                <li key={i} className={`notification-item ${read ? 'read' : 'unread'}`}>
                  <PostNotificationComponent
                    title={postNotification.title}
                    text={postNotification.text}
                    fromUser={postNotification.fromUser}
                    questionId={postNotification.questionId}
                  />
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
