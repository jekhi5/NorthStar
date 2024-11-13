import { useContext, useEffect, useState } from 'react';
import { PostNotification } from '../types';
import UserContext from '../contexts/UserContext';
import { getUserByUid } from '../services/userService';

/**
 * Custom hook to manage the state and logic for the notification page.
 *
 * @returns notifications - The user's notification data as a list.
 * @returns error - An error message if fetching the notification data fails.
 */
const useNotificationPage = () => {
  const [notifications, setNotifications] = useState<PostNotification[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get user, and subsequently user id
  const context = useContext(UserContext);
  const uid = context?.user?.uid;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!uid) {
        setError('UID not available.');
        return;
      }

      try {
        const fetchedUser = await getUserByUid(uid);

        if (!fetchedUser) {
          setError('User not found.');
          return;
        }

        const userNotifications = fetchedUser.notifications;

        if (!userNotifications) {
          setNotifications([]);
          return;
        }
        setNotifications(userNotifications);
      } catch (err) {
        setNotifications([]);
        setError('Failed to load notifications.');
      }
    };

    fetchNotifications();
  }, [uid]);

  return { notifications, error };
};

export default useNotificationPage;
