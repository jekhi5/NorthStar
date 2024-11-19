import { User } from '../types';
import api from './config';

const NOTIFICATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/postNotification`;

/**
 * Marks a notification as read in the user.
 *
 * @param user - The user object containing the notification.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const markAsRead = async (uid: string, postNotificationId: string): Promise<User> => {
  const req = { uid, postNotificationId };
  const res = await api.put(`${NOTIFICATION_API_URL}/markAsRead`, req);
  if (res.status !== 200) {
    throw new Error('Error while marking notification as read.');
  }
  return res.data;
};

export default markAsRead;
