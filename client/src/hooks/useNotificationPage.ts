import { useEffect, useState } from 'react';
import { PostNotification, PostNotificationUpdatePayload } from '../types';
import { getUserByUid } from '../services/userService';
import useUserContext from './useUserContext';

/**
 * Custom hook to manage the state and logic for the notification page.
 *
 * @returns notifications - The user's notification data as a list.
 * @returns error - An error message if fetching the notification data fails.
 */
const useNotificationPage = () => {
  const [notifications, setNotifications] = useState<PostNotification[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get user, and subsequently user id
  const { user, socket } = useUserContext();
  const uid = user?.uid;

  useEffect(() => {
    /**
     * Function to fetch the question data based on the question ID.
     */
    const fetchData = async () => {
      if (!uid) {
        setError('User is undefined');
        return;
      }

      try {
        const res = await getUserByUid(uid);
        setNotifications(!res ? [] : res.postNotifications);
      } catch (e) {
        setError(`Error fetching notifications: ${e}`);
      }
    };

    const handleNotificationUpdate = async ({ notification }: PostNotificationUpdatePayload) => {
      if (!uid) {
        setError('UID is undefined');
        return;
      }

      setNotifications(notifications ? [...notifications, notification] : [notification]);
    };

    fetchData();

    socket.on('postNotificationUpdate', handleNotificationUpdate);

    return () => {
      socket.off('postNotificationUpdate', handleNotificationUpdate);
    };
  }, [notifications, socket, uid]);

  return { notifications, error };
};

export default useNotificationPage;
