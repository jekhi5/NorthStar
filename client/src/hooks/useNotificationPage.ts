import { useContext, useEffect, useState } from 'react';
import { PostNotification } from '../types';
import getNotificationsByUid from '../services/postNotificationService';
import UserContext from '../contexts/UserContext';

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
        const fetchedNotifications = await getNotificationsByUid(uid);
        if (!fetchedNotifications) {
          setNotifications([]);
          return;
        }
        setNotifications(fetchedNotifications);
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
