import './index.css';
import { PostNotification } from '../../../types';
import useNotificationPage from '../../../hooks/useNotificationPage';

/**
 * NotificationPage component allows users to view their individualized notifications.
 */
const NotificationPage = () => {
  const { notifications }: { notifications: PostNotification[] } = useNotificationPage();

  return notifications.map((notification, i) => (
    <div className='notification' key={i}>
      <p>{notification.text}</p>
      <p>{notification.title}</p>
    </div>
  ));
};

export default NotificationPage;
