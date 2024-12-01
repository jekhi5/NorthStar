import { useCallback, useEffect, useState } from 'react';
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

  const markNotifAsRead = useCallback(
    async (postNotification: PostNotification, read: boolean) => {
      if (!read && postNotification._id) {
        try {
          await markAsRead(uid, postNotification._id);
        } catch (e) {
          // We don't want to set an error here because we don't want to block the user from
          // viewing their other notifications just because we couldn't mark their notifications as read
        }
      }
    },
    [uid],
  );

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

        // When we load the page, we want to mark the notifications that aren't associated
        // with a question (like the welcome notification) as read, because the user isn't
        // going to click on them. All other notifications will be marked as read when the
        // user clicks on it
        if (res) {
          res.postNotifications.forEach(async ({ postNotification, read }) => {
            if (!postNotification.questionId && !read && postNotification._id) {
              await markNotifAsRead(postNotification, read);
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
  }, [markNotifAsRead, socket, uid]);

  return { notificationsWithStatus, error, markNotifAsRead };
};

export default useNotificationPage;
