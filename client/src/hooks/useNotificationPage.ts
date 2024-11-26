import { useEffect, useState } from 'react';
import { PostNotification, PostNotificationUpdatePayload } from '../types';
import { getUserByUid } from '../services/userService';
import useUserContext from './useUserContext';
import markAsRead from '../services/postNotificationService';

/**
 * Custom hook to manage the state and logic for the notification page.
 *
 * @returns notifications - The user's notification data as a list.
 * @returns error - An error message if fetching the notification data fails.
 */
const useNotificationPage = () => {
  const [notificationsWithStatus, setNotifications] = useState<
    { postNotification: PostNotification; read: boolean }[] | null
  >(null);
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

        // When we load the page, we want to set the notifications with the read status as is.
        // Once we set the notifications, we assume that the user will read every notification
        // on the page, so then we mark all notifications as read.
        if (res) {
          res.postNotifications.forEach(async ({ postNotification, read }) => {
            if (!read && postNotification._id) {
              try {
                await markAsRead(uid, postNotification._id);
              } catch (e) {
                // We don't want to set an error here because we don't want to block the user from
                // viewing their other notifications just because we couldn't mark their notifications as read
              }
            }
          });
        }
      } catch (e) {
        setError(`Error fetching notifications: ${e}`);
      }
    };

    const handleNotificationUpdate = async ({
      notification,
      type,
      forUserUid,
    }: PostNotificationUpdatePayload) => {
      // We mark notifications as read immediately after loading the page, but we don't want to
      // visually mark them as read until the user reloads the page, that way the user can see
      // which ones are unread.
      if (type === 'newNotification') {
        if (notification && forUserUid === uid) {
          setNotifications(prevNotifications =>
            prevNotifications
              ? [...prevNotifications, { postNotification: notification, read: false }]
              : [{ postNotification: notification, read: false }],
          );
        }
      }
    };

    fetchData();
    socket.on('postNotificationUpdate', handleNotificationUpdate);
    return () => {
      socket.off('postNotificationUpdate', handleNotificationUpdate);
    };
  }, [socket, uid]);

  return { notificationsWithStatus, error };
};

export default useNotificationPage;
