import { ChangeEvent, useState, KeyboardEvent, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { PostNotification, PostNotificationUpdatePayload } from '../types';
import { getUserByUid } from '../services/userService';
import useUserContext from './useUserContext';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to manage the state and logic for a header search input.
 * It handles input changes and triggers a search action on 'Enter' key press.
 *
 * @returns val - the current value of the input.
 * @returns setVal - function to update the value of the input.
 * @returns handleInputChange - function to handle changes in the input field.
 * @returns handleKeyDown - function to handle 'Enter' key press and trigger the search.
 */
const useHeader = () => {
  const navigate = useNavigate();

  const [val, setVal] = useState<string>('');
  const [unreadNotifs, setUnreadNotifs] = useState<number>(0);
  const [notifications, setNotifications] = useState<
    { postNotification: PostNotification; read: boolean }[] | null
  >(null);
  const { setUser } = useLoginContext();
  const notifSound = useMemo(() => new Audio('/bell-audio.wav'), []); // Sound to play whenver user gets a notification, with useMemo to avoid linter error

  // Get user, and subsequently user id
  const { user, socket } = useUserContext();
  const uid = user?.uid;

  useEffect(() => {
    if (notifications) {
      const unread = notifications.filter(({ read }) => !read).length;
      setUnreadNotifs(unread);
    }
  }, [notifications]);

  useEffect(() => {
    /**
     * Function to fetch the question data based on the question ID.
     */
    const fetchData = async () => {
      try {
        const res = await getUserByUid(uid);
        setNotifications(!res ? [] : res.postNotifications);
      } catch (error) {
        // We log the errors here, but we do not throw an error as we do not want to block the
        // user from viewing the site just because the user couldn't be found.
        if (error instanceof Error) {
          // eslint-disable-next-line no-console
          console.error('Error fetching user notifications:', error.message);
        } else {
          // eslint-disable-next-line no-console
          console.error('Error fetching user notifications:', error);
        }
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
          notifSound.play();
          setNotifications(prevNotifications =>
            prevNotifications
              ? [...prevNotifications, { postNotification: notification, read: false }]
              : [{ postNotification: notification, read: false }],
          );
        } else {
          /* empty */
        }
        // If the user has read the notification, we want to update the state to reflect that.
      } else if (type === 'markRead') {
        fetchData();
      }
    };

    fetchData();

    socket.on('postNotificationUpdate', handleNotificationUpdate);

    return () => {
      socket.off('postNotificationUpdate', handleNotificationUpdate);
    };
  }, [uid, socket, notifSound]);

  /**
   * Function to handle changes in the input field.
   *
   * @param e - the event object.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };
  /**
   * Function to handle 'Enter' key press and trigger the search.
   *
   * @param e - the event object.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const searchParams = new URLSearchParams();
      searchParams.set('search', e.currentTarget.value);
      navigate(`/home?${searchParams.toString()}`);
    }
  };

  const handleLogOut = () => {
    Cookies.remove('auth');
    setUser(null);
    navigate('/');
  };

  return {
    val,
    setVal,
    handleInputChange,
    handleKeyDown,
    unreadNotifs,
    handleLogOut,
  };
};

export default useHeader;
